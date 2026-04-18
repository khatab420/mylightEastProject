<script>

</script>

<template>
  
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-grid"></div>
  <div class="hero-inner">
    <div class="hero-text">
      <div class="hero-tag">
        <span class="hero-tag-dot"></span>
        Software & Digital Solutions
      </div>
      <h1>We Build<br /><em>Digital Products</em><br />That Scale</h1>
      <p class="hero-desc">
        Lighteast delivers enterprise-grade software, mobile apps, and web platforms — engineered with precision, designed for growth.
      </p>
      <div class="hero-actions">
        <a href="#services" class="btn-primary">Explore Our Services</a>
        <a href="#contact" class="btn-ghost">Start a Project <span class="btn-ghost-arrow">→</span></a>
      </div>
    </div>
    <div class="hero-visual">
      <div class="stat-grid">
        <div class="stat-card">
          <div class="num">120<span>+</span></div>
          <div class="label">Projects Delivered</div>
        </div>
        <div class="stat-card">
          <div class="num">98<span>%</span></div>
          <div class="label">Client Satisfaction</div>
        </div>
      </div>
      <div class="tech-badge">
        <div class="tech-icon" style="background:#e8f0fe;">💻</div>
        <div>
          <p>Full-Stack Development</p>
          <small>Web · Mobile · Cloud</small>
        </div>
      </div>
      <div class="tech-badge">
        <div class="tech-icon" style="background:#fef3e2;">🗄️</div>
        <div>
          <p>Database Architecture</p>
          <small>SQL · NoSQL · Distributed</small>
        </div>
      </div>
    </div>
  </div>
  </section>
   <div class="clients-strip">
  <div class="clients-inner">
    <span class="clients-label">Trusted by</span>
    <div class="clients-logos">
      <span class="client-logo">Novatel</span>
      <span class="client-logo">Orbiq</span>
      <span class="client-logo">Vextron</span>
      <span class="client-logo">Synapse</span>
      <span class="client-logo">Prismatech</span>
    </div>
  </div>
</div>
  


</template>

<style>

  .hero {
    min-height: 100vh;
    display: flex; align-items: center;
    padding: calc(var(--nav-h) + 60px) 5% 80px;
    position: relative; overflow: hidden;
    background: var(--surface);
  }
  .hero-bg {
    position: absolute; inset: 0; z-index: 0;
    background: radial-gradient(ellipse 70% 60% at 70% 50%, #dde8fd 0%, transparent 70%),
                radial-gradient(ellipse 40% 40% at 20% 80%, #f0e8fd 0%, transparent 60%);
  }
  .hero-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
                      linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }
  .hero-inner {
    position: relative; z-index: 1;
    max-width: 1200px; margin: 0 auto; width: 100%;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
  }
  .hero-tag {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent-glow); color: var(--accent);
    font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase;
    padding: 6px 14px; border-radius: 40px;
    border: 1px solid rgba(26,86,232,0.2);
    margin-bottom: 24px;
  }
  .hero-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

  h1 {
    font-family: var(--font-head);
    font-size: clamp(38px, 5vw, 64px);
    font-weight: 800; line-height: 1.1;
    letter-spacing: -2px; color: var(--ink);
    margin-bottom: 24px;
  }
  h1 em { font-style: normal; color: var(--accent); }
  .hero-desc {
    font-size: 17px; color: var(--ink-muted);
    line-height: 1.7; max-width: 480px; margin-bottom: 40px;
  }
  .hero-actions { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; }
  .btn-primary {
    background: var(--accent); color: #fff;
    padding: 14px 32px; border-radius: 40px;
    font-size: 15px; font-weight: 500;
    text-decoration: none; transition: background .2s, transform .15s, box-shadow .2s;
    box-shadow: 0 4px 20px rgba(26,86,232,.3);
  }
  .btn-primary:hover { background: var(--accent-2); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(26,86,232,.4); }
  .btn-ghost {
    color: var(--ink); font-size: 15px; font-weight: 500;
    text-decoration: none; display: flex; align-items: center; gap: 8px;
    transition: gap .2s;
  }
  .btn-ghost:hover { gap: 14px; }
  .btn-ghost-arrow { font-size: 18px; }

  /* hero card stack */
  .hero-visual {
    display: grid; gap: 16px;
    animation: floatIn .8s ease both; animation-delay: .3s;
  }
  @keyframes floatIn { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: var(--radius); padding: 22px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }
  .stat-card .num {
    font-family: var(--font-head); font-size: 36px; font-weight: 800;
    color: var(--ink); line-height: 1;
  }
  .stat-card .num span { color: var(--accent); }
  .stat-card .label { font-size: 13px; color: var(--ink-muted); margin-top: 6px; }
  .tech-badge {
    background: var(--surface);
    border: 1px solid var(--surface-3);
    border-radius: var(--radius); padding: 18px 22px;
    display: flex; align-items: center; gap: 14px;
    box-shadow: 0 2px 20px rgba(0,0,0,0.06);
  }
  .tech-icon {
    width: 44px; height: 44px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; flex-shrink: 0;
  }
  .tech-badge p { font-size: 13px; font-weight: 500; color: var(--ink); margin: 0; }
  .tech-badge small { font-size: 12px; color: var(--ink-faint); }

  /* hero fade-in text */
  .hero-text { animation: floatIn .8s ease both; animation-delay: .1s; }
 .clients-strip { padding: 48px 5%; background: var(--surface); border-top: 1px solid var(--surface-3); border-bottom: 1px solid var(--surface-3); }
  .clients-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; gap: 52px; flex-wrap: wrap; }
  .clients-label { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-faint); white-space: nowrap; }
  .clients-logos { display: flex; gap: 40px; align-items: center; flex-wrap: wrap; }
  .client-logo { font-family: var(--font-head); font-size: 18px; font-weight: 800; color: var(--surface-3); letter-spacing: -0.5px; transition: color .25s; cursor: default; }
  .client-logo:hover { color: var(--ink-faint); }

</style>