import { LectureSection } from "@/components/LectureSection";
import { getConferenceContent } from "@/lib/lectures";
import { loadTranscriptForLecture } from "@/lib/transcripts";

export default async function Home() {
  const c = getConferenceContent();
  const transcripts: Record<string, string> = {};
  for (const lec of c.lectures) {
    if (lec.transcriptFile) {
      const t = loadTranscriptForLecture(lec.transcriptFile);
      if (t?.trim()) transcripts[lec.id] = t;
    }
  }

  return (
    <div className="min-h-screen">
      <LectureSection
        conferenceTitle={c.conferenceTitle}
        intro={c.intro}
        officialScheduleUrl={c.officialScheduleUrl}
        lectures={c.lectures}
        transcripts={transcripts}
      />
    </div>
  );
}
