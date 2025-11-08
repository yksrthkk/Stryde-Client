/* STORE.JS
   - client-side cart + currency display
   - placeholder images used; replace with your assets later
   - EXCHANGE_RATE used to compute INR from USD. Change to latest rate if needed.
   - Cart panel and modal are intentionally wrapped with comment markers for easy copy/paste.
*/
(function(){
  const EXCHANGE_RATE = 83.5; // 1 USD = 83.5 INR approx.

  // formatters
  const fmtUSD = v => '$' + Number(v).toFixed(2);
  const fmtINR = v => '₹' + Number(v).toFixed(2);

  // update INR display for items
  document.querySelectorAll('.price-inr').forEach(el=>{
    const usd = parseFloat(el.getAttribute('data-usd') || '0');
    el.textContent = ` (~${fmtINR(usd*EXCHANGE_RATE)})`;
  });

  // Tabs
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(t => t.addEventListener('click', () => {
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    const cat = t.dataset.tab;
    document.querySelectorAll('#catalog .grid').forEach(grid=>{
      if (grid.dataset.category === cat) { grid.style.display = 'grid'; }
      else { grid.style.display = 'none'; }
    });
    window.scrollTo({top:120, behavior:'smooth'});
  }));

  // Cart state
  let cart = []; // {id, title, priceUsd, qty, image}

  // UI elements
  const cartCountEl = document.getElementById('cartCount');
  const openCartBtn = document.getElementById('openCart');
  const cartPanel = document.getElementById('cartPanel');
  const closeCartBtn = document.getElementById('closeCart');
  const cartItemsEl = document.getElementById('cartItems');
  const totalUsdEl = document.getElementById('totalUSD');
  const totalInrEl = document.getElementById('totalINR');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose = document.getElementById('modalClose');

  function renderCart(){
    cartItemsEl.innerHTML = '';
    if(cart.length === 0){
      cartItemsEl.innerHTML = '<div style="color:var(--muted); text-align:center; padding:1rem;">Your cart is empty</div>';
    } else {
      cart.forEach(item=>{
        const node = document.createElement('div');
        node.className = 'cart-item';
        node.innerHTML = `
          <img src="${item.image}" alt="${item.title}" class="cart-thumb">
          <div class="cart-meta">
            <h4>${item.title}</h4>
            <p>${fmtUSD(item.priceUsd)} • ${fmtINR(item.priceUsd * EXCHANGE_RATE)}</p>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.5rem;">
            <div class="qty-controls">
              <button data-action="dec" data-id="${item.id}">-</button>
              <div style="padding:.15rem .5rem; font-weight:800;">${item.qty}</div>
              <button data-action="inc" data-id="${item.id}">+</button>
            </div>
            <button data-action="remove" data-id="${item.id}" style="background:transparent;border:0;color:var(--muted);cursor:pointer">Remove</button>
          </div>
        `;
        cartItemsEl.appendChild(node);
      });
    }

    // attach event listeners for qty controls & remove
    cartItemsEl.querySelectorAll('[data-action]').forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');
        if(action === 'inc') updateQty(id, 1);
        if(action === 'dec') updateQty(id, -1);
        if(action === 'remove') removeItem(id);
      });
    });

    updateTotals();
  }

  function updateTotals(){
    const totalUsd = cart.reduce((s,i)=>s + i.priceUsd * i.qty, 0);
    const totalInr = totalUsd * EXCHANGE_RATE;
    totalUsdEl.textContent = fmtUSD(totalUsd);
    totalInrEl.textContent = fmtINR(totalInr);
    cartCountEl.textContent = cart.reduce((s,i)=>s + i.qty, 0);
  }

  function updateQty(id, delta){
    const idx = cart.findIndex(c=>c.id === id);
    if(idx === -1) return;
    cart[idx].qty += delta;
    if(cart[idx].qty <= 0) cart.splice(idx,1);
    renderCart();
  }
  function removeItem(id){
    cart = cart.filter(c=>c.id !== id);
    renderCart();
  }

  // Add to cart buttons
  document.querySelectorAll('.item-card').forEach(card=>{
    const btn = card.querySelector('.buy-btn');
    btn.addEventListener('click', ()=>{
      const id = card.dataset.id;
      const title = card.dataset.title || card.querySelector('.item-title').textContent;
      // ensure dataset price is read reliably
      const priceUsd = parseFloat(card.dataset.priceUsd || card.getAttribute('data-price-usd') || 0) || 0;
      const image = card.querySelector('.item-image').src;
      const existing = cart.find(c => c.id === id);
      if(existing){ existing.qty += 1; }
      else { cart.push({id, title, priceUsd: priceUsd, qty:1, image}); }
      renderCart();
      openCart();
    });
  });

  // Cart open/close
  function openCart(){ cartPanel.classList.remove('hidden'); cartPanel.classList.add('visible'); cartPanel.setAttribute('aria-hidden','false'); }
  function closeCart(){ cartPanel.classList.remove('visible'); cartPanel.classList.add('hidden'); cartPanel.setAttribute('aria-hidden','true'); }
  openCartBtn.addEventListener('click', ()=>{ openCart(); });
  closeCartBtn.addEventListener('click', ()=>{ closeCart(); });

  // Checkout (mock)
  checkoutBtn.addEventListener('click', ()=>{
    if(cart.length === 0){
      alert('Your cart is empty.');
      return;
    }
    // Show success modal (glowing/fade animation)
    modalOverlay.style.display = 'flex';
    modalOverlay.setAttribute('aria-hidden','false');
    // Reset cart to simulate completion
    cart = [];
    renderCart();
  });

  modalClose.addEventListener('click', ()=>{
    modalOverlay.style.display = 'none';
    modalOverlay.setAttribute('aria-hidden','true');
  });
  modalOverlay.addEventListener('click', (e)=>{ if(e.target === modalOverlay) { modalOverlay.style.display='none'; modalOverlay.setAttribute('aria-hidden','true'); } });

  // init cart UI
  renderCart();

  // keyboard close
  document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape'){ closeCart(); modalOverlay.style.display='none'; } });

  // make sure every card's data-price-usd filled
  document.querySelectorAll('.item-card').forEach(c=>{
    if(!c.dataset.priceUsd){
      const usdEl = c.querySelector('.price-usd');
      if(usdEl) c.dataset.priceUsd = parseFloat(usdEl.textContent.replace('$','')) || 0;
    }
  });
})();


    // Floating particles animation
        function createParticles() {
            const particlesContainer = document.querySelector('.particles');
            const particleCount = 50;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
                particlesContainer.appendChild(particle);
            }
        }

        // Scroll animations
        function handleScrollAnimations() {
            const elements = document.querySelectorAll('.fade-in-up');
            
            elements.forEach(element => {
                const elementTop = element.getBoundingClientRect().top;
                const elementVisible = 150;
                
                if (elementTop < window.innerHeight - elementVisible) {
                    element.classList.add('visible');
                }
            });

            
        }
        let lastScrollY = window.scrollY;
  const navbar = document.querySelector('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > lastScrollY && window.scrollY > 80) {
      // Scrolling down → hide navbar
      navbar.classList.add('hide');
    } else {
      // Scrolling up → show navbar
      navbar.classList.remove('hide');
    }
    lastScrollY = window.scrollY;
  });

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
        setTimeout(() => loader.remove(), 500); // Optional: remove from DOM
    }
});



       window.addEventListener('scroll', () => {
    handleScrollAnimations();
});

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            handleScrollAnimations();
        });

        // Add some interactive hover effects
        document.querySelectorAll('.feature-card, .team-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

window.addEventListener('scroll', function () {
        const nav = document.querySelector('nav');
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

  window.addEventListener('load', () => {
    const bar = document.querySelector('.progress-bar');
    bar.style.width = '100%';

    setTimeout(() => {
      document.getElementById('preloader').style.opacity = '0';
      setTimeout(() => {
        document.getElementById('preloader').remove();
      }, 600);
    }, 2200); // Wait for bar to fill
  });

    const form = document.getElementById('contactForm');
  const note = document.getElementById('contactNote');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const webhookURL = "https://discord.com/api/webhooks/1436297264342761604/SVxJwSqk5VlldhRU-KOL3c8zC5c1Vou2A-ryuho_Cdf1pWMELVFRrum1lAfQUnN8iJ2Q" ; // <-- paste your Discord webhook URL here

    if (!name || !email || !message) {
      note.textContent = "⚠️ Please fill in all fields.";
      note.style.color = "#ff7b7b";
      return;
    }

    note.textContent = "⏳ Sending your message...";
    note.style.color = "#bbb";

    const payload = {
      content: `📩 **New Message**\n**Name:** ${name}\n**Email:** ${email}\n**Message:** ${message}`
    };

    try {
      const res = await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        note.textContent = "✅ Message sent successfully! We'll get back to you soon.";
        note.style.color = "#9cff9c";
        form.reset();
      } else {
        note.textContent = "❌ Failed to send message. Please try again later.";
        note.style.color = "#ff7b7b";
      }
    } catch (err) {
      console.error(err);
      note.textContent = "⚠️ Error sending message. Check your connection.";
      note.style.color = "#ff7b7b";
    }
  });
