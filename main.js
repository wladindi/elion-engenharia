/* ── PRELOADER ── */
(function(){
  const pre=document.getElementById('preloader');
  const fill=document.getElementById('pre-fill');
  const ctr=document.getElementById('pre-ctr');
  const total=1600, start=Date.now();
  function tick(){
    const p=Math.min(100,Math.round((Date.now()-start)/total*100));
    fill.style.width=p+'%'; ctr.textContent=p+'%';
    if(p<100){ requestAnimationFrame(tick); }
    else{
      setTimeout(()=>{
        pre.classList.add('open');
        document.body.classList.remove('loading');
        setTimeout(()=>pre.classList.add('hidden'),2100);
      },150);
    }
  }
  requestAnimationFrame(tick);
})();

/* ── CURSOR ── */
const cur=document.getElementById('cursor');
if(cur&&matchMedia('(pointer:fine)').matches){
  const dot=cur.querySelector('.dot'), ring=cur.querySelector('.ring');
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{ mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px'; });
  (function raf(){ rx+=(mx-rx)*.12; ry+=(my-ry)*.12; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(raf); })();
  document.querySelectorAll('a,button,.proj-card,.pilar-card,.gal-item,.team-card,.val-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>document.body.classList.add('c-hover'));
    el.addEventListener('mouseleave',()=>document.body.classList.remove('c-hover'));
  });
}

/* ── MAGNETIC BUTTONS ── */
document.querySelectorAll('.mag').forEach(b=>{
  b.addEventListener('mouseenter',()=>{ b.style.transition='transform .1s linear'; });
  b.addEventListener('mousemove',e=>{
    const r=b.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)*.28;
    const y=(e.clientY-r.top-r.height/2)*.28;
    b.style.transform=`translate(${x}px,${y}px)`;
  });
  b.addEventListener('mouseleave',()=>{
    b.style.transition='transform .55s cubic-bezier(.23,1,.32,1)';
    b.style.transform='';
  });
});

/* ── PROGRESS ── */
const prog=document.getElementById('progress');
window.addEventListener('scroll',()=>{
  prog.style.width=(window.scrollY/(document.body.scrollHeight-innerHeight)*100)+'%';
},{passive:true});

/* ── NAV ── */
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>60),{passive:true});

/* ── SCROLL REVEAL ── */
const rvObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('vis'); rvObs.unobserve(e.target); } });
},{threshold:.08});
document.querySelectorAll('.rev,.sr').forEach(el=>rvObs.observe(el));

/* ── VAL ITEMS ── */
const valObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      const idx=[...document.querySelectorAll('.val-item')].indexOf(e.target);
      setTimeout(()=>e.target.classList.add('vis'),idx*120);
      valObs.unobserve(e.target);
    }
  });
},{threshold:.08});
document.querySelectorAll('.val-item').forEach(el=>valObs.observe(el));

/* ── COUNTER ── */
function countUp(el,to){
  let n=0; const inc=to/55;
  const t=setInterval(()=>{ n+=inc; if(n>=to){n=to;clearInterval(t);} el.textContent=Math.floor(n)+'+'; },16);
}
const sObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.stat-num').forEach(el=>countUp(el,+el.dataset.count));
      sObs.disconnect();
    }
  });
},{threshold:.5});
const hs=document.querySelector('.hero-stats');
if(hs) sObs.observe(hs);

/* ── PARALLAX HERO ── */
const hc=document.querySelector('.hero-content');
const hl=document.querySelector('.hero-lines');
window.addEventListener('scroll',()=>{
  const y=scrollY;
  if(hc){ hc.style.transform=`translateY(${y*.21}px)`; hc.style.opacity=Math.max(0,1-y/620); }
  if(hl) hl.style.transform=`translateY(${y*.07}px)`;
},{passive:true});

/* ── MARQUEE ── */
const mt=document.getElementById('mtrack');
if(mt){
  mt.addEventListener('mouseenter',()=>mt.style.animationPlayState='paused');
  mt.addEventListener('mouseleave',()=>mt.style.animationPlayState='running');
}

