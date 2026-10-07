(function(){
function toast2(m){if(typeof toast==="function")toast(m);else alert(m)}
function authModal(mode){
 var modal=document.getElementById("modal"),body=document.getElementById("modalbody"),signup=mode==="signup";
 body.innerHTML='<span class="eyebrow">FARMER ACCOUNT</span><h2>'+(signup?"✨ Create your account":"🔐 Welcome back")+'</h2><p class="muted">'+(signup?"Create an account to keep your cart, wishlist, scans and orders on this browser.":"Login to continue to your AgriCare AI dashboard.")+'</p><div class="grid">'+(signup?'<input id="aname" class="input" placeholder="Full name">':"")+'<input id="aemail" class="input" type="email" placeholder="Email address"><input id="apass" class="input" type="password" placeholder="Password"><button class="btn primary full" id="authSubmit">'+(signup?"Create Account":"Login")+'</button>'+(signup?'':'<button class="btn secondary full" id="switchSignup">Create new account</button>')+'<p id="amsg" class="muted tiny">College-project demo authentication. For production, connect Supabase Auth.</p></div>';
 modal.classList.remove("hide");document.getElementById("authSubmit").onclick=function(){authDo(signup)};var sw=document.getElementById("switchSignup");if(sw)sw.onclick=function(){authModal("signup")};
}
function authDo(signup){
 var e=document.getElementById("aemail").value.trim().toLowerCase(),p=document.getElementById("apass").value,n=signup?(document.getElementById("aname").value.trim()||"Farmer"):"Farmer",m=document.getElementById("amsg");
 if(!e||!p){m.textContent="Please enter email and password.";return}
 var ac;try{ac=JSON.parse(localStorage.getItem("agriAccounts")||"[]")}catch(x){ac=[]}
 if(signup){if(ac.some(a=>a.email===e)){m.textContent="Account already exists. Please login.";return}ac.push({email:e,password:p,name:n});localStorage.setItem("agriAccounts",JSON.stringify(ac));localStorage.setItem("agriUser",JSON.stringify({email:e,name:n}));m.textContent="Account created successfully.";setTimeout(()=>{modalClose();toast2("Account created 👋")},300)}
 else{var u=ac.find(a=>a.email===e&&a.password===p);if(!u){m.textContent="Incorrect email or password.";return}localStorage.setItem("agriUser",JSON.stringify({email:u.email,name:u.name}));m.textContent="Login successful.";setTimeout(()=>{modalClose();toast2("Welcome back 👋")},300)}
}
function modalClose(){document.getElementById("modal").classList.add("hide");localStorage.setItem("agriWelcomeSeen","1");if(typeof render==="function")render()}
function patchLogin(){var b=document.getElementById("login");if(b&&!b.dataset.authPatched){b.dataset.authPatched="1";b.onclick=()=>authModal("login")}}
function welcomeSetup(){
 var w=document.getElementById("welcome");if(!w)return;
 if(localStorage.getItem("agriWelcomeSeen")==="1")w.classList.add("hide");
 document.getElementById("welcomeLogin").onclick=()=>{w.classList.add("hide");authModal("login")};
 document.getElementById("welcomeSignup").onclick=()=>{w.classList.add("hide");authModal("signup")};
 document.getElementById("welcomeGuest").onclick=()=>{w.classList.add("hide");localStorage.setItem("agriWelcomeSeen","1")};
 document.getElementById("welcomeClose").onclick=()=>{w.classList.add("hide");localStorage.setItem("agriWelcomeSeen","1")};
}
window.addEventListener("load",()=>{patchLogin();welcomeSetup()});setTimeout(()=>{patchLogin();welcomeSetup()},50);
})();