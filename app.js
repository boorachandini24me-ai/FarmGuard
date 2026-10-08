const $ = (id) => document.getElementById(id);

const PRODUCTS = [
  {id:"neem",name:"Neem Bio Pesticide",price:299,category:"Pesticide",crop:"All Crops",type:"Bio",rating:4.7,stock:32,icon:"🌿",desc:"Plant-based protection for common insect pests.",use:"Mix with water as directed and spray on affected plants.",benefits:"Helps control aphids, whiteflies and soft-bodied pests.",safety:"Wear gloves and avoid spraying during strong sunlight."},
  {id:"copper",name:"Copper Fungicide",price:449,category:"Fungicide",crop:"Rice / Tomato",type:"Fungicide",rating:4.6,stock:18,icon:"🧪",desc:"Fungicide support for common leaf and fungal problems.",use:"Dilute according to the product label before application.",benefits:"Supports control of fungal leaf diseases.",safety:"Follow label directions and keep away from children."},
  {id:"sulphur",name:"Sulphur Fungicide",price:379,category:"Fungicide",crop:"Chilli / Tomato",type:"Fungicide",rating:4.5,stock:24,icon:"🟡",desc:"Sulphur-based crop protection product.",use:"Apply only at the recommended label concentration.",benefits:"Useful for several fungal and mite-related problems.",safety:"Do not mix with incompatible products."},
  {id:"traps",name:"Sticky Insect Traps",price:199,category:"Pest Control",crop:"All Crops",type:"Trap",rating:4.4,stock:46,icon:"🟨",desc:"Easy-to-use traps for monitoring flying insects.",use:"Place traps near the crop canopy and replace when full.",benefits:"Simple chemical-free pest monitoring.",safety:"Keep away from children and pets."},
  {id:"bio",name:"Bio-Fertilizer Pack",price:349,category:"Fertilizer",crop:"All Crops",type:"Bio",rating:4.8,stock:40,icon:"🌱",desc:"Microbial support for healthier soil and roots.",use:"Apply as directed on the package.",benefits:"Supports soil health and nutrient availability.",safety:"Store in a cool, dry place."},
  {id:"growth",name:"Plant Growth Support",price:279,category:"Plant Nutrition",crop:"All Crops",type:"Nutrition",rating:4.3,stock:28,icon:"🍃",desc:"Plant nutrition support for active crop growth.",use:"Use only at the recommended concentration.",benefits:"Supports vigorous plant development.",safety:"Read the label before use."}
];

const CROPS = [
  ["Rice","🌾","Kharif","Blast, Brown Spot"],
  ["Tomato","🍅","All season","Early Blight"],
  ["Chilli","🌶️","Kharif","Leaf Curl"],
  ["Cotton","🌿","Kharif","Bollworm"],
  ["Maize","🌽","Kharif","Leaf Spot"],
  ["Groundnut","🥜","Kharif","Leaf Spot"],
  ["Mango","🥭","Summer","Powdery Mildew"],
  ["Banana","🍌","All season","Sigatoka"]
];

const DISEASES = [
  {name:"Rice Blast",crop:"Rice",icon:"🌾",risk:"High",signs:"Spindle-shaped spots on leaves or neck.",care:"Improve drainage and avoid excess nitrogen.",products:["neem","copper"]},
  {name:"Tomato Early Blight",crop:"Tomato",icon:"🍅",risk:"Medium",signs:"Brown target-like spots on older leaves.",care:"Remove affected leaves and improve airflow.",products:["copper","sulphur"]},
  {name:"Chilli Leaf Curl",crop:"Chilli",icon:"🌶️",risk:"High",signs:"Leaf curling, yellowing and stunted growth.",care:"Monitor sucking pests and remove severely affected plants.",products:["neem","traps"]},
  {name:"Cotton Bollworm",crop:"Cotton",icon:"🌿",risk:"High",signs:"Damaged squares and bolls with feeding holes.",care:"Scout regularly and use integrated pest management.",products:["neem","traps"]}
];

