# REVIEWS-GUIDE.md — Google Reviews Website Par Kaise Dikhayein

Aapki website (reviews.html, index.html aur 7 city pages) `assets/data/reviews.json` se reviews
auto-load karti hai. Is file mein reviews daalne ke 3 tareeke:

| Tareeka | Kitne reviews | Mehnat | Kab use karein |
|---|---|---|---|
| A. Script (Places API) | 5 (Google ki limit) | 10 minute | Pehli baar setup |
| B. Manual copy-paste | Jitne chahein (115+) | 15-20 minute | Behtar result ke liye |
| C. Dono saath mein | Sab | Dono | Recommended |

---

## Tareeka A — Script se (Places API, New)

### Step 1: Google Cloud project banayein
1. https://console.cloud.google.com/ par jaayein, apne Google account se login karein.
2. Top par project selector mein click karke **New Project** banayein (naam: `ak-construction-reviews`).
3. Billing enable karna Google puchhega — **free tier kaafi hai** (Places API har month 200M free
   "refreshed daily" credits deta hai; ek chhoti site ke liye kharach ₹0 hai). Card add karna pare
   to add kar lein — jab tak heavy usage nahi, charge nahi lagega.

### Step 2: Places API (New) enable karein
1. Console mein **APIs & Services → Library** kholen.
2. Search karein **Places API (New)** — click karein → **Enable**.

### Step 3: API key banayein (restricted!)
1. **APIs & Services → Credentials → Create Credentials → API key**.
2. Key copy kar lein.
3. Usi key par **Restrict key** karein:
   - **Application restrictions**: *HTTP referrers* → add karein `https://akconstructionhomedesign.com/*` aur `http://localhost/*` (local test ke liye).
   - **API restrictions**: *Restrict key* → select karein sirf **Places API (New)**.
4. Save. Yeh zaruri hai — warna koi bhi aapki key chura kar use kar sakta hai.

### Step 4: Script chalayein
Node.js 18+ chahiye (https://nodejs.org se install karein). PowerShell mein:

```powershell
$env:GOOGLE_PLACES_API_KEY="YOUR_API_KEY"
node tools/fetch-reviews.js
```

Output: `assets/data/reviews.json` mein rating, review count aur 5 reviews likh diye jaate hain.
Website (Netlify par) khud unhe render karegi.

Local check: `index.html` ko browser mein khol kar reviews.html dekhein — file:// protocol par
fetch block hota hai, isliye local test ke liye ek local server use karein:

```powershell
python -m http.server 8000
```

phir `http://localhost:8000/reviews.html` kholen.

---

## Tareeka B — Manual copy-paste (saare 115+ reviews ke liye)

Places API **max 5 reviews** deta hai (Google ki limitation, hamari nahi). Saare reviews dikhane hain to:

1. Phone ya computer par **Google Maps** kholen → apni listing "AK Construction (Home Designing)"
   search karein → **Reviews** section kholen.
2. Har review ka naam, star count aur text copy karein.
3. `assets/data/reviews.json` mein `"reviews": []` ke andar is format mein daalein:

```json
{
  "name": "Rahul Kumar",
  "rating": 5,
  "text": "AK Construction ne hamara ghar time par banaya, kaam kaafi achha hai.",
  "time": "2 months ago"
}
```

(Comma se alag karein, last item ke baad comma nahi. JSON format check karne ke liye
https://jsonlint.com use kar sakte hain.)

**Tip:** Reviews ko order mein rakhein — sabse accha review sabse upar. 6-8 reviews kaafi hain,
saare 26 ki zarurat nahi. Har 2-3 mahine mein 1-2 naye reviews add karte rahein.

---

## Tareeka C — Recommended: Script + Manual

Script se 5 fresh reviews aa jaate hain, phir manual copy se aur 3-5 behtareen reviews upar add
kar dein. `reviews.json` mein dono merge ho jaate hain.

---

## IMANDAR NOTE (Google ki limit)

- **Places API sirf 5 reviews deta hai** — chahe aapke paas 100 hon. Yeh Google ka rule hai.
- Google Takeout se bhi aapke *received* reviews ka full text nahi milta (sirf count/profile data
  milta hai). Isliye manual copy hi ek rasta hai full text ke liye.
- Justdial ke 115 reviews bhi manual hi copy karne honge (Justdial ka koi free API nahi).
- Website par rating summary (4.9★, 115 reviews) hamesha dikhta hai — wo static hai, reviews.json
  par depend nahi karta. Isliye reviews ke bina bhi site puri tarah theek dikhegi.

---

## Troubleshooting

| Problem | Solution |
|---|---|
| `401` ya `403` error | API key galat hai ya restrict karte waqt Places API (New) select nahi hua. |
| `API_KEY_NOT_VALID` | Env var set karna bhool gaye — `$env:GOOGLE_PLACES_API_KEY` check karein. |
| Reviews site par nahi dikh rahe | reviews.json invalid JSON ho sakta hai — jsonlint.com par validate karein. |
| Local par dikh raha, Netlify par nahi | Netlify deploy karna bhool gaye — netlify dashboard se deploy karein. |
| 0 reviews aaye | Naya business profile ho to reviews Google par abhi hain hi nahi. Manual tareeka B use karein. |
