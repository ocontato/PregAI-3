# Security Specification - Sermões Top (Biblioteca Gospel)

## 1. Data Invariants
- Only verified administrators (`admins/{uid}` or bootstrapped admin `tnkdzn@gmail.com` with `email_verified == true`) may create, update, or delete `sermons`, `categories`, and `illustrations`.
- Unauthenticated users and regular authenticated users can only READ published sermons (`status == 'published'`), all categories, and all illustrations.
- Draft sermons (`status == 'draft'`) can ONLY be read, listed, or managed by administrators.
- Authenticated users can only create, read, and delete their own favorites (`userId == request.auth.uid`). Users cannot alter or tamper with other users' favorites.
- Users cannot grant themselves administrator rights by writing to `/admins/{uid}` unless an existing admin performs the write.
- No user can modify immutable fields such as `createdAt` or falsify `userId` in favorites.

## 2. The Dirty Dozen Malicious Payloads
1. **Unauthenticated Sermon Creation**: An anonymous client attempts `setDoc(/sermons/hack, { title: 'Fake' })` -> MUST FAIL.
2. **Standard User Sermon Edit**: Authenticated non-admin attempts to edit a published sermon's content -> MUST FAIL.
3. **Draft Snooping**: Unauthenticated or non-admin user attempts `getDoc(/sermons/draft-123)` where `status == 'draft'` -> MUST FAIL.
4. **Self-Escalation to Admin**: Standard user attempts `setDoc(/admins/{myUid}, { role: 'superadmin' })` -> MUST FAIL.
5. **Favorite Impersonation on Create**: User A creates a favorite document with `userId: 'UserB'` -> MUST FAIL.
6. **Favorite Theft / Modification**: User A attempts to update or delete User B's favorite record -> MUST FAIL.
7. **Junk ID Poisoning**: Malicious client injects 2000-character doc ID with invalid control characters -> MUST FAIL.
8. **Email Spoofing Attack**: Attacker claims email `tnkdzn@gmail.com` but with `email_verified == false` -> MUST FAIL.
9. **Category Deletion by Member**: Regular logged-in user tries to delete `/categories/oracao` -> MUST FAIL.
10. **Shadow Field Injection**: Non-admin attempts to push rogue administrative attributes into user profile -> MUST FAIL.
11. **Illustration Creation by Member**: Non-admin attempts `setDoc(/illustrations/fake, { ... })` -> MUST FAIL.
12. **PII Leak on User Profiles**: Non-admin user attempts blanket read of all user profiles -> MUST FAIL.

## 3. Test Runner Design
The rules will be formulated, verified with strict security helpers, and deployed using `DeployRules`.
