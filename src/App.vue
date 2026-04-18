<script setup>
import navbar from './components/navbar.vue';
import Footer from './components/Footer.vue';
import './assets/main.css' // ✅ ADD THIS
import AdSense from './components/AdSense.vue'
</script>

<template>
  <navbar/>
  <main class="main-content">
    <router-view />
  </main>
  <AdSense/>
  <Footer/>
</template>

<style>


</style>
