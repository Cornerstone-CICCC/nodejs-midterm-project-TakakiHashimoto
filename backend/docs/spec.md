Absolutely. Here is the full **spec.md** content in chat, written in English and modeled after the structure/style of your example, but adapted for your **Study Planner / Assignment Tracker** project.

````md
# Study Planner / Assignment Tracker - Specification

## 1. Feature Overview

### 1.1 Purpose

A full-stack web application for students to manage their study-related tasks and assignments in one place. The app allows users to sign up, log in, create and manage assignments, track progress, organize work by due date and priority, and view upcoming or overdue tasks.

The goal of this product is to provide a clean and realistic assignment management experience while serving as a strong full-stack learning project.

### 1.2 Target Users

| User                                  | Use Case                                                             |
| ------------------------------------- | -------------------------------------------------------------------- |
| Student                               | Sign up, log in, create/edit/delete assignments, track progress      |
| Future Admin / Teacher (future scope) | Manage classroom-level assignments, monitor submissions, assign work |

### 1.3 Confirmed Scope

| Item              | Decision                                                          |
| ----------------- | ----------------------------------------------------------------- |
| Authentication    | Email/username + password login                                   |
| Auth actions      | `signup` / `login` / `logout` / `get current user`                |
| Task ownership    | Each task belongs to one authenticated user                       |
| Task fields       | title / description / due_date / priority / status                |
| Priority values   | `low` / `medium` / `high`                                         |
| Status values     | `todo` / `in_progress` / `done`                                   |
| Core features     | Auth + CRUD for assignments/tasks                                 |
| Nice-to-have      | subject/category, filtering, sorting, dashboard, overdue/upcoming |
| Architecture goal | Clean, expandable structure for future classroom app              |

---

## 2. Database Design

### 2.1 ER Diagram

```text
users ───────────┐
                 │
                 └──── tasks
```
````

Future expansion:

```text
users ──────────────┐
                    ├──── tasks
classrooms ─────────┤
subjects ───────────┤
assignments ────────┤
submissions ────────┘
```

### 2.2 `users` Table Definition

| Column Name     | Type        | NULL     | Default            | Description       |
| --------------- | ----------- | -------- | ------------------ | ----------------- |
| `id`            | uuid        | NOT NULL | uuid_generate_v4() | PK                |
| `username`      | varchar     | NOT NULL | -                  | Unique username   |
| `email`         | varchar     | NOT NULL | -                  | Unique email      |
| `password_hash` | varchar     | NOT NULL | -                  | Hashed password   |
| `created_at`    | timestamptz | NOT NULL | now()              | Created timestamp |
| `updated_at`    | timestamptz | NOT NULL | now()              | Updated timestamp |

### 2.3 `tasks` Table Definition

| Column Name   | Type        | NULL     | Default            | Description                     |
| ------------- | ----------- | -------- | ------------------ | ------------------------------- |
| `id`          | uuid        | NOT NULL | uuid_generate_v4() | PK                              |
| `user_id`     | uuid        | NOT NULL | -                  | FK to users                     |
| `title`       | varchar     | NOT NULL | -                  | Task title                      |
| `description` | text        | NULL     | -                  | Optional task description       |
| `due_date`    | date        | NULL     | -                  | Optional due date               |
| `priority`    | varchar     | NOT NULL | `'medium'`         | `low` / `medium` / `high`       |
| `status`      | varchar     | NOT NULL | `'todo'`           | `todo` / `in_progress` / `done` |
| `subject`     | varchar     | NULL     | -                  | Optional subject/category       |
| `created_at`  | timestamptz | NOT NULL | now()              | Created timestamp               |
| `updated_at`  | timestamptz | NOT NULL | now()              | Updated timestamp               |

### 2.4 SQL