/* ── VIDEO GALLERY ── */
(function(){
  const items = document.querySelectorAll('.gal-item');
  const isMobile = () => window.innerWidth <= 900;

  function tryPlay(vid){
    vid.muted = true;
    vid.setAttribute('playsinline','');
    if (vid.readyState === 0) vid.load();
    const p = vid.play();
    if (p && p.catch) p.catch(() => {
      setTimeout(() => { vid.muted = true; vid.play().catch(()=>{}); }, 200);
    });
  }

  /* Desktop: mouseenter → play, mouseleave → pause */
  items.forEach(item => {
    const vid = item.querySelector('.gal-vid');
    if (!vid) return;

    item.addEventListener('mouseenter', () => {
      if (isMobile()) return;
      vid.currentTime = 0;
      tryPlay(vid);
    });
    item.addEventListener('mouseleave', () => {
      if (isMobile()) return;
      vid.pause();
      vid.currentTime = 0;
    });

    /* Clique → fullscreen */
    item.addEventListener('click', () => {
      if (document.fullscreenElement) return;
      const req = vid.requestFullscreen || vid.webkitRequestFullscreen || vid.webkitEnterFullscreen;
      if (req) req.call(vid);
    });
  });

  /* IntersectionObserver: play ao entrar na tela */
  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const vid = entry.target.querySelector('.gal-vid');
        if (!vid) return;
        if (entry.isIntersecting) {
          tryPlay(vid);
        } else if (!isMobile()) {
          /* Desktop: pausa ao sair da tela */
          vid.pause();
        }
        /* Mobile: não pausa — deixa em loop contínuo */
      });
    }, { threshold: 0.2 });
    items.forEach(item => obs.observe(item));
  }

  /* Mobile: desbloqueio no primeiro gesto do usuário
     (navegadores bloqueiam autoplay até a 1ª interação) */
  let unlocked = false;
  function unlockVideos(){
    if (unlocked || !isMobile()) return;
    unlocked = true;
    items.forEach(item => {
      const vid = item.querySelector('.gal-vid');
      if (vid) tryPlay(vid);
    });
  }
  document.addEventListener('touchstart', unlockVideos, { once:true, passive:true });
  document.addEventListener('scroll',     unlockVideos, { once:true, passive:true });
})();

/* ── FORM ── */
document.getElementById('cform').addEventListener('submit',function(e){
  e.preventDefault();

  const nome  = document.getElementById('f-nome').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const tel   = document.getElementById('f-tel').value.trim();
  const tipo  = document.getElementById('f-tipo').value;
  const msg   = document.getElementById('f-msg').value.trim();

  /* Remove erros anteriores */
  this.querySelectorAll('.fg').forEach(fg=>fg.classList.remove('fg-error'));

  /* Valida cada campo */
  let ok = true;
  function markError(id){
    const fg=document.getElementById(id).closest('.fg');
    fg.classList.remove('fg-error');
    void fg.offsetWidth;
    fg.classList.add('fg-error');
    ok=false;
  }
  if(!nome)  markError('f-nome');
  if(!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) markError('f-email');
  if(!tipo)  markError('f-tipo');
  if(!msg)   markError('f-msg');

  if(!ok) return;

  /* Estado de carregamento no botão */
  const btn = this.querySelector('.c-submit');
  const btnSpan = btn.querySelector('span');
  const originalText = btnSpan.textContent;
  btn.disabled = true;
  btnSpan.textContent = 'Enviando...';

  /* Envia via Formsubmit (AJAX — sem redirecionamento) */
  fetch('https://formsubmit.co/ajax/comercial@elionengenharia.com.br', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      Nome:            nome,
      Email:           email,
      Telefone:        tel || 'Não informado',
      'Tipo de Projeto': tipo,
      Mensagem:        msg,
      _subject:        '🏗️ Novo contato via site — Elion Engenharia',
      _template:       'table',
      _captcha:        'false'
    })
  })
  .then(r => r.json())
  .then(data => {
    if(data.success === 'true' || data.success === true){
      /* Sucesso */
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
      this.reset();
    } else {
      showErrorToast();
    }
  })
  .catch(() => showErrorToast())
  .finally(() => {
    btn.disabled = false;
    btnSpan.textContent = originalText;
  });

  function showErrorToast(){
    const toast = document.getElementById('toast');
    const prev = toast.textContent;
    toast.textContent = 'Erro ao enviar. Tente pelo WhatsApp ↙';
    toast.style.background = 'rgba(180,50,50,.95)';
    toast.style.color = '#fff';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => { toast.textContent = prev; toast.style.background = ''; toast.style.color = ''; }, 450);
    }, 4500);
  }
});

/* Remove classe de erro assim que o campo for editado */
['f-nome','f-email','f-tipo','f-msg'].forEach(id=>{
  const el=document.getElementById(id);
  if(!el) return;
  el.addEventListener('input',()=>el.closest('.fg').classList.remove('fg-error'));
  el.addEventListener('change',()=>el.closest('.fg').classList.remove('fg-error'));
});

/* ── HAMBURGER MOBILE ── */
(function(){
  const navEl=document.getElementById('nav');
  const ham=document.querySelector('.nav-ham');
  if(!ham) return;
  ham.addEventListener('click',()=>{
    const open=navEl.classList.toggle('nav-open');
    ham.setAttribute('aria-expanded',String(open));
  });
  // Fecha ao clicar fora
  document.addEventListener('click',e=>{
    if(!navEl.contains(e.target)){
      navEl.classList.remove('nav-open');
      ham.setAttribute('aria-expanded','false');
    }
  });
})();

