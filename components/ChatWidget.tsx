"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const scrollToEnd = () => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToEnd();
  }, [messages, loading, open]);

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    setError(null);
    const nextMessages: Msg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? `오류 (${res.status})`);
        return;
      }
      if (data.reply) {
        setMessages((m) => [...m, { role: "assistant", content: data.reply! }]);
      }
    } catch {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-[var(--bg)] shadow-lg shadow-black/40 transition hover:bg-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
        aria-label={open ? "채팅 닫기" : "채팅 열기"}
      >
        {open ? (
          <span className="text-xl leading-none">✕</span>
        ) : (
          <span className="text-2xl leading-none">💬</span>
        )}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-5 z-[99] flex w-[min(100vw-2.5rem,22rem)] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-2xl shadow-black/50"
          role="dialog"
          aria-label="강연 요약 질문"
        >
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--text)]">강연 요약 Q&amp;A</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              페이지에 정리된 내용만 참고해 답합니다.
            </p>
          </div>

          <div className="max-h-72 min-h-[12rem] space-y-3 overflow-y-auto px-3 py-3">
            {messages.length === 0 && (
              <p className="text-sm text-[var(--muted)]">
                궁금한 점을 입력해 보세요. (예: 당근 사례에서 강조한 키워드는?)
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[92%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-[var(--accent)]/25 text-[var(--text)]"
                      : "bg-[var(--surface-hover)] text-[var(--text)]"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <p className="text-xs text-[var(--muted)]">답변 생성 중…</p>
            )}
            <div ref={endRef} />
          </div>

          {error && (
            <p className="border-t border-[var(--border)] px-3 py-2 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-2 border-t border-[var(--border)] p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void send()}
              placeholder="질문 입력…"
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--bg)] disabled:opacity-40"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
}
