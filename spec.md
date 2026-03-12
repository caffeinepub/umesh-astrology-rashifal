# Umesh Astrology Rashifal Card Generator

## Current State
New project — no existing code.

## Requested Changes (Diff)

### Add
- Daily rashifal (horoscope) for 12 zodiac signs in Hindi
- Beautiful cosmic/astrology-themed Instagram-ready card UI
- Date picker to select date for the rashifal
- Management panel to edit rashifal content per rashi per date
- Display WhatsApp number +91 9654123331 and Instagram ID umesh.astrology prominently
- Each rashi card with symbol, name, and detailed Hindi prediction text
- Share/screenshot-ready layout

### Modify
- N/A

### Remove
- N/A

## Implementation Plan

### Backend
- Store rashifal entries: { date: Text, rashi: Text, prediction: Text }
- CRUD: createOrUpdateRashifal, getRashifalByDate, getAllDates
- Seed with sample Hindi predictions for 13/03/2026 for all 12 rashis
- Authorization: admin role for management panel access

### Frontend
- Two views: Card View (public Instagram-ready) and Admin Panel
- Card View: cosmic gradient background, date display, 12 rashi cards in grid with symbols and Hindi text
- Admin Panel: date picker, text areas for each rashi's prediction, save button
- Branding: WhatsApp +91 9654123331, Instagram umesh.astrology on every card view
- Rashi symbols: ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓
