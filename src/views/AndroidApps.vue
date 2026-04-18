<template>
  <div class="android-apps-page">
    <div class="container">
      <!-- Hero Header -->
      <header>
        <h1>My Android Apps Portfolio</h1>
        <p>Innovative solutions for everyday needs</p>
        <div class="stats">
          <div class="stat-item">
            <span class="stat-number">{{ publishedAppsCount }}</span>
            <span class="stat-label">Published Apps</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{{ categoriesCount }}+</span>
            <span class="stat-label">Categories</span>
          </div>
        </div>
      </header>

      <!-- Search and Filter Bar -->
      <div class="filter-bar">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search apps by name or description..."
            class="search-input"
          />
        </div>
        <div class="category-filters">
          <button 
            v-for="cat in allCategories" 
            :key="cat"
            :class="['filter-chip', { active: selectedCategory === cat }]"
            @click="selectedCategory = selectedCategory === cat ? '' : cat"
          >
            {{ cat }}
          </button>
          <button 
            v-if="selectedCategory"
            class="filter-chip clear-btn"
            @click="selectedCategory = ''"
          >
            Clear All
          </button>
        </div>
      </div>

      <!-- Apps Grid -->
      <div class="apps-grid" v-if="filteredApps.length > 0">
        <AppCard
          v-for="app in filteredApps"
          :key="app.id"
          :app="app"
          @view-app="openPlayStore"
        />
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📱</div>
        <h3>No apps found</h3>
        <p>Try adjusting your search or filter criteria</p>
        <button class="reset-btn" @click="resetFilters">Reset Filters</button>
      </div>

      <!-- Footer -->
      <footer>
        <p>All apps are available on Google Play Store</p>
        <p class="copyright">© 2024 - Developed with passion for mobile innovation</p>
      </footer>
    </div>
  </div>
</template>

<script>
import AppCard from '../components/AppCard.vue';

