# Umesh Astrology Rashifal

## Current State
App has: daily rashifal cards (12 rashis), admin panel for daily updates, rashi ratna (gemstone remedies) page, sharing features for individual/all rashifal cards.

## Requested Changes (Diff)

### Add
- New "कुंडली मिलान" (Kundali Milan) page accessible via button on main page
- Input form for Var (Groom) and Vadhu (Bride): name, date of birth, time of birth, place of birth
- Astrological calculation engine (frontend-only):
  - Rashi (Moon sign), Nakshatra, Lagna (Ascendant) for each person
  - Ruling planet, element, gana, varna
- Guna Milan scoring (36 total gunas across 8 kootas):
  1. Varna (1 point)
  2. Vashya (2 points)
  3. Tara (3 points)
  4. Yoni (4 points)
  5. Graha Maitri (5 points)
  6. Gana (6 points)
  7. Bhakoot (7 points)
  8. Nadi (8 points)
- Result display:
  - Score out of 36 with compatibility verdict in Hindi
  - Detailed table showing each koota's score
  - Full astrological details for Var and Vadhu side-by-side
  - Mangal Dosha check for both
  - Overall compatibility recommendation
- Share report button: generates text summary, uses native share API on mobile, clipboard on desktop

### Modify
- App.tsx: Add "kundali" to View type, add navigation button on main CardView
- CardView.tsx: Add "🔯 कुंडली मिलान" button near the ratna button

### Remove
- Nothing removed

## Implementation Plan
1. Create KundaliMilan.tsx component with input form, calculation logic, and results display
2. Update App.tsx to include kundali view
3. Update CardView.tsx to add navigation button
