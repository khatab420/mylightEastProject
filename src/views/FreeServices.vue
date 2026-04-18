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

        <div class="services-grid">
          <ServiceCard
            v-for="service in services"
            :key="service.id"
            :service="service"
            @select="openServiceModal"
          />
        </div>
      </div>
    </section>

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

export default {
  name: 'FreeServices',
  components: {
    ServiceCard
  },
  data() {
    return {
      selectedService: null,
      isLoading: false,
      loadingServiceName: '',
      services: [
        {
          id: 1,
          name: 'Mobile Mockup Creator',
          icon: '📱',
          category: 'design',
          description: 'Create stunning mobile app mockups in seconds. Choose from hundreds of device frames, backgrounds, and shadows.',
          features: [
            'Support for iPhone, Samsung, Pixel, and more',
            'Custom background colors and gradients',
            'High-resolution PNG export',
            'Drag & drop your screenshot'
          ],
          route: '/mockup-creator',
          externalUrl: null,
          color: '#6366f1'
        },
        {
          id: 2,
          name: 'PDF Converter',
          icon: '📄',
          category: 'document',
          description: 'Convert documents to PDF or extract content from PDF files. Supports Word, Excel, PPT, and images.',
          features: [
            'Convert to PDF from any format',
            'Extract images from PDF',
            'Merge multiple PDFs',
            'Compress PDF size'
          ],
          route: '/pdf-converter',
          externalUrl: null,
          color: '#ef4444'
        },
        {
          id: 3,
          name: 'Date Converter',
          icon: '📅',
          category: 'utility',
          description: 'Convert between different date formats, calculate date differences, and get timestamps.',
          features: [
            'Unix timestamp to human date',
            'Date difference calculator',
            'Multiple format support (ISO, UTC, Local)',
            'Add/subtract days, months, years'
          ],
          route: '/date-converter',
          externalUrl: null,
          color: '#10b981'
        },
        {
          id: 4,
          name: 'Passport Size Photo',
          icon: '🖼️',
          category: 'photo',
          description: 'Create passport-sized photos that meet international standards. Crop, resize, and adjust background.',
          features: [
            'Compliance with US, UK, EU, India standards',
            'Automatic background removal',
            'Print-ready 4x6 layout',
            'Adjust lighting and contrast'
          ],
          route: '/passport-photo',
          externalUrl: null,
          color: '#f59e0b'
        },
        {
          id: 5,
          name: 'QR Code Generator',
          icon: '📲',
          category: 'utility',
          description: 'Generate custom QR codes for URLs, text, Wi-Fi, vCards, and more with beautiful designs.',
          features: [
            'Custom colors and logos',
            'High-resolution SVG & PNG',
            'Trackable QR codes',
            'Bulk QR generation'
          ],
          route: '/tools/qr-generator',
          externalUrl: null,
          color: '#8b5cf6'
        },
        {
          id: 6,
          name: 'Image Compressor',
          icon: '🖼️',
          category: 'photo',
          description: 'Compress JPG, PNG, and WebP images without losing quality. Perfect for web optimization.',
          features: [
            'Lossless and lossy compression',
            'Batch processing up to 20 files',
            'Before/after preview',
            'Custom compression level'
          ],
          route: '/tools/image-compressor',
          externalUrl: null,
          color: '#ec4899'
        },
        {
          id: 7,
          name: 'JSON Formatter',
          icon: '{ }',
          category: 'developer',
          description: 'Format, validate, and minify JSON data. Perfect for developers and API testing.',
          features: [
            'Pretty print JSON',
            'JSON validator with error line',
            'Tree view visualization',
            'JSON to CSV converter'
          ],
          route: '/tools/json-formatter',
          externalUrl: null,
          color: '#3b82f6'
        },
        {
          id: 8,
          name: 'Color Palette Generator',
          icon: '🎨',
          category: 'design',
          description: 'Generate beautiful color palettes from images or create custom schemes for your projects.',
          features: [
            'Extract colors from any image',
            'Analogous, complementary, triadic schemes',
            'Export to CSS, SCSS, Tailwind',
            'Color blindness simulator'
          ],
          route: '/tools/color-palette',
          externalUrl: null,
          color: '#14b8a6'
        },
        {
          id: 9,
          name: 'Text to Speech',
          icon: '🔊',
          category: 'utility',
          description: 'Convert text to natural-sounding speech in multiple languages and voices.',
          features: [
            '50+ languages supported',
            'Adjustable speed and pitch',
            'Download as MP3',
            'SSML support for advanced control'
          ],
          route: '/tools/text-to-speech',
          externalUrl: null,
          color: '#f97316'
        },
        {
          id: 10,
          name: 'Base64 Encoder/Decoder',
          icon: '🔄',
          category: 'developer',
          description: 'Encode and decode Base64 strings instantly. Support for images, files, and text.',
          features: [
            'Text to Base64 and back',
            'Image preview for data URLs',
            'File upload support',
            'URL-safe encoding'
          ],
          route: '/tools/base64',
          externalUrl: null,
          color: '#6b7280'
        }
      ]
    }
  },
  methods: {
    openServiceModal(service) {
      this.selectedService = service
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    },
    closeModal() {
      this.selectedService = null
      document.body.style.overflow = 'auto'
    },
    launchService() {
      this.isLoading = true
      this.loadingServiceName = this.selectedService.name
      
      // Simulate loading for smooth transition
      setTimeout(() => {
        this.isLoading = false
        
        // If external URL, open in new tab
        if (this.selectedService.externalUrl) {
          window.open(this.selectedService.externalUrl, '_blank')
        } 
        // Otherwise navigate using Vue Router
        else if (this.selectedService.route) {
          this.$router.push(this.selectedService.route)
        }
        
        this.closeModal()
      }, 800)
    }
  },
  beforeDestroy() {
    // Clean up body overflow style
    document.body.style.overflow = 'auto'
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
</style>