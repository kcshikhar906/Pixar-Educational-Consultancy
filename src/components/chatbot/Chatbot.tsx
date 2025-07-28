'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, User, X, Loader2, Sparkles, NotebookPen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { chat } from '@/ai/flows/chatbot-flow';
import type { ChatInput } from '@/ai/schemas/chatbot-schemas';
import { nanoid } from 'nanoid';
import { GeneralContactForm, PrepClassBookingForm } from './ChatForms';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  type?: 'form' | 'text';
  formType?: 'general' | 'prep-class';
}

const predefinedQuestions = [
  "What services do you offer?",
  "Which countries do you specialize in?",
  "How can I book a prep class?",
  "I have a general question.",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: nanoid(),
          role: 'system',
          content: "Hello! I'm the Pixar Edu AI Assistant. How can I help you today? You can ask me anything or choose from the options below.",
          type: 'text',
        },
      ]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
    if (scrollArea) {
      scrollArea.scrollTo({
        top: scrollArea.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (query: string) => {
    if (!query.trim() || isLoading) return;

    const userMessage: Message = { id: nanoid(), role: 'user', content: query, type: 'text' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatContext = "This context is from the main website of Pixar Educational Consultancy, a firm helping Nepalese students study in USA, UK, Australia, Canada, and New Zealand. Services include counseling, test prep (IELTS/PTE), visa support, and documentation assistance.";
      
      const validHistory = messages.filter(
        (m): m is { id: string; role: 'user' | 'model'; content: string } =>
          (m.role === 'user' || m.role === 'model') && m.type === 'text'
      );

      const aiInput: ChatInput = {
        context: chatContext,
        history: validHistory.map(({ role, content }) => ({ role, content })),
        query,
      };

      const result = await chat(aiInput);
      const aiMessage: Message = { id: nanoid(), role: 'model', content: result.response, type: 'text' };

      if (result.response.includes("class booking form")) {
        const systemMessage: Message = {
            id: nanoid(),
            role: 'system',
            content: "Here is the class booking form for you.",
            type: 'form',
            formType: 'prep-class'
        };
        setMessages(prev => [...prev, aiMessage, systemMessage]);
      } else if (result.response.includes("general inquiry form")) {
        const systemMessage: Message = {
            id: nanoid(),
            role: 'system',
            content: "Here is our general inquiry form.",
            type: 'form',
            formType: 'general'
        };
        setMessages(prev => [...prev, aiMessage, systemMessage]);
      } else {
        setMessages(prev => [...prev, aiMessage]);
      }

    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = { id: nanoid(), role: 'model', content: "Sorry, I'm having trouble connecting. Please try again later.", type: 'text' };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Chatbot Error",
        description: "Could not get a response from the AI assistant.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredefinedQuestion = (question: string) => {
      handleSendMessage(question);
  };

  const onFormSuccess = (formType: 'general' | 'prep-class') => {
    const successMessage: Message = {
        id: nanoid(),
        role: 'system',
        content: formType === 'general'
          ? "Thank you! Your inquiry has been sent. Our team will contact you soon."
          : "Thanks for your booking request! We'll be in touch shortly to confirm the details.",
        type: 'text'
    };
    setMessages(prev => [...prev, successMessage]);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-5 z-50 w-[calc(100vw-40px)] sm:w-[380px] h-[70vh] max-h-[600px] min-h-[400px]"
          >
            <Card className="h-full w-full flex flex-col shadow-2xl bg-card">
              <CardHeader className="flex flex-row items-center justify-between border-b p-3">
                <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 border-2 border-primary">
                        <AvatarImage src="/logo.png" alt="AI Avatar" />
                        <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-primary flex items-center"><Sparkles className="mr-1.5 h-5 w-5" />AI Assistant</CardTitle>
                        <CardDescription className="text-xs">Your guide to studying abroad.</CardDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-grow p-0 overflow-hidden">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map(m => (
                      <div key={m.id} className={cn("flex items-start gap-3 w-full", m.role === 'user' ? 'justify-end' : 'justify-start')}>
                        {m.role === 'model' && (
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src="/logo.png" alt="AI Avatar" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                        )}
                        
                        {m.type === 'form' ? (
                            <div className="w-full">
                                {m.content && <p className="text-sm text-center text-muted-foreground mb-2">{m.content}</p>}
                                {m.formType === 'general' && <GeneralContactForm onSuccess={() => onFormSuccess('general')} />}
                                {m.formType === 'prep-class' && <PrepClassBookingForm onSuccess={() => onFormSuccess('prep-class')} />}
                            </div>
                        ) : (
                          <div className={cn("max-w-[85%] rounded-xl px-3 py-2 text-sm shadow-sm", 
                            m.role === 'user' ? 'bg-primary text-primary-foreground ml-auto' : 'bg-muted text-card-foreground',
                            m.role === 'system' && 'bg-secondary/50 border border-secondary/80 text-secondary-foreground text-center w-full max-w-full'
                          )}>
                             <ReactMarkdown 
                                className="prose prose-sm prose-p:my-0 prose-a:text-accent hover:prose-a:underline"
                                components={{
                                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                                }}
                             >
                               {m.content}
                            </ReactMarkdown>
                          </div>
                        )}
                         
                         {m.role === 'user' && (
                            <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback><User/></AvatarFallback>
                            </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3 justify-start">
                         <Avatar className="h-8 w-8">
                            <AvatarImage src="/logo.png" alt="AI Avatar" />
                            <AvatarFallback>AI</AvatarFallback>
                          </Avatar>
                          <div className="bg-muted text-muted-foreground rounded-xl px-4 py-3 flex items-center">
                            <Loader2 className="h-4 w-4 animate-spin"/>
                          </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <div className="border-t p-2 bg-background/80">
                {messages.length <= 1 && (
                    <div className="mb-2 grid grid-cols-2 gap-2 px-2">
                        {predefinedQuestions.map(q => (
                            <Button key={q} variant="outline" size="sm" className="h-auto py-1.5 text-xs whitespace-normal" onClick={() => handlePredefinedQuestion(q)}>{q}</Button>
                        ))}
                    </div>
                )}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage(input);
                  }}
                  className="flex items-center gap-2"
                >
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isLoading}
                    className="flex-grow h-9"
                  />
                  <Button type="submit" size="icon" className="h-9 w-9" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 h-16 w-16 rounded-full shadow-lg z-40"
        aria-label="Toggle Chatbot"
      >
        <AnimatePresence>
          {isOpen ? (
            <motion.div key="close" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }}>
              <X className="h-8 w-8" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }}>
              <Bot className="h-8 w-8" />
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </>
  );
}
