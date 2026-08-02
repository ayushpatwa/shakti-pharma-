// ==========================================
// SHAKTI PHARMA - APPLICATION CORE SCRIPT
// ==========================================

// --- Firebase Configuration & Fallback System ---
// Replace the values below with your client's actual keys from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAbFF8xbqfl0I0-Bj__oPhg9xnSiYP_3tc",
  authDomain: "shakti-paharma.firebaseapp.com",
  projectId: "shakti-paharma",
  storageBucket: "shakti-paharma.firebasestorage.app",
  messagingSenderId: "111238240652",
  appId: "1:111238240652:web:be488b5127f6947f649ea9",
  measurementId: "G-HFVGWS7FWB"
};

// Global flags and DB reference
let isFirebaseActive = false;
let db = null;

try {
  // Check if firebase is loaded and keys are customized (not placeholders)
  if (typeof firebase !== 'undefined' && firebaseConfig.projectId && !firebaseConfig.projectId.includes('YOUR_')) {
    firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    isFirebaseActive = true;
    console.log("🔥 Successfully connected to Firebase Cloud Database!");
  } else {
    console.warn("⚠️ Firebase is not configured. Falling back to local storage (Offline Mode).");
  }
} catch (error) {
  console.error("❌ Failed to initialize Firebase:", error);
}

// --- Custom SVGs Generator for Products (Data URLs) ---
function generateProductSVG(color, labelTitle, iconType) {
  let iconSvg = '';
  if (iconType === 'leaf') {
    iconSvg = `<path d="M50 35C50 35 30 55 30 68C30 78 38 85 50 85C62 85 70 78 70 68C70 55 50 35 50 35Z" fill="${color}" opacity="0.2"/>
               <path d="M50 38V85" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
               <path d="M50 50C43 55 40 58 35 60" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
               <path d="M50 62C57 67 60 70 65 72" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else if (iconType === 'lungs') {
    iconSvg = `<path d="M35 50C30 50 25 55 25 65C25 75 35 80 45 75C48 73 48 65 48 60C48 55 40 50 35 50Z" fill="${color}" opacity="0.25" stroke="${color}" stroke-width="2"/>
               <path d="M65 50C70 50 75 55 75 65C75 75 65 80 55 75C52 73 52 65 52 60C52 55 60 50 65 50Z" fill="${color}" opacity="0.25" stroke="${color}" stroke-width="2"/>
               <path d="M50 40V60" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
  } else if (iconType === 'blood') {
    iconSvg = `<path d="M50 35C50 35 28 58 28 72C28 82.5 37.5 90 50 90C62.5 90 72 82.5 72 72C72 58 50 35 50 35Z" fill="#b91c1c" opacity="0.25"/>
               <path d="M50 42C50 42 36 60 36 70C36 78 42 82 50 82C58 82 64 78 64 70C64 60 50 42 50 42Z" fill="#b91c1c" opacity="0.4"/>`;
  } else if (iconType === 'liver') {
    iconSvg = `<path d="M25 50C25 40 45 42 50 52C55 42 75 40 75 50C75 65 60 85 50 85C40 85 25 65 25 50Z" fill="${color}" opacity="0.3" stroke="${color}" stroke-width="2.5"/>
               <circle cx="43" cy="55" r="4" fill="${color}" opacity="0.5"/>
               <circle cx="57" cy="62" r="5" fill="${color}" opacity="0.5"/>`;
  } else if (iconType === 'baby') {
    iconSvg = `<circle cx="50" cy="50" r="18" stroke="${color}" stroke-width="3" fill="${color}" opacity="0.15"/>
               <path d="M42 45H58M50 37V53" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
               <path d="M40 68C45 74 55 74 60 68" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>`;
  } else {
    // Default Heart/Cross combo
    iconSvg = `<rect x="35" y="45" width="30" height="30" rx="6" fill="${color}" opacity="0.2"/>
               <path d="M50 38V72M33 55H67" stroke="${color}" stroke-width="4.5" stroke-linecap="round"/>`;
  }

  const svgString = `<svg viewBox="0 0 100 150" width="100" height="150" xmlns="http://www.w3.org/2000/svg">
    <!-- Bottle glass -->
    <rect x="20" y="35" width="60" height="105" rx="18" fill="#2d2219" opacity="0.95"/>
    <rect x="23" y="38" width="54" height="99" rx="15" fill="#443224" opacity="0.5"/>
    <!-- Neck -->
    <rect x="42" y="15" width="16" height="20" fill="#2d2219"/>
    <!-- Cap -->
    <rect x="37" y="5" width="26" height="10" rx="3" fill="#ad8b3a"/>
    <!-- Label background -->
    <rect x="27" y="55" width="46" height="65" rx="6" fill="#fafafa"/>
    <rect x="29" y="57" width="42" height="61" rx="4" fill="none" stroke="${color}" stroke-width="1"/>
    <!-- Label Details -->
    <text x="50" y="70" font-family="'Playfair Display', serif" font-size="7" font-weight="bold" fill="${color}" text-anchor="middle">${labelTitle}</text>
    <line x1="33" y1="76" x2="67" y2="76" stroke="${color}" stroke-width="0.5" opacity="0.5"/>
    <!-- Embedded Icon -->
    <g transform="translate(15, 27) scale(0.7)">
      ${iconSvg}
    </g>
    <!-- Footnote -->
    <text x="50" y="112" font-family="'Outfit', sans-serif" font-size="3.5" fill="#ad8b3a" text-anchor="middle" letter-spacing="0.5">SHAKTI PHARMA</text>
    <!-- Shine reflection -->
    <path d="M30 45C30 45 35 41 42 41" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" opacity="0.12"/>
  </svg>`;
  
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svgString);
}

