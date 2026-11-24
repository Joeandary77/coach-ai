
"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import {
  Sparkles,
  Send,
  RotateCcw,
  ArrowUpRight,
  Bot,
  UserRound,
  Maximize2,
} from "lucide-react";

import { motion } from "motion/react";
import { suggestedPrompts } from "@/data/dashboard";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface AIAssistantPanelProps {
  fullPage?: boolean;
}

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Welcome, Coach! I'm your AI coaching assistant. Once connected, I can help you plan fitness sessions, explore exercises and adapt activities for your age groups.",
  },
];

export function AIAssistantPanel({
  fullPage = false,
}: AIAssistantPanelProps) {
  const [messages, setMessages] =
    useState<ChatMessage[]>(initialMessages);

  const [input, setInput] = useState("");

  const messagesContainerRef =
    useRef<HTMLDivElement>(null);

  // Automatically scroll to the latest message.
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  function sendMessage(value: string) {
    const content = value.trim();

    if (!content) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    const assistantMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content:
        "Your message was received successfully. AI-generated responses will become available once the backend and AI model are connected.",
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      assistantMessage,
    ]);

    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(input);
  }

  function resetConversation() {
    setMessages(initialMessages);
    setInput("");
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-2xl border bg-card shadow-sm",
        fullPage
          ? "h-[calc(100dvh-12rem)] min-h-96 md:h-[calc(100dvh-9rem)]"
          : "h-160"
      )}
    >
      {/* Assistant header */}
      <div className="flex items-center gap-3 border-b p-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold sm:text-base">
            AI Coaching Assistant
          </h2>

          <div className="mt-1 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />

            <span className="text-xs text-muted-foreground">
              Preview mode
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={resetConversation}
          aria-label="Reset conversation"
          title="Reset conversation"
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {!fullPage && (
          <Link
            href="/ai-coach"
            aria-label="Open full AI Coach page"
            title="Expand assistant"
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Maximize2 className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Chat messages */}
      <div
        ref={messagesContainerRef}
        role="log"
        aria-label="Chat conversation"
        aria-live="polite"
        className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-background/40 p-4"
      >
        {messages.map((message) => {
          const isAssistant =
            message.role === "assistant";

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-start gap-2",
                !isAssistant && "flex-row-reverse"
              )}
            >
              {/* Message avatar */}
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  isAssistant
                    ? "bg-primary/15 text-primary"
                    : "bg-secondary text-secondary-foreground"
                )}
              >
                {isAssistant ? (
                  <Bot className="h-4 w-4" />
                ) : (
                  <UserRound className="h-4 w-4" />
                )}
              </div>

              {/* Message bubble */}
              <div
                className={cn(
                  "max-w-[85%] min-w-0 rounded-2xl px-3 py-3 text-sm leading-relaxed wrap-break-word",
                  isAssistant
                    ? "rounded-tl-sm border bg-card text-card-foreground"
                    : "rounded-tr-sm bg-secondary text-secondary-foreground"
                )}
              >
                {message.content}
              </div>
            </motion.div>
          );
        })}

        {/* Suggested prompts */}
        {messages.length === 1 && (
          <div className="space-y-2 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested questions
            </p>

            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendMessage(prompt)}
                className="group flex w-full items-center justify-between gap-2 rounded-xl border bg-card p-3 text-left text-xs leading-relaxed transition-colors hover:border-primary/50 hover:bg-accent"
              >
                <span>{prompt}</span>

                <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Message input */}
      <div className="border-t bg-card p-3">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            placeholder="Ask CoachAI..."
            aria-label="Your message"
            maxLength={1000}
            className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-2 text-center text-[10px] leading-relaxed text-muted-foreground">
          AI backend not connected. Avoid sharing personal
          player information.
        </p>
      </div>
    </motion.section>
  );
}
