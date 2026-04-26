<template>
  <div class="favicon-generator">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="hero-title">Favicon Generator</h1>
        <p class="hero-description">
          Create perfect favicons for your website from any image. Generate all sizes and formats at once.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Upload Section -->
      <div class="upload-card">
        <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileUpload">
          <input 
            type="file" 
            ref="fileInput" 
            @change="handleFileUpload" 
            accept="image/*" 
            class="hidden"
          />
          <div v-if="!uploadedImage" class="upload-placeholder">
            <svg class="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="upload-text">Click or drag & drop an image here</p>
            <p class="upload-hint">Supports PNG, JPG, JPEG, GIF, WEBP (Max 5MB)</p>
          </div>
          <div v-else class="upload-preview">
            <img :src="uploadedImage" alt="Preview" class="preview-image" />
            <button @click.stop="removeImage" class="remove-image-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Generation Options -->
      <div class="options-card" v-if="uploadedImage">
        <div class="options-header">
          <h3>⚙️ Favicon Options</h3>
          <button @click="resetOptions" class="reset-btn">Reset to Defaults</button>
        </div>

        <div class="options-grid">
          <!-- Sizes Selection -->
          <div class="option-group">
            <label class="option-label">Icon Sizes</label>
            <div class="size-buttons">
              <label class="size-checkbox">
                <input type="checkbox" v-model="sizes['16x16']" />
                <span>16x16</span>
              </label>
              <label class="size-checkbox">
                <input type="checkbox" v-model="sizes['32x32']" />
                <span>32x32</span>
              </label>
              <label class="size-checkbox">
                <input type="checkbox" v-model="sizes['64x64']" />
                <span>64x64</span>
              </label>
              <label class="size-checkbox">
                <input type="checkbox" v-model="sizes['128x128']" />
                <span>128x128</span>
              </label>
              <label class="size-checkbox">
                <input type="checkbox" v-model="sizes['256x256']" />
                <span>256x256</span>
              </label>
            </div>
          </div>

          <!-- Output Formats -->
          <div class="option-group">
            <label class="option-label">Output Formats</label>
            <div class="format-buttons">
              <label class="format-checkbox">
                <input type="checkbox" v-model="formats.ico" />
                <span>.ICO (Favicon)</span>
              </label>
              <label class="format-checkbox">
                <input type="checkbox" v-model="formats.png" />
                <span>.PNG</span>
              </label>
              <label class="format-checkbox">
                <input type="checkbox" v-model="formats.apple" />
                <span>Apple Touch Icon</span>
              </label>
            </div>
          </div>

          <!-- Background Options -->
          <div class="option-group">
            <label class="option-label">Background Preview</label>
            <div class="background-buttons">
              <button 
                @click="previewBackground = 'light'" 
                :class="['bg-btn', { active: previewBackground === 'light' }]"
              >
                Light
              </button>
              <button 
                @click="previewBackground = 'dark'" 
                :class="['bg-btn', { active: previewBackground === 'dark' }]"
              >
                Dark
              </button>
              <button 
                @click="previewBackground = 'transparent'" 
                :class="['bg-btn', { active: previewBackground === 'transparent' }]"
              >
                Transparent
              </button>
            </div>
          </div>
        </div>

        <div class="generate-button">
          <button @click="generateFavicons" class="generate-btn" :disabled="isGenerating">
            <svg v-if="!isGenerating" class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <div v-else class="spinner-small"></div>
            {{ isGenerating ? 'Generating...' : 'Generate Favicons' }}
          </button>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="generatedFavicons.length > 0" class="preview-card">
        <div class="preview-header">
          <h3>🎨 Favicon Preview</h3>
          <div class="preview-actions">
            <button @click="downloadAll" class="download-all-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download All (ZIP)
            </button>
            <button @click="clearFavicons" class="clear-all-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear All
            </button>
          </div>
        </div>

        <!-- Background Preview Toggle -->
        <div class="preview-background-toggle">
          <button 
            v-for="bg in ['light', 'dark', 'transparent']" 
            :key="bg"
            @click="previewBackground = bg"
            :class="['preview-bg-btn', { active: previewBackground === bg }]"
          >
            {{ bg.charAt(0).toUpperCase() + bg.slice(1) }}
          </button>
        </div>

        <!-- Favicon Grid -->
        <div class="favicon-grid" :class="`bg-${previewBackground}`">
          <div v-for="favicon in generatedFavicons" :key="favicon.id" class="favicon-item">
            <div class="favicon-preview">
              <img :src="favicon.dataUrl" :alt="favicon.name" />
            </div>
            <div class="favicon-info">
              <div class="favicon-name">{{ favicon.name }}</div>
              <div class="favicon-size">{{ favicon.size }}</div>
              <div class="favicon-dimensions">{{ favicon.dimensions }}</div>
              <button @click="downloadSingle(favicon)" class="download-single-btn">
                Download
              </button>
            </div>
          </div>
        </div>

        <!-- HTML Code Snippet -->
        <div class="code-snippet">
          <div class="code-header">
            <span>📄 HTML Code Snippet</span>
            <button @click="copyCodeSnippet" class="copy-code-btn">
              Copy Code
            </button>
          </div>
          <pre class="code-block"><code>{{ htmlCodeSnippet }}</code></pre>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <h3>💡 Favicon Best Practices</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">🎨</span>
            <div class="tip-content">
              <strong>Use Simple Designs</strong>
              <p>Favicons are small - use simple, recognizable shapes and limited colors</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">📐</span>
            <div class="tip-content">
              <strong>Multiple Sizes</strong>
              <p>Generate multiple sizes for different devices and use cases</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🍎</span>
            <div class="tip-content">
              <strong>Apple Touch Icon</strong>
              <p>Include Apple Touch Icon for iOS devices (180x180 recommended)</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⚡</span>
            <div class="tip-content">
              <strong>Optimize File Size</strong>
              <p>Keep favicon file sizes small for faster loading times</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toastMessage" class="toast-notification">
        <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script>
