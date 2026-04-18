<script></script>
<template>

    <section id="contact">
  <div class="section-inner">
    <div class="contact-grid">
      <div class="contact-info">
        <div class="section-label">Get In Touch</div>
        <h2>Ready to Build Something Great?</h2>
        <p>Tell us about your project and we'll get back to you within 24 hours with a clear proposal.</p>
        <div class="contact-detail">
          <div class="c-item">
            <div class="c-icon">📧</div>
            <div>
              <strong>Email</strong>
              <span>esmatullahsangary@gamil.com</span>
            </div>
          </div>
          <div class="c-item">
            <div class="c-icon">📞</div>
            <div>
              <strong>Phone</strong>
              <span>+93 (077) 4157-887</span>
            </div>
          </div>
          <div class="c-item">
            <div class="c-icon">📍</div>
            <div>
              <strong>Location</strong>
              <span>Available Worldwide · Remote-First</span>
            </div>
          </div>
        </div>
      </div>
      <form class="contact-form" onsubmit="return false;">
        <div class="form-row">
          <div class="form-group">
            <label>First Name</label>
            <input type="text" placeholder="John" />
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input type="text" placeholder="Smith" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@company.com" />
          </div>
          <div class="form-group">
            <label>Phone (optional)</label>
            <input type="tel" placeholder="+1 000 000 0000" />
          </div>
        </div>
        <div class="form-group">
          <label>Service Needed</label>
          <select>
            <option value="">Select a service...</option>
            <option>Software Development</option>
            <option>Database Development</option>
            <option>Mobile App Development</option>
            <option>Website Development</option>
            <option>Cloud & DevOps</option>
            <option>IT Consulting</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <label>Project Details</label>
          <textarea placeholder="Tell us about your project, timeline, and budget range..."></textarea>
        </div>
        <button type="submit" class="btn-submit">Send Message →</button>
      </form>
    </div>
  </div>
</section>

</template>
<style>
 #contact { background: var(--surface-2); }
  .contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 80px; align-items: start; }
  .contact-info h2 { margin-bottom: 16px; }
  .contact-info p { color: var(--ink-muted); font-size: 16px; line-height: 1.7; margin-bottom: 36px; }
  .contact-detail { display: flex; flex-direction: column; gap: 20px; }
  .c-item { display: flex; gap: 14px; align-items: flex-start; }
  .c-icon { width: 42px; height: 42px; border-radius: 10px; background: var(--accent-glow); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 18px; }
  .c-item strong { font-size: 13px; color: var(--ink-faint); display: block; margin-bottom: 2px; }
  .c-item span { font-size: 15px; font-weight: 500; color: var(--ink); }

  /* form */
  .contact-form { display: flex; flex-direction: column; gap: 18px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
  .form-group { display: flex; flex-direction: column; gap: 8px; }
  .form-group label { font-size: 13px; font-weight: 500; color: var(--ink-muted); }
  .form-group input, .form-group select, .form-group textarea {
    padding: 12px 16px; border: 1.5px solid var(--surface-3);
    border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 15px;
    color: var(--ink); background: var(--surface); outline: none;
    transition: border-color .2s, box-shadow .2s;
    resize: vertical;
  }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px rgba(26,86,232,0.12);
  }
  .form-group textarea { min-height: 120px; }
  .btn-submit {
    background: var(--accent); color: #fff;
    border: none; cursor: pointer;
    padding: 15px 36px; border-radius: 40px;
    font-family: var(--font-body); font-size: 15px; font-weight: 500;
    align-self: flex-start; transition: background .2s, transform .15s;
  }
  .btn-submit:hover { background: var(--accent-2); transform: translateY(-2px); }

</style>