<script></script>
<template>
<section id="testimonials">
  <div class="section-inner">
    <div class="testi-header">
      <div>
        <div class="section-label">Client Stories</div>
        <h2>What Our Clients Say</h2>
      </div>
    </div>
    <div class="testi-grid">
      <div class="testi-card">
        <div class="stars">★★★★★</div>
        <p>"Lighteast rebuilt our entire operations platform in under 4 months. The team was professional, communicative, and the result exceeded every expectation."</p>
        <div class="testi-author">
          <div class="avatar" style="background:#dde8fd;color:#1a56e8;">AK</div>
          <div>
            <strong>Ahmed Khalil</strong>
            <small>CTO, Novatel Group</small>
          </div>
        </div>
      </div>
      <div class="testi-card featured">
        <div class="stars">★★★★★</div>
        <p>"Our mobile app launched on time and on budget — something I'd never experienced before. The UX is flawless and users love it."</p>
        <div class="testi-author">
          <div class="avatar" style="background:rgba(255,255,255,.12);color:#fff;">SR</div>
          <div>
            <strong>Sara Rafiq</strong>
            <small>CEO, Orbiq Solutions</small>
          </div>
        </div>
      </div>
      <div class="testi-card">
        <div class="stars">★★★★★</div>
        <p>"We came with a complex database problem that had stumped two other agencies. Lighteast solved it cleanly in three weeks. Incredible expertise."</p>
        <div class="testi-author">
          <div class="avatar" style="background:#fef3e2;color:#e8a020;">MN</div>
          <div>
            <strong>Mohamed Nasser</strong>
            <small>Head of Engineering, Vextron</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
</template>
<style>
 #testimonials { background: var(--surface); }
  .testi-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 52px; flex-wrap: wrap; gap: 20px; }
  .testi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .testi-card {
    background: var(--surface-2); border-radius: var(--radius); padding: 32px;
    border: 1px solid var(--surface-3);
  }
  .testi-card.featured { background: var(--ink); border-color: var(--ink); }
  .stars { color: var(--gold); font-size: 14px; letter-spacing: 2px; margin-bottom: 18px; }
  .testi-card p { font-size: 15px; line-height: 1.75; color: var(--ink-muted); margin-bottom: 24px; }
  .testi-card.featured p { color: rgba(255,255,255,.7); }
  .testi-author { display: flex; align-items: center; gap: 12px; }
  .avatar {
    width: 42px; height: 42px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-head); font-size: 14px; font-weight: 700;
    flex-shrink: 0;
  }
  .testi-author strong { display: block; font-size: 14px; font-weight: 600; color: var(--ink); }
  .testi-card.featured .testi-author strong { color: #fff; }
  .testi-author small { font-size: 12px; color: var(--ink-faint); }
  .testi-card.featured .testi-author small { color: rgba(255,255,255,.45); }

</style>