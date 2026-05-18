## Goal
Reorganize Pantora into a multi-country marketplace (Norway, Sweden, Germany, Denmark) with a real-time chat system, expanded language support (EN/NO/SV/DE/DA), and admin controls per country + a global chat toggle.

## 1. Database changes (single migration)

Rather than physically separate databases (not practical in one Supabase project and would break existing data), add a `country` column to all data tables. This is the standard scalable pattern and keeps Norway data intact.

```text
listings.country     TEXT NOT NULL DEFAULT 'NO'
profiles.country     TEXT NOT NULL DEFAULT 'NO'
comments.country     TEXT NOT NULL DEFAULT 'NO'
notifications.country TEXT NOT NULL DEFAULT 'NO'
reports.country      TEXT NOT NULL DEFAULT 'NO'
help_requests.country TEXT NOT NULL DEFAULT 'NO'
```

Backfill all existing rows to `'NO'` (default does this). Add indexes on `country` for query speed.

New tables:
- `conversations` — `id, country, user_a, user_b, listing_id (nullable), last_message_at, created_at`. Unique pair per country.
- `messages` — `id, conversation_id, sender_id, country, content, read_at, created_at`. Realtime enabled.
- `app_settings` — single-row key/value table for global toggles (e.g. `chat_enabled` boolean). Admin-only writes; public read.

RLS:
- `conversations`: participants can select/insert; only participants can update `last_message_at`.
- `messages`: participants of the conversation can select/insert; sender can update `read_at` on their received messages.
- `app_settings`: everyone can read; only admins can update.

Realtime: `ALTER PUBLICATION supabase_realtime ADD TABLE messages, conversations;`

User's country on signup: extend `handle_new_user()` trigger to read `raw_user_meta_data->>'country'` (default 'NO').

## 2. Frontend — Country & Language

- Extend `useLanguage` hook to support `en | no | sv | de | da`. Add translations for SV/DE/DA (copy existing keys; EN as fallback when a key is missing).
- New `useCountry` hook (Context) — provides `country` (`NO | SE | DE | DK`), `setCountry`, persisted in `localStorage`. Default = `NO`.
- New `CountrySelector` component (dropdown with flag emoji) placed in `Header` next to `LanguageToggle`. Replace toggle with a `LanguageSelector` dropdown (5 options).
- All listing/feed/admin queries gain `.eq('country', country)`. Insert paths set `country` from the current selection.

## 3. Chat system

Pages/components:
- `src/pages/Inbox.tsx` — conversation list (avatar, name, last message preview, unread badge, timestamp).
- `src/pages/Chat.tsx` (`/chat/:conversationId`) — real-time messages, input bar, auto-scroll, read receipts.
- `src/hooks/useChat.ts` — subscribes to messages via supabase realtime channel.
- "Message seller" button on `ListingDetail` creates/opens a conversation (scoped to current country).
- Add Inbox link to `BottomNav` and unread badge.
- Respect `app_settings.chat_enabled`: when false, hide all chat buttons and show "Chat is temporarily unavailable" on `/inbox` and `/chat/:id`.

## 4. Admin panel updates

- Add country tabs (NO/SE/DE/DK) at top of `Admin.tsx`. All queries (users, listings, reports, comments) filter by selected admin country.
- Add a "Platform settings" card with a switch for `chat_enabled` (writes to `app_settings`).

## 5. Files touched

Created: `src/hooks/useCountry.tsx`, `src/components/CountrySelector.tsx`, `src/components/LanguageSelector.tsx`, `src/pages/Inbox.tsx`, `src/pages/Chat.tsx`, `src/hooks/useChat.ts`, `src/hooks/useAppSettings.ts`, `supabase/migrations/...sql`.

Edited: `src/App.tsx` (provider + routes), `src/components/Header.tsx`, `src/components/BottomNav.tsx`, `src/hooks/useLanguage.tsx` (5 langs), `src/pages/Feed.tsx`, `src/pages/CreateListing.tsx`, `src/pages/ListingDetail.tsx`, `src/components/ListingCard.tsx` (if needed), `src/pages/Admin.tsx`, `src/pages/Auth.tsx` (country at signup).

## Notes
- "Separate databases" is implemented via a `country` column with strict filtering — this is the scalable pattern. True per-country DB instances would prevent unified admin and shared auth, and break your current data.
- Chat between users is scoped to the same country by design (enforced in conversation creation).
- All five languages will be wired up; SV/DE/DA strings will be translated from the existing EN/NO set.