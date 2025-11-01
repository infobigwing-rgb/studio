"use client";

import { Film, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import CollaborationAvatars from "@/components/collaboration/Avatars";
import AssetRecommender from "@/components/ai/AssetRecommender";

export default function Header() {
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
        <Button size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </header>
  );
}
