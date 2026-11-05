# Project rules — protect content edited on the live site

The site owner edits content directly on the live site (admin mode). That content lives in
Netlify Database (production branch) and Netlify Blobs, NOT in this repository. Any code change
must keep that data intact.

## Never
- Never delete, truncate, reset or re-seed rows in `story_stages`, `contacts`, `logs`,
  `site_content`, `attitudes`, `attitude_types`. No migration may contain `DELETE`, `TRUNCATE`,
  `DROP TABLE`, `DROP COLUMN` or a blanket `UPDATE` on these tables unless the owner explicitly asks.
- Never edit, rename or delete an existing migration. Only add new, additive migrations.
- Never delete or overwrite the `avatars` blob store (`profile-photo` key).

## `data-edit` keys in index.html are permanent IDs
Edited static texts are stored in `site_content` keyed by the element's `data-edit` value.
If a key changes or disappears, the owner's edit silently disappears from the page.
- When moving, swapping or restyling sections, move the `<span data-edit="...">` elements with
  their existing keys unchanged.
- Never rename or regenerate an existing key, even if the default text inside it changes.
- New editable texts get a new, unique key that has never been used before.
- If a text must be removed from the page, ask the owner first (their edit for it would be lost).
