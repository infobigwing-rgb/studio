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
          fontFamily: { value: 'Inter', type: 'select', label: 'Font Family', options: { items: [ {value: 'Inter', label: 'Inter'}, {value: 'Arial', label: 'Arial'}, {value: 'Helvetica', label: 'Helvetica'}, {value: 'Georgia', label: 'Georgia'} ]} },
          fontSize: { value: 64, type: 'slider', label: 'Font Size', options: { min: 8, max: 128 } },
          color: { value: '#ffffff', type: 'color', label: 'Color' },
          textAlign: { value: 'center', type: 'toggle-group', label: 'Text Align', options: { items: [{value: 'left', label: 'Left'}, {value: 'center', label: 'Center'}, {value: 'right', label: 'Right'}]} },
          opacity: { value: 100, type: 'slider', label: 'Opacity', options: { min: 0, max: 100 } },
          x: { value: 50, type: 'slider', label: 'Position X (%)', options: { min: 0, max: 100 } },
          y: { value: 40, type: 'slider', label: 'Position Y (%)', options: { min: 0, max: 100 } },
        },
      },
      {
        id: 'layer1_2',
        name: 'Subtitle',
        type: 'text',
        properties: {
          content: { value: 'Q3 2024 Report', type: 'text', label: 'Content' },
          fontFamily: { value: 'Inter', type: 'select', label: 'Font Family', options: { items: [ {value: 'Inter', label: 'Inter'}, {value: 'Arial', label: 'Arial'}, {value: 'Helvetica', label: 'Helvetica'}, {value: 'Georgia', label: 'Georgia'} ]} },
          fontSize: { value: 24, type: 'slider', label: 'Font Size', options: { min: 8, max: 72 } },
          color: { value: '#e0e0e0', type: 'color', label: 'Color' },
          textAlign: { value: 'center', type: 'toggle-group', label: 'Text Align', options: { items: [{value: 'left', label: 'Left'}, {value: 'center', label: 'Center'}, {value: 'right', label: 'Right'}]} },
          opacity: { value: 90, type: 'slider', label: 'Opacity', options: { min: 0, max: 100 } },
          x: { value: 50, type: 'slider', label: 'Position X (%)', options: { min: 0, max: 100 } },
          y: { value: 60, type: 'slider', label: 'Position Y (%)', options: { min: 0, max: 100 } },
        },
      },
      {
        id: 'layer1_3',
        name: 'Background Image',
        type: 'image',
        properties: {
          source: { value: findImage('canvas_image_1')?.imageUrl || '', type: 'file', label: 'Source' },
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
          fontFamily: { value: 'Helvetica', type: 'select', label: 'Font Family', options: { items: [ {value: 'Inter', label: 'Inter'}, {value: 'Arial', label: 'Arial'}, {value: 'Helvetica', label: 'Helvetica'}, {value: 'Georgia', label: 'Georgia'} ]} },
          fontSize: { value: 48, type: 'slider', label: 'Font Size', options: { min: 12, max: 96 } },
          color: { value: '#333333', type: 'color', label: 'Color' },
          textAlign: { value: 'center', type: 'toggle-group', label: 'Text Align', options: { items: [{value: 'left', label: 'Left'}, {value: 'center', label: 'Center'}, {value: 'right', label: 'Right'}]} },
          opacity: { value: 100, type: 'slider', label: 'Opacity', options: { min: 0, max: 100 } },
          x: { value: 50, type: 'slider', label: 'Position X (%)', options: { min: 0, max: 100 } },
          y: { value: 50, type: 'slider', label: 'Position Y (%)', options: { min: 0, max: 100 } },
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
