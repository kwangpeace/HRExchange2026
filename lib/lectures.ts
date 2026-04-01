import lecturesData from "@/content/lectures.json";

export type Lecture = {
  id: string;
  tags: string[];
  title: string;
  summary: string;
  speaker: string;
  detail: string;
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
      `상세 메모: ${lec.detail}`,
      "",
    );
  }
  lines.push(`공식 일정/행사 페이지: ${c.officialScheduleUrl}`);
  return lines.join("\n");
}