const LANG = {
  en:{home:"Home",scan:"Scan Crop",crops:"Crops",diseases:"Diseases",store:"Store",wishlist:"Wishlist",cart:"Cart",orders:"Orders",water:"Irrigation",reminders:"Reminders",history:"My Scans",profile:"Profile",help:"Help",search:"Search products, crops, diseases...",voice:"Voice search",login:"Login"},
  te:{home:"హోమ్",scan:"పంట స్కాన్",crops:"పంటలు",diseases:"వ్యాధులు",store:"స్టోర్",wishlist:"విష్‌లిస్ట్",cart:"కార్ట్",orders:"ఆర్డర్లు",water:"నీటిపారుదల",reminders:"రిమైండర్లు",history:"నా స్కాన్లు",profile:"ప్రొఫైల్",help:"సహాయం",search:"ఉత్పత్తులు, పంటలు, వ్యాధులు వెతకండి...",voice:"వాయిస్ సెర్చ్",login:"లాగిన్"},
  hi:{home:"होम",scan:"फसल स्कैन",crops:"फसलें",diseases:"रोग",store:"स्टोर",wishlist:"विशलिस्ट",cart:"कार्ट",orders:"ऑर्डर",water:"सिंचाई",reminders:"रिमाइंडर",history:"मेरे स्कैन",profile:"प्रोफ़ाइल",help:"मदद",search:"उत्पाद, फसल या रोग खोजें...",voice:"वॉइस सर्च",login:"लॉगिन"}
};

const DEFAULT = {cart:[],wishlist:[],orders:[],scans:[],reminders:[],reviews:[],language:"en"};
let state = loadState();

function loadState(){
  try{
    const raw = JSON.parse(localStorage.getItem("agriState") || "{}");
    return Object.assign({}, DEFAULT, raw || {});
  }catch(e){
    localStorage.removeItem("agriState");
    return Object.assign({}, DEFAULT);
  }
}
function save(){ try{localStorage.setItem("agriState",JSON.stringify(state));}catch(e){} updateBadges(); }
function product(id){return PRODUCTS.find(p=>p.id===id);}
function currentUser(){try{return JSON.parse(localStorage.getItem("agriUser")||"null");}catch(e){return null;}}
function esc(v){return String(v==null?"":v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));}
function money(n){return "₹"+Number(n||0).toLocaleString("en-IN");}
function cartCount(){return state.cart.reduce((n,x)=>n+Number(x.qty||0),0);}
function cartTotal(){return state.cart.reduce((n,x)=>{const p=product(x.id);return n+(p?p.price*Number(x.qty||0):0);},0);}
function toast(msg){const t=$("toast");if(!t)return;t.textContent=msg;t.classList.remove("hide");clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.add("hide"),2200);}
function go(page){location.hash=page;}
function updateBadges(){
  const n=cartCount();
  document.querySelectorAll("[data-cart-count]").forEach(x=>x.textContent=n);
  const w=state.wishlist.length;
  document.querySelectorAll("[data-wish-count]").forEach(x=>x.textContent=w);
}

function navLabel(page,icon){
  const l=LANG[state.language]||LANG.en;
  return icon+" <span>"+(l[page]||page)+"</span>";
}

