# Coy Discover

A mobile-first dating discovery application built as part of the Coy SDE Intern Assignment. Discover profiles, like or pass on them, and connect through mutual likes.

## Features

- Browse 30 mock user profiles one at a time.
- Swipe right to like and left to pass on mobile.
- Like and Pass buttons for desktop users.
- Mutual matching when both users like each other.
- "It's a Match!" popup on successful matches.
- Dedicated Matches view.
- JSON-based persistence of swipes and matches.
- Previously swiped profiles do not reappear after refresh.
- Feed API hides whether a profile has already liked the current user.

## Tech Stack

- Next.js 16
- React
- TypeScript
- CSS
- Next.js Route Handlers
- JSON file-based storage

## Project Structure

```text
app/
├── api/
│   ├── feed/route.ts
│   ├── matches/route.ts
│   └── swipe/route.ts
├── data/profiles.ts
├── globals.css
├── layout.tsx
└── page.tsx
data/swipes.json
lib/store.ts
public/profiles/
package.json
```

## Getting Started

### Prerequisites

- Node.js
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/shreyadav17/coy-discover.git
cd coy-discover
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/feed` | Returns profiles not yet swiped |
| POST | `/api/swipe` | Saves a like or pass and checks for a match |
| GET | `/api/matches` | Returns mutual matches |

### Swipe API Example

Request:

```json
{
  "profileId": 1,
  "action": "like"
}
```

Response:

```json
{
  "success": true,
  "isMatch": true
}
```

## Data Storage

The application uses `data/swipes.json` to persist swipe actions and matches. It starts with empty arrays:

```json
{
  "swipes": [],
  "matches": []
}
```

## Production Build

```bash
npm run build
```

## Future Improvements

- User authentication
- Database integration
- Real-time notifications
- Profile filtering and discovery preferences
- Cloud deployment

---

Built as part of the Coy SDE Intern Assignment.