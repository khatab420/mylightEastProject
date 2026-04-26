<template>
  <div class="svg-optimizer">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="hero-title">SVG Optimizer</h1>
        <p class="hero-description">
          Clean, minify, and optimize SVG files. Remove unused code while keeping your graphics perfect.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Optimization Options -->
      <div class="options-card">
        <div class="options-header">
          <h3>⚙️ Optimization Options</h3>
          <div class="options-actions">
            <button @click="selectAllOptions" class="option-btn">Select All</button>
            <button @click="deselectAllOptions" class="option-btn">Deselect All</button>
            <button @click="resetToDefault" class="option-btn">Reset to Default</button>
          </div>
        </div>
        <div class="options-grid">
          <label class="option-item">
            <input type="checkbox" v-model="options.removeMetadata">
            <span class="option-name">Remove Metadata</span>
            <span class="option-desc">Remove &lt;metadata&gt;, &lt;title&gt;, &lt;desc&gt;</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeComments">
            <span class="option-name">Remove Comments</span>
            <span class="option-desc">Strip all XML comments</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeHiddenElements">
            <span class="option-name">Remove Hidden Elements</span>
            <span class="option-desc">Remove elements with display:none or visibility:hidden</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.minifyStyles">
            <span class="option-name">Minify Styles</span>
            <span class="option-desc">Compress CSS classes and inline styles</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.collapseGroups">
            <span class="option-name">Collapse Groups</span>
            <span class="option-desc">Merge &lt;g&gt; elements when possible</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.prettify">
            <span class="option-name">Prettify Output</span>
            <span class="option-desc">Format output with proper indentation</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.removeUselessStrokeAndFill">
            <span class="option-name">Remove Useless Stroke & Fill</span>
            <span class="option-desc">Remove attributes without effect</span>
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="options.convertColors">
            <span class="option-name">Convert Colors</span>
            <span class="option-desc">Convert to shortest hex notation</span>
          </label>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-grid">
        <!-- Input Section -->
        <div class="input-section">
          <div class="section-header">
            <h3>📁 Input SVG</h3>
            <div class="section-actions">
              <label class="upload-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload SVG
                <input type="file" @change="handleFileUpload" accept=".svg,image/svg+xml" class="hidden">
              </label>
              <label class="upload-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Convert Image
                <input type="file" @change="handleImageToSVG" accept=".jpg,.jpeg,.png" class="hidden">
              </label>
              <button @click="clearInput" class="clear-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
          </div>
          <div class="editor-container">
            <textarea
              v-model="inputSvg"
              @input="optimizeSVG"
              class="svg-editor"
              placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Your SVG code here -->
  <circle cx="50" cy="50" r="40" fill="red" />
