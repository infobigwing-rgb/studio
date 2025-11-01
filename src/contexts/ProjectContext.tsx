'use client';

import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import {
  useCollection,
  useFirestore,
  updateDocumentNonBlocking,
  useMemoFirebase,
} from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import type { Template, Layer } from '@/lib/types';
import { Loader2 } from 'lucide-react';

interface ProjectContextType {
  templates: Template[];
  activeTemplate: Template | null;
  setActiveTemplate: (template: Template | null) => void;
  activeLayer: Layer | null;
  setActiveLayer: (layer: Layer | null) => void;
  updateLayerProperty: (layerId: string, propertyKey: string, value: any) => void;
  reorderLayers: (dragIndex: number, hoverIndex: number) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const firestore = useFirestore();

  const templatesRef = useMemoFirebase(
    () => (firestore ? collection(firestore, 'templates') : null),
    [firestore]
  );
  const { data: templates = [], isLoading: templatesLoading } = useCollection<Template>(templatesRef);

  const [activeTemplate, setActiveTemplateState] = useState<Template | null>(null);
  const [activeLayer, setActiveLayerState] = useState<Layer | null>(null);

  useEffect(() => {
    // Set initial active template when templates load
    if (!activeTemplate && templates && templates.length > 0) {
      const firstTemplate = templates[0];
      setActiveTemplateState(firstTemplate);
      if (firstTemplate.layers.length > 0) {
        setActiveLayerState(firstTemplate.layers[0]);
      }
    }
  }, [templates, activeTemplate]);

  const setActiveLayer = (layer: Layer | null) => {
    setActiveLayerState(layer);
  };
  

  const setActiveTemplate = (template: Template | null) => {
    setActiveTemplateState(template);
    if (template && template.layers.length > 0) {
      setActiveLayer(template.layers[0]);
    } else {
      setActiveLayer(null);
    }
  };

  const updateLayerProperty = (
    layerId: string,
    propertyKey: string,
    value: any
  ) => {
    if (!activeTemplate || !firestore) return;

    const templateDocRef = doc(firestore, 'templates', activeTemplate.id);

    const updatedLayers = activeTemplate.layers.map((layer) => {
      if (layer.id === layerId) {
        return {
          ...layer,
          properties: {
            ...layer.properties,
            [propertyKey]: {
              ...layer.properties[propertyKey],
              value: value,
            },
          },
        };
      }
      return layer;
    });
    
    // Optimistic UI update
    setActiveTemplateState({
      ...activeTemplate,
      layers: updatedLayers,
    });
    
    updateDocumentNonBlocking(templateDocRef, { layers: updatedLayers });
  };
  
  const reorderLayers = useCallback((dragIndex: number, hoverIndex: number) => {
      if (!activeTemplate || !firestore) return;

      const newLayers = [...activeTemplate.layers];
      const [draggedLayer] = newLayers.splice(dragIndex, 1);
      newLayers.splice(hoverIndex, 0, draggedLayer);
      
      // Optimistically update the UI
      setActiveTemplateState({
          ...activeTemplate,
          layers: newLayers,
      });

      // Persist the change to Firestore non-blockingly
      const templateDocRef = doc(firestore, 'templates', activeTemplate.id);
      updateDocumentNonBlocking(templateDocRef, { layers: newLayers });

  }, [activeTemplate, firestore]);

  const contextValue = {
      templates: templates || [],
      activeTemplate,
      setActiveTemplate,
      activeLayer,
      setActiveLayer,
      updateLayerProperty,
      reorderLayers,
    };

  if (templatesLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }

  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};
