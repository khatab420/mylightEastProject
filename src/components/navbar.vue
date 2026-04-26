<script>

</script>

<template>
<nav>
  <div class="nav-inner">
    <a href="#" class="logo">
      <span class="logo-dot"></span>Lighteast
    </a>
   <ul class="nav-links">
  <li><router-link to="/services">Services</router-link></li>
  <li><router-link to="/about">About</router-link></li>
  <li><router-link to="/processes">Process</router-link></li>
  <li><router-link to="/clients">Clients</router-link></li>
  <li><router-link to="/contact">Contact</router-link></li>
  <li><router-link to="/freeservices"> Free Services </router-link></li>
</ul>

    <a href="#contact" class="nav-cta">Get a Quote</a>
  </div>
</nav>
</template>

<style>
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: var(--nav-h);
    display: flex; align-items: center;
    padding: 0 5%;
    background: rgba(255,255,255,0.88);
    backdrop-filter: blur(14px);
    border-bottom: 1px solid rgba(0,0,0,0.07);
  }
  .nav-inner {
    width: 100%; max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
  }
  .logo {
    font-family: var(--font-head);
    font-size: 22px; font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--ink); text-decoration: none;
    display: flex; align-items: center; gap: 8px;
  }
  .logo-dot {
    width: 9px; height: 9px; border-radius: 50%;
    background: var(--accent);
    display: inline-block;
  }
  .nav-links {
    display: flex; align-items: center; gap: 36px;
    list-style: none;
  }
  .nav-links a {
    font-size: 14px; font-weight: 500; color: var(--ink-muted);
    text-decoration: none; transition: color .2s;
  }
  .nav-links a:hover { color: var(--ink); }
  .nav-cta {
    background: var(--ink); color: #fff;
    padding: 10px 22px; border-radius: 40px;
    font-size: 14px; font-weight: 500;
    text-decoration: none; transition: background .2s, transform .15s;
  }
  .nav-cta:hover { background: var(--accent); transform: translateY(-1px); }

</style>
