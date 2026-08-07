# InterviewOS API Contract

## Endpoint

POST /api/interview

---

## Start Interview

Request

```json
{
  "sessionId": "uuid",
  "candidate": {}
}
```

Response

```json
{
  "reply": "...",
  "done": false
}
```

---

## Continue Interview

Request

```json
{
  "sessionId": "...",
  "message": "..."
}
```

Response

```json
{
  "reply": "...",
  "done": false
}
```

---

## Finish

```json
{
  "reply": "...",
  "done": true,
  "feedback": {
    "summary": "",
    "strengths": [],
    "gaps": [],
    "next": []
  }
}
```