// --- Initial Seed Products Database ---
// --- Initial Seed Products Database ---
const defaultProducts = [
  {
    id: "p1",
    title: "Female Cordial",
    category: "Women's Health",
    price: 145,
    description: "A premium uterine restorative tonic designed to treat physiological disorders, regulate menstrual cycles, ease menopausal syndromes, and relieve general fatigue.",
    ingredients: "Ashoka, Lodhra, Shatavari, Ashwagandha, Triphala, Mulethi",
    image: "images/female cordial/39a0170c-2509-40ab-9900-507a166059bd.png",
    images: [
      "images/female cordial/39a0170c-2509-40ab-9900-507a166059bd.png",
      "images/female cordial/0ff0b639-769a-444c-8fd7-582de7097a18.png",
      "images/female cordial/3d0b9937-3ca1-4440-97f0-338736b5f386.png",
      "images/female cordial/f3cc1f97-9f28-4e8a-a6be-5b5f940b2d1b.png",
      "images/female cordial/fa8b5916-56a1-4629-a547-98e92e2eacd6.png"
    ],
    dosage: "7 ml (two teaspoonfuls) diluted with four teaspoonfuls of water, taken twice daily before meals.",
    active: true
  },
  {
    id: "p2",
    title: "Asmarin Syrup",
    category: "Respiratory Care",
    price: 180,
    description: "Highly effective bronchodilator syrup that provides rapid relief in bronchial asthma, allergic bronchitis, wheezing, and chronic respiratory congestion.",
    ingredients: "Vasa, Somlata, Kantkari, Yashtimadhu, Bharangi, Tulsi",
    image: "images/asmarin 3/a7c5c0ec-663f-4f8a-9d98-b2d6c6d4aa08.png",
    images: [
      "images/asmarin 3/a7c5c0ec-663f-4f8a-9d98-b2d6c6d4aa08.png",
      "images/asmarin 3/a231b689-74ae-4ef8-aa2a-d7a6830f9f31.png",
      "images/asmarin 3/e3a3d89a-4144-4db5-abb8-0a19b51dbb12.png"
    ],
    dosage: "5 ml to 10 ml (1 to 2 teaspoonfuls) with warm water twice daily, or as directed by a physician.",
    active: true
  },
  {
    id: "p3",
    title: "Hemotone Tonic",
    category: "Restorative Tonics",
    price: 165,
    description: "Iron-rich herbal health supplement to treat anemia, optimize hemoglobin counts, support blood purification, and promote overall vitality and physical recovery.",
    ingredients: "Lauh Bhasma, Punarnava, Draksha, Amalaki, Haritaki",
    image: "images/hemotone/7e5bb579-7301-4f15-9f85-3780efe0c559.png",
    images: [
      "images/hemotone/7e5bb579-7301-4f15-9f85-3780efe0c559.png",
      "images/hemotone/62ba1671-5156-4950-ab60-92ce52e7f06d.png",
      "images/hemotone/7184e9d5-8ee8-4cac-bcf9-2f5888f2b8b1.png",
      "images/hemotone/a093fb1a-bf5c-4caa-8f9e-68010a9b8f5a.png",
      "images/hemotone/f1ec9b88-7b54-4f4f-a653-a121183dce66.png"
    ],
    dosage: "10 ml (two teaspoonfuls) twice daily after meals, preferably with water or milk.",
    active: true
  },
  {
    id: "p4",
    title: "Damarin Drops",
    category: "Pediatrics",
    price: 120,
    description: "Specialized pediatric drop formulation aiding fast recovery from whooping cough, spasmodic cough, acute infantile bronchitis, and teething-related gripes.",
    ingredients: "Vasaka, Kantakari, Pippali, Yashtimadhu, Honey",
    image: "images/damarin'/54af6678-96d4-4605-a218-f163be406469.png",
    images: [
      "images/damarin'/54af6678-96d4-4605-a218-f163be406469.png",
      "images/damarin'/1c19afd4-9565-4fef-9a3c-8003b314cd71.png",
      "images/damarin'/82666aa1-b4d4-4160-b954-1005817041ed.png",
      "images/damarin'/a58bf5bd-7856-47b3-a401-a7a12237538a.png",
      generateProductSVG('#d97706', 'DAMARIN', 'cross')
    ],
    dosage: "5 to 10 drops diluted in a spoonful of lukewarm water, 3 to 4 times a day, or as directed by a pediatrician.",
    active: true
  },
  {
    id: "p5",
    title: "Livero Syrup",
    category: "Liver Care",
    price: 150,
    description: "Rejuvenating hepatoprotective syrup to reverse jaundice, correct liver enlargement, counter drug-induced liver toxicity, and stimulate natural appetite.",
    ingredients: "Bhringraj, Bhumi Amla, Kalmegh, Kutki, Punarnava, Giloy",
    image: "images/livero/235db2bc-95da-468b-9857-34234de0828f.png",
    images: [
      "images/livero/235db2bc-95da-468b-9857-34234de0828f.png",
      "images/livero/56aeba6c-4325-4134-ac1d-407ef5c14c6d.png",
      "images/livero/8d32c318-1f92-4514-9676-dc2faffbdea1.png",
      "images/livero/ce45453f-f1c4-46e6-8ad5-58876c061404.png",
      "images/livero/e00a863b-0b9f-4d1c-b516-8d1b4019322b.png"
    ],
    dosage: "Adults: 2 teaspoonfuls twice daily before meals. Children: 1 teaspoonful twice daily.",
    active: true
  },
  {
    id: "p7",
    title: "Bal Ghutti",
    category: "Pediatrics",
    price: 95,
    description: "Traditional infant health drops that ease flatulence, support healthy digestion, stimulate stomachic actions, and relieve general constipation in babies.",
    ingredients: "Amaltas, Haritaki, Ajwain, Sohaga, Mulethi, Senna",
    image: "images/bal ghutti/443847a6-b214-4c08-a7fa-45f083cc209f.png",
    images: [
      "images/bal ghutti/443847a6-b214-4c08-a7fa-45f083cc209f.png",
      "images/bal ghutti/075d2ffc-2b7d-40df-b864-7dda3157413c.png",
      "images/bal ghutti/0bd1bc81-d8ad-42e3-82f0-8b54fd41d1ed.png",
      "images/bal ghutti/44dc2b3f-4c2b-47b8-8690-8d67b82cf585.png",
      "images/bal ghutti/acf3692d-716c-4afb-bae3-c6ab04c85431.png"
    ],
    dosage: "Infants (up to 6 months): 5 drops; 6 months to 1 year: 10 drops, administered twice daily with milk or honey.",
    active: true
  },
  {
    id: "p8",
    title: "Kasol Cough Syrup",
    category: "Cough & Cold",
    price: 115,
    description: "Soothing herbal non-drowsy cough formula that liquefies thick mucus, relieves throat irritation, and checks recurring spasmodic throat infections.",
    ingredients: "Tulsi, Mulethi, Pippali, Banaphsha, Satva Pudina, Honey",
    image: "images/kasol/6f280d5d-5422-4050-9678-49523bd41baa.png",
    images: [
      "images/kasol/6f280d5d-5422-4050-9678-49523bd41baa.png",
      "images/kasol/a74e37ce-a738-4c80-8c0f-bd9de3308c4c.png",
      "images/kasol/da406cb1-48af-4fb2-b454-a2eeecf87026.jpg",
      "images/kasol/f6c003e8-f5b2-4d25-88ef-9f8848de3ff2.jpg",
      generateProductSVG('#059669', 'KASOL', 'cross')
    ],
    dosage: "1 to 2 teaspoonfuls (5 to 10 ml) 3 times a day with warm water, or as directed by a physician.",
    active: true
  },
  {
    id: "p9",
    title: "Apitite Syrup",
    category: "Digestive Care",
    price: 135,
    description: "Effective Ayurvedic appetite stimulant and digestive tonic. Helps improve hunger, regulates bowel movements, and promotes overall digestive comfort.",
    ingredients: "Chitrak, Pippali, Haritaki, Ajwain, Jeerak, Shunthi",
    image: "images/apitite/77aade59-660e-4743-99f8-e67826964051.png",
    images: [
      "images/apitite/77aade59-660e-4743-99f8-e67826964051.png",
      "images/apitite/0a890623-cd52-4ad4-a2d0-a9c8201e16b5.png",
      "images/apitite/7d518ff4-8901-4468-8852-6355161342d4.png",
      "images/apitite/a4fc8681-0064-432e-8ad6-6cafa1dbfd9d.png",
      generateProductSVG('#ea580c', 'APITITE', 'cross')
    ],
    dosage: "Adults: 2 teaspoonfuls (10ml) thrice daily half an hour before meals. Children: 1 teaspoonful thrice daily.",
    active: true
  },
  {
    id: "p10",
    title: "Ayush Kwath",
    category: "Immunity Boosters",
    price: 155,
    description: "Natural health protection powder recommended by the Ministry of AYUSH. Strengthens body defense mechanisms and supports general respiratory wellness.",
    ingredients: "Tulsi, Dalchini, Sunthi, Krishna Marich",
    image: "images/ayush kwath 3/39c11c28-bded-44ee-90c3-75c4a6e7eab0.png",
    images: [
      "images/ayush kwath 3/39c11c28-bded-44ee-90c3-75c4a6e7eab0.png",
      "images/ayush kwath 3/ea3f6ad2-b534-4324-8f1d-5723385551ae.png",
      "images/ayush kwath 3/ff978da8-ec39-43a2-82a7-66fb8b7b2c7a.png"
    ],
    dosage: "Take 3g powder, boil with 150ml of water for 3-5 mins, filter and consume hot like tea once or twice daily. Add honey or lemon to taste.",
    active: true
  },
  {
    id: "p11",
    title: "M-28 Syrup",
    category: "Women's Health",
    price: 195,
    description: "Premium Ayurvedic uterine tonic for women. Helps balance hormones, manages menstrual irregularities, and restores physical vitality.",
    ingredients: "Ashoka, Lodhra, Shatavari, Ashwagandha, Dashmoola",
    image: "images/m-28/15eb0dc6-8693-416e-8fa7-54ba94af1150.png",
    images: [
      "images/m-28/15eb0dc6-8693-416e-8fa7-54ba94af1150.png",
      "images/m-28/12300f6d-62e3-4758-a5a8-f41992d34ee7.png",
      "images/m-28/94cffd1c-4d6a-4f09-bbc9-458089bec503.png",
      "images/m-28/f45f3869-4289-42fb-947a-cbd98cbaec9d.png",
      generateProductSVG('#c026d3', 'M-28', 'cross')
    ],
    dosage: "Adults: 10ml (2 teaspoonfuls) twice daily after meals, or as directed by a physician.",
    active: true
  },
  {
    id: "p12",
    title: "Mini Drops",
    category: "Pediatrics",
    price: 110,
    description: "Soothing pediatric carminative drops for infants. Safely relieves stomach colic pain, flatulence, gas spasms, and teething irritability.",
    ingredients: "Dil Oil, Soya Oil, Pudina Satva, Sarjikakshara",
    image: "images/mini drops/2f1eab46-f1f2-4eb5-9b0a-df7e1bd8dd35.png",
    images: [
      "images/mini drops/2f1eab46-f1f2-4eb5-9b0a-df7e1bd8dd35.png",
      "images/mini drops/0213d271-fede-47ba-b3da-a198b01bdf47.png",
      "images/mini drops/50566d33-a343-44de-b35e-44bab70e3e02.png",
      "images/mini drops/7edea440-8d89-4c7b-b694-808802050371.png",
      generateProductSVG('#d97706', 'MINI', 'cross')
    ],
    dosage: "Infants (1-6 months): 5-10 drops; (6-12 months): 10-15 drops, 3 to 4 times a day before feeding.",
    active: true
  },
  {
    id: "p13",
    title: "Mobi Oil",
    category: "Pain Management",
    price: 175,
    description: "Soothing pain relief liniment for joint pain, muscle strain, sprains, backache, and rheumatic disorders. Promotes fast warming actions.",
    ingredients: "Gandhapura Oil, Nilgiri Oil, Maha Narayan Oil, Kapoor, Pudina Satva",
    image: "images/mobi. oil/5d0a7e29-da49-404e-89cd-d8d9cae37bd8.png",
    images: [
      "images/mobi. oil/5d0a7e29-da49-404e-89cd-d8d9cae37bd8.png",
      "images/mobi. oil/3c7fd974-4516-4899-8aa4-018a8e71b81b.png",
      "images/mobi. oil/554db617-fd67-4330-8b1b-49649d13f80a.png",
      "images/mobi. oil/e2c57239-746c-412c-8b1b-2f7837337087.png",
      "images/mobi. oil/f34d175b-c90a-429f-a531-ff00f00594ab.png"
    ],
    dosage: "Apply 5 to 10 drops on the affected area and massage gently until absorbed. Apply 2-3 times daily. Do not apply on open wounds.",
    active: true
  },
  {
    id: "p14",
    title: "Rakto Purifier",
    category: "Blood Purifiers",
    price: 140,
    description: "Natural blood purifying syrup that clears toxins, cleanses skin congestion, and checks pimples, acne, and recurring skin rashes.",
    ingredients: "Anantmool, Khadir, Neem, Manjistha, Gorakhmundi, Chirata",
    image: "images/rakto 3/a4d410e5-5931-4073-9f70-3c1a25b79020.png",
    images: [
      "images/rakto 3/a4d410e5-5931-4073-9f70-3c1a25b79020.png",
      "images/rakto 3/1d09d7fb-2d12-41d2-9a16-e80b24b00b3c.png",
      "images/rakto 3/c818e1ec-2677-4124-bc24-45bcdebfb2b8.png"
    ],
    dosage: "Adults: 10ml (2 teaspoonfuls) daily in the morning with half a glass of warm water. Children: 5ml daily.",
    active: true
  },
  {
    id: "p15",
    title: "Vomitex Drops",
    category: "Pediatrics",
    price: 105,
    description: "Fast-acting herbal anti-emetic drops that control nausea, motion sickness, vomiting, and acid reflux in infants and young children.",
    ingredients: "Elaichi, Pudina, Kapoor, Dalchini, Jaiphal, Nimbu",
    image: "images/vomitex/fca5280f-8a81-4343-b171-057f5ae84b09.png",
    images: [
      "images/vomitex/fca5280f-8a81-4343-b171-057f5ae84b09.png",
      "images/vomitex/a5e663ae-7cdf-440f-9bac-5d11775da764.png",
      "images/vomitex/eb27d15e-dff3-463c-9fc5-758529f0fcbe.png"
    ],
    dosage: "Infants: 5-10 drops; Children: 10-20 drops, administered with lukewarm water 3 to 4 times a day or when nausea occurs.",
    active: true
  }
];

