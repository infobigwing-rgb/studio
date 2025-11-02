'use client';

import Image from 'next/image';
import { useProject } from '@/contexts/ProjectContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { Template, SearchEnvatoTemplatesOutput } from '@/lib/types';
import TemplateUploader from '../TemplateUploader';
import { Input } from '@/components/ui/input';
import { useState, useEffect, useCallback } from 'react';
import { Search, Loader2, Star, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { searchEnvato } from '@/app/actions';
import { Badge } from '../ui/badge';
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

type EnvatoTemplate = SearchEnvatoTemplatesOutput['templates'][0];

export default function TemplateLibrary() {
  const { templates, activeTemplate, setActiveTemplate } = useProject();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const userRef = useMemoFirebase(
    () => (firestore && user ? doc(firestore, 'users', user.uid) : null),
    [firestore, user]
  );
  const { data: userProfile } = useDoc<{envatoToken?: string}>(userRef);

  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [envatoSearchTerm, setEnvatoSearchTerm] = useState('');
  const [envatoTemplates, setEnvatoTemplates] = useState<EnvatoTemplate[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [envatoError, setEnvatoError] = useState<string | null>(null);

  const filteredLocalTemplates = (templates || []).filter((template) =>
    template.name.toLowerCase().includes(localSearchTerm.toLowerCase())
  );

  const handleEnvatoSearch = useCallback(async () => {
    if (envatoSearchTerm.length < 3) {
      setEnvatoTemplates([]);
      setEnvatoError(null);
      return;
    }
    if (!userProfile?.envatoToken) {
      setEnvatoError('Envato API token not set. Please add it in your profile.');
      setEnvatoTemplates([]);
      return;
    }

    setIsSearching(true);
    setEnvatoError(null);
    try {
      const results = await searchEnvato({ query: envatoSearchTerm, token: userProfile.envatoToken });
      setEnvatoTemplates(results.templates);
    } catch (error: any) {
      setEnvatoError(error.message || 'An error occurred while searching Envato.');
      setEnvatoTemplates([]);
      toast({
        variant: 'destructive',
        title: 'Envato Search Failed',
        description: error.message || 'Could not fetch templates from Envato.'
      });
    } finally {
      setIsSearching(false);
    }
  }, [envatoSearchTerm, userProfile?.envatoToken, toast]);

  useEffect(() => {
    const handler = setTimeout(() => {
      handleEnvatoSearch();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [envatoSearchTerm, handleEnvatoSearch]);
  
  const handleApplyEnvatoTemplate = (envatoTemplate: EnvatoTemplate) => {
    // This is a placeholder. In a real scenario, we'd process this template.
    const newTemplate: Template = {
      id: envatoTemplate.id,
      name: envatoTemplate.name,
      thumbnailUrl: envatoTemplate.thumbnailUrl,
      thumbnailHint: 'professional video',
      layers: [
         {
            id: `${envatoTemplate.id}-title`,
            name: 'Title',
            type: 'text',
            properties: {
              content: { value: 'Your Title Here', type: 'text', label: 'Content' },
              fontSize: { value: 52, type: 'slider', label: 'Font Size', options: { min: 12, max: 128 } },
              color: { value: '#FFFFFF', type: 'color', label: 'Color' },
              fontFamily: { value: 'Inter', type: 'select', label: 'Font Family', options: { items: [ {value: 'Inter', label: 'Inter'}, {value: 'Arial', label: 'Arial'}, {value: 'Helvetica', label: 'Helvetica'}, {value: 'Georgia', label: 'Georgia'} ]} },
              textAlign: { value: 'center', type: 'toggle-group', label: 'Text Align', options: { items: [{value: 'left', label: 'Left'}, {value: 'center', label: 'Center'}, {value: 'right', label: 'Right'}]} },
              opacity: { value: 100, type: 'slider', label: 'Opacity', options: { min: 0, max: 100 } },
              x: { value: 50, type: 'slider', label: 'Position X (%)', options: { min: 0, max: 100 } },
              y: { value: 40, type: 'slider', label: 'Position Y (%)', options: { min: 0, max: 100 } },
              zIndex: { value: 10, type: 'number', label: 'Z-Index' },
              start: { value: 0, type: 'number', label: 'Start Time' },
              duration: { value: 5, type: 'number', label: 'Duration' },
            }
         },
         {
            id: `${envatoTemplate.id}-subtitle`,
            name: 'Subtitle',
            type: 'text',
            properties: {
              content: { value: 'Your Subtitle Here', type: 'text', label: 'Content' },
              fontSize: { value: 24, type: 'slider', label: 'Font Size', options: { min: 10, max: 72 } },
              color: { value: '#E0E0E0', type: 'color', label: 'Color' },
              fontFamily: { value: 'Inter', type: 'select', label: 'Font Family', options: { items: [ {value: 'Inter', label: 'Inter'}, {value: 'Arial', label: 'Arial'}, {value: 'Helvetica', label: 'Helvetica'}, {value: 'Georgia', label: 'Georgia'} ]} },
              textAlign: { value: 'center', type: 'toggle-group', label: 'Text Align', options: { items: [{value: 'left', label: 'Left'}, {value: 'center', label: 'Center'}, {value: 'right', label: 'Right'}]} },
              opacity: { value: 100, type: 'slider', label: 'Opacity', options: { min: 0, max: 100 } },
              x: { value: 50, type: 'slider', label: 'Position X (%)', options: { min: 0, max: 100 } },
              y: { value: 60, type: 'slider', label: 'Position Y (%)', options: { min: 0, max: 100 } },
              zIndex: { value: 11, type: 'number', label: 'Z-Index' },
              start: { value: 1, type: 'number', label: 'Start Time' },
              duration: { value: 4, type: 'number', label: 'Duration' },
            },
         },
         {
            id: `${envatoTemplate.id}-bg`,
            name: 'Background Media',
            type: 'image',
            properties: {
              source: { value: 'https://picsum.photos/seed/bg/1280/720', type: 'file', label: 'Source'},
              opacity: { value: 100, type: 'slider', label: 'Opacity', options: {min: 0, max: 100} },
              zIndex: { value: 1, type: 'number', label: 'Z-Index' },
              start: { value: 0, type: 'number', label: 'Start Time' },
              duration: { value: 5, type: 'number', label: 'Duration' },
            }
         }
      ],
    };
    setActiveTemplate(newTemplate);
  }

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  }

  return (
    <aside className="flex w-80 shrink-0 flex-col bg-secondary/50">
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
              <div className="grid grid-cols-1 gap-2 p-2 pt-0">
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
              <div className="grid grid-cols-1 gap-2 p-2 pt-0">
                {isSearching && (
                    <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground"/>
                    </div>
                )}
                {envatoError && (
                  <div className="m-2 flex flex-col items-center gap-2 rounded-lg border border-dashed border-destructive/50 bg-destructive/10 p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                    <p className="text-sm font-medium text-destructive">{envatoError}</p>
                    <p className="text-xs text-muted-foreground">Go to your profile to add your token.</p>
                  </div>
                )}
                {!isSearching && !envatoError && envatoTemplates.length === 0 && (
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
                      'group relative block w-full overflow-hidden rounded-lg border-2 bg-card text-left text-card-foreground transition-all',
                      activeTemplate?.id === template.id
                        ? 'border-primary shadow-lg'
                        : 'border-transparent hover:border-primary/50'
                    )}
                  >
                    <Image
                      src={template.thumbnailUrl}
                      alt={template.name}
                      width={300}
                      height={169}
                      className="w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="p-3">
                       <h3 className="text-sm font-semibold truncate">{template.name}</h3>
                       <p className="text-xs text-muted-foreground">by {template.author}</p>
                       <div className="flex items-center justify-between mt-2">
                        <Badge variant="secondary" className="text-xs">{formatPrice(template.priceCents)}</Badge>
                        <div className="flex items-center gap-2">
                            {template.rating && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-500" />
                                    <span>{template.rating.toFixed(1)}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <ShoppingCart className="h-3 w-3" />
                                <span>{template.numberOfSales}</span>
                            </div>
                        </div>
                       </div>
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