</svg>'
              spellcheck="false"
            ></textarea>
          </div>
          <div class="section-footer">
            <div class="size-info">
              <span class="size-badge">Input Size: {{ formatBytes(inputSize) }}</span>
              <span class="size-badge">Lines: {{ inputLines }}</span>
            </div>
            <div class="preview-container" v-if="inputSvg && isValidSvg">
              <div class="preview-header">
                <span>🖼️ Preview</span>
                <button @click="downloadSVG(inputSvg, 'input.svg')" class="preview-download">Download</button>
              </div>
              <div class="svg-preview" v-html="sanitizedInputSvg"></div>
            </div>
            <div v-if="inputSvg && !isValidSvg" class="error-message">
              ⚠️ Invalid SVG format. Please check your code.
            </div>
          </div>
        </div>

        <!-- Optimization Controls -->
        <div class="optimization-controls">
          <div class="controls-card">
            <button @click="optimizeSVG" class="optimize-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Optimize SVG
            </button>
            <div class="optimization-stats" v-if="optimizationStats">
              <div class="stat">
                <span class="stat-label">Reduction:</span>
                <span class="stat-value" :class="optimizationStats.percentage > 0 ? 'success' : 'neutral'">
                  {{ optimizationStats.percentage }}%
                </span>
              </div>
              <div class="stat">
                <span class="stat-label">Saved:</span>
                <span class="stat-value success">{{ formatBytes(optimizationStats.saved) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Output Section -->
        <div class="output-section">
          <div class="section-header">
            <h3>✨ Optimized SVG</h3>
            <div class="section-actions">
              <button @click="copyToClipboard" class="action-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
              <button @click="downloadSVG(outputSvg, 'optimized.svg')" class="action-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
          <div class="editor-container">
            <textarea
              v-model="outputSvg"
              readonly
              class="svg-editor output"
              spellcheck="false"
            ></textarea>
          </div>
          <div class="section-footer">
            <div class="size-info">
              <span class="size-badge">Output Size: {{ formatBytes(outputSize) }}</span>
              <span class="size-badge">Lines: {{ outputLines }}</span>
            </div>
            <div class="preview-container" v-if="outputSvg && isValidOutput">
              <div class="preview-header">
                <span>🖼️ Optimized Preview</span>
                <button @click="downloadSVG(outputSvg, 'optimized.svg')" class="preview-download">Download</button>
              </div>
              <div class="svg-preview" v-html="sanitizedOutputSvg"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Comparison Chart -->
      <div v-if="optimizationStats" class="comparison-card">
        <h3>📊 Size Comparison</h3>
        <div class="comparison-bars">
          <div class="bar-container">
            <div class="bar-label">Input</div>
            <div class="bar-wrapper">
              <div class="bar input-bar" :style="{ width: comparisonPercent.input + '%' }">
                {{ formatBytes(inputSize) }}
              </div>
            </div>
          </div>
          <div class="bar-container">
            <div class="bar-label">Output</div>
            <div class="bar-wrapper">
              <div class="bar output-bar" :style="{ width: comparisonPercent.output + '%' }">
                {{ formatBytes(outputSize) }}
              </div>
            </div>
          </div>
          <div class="bar-container" v-if="optimizationStats.saved > 0">
            <div class="bar-label">Saved</div>
            <div class="bar-wrapper">
              <div class="bar saved-bar" :style="{ width: comparisonPercent.saved + '%' }">
                {{ formatBytes(optimizationStats.saved) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <h3>💡 Optimization Tips</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">🎨</span>
            <div class="tip-content">
              <strong>Remove metadata</strong>
              <p>Remove unnecessary metadata, comments, and editor-specific data</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">📐</span>
            <div class="tip-content">
              <strong>Simplify paths</strong>
              <p>Use path data optimization to reduce path complexity</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🎯</span>
            <div class="tip-content">
              <strong>Remove hidden elements</strong>
              <p>Elements with display:none or visibility:hidden can be safely removed</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⚡</span>
            <div class="tip-content">
              <strong>Minify styles</strong>
              <p>Convert inline styles to attributes and remove unnecessary CSS</p>
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
import { optimize } from 'svgo'
import * as potrace from 'potrace'

export default {
  name: 'SVGOptimizer',
  data() {
    return {
      inputSvg: '',
      outputSvg: '',
      options: {
        removeMetadata: true,
        removeComments: true,
        removeHiddenElements: true,
        minifyStyles: true,
        collapseGroups: true,
        prettify: false,
        removeUselessStrokeAndFill: true,
        convertColors: true
      },
      optimizationStats: null,
      toastMessage: '',
      isValidSvg: true,
      isValidOutput: true,
      inputSize: 0,
      outputSize: 0,
      inputLines: 0,
      outputLines: 0,
      sanitizedInputSvg: '',
      sanitizedOutputSvg: ''
    }
  },
  computed: {
    comparisonPercent() {
      if (this.inputSize === 0) return { input: 0, output: 0, saved: 0 }
      const maxSize = Math.max(this.inputSize, this.outputSize)
      return {
        input: (this.inputSize / maxSize) * 100,
        output: (this.outputSize / maxSize) * 100,
        saved: ((this.inputSize - this.outputSize) / maxSize) * 100
      }
    }
  },
  watch: {
    inputSvg: {
      handler() {
        this.calculateInputStats()
        this.validateSVG()
        this.updatePreview()
      },
      immediate: true
    },
    outputSvg: {
      handler() {
        this.calculateOutputStats()
        this.updateOutputPreview()
      },
      immediate: true
    },
    options: {
      handler() {
        this.optimizeSVG()
      },
      deep: true
    }
  },
  methods: {
    async optimizeSVG() {
      if (!this.inputSvg || !this.isValidSvg) return

      try {
        const svgoConfig = this.buildSVGOConfig()
        const result = await optimize(this.inputSvg, svgoConfig)
        
        this.outputSvg = result.data
        
        // Calculate optimization stats
        const inputBytes = new Blob([this.inputSvg]).size
        const outputBytes = new Blob([this.outputSvg]).size
        const saved = inputBytes - outputBytes
        const percentage = inputBytes > 0 ? Math.round((saved / inputBytes) * 100) : 0
        
        this.optimizationStats = {
          saved: saved,
          percentage: percentage
        }
        
        this.showToast('SVG optimized successfully!')
      } catch (error) {
        console.error('Optimization error:', error)
        this.showToast('Error optimizing SVG. Please check your SVG code.')
      }
    },
    
    buildSVGOConfig() {
      const plugins = []
      
      if (this.options.removeMetadata) {
        plugins.push('removeMetadata')
        plugins.push('removeTitle')
        plugins.push('removeDesc')
      }
      
      if (this.options.removeComments) {
        plugins.push('removeComments')
      }
      
      if (this.options.removeHiddenElements) {
        plugins.push('removeHiddenElems')
      }
      
      if (this.options.minifyStyles) {
        plugins.push('minifyStyles')
        plugins.push('inlineStyles')
      }
      
      if (this.options.collapseGroups) {
        plugins.push('collapseGroups')
      }
      
      if (this.options.removeUselessStrokeAndFill) {
        plugins.push('removeUselessStrokeAndFill')
      }
      
      if (this.options.convertColors) {
        plugins.push('convertColors')
      }
      
      // Always include these basic optimizations
      plugins.push('removeDoctype')
      plugins.push('removeXMLProcInst')
      plugins.push('removeEditorsNSData')
      plugins.push('cleanupAttrs')
      plugins.push('mergeStyles')
      plugins.push('inlineStyles')
      plugins.push('minifyStyles')
      plugins.push('cleanupIDs')
      plugins.push('removeRasterImages')
      plugins.push('removeUselessDefs')
      plugins.push('cleanupNumericValues')
      plugins.push('cleanupListOfValues')
      plugins.push('convertShapeToPath')
      plugins.push('convertEllipseToCircle')
      plugins.push('sortAttrs')
      
      // Remove duplicates
      const uniquePlugins = [...new Set(plugins)]
      
      return {
        multipass: true,
        plugins: uniquePlugins.map(plugin => {
          if (typeof plugin === 'string') {
            return { name: plugin, active: true }
          }
          return plugin
        })
      }
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        this.inputSvg = e.target.result
        this.showToast(`Loaded file: ${file.name}`)
      }
      reader.readAsText(file)
    },
    
    handleImageToSVG(event) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          // Convert image to SVG using potrace
          potrace.trace(img.src, (err, svg) => {
            if (err) {
              this.showToast('Error converting image to SVG')
              return
            }
            this.inputSvg = svg
            this.showToast(`Converted ${file.name} to SVG`)
          })
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    
    clearInput() {
      this.inputSvg = ''
      this.outputSvg = ''
      this.optimizationStats = null
      this.showToast('Cleared all content')
    },
    
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.outputSvg)
        this.showToast('Optimized SVG copied to clipboard!')
      } catch (err) {
        this.showToast('Failed to copy to clipboard')
      }
    },
    
    downloadSVG(svgContent, filename) {
      const blob = new Blob([svgContent], { type: 'image/svg+xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      this.showToast(`Downloaded ${filename}`)
    },
    
    selectAllOptions() {
      Object.keys(this.options).forEach(key => {
        this.options[key] = true
      })
    },
    
    deselectAllOptions() {
      Object.keys(this.options).forEach(key => {
        this.options[key] = false
      })
    },
    
    resetToDefault() {
      this.options = {
        removeMetadata: true,
        removeComments: true,
        removeHiddenElements: true,
        minifyStyles: true,
        collapseGroups: true,
        prettify: false,
        removeUselessStrokeAndFill: true,
        convertColors: true
      }
    },
    
    calculateInputStats() {
      this.inputSize = new Blob([this.inputSvg]).size
      this.inputLines = this.inputSvg.split('\n').length
    },
    
    calculateOutputStats() {
      this.outputSize = new Blob([this.outputSvg]).size
      this.outputLines = this.outputSvg.split('\n').length
    },
    
    validateSVG() {
      if (!this.inputSvg.trim()) {
        this.isValidSvg = true
        return
      }
      
      const svgRegex = /<svg[\s\S]*?>[\s\S]*?<\/svg>/i
      this.isValidSvg = svgRegex.test(this.inputSvg)
    },
    
    updatePreview() {
      if (this.isValidSvg && this.inputSvg) {
        this.sanitizedInputSvg = this.inputSvg
      } else {
        this.sanitizedInputSvg = ''
      }
    },
    
    updateOutputPreview() {
      if (this.outputSvg) {
        this.sanitizedOutputSvg = this.outputSvg
        this.isValidOutput = true
      } else {
        this.sanitizedOutputSvg = ''
        this.isValidOutput = false
      }
    },
    
    formatBytes(bytes) {
      if (bytes === 0) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
.svg-optimizer {
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
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px 48px;
  position: relative;
  z-index: 20;
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
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.options-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.options-actions {
  display: flex;
  gap: 12px;
}

.option-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.option-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.option-name {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.option-desc {
  font-size: 12px;
  color: #6b7280;
  margin-left: auto;
}

/* Content Grid */
.content-grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.input-section,
.output-section {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.section-actions {
  display: flex;
  gap: 8px;
}

.upload-btn,
.action-btn,
.clear-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
}

.upload-btn:hover,
.action-btn:hover,
.clear-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.hidden {
  display: none;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

/* Editor Container */
.editor-container {
  height: 400px;
  overflow: auto;
}

.svg-editor {
  width: 100%;
  height: 100%;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  border: none;
  resize: none;
  outline: none;
  background: white;
  color: #1f2937;
}

.svg-editor.output {
  background: #f9fafb;
  color: #374151;
}

.svg-editor::placeholder {
  color: #d1d5db;
  font-style: italic;
}

.section-footer {
  padding: 12px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.size-info {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.size-badge {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

.preview-container {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.preview-download {
  padding: 4px 8px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 11px;
  cursor: pointer;
  transition: background 0.2s;
}

.preview-download:hover {
  background: #5a67d8;
}

.svg-preview {
  max-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
}

.svg-preview svg {
  max-width: 100%;
  max-height: 150px;
}

.error-message {
  margin-top: 12px;
  padding: 8px 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
  font-size: 13px;
}

/* Optimization Controls */
.optimization-controls {
  display: flex;
  align-items: center;
  justify-content: center;
}

.controls-card {
  text-align: center;
}

.optimize-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.optimize-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

.optimization-stats {
  margin-top: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.stat {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  font-size: 14px;
  margin-bottom: 8px;
}

.stat:last-child {
  margin-bottom: 0;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 700;
}

.stat-value.success {
  color: #10b981;
}

.stat-value.neutral {
  color: #6b7280;
}

/* Comparison Card */
.comparison-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.comparison-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
}

.comparison-bars {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.bar-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.bar-label {
  width: 60px;
  font-weight: 600;
  color: #374151;
}

.bar-wrapper {
  flex: 1;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.bar {
  padding: 8px 12px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  transition: width 0.3s ease;
}

.input-bar {
  background: linear-gradient(90deg, #ef4444, #f97316);
}

.output-bar {
  background: linear-gradient(90deg, #10b981, #34d399);
}

.saved-bar {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .optimization-controls {
    order: -1;
  }
  
  .hero-title {
    font-size: 36px;
  }
}

@media (max-width: 640px) {
  .hero-content {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .main-container {
    padding: 20px 16px 32px;
  }
  
  .options-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .options-actions {
    justify-content: center;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: center;
  }
  
  .editor-container {
    height: 300px;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .bar-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .bar-label {
    width: auto;
  }
}
</style>