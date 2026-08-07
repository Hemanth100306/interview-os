import { InterviewPlanView } from "@/components/interview-plan-view";

export const metadata = {
  title: "Interview Plan - InterviewOS",
  description: "AI-generated adaptive interview plan for candidate assessment.",
};

interface PageProps {
  params: Promise<{
    candidateId: string;
  }>;
}

export default async function InterviewPlanPage({ params }: PageProps) {
  const { candidateId } = await params;
  return <InterviewPlanView candidateId={candidateId} />;
}