function home(){
  const u=currentUser();
  const name=esc(u?.name||"Farmer");
  const scans=state.scans.length;
  return '<div class="page">'+
    '<section class="hero"><div class="hero-copy"><div class="eyebrow">🌿 SMART FARMING + AGRI STORE</div>'+
    '<h1>Hello '+name+'.<br><em>Grow smarter.</em></h1>'+
    '<p>Scan a crop, understand a possible problem, find matching farm inputs, manage your cart and track orders — all in one place.</p>'+
    '<div class="hero-actions"><button class="btn primary" data-go="scan">📷 Scan Your Crop</button><button class="btn soft" data-go="store">🛒 Shop Farm Store</button></div></div>'+
    '<div class="hero-art"><div class="art-card">🌾<span>Crop care</span></div><div class="big-plant">🌱</div><div class="art-card">🦠<span>Disease help</span></div></div></section>'+
    '<section class="section"><div class="stats">'+
    '<div class="card stat"><b>📷</b><div><strong>'+scans+'</strong><small>My scans</small></div></div>'+
    '<div class="card stat"><b>🛒</b><div><strong>'+cartCount()+'</strong><small>Cart items</small></div></div>'+
    '<div class="card stat"><b>❤️</b><div><strong>'+state.wishlist.length+'</strong><small>Wishlist</small></div></div></div></section>'+
    '<section class="section"><div class="section-head"><div><span class="eyebrow">STORE HOME</span><h2>Featured products</h2></div><button class="btn outline" data-go="store">View all</button></div>'+
    '<div class="product-grid">'+PRODUCTS.slice(0,4).map(productCard).join("")+'</div></section>'+
    '<section class="section"><div class="section-head"><div><span class="eyebrow">SMART TOOLS</span><h2>Farmer tools</h2></div></div>'+
    '<div class="tool-grid">'+
    '<button class="tool-card" data-go="scan"><span>📷</span><strong>Scan Crop</strong><small>Check a possible crop problem</small></button>'+
    '<button class="tool-card" data-go="water"><span>💧</span><strong>Irrigation Planner</strong><small>Plan your next watering</small></button>'+
    '<button class="tool-card" data-go="reminders"><span>🔔</span><strong>Reminders</strong><small>Keep farm tasks on track</small></button>'+
    '<button class="tool-card" data-go="history"><span>🗂️</span><strong>My Scans</strong><small>Review previous scan results</small></button>'+
    '</div></section></div>';
}

function productCard(p){
  const saved=state.wishlist.includes(p.id);
  return '<article class="product-card"><button class="wish" data-wish="'+p.id+'" aria-label="Wishlist">'+(saved?"❤️":"♡")+'</button>'+
    '<button class="product-main" data-product="'+p.id+'"><div class="product-icon">'+p.icon+'</div><div class="product-info"><span class="tag">'+esc(p.category)+'</span><h3>'+esc(p.name)+'</h3><div class="rating">★ '+p.rating+' <span>• '+p.stock+' in stock</span></div><strong class="price">'+money(p.price)+'</strong></div></button>'+
    '<div class="product-actions"><button class="btn soft" data-add="'+p.id+'">Add to cart</button><button class="btn primary" data-buy="'+p.id+'">Buy now</button></div></article>';
}

function scanPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">AI CROP CHECK</span><h1>Scan your crop</h1><p>Upload a crop photo to get a demonstration result and matching treatment products.</p></section>'+
 '<section class="scan-box card"><div class="upload-icon">📷</div><h2>Upload crop photo</h2><p>Use a clear photo of the affected leaf, fruit or stem.</p><input id="cropFile" type="file" accept="image/*" hidden><button class="btn primary" id="choosePhoto">Choose photo</button><div id="scanPreview"></div><div id="scanResult"></div></section></div>';
}

function cropsPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">CROP LIBRARY</span><h1>Crops</h1><p>Browse common crops and the problems to watch for.</p></section><div class="crop-grid">'+CROPS.map(c=>'<article class="crop-card"><span>'+c[1]+'</span><h3>'+c[0]+'</h3><small>'+c[2]+'</small><p>Watch for: '+c[3]+'</p><button class="btn soft" data-search="'+esc(c[0])+'">Find products</button></article>').join("")+'</div></div>';
}

function diseasesPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">DISEASE LIBRARY</span><h1>Crop diseases</h1><p>Common symptoms and practical care suggestions.</p></section><div class="disease-grid">'+DISEASES.map(d=>'<article class="disease-card"><span class="disease-icon">'+d.icon+'</span><span class="risk '+d.risk.toLowerCase()+'">'+d.risk+' risk</span><h3>'+d.name+'</h3><small>'+d.crop+'</small><p><b>Signs:</b> '+d.signs+'</p><p><b>Care:</b> '+d.care+'</p><div>'+d.products.map(id=>'<button class="link-btn" data-product="'+id+'">'+product(id).name+'</button>').join("")+'</div></article>').join("")+'</div></div>';
}

function store(){
 const q=String(window.storeQuery||"").toLowerCase().trim();
 let list=PRODUCTS.filter(p=>!q||[p.name,p.category,p.crop,p.type].join(" ").toLowerCase().includes(q));
 return '<div class="page"><section class="page-head store-head"><div><span class="eyebrow">AGRI STORE</span><h1>Farm store</h1><p>Farm inputs for crop protection, nutrition and pest monitoring.</p></div><button class="btn soft" data-go="cart">🛒 Cart <span data-cart-count>'+cartCount()+'</span></button></section>'+
 '<div class="filters"><input id="storeSearch" value="'+esc(window.storeQuery||"")+'" placeholder="Search products, crops or categories..."><select id="sortStore"><option value="featured">Featured</option><option value="low">Price: Low to high</option><option value="high">Price: High to low</option><option value="rating">Top rated</option></select></div>'+
 '<div class="quick-filters"><button data-quick="all">All</button><button data-quick="Pesticide">Pesticides</button><button data-quick="Fungicide">Fungicides</button><button data-quick="Fertilizer">Fertilizers</button><button data-quick="Pest Control">Pest control</button></div>'+
 '<div id="storeProducts" class="product-grid">'+list.map(productCard).join("")+'</div></div>';
}

function wishlistPage(){
 const list=state.wishlist.map(product).filter(Boolean);
 return '<div class="page"><section class="page-head"><span class="eyebrow">SAVED PRODUCTS</span><h1>Wishlist</h1><p>Save useful products for later.</p></section>'+
 (list.length?'<div class="product-grid">'+list.map(productCard).join("")+'</div>':'<div class="empty card"><span>❤️</span><h2>Your wishlist is empty</h2><p>Save products from the store and they will appear here.</p><button class="btn primary" data-go="store">Browse store</button></div>')+'</div>';
}

function cartPage(){
 const items=state.cart.map(x=>({x,p:product(x.id)})).filter(a=>a.p);
 const subtotal=cartTotal(),delivery=subtotal?49:0,total=subtotal+delivery;
 return '<div class="page"><section class="page-head"><span class="eyebrow">YOUR FARM BASKET</span><h1>Cart</h1></section>'+
 (items.length?'<div class="cart-layout"><div>'+items.map(a=>'<article class="cart-row card"><div class="product-icon small">'+a.p.icon+'</div><div class="cart-info"><h3>'+a.p.name+'</h3><strong>'+money(a.p.price)+'</strong><small>'+a.p.category+'</small></div><div class="qty"><button data-qty="'+a.p.id+'" data-delta="-1">−</button><b>'+a.x.qty+'</b><button data-qty="'+a.p.id+'" data-delta="1">+</button></div><button class="remove" data-remove="'+a.p.id+'">Remove</button></article>').join("")+'</div>'+
 '<aside class="summary card"><h2>Order summary</h2><div><span>Subtotal</span><b>'+money(subtotal)+'</b></div><div><span>Delivery</span><b>'+money(delivery)+'</b></div><hr><div class="total"><span>Total</span><b>'+money(total)+'</b></div><button class="btn primary full" data-go="checkout">Proceed to checkout</button><button class="btn soft full" data-go="store">Continue shopping</button></aside></div>':'<div class="empty card"><span>🛒</span><h2>Your cart is empty</h2><p>Add products from the farm store.</p><button class="btn primary" data-go="store">Shop now</button></div>')+'</div>';
}

