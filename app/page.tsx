import { LectureSection } from "@/components/LectureSection";
import { getConferenceContent } from "@/lib/lectures";

export default function Home() {
  const c = getConferenceContent();

  return (
    <div className="min-h-screen">
      <LectureSection
        conferenceTitle={c.conferenceTitle}
        intro={c.intro}
        officialScheduleUrl={c.officialScheduleUrl}
        lectures={c.lectures}
      />
    </div>
  );
}
