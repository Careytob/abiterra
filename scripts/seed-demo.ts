// scripts/seed-demo.ts
//
// Fills a fresh database with generic, region-neutral sample listings so a
// demo (or a buyer's first run) looks populated instead of empty.
//
//   npm run seed:demo                    # seed 12 listings, sample inquiries & messages
//   npm run seed:demo -- --reset         # delete previously seeded demo data, then re-seed
//   npm run seed:demo -- --accounts      # also create demo ADMIN + AGENT logins (needs DEMO_PASSWORD)
//   npm run seed:demo -- --force         # allow seeding even if non-demo listings already exist
//
// Safety:
//  * Every seeded listing has a slug starting with "demo-"; --reset only touches those.
//  * Refuses to run if the database already holds real (non-demo) listings, unless --force.
//  * Demo accounts are NEVER created unless you pass --accounts AND set DEMO_PASSWORD.
//    Don't leave known-password admin accounts on a public site.
//
// Sample images come from scripts/seed-assets (illustrations by default). Drop in
// your own .webp/.jpg files with the same names to use real photos.
//
// Optional env:  SEED_CITY, SEED_REGION, SEED_PRICE_MULTIPLIER (e.g. 0.01 for a low-value currency),
//                DEMO_ADMIN_EMAIL, DEMO_AGENT_EMAIL, DEMO_PASSWORD
import './_env';
import fs from 'node:fs/promises';
import path from 'node:path';
import slugify from 'slugify';
import bcrypt from 'bcryptjs';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@/prisma/generated/client';
import { siteConfig } from '@/lib/site-config';

const prisma = new PrismaClient();
const BUCKET = 'properties';
const SLUG_PREFIX = 'demo-';
const ASSET_DIR = path.join(process.cwd(), 'scripts', 'seed-assets');

const args = new Set(process.argv.slice(2));
const RESET = args.has('--reset');
const ACCOUNTS = args.has('--accounts');
const FORCE = args.has('--force');

const CITY = process.env.SEED_CITY?.trim() || 'Riverside';
const REGION = process.env.SEED_REGION?.trim() || 'Central Region';
const MULT = Number(process.env.SEED_PRICE_MULTIPLIER) > 0 ? Number(process.env.SEED_PRICE_MULTIPLIER) : 1;

type Variant = 'modern' | 'gabled' | 'apartment' | 'villa' | 'townhouses' | 'bungalow';
type Tone = 'day' | 'dusk';

interface Seed {
  title: string;
  type: 'SALE' | 'RENT';
  /** Sale price, or MONTHLY rent, in the base currency before SEED_PRICE_MULTIPLIER. */
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  neighbourhood: string;
  variant: Variant;
  tone: Tone;
  featured?: boolean;
  pending?: boolean;
  byAgent?: boolean;
  features: string[];
  description: string;
}

