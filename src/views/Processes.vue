<script></script>
<template>
    <section id="process">
  <div class="section-inner">
    <div class="process-header">
      <div class="section-label">How We Work</div>
      <h2>From Idea to Launch</h2>
      <p class="section-sub">A clear, collaborative process with no surprises at any stage.</p>
    </div>
    <div class="process-steps">
      <div class="step">
        <div class="step-circle">01</div>
        <h4>Discovery</h4>
        <p>We learn your goals, audience, and constraints in a deep-dive kick-off session.</p>
      </div>
      <div class="step">
        <div class="step-circle">02</div>
        <h4>Design & Plan</h4>
        <p>Wireframes, architecture diagrams, and a full project roadmap before a single line of code.</p>
      </div>
      <div class="step">
        <div class="step-circle">03</div>
        <h4>Build & Iterate</h4>
        <p>Agile sprints with regular demos. You see real progress every two weeks.</p>
      </div>
      <div class="step">
        <div class="step-circle">04</div>
        <h4>Launch & Support</h4>
        <p>Smooth deployment, handover docs, and ongoing support so you're never left stranded.</p>
      </div>
    </div>
  </div>
</section>

</template>
<style>
 #process { background: var(--surface-2); }
  .process-header { text-align: center; margin-bottom: 64px; }
  .process-header .section-sub { margin: 0 auto; }
  .process-steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; position: relative; }
  .process-steps::before {
    content: ''; position: absolute;
    top: 36px; left: 12.5%; right: 12.5%; height: 1px;
    background: linear-gradient(90deg, var(--accent) 0%, var(--surface-3) 100%);
  }
  .step { text-align: center; padding: 0 16px; }
  .step-circle {
    width: 72px; height: 72px; border-radius: 50%;
    border: 2px solid var(--surface-3);
    background: var(--surface);
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px; position: relative; z-index: 1;
    font-family: var(--font-head); font-size: 20px; font-weight: 800;
    color: var(--accent); transition: background .3s, color .3s, border-color .3s;
  }
  .step:first-child .step-circle { background: var(--accent); color: #fff; border-color: var(--accent); }
  .step h4 { font-family: var(--font-head); font-size: 16px; font-weight: 700; margin-bottom: 8px; }
  .step p { font-size: 13px; color: var(--ink-muted); line-height: 1.6; }

</style>