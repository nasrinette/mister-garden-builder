import { useMemo, useState } from "react";

// ---------------------------------------------------------------------------
// DONNÉES / DATA
// kcal sans "≈" : tableau officiel Mister Garden (juillet 2022), par portion.
// est:true ("≈") : produit récent absent du tableau officiel, valeur estimée.
// p / c / f (protéines, glucides, lipides, g) : toujours estimés.
// ---------------------------------------------------------------------------

const BASES = [
  { id: "lentilles", name: "Lentilles", en: "Lentils", icon: ["bowl", "#8a6240"], kcal: 129.6, half: 64.8, p: 10, c: 20, f: 0.5 },
  { id: "perles-ble", name: "Perles de blé", en: "Wheat pearls", icon: ["bowl", "#d9b26a"], kcal: 200, half: 105, p: 6.5, c: 40, f: 1, est: true },
  { id: "quinoa", name: "Quinoa", en: "Quinoa", icon: ["bowl", "#e8d5a3"], kcal: 253.3, half: 134.1, p: 9, c: 44, f: 4 },
  { id: "pates", name: "Pâtes", en: "Pasta", icon: ["pasta", "#e9c46a"], kcal: 214.2, half: 113.4, p: 7.5, c: 42, f: 1.5 },
  { id: "taboule", name: "Taboulé", en: "Tabbouleh", icon: ["bowl", "#cbd08a"], kcal: 145.7, half: 77.1, p: 4, c: 26, f: 3 },
  { id: "riz", name: "Riz", en: "Rice", icon: ["bowl", "#f2efe4"], kcal: 198.9, half: 105.3, p: 4, c: 43, f: 0.5 },
  { id: "iceberg", name: "Iceberg", en: "Iceberg lettuce", icon: ["lettuce", "#a8d08d"], kcal: 8, half: 5, p: 0.5, c: 1.5, f: 0.1, est: true },
  { id: "epinards", name: "Pousses d'épinards", en: "Baby spinach", icon: ["leaf", "#3e7d3a"], kcal: 12.0, half: 8.4, p: 1.5, c: 1.2, f: 0.2 },
  { id: "mache", name: "Mâche", en: "Lamb's lettuce", icon: ["leaf", "#4e9450"], kcal: 8.4, half: 5.9, p: 0.7, c: 0.8, f: 0.2 },
  { id: "roquette", name: "Roquette", en: "Rocket", icon: ["leaf", "#5d8f3d"], kcal: 12.5, half: 6.3, p: 1.3, c: 1.1, f: 0.3 },
  { id: "carottes-rapees-b", name: "Carottes râpées", en: "Grated carrots", icon: ["shreds", "#f4913b"], kcal: 60.3, half: 36.2, p: 1.2, c: 12, f: 0.3 },
  { id: "courgettes-rapees-b", name: "Courgettes râpées", en: "Grated zucchini", icon: ["shreds", "#8fbf6b"], kcal: 24.8, half: 14.9, p: 1.8, c: 3.5, f: 0.4 },
];

const CHAUDS = [
  { id: "aubergines-zaatar", name: "Aubergines rôties au zaatar", en: "Zaatar roasted eggplant", icon: ["eggplant", "#6b4a86"], kcal: 85, p: 1.2, c: 7, f: 5.7, est: true },
  { id: "brocolis-grilles", name: "Brocolis grillés", en: "Grilled broccoli", icon: ["broccoli", "#4e8a45"], kcal: 35, p: 2.5, c: 4, f: 1, est: true },
  { id: "carottes-zaatar", name: "Carottes rôties au zaatar", en: "Zaatar roasted carrots", icon: ["carrot", "#f4913b"], kcal: 35.7, p: 0.8, c: 6.5, f: 0.8 },
  { id: "courgettes-paprika", name: "Courgettes rôties au paprika fumé", en: "Smoked-paprika roasted zucchini", icon: ["rounds", "#8fbf6b"], kcal: 12.4, p: 0.8, c: 1.5, f: 0.3 },
  { id: "mais-grille", name: "Maïs grillé au paprika", en: "Paprika grilled corn", icon: ["corn", "#f2c744"], kcal: 110, p: 3, c: 21, f: 1.8, est: true },
  { id: "pois-chiches-crispy", name: "Pois-chiches crispy", en: "Crispy chickpeas", icon: ["chickpeas", "#dbb877"], kcal: 120, p: 5, c: 15, f: 4, est: true },
  { id: "poivrons-grilles", name: "Poivrons grillés aux herbes", en: "Herb grilled peppers", icon: ["pepper", "#d9483b"], kcal: 49.4, p: 1, c: 6, f: 2.4 },
  { id: "pommes-terre-moutarde", name: "Pommes de terre à la moutarde", en: "Mustard roasted potatoes", icon: ["potato", "#c69a6d"], kcal: 90, p: 2, c: 15, f: 2.5, est: true },
  { id: "boulettes", name: "Boulettes de chair à saucisse", en: "Sausage meatballs", icon: ["meatballs", "#8a5a3b"], kcal: 280, p: 14, c: 3, f: 24, est: true },
  { id: "poulet-miel", name: "Poulet miel sésame", en: "Honey-sesame chicken", icon: ["drumstick", "#c98f4a"], kcal: 108.3, p: 15, c: 6, f: 2.7 },
  { id: "poulet-herbes", name: "Poulet aux herbes de Provence", en: "Herbes de Provence chicken", icon: ["drumstick", "#b97f3e"], kcal: 93, p: 17, c: 1, f: 2.3, est: true },
  { id: "tenders-vege", name: "Tenders végé by HappyVore", en: "HappyVore veggie tenders", icon: ["tender", "#d9a05b"], kcal: 175, p: 11, c: 13, f: 9, est: true },
];

const CRUDITES = [
  { id: "artichauts", name: "Artichauts marinés", en: "Marinated artichokes", icon: ["artichoke", "#7a9b5a"], kcal: 131.0, p: 2, c: 6, f: 11 },
  { id: "avocat", name: "Avocat", en: "Avocado", icon: ["avocado", "#4f7942"], kcal: 164.0, p: 2, c: 4, f: 15 },
  { id: "betteraves", name: "Betteraves", en: "Beetroot", icon: ["beet", "#a03a52"], kcal: 34.2, p: 1.3, c: 7, f: 0.1 },
  { id: "carottes-rapees", name: "Carottes râpées", en: "Grated carrots", icon: ["shreds", "#f4913b"], kcal: 40.2, p: 0.8, c: 8, f: 0.2 },
  { id: "champignons", name: "Champignons", en: "Mushrooms", icon: ["mushroom", "#c4a58a"], kcal: 18.2, p: 2, c: 2, f: 0.3 },
  { id: "chou-rouge", name: "Chou rouge", en: "Red cabbage", icon: ["cabbage", "#8d5fa8"], kcal: 30.0, p: 1.4, c: 6, f: 0.2 },
  { id: "concombres", name: "Concombres", en: "Cucumber", icon: ["cucumber", "#6fa84f"], kcal: 14.7, p: 0.6, c: 3, f: 0.1 },
  { id: "concombres-smashes", name: "Concombres smashés", en: "Smashed cucumbers", icon: ["cucumberSmashed", "#5c9143"], kcal: 35, p: 1, c: 3, f: 2, est: true },
  { id: "courgettes-rapees", name: "Courgettes râpées", en: "Grated zucchini", icon: ["shreds", "#8fbf6b"], kcal: 16.5, p: 1.2, c: 2.3, f: 0.3 },
  { id: "edamames", name: "Edamames", en: "Edamame", icon: ["pod", "#79b356"], kcal: 122.0, p: 11, c: 8.5, f: 5 },
  { id: "haricots-verts", name: "Haricots verts", en: "Green beans", icon: ["beans", "#5d9b4a"], kcal: 36.3, p: 2, c: 7, f: 0.2 },
  { id: "mais", name: "Maïs", en: "Sweetcorn", icon: ["corn", "#f7d558"], kcal: 107.0, p: 3, c: 21, f: 1.5 },
  { id: "piquillos", name: "Poivrons piquillos", en: "Piquillo peppers", icon: ["pepper", "#b8352c"], kcal: 40, p: 1, c: 7, f: 0.5, est: true },
  { id: "oignons-rouges", name: "Oignons rouges", en: "Red onions", icon: ["onion", "#9d5a8f"], kcal: 36.3, p: 1, c: 8, f: 0.1 },
  { id: "kalamata", name: "Olives de Kalamata", en: "Kalamata olives", icon: ["olives", "#4a3a4a"], kcal: 160.3, p: 1, c: 4, f: 15.5 },
  { id: "radis", name: "Radis", en: "Radishes", icon: ["radish", "#e56a9a"], kcal: 15, p: 0.7, c: 2.5, f: 0.1, est: true },
  { id: "tartare-tomates", name: "Tartare de tomates", en: "Tomato tartare", icon: ["dice", "#e4604e"], kcal: 25.6, p: 1, c: 4, f: 0.7 },
  { id: "tomates-cerises", name: "Tomates cerises", en: "Cherry tomatoes", icon: ["cherries", "#e4604e"], kcal: 33.7, p: 1.5, c: 6.5, f: 0.4 },
  { id: "tomates-confites", name: "Tomates confites", en: "Confit tomatoes", icon: ["tomatoHalf", "#c23b2e"], kcal: 110, p: 2.5, c: 11, f: 6, est: true },
];

const PROT_FROIDES = [
  { id: "oeuf-dur", name: "Œuf dur", en: "Hard-boiled egg", icon: ["eggHalf", "#f5c542"], kcal: 67.0, p: 6, c: 0.5, f: 4.6 },
  { id: "oeuf-poche", name: "Œuf poché", en: "Poached egg", icon: ["friedEgg", "#f5c542"], kcal: 69.0, p: 6.2, c: 0.4, f: 4.8 },
  { id: "tofu-soja-sesame", name: "Tofu soja sésame", en: "Soy-sesame tofu", icon: ["tofu", "#f0ead8"], kcal: 120, p: 10, c: 4, f: 7, est: true },
  { id: "jambon-sec", name: "Jambon sec", en: "Cured ham", icon: ["ham", "#c96a6a"], kcal: 149.5, p: 17, c: 0.3, f: 9 },
  { id: "jambon-blanc", name: "Jambon blanc", en: "Cooked ham", icon: ["ham", "#eda3a3"], kcal: 81.3, p: 14, c: 0.8, f: 2.5 },
  { id: "thon", name: "Thon", en: "Tuna", icon: ["fish", "#7b9db5"], kcal: 62.4, p: 14, c: 0, f: 0.7 },
];

