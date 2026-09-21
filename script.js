const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const money=n=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);
let bag=[];

const bagPanel=$("#bagPanel"), bagOverlay=$("#bagOverlay");
function openBag(){bagPanel.classList.add("open");bagOverlay.classList.add("open")}
function closeBag(){bagPanel.classList.remove("open");bagOverlay.classList.remove("open")}
$("#openBag").onclick=openBag; $("#closeBag").onclick=closeBag; bagOverlay.onclick=closeBag;

function renderBag(){
  $("#bagCount").textContent=bag.reduce((a,x)=>a+x.qty,0);
  const total=bag.reduce((a,x)=>a+x.price*x.qty,0);
  $("#bagTotal").textContent=money(total);
  $("#bagList").innerHTML=bag.length?bag.map((x,i)=>`
    <div class="bag-item">
      <img src="${x.image}" alt="">
      <div><h4>${x.name}</h4><p>SIZE ${x.size} / QTY ${x.qty}</p><p>${money(x.price*x.qty)}</p></div>
      <button class="remove" data-remove="${i}">×</button>
    </div>`).join(""):`<p class="empty">YOUR BAG IS EMPTY.</p>`;
  $$("[data-remove]").forEach(b=>b.onclick=()=>{bag.splice(+b.dataset.remove,1);renderBag()});
}
function addItem(product,size){
  const item=bag.find(x=>x.name===product.dataset.name&&x.size===size);
  if(item)item.qty++; else bag.push({name:product.dataset.name,size,price:+product.dataset.price,image:product.dataset.front,qty:1});
  renderBag();openBag();
}

$$(".sizes").forEach(g=>$$("button",g).forEach(b=>b.onclick=()=>{$$("button",g).forEach(x=>x.classList.remove("active"));b.classList.add("active")}));
$$(".add-btn").forEach(b=>b.onclick=()=>{const p=b.closest(".product"),s=p.querySelector(".sizes .active").textContent;addItem(p,s)});

$$(".flip-btn").forEach(b=>b.onclick=()=>{
  const p=b.closest(".product");p.classList.toggle("is-flipped");
  const art=p.querySelector(".product-art");
  art.style.transform=p.classList.contains("is-flipped")?"rotateY(180deg)":"rotateY(0deg)";
});
$$(".product-art").forEach(a=>{
  a.parentElement.addEventListener("mousemove",e=>{
    if(a.parentElement.classList.contains("is-flipped"))return;
    const r=a.parentElement.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    a.style.transform=`rotateY(${x*7}deg) rotateX(${y*-5}deg)`;
  });
  a.parentElement.addEventListener("mouseleave",()=>{if(!a.parentElement.classList.contains("is-flipped"))a.style.transform=""});
});

let modalProduct=null;
$$(".quick-view").forEach(b=>b.onclick=()=>{
  const p=b.closest(".product");modalProduct=p;
  $("#modalImage").src=p.dataset.front;$("#modalName").textContent=p.dataset.name;$("#modalCode").textContent=p.dataset.code;$("#modalPrice").textContent=money(+p.dataset.price);$("#modalOriginalPrice").textContent=money(+p.dataset.originalPrice);$("#modalDiscount").textContent="DISKON "+money(+p.dataset.discount);
  $("#modalSize").textContent=$("#modalSizes .active").textContent;$("#productModal").classList.add("open");
});
$("#modalClose").onclick=()=>$("#productModal").classList.remove("open");
$("#productModal").addEventListener("click",e=>{if(e.target.id==="productModal")$("#productModal").classList.remove("open")});
$$(".modal-sizes button").forEach(b=>b.onclick=()=>{$$("#modalSizes button").forEach(x=>x.classList.remove("active"));b.classList.add("active");$("#modalSize").textContent=b.textContent});
$("#modalAdd").onclick=()=>{if(modalProduct){addItem(modalProduct,$("#modalSize").textContent);$("#productModal").classList.remove("open")}};

$("#checkout").onclick=()=>{
  if(!bag.length)return alert("BAG MASIH KOSONG.");
  const lines=bag.map(x=>`- ${x.name} / Size ${x.size} / Qty ${x.qty} / ${money(x.price*x.qty)}`).join("\n");
  const total=money(bag.reduce((a,x)=>a+x.price*x.qty,0));
  const text=encodeURIComponent(`Halo NOVRA, saya mau order:\n${lines}\n\nTotal: ${total}`);
  // WhatsApp toko: 6285810127651
  window.open(`https://wa.me/6285810127651?text=${text}`,"_blank");
};

const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
$$(".reveal").forEach(e=>io.observe(e));

const dot=$(".cursor-dot"),ring=$(".cursor-ring");
window.addEventListener("mousemove",e=>{dot.style.left=e.clientX+"px";dot.style.top=e.clientY+"px";ring.style.left=e.clientX+"px";ring.style.top=e.clientY+"px"});
$$("a,button,.product-stage").forEach(e=>{e.addEventListener("mouseenter",()=>ring.classList.add("hover"));e.addEventListener("mouseleave",()=>ring.classList.remove("hover"))});
renderBag();