```sql
CREATE TABLE public.users (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  username varchar NOT NULL,
  email varchar NOT NULL,
  password_hash varchar NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_username_key UNIQUE (username),
  CONSTRAINT users_email_key UNIQUE (email)
);

CREATE TABLE public.tasks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  title varchar NOT NULL,
  description text,
  due_date date,
  priority varchar NOT NULL DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high')),
  status varchar NOT NULL DEFAULT 'todo'
    CHECK (status IN ('todo', 'in_progress', 'done')),
  subject varchar,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT tasks_pkey PRIMARY KEY (id),
  CONSTRAINT tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);


-- Indexes
CREATE INDEX idx_tasks_user_id ON public.tasks (user_id);
CREATE INDEX idx_tasks_user_status ON public.tasks (user_id, status);
CREATE INDEX idx_tasks_user_due_date ON public.tasks (user_id, due_date);
CREATE INDEX idx_tasks_user_priority ON public.tasks (user_id, priority);
```

It will constantly ask things like:
get all tasks for the current user
get all todo tasks for the current user
get tasks for the current user sorted by due date
get high-priority tasks for the current user

### 2.5 Constraints

| Constraint | Content                                     |
| ---------- | ------------------------------------------- |
| PK         | `users.id`, `tasks.id`                      |
| FK         | `tasks.user_id` → `users.id`                |
| UNIQUE     | `users.username`, `users.email`             |
| CHECK      | `priority IN ('low', 'medium', 'high')`     |
| CHECK      | `status IN ('todo', 'in_progress', 'done')` |

### 2.6 Indexes

| Index Name                | Columns               | Purpose                     |
| ------------------------- | --------------------- | --------------------------- |
| `idx_tasks_user_id`       | `(user_id)`           | Fetch user’s tasks          |
| `idx_tasks_user_status`   | `(user_id, status)`   | Filter tasks by status      |
| `idx_tasks_user_due_date` | `(user_id, due_date)` | Sort and query by due date  |
| `idx_tasks_user_priority` | `(user_id, priority)` | Filter or group by priority |

### 2.7 Design Decisions

| Decision                                     | Reason                                                          |
| -------------------------------------------- | --------------------------------------------------------------- |
| Separate `users` and `tasks` tables          | Clear ownership and future scalability                          |
| `password_hash` instead of raw password      | Security best practice                                          |
| `user_id` required on every task             | Enforces task ownership                                         |
| `subject` kept as nullable string initially  | Faster MVP without over-normalizing                             |
| `priority` and `status` as controlled values | Keeps frontend/backend consistent                               |
| No soft delete for MVP                       | Simpler CRUD flow; real delete is acceptable for school project |
| `ON DELETE CASCADE` on `tasks.user_id`       | If user is removed, their tasks are removed too                 |

---

## 3. Screen Specifications (Frontend)

### 3.1 Signup Page (`/signup`)

**Layout:**

```text
┌──────────────────────────────────┐
│          Create Account          │
├──────────────────────────────────┤
│ Username                         │
│ [____________________________]   │
│ Email                            │
│ [____________________________]   │
│ Password                         │
│ [____________________________]   │
│ Confirm Password                 │
│ [____________________________]   │
│                                  │
│         [ Sign Up ]              │
│                                  │
│ Already have an account? Login   │
└──────────────────────────────────┘
```

**Features:**

- Input validation
- Password confirmation check
- Submit to signup API
- Redirect to login or dashboard after success

---

### 3.2 Login Page (`/login`)

**Layout:**

```text
┌──────────────────────────────────┐
│             Login                │
├──────────────────────────────────┤
│ Email or Username                │
│ [____________________________]   │
│ Password                         │
│ [____________________________]   │
│                                  │
│          [ Login ]               │
│                                  │
│ Don’t have an account? Sign up   │
└──────────────────────────────────┘
```

**Features:**

- Authenticate user
- Set auth cookie/session
- Redirect to dashboard/tasks page
- Show invalid credential message if failed

---

### 3.3 Dashboard / Tasks Page (`/tasks`)

**Layout:**

