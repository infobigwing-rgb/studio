'use client';

import Image from 'next/image';
import { useProject } from '@/contexts/ProjectContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Template, SearchEnvatoTemplatesOutput } from '@/lib/types';
import TemplateUploader from '../TemplateUploader';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchEnvato } from '@/app/actions';


export default function TemplateLibrary() {
  const { templates, activeTemplate, setActiveTemplate } = useProject();
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [envatoSearchTerm, setEnvatoSearchTerm] = useState('');
  const [envatoTemplates, setEnvatoTemplates] = useState<SearchEnvatoTemplatesOutput['templates']>([]);
  const [isSearching, setIsSearching] = useState(false);

  const filteredLocalTemplates = (templates || []).filter((template) =>
    template.name.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  useEffect(() => {
    // Basic debounce
    const handler = setTimeout(async () => {
      if (envatoSearchTerm.length > 2) {
        setIsSearching(true);
        const results = await searchEnvato({ query: envatoSearchTerm });
        setEnvatoTemplates(results.templates);
        setIsSearching(false);
      } else {
        setEnvatoTemplates([]);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [envatoSearchTerm]);
  
  const handleApplyEnvatoTemplate = (envatoTemplate: SearchEnvatoTemplatesOutput['templates'][0]) => {
    // This is a placeholder. In a real scenario, we'd process this template.
    const newTemplate: Template = {
      id: envatoTemplate.id,
      name: envatoTemplate.name,
      thumbnailUrl: envatoTemplate.thumbnailUrl,
      thumbnailHint: 'professional video',
      layers: [
         {
            id: `${envatoTemplate.id}-layer1`,
            name: 'Main Text',
            type: 'text',
            properties: {
              content: { value: 'Your Title Here', type: 'text', label: 'Content' },
              fontSize: { value: 52, type: 'slider', label: 'Font Size', options: { min: 12, max: 128 } },
              color: { value: '#FFFFFF', type: 'color', label: 'Color' },
            }
         }
      ],
    };
    setActiveTemplate(newTemplate);
  }

  return (
    <aside className="flex w-72 shrink-0 flex-col bg-secondary/50">
      <div className="flex h-12 shrink-0 items-center justify-between border-b px-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Templates
        </h2>
        <TemplateUploader />
      </div>

      <Tabs defaultValue="local" className="flex flex-1 flex-col overflow-hidden">
        <TabsList className="m-2 grid w-auto grid-cols-2">
          <TabsTrigger value="local">My Templates</TabsTrigger>
          <TabsTrigger value="envato">Envato</TabsTrigger>
        </TabsList>
        <TabsContent value="local" className="flex-1 overflow-hidden">
          <div className="flex flex-col h-full">
            <div className="px-2 pb-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search my templates..."
                  className="w-full rounded-lg bg-background pl-8"
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 gap-4 p-4 pt-0">
                {filteredLocalTemplates.map((template: Template) => (
                  <button
                    key={template.id}
                    onClick={() => setActiveTemplate(template)}
                    className={cn(
                      'group relative block w-full overflow-hidden rounded-lg border-2 text-left transition-all',
                      activeTemplate?.id === template.id
                        ? 'border-primary shadow-lg'
                        : 'border-transparent hover:border-primary/50'
                    )}
                  >
                    <Image
                      src={template.thumbnailUrl}
                      alt={template.name}
                      width={256}
                      height={144}
                      data-ai-hint={template.thumbnailHint}
                      className="w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <h3 className="text-sm font-semibold text-white">
                        {template.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
        <TabsContent value="envato" className="flex-1 overflow-hidden">
           <div className="flex flex-col h-full">
            <div className="px-2 pb-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search Envato Elements..."
                  className="w-full rounded-lg bg-background pl-8"
                  value={envatoSearchTerm}
                  onChange={(e) => setEnvatoSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="grid grid-cols-1 gap-4 p-4 pt-0">
                {isSearching && (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                )}
                {!isSearching && envatoTemplates.length === 0 && (
                    <div className="text-center p-8">
                        <p className="text-sm text-muted-foreground">
                            {envatoSearchTerm.length > 2 ? "No results found." : "Search for templates from Envato Elements."}
                        </p>
                    </div>
                )}
                {envatoTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleApplyEnvatoTemplate(template)}
                    className={cn(
                      'group relative block w-full overflow-hidden rounded-lg border-2 text-left transition-all',
                      activeTemplate?.id === template.id
                        ? 'border-primary shadow-lg'
                        : 'border-transparent hover:border-primary/50'
                    )}
                  >
                    <Image
                      src={template.thumbnailUrl}
                      alt={template.name}
                      width={256}
                      height={144}
                      className="w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3">
                      <h3 className="text-sm font-semibold text-white">
                        {template.name}
                      </h3>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
