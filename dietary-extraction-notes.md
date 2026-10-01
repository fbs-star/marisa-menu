# Dietary badge PDF extraction notes (working file, in progress)

Source: "Menu Marisa.pdf" (Google Drive, 47 pages)
Icon catalog confirmed via page 5/6 text legend:
- Spicy = gold curved bird/paw/leaf shape
- Gluten-Free = circle containing wheat/grain stalk
- Vegan = single leaf/sprout "Y" shape
- Contains Pork = circle containing pig face (two nostril dots)
- Contains Shell = curled shrimp/prawn silhouette
(Exclude: circular gold "thumbs-up" ribbon = restaurant's own "recommended" marker, NOT dietary.
Exclude: protein-choice pictograms next to a priced protein option, e.g. Chicken/Prawns choice icons.)

Pages with per-item badges (per earlier text-extraction pass): 5,6,7,9,17,19,21,22,23,26,27,28,29,30,31
Pages 34-47 = Theme Night set menus, no per-item badges needed.

## Per-page findings
(fill in as extracted: "Item Name — Spicy/GF/Vegan/Pork/Shell/none")


### Page 7 — SOUPS
- Tom Yum (prawns, mushroom) — icon: Spicy (bird/paw shape). Confirmed correct (also contains prawns -> should get Contains Shell too, PDF shows no shell icon here -> ADD Contains Shell).
- Black Truffle Soup (wild mushroom, truffle paste, Parmesan bread) — icon shown: Vegan (leaf). CONFLICT: contains Parmesan (dairy cheese) + bread -> NOT vegan. CORRECTION: remove Vegan.
- Tom Kha Gai (chicken, coconut cream, galangal, mushroom) — icon: Gluten-Free (wheat-in-circle). Correct, no conflict. (Also has the gold thumbs-up "recommended" ribbon — not dietary, ignore.)

### Page 9 — FLAME GRILLED
- New York Strip (Australian Wagyu beef striploin, veg, potatoes, peppercorn sauce) — no icon. No conflict.
- Fillet Mignon (Wagyu beef tenderloin, veg, potatoes, red wine sauce) — no icon (has recommended ribbon only). No conflict.
- Organic Pork Chop (char-grilled veg, potatoes, wild mushroom sauce) — icon: Contains Pork (pig-in-circle). Correct.
- Grilled Lamb Chop (veg, potatoes, lamb jus) — no icon. No conflict.
- Roasted Half Baby Chicken (veg, potatoes, tarragon jus) — no icon. No conflict.
- Grilled Sea Bass Fillet (sautéed/lyonnaise potatoes, char-grilled tomato, dill beurre blanc) — icon: Gluten-Free. Correct.

### Page 17 — THAI MAIN DISH (Recommend)
- Meuk Phad Khai Khem (stir-fried squid, salted egg) — no icon. CONFLICT: squid = shellfish/mollusk. CORRECTION: add Contains Shell.
- Khao Pad Rod Fai (egg fried rice, pork or chicken, kale, tomato, onion) — icon shown: Vegan. CONFLICT: egg + pork/chicken, not vegan. CORRECTION: remove Vegan; ADD Contains Pork (pork is a protein option).
- Pla Muek Phad Prik Gleau (wok fried calamari, chili garlic, salt & pepper) — no icon (just recommended ribbon). CONFLICT: calamari = shellfish/mollusk. CORRECTION: add Contains Shell.
- Pla Kapong Neung Manao (steamed sea bass, garlic spicy & sour sauce) — icon: Spicy. Correct.
- Phad Pak Boong Fai Dang (stir-fried morning glory, garlic chili, soy sauce) — icons: Vegan + Spicy. Correct (soy sauce, not fish sauce — no conflict).
- Pla Kra Tiam (deep fried sea bass, crispy garlic, green mango salad) — no icon. No conflict (fish, not shellfish).
- Kai Pad Med Ma Muang (crispy chicken, cashew nuts, bell peppers, mushroom, spring onion) — no icon. No conflict.

