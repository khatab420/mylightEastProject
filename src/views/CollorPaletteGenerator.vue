<template>
  <div class="color-palette-generator">
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div class="header-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 0-20z" />
            <path d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20z" />
            <path d="M12 12l4 4M12 12L8 8M12 12l4-4M12 12L8 16" />
          </svg>
          <span>Color Studio</span>
        </div>
        <h1>Color Palette Generator</h1>
        <p class="subtitle">
          Generate beautiful color palettes from images or create custom schemes for your projects
        </p>
      </div>

      <div class="main-layout">
        <!-- Left Panel - Input & Controls -->
        <div class="card controls-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06A10 10 0 0 0 12 17.66a10 10 0 0 0 6.28-2.66z" />
            </svg>
            <h2>Palette Controls</h2>
          </div>

          <div class="card-body">
            <!-- Source Tabs -->
            <div class="tabs">
              <button
                @click="sourceType = 'generate'"
                :class="['tab-btn', { active: sourceType === 'generate' }]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06A10 10 0 0 0 12 17.66a10 10 0 0 0 6.28-2.66z" />
                </svg>
                Generate
              </button>
              <button
                @click="sourceType = 'image'"
                :class="['tab-btn', { active: sourceType === 'image' }]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="2.18" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15L16 10L5 21" />
                </svg>
                From Image
              </button>
            </div>

            <!-- Generate Scheme Section -->
            <div v-if="sourceType === 'generate'" class="section">
              <div class="form-group">
                <label class="form-label">Base Color</label>
                <div class="color-input-group">
                  <input
                    type="color"
                    v-model="baseColor"
                    class="color-picker"
                  />
                  <input
                    type="text"
                    v-model="baseColor"
                    class="color-hex-input"
                    @change="validateColor"
                    placeholder="#000000"
                  />
                  <button @click="randomColor" class="random-btn" title="Random Color">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M21 2L9 14M21 2v6M21 2h-6M3 22L15 10M3 22v-6M3 22h6" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Scheme Type</label>
                <div class="scheme-buttons">
                  <button
                    v-for="scheme in schemes"
                    :key="scheme.value"
                    @click="schemeType = scheme.value"
                    :class="['scheme-btn', { active: schemeType === scheme.value }]"
                  >
                    {{ scheme.name }}
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Number of Colors</label>
                <div class="number-control">
                  <button @click="colorCount = Math.max(3, colorCount - 1)" class="num-btn">-</button>
                  <span class="num-value">{{ colorCount }}</span>
                  <button @click="colorCount = Math.min(10, colorCount + 1)" class="num-btn">+</button>
                </div>
              </div>

              <button @click="generatePalette" class="btn-generate">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
                  <polyline points="12 2 12 16 16 12" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                </svg>
                Generate Palette
              </button>
            </div>

            <!-- Image Upload Section -->
            <div v-if="sourceType === 'image'" class="section">
              <div class="upload-area" @click="$refs.imageInput.click()" @dragover.prevent @drop.prevent="handleImageDrop">
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  style="display: none"
                />
                <div v-if="!uploadedImage" class="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="2" y="2" width="20" height="20" rx="2.18" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15L16 10L5 21" />
                  </svg>
                  <span>Click or drag image here</span>
                  <small>PNG, JPG, WebP (Max 5MB)</small>
                </div>
                <div v-else class="upload-preview">
                  <img :src="uploadedImage" class="preview-image" />
                  <button @click.stop="clearImage" class="clear-image-btn">✕</button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Color Count</label>
                <input
                  type="range"
                  v-model="extractCount"
                  min="3"
                  max="12"
                  step="1"
                  class="slider"
                />
                <div class="slider-value">{{ extractCount }} colors</div>
              </div>

              <button @click="extractColorsFromImage" class="btn-generate" :disabled="!uploadedImage">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
                  <polyline points="12 2 12 16 16 12" />
                  <line x1="8" y1="16" x2="8.01" y2="16" />
                </svg>
                Extract Colors
              </button>
            </div>

            <!-- Color Blindness Simulator -->
            <div class="section">
              <div class="section-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
                <h3>Color Blindness Simulator</h3>
              </div>
              <div class="blindness-buttons">
                <button
                  v-for="type in blindnessTypes"
                  :key="type.value"
                  @click="simulateBlindness(type.value)"
                  :class="['blind-btn', { active: activeBlindness === type.value }]"
                >
                  {{ type.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Palette Display -->
        <div class="card palette-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 8h20M2 16h20" />
            </svg>
            <h2>Color Palette</h2>
            <div class="export-buttons">
              <button @click="showExportModal = true" class="export-btn" :disabled="palette.length === 0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- Palette Display -->
            <div v-if="palette.length > 0" class="palette-container">
              <div
                v-for="(color, index) in displayPalette"
                :key="index"
                class="color-card"
                :style="{ backgroundColor: color }"
              >
                <div class="color-info">
                  <div class="color-code">{{ color.toUpperCase() }}</div>
                  <div class="color-actions">
                    <button @click="copyColor(color)" class="color-action-btn" title="Copy HEX">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                    </button>
                    <button @click="lockColor(index)" class="color-action-btn" :class="{ locked: lockedColors[index] }" title="Lock color">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="5" y="11" width="14" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else class="empty-palette">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              <p>No palette generated yet</p>
              <small>Generate a palette using controls on the left</small>
            </div>

            <!-- CSS Variables Preview -->
            <div v-if="palette.length > 0" class="css-preview">
              <div class="preview-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                <span>Live Preview</span>
              </div>
              <div class="preview-examples">
                <div class="preview-box" :style="{ backgroundColor: palette[0], color: getContrastColor(palette[0]) }">
                  Primary Button
                </div>
                <div class="preview-box secondary" :style="{ backgroundColor: palette[1] || palette[0], color: getContrastColor(palette[1] || palette[0]) }">
                  Secondary Button
                </div>
                <div class="gradient-preview" :style="{ background: `linear-gradient(135deg, ${palette[0]}, ${palette[Math.min(2, palette.length-1)]})` }">
                  Gradient Preview
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Modal -->
    <div v-if="showExportModal" class="modal" @click.self="showExportModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>Export Palette</h3>
          <button @click="showExportModal = false" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="export-options">
            <button @click="exportAsCSS" class="export-option-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              CSS Variables
            </button>
            <button @click="exportAsSCSS" class="export-option-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              SCSS Variables
            </button>
            <button @click="exportAsTailwind" class="export-option-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              Tailwind Config
            </button>
            <button @click="exportAsJSON" class="export-option-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              JSON
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div v-if="toastMessage" class="toast" :class="toastType">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script>


function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null
}

function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

export default {
  name: 'ColorPaletteGenerator',
  data() {
    return {
      sourceType: 'generate',
      baseColor: '#3b82f6',
      schemeType: 'complementary',
      colorCount: 5,
      palette: [],
      lockedColors: {},
      schemes: [
        { name: 'Monochromatic', value: 'monochromatic' },
        { name: 'Complementary', value: 'complementary' },
        { name: 'Analogous', value: 'analogous' },
        { name: 'Triadic', value: 'triadic' },
        { name: 'Tetradic', value: 'tetradic' },
        { name: 'Square', value: 'square' }
      ],
      blindnessTypes: [
        { name: 'None', value: 'none' },
        { name: 'Protanopia', value: 'protanopia' },
        { name: 'Deuteranopia', value: 'deuteranopia' },
        { name: 'Tritanopia', value: 'tritanopia' },
        { name: 'Achromatopsia', value: 'achromatopsia' }
      ],
      activeBlindness: 'none',
      uploadedImage: null,
      extractCount: 8,
      showExportModal: false,
      toastMessage: '',
      toastType: 'success',
      toastTimeout: null
    }
  },
  computed: {
    displayPalette() {
      if (this.activeBlindness === 'none') return this.palette
      return this.palette.map(color => this.simulateColorBlindness(color, this.activeBlindness))
    }
  },
  watch: {
    baseColor() {
      this.generatePalette()
    },
    schemeType() {
      this.generatePalette()
    },
    colorCount() {
      this.generatePalette()
    }
  },
  methods: {
    // Color manipulation helpers
    hslToHex(h, s, l) {
      h /= 360
      s /= 100
      l /= 100
      let r, g, b
      if (s === 0) {
        r = g = b = l
      } else {
        const hue2rgb = (p, q, t) => {
          if (t < 0) t += 1
          if (t > 1) t -= 1
          if (t < 1/6) return p + (q - p) * 6 * t
          if (t < 1/2) return q
          if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
          return p
        }
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s
        const p = 2 * l - q
        r = hue2rgb(p, q, h + 1/3)
        g = hue2rgb(p, q, h)
        b = hue2rgb(p, q, h - 1/3)
      }
      return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255))
    },

    hexToHsl(hex) {
      let r, g, b
      if (hex.startsWith('#')) {
        r = parseInt(hex.slice(1, 3), 16) / 255
        g = parseInt(hex.slice(3, 5), 16) / 255
        b = parseInt(hex.slice(5, 7), 16) / 255
      } else {
        const rgb = hexToRgb(hex)
        r = rgb.r / 255
        g = rgb.g / 255
        b = rgb.b / 255
      }
      
      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h, s, l = (max + min) / 2

      if (max === min) {
        h = s = 0
      } else {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h *= 60
      }
      return { h, s: s * 100, l: l * 100 }
    },

    generatePalette() {
      const hsl = this.hexToHsl(this.baseColor)
      let colors = []

      switch (this.schemeType) {
        case 'monochromatic':
          for (let i = 0; i < this.colorCount; i++) {
            const lightness = 20 + (i * (80 / (this.colorCount - 1)))
            colors.push(this.hslToHex(hsl.h, hsl.s, lightness))
          }
          break

        case 'complementary':
          colors.push(this.baseColor)
          colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l))
          while (colors.length < this.colorCount) {
            const lightness = 30 + (colors.length * 20)
            colors.push(this.hslToHex(hsl.h, hsl.s, lightness))
          }
          break

        case 'analogous':
          const angles = [-30, 0, 30, 60, 90]
          for (let i = 0; i < this.colorCount; i++) {
            const angle = angles[i % angles.length] + (Math.floor(i / angles.length) * 120)
            colors.push(this.hslToHex((hsl.h + angle + 360) % 360, hsl.s, hsl.l))
          }
          break

        case 'triadic':
          const triadicAngles = [0, 120, 240]
          for (let i = 0; i < this.colorCount; i++) {
            const angle = triadicAngles[i % 3] + (Math.floor(i / 3) * 40)
            colors.push(this.hslToHex((hsl.h + angle) % 360, hsl.s, hsl.l))
          }
          break

        case 'tetradic':
          const tetradicAngles = [0, 90, 180, 270]
          for (let i = 0; i < this.colorCount; i++) {
            const angle = tetradicAngles[i % 4] + (Math.floor(i / 4) * 45)
            colors.push(this.hslToHex((hsl.h + angle) % 360, hsl.s, hsl.l))
          }
          break

        case 'square':
          const squareAngles = [0, 90, 180, 270]
          for (let i = 0; i < this.colorCount; i++) {
            const angle = squareAngles[i % 4] + (Math.floor(i / 4) * 30)
            colors.push(this.hslToHex((hsl.h + angle) % 360, hsl.s, hsl.l))
          }
          break
      }

      // Apply locked colors
      const newPalette = []
      for (let i = 0; i < this.colorCount; i++) {
        if (this.lockedColors[i] && this.palette[i]) {
          newPalette.push(this.palette[i])
        } else {
          newPalette.push(colors[i] || colors[0])
        }
      }
      
      this.palette = newPalette.slice(0, this.colorCount)
    },

    randomColor() {
      const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')
      this.baseColor = randomHex
    },

    validateColor() {
      if (!/^#[0-9A-Fa-f]{6}$/.test(this.baseColor)) {
        this.baseColor = '#3b82f6'
      }
    },

    lockColor(index) {
      this.$set(this.lockedColors, index, !this.lockedColors[index])
    },

    async extractColorsFromImage() {
      if (!this.uploadedImage) return

      try {
        // Create an image element to analyze
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        
        const imageLoaded = new Promise((resolve) => {
          img.onload = resolve
        })
        
        img.src = this.uploadedImage
        await imageLoaded
        
        // Create canvas to get pixel data
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        // Get pixel data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const pixels = imageData.data
        
        // Sample pixels (use every 10th pixel for performance)
        const colorMap = new Map()
        const step = 10
        
        for (let i = 0; i < pixels.length; i += step * 4) {
          const r = pixels[i]
          const g = pixels[i + 1]
          const b = pixels[i + 2]
          
          // Quantize colors to reduce variation
          const quantizedR = Math.round(r / 32) * 32
          const quantizedG = Math.round(g / 32) * 32
          const quantizedB = Math.round(b / 32) * 32
          const key = `${quantizedR},${quantizedG},${quantizedB}`
          
          colorMap.set(key, (colorMap.get(key) || 0) + 1)
        }
        
        // Sort by frequency and get top colors
        const sortedColors = Array.from(colorMap.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, this.extractCount)
          .map(([key]) => {
            const [r, g, b] = key.split(',').map(Number)
            return rgbToHex(r, g, b)
          })
        
        this.palette = sortedColors
        this.showToast('Colors extracted successfully!', 'success')
      } catch (error) {
        console.error('Failed to extract colors:', error)
        this.showToast('Failed to extract colors', 'error')
      }
    },

    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) this.processImage(file)
    },

    handleImageDrop(event) {
      const file = event.dataTransfer.files[0]
      if (file) this.processImage(file)
    },

    processImage(file) {
      if (!file.type.startsWith('image/')) {
        this.showToast('Please upload an image file', 'error')
        return
      }
      
      if (file.size > 5 * 1024 * 1024) {
        this.showToast('Image must be less than 5MB', 'error')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.uploadedImage = e.target.result
      }
      reader.readAsDataURL(file)
    },

    clearImage() {
      this.uploadedImage = null
      this.palette = []
    },

    simulateBlindness(type) {
      this.activeBlindness = type
    },

    simulateColorBlindness(hex, type) {
      const rgb = hexToRgb(hex)
      if (!rgb) return hex
      
      const r = rgb.r / 255
      const g = rgb.g / 255
      const b = rgb.b / 255
      
      // Simplified color blindness simulation matrices
      const matrices = {
        protanopia: [
          [0.567, 0.433, 0.000],
          [0.558, 0.442, 0.000],
          [0.000, 0.242, 0.758]
        ],
        deuteranopia: [
          [0.625, 0.375, 0.000],
          [0.700, 0.300, 0.000],
          [0.000, 0.300, 0.700]
        ],
        tritanopia: [
          [0.950, 0.050, 0.000],
          [0.000, 0.433, 0.567],
          [0.000, 0.475, 0.525]
        ],
        achromatopsia: [
          [0.299, 0.587, 0.114],
          [0.299, 0.587, 0.114],
          [0.299, 0.587, 0.114]
        ]
      }
      
      if (type === 'none' || !matrices[type]) return hex
      
      const matrix = matrices[type]
      const newR = matrix[0][0] * r + matrix[0][1] * g + matrix[0][2] * b
      const newG = matrix[1][0] * r + matrix[1][1] * g + matrix[1][2] * b
      const newB = matrix[2][0] * r + matrix[2][1] * g + matrix[2][2] * b
      
      return rgbToHex(
        Math.min(255, Math.max(0, Math.round(newR * 255))),
        Math.min(255, Math.max(0, Math.round(newG * 255))),
        Math.min(255, Math.max(0, Math.round(newB * 255)))
      )
    },

    async copyColor(color) {
      try {
        await navigator.clipboard.writeText(color)
        this.showToast(`Copied ${color} to clipboard!`, 'success')
      } catch (err) {
        this.showToast('Failed to copy', 'error')
      }
    },

    getContrastColor(hex) {
      const rgb = hexToRgb(hex)
      if (!rgb) return '#ffffff'
      const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
      return luminance > 0.5 ? '#000000' : '#ffffff'
    },

    exportAsCSS() {
      let css = ':root {\n'
      this.palette.forEach((color, index) => {
        css += `  --color-${index + 1}: ${color};\n`
      })
      css += '}\n'
      this.downloadFile(css, 'palette.css', 'text/css')
      this.showToast('CSS exported!', 'success')
    },

    exportAsSCSS() {
      let scss = '$palette: (\n'
      this.palette.forEach((color, index) => {
        scss += `  'color-${index + 1}': ${color},\n`
      })
      scss += ');\n\n'
      this.palette.forEach((color, index) => {
        scss += `$$color-${index + 1}: ${color};\n`
      })
      this.downloadFile(scss, 'palette.scss', 'text/scss')
      this.showToast('SCSS exported!', 'success')
    },

    exportAsTailwind() {
      const tailwindConfig = {
        theme: {
          extend: {
            colors: {}
          }
        }
      }
      
      this.palette.forEach((color, index) => {
        tailwindConfig.theme.extend.colors[`palette-${index + 1}`] = color
      })
      
      const jsContent = `module.exports = ${JSON.stringify(tailwindConfig, null, 2)}`
      this.downloadFile(jsContent, 'tailwind.config.js', 'text/javascript')
      this.showToast('Tailwind config exported!', 'success')
    },

    exportAsJSON() {
      const json = {
        palette: this.palette,
        colors: this.palette.map((color, index) => ({
          id: index + 1,
          hex: color
        }))
      }
      this.downloadFile(JSON.stringify(json, null, 2), 'palette.json', 'application/json')
      this.showToast('JSON exported!', 'success')
    },

    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
      this.showExportModal = false
    },

    showToast(message, type) {
      if (this.toastTimeout) clearTimeout(this.toastTimeout)
      this.toastMessage = message
      this.toastType = type
      this.toastTimeout = setTimeout(() => {
        this.toastMessage = ''
      }, 3000)
    }
  },
  mounted() {
    this.generatePalette()
  }
}
</script>

