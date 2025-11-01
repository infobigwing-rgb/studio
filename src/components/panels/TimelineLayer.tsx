'use client';

import { useRef } from 'react';
import type { Identifier, XYCoord } from 'dnd-core';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical, Layers, Text } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { cn } from '@/lib/utils';
import type { Layer } from '@/lib/types';

interface TimelineLayerProps {
  layer: Layer;
  index: number;
}

interface DragItem {
  index: number;
  id: string;
  type: 'layer';
}

export default function TimelineLayer({ layer, index }: TimelineLayerProps) {
  const { setActiveLayer, activeLayer, reorderLayers } = useProject();
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<DragItem, void, { handlerId: Identifier | null }>({
    accept: 'layer',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      reorderLayers(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'layer',
    item: () => ({ id: layer.id, index }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={cn(
        'group flex w-full cursor-pointer items-center gap-3 rounded-md p-2 text-left text-sm transition-colors',
        activeLayer?.id === layer.id ? 'bg-primary/10' : 'hover:bg-muted'
      )}
      onClick={() => setActiveLayer(layer)}
    >
      <div
        ref={preview}
        className="flex flex-1 items-center gap-3"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary">
          {layer.type === 'text' && <Text className="h-4 w-4 text-muted-foreground" />}
          {layer.type === 'image' && <Layers className="h-4 w-4 text-muted-foreground" />}
          {layer.type === 'shape' && <Layers className="h-4 w-4 text-muted-foreground" />}
        </div>
        <span className="font-medium">{layer.name}</span>
        <div className="ml-4 flex-1 rounded-full bg-accent/50" style={{ height: '8px' }}>
          <div className="h-full w-3/4 rounded-full bg-accent"></div>
        </div>
      </div>
      <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab group-hover:text-foreground" />
    </div>
  );
}