export default {
  name: 'AndroidApps',
  components: {
    AppCard
  },
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      apps: [
        {
          id: 1,
          name: 'Pashto English Dictionary',
          icon: '📖',
          category: 'Education',
          description: 'A comprehensive dictionary app for seamless translation between Pashto and English languages, perfect for students and language learners.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.imrankhan.pahstoenglishdictionary.khan.khunduq.app.englistopashtodictionary'
        },
        {
          id: 2,
          name: 'CELC',
          icon: '🎓',
          category: 'Education',
          description: 'Change East Light Academy - Your gateway to learning and educational excellence with comprehensive course materials and resources.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lighteast.change.academy'
        },
        {
          id: 3,
          name: 'PashtOCR',
          icon: '🔍',
          category: 'Productivity',
          description: 'Advanced OCR technology for Pashto text recognition. Extract text from images and convert it to editable digital format instantly.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.smartechafghanistan.com.tesseractexample'
        },
        {
          id: 4,
          name: 'Mobile Checkout',
          icon: '📱',
          category: 'Tools',
          description: 'Complete mobile device testing solution. Check hardware, sensors, and performance to ensure your device is in perfect condition.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lightest.mobiletester'
        },
        {
          id: 5,
          name: 'Encrypting Keyboard',
          icon: '🔐',
          category: 'Security',
          description: 'Secure your messages with built-in encryption. Type confidently knowing your communications are protected with advanced encryption.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lightest.encryptingkeyboard'
        },
        {
          id: 6,
          name: 'AFG DNS Changer',
          icon: '🌐',
          category: 'Tools',
          description: 'Free and safe DNS changer for improved internet speed and privacy. Access blocked content and enhance your browsing experience.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lighteast.afdns'
        },
        {
          id: 7,
          name: 'Internet Speed',
          icon: '⚡',
          category: 'Tools',
          description: 'Fast and accurate internet speed test. Monitor your download and upload speeds in real-time with detailed analytics.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lightest.internetspeed'
        },
        {
          id: 8,
          name: 'Mini Browser',
          icon: '🌍',
          category: 'Tools',
          description: 'Lightweight and fast web browser with privacy features. Browse the internet securely with minimal resource usage.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lightest.veilbrowser'
        },
        {
          id: 9,
          name: 'AppShare',
          icon: '📤',
          category: 'Tools',
          description: 'Share apps instantly with nearby devices using WiFi Direct. Fast, easy, and no internet required for app sharing.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.khataab.smartechafghanistan.wifidirectappsharer2'
        },
        {
          id: 10,
          name: 'AfSport',
          icon: '⚽',
          category: 'Sports',
          description: 'Stay updated with the latest sports news, scores, and highlights. Your complete sports companion for Afghan sports enthusiasts.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lightest.afsport'
        },
        {
          id: 11,
          name: 'MyContacts',
          icon: '📞',
          category: 'Productivity',
          description: 'Smart contact management with backup and restore features. Organize, search, and manage your contacts efficiently.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.smartechafghanistan.khataaab.mycontacts3'
        },
        {
          id: 12,
          name: 'Awesome Text',
          icon: '✨',
          category: 'Entertainment',
          description: 'Create stylish text with unique fonts and symbols. Make your messages stand out with creative text formatting options.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lightest.awesometext'
        },
        {
          id: 13,
          name: 'Count Down',
          icon: '⏰',
          category: 'Productivity',
          description: 'Track important events and deadlines with beautiful countdown timers. Never miss a special moment or important date again.',
          playStoreUrl: 'https://play.google.com/store/apps/details?id=com.lightest.countdown'
        }
      ]
    }
  },
  computed: {
    publishedAppsCount() {
      return this.apps.length
    },
    categoriesCount() {
      const uniqueCategories = new Set(this.apps.map(app => app.category))
      return uniqueCategories.size
    },
    allCategories() {
      const categories = [...new Set(this.apps.map(app => app.category))]
      return categories.sort()
    },
    filteredApps() {
      let result = this.apps
      
      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase().trim()
        result = result.filter(app => 
          app.name.toLowerCase().includes(query) || 
          app.description.toLowerCase().includes(query)
        )
      }
      
      // Filter by category
      if (this.selectedCategory) {
        result = result.filter(app => app.category === this.selectedCategory)
      }
      
      return result
    }
  },
  methods: {
    openPlayStore(url) {
      window.open(url, '_blank')
    },
    resetFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
    }
  }
}
</script>

<style scoped>
.android-apps-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header Styles */
header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  padding: 40px 20px;
}

header h1 {
  font-size: 3em;
  margin-bottom: 10px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

header p {
  font-size: 1.2em;
  opacity: 0.95;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 2.5em;
  font-weight: bold;
  display: block;
}

.stat-label {
  font-size: 0.9em;
  opacity: 0.9;
}

/* Filter Bar */
.filter-bar {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 30px;
}

.search-box {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: #cbd5e1;
}

.search-input {
  width: 100%;
  padding: 14px 20px 14px 45px;
  border: none;
  border-radius: 50px;
  background: white;
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s;
}

.search-input:focus {
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.5);
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  padding: 8px 18px;
  border-radius: 50px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.filter-chip.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.filter-chip.clear-btn {
  background: #ef4444;
}

.filter-chip.clear-btn:hover {
  background: #dc2626;
}

/* Apps Grid */
.apps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  margin-bottom: 50px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  margin: 40px 0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: white;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.empty-state p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 20px;
}

.reset-btn {
  background: white;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  color: #667eea;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.reset-btn:hover {
  transform: translateY(-2px);
}

/* Footer */
footer {
  text-align: center;
  color: white;
  padding: 30px;
  font-size: 0.95em;
}

.copyright {
  margin-top: 10px;
  opacity: 0.8;
}

/* Responsive */
@media (max-width: 768px) {
  header h1 {
    font-size: 2em;
  }
  
  .stats {
    gap: 20px;
  }
  
  .stat-number {
    font-size: 2em;
  }
  
  .apps-grid {
    grid-template-columns: 1fr;
  }
  
  .category-filters {
    justify-content: center;
  }
}
</style>