function checkoutPage(){
 if(!state.cart.length)return cartPage();
 const total=cartTotal()+(cartTotal()?49:0);
 return '<div class="page"><section class="page-head"><span class="eyebrow">CHECKOUT</span><h1>Place your order</h1><p>Enter delivery details and choose a payment method.</p></section>'+
 '<div class="checkout-grid"><form id="checkoutForm" class="card form-card"><h2>Delivery address</h2><label>Name<input name="name" required></label><label>Phone<input name="phone" required></label><label>Address<textarea name="address" rows="4" required></textarea></label><label>Payment<select name="payment"><option>Cash on Delivery</option><option>UPI (demo)</option></select></label><button class="btn primary full" type="submit">Place order • '+money(total)+'</button></form>'+
 '<aside class="summary card"><h2>Order total</h2><div><span>Items</span><b>'+money(cartTotal())+'</b></div><div><span>Delivery</span><b>₹49</b></div><hr><div class="total"><span>Total</span><b>'+money(total)+'</b></div></aside></div></div>';
}

function ordersPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">ORDER TRACKING</span><h1>Orders</h1></section>'+
 (state.orders.length?'<div class="order-list">'+state.orders.map(o=>'<article class="order card"><div><b>Order '+esc(o.id)+'</b><small>'+esc(o.date)+' • '+esc(o.payment)+'</small></div><span class="status">'+esc(o.status)+'</span><strong>'+money(o.total)+'</strong></article>').join("")+'</div>':'<div class="empty card"><span>📦</span><h2>No orders yet</h2><p>Your placed orders will appear here.</p><button class="btn primary" data-go="store">Start shopping</button></div>')+'</div>';
}

function productPage(){
 const id=(location.hash.split("?id=")[1]||"").split("&")[0],p=product(id)||PRODUCTS[0];
 const reviews=state.reviews.filter(r=>r.product===p.id);
 const avg=reviews.length?reviews.reduce((n,r)=>n+r.stars,0)/reviews.length:p.rating;
 return '<div class="page"><button class="back" data-go="store">← Back to store</button><section class="product-detail card"><div class="detail-icon">'+p.icon+'</div><div class="detail-copy"><span class="tag">'+p.category+'</span><h1>'+p.name+'</h1><div class="rating">★ '+avg.toFixed(1)+' <span>('+reviews.length+' reviews)</span></div><div class="detail-price">'+money(p.price)+'</div><p>'+p.desc+'</p><div class="detail-points"><div><b>Benefits</b><span>'+p.benefits+'</span></div><div><b>Usage</b><span>'+p.use+'</span></div><div><b>Safety</b><span>'+p.safety+'</span></div></div><p class="stock">✓ '+p.stock+' units available</p><div class="hero-actions"><button class="btn soft" data-add="'+p.id+'">Add to cart</button><button class="btn primary" data-buy="'+p.id+'">Buy now</button></div></div></section>'+
 '<section class="section"><div class="section-head"><h2>Customer reviews</h2><button class="btn outline" data-review="'+p.id+'">Write a review</button></div>'+
 (reviews.length?reviews.map(r=>'<article class="review card"><b>'+("★".repeat(r.stars))+'</b><p>'+esc(r.text)+'</p></article>').join(""):'<div class="empty card"><p>No reviews yet. Be the first to review this product.</p></div>')+'</section></div>';
}

function waterPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">SMART IRRIGATION</span><h1>Irrigation planner</h1><p>A simple planning tool — always consider your local soil, weather and crop stage.</p></section><div class="planner card"><label>Crop<select id="waterCrop">'+CROPS.map(c=>'<option>'+c[0]+'</option>').join("")+'</select></label><label>Area (acres)<input id="waterArea" type="number" min="0.1" step="0.1" value="1"></label><label>Recent rainfall<select id="rain"><option>Low</option><option selected>Medium</option><option>High</option></select></label><button class="btn primary" id="planWater">Create plan</button><div id="waterResult"></div></div></div>';
}

function remindersPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">FARM TASKS</span><h1>Reminders</h1><p>Keep watering, scouting and farm tasks organized.</p></section><form id="reminderForm" class="card inline-form"><input name="task" placeholder="e.g. Check tomato leaves" required><input name="date" type="date" required><button class="btn primary">Add reminder</button></form><div class="reminder-list">'+(state.reminders.length?state.reminders.map((r,i)=>'<article class="reminder card"><div><b>'+esc(r.task)+'</b><small>'+esc(r.date)+'</small></div><button class="remove" data-reminder="'+i+'">Delete</button></article>').join(""):'<div class="empty card"><span>🔔</span><h2>No reminders</h2><p>Add your next farm task above.</p></div>')+'</div></div>';
}

function historyPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">SCAN HISTORY</span><h1>My scans</h1></section>'+
 (state.scans.length?'<div class="history-list">'+state.scans.slice().reverse().map(s=>'<article class="history card"><span>'+esc(s.icon||"🌿")+'</span><div><h3>'+esc(s.crop||"Crop")+'</h3><p>Possible issue: <b>'+esc(s.disease)+'</b></p><small>'+esc(s.date)+'</small></div></article>').join("")+'</div>':'<div class="empty card"><span>📷</span><h2>No scans yet</h2><p>Upload a crop photo to create your first scan.</p><button class="btn primary" data-go="scan">Scan crop</button></div>')+'</div>';
}

function profilePage(){
 const u=currentUser();
 return '<div class="page"><section class="page-head"><span class="eyebrow">MY ACCOUNT</span><h1>Profile</h1></section><div class="profile-card card"><div class="avatar">👤</div><h2>'+esc(u?.name||"Farmer")+'</h2><p>'+esc(u?.email||"Guest account")+'</p><div class="profile-actions"><button class="btn soft" data-go="orders">📦 Orders</button><button class="btn soft" data-go="wishlist">❤️ Wishlist</button><button class="btn soft" data-go="cart">🛒 Cart</button></div></div></div>';
}

function helpPage(){
 return '<div class="page"><section class="page-head"><span class="eyebrow">SUPPORT</span><h1>Help</h1><p>Quick guidance for using AgriCare AI.</p></section><div class="faq-grid"><article class="card"><h3>📷 How does Scan Crop work?</h3><p>Upload a clear crop photo. This college-project demo returns a possible issue and matching products.</p></article><article class="card"><h3>🛒 How do I buy?</h3><p>Add products to your cart, open checkout and place a demo COD or UPI order.</p></article><article class="card"><h3>🌱 Is the diagnosis real?</h3><p>The current scanner is a demonstration flow, not a medically or agriculturally certified diagnostic model.</p></article></div></div>';
}

function pageRenderer(){
 const key=(location.hash.replace("#","").split("?")[0]||"home");
 const pages={home,scan:scanPage,crops:cropsPage,diseases:diseasesPage,store,wishlist:wishlistPage,cart:cartPage,checkout:checkoutPage,orders:ordersPage,product:productPage,water:waterPage,reminders:remindersPage,history:historyPage,profile:profilePage,help:helpPage};
 return pages[key]||home;
}

function applyLanguage(){
 const l=LANG[state.language]||LANG.en;
 document.querySelectorAll("[data-page]").forEach(a=>{const k=a.dataset.page,sp=a.querySelector("span");if(sp&&l[k])sp.textContent=l[k];});
 const q=$("q");if(q)q.placeholder=l.search;
 const mic=$("mic");if(mic)mic.title=l.voice;
 const login=$("login");if(login)login.title=l.login;
 const lang=$("language");if(lang)lang.value=state.language;
}

