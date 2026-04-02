/** content/transcripts/stt4-chunk*.txt → content/transcripts/4.txt */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "content", "transcripts");
const header =
  "\uFEFF※ HR Exchange 2026 — 「WX해커톤: 포스코의 AX 성장을 깨우다」(노영은 / 포스코 인재창조원)\n" +
  "🎙 제공하신 자동 음성 인식(STT) 원문입니다. 오타·끊김이 있을 수 있습니다.\n\n" +
  "---\n\n";

let i = 1;
const parts = [];
while (true) {
  const num = String(i).padStart(2, "0");
  const p = path.join(dir, `stt4-chunk${num}.txt`);
  if (!fs.existsSync(p)) break;
  parts.push(fs.readFileSync(p, "utf8"));
  i++;
}
if (!parts.length) {
  console.error("stt4-chunk01.txt … 가 없습니다.");
  process.exit(1);
}
fs.writeFileSync(path.join(dir, "4.txt"), header + parts.join(""), "utf8");
console.log("Wrote content/transcripts/4.txt (" + parts.length + " chunks)");
