<script></script>
<template>
<section id="why">
  <div class="section-inner">
    <div class="why-grid">
      <div class="why-visual">
        <h3>Why clients choose Lighteast</h3>
        <div class="why-item">
          <div class="why-check">✓</div>
          <div>
            <strong>Deadline-driven teams</strong>
            <p>We deliver on time, every time. Our project management keeps timelines tight without sacrificing quality.</p>
          </div>
        </div>
        <div class="why-item">
          <div class="why-check">✓</div>
          <div>
            <strong>Full transparency</strong>
            <p>Weekly progress reports, live staging environments, and direct access to your developers.</p>
          </div>
        </div>
        <div class="why-item">
          <div class="why-check">✓</div>
          <div>
            <strong>Long-term partnership</strong>
            <p>We don't disappear after launch. Post-delivery support, updates, and scaling are all part of the relationship.</p>
          </div>
        </div>
        <div class="why-item">
          <div class="why-check">✓</div>
          <div>
            <strong>Modern tech stack</strong>
            <p>We use proven, future-proof technologies — no legacy baggage slowing your product down.</p>
          </div>
        </div>
      </div>
      <div>
        <div class="section-label">Our Strengths</div>
        <h2>Built on Trust,<br />Driven by Results</h2>
        <p class="section-sub" style="margin-bottom: 40px;">We're not just a vendor — we're a technology partner invested in your long-term success.</p>
        <ul class="why-list">
          <li>
            <span class="why-num">01</span>
            <div>
              <h4>Agile Development</h4>
              <p>Iterative sprints with constant client feedback loops ensure the final product matches your vision exactly.</p>
            </div>
          </li>
          <li>
            <span class="why-num">02</span>
            <div>
              <h4>Senior-Led Teams</h4>
              <p>Every project is led by an experienced architect — no juniors learning on your budget.</p>
            </div>
          </li>
          <li>
            <span class="why-num">03</span>
            <div>
              <h4>Security First</h4>
              <p>Security is baked in from day one, not bolted on at the end. OWASP standards on every project.</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</section>

</template>
<style>
  #why { background: var(--surface); }
  .why-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .why-visual {
    background: var(--ink);
    border-radius: 24px; padding: 40px;
    color: #fff; position: relative; overflow: hidden;
  }
  .why-visual::after {
    content: ''; position: absolute;
    right: -40px; bottom: -40px;
    width: 200px; height: 200px; border-radius: 50%;
    background: radial-gradient(circle, rgba(26,86,232,.6) 0%, transparent 70%);
  }
  .why-visual h3 { font-family: var(--font-head); font-size: 22px; font-weight: 700; margin-bottom: 28px; }
  .why-item { display: flex; gap: 16px; margin-bottom: 22px; position: relative; z-index: 1; }
  .why-check { width: 24px; height: 24px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; font-size: 12px; }
  .why-item p { font-size: 14px; color: rgba(255,255,255,.75); line-height: 1.6; }
  .why-item strong { color: #fff; display: block; font-size: 15px; margin-bottom: 4px; }
  .why-list { list-style: none; display: flex; flex-direction: column; gap: 24px; }
  .why-list li { display: flex; gap: 16px; align-items: flex-start; }
  .why-num { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--accent); min-width: 28px; padding-top: 2px; }
  .why-list h4 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
  .why-list p { font-size: 14px; color: var(--ink-muted); line-height: 1.65; }

</style>