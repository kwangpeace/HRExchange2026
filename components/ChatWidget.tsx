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
      const reply = data.reply?.trim();
      if (reply) {
        setMessages((m) => [...m, { role: "assistant", content: reply }]);
      } else {
        setError("응답 본문이 비어 있습니다. 잠시 후 다시 시도해 주세요.");
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
        className="fixed bottom-5 right-5 z-[100] flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-[0_8px_28px_rgba(13,148,136,0.35)] ring-2 ring-white/80 transition hover:bg-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
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
          className="fixed bottom-24 right-5 z-[99] flex w-[min(100vw-2.5rem,22rem)] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_20px_50px_rgba(28,25,23,0.1)] ring-1 ring-stone-950/[0.04]"
          role="dialog"
          aria-label="강연 요약 질문"
        >
          <div className="border-b border-[var(--border)] px-4 py-3">
            <p className="text-sm font-semibold text-[var(--text)]">강연 요약 Q&amp;A</p>
            <p className="mt-0.5 text-xs text-[var(--muted)]">
              페이지에 정리된 내용만 참고해 답합니다.
            </p>
          </div>

          <div className="max-h-72 min-h-[12rem] space-y-3 overflow-y-auto bg-[var(--surface-muted)]/90 px-3 py-3">
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
                      ? "border border-teal-100 bg-teal-50 text-[var(--text)]"
                      : "border border-[var(--border)] bg-white text-[var(--text)] shadow-sm"
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
            <p className="border-t border-[var(--border)] bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          <div className="flex gap-2 border-t border-[var(--border)] bg-white p-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && void send()}
              placeholder="질문 입력…"
              className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-white px-3 py-2 text-sm text-[var(--text)] placeholder:text-stone-400 focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-ring)]"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={loading || !input.trim()}
              className="shrink-0 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
            >
              전송
            </button>
          </div>
        </div>
      )}
    </>
  );
}