```text
┌────────────────────────────────────────────────────┐
│ Study Planner                         [Logout]     │
├────────────────────────────────────────────────────┤
│ [All] [Todo] [In Progress] [Done]   [Sort by Date] │
├────────────────────────────────────────────────────┤
│ [ + Add Task ]                                     │
├────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────┐  │
│ │ Finish math homework                          │  │
│ │ Due: 2026-03-18   Priority: High              │  │
│ │ Status: Todo                                  │  │
│ │ [Edit] [Delete]                               │  │
│ └───────────────────────────────────────────────┘  │
│ ┌───────────────────────────────────────────────┐  │
│ │ Study biology chapter 4                       │  │
│ │ Due: 2026-03-20   Priority: Medium            │  │
│ │ Status: In Progress                           │  │
│ │ [Edit] [Delete]                               │  │
│ └───────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────┘
```

**Features:**

- View all tasks for logged-in user
- Filter by status
- Sort by due date
- Open create/edit form
- Delete task
- Optional summary cards for overdue/upcoming/completed counts

---

### 3.4 Task Create / Edit Form Modal

**Form Fields:**

| Field       | Type       | Required | Description               |
| ----------- | ---------- | -------- | ------------------------- |
| Title       | text input | ○        | Assignment/task title     |
| Description | textarea   | -        | Optional details          |
| Due Date    | date input | -        | Optional deadline         |
| Priority    | select     | ○        | Low / Medium / High       |
| Status      | select     | ○        | Todo / In Progress / Done |
| Subject     | text input | -        | Optional subject/category |

**Features:**

- Reused for both create and edit
- Validate required fields
- Save to backend
- Refresh task list after submit

---

### 3.5 Optional Dashboard Cards

**Cards:**

- Total tasks
- Todo tasks
- In-progress tasks
- Done tasks
- Overdue tasks
- Upcoming tasks

**Purpose:**

- Quick overview of study progress
- Makes app feel more useful and polished

---

## 4. Authentication Specification

### 4.1 Auth Flow

**Signup Flow:**

1. User submits username, email, password
2. Backend validates data
3. Backend checks for duplicate email/username
4. Password is hashed with bcrypt
5. User is created in DB
6. User is redirected to login or logged in automatically

**Login Flow:**

1. User submits email/username + password
2. Backend validates credentials
3. Password is compared against hash
4. Auth token/session is created
5. HTTP-only cookie is returned
6. Frontend fetches current user and redirects to protected page

**Protected Request Flow:**

1. Frontend sends request to protected API
2. Auth cookie is included automatically
3. Backend verifies user
4. Backend attaches authenticated user to request
5. Only that user’s data is returned

**Logout Flow:**

1. Frontend calls logout API
2. Backend clears auth cookie/session
3. Frontend clears auth state
4. Redirect to login page

### 4.2 Auth Decisions

| Decision                           | Reason                                       |
| ---------------------------------- | -------------------------------------------- |
| HTTP-only cookie auth              | Safer than storing token in localStorage     |
| `/auth/me` endpoint                | Lets frontend restore login state on refresh |
| Backend uses authenticated user id | Prevents trusting client-sent `userId`       |
| Password hashing with bcrypt       | Standard secure practice                     |

---

## 5. API Specification

### 5.1 Auth Routes

| Method | Route              | Description                    |
| ------ | ------------------ | ------------------------------ |
| POST   | `/api/auth/signup` | Register a new user            |
| POST   | `/api/auth/login`  | Log in                         |
| POST   | `/api/auth/logout` | Log out                        |
| GET    | `/api/auth/me`     | Get current authenticated user |

### 5.2 Task Routes

| Method | Route            | Description                        |
| ------ | ---------------- | ---------------------------------- |
| GET    | `/api/tasks`     | Get all tasks for current user     |
| GET    | `/api/tasks/:id` | Get one task owned by current user |
| POST   | `/api/tasks`     | Create new task                    |
| PATCH  | `/api/tasks/:id` | Update task                        |
| DELETE | `/api/tasks/:id` | Delete task                        |

### 5.3 Query Parameters for Tasks

