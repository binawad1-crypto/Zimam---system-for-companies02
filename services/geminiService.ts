
import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

export class GeminiService {
  private static async checkAndRequestKey() {
    // @ts-ignore
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      // Assume success after triggering the dialog as per guidelines
    }
  }

  static async generateImage(prompt: string, aspectRatio: AspectRatio, size: ImageSize, imageUri?: string): Promise<string> {
    // Ensure we have a key for the Pro model
    await this.checkAndRequestKey();
    
    // Always create a fresh instance for the latest API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      // Using 'gemini-3-pro-image-preview' (Banana Pro) for high-quality and image analysis as requested
      const modelName = 'gemini-3-pro-image-preview';
      
      const parts: any[] = [{ text: prompt }];
      
      if (imageUri) {
        const mimeType = imageUri.split(';')[0].split(':')[1];
        const base64Data = imageUri.split(',')[1];
        // For Image-to-Image / Recognition: image part is provided alongside text
        parts.unshift({
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        });
      }

      const response = await ai.models.generateContent({
        model: modelName,
        contents: {
          parts: parts,
        },
        config: {
          imageConfig: {
            aspectRatio,
            imageSize: size
          }
        },
      });

      // Find the image part in the response
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
      throw new Error("No image data received from the Banana Pro model");
    } catch (error: any) {
      if (error.message?.includes("Requested entity was not found")) {
        // Reset and prompt for key again if error occurs
        // @ts-ignore
        await window.aistudio.openSelectKey();
        throw new Error("API Key issue. Please select a valid paid project API key.");
      }
      throw error;
    }
  }

  static async editImage(originalBase64: string, prompt: string): Promise<string> {
    await this.checkAndRequestKey();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const mimeType = originalBase64.split(';')[0].split(':')[1];
    const base64Data = originalBase64.split(',')[1];

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview', // Upgrade editing to Pro as well
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("Failed to edit image with Banana Pro");
  }

  static async generateVideo(imageUri: string, prompt?: string, aspectRatio: AspectRatio = '16:9'): Promise<string> {
    await this.checkAndRequestKey();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const mimeType = imageUri.split(';')[0].split(':')[1];
    const base64Data = imageUri.split(',')[1];

    let operation = await ai.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Smooth cinematic movement',
      image: {
        imageBytes: base64Data,
        mimeType: mimeType,
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: aspectRatio as any
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
