<template>
  <div class="free-services-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Free Tools & Services</h1>
        <p class="hero-subtitle">
          Professional online tools to boost your productivity — no signup, no hidden fees
        </p>
      </div>
    </section>

    <!-- Services Grid -->
    <section class="services-section">
      <div class="container">
        <div class="section-header">
          <h2>Explore Our Tools</h2>
          <p>Click on any service card to start using it instantly</p>
        </div>
        
        <!-- Enhanced Search Section -->
        <div class="search-section">
          <div class="search-box-wrapper">
            <div class="search-input-container">
              <span class="search-icon">🔍</span>
              <input
                v-model="searchQuery"
                @input="handleSearchInput"
                @focus="showAutocomplete = true"
                @blur="handleBlur"
                type="text"
                placeholder="Search tools... (try 'jsn' for JSON)"
                class="search-input"
              />
              <button v-if="searchQuery" @click="clearSearch" class="clear-search">✕</button>
            </div>
            
            <!-- Autocomplete Dropdown -->
            <div v-if="showAutocomplete && autocompleteResults.length > 0" class="autocomplete-dropdown">
              <div
                v-for="(result, index) in autocompleteResults"
                :key="result.id"
                @mousedown="selectAutocomplete(result)"
                class="autocomplete-item"
                :class="{ 'selected': selectedAutocompleteIndex === index }"
              >
                <span class="autocomplete-icon">{{ result.icon }}</span>
                <div class="autocomplete-content">
                  <div class="autocomplete-name">
                    {{ highlightMatch(result.name, searchQuery) }}
                    <span class="autocomplete-category">{{ result.category }}</span>
                  </div>
                  <div class="autocomplete-description">{{ truncate(result.description, 60) }}</div>
                </div>
                <span class="autocomplete-score">⭐ {{ result.searchScore }}</span>
              </div>
            </div>
          </div>
          
          <!-- Category Filters -->
          <div class="category-filters">
            <button
              @click="selectedCategory = 'all'"
              class="category-chip"
              :class="{ active: selectedCategory === 'all' }"
            >
              All
            </button>
            <button
              v-for="category in categories"
              :key="category"
              @click="selectedCategory = category"
              class="category-chip"
              :class="{ active: selectedCategory === category }"
            >
              {{ category }}
            </button>
          </div>
          
          <!-- Search Stats -->
          <div v-if="searchQuery && filteredServices.length > 0" class="search-stats">
            Found {{ filteredServices.length }} tool{{ filteredServices.length !== 1 ? 's' : '' }}
            <span v-if="searchQuery">for "{{ searchQuery }}"</span>
          </div>
        </div>

        <div class="services-grid">
          <ServiceCard
            v-for="service in paginatedServices"
            :key="service.id"
            :service="service"
            @select="openServiceModal"
          />
        </div>
        
        <div v-if="filteredServices.length === 0" class="no-results">
          <span class="no-results-icon">🔍</span>
          <h3>No tools found</h3>
          <p>Try different keywords or browse all tools</p>
          <button @click="clearAllFilters" class="clear-filters-btn">Clear filters</button>
        </div>
        
        <!-- Pagination -->
        <div v-if="filteredServices.length > itemsPerPage" class="pagination">
          <button @click="currentPage--" :disabled="currentPage === 1" class="page-btn">
            ← Previous
          </button>
          <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="currentPage++" :disabled="currentPage === totalPages" class="page-btn">
            Next →
          </button>
        </div>
      </div>
    </section>

    <!-- Rest of your modal and loading components remain the same -->
    <!-- Service Modal -->
    <div v-if="selectedService" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-icon">{{ selectedService.icon }}</div>
          <h3>{{ selectedService.name }}</h3>
          <button class="modal-close" @click="closeModal">&times;</button>
        </div>
        <div class="modal-body">
          <p class="modal-description">{{ selectedService.description }}</p>
          <div class="modal-features">
            <h4>Features:</h4>
            <ul>
              <li v-for="feature in selectedService.features" :key="feature">
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="closeModal">Cancel</button>
          <button class="btn-primary" @click="launchService">
            Launch Service
            <span class="arrow-icon">→</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading Toast -->
    <div v-if="isLoading" class="toast-notification">
      <div class="toast-content">
        <div class="spinner"></div>
        <span>Loading {{ loadingServiceName }}...</span>
      </div>
    </div>
  </div>
</template>

<script>
import ServiceCard from '../components/ServiceCard.vue';
import servicesdata from '../data/services';
import Fuse from 'fuse.js'; // 👈 IMPORTANT: Add this line

