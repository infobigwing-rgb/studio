"use client";

import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAssetRecommendations } from "@/app/actions";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import type { AIAssetRecommendationsOutput } from "@/ai/flows/ai-asset-recommendations";

const formSchema = z.object({
  projectDescription: z.string().min(10, {
    message: "Please provide a more detailed description.",
  }),
  desiredStyle: z.string().optional(),
});

export default function AssetRecommender({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIAssetRecommendationsOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectDescription: "",
      desiredStyle: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await getAssetRecommendations(values);
      setRecommendations(result);
    } catch (error) {
      console.error("Failed to get AI recommendations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch AI recommendations. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>AI Asset Recommendations</DialogTitle>
          <DialogDescription>
            Describe your project and let AI suggest fonts, stock videos, and images.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="projectDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., A fast-paced promotional video for a new tech startup..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Style (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Modern, cinematic, minimalist" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Get Recommendations
              </Button>
            </form>
          </Form>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">SUGGESTIONS</h3>
            {isLoading && (
              <div className="space-y-4 rounded-md border p-4">
                 <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
                 <div className="h-3 w-2/3 animate-pulse rounded bg-muted"></div>
                 <div className="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
              </div>
            )}
            {recommendations && (
              <div className="space-y-4">
                {recommendations.fontRecommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Fonts</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {recommendations.fontRecommendations.map((font) => (
                        <li key={font}>{font}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendations.stockVideoRecommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Stock Video Keywords</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {recommendations.stockVideoRecommendations.map((video) => (
                        <li key={video}>{video}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendations.imageRecommendations.length > 0 && (
                  <div>
                    <h4 className="font-semibold">Image Keywords</h4>
                    <ul className="list-disc pl-5 text-sm text-muted-foreground">
                      {recommendations.imageRecommendations.map((image) => (
                        <li key={image}>{image}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
             {!isLoading && !recommendations && (
                <div className="flex h-full items-center justify-center rounded-lg border-2 border-dashed">
                    <p className="p-4 text-center text-sm text-muted-foreground">
                        Your AI-powered asset recommendations will appear here.
                    </p>
                </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