const FROMAGES = [
  { id: "chevre", name: "Chèvre", en: "Goat cheese", icon: ["round", "#f4f0e4"], kcal: 145.5, p: 8.5, c: 1, f: 12 },
  { id: "emmental", name: "Emmental", en: "Emmental", icon: ["wedge", "#f2c744"], kcal: 184.5, p: 13.5, c: 0.5, f: 14.5 },
  { id: "feta", name: "Fêta", en: "Feta", icon: ["crumbles", "#f7f4ea"], kcal: 140.0, p: 7.5, c: 2, f: 11.5 },
  { id: "mozzarella", name: "Mozzarella", en: "Mozzarella", icon: ["mozz", "#f7f4ea"], kcal: 125.5, p: 9, c: 1.5, f: 9.5 },
  { id: "quattrocento", name: "Quattrocento", en: "Quattrocento", icon: ["wedge", "#e8c05a"], kcal: 190, p: 16, c: 1.5, f: 13, est: true },
];

const BONUS = [
  { id: "basilic", name: "Basilic", en: "Basil", icon: ["herb", "#3e7d3a"], kcal: 1.0, p: 0.1, c: 0.1, f: 0 },
  { id: "cacahuetes", name: "Cacahuètes au wasabi", en: "Wasabi peanuts", icon: ["peanut", "#d2a86a"], kcal: 160.3, p: 6, c: 12, f: 10 },
  { id: "ciboulette", name: "Ciboulette", en: "Chives", icon: ["herb", "#5d9b4a"], kcal: 0.9, p: 0.1, c: 0.1, f: 0 },
  { id: "coriandre", name: "Coriandre", en: "Coriander", icon: ["herb", "#4e9450"], kcal: 0.7, p: 0.1, c: 0.1, f: 0 },
  { id: "croutons", name: "Croûtons", en: "Croutons", icon: ["croutons", "#d9a05b"], kcal: 173.3, p: 5, c: 27, f: 5 },
  { id: "graines-sesame", name: "Graines de sésame", en: "Sesame seeds", icon: ["seeds", "#e3cf9a"], kcal: 16.5, p: 0.5, c: 0.7, f: 1.4 },
  { id: "mix-graines", name: "Mix de graines", en: "Seed mix", icon: ["seeds", "#b98a4e"], kcal: 174.7, p: 5, c: 12, f: 12 },
  { id: "oignons-frits", name: "Oignons frits", en: "Fried onions", icon: ["friedOnions", "#d9a05b"], kcal: 200.2, p: 2, c: 20, f: 12 },
  { id: "paprika-fume", name: "Paprika fumé", en: "Smoked paprika", icon: ["spice", "#c23b2e"], kcal: 3, p: 0.1, c: 0.5, f: 0.1, est: true },
  { id: "persil", name: "Persil", en: "Parsley", icon: ["herb", "#3e7d3a"], kcal: 1.3, p: 0.1, c: 0.2, f: 0 },
  { id: "jalapenos", name: "Piments jalapeños", en: "Jalapeño peppers", icon: ["chili", "#5c9143"], kcal: 5, p: 0.2, c: 1, f: 0.1, est: true },
];

// Rebased to a 15 ml (1 tbsp) reference dose: pure olive oil at 15 ml is
// ~120 kcal (13.3 g fat × 9 kcal/g), so every sauce below is the original
// per-portion figure scaled by 120/315 (huile-olive's old 35 g-fat dose).
const SAUCES = [
  { id: "huile-olive", name: "Huile d'olive", en: "Olive oil", icon: ["bottle", "#c9b037"], kcal: 120.0, p: 0, c: 0, f: 13.3, est: true, desc: "Huile d'olive pure, pour les puristes.", descEn: "Pure olive oil, for purists." },
  { id: "jus-citron", name: "Jus de citron pur", en: "Pure lemon juice", icon: ["lemon", "#f2d541"], kcal: 3.5, p: 0.0, c: 1.0, f: 0, est: true, desc: "100 % citron pressé, zéro matière grasse.", descEn: "100% pressed lemon, zero fat." },
  { id: "balsamique", name: "Sauce Balsamique", en: "Balsamic dressing", icon: ["bottle", "#5a3a2e"], kcal: 84.3, p: 0.1, c: 2.3, f: 8.2, est: true, desc: "Huile d'olive et vinaigre balsamique, le duo classique.", descEn: "Olive oil and balsamic vinegar, the classic duo." },
  { id: "moutardee", name: "Sauce Moutardée", en: "Mustard dressing", icon: ["bottle", "#d8a72c"], kcal: 74.3, p: 0.3, c: 1.5, f: 7.4, est: true, desc: "Vinaigrette bien relevée à la moutarde, sur base d'huile de colza.", descEn: "A punchy mustard vinaigrette on a rapeseed-oil base." },
  { id: "miel-moutarde", name: "Sauce Miel-Moutarde", en: "Honey-mustard", icon: ["bottle", "#e0b13e"], kcal: 67.5, p: 0.3, c: 3.8, f: 5.7, est: true, desc: "Colza, vinaigre de cidre, miel et moutarde à l'ancienne : sucrée-piquante.", descEn: "Rapeseed oil, cider vinegar, honey and wholegrain mustard: sweet and tangy." },
  { id: "pesto-garden", name: "Sauce Pesto Garden", en: "Pesto Garden", icon: ["bottle", "#6f9b3c"], kcal: 48.3, p: 0.6, c: 0.8, f: 4.8, est: true, desc: "Roquette, basilic, noisette et parmesan mixés à l'huile.", descEn: "Rocket, basil, hazelnut and parmesan blended with oil." },
  { id: "french-garden", name: "Sauce French Garden", en: "French Garden", icon: ["bottle", "#caa25a"], kcal: 80.2, p: 0.2, c: 1.5, f: 8.0, est: true, desc: "Colza, vinaigre de vin, échalote et moutarde : la vinaigrette maison.", descEn: "Rapeseed oil, wine vinegar, shallot and mustard: the house vinaigrette." },
  { id: "citron-olive", name: "Sauce Citron & Olive", en: "Lemon & Olive", icon: ["bottle", "#dfd35a"], kcal: 81.0, p: 0.1, c: 1.5, f: 8.2, est: true, desc: "Huile d'olive réveillée au jus de citron.", descEn: "Olive oil brightened with lemon juice." },
  { id: "exotique-garden", name: "Sauce Exotique Garden", en: "Exotique Garden", icon: ["bottle", "#f2a03d"], kcal: 41.1, p: 0.2, c: 3.0, f: 3.0, est: true, desc: "Fruit de la passion, avocat et jalapeño : fruitée et pimentée, l'une des plus légères.", descEn: "Passion fruit, avocado and jalapeño: fruity and spicy, one of the lightest." },
  { id: "smoky-chipotle", name: "Sauce Smoky Mayo Chipotle", en: "Smoky Mayo Chipotle", icon: ["bottle", "#e07a5f"], kcal: 83.8, p: 0.2, c: 1.0, f: 8.8, est: true, desc: "Mayonnaise au paprika fumé et piment chipotle : crémeuse, fumée, un peu relevée.", descEn: "Smoked-paprika and chipotle mayo: creamy, smoky, gently hot." },
  { id: "ponzu-sesame", name: "Sauce Ponzu Sésame", en: "Ponzu Sesame", icon: ["bottle", "#8a5a3b"], kcal: 49.5, p: 0.4, c: 2.3, f: 4.2, est: true, desc: "Huile de sésame, soja et agrumes (yuzu, mandarine) : umami et acidulée.", descEn: "Sesame oil, soy and citrus (yuzu, mandarin): umami and zesty." },
  { id: "caesarita", name: "Sauce Caesarita", en: "Caesarita", icon: ["bottle", "#efe9d8"], kcal: 40.5, p: 0.6, c: 1.1, f: 3.6, est: true, desc: "Yaourt, parmesan et Worcestershire : l'esprit caesar en plus léger.", descEn: "Yogurt, parmesan and Worcestershire: caesar spirit, lighter." },
  { id: "none", name: "Sans sauce", en: "No sauce", icon: ["bottleNo", "#9aa6b0"], kcal: 0, p: 0, c: 0, f: 0, desc: "Nature, telle quelle.", descEn: "As is, no dressing." },
];

const PAINS = [
  { id: "pain-blanc", name: "Pain blanc", en: "White bread", icon: ["baguette", "#e4b877"], kcal: 146.3, p: 5, c: 28, f: 1.5 },
  { id: "pain-complet", name: "Pain complet", en: "Wholemeal bread", icon: ["baguette", "#b98a4e"], kcal: 137.5, p: 5.5, c: 25, f: 1.7 },
  { id: "pain-pavot", name: "Pain pavot-sésame", en: "Poppy-sesame bread", icon: ["baguette", "#caa25a"], kcal: 149.1, p: 5.5, c: 26, f: 2.5 },
];

const INGREDIENT_GROUPS = [
  { key: "chauds", label: "Chauds", labelEn: "Hot", items: CHAUDS },
  { key: "crudites", label: "Crudités", labelEn: "Raw veg", items: CRUDITES },
  { key: "prot", label: "Œufs & protéines", labelEn: "Eggs & proteins", items: PROT_FROIDES },
  { key: "fromages", label: "Fromages", labelEn: "Cheeses", items: FROMAGES },
];

const ALL_INGREDIENTS = INGREDIENT_GROUPS.flatMap((g) => g.items);
const BASE_PRICE = 11.2;
const EXTRA_ING_PRICE = 1.5;
const EXTRA_BONUS_PRICE = 0.5;
const DOUBLE_SAUCE_PRICE = 0.8;
const TBSP_ML = 15;
const TSP_ML = 5;
const DEFAULT_SAUCE_AMOUNT = { tbsp: 1, tsp: 0 };

// ---------------------------------------------------------------------------
// TEXTES UI / UI STRINGS
// ---------------------------------------------------------------------------

