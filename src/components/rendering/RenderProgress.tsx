'use client';

import { useMemo, useEffect, useState } from 'react';
import { useCollection, useFirestore, useUser, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, where, orderBy, limit, doc } from 'firebase/firestore';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle, Clock, Loader2, Video, XCircle, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getRenderStatus } from '@/app/actions';

interface Render {
  id: string;
  shotstackId: string;
  templateName: string;
  status: 'submitted' | 'queued' | 'rendering' | 'done' | 'failed';
  progress: number;
  outputUrl?: string;
  userId?: string;
  createdAt?: any;
}

export default function RenderProgress() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [liveRenders, setLiveRenders] = useState<Render[]>([]);

  const rendersQuery = useMemoFirebase(
    () =>
      firestore && user
        ? query(
            collection(firestore, 'renders'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(5)
          )
        : null,
    [firestore, user]
  );

  const { data: initialRenders, isLoading } = useCollection<Render>(rendersQuery);
  
  useEffect(() => {
    if (initialRenders) {
        setLiveRenders(initialRenders);
    }
  }, [initialRenders]);

  const activeRenders = useMemo(() => {
    return liveRenders?.filter(r => r.status === 'submitted' || r.status === 'queued' || r.status === 'rendering');
  }, [liveRenders]);

  useEffect(() => {
    if (!activeRenders || activeRenders.length === 0 || !firestore) return;

    const interval = setInterval(async () => {
      let wasUpdated = false;
      const updatedRenders = await Promise.all(liveRenders.map(async (render) => {
        if (render.status === 'done' || render.status === 'failed') {
          return render;
        }

        try {
            const shotstackStatus = await getRenderStatus(render.shotstackId);
            if (shotstackStatus.status !== render.status || shotstackStatus.progress !== render.progress) {
                const updatedRender: Render = {
                    ...render,
                    status: shotstackStatus.status,
                    progress: shotstackStatus.progress,
                    outputUrl: shotstackStatus.url || render.outputUrl,
                };
                const renderDocRef = doc(firestore, 'renders', render.id);
                // Non-blocking update to Firestore
                updateDocumentNonBlocking(renderDocRef, { 
                    status: updatedRender.status,
                    progress: updatedRender.progress,
                    outputUrl: updatedRender.outputUrl,
                });
                wasUpdated = true;
                return updatedRender;
            }
        } catch (error) {
            console.error(`Failed to get status for render ${render.shotstackId}`, error);
            // Optionally, mark render as failed in Firestore
        }
        return render;
      }));

      if (wasUpdated) {
        setLiveRenders(updatedRenders);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [activeRenders, firestore, liveRenders]);


  const hasActiveRenders = activeRenders && activeRenders.length > 0;

  const renderIcon = (status: Render['status']) => {
    switch (status) {
        case 'submitted':
        case 'queued':
            return <Clock className="h-5 w-5 text-yellow-500" />;
        case 'rendering':
            return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
        case 'done':
            return <CheckCircle className="h-5 w-5 text-green-500" />;
        case 'failed':
            return <XCircle className="h-5 w-5 text-red-500" />;
        default:
            return <Video className="h-5 w-5 text-muted-foreground" />;
    }
  }

  const getStatusText = (status: Render['status']) => {
    if (status === 'done') return 'Completed';
    return status.charAt(0).toUpperCase() + status.slice(1);
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
              Status of your recent video exports.
            </p>
          </div>
          <div className="grid gap-4">
            {isLoading && <p className="text-sm text-muted-foreground">Loading renders...</p>}
            {!isLoading && (!liveRenders || liveRenders.length === 0) && (
                 <p className="text-sm text-muted-foreground text-center py-4">No recent renders found.</p>
            )}
            {liveRenders && liveRenders.map(render => (
                <div key={render.id} className="grid grid-cols-[24px_1fr_auto] items-center gap-3">
                    {renderIcon(render.status)}
                    <div className='w-full overflow-hidden'>
                        <p className="text-sm font-medium truncate">{render.templateName}</p>
                        { (render.status === 'queued' || render.status === 'rendering' || render.status === 'submitted') && <Progress value={render.progress} className="h-2 mt-1" /> }
                        <p className={`text-xs ${render.status === 'done' ? 'text-green-500' : 'text-muted-foreground'}`}>{getStatusText(render.status)}</p>
                    </div>
                     { render.status === 'done' && render.outputUrl ? (
                         <Button asChild variant="outline" size="icon" className="h-8 w-8">
                             <a href={render.outputUrl} target="_blank" rel="noopener noreferrer">
                                 <Download className="h-4 w-4" />
                            </a>
                        </Button>
                     ) : render.status === 'submitted' || render.status === 'queued' || render.status === 'rendering' ? (
                        <p className="text-sm text-muted-foreground">{render.progress.toFixed(0)}%</p>
                     ) : null }
                </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