const SEEDS: Seed[] = [
  { title: 'Modern Glass-Front Family Home', type: 'SALE', price: 685000, bedrooms: 4, bathrooms: 3, areaSqft: 2800, neighbourhood: 'Maple Heights', variant: 'modern', tone: 'day', byAgent: true,
    features: ['Open-plan living', 'Home office', 'Double garage', 'Solar panels', 'Landscaped garden'],
    description: 'A bright, contemporary family home with floor-to-ceiling windows, an open-plan kitchen and living area, and a private garden. Close to schools, parks and transport links.' },
  { title: 'Classic Brick Home with Garden', type: 'SALE', price: 520000, bedrooms: 4, bathrooms: 3, areaSqft: 2400, neighbourhood: 'Old Town', variant: 'gabled', tone: 'day',
    features: ['Fireplace', 'Original hardwood floors', 'Mature garden', 'Driveway parking'],
    description: 'A well-kept traditional home on a quiet tree-lined street. Generous bedrooms, a sunny garden and plenty of character throughout.' },
  { title: 'Skyline View 2-Bedroom Apartment', type: 'SALE', price: 310000, bedrooms: 2, bathrooms: 2, areaSqft: 1150, neighbourhood: 'Downtown', variant: 'apartment', tone: 'day',
    features: ['City views', 'Secure entry', 'Elevator', 'Gym access', 'Balcony'],
    description: 'A light-filled apartment on a high floor with panoramic views, a modern kitchen and building amenities including a gym and secure entry.' },
  { title: 'Lakeside Villa with Private Pool', type: 'SALE', price: 1250000, bedrooms: 5, bathrooms: 4, areaSqft: 4200, neighbourhood: 'Lakeside', variant: 'villa', tone: 'day', featured: true, byAgent: true,
    features: ['Private pool', 'Lake access', 'Home cinema', 'Guest suite', 'Smart-home wiring', 'Three-car garage'],
    description: 'A standout waterside villa with a private pool, entertaining terraces and a self-contained guest suite. Designed for relaxed, high-end family living.' },
  { title: 'Renovated Townhouse near Central Station', type: 'SALE', price: 395000, bedrooms: 3, bathrooms: 2, areaSqft: 1650, neighbourhood: 'Station Quarter', variant: 'townhouses', tone: 'day',
    features: ['Newly renovated', 'Courtyard', 'Walk to transit', 'Fitted kitchen'],
    description: 'A freshly renovated three-bedroom townhouse a short walk from the station, with a private courtyard and a new fitted kitchen.' },
  { title: 'Cozy Garden Bungalow', type: 'SALE', price: 255000, bedrooms: 2, bathrooms: 1, areaSqft: 1100, neighbourhood: 'Greenfield', variant: 'bungalow', tone: 'dusk',
    features: ['Single storey', 'Large garden', 'Covered porch', 'Quiet street'],
    description: 'A charming single-storey bungalow with a generous garden and covered porch. Easy to maintain and ideal for first-time buyers or downsizers.' },
  { title: 'Executive Duplex in Gated Community', type: 'SALE', price: 740000, bedrooms: 4, bathrooms: 4, areaSqft: 3100, neighbourhood: 'The Gardens', variant: 'modern', tone: 'dusk', featured: true,
    features: ['Gated community', '24/7 security', 'Clubhouse', 'Private terrace', 'Two parking bays'],
    description: 'A spacious duplex inside a secure gated community with a clubhouse and landscaped grounds. Four en-suite-style bedrooms and a private terrace.' },
  { title: 'Starter Apartment, Walk to Shops', type: 'SALE', price: 189000, bedrooms: 1, bathrooms: 1, areaSqft: 720, neighbourhood: 'Market Street', variant: 'apartment', tone: 'dusk',
    features: ['Walk to shops', 'Laundry on site', 'Secure bike storage'],
    description: 'An efficient one-bedroom apartment steps from shops, cafes and public transport. A practical first home or investment.' },
  { title: 'Family Home with Large Yard', type: 'SALE', price: 460000, bedrooms: 3, bathrooms: 2, areaSqft: 2050, neighbourhood: 'Willow Park', variant: 'gabled', tone: 'dusk', featured: true,
    features: ['Large fenced yard', 'Finished basement', 'Near schools', 'Updated roof'],
    description: 'A comfortable three-bedroom family home on a large fenced lot, close to well-regarded schools and the neighbourhood park.' },
  { title: 'Spacious Townhouse (Awaiting Review)', type: 'SALE', price: 365000, bedrooms: 3, bathrooms: 3, areaSqft: 1800, neighbourhood: 'Station Quarter', variant: 'townhouses', tone: 'dusk', pending: true, byAgent: true,
    features: ['Roof terrace', 'Integral garage'],
    description: 'Submitted by an agent and waiting in the moderation queue. Approve or reject it from the admin dashboard to see the workflow.' },
  { title: 'Bright 2-Bedroom Apartment for Rent', type: 'RENT', price: 1850, bedrooms: 2, bathrooms: 1, areaSqft: 950, neighbourhood: 'Downtown', variant: 'apartment', tone: 'day',
    features: ['Pet friendly', 'Dishwasher', 'In-unit laundry'],
    description: 'A bright, well-located two-bedroom rental with modern appliances. Pets considered. (Rentals module — enable with NEXT_PUBLIC_ENABLE_RENTALS=true.)' },
  { title: 'Garden Bungalow for Rent', type: 'RENT', price: 2400, bedrooms: 3, bathrooms: 2, areaSqft: 1400, neighbourhood: 'Greenfield', variant: 'bungalow', tone: 'day',
    features: ['Private garden', 'Off-street parking'],
    description: 'A three-bedroom bungalow with a private garden and off-street parking, available for a long-term let. (Rentals module.)' },
];

