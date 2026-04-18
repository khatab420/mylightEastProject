<script>

</script>
<template>
<section id="services">
  <div class="section-inner">
    <div class="services-header">
      <div>
        <div class="section-label">What We Do</div>
        <h2>End-to-End Digital<br />Services</h2>
      </div>
      <p class="section-sub">From concept to deployment, we handle every layer of your digital product.</p>
    </div>
    <div class="services-grid">
      <div class="service-card">
        <div class="service-icon">💻</div>
        <h3>Software Development</h3>
        <p>Custom enterprise software built with robust architectures. We design scalable systems that power your core business operations.</p>
        <a href="#contact" class="learn">Learn more →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">🗄️</div>
        <h3>Database Development</h3>
        <p>High-performance database design, optimization, and management. SQL, NoSQL, and cloud-native data solutions tailored to your scale.</p>
        <a href="#contact" class="learn">Learn more →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">📱</div>
        <h3>Mobile Apps</h3>
        <p>Native and cross-platform mobile applications for iOS and Android. Beautiful interfaces backed by powerful, reliable code.</p>
        <a href="#contact" class="learn">Learn more →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">🌐</div>
        <h3>Website Development</h3>
        <p>High-converting, performance-optimized websites. From landing pages to full e-commerce platforms, built for speed and SEO.</p>
        <a href="#contact" class="learn">Learn more →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">☁️</div>
        <h3>Cloud & DevOps</h3>
        <p>Infrastructure setup, CI/CD pipelines, and cloud migration. We keep your systems reliable, secure, and always available.</p>
        <a href="#contact" class="learn">Learn more →</a>
      </div>
      <div class="service-card">
        <div class="service-icon">🔒</div>
        <h3>IT Consulting</h3>
        <p>Strategic technology guidance to help you make the right decisions — architecture reviews, tech audits, and roadmap planning.</p>
        <a href="#contact" class="learn">Learn more →</a>
      </div>
    </div>
  </div>
</section>

</template>
<style>
  #services { background: var(--surface-2); }
  .services-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 60px; flex-wrap: wrap; gap: 24px; }
  .services-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .service-card {
    background: var(--surface); border-radius: var(--radius);
    padding: 36px 32px;
    border: 1px solid var(--surface-3);
    transition: transform .25s, box-shadow .25s, border-color .25s;
    position: relative; overflow: hidden;
  }
  .service-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--accent); transform: scaleX(0); transform-origin: left;
    transition: transform .3s;
  }
  .service-card:hover { transform: translateY(-6px); box-shadow: 0 16px 40px rgba(0,0,0,0.1); border-color: transparent; }
  .service-card:hover::before { transform: scaleX(1); }
  .service-icon {
    width: 52px; height: 52px; border-radius: 12px;
    background: var(--accent-glow);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin-bottom: 22px;
  }
  .service-card h3 {
    font-family: var(--font-head); font-size: 19px; font-weight: 700;
    margin-bottom: 12px; letter-spacing: -.4px;
  }
  .service-card p { font-size: 14px; color: var(--ink-muted); line-height: 1.7; }
  .service-card .learn { display: inline-flex; align-items: center; gap: 6px; margin-top: 18px; font-size: 13px; font-weight: 500; color: var(--accent); text-decoration: none; transition: gap .2s; }
  .service-card .learn:hover { gap: 10px; }

</style>