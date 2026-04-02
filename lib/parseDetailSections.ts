/** lectures.json의 detail 필드에 쓰인 【제목】 구역 파싱 */

export type DetailSection = { title: string; body: string };

export function parseDetailSections(detail: string): DetailSection[] {
  const normalized = detail.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const parts = normalized.split(/(?=【[^】]+】)/).filter((p) => p.trim());
  return parts.map((part) => {
    const m = part.match(/^【([^】]+)】\s*/);
    if (!m) return { title: "본문", body: part.trim() };
    return { title: m[1].trim(), body: part.slice(m[0].length).trim() };
  });
}

/** 연사·행사·Speak 소개 등 vs 발표 본문(개요·Part·Q&A 등) */
export function classifySection(title: string): "meta" | "body" {
  const t = title.trim();
  if (/세션 개요|강연 개요|^개요$|한 줄 결론|문제 정의/i.test(t)) return "body";
  if (
    /주요 내용|받아쓰기|Q&A|질의응답|Part |핵심 질문|전략|Lever|Frame|HR의 핵심|AI 레버|매니저|맺음말|오늘 가져가는|STT|원문|정리본|요약 및|최종|제언|결론|다음 단계|Spotlight|심화|\d+\)\s*핵심|받아쓰기\s*\(/i.test(
      t
    )
  )
    return "body";
  if (
    /연사|행사|트랙|Speak|스픽|프로그램|세션 주제|목차|TRACK|GLOBAL|연사 소개/i.test(t)
  )
    return "meta";
  return "body";
}

export function joinSections(sections: DetailSection[]): string {
  return sections
    .map((s) => `【${s.title}】\n${s.body}`)
    .join("\n\n")
    .trim();
}
