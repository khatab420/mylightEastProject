<template>
  <div class="json-formatter">
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div class="header-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>JSON Toolkit</span>
        </div>
        <h1>JSON Formatter & Validator</h1>
        <p class="subtitle">
          Format, validate, and transform JSON data with powerful visualization tools
        </p>
      </div>

      <div class="main-layout">
        <!-- Left Panel - Input & Actions -->
        <div class="card input-panel">
          <div class="card-header">
            <div class="header-left">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
              <h2>JSON Input</h2>
            </div>
            <div class="header-actions">
              <button @click="clearInput" class="icon-btn" title="Clear">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
              <button @click="loadExample" class="icon-btn" title="Load Example">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- JSON Input Area -->
            <div class="input-wrapper" :class="{ 'has-error': validationError }">
              <textarea
                ref="jsonInput"
                v-model="jsonInput"
                placeholder='{"example": "Paste or type your JSON here..."}'
                class="json-input"
                @input="handleInput"
                spellcheck="false"
              ></textarea>
              <div v-if="validationError" class="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>Line {{ errorLine }}: {{ validationError }}</span>
              </div>
              <div v-else-if="isValid && jsonInput.trim()" class="success-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                <span>Valid JSON</span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button @click="formatJSON" class="btn-primary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                Pretty Print
              </button>
              <button @click="minifyJSON" class="btn-secondary">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polyline points="6 15 12 9 18 15" />
                </svg>
                Minify
              </button>
              <button @click="copyToClipboard" class="btn-secondary" :disabled="!jsonOutput && !formattedJSON">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </button>
              <button @click="downloadJSON" class="btn-secondary" :disabled="!jsonOutput && !formattedJSON">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download
              </button>
            </div>

            <!-- Stats -->
            <div v-if="jsonStats" class="stats-card">
              <div class="stat-item">
                <span class="stat-label">Size</span>
                <span class="stat-value">{{ jsonStats.size }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Lines</span>
                <span class="stat-value">{{ jsonStats.lines }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Characters</span>
                <span class="stat-value">{{ jsonStats.chars }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">Type</span>
                <span class="stat-value">{{ jsonStats.type }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Output & Visualization -->
        <div class="card output-panel">
          <div class="card-header">
            <div class="header-left">
              <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 2 7 12 12 22 7 12 2" />
                <polyline points="2 17 12 22 22 17" />
                <polyline points="2 12 12 17 22 12" />
              </svg>
              <h2>Output</h2>
            </div>
            <div class="view-toggle">
              <button
                @click="viewMode = 'formatted'"
                :class="['toggle-btn', { active: viewMode === 'formatted' }]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 7h16M4 12h16M4 17h10" />
                </svg>
                Formatted
              </button>
              <button
                @click="viewMode = 'tree'"
                :class="['toggle-btn', { active: viewMode === 'tree' }]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M6 3v12M10 3v12M14 3v12M18 3v12" />
                  <path d="M4 21h16" />
                </svg>
                Tree View
              </button>
              <button
                v-if="isValid && jsonData"
                @click="showCSVModal = true"
                :class="['toggle-btn', { active: viewMode === 'csv' }]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="8" y1="9" x2="16" y2="9" />
                  <line x1="8" y1="13" x2="16" y2="13" />
                  <line x1="8" y1="17" x2="12" y2="17" />
                </svg>
                CSV
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- Formatted JSON View -->
            <div v-show="viewMode === 'formatted'" class="output-wrapper">
              <pre class="json-output" v-html="highlightedJSON"></pre>
              <div v-if="!jsonOutput && !formattedJSON" class="output-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <p>Formatted JSON will appear here</p>
                <small>Click "Pretty Print" or "Minify" to start</small>
              </div>
            </div>

            <!-- Tree View -->
            <div v-show="viewMode === 'tree'" class="tree-wrapper">
              <div v-if="isValid && jsonData" class="tree-view">
                <JsonTreeNode :data="jsonData" :name="'root'" :depth="0" />
              </div>
              <div v-else class="output-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p>Valid JSON required for tree view</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CSV Export Modal -->
    <div v-if="showCSVModal" class="modal" @click.self="showCSVModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>JSON to CSV Converter</h3>
          <button @click="showCSVModal = false" class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Select conversion method</label>
            <select v-model="csvConversionType" class="form-select">
              <option value="auto">Auto-detect (First object array)</option>
              <option value="flatten">Flatten nested objects</option>
              <option value="array">Convert array of objects</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">
              <input type="checkbox" v-model="includeHeaders" class="checkbox" />
              Include headers
            </label>
          </div>
          <div class="form-group">
            <label class="form-label">Delimiter</label>
            <select v-model="csvDelimiter" class="form-select">
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
          <div class="modal-actions">
            <button @click="convertToCSV" class="btn-primary">Convert & Download</button>
            <button @click="showCSVModal = false" class="btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js/lib/core'
import jsonLang from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/atom-one-dark.css'

hljs.registerLanguage('json', jsonLang)

// Tree View Component
const JsonTreeNode = {
  name: 'JsonTreeNode',
  props: {
    data: {
      type: [Object, Array, String, Number, Boolean, null],
      required: true
    },
    name: {
      type: String,
      default: ''
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isOpen: this.depth < 2 // Auto-expand first 2 levels
    }
  },
  computed: {
    isObject() {
      return this.data && typeof this.data === 'object' && !Array.isArray(this.data)
    },
    isArray() {
      return Array.isArray(this.data)
    },
    isPrimitive() {
      return !this.isObject && !this.isArray
    },
    keys() {
      if (this.isObject) return Object.keys(this.data)
      if (this.isArray) return this.data.map((_, i) => i)
      return []
    },
    itemCount() {
      return this.keys.length
    },
    valuePreview() {
      if (this.isPrimitive) {
        if (typeof this.data === 'string') return `"${this.data}"`
        return String(this.data)
      }
      return ''
    },
    valueType() {
      if (this.isArray) return 'array'
      if (this.isObject) return 'object'
      if (typeof this.data === 'string') return 'string'
      if (typeof this.data === 'number') return 'number'
      if (typeof this.data === 'boolean') return 'boolean'
      return 'null'
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    },
    formatKey(key) {
      if (this.isArray) return `[${key}]`
      return `"${key}"`
    }
  },
  template: `
    <div class="tree-node" :style="{ marginLeft: depth > 0 ? '20px' : '0' }">
      <div class="tree-node-header" @click="toggle">
        <span v-if="isObject || isArray" class="tree-toggle">
          {{ isOpen ? '▼' : '▶' }}
        </span>
        <span v-if="name !== 'root'" class="tree-key">{{ formatKey(name) }}:</span>
        <span v-if="isPrimitive" :class="['tree-value', valueType]">
          {{ valuePreview }}
        </span>
        <span v-if="isObject || isArray" class="tree-info">
          {{ isObject ? '{...}' : '[...]' }} ({{ itemCount }})
        </span>
      </div>
      <div v-if="(isObject || isArray) && isOpen" class="tree-children">
        <JsonTreeNode
          v-for="key in keys"
          :key="key"
          :data="isArray ? data[key] : data[key]"
          :name="String(key)"
          :depth="depth + 1"
        />
      </div>
    </div>
  `
}

export default {
  name: 'JsonFormatter',
  components: {
    JsonTreeNode
  },
  data() {
    return {
      jsonInput: '',
      formattedJSON: '',
      minifiedJSON: '',
      validationError: null,
      errorLine: null,
      jsonData: null,
      viewMode: 'formatted',
      showCSVModal: false,
      csvConversionType: 'auto',
      csvDelimiter: ',',
      includeHeaders: true,
      jsonStats: null
    }
  },
  computed: {
    isValid() {
      return !this.validationError && this.jsonInput.trim()
    },
    jsonOutput() {
      if (this.viewMode === 'formatted') {
        return this.formattedJSON || this.jsonInput
      }
      return ''
    },
    highlightedJSON() {
      if (!this.jsonOutput) return ''
      try {
        const highlighted = hljs.highlight(this.jsonOutput, { language: 'json' }).value
        return highlighted
      } catch (e) {
        return this.escapeHtml(this.jsonOutput)
      }
    }
  },
  methods: {
    handleInput() {
      this.validateJSON()
      this.updateStats()
    },

    validateJSON() {
      if (!this.jsonInput.trim()) {
        this.validationError = null
        this.errorLine = null
        this.jsonData = null
        return
      }

      try {
        const parsed = JSON.parse(this.jsonInput)
        this.jsonData = parsed
        this.validationError = null
        this.errorLine = null
      } catch (error) {
        this.validationError = error.message
        // Extract line number from error message
        const lineMatch = error.message.match(/position (\d+)/)
        if (lineMatch) {
          const position = parseInt(lineMatch[1])
          const lines = this.jsonInput.substring(0, position).split('\n')
          this.errorLine = lines.length
        }
        this.jsonData = null
      }
    },

    updateStats() {
      if (!this.jsonInput.trim()) {
        this.jsonStats = null
        return
      }

      const lines = this.jsonInput.split('\n').length
      const chars = this.jsonInput.length
      const size = (new Blob([this.jsonInput]).size / 1024).toFixed(2) + ' KB'

      let type = 'Unknown'
      if (this.jsonData) {
        if (Array.isArray(this.jsonData)) type = 'Array[' + this.jsonData.length + ']'
        else if (typeof this.jsonData === 'object') type = 'Object{' + Object.keys(this.jsonData).length + '}'
        else type = typeof this.jsonData
      }

      this.jsonStats = { size, lines, chars, type }
    },

    formatJSON() {
      if (!this.isValid) {
        alert('Please enter valid JSON first')
        return
      }

      try {
        const parsed = JSON.parse(this.jsonInput)
        this.formattedJSON = JSON.stringify(parsed, null, 2)
        this.jsonInput = this.formattedJSON
        this.validateJSON()
        this.updateStats()
      } catch (error) {
        alert('Failed to format JSON: ' + error.message)
      }
    },

    minifyJSON() {
      if (!this.isValid) {
        alert('Please enter valid JSON first')
        return
      }

      try {
        const parsed = JSON.parse(this.jsonInput)
        this.minifiedJSON = JSON.stringify(parsed)
        this.jsonInput = this.minifiedJSON
        this.validateJSON()
        this.updateStats()
      } catch (error) {
        alert('Failed to minify JSON: ' + error.message)
      }
    },

    async copyToClipboard() {
      const textToCopy = this.formattedJSON || this.minifiedJSON || this.jsonInput
      if (!textToCopy) return

      try {
        await navigator.clipboard.writeText(textToCopy)
        this.showToast('Copied to clipboard!', 'success')
      } catch (err) {
        this.showToast('Failed to copy', 'error')
      }
    },

    downloadJSON() {
      const content = this.formattedJSON || this.minifiedJSON || this.jsonInput
      if (!content) return

      const blob = new Blob([content], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `formatted_${Date.now()}.json`
      link.click()
      URL.revokeObjectURL(url)
      this.showToast('Download started!', 'success')
    },

    clearInput() {
      this.jsonInput = ''
      this.formattedJSON = ''
      this.minifiedJSON = ''
      this.validationError = null
      this.jsonData = null
      this.jsonStats = null
      this.$refs.jsonInput.focus()
    },

    loadExample() {
      const example = {
        name: "JSON Formatter Example",
        version: "1.0.0",
        features: ["format", "validate", "minify", "tree-view", "csv-export"],
        settings: {
          theme: "dark",
          autoFormat: true,
          lineNumbers: true
        },
        metadata: {
          created: "2024-01-01",
          author: "Developer",
          stats: {
            downloads: 15000,
            rating: 4.8
          }
        }
      }
      this.jsonInput = JSON.stringify(example, null, 2)
      this.validateJSON()
      this.updateStats()
    },

    convertToCSV() {
      if (!this.jsonData) {
        alert('No valid JSON data to convert')
        return
      }

      let csvData = []
      let headers = []

      // Determine data source
      let dataArray = []
      if (this.csvConversionType === 'array' && Array.isArray(this.jsonData)) {
        dataArray = this.jsonData
      } else if (this.csvConversionType === 'auto') {
        // Auto-detect array of objects
        if (Array.isArray(this.jsonData) && this.jsonData.length > 0) {
          dataArray = this.jsonData
        } else if (typeof this.jsonData === 'object') {
          dataArray = [this.jsonData]
        } else {
          alert('Cannot convert to CSV: Need object or array of objects')
          return
        }
      } else if (this.csvConversionType === 'flatten') {
        // Flatten nested objects
        const flatten = (obj, prefix = '') => {
          const result = {}
          for (const key in obj) {
            const newKey = prefix ? `${prefix}.${key}` : key
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
              Object.assign(result, flatten(obj[key], newKey))
            } else {
              result[newKey] = obj[key]
            }
          }
          return result
        }
        
        if (Array.isArray(this.jsonData)) {
          dataArray = this.jsonData.map(item => flatten(item))
        } else {
          dataArray = [flatten(this.jsonData)]
        }
      }

      if (dataArray.length === 0) {
        alert('No data to convert to CSV')
        return
      }

      // Get all unique keys as headers
      if (this.includeHeaders) {
        const allKeys = new Set()
        dataArray.forEach(item => {
          Object.keys(item).forEach(key => allKeys.add(key))
        })
        headers = Array.from(allKeys)
        csvData.push(headers.join(this.csvDelimiter))
      }

      // Add data rows
      dataArray.forEach(item => {
        const row = headers.map(header => {
          let value = item[header]
          if (value === undefined) return ''
          if (typeof value === 'object') return JSON.stringify(value)
          if (typeof value === 'string') {
            // Escape quotes and wrap in quotes if contains delimiter
            value = value.replace(/"/g, '""')
            if (value.includes(this.csvDelimiter) || value.includes('\n')) {
              return `"${value}"`
            }
          }
          return value
        })
        csvData.push(row.join(this.csvDelimiter))
      })

      const csvString = csvData.join('\n')
      const blob = new Blob([csvString], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `json_export_${Date.now()}.csv`
      link.click()
      URL.revokeObjectURL(url)
      
      this.showCSVModal = false
      this.showToast('CSV exported successfully!', 'success')
    },

    escapeHtml(text) {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    },

    showToast(message, type) {
      // Simple toast implementation
      const toast = document.createElement('div')
      toast.className = `toast toast-${type}`
      toast.textContent = message
      toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 10px;
        font-size: 0.875rem;
        z-index: 10000;
        animation: slideIn 0.3s ease;
      `
      document.body.appendChild(toast)
      setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease'
        setTimeout(() => toast.remove(), 300)
      }, 3000)
    }
  },
  mounted() {
    // Add animation styles
    const style = document.createElement('style')
    style.textContent = `
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
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    `
    document.head.appendChild(style)
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.json-formatter {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 40px 24px;
}

.container {
  max-width: 1600px;
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
  grid-template-columns: 1fr 1fr;
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
  display: flex;
  flex-direction: column;
  height: fit-content;
  min-height: 600px;
}

.card-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 22px;
  height: 22px;
  color: #3b82f6;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  background: transparent;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
}

.toggle-btn {
  padding: 6px 12px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #64748b;
}

.toggle-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-body {
  padding: 24px;
  flex: 1;
}

/* Input Area */
.input-wrapper {
  position: relative;
  margin-bottom: 20px;
}

.json-input {
  width: 100%;
  min-height: 300px;
  padding: 16px;
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  resize: vertical;
  transition: all 0.2s ease;
  background: #fafbfc;
}

.json-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-wrapper.has-error .json-input {
  border-color: #ef4444;
}

.error-message {
  position: absolute;
  bottom: -24px;
  left: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #ef4444;
  font-size: 0.75rem;
  background: white;
  padding: 4px 8px;
  border-radius: 8px;
}

.success-message {
  position: absolute;
  bottom: -24px;
  right: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-size: 0.75rem;
  background: white;
  padding: 4px 8px;
  border-radius: 8px;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 12px;
  margin: 32px 0 20px;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Stats Card */
.stats-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
}

/* Output Area */
.output-wrapper {
  background: #0f172a;
  border-radius: 16px;
  overflow: auto;
  max-height: 500px;
}

.json-output {
  margin: 0;
  padding: 20px;
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #e2e8f0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.output-placeholder {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.output-placeholder svg {
  margin-bottom: 16px;
  color: #cbd5e1;
}

.output-placeholder p {
  font-size: 0.875rem;
  margin-top: 8px;
}

/* Tree View */
.tree-wrapper {
  background: #f8fafc;
  border-radius: 16px;
  padding: 16px;
  max-height: 500px;
  overflow: auto;
}

.tree-view {
  font-family: 'Courier New', 'Monaco', monospace;
  font-size: 13px;
}

.tree-node {
  user-select: none;
}

.tree-node-header {
  cursor: pointer;
  padding: 4px 0;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tree-node-header:hover {
  background: #e2e8f0;
  border-radius: 6px;
}

.tree-toggle {
  display: inline-block;
  width: 16px;
  font-size: 10px;
  color: #64748b;
}

.tree-key {
  color: #3b82f6;
  font-weight: 500;
}

.tree-value {
  color: #10b981;
}

.tree-value.string {
  color: #f59e0b;
}

.tree-value.number {
  color: #8b5cf6;
}

.tree-value.boolean {
  color: #ec489a;
}

.tree-value.null {
  color: #94a3b8;
}

.tree-info {
  font-size: 11px;
  color: #94a3b8;
}

.tree-children {
  margin-left: 20px;
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
  max-height: 80vh;
  overflow: auto;
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
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
}

.modal-close {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #94a3b8;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #ef4444;
}

.modal-body {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-select {
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  font-size: 0.875rem;
  background: white;
}

.checkbox {
  margin-right: 8px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions button {
  flex: 1;
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>