import JSZip from 'jszip'

export default {
  name: 'FaviconGenerator',
  data() {
    return {
      uploadedImage: null,
      originalFile: null,
      sizes: {
        '16x16': true,
        '32x32': true,
        '64x64': true,
        '128x128': true,
        '256x256': false
      },
      formats: {
        ico: true,
        png: true,
        apple: true
      },
      previewBackground: 'light',
      generatedFavicons: [],
      isGenerating: false,
      toastMessage: ''
    }
  },
  computed: {
    htmlCodeSnippet() {
      let html = '<!-- Favicon -->\n'
      
      this.generatedFavicons.forEach(favicon => {
        if (favicon.format === 'ico') {
          html += `<link rel="icon" type="image/x-icon" href="${favicon.name}">\n`
        } else if (favicon.format === 'png') {
          html += `<link rel="icon" type="image/png" sizes="${favicon.dimensions}" href="${favicon.name}">\n`
        } else if (favicon.format === 'apple') {
          html += `<link rel="apple-touch-icon" sizes="${favicon.dimensions}" href="${favicon.name}">\n`
        }
      })
      
      return html
    }
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click()
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      this.processFile(file)
    },

    handleDrop(event) {
      const file = event.dataTransfer.files[0]
      this.processFile(file)
    },

    processFile(file) {
      if (!file || !file.type.startsWith('image/')) {
        this.showToast('Please upload an image file')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        this.showToast('File size must be less than 5MB')
        return
      }

      this.originalFile = file
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImage = e.target.result
        this.showToast('Image uploaded successfully!')
        this.clearFavicons()
      }
      reader.readAsDataURL(file)
    },

    removeImage() {
      this.uploadedImage = null
      this.originalFile = null
      this.clearFavicons()
      this.showToast('Image removed')
    },

    async generateFavicons() {
      if (!this.uploadedImage) {
        this.showToast('Please upload an image first')
        return
      }

      this.isGenerating = true
      this.generatedFavicons = []

      const img = await this.loadImage(this.uploadedImage)
      const sizes = this.getSelectedSizes()
      
      for (const size of sizes) {
        const dimension = parseInt(size.split('x')[0])
        
        // Generate PNG
        if (this.formats.png) {
          const pngDataUrl = await this.resizeImage(img, dimension, dimension, 'image/png')
          this.generatedFavicons.push({
            id: `${size}-png`,
            name: `favicon-${size}.png`,
            size: this.formatFileSize(this.dataUrlToSize(pngDataUrl)),
            dimensions: size,
            format: 'png',
            dataUrl: pngDataUrl
          })
        }

        // Generate ICO (using PNG as base, will be converted)
        if (this.formats.ico && size === '32x32') {
          // For ICO, we typically use 32x32 or 16x16
          const icoDataUrl = await this.resizeImage(img, dimension, dimension, 'image/png')
          this.generatedFavicons.push({
            id: `${size}-ico`,
            name: `favicon.ico`,
            size: this.formatFileSize(this.dataUrlToSize(icoDataUrl)),
            dimensions: size,
            format: 'ico',
            dataUrl: icoDataUrl
          })
        }

        // Generate Apple Touch Icon (180x180 recommended)
        if (this.formats.apple && size === '180x180') {
          const appleDataUrl = await this.resizeImage(img, 180, 180, 'image/png')
          this.generatedFavicons.push({
            id: `apple-touch-icon`,
            name: `apple-touch-icon.png`,
            size: this.formatFileSize(this.dataUrlToSize(appleDataUrl)),
            dimensions: '180x180',
            format: 'apple',
            dataUrl: appleDataUrl
          })
        }
      }

      // Add Apple Touch Icon if selected and not already added
      if (this.formats.apple && !this.generatedFavicons.some(f => f.format === 'apple')) {
        const appleDataUrl = await this.resizeImage(img, 180, 180, 'image/png')
        this.generatedFavicons.push({
          id: `apple-touch-icon`,
          name: `apple-touch-icon.png`,
          size: this.formatFileSize(this.dataUrlToSize(appleDataUrl)),
          dimensions: '180x180',
          format: 'apple',
          dataUrl: appleDataUrl
        })
      }

      this.isGenerating = false
      this.showToast(`Generated ${this.generatedFavicons.length} favicons!`)
    },

    getSelectedSizes() {
      const sizes = []
      if (this.sizes['16x16']) sizes.push('16x16')
      if (this.sizes['32x32']) sizes.push('32x32')
      if (this.sizes['64x64']) sizes.push('64x64')
      if (this.sizes['128x128']) sizes.push('128x128')
      if (this.sizes['256x256']) sizes.push('256x256')
      if (this.formats.apple) sizes.push('180x180')
      return sizes
    },

    loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
      })
    },

    resizeImage(img, width, height, type) {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        
        // Draw image with smooth scaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)
        
        resolve(canvas.toDataURL(type, 1.0))
      })
    },

    dataUrlToSize(dataUrl) {
      const base64 = dataUrl.split(',')[1]
      const stringLength = base64.length
      const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812
      return sizeInBytes
    },

    formatFileSize(bytes) {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    },

    async downloadSingle(favicon) {
      const link = document.createElement('a')
      link.href = favicon.dataUrl
      link.download = favicon.name
      link.click()
      this.showToast(`Downloaded ${favicon.name}`)
    },

    async downloadAll() {
      const zip = new JSZip()
      
      for (const favicon of this.generatedFavicons) {
        const base64Data = favicon.dataUrl.split(',')[1]
        zip.file(favicon.name, base64Data, { base64: true })
      }
      
      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = 'favicons.zip'
      link.click()
      URL.revokeObjectURL(link.href)
      this.showToast('Downloaded all favicons as ZIP!')
    },

    async copyCodeSnippet() {
      try {
        await navigator.clipboard.writeText(this.htmlCodeSnippet)
        this.showToast('HTML code copied to clipboard!')
      } catch (err) {
        this.showToast('Failed to copy code')
      }
    },

    clearFavicons() {
      this.generatedFavicons = []
    },

    resetOptions() {
      this.sizes = {
        '16x16': true,
        '32x32': true,
        '64x64': true,
        '128x128': true,
        '256x256': false
      }
      this.formats = {
        ico: true,
        png: true,
        apple: true
      }
      this.previewBackground = 'light'
      this.showToast('Reset to default settings')
    },

    showToast(message) {
      this.toastMessage = message
      setTimeout(() => {
        this.toastMessage = ''
      }, 3000)
    }
  }
}
</script>