const STR = {
  fr: {
    eyebrow: "Notre concept",
    title: ["Votre ", "salade", " sur-mesure"],
    fBase: "base", fIngr: "ingrédients", fBonus: "bonus", fSauce: "sauce",
    navBuild: "Composer", navSug: "Bols suggérés",
    stepBase: "Base", stepIngr: "Ingrédients", stepBonus: "Bonus", stepSauce: "Sauce", stepBread: "Le pain",
    baseHint: ["1 base entière ", "ou", " 2 demi-bases. Obligatoire."],
    mode1: "1 base", mode2: "2 demi-bases",
    ingrHint: ["4 ingrédients inclus, puis ", "1,50 €", " par ingrédient supplémentaire. Un même ingrédient peut être pris plusieurs fois (ex. 2× poulet)."],
    bonusHint: ["1 bonus inclus, puis ", "0,50 €", " par bonus supplémentaire."],
    sauceHint: ["1 sauce au choix, obligatoire (« sans sauce » compte comme un choix). Ajustez la ", "quantité", " ci-dessous."],
    breadHint: "Optionnel, pour accompagner.",
    included: "inclus", extra: "suppl.",
    amountLabel: "Quantité de sauce",
    amountTbsp: "Cuillère à soupe", amountTsp: "Cuillère à café",
    amountTotal: "Volume total",
    amountNote: "Les calories, macros et le prix se recalculent selon la quantité choisie. Les cartes ci-dessous affichent la valeur pour 1 cuillère à soupe (15 ml). Suppl. : 0,80 € par cuillère à soupe au-delà de la première.",
    yourBowl: "Votre bol",
    emptyBowl: "Choisissez une base pour commencer votre salade…",
    nutrition: "Valeurs nutritionnelles",
    energy: "Énergie", protein: "Protéines*", carbs: "Glucides*", fat: "Lipides*",
    lProt: "Protéines", lCarb: "Glucides", lFat: "Lipides",
    note: "Calories sans « ≈ » : tableau officiel Mister Garden (juillet 2022), par portion servie. « ≈ » : produit récent (valeur estimée) ou sauce recalculée pour une dose de 1 cuillère à soupe (15 ml), calibrée sur l'huile d'olive pure (≈ 120 kcal / 15 ml). *Macros toujours estimées, la marque ne publiant que l'énergie (grammages non communiqués).",
    priceTitle: "Prix estimé",
    priceFrom: "(formule salade, à partir de)",
    priceSupp: "+ suppléments",
    priceVar: "· tarif indicatif, variable selon le restaurant.",
    salad: "Salade",
    restart: "Recommencer",
    buildThis: "Composer ce bol",
    gProt: "g prot.",
    sugFoot: "Suggestions maison composées avec les produits de la carte actuelle ; « La Signature de saison » reprend une composition proposée en restaurant. Valeurs et prix recalculés par l'outil.",
    footer: "Outil non officiel. Carte : produits relevés sur l'interface de commande Mister Garden (juillet 2026). Calories : tableau officiel publié sur mister-garden.com, complété d'estimations (« ≈ ») pour les nouveautés. Illustrations originales.",
  },
  en: {
    eyebrow: "Our concept",
    title: ["Your made-to-measure ", "salad", ""],
    fBase: "base", fIngr: "ingredients", fBonus: "bonus", fSauce: "sauce",
    navBuild: "Build", navSug: "Suggested bowls",
    stepBase: "Base", stepIngr: "Ingredients", stepBonus: "Bonus", stepSauce: "Sauce", stepBread: "Bread",
    baseHint: ["1 full base ", "or", " 2 half bases. Required."],
    mode1: "1 base", mode2: "2 half bases",
    ingrHint: ["4 ingredients included, then ", "€1.50", " per extra ingredient. The same ingredient can be picked more than once (e.g. 2× chicken)."],
    bonusHint: ["1 bonus included, then ", "€0.50", " per extra bonus."],
    sauceHint: ["Pick one sauce, required (\u201cno sauce\u201d counts as a choice). Adjust the ", "amount", " below."],
    breadHint: "Optional, on the side.",
    included: "included", extra: "extra",
    amountLabel: "Sauce amount",
    amountTbsp: "Tablespoon", amountTsp: "Teaspoon",
    amountTotal: "Total volume",
    amountNote: "Calories, macros and price recalculate live from the amount you pick. Cards below show the value for 1 tablespoon (15 ml). Extra: €0.80 per tablespoon beyond the first.",
    yourBowl: "Your bowl",
    emptyBowl: "Pick a base to start your salad…",
    nutrition: "Nutrition facts",
    energy: "Energy", protein: "Protein*", carbs: "Carbs*", fat: "Fat*",
    lProt: "Protein", lCarb: "Carbs", lFat: "Fat",
    note: "Calories without \u201c≈\u201d: official Mister Garden table (July 2022), per serving. \u201c≈\u201d: recent item (estimated value) or a sauce recalculated for a 1-tablespoon (15 ml) dose, calibrated against pure olive oil (≈ 120 kcal / 15 ml). *Macros are always estimates: the brand only publishes energy (portion weights not disclosed).",
    priceTitle: "Estimated price",
    priceFrom: "(salad formula, from)",
    priceSupp: "+ extras",
    priceVar: "· indicative price, varies by restaurant.",
    salad: "Salad",
    restart: "Start over",
    buildThis: "Build this bowl",
    gProt: "g protein",
    sugFoot: "House suggestions built from the current menu; \u201cThe Seasonal Signature\u201d mirrors a combination offered in restaurants. Values and prices are recomputed by the tool.",
    footer: "Unofficial tool. Menu: items taken from the Mister Garden ordering interface (July 2026). Calories: official table published on mister-garden.com, completed with estimates (\u201c≈\u201d) for newer items. Original illustrations.",
  },
};

// ---------------------------------------------------------------------------
// ILLUSTRATIONS (SVG flat, style maison)
// ---------------------------------------------------------------------------

