"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const users = [
  { name: "Alex Johnson", avatarId: "avatar1" },
  { name: "Maria Garcia", avatarId: "avatar2" },
  { name: "Sam Lee", avatarId: "avatar3" },
];

export default function CollaborationAvatars() {
  return (
    <TooltipProvider>
      <div className="flex items-center -space-x-2">
        {users.map((user, index) => {
          const avatarImage = PlaceHolderImages.find(img => img.id === user.avatarId);
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-background">
                  <AvatarImage src={avatarImage?.imageUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent>
                <p>{user.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