<style scoped>
.favicon-generator {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
  text-align: center;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 24px;
  color: white;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Main Container */
.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 48px;
  position: relative;
  z-index: 20;
}

/* Upload Card */
.upload-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.upload-area {
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.upload-placeholder {
  text-align: center;
}

.upload-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #9ca3af;
}

.upload-text {
  font-size: 18px;
  color: #374151;
  margin-bottom: 8px;
}

.upload-hint {
  font-size: 13px;
  color: #9ca3af;
}

.upload-preview {
  position: relative;
  display: inline-block;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.remove-image-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #ef4444;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.remove-image-btn:hover {
  transform: scale(1.1);
  background: #dc2626;
}

.hidden {
  display: none;
}

/* Options Card */
.options-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.options-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.reset-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.reset-btn:hover {
  background: #e5e7eb;
}

.options-grid {
  display: grid;
  gap: 24px;
  margin-bottom: 24px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.option-label {
  font-weight: 600;
  color: #374151;
}

.size-buttons,
.format-buttons,
.background-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.size-checkbox,
.format-checkbox {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f9fafb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.size-checkbox:hover,
.format-checkbox:hover {
  background: #f3f4f6;
}

.size-checkbox input,
.format-checkbox input {
  cursor: pointer;
}

.bg-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
}

.bg-btn:hover {
  background: #f3f4f6;
}

.bg-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.generate-button {
  display: flex;
  justify-content: center;
}

.generate-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.generate-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Preview Card */
.preview-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

.download-all-btn,
.clear-all-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
}

