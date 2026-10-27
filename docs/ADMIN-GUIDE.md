# Admin and agent guide

For the people who run the site day to day. No coding needed.

## Who can do what

| Role | How they get it | What they can do |
|---|---|---|
| **Visitor** | Nothing needed | Browse, search, view the map, send an enquiry as a guest |
| **Buyer / renter** (`USER`) | Signs up at `/signup` | Same as a visitor, with their details pre-filled on enquiries |
| **Agent / property owner** (`AGENT`) | Signs up and chooses the agent account type | Submit and edit their own listings, read and handle enquiries on them |
| **Admin** (`ADMIN`) | An existing account promoted with `npm run admin:promote -- email` | Everything: all listings, approvals, all enquiries and messages, Settings |

To make an agent account an admin (or the reverse), run the promote command with the role: `npm run admin:promote -- email AGENT`.
After a role change the person must log out and in again.

## How listings are approved

1. An agent creates a listing. It is saved as **Pending** and is **not** visible to the public.
2. An admin opens **Admin → Properties**, filters by **Pending**, reviews it, then **Approves** or **Rejects** it
   (add a reason when rejecting; the agent sees it).
3. Approved listings are **Published** and appear on the site.
4. If an agent edits a Published listing, it returns to **Pending** until an admin approves the change again.

Listings an admin creates are published immediately.

## Handling enquiries

- A visitor or signed-in user sends an enquiry from a property page. It is stored against that property.
- The **listing agent** sees it under **Agent → Inquiries**, and also receives an email if email is configured.
  Enquiries on admin-created listings go to **Admin → Inquiries**.
- A badge on the Inquiries link counts new enquiries. Use **Reply by email**, **Call**, then **Mark as contacted**.
- Agents cannot send an enquiry about their own listing.
- General messages from the Contact page appear under **Admin → Messages**.
- Phone or WhatsApp leads can be logged under **Admin → Inquiries** so everything is in one place.

## Settings

**Admin → Settings** controls how prices, sizes and rents are shown.

1. Pick your country in **Quick setup** to fill in sensible defaults, or set each field yourself.
2. Check the **Preview** panel.
3. Click **Save settings**. The site updates everywhere; **Reset to defaults** undoes your changes.

Changing the size unit or rent period only changes the labels. If you switch from square feet to square metres,
update the numbers on your listings to match.

## Adding a listing (admin)

**Admin → Properties → Add property.** Fill in the details, set the location (the map uses the coordinates), add
photos (the first one added is the cover photo), and choose Sale or Rent. Tick **Featured** to show the listing first in the
**Featured Properties** section of the home page; the other places there are filled with the newest listings.

## Content you manage

- **Blog:** add Markdown files to `content/blog/` (see [CUSTOMIZING.md](CUSTOMIZING.md)).
- **About, Contact, legal pages:** edit the files under `app/aboutus`, `app/contact`, `app/privacy-policy`,
  `app/terms-and-conditions`. The legal pages are **templates, not legal advice**: have them reviewed.
