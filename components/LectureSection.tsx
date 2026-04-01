"use client";

import { useState } from "react";
import type { Lecture } from "@/lib/lectures";

type Props = {
  conferenceTitle: string;
  intro: string;
  officialScheduleUrl: string;
  lectures: Lecture[];
};

export function LectureSection({
  conferenceTitle,
  intro,
  officialScheduleUrl,
  lectures,
}: Props) {
  const [selected, setSelected] = useState<Lecture | null>(null);

  return (
    <>
      <header className="mx-auto max-w-3xl px-4 pb-10 pt-14 text-center sm:pt-20">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[var(--accent)]">
          {conferenceTitle}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-4xl">
          핵심 강연
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
          {intro}
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24">
        <ol className="space-y-5">
          {lectures.map((lec, index) => (
            <li key={lec.id}>
              <article className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)]/80 p-5 transition hover:border-[var(--accent)]/40 hover:bg-[var(--surface)]">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/15 text-lg font-semibold text-[var(--accent)]">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {lec.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-[var(--bg)] px-2 py-0.5 text-xs text-[var(--muted)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--text)]">
                      {lec.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                      {lec.summary}
                    </p>
                    <p className="mt-3 text-sm text-[var(--text)]">
                      <span className="text-[var(--muted)]">연사</span>{" "}
                      <span className="font-medium">{lec.speaker}</span>
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelected(lec)}
                      className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[var(--accent)] underline-offset-4 hover:underline"
                    >
                      상세 내용 보기
                      <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <section className="mt-14 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)]/40 p-8 text-center">
          <h2 className="text-lg font-semibold text-[var(--text)]">
            컨퍼런스 전체 일정 확인
          </h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            HR Exchange 2026의 모든 강연과 세션을 확인하세요.
          </p>
          <a
            href={officialScheduleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--bg)] transition hover:bg-[var(--accent-dim)]"
          >
            공식 페이지 방문
          </a>
        </section>
      </main>

      {selected && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-label="닫기"
            onClick={() => setSelected(null)}
          />
          <div
            className="relative z-[81] max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-2xl sm:rounded-2xl"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="flex flex-wrap gap-1.5">
              {selected.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-[var(--bg)] px-2 py-0.5 text-xs text-[var(--muted)]"
                >
                  {t}
                </span>
              ))}
            </div>
            <h2 id="modal-title" className="mt-3 text-xl font-bold text-[var(--text)]">
              {selected.title}
            </h2>
            <p className="mt-2 text-sm text-[var(--muted)]">{selected.speaker}</p>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--text)]">
              <div>
                <h3 className="font-semibold text-[var(--accent)]">요약</h3>
                <p className="mt-1 text-[var(--muted)]">{selected.summary}</p>
              </div>
              <div>
                <h3 className="font-semibold text-[var(--accent)]">상세 메모</h3>
                <p className="mt-1 whitespace-pre-wrap">{selected.detail}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-8 w-full rounded-xl border border-[var(--border)] py-3 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--surface-hover)]"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
