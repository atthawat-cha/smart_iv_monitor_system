# SMIS — Homework Week 7 (Firebase Auth + Role-based Ward CRUD)

**Deployed URL:** https://smis-f8cc8.web.app

Continuation of [`../week6/`](../week6/) (BL-201 Ward CRUD) — adds Email/Password auth, role-based
access control (see [`ACL.md`](./ACL.md)), and Firebase Hosting deployment with security rules.
Full field/collection spec is in [`CLAUDE.md`](./CLAUDE.md).

## Setup

1. Reuse the same Firebase project as week6, or create a new one.
2. Firebase Console → **Authentication** → Sign-in method → enable **Email/Password**.
3. Firebase Console → **Firestore Database** should already be enabled from week6.
4. Copy `js/firebase-config.example.js` → `js/firebase-config.js` and fill in your project's config
   (this file is git-ignored — never commit real keys).
5. Deploy the security rules in [`firestore.rules`](./firestore.rules) together with hosting:
   ```sh
   firebase deploy --only firestore:rules,hosting
   ```
   (run `firebase init` / `firebase use --add` first if this folder isn't yet linked to a Firebase project)

## Try it out

1. Open the deployed URL (or serve locally with any static server, e.g. `npx serve .`).
2. **Sign up** with a new email/password — you'll get the **staff** role by default (read-only).
3. To test admin actions: Firebase Console → Firestore → `users/{your-uid}` → change `role` field to `"admin"`,
   then reload the page — the Create Ward form, Seed button, Update Status, and Delete buttons should appear.
4. As admin: create a ward, seed sample data, update another admin's ward's status, delete a ward (with confirm).
   Note that you cannot change the status of a ward *you* created — that's enforced by design (see `ACL.md`).
5. Log out (or open an incognito window) and confirm the ward list / private data is not accessible —
   screenshot this for `docs/` per the assignment requirement.

## Testing checklist (from the assignment)

- [ ] Logged-out access → `permission-denied`, not visible data
- [ ] Role change in Firebase Console → UI buttons show/hide accordingly
- [ ] Create / Update (status only) / Delete all work end-to-end on the deployed app
- [ ] Delete always prompts for confirmation
- [ ] Data persists after closing and reopening the browser
- [ ] Deployed URL is reachable from another device/network
