export type Property = {
  value: any;
  type: 'text' | 'number' | 'color' | 'slider';
  label: string;
  options?: {
    min?: number;
    max?: number;
    step?: number;
  };
};

export type Layer = {
  id: string;
  name: string;
  type: 'text' | 'image' | 'shape';
  properties: Record<string, Property>;
};

export type Template = {
  id: string;
  name: string;
  thumbnailUrl: string;
  thumbnailHint: string;
  layers: Layer[];
};
