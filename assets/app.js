
const scores=[
 {id:"ave-maria",title:"Ave Maria",composer:"W. A. Mozart",cat:"Sacred",voice:"SATB",price:"₦4,500 / $3.00",ngn:4500,usd:3.00},
 {id:"hallelujah",title:"Hallelujah Chorus",composer:"G. F. Handel",cat:"Classical",voice:"SATB",price:"₦6,000 / $4.00",ngn:6000,usd:4.00},
 {id:"baba-yetu",title:"Baba Yetu",composer:"Christopher Tin",cat:"African",voice:"SATB",price:"₦5,500 / $3.70",ngn:5500,usd:3.70},
 {id:"o-holy-night",title:"O Holy Night",composer:"Adolphe Adam",cat:"Christmas",voice:"SATB",price:"₦4,000 / $2.70",ngn:4000,usd:2.70},
 {id:"panis-angelicus",title:"Panis Angelicus",composer:"César Franck",cat:"Sacred",voice:"SATB",price:"₦4,500 / $3.00",ngn:4500,usd:3.00},
 {id:"gloria",title:"Gloria",composer:"Antonio Vivaldi",cat:"Classical",voice:"SATB",price:"₦6,500 / $4.30",ngn:6500,usd:4.30},
 {id:"african-sanctus",title:"African Sanctus",composer:"David Fanshawe",cat:"African",voice:"SATB",price:"₦5,000 / $3.30",ngn:5000,usd:3.30},
 {id:"silent-night",title:"Silent Night",composer:"Franz Xaver Gruber",cat:"Christmas",voice:"SATB",price:"₦3,500 / $2.30",ngn:3500,usd:2.30}
];
function scoreCard(s){return `<article class="card score" data-text="${(s.title+' '+s.composer+' '+s.cat).toLowerCase()}"><a href="score.html?id=${s.id}"><div class="cover"><strong>${s.title}</strong></div><div class="body"><h3>${s.title}</h3><div class="muted">${s.composer}</div><div class="chips"><span class="chip">${s.cat}</span><span class="chip">${s.voice}</span><span class="chip">Audio</span></div><div class="price">${s.price}</div></div></a><div style="padding:0 18px 18px"><button type="button" class="btn btn-r" style="width:100%" onclick="addToCart('${s.id}')">Add to Cart</button></div></article>`}
function renderScores(id='scoreGrid',limit=8){let el=document.getElementById(id);if(el)el.innerHTML=scores.slice(0,limit).map(scoreCard).join('')}
function filterScores(){let q=(document.getElementById('q')?.value||'').toLowerCase(),c=(document.getElementById('cat')?.value||'').toLowerCase();document.querySelectorAll('.score').forEach(x=>x.style.display=(x.dataset.text.includes(q)&&x.dataset.text.includes(c))?'block':'none')}
function login(e){e.preventDefault();let name=document.getElementById('name')?.value||'Aniedi';localStorage.setItem('se_user',name);location.href='dashboard.html'}
function logout(){localStorage.removeItem('se_user');location.href='index.html'}
function greet(){let n=localStorage.getItem('se_user')||'Aniedi';document.querySelectorAll('.username').forEach(x=>x.textContent=n);let g=document.getElementById('greeting');if(g)g.textContent=`Welcome back, ${n}.`}
function chooseFile(input,id='fileName'){let f=input.files[0];if(f)document.getElementById(id).textContent=f.name}
function toast(msg){let t=document.getElementById('toast');t.textContent=msg;t.style.display='block';setTimeout(()=>t.style.display='none',2500)}
document.addEventListener('DOMContentLoaded',()=>{renderScores();greet()});

