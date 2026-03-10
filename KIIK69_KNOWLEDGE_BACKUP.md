# KIIK 69 Sports Bar – Full Knowledge & Data Backup

**Purpose:** Use this file when rebuilding the website from scratch. Contains all business data, menu, packages, and structure.

---

## 1. Business Information

- **Name:** KIIK 69 Sports Bar
- **Tagline:** THE ULTIMATE EXPERIENCE - Bowling. Beer. Beats. All in One Place
- **Alternative tagline:** Bowling, Food & Drinks in Gachibowli
- **Description:** Premier sports bar and entertainment venue in Gachibowli, Hyderabad. Sports viewing, gaming, dining, nightlife.
- **Location:** Gachibowli, Hyderabad
- **Google Maps:** https://maps.app.goo.gl/7fnCVGpoy7rqxjAz5

---

## 2. Contact Information

| Type | Value |
|------|-------|
| Phone | +919274696969 |
| WhatsApp | https://wa.me/919274696969 |
| Instagram | https://www.instagram.com/kiik69sportsbar.gachibowli/ |
| Book table / inquiries | WhatsApp with pre-filled message |

---

## 3. Timings

- **Sunday–Thursday:** 11:00 AM to 11:30 PM
- **Friday & Saturday:** 11:00 AM to 1:00 AM
- Extended hours on weekends

---

## 4. Party Packages (Gaming / Event Packages)

Primary packages for parties and events:

| Name | Price (₹) | Description |
|------|-----------|-------------|
| Power Play | 2999 | Small groups, 2hrs gaming, soft drinks, snacks, 2 consoles, up to 8 people |
| Game Changer | 5999 | 4hrs gaming, beverages, deluxe snacks, DJ, tournament, 4 consoles + 2 PCs, up to 15 |
| World Cup Edition | 9999 | 6hrs, all-inclusive, disco, multiple zones, host, photo booth, up to 25 |
| VIP Experience | 14999 | 8hrs, gourmet food, full bar, private lounge, DJ, VIP parking, up to 30 |
| Student Special | 1999 | 3hrs, soft drinks, basic snacks, 2 consoles, student ID, up to 6 |
| Corporate Package | 12999 | 6hrs corporate, catering, projector, team building, up to 40 |

### Power Play features
- 2 hours unlimited gaming
- Unlimited soft drinks & mocktails
- Deluxe snacks platter (Crispy Corn, Paneer Tikka, French Fries)
- Basic sound system & LED lighting
- Access to 2 gaming consoles
- Up to 8 people, Free WiFi

### Game Changer features
- 4 hours premium gaming
- Unlimited beverages (soft drinks, mocktails, energy drinks)
- Deluxe snacks & starters (Chicken Wings, Spring Rolls, Nachos)
- Premium sound system with DJ setup
- Gaming tournament with prizes
- Access to 4 consoles + 2 PCs
- Up to 15 people, Free WiFi, Photo booth

### World Cup Edition features
- 6 hours unlimited gaming & entertainment
- All-inclusive food & beverages (incl. alcohol)
- Premium sound & lighting, disco effects
- Multiple gaming zones (consoles, PCs, VR)
- Dedicated host & DJ, Photo booth, Custom decorations
- Up to 25 people, Free WiFi, Parking assistance

### VIP Experience features
- 8 hours premium gaming
- Gourmet food & full bar
- Private gaming lounge
- Professional DJ
- Custom decorations & theme
- Dedicated staff
- VIP parking & valet
- Up to 30 people

### Student Special features
- 3 hours gaming
- Unlimited soft drinks
- Basic snacks (Popcorn, Chips, Cookies)
- 2 gaming consoles, Student ID required
- Up to 6 people

### Corporate Package features
- 6 hours corporate gaming
- Professional catering (veg options)
- Projector & screen
- Team building & tournaments
- Dedicated event coordinator
- Up to 40 people

---

## 5. Buffet / Eat & Drink Packages (Knowledge Base)

Different product line – buffet-style packages:

| Package | Price | Badge |
|---------|-------|-------|
| Power Play | ₹1300 (was ₹1800, 28% OFF) | POPULAR |
| Super Sixer | ₹1800 (was ₹2400, 25% OFF) | BEST VALUE |
| The Hat-trick | ₹2100 (was ₹2800, 25% OFF) | PREMIUM |
| Master Blaster | ₹2500 (was ₹3200, 22% OFF) | ELITE |
| Champions League | ₹2900 (was ₹3800, 24% OFF) | VIP |
| Hall of Fame | Premium | ULTIMATE VIP |

Includes bar snacks, starters, main course, desserts, games (Carroms, Pool, Foosball), drinks as per package.

---

## 6. Menu Data (Food)

### Food categories
All, Starters, Burger, Sandwich, Pizza, Extras, Pasta, Indian, Chinese, Rice

### Food items (67 total)

Full JSON in `KIIK69_MENU_DATA.json` in same folder. Structure:
- Each item: `{ id, name, price, category, description, image }`
- Categories: Starters (1–24), Burger (25–28), Pizza (29–34), Extras (35–42), Pasta (43–45), Indian (46–53), Chinese (54–58), Rice (59–67)

---

## 7. Menu Data (Liquor)

### Liquor categories
All, Vodka, Gin, Brandy, Rum, Alcopop, Tequila, Liqueurs, Blended Whiskey, Single Malts, American/Irish Whiskey, Wines, Sparkling Wine, Ice Teas, Modern Classics, Shots, Mocktails, Aerated Beverages, Soft Beverages, Drink & Munch at 69, Draught & Craft Beer

### Liquor items (106 total)

Full JSON in `KIIK69_MENU_DATA.json`. IDs 101–206.

---

## 8. Games & Entertainment

- Indoor: Carroms, Pool, Foosball
- Bowling: Extra charge
- Sports viewing: Large screens
- Music: Live music
- Dance floor: In select packages

---

## 9. Policies

- Dress: Casual / Smart Casual
- Age: Alcohol 21+
- Booking: 25 min, 50% advance
- Cancellation: Standard policy

---

## 10. Environment Variables (Next.js)

```bash
# .env.local
# Database (PostgreSQL – Neon/Supabase)
DATABASE_URL_PRIVATE=
DATABASE_URL_PUBLIC=

# OpenAI (if chat/AI used)
OPENAI_API_KEY=

# Vercel / frontend
NEXT_PUBLIC_*  # prefix for client-side vars
```

---

## 11. Public Assets to Keep

- `/public/logos/` – Logo
- `/public/menu/` – FoodMenu.jpeg, LIquorMenu.jpeg, eat and drink folder
- `/public/videos/` – Hero video
- `/public/images/packages/` – Package images

---

## 12. Site Structure (Previous)

- Home: Hero, Live Status, Bowling Pricing, Games, Menu, Party Packages, Contact
- Booking: `/booking` – Table/package booking
- Sections: home, games-section, menu-section, party-packages, contact-section, vibes, policies-section, booking-section

---

## 13. Features to Rebuild

1. Hero with video background
2. Navbar with scroll-to-section
3. Menu (Food + Liquor) with categories and images
4. Party packages grid with WhatsApp booking
5. Games section
6. Bowling pricing
7. Contact / footer (phone, WhatsApp, Instagram, map)
8. Optional: AI chat, booking flow
9. Mobile-first, smooth scroll, iOS-friendly
