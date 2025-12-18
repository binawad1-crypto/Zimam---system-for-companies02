
export type Language = 'en' | 'ar';

export type AspectRatio = '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
export type ImageSize = '1K' | '2K' | '4K';

export enum GenerationType {
  IMAGE = 'IMAGE',
  EDIT = 'EDIT',
  VIDEO = 'VIDEO'
}

export interface GeneratedMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  prompt: string;
  timestamp: number;
  metadata?: {
    aspectRatio?: AspectRatio;
    size?: ImageSize;
    parentImageId?: string;
  };
}

export interface TranslationStrings {
  title: string;
  placeholder: string;
  generate: string;
  explore: string;
  myCreations: string;
  canvas: string;
  batch: string;
  characters: string;
  upgrade: string;
  language: string;
  aspectRatio: string;
  imageSize: string;
  style: string;
  color: string;
  animate: string;
  edit: string;
  loadingVideo: string;
  loadingImage: string;
  selectApiKey: string;
  videoNotice: string;
  errorApiKey: string;
  uploadImage: string;
  removeImage: string;
}
