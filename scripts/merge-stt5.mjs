/** content/transcripts/stt5-chunk*.txt → content/transcripts/5.txt */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "..", "content", "transcripts");
const header =
  "\uFEFF※ HR Exchange 2026 — 「Stop Training, Start Re-designing!」(배수정 / SK아카데미)\n" +
  "🎙 제공하신 자동 음성 인식(STT) 원문입니다. 오타·끊김이 있을 수 있습니다.\n\n" +
  "---\n\n";

let i = 1;
const parts = [];
while (true) {
  const num = String(i).padStart(2, "0");
  const p = path.join(dir, `stt5-chunk${num}.txt`);
  if (!fs.existsSync(p)) break;
  parts.push(fs.readFileSync(p, "utf8"));
  i++;
}
if (!parts.length) {
  console.error("stt5-chunk01.txt … 가 없습니다.");
  process.exit(1);
}
fs.writeFileSync(path.join(dir, "5.txt"), header + parts.join(""), "utf8");
console.log("Wrote content/transcripts/5.txt (" + parts.length + " chunks)");
