# SleepSync 🌙

A full-stack sleep recovery application built with React, Django, PostgreSQL, and AI.

## Tech Stack
- **Frontend:** React + Vite, React Router DOM, Axios
- **Backend:** Django REST Framework, JWT Authentication
- **Database:** PostgreSQL
- **AI:** Anthropic Claude API (personalized recovery plans)
- **Infrastructure:** Docker + Docker Compose

## Features
- Log 6 objective biometric metrics from your wearable device
- Weighted recovery score calculated server-side
- AI-generated personalized daily plan (Energy, Workout, Focus)
- Sleep history tracking
- JWT authentication

## How to Run
1. Clone the repo
2. Create `server/.env` with your credentials
3. Run `docker-compose up --build`
4. Visit `http://localhost:5173`
