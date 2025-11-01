import type { Template } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => PlaceHolderImages.find(img => img.id === id);

// This data is now only used for seeding the database if needed, not directly in the app.
export const TEMPLATES: Template[] = [
  {
    id: 'template1',
    name: 'Corporate Presentation',
    thumbnailUrl: findImage('template1')?.imageUrl || '',
    thumbnailHint: findImage('template1')?.imageHint || '',
    layers: [
      {
        id: 'layer1_1',
        name: 'Main Title',
        type: 'text',
        properties: {
          content: { value: 'Company Growth', type: 'text', label: 'Content' },
          fontSize: { value: 64, type: 'slider', label: 'Font Size', options: { min: 12, max: 128 } },
          color: { value: '#ffffff', type: 'color', label: 'Color' },
        },
      },
      {
        id: 'layer1_2',
        name: 'Subtitle',
        type: 'text',
        properties: {
          content: { value: 'Q3 2024 Report', type: 'text', label: 'Content' },
          fontSize: { value: 24, type: 'slider', label: 'Font Size', options: { min: 10, max: 72 } },
          color: { value: '#e0e0e0', type: 'color', label: 'Color' },
        },
      },
      {
        id: 'layer1_3',
        name: 'Background Image',
        type: 'image',
        properties: {
          source: { value: findImage('canvas_image_1')?.imageUrl || '', type: 'text', label: 'Image URL' },
          opacity: { value: 80, type: 'slider', label: 'Opacity', options: { min: 0, max: 100 } },
        },
      },
    ],
  },
  {
    id: 'template2',
    name: 'Social Media Story',
    thumbnailUrl: findImage('template2')?.imageUrl || '',
    thumbnailHint: findImage('template2')?.imageHint || '',
    layers: [
       {
        id: 'layer2_1',
        name: 'Headline',
        type: 'text',
        properties: {
          content: { value: 'New Arrival!', type: 'text', label: 'Content' },
          fontSize: { value: 48, type: 'slider', label: 'Font Size', options: { min: 12, max: 96 } },
          color: { value: '#333333', type: 'color', label: 'Color' },
        },
      },
    ],
  },
  {
    id: 'template3',
    name: 'Action Trailer',
    thumbnailUrl: findImage('template3')?.imageUrl || '',
    thumbnailHint: findImage('template3')?.imageHint || '',
    layers: [],
  },
  {
    id: 'template4',
    name: 'Wedding Album',
    thumbnailUrl: findImage('template4')?.imageUrl || '',
    thumbnailHint: findImage('template4')?.imageHint || '',
    layers: [],
  },
];
