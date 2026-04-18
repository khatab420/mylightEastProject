<!-- ServiceCard.vue -->
<template>
  <div class="service-card" @click="$emit('select', service)">
    <div class="card-icon" :style="{ background: `linear-gradient(135deg, ${service.color}20, ${service.color}10)` }">
      <span class="icon-large">{{ service.icon }}</span>
    </div>
    <h3 class="card-title">{{ service.name }}</h3>
    <p class="card-description">{{ truncateDescription(service.description, 70) }}</p>
    <div class="card-footer">
      <span class="category-badge">{{ service.category }}</span>
      <span class="launch-link">
        Try now
        <span class="link-arrow">→</span>
      </span>
    </div>
    <div class="card-hover-effect"></div>
  </div>
</template>

<script>
export default {
  name: 'ServiceCard',
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  methods: {
    truncateDescription(text, maxLength) {
      if (text.length <= maxLength) return text
      return text.substring(0, maxLength) + '...'
    }
  }
}
</script>

<style scoped>
.service-card {
  background: white;
  border-radius: 24px;
  padding: 28px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.service-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -12px rgba(0, 0, 0, 0.15);
}

.card-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.service-card:hover .card-icon {
  transform: scale(1.05);
}

.icon-large {
  font-size: 2rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.card-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 20px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.category-badge {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
  background: #f1f5f9;
  padding: 4px 10px;
  border-radius: 20px;
  color: #475569;
}

.launch-link {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4f46e5;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.2s;
}

.link-arrow {
  transition: transform 0.2s;
}

.service-card:hover .link-arrow {
  transform: translateX(4px);
}

.card-hover-effect {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.service-card:hover .card-hover-effect {
  transform: scaleX(1);
}
</style>