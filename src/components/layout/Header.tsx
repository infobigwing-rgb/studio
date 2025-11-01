"use client";

import { Film, Download, Sparkles } from "lucide-react";
import { useProject } from "@/contexts/ProjectContext";
import { useFirestore, useUser } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import CollaborationAvatars from "@/components/collaboration/Avatars";
import AssetRecommender from "@/components/ai/AssetRecommender";
import RenderProgress from "../rendering/RenderProgress";
import { useToast } from "@/hooks/use-toast";

export default function Header() {
  const { activeTemplate } = useProject();
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const handleExport = async () => {
    if (!activeTemplate || !firestore || !user) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Cannot export without an active template and user.",
      });
      return;
    }

    try {
      const rendersCollection = collection(firestore, 'renders');
      await addDoc(rendersCollection, {
        templateId: activeTemplate.id,
        templateName: activeTemplate.name,
        userId: user.uid,
        status: 'queued',
        progress: 0,
        createdAt: serverTimestamp(),
        outputUrl: null,
      });

      toast({
        title: "Render Queued",
        description: `"${activeTemplate.name}" has been added to the render queue.`,
      });

    } catch (error) {
      console.error("Failed to queue render:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not add template to the render queue.",
      });
    }
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Film className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-lg font-semibold tracking-tighter">
          Remian Edit Studio
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <CollaborationAvatars />
        <AssetRecommender>
           <Button variant="outline" size="sm">
            <Sparkles className="mr-2 h-4 w-4" />
            AI Assets
          </Button>
        </AssetRecommender>
        <RenderProgress />
        <Button size="sm" onClick={handleExport} disabled={!activeTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
