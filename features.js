(function(){
const SUPABASE_URL="https://eftgwlyjkxmlebwsmetc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY="sb_publishable_SdEyHlmE0mLR_R4VYqaabQ_s2jqoOdc";
const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
function toast2(m){if(typeof toast==="function")toast(m);else alert(m)}
async function syncProfile(s){
  try{const {data:{user:u}}=await s.auth.getUser(); if(u){const name=u.user_metadata?.full_name||"Farmer";localStorage.setItem("agriUser",JSON.stringify({id:u.id,email:u.email,name}));}}
  catch(e){}
}
function authModal(mode){
 const modal=document.getElementById("modal"),body=document.getElementById("modalbody"),signup=mode==="signup";
 body.innerHTML='<span class="eyebrow">FARMER ACCOUNT</span><h2>'+(signup?"✨ Create your account":"🔐 Welcome back")+'</h2><p class="muted">'+(signup?"Create your secure AgriCare AI account.":"Login securely with your AgriCare AI account.")+'</p><div class="grid">'+(signup?'<input id="aname" class="input" placeholder="Full name">':"")+'<input id="aemail" class="input" type="email" placeholder="Email address"><input id="apass" class="input" type="password" placeholder="Password"><button class="btn primary full" id="authSubmit">'+(signup?"Create Account":"Login")+'</button>'+(signup?'':'<button class="btn secondary full" id="switchSignup">Create new account</button>')+'<p id="amsg" class="muted tiny">Your account is secured by Supabase.</p></div>';
 modal.classList.remove("hide");document.getElementById("authSubmit").onclick=()=>authDo(signup);const sw=document.getElementById("switchSignup");if(sw)sw.onclick=()=>authModal("signup");
}
async function authDo(signup){
 const e=document.getElementById("aemail").value.trim().toLowerCase(),p=document.getElementById("apass").value,n=signup?(document.getElementById("aname").value.trim()||"Farmer"):"Farmer",m=document.getElementById("amsg");
 if(!e||!p){m.textContent="Please enter email and password.";return}
 if(!sb){m.textContent="Supabase connection is unavailable.";return}
 m.textContent=signup?"Creating your account...":"Signing you in...";
 try{
  let result;
  if(signup) result=await sb.auth.signUp({email:e,password:p,options:{data:{full_name:n}}});
  else result=await sb.auth.signInWithPassword({email:e,password:p});
  if(result.error)throw result.error;
  if(signup && !result.data.session){m.textContent="Account created. Check your email to confirm, then login.";return}
  await syncProfile(sb);localStorage.setItem("agriWelcomeSeen","1");modalClose();toast2(signup?"Account created successfully 👋":"Welcome back 👋");
 }catch(err){m.textContent=err.message||"Authentication failed."}
}
async function logoutSupabase(){try{if(sb)await sb.auth.signOut()}catch(e){}localStorage.removeItem("agriUser");toast2("Logged out");if(typeof nav==="function")nav("home")}
function modalClose(){document.getElementById("modal").classList.add("hide");localStorage.setItem("agriWelcomeSeen","1");if(typeof render==="function")render()}
function patchLogin(){const b=document.getElementById("login");if(b&&!b.dataset.authPatched){b.dataset.authPatched="1";b.onclick=()=>authModal("login")}}
function welcomeSetup(){
 const w=document.getElementById("welcome");if(!w)return;
 if(localStorage.getItem("agriWelcomeSeen")==="1")w.classList.add("hide");
 document.getElementById("welcomeLogin").onclick=()=>{w.classList.add("hide");authModal("login")};
 document.getElementById("welcomeSignup").onclick=()=>{w.classList.add("hide");authModal("signup")};
 document.getElementById("welcomeGuest").onclick=()=>{w.classList.add("hide");localStorage.setItem("agriWelcomeSeen","1")};
 document.getElementById("welcomeClose").onclick=()=>{w.classList.add("hide");localStorage.setItem("agriWelcomeSeen","1")};
}
window.AgriCareSupabase=sb;
window.addEventListener("load",async()=>{patchLogin();welcomeSetup();if(sb){await syncProfile(sb);sb.auth.onAuthStateChange(()=>syncProfile(sb));}});
setTimeout(()=>{patchLogin();welcomeSetup()},50);
window.AgriCareLogout=logoutSupabase;
})();