function render(){
 const p=pageRenderer();
 const app=$("app");
 if(app)app.innerHTML=p();
 document.querySelectorAll("[data-page]").forEach(a=>a.classList.toggle("active",a.dataset.page===(location.hash.replace("#","").split("?")[0]||"home")));
 applyLanguage();
 updateBadges();
 bindPage();
}

function bindPage(){
 document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go));
 document.querySelectorAll("[data-product]").forEach(b=>b.onclick=()=>go("product?id="+b.dataset.product));
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>addCart(b.dataset.add));
 document.querySelectorAll("[data-buy]").forEach(b=>b.onclick=()=>{addCart(b.dataset.buy,true);});
 document.querySelectorAll("[data-wish]").forEach(b=>b.onclick=()=>toggleWish(b.dataset.wish));
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>removeCart(b.dataset.remove));
 document.querySelectorAll("[data-qty]").forEach(b=>b.onclick=()=>changeQty(b.dataset.qty,Number(b.dataset.delta)));
 document.querySelectorAll("[data-reminder]").forEach(b=>b.onclick=()=>{state.reminders.splice(Number(b.dataset.reminder),1);save();render();});
 document.querySelectorAll("[data-search]").forEach(b=>b.onclick=()=>{window.storeQuery=b.dataset.search;go("store");});
 document.querySelectorAll("[data-review]").forEach(b=>b.onclick=()=>reviewPrompt(b.dataset.review));

 const choose=$("choosePhoto"),file=$("cropFile");
 if(choose&&file){choose.onclick=()=>file.click();file.onchange=()=>handleScan(file);}
 const sf=$("storeSearch");if(sf)sf.oninput=()=>{window.storeQuery=sf.value;refreshStoreProducts();};
 const sort=$("sortStore");if(sort)sort.onchange=()=>refreshStoreProducts();
 document.querySelectorAll("[data-quick]").forEach(b=>b.onclick=()=>{window.storeQuick=b.dataset.quick;b.classList.add("active");refreshStoreProducts();});
 const cf=$("checkoutForm");if(cf)cf.onsubmit=placeOrder;
 const rf=$("reminderForm");if(rf)rf.onsubmit=addReminder;
 const wp=$("planWater");if(wp)wp.onclick=planWater;
}

function refreshStoreProducts(){
 const box=$("storeProducts");if(!box)return;
 const q=String(window.storeQuery||"").toLowerCase().trim(),quick=window.storeQuick||"all",sort=$("sortStore")?.value||"featured";
 let list=PRODUCTS.filter(p=>(!q||[p.name,p.category,p.crop,p.type].join(" ").toLowerCase().includes(q))&&(quick==="all"||p.category===quick));
 if(sort==="low")list.sort((a,b)=>a.price-b.price);
 if(sort==="high")list.sort((a,b)=>b.price-a.price);
 if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
 box.innerHTML=list.length?list.map(productCard).join(""):'<div class="empty card"><span>🔎</span><h2>No products found</h2><p>Try another product, crop or category.</p></div>';
 bindPage();
}

