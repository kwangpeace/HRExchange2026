/**
 * content/transcripts/stt2-chunk*.txt 를 순서대로 이어
 * content/transcripts/2.txt 로 저장합니다. (UTF-8, BOM)
 * 사용: stt2-chunk01.txt, stt2-chunk02.txt … 를 만든 뒤 node scripts/merge-stt2.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "content", "transcripts");
const header =
  "\uFEFF※ HR Exchange 2026 — 「AGI 시대 생존을 위한 HR Playbook」(윤호영 / 당근마켓)\n" +
  "🎙 제공하신 자동 음성 인식(STT) 원문입니다. 오타·끊김이 있을 수 있습니다.\n\n" +
  "---\n\n";

let i = 1;
const parts = [];
while (true) {
  const num = String(i).padStart(2, "0");
  const p = path.join(dir, `stt2-chunk${num}.txt`);
  if (!fs.existsSync(p)) break;
  parts.push(fs.readFileSync(p, "utf8"));
  i++;
}
if (!parts.length) {
  console.error("stt2-chunk01.txt … 가 없습니다.");
  process.exit(1);
}
fs.writeFileSync(path.join(dir, "2.txt"), header + parts.join(""), "utf8");
console.log("Wrote content/transcripts/2.txt (" + parts.length + " chunks)");