const ICONS = {
  bowl: (c = "#d9b26a") => (
    <>
      <path d="M11 25a13 8 0 0 1 26 0z" fill={c} />
      <circle cx="18" cy="21.5" r="1.5" fill="rgba(0,0,0,.2)" />
      <circle cx="24.5" cy="19.5" r="1.5" fill="rgba(0,0,0,.2)" />
      <circle cx="30.5" cy="21.8" r="1.5" fill="rgba(0,0,0,.2)" />
      <path d="M8 25h32c0 8.5-7 14-16 14S8 33.5 8 25z" fill="#2e4152" />
      <path d="M8 25h32" stroke="#a9c6df" strokeWidth="2" />
    </>
  ),
  pasta: (c = "#e9c46a") => (
    <>
      <path d="M8 17q4-7 8 0t8 0 8 0 8 0" stroke={c} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M8 27q4-7 8 0t8 0 8 0 8 0" stroke={c} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity=".85" />
      <path d="M8 37q4-7 8 0t8 0 8 0 8 0" stroke={c} strokeWidth="4.5" fill="none" strokeLinecap="round" opacity=".7" />
    </>
  ),
  lettuce: (c = "#a8d08d") => (
    <>
      <circle cx="24" cy="25" r="15" fill={c} />
      <path d="M11 20q13-9 26 0M12 30q12-8 24 0" stroke="rgba(255,255,255,.65)" strokeWidth="2.5" fill="none" />
      <path d="M24 11v28" stroke="rgba(255,255,255,.4)" strokeWidth="2" />
    </>
  ),
  leaf: (c = "#4e9450") => (
    <>
      <path d="M24 6C13 11 9 24 13 39c2 2 4 3 7 3 10-3 17-14 16-27-.3-4-1.5-7-3-9-3.5 0-6.5 0-9 0z" fill={c} />
      <path d="M22 12c-2 8-2 18 1 26" stroke="rgba(255,255,255,.5)" strokeWidth="2.2" fill="none" />
    </>
  ),
  shreds: (c = "#f4913b") => (
    <>
      <path d="M7 19q9-8 16-2t18-2" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M7 29q9-8 16-2t18-2" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M9 39q8-8 15-3t16-3" stroke={c} strokeWidth="4" fill="none" strokeLinecap="round" opacity=".6" />
    </>
  ),
  carrot: (c = "#f4913b") => (
    <>
      <path d="M33 15 15 39c-2 3 2 7 5 4l17-22c2-4-1-8-4-6z" fill={c} />
      <path d="M35 12l6-6M38 16l8-3" stroke="#5b8c4a" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 22l-3 4M22 29l-3 4" stroke="rgba(0,0,0,.18)" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  rounds: (c = "#8fbf6b") => (
    <>
      <circle cx="16" cy="29" r="8" fill={c} /><circle cx="16" cy="29" r="4.5" fill="#eef5e2" />
      <circle cx="30" cy="18" r="8" fill={c} /><circle cx="30" cy="18" r="4.5" fill="#eef5e2" />
      <circle cx="33" cy="33" r="7" fill={c} /><circle cx="33" cy="33" r="4" fill="#eef5e2" />
    </>
  ),
  corn: (c = "#f2c744") => (
    <>
      <ellipse cx="24" cy="26" rx="9" ry="16" fill={c} />
      <path d="M18 14v24M24 11v30M30 14v24M16 22h16M16 30h16" stroke="rgba(0,0,0,.15)" strokeWidth="1.6" />
      <path d="M14 32c-4 4-4 8-2 10 4-1 6-4 7-7zM34 32c4 4 4 8 2 10-4-1-6-4-7-7z" fill="#7a9b5a" />
    </>
  ),
  chickpeas: (c = "#dbb877") => (
    <>
      <circle cx="16" cy="20" r="7" fill={c} /><circle cx="32" cy="18" r="6" fill={c} />
      <circle cx="20" cy="34" r="6.5" fill={c} /><circle cx="33" cy="32" r="7" fill={c} />
      <circle cx="14" cy="18" r="1.4" fill="rgba(0,0,0,.2)" /><circle cx="31" cy="30" r="1.4" fill="rgba(0,0,0,.2)" />
    </>
  ),
  pepper: (c = "#d9483b") => (
    <>
      <path d="M15 17q9-7 18 0 6 10 0 19-9 7-18 0-6-9 0-19z" fill={c} />
      <path d="M24 15v-6" stroke="#5b8c4a" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M18 20q-3 8 1 14" stroke="rgba(255,255,255,.35)" strokeWidth="2.5" fill="none" />
    </>
  ),
  potato: (c = "#c69a6d") => (
    <>
      <ellipse cx="24" cy="26" rx="15" ry="11" fill={c} transform="rotate(-12 24 26)" />
      <circle cx="17" cy="24" r="1.5" fill="rgba(0,0,0,.22)" /><circle cx="27" cy="21" r="1.5" fill="rgba(0,0,0,.22)" /><circle cx="30" cy="30" r="1.5" fill="rgba(0,0,0,.22)" />
    </>
  ),
  eggplant: (c = "#6b4a86") => (
    <>
      <path d="M30 15c8 4 9 15 3 21s-16 7-19 1 2-9 6-13 6-7 10-9z" fill={c} />
      <path d="M31 14l5-6" stroke="#5b8c4a" strokeWidth="3" strokeLinecap="round" />
      <path d="M27 14q7 1 8 8" stroke="#5b8c4a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  broccoli: (c = "#4e8a45") => (
    <>
      <rect x="21" y="26" width="6" height="13" rx="3" fill="#9bbf6d" />
      <circle cx="15" cy="22" r="7" fill={c} /><circle cx="24" cy="16" r="8" fill={c} /><circle cx="33" cy="22" r="7" fill={c} />
      <circle cx="24" cy="25" r="7" fill={c} />
    </>
  ),
  meatballs: (c = "#8a5a3b") => (
    <>
      <circle cx="16" cy="28" r="8" fill={c} /><circle cx="32" cy="28" r="8" fill={c} /><circle cx="24" cy="17" r="8" fill={c} />
      <path d="M20 15q3-2 7 0M12 26q3-2 7 0M28 26q3-2 7 0" stroke="rgba(255,255,255,.35)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </>
  ),
  drumstick: (c = "#c98f4a") => (
    <>
      <path d="M14 14a13 13 0 1 1 12 20l-6-6z" fill={c} />
      <path d="M20 28 10 38" stroke="#f2ead8" strokeWidth="5" strokeLinecap="round" />
      <circle cx="9" cy="40" r="3.4" fill="#f2ead8" /><circle cx="13" cy="43" r="3.4" fill="#f2ead8" />
    </>
  ),
  tender: (c = "#d9a05b") => (
    <>
      <rect x="8" y="17" width="32" height="15" rx="7.5" fill={c} transform="rotate(-10 24 24)" />
      <circle cx="16" cy="24" r="1.4" fill="rgba(0,0,0,.25)" /><circle cx="24" cy="21" r="1.4" fill="rgba(0,0,0,.25)" /><circle cx="31" cy="19" r="1.4" fill="rgba(0,0,0,.25)" /><circle cx="27" cy="26" r="1.4" fill="rgba(0,0,0,.25)" />
    </>
  ),
  artichoke: (c = "#7a9b5a") => (
    <>
      <path d="M24 8c8 4 12 12 10 22-3 6-8 9-10 9s-7-3-10-9c-2-10 2-18 10-22z" fill={c} />
      <path d="M24 10v28M17 18q7 4 14 0M15 27q9 5 18 0" stroke="rgba(255,255,255,.45)" strokeWidth="2.2" fill="none" />
    </>
  ),
  avocado: () => (
    <>
      <path d="M24 7c9 3 14 11 14 19a14 14 0 1 1-28 0c0-8 5-16 14-19z" fill="#4f7942" />
      <path d="M24 12c7 2 10 9 10 14a10 10 0 1 1-20 0c0-5 3-12 10-14z" fill="#cfe0a0" />
      <circle cx="24" cy="29" r="5.5" fill="#8a5a3b" />
    </>
  ),
  beet: (c = "#a03a52") => (
    <>
      <circle cx="24" cy="26" r="12" fill={c} />
      <path d="M24 38v6" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <path d="M22 14q-2-8 2-10M26 14q3-7 8-7" stroke="#5b8c4a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M18 24q6-4 12 0" stroke="rgba(255,255,255,.35)" strokeWidth="2" fill="none" />
    </>
  ),
  mushroom: (c = "#c4a58a") => (
    <>
      <path d="M8 24c0-9 7-15 16-15s16 6 16 15z" fill={c} />
      <rect x="19" y="24" width="10" height="14" rx="4" fill="#efe6d8" />
      <circle cx="17" cy="17" r="2" fill="rgba(255,255,255,.5)" /><circle cx="28" cy="14" r="2" fill="rgba(255,255,255,.5)" />
    </>
  ),
  cabbage: (c = "#8d5fa8") => (
    <>
      <circle cx="24" cy="25" r="15" fill={c} />
      <path d="M10 22q14-8 28 2M13 32q11-7 22 1M24 10q-4 14 2 30" stroke="rgba(255,255,255,.5)" strokeWidth="2.3" fill="none" />
    </>
  ),
  cucumber: (c = "#6fa84f") => (
    <>
      <circle cx="24" cy="24" r="14" fill="#d7ecc0" stroke={c} strokeWidth="5" />
      <circle cx="24" cy="24" r="2" fill={c} />
      <path d="M24 15v5M31 20l-4 3M31 29l-4-3M24 33v-5M17 29l4-3M17 20l4 3" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  cucumberSmashed: (c = "#5c9143") => (
    <>
      <circle cx="24" cy="24" r="14" fill="#d7ecc0" stroke={c} strokeWidth="5" />
      <path d="M14 18l20 14M34 18 14 32" stroke={c} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2.4" fill={c} />
    </>
  ),
  pod: (c = "#79b356") => (
    <>
      <path d="M9 32C13 18 27 11 39 13c2 5-1 10-6 13-9 6-18 9-24 6z" fill={c} />
      <circle cx="18" cy="27" r="3.2" fill="rgba(255,255,255,.4)" /><circle cx="26" cy="23" r="3.2" fill="rgba(255,255,255,.4)" /><circle cx="33" cy="19" r="3.2" fill="rgba(255,255,255,.4)" />
    </>
  ),
  beans: (c = "#5d9b4a") => (
    <>
      <rect x="6" y="20" width="34" height="6" rx="3" fill={c} transform="rotate(-14 24 24)" />
      <rect x="8" y="27" width="32" height="6" rx="3" fill={c} opacity=".8" transform="rotate(8 24 30)" />
    </>
  ),
  onion: (c = "#9d5a8f") => (
    <>
      <path d="M24 10c10 6 14 14 10 24-6 6-14 6-20 0-4-10 0-18 10-24z" fill={c} />
      <path d="M24 12v28M18 16q-4 12 1 22M30 16q4 12-1 22" stroke="rgba(255,255,255,.4)" strokeWidth="2" fill="none" />
      <path d="M24 9V5" stroke={c} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  olives: (c = "#4a3a4a") => (
    <>
      <ellipse cx="17" cy="26" rx="8" ry="10" fill={c} />
      <ellipse cx="32" cy="24" rx="8" ry="10" fill={c} transform="rotate(18 32 24)" />
      <circle cx="17" cy="23" r="2.4" fill="#e4604e" /><circle cx="32" cy="21" r="2.4" fill="#e4604e" />
    </>
  ),
  radish: (c = "#e56a9a") => (
    <>
      <circle cx="24" cy="27" r="11" fill={c} />
      <path d="M24 38v7" stroke={c} strokeWidth="3" strokeLinecap="round" />
      <path d="M21 16q-3-8 1-11M27 16q2-8 8-9" stroke="#5b8c4a" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M19 25q5-4 10 0" stroke="rgba(255,255,255,.45)" strokeWidth="2" fill="none" />
    </>
  ),
  dice: (c = "#e4604e") => (
    <>
      <rect x="10" y="12" width="11" height="11" rx="3" fill={c} />
      <rect x="26" y="14" width="11" height="11" rx="3" fill={c} opacity=".85" />
      <rect x="13" y="27" width="11" height="11" rx="3" fill={c} opacity=".85" />
      <rect x="28" y="29" width="10" height="10" rx="3" fill={c} />
    </>
  ),
  cherries: (c = "#e4604e") => (
    <>
      <circle cx="17" cy="29" r="8" fill={c} /><circle cx="32" cy="26" r="7" fill={c} />
      <path d="M17 21v-5M32 19v-5" stroke="#5b8c4a" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="14.5" cy="26.5" r="2" fill="rgba(255,255,255,.5)" /><circle cx="29.5" cy="23.5" r="1.8" fill="rgba(255,255,255,.5)" />
    </>
  ),
  tomatoHalf: (c = "#c23b2e") => (
    <>
      <path d="M9 26a15 15 0 0 1 30 0z" fill={c} />
      <path d="M9 26h30" stroke="#8f271d" strokeWidth="3" />
      <circle cx="17" cy="21" r="1.6" fill="#f2d541" /><circle cx="24" cy="17" r="1.6" fill="#f2d541" /><circle cx="31" cy="21" r="1.6" fill="#f2d541" />
    </>
  ),
  eggHalf: (c = "#f5c542") => (
    <>
      <ellipse cx="24" cy="25" rx="13" ry="16" fill="#f7f4ea" />
      <circle cx="24" cy="27" r="6.5" fill={c} />
    </>
  ),
  friedEgg: (c = "#f5c542") => (
    <>
      <path d="M24 8c9 0 10 6 15 9s3 12-2 16-9 7-16 6-13-5-12-12 2-10 6-13 4-6 9-6z" fill="#f7f4ea" />
      <circle cx="25" cy="25" r="7" fill={c} />
      <circle cx="23" cy="23" r="2" fill="rgba(255,255,255,.6)" />
    </>
  ),
  tofu: () => (
    <>
      <path d="M10 20 24 13l14 7v13l-14 7-14-7z" fill="#f0ead8" />
      <path d="M10 20l14 7 14-7M24 27v13" stroke="#d8cdb2" strokeWidth="2" fill="none" />
      <circle cx="18" cy="24" r="1.1" fill="#8a5a3b" /><circle cx="27" cy="22" r="1.1" fill="#8a5a3b" /><circle cx="31" cy="26" r="1.1" fill="#8a5a3b" />
    </>
  ),
  ham: (c = "#eda3a3") => (
    <>
      <path d="M8 26q8-12 32-8-2 14-16 16Q10 36 8 26z" fill={c} />
      <path d="M8 26q8-12 32-8" stroke="#fff" strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M14 28q8-5 18-4" stroke="rgba(255,255,255,.5)" strokeWidth="2" fill="none" />
    </>
  ),
  fish: (c = "#7b9db5") => (
    <>
      <ellipse cx="21" cy="24" rx="14" ry="9" fill={c} />
      <path d="M33 24l9-7v14z" fill={c} />
      <circle cx="13" cy="22" r="1.8" fill="#2e4152" />
      <path d="M20 17q4 7 0 14" stroke="rgba(255,255,255,.4)" strokeWidth="2" fill="none" />
    </>
  ),
  wedge: (c = "#f2c744") => (
    <>
      <path d="M6 32 40 14v18H6z" fill={c} />
      <path d="M6 32 40 14" stroke="#d9a72c" strokeWidth="3" />
      <circle cx="28" cy="26" r="2.6" fill="#d9a72c" /><circle cx="19" cy="29" r="2" fill="#d9a72c" /><circle cx="34" cy="22" r="1.8" fill="#d9a72c" />
    </>
  ),
  crumbles: (c = "#f7f4ea") => (
    <>
      <rect x="9" y="14" width="12" height="12" rx="2.5" fill={c} stroke="#ddd4bd" strokeWidth="1.5" transform="rotate(-8 15 20)" />
      <rect x="26" y="12" width="11" height="11" rx="2.5" fill={c} stroke="#ddd4bd" strokeWidth="1.5" transform="rotate(10 31 18)" />
      <rect x="14" y="28" width="11" height="11" rx="2.5" fill={c} stroke="#ddd4bd" strokeWidth="1.5" transform="rotate(6 20 33)" />
      <rect x="29" y="27" width="10" height="10" rx="2.5" fill={c} stroke="#ddd4bd" strokeWidth="1.5" transform="rotate(-12 34 32)" />
    </>
  ),
  round: (c = "#f4f0e4") => (
    <>
      <circle cx="24" cy="24" r="14" fill={c} stroke="#d8cdb2" strokeWidth="3" />
      <path d="M16 20q8-4 16 0" stroke="#d8cdb2" strokeWidth="2" fill="none" />
    </>
  ),
  mozz: (c = "#f7f4ea") => (
    <>
      <circle cx="24" cy="25" r="14" fill={c} stroke="#e3dcc6" strokeWidth="2" />
      <path d="M17 19q4-4 9-3" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="29" cy="29" r="2" fill="#e3dcc6" />
    </>
  ),
  herb: (c = "#3e7d3a") => (
    <>
      <path d="M24 42V12" stroke={c} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M24 16q-8-2-10-9 8-1 10 9zM24 16q8-2 10-9-8-1-10 9zM24 26q-8-2-10-9 8-1 10 9zM24 26q8-2 10-9-8-1-10 9zM24 36q-7-2-9-8 7-1 9 8zM24 36q7-2 9-8-7-1-9 8z" fill={c} />
    </>
  ),
  peanut: (c = "#d2a86a") => (
    <>
      <path d="M17 10a8 8 0 0 1 8 6 8 8 0 1 1-9 12A8 8 0 0 1 17 10z" fill={c} transform="rotate(20 24 24)" />
      <path d="M14 16q4 8 10 16" stroke="rgba(0,0,0,.15)" strokeWidth="2" fill="none" />
    </>
  ),
  croutons: (c = "#d9a05b") => (
    <>
      <rect x="8" y="13" width="13" height="13" rx="3" fill={c} transform="rotate(-10 14 19)" />
      <rect x="26" y="11" width="12" height="12" rx="3" fill={c} transform="rotate(14 32 17)" />
      <rect x="18" y="28" width="13" height="13" rx="3" fill={c} transform="rotate(-6 24 34)" />
      <circle cx="15" cy="19" r="1.2" fill="rgba(0,0,0,.2)" /><circle cx="32" cy="17" r="1.2" fill="rgba(0,0,0,.2)" /><circle cx="25" cy="34" r="1.2" fill="rgba(0,0,0,.2)" />
    </>
  ),
  seeds: (c = "#e3cf9a") => (
    <>
      <ellipse cx="14" cy="16" rx="3.4" ry="2.2" fill={c} transform="rotate(-20 14 16)" />
      <ellipse cx="30" cy="13" rx="3.4" ry="2.2" fill={c} transform="rotate(15 30 13)" />
      <ellipse cx="22" cy="24" rx="3.4" ry="2.2" fill={c} transform="rotate(30 22 24)" />
      <ellipse cx="36" cy="26" rx="3.4" ry="2.2" fill={c} transform="rotate(-25 36 26)" />
      <ellipse cx="15" cy="33" rx="3.4" ry="2.2" fill={c} transform="rotate(10 15 33)" />
      <ellipse cx="28" cy="37" rx="3.4" ry="2.2" fill={c} transform="rotate(-15 28 37)" />
    </>
  ),
  friedOnions: (c = "#d9a05b") => (
    <>
      <path d="M8 18q6-8 12 0t12 0 8-4" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M8 28q6-8 12 0t12 0 8-4" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".8" />
      <path d="M10 38q6-8 12 0t12 0 6-3" stroke={c} strokeWidth="3.5" fill="none" strokeLinecap="round" opacity=".6" />
    </>
  ),
  spice: (c = "#c23b2e") => (
    <>
      <path d="M10 36a14 9 0 0 1 28 0z" fill={c} />
      <circle cx="18" cy="18" r="1.6" fill={c} /><circle cx="26" cy="12" r="1.6" fill={c} /><circle cx="32" cy="19" r="1.6" fill={c} /><circle cx="23" cy="22" r="1.6" fill={c} />
    </>
  ),
  chili: (c = "#5c9143") => (
    <>
      <path d="M34 12c4 10 0 22-12 27-6 3-13 1-14-3 1-1 4-1 8-3 10-4 13-12 14-21z" fill={c} />
      <path d="M34 12q1-5 6-5" stroke="#3e7d3a" strokeWidth="3" fill="none" strokeLinecap="round" />
    </>
  ),
  bottle: (c = "#caa25a") => (
    <>
      <rect x="20" y="5" width="8" height="7" rx="2" fill="#2e4152" />
      <path d="M20 12h8l4 8v20a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V20z" fill={c} />
      <rect x="18" y="24" width="12" height="10" rx="2" fill="rgba(255,255,255,.75)" />
    </>
  ),
  bottleNo: (c = "#9aa6b0") => (
    <>
      <rect x="20" y="5" width="8" height="7" rx="2" fill={c} />
      <path d="M20 12h8l4 8v20a4 4 0 0 1-4 4h-8a4 4 0 0 1-4-4V20z" fill={c} opacity=".5" />
      <path d="M10 40 38 10" stroke="#e4604e" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  lemon: (c = "#f2d541") => (
    <>
      <path d="M10 26c0-8 6-14 14-14 2-2 5-2 6 0 8 0 8 6 8 8 0 8-6 14-14 14-2 2-5 2-6 0-8 0-8-6-8-8z" fill={c} />
      <path d="M17 20q3-4 8-4" stroke="rgba(255,255,255,.6)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </>
  ),
  baguette: (c = "#e4b877") => (
    <>
      <rect x="4" y="18" width="40" height="12" rx="6" fill={c} transform="rotate(-16 24 24)" />
      <path d="M14 24l4-5M22 22l4-5M30 20l4-5" stroke="rgba(0,0,0,.22)" strokeWidth="2.4" strokeLinecap="round" transform="rotate(-4 24 24)" />
    </>
  ),
};

const Ico = ({ icon }) => {
  const [name, color] = Array.isArray(icon) ? icon : [icon];
  const draw = ICONS[name] || ICONS.bowl;
  return (
    <svg className="ico" viewBox="0 0 48 48" aria-hidden="true">
      {draw(color)}
    </svg>
  );
};

// ---------------------------------------------------------------------------
// CALCULS
// ---------------------------------------------------------------------------

function computeTotals(sel) {
  let kcal = 0, p = 0, c = 0, f = 0, hasEstimate = false;
  const picked = [];
  const add = (it, scale = 1, kOverride) => {
    if (!it) return;
    kcal += kOverride ?? it.kcal * scale;
    p += it.p * scale; c += it.c * scale; f += it.f * scale;
    if (it.est) hasEstimate = true;
    picked.push(it);
  };

  sel.bases.forEach((id) => {
    const b = BASES.find((x) => x.id === id);
    if (!b) return;
    if (sel.baseMode === "half") add(b, b.half / b.kcal, b.half);
    else add(b);
  });
  sel.ingredients.forEach((id) => add(ALL_INGREDIENTS.find((x) => x.id === id)));
  sel.bonus.forEach((id) => add(BONUS.find((x) => x.id === id)));

  const amount = sel.sauceAmount ?? DEFAULT_SAUCE_AMOUNT;
  const sauceMl = amount.tbsp * TBSP_ML + amount.tsp * TSP_ML;
  const sauceMult = sauceMl / TBSP_ML;
  const hasRealSauce = sel.sauce && sel.sauce !== "none";
  if (hasRealSauce) add(SAUCES.find((x) => x.id === sel.sauce), sauceMult);
  if (sel.pain) add(PAINS.find((x) => x.id === sel.pain));

  const extraIngr = Math.max(0, sel.ingredients.length - 4);
  const extraBonus = Math.max(0, sel.bonus.length - 1);
  const extraSauceMl = hasRealSauce ? Math.max(0, sauceMl - TBSP_ML) : 0;
  const sauceSupp = (extraSauceMl / TBSP_ML) * DOUBLE_SAUCE_PRICE;
  const supp = extraIngr * EXTRA_ING_PRICE + extraBonus * EXTRA_BONUS_PRICE + sauceSupp;
  const price = BASE_PRICE + supp;

  const pk = p * 4, ck = c * 4, fk = f * 9;
  const macroK = Math.max(1, pk + ck + fk);

  return {
    kcal, p, c, f, picked, extraIngr, extraBonus, sauceMl, sauceSupp, supp, price, hasEstimate,
    pPct: (pk / macroK) * 100, cPct: (ck / macroK) * 100, fPct: (fk / macroK) * 100,
  };
}

// ---------------------------------------------------------------------------
// BOLS SUGGÉRÉS / SUGGESTED BOWLS
// ---------------------------------------------------------------------------

const PRESETS = [
  {
    id: "proteine",
    name: "L'Équilibrée protéinée", nameEn: "The Protein Balance",
    tagline: "Lentilles-quinoa, poulet, œuf et edamames : le plein de protéines sans exploser le compteur.",
    taglineEn: "Lentil-quinoa, chicken, egg and edamame: protein-packed without blowing the counter.",
    sel: { baseMode: "half", bases: ["lentilles", "quinoa"], ingredients: ["poulet-herbes", "oeuf-dur", "edamames", "brocolis-grilles"], bonus: ["graines-sesame"], sauce: "citron-olive", sauceAmount: DEFAULT_SAUCE_AMOUNT, pain: null },
  },
  {
    id: "legere",
    name: "La Toute Légère", nameEn: "The Featherweight",
    tagline: "Croquant, fraîcheur et thon, le tout sous les 200 kcal.",
    taglineEn: "Crunch, freshness and tuna, all under 200 kcal.",
    sel: { baseMode: "full", bases: ["iceberg"], ingredients: ["concombres", "radis", "tomates-cerises", "thon"], bonus: ["persil"], sauce: "jus-citron", sauceAmount: DEFAULT_SAUCE_AMOUNT, pain: null },
  },
  {
    id: "signature",
    name: "La Signature de saison", nameEn: "The Seasonal Signature",
    tagline: "Inspirée de la carte actuelle : quinoa-épinards, poulet miel-sésame, maïs grillé, avocat, fêta et oignons rouges (1 supplément).",
    taglineEn: "Based on the current menu: quinoa-spinach, honey-sesame chicken, grilled corn, avocado, feta and red onions (1 extra).",
    sel: { baseMode: "half", bases: ["quinoa", "epinards"], ingredients: ["poulet-miel", "mais-grille", "avocat", "feta", "oignons-rouges"], bonus: ["persil"], sauce: "french-garden", sauceAmount: DEFAULT_SAUCE_AMOUNT, pain: null },
  },
  {
    id: "vege",
    name: "La Végé Ponzu", nameEn: "The Ponzu Veggie",
    tagline: "Tofu sésame, edamames, brocolis grillés et concombres smashés, façon asiatique.",
    taglineEn: "Sesame tofu, edamame, grilled broccoli and smashed cucumbers, Asian style.",
    sel: { baseMode: "full", bases: ["quinoa"], ingredients: ["tofu-soja-sesame", "edamames", "brocolis-grilles", "concombres-smashes"], bonus: ["graines-sesame"], sauce: "ponzu-sesame", sauceAmount: DEFAULT_SAUCE_AMOUNT, pain: null },
  },
  {
    id: "italienne",
    name: "L'Italienne", nameEn: "The Italian",
    tagline: "Pâtes-roquette, jambon sec, mozzarella, tomates confites, artichauts et pesto.",
    taglineEn: "Pasta-rocket, cured ham, mozzarella, confit tomatoes, artichokes and pesto.",
    sel: { baseMode: "half", bases: ["pates", "roquette"], ingredients: ["jambon-sec", "mozzarella", "tomates-confites", "artichauts"], bonus: ["basilic"], sauce: "pesto-garden", sauceAmount: DEFAULT_SAUCE_AMOUNT, pain: null },
  },
  {
    id: "reconfort",
    name: "La Réconfortante", nameEn: "The Comfort Bowl",
    tagline: "Boulettes, pommes de terre, emmental, oignons frits et sauce chipotle. On assume complètement.",
    taglineEn: "Meatballs, potatoes, emmental, fried onions and chipotle sauce. No regrets.",
    sel: { baseMode: "full", bases: ["perles-ble"], ingredients: ["boulettes", "pommes-terre-moutarde", "emmental", "mais-grille"], bonus: ["oignons-frits"], sauce: "smoky-chipotle", sauceAmount: DEFAULT_SAUCE_AMOUNT, pain: null },
  },
];

// ---------------------------------------------------------------------------
// COMPOSANT
// ---------------------------------------------------------------------------

export default function MisterGardenBuilder() {
  const [lang, setLang] = useState("fr");
  const [tab, setTab] = useState("composer");
  const [baseMode, setBaseMode] = useState("full");
  const [bases, setBases] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [bonus, setBonus] = useState([]);
  const [sauce, setSauce] = useState(null);
  const [sauceAmount, setSauceAmount] = useState(DEFAULT_SAUCE_AMOUNT);
  const [pain, setPain] = useState(null);
  const [activeGroup, setActiveGroup] = useState("chauds");

  const t = STR[lang];
  const L = (it) => (lang === "en" ? it.en ?? it.name : it.name);
  const D = (it) => (lang === "en" ? it.descEn ?? it.desc : it.desc);
  const F = (n, d = 0) =>
    n.toLocaleString(lang === "en" ? "en-GB" : "fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d });
  const euro = (n) => (lang === "en" ? `€${F(n, 2)}` : `${F(n, 2)} €`);
  const kcalTxt = (it, v) => `${it.est ? "≈ " : ""}${F(v ?? it.kcal)} kcal`;

  const maxBases = baseMode === "full" ? 1 : 2;
  const switchMode = (mode) => { setBaseMode(mode); setBases([]); };

  const toggleBase = (id) =>
    setBases((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (baseMode === "full") return [id];
      if (prev.length >= 2) return [prev[1], id];
      return [...prev, id];
    });

  const toggleIn = (setter) => (id) =>
    setter((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const toggleBonus = toggleIn(setBonus);

  const MAX_INGREDIENT_QTY = 5;
  const ingredientQty = (id) => ingredients.filter((x) => x === id).length;
  const incIngredient = (id) =>
    setIngredients((prev) => (prev.filter((x) => x === id).length >= MAX_INGREDIENT_QTY ? prev : [...prev, id]));
  const decIngredient = (id) =>
    setIngredients((prev) => {
      const idx = prev.lastIndexOf(id);
      return idx === -1 ? prev : [...prev.slice(0, idx), ...prev.slice(idx + 1)];
    });

  const bumpTbsp = (d) =>
    setSauceAmount((a) => {
      const tbsp = Math.max(0, Math.min(6, a.tbsp + d));
      return tbsp * TBSP_ML + a.tsp * TSP_ML > 0 ? { ...a, tbsp } : a;
    });
  const bumpTsp = (d) =>
    setSauceAmount((a) => {
      const tsp = Math.max(0, Math.min(8, a.tsp + d));
      return a.tbsp * TBSP_ML + tsp * TSP_ML > 0 ? { ...a, tsp } : a;
    });

  const reset = () => { setBases([]); setIngredients([]); setBonus([]); setSauce(null); setSauceAmount(DEFAULT_SAUCE_AMOUNT); setPain(null); };

  const applyPreset = (preset) => {
    const s = preset.sel;
    setBaseMode(s.baseMode); setBases([...s.bases]); setIngredients([...s.ingredients]);
    setBonus([...s.bonus]); setSauce(s.sauce); setSauceAmount(s.sauceAmount ?? DEFAULT_SAUCE_AMOUNT); setPain(s.pain);
    setTab("composer");
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const totals = useMemo(
    () => computeTotals({ baseMode, bases, ingredients, bonus, sauce, sauceAmount, pain }),
    [baseMode, bases, ingredients, bonus, sauce, sauceAmount, pain]
  );

  const stepDone = {
    base: bases.length === maxBases,
    ingr: ingredients.length >= 1,
    bonus: bonus.length >= 1,
    sauce: sauce !== null,
  };

  const activeItems = INGREDIENT_GROUPS.find((g) => g.key === activeGroup)?.items ?? [];
  const showAmount = sauce && sauce !== "none";

  const chipGroups = [];
  const chipIndex = new Map();
  totals.picked.forEach((it) => {
    if (chipIndex.has(it.id)) chipGroups[chipIndex.get(it.id)].count += 1;
    else { chipIndex.set(it.id, chipGroups.length); chipGroups.push({ item: it, count: 1 }); }
  });

  const Card = ({ item, selected, onClick, sub, badge }) => (
    <button className={`card ${selected ? "card--on" : ""}`} onClick={onClick} aria-pressed={selected}>
      <Ico icon={item.icon} />
      <span className="card__name">{L(item)}</span>
      <span className="card__kcal">{sub ?? kcalTxt(item)}</span>
      {badge && <span className="card__badge">{badge}</span>}
      {selected && <span className="card__check" aria-hidden="true">✓</span>}
    </button>
  );

  const QtyCard = ({ item, qty, onInc, onDec }) => (
    <div className={`card qcard ${qty > 0 ? "card--on" : ""}`}>
      <button type="button" className="qcard__hit" onClick={onInc} aria-label={`${L(item)} +1`}>
        <Ico icon={item.icon} />
        <span className="card__name">{L(item)}</span>
        <span className="card__kcal">{kcalTxt(item)}</span>
      </button>
      {qty > 0 && (
        <button type="button" className="qcard__minus" onClick={onDec} aria-label={`${L(item)} −1`}>−</button>
      )}
      {qty === 1 && <span className="card__check" aria-hidden="true">✓</span>}
      {qty > 1 && <span className="qcard__qty" aria-hidden="true">×{qty}</span>}
    </div>
  );

  const SauceCard = ({ item }) => {
    const selected = sauce === item.id;
    return (
      <button className={`scard ${selected ? "scard--on" : ""}`} onClick={() => setSauce(selected ? null : item.id)} aria-pressed={selected}>
        <Ico icon={item.icon} />
        <span className="scard__body">
          <span className="scard__name">{L(item)}</span>
          <span className="scard__desc">{D(item)}</span>
          <span className="scard__kcal">{item.id === "none" ? "0 kcal" : kcalTxt(item)}</span>
        </span>
        {selected && <span className="card__check" aria-hidden="true">✓</span>}
      </button>
    );
  };

  return (
    <div className="mg">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&family=Karla:ital,wght@0,400;0,500;0,700;1,400&display=swap');

        .mg {
          --ink: #2e4152; --ink-deep: #24333f; --powder: #a9c6df; --powder-soft: #dce8f2;
          --coral: #e4604e; --coral-soft: #fbe7e3; --paper: #f4f3ee; --card: #ffffff; --line: #e3e0d7;
          font-family: 'Karla', sans-serif; background: var(--paper); color: var(--ink);
          min-height: 100vh; padding-bottom: 96px;
        }
        .mg * { box-sizing: border-box; }
        .mg button { font-family: inherit; cursor: pointer; color: inherit; }
        .ico { width: 36px; height: 36px; display: block; }

        .hero { position: relative; background: var(--ink); color: #fff; padding: 32px 20px 26px; text-align: center; }
        .hero__eyebrow { font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .42em; text-transform: uppercase; color: var(--powder); margin-bottom: 10px; }
        .hero__title { font-family: 'Jost', sans-serif; font-weight: 600; font-size: clamp(24px, 4.5vw, 42px); letter-spacing: .14em; text-transform: uppercase; margin: 0; }
        .hero__title em { font-style: normal; color: var(--coral); }
        .hero__bowtie { color: var(--coral); font-size: 14px; letter-spacing: .3em; margin-top: 10px; }
        .formula { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 18px; margin-top: 16px; font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; }
        .formula b { color: var(--coral); font-weight: 700; margin-right: 5px; }
        .formula span { color: var(--powder); }

        .langToggle { position: absolute; top: 14px; right: 14px; display: inline-flex; border: 1.5px solid var(--powder); border-radius: 999px; overflow: hidden; }
        .langToggle button { border: none; background: transparent; color: var(--powder); padding: 5px 12px; font-family: 'Jost', sans-serif; font-size: 12px; letter-spacing: .1em; font-weight: 700; }
        .langToggle button.on { background: var(--powder); color: var(--ink); }

        .nav { display: flex; justify-content: center; margin-top: 20px; }
        .nav button { border: 1.5px solid var(--powder); background: transparent; color: var(--powder); padding: 9px 22px; font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; }
        .nav button:first-child { border-radius: 999px 0 0 999px; }
        .nav button:last-child { border-radius: 0 999px 999px 0; border-left: none; }
        .nav button.on { background: var(--coral); border-color: var(--coral); color: #fff; }

        .wrap { max-width: 1180px; margin: 0 auto; padding: 26px 18px 0; display: grid; grid-template-columns: 1fr; gap: 26px; }
        @media (min-width: 980px) { .wrap { grid-template-columns: 1fr 370px; align-items: start; } }

        .step { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px 18px 20px; margin-bottom: 20px; }
        .step__head { display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap; margin-bottom: 4px; }
        .step__num { font-family: 'Jost', sans-serif; font-weight: 700; font-size: 26px; color: var(--coral); line-height: 1; }
        .step__title { font-family: 'Jost', sans-serif; font-weight: 600; font-size: 19px; letter-spacing: .14em; text-transform: uppercase; }
        .step__done { color: #3f9e6e; font-weight: 700; font-size: 15px; }
        .step__hint { font-size: 13.5px; color: #6b7986; margin: 2px 0 14px; }
        .step__hint b { color: var(--coral); }

        .modeToggle { display: inline-flex; border: 1.5px solid var(--ink); border-radius: 999px; overflow: hidden; margin-bottom: 14px; }
        .modeToggle button { border: none; background: transparent; padding: 7px 16px; font-family: 'Jost', sans-serif; font-size: 12.5px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink); font-weight: 600; }
        .modeToggle button.on { background: var(--ink); color: #fff; }
        .amountRow { display: flex; align-items: center; gap: 18px; flex-wrap: wrap; margin-bottom: 8px; }
        .amountRow label { font-size: 13px; font-weight: 700; width: 100%; }
        .stepperGroup { display: flex; align-items: center; gap: 9px; }
        .stepperGroup__label { font-size: 12.5px; color: #5a6975; font-weight: 600; }
        .stepper { display: inline-flex; align-items: center; border: 1.5px solid var(--ink); border-radius: 999px; overflow: hidden; }
        .stepper button { border: none; background: transparent; width: 28px; height: 28px; font-family: 'Jost', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); line-height: 1; display: grid; place-items: center; }
        .stepper button:hover:not(:disabled) { background: var(--ink); color: #fff; }
        .stepper button:disabled { color: #c7ccd1; cursor: default; }
        .stepper__val { min-width: 22px; text-align: center; font-family: 'Jost', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink); }
        .amountTotal { font-size: 12.5px; font-weight: 700; color: var(--ink); margin: 0 0 4px; }
        .amountNote { font-size: 11.5px; color: #8a94a0; margin: 0 0 12px; }

        .tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
        .tabs button { border: 1.5px solid var(--line); background: var(--paper); border-radius: 999px; padding: 6px 13px; font-size: 13px; font-weight: 700; color: #5a6975; }
        .tabs button.on { border-color: var(--ink); background: var(--ink); color: #fff; }

        .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 10px; }
        .card { position: relative; display: flex; flex-direction: column; align-items: center; gap: 5px; background: var(--paper); border: 1.5px solid var(--line); border-radius: 14px; padding: 12px 8px 10px; text-align: center; transition: transform .12s ease, border-color .12s ease, background .12s ease; }
        .card:hover { transform: translateY(-2px); border-color: var(--powder); }
        .card:focus-visible, .scard:focus-visible { outline: 3px solid var(--powder); outline-offset: 2px; }
        .card--on { background: var(--coral-soft); border-color: var(--coral); }
        .card__name { font-size: 12.5px; font-weight: 700; line-height: 1.25; color: var(--ink); }
        .card__kcal { font-size: 11.5px; color: #7a8794; }
        .card__check { position: absolute; top: 6px; right: 8px; width: 18px; height: 18px; border-radius: 50%; background: var(--coral); color: #fff; font-size: 11px; font-weight: 700; display: grid; place-items: center; }
        .card__badge { position: absolute; top: 6px; left: 8px; background: var(--powder); color: var(--ink-deep); font-size: 10px; font-weight: 700; border-radius: 999px; padding: 2px 6px; }

        .qcard { padding: 0; }
        .qcard__hit { display: flex; flex-direction: column; align-items: center; gap: 5px; width: 100%; background: transparent; border: none; padding: 12px 8px 10px; text-align: center; }
        .qcard .qcard__minus { position: absolute; top: 6px; left: 8px; width: 20px; height: 20px; border-radius: 50%; background: var(--ink); color: #fff; font-size: 13px; font-weight: 700; line-height: 1; display: grid; place-items: center; padding: 0; }
        .qcard .qcard__minus:hover { background: var(--coral); }
        .qcard__qty { position: absolute; top: 6px; right: 8px; min-width: 18px; height: 18px; padding: 0 5px; border-radius: 999px; background: var(--coral); color: #fff; font-size: 10.5px; font-weight: 700; display: grid; place-items: center; }

        .sgrid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 10px; }
        .scard { position: relative; display: flex; gap: 12px; align-items: flex-start; background: var(--paper); border: 1.5px solid var(--line); border-radius: 14px; padding: 12px; text-align: left; transition: border-color .12s ease, background .12s ease; }
        .scard:hover { border-color: var(--powder); }
        .scard--on { background: var(--coral-soft); border-color: var(--coral); }
        .scard .ico { flex: none; margin-top: 2px; }
        .scard__body { display: flex; flex-direction: column; gap: 3px; }
        .scard__name { font-size: 13.5px; font-weight: 700; color: var(--ink); }
        .scard__desc { font-size: 12px; color: #6b7986; line-height: 1.4; }
        .scard__kcal { font-size: 11.5px; color: #7a8794; font-weight: 700; }

        .counter { display: inline-flex; align-items: center; gap: 8px; margin-left: auto; font-size: 13px; font-weight: 700; }
        .counter__pill { background: var(--powder-soft); border-radius: 999px; padding: 3px 11px; }
        .counter__pill--extra { background: var(--coral); color: #fff; }

        .summary { position: sticky; top: 16px; display: flex; flex-direction: column; gap: 16px; }
        .bowlCard { background: var(--ink); border-radius: 18px; padding: 20px 18px 0; color: #fff; }
        .bowlCard__title { font-family: 'Jost', sans-serif; font-size: 13px; letter-spacing: .3em; text-transform: uppercase; color: var(--powder); text-align: center; margin-bottom: 6px; }
        .bowl { position: relative; padding-bottom: 66px; }
        .bowl__items { position: relative; z-index: 1; min-height: 106px; display: flex; flex-wrap: wrap; align-content: flex-end; justify-content: center; gap: 6px 8px; padding: 14px 26px 10px; }
        .bowl__items .ico { width: 27px; height: 27px; animation: pop .25s ease; }
        @media (prefers-reduced-motion: reduce) { .bowl__items .ico { animation: none; } }
        @keyframes pop { from { transform: scale(0) rotate(-20deg); } to { transform: scale(1) rotate(0); } }
        .bowl__shape { position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 230px; height: 66px; background: var(--paper); border-radius: 0 0 130px 130px; box-shadow: 0 -3px 0 var(--coral); }
        .bowl__empty { position: absolute; inset: 0 0 66px 0; display: grid; place-items: center; color: #8fa5b8; font-size: 13.5px; font-style: italic; padding: 0 30px; text-align: center; }

        .label { background: var(--card); border: 2px solid var(--ink); border-radius: 14px; padding: 16px 16px 14px; }
        .label__title { font-family: 'Jost', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: .18em; text-transform: uppercase; border-bottom: 6px solid var(--ink); padding-bottom: 7px; margin-bottom: 10px; }
        .label__kcal { display: flex; justify-content: space-between; align-items: baseline; padding: 4px 0 8px; border-bottom: 3px solid var(--ink); }
        .label__kcal b { font-family: 'Jost', sans-serif; font-size: 34px; font-weight: 700; }
        .label__kcal span { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; }
        .label__row { display: flex; justify-content: space-between; padding: 7px 0; border-bottom: 1px solid var(--line); font-size: 14.5px; }
        .label__row b { font-variant-numeric: tabular-nums; }
        .macrobar { display: flex; height: 12px; border-radius: 999px; overflow: hidden; margin-top: 12px; background: var(--line); }
        .macrobar div { height: 100%; }
        .legend { display: flex; gap: 14px; margin-top: 8px; font-size: 11.5px; color: #5a6975; flex-wrap: wrap; }
        .legend i { display: inline-block; width: 9px; height: 9px; border-radius: 50%; margin-right: 5px; }
        .label__note { font-size: 11px; color: #8a94a0; margin-top: 10px; line-height: 1.45; }

        .price { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 14px 16px; }
        .price__main { display: flex; justify-content: space-between; align-items: baseline; font-family: 'Jost', sans-serif; }
        .price__main b { font-size: 26px; font-weight: 700; color: var(--coral); }
        .price__main span { font-size: 13px; letter-spacing: .12em; text-transform: uppercase; font-weight: 600; }
        .price__detail { font-size: 12.5px; color: #6b7986; margin-top: 4px; }

        .chips { display: flex; flex-wrap: wrap; gap: 6px; }
        .chip { display: inline-flex; align-items: center; gap: 6px; background: var(--powder-soft); border-radius: 999px; padding: 4px 10px 4px 6px; font-size: 12px; font-weight: 700; }
        .chip .ico { width: 15px; height: 15px; }

        .resetBtn { border: 1.5px solid var(--ink); background: transparent; color: var(--ink); border-radius: 999px; padding: 9px 18px; font-family: 'Jost', sans-serif; font-size: 12.5px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; align-self: flex-start; }
        .resetBtn:hover { background: var(--ink); color: #fff; }

        .sug { max-width: 1180px; margin: 0 auto; padding: 26px 18px 0; }
        .sug__grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
        .pcard { background: var(--card); border: 1px solid var(--line); border-radius: 16px; padding: 18px; display: flex; flex-direction: column; gap: 10px; }
        .pcard__name { font-family: 'Jost', sans-serif; font-weight: 600; font-size: 18px; letter-spacing: .08em; text-transform: uppercase; color: var(--ink); }
        .pcard__tag { font-size: 13.5px; color: #5a6975; line-height: 1.5; min-height: 40px; }
        .pcard__icons { display: flex; gap: 4px; flex-wrap: wrap; }
        .pcard__icons .ico { width: 26px; height: 26px; }
        .pcard__stats { display: flex; gap: 14px; font-size: 13px; font-weight: 700; flex-wrap: wrap; }
        .pcard__stats b { font-family: 'Jost', sans-serif; font-size: 17px; color: var(--coral); }
        .pcard__btn { margin-top: auto; border: none; background: var(--ink); color: #fff; border-radius: 999px; padding: 10px 16px; font-family: 'Jost', sans-serif; font-size: 12.5px; letter-spacing: .14em; text-transform: uppercase; font-weight: 600; }
        .pcard__btn:hover { background: var(--coral); }

        .mobilebar { position: fixed; bottom: 0; left: 0; right: 0; background: var(--ink); color: #fff; display: flex; justify-content: space-between; align-items: center; padding: 12px 18px; font-family: 'Jost', sans-serif; z-index: 50; }
        .mobilebar b { color: var(--coral); font-size: 18px; }
        .mobilebar span { font-size: 13px; letter-spacing: .06em; }
        @media (min-width: 980px) { .mobilebar { display: none; } .mg { padding-bottom: 40px; } }

        .footer { max-width: 1180px; margin: 8px auto 0; padding: 0 18px 30px; font-size: 12px; color: #8a94a0; line-height: 1.55; }
      `}</style>

      {/* ---------- HERO ---------- */}
      <header className="hero">
        <div className="langToggle" role="tablist" aria-label="Language">
          <button className={lang === "fr" ? "on" : ""} onClick={() => setLang("fr")}>FR</button>
          <button className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
        </div>
        <div className="hero__eyebrow">{t.eyebrow}</div>
        <h1 className="hero__title">{t.title[0]}<em>{t.title[1]}</em>{t.title[2]}</h1>
        <div className="hero__bowtie">⋈</div>
        <div className="formula">
          <div><b>1</b><span>{t.fBase}</span></div>
          <div><b>+4</b><span>{t.fIngr}</span></div>
          <div><b>+1</b><span>{t.fBonus}</span></div>
          <div><b>+1</b><span>{t.fSauce}</span></div>
        </div>
        <nav className="nav">
          <button className={tab === "composer" ? "on" : ""} onClick={() => setTab("composer")}>{t.navBuild}</button>
          <button className={tab === "suggestions" ? "on" : ""} onClick={() => setTab("suggestions")}>{t.navSug}</button>
        </nav>
      </header>

      {/* ---------- SUGGESTIONS ---------- */}
      {tab === "suggestions" && (
        <section className="sug">
          <div className="sug__grid">
            {PRESETS.map((preset) => {
              const tt = computeTotals(preset.sel);
              return (
                <article key={preset.id} className="pcard">
                  <div className="pcard__name">{lang === "en" ? preset.nameEn : preset.name}</div>
                  <p className="pcard__tag">{lang === "en" ? preset.taglineEn : preset.tagline}</p>
                  <div className="pcard__icons">
                    {tt.picked.map((it, i) => <Ico key={`${preset.id}-${it.id}-${i}`} icon={it.icon} />)}
                  </div>
                  <div className="pcard__stats">
                    <span><b>{tt.hasEstimate ? "≈ " : ""}{F(tt.kcal)}</b> kcal</span>
                    <span><b>{F(tt.p)}</b> {t.gProt}</span>
                    <span><b>{euro(tt.price)}</b></span>
                  </div>
                  <button className="pcard__btn" onClick={() => applyPreset(preset)}>{t.buildThis}</button>
                </article>
              );
            })}
          </div>
          <div className="footer" style={{ padding: "18px 0 10px" }}>{t.sugFoot}</div>
        </section>
      )}

      {/* ---------- COMPOSER ---------- */}
      {tab === "composer" && (
      <div className="wrap">
        <main>
          {/* STEP 1 : BASE */}
          <section className="step">
            <div className="step__head">
              <span className="step__num">1</span>
              <span className="step__title">{t.stepBase}</span>
              {stepDone.base && <span className="step__done">✓</span>}
              <span className="counter"><span className="counter__pill">{bases.length}/{maxBases}</span></span>
            </div>
            <p className="step__hint">{t.baseHint[0]}<b>{t.baseHint[1]}</b>{t.baseHint[2]}</p>
            <div className="modeToggle" role="tablist">
              <button className={baseMode === "full" ? "on" : ""} onClick={() => switchMode("full")}>{t.mode1}</button>
              <button className={baseMode === "half" ? "on" : ""} onClick={() => switchMode("half")}>{t.mode2}</button>
            </div>
            <div className="grid">
              {BASES.map((b) => (
                <Card
                  key={b.id}
                  item={b}
                  selected={bases.includes(b.id)}
                  onClick={() => toggleBase(b.id)}
                  sub={kcalTxt(b, baseMode === "half" ? b.half : b.kcal)}
                  badge={baseMode === "half" ? "½" : null}
                />
              ))}
            </div>
          </section>

          {/* STEP 2 : INGREDIENTS */}
          <section className="step">
            <div className="step__head">
              <span className="step__num">2</span>
              <span className="step__title">{t.stepIngr}</span>
              {stepDone.ingr && <span className="step__done">✓</span>}
              <span className="counter">
                <span className="counter__pill">{Math.min(ingredients.length, 4)}/4 {t.included}</span>
                {totals.extraIngr > 0 && (
                  <span className="counter__pill counter__pill--extra">
                    +{totals.extraIngr} {t.extra} (+{euro(totals.extraIngr * EXTRA_ING_PRICE)})
                  </span>
                )}
              </span>
            </div>
            <p className="step__hint">{t.ingrHint[0]}<b>{t.ingrHint[1]}</b>{t.ingrHint[2]}</p>
            <div className="tabs">
              {INGREDIENT_GROUPS.map((g) => {
                const n = g.items.reduce((sum, it) => sum + ingredientQty(it.id), 0);
                return (
                  <button key={g.key} className={activeGroup === g.key ? "on" : ""} onClick={() => setActiveGroup(g.key)}>
                    {lang === "en" ? g.labelEn : g.label}{n > 0 ? ` · ${n}` : ""}
                  </button>
                );
              })}
            </div>
            <div className="grid">
              {activeItems.map((it) => (
                <QtyCard
                  key={it.id}
                  item={it}
                  qty={ingredientQty(it.id)}
                  onInc={() => incIngredient(it.id)}
                  onDec={() => decIngredient(it.id)}
                />
              ))}
            </div>
          </section>

          {/* STEP 3 : BONUS */}
          <section className="step">
            <div className="step__head">
              <span className="step__num">3</span>
              <span className="step__title">{t.stepBonus}</span>
              {stepDone.bonus && <span className="step__done">✓</span>}
              <span className="counter">
                <span className="counter__pill">{Math.min(bonus.length, 1)}/1 {t.included}</span>
                {totals.extraBonus > 0 && (
                  <span className="counter__pill counter__pill--extra">
                    +{totals.extraBonus} {t.extra} (+{euro(totals.extraBonus * EXTRA_BONUS_PRICE)})
                  </span>
                )}
              </span>
            </div>
            <p className="step__hint">{t.bonusHint[0]}<b>{t.bonusHint[1]}</b>{t.bonusHint[2]}</p>
            <div className="grid">
              {BONUS.map((it) => (
                <Card key={it.id} item={it} selected={bonus.includes(it.id)} onClick={() => toggleBonus(it.id)} />
              ))}
            </div>
          </section>

          {/* STEP 4 : SAUCE */}
          <section className="step">
            <div className="step__head">
              <span className="step__num">4</span>
              <span className="step__title">{t.stepSauce}</span>
              {stepDone.sauce && <span className="step__done">✓</span>}
            </div>
            <p className="step__hint">{t.sauceHint[0]}<b>{t.sauceHint[1]}</b>{t.sauceHint[2]}</p>
            {showAmount && (
              <>
                <div className="amountRow">
                  <label>{t.amountLabel}</label>
                  <div className="stepperGroup">
                    <span className="stepperGroup__label">{t.amountTbsp} (15 ml)</span>
                    <div className="stepper" role="group" aria-label={t.amountTbsp}>
                      <button type="button" onClick={() => bumpTbsp(-1)} disabled={sauceAmount.tbsp === 0} aria-label="−1">−</button>
                      <span className="stepper__val">{sauceAmount.tbsp}</span>
                      <button type="button" onClick={() => bumpTbsp(1)} aria-label="+1">+</button>
                    </div>
                  </div>
                  <div className="stepperGroup">
                    <span className="stepperGroup__label">{t.amountTsp} (5 ml)</span>
                    <div className="stepper" role="group" aria-label={t.amountTsp}>
                      <button type="button" onClick={() => bumpTsp(-1)} disabled={sauceAmount.tsp === 0} aria-label="−1">−</button>
                      <span className="stepper__val">{sauceAmount.tsp}</span>
                      <button type="button" onClick={() => bumpTsp(1)} aria-label="+1">+</button>
                    </div>
                  </div>
                </div>
                <p className="amountTotal">
                  {t.amountTotal}: <b>{totals.sauceMl} ml</b>
                  {totals.sauceSupp > 0.004 ? ` · +${euro(totals.sauceSupp)}` : ""}
                </p>
                <p className="amountNote">{t.amountNote}</p>
              </>
            )}
            <div className="sgrid">
              {SAUCES.map((s) => <SauceCard key={s.id} item={s} />)}
            </div>
          </section>

          {/* STEP 5 : PAIN / BREAD */}
          <section className="step">
            <div className="step__head">
              <span className="step__num">+</span>
              <span className="step__title">{t.stepBread}</span>
            </div>
            <p className="step__hint">{t.breadHint}</p>
            <div className="grid">
              {PAINS.map((b) => (
                <Card key={b.id} item={b} selected={pain === b.id} onClick={() => setPain(pain === b.id ? null : b.id)} />
              ))}
            </div>
          </section>
        </main>

        {/* ---------- SUMMARY ---------- */}
        <aside className="summary">
          <div className="bowlCard">
            <div className="bowlCard__title">{t.yourBowl}</div>
            <div className="bowl">
              {totals.picked.length === 0 ? (
                <div className="bowl__empty">{t.emptyBowl}</div>
              ) : (
                <div className="bowl__items">
                  {totals.picked.map((it, i) => <Ico key={`${it.id}-${i}`} icon={it.icon} />)}
                </div>
              )}
              <div className="bowl__shape" />
            </div>
          </div>

          <div className="label">
            <div className="label__title">{t.nutrition}</div>
            <div className="label__kcal">
              <span>{t.energy}</span>
              <b>{totals.hasEstimate ? "≈ " : ""}{F(totals.kcal)} kcal</b>
            </div>
            <div className="label__row"><span>{t.protein}</span><b>{F(totals.p, 1)} g</b></div>
            <div className="label__row"><span>{t.carbs}</span><b>{F(totals.c, 1)} g</b></div>
            <div className="label__row"><span>{t.fat}</span><b>{F(totals.f, 1)} g</b></div>
            <div className="macrobar" aria-hidden="true">
              <div style={{ width: `${totals.pPct}%`, background: "#e4604e" }} />
              <div style={{ width: `${totals.cPct}%`, background: "#a9c6df" }} />
              <div style={{ width: `${totals.fPct}%`, background: "#2e4152" }} />
            </div>
            <div className="legend">
              <span><i style={{ background: "#e4604e" }} />{t.lProt} {F(totals.pPct)} %</span>
              <span><i style={{ background: "#a9c6df" }} />{t.lCarb} {F(totals.cPct)} %</span>
              <span><i style={{ background: "#2e4152" }} />{t.lFat} {F(totals.fPct)} %</span>
            </div>
            <p className="label__note">{t.note}</p>
          </div>

          <div className="price">
            <div className="price__main">
              <span>{t.priceTitle}</span>
              <b>{euro(totals.price)}</b>
            </div>
            <div className="price__detail">
              {t.salad} {euro(BASE_PRICE)}
              {totals.supp > 0 ? ` ${t.priceSupp} ${euro(totals.supp)}` : ` ${t.priceFrom}`}
              {" "}{t.priceVar}
            </div>
          </div>

          {totals.picked.length > 0 && (
            <div className="price">
              <div className="chips">
                {chipGroups.map(({ item, count }) => (
                  <span key={`${item.id}-chip`} className="chip">
                    <Ico icon={item.icon} /> {L(item)}{count > 1 ? ` ×${count}` : ""}
                  </span>
                ))}
              </div>
            </div>
          )}

          <button className="resetBtn" onClick={reset}>{t.restart}</button>
        </aside>
      </div>
      )}

      <div className="footer">{t.footer}</div>

      <div className="mobilebar">
        <span>{totals.hasEstimate ? "≈ " : ""}{F(totals.kcal)} kcal · P {F(totals.p)} g</span>
        <b>{euro(totals.price)}</b>
      </div>
    </div>
  );
}
