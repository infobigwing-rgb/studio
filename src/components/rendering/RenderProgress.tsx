'use client';

import { useMemo } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, orderBy } from 'firebase/firestore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, Loader2, Video } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface Render {
  id: string;
  templateName: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  outputUrl?: string;
}

export default function RenderProgress() {
  const firestore = useFirestore();
  const { user } = useUser();

  const rendersQuery = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'renders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc')
          )
        : null,
    [firestore, user]
  );

  const { data: renders, isLoading } = useCollection<Render>(rendersQuery);

  const activeRenders = useMemo(() => {
    return renders?.filter(r => r.status === 'queued' || r.status === 'processing');
  }, [renders]);

  const hasActiveRenders = activeRenders && activeRenders.length > 0;

  const renderIcon = (status: Render['status']) => {
    switch (status) {
        case 'queued':
            return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'processing':
            return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
        case 'completed':
            return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'failed':
            return <CheckCircle className="h-4 w-4 text-red-500" />;
        default:
            return <Video className="h-4 w-4 text-muted-foreground" />;
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {hasActiveRenders && (
            <span className="absolute right-1 top-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-primary/80"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Render Queue</h4>
            <p className="text-sm text-muted-foreground">
              Status of your video exports.
            </p>
          </div>
          <div className="grid gap-2">
            {isLoading && <p className="text-sm text-muted-foreground">Loading renders...</p>}
            {!isLoading && (!renders || renders.length === 0) && (
                 <p className="text-sm text-muted-foreground">No recent renders found.</p>
            )}
            {renders && renders.map(render => (
                <div key={render.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
                    {renderIcon(render.status)}
                    <div className='w-full'>
                        <p className="text-sm font-medium truncate">{render.templateName}</p>
                        <Progress value={render.progress} className="h-2 mt-1" />
                    </div>
                     <p className="text-sm text-muted-foreground">{render.progress}%</p>
                </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
