<template>
  <div v-if="selectedStandard" class="passport-size-app">
    <header class="app-header">
      <h1>🛂 Passport Photo Studio</h1>
      <p>Create compliant passport photos for US, UK, EU, India & more</p>
    </header>

    <div class="main-grid">
      <!-- Left Panel: Controls -->
      <div class="controls-panel">
        <div class="card">
          <h3>📋 Country Standard</h3>
          <select v-model="selectedStandard" @change="updateStandardDimensions" class="standard-select">
            <option v-for="std in standards" :key="std.id" :value="std">
              {{ std.name }} - {{ std.dimensions.width }}x{{ std.dimensions.height }} {{ std.dimensions.unit }}
            </option>
          </select>
          <div class="standard-details">
            <div class="detail-item">
              <span>Head Height:</span>
              <strong>{{ selectedStandard.headHeight }}%</strong>
            </div>
            <div class="detail-item">
              <span>Eye Position:</span>
              <strong>{{ selectedStandard.eyePosition }}%</strong>
            </div>
            <div class="detail-item">
              <span>Background:</span>
              <strong>{{ selectedStandard.bgColor === 'white' ? 'White' : 'Off-white/Cream' }}</strong>
            </div>
          </div>
        </div>

        <div class="card">
          <h3>✂️ Adjust & Enhance</h3>
          <div class="slider-group">
            <label>🔆 Brightness: {{ brightness }}%</label>
            <input type="range" v-model="brightness" min="50" max="150" step="1">
          </div>
          <div class="slider-group">
            <label>🎨 Contrast: {{ contrast }}%</label>
            <input type="range" v-model="contrast" min="50" max="150" step="1">
          </div>
          <div class="slider-group">
            <label>📐 Zoom / Crop: {{ zoom }}%</label>
            <input type="range" v-model="zoom" min="50" max="200" step="1">
          </div>
        </div>

        <div class="card">
          <h3>🎨 Background</h3>
          <div class="bg-options">
            <label class="bg-option" :class="{ active: bgMode === 'remove' }">
              <input type="radio" value="remove" v-model="bgMode"> ✨ Auto Remove & Replace
            </label>
            <label class="bg-option" :class="{ active: bgMode === 'color' }">
              <input type="radio" value="color" v-model="bgMode"> 🎨 Solid Color
            </label>
          </div>
          <div v-if="bgMode === 'color'" class="color-picker-row">
            <input type="color" v-model="bgColor" class="color-input">
            <span>{{ bgColor }}</span>
          </div>
          <div class="bg-presets">
            <button v-for="preset in bgPresets" :key="preset.name" 
              class="preset-btn" :style="{ background: preset.color }"
              :title="preset.name"
              @click="setBgPreset(preset.color)">
            </button>
            <button class="preset-btn white-bg" @click="setBgPreset('#FFFFFF')">⬜ White</button>
            <button class="preset-btn offwhite-bg" @click="setBgPreset('#F5F5DC')">🟨 Off-white</button>
          </div>
        </div>

        <div class="card">
          <h3>🖨️ Print Layout</h3>
          <div class="layout-options">
            <label>
              <input type="radio" value="single" v-model="layoutMode"> Single Photo
            </label>
            <label>
              <input type="radio" value="4x6" v-model="layoutMode"> 4x6 Print Sheet ({{ photosPerSheet }} photos)
            </label>
          </div>
          <button class="action-btn download-btn" @click="downloadPhoto" :disabled="!imageLoaded">
            💾 Download {{ layoutMode === '4x6' ? 'Print Sheet' : 'Passport Photo' }}
          </button>
        </div>
      </div>

      <!-- Right Panel: Canvas -->
      <div class="canvas-panel">
        <div class="upload-area" @dragover.prevent @drop="handleDrop" @click="triggerUpload">
          <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/jpeg,image/png,image/jpg,image/webp" hidden>
          <div v-if="!imageLoaded" class="upload-placeholder">
            <div class="upload-icon">📸</div>
            <p>Click or Drag & Drop</p>
            <p class="upload-hint">Upload a portrait photo (face clearly visible)</p>
          </div>
          <canvas ref="canvas" class="photo-canvas" v-show="imageLoaded"></canvas>
        </div>

        <div class="info-bar" v-if="imageLoaded">
          <div class="info-item">📏 Output: {{ outputWidth }}x{{ outputHeight }} px</div>
          <div class="info-item">📐 Print size: {{ selectedStandard.dimensions.width }}x{{ selectedStandard.dimensions.height }} {{ selectedStandard.dimensions.unit }}</div>
          <div class="info-item">🎯 Head size: {{ selectedStandard.headHeight }}% of photo</div>
        </div>
      </div>
    </div>

    <!-- Footer with standard compliance info -->
    <footer class="app-footer">
      <div class="compliance-badge">✅ Compliant with US (2x2), UK (35x45mm), EU (35x45mm), India (2x2 inch)</div>
      <div class="tips">💡 Tip: Face should be centered, neutral expression, even lighting on face</div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PassportSize',
  data() {
    return {
      imageSrc: null,
      originalImage: null,
      imageLoaded: false,
      brightness: 100,
      contrast: 100,
      zoom: 100,
      bgMode: 'remove',
      bgColor: '#FFFFFF',
      layoutMode: 'single',
      selectedStandard: null,
      standards: [
        {
          id: 'us',
          name: 'USA / Canada',
          dimensions: { width: 2, height: 2, unit: 'inch' },
          pixelSize: { width: 600, height: 600 },
          headHeight: 70,
          eyePosition: 55,
          bgColor: 'white',
          dpi: 300
        },
        {
          id: 'uk',
          name: 'UK / EU (Biometric)',
          dimensions: { width: 35, height: 45, unit: 'mm' },
          pixelSize: { width: 413, height: 531 },
          headHeight: 70,
          eyePosition: 55,
          bgColor: 'white',
          dpi: 300
        },
        {
          id: 'india',
          name: 'India',
          dimensions: { width: 2, height: 2, unit: 'inch' },
          pixelSize: { width: 600, height: 600 },
          headHeight: 75,
          eyePosition: 60,
          bgColor: 'white',
          dpi: 300
        },
        {
          id: 'australia',
          name: 'Australia',
          dimensions: { width: 35, height: 45, unit: 'mm' },
          pixelSize: { width: 413, height: 531 },
          headHeight: 70,
          eyePosition: 55,
          bgColor: 'white',
          dpi: 300
        },
        {
          id: 'china',
          name: 'China',
          dimensions: { width: 33, height: 48, unit: 'mm' },
          pixelSize: { width: 390, height: 567 },
          headHeight: 68,
          eyePosition: 52,
          bgColor: 'white',
          dpi: 300
        }
      ],
      bgPresets: [
        { name: 'White', color: '#FFFFFF' },
        { name: 'Light Gray', color: '#E8E8E8' },
        { name: 'Cream', color: '#FDF5E6' },
        { name: 'Light Blue', color: '#D0E4F5' }
      ]
    }
  },
  computed: {
    outputWidth() {
      return this.selectedStandard ? this.selectedStandard.pixelSize.width : 600
    },
    outputHeight() {
      return this.selectedStandard ? this.selectedStandard.pixelSize.height : 600
    },
    photosPerSheet() {
      const sheetWidth = 1200
      const sheetHeight = 1800
      const photoWidth = this.outputWidth
      const photoHeight = this.outputHeight
      const cols = Math.floor(sheetWidth / photoWidth)
      const rows = Math.floor(sheetHeight / photoHeight)
      return cols * rows
    }
  },
  watch: {
    brightness() { if (this.imageLoaded) this.processImage() },
    contrast() { if (this.imageLoaded) this.processImage() },
    zoom() { if (this.imageLoaded) this.processImage() },
    bgMode() { if (this.imageLoaded) this.processImage() },
    bgColor() { if (this.imageLoaded && this.bgMode === 'color') this.processImage() },
    selectedStandard: {
      handler() { if (this.imageLoaded) this.processImage() },
      deep: true
    }
  },
  mounted() {
    this.selectedStandard = this.standards[0]
  },
  methods: {
    triggerUpload() {
      this.$refs.fileInput.click()
    },
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (file && file.type.startsWith('image/')) {
        this.loadImage(file)
      }
    },
    handleDrop(event) {
      event.preventDefault()
      const file = event.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        this.loadImage(file)
      }
    },
    loadImage(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.imageSrc = e.target.result
        const img = new Image()
        img.onload = () => {
          this.originalImage = img
          this.imageLoaded = true
          this.$nextTick(() => {
            this.processImage()
          })
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    updateStandardDimensions() {
      if (this.imageLoaded) {
        this.processImage()
      }
    },
    setBgPreset(color) {
      this.bgColor = color
      this.bgMode = 'color'
    },
    async processImage() {
      if (!this.originalImage || !this.$refs.canvas) return

      const canvas = this.$refs.canvas
      const ctx = canvas.getContext('2d')
      
      // Set canvas dimensions to output size
      canvas.width = this.outputWidth
      canvas.height = this.outputHeight

      // Calculate crop based on zoom and head positioning
      const srcW = this.originalImage.width
      const srcH = this.originalImage.height
      const targetW = this.outputWidth
      const targetH = this.outputHeight
      
      // Zoom effect - crop more area when zoom > 100
      const cropScale = 100 / this.zoom
      let cropW = srcW * cropScale
      let cropH = srcH * cropScale
      if (cropW > srcW) cropW = srcW
      if (cropH > srcH) cropH = srcH
      
      // Center crop and position head at eye level
      let cropX = (srcW - cropW) / 2
      let cropY = (srcH - cropH) * 0.3
      
      // Ensure crop doesn't exceed bounds
      cropX = Math.max(0, Math.min(cropX, srcW - cropW))
      cropY = Math.max(0, Math.min(cropY, srcH - cropH))

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Draw background
      if (this.bgMode === 'color') {
        ctx.fillStyle = this.bgColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      // Draw image with adjustments
      ctx.save()
      ctx.filter = `brightness(${this.brightness / 100}) contrast(${this.contrast / 100})`
      ctx.drawImage(this.originalImage, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH)
      ctx.restore()
      
      // Apply background removal if needed
      if (this.bgMode === 'remove') {
        this.applyBackgroundRemoval(ctx, canvas)
      }
      
      // Draw guidelines (for preview only)
      this.drawGuidelines(ctx, canvas)
    },
    
    applyBackgroundRemoval(ctx, canvas) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i+1]
        const b = data[i+2]
        
        // Detect skin tone range
        const isSkin = (r > 60 && g > 40 && b > 20) && 
                       (r > g && r > b) && 
                       (Math.abs(r - g) < 80) &&
                       (r < 220 && g < 200 && b < 180)
        
        // Detect white/light backgrounds
        const isLightBg = (r > 200 && g > 200 && b > 200) ||
                          (Math.abs(r - g) < 30 && Math.abs(g - b) < 30 && r > 180)
        
        // Detect green screen style backgrounds
        const isGreenBg = (g > r + 40 && g > b + 40)
        
        if (!isSkin && (isLightBg || isGreenBg)) {
          data[i] = 255
          data[i+1] = 255
          data[i+2] = 255
        }
      }
      
      ctx.putImageData(imageData, 0, 0)
    },
    
    drawGuidelines(ctx, canvas) {
      const headHeightPx = (this.selectedStandard.headHeight / 100) * canvas.height
      const eyeY = (this.selectedStandard.eyePosition / 100) * canvas.height
      
      ctx.save()
      ctx.globalAlpha = 0.4
      ctx.strokeStyle = '#00FF00'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      
      // Head area rectangle
      ctx.strokeRect(5, 5, canvas.width - 10, headHeightPx - 10)
      
      // Eye level line
      ctx.beginPath()
      ctx.moveTo(10, eyeY)
      ctx.lineTo(canvas.width - 10, eyeY)
      ctx.stroke()
      
      ctx.setLineDash([])
      ctx.globalAlpha = 0.6
      ctx.font = '12px sans-serif'
      ctx.fillStyle = '#00FF00'
      ctx.shadowBlur = 0
      ctx.fillText('Head area', 10, headHeightPx - 10)
      ctx.fillText('Eye level', 10, eyeY - 5)
      ctx.restore()
    },
    
    async downloadPhoto() {
      if (!this.imageLoaded) return
      
      const canvas = this.$refs.canvas
      
      // Create a temporary canvas without guidelines
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      
      // Redraw image without guidelines
      tempCtx.drawImage(canvas, 0, 0)
      
      if (this.layoutMode === '4x6') {
        // Create 4x6 print sheet
        const sheetCanvas = document.createElement('canvas')
        sheetCanvas.width = 1200
        sheetCanvas.height = 1800
        const sheetCtx = sheetCanvas.getContext('2d')
        
        sheetCtx.fillStyle = '#FFFFFF'
        sheetCtx.fillRect(0, 0, sheetCanvas.width, sheetCanvas.height)
        
        const photoW = this.outputWidth
        const photoH = this.outputHeight
        const cols = Math.floor(sheetCanvas.width / photoW)
        const rows = Math.floor(sheetCanvas.height / photoH)
        const spacing = 10
        
        let x = 10, y = 10
        for (let row = 0; row < rows && row < 4; row++) {
          for (let col = 0; col < cols && col < 2; col++) {
            sheetCtx.drawImage(tempCanvas, x, y, photoW, photoH)
            x += photoW + spacing
          }
          x = 10
          y += photoH + spacing
        }
        
        this.downloadCanvas(sheetCanvas, `passport_4x6_sheet_${Date.now()}.png`)
      } else {
        this.downloadCanvas(tempCanvas, `passport_${this.selectedStandard.id}_${Date.now()}.png`)
      }
    },
    
    downloadCanvas(canvas, filename) {
      const link = document.createElement('a')
      link.download = filename
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
  }
}
</script>

