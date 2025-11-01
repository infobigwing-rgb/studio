"use client";

import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import type { Template, Layer, Property } from '@/lib/types';
import { TEMPLATES } from '@/lib/mock-data';

interface ProjectContextType {
  templates: Template[];
  activeTemplate: Template | null;
  setActiveTemplate: (template: Template | null) => void;
  addTemplate: (template: Template) => void;
  activeLayer: Layer | null;
  setActiveLayer: (layer: Layer | null) => void;
  updateLayerProperty: (layerId: string, propertyKey: string, value: any) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const ProjectProvider = ({ children }: { children: ReactNode }) => {
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [activeTemplate, setActiveTemplateState] = useState<Template | null>(TEMPLATES[0] || null);
  const [activeLayer, setActiveLayer] = useState<Layer | null>(
    activeTemplate && activeTemplate.layers.length > 0 ? activeTemplate.layers[0] : null
  );

  const setActiveTemplate = (template: Template | null) => {
    setActiveTemplateState(template);
    if (template && template.layers.length > 0) {
      setActiveLayer(template.layers[0]);
    } else {
      setActiveLayer(null);
    }
  };
  
  const addTemplate = (template: Template) => {
    setTemplates(prevTemplates => [...prevTemplates, template]);
  };

  const updateLayerProperty = (layerId: string, propertyKey: string, value: any) => {
    setTemplates(prevTemplates =>
      prevTemplates.map(template => ({
        ...template,
        layers: template.layers.map(layer => {
          if (layer.id === layerId) {
            const newProperties = {
              ...layer.properties,
              [propertyKey]: {
                ...layer.properties[propertyKey],
                value: value,
              },
            };
            const updatedLayer = { ...layer, properties: newProperties };
            
            if (activeLayer?.id === layerId) {
                setActiveLayer(updatedLayer);
            }

            return updatedLayer;
          }
          return layer;
        }),
      }))
    );

    setActiveTemplateState(prevTemplate => {
        if (!prevTemplate) return null;
        const newLayers = prevTemplate.layers.map(layer => {
             if (layer.id === layerId) {
                const newProperties = {
                ...layer.properties,
                [propertyKey]: {
                    ...layer.properties[propertyKey],
                    value: value,
                },
                };
                return { ...layer, properties: newProperties };
            }
            return layer;
        });
        return {...prevTemplate, layers: newLayers};
    })
  };
  
  const contextValue = useMemo(() => ({
    templates,
    activeTemplate,
    setActiveTemplate,
    addTemplate,
    activeLayer,
    setActiveLayer,
    updateLayerProperty,
  }), [templates, activeTemplate, activeLayer]);

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