export default {
  name: 'FreeServices',
  components: {
    ServiceCard
  },
  data() {
    return {
      selectedService: null,
      searchQuery: "",
      selectedCategory: 'all',
      showAutocomplete: false,
      selectedAutocompleteIndex: -1,
      currentPage: 1,
      itemsPerPage: 12,
      isLoading: false,
      loadingServiceName: '',
      fuseInstance: null,
      autocompleteDelay: null,
      services: servicesdata
    }
  },
  computed: {
    categories() {
      const cats = new Set(this.services.map(s => s.category));
      return Array.from(cats).sort();
    },
    
    filteredServices() {
      let results = [...this.services];
      
      // Apply search with fuzzy matching
      if (this.searchQuery && this.searchQuery.trim()) {
        if (this.fuseInstance) {
          const fuseResults = this.fuseInstance.search(this.searchQuery);
          results = fuseResults.map(r => r.item);
        }
      }
      
      // Apply category filter
      if (this.selectedCategory !== 'all') {
        results = results.filter(service => service.category === this.selectedCategory);
      }
      
      return results;
    },
    
    totalPages() {
      return Math.ceil(this.filteredServices.length / this.itemsPerPage);
    },
    
    paginatedServices() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredServices.slice(start, end);
    },
    
    autocompleteResults() {
      if (!this.searchQuery || this.searchQuery.length < 2) return [];
      
      let results = this.filteredServices.slice(0, 8);
      return results.map(item => ({
        ...item,
        searchScore: this.calculateRelevanceScore(item, this.searchQuery)
      })).sort((a, b) => b.searchScore - a.searchScore);
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    selectedCategory() {
      this.currentPage = 1;
      // Don't clear search query when changing category
      // this.searchQuery = ''; // Remove this line if you want to keep search when filtering by category
    }
  },
  mounted() {
    this.initFuse();
  },
  methods: {
    initFuse() {
      const options = {
        includeScore: true,
        threshold: 0.4,
        distance: 100,
        keys: [
          { name: 'name', weight: 0.5 },
          { name: 'description', weight: 0.3 },
          { name: 'category', weight: 0.2 },
          { name: 'features', weight: 0.1 }
        ],
        ignoreLocation: true,
        useExtendedSearch: true
      };
      this.fuseInstance = new Fuse(this.services, options);
    },
    
    handleSearchInput() {
      clearTimeout(this.autocompleteDelay);
      this.autocompleteDelay = setTimeout(() => {
        this.showAutocomplete = true;
        this.selectedAutocompleteIndex = -1;
      }, 200);
    },
    
    calculateRelevanceScore(item, query) {
      let score = 0;
      const lowerQuery = query.toLowerCase();
      const lowerName = item.name.toLowerCase();
      const lowerDesc = item.description.toLowerCase();
      
      // Exact match gets highest score
      if (lowerName === lowerQuery) score += 100;
      // Name starts with query
      else if (lowerName.startsWith(lowerQuery)) score += 80;
      // Name contains query
      else if (lowerName.includes(lowerQuery)) score += 60;
      // Fuzzy match through Fuse score
      else if (this.fuseInstance) {
        const result = this.fuseInstance.search(query);
        const match = result.find(r => r.item.id === item.id);
        if (match && match.score) {
          score += Math.round((1 - match.score) * 50);
        }
      }
      
      // Description matches
      if (lowerDesc.includes(lowerQuery)) score += 20;
      
      // Word boundary matches
      const words = lowerQuery.split(' ');
      for (const word of words) {
        if (word.length >= 2) {
          const nameWords = lowerName.split(' ');
          if (nameWords.some(w => w.startsWith(word))) score += 15;
          const camelCaseMatches = lowerName.match(new RegExp(word, 'gi'));
          if (camelCaseMatches) score += 10;
        }
      }
      
      return Math.min(100, score);
    },
    
    highlightMatch(text, query) {
      if (!query || !text) return text;
      // Escape HTML special characters
      const escapedText = text.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      });
      const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
      return escapedText.replace(regex, '<mark>$1</mark>');
    },
    
    escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    },
    
    truncate(text, length) {
      if (!text) return '';
      if (text.length <= length) return text;
      return text.substring(0, length) + '...';
    },
    
    selectAutocomplete(result) {
      this.searchQuery = result.name;
      this.showAutocomplete = false;
      this.openServiceModal(result);
    },
    
    handleBlur() {
      setTimeout(() => {
        this.showAutocomplete = false;
      }, 200);
    },
    
    clearSearch() {
      this.searchQuery = '';
      this.showAutocomplete = false;
    },
    
    clearAllFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.currentPage = 1;
    },
    
    openServiceModal(service) {
      this.selectedService = service;
      document.body.style.overflow = 'hidden';
    },
    
    closeModal() {
      this.selectedService = null;
      document.body.style.overflow = 'auto';
    },
    
    launchService() {
      this.isLoading = true;
      this.loadingServiceName = this.selectedService.name;
      
      setTimeout(() => {
        this.isLoading = false;
        
        if (this.selectedService.externalUrl) {
          window.open(this.selectedService.externalUrl, '_blank');
        } else if (this.selectedService.route) {
          this.$router.push(this.selectedService.route);
        }
        
        this.closeModal();
      }, 800);
    }
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto';
    if (this.autocompleteDelay) clearTimeout(this.autocompleteDelay);
  }
}
</script>

