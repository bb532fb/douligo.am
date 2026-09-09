import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/lesson/lesson-player";
import { requireUser } from "@/lib/auth/session";
import { lessonRepository } from "@/server/repositories/lesson-repository";

type LessonPageProps = PageProps<"/[lang]/lesson/[lessonId]">;

export default async function LessonPage({ params }: LessonPageProps) {
  await requireUser();
  const { lessonId } = await params;
  const lesson = await lessonRepository.findById(lessonId);
  if (!lesson) {
    notFound();
  }

  return <LessonPlayer lessonId={lesson.id} lessonTitle={lesson.title} />;
}