// --- Application State Controller ---
const Store = {
  products: [],
  users: [],
  currentUser: null,
  cart: [], // Stores items: { productId, qty }
  orders: [],

  init() {
    // 1. Load local cached database synchronously (instant rendering!)
    this.loadLocalProducts();
    this.loadLocalUsers();
    
    // 2. Load active user session
    const cachedUser = localStorage.getItem('shakti_current_user');
    this.currentUser = cachedUser ? JSON.parse(cachedUser) : null;

    // 3. Load local orders
    this.loadLocalOrders();

    // 4. Restore cart state
    this.syncCartLoad();

    // 5. Fetch fresh data from Firestore in the background
    if (isFirebaseActive) {
      this.syncFirebaseBackground();
    }
  },

  async syncFirebaseBackground() {
    try {
      // Synchronize Products
      const productsSnap = await db.collection('products').get();
      if (productsSnap.empty) {
        // Seeding database
        console.log("🌱 Database is empty. Seeding Firestore with default products...");
        for (const prod of this.products) {
          await db.collection('products').doc(prod.id).set(prod);
        }
      } else {
        const freshProducts = [];
        productsSnap.forEach(doc => {
          freshProducts.push(doc.data());
        });
        
        // Force update images and dosage from defaults matching logic
        freshProducts.forEach(p => {
          const match = defaultProducts.find(dp => dp.id === p.id);
          if (match) {
            p.image = match.image;
            p.images = [...match.images];
            if (!p.dosage) p.dosage = match.dosage;
          }
        });
        
        this.products = freshProducts;
        localStorage.setItem('shakti_products', JSON.stringify(this.products));
        
        // Refresh product displays
        renderProductsStore();
        renderAdminProductList();
      }

      // Synchronize Users
      const usersSnap = await db.collection('users').get();
      if (!usersSnap.empty) {
        this.users = [];
        usersSnap.forEach(doc => {
          this.users.push(doc.data());
        });
        localStorage.setItem('shakti_users', JSON.stringify(this.users));
      } else {
        // Seed users to cloud if database was empty
        if (this.users.length > 0) {
          this.users.forEach(async (u) => {
            const safeId = u.email.replace(/\./g, '_');
            await db.collection('users').doc(safeId).set(u);
          });
        }
      }

      // Synchronize Orders
      const ordersSnap = await db.collection('orders').get();
      if (!ordersSnap.empty) {
        this.orders = [];
        ordersSnap.forEach(doc => {
          this.orders.push(doc.data());
        });
        localStorage.setItem('shakti_orders', JSON.stringify(this.orders));
        renderAdminOrdersList();
      } else {
        // Seed orders to cloud if database was empty
        if (this.orders.length > 0) {
          this.orders.forEach(async (order) => {
            await db.collection('orders').doc(order.orderId).set(order);
          });
        }
      }
    } catch (err) {
      console.warn("⚠️ Firebase background sync failed (using local data cache):", err);
    }
  },

  loadLocalProducts() {
    const cachedProducts = localStorage.getItem('shakti_products');
    if (!cachedProducts || JSON.parse(cachedProducts).length !== 14) {
      localStorage.setItem('shakti_products', JSON.stringify(defaultProducts));
      this.products = [...defaultProducts];
    } else {
      this.products = JSON.parse(cachedProducts);
    }

    this.products.forEach(p => {
      const match = defaultProducts.find(dp => dp.id === p.id);
      if (match) {
        p.image = match.image;
        p.images = [...match.images];
        if (!p.dosage) {
          p.dosage = match.dosage;
        }
      } else {
        if (!p.dosage) {
          p.dosage = "Take 1 to 2 teaspoonfuls (5-10 ml) twice daily after meals, or as directed by a physician.";
        }
        if (!p.images || p.images.length === 0) {
          p.images = [p.image || ""];
        }
      }
    });
    this.saveProducts();
  },

  loadLocalUsers() {
    if (!localStorage.getItem('shakti_users')) {
      localStorage.setItem('shakti_users', JSON.stringify([]));
      this.users = [];
    } else {
      this.users = JSON.parse(localStorage.getItem('shakti_users'));
    }
  },

  loadLocalOrders() {
    if (!localStorage.getItem('shakti_orders')) {
      localStorage.setItem('shakti_orders', JSON.stringify([]));
      this.orders = [];
    } else {
      this.orders = JSON.parse(localStorage.getItem('shakti_orders'));
    }
  },

  saveProducts() {
    localStorage.setItem('shakti_products', JSON.stringify(this.products));
    if (isFirebaseActive) {
      this.products.forEach(async (prod) => {
        try {
          await db.collection('products').doc(prod.id).set(prod);
        } catch (err) {
          console.error(`Error saving product ${prod.id} to Firestore:`, err);
        }
      });
    }
  },

  saveUsers() {
    localStorage.setItem('shakti_users', JSON.stringify(this.users));
    if (isFirebaseActive) {
      this.users.forEach(async (u) => {
        try {
          const safeId = u.email.replace(/\./g, '_');
          await db.collection('users').doc(safeId).set(u);
        } catch (err) {
          console.error(`Error saving user ${u.email} to Firestore:`, err);
        }
      });
    }
  },

  saveCurrentUser() {
    if (this.currentUser) {
      localStorage.setItem('shakti_current_user', JSON.stringify(this.currentUser));
    } else {
      localStorage.removeItem('shakti_current_user');
    }
  },

  saveOrders() {
    localStorage.setItem('shakti_orders', JSON.stringify(this.orders));
    if (isFirebaseActive) {
      this.orders.forEach(async (order) => {
        try {
          await db.collection('orders').doc(order.orderId).set(order);
        } catch (err) {
          console.error(`Error saving order ${order.orderId} to Firestore:`, err);
        }
      });
    }
  },

  // Sync Cart depending on user auth state
  syncCartLoad() {
    if (this.currentUser) {
      // Restore customer-specific cart from state or localStorage
      const cartKey = `shakti_cart_${this.currentUser.email}`;
      const savedCart = localStorage.getItem(cartKey);
      this.cart = savedCart ? JSON.parse(savedCart) : [];
    } else {
      // Restore guest local cart
      const guestCart = localStorage.getItem('shakti_cart_guest');
      this.cart = guestCart ? JSON.parse(guestCart) : [];
    }
    this.updateCartCountUI();
  },

  saveCart() {
    if (this.currentUser) {
      const cartKey = `shakti_cart_${this.currentUser.email}`;
      localStorage.setItem(cartKey, JSON.stringify(this.cart));
    } else {
      localStorage.setItem('shakti_cart_guest', JSON.stringify(this.cart));
    }
    this.updateCartCountUI();
  },

  clearCart() {
    this.cart = [];
    this.saveCart();
  },

  addToCart(productId, qty = 1, showNotification = true, selectedSize = null) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    // Default to first variant if size not specified but variants exist
    if (!selectedSize && product.variants && product.variants.length > 0) {
      selectedSize = product.variants[0].size;
    }

    const existing = this.cart.find(item => item.productId === productId && item.selectedSize === selectedSize);
    if (existing) {
      existing.qty += qty;
    } else {
      this.cart.push({ productId, qty, selectedSize });
    }
    this.saveCart();
    if (showNotification) {
      showToast("Added item to shopping cart!");
    }
  },

  updateCartQty(productId, selectedSize, qtyChange) {
    const existingIndex = this.cart.findIndex(item => item.productId === productId && item.selectedSize === selectedSize);
    if (existingIndex !== -1) {
      this.cart[existingIndex].qty += qtyChange;
      if (this.cart[existingIndex].qty <= 0) {
        this.cart.splice(existingIndex, 1);
        showToast("Removed item from cart.", "error");
      }
      this.saveCart();
      renderCartView();
    }
  },

  updateCartCountUI() {
    const totalQty = this.cart.reduce((sum, item) => sum + item.qty, 0);
    const countBadge = document.getElementById('cart-count');
    if (countBadge) {
      countBadge.innerText = totalQty;
    }
  }
};

