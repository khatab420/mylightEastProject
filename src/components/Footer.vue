<script></script>
<template>
<footer>
  <div class="footer-inner">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="#" class="logo"><span class="logo-dot"></span>Lighteast</a>
        <p>We build digital products that power modern businesses — from startups to enterprises.</p>
      </div>
      <div>
        <h4>Services</h4>
        <ul class="footer-links">
          <li><a href="#">Software Development</a></li>
          <li><a href="#">Database Development</a></li>
          <li><a href="#">Mobile Apps</a></li>
          <li><a href="#">Website Development</a></li>
          <li><a href="#">Cloud & DevOps</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul class="footer-links">
          <li><a href="#">About Us</a></li>
          <li><a href="#">Our Team</a></li>
          <li><a href="#">Careers</a></li>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Case Studies</a></li>
        </ul>
      </div>
      <div>
        <h4>Legal</h4>
        <ul class="footer-links">
          <li><a href="#">Privacy Policy</a></li>
          <li><a href="#">Terms of Service</a></li>
          <li><a href="#">Cookie Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2025 Lighteast. All rights reserved.</p>
      <div class="footer-socials">
        <a href="#" class="social-btn">in</a>
        <a href="#" class="social-btn">𝕏</a>
        <a href="#" class="social-btn">gh</a>
      </div>
    </div>
  </div>
</footer>


</template>
<style>
  footer { background: var(--ink); color: rgba(255,255,255,.6); padding: 60px 5% 30px; }
  .footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px; margin-bottom: 52px; }
  .footer-brand .logo { color: #fff; margin-bottom: 16px; display: inline-flex; }
  .footer-brand p { font-size: 14px; line-height: 1.7; max-width: 260px; }
  footer h4 { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: #fff; margin-bottom: 18px; }
  .footer-links { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .footer-links a { font-size: 14px; color: rgba(255,255,255,.55); text-decoration: none; transition: color .2s; }
  .footer-links a:hover { color: #fff; }
  .footer-bottom { border-top: 1px solid rgba(255,255,255,.1); padding-top: 24px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
  .footer-bottom p { font-size: 13px; }
  .footer-socials { display: flex; gap: 12px; }
  .social-btn { width: 36px; height: 36px; border-radius: 8px; background: rgba(255,255,255,.08); display: flex; align-items: center; justify-content: center; font-size: 14px; text-decoration: none; color: rgba(255,255,255,.6); transition: background .2s, color .2s; }
  .social-btn:hover { background: var(--accent); color: #fff; }

</style>