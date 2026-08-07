# InterviewOS

## Goal

Build an adaptive AI interviewer for the ABTalks Hackathon.

The system should conduct a technical interview based on a candidate's curriculum progress.

The interviewer must:

- Ask adaptive questions
- Generate follow-up questions
- Maintain interview context
- Evaluate answers
- Produce detailed feedback

---

## Frontend

Routes

/

Interview

Report

The frontend ONLY consumes API responses.

No interview logic exists inside frontend.

---

## Backend

Backend exposes

POST /interview/start

POST /interview/answer

GET /interview/report

The backend owns all interview logic.

---

## Theme

Professional

Dark

OpenAI + Linear + Vercel

---

## Tech

Frontend

Next.js

Tailwind

TypeScript

shadcn

Backend

FastAPI

LangGraph

ChromaDB

Breeth

Groq/OpenRouter