
import React from 'react';
import { TranslationStrings, Language, AspectRatio, ImageSize } from './types';

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    title: "Banana Pro Designer",
    placeholder: "Analyze image or describe your vision...",
    generate: "Generate Pro",
    explore: "Explore",
    myCreations: "My Creations",
    canvas: "Canvas",
    batch: "Batch",
    characters: "Characters",
    upgrade: "Upgrade",
    language: "العربية",
    aspectRatio: "Aspect Ratio",
    imageSize: "Image Size",
    style: "Style",
    color: "Color",
    animate: "Animate",
    edit: "Edit",
    loadingVideo: "Crafting your cinematic masterpiece...",
    loadingImage: "Banana Pro is analyzing and generating...",
    selectApiKey: "Select API Key",
    videoNotice: "Video generation may take a few minutes. Please stay tuned!",
    errorApiKey: "Requested entity not found. Please re-select your API key.",
    uploadImage: "Upload reference for Banana Pro",
    removeImage: "Remove reference"
  },
  ar: {
    title: "بنانا برو المصمم الذكي",
    placeholder: "حلل الصورة أو صف رؤيتك...",
    generate: "توليد احترافي",
    explore: "استكشاف",
    myCreations: "ابتكاراتي",
    canvas: "اللوحة",
    batch: "المهام المتعددة",
    characters: "الشخصيات",
    upgrade: "ترقية",
    language: "English",
    aspectRatio: "نسبة العرض",
    imageSize: "حجم الصورة",
    style: "النمط",
    color: "اللون",
    animate: "تحريك",
    edit: "تعديل",
    loadingVideo: "نصنع لك تحفة سينمائية...",
    loadingImage: "بنانا برو يقوم بالتحليل والتوليد...",
    selectApiKey: "اختر مفتاح API",
    videoNotice: "توليد الفيديو قد يستغرق بضع دقائق. يرجى الانتظار!",
    errorApiKey: "لم يتم العثور على المفتاح. يرجى إعادة اختيار مفتاح API.",
    uploadImage: "ارفع مرجع لـ بنانا برو",
    removeImage: "إزالة المرجع"
  }
};

export const ASPECT_RATIOS: AspectRatio[] = ['1:1', '3:4', '4:3', '9:16', '16:9'];
export const IMAGE_SIZES: ImageSize[] = ['1K', '2K', '4K'];

export const CATEGORIES = [
  { id: 'all', en: 'All', ar: 'الكل' },
  { id: 'people', en: 'People', ar: 'أشخاص' },
  { id: 'product', en: 'Product', ar: 'منتجات' },
  { id: 'nature', en: 'Nature', ar: 'طبيعة' },
  { id: 'poster', en: 'Poster', ar: 'ملصق' },
  { id: 'logo', en: 'Logo', ar: 'شعار' },
  { id: 'fashion', en: 'Fashion', ar: 'أزياء' },
];