| Query Param | Example                              | Description        |
| ----------- | ------------------------------------ | ------------------ |
| `status`    | `/api/tasks?status=todo`             | Filter by status   |
| `priority`  | `/api/tasks?priority=high`           | Filter by priority |
| `sort`      | `/api/tasks?sort=due_date`           | Sort by due date   |
| `order`     | `/api/tasks?sort=due_date&order=asc` | Sort direction     |

### 5.4 Example Request / Response

**Create Task Request**

```json
{
  "title": "Finish math homework",
  "description": "Page 10 to 15",
  "dueDate": "2026-03-20",
  "priority": "high",
  "status": "todo",
  "subject": "Math"
}
```

**Task Response**

```json
{
  "id": "uuid-here",
  "userId": "user-uuid-here",
  "title": "Finish math homework",
  "description": "Page 10 to 15",
  "dueDate": "2026-03-20",
  "priority": "high",
  "status": "todo",
  "subject": "Math",
  "createdAt": "2026-03-16T10:00:00.000Z",
  "updatedAt": "2026-03-16T10:00:00.000Z"
}
```

---

## 6. Validation Rules

### 6.1 Signup Validation

| Field    | Rule                           |
| -------- | ------------------------------ |
| username | required, unique, min length   |
| email    | required, valid format, unique |
| password | required, minimum length       |

### 6.2 Login Validation

| Field          | Rule     |
| -------------- | -------- |
| email/username | required |
| password       | required |

### 6.3 Task Validation

| Field    | Rule                                     |
| -------- | ---------------------------------------- |
| title    | required                                 |
| priority | must be `low`, `medium`, or `high`       |
| status   | must be `todo`, `in_progress`, or `done` |
| due_date | must be valid date if provided           |

---

## 7. Permission Design

### 7.1 Current MVP Permissions

| Action                    | Authenticated Student |
| ------------------------- | --------------------- |
| Sign up                   | -                     |
| Log in                    | -                     |
| View own tasks            | ○                     |
| Create own task           | ○                     |
| Edit own task             | ○                     |
| Delete own task           | ○                     |
| View another user’s tasks | ×                     |

### 7.2 Rule

All task operations must be scoped by authenticated user id.

Correct pattern:

- Find task where `id = :taskId` AND `user_id = currentUser.id`

Not:

- Find task by `id` only

---

## 8. Status Flow

```text
            ┌───────────────┐
            │     todo      │
            └──────┬────────┘
                   │
                   ▼
          ┌──────────────────┐
          │   in_progress    │
          └──────┬───────────┘
                 │
                 ▼
            ┌───────────────┐
            │     done      │
            └───────────────┘
```

Flexible update rule:

- A task can be updated directly to any valid status
- Example: `todo -> done` is allowed if user finishes immediately

---

## 9. Frontend Structure

### 9.1 Recommended Folder Structure

```text
client/
  src/
    app/
      router/
        index.jsx
      providers/
        AuthProvider.jsx
    features/
      auth/
        api/
          authApi.js
        components/
          LoginForm.jsx
          SignupForm.jsx
        pages/
          LoginPage.jsx
          SignupPage.jsx
        hooks/
          useAuth.js
      tasks/
        api/
          taskApi.js
        components/
          TaskForm.jsx
          TaskList.jsx
          TaskItem.jsx
          TaskFilterBar.jsx
        pages/
          TasksPage.jsx
        hooks/
          useTasks.js
      dashboard/
        components/
          SummaryCards.jsx
          OverdueList.jsx
          UpcomingList.jsx
        pages/
          DashboardPage.jsx
    components/
      ui/
        Button.jsx
        Input.jsx
        Select.jsx
        Modal.jsx
      layout/
        Navbar.jsx
        PageContainer.jsx
    lib/
      apiClient.js
      constants.js
      utils.js
    styles/
      globals.css
    main.jsx
    App.jsx
```

### 9.2 Design Decisions