<style scoped>
/* Same styles as before - keeping them for brevity */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.color-palette-generator {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
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
  background: rgba(255, 255, 255, 0.1);
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
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto;
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 32px;
}

@media (max-width: 968px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
}

/* Card Styles */
.card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 22px;
  height: 22px;
  color: #8b5cf6;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  flex: 1;
}

.card-body {
  padding: 24px;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 14px;
}

.tab-btn {
  flex: 1;
  padding: 10px;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  transition: all 0.2s ease;
}

.tab-btn.active {
  background: white;
  color: #8b5cf6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Sections */
.section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.section:first-child {
  margin-top: 0;
  padding-top: 0;
  border-top: none;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
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

.color-input-group {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-picker {
  width: 50px;
  height: 50px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
}

.color-hex-input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-family: monospace;
  font-size: 0.875rem;
}

.random-btn {
  padding: 10px;
  background: #f1f5f9;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.random-btn:hover {
  background: #e2e8f0;
}

/* Scheme Buttons */
.scheme-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scheme-btn {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.scheme-btn.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

/* Number Control */
.number-control {
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: center;
}

.num-btn {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.num-btn:hover {
  background: #e2e8f0;
}

.num-value {
  font-size: 1.125rem;
  font-weight: 600;
  min-width: 40px;
  text-align: center;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.upload-area:hover {
  border-color: #8b5cf6;
  background: #f8fafc;
}

.upload-placeholder {
  padding: 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-placeholder svg {
  color: #94a3b8;
}

.upload-placeholder span {
  font-size: 0.875rem;
  color: #475569;
}

.upload-preview {
  position: relative;
  padding: 16px;
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 200px;
  border-radius: 12px;
}

.clear-image-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
}

/* Slider */
.slider {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #8b5cf6;
  cursor: pointer;
}

.slider-value {
  text-align: center;
  margin-top: 8px;
  font-size: 0.75rem;
  color: #64748b;
}

/* Blindness Buttons */
.blindness-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.blind-btn {
  flex: 1;
  padding: 8px 12px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.blind-btn.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

/* Generate Button */
.btn-generate {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: white;
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
  margin-top: 16px;
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Export Buttons */
.export-buttons {
  display: flex;
  gap: 8px;
}

.export-btn {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.export-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.export-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Palette Display */
.palette-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.color-card {
  aspect-ratio: 1;
  border-radius: 16px;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.color-card:hover {
  transform: scale(0.98);
}

.color-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
  border-radius: 0 0 16px 16px;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.color-code {
  font-size: 0.75rem;
  font-family: monospace;
  font-weight: 600;
}

.color-actions {
  display: flex;
  gap: 8px;
}

.color-action-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
}

.color-action-btn:hover {
  background: rgba(255,255,255,0.4);
}

.color-action-btn.locked {
  background: #f59e0b;
}

/* Empty Palette */
.empty-palette {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.empty-palette svg {
  margin-bottom: 16px;
  color: #cbd5e1;
}

/* CSS Preview */
.css-preview {
  margin-top: 24px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.preview-examples {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview-box {
  padding: 12px;
  text-align: center;
  border-radius: 10px;
  font-weight: 500;
  font-size: 0.875rem;
}

.gradient-preview {
  padding: 24px;
  text-align: center;
  border-radius: 10px;
  color: white;
  font-weight: 500;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 90%;
  max-width: 500px;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #94a3b8;
}

.modal-body {
  padding: 24px;
}

.export-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.export-option-btn {
  padding: 12px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.export-option-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 12px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  z-index: 10000;
  animation: slideIn 0.3s ease;
}

.toast.success {
  background: #10b981;
}

.toast.error {
  background: #ef4444;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>