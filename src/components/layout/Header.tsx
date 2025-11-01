'use client';

import { Film, Download, Sparkles, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { useFirestore, useUser, useAuth, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import AssetRecommender from '@/components/ai/AssetRecommender';
import RenderProgress from '../rendering/RenderProgress';
import { useToast } from '@/hooks/use-toast';
import { renderWithShotstack } from '@/app/actions';

export default function Header() {
  const { activeTemplate } = useProject();
  const firestore = useFirestore();
  const auth = useAuth();
  const { user } = useUser();
  const { toast } = useToast();

  const handleExport = async () => {
    if (!activeTemplate || !firestore || !user) {
      toast({
        variant: 'destructive',
        title: 'Export Failed',
        description: 'Cannot export without an active template and user.',
      });
      return;
    }

    toast({
      title: 'Submitting to Renderer...',
      description: 'Your video is being sent to the render engine.',
    });

    try {
      // 1. Call the Shotstack render flow
      const shotstackResponse = await renderWithShotstack(activeTemplate);

      // 2. Create the render document in Firestore with the Shotstack ID
      const rendersCollection = collection(firestore, 'renders');
      addDocumentNonBlocking(rendersCollection, {
        shotstackId: shotstackResponse.renderId,
        templateId: activeTemplate.id,
        templateName: activeTemplate.name,
        userId: user.uid,
        status: 'submitted', // Or use shotstackResponse.status
        progress: 0,
        createdAt: serverTimestamp(),
        outputUrl: null,
      });

      toast({
        title: 'Render Submitted!',
        description: `Your video "${activeTemplate.name}" is in the queue.`,
      });
    } catch (error) {
      console.error('Failed to queue render:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not submit video for rendering. Please try again.',
      });
    }
  };

  const handleSignOut = () => {
    signOut(auth);
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Link href="/home" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Film className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold tracking-tighter">
            Remian Edit Studio
          </h1>
        </Link>
      </div>
      <div className="flex items-center gap-3">
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || 'Anonymous User'}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || 'No email'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
