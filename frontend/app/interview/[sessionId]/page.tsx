import { InterviewSessionWorkspace } from "@/components/interview-session-workspace";

export const metadata = {
  title: "Active Technical Interview - InterviewOS",
  description: "Live AI adaptive technical interview assessment session.",
};

interface PageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function InterviewSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  return <InterviewSessionWorkspace sessionId={sessionId} />;
}
