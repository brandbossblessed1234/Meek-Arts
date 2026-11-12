# Security Specification: Meek Studio 3D Art

## 1. Data Invariants
1. **Public Read of Published Projects**: Visitors may only view published projects (`isPublished == true`). Unpublished/draft projects are only readable by admins.
2. **Public Inquiry Submission**: Any visitor (anonymous/unauthenticated or authenticated) can submit an inquiry to `/inquiries/{inquiryId}`, but they cannot read, list, update, or delete inquiries.
3. **Admin Inquiry Protection**: Only authorized administrators can read, list, update status, or delete inquiries to protect customer PII (phone number, name, project details).
4. **Settings Read & Write**: Site settings are readable by anyone (public website copy), but only writable by administrators.
5. **Services Read & Write**: Services are publicly readable, but only writable by administrators.
6. **Project Management**: Only authenticated administrators can create, update, or delete projects.
7. **Admin Authority**: Only authenticated users matching the bootstrapped admin email (`valpeterjames@gmail.com`) or having an entry in `/admins/{uid}` have administrative privileges.

## 2. The "Dirty Dozen" Payloads (Must be Denied)
1. **Payload 1 (Unauthenticated Project Modification)**: An unauthenticated request attempts to create, update, or delete a document in `/projects/{projectId}`.
2. **Payload 2 (Unauthenticated Inquiry Read)**: An unauthenticated visitor attempts to list or read documents in `/inquiries`.
3. **Payload 3 (Non-Admin Customer Data Harvester)**: A regular authenticated non-admin user attempts to read `/inquiries/{inquiryId}`.
4. **Payload 4 (Inquiry Modification)**: An unauthenticated visitor or non-admin attempts to edit or delete existing customer inquiries.
5. **Payload 5 (Oversized Inscription Attack)**: An attacker attempts to submit an inquiry with `description` exceeding 4000 characters or an injection string.
6. **Payload 6 (Shadow Field Injection on Project)**: An attacker attempts to write an unauthorized ghost field like `systemRole: "superuser"` to a project.
7. **Payload 7 (Unpublished Project Leak)**: An unauthenticated visitor attempts to read `/projects/draft-123` where `isPublished == false`.
8. **Payload 8 (Settings Defacement)**: An unauthenticated visitor attempts to overwrite `/settings/site_config` with malicious content.
9. **Payload 9 (Service Creation Attack)**: A non-admin user attempts to add a fake service to `/services/{serviceId}`.
10. **Payload 10 (Admin Role Self-Elevation)**: An unauthorized user attempts to create a document in `/admins/{their_uid}` to grant themselves admin privileges.
11. **Payload 11 (ID Poisoning Attack)**: An attacker attempts to create a document with an invalid or oversized document ID containing special path characters.
12. **Payload 12 (Client Claim Spoofing)**: A user with an unverified or forged token attempts admin operations without matching the admin record.
