## sprint 1 — intern components
### `frontend/src/components/Sidebar.tsx`
Static sidebar component built with Tailwind CSS (Sprint 1, Task 1.2).
Renders six navigation links — Dashboard, Projects, Tasks, Users, Reports, Settings — each with an inline SVG icon.
Highlights the active route in indigo and includes a collapse toggle that shrinks the sidebar to icon-only mode.
A user profile footer with avatar initials is shown at the bottom.
No routing or API calls; purely presentational for this sprint.
### `backend/app/models/user.py`
Pydantic v2 User model suite for the FastAPI backend (Sprint 1, Task 1.3).
Defines five models: `UserBase` (shared fields), `UserCreate` (registration with password validation), `UserUpdate` (optional PATCH fields), `UserInDB` (MongoDB document with hashed password and timestamps), and `UserResponse` (public API shape, no password exposed).
Includes a `UserRole` enum (`admin`, `project_lead`, `member`, `intern`, `viewer`) and a `PyObjectId` helper for MongoDB `_id` serialisation.
Requires `pydantic[email]` and `pymongo` in `backend/requirements.txt`.
