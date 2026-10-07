
(function(){
  var extraCrops=["Rice","Tomato","Chilli","Cotton","Maize","Groundnut","Mango","Banana"];
  var extraProducts=["Neem Bio Pesticide","Copper Fungicide","Sulphur Fungicide","Sticky Insect Traps","Bio-Fertilizer Pack","Plant Growth Support"];
  function h(s){return String(s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]})}
  function toast2(m){if(typeof toast==="function"){toast(m)}else{alert(m)}}
  function pageExtra(p){
    var app=document.getElementById("app"), html="";
    if(p==="fertilizer") html='<section><span class="eyebrow">NUTRIENT GUIDE</span><h2>🌱 Fertilizer Guide</h2><p class="muted">Starter educational guidance. Use soil-test results and local recommendations for actual application.</p><div class="grid grid2"><div class="card"><select id="fc" class="input">'+extraCrops.map(function(x){return "<option>"+x+"</option>"}).join("")+'</select><select id="fs" class="input"><option>Soil test not available</option><option>Low nitrogen indication</option><option>Low phosphorus indication</option><option>Low potassium indication</option></select><button class="btn primary full" id="fg">Create guide</button></div><div class="card" id="fr"><h3>Choose conditions</h3><p class="muted">Your starter guide will appear here.</p></div></div></section>';
    if(p==="weather") html='<section><span class="eyebrow">WEATHER ADVISOR</span><h2>🌤️ Farm Weather Notes</h2><div class="grid grid3"><div class="card"><h3>🌡️ Temperature</h3><input id="wt" class="input" type="number" placeholder="°C"></div><div class="card"><h3>🌧️ Rain chance</h3><input id="wr" class="input" type="number" placeholder="%"></div><div class="card"><h3>🌬️ Wind</h3><select id="ww" class="input"><option>Low</option><option>Moderate</option><option>High</option></select></div></div><button class="btn primary" id="wg">Get farm advice</button><div id="wres" style="margin-top:18px"></div></section>';
    if(p==="soil") html='<section><span class="eyebrow">SOIL TOOLS</span><h2>🧪 Soil Check</h2><div class="grid grid2"><div class="card"><input id="phx" class="input" type="number" step="0.1" placeholder="Enter soil pH"><button class="btn primary full" id="phg">Interpret pH</button></div><div class="card" id="phr"><h3>Soil pH</h3><p class="muted">Enter a value to continue.</p></div></div></section>';
    if(p==="help") html='<section><span class="eyebrow">HELP</span><h2>❓ AgriCare AI Guide</h2><div class="grid grid2"><div class="card"><h3>📷 Scan</h3><p>Upload a crop image and review the demo assessment.</p></div><div class="card"><h3>🦠 Learn</h3><p>Use Crops and Diseases for symptoms and prevention basics.</p></div><div class="card"><h3>💧 Plan</h3><p>Use irrigation, fertilizer, weather and soil tools.</p></div><div class="card"><h3>🔔 Remember</h3><p>Use reminders to track farm activities.</p></div></div><div class="card" style="margin-top:18px"><b>Note:</b> The current scanner is a demonstration diagnosis layer, not a trained crop-disease model.</div></section>';
    if(html){app.innerHTML=html; bindExtra(p); return true}
    return false;
  }
  function bindExtra(p){
    if(p==="fertilizer") document.getElementById("fg").onclick=function(){var s=document.getElementById("fs").value,c=document.getElementById("fc").value,a=s.indexOf("nitrogen")>=0?"Review nitrogen management with a soil test and crop-stage recommendation.":s.indexOf("phosphorus")>=0?"Review phosphorus status using a soil test.":s.indexOf("potassium")>=0?"Review potassium status and crop stage.":"Use soil-test and crop-stage recommendations rather than guessing a dose.";document.getElementById("fr").innerHTML="<h3>🌱 "+h(c)+" guide</h3><p>"+a+"</p><p class='muted'>No dose is prescribed by this demo.</p>"};
    if(p==="weather") document.getElementById("wg").onclick=function(){var t=Number(document.getElementById("wt").value),r=Number(document.getElementById("wr").value),w=document.getElementById("ww").value,n=[];if(t>=35)n.push("High heat: monitor crop stress and irrigation.");if(t&&t<18)n.push("Cool conditions: monitor sensitive crops.");if(r>=60)n.push("High rain chance: check drainage and avoid excess irrigation.");if(r&&r<20)n.push("Low rain chance: monitor soil moisture.");if(w==="High")n.push("High wind: avoid unsuitable spraying conditions.");if(!n.length)n.push("Moderate conditions in this simple demo; continue normal crop scouting.");document.getElementById("wres").innerHTML="<div class='card'><h3>🌤️ Farm advice</h3><ul>"+n.map(function(x){return "<li>"+x+"</li>"}).join("")+"</ul></div>"};
    if(p==="soil") document.getElementById("phg").onclick=function(){var v=Number(document.getElementById("phx").value),a="Enter a valid pH.";if(v>=0&&v<5.5)a="Strongly acidic range; consider soil testing and local soil advice.";else if(v<6.5)a="Mildly acidic range; crop suitability varies.";else if(v<=7.5)a="Near-neutral range; many crops can perform well.";else if(v<=8.5)a="Alkaline range; check crop tolerance and soil test.";else if(v<=14)a="Strongly alkaline range; seek local soil-management guidance.";document.getElementById("phr").innerHTML="<h3>🧪 Soil pH</h3><p>"+a+"</p>"};
  }
  function addNav(){
    var nav=document.querySelector("aside nav"); if(!nav||nav.dataset.extra)return;
    nav.dataset.extra="1";
    [["fertilizer","🌱 Fertilizer"],["weather","🌤️ Weather"],["soil","🧪 Soil Tools"],["help","❓ Help"]].forEach(function(x){var a=document.createElement("a");a.href="#"+x[0];a.dataset.page=x[0];a.textContent=x[1];nav.appendChild(a)});
  }
  function authModal(){
    var modal=document.getElementById("modal"),body=document.getElementById("modalbody");
    body.innerHTML='<span class="eyebrow">ACCOUNT</span><h2>👨‍🌾 Farmer Account</h2><div class="grid"><input id="aname" class="input" placeholder="Full name"><input id="aemail" class="input" type="email" placeholder="Email"><input id="apass" class="input" type="password" placeholder="Password"><button class="btn primary full" id="signup">Create account</button><button class="btn secondary full" id="signin">Login</button><p id="amsg" class="muted">Demo authentication is stored in this browser. Real Supabase Auth can be enabled after adding your project URL and anon key.</p></div>';
    modal.classList.remove("hide");
    document.getElementById("signup").onclick=function(){authDo(true)};
    document.getElementById("signin").onclick=function(){authDo(false)};
  }
  function authDo(signup){
    var e=document.getElementById("aemail").value.trim().toLowerCase(),p=document.getElementById("apass").value,n=document.getElementById("aname").value.trim()||"Farmer",m=document.getElementById("amsg");
    if(!e||!p){m.textContent="Enter email and password.";return}
    var ac;try{ac=JSON.parse(localStorage.getItem("agriAccounts")||"[]")}catch(x){ac=[]}
    if(signup){if(ac.some(function(a){return a.email===e})){m.textContent="Account already exists. Please login.";return}ac.push({email:e,password:p,name:n});localStorage.setItem("agriAccounts",JSON.stringify(ac));localStorage.setItem("agriUser",JSON.stringify({email:e,name:n}));m.textContent="Account created successfully.";setTimeout(function(){modalClose()},300)}
    else{var u=ac.find(function(a){return a.email===e&&a.password===p});if(!u){m.textContent="Account not found. Create an account first.";return}localStorage.setItem("agriUser",JSON.stringify({email:u.email,name:u.name}));m.textContent="Login successful.";setTimeout(function(){modalClose();toast2("Welcome back 👋")},300)}
  }
  function modalClose(){document.getElementById("modal").classList.add("hide");location.hash=location.hash||"#home"}
  function patchLogin(){var b=document.getElementById("login");if(b&&!b.dataset.authPatched){b.dataset.authPatched="1";b.onclick=authModal}}
  function route(){addNav();patchLogin();var p=location.hash.replace("#","")||"home";if(pageExtra(p))document.querySelectorAll("nav a").forEach(function(a){a.classList.toggle("active",a.dataset.page===p)})}
  window.addEventListener("hashchange",route);window.addEventListener("load",route);setTimeout(route,50);
})();