.download-all-btn:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.clear-all-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.preview-background-toggle {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.preview-bg-btn {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
}

.preview-bg-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.favicon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  transition: background 0.3s;
}

.favicon-grid.bg-light {
  background: #f9fafb;
}

.favicon-grid.bg-dark {
  background: #1f2937;
}

.favicon-grid.bg-transparent {
  background: repeating-conic-gradient(#e5e7eb 0% 25%, #ffffff 0% 50%) 50% / 20px 20px;
}

.favicon-item {
  text-align: center;
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.favicon-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.favicon-preview {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 12px;
}

.favicon-preview img {
  max-width: 64px;
  max-height: 64px;
  image-rendering: crisp-edges;
}

.favicon-info {
  text-align: center;
}

.favicon-name {
  font-size: 12px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  word-break: break-all;
}

.favicon-size,
.favicon-dimensions {
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 2px;
}

.download-single-btn {
  margin-top: 8px;
  padding: 4px 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
}

.download-single-btn:hover {
  background: #5a67d8;
}

/* Code Snippet */
.code-snippet {
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.copy-code-btn {
  padding: 4px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-code-btn:hover {
  background: #e5e7eb;
}

.code-block {
  background: #1f2937;
  color: #e5e7eb;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.5;
}

/* Tips Card */
.tips-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tips-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.tip-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: transform 0.2s;
}

.tip-item:hover {
  transform: translateX(4px);
}

.tip-icon {
  font-size: 24px;
}

.tip-content {
  flex: 1;
}

.tip-content strong {
  display: block;
  margin-bottom: 4px;
  color: #1f2937;
}

.tip-content p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1f2937;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1100;
  animation: toastSlideIn 0.3s ease-out;
}

.toast-icon {
  width: 20px;
  height: 20px;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .options-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .size-buttons,
  .format-buttons {
    flex-direction: column;
  }
  
  .size-checkbox,
  .format-checkbox {
    width: 100%;
  }
  
  .preview-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .preview-actions {
    justify-content: center;
  }
  
  .favicon-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-content {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .main-container {
    padding: 20px 16px 32px;
  }
  
  .upload-area {
    padding: 20px;
  }
  
  .preview-image {
    max-width: 150px;
  }
}
</style>