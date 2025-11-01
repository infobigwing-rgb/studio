"use client";

import { useState } from 'react';
import { Bot, Loader2, Send, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useProject } from '@/contexts/ProjectContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { editWithAI } from '@/app/actions';

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

export default function AIChatbot() {
    const { activeTemplate, setActiveTemplate } = useProject();
    const [isOpen, setIsOpen] = useState(true);
    const [isExpanded, setIsExpanded] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;
        
        if (!activeTemplate) {
            toast({
                variant: 'destructive',
                title: 'No Active Template',
                description: 'Please select a template before using the AI assistant.',
            });
            return;
        }

        const userMessage: Message = { sender: 'user', text: inputValue };
        setMessages((prev) => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const result = await editWithAI({
                command: inputValue,
                template: activeTemplate,
            });

            if (result.updatedTemplate) {
                setActiveTemplate(result.updatedTemplate);
                const aiMessage: Message = { sender: 'ai', text: "I've updated the template based on your command." };
                setMessages((prev) => [...prev, aiMessage]);
            } else {
                 throw new Error("The AI didn't return an updated template.");
            }

        } catch (error: any) {
            console.error("AI edit failed:", error);
            const errorMessage: Message = { sender: 'ai', text: "Sorry, I couldn't process that command. " + (error.message || "") };
            setMessages((prev) => [...prev, errorMessage]);
            toast({
                variant: 'destructive',
                title: 'AI Error',
                description: 'Failed to apply AI edit. Please try a different command.',
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isOpen) {
        return (
            <Button
                className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg"
                onClick={() => setIsOpen(true)}
            >
                <Bot className="h-7 w-7" />
            </Button>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-4 right-4 z-50 flex flex-col rounded-lg border bg-card text-card-foreground shadow-lg transition-all",
                isExpanded ? "h-[500px] w-96" : "h-16 w-64"
            )}
        >
            <div className="flex h-16 flex-shrink-0 cursor-pointer items-center justify-between rounded-t-lg bg-secondary/50 px-4" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-3">
                    <Bot className="h-6 w-6 text-primary" />
                    <h3 className="font-semibold">AI Assistant</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                        {isExpanded ? <ChevronDown /> : <ChevronUp />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}>
                        <X />
                    </Button>
                </div>
            </div>

            {isExpanded && (
                <>
                    <ScrollArea className="flex-1 p-4">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "flex items-start gap-3",
                                        message.sender === 'user' ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                                            message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                                        )}
                                    >
                                        {message.text}
                                    </div>
                                </div>
                            ))}
                             {isLoading && (
                                <div className="flex items-start gap-3 justify-start">
                                    <div className="max-w-[80%] rounded-lg px-3 py-2 text-sm bg-muted flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Processing...</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    <div className="flex items-center gap-2 border-t p-3">
                        <Input
                            placeholder="e.g., 'Make the title bigger'"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            disabled={isLoading}
                        />
                        <Button onClick={handleSendMessage} disabled={isLoading}>
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
