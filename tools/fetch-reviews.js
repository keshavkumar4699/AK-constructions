#!/usr/bin/env node
/**
 * fetch-reviews.js — Google reviews ko assets/data/reviews.json mein save karta hai.
 *
 * Kya karta hai:
 *   Google Places API (New) se aapke business ki rating, review count aur
 *   up to 5 sabse relevant reviews (reviewer ka naam + text) fetch karta hai,
 *   aur assets/data/reviews.json mein likh deta hai. Website wahan se
 *   reviews auto-load karti hai (reviews.html, index.html, city pages).
 *
 * Chalaane se pehle: REVIEWS-GUIDE.md padhein (API key banane ke steps).
 *
 * Usage:
 *   Node.js 18+ chahiye.
 *   PowerShell:  $env:GOOGLE_PLACES_API_KEY="YOUR_KEY"; node tools/fetch-reviews.js
 *   Optional argument: apna Place ID pass karein agar default se alag ho:
 *   node tools/fetch-reviews.js 0xda0f634c2a05b771:0x39f21b749ead6003
 *
 * Note: Places API (New) free tier par reviews field ke saath at most 5 reviews
 * return karta hai. Saare 26+ reviews dikhane ke liye reviews.json mein manually
 * copy-paste karein (REVIEWS-GUIDE.md mein steps hain).
 */

const fs = require('fs');
const path = require('path');

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const PLACE_ID = process.argv[2] || '0xda0f634c2a05b771:0x39f21b749ead6003';
const OUT_FILE = path.join(__dirname, '..', 'assets', 'data', 'reviews.json');

if (!API_KEY) {
  console.error('ERROR: GOOGLE_PLACES_API_KEY env var set karein.');
  console.error('PowerShell: $env:GOOGLE_PLACES_API_KEY="YOUR_KEY"; node tools/fetch-reviews.js');
  console.error('Steps ke liye REVIEWS-GUIDE.md padhein.');
  process.exit(1);
}

const FIELD_MASK = 'rating,userRatingCount,reviews(text,rating,relativePublishTimeDescription,authorAttribution)';
const url = `https://places.googleapis.com/v1/places/${PLACE_ID}?fields=${FIELD_MASK}`;

async function main() {
  console.log('Google Places API se reviews fetch ho rahe hain...');
  const res = await fetch(url, {
    headers: {
      'X-Goog-Api-Key': API_KEY,
      'X-Goog-FieldMask': FIELD_MASK,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`ERROR: API ne ${res.status} return kiya.`);
    console.error(body);
    console.error('Check karein: API key sahi hai? Places API (New) enabled hai? Key Places API ke liye restricted hai?');
    process.exit(1);
  }

  const data = await res.json();

  const reviews = (data.reviews || []).map((r) => ({
    name: r.authorAttribution ? r.authorAttribution.displayName : 'Google User',
    rating: r.rating || 5,
    text: (r.text && r.text.text) ? r.text.text : '',
    time: r.relativePublishTimeDescription || ''
  }));

  const out = {
    source: 'Google Maps',
    placeId: PLACE_ID,
    rating: data.rating || null,
    reviewCount: data.userRatingCount || null,
    reviews: reviews,
    updated: new Date().toISOString()
  };

  fs.writeFileSync(OUT_FILE, JSON.stringify(out, null, 2) + '\n', 'utf8');
  console.log(`Ho gaya! ${reviews.length} review save hue: ${OUT_FILE}`);
  console.log(`Rating: ${out.rating} | Total reviews (Google): ${out.reviewCount}`);
  console.log('Note: API sirf 5 reviews deta hai. Baaki reviews manually add karne ke liye REVIEWS-GUIDE.md dekhein.');
}

main().catch((err) => {
  console.error('Unexpected error:', err.message);
  process.exit(1);
});