const PRODUCTS=Object.fromEntries(scores.map(s=>[s.id,{id:s.id,title:s.title,composer:s.composer,ngn:s.ngn,usd:s.usd}]));
function getCart(){try{return JSON.parse(localStorage.getItem('se_cart'))||[]}catch(e){return []}}
function saveCart(c){localStorage.setItem('se_cart',JSON.stringify(c));updateCartCount()}
function addToCart(id='ave-maria'){let c=getCart(),p=PRODUCTS[id];if(!p)return;let found=c.find(x=>x.id===p.id);if(found){found.qty+=1}else{c.push({...p,qty:1})}saveCart(c);toast(p.title+' added to cart');}
function removeCart(id){saveCart(getCart().filter(x=>x.id!==id));renderCart()}
function changeQty(id,d){let c=getCart(),x=c.find(i=>i.id===id);if(x){x.qty=Math.max(1,x.qty+d)}saveCart(c);renderCart()}
function updateCartCount(){let n=getCart().reduce((a,x)=>a+x.qty,0);document.querySelectorAll('.cart-count').forEach(x=>x.textContent=n)}
function money(v,c='NGN'){return c==='USD'?'$'+v.toFixed(2):'₦'+Math.round(v).toLocaleString()}
function cartCurrency(){return localStorage.getItem('se_currency')||'NGN'}
function setCurrency(c){localStorage.setItem('se_currency',c);renderCart()}
function cartTotal(){let c=getCart(),cur=cartCurrency();return c.reduce((a,x)=>a+(cur==='USD'?x.usd:x.ngn)*x.qty,0)}
function renderCart(){
 let box=document.getElementById('cartItems');if(!box)return;let c=getCart(),cur=cartCurrency();
 let sel=document.getElementById('currency');if(sel)sel.value=cur;
 if(!c.length){box.innerHTML='<div class="empty"><h2>Your cart is empty.</h2><p class="muted">Find a score you love and add it here.</p><a class="btn btn-r" href="catalogue.html">Browse Scores</a></div>';document.getElementById('cartSummary').style.display='none';return}
 box.innerHTML=c.map(x=>`<div class="cart-item"><div class="mini-cover">${x.title}</div><div><h3>${x.title}</h3><div class="muted">${x.composer} • Digital Tonic Solfa</div><button onclick="removeCart('${x.id}')" style="border:0;background:none;color:#e50914;padding:8px 0;cursor:pointer">Remove</button></div><div><b>${money((cur==='USD'?x.usd:x.ngn)*x.qty,cur)}</b><div class="qty"><button onclick="changeQty('${x.id}',-1)">−</button><span>${x.qty}</span><button onclick="changeQty('${x.id}',1)">+</button></div></div></div>`).join('');
 document.getElementById('subtotal').textContent=money(cartTotal(),cur);document.getElementById('total').textContent=money(cartTotal(),cur)
}
function renderCheckout(){let c=getCart(),cur=cartCurrency(),el=document.getElementById('checkoutItems');if(!el)return;if(!c.length){location.href='cart.html';return}el.innerHTML=c.map(x=>`<div class="sumrow"><span>${x.title} × ${x.qty}</span><b>${money((cur==='USD'?x.usd:x.ngn)*x.qty,cur)}</b></div>`).join('');document.getElementById('checkoutTotal').textContent=money(cartTotal(),cur)}
function completeOrder(e){e.preventDefault();let order='SE-'+Math.floor(100000+Math.random()*900000);localStorage.setItem('se_last_order',order);localStorage.removeItem('se_cart');location.href='order-success.html'}
document.addEventListener('DOMContentLoaded',()=>{updateCartCount();renderCart();renderCheckout()});

function membershipPlanBanner(){
  const q=new URLSearchParams(location.search), plan=q.get('plan');
  if(!plan || !location.pathname.endsWith('signup.html')) return;
  const form=document.querySelector('form');
  if(!form) return;
  const box=document.createElement('div');
  box.className='notice';
  box.style.cssText='padding:14px 16px;margin-bottom:18px;border-left:4px solid #e50914;background:#f4f4f4;color:#111;border-radius:8px';
  box.innerHTML='<b>Selected Membership</b><br>Your membership choice will be confirmed after you create your account.';
  form.prepend(box);
}
document.addEventListener('DOMContentLoaded',membershipPlanBanner);

function addCurrentScoreToCart(){
 const id=new URLSearchParams(location.search).get('id')||'ave-maria';
 addToCart(id);
}