// --- Toast System UI ---
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const icon = type === 'success' ? '✓' : '✕';
  toast.innerHTML = `<span>${icon}</span> <p>${message}</p>`;
  
  container.appendChild(toast);
  
  // Slide out and remove toast after 3 seconds
  setTimeout(() => {
    toast.style.animation = 'slideIn 0.3s reverse forwards';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 2700);
}

// --- Dynamic Route Manager ---
function initRouter() {
  const handleRouting = () => {
    let hash = window.location.hash || '#home';
    
    // Support sub-anchor navigation links like #home#timeline
    let sectionId = hash;
    let anchorId = '';
    if (hash.includes('#', 2)) {
      const parts = hash.split('#');
      sectionId = '#' + parts[1]; // e.g. #home
      anchorId = parts[2];       // e.g. timeline
    }

    const views = document.querySelectorAll('.view-section');
    let viewFound = false;

    views.forEach(view => {
      if ('#' + view.id.replace('view-', '') === sectionId) {
        view.classList.add('active-view');
        viewFound = true;
      } else {
        view.classList.remove('active-view');
      }
    });

    // If invalid route, fallback home
    if (!viewFound) {
      window.location.hash = '#home';
      return;
    }

    // Scroll to top or sub-anchor element if present
    if (anchorId) {
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === sectionId || (anchorId && href === `${sectionId}#${anchorId}`)) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Route-specific screen renders
    if (sectionId === '#products') {
      renderProductsStore();
    } else if (sectionId === '#cart') {
      renderCartView();
    } else if (sectionId === '#profile') {
      if (!Store.currentUser || Store.currentUser.role === 'admin') {
        window.location.hash = '#login';
      } else {
        renderProfileView();
      }
    } else if (sectionId === '#admin') {
      if (!Store.currentUser || Store.currentUser.role !== 'admin') {
        window.location.hash = '#login';
      } else {
        renderAdminDashboard();
      }
    }
  };

  window.addEventListener('hashchange', handleRouting);
  window.addEventListener('load', handleRouting);
  
  // Header background shade on scroll
  window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 40) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });
}

// --- Auth UI & State Logic ---
function initAuth() {
  const loginForm = document.getElementById('customer-login-form');
  const registerForm = document.getElementById('customer-register-form');
  const authContainer = document.getElementById('auth-nav-container');
  const adminNavBtn = document.getElementById('nav-admin-btn');

  const updateHeaderAuthUI = () => {
    if (Store.currentUser) {
      if (Store.currentUser.role === 'admin') {
        authContainer.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:0.85rem; font-weight:600; color:var(--accent);">Admin Mode</span>
            <a href="#admin" class="btn-primary" style="padding:0.4rem 0.9rem; font-size:0.85rem;">Control Panel</a>
          </div>
        `;
        adminNavBtn.style.display = 'inline-flex';
      } else {
        // Customer account state
        authContainer.innerHTML = `
          <div style="display:flex; align-items:center; gap:0.75rem;">
            <a href="#profile" class="btn-secondary" style="padding:0.45rem 1rem; display:flex; align-items:center; gap:0.4rem; font-size:0.9rem;">
              <span>👤</span> ${Store.currentUser.name.split(' ')[0]}
            </a>
          </div>
        `;
        adminNavBtn.style.display = 'none';
      }
    } else {
      authContainer.innerHTML = `<a href="#login" class="btn-secondary" id="nav-login-btn">Login</a>`;
      adminNavBtn.style.display = 'none';
    }
  };

  // Perform login action
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value.trim();
      const pass = document.getElementById('login-password').value.trim();

      // Check admin account bypass
      if ((email.toLowerCase() === 'admin' || email.toLowerCase() === 'admin@shaktipharma.in') && pass === 'admin123') {
        Store.currentUser = {
          role: 'admin',
          name: 'System Administrator',
          email: 'admin@shaktipharma.in'
        };
        Store.saveCurrentUser();
        Store.syncCartLoad();
        updateHeaderAuthUI();
        showToast("Logged in as Administrator.");
        loginForm.reset();
        window.location.hash = '#admin';
        return;
      }

      // Check standard customer account
      const matched = Store.users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass);
      if (matched) {
        Store.currentUser = {
          role: 'customer',
          name: matched.name,
          email: matched.email,
          address: matched.address
        };
        Store.saveCurrentUser();
        Store.syncCartLoad();
        updateHeaderAuthUI();
        showToast(`Welcome back, ${matched.name}!`);
        loginForm.reset();
        window.location.hash = '#products';
      } else {
        showToast("Invalid credentials. Try again or check Admin details.", "error");
      }
    });
  }

  // Perform customer registration
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const pass = document.getElementById('reg-password').value.trim();
      const addr = document.getElementById('reg-address').value.trim();

      // Verify unique email
      if (Store.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        showToast("Email address already registered!", "error");
        return;
      }

      // Save customer record
      const newUser = { name, email, password: pass, address: addr };
      Store.users.push(newUser);
      Store.saveUsers();

      // Set session automatically
      Store.currentUser = {
        role: 'customer',
        name: newUser.name,
        email: newUser.email,
        address: newUser.address
      };
      Store.saveCurrentUser();
      Store.syncCartLoad();
      updateHeaderAuthUI();

      showToast("Account created successfully!");
      registerForm.reset();
      window.location.hash = '#products';
    });
  }

  // Profile Logouts
  document.getElementById('profile-logout-btn').addEventListener('click', () => {
    Store.currentUser = null;
    Store.saveCurrentUser();
    Store.syncCartLoad();
    updateHeaderAuthUI();
    showToast("Logged out successfully.");
    window.location.hash = '#home';
  });

  document.getElementById('admin-logout-btn').addEventListener('click', () => {
    Store.currentUser = null;
    Store.saveCurrentUser();
    Store.syncCartLoad();
    updateHeaderAuthUI();
    showToast("Exited administrator mode.");
    window.location.hash = '#home';
  });

  // Profile Editor Bindings
  const editProfileBtn = document.getElementById('btn-edit-profile');
  const cancelProfileEditBtn = document.getElementById('btn-cancel-profile-edit');
  const profileEditForm = document.getElementById('profile-edit-form');
  const profileViewMode = document.getElementById('profile-view-mode');

  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      document.getElementById('edit-profile-name').value = Store.currentUser.name;
      document.getElementById('edit-profile-address').value = Store.currentUser.address;
      profileViewMode.style.display = 'none';
      profileEditForm.style.display = 'flex';
    });
  }

  if (cancelProfileEditBtn) {
    cancelProfileEditBtn.addEventListener('click', () => {
      profileViewMode.style.display = 'flex';
      profileEditForm.style.display = 'none';
    });
  }

  if (profileEditForm) {
    profileEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const newName = document.getElementById('edit-profile-name').value.trim();
      const newAddr = document.getElementById('edit-profile-address').value.trim();

      if (!newName || !newAddr) {
        showToast("Fields cannot be empty!", "error");
        return;
      }

      // Update current user details
      Store.currentUser.name = newName;
      Store.currentUser.address = newAddr;
      Store.saveCurrentUser();

      // Update in users database matching by email
      const userIdx = Store.users.findIndex(u => u.email.toLowerCase() === Store.currentUser.email.toLowerCase());
      if (userIdx !== -1) {
        Store.users[userIdx].name = newName;
        Store.users[userIdx].address = newAddr;
        Store.saveUsers();
      }

      showToast("Profile details updated successfully!");
      profileViewMode.style.display = 'flex';
      profileEditForm.style.display = 'none';
      
      // Re-render views
      updateHeaderAuthUI();
      renderProfileView();
    });
  }

  // Call on init
  updateHeaderAuthUI();
}

// --- Customer Profile History View ---
function renderProfileView() {
  const profileName = document.getElementById('profile-title-name');
  const infoName = document.getElementById('profile-info-name');
  const infoEmail = document.getElementById('profile-info-email');
  const infoAddress = document.getElementById('profile-info-address');
  const listContainer = document.getElementById('profile-orders-list');

  // Reset edit form display states on navigating to profile
  const profileEditForm = document.getElementById('profile-edit-form');
  const profileViewMode = document.getElementById('profile-view-mode');
  if (profileEditForm && profileViewMode) {
    profileEditForm.style.display = 'none';
    profileViewMode.style.display = 'flex';
  }

  if (!Store.currentUser) return;

  profileName.innerText = `${Store.currentUser.name}'s Profile`;
  infoName.innerText = Store.currentUser.name;
  infoEmail.innerText = Store.currentUser.email;
  infoAddress.innerText = Store.currentUser.address;

  // Filter orders matching logged user
  const myOrders = Store.orders.filter(ord => ord.customerEmail.toLowerCase() === Store.currentUser.email.toLowerCase());
  
  if (myOrders.length === 0) {
    listContainer.innerHTML = `
      <div style="background:var(--white); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:3rem; text-align:center; box-shadow:var(--shadow-sm);">
        <p style="color:var(--text-light); font-size:0.95rem;">You haven't placed any orders yet. Explore our Store to make a purchase!</p>
        <a href="#products" class="btn-primary" style="margin-top:1.25rem;">Start Shopping</a>
      </div>
    `;
    return;
  }

  listContainer.innerHTML = myOrders.reverse().map(order => {
    const itemsListHtml = order.items.map(item => `
      <div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:0.25rem 0;">
        <span>${item.title} (x${item.qty})</span>
        <strong>₹${item.price * item.qty}</strong>
      </div>
    `).join('');

    return `
      <div style="background:var(--white); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:1.5rem; margin-bottom:1.25rem; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid var(--sage-light); padding-bottom:0.75rem; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
          <div>
            <span style="font-size:0.75rem; color:var(--text-light); text-transform:uppercase;">Order ID:</span>
            <code style="font-weight:600; color:var(--primary); font-size:0.9rem;">#${order.orderId}</code>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:var(--text-light); text-transform:uppercase;">Date:</span>
            <span style="font-size:0.85rem; font-weight:500; display:block;">${order.date}</span>
          </div>
        </div>
        
        <div style="margin-bottom:0.75rem;">
          ${itemsListHtml}
        </div>

        <div style="display:flex; justify-content:space-between; border-top:1.5px dashed var(--border-color); padding-top:0.75rem; font-weight:600; font-size:1rem; align-items:center;">
          <div>
            <span style="font-size:0.75rem; color:var(--text-light); font-weight:normal; text-transform:uppercase; display:block;">Method:</span>
            <span style="font-size:0.85rem; color:var(--accent); font-weight:600;">${order.paymentMethod}</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:0.75rem; color:var(--text-light); font-weight:normal; text-transform:uppercase; display:block;">Total Paid:</span>
            <strong style="color:var(--primary); font-size:1.1rem;">₹${order.totalPrice}</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- Store Catalog View logic ---
let storeActiveCategory = 'All';

function renderProductsStore() {
  const categoryContainer = document.getElementById('category-filter-list');
  const productsContainer = document.getElementById('catalog-products-grid');
  
  if (!productsContainer || !categoryContainer) return;

  // 1. Gather all active categories from listed products
  const activeProducts = Store.products.filter(p => p.active);
  const categories = ['All', ...new Set(Store.products.map(p => p.category))];

  // 2. Populate Category Filter buttons
  categoryContainer.innerHTML = categories.map(cat => {
    // Count active items in this category
    const count = cat === 'All' 
      ? activeProducts.length 
      : activeProducts.filter(p => p.category === cat).length;
      
    const activeClass = storeActiveCategory === cat ? 'active-category' : '';
    return `
      <li>
        <button class="category-btn ${activeClass}" data-category="${cat}">
          <span>${cat}</span>
          <span style="font-size:0.75rem; opacity:0.6;">(${count})</span>
        </button>
      </li>
    `;
  }).join('');

  // Re-attach event listeners on category buttons
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      storeActiveCategory = btn.getAttribute('data-category');
      renderProductsStore();
      
      // Collapse sidebar on selection (mobile only)
      const sidebar = document.querySelector('.filter-sidebar');
      if (sidebar) {
        sidebar.classList.remove('expanded');
      }
    });
  });

  // 3. Filter products based on search inputs and categories
  const searchQuery = document.getElementById('search-product-input').value.toLowerCase().trim();
  const sortBy = document.getElementById('sort-product-select').value;

  let filtered = activeProducts;
  
  if (storeActiveCategory !== 'All') {
    filtered = filtered.filter(p => p.category === storeActiveCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.ingredients.toLowerCase().includes(searchQuery)
    );
  }

  // 4. Sort results
  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'name-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  // 5. Render product grid
  if (filtered.length === 0) {
    productsContainer.innerHTML = `
      <div style="grid-column: 1/-1; background:var(--white); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:4rem 2rem; text-align:center; box-shadow:var(--shadow-sm);">
        <span style="font-size:3rem; display:block; margin-bottom:1rem;">🍃</span>
        <h4 class="brand-font" style="font-size:1.4rem; color:var(--primary); margin-bottom:0.5rem;">No Ayurvedic Remedies Found</h4>
        <p style="color:var(--text-light); font-size:0.9rem;">We couldn't find matching formulations. Try adjusting your filters or search keywords.</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = filtered.map(prod => `
    <article class="product-card">
      <div class="product-img-wrapper detail-trigger" data-id="${prod.id}" style="cursor:pointer;">
        <img class="product-svg" src="${prod.image}" alt="${prod.title}">
        <span class="product-badge">${prod.category}</span>
      </div>
      <div class="product-info">
        <h3 class="product-title detail-trigger" data-id="${prod.id}" style="cursor:pointer; transition: var(--transition-fast);">${prod.title}</h3>
        <p class="product-desc detail-trigger" data-id="${prod.id}" style="cursor:pointer;" title="${prod.description}">${prod.description}</p>
        <div class="product-ingredients-preview" style="font-size:0.75rem; color:var(--text-light); line-height:1.4;">
          <strong style="color:var(--primary);">Active Herbs:</strong> ${prod.ingredients}
        </div>
        <div class="product-meta">
          <span class="product-price">₹${prod.price}</span>
          <button class="btn-primary btn-add-to-cart" data-id="${prod.id}" style="padding:0.45rem 1rem; font-size:0.85rem; z-index:5;">
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Attach Add-to-Cart listeners
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const pid = btn.getAttribute('data-id');
      Store.addToCart(pid);
    });
  });

  // Attach Detail Modal click triggers
  document.querySelectorAll('.detail-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      const pid = trigger.getAttribute('data-id');
      openProductDetailModal(pid);
    });
  });
}

