# ACL.md — Week 7 Role-based Access Control

| Role | Permitted actions | Denied actions |
|---|---|---|
| **admin** (System Admin) | Create ward; view all wards; update `status` field on wards created by *other* admins; delete any ward; view/edit own `users/{uid}` profile | Update any field other than `status`; update `status` on a ward they themselves created (must be a different admin); view another user's `users/{uid}` profile |
| **staff** (Ward Staff / read-only) | View all wards; view/edit own `users/{uid}` profile | Create ward; update ward `status` (or any field); delete ward; view another user's `users/{uid}` profile |

## Notes

- Every account starts as **staff** on signup (`js/auth.js` → `ensureUserProfile`). Promotion to **admin** is done manually in Firebase Console (Firestore → `users/{uid}` → set `role: "admin"`) — this is intentional, so role changes can be demonstrated live for the Week 7 testing checklist ("changing role in Console flips UI button visibility").
- "Record creators cannot approve own submissions": enforced both in the UI (Update Status button is disabled on wards the current admin created) and in `firestore.rules` (`resource.data.createdBy != request.auth.uid`), so it can't be bypassed by calling Firestore directly.
- "Users cannot view other users' records": `users/{uid}` docs are scoped to `request.auth.uid == uid` in the security rules — there is no collection-wide read.
- No role has an empty denied column, per the assignment's `ACL.md` validation rule.
