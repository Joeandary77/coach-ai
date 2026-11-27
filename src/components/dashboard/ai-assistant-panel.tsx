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
  Loader2,
} from "lucide-react";

import { motion } from "motion/react";
import { suggestedPrompts } from "@/data/dashboard";
import { cn } from "@/lib/utils";

const BACKEND_URL_STORAGE_KEY = "coachai_backend_url_v1";
const DEFAULT_BACKEND_URL = "http://127.0.0.1:8000";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  content: string;
  meta?: string;
}

interface AIAssistantPanelProps {
  fullPage?: boolean;
}

const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Welcome, Coach! I'm your AI coaching assistant. Ask me about Month 1 basketball drills, 60-minute court sessions, 30-minute post-practice fitness conditioning, or age-group adaptations.",
  },
];

function getBackendBaseUrl(): string {
  if (typeof window === "undefined") return DEFAULT_BACKEND_URL;
  return (
    localStorage.getItem(BACKEND_URL_STORAGE_KEY)?.trim() ||
    DEFAULT_BACKEND_URL
  ).replace(/\/+$/, "");
}

export function AIAssistantPanel({
  fullPage = false,
}: AIAssistantPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [backendConnected, setBackendConnected] = useState<boolean | null>(
    null
  );

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    let cancelled = false;
    async function probeHealth() {
      try {
        const res = await fetch(`${getBackendBaseUrl()}/health`);
        if (!cancelled) {
          setBackendConnected(res.ok);
        }
      } catch {
        if (!cancelled) {
          setBackendConnected(false);
        }
      }
    }
    probeHealth();
    return () => {
      cancelled = true;
    };
  }, []);

  async function sendMessage(value: string) {
    const content = value.trim();
    if (!content || isSending) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content,
    };

    setMessages((previous) => [...previous, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch(`${getBackendBaseUrl()}/api/v1/coach/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          age_group: "U12 (A)",
          week: 1,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as {
        reply: string;
        grounded_topics?: string[];
        model_mode?: string;
      };

      setBackendConnected(true);
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply,
          meta: data.grounded_topics?.length
            ? `Topics: ${data.grounded_topics.join(" · ")}`
            : data.model_mode,
        },
      ]);
    } catch {
      setBackendConnected(false);
      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "FastAPI backend isn't running right now. Start Uvicorn on port 8000 (`uvicorn main:app --reload --host 127.0.0.1 --port 8000`) for live backend responses.",
          meta: "Offline fallback",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  function resetConversation() {
    setMessages(initialMessages);
    setInput("");
  }

  return (
    <motion.section
      initial={false}
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
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                backendConnected === true
                  ? "bg-emerald-500"
                  : backendConnected === false
                  ? "bg-amber-500"
                  : "bg-slate-400"
              )}
            />

            <span className="text-xs text-muted-foreground">
              {backendConnected === true
                ? "FastAPI connected"
                : backendConnected === false
                ? "Backend offline (local fallback)"
                : "Checking backend..."}
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
          const isAssistant = message.role === "assistant";

          return (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-2",
                !isAssistant && "flex-row-reverse"
              )}
            >
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

              <div
                className={cn(
                  "max-w-[85%] min-w-0 rounded-2xl px-3.5 py-3 text-sm leading-relaxed wrap-break-word",
                  isAssistant
                    ? "rounded-tl-sm border bg-card text-card-foreground"
                    : "rounded-tr-sm bg-secondary text-secondary-foreground"
                )}
              >
                <p>{message.content}</p>
                {message.meta && (
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {message.meta}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {messages.length === 1 && (
          <div className="space-y-2 pt-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Suggested questions
            </p>

            {suggestedPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => void sendMessage(prompt)}
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
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask CoachAI..."
            aria-label="Your message"
            maxLength={1000}
            disabled={isSending}
            className="h-11 min-w-0 flex-1 rounded-xl border bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

          <button
            type="submit"
            disabled={!input.trim() || isSending}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </form>

        <p className="mt-2 text-center text-[10px] leading-relaxed text-muted-foreground">
          Avoid sharing personal player information. Backend endpoint
          configurable in Settings.
        </p>
      </div>
    </motion.section>
  );
}