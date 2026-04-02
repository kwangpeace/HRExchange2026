import fs from "fs";
import path from "path";

/** content/transcripts/{id}.txt 또는 {id}-part1.txt, {id}-part2.txt … 순서 병합 */
export function loadTranscriptForLecture(fileKey: string): string | null {
  const dir = path.join(process.cwd(), "content", "transcripts");
  const single = path.join(dir, `${fileKey}.txt`);
  if (fs.existsSync(single)) {
    return fs.readFileSync(single, "utf-8");
  }
  const chunks: string[] = [];
  let i = 1;
  while (true) {
    const p = path.join(dir, `${fileKey}-part${i}.txt`);
    if (!fs.existsSync(p)) break;
    chunks.push(fs.readFileSync(p, "utf-8"));
    i++;
  }
  return chunks.length ? chunks.join("\n\n") : null;
}