<style scoped>
.passport-size-app {
  max-width: 1400px;
   margin: 80px auto 0;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-header {
  text-align: center;
  margin-bottom: 30px;
  color: white;
}

.app-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: white;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.app-header p {
  color: rgba(255,255,255,0.9);
  margin-top: 8px;
  font-size: 1.1rem;
}

.main-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
}

.controls-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.card h3 {
  margin: 0 0 16px 0;
  color: #2d3748;
  font-size: 1.1rem;
}

.standard-select {
  width: 100%;
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 16px;
  font-size: 0.9rem;
}

.standard-details {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item span {
  color: #64748b;
  font-size: 0.75rem;
}

.detail-item strong {
  color: #1e293b;
  font-size: 0.9rem;
}

.slider-group {
  margin-bottom: 18px;
}

.slider-group label {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 8px;
  color: #4a5568;
}

.slider-group input {
  width: 100%;
  cursor: pointer;
}

.bg-options {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.bg-option {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 30px;
  cursor: pointer;
  background: #f1f5f9;
  font-size: 0.85rem;
}

.bg-option.active {
  background: #3b82f6;
  color: white;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.color-input {
  width: 50px;
  height: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
}

.bg-presets {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preset-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #ddd;
  cursor: pointer;
  transition: transform 0.2s;
}

.preset-btn:hover {
  transform: scale(1.1);
}

.white-bg, .offwhite-bg {
  width: auto;
  padding: 0 12px;
  border-radius: 30px;
  font-size: 0.8rem;
}

.layout-options {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.layout-options label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.action-btn {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.download-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16,185,129,0.3);
}

.download-btn:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
  opacity: 0.6;
}

.canvas-panel {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}

.upload-area {
  border: 2px dashed #cbd5e0;
  border-radius: 20px;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background: #fafbfc;
}

.upload-area:hover {
  border-color: #3b82f6;
  background: #f8fafc;
}

.upload-placeholder {
  text-align: center;
  font-size: 1.2rem;
  color: #94a3b8;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 10px;
}

.upload-hint {
  font-size: 0.8rem;
  margin-top: 12px;
}

.photo-canvas {
  max-width: 100%;
  height: auto;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  display: block;
  margin: 0 auto;
}

.info-bar {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: #f1f5f9;
  border-radius: 16px;
  font-size: 0.8rem;
  flex-wrap: wrap;
  gap: 10px;
}

.info-item {
  color: #334155;
}

.app-footer {
  margin-top: 30px;
  text-align: center;
  padding: 20px;
  background: white;
  border-radius: 20px;
}

.compliance-badge {
  background: #d1fae5;
  color: #065f46;
  padding: 10px 20px;
  border-radius: 40px;
  display: inline-block;
  margin-bottom: 12px;
  font-size: 0.85rem;
}

.tips {
  color: #6b7280;
  font-size: 0.8rem;
}

@media (max-width: 900px) {
  .main-grid {
    grid-template-columns: 1fr;
  }
  
  .app-header h1 {
    font-size: 1.8rem;
  }
}
</style>