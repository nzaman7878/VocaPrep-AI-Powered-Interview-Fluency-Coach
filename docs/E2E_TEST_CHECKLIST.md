# VocaPrep End-to-End Smoke Test Checklist

Use this checklist to manually verify the full VocaPrep interview flow from start to finish.

## Pre-requisites

- [ ] Backend server is running (`npm run dev` in `/server`)
- [ ] Frontend server is running (`npm run dev` in `/client`)
- [ ] MongoDB is connected
- [ ] Environment variables (Cloudinary, AssemblyAI, Google Gemini) are correctly configured

## 1. Authentication & Setup

- [ ] Register a new account or log in with an existing account.
- [ ] Verify you are redirected to the dashboard (or role selection).
- [ ] Navigate to `/role-selection`.

## 2. Role Selection

- [ ] Verify the grid of roles (Frontend Developer, Backend Developer, etc.) loads correctly.
- [ ] Click on a role card.
- [ ] Verify that clicking "Start Interview" creates a new session in the backend and redirects you to `/interview/:sessionId`.

## 3. Interview Page: Generation & UI

- [ ] Verify the UI displays a question (either pre-loaded or freshly generated via AI).
- [ ] Verify the "Record Answer" controls are visible and in the `IDLE` state.
- [ ] Verify the active question index (e.g., "Question 1 of 5") is correct.

## 4. Recording Flow

- [ ] Click "Start Recording". Verify browser prompts for microphone permissions if not previously granted.
- [ ] Verify the recording timer starts and the audio visualizer (or recording indicator) is active.
- [ ] Speak a test answer into the microphone.
- [ ] Click "Stop Recording".

## 5. Processing Pipeline (The Core State Machine)

- [ ] **Uploading:** Verify the UI immediately switches to the `ProcessingOverlay` and shows the "Uploading" step.
- [ ] **Transcribing:** Verify the overlay transitions to the "Transcribing" step.
- [ ] **Evaluating:** Verify the overlay transitions to the "Evaluating" step (LangGraph pipeline running).
- [ ] Verify that no errors occur during this automated progression.
  - _If an error occurs, verify that the ErrorBoundary or ErrorMessage catches it and offers a "Try Again" retry button._

## 6. Feedback & Evaluation

- [ ] Once processing completes, verify the UI gracefully transitions to the Feedback Report.
- [ ] **Transcript:** Verify your spoken words were accurately transcribed and displayed.
- [ ] **Content Score:** Verify the Content Score card displays a score out of 100 with AI feedback.
- [ ] **Delivery Metrics:** Verify the Delivery Metrics card shows WPM, filler word count, and pause count.
- [ ] **Coaching Tip:** Verify a synthesized, actionable coaching tip is displayed.

## 7. Next Question & Persistence

- [ ] Click "Continue to Next Question".
- [ ] Verify the UI resets to `IDLE` and a _new_ question is generated/displayed.
- [ ] **Persistence Check:** Refresh the browser. Verify you are placed exactly back on the current question without losing your place.

## 8. Session Completion

- [ ] Complete the remaining questions in the session (e.g., all 5 questions).
- [ ] On the final question's feedback screen, click "Finish Session" (or the final continue button).
- [ ] Verify you are redirected to `/summary/:sessionId`.

## 9. Session Summary

- [ ] Verify the Session Summary page displays aggregate stats (Average Content Score, Average Pace, Total Practice Time).
- [ ] Verify the timeline/list of all answered questions appears with their respective transcripts and feedback.

**If all above checks pass, the core AI pipeline and state machine are functioning perfectly.**