<style scoped>
.free-services-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #eef2f6 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 80px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
  opacity: 0.3;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  position: relative;
  animation: fadeInUp 0.6s ease-out;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  position: relative;
  animation: fadeInUp 0.6s ease-out 0.1s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Container */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Section Header */
.section-header {
  text-align: center;
  margin-bottom: 48px;
}

.section-header h2 {
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 12px;
}

.section-header p {
  font-size: 1.1rem;
  color: #64748b;
}

/* Services Section */
.services-section {
  padding: 60px 0 80px;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 28px;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-container {
  background: white;
  border-radius: 24px;
  max-width: 500px;
  width: 90%;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #e2e8f0;
  position: relative;
}

.modal-icon {
  font-size: 2.5rem;
  background: #f1f5f9;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
  line-height: 1;
}

.modal-close:hover {
  color: #1e293b;
}

.modal-body {
  padding: 24px;
}

.modal-description {
  color: #475569;
  line-height: 1.6;
  margin-bottom: 20px;
}

.modal-features h4 {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
  margin-bottom: 12px;
}

.modal-features ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.modal-features li {
  padding: 8px 0 8px 28px;
  position: relative;
  color: #334155;
}

.modal-features li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: 600;
}

.modal-footer {
  padding: 16px 24px 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #e2e8f0;
}

.btn-primary, .btn-secondary {
  padding: 10px 24px;
  border-radius: 40px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.95rem;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
}

.arrow-icon {
  transition: transform 0.2s;
}

.btn-primary:hover .arrow-icon {
  transform: translateX(4px);
}

.btn-secondary {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 12px 24px;
  border-radius: 48px;
  z-index: 1100;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #4f46e5;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.25rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .services-grid {
    gap: 20px;
    grid-template-columns: 1fr;
  }
  
  .section-header h2 {
    font-size: 1.75rem;
  }
  
  .modal-container {
    width: 95%;
  }
  
  .modal-header h3 {
    font-size: 1.25rem;
  }

  
}

.search-box-wrapper {
  max-width: 500px;
  margin: 0 auto 30px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: 0.2s;
}

.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.no-results {
  text-align: center;
  color: #64748b;
  margin-top: 20px;
}

.search-section {
  max-width: 800px;
  margin: 0 auto 40px;
}

.search-box-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.search-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 16px;
  font-size: 1.2rem;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  font-size: 1rem;
  outline: none;
  transition: all 0.2s;
  background: white;
}

.search-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.clear-search {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #94a3b8;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.clear-search:hover {
  color: #475569;
  background: #f1f5f9;
}

/* Autocomplete Dropdown */
.autocomplete-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02);
  border: 1px solid #e2e8f0;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
}

.autocomplete-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.autocomplete-item:hover,
.autocomplete-item.selected {
  background: #f8fafc;
}

.autocomplete-icon {
  font-size: 1.5rem;
  min-width: 40px;
}

.autocomplete-content {
  flex: 1;
}

.autocomplete-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.autocomplete-name mark {
  background: #fef08a;
  padding: 0 2px;
  border-radius: 3px;
}

.autocomplete-category {
  display: inline-block;
  margin-left: 8px;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 2px 6px;
  background: #e2e8f0;
  border-radius: 12px;
  color: #475569;
  text-transform: capitalize;
}

.autocomplete-description {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.4;
}

.autocomplete-score {
  font-size: 0.8rem;
  color: #f59e0b;
  white-space: nowrap;
}

/* Category Filters */
.category-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  justify-content: center;
}

.category-chip {
  padding: 6px 16px;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: capitalize;
}

.category-chip:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.category-chip.active {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border-color: transparent;
}

/* Search Stats */
.search-stats {
  text-align: center;
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 20px;
  padding: 8px;
  background: #f8fafc;
  border-radius: 8px;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 16px;
  margin-top: 20px;
}

.no-results-icon {
  font-size: 4rem;
  display: block;
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 1.5rem;
  color: #1e293b;
  margin-bottom: 8px;
}

.no-results p {
  color: #64748b;
  margin-bottom: 20px;
}

.clear-filters-btn {
  padding: 8px 20px;
  border-radius: 40px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #6366f1;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filters-btn:hover {
  background: #6366f1;
  color: white;
  border-color: transparent;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 40px;
  padding: 20px;
}

.page-btn {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f8fafc;
  border-color: #cbd5e1;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.875rem;
  color: #64748b;
}

/* Responsive */
@media (max-width: 768px) {
  .autocomplete-item {
    flex-wrap: wrap;
  }
  
  .autocomplete-score {
    margin-left: auto;
  }
  
  .category-filters {
    gap: 6px;
  }
  
  .category-chip {
    font-size: 0.75rem;
    padding: 4px 12px;
  }
}
</style>