<template>
  <div class="image-compressor">
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div class="header-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="2.18" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15L16 10L5 21" />
          </svg>
          <span>Image Optimizer</span>
        </div>
        <h1>Image Compressor</h1>
        <p class="subtitle">
          Compress JPG, PNG, and WebP images without losing quality. Perfect for web optimization.
        </p>
      </div>

      <div class="two-column-grid">
        <!-- Left Panel - Upload & Settings -->
        <div class="card settings-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <h2>Upload & Settings</h2>
          </div>

          <div class="card-body">
            <!-- Upload Area -->
            <div 
              class="upload-area"
              @click="$refs.fileInput.click()"
              @dragover.prevent
              @drop.prevent="handleDrop"
              :class="{ 'drag-over': isDragOver }"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                @change="handleFileSelect"
                style="display: none"
              />
              <div v-if="files.length === 0" class="upload-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span>Click or drag images here</span>
                <small>Supports JPG, PNG, WebP (Max 20 files, 10MB each)</small>
              </div>
              <div v-else class="upload-stats">
                <div class="stats-info">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                  <div>
                    <strong>{{ files.length }} files selected</strong>
                    <span>Ready to compress</span>
                  </div>
                </div>
                <button @click.stop="clearFiles" class="clear-btn">Clear all</button>
              </div>
            </div>

            <!-- Compression Settings -->
            <div class="settings-section">
              <div class="section-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06A10 10 0 0 0 12 17.66a10 10 0 0 0 6.28-2.66z" />
                </svg>
                <h3>Compression Settings</h3>
              </div>

              <div class="form-group">
                <label class="form-label">Compression Type</label>
                <div class="button-group">
                  <button
                    @click="compressionType = 'lossless'"
                    :class="['type-btn', { active: compressionType === 'lossless' }]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Lossless
                    <span class="badge">No quality loss</span>
                  </button>
                  <button
                    @click="compressionType = 'lossy'"
                    :class="['type-btn', { active: compressionType === 'lossy' }]"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="20" x2="18" y2="10" />
                      <line x1="12" y1="20" x2="12" y2="4" />
                      <line x1="6" y1="20" x2="6" y2="14" />
                    </svg>
                    Lossy
                    <span class="badge">Smaller size</span>
                  </button>
                </div>
              </div>

              <div v-if="compressionType === 'lossy'" class="form-group">
                <label class="form-label">
                  Quality Level: <span class="quality-value">{{ quality }}%</span>
                </label>
                <input
                  type="range"
                  v-model="quality"
                  min="10"
                  max="100"
                  step="5"
                  class="quality-slider"
                />
                <div class="quality-labels">
                  <span>Smaller (10%)</span>
                  <span>Balanced (60%)</span>
                  <span>Better (100%)</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <input type="checkbox" v-model="preserveMetadata" class="checkbox" />
                  Preserve metadata (EXIF, GPS, etc.)
                </label>
              </div>

              <div class="form-group">
                <label class="form-label">
                  <input type="checkbox" v-model="resizeImage" class="checkbox" />
                  Resize image (maintain aspect ratio)
                </label>
              </div>

              <div v-if="resizeImage" class="form-group resize-group">
                <div class="two-col-grid-small">
                  <div>
                    <label class="form-label-sm">Max Width (px)</label>
                    <input
                      type="number"
                      v-model="maxWidth"
                      min="100"
                      max="5000"
                      class="form-input"
                    />
                  </div>
                  <div>
                    <label class="form-label-sm">Max Height (px)</label>
                    <input
                      type="number"
                      v-model="maxHeight"
                      min="100"
                      max="5000"
                      class="form-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Output Format -->
            <div class="settings-section">
              <div class="section-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
                <h3>Output Format</h3>
              </div>
              <div class="button-group">
                <button
                  v-for="format in ['original', 'webp', 'jpg', 'png']"
                  :key="format"
                  @click="outputFormat = format"
                  :class="['format-btn', { active: outputFormat === format }]"
                >
                  {{ format.toUpperCase() }}
                  <span v-if="format === 'original'" class="badge-sm">Same as input</span>
                </button>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button
                @click="compressImages"
                :disabled="files.length === 0 || isCompressing"
                class="btn-compress"
              >
                <svg v-if="!isCompressing" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="23 7 16 12 23 17 23 7" />
                  <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                </svg>
                <div v-else class="spinner"></div>
                {{ isCompressing ? 'Compressing...' : 'Compress Images' }}
              </button>
              
              <button
                v-if="compressedFiles.length > 0"
                @click="downloadAll"
                class="btn-download-all"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download All (ZIP)
              </button>
            </div>
          </div>
        </div>

        <!-- Right Panel - Preview & Results -->
        <div class="card preview-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <h2>Preview & Results</h2>
            <span v-if="compressedFiles.length > 0" class="result-badge">
              {{ compressedFiles.length }} compressed
            </span>
          </div>

          <div class="card-body">
            <!-- No Files State -->
            <div v-if="files.length === 0" class="empty-state">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="2" y="2" width="20" height="20" rx="2.18" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15L16 10L5 21" />
              </svg>
              <p>No images selected</p>
              <small>Upload images to see preview and compression results</small>
            </div>

            <!-- Results Grid -->
            <div v-else class="results-grid">
              <div
                v-for="(file, index) in files"
                :key="file.id"
                class="result-card"
                :class="{ 'compressed': compressedFiles[index] }"
              >
                <!-- Image Preview -->
                <div class="image-preview">
                  <img :src="file.previewUrl" :alt="file.name" />
                  <div class="image-overlay">
                    <button @click="toggleComparison(index)" class="compare-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="16" />
                        <line x1="8" y1="12" x2="16" y2="12" />
                      </svg>
                      {{ showingComparison === index ? 'Hide' : 'Compare' }}
                    </button>
                  </div>
                </div>

                <!-- Comparison View -->
                <div v-if="showingComparison === index && compressedFiles[index]" class="comparison-view">
                  <div class="comparison-item">
                    <span class="comparison-label">Original</span>
                    <img :src="file.previewUrl" />
                    <div class="size-info">{{ formatBytes(file.size) }}</div>
                  </div>
                  <div class="comparison-arrow">→</div>
                  <div class="comparison-item">
                    <span class="comparison-label">Compressed</span>
                    <img :src="compressedFiles[index].url" />
                    <div class="size-info">
                      {{ formatBytes(compressedFiles[index].size) }}
                      <span class="savings-badge">
                        -{{ calculateSavings(file.size, compressedFiles[index].size) }}%
                      </span>
                    </div>
                  </div>
                </div>

                <!-- File Info -->
                <div class="file-info">
                  <div class="file-name" :title="file.name">
                    {{ truncateName(file.name) }}
                  </div>
                  <div class="file-stats">
                    <span class="original-size">{{ formatBytes(file.size) }}</span>
                    <span v-if="compressedFiles[index]" class="compressed-size">
                      → {{ formatBytes(compressedFiles[index].size) }}
                    </span>
                    <span v-else class="pending-badge">Pending</span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="file-actions">
                  <button
                    v-if="compressedFiles[index]"
                    @click="downloadSingle(index)"
                    class="action-btn download"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download
                  </button>
                  <button @click="removeFile(index)" class="action-btn remove">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            </div>

            <!-- Summary Stats -->
            <div v-if="compressedFiles.length > 0" class="summary-stats">
              <div class="stat-card">
                <div class="stat-value">{{ compressedFiles.length }} / {{ files.length }}</div>
                <div class="stat-label">Images Compressed</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ totalSavingsPercentage }}%</div>
                <div class="stat-label">Total Savings</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ totalOriginalSize }}</div>
                <div class="stat-label">Original Size</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ totalCompressedSize }}</div>
                <div class="stat-label">Compressed Size</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Compressor from 'compressorjs'