function addCart(id,buyNow){
 const p=product(id);if(!p)return;
 const found=state.cart.find(x=>x.id===id);
 if(found)found.qty=Math.min(Number(found.qty)+1,p.stock);else state.cart.push({id,qty:1});
 save();toast(p.name+" added to cart");
 if(buyNow)go("checkout");else render();
}
function removeCart(id){state.cart=state.cart.filter(x=>x.id!==id);save();render();}
function changeQty(id,d){
 const x=state.cart.find(v=>v.id===id),p=product(id);if(!x||!p)return;
 x.qty=Math.max(0,Math.min(p.stock,Number(x.qty)+d));
 if(x.qty===0)state.cart=state.cart.filter(v=>v.id!==id);
 save();render();
}
function toggleWish(id){
 const i=state.wishlist.indexOf(id);
 if(i>=0){state.wishlist.splice(i,1);toast("Removed from wishlist");}else{state.wishlist.push(id);toast("Saved to wishlist");}
 save();render();
}
function placeOrder(e){
 e.preventDefault();
 const fd=new FormData(e.target),total=cartTotal()+49;
 state.orders.push({id:"AC"+Date.now().toString().slice(-6),date:new Date().toLocaleDateString("en-IN"),payment:fd.get("payment"),status:"Placed",total});
 state.cart=[];save();toast("Order placed successfully");go("orders");
}
function reviewPrompt(id){
 const stars=Number(prompt("Rating 1 to 5")||0),text=prompt("Write your review");
 if(stars>=1&&stars<=5&&text){state.reviews.push({product:id,stars,text});save();render();toast("Review added");}
}
function handleScan(input){
 const file=input.files?.[0],preview=$("scanPreview"),result=$("scanResult");if(!file)return;
 const reader=new FileReader();
 reader.onload=e=>{preview.innerHTML='<img class="preview" src="'+e.target.result+'" alt="Crop preview">';result.innerHTML='<div class="analyzing">🔍 Analyzing crop photo...</div>';setTimeout(()=>{const d=DISEASES[Math.floor(Math.random()*DISEASES.length)];state.scans.push({crop:d.crop,disease:d.name,icon:d.icon,date:new Date().toLocaleString("en-IN")});save();result.innerHTML='<div class="scan-result"><span class="risk high">Demo result</span><h2>'+d.icon+' '+d.name+'</h2><p><b>Possible signs:</b> '+d.signs+'</p><p><b>Care:</b> '+d.care+'</p><h3>Matching products</h3><div class="mini-products">'+d.products.map(id=>'<button class="mini-product" data-product="'+id+'">'+product(id).icon+' '+product(id).name+'</button>').join("")+'</div></div>';bindPage();},900);};
 reader.readAsDataURL(file);
}
function addReminder(e){e.preventDefault();const fd=new FormData(e.target);state.reminders.push({task:fd.get("task"),date:fd.get("date")});save();e.target.reset();render();toast("Reminder added");}
function planWater(){const crop=$("waterCrop")?.value||"crop",area=Number($("waterArea")?.value||1),rain=$("rain")?.value||"Medium";const base=rain==="High"?0.6:rain==="Low"?1.2:0.9;const litres=Math.round(area*base*1000);const r=$("waterResult");if(r)r.innerHTML='<div class="plan-result"><h3>💧 Suggested plan for '+esc(crop)+'</h3><p>For '+area+' acre(s), start with about <b>'+litres+' L</b> in the next irrigation cycle, then adjust based on soil moisture and local weather.</p></div>';}

$("language").onchange=(e)=>{state.language=e.target.value;save();render();};
$("q").oninput=(e)=>{window.storeQuery=e.target.value;if(e.target.value.trim().length>=2&&!location.hash.includes("store")){clearTimeout(window.__search);window.__search=setTimeout(()=>go("store"),350);}else if(location.hash.includes("store"))refreshStoreProducts();};
$("q").onkeydown=(e)=>{if(e.key==="Enter"){window.storeQuery=e.target.value.trim();go("store");}};
$("mic").onclick=()=>{const R=window.SpeechRecognition||window.webkitSpeechRecognition;if(!R){toast("Voice search is not supported on this browser");return;}const r=new R();r.lang=state.language==="te"?"te-IN":state.language==="hi"?"hi-IN":"en-IN";r.continuous=false;r.interimResults=false;$("mic").textContent="🔴";r.onresult=e=>{const text=e.results[0][0].transcript;$("q").value=text;window.storeQuery=text;go("store");};r.onerror=()=>toast("Voice search failed");r.onend=()=>{$("mic").textContent="🎙️";};try{r.start();}catch(e){$("mic").textContent="🎙️";}};
window.addEventListener("hashchange",render);
window.addEventListener("load",()=>{render();applyLanguage();});
render();