// Bind search and sorting elements
const searchField = document.getElementById('search-product-input');
const sortSelect = document.getElementById('sort-product-select');
if (searchField) searchField.addEventListener('input', renderProductsStore);
if (sortSelect) sortSelect.addEventListener('change', renderProductsStore);


// --- Shopping Cart Drawer Rendering logic ---
function renderCartView() {
  const container = document.getElementById('cart-content-wrapper');
  if (!container) return;

  if (Store.cart.length === 0) {
    container.innerHTML = `
      <div style="background:var(--white); border:1px solid var(--border-color); border-radius:var(--radius-md); padding:5rem 2rem; text-align:center; box-shadow:var(--shadow-sm); max-width:600px; margin:0 auto;">
        <span style="font-size:4rem; display:block; margin-bottom:1.5rem;">🛒</span>
        <h3 class="brand-font" style="font-size:1.6rem; color:var(--primary); margin-bottom:0.75rem;">Your Shopping Cart is Empty</h3>
        <p style="color:var(--text-light); font-size:0.95rem; margin-bottom:1.75rem; max-width:400px; margin-left:auto; margin-right:auto;">
          Select from our authentic Ayurvedic patent medicines to promote holistic well-being.
        </p>
        <a href="#products" class="btn-primary">Browse Medicines</a>
      </div>
    `;
    return;
  }

  // Calculate costs
  let subtotal = 0;
  const itemsHtml = Store.cart.map(item => {
    const product = Store.products.find(p => p.id === item.productId);
    if (!product) return '';
    
    let activePrice = product.price;
    if (item.selectedSize && product.variants && product.variants.length > 0) {
      const match = product.variants.find(v => v.size === item.selectedSize);
      if (match) activePrice = match.price;
    }
    const cost = activePrice * item.qty;
    subtotal += cost;

    const sizeParam = item.selectedSize ? `'${item.selectedSize}'` : 'null';

    return `
      <div class="cart-item-card">
        <div class="cart-item-img">
          <img src="${product.image}" alt="${product.title}" style="height: 54px; width: auto;">
        </div>
        <div class="cart-item-details">
          <h4 class="cart-item-title">${product.title} ${item.selectedSize ? `<span style="font-size:0.8rem; color:var(--accent); font-weight:600; margin-left:0.4rem;">(${item.selectedSize})</span>` : ''}</h4>
          <span class="cart-item-price">₹${activePrice} each</span>
        </div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="Store.updateCartQty('${product.id}', ${sizeParam}, -1)">-</button>
          <span style="font-weight:600; min-width:18px; text-align:center; font-size:0.9rem;">${item.qty}</span>
          <button class="qty-btn" onclick="Store.updateCartQty('${product.id}', ${sizeParam}, 1)">+</button>
        </div>
        <div style="text-align:right; min-width:80px; font-weight:700; color:var(--primary);">
          ₹${cost}
        </div>
      </div>
    `;
  }).join('');

  const shipping = subtotal >= 500 ? 0 : 50;
  const grandTotal = subtotal + shipping;

  container.innerHTML = `
    <div class="cart-page-layout">
      <!-- Left: Cart items -->
      <div class="cart-items-list">
        ${itemsHtml}
      </div>

      <!-- Right: Summary Panel -->
      <div class="cart-summary-panel">
        <h3 class="brand-font" style="margin-bottom:1.5rem; font-size:1.4rem; border-bottom:2px solid var(--sage-light); padding-bottom:0.5rem;">Order Summary</h3>
        
        <div class="summary-row">
          <span>Items Subtotal</span>
          <strong>₹${subtotal}</strong>
        </div>

        <div class="summary-row">
          <span>Estimated Shipping</span>
          <span>${shipping === 0 ? '<strong style="color:var(--success);">FREE</strong>' : `₹${shipping}`}</span>
        </div>

        ${shipping > 0 ? `
          <div style="background:var(--sage-light); padding:0.6rem; border-radius:var(--radius-sm); font-size:0.75rem; color:var(--text-light); text-align:center; margin-bottom:1rem; border: 1px dashed var(--border-color);">
            Add <strong>₹${500 - subtotal}</strong> more to unlock <strong>FREE Shipping!</strong>
          </div>
        ` : `
          <div style="background:rgba(21, 128, 61, 0.08); padding:0.6rem; border-radius:var(--radius-sm); font-size:0.75rem; color:var(--success); text-align:center; margin-bottom:1rem; font-weight:600;">
            🎉 Congratulations! You unlocked free shipping.
          </div>
        `}

        <div class="summary-total">
          <span>Grand Total</span>
          <span>₹${grandTotal}</span>
        </div>

        <button class="btn-primary" id="btn-proceed-checkout" style="width: 100%; justify-content: center; padding:0.8rem; font-size:1.05rem;">
          Secure Checkout 🔒
        </button>
      </div>
    </div>
  `;

  // Attach Checkout flow trigger
  document.getElementById('btn-proceed-checkout').addEventListener('click', () => {
    if (!Store.currentUser) {
      showToast("Please login or create an account to complete checkout.", "error");
      window.location.hash = '#login';
      return;
    }
    
    // Open payment gateway simulation modal
    openPaymentModal(grandTotal);
  });
}

