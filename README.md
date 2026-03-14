# Exam Guardrail System

Integrity-First Middleware for Online Exams with real-time monitoring and credibility reporting.

## Features

### Sentinel Client (Frontend)
- ✅ **Tab-Switching Detection**: Logs exact seconds away from exam tab
- ✅ **Window Resizing**: Flags windows below 80% screen size
- ✅ **Keyboard Hijacking**: Blocks Ctrl+C, Ctrl+V, F12, Print Screen
- ✅ **Idle Detection**: Flags no activity for 60+ seconds
- ✅ **Right-Click Prevention**: Blocks context menu

### Auditor Dashboard (Backend)
- ✅ **Real-time Violation Logging**: Timeline of all student violations
- ✅ **Trust Score Calculation**: 0-100 score based on violations
- ✅ **Live Statistics**: Total students, violations, average scores
- ✅ **Risk Classification**: High/Medium/Low risk students

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open exam interface:
```
http://localhost:3000/sentinel.html
```

4. View dashboard:
```
http://localhost:3000/dashboard
```

## Trust Score Calculation

- Base Score: 100
- Tab Switch: -10 points
- Window Blur: -8 points
- Window Resize: -15 points
- Keyboard Shortcut: -12 points
- Right Click: -5 points
- Idle Detection: -7 points

## Architecture

```
sentinel.html (Client) → server.js (API) → dashboard.html (Admin)
```

All violations are logged in real-time and displayed on the dashboard with automatic refresh every 5 seconds.