| Decision                         | Reason                                 |
| -------------------------------- | -------------------------------------- |
| Feature-based frontend structure | Easier to scale and maintain           |
| Reusable `TaskForm`              | Avoid duplicate create/edit form logic |
| `AuthProvider`                   | Centralized auth state management      |
| Separate API files per feature   | Cleaner separation of concerns         |

---

## 10. Backend Structure

### 10.1 Recommended Folder Structure

```text
server/
  src/
    config/
      env.js
      db.js
    modules/
      auth/
        auth.routes.js
        auth.controller.js
        auth.service.js
        auth.repository.js
        auth.validation.js
      tasks/
        task.routes.js
        task.controller.js
        task.service.js
        task.repository.js
        task.validation.js
    middleware/
      auth.middleware.js
      error.middleware.js
      validate.middleware.js
    utils/
      ApiError.js
      asyncHandler.js
      response.js
    app.js
    server.js
```

### 10.2 Layer Responsibilities

| Layer      | Responsibility                        |
| ---------- | ------------------------------------- |
| routes     | Define endpoints and middleware chain |
| controller | Handle request/response               |
| service    | Business logic                        |
| repository | Database operations                   |
| middleware | Auth, validation, errors              |

---

## 11. Implementation Order

### 11.1 Phase 1 - Planning

- Finalize MVP scope
- Decide DB choice
- Write schema
- Define routes and screens
- Decide auth approach

### 11.2 Phase 2 - Backend Setup

- Express app setup
- DB connection
- Environment config
- Error handling
- Route mounting

### 11.3 Phase 3 - Database

- Create `users` table
- Create `tasks` table
- Add indexes and constraints

### 11.4 Phase 4 - Auth Backend

- Signup
- Login
- Logout
- Current user endpoint
- Auth middleware
- Password hashing

### 11.5 Phase 5 - Task Backend

- Create task
- Get all tasks
- Get single task
- Update task
- Delete task
- Ownership enforcement

### 11.6 Phase 6 - Frontend Auth

- Signup page
- Login page
- Protected routes
- Auth provider/context

### 11.7 Phase 7 - Frontend Tasks

- Tasks page
- Task list
- Task form
- Create/edit/delete
- Filtering and sorting

### 11.8 Phase 8 - Polish

- Overdue/upcoming sections
- Dashboard cards
- Loading/error states
- Better UI consistency
- README/demo prep

---

## 12. Future Expansion Notes

### 12.1 Classroom App Direction

This app can later evolve into a classroom app by adding:

- user roles (`student`, `teacher`, `admin`)
- classrooms
- class assignments
- submissions
- comments/feedback
- notifications
- teacher dashboard

### 12.2 Forward-Compatible Decisions

| Decision                   | Future Benefit                                  |
| -------------------------- | ----------------------------------------------- |
| Feature-based architecture | Easier to add classrooms, submissions, subjects |
| Clean auth boundaries      | Easier to add roles/permissions later           |
| Task ownership model       | Can evolve into teacher-assigned work           |
| Optional `subject` field   | Can later become normalized `subjects` table    |

---

## 13. File Structure Summary

```text
client/
└── src/
    ├── app/
    ├── features/
    │   ├── auth/
    │   ├── tasks/
    │   └── dashboard/
    ├── components/
    ├── lib/
    ├── styles/
    ├── App.jsx
    └── main.jsx

server/
└── src/
    ├── config/
    ├── modules/
    │   ├── auth/
    │   └── tasks/
    ├── middleware/
    ├── utils/
    ├── app.jsg
    └── server.js
```

---

## 14. Final Product Definition

A full-stack study planner web app where students can securely sign up, log in, and manage their assignments using due dates, priorities, and progress statuses.

This MVP is intentionally scoped for a 7-day build, while the architecture remains clean enough to expand into a classroom assignment platform later.

---

**Last Updated**: 2026-03-16

```

This is already usable as your `spec.md`.

The next best step is to convert this into a **Day 1 build checklist** and a **final database/API contract** so you can start implementing without getting lost.
```
