"use client";

import { useEffect, useMemo, useState } from "react";
import type { Lecture } from "@/lib/lectures";
import {
  classifySection,
  joinSections,
  parseDetailSections,
} from "@/lib/parseDetailSections";

type Props = {
  conferenceTitle: string;
  intro: string;
  officialScheduleUrl: string;
  lectures: Lecture[];
  transcripts: Record<string, string>;
};

type ModalTab = "summary" | "script";
type DetailSubTab = "all" | "meta" | "body";

export function LectureSection({
  conferenceTitle,
  intro,
  officialScheduleUrl,
  lectures,
  transcripts,
}: Props) {
  const [selected, setSelected] = useState<Lecture | null>(null);
  const [modalTab, setModalTab] = useState<ModalTab>("summary");
  const [detailSubTab, setDetailSubTab] = useState<DetailSubTab>("all");

  const openModal = (lec: Lecture) => {
    setModalTab("summary");
    setSelected(lec);
  };

  const script = selected ? transcripts[selected.id] : undefined;

  const detailSections = useMemo(
    () => (selected ? parseDetailSections(selected.detail) : []),
    [selected],
  );
  const metaSections = useMemo(
    () => detailSections.filter((s) => classifySection(s.title) === "meta"),
    [detailSections],
  );
  const bodySections = useMemo(
    () => detailSections.filter((s) => classifySection(s.title) === "body"),
    [detailSections],
  );
  const showDetailSplit =
    metaSections.length > 0 && bodySections.length > 0;

  const detailDisplayText = useMemo(() => {
    if (!selected) return "";
    if (!showDetailSplit) return selected.detail;
    if (detailSubTab === "all") return selected.detail;
    if (detailSubTab === "meta") return joinSections(metaSections);
    return joinSections(bodySections);
  }, [
    selected,
    showDetailSplit,
    detailSubTab,
    metaSections,
    bodySections,
  ]);

  useEffect(() => {
    if (!selected) return;
    const sections = parseDetailSections(selected.detail);
    const meta = sections.filter((s) => classifySection(s.title) === "meta");
    const body = sections.filter((s) => classifySection(s.title) === "body");
    if (meta.length > 0 && body.length > 0) setDetailSubTab("meta");
    else setDetailSubTab("all");
  }, [selected?.id]);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  return (
    <>
      <header className="relative mx-auto max-w-3xl px-4 pb-12 pt-16 text-center sm:pt-24">
        <div
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/90 px-4 py-1.5 text-xs font-medium text-[var(--muted)] shadow-sm backdrop-blur-sm"
          aria-hidden
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          HR Exchange · 요약 페이지
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--accent-dim)]">
          {conferenceTitle}
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-[var(--text)] sm:text-[2.15rem] sm:leading-[1.15]">
          핵심 강연
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--muted)]">
          {intro}
        </p>
      </header>

      <main className="mx-auto max-w-3xl px-4 pb-24">
        <ol className="space-y-5">
          {lectures.map((lec, index) => (
            <li key={lec.id}>
              <article className="group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-md)] ring-1 ring-stone-950/[0.04] transition hover:border-[var(--accent)]/40 hover:shadow-[0_12px_40px_rgba(13,148,136,0.12)]">
                <div className="flex flex-wrap items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-lg font-semibold text-[var(--accent-dim)] ring-1 ring-teal-200/60">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5">
                      {lec.tags.map((t, ti) => (
                        <span
                          key={`${lec.id}-tag-${ti}-${t}`}
                          className="rounded-md bg-[var(--tag-bg)] px-2 py-0.5 text-xs text-[var(--muted)] ring-1 ring-stone-300/60"
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
                      onClick={() => openModal(lec)}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--bg)]"
                    >
                      상세 내용 보기
                      <span aria-hidden className="opacity-90">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>

        <section className="mt-16 rounded-2xl border border-[var(--border)] bg-gradient-to-b from-white to-[var(--surface-muted)] p-8 text-center shadow-[var(--shadow-sm)] ring-1 ring-stone-950/[0.03]">
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
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[var(--accent-dim)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--surface-muted)]"
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
            className="absolute inset-0 bg-stone-900/10 backdrop-blur-[10px] transition-colors hover:bg-stone-900/[0.06]"
            aria-label="닫기"
            onClick={() => setSelected(null)}
          />
          <div
            className="relative z-[81] flex max-h-[min(92vh,900px)] w-full max-w-[min(100vw-1.5rem,42rem)] flex-col overflow-hidden rounded-t-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[0_24px_64px_rgba(28,25,23,0.12)] ring-1 ring-stone-950/[0.05] sm:rounded-2xl"
            role="dialog"
            aria-labelledby="modal-title"
          >
            <div className="shrink-0 border-b border-[var(--border)] bg-gradient-to-b from-[var(--surface-muted)]/60 to-[var(--surface)] px-6 pb-4 pt-6 sm:px-8">
              <div className="flex flex-wrap gap-1.5">
                {selected.tags.map((t, ti) => (
                  <span
                    key={`modal-${selected.id}-tag-${ti}-${t}`}
                    className="rounded-md bg-[var(--tag-bg)] px-2 py-0.5 text-xs text-[var(--muted)] ring-1 ring-stone-300/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h2 id="modal-title" className="mt-3 text-2xl font-bold leading-snug text-[var(--text)] sm:text-[1.35rem]">
                {selected.title}
              </h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{selected.speaker}</p>

              <div
                className="mt-4 flex gap-2 rounded-xl bg-[var(--surface-muted)] p-1 ring-1 ring-stone-200/80"
                role="tablist"
                aria-label="강연 보기 모드"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === "summary"}
                  onClick={() => setModalTab("summary")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    modalTab === "summary"
                      ? "bg-white text-[var(--text)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  강연 요약·정리
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={modalTab === "script"}
                  onClick={() => setModalTab("script")}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    modalTab === "script"
                      ? "bg-white text-[var(--text)] shadow-sm"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  강연 스크립트
                </button>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto bg-[var(--surface)] px-6 py-5 sm:px-8">
              {modalTab === "summary" && (
                <div className="space-y-8 text-sm leading-relaxed text-[var(--text)] sm:text-[15px]">
                  <section>
                    <h3 className="text-base font-semibold text-[var(--accent)]">핵심 요약</h3>
                    <p className="mt-3 text-[var(--text)]">{selected.summary}</p>
                  </section>
                  <section className="border-t border-[var(--border)] pt-8">
                    <h3 className="text-base font-semibold text-[var(--accent)]">정리본 전체</h3>
                    {showDetailSplit && (
                      <div
                        className="mt-4 flex flex-wrap gap-1.5 rounded-xl bg-[var(--surface-muted)] p-1 ring-1 ring-stone-200/80"
                        role="tablist"
                        aria-label="정리본 보기"
                      >
                        <button
                          type="button"
                          role="tab"
                          aria-selected={detailSubTab === "all"}
                          onClick={() => setDetailSubTab("all")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-[13px] ${
                            detailSubTab === "all"
                              ? "bg-white text-[var(--text)] shadow-sm"
                              : "text-[var(--muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          전체
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={detailSubTab === "meta"}
                          onClick={() => setDetailSubTab("meta")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-[13px] ${
                            detailSubTab === "meta"
                              ? "bg-white text-[var(--text)] shadow-sm"
                              : "text-[var(--muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          연사·행사
                        </button>
                        <button
                          type="button"
                          role="tab"
                          aria-selected={detailSubTab === "body"}
                          onClick={() => setDetailSubTab("body")}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition sm:text-[13px] ${
                            detailSubTab === "body"
                              ? "bg-white text-[var(--text)] shadow-sm"
                              : "text-[var(--muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          발표 내용
                        </button>
                      </div>
                    )}
                    <p className="mt-3 whitespace-pre-wrap text-[var(--text)]">{detailDisplayText}</p>
                  </section>
                  {selected.transcriptFile && script ? (
                    <p className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] px-3 py-2 text-xs text-[var(--muted)] sm:text-[13px]">
                      자동 STT로 만든 <strong className="font-medium text-[var(--text)]">원문 녹취</strong>는
                      상단 「<strong className="font-medium text-[var(--text)]">강연 스크립트</strong>」 탭에서
                      볼 수 있습니다. 위 정리본과는 별도입니다.
                    </p>
                  ) : selected.transcriptFile && !script ? (
                    <p className="text-xs text-amber-900 sm:text-[13px]">
                      이 강연은 스크립트 파일이 연결되어 있으나 내용을 불러오지 못했습니다. 배포 환경에{" "}
                      <code className="rounded bg-[var(--surface-muted)] px-1 text-[11px]">
                        content/transcripts/{selected.transcriptFile}.txt
                      </code>{" "}
                      등이 포함됐는지 확인하세요.
                    </p>
                  ) : (
                    <p className="text-xs text-[var(--muted)] sm:text-[13px]">
                      이 강연은 녹취 원문(STT)이 JSON에 연결되어 있지 않아 「강연 스크립트」에는 안내만
                      표시됩니다. 정리본은 위 「정리본 전체」를 이용하세요.
                    </p>
                  )}
                </div>
              )}

              {modalTab === "script" && (
                <div>
                  {!selected.transcriptFile ? (
                    <p className="text-sm leading-relaxed text-[var(--muted)]">
                      이 강연은 아직 자동 녹취(STT) 원문이{" "}
                      <code className="rounded bg-[var(--surface-muted)] px-1 text-xs">lectures.json</code>에
                      연결되어 있지 않습니다. 「강연 요약·정리」 탭의 정리본만 제공됩니다.
                    </p>
                  ) : (
                    <>
                      <p className="mb-4 rounded-lg border border-amber-200/80 bg-amber-50/90 px-3 py-2 text-xs leading-relaxed text-amber-950 sm:text-[13px]">
                        아래는 음성 인식·자동 생성된 원문 녹취입니다. 오타·끊김이 있을 수 있으며, 「강연
                        요약·정리」의 정리본과는 별도입니다.
                      </p>
                      {script ? (
                        <pre className="whitespace-pre-wrap break-words font-sans text-[13px] leading-[1.7] text-[var(--text)] sm:text-sm">
                          {script}
                        </pre>
                      ) : (
                        <p className="text-sm text-[var(--muted)]">
                          스크립트 파일이 없습니다.{" "}
                          <code className="rounded bg-[var(--surface-muted)] px-1 text-xs">
                            content/transcripts/{selected.transcriptFile}.txt
                          </code>{" "}
                          (또는{" "}
                          <code className="rounded bg-[var(--surface-muted)] px-1 text-xs">
                            {selected.transcriptFile}-part1.txt
                          </code>
                          …)을 추가하세요.
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-[var(--border)] bg-[var(--surface-muted)]/60 px-6 pb-6 pt-4 sm:px-8">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="w-full rounded-xl border border-[var(--border)] bg-white py-3 text-sm font-medium text-[var(--text)] shadow-sm transition hover:bg-[var(--surface-muted)]"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