import JSZip from 'jszip'

export default {
  name: 'ImageCompressor',
  data() {
    return {
      files: [],
      compressedFiles: [],
      isCompressing: false,
      compressionType: 'lossy',
      quality: 80,
      preserveMetadata: false,
      resizeImage: false,
      maxWidth: 1200,
      maxHeight: 1200,
      outputFormat: 'original',
      showingComparison: null,
      isDragOver: false,
    }
  },
  computed: {
    totalOriginalSize() {
      const total = this.files.reduce((sum, file) => sum + file.size, 0)
      return this.formatBytes(total)
    },
    totalCompressedSize() {
      const total = this.compressedFiles.reduce((sum, file) => sum + (file?.size || 0), 0)
      return this.formatBytes(total)
    },
    totalSavingsPercentage() {
      const original = this.files.reduce((sum, file) => sum + file.size, 0)
      const compressed = this.compressedFiles.reduce((sum, file) => sum + (file?.size || 0), 0)
      if (original === 0) return 0
      return Math.round(((original - compressed) / original) * 100)
    }
  },
  methods: {
    handleFileSelect(event) {
      const selectedFiles = Array.from(event.target.files)
      this.addFiles(selectedFiles)
    },

    handleDrop(event) {
      this.isDragOver = false
      const droppedFiles = Array.from(event.dataTransfer.files)
      this.addFiles(droppedFiles)
    },

    addFiles(newFiles) {
      const validFiles = newFiles.filter(file => {
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        const isValidType = validTypes.includes(file.type)
        const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
        const withinLimit = this.files.length + newFiles.length <= 20
        
        if (!isValidType) alert(`${file.name} is not a supported image format`)
        else if (!isValidSize) alert(`${file.name} exceeds 10MB limit`)
        else if (!withinLimit) alert('Maximum 20 files allowed')
        
        return isValidType && isValidSize && withinLimit
      })

      validFiles.forEach(file => {
        const id = Date.now() + Math.random() + file.name
        const previewUrl = URL.createObjectURL(file)
        this.files.push({
          id,
          name: file.name,
          size: file.size,
          type: file.type,
          file: file,
          previewUrl
        })
      })

      // Reset compressed files when new files are added
      this.compressedFiles = []
      this.showingComparison = null
    },

    clearFiles() {
      this.files.forEach(file => {
        URL.revokeObjectURL(file.previewUrl)
      })
      this.files = []
      this.compressedFiles = []
      this.showingComparison = null
    },

    removeFile(index) {
      URL.revokeObjectURL(this.files[index].previewUrl)
      this.files.splice(index, 1)
      this.compressedFiles.splice(index, 1)
      if (this.showingComparison === index) this.showingComparison = null
      else if (this.showingComparison > index) this.showingComparison--
    },

    async compressImages() {
      if (this.files.length === 0) return
      
      this.isCompressing = true
      this.compressedFiles = []
      
      for (let i = 0; i < this.files.length; i++) {
        try {
          const compressed = await this.compressSingleImage(this.files[i])
          this.compressedFiles.push(compressed)
        } catch (error) {
          console.error(`Failed to compress ${this.files[i].name}:`, error)
          this.compressedFiles.push(null)
        }
      }
      
      this.isCompressing = false
    },

    compressSingleImage(fileItem) {
      return new Promise((resolve, reject) => {
        const options = {
          quality: this.compressionType === 'lossy' ? this.quality / 100 : 1,
          preserveHeaders: this.preserveMetadata,
          checkOrientation: true,
          convertTypes: this.getConvertTypes(),
        }

        // Handle resize
        if (this.resizeImage) {
          options.width = this.maxWidth
          options.height = this.maxHeight
        }

        // Handle output format
        if (this.outputFormat !== 'original') {
          let mimeType = `image/${this.outputFormat}`
          if (this.outputFormat === 'jpg') mimeType = 'image/jpeg'
          options.mimeType = mimeType
        }

        new Compressor(fileItem.file, {
          ...options,
          success(result) {
            const reader = new FileReader()
            reader.onloadend = () => {
              resolve({
                url: reader.result,
                size: result.size,
                blob: result,
                name: fileItem.name.replace(/\.[^/.]+$/, '') + '_compressed.' + (options.mimeType?.split('/')[1] || fileItem.type.split('/')[1])
              })
            }
            reader.readAsDataURL(result)
          },
          error(err) {
            reject(err)
          }
        })
      })
    },

    getConvertTypes() {
      // Determine which formats to convert based on output format
      if (this.outputFormat === 'original') return null
      const convertMap = {
        'webp': 'image/webp',
        'jpg': 'image/jpeg',
        'png': 'image/png'
      }
      return { [convertMap[this.outputFormat]]: true }
    },

    downloadSingle(index) {
      if (!this.compressedFiles[index]) return
      
      const link = document.createElement('a')
      link.href = this.compressedFiles[index].url
      link.download = this.compressedFiles[index].name
      link.click()
    },

    async downloadAll() {
      const zip = new JSZip()
      
      this.compressedFiles.forEach((file, index) => {
        if (file) {
          const blob = file.blob
          const fileName = file.name
          zip.file(fileName, blob)
        }
      })
      
      const content = await zip.generateAsync({ type: 'blob' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(content)
      link.download = `compressed_images_${Date.now()}.zip`
      link.click()
      URL.revokeObjectURL(link.href)
    },

    toggleComparison(index) {
      if (this.showingComparison === index) {
        this.showingComparison = null
      } else {
        this.showingComparison = index
      }
    },

    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    calculateSavings(original, compressed) {
      return Math.round(((original - compressed) / original) * 100)
    },

    truncateName(name) {
      if (name.length > 30) {
        return name.substring(0, 27) + '...'
      }
      return name
    }
  },
  beforeDestroy() {
    this.clearFiles()
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.image-compressor {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
  padding: 40px 24px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 48px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 8px 20px;
  border-radius: 100px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.badge-icon {
  width: 18px;
  height: 18px;
}

.header h1 {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
}

/* Grid Layout */
.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 968px) {
  .two-column-grid {
    grid-template-columns: 1fr;
  }
}

/* Card Styles */
.card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
}

.card-header {
  padding: 24px 28px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.card-icon {
  width: 24px;
  height: 24px;
  color: #2c5364;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.result-badge {
  background: #10b981;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-body {
  padding: 28px;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 28px;
}

.upload-area:hover {
  border-color: #2c5364;
  background: #f8fafc;
}

.upload-area.drag-over {
  border-color: #10b981;
  background: #f0fdf4;
}

.upload-placeholder {
  padding: 48px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.upload-placeholder svg {
  color: #94a3b8;
}

.upload-placeholder span {
  font-size: 1rem;
  color: #475569;
  font-weight: 500;
}

.upload-placeholder small {
  font-size: 0.75rem;
  color: #94a3b8;
}

.upload-stats {
  padding: 20px 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border-radius: 18px;
}

.stats-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stats-info svg {
  color: #10b981;
}

.stats-info strong {
  display: block;
  font-size: 0.875rem;
  color: #1e293b;
}

.stats-info span {
  font-size: 0.75rem;
  color: #64748b;
}

.clear-btn {
  padding: 6px 16px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: #dc2626;
  transform: scale(0.98);
}

/* Settings Section */
.settings-section {
  margin-bottom: 28px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.section-header svg {
  color: #2c5364;
}

.section-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 10px;
}

.form-label-sm {
  display: block;
  font-size: 0.75rem;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 6px;
}

.checkbox {
  margin-right: 8px;
  cursor: pointer;
}

/* Button Group */
.button-group {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.type-btn, .format-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1.5px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn .badge, .format-btn .badge-sm {
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #475569;
}

.type-btn.active, .format-btn.active {
  background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%);
  border-color: transparent;
  color: white;
}

.type-btn.active svg, .format-btn.active svg {
  stroke: white;
}

.type-btn.active .badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Quality Slider */
.quality-slider {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.quality-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #2c5364;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.quality-value {
  color: #2c5364;
  font-weight: 700;
  font-size: 1rem;
}

.quality-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.7rem;
  color: #94a3b8;
}

/* Resize Group */
.resize-group {
  margin-top: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
}

.two-col-grid-small {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.form-input {
  width: 100%;
  padding: 8px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #2c5364;
  box-shadow: 0 0 0 3px rgba(44, 83, 100, 0.1);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-compress, .btn-download-all {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-compress {
  background: linear-gradient(135deg, #0f2027 0%, #2c5364 100%);
  color: white;
}

.btn-compress:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(44, 83, 100, 0.3);
}

.btn-compress:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-download-all {
  background: #10b981;
  color: white;
}

.btn-download-all:hover {
  background: #059669;
  transform: translateY(-2px);
}

/* Spinner */
.spinner {
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

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-state svg {
  margin-bottom: 16px;
  color: #cbd5e1;
}

.empty-state p {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 8px;
}

.empty-state small {
  font-size: 0.75rem;
}

/* Results Grid */
.results-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;
}

.results-grid::-webkit-scrollbar {
  width: 6px;
}

.results-grid::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.results-grid::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.result-card {
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  transition: all 0.2s ease;
  border: 1px solid #e5e7eb;
}

.result-card.compressed {
  border-left: 4px solid #10b981;
}

.image-preview {
  position: relative;
  display: inline-block;
  width: 80px;
  height: 80px;
  margin-bottom: 12px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.image-preview:hover .image-overlay {
  opacity: 1;
}

.compare-btn {
  padding: 4px 10px;
  background: white;
  border: none;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Comparison View */
.comparison-view {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 16px 0;
  padding: 16px;
  background: white;
  border-radius: 12px;
}

.comparison-item {
  flex: 1;
  text-align: center;
}

.comparison-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.comparison-item img {
  width: 100%;
  max-width: 150px;
  height: auto;
  border-radius: 8px;
  margin-bottom: 8px;
}

.size-info {
  font-size: 0.75rem;
  color: #475569;
}

.savings-badge {
  display: inline-block;
  margin-left: 6px;
  padding: 2px 6px;
  background: #10b981;
  color: white;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
}

.comparison-arrow {
  font-size: 1.5rem;
  color: #cbd5e1;
}

/* File Info */
.file-info {
  margin-top: 12px;
}

.file-name {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 4px;
}

.file-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.7rem;
}

.original-size {
  color: #94a3b8;
}

.compressed-size {
  color: #10b981;
  font-weight: 500;
}

.pending-badge {
  padding: 2px 8px;
  background: #fef3c7;
  color: #d97706;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 600;
}

/* File Actions */
.file-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
  flex: 1;
  padding: 6px;
  border: none;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  transition: all 0.2s ease;
}

.action-btn.download {
  background: #2c5364;
  color: white;
}

.action-btn.download:hover {
  background: #1f3a47;
}

.action-btn.remove {
  background: #fee2e2;
  color: #ef4444;
}

.action-btn.remove:hover {
  background: #fecaca;
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.stat-card {
  text-align: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
}

@media (max-width: 640px) {
  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .comparison-view {
    flex-direction: column;
  }
  
  .comparison-arrow {
    transform: rotate(90deg);
  }
}
</style>