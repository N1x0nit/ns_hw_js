/* empty css                      */(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))s(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const o of i.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function n(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function s(a){if(a.ep)return;a.ep=!0;const i=n(a);fetch(a.href,i)}})();const p={home:document.getElementById("view-home"),favorites:document.getElementById("view-favorites")},D=document.querySelectorAll("[data-view]");let b=null,L=null;function U({onHome:e,onFavorites:t}){L=e,b=t,window.addEventListener("hashchange",k),k()}function k(){const e=window.location.hash.replace(/^#\/?/,"")||"home",t=["home","favorites"].includes(e)?e:"home";p.home&&p.home.classList.toggle("hidden",t!=="home"),p.favorites&&p.favorites.classList.toggle("hidden",t!=="favorites"),D.forEach(function(n){n.classList.toggle("active",n.dataset.view===t)}),t==="home"&&L&&L(),t==="favorites"&&b&&b()}const w="https://your-energy.b.goit.study/api";async function v(e){const t=await fetch(`${w}${e}`);if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);return t.json()}async function j(){const e=`ef_quote_${new Date().toDateString()}`,t=localStorage.getItem(e);if(t)return JSON.parse(t);const n=await v("/quote");return localStorage.setItem(e,JSON.stringify(n)),n}async function V(e){return v(`/filters?filter=${encodeURIComponent(e)}`)}async function W({bodyPart:e,equipment:t,muscles:n,keyword:s,page:a=1,limit:i=10}={}){const o=new URLSearchParams({page:a,limit:i});return e&&o.set("bodyPart",e),t&&o.set("equipment",t),n&&o.set("muscles",n),s&&o.set("keyword",s),v(`/exercises?${o}`)}async function G(e){return v(`/exercises/${e}`)}async function Q(e,{rating:t,email:n,comment:s}){const a={rating:t};n&&(a.email=n),s&&(a.comment=s);const i=await fetch(`${w}/exercises/${e}/rating`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)});if(!i.ok)throw new Error(`HTTP ${i.status}`);return i.json()}async function Y(e){const t=await fetch(`${w}/subscription`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e})});if(!t.ok)throw new Error(`HTTP ${t.status}`);return t.json()}const $=new WeakMap;function H(e){e.classList.remove("hidden"),document.body.classList.add("no-scroll");function t(s){s.key==="Escape"&&m(e)}function n(s){s.target===e&&m(e)}document.addEventListener("keydown",t),e.addEventListener("click",n),$.set(e,{onKey:t,onBackdrop:n})}function m(e){e.classList.add("hidden"),document.body.classList.remove("no-scroll");const t=$.get(e);t&&(document.removeEventListener("keydown",t.onKey),e.removeEventListener("click",t.onBackdrop),$.delete(e))}const B="ef_favorites";function h(){try{return JSON.parse(localStorage.getItem(B))||[]}catch{return[]}}function z(e){const t=h();t.find(n=>n._id===e._id)||(t.push(e),localStorage.setItem(B,JSON.stringify(t)))}function _(e){const t=h().filter(n=>n._id!==e);localStorage.setItem(B,JSON.stringify(t))}function F(e){return h().some(t=>t._id===e)}function u(e,t="info"){const n=document.createElement("div");n.className=`notification notification-${t}`,n.textContent=e,document.body.appendChild(n),setTimeout(function(){n.remove()},3e3)}const T=document.getElementById("rating-modal-overlay"),X=document.getElementById("rating-modal-close"),g=document.getElementById("rating-form"),q=document.getElementById("rating-stars");let P=null,l=0;X.addEventListener("click",function(){m(T)});q.addEventListener("click",function(e){const t=e.target.closest(".star");t&&(l=parseInt(t.dataset.value,10),S(l))});function S(e){q.querySelectorAll(".star").forEach(function(t){t.classList.toggle("active",parseInt(t.dataset.value,10)<=e)})}g.addEventListener("submit",async function(e){var a,i;if(e.preventDefault(),!l){u("Please select a rating","error");return}const t=new FormData(g),n=(a=t.get("email"))==null?void 0:a.trim(),s=(i=t.get("comment"))==null?void 0:i.trim();try{await Q(P,{rating:l,email:n,comment:s}),u("Rating submitted! Thank you.","success"),m(T),g.reset(),l=0,S(0)}catch{u("Failed to submit rating. Try again.","error")}});function Z(e){P=e,l=0,S(0),g.reset(),H(T)}const R=document.getElementById("exercise-modal-overlay"),I=document.getElementById("exercise-modal-content"),ee=document.getElementById("exercise-modal-close");ee.addEventListener("click",function(){m(R)});async function O(e){I.innerHTML='<p class="loading">Loading...</p>',H(R);try{const t=await G(e);te(t)}catch{I.innerHTML='<p class="error">Failed to load exercise.</p>'}}function te(e){const t=F(e._id);I.innerHTML=`
    <div class="ex-modal-body">
      <img src="${e.gifUrl||""}" alt="${e.name}" class="ex-modal-gif" />
      <div class="ex-modal-info">
        <h2 class="ex-modal-name">${e.name}</h2>
        <ul class="ex-modal-meta">
          <li><span>Target:</span> ${e.target||"—"}</li>
          <li><span>Body part:</span> ${e.bodyPart||"—"}</li>
          <li><span>Equipment:</span> ${e.equipment||"—"}</li>
          <li><span>Calories:</span> ${e.burnedCalories||"—"} cal</li>
          <li><span>Rating:</span> ${e.rating?e.rating.toFixed(1):"—"} ★</li>
          <li><span>Time:</span> ${e.time||"—"} min</li>
        </ul>
        <p class="ex-modal-desc">${e.description||""}</p>
        <div class="ex-modal-actions">
          <button class="btn-fav" id="ex-fav-btn">${t?"Remove from favorites":"Add to favorites"}</button>
          <button class="btn-rate" id="ex-rate-btn">Give a rating</button>
        </div>
      </div>
    </div>
  `,document.getElementById("ex-fav-btn").addEventListener("click",function(){F(e._id)?(_(e._id),document.getElementById("ex-fav-btn").textContent="Add to favorites"):(z(e),document.getElementById("ex-fav-btn").textContent="Remove from favorites")}),document.getElementById("ex-rate-btn").addEventListener("click",function(){Z(e._id)})}function A(e){const t=Math.round(e||0);let n="";for(let s=0;s<5;s++)s<t?n+='<span class="star-icon filled">★</span>':n+='<span class="star-icon">★</span>';return n}let M="Muscles",c=null,d=1,f="";const ne=10;function N(e){return(e||"").replace(/\b\w/g,function(t){return t.toUpperCase()})}const ae={Muscles:"muscles","Body parts":"bodyPart",Equipment:"equipment"};async function se(){await ie(),le(),await J("Muscles"),de(),ue(),me()}async function ie(){try{const{quote:e,author:t}=await j();document.getElementById("quote-text").textContent=`"${e}"`,document.getElementById("quote-author").textContent=`— ${t}`}catch{}}async function J(e){if(M=e,c=null,f="",e==="Body parts"){const n=document.getElementById("filter-cards");n.innerHTML="",d=1;const s=document.getElementById("exercises-panel-title");s&&(s.textContent="Exercises");const a=document.getElementById("search-input");a&&(a.value=""),y(!0),await E();return}y(!1);const t=document.getElementById("filter-cards");t.innerHTML='<p class="loading">Loading...</p>';try{const{results:n}=await V(e);let s="";for(let a=0;a<n.length;a++){const i=n[a];s+=`
      <button class="filter-card" data-value="${i.name}" style="background-image: url('${i.imgURL||""}')">
        <div class="filter-card-body">
          <span class="filter-card-name">${N(i.name||i.filter)}</span>
          <span class="filter-card-type">${e}</span>
        </div>
      </button>
    `}t.innerHTML=s}catch{t.innerHTML='<p class="error">Failed to load filters.</p>'}}async function oe(e){c=e,d=1,f="";const t=document.getElementById("search-input");t&&(t.value=""),re(),y(!0),await E()}function re(){const e=document.getElementById("exercises-panel-title");e&&(c?e.innerHTML=`Exercises / <span class="exercises-category">${N(c)}</span>`:e.textContent="Exercises")}async function E(){const e=document.getElementById("exercises-list");e.innerHTML='<li class="loading">Loading...</li>';const t=ae[M]||"muscles";try{const n={page:d,limit:ne};c&&(n[t]=c),f&&(n.keyword=f);const{results:s,totalPages:a}=await W(n);if(!s.length)e.innerHTML='<li class="empty">No exercises found.</li>';else{let i="";for(let o=0;o<s.length;o++){const r=s[o];i+=`
        <li class="exercise-card" data-id="${r._id}">
          <div class="ex-card-header">
            <span class="ex-card-tag">Workout</span>
            <div class="ex-card-rating">
              <span class="ex-rating-num">${r.rating?r.rating.toFixed(1):"0.0"}</span>
              ${A(r.rating)}
            </div>
          </div>
          <span class="ex-name">${r.name}</span>
          <div class="ex-meta-row">
            <span class="ex-meta-item"><span class="ex-meta-label">Burned calories:</span> ${r.burnedCalories||"—"} / ${r.time||"—"} min</span>
          </div>
          <div class="ex-meta-row">
            <span class="ex-meta-item"><span class="ex-meta-label">Body part:</span> ${r.bodyPart||"—"}</span>
            <span class="ex-meta-item"><span class="ex-meta-label">Target:</span> ${r.target||"—"}</span>
          </div>
          <button class="ex-start-btn" data-id="${r._id}">Start <span class="ex-start-arrow">→</span></button>
        </li>
      `}e.innerHTML=i,e.querySelectorAll(".ex-start-btn").forEach(function(o){o.addEventListener("click",function(){O(o.dataset.id)})})}ce(a)}catch{e.innerHTML='<li class="error">Failed to load exercises.</li>'}}function ce(e){const t=document.getElementById("pagination");if(e<=1){t.innerHTML="";return}let n="";for(let s=1;s<=e;s++)n+=`<button class="page-btn ${s===d?"active":""}" data-page="${s}">${s}</button>`;t.innerHTML=n,t.querySelectorAll(".page-btn").forEach(function(s){s.addEventListener("click",async function(){var a;d=parseInt(s.dataset.page,10),await E(),(a=document.querySelector(".exercises-panel"))==null||a.scrollIntoView({behavior:"smooth"})})})}function y(e){const t=document.getElementById("exercises-panel"),n=document.getElementById("filter-cards"),s=document.getElementById("back-to-filters");if(t.classList.toggle("hidden",!e),n.classList.toggle("hidden",e),s){const a=e&&M==="Body parts"&&!c;s.classList.toggle("hidden",a)}}function le(){document.getElementById("filter-cards").addEventListener("click",function(e){const t=e.target.closest(".filter-card");t&&oe(t.dataset.value)})}function de(){document.getElementById("filter-tabs").addEventListener("click",async function(e){const t=e.target.closest(".filter-tab");t&&(document.querySelectorAll(".filter-tab").forEach(function(n){n.classList.remove("active")}),t.classList.add("active"),await J(t.dataset.filter))})}function ue(){document.getElementById("back-to-filters").addEventListener("click",function(){y(!1)})}function me(){document.getElementById("search-form").addEventListener("submit",async function(e){e.preventDefault(),f=document.getElementById("search-input").value.trim(),d=1,await E()})}function fe(){K()}function K(){const e=document.getElementById("favorites-list"),t=document.getElementById("favorites-empty"),n=h();if(!n.length){e.innerHTML="",t.classList.remove("hidden");return}t.classList.add("hidden");let s="";for(let a=0;a<n.length;a++){const i=n[a];s+=`
    <li class="exercise-card" data-id="${i._id}">
      <div class="ex-card-header">
        <span class="ex-card-tag">Workout</span>
        <div class="ex-card-rating">
          <span class="ex-rating-num">${i.rating?i.rating.toFixed(1):"0.0"}</span>
          ${A(i.rating)}
        </div>
      </div>
      <span class="ex-name">${i.name}</span>
      <div class="ex-meta-row">
        <span class="ex-meta-item"><span class="ex-meta-label">Burned calories:</span> ${i.burnedCalories||"—"} / ${i.time||"—"} min</span>
      </div>
      <div class="ex-meta-row">
        <span class="ex-meta-item"><span class="ex-meta-label">Body part:</span> ${i.bodyPart||"—"}</span>
        <span class="ex-meta-item"><span class="ex-meta-label">Target:</span> ${i.target||"—"}</span>
      </div>
      <div class="ex-actions">
        <button class="ex-start-btn" data-id="${i._id}">Start <span class="ex-start-arrow">→</span></button>
        <button class="ex-remove-btn" data-id="${i._id}" aria-label="Remove from favorites">🗑</button>
      </div>
    </li>
  `}e.innerHTML=s,e.querySelectorAll(".ex-start-btn").forEach(function(a){a.addEventListener("click",function(){O(a.dataset.id)})}),e.querySelectorAll(".ex-remove-btn").forEach(function(a){a.addEventListener("click",function(){_(a.dataset.id),K()})})}let C=!1;U({onHome:function(){C||(C=!0,se())},onFavorites:function(){fe()}});const x=document.getElementById("subscribe-form");x==null||x.addEventListener("submit",async function(e){e.preventDefault();const t=e.target.email.value.trim();try{await Y(t),u("Subscribed successfully!","success"),e.target.reset()}catch{u("Subscription failed. Try again.","error")}});
//# sourceMappingURL=index.js.map
