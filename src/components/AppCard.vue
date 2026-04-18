<!-- AppCard.vue -->
<template>
  <div class="app-card" @click="$emit('view-app', app.playStoreUrl)">
    <div class="app-header">
      <div class="app-icon">{{ app.icon }}</div>
      <div class="app-title">
        <h3>{{ app.name }}</h3>
        <div class="app-category">{{ app.category }}</div>
      </div>
    </div>
    <p class="app-description">{{ app.description }}</p>
    <div class="app-link">
      <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
      </svg>
      View on Play Store
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppCard',
  props: {
    app: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.app-card {
  background: white;
  border-radius: 15px;
  padding: 25px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.app-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
}

.app-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 15px;
}

.app-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5em;
  font-weight: bold;
  flex-shrink: 0;
}

.app-title {
  flex: 1;
}

.app-title h3 {
  color: #333;
  font-size: 1.3em;
  margin-bottom: 5px;
}

.app-category {
  color: #666;
  font-size: 0.85em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.app-description {
  color: #555;
  line-height: 1.6;
  margin-bottom: 20px;
  flex-grow: 1;
}

.app-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  align-self: flex-start;
  pointer-events: none; /* Parent handles click */
}

.play-icon {
  width: 20px;
  height: 20px;
}

/* Hover effect on card triggers link animation */
.app-card:hover .app-link {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}
</style>