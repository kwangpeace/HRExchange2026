import lecturesData from "@/content/lectures.json";
import { loadTranscriptForLecture } from "@/lib/transcripts";

export type Lecture = {
  id: string;
  tags: string[];
  title: string;
  summary: string;
  speaker: string;
  detail: string;
  /** 있으면 content/transcripts/{id}.txt 또는 {id}-part1/2.txt 로드 */
  transcriptFile?: string;
};

export type ConferenceContent = {
  conferenceTitle: string;
  intro: string;
  officialScheduleUrl: string;
  lectures: Lecture[];
};

export function getConferenceContent(): ConferenceContent {
  return lecturesData as ConferenceContent;
}

/** Gemini 및 UI에서 공유하는 컨텍스트 문자열 */
export function buildContextForChat(): string {
  const c = getConferenceContent();
  const lines: string[] = [
    `컨퍼런스: ${c.conferenceTitle}`,
    `소개: ${c.intro}`,
    "",
    "--- 강연 목록 ---",
  ];
  for (const lec of c.lectures) {
    lines.push(
      `[${lec.id}] ${lec.title}`,
      `태그: ${lec.tags.join(", ")}`,
      `연사: ${lec.speaker}`,
      `요약: ${lec.summary}`,
      `상세 메모(정리본): ${lec.detail}`,
      "",
    );
    if (lec.transcriptFile) {
      const script = loadTranscriptForLecture(String(lec.transcriptFile));
      if (script?.trim()) {
        const max = 120_000;
        const body =
          script.length > max
            ? `${script.slice(0, max)}\n\n[원문 스크립트 일부만 포함. 전문은 페이지에서 확인.]`
            : script;
        lines.push(
          `[강연 스크립트·원문 녹취: ${lec.title}]`,
          body,
          "",
        );
      }
    }
  }
  lines.push(`공식 일정/행사 페이지: ${c.officialScheduleUrl}`);
  return lines.join("\n");
}
