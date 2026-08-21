# AK Construction — akconstructionhomedesign.com

Begusarai, Bihar based home design & construction company ki static website.
No build tool — sab pages ready-to-deploy HTML hain.

## Pages
- index.html · services.html · projects.html · reviews.html · about.html · loan.html · contact.html
- 7 city pages: begusarai · samastipur · khagaria · patna · mokama · lakhisarai · munger

## Local preview
```
python -m http.server 8000
```
phir http://localhost:8000 kholen (reviews loader file:// par nahi chalta).

## Deploy (Netlify)
1. Ye folder GitHub par push karein
2. Netlify → New site from Git → repo select karein (build command khaali chhod dein)
3. Domain: akconstructionhomedesign.com
4. Search Console mein sitemap.xml submit karein

## Reviews
`assets/data/reviews.json` → REVIEWS-GUIDE.md dekhein (Places API script + manual copy steps).

## Google Maps #1
GOOGLE-MAPS-CHECKLIST.md — step-by-step GBP optimization plan.