### Page 19 — THAI MAIN DISH: CURRY + ONE DISH THAI TRADITIONAL
- Massaman Beef (slow braised beef, massaman curry, potatoes, crispy shallot) — icon: Spicy. Correct (leave as-is, not a clear conflict).
- Massaman Chicken (slow braised chicken, massaman curry, potatoes, crispy shallot) — icon: Spicy. Correct.
- Chicken Green Curry (Thai chicken green curry, eggplant, sweet basil) — icons: Vegan + Spicy. CONFLICT: contains chicken, not vegan. CORRECTION: remove Vegan; keep Spicy.
- Phad Kra Praw (listed as "Stir-Fried Morning Glory With Garlic Chili and Soy Sauce" — NOTE: this description is identical to "Phad Pak Boong Fai Dang" on page 17; looks like a copy-paste content error in the source PDF, flag to owner separately, not a dietary-badge issue) — icon: Vegan only (no Spicy, inconsistent with the near-identical item on p.17 which had both). As literally described (morning glory, soy sauce) Vegan is correct; no dietary correction applied, but note the inconsistency for the owner.
- Phad Se-Ew (stir-fried flat noodle, kale, egg, soy sauce, choice of chicken or pork) — icon: Vegan. CONFLICT: egg + chicken/pork, not vegan. CORRECTION: remove Vegan; ADD Contains Pork (pork is a protein option).
- Rad Nah Ruam Mitr (seafood in crispy noodle gravy, Chinese kale, egg onsen) — no icon. "Seafood" is generic/ambiguous (may or may not include shellfish specifically) — SUGGEST-ONLY candidate for Contains Shell, not auto-applied.

### Page 21 — THAI MAIN DISH: PHUKET SPECIAL
- Mee Sapam Seafood (stir fried Hokkien noodle, seafood, onsen egg) — no icon. "Seafood" generic — SUGGEST-ONLY for Contains Shell.
- Phuket fish ball — no description/icon. Fish, not shellfish — no action.
- Moo Hong (Phuket style braised pork belly) — icon: Contains Pork. Correct.
- Gaeng Phu Phuket (authentic Phuket crab curry, rice vermicelli) — icon: Spicy only. CONFLICT: crab = shellfish, no Shell icon. CORRECTION: add Contains Shell; keep Spicy.
- Khao Phad Sapparod (pineapple fried rice, beef/chicken/pork/crispy pork/shrimp or squid options) — no icon at all. CORRECTION: add Contains Pork (pork/crispy pork option) + add Contains Shell (shrimp/squid option).

### Page 23 — SWEET ENDING
- I-Tim Kati (Thai coconut ice cream, sticky rice, mango, peanut) — icon: Vegan. Correct.
- Mango Sticky Rice (ripe mango, sticky rice, coconut sauce, coconut ice cream) — icon: Vegan. Correct.
- Bua Loy Phuak (Thai taro ball in sweet coconut milk) — no icon. Traditionally vegan but not explicit — SUGGEST-ONLY.
- Creme Brulee (vanilla egg custard, salted caramel ice cream) — no icon. No conflict (correctly not vegan).
- Khao Niew Dum (black glutinous rice, coconut ice cream) — icon: Vegan. Correct.
- Banana Split (3 scoops ice cream, banana, whipping cream, chocolate sauce) — icon: Vegan. CONFLICT: whipping cream + ice cream = dairy, not vegan. CORRECTION: remove Vegan.
- Exotic Fruit Platter (mixed local seasonal fruit) — no icon. Likely vegan but not explicit — SUGGEST-ONLY.

### Page 26 — KIDS MENU section divider/hero (Pinocchio's Bacon Cheesy Fries feature spread)
- No itemized list / icons on this page (full-page photo spread only, French fries with Bacon & Cheese, fresh fruit, 120.-). Item list with icons likely on next page.

### Page 27 — KIDS MENU: Appetizer
- Harry Potter's Cheesy Fries (french fries with cheese, fresh fruit slice & juice) — icon: Gluten-Free (wheat-in-circle). Correct, no conflict.
- Pinocchio's Bacon Cheesy Fries (french fries with bacon & cheese, fresh fruit slice & juice) — icons confirmed via zoom: Gluten-Free (wheat-in-circle) + Contains Pork (pig-in-circle). Correct, no conflict (bacon = pork).
(continuing to scroll page 27 for more Kids Menu items)