/* ── SMOOTH ANCHORS ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const href=a.getAttribute('href');
    if(!href||href==='#') return;
    const t=document.querySelector(href);
    if(t){
      e.preventDefault();
      const navEl=document.getElementById('nav');
      const ham=document.querySelector('.nav-ham');
      navEl.classList.remove('nav-open');
      if(ham) ham.setAttribute('aria-expanded','false');
      const navH=navEl.offsetHeight;
      const top=t.getBoundingClientRect().top+window.scrollY-navH;
      window.scrollTo({top,behavior:'smooth'});
    }
  });
});

/* ── LIGHTBOX ── */
(function(){
  const projects=[
    {
      img:'images/img-port1.JPG', tag:'Comercial · São Paulo',
      name:'Torre Corporativa Sul', meta:'Engenharia de Alta Performance',
      desc:'Edifício corporativo de alto padrão com estrutura em concreto armado, fachada unitizada e sistemas prediais integrados. Execução completa desde a fundação até a entrega das áreas comuns e privativas.',
      specs:[{l:'Segmento',v:'Comercial'},{l:'Localização',v:'São Paulo — SP'},{l:'Escopo',v:'Execução completa'},{l:'Padrão',v:'Alto padrão'}]
    },
    {
      img:'images/img-port2.JPG', tag:'Infraestrutura · Industrial',
      name:'Complexo Logístico Norte', meta:'Eficiência Operacional',
      desc:'Complexo de armazenagem e distribuição com galpões industriais de grande porte, piso de alta resistência e infraestrutura completa para operação logística de alta performance.',
      specs:[{l:'Segmento',v:'Industrial'},{l:'Localização',v:'Grande São Paulo'},{l:'Escopo',v:'Infraestrutura'},{l:'Entrega',v:'No prazo'}]
    },
    {
      img:'images/img-port3.JPG', tag:'Residencial · Alto Padrão',
      name:'Residencial Horizonte', meta:'Inovação Aplicada',
      desc:'Empreendimento residencial de alto padrão com acabamentos de primeira linha e soluções arquitetônicas que unem design contemporâneo com funcionalidade e conforto.',
      specs:[{l:'Segmento',v:'Residencial'},{l:'Padrão',v:'Alto padrão'},{l:'Escopo',v:'Construção'},{l:'Estilo',v:'Contemporâneo'}]
    },
    {
      img:'images/img-port4.JPG', tag:'Institucional · Corporativo',
      name:'Hub Tecnológico Leste', meta:'Solução Inteligente',
      desc:'Edifício corporativo projetado para empresas de tecnologia, com infraestrutura de dados, energia redundante, espaços colaborativos e certificação sustentável.',
      specs:[{l:'Segmento',v:'Corporativo'},{l:'Localização',v:'Zona Leste — SP'},{l:'Diferencial',v:'Smart building'},{l:'Certificação',v:'Sustentável'}]
    }
  ];

  const lb=document.getElementById('lb');
  const img=document.getElementById('lb-img');
  const tag=document.getElementById('lb-tag');
  const name=document.getElementById('lb-name');
  const meta=document.getElementById('lb-meta');
  const desc=document.getElementById('lb-desc');
  const specs=document.getElementById('lb-specs');
  const ctr=document.getElementById('lb-counter');
  const cta=document.getElementById('lb-cta');
  let cur=0;

  function render(i,animate){
    const p=projects[i];
    if(animate){
      img.classList.add('fade');
      setTimeout(()=>{ img.src=p.img; img.alt=p.name; img.classList.remove('fade'); },280);
    } else { img.src=p.img; img.alt=p.name; }
    tag.textContent=p.tag; name.textContent=p.name; meta.textContent=p.meta; desc.textContent=p.desc;
    specs.innerHTML=p.specs.map(s=>`<div class="lb-spec"><div class="lb-spec-label">${s.l}</div><div class="lb-spec-val">${s.v}</div></div>`).join('');
    ctr.textContent=`${i+1} • ${projects.length}`;
    cur=i;
  }

  function open(i){ render(i,false); lb.classList.add('open'); document.body.style.overflow='hidden'; document.getElementById('lb-close').focus(); }
  function close(){ lb.classList.remove('open'); document.body.style.overflow=''; }
  function prev(){ render((cur-1+projects.length)%projects.length,true); }
  function next(){ render((cur+1)%projects.length,true); }

  /* Bind cards */
  document.querySelectorAll('.proj-card').forEach((card,i)=>{
    card.style.cursor='pointer';
    card.addEventListener('click',e=>{ e.preventDefault(); open(i); });
    const lk=card.querySelector('.proj-link');
    if(lk){ lk.setAttribute('href','javascript:void(0)'); lk.setAttribute('role','button'); }
  });

  document.getElementById('lb-close').addEventListener('click',close);
  document.getElementById('lb-bd').addEventListener('click',close);
  document.getElementById('lb-prev').addEventListener('click',e=>{ e.stopPropagation(); prev(); });
  document.getElementById('lb-next').addEventListener('click',e=>{ e.stopPropagation(); next(); });
  cta.addEventListener('click',e=>{ close(); });

  document.addEventListener('keydown',e=>{
    if(!lb.classList.contains('open')) return;
    if(e.key==='Escape') close();
    if(e.key==='ArrowLeft') prev();
    if(e.key==='ArrowRight') next();
  });

  /* Swipe mobile */
  let tx=0;
  lb.addEventListener('touchstart',e=>{ tx=e.touches[0].clientX; },{passive:true});
  lb.addEventListener('touchend',e=>{ const dx=e.changedTouches[0].clientX-tx; if(Math.abs(dx)>50){ dx<0?next():prev(); } },{passive:true});
})();