function die(msg: string): never {
  console.error(`\n✖ ${msg}\n`);
  process.exit(1);
}

function rentFactor(): number {
  return siteConfig.rentPeriod === 'year' ? 12 : siteConfig.rentPeriod === 'week' ? 0.25 : 1;
}

function round(n: number, step: number): number {
  return Math.round(n / step) * step;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) die('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env (see .env.example).');
  if (!process.env.DATABASE_URL) die('Set DATABASE_URL in .env (see .env.example).');
  if (ACCOUNTS && (process.env.DEMO_PASSWORD ?? '').length < 10) {
    die('--accounts needs DEMO_PASSWORD (at least 10 characters) set in your environment.');
  }

  const supabase = createClient(url, key);

  // Make sure the private storage bucket exists (first-run convenience).
  const { data: bucket } = await supabase.storage.getBucket(BUCKET);
  if (!bucket) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
    if (error) die(`Could not create storage bucket "${BUCKET}": ${error.message}`);
    console.log(`Created private storage bucket "${BUCKET}".`);
  }

  // ---- Safety checks -------------------------------------------------------
  const realCount = await prisma.property.count({ where: { NOT: { slug: { startsWith: SLUG_PREFIX } } } });
  if (realCount > 0 && !FORCE) {
    die(`This database already has ${realCount} non-demo listing(s). Refusing to seed. Use --force if you really want to add demo data alongside them.`);
  }

  const existingDemo = await prisma.property.findMany({
    where: { slug: { startsWith: SLUG_PREFIX } },
    select: { id: true, slug: true },
  });

  if (existingDemo.length && !RESET) {
    console.log(`Demo data is already present (${existingDemo.length} listings). Use --reset to delete and recreate it.`);
    return;
  }

  // ---- Reset (demo rows only) ---------------------------------------------
  if (RESET && existingDemo.length) {
    for (const p of existingDemo) {
      const { data: files } = await supabase.storage.from(BUCKET).list(`images/properties/${p.slug}`);
      if (files?.length) {
        await supabase.storage.from(BUCKET).remove(files.map((f) => `images/properties/${p.slug}/${f.name}`));
      }
    }
    await prisma.property.deleteMany({ where: { slug: { startsWith: SLUG_PREFIX } } }); // cascades images, features, inquiries
    await prisma.contact.deleteMany({ where: { email: { endsWith: '@example.com' } } });
    console.log(`Removed ${existingDemo.length} previous demo listings.`);
  }

  // ---- Optional demo accounts ---------------------------------------------
  let agentId: string | null = null;
  if (ACCOUNTS) {
    const password = await bcrypt.hash(process.env.DEMO_PASSWORD as string, 10);
    const adminEmail = process.env.DEMO_ADMIN_EMAIL?.trim() || 'admin@demo.example';
    const agentEmail = process.env.DEMO_AGENT_EMAIL?.trim() || 'agent@demo.example';
    await prisma.user.upsert({
      where: { email: adminEmail },
      update: { role: 'ADMIN', password },
      create: { name: 'Demo Admin', email: adminEmail, password, role: 'ADMIN' },
    });
    const agent = await prisma.user.upsert({
      where: { email: agentEmail },
      update: { role: 'AGENT', password },
      create: { name: 'Demo Realty', email: agentEmail, password, role: 'AGENT' },
    });
    agentId = agent.id;
    console.log(`Demo accounts ready: ${adminEmail} (ADMIN), ${agentEmail} (AGENT).`);
  }

  // ---- Listings -------------------------------------------------------------
  const created: { id: string; slug: string; pending: boolean; type: string }[] = [];
  let i = 0;
  for (const s of SEEDS) {
    const slug = `${SLUG_PREFIX}${slugify(s.title, { lower: true, strict: true })}`;
    const files = [
      { file: `${s.variant}-${s.tone}.webp`, name: 'front-1.webp', imagetype: 'front', ismain: true },
      { file: `${s.variant}-${s.tone === 'day' ? 'dusk' : 'day'}.webp`, name: 'photo-2.webp', imagetype: 'other', ismain: false },
    ];

    const images: { url: string; filepath: string; imagetype: string; ismain: boolean; createdat: Date }[] = [];
    for (const f of files) {
      const buf = await fs.readFile(path.join(ASSET_DIR, f.file)).catch(() => die(`Missing sample image scripts/seed-assets/${f.file}`));
      const filepath = `images/properties/${slug}/${f.name}`;
      const { error } = await supabase.storage.from(BUCKET).upload(filepath, buf, { contentType: 'image/webp', upsert: true });
      if (error) die(`Upload failed for ${filepath}: ${error.message}`);
      const { data: signed, error: signErr } = await supabase.storage.from(BUCKET).createSignedUrl(filepath, 31536000);
      if (signErr || !signed?.signedUrl) die(`Could not sign ${filepath}: ${signErr?.message}`);
      images.push({ url: signed.signedUrl, filepath, imagetype: f.imagetype, ismain: f.ismain, createdat: new Date() });
    }

    const price = s.type === 'RENT' ? round(s.price * rentFactor() * MULT, 1) : round(s.price * MULT, 1);
    const area = siteConfig.areaUnit === 'sqm' ? Math.round(s.areaSqft * 0.0929) : s.areaSqft;
    const lat = siteConfig.map.latitude + ((i % 4) - 1.5) * 0.012;
    const lng = siteConfig.map.longitude + (Math.floor(i / 4) - 1) * 0.018;

    const row = await prisma.property.create({
      data: {
        title: s.title,
        slug,
        description: s.description,
        location: `${s.neighbourhood}, ${CITY}`,
        price,
        type: s.type,
        status: 'AVAILABLE',
        availability: true,
        area,
        bedrooms: s.bedrooms,
        bathrooms: s.bathrooms,
        bq: 0,
        toilets: 0,
        city: CITY,
        state: REGION,
        latitude: lat,
        longitude: lng,
        isfeatured: !!s.featured,
        agentid: 'Demo Realty',
        publishstatus: s.pending ? 'PENDING' : 'PUBLISHED',
        listedby: s.byAgent ? agentId : null,
        image: { create: images },
        feature: { create: s.features.map((name) => ({ name })) },
      },
      select: { id: true, slug: true },
    });
    created.push({ ...row, pending: !!s.pending, type: s.type });
    console.log(`  + ${s.title}`);
    i++;
  }

  // ---- Sample inquiries & contact messages (so the admin screens aren't empty)
  const published = created.filter((c) => !c.pending && c.type === 'SALE');
  const inquiries = [
    { name: 'Alex Morgan', email: 'alex.morgan@example.com', phone: '+1 555 0100', status: 'PENDING', message: 'Hi, is this property still available? I would like to arrange a viewing this weekend.' },
    { name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+1 555 0111', status: 'REVIEWED', message: 'Could you share the service charges and whether the price is negotiable?' },
    { name: 'Daniel Okafor', email: 'daniel.okafor@example.com', phone: '+1 555 0122', status: 'CONTACTED', message: 'We are relocating next quarter. Can you send a floor plan and recent inspection report?' },
    { name: 'Sofia Hernandez', email: 'sofia.hernandez@example.com', phone: '+1 555 0133', status: 'PENDING', message: 'Interested in making an offer. Who is the best person to speak to?' },
  ];
  for (let n = 0; n < inquiries.length && published.length; n++) {
    await prisma.inquiry.create({
      data: { ...inquiries[n], propertyid: published[n % published.length].id, createdat: new Date(Date.now() - n * 36 * 3600 * 1000) },
    });
  }
  await prisma.contact.createMany({
    data: [
      { firstName: 'Jordan', lastName: 'Lee', email: 'jordan.lee@example.com', phone: '+1 555 0144', inquiry: 'BUYING', message: 'Do you list properties outside the city centre?', status: 'PENDING' },
      { firstName: 'Mei', lastName: 'Tan', email: 'mei.tan@example.com', phone: null, inquiry: 'OTHER', message: 'How can I become a listing agent on your platform?', status: 'REVIEWED' },
    ],
  });

  console.log(`\n✔ Seeded ${created.length} listings (${created.filter((c) => c.pending).length} pending review), ${inquiries.length} inquiries and 2 messages.`);
  console.log(`  Currency: ${siteConfig.currency} (${siteConfig.locale}) · Area unit: ${siteConfig.areaUnit} · Map centre: ${siteConfig.map.latitude}, ${siteConfig.map.longitude}`);
  if (!ACCOUNTS) {
    console.log('  Tip: create an account at /signup, then run  npm run admin:promote -- you@example.com  to get the admin dashboard.');
  }
}

main()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