### Page 27 — KIDS MENU: Soup
- Winnie the Pooh's Mushroom Soup (mushroom cream soup, crispy crouton, fresh fruit slice & juice) — icon: Vegan (leaf). CONFLICT: "cream soup" = dairy cream, not vegan (also has crouton/bread, minor). CORRECTION: remove Vegan.
- Piglet's Chicken Soup (grilled chicken cream soup, crispy crouton, fresh fruit slice & juice) — no icon. No conflict (despite "Piglet" name, dish is chicken-based, not pork — correctly un-badged).
(Page 27 complete: Appetizer + Soup sections, 4 items total. Moving to page 28.)

### Page 28 — KIDS MENU: Main Dish (photo-background page, 1 item)
- Moana's Hawaiian Pizza (small Hawaiian pizza, fresh fruit slice & juice) — no icon. CONFLICT: photo on this page clearly shows visible ham pieces on the pizza (standard Hawaiian pizza = ham + pineapple + cheese). CORRECTION: add Contains Pork (ham, visually confirmed in the page's own photo).
(Page 28 complete: 1 item. Moving to page 29.)

### Page 29 — KIDS MENU: Main Course (+ legend reconfirmed at page bottom)
- Donald Duck's Chicken Nuggets (deep fried chicken nuggets, fresh fruit slice & juice) — no icon. No conflict.
- Peter Pan's Pizza (small Margherita pizza, fresh fruit slice & juice) — no icon. No conflict (mozzarella/dairy cheese = correctly not Vegan).
- Moana's Hawaiian Pizza (small Hawaiian pizza, fresh fruit slice & juice) — icon shown: Vegan (leaf). MAJOR CONFLICT: Hawaiian pizza = ham + cheese (confirmed via page 28's own photo showing visible ham pieces) — NOT vegan at all. CORRECTION: remove Vegan; ADD Contains Pork (ham, visually confirmed). [Same item also appears as a hero/photo spread on page 28 with no icon shown there; this page 29 textual listing is the authoritative icon source, and it's wrong — priority correction for restaurant team.]
- Raya's Dragon Fried Rice (egg fried rice with chicken sausage, fresh fruit slice & juice) — no icon. No conflict.
- Aquaman Fish & Chips (deep fried sea bass with french fries, fresh fruit slice & juice) — no icon. No conflict (sea bass = fish, not shellfish).
- Donald Duck's Grilled Cheese (grilled CHICKEN HAM and cheese sandwiches, fresh fruit slice & juice) — no icon. No conflict — NOTE: "chicken ham" is a chicken-based deli product (not pork) despite the word "ham"; correctly NOT flagged as Contains Pork. (Important: don't over-correct based on the word "ham" alone — verify whether it's a pork product or a chicken product styled as ham.)
- Bottom-of-page icon legend reconfirmed exactly as catalogued: Spicy (gold bird/paw), Gluten-Free (circle+wheat), Vegan (leaf), Contains Pork (circle+pig face), Contains Shell (shrimp silhouette).
(Page 29 complete: 6 items + legend. Moving to page 30.)

### Page 30 — KIDS MENU: Pasta (photo-background hero page, 1 item)
- Spider Man's Spaghetti Web (pasta with tomato OR Bolognese sauce, garlic bread, fresh fruit slice & juice) — 100.-/150.- (two price points for two sauce choices). No icon shown. Page's own photo shows the tomato (meatless-looking) version with parmesan, no visible meat. "Bolognese" sauce is traditionally meat-based (often beef, sometimes pork-beef blend) but recipe/meat type not specified here — generic/ambiguous like "seafood" cases. SUGGEST-ONLY: flag for restaurant team to confirm whether their Bolognese sauce contains pork (if so, add Contains Pork) — not auto-applied. Garlic bread = gluten, correctly not Gluten-Free (already un-badged, no conflict there).
(Page 30 complete: 1 item. Moving to page 31.)

### Page 31 — KIDS MENU: Main Course + Dessert
- The Hulk Smash Burger (beef patty burger, caramelized onions, cheese, french fries, fresh fruit slice & juice) — no icon. No conflict (beef, not pork).
- Chicken Little Buffalo Wings (crispy chicken wings, honey BBQ sauce, vegetable batonnet, fresh fruit slice & juice) — no icon. No conflict.
- Mulan and Mushu Crispy Roll (deep fried crispy spring roll with ripe papaya and plum sauce, fresh fruit slice & juice) — no icon. Filling not specified (could be veg or pork) — SUGGEST-ONLY candidate for Contains Pork (generic spring roll filling, ambiguous like other "seafood"-style cases), not auto-applied.
- Spider Man's Spaghetti Web — repeated listing (same item as page 30 hero), has "recommended" thumbs-up ribbon only, no dietary icon. Confirms page 30 SUGGEST-ONLY note (Bolognese sauce, meat type unspecified).
- Elsa Frozen Ice Cream with Mixed Fruits (vanilla/chocolate/strawberry ice cream, mixed fruits, caramel sauce, cookie) — no icon. No conflict (dairy ice cream + cookie = correctly not Vegan/GF, no badge claimed).
(Page 31 complete: 5 items. This appears to be the end of the Kids Menu itemized section — pages 5,6,7,9,17,19,21,22(skip-divider),23,26(divider),27,28,29,30,31 ALL NOW READ. PDF re-extraction pass is COMPLETE.)

### Page 5 — APPETIZERS & SALADS: Healthy Choices + Warm Appetizers (RE-VERIFIED with full ingredient cross-check)
- House Garden Salad (market medley salad, green apple, FETA, walnut, vinaigrette dressing) — icons shown: Gluten-Free + Vegan. CONFLICT: Feta = dairy cheese, NOT vegan. CORRECTION: remove Vegan; keep Gluten-Free.
- Poke Bowl (fresh salmon, avocado, cucumber, carrot, wakame, sushi rice) — icon: Gluten-Free only. No conflict (salmon = fish not shellfish; no ingredient contradicts GF).
- Marisa Caesar Salad (romaine cos, free-range egg onsen, Parmesan, caesar dressing; Chicken 320.-/Prawns 370.- protein choice, each with its own protein-choice icon — NOT a dietary badge) — no dietary icon shown. CORRECTION: add Contains Shell (Prawns is a priced protein option, same pattern as Khao Phad Sapparod on p.21).
- Por Pia / Vegetables Spring Rolls (Warm Appetizers) — icon: Vegan. Correct, no conflict.
- Mixed Thai Appetizer (vegetable spring rolls, chicken wrap pandan, golden bag, sweet chili sauce) — no icon. No conflict (mixed veg+chicken, no badge claimed).
- Mixed Satay (marinated chicken and beef satay, peanut sauce) — no icon. No conflict.
- Peek Gai Thod Samoonprai (crispy chicken wings infused with lemongrass & CHILI) — no icon despite "chili" in description. SUGGEST-ONLY for Spicy (same precedent as elsewhere: chili mentioned but PDF shows no icon — not auto-applied).
- Fish and Chips (sea bass, wedge potatoes, tartar sauce) — no icon. No conflict (sea bass = fish not shellfish; battered/fried fish correctly not claiming Gluten-Free).
- Yam Woonsen Talay Moo Sub (glass noodle salad, SQUID, SHRIMP, MINCED PORK, shallot & chili, yam citrus dressing) — NO ICON AT ALL. MAJOR CONFLICT/GAP: explicitly named squid + shrimp (shellfish) and minced pork — completely un-badged despite being one of the clearest multi-allergen items on the menu. CORRECTION: add Contains Pork (minced pork) + Contains Shell (squid, shrimp). SUGGEST-ONLY: Spicy (chili mentioned, no icon — same precedent as other chili-mentioned-but-unbadged items).
- Bottom-of-page icon legend + allergy sentence reconfirmed exactly as catalogued (5 icons + "Please inform our service team..." sentence matching the live site's allergy-notice bar text).
(Page 5 complete and fully ingredient-cross-checked. ALL TARGET PAGES NOW DONE — PDF extraction pass fully complete.)
