# InterviewOS Backend Architecture

POST /api/interview

↓

Receive sessionId

↓

If candidate exists:

Create Interview Session

↓

Profile Analyzer

↓

Interview Planner

↓

Question Generator

↓

Return First Question

------------------------

Every next request

↓

Load Session

↓

Evaluate Previous Answer

↓

Update Candidate State

↓

Generate Follow-up

↓

Return Next Question

------------------------

Question 8

↓

Generate Feedback

↓

Return

done=true