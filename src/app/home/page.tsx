'use client';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ProjectProvider } from '@/contexts/ProjectContext';
import Header from '@/components/layout/Header';
import TemplateLibrary from '@/components/panels/TemplateLibrary';
import Canvas from '@/components/panels/Canvas';
import PropertyInspector from '@/components/panels/PropertyInspector';
import Timeline from '@/components/panels/Timeline';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import AIChatbot from '@/components/ai/AIChatbot';

export default function EditorPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <ProjectProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="flex h-dvh w-full flex-col bg-background text-foreground">
          <Header />
          <main className="flex flex-1 overflow-hidden">
            <TemplateLibrary />
            <div className="flex flex-1 flex-col">
              <Canvas />
              <Timeline />
            </div>
            <PropertyInspector />
          </main>
          <AIChatbot />
        </div>
      </DndProvider>
    </ProjectProvider>
  );
}