// --- Interactive Payment Gateway Modal Logic ---
let activePaymentAmount = 0;

function openPaymentModal(amount) {
  activePaymentAmount = amount;
  
  const overlay = document.getElementById('payment-modal-overlay');
  const amountLabel = document.getElementById('payment-modal-amount');
  
  // Set default panel views
  document.getElementById('payment-input-container').style.display = 'block';
  document.getElementById('payment-processing-container').style.display = 'none';
  document.getElementById('payment-success-container').style.display = 'none';
  
  amountLabel.innerText = `₹${amount}.00`;
  overlay.classList.add('active-modal');
}

function closePaymentModal() {
  const overlay = document.getElementById('payment-modal-overlay');
  overlay.classList.remove('active-modal');
}

// Initialize Modal Controllers
function initPaymentGateway() {
  const overlay = document.getElementById('payment-modal-overlay');
  const closeBtn = document.getElementById('close-payment-modal');
  const tabButtons = document.querySelectorAll('.payment-tab-btn');
  const panels = document.querySelectorAll('.payment-panel');

  closeBtn.addEventListener('click', closePaymentModal);
  
  // Dismiss on clicking background overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closePaymentModal();
  });

  // Handle Tab Switch
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active-tab'));
      panels.forEach(p => p.classList.remove('active-panel'));
      
      btn.classList.add('active-tab');
      const targetId = btn.getAttribute('data-target');
      document.getElementById(targetId).classList.add('active-panel');
    });
  });

  // Submit payment listeners
  const cardForm = document.getElementById('payment-form-card');
  const netForm = document.getElementById('payment-form-net');
  const upiVerifyBtn = document.getElementById('btn-upi-mock-verify');

  const startPaymentProcessing = (methodName) => {
    document.getElementById('payment-input-container').style.display = 'none';
    const processingSection = document.getElementById('payment-processing-container');
    const stageLabel = document.getElementById('payment-stage-text');
    processingSection.style.display = 'flex';

    // Simulate multi-stage authorization timeline
    const stages = [
      "Contacting secure banking interfaces...",
      "Verifying security signatures and tokens...",
      "Authorizing ledger transfer of funds...",
      "Generating order receipt ledger..."
    ];

    let currentStageIndex = 0;
    const interval = setInterval(() => {
      if (currentStageIndex < stages.length) {
        stageLabel.innerText = stages[currentStageIndex];
        currentStageIndex++;
      } else {
        clearInterval(interval);
        finalizeTransaction(methodName);
      }
    }, 900);
  };

  cardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    startPaymentProcessing("Credit Card");
  });

  netForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bankSelect = document.getElementById('payment-net-bank');
    const bankName = bankSelect.options[bankSelect.selectedIndex].text;
    startPaymentProcessing(`Netbanking (${bankName})`);
  });

  upiVerifyBtn.addEventListener('click', () => {
    startPaymentProcessing("UPI Scan QR");
  });

  // Back button on receipt
  document.getElementById('btn-payment-done').addEventListener('click', () => {
    closePaymentModal();
    window.location.hash = '#products';
  });
}

// Finalize order writing to localStorage and update cart
function finalizeTransaction(paymentMethod) {
  // Generate random order fields
  const transactionId = "TXN" + Math.floor(10000000 + Math.random() * 90000000);
  const orderId = "ORD" + Math.floor(10000 + Math.random() * 90000);
  const formattedDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  // Calculate items purchased detail logs
  const orderItemsList = Store.cart.map(item => {
    const product = Store.products.find(p => p.id === item.productId);
    let activePrice = product.price;
    if (item.selectedSize && product.variants && product.variants.length > 0) {
      const match = product.variants.find(v => v.size === item.selectedSize);
      if (match) activePrice = match.price;
    }
    return {
      productId: item.productId,
      title: product.title + (item.selectedSize ? ` (${item.selectedSize})` : ''),
      price: activePrice,
      qty: item.qty
    };
  });

  // Record Transaction
  const newOrder = {
    orderId,
    transactionId,
    customerName: Store.currentUser.name,
    customerEmail: Store.currentUser.email,
    shippingAddress: Store.currentUser.address,
    date: formattedDate,
    items: orderItemsList,
    totalPrice: activePaymentAmount,
    paymentMethod
  };

  Store.orders.push(newOrder);
  Store.saveOrders();

  // Clear customer's Cart database
  Store.clearCart();

  // Render receipt screen
  document.getElementById('payment-processing-container').style.display = 'none';
  const successSection = document.getElementById('payment-success-container');
  const receiptPanel = document.getElementById('receipt-details');
  
  receiptPanel.innerHTML = `
    <strong>Invoice:</strong> #${orderId}<br>
    <strong>Reference ID:</strong> ${transactionId}<br>
    <strong>Date & Time:</strong> ${formattedDate}<br>
    <strong>Payment Mode:</strong> ${paymentMethod}<br>
    <strong>Grand Total Paid:</strong> ₹${activePaymentAmount}.00<br>
    <strong>Shipping To:</strong> ${Store.currentUser.name}, ${Store.currentUser.address.substring(0, 45)}...
  `;
  
  successSection.style.display = 'flex';
  showToast("Order placed successfully! Confetti simulated.");
}

// --- Interactive Product Detail Gallery Modal ---
let activeDetailQty = 1;
let activeDetailProductId = null;
let activeDetailSize = null;

window.openProductDetailModal = function(productId) {
  const prod = Store.products.find(p => p.id === productId);
  if (!prod) return;

  activeDetailProductId = productId;
  activeDetailQty = 1;
  activeDetailSize = null;

  // Open modal visual wrapper
  const overlay = document.getElementById('product-detail-modal-overlay');
  overlay.classList.add('active-modal');

  // Populate basic text properties
  document.getElementById('detail-title').innerText = prod.title;
  document.getElementById('detail-category').innerText = prod.category;
  document.getElementById('detail-desc').innerText = prod.description;
  document.getElementById('detail-ingredients').innerText = prod.ingredients;
  document.getElementById('detail-dosage').innerText = prod.dosage || "Take 1 to 2 teaspoonfuls (5-10 ml) twice daily after meals, or as directed by a physician.";
  document.getElementById('detail-qty-value').innerText = activeDetailQty;

  // Setup size variants selector
  const sizeOptionsWrapper = document.getElementById('detail-size-options-wrapper');
  const sizeButtonsContainer = document.getElementById('detail-size-buttons-container');

  if (prod.variants && prod.variants.length > 0) {
    sizeOptionsWrapper.style.display = 'block';
    activeDetailSize = prod.variants[0].size;
    const activeDetailPrice = prod.variants[0].price;
    document.getElementById('detail-price').innerText = `₹${activeDetailPrice}.00`;

    sizeButtonsContainer.innerHTML = prod.variants.map((v, idx) => {
      const activeClass = idx === 0 ? 'active-size' : '';
      return `
        <button type="button" class="btn-secondary size-option-btn ${activeClass}" data-size="${v.size}" data-price="${v.price}" style="padding:0.4rem 0.8rem; font-size:0.85rem; border-radius:var(--radius-sm);">
          ${v.size} (₹${v.price})
        </button>
      `;
    }).join('');

    // Attach click listeners to size option buttons
    document.querySelectorAll('.size-option-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.size-option-btn').forEach(b => b.classList.remove('active-size'));
        btn.classList.add('active-size');
        activeDetailSize = btn.getAttribute('data-size');
        const selectedPrice = btn.getAttribute('data-price');
        document.getElementById('detail-price').innerText = `₹${selectedPrice}.00`;
      });
    });
  } else {
    sizeOptionsWrapper.style.display = 'none';
    activeDetailSize = null;
    document.getElementById('detail-price').innerText = `₹${prod.price}.00`;
  }

  // Setup gallery main image and thumbnails
  const mainImgEl = document.getElementById('detail-main-img');
  const thumbsContainer = document.getElementById('detail-thumbnails-strip');

  // Ensure prod.images array is filled
  const images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
  mainImgEl.src = images[0];

  // Render thumbnails
  thumbsContainer.innerHTML = images.map((imgSrc, idx) => {
    const activeBorderClass = idx === 0 ? 'border:2px solid var(--accent); opacity:1;' : 'border:2px solid transparent; opacity:0.65;';
    return `
      <img class="detail-thumb-img" data-idx="${idx}" src="${imgSrc}" alt="Thumbnail ${idx+1}" 
           style="height:54px; width:54px; border-radius:var(--radius-sm); object-fit:cover; background:var(--white); cursor:pointer; padding:0.15rem; transition:var(--transition-fast); box-shadow:var(--shadow-sm); ${activeBorderClass}">
    `;
  }).join('');

  // Thumbnail swap trigger click event
  document.querySelectorAll('.detail-thumb-img').forEach(thumb => {
    thumb.addEventListener('click', () => {
      // Deactivate other thumbnails
      document.querySelectorAll('.detail-thumb-img').forEach(t => {
        t.style.borderColor = 'transparent';
        t.style.opacity = '0.65';
      });
      // Activate this thumbnail
      thumb.style.borderColor = 'var(--accent)';
      thumb.style.opacity = '1';

      // Update main image source with transition fade
      const targetIdx = parseInt(thumb.getAttribute('data-idx'));
      mainImgEl.style.opacity = '0';
      setTimeout(() => {
        mainImgEl.src = images[targetIdx];
        mainImgEl.style.opacity = '1';
      }, 150);
    });
  });
};

