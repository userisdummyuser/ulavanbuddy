
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Mic, Bot, Send, Volume2, StopCircle } from "lucide-react";
import { krishiAssistantFlow } from "@/ai/flows/krishi-assistant";
import { useUserData } from "@/context/UserDataProvider";
import { cn } from "@/lib/utils";

interface KrishiAssistantProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Check for SpeechRecognition API
const SpeechRecognition =
  (typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition));

export default function KrishiAssistant({ open, onOpenChange }: KrishiAssistantProps) {
  const [query, setQuery] = React.useState("");
  const [response, setResponse] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRecording, setIsRecording] = React.useState(false);
  const recognitionRef = React.useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();
  const { translate } = useUserData();

  React.useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Can be changed dynamically

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      handleSendQuery(transcript); // Automatically send after transcription
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      toast({
        title: "Voice Error",
        description: `Could not recognize speech: ${event.error}`,
        variant: "destructive",
      });
      setIsRecording(false);
    };
    
    recognition.onend = () => {
        setIsRecording(false);
    }

    recognitionRef.current = recognition;

    // Cleanup on unmount
    return () => {
      recognition.stop();
    };

  }, [toast]);
  
  const handleToggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      setResponse("");
      setQuery("");
      recognitionRef.current?.start();
    }
    setIsRecording(!isRecording);
  };


  const handleSendQuery = async (currentQuery = query) => {
    if (!currentQuery.trim()) return;
    setIsLoading(true);
    setResponse("");
    try {
      const result = await krishiAssistantFlow({ query: currentQuery });
      setResponse(result.response);
      speak(result.response);
    } catch (error) {
      toast({
        title: "Assistant Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel(); // Stop any previous speech
      const utterance = new SpeechSynthesisUtterance(text);
      // Basic language detection to select a voice
      // This is not foolproof but works for many cases.
      if (/[\u0B80-\u0BFF]/.test(text)) { // Tamil character range
        utterance.lang = 'ta-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="text-primary" />
            UlavanBuddy Assistant
          </DialogTitle>
          <DialogDescription>
            {translate("Ask me anything about farming in Tamil or English.")}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            {response && (
                <div className="p-4 bg-muted/50 rounded-md">
                <p>{response}</p>
                <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => speak(response)}>
                        <Volume2 className="mr-2"/>
                        Speak
                    </Button>
                    <Button variant="outline" size="sm" onClick={stopSpeaking}>
                        <StopCircle className="mr-2"/>
                        Stop
                    </Button>
                </div>
                </div>
            )}
            
           {isLoading && (
             <div className="flex items-center justify-center p-4 bg-muted/50 rounded-md">
                <Bot className="h-6 w-6 animate-pulse text-primary" />
                <p className="ml-2 text-muted-foreground">UlavanBuddy is thinking...</p>
             </div>
            )}
        </div>
         <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between items-center w-full gap-4">
             <div className="flex-grow w-full sm:w-auto">
                 <div className="relative">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type or click the mic to talk..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendQuery()}
                        disabled={isLoading || isRecording}
                        className="pr-20"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                        <Button variant="ghost" size="icon" onClick={() => handleSendQuery()} disabled={isLoading || isRecording || !query.trim()}>
                            <Send className="w-5 h-5"/>
                        </Button>
                    </div>
                 </div>
             </div>
            {SpeechRecognition && (
                <Button 
                    onClick={handleToggleRecording} 
                    size="icon" 
                    className={cn(
                        "rounded-full w-14 h-14 transition-all duration-300",
                        isRecording ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90"
                    )}
                >
                    <Mic className="w-7 h-7" />
                    <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
                </Button>
            )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
