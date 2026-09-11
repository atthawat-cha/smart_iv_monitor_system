# CLAUDE.md — Week 7 Homework (Auth + Role-based Ward CRUD)

Sandbox extension of `raise2-homework/week6/` for RAISE2 Module 2, Week 7 assignment
("ระบบของคุณรู้จักผู้ใช้ และขึ้นออนไลน์"). Topic: **BL-201** (see root `SCOPE.md`).

## Firestore collections

### `wards/{wardId}`
| Field | Type | Notes |
|---|---|---|
| `name` | string | ward name |
| `wardType` | string | ICU / Medical Ward / Emergency / Surgical |
| `floor` | string | |
| `totalBeds` | number | |
| `note` | string | optional |
| `status` | string | **the only field the Update action may change** — see Status values below |
| `createdBy` | string | uid of the admin who created this ward |
| `createdAt` | number | `Date.now()` epoch ms |

### `users/{uid}`
| Field | Type | Notes |
|---|---|---|
| `email` | string | |
| `role` | string | `"admin"` \| `"staff"` — set to `"staff"` on signup, changed to `"admin"` manually in Firebase Console only |
| `createdAt` | number | |

`users/{uid}` is private data: readable only by the owning uid (enforced in `firestore.rules`). This is what the Week 7 "private user data inaccessible when unauthenticated" screenshot demonstrates.

## Status values (ward-level, not per-bed)

`Normal` · `Warning` · `Critical` · `Offline`

Per `SCOPE.md`, real bed-level status in the actual SMIS product is computed automatically from IoT telemetry, not set by a person. This homework sandbox adds a manual **ward-level** `status` field purely so the Week 7 "Update: status-only" CRUD requirement has something to demonstrate — it does not change the real product's design in `000-Project-Code/smis/`.

## Roles (see `ACL.md` for the full permission table)

- **admin** (System Admin): create wards, update a ward's `status` (but not on wards they created themselves — see below), delete wards.
- **staff**: read-only. Cannot create, update, or delete.

## Constraints enforced by `firestore.rules`

1. Any read/write requires `request.auth != null`.
2. Only `admin` role may create/update/delete `wards` documents.
3. Update on a `wards` doc may only touch the `status` field (`diff().affectedKeys().hasOnly(['status'])`).
4. An admin cannot update the `status` of a ward whose `createdBy` equals their own uid — "record creators cannot approve/change their own submissions."
5. `users/{uid}` is readable/writable only by that same uid; role escalation to `admin` is not possible client-side (must be done in Firebase Console).

## Project constraints

- No real API keys committed — `js/firebase-config.js` is git-ignored (see root `.gitignore`); only `js/firebase-config.example.js` is tracked.
- This folder is a course sandbox only; it does not affect the real Postgres/Prisma SMIS backend in `000-Project-Code/smis/`.