window.closeProductDetailModal = function() {
  const overlay = document.getElementById('product-detail-modal-overlay');
  overlay.classList.remove('active-modal');
  activeDetailProductId = null;
};

function initProductDetailModalController() {
  const overlay = document.getElementById('product-detail-modal-overlay');
  const closeBtn = document.getElementById('close-detail-modal');
  const minusBtn = document.getElementById('detail-qty-minus');
  const plusBtn = document.getElementById('detail-qty-plus');
  const addCartBtn = document.getElementById('detail-btn-add-cart');

  if (closeBtn) closeBtn.addEventListener('click', closeProductDetailModal);
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeProductDetailModal();
    });
  }

  // Quantity controllers
  if (minusBtn) {
    minusBtn.addEventListener('click', () => {
      if (activeDetailQty > 1) {
        activeDetailQty--;
        document.getElementById('detail-qty-value').innerText = activeDetailQty;
      }
    });
  }
  if (plusBtn) {
    plusBtn.addEventListener('click', () => {
      activeDetailQty++;
      document.getElementById('detail-qty-value').innerText = activeDetailQty;
    });
  }

  // Add to Cart custom handler
  if (addCartBtn) {
    addCartBtn.addEventListener('click', () => {
      if (activeDetailProductId) {
        // Add multiple quantities
        Store.addToCart(activeDetailProductId, activeDetailQty, true, activeDetailSize);
        closeProductDetailModal();
      }
    });
  }
}

// --- Admin Panel Dashboard Manager ---
let adminActiveSection = 'overview';

function renderAdminDashboard() {
  // Check admin session auth safeguard
  if (!Store.currentUser || Store.currentUser.role !== 'admin') {
    window.location.hash = '#login';
    return;
  }

  // Tab switching links
  const overviewBtn = document.getElementById('admin-tab-overview');
  const productsBtn = document.getElementById('admin-tab-products');
  const ordersBtn = document.getElementById('admin-tab-orders');

  const panels = {
    overview: document.getElementById('admin-section-overview'),
    products: document.getElementById('admin-section-products'),
    orders: document.getElementById('admin-section-orders')
  };

  const setTabActive = (tabName) => {
    adminActiveSection = tabName;
    
    // Toggle side nav active button CSS class
    [overviewBtn, productsBtn, ordersBtn].forEach(btn => btn.classList.remove('active-admin-nav'));
    document.getElementById(`admin-tab-${tabName}`).classList.add('active-admin-nav');

    // Toggle viewport section panel
    for (let key in panels) {
      if (key === tabName) {
        panels[key].classList.add('active-admin-section');
      } else {
        panels[key].classList.remove('active-admin-section');
      }
    }

    // Refresh sub-views
    if (tabName === 'overview') {
      renderAdminOverview();
    } else if (tabName === 'products') {
      renderAdminProductList();
    } else if (tabName === 'orders') {
      renderAdminOrdersList();
    }
  };

  overviewBtn.onclick = () => setTabActive('overview');
  productsBtn.onclick = () => setTabActive('products');
  ordersBtn.onclick = () => setTabActive('orders');

  // Trigger default panel reload
  setTabActive(adminActiveSection);
}

// Sub-view A: Stats Overview counters
function renderAdminOverview() {
  const totalCount = Store.products.length;
  const listedCount = Store.products.filter(p => p.active).length;
  const unlistedCount = Store.products.filter(p => !p.active).length;
  const orderCount = Store.orders.length;

  document.getElementById('stat-total-products').innerText = totalCount;
  document.getElementById('stat-listed-products').innerText = listedCount;
  document.getElementById('stat-unlisted-products').innerText = unlistedCount;
  document.getElementById('stat-total-orders').innerText = orderCount;
}

// Sub-view B: Admin Products List Dashboard Table & form management
function renderAdminProductList() {
  const tableBody = document.getElementById('admin-product-table-body');
  if (!tableBody) return;

  tableBody.innerHTML = Store.products.map(prod => `
    <tr>
      <td>
        <div class="table-product-cell">
          <div class="table-product-img">
            <img src="${prod.image}" alt="" style="height:32px; width:auto;">
          </div>
          <div>
            <strong style="color:var(--primary); font-size:0.95rem;">${prod.title}</strong>
            <span style="display:block; font-size:0.75rem; color:var(--text-light);">ID: ${prod.id}</span>
          </div>
        </div>
      </td>
      <td><span style="font-weight:500; font-size:0.85rem;">${prod.category}</span></td>
      <td><strong>₹${prod.price}</strong></td>
      <td>
        <span class="badge-status ${prod.active ? 'badge-listed' : 'badge-unlisted'}">
          ${prod.active ? 'Listed' : 'Unlisted'}
        </span>
      </td>
      <td>
        <div class="btn-action-group">
          <!-- Toggle List/Unlist -->
          <button class="btn-table-action" onclick="toggleProductListing('${prod.id}')" title="${prod.active ? 'Unlist product' : 'List product'}">
            ${prod.active ? '👁️' : '🕶️'}
          </button>
          <!-- Edit details -->
          <button class="btn-table-action" onclick="openEditProductForm('${prod.id}')" title="Edit details">
            ✏️
          </button>
          <!-- Delete -->
          <button class="btn-table-action delete" onclick="deleteProductFromDB('${prod.id}')" title="Delete product">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Toggle listed status
window.toggleProductListing = function(productId) {
  const prod = Store.products.find(p => p.id === productId);
  if (prod) {
    prod.active = !prod.active;
    Store.saveProducts();
    renderAdminProductList();
    showToast(`Product '${prod.title}' status updated.`);
  }
};

// Edit product: show and prepopulate form inputs
window.openEditProductForm = function(productId) {
  const prod = Store.products.find(p => p.id === productId);
  if (!prod) return;

  const formPanel = document.getElementById('admin-product-form-panel');
  formPanel.style.display = 'block';

  document.getElementById('admin-form-title').innerText = "Edit Product Details";
  document.getElementById('form-product-id').value = prod.id;
  document.getElementById('form-title').value = prod.title;
  document.getElementById('form-category').value = prod.category;
  document.getElementById('form-price').value = prod.price;
  document.getElementById('form-description').value = prod.description;
  document.getElementById('form-ingredients').value = prod.ingredients;
  document.getElementById('form-status').value = prod.active.toString();
  
  // Clear and load variants container
  const container = document.getElementById('form-variants-container');
  if (container) container.innerHTML = '';
  if (prod.variants && prod.variants.length > 0) {
    prod.variants.forEach(v => {
      addVariantRow(v.size, v.price);
    });
  }

  // Initialize temporary memory arrays for edit mode
  window.tempUploadedImages = [null, null, null, null, null];

  // Resolve images array
  const currentImages = prod.images && prod.images.length > 0 ? prod.images : [prod.image];

  // Populate photo inputs for all 5 slots
  for (let idx = 0; idx < 5; idx++) {
    const fileInput = document.getElementById(`form-image-file-${idx}`);
    const urlInput = document.getElementById(`form-image-url-${idx}`);
    
    if (fileInput) fileInput.value = '';
    if (urlInput) urlInput.value = '';

    const imgVal = currentImages[idx];
    if (imgVal) {
      if ((imgVal.startsWith('http') || imgVal.startsWith('images/')) && 
          !imgVal.includes('female_cordial.jpg') && !imgVal.includes('asmarin_syrup.jpg') && 
          !imgVal.includes('hemotone_tonic.jpg') && !imgVal.includes('damarin_drops.jpg') && 
          !imgVal.includes('livero_syrup.jpg') && !imgVal.includes('jaratone_tonic.jpg') && 
          !imgVal.includes('bal_ghutti.jpg') && !imgVal.includes('kasol_cough_syrup.jpg')) {
        // If it's a general URL pasted by admin
        urlInput.value = imgVal;
      } else {
        // If it's base64 or a seeded JPG path
        window.tempUploadedImages[idx] = imgVal;
      }
    }
  }
  
  formPanel.scrollIntoView({ behavior: 'smooth' });
};

// Delete product completely
window.deleteProductFromDB = function(productId) {
  if (confirm("Are you sure you want to permanently delete this product from the database?")) {
    const idx = Store.products.findIndex(p => p.id === productId);
    if (idx !== -1) {
      const title = Store.products[idx].title;
      Store.products.splice(idx, 1);
      Store.saveProducts();
      
      // Delete from Firestore
      if (isFirebaseActive) {
        db.collection('products').doc(productId).delete().catch(err => {
          console.error("Error deleting product from Firestore:", err);
        });
      }

      renderAdminProductList();
      showToast(`Deleted product '${title}' from system.`, "error");
    }
  }
};

window.addVariantRow = function(size = '', price = '') {
  const container = document.getElementById('form-variants-container');
  if (!container) return;

  const row = document.createElement('div');
  row.className = 'variant-row';
  row.style.display = 'flex';
  row.style.gap = '0.5rem';
  row.style.alignItems = 'center';
  row.style.marginBottom = '0.5rem';
  row.innerHTML = `
    <input type="text" placeholder="Size (e.g. 100ml)" class="form-control form-variant-size" value="${size}" style="flex:1; padding:0.4rem;" required>
    <span style="font-size:0.8rem; color:var(--text-light);">Price (₹):</span>
    <input type="number" placeholder="Price" class="form-control form-variant-price" value="${price}" style="flex:1; padding:0.4rem;" required min="1">
    <button type="button" class="btn-icon btn-remove-variant" style="padding:0.4rem; color:var(--error);" title="Remove Option">✕</button>
  `;

  row.querySelector('.btn-remove-variant').onclick = () => {
    row.remove();
  };

  container.appendChild(row);
};

// Form Add/Edit Submission
function initAdminFormController() {
  const openFormBtn = document.getElementById('admin-btn-new-product');
  const cancelFormBtn = document.getElementById('admin-form-cancel');
  const formPanel = document.getElementById('admin-product-form-panel');
  const formEl = document.getElementById('admin-product-form');

  window.tempUploadedImages = [null, null, null, null, null];

  // Set up file change listeners for all 5 input elements
  for (let idx = 0; idx < 5; idx++) {
    const fileInput = document.getElementById(`form-image-file-${idx}`);
    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 1500000) {
            showToast(`Photo ${idx+1} is too large! Please choose a file under 1.5MB.`, "error");
            fileInput.value = '';
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (event) => {
            window.tempUploadedImages[idx] = event.target.result;
            showToast(`Photo ${idx+1} processed successfully!`);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  // Bind Add Variant Option button
  const addVariantBtn = document.getElementById('btn-add-variant-row');
  if (addVariantBtn) {
    addVariantBtn.onclick = () => {
      addVariantRow();
    };
  }

  openFormBtn.onclick = () => {
    formPanel.style.display = 'block';
    formEl.reset();
    document.getElementById('admin-form-title').innerText = "Add New Product";
    document.getElementById('form-product-id').value = '';
    
    // Clear variants
    const container = document.getElementById('form-variants-container');
    if (container) container.innerHTML = '';
    
    // Reset temporary files memory
    window.tempUploadedImages = [null, null, null, null, null];
    
    formPanel.scrollIntoView({ behavior: 'smooth' });
  };

  cancelFormBtn.onclick = () => {
    formPanel.style.display = 'none';
    formEl.reset();
    const container = document.getElementById('form-variants-container');
    if (container) container.innerHTML = '';
    window.tempUploadedImages = [null, null, null, null, null];
  };

  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const pid = document.getElementById('form-product-id').value;
    const title = document.getElementById('form-title').value.trim();
    const category = document.getElementById('form-category').value;
    const price = parseInt(document.getElementById('form-price').value);
    const description = document.getElementById('form-description').value.trim();
    const ingredients = document.getElementById('form-ingredients').value.trim();
    const active = document.getElementById('form-status').value === 'true';

    // Retrieve active images from form inputs
    const resolvedImages = [];
    for (let idx = 0; idx < 5; idx++) {
      const urlVal = document.getElementById(`form-image-url-${idx}`).value.trim();
      const uploadedVal = window.tempUploadedImages[idx];
      const resultVal = urlVal || uploadedVal || null;
      if (resultVal) {
        resolvedImages.push(resultVal);
      }
    }

    // Default SVG generator fallback
    const getFallbackImage = () => {
      let svgColor = '#12372a';
      if (category === "Women's Health") svgColor = '#c026d3';
      else if (category === "Respiratory Care") svgColor = '#0d9488';
      else if (category === "Restorative Tonics") svgColor = '#b91c1c';
      else if (category === "Pediatrics") svgColor = '#d97706';
      else if (category === "Liver Care") svgColor = '#16a34a';
      else if (category === "Cough & Cold") svgColor = '#059669';
      return generateProductSVG(svgColor, title.substring(0,8).toUpperCase(), 'cross');
    };

    // Collect and parse variant rows
    const variantRows = document.querySelectorAll('.variant-row');
    const variants = [];
    variantRows.forEach(row => {
      const sizeVal = row.querySelector('.form-variant-size').value.trim();
      const priceVal = parseInt(row.querySelector('.form-variant-price').value);
      if (sizeVal && priceVal) {
        variants.push({ size: sizeVal, price: priceVal });
      }
    });

    if (pid) {
      // Modify matching product in array
      const prod = Store.products.find(p => p.id === pid);
      if (prod) {
        prod.title = title;
        prod.category = category;
        prod.price = price;
        prod.description = description;
        prod.ingredients = ingredients;
        prod.active = active;
        prod.variants = variants;
        
        // Handle images array and fallback
        if (resolvedImages.length > 0) {
          prod.images = resolvedImages;
          prod.image = resolvedImages[0];
        } else {
          // If all inputs empty, preserve what was already there or fallback
          if (!prod.image) {
            const fallback = getFallbackImage();
            prod.image = fallback;
            prod.images = [fallback];
          } else {
            prod.images = prod.images && prod.images.length > 0 ? prod.images : [prod.image];
          }
        }

        Store.saveProducts();
        showToast("Product updated successfully!");
      }
    } else {
      // Create new product
      const newId = "p" + (Date.now());
      const firstImg = resolvedImages[0] || getFallbackImage();
      const newProd = {
        id: newId,
        title,
        category,
        price,
        description,
        ingredients,
        image: firstImg,
        images: resolvedImages.length > 0 ? resolvedImages : [firstImg],
        dosage: "Take 1 to 2 teaspoonfuls (5-10 ml) twice daily after meals, or as directed by a physician.",
        active,
        variants
      };
      
      Store.products.push(newProd);
      Store.saveProducts();
      showToast("Product created and listed successfully!");
    }

    formPanel.style.display = 'none';
    formEl.reset();
    window.tempUploadedImages = [null, null, null, null, null];
    renderAdminProductList();
  });
}

// Sub-view C: Admin customer orders viewer
function renderAdminOrdersList() {
  const tableBody = document.getElementById('admin-orders-table-body');
  if (!tableBody) return;

  if (Store.orders.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center; padding:3rem; color:var(--text-light);">
          No transaction history recorded yet.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = Store.orders.slice().reverse().map(order => {
    const itemsHtml = order.items.map(item => `
      <div style="font-size:0.8rem; line-height:1.4;">
        • ${item.title} <span style="color:var(--text-light);">(x${item.qty})</span>
      </div>
    `).join('');

    return `
      <tr>
        <td>
          <code style="font-weight:700; color:var(--primary);">#${order.orderId}</code>
          <span style="display:block; font-size:0.75rem; color:var(--text-light);">${order.date}</span>
        </td>
        <td>
          <strong style="color:var(--primary); font-size:0.9rem;">${order.customerName}</strong>
          <span style="display:block; font-size:0.75rem; color:var(--text-light);">${order.customerEmail}</span>
          <span style="display:block; font-size:0.75rem; color:var(--text-light); font-style:italic; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            ${order.shippingAddress}
          </span>
        </td>
        <td>${itemsHtml}</td>
        <td><strong style="color:var(--primary);">₹${order.totalPrice}</strong></td>
        <td>
          <span class="badge-status" style="background:var(--sage-light); color:var(--primary); font-weight:600;">
            ${order.paymentMethod}
          </span>
          <span style="display:block; font-size:0.7rem; color:var(--text-light);">Ref: ${order.transactionId.substring(0,8)}...</span>
        </td>
      </tr>
    `;
  }).join('');
}


// Auto-slide animation for Hero section Legacy Banners
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length === 0) return;
  
  let currentSlideIndex = 0;
  setInterval(() => {
    slides[currentSlideIndex].classList.remove('active-slide');
    currentSlideIndex = (currentSlideIndex + 1) % slides.length;
    slides[currentSlideIndex].classList.add('active-slide');
  }, 4500);
}


// --- MAIN APP INITIALIZER ---
document.addEventListener('DOMContentLoaded', () => {
  Store.init();
  initRouter();
  initAuth();
  initPaymentGateway();
  initAdminFormController();
  initProductDetailModalController();
  
  // Connect categories on startup
  renderProductsStore();

  // Initialize slider auto-rotator
  initHeroSlideshow();

  // Mobile Navigation toggle controller
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const navElement = document.querySelector('nav');
  if (mobileToggle && navElement) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navElement.classList.toggle('active-nav');
    });
    // Close menu when navigation link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navElement.classList.remove('active-nav');
      });
    });
    // Close menu on clicks outside the header
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#main-header')) {
        navElement.classList.remove('active-nav');
      }
    });
  }

  // Toggle category sidebar on mobile
  const sidebar = document.querySelector('.filter-sidebar');
  if (sidebar) {
    sidebar.addEventListener('click', (e) => {
      // Toggle only on mobile viewports when clicking outside the actual category buttons
      if (window.innerWidth <= 768 && !e.target.closest('.category-list')) {
        sidebar.classList.toggle('expanded');
      }
    });
  }
});
