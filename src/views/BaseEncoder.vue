<template>
  <div class="base-encoder">
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div class="header-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 7h16M4 12h16M4 17h10" />
            <rect x="2" y="3" width="20" height="18" rx="2" ry="2" />
          </svg>
          <span>Base64 Studio</span>
        </div>
        <h1>Base64 Encoder / Decoder</h1>
        <p class="subtitle">
          Encode and decode Base64 strings instantly. Support for images, files, and text.
        </p>
      </div>

      <div class="main-layout">
        <!-- Left Panel - Input -->
        <div class="card input-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            <h2>Input</h2>
            <div class="mode-toggle">
              <button
                @click="mode = 'encode'"
                :class="['mode-btn', { active: mode === 'encode' }]"
              >
                Encode
              </button>
              <button
                @click="mode = 'decode'"
                :class="['mode-btn', { active: mode === 'decode' }]"
              >
                Decode
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- Input Type Tabs -->
            <div class="input-tabs">
              <button
                v-for="type in inputTypes"
                :key="type.value"
                @click="inputType = type.value"
                :class="['input-tab', { active: inputType === type.value }]"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path v-if="type.value === 'text'" d="M4 7h16M4 12h16M4 17h10" />
                  <rect v-if="type.value === 'file'" x="2" y="3" width="20" height="18" rx="2" ry="2" />
                  <path v-if="type.value === 'url'" d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                </svg>
                {{ type.name }}
              </button>
            </div>

            <!-- Text Input -->
            <div v-if="inputType === 'text'" class="input-area">
              <textarea
                v-model="textInput"
                :placeholder="mode === 'encode' ? 'Enter text to encode to Base64...' : 'Enter Base64 string to decode...'"
                class="text-input"
                rows="6"
              ></textarea>
              
              <div class="input-actions">
                <button @click="clearText" class="action-btn clear">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  Clear
                </button>
                <button @click="pasteFromClipboard" class="action-btn paste">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Paste
                </button>
                <button v-if="mode === 'encode'" @click="loadExample" class="action-btn example">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 0 0 4.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 0 1-15.357-2m15.357 2H15" />
                  </svg>
                  Example
                </button>
              </div>
            </div>

            <!-- File Upload -->
            <div v-if="inputType === 'file'" class="input-area">
              <div 
                class="file-upload-area"
                @click="$refs.fileInput.click()"
                @dragover.prevent
                @drop.prevent="handleFileDrop"
              >
                <input
                  ref="fileInput"
                  type="file"
                  @change="handleFileSelect"
                  style="display: none"
                />
                <div v-if="!selectedFile" class="upload-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                    <polyline points="13 2 13 9 20 9" />
                  </svg>
                  <span>Click or drag file here</span>
                  <small>Images, PDFs, Documents (Max 10MB)</small>
                </div>
                <div v-else class="file-preview">
                  <div class="file-info">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    <div>
                      <div class="file-name">{{ selectedFile.name }}</div>
                      <div class="file-size">{{ formatBytes(selectedFile.size) }}</div>
                    </div>
                    <button @click.stop="clearFile" class="remove-file">✕</button>
                  </div>
                  <img v-if="isImageFile" :src="imagePreviewUrl" class="image-preview" />
                </div>
              </div>
            </div>

            <!-- URL Input -->
            <div v-if="inputType === 'url'" class="input-area">
              <textarea
                v-model="urlInput"
                placeholder="Enter URL to encode to Base64 (will be converted to data URL)..."
                class="text-input"
                rows="4"
              ></textarea>
              <div class="url-options">
                <label class="checkbox-label">
                  <input type="checkbox" v-model="urlSafe" class="checkbox" />
                  URL-safe encoding (replace +/ with -_)
                </label>
              </div>
            </div>

            <!-- Convert Button -->
            <button @click="convert" class="convert-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
                <polyline points="12 2 12 16 16 12" />
                <line x1="8" y1="16" x2="8.01" y2="16" />
              </svg>
              {{ mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64' }}
            </button>
          </div>
        </div>

        <!-- Right Panel - Output -->
        <div class="card output-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <h2>Output</h2>
            <div class="output-actions">
              <button @click="copyOutput" :disabled="!output" class="icon-btn" title="Copy">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
              <button @click="downloadOutput" :disabled="!output" class="icon-btn" title="Download">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>

          <div class="card-body">
            <!-- Output Display -->
            <div class="output-area">
              <div v-if="output" class="output-content">
                <!-- Text Output -->
                <textarea
                  v-if="outputType === 'text'"
                  v-model="output"
                  class="output-textarea"
                  readonly
                  rows="8"
                ></textarea>
                
                <!-- Image Preview -->
                <div v-if="outputType === 'image'" class="image-output">
                  <img :src="output" class="output-image" />
                  <div class="image-info">
                    <span>Image Data URL ({{ formatBytes(output.length) }})</span>
                  </div>
                </div>
                
                <!-- File Download -->
                <div v-if="outputType === 'file'" class="file-output">
                  <div class="file-download-info">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                      <polyline points="13 2 13 9 20 9" />
                    </svg>
                    <div>
                      <div class="file-name">decoded_file</div>
                      <div class="file-size">{{ formatBytes(output.length) }}</div>
                    </div>
                    <button @click="downloadOutput" class="download-file-btn">Download File</button>
                  </div>
                </div>
              </div>
              
              <div v-else class="output-placeholder">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                <p>Output will appear here</p>
                <small>Enter input and click convert</small>
              </div>
            </div>

            <!-- Stats -->
            <div v-if="output" class="stats-section">
              <div class="stat-card">
                <div class="stat-label">Output Size</div>
                <div class="stat-value">{{ formatBytes(output.length) }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Original Size</div>
                <div class="stat-value">{{ formatBytes(originalSize) }}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Encoding Ratio</div>
                <div class="stat-value">{{ encodingRatio }}%</div>
              </div>
            </div>

            <!-- Info Cards -->
            <div class="info-cards">
              <div class="info-card">
                <div class="info-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <strong>What is Base64?</strong>
                </div>
                <p>Base64 encoding converts binary data to ASCII text format, making it safe for transmission in URLs, emails, and JSON.</p>
              </div>
              
              <div class="info-card">
                <div class="info-header">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <strong>Common Uses</strong>
                </div>
                <p>Data URLs for images, email attachments, API authentication, storing binary data in databases.</p>
              </div>
            </div>
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
export default {
  name: 'BaseEncoder',
  data() {
    return {
      mode: 'encode',
      inputType: 'text',
      textInput: '',
      urlInput: '',
      selectedFile: null,
      imagePreviewUrl: null,
      urlSafe: false,
      output: '',
      outputType: 'text',
      originalSize: 0,
      toastMessage: '',
      toastType: 'success',
      toastTimeout: null,
      inputTypes: [
        { name: 'Text', value: 'text' },
        { name: 'File', value: 'file' },
        { name: 'URL', value: 'url' }
      ]
    }
  },
  computed: {
    isImageFile() {
      return this.selectedFile && this.selectedFile.type.startsWith('image/')
    },
    encodingRatio() {
      if (this.originalSize === 0) return 0
      return Math.round((this.output.length / this.originalSize) * 100)
    }
  },
  watch: {
    mode() {
      this.clearOutput()
    },
    inputType() {
      this.clearOutput()
    }
  },
  methods: {
    convert() {
      if (this.mode === 'encode') {
        this.encode()
      } else {
        this.decode()
      }
    },

    encode() {
      try {
        let input = ''
        let inputSize = 0
        
        switch (this.inputType) {
          case 'text':
            input = this.textInput
            inputSize = new Blob([input]).size
            if (!input) {
              this.showToast('Please enter text to encode', 'error')
              return
            }
            this.output = btoa(unescape(encodeURIComponent(input)))
            if (this.urlSafe) {
              this.output = this.output.replace(/\+/g, '-').replace(/\//g, '_')
            }
            this.outputType = 'text'
            break
            
          case 'file':
            if (!this.selectedFile) {
              this.showToast('Please select a file to encode', 'error')
              return
            }
            this.encodeFileToBase64(this.selectedFile)
            return
            
          case 'url':
            input = this.urlInput
            inputSize = new Blob([input]).size
            if (!input) {
              this.showToast('Please enter a URL to encode', 'error')
              return
            }
            // Fetch URL content and encode
            this.encodeUrlToBase64(input)
            return
        }
        
        this.originalSize = inputSize
        this.showToast('Encoding completed successfully!', 'success')
      } catch (error) {
        console.error('Encoding error:', error)
        this.showToast('Failed to encode: ' + error.message, 'error')
      }
    },

    encodeFileToBase64(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        this.output = e.target.result
        this.outputType = this.isImageFile ? 'image' : 'text'
        this.originalSize = file.size
        this.showToast('File encoded successfully!', 'success')
      }
      reader.onerror = () => {
        this.showToast('Failed to read file', 'error')
      }
      reader.readAsDataURL(file)
    },

    async encodeUrlToBase64(url) {
      try {
        // Check if it's a valid URL
        new URL(url)
        
        // Fetch the URL content
        const response = await fetch(url)
        const blob = await response.blob()
        const reader = new FileReader()
        
        reader.onload = (e) => {
          this.output = e.target.result
          this.outputType = blob.type.startsWith('image/') ? 'image' : 'text'
          this.originalSize = blob.size
          this.showToast('URL content encoded successfully!', 'success')
        }
        reader.readAsDataURL(blob)
      } catch (error) {
        this.showToast('Failed to fetch URL: ' + error.message, 'error')
      }
    },

    decode() {
      try {
        let decoded = ''
        
        switch (this.inputType) {
          case 'text':
            if (!this.textInput) {
              this.showToast('Please enter Base64 to decode', 'error')
              return
            }
            let base64 = this.textInput
            // Handle URL-safe base64
            base64 = base64.replace(/-/g, '+').replace(/_/g, '/')
            decoded = decodeURIComponent(escape(atob(base64)))
            this.output = decoded
            this.outputType = 'text'
            this.originalSize = this.textInput.length
            break
            
          case 'file':
            if (!this.selectedFile) {
              this.showToast('Please select a Base64 file to decode', 'error')
              return
            }
            this.decodeFileFromBase64(this.selectedFile)
            return
            
          case 'url':
            if (!this.urlInput) {
              this.showToast('Please enter Base64 URL to decode', 'error')
              return
            }
            let urlBase64 = this.urlInput
            urlBase64 = urlBase64.replace(/-/g, '+').replace(/_/g, '/')
            decoded = decodeURIComponent(escape(atob(urlBase64)))
            this.output = decoded
            this.outputType = 'text'
            this.originalSize = this.urlInput.length
            break
        }
        
        this.showToast('Decoding completed successfully!', 'success')
      } catch (error) {
        console.error('Decoding error:', error)
        this.showToast('Failed to decode: Invalid Base64 string', 'error')
      }
    },

    decodeFileFromBase64(file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target.result
          // Remove data URL prefix if present
          let base64 = content
          if (content.includes(',')) {
            base64 = content.split(',')[1]
          }
          const decoded = atob(base64)
          this.output = decoded
          this.outputType = 'text'
          this.originalSize = file.size
          this.showToast('File decoded successfully!', 'success')
        } catch (error) {
          this.showToast('Failed to decode file: Invalid Base64', 'error')
        }
      }
      reader.readAsText(file)
    },

    handleFileSelect(event) {
      const file = event.target.files[0]
      if (file) {
        this.processFile(file)
      }
    },

    handleFileDrop(event) {
      const file = event.dataTransfer.files[0]
      if (file) {
        this.processFile(file)
      }
    },

    processFile(file) {
      if (file.size > 10 * 1024 * 1024) {
        this.showToast('File size must be less than 10MB', 'error')
        return
      }
      
      this.selectedFile = file
      
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreviewUrl = e.target.result
        }
        reader.readAsDataURL(file)
      }
      
      this.clearOutput()
    },

    clearFile() {
      this.selectedFile = null
      this.imagePreviewUrl = null
      this.clearOutput()
    },

    clearText() {
      this.textInput = ''
      this.clearOutput()
    },

    clearOutput() {
      this.output = ''
      this.outputType = 'text'
      this.originalSize = 0
    },

    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText()
        this.textInput = text
        this.showToast('Text pasted from clipboard', 'success')
      } catch (err) {
        this.showToast('Failed to paste from clipboard', 'error')
      }
    },

    loadExample() {
      this.textInput = 'Hello, World! This is a Base64 encoding example.'
      this.showToast('Example loaded', 'success')
    },

    async copyOutput() {
      if (!this.output) return
      
      try {
        await navigator.clipboard.writeText(this.output)
        this.showToast('Copied to clipboard!', 'success')
      } catch (err) {
        this.showToast('Failed to copy', 'error')
      }
    },

    downloadOutput() {
      if (!this.output) return
      
      let blob, filename, mimeType
      
      if (this.outputType === 'image' && this.output.startsWith('data:')) {
        // Extract data from data URL
        const arr = this.output.split(',')
        const mime = arr[0].match(/:(.*?);/)[1]
        const bstr = atob(arr[1])
        let n = bstr.length
        const u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        blob = new Blob([u8arr], { type: mime })
        filename = `encoded_image.${mime.split('/')[1]}`
      } else {
        blob = new Blob([this.output], { type: 'text/plain' })
        filename = this.mode === 'encode' ? 'encoded_base64.txt' : 'decoded_text.txt'
      }
      
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      link.click()
      URL.revokeObjectURL(url)
      this.showToast('Download started!', 'success')
    },

    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    showToast(message, type) {
      if (this.toastTimeout) clearTimeout(this.toastTimeout)
      this.toastMessage = message
      this.toastType = type
      this.toastTimeout = setTimeout(() => {
        this.toastMessage = ''
      }, 3000)
    }
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.base-encoder {
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
  color: rgba(255, 255, 255, 0.9);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.card-icon {
  width: 22px;
  height: 22px;
  color: #2c5364;
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

/* Mode Toggle */
.mode-toggle {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
}

.mode-btn {
  padding: 6px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mode-btn.active {
  background: white;
  color: #2c5364;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Input Tabs */
.input-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 12px;
}

.input-tab {
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  transition: all 0.2s ease;
}

.input-tab.active {
  background: #2c5364;
  color: white;
}

.input-tab:hover:not(.active) {
  background: #f1f5f9;
}

/* Text Input */
.text-input {
  width: 100%;
  padding: 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #2c5364;
  box-shadow: 0 0 0 3px rgba(44, 83, 100, 0.1);
}

.input-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.action-btn {
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

.action-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

/* File Upload */
.file-upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.file-upload-area:hover {
  border-color: #2c5364;
  background: #f8fafc;
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
  font-size: 0.875rem;
  color: #475569;
}

.upload-placeholder small {
  font-size: 0.75rem;
  color: #94a3b8;
}

.file-preview {
  padding: 20px;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.file-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.file-size {
  font-size: 0.7rem;
  color: #6b7280;
}

.remove-file {
  margin-left: auto;
  background: #ef4444;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
}

.image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
}

/* URL Options */
.url-options {
  margin-top: 12px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.8125rem;
  color: #374151;
  cursor: pointer;
}

.checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

/* Convert Button */
.convert-btn {
  width: 100%;
  margin-top: 24px;
  padding: 14px;
  background: linear-gradient(135deg, #2c5364 0%, #203a43 100%);
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
}

.convert-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(44, 83, 100, 0.3);
}

/* Output Area */
.output-area {
  min-height: 300px;
  margin-bottom: 20px;
}

.output-textarea {
  width: 100%;
  padding: 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-family: 'Courier New', monospace;
  font-size: 0.8125rem;
  background: #f8fafc;
  resize: vertical;
}

.output-image {
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-info {
  margin-top: 12px;
  text-align: center;
  font-size: 0.75rem;
  color: #6b7280;
}

.file-output {
  text-align: center;
  padding: 40px;
  background: #f8fafc;
  border-radius: 12px;
}

.file-download-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.download-file-btn {
  padding: 10px 20px;
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
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

/* Output Actions */
.output-actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  padding: 6px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.icon-btn:hover:not(:disabled) {
  background: #e2e8f0;
}

.icon-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Stats Section */
.stats-section {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
}

.stat-card {
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: 0.7rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

/* Info Cards */
.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 20px;
}

.info-card {
  padding: 16px;
  background: #fef3c7;
  border-radius: 12px;
  border-left: 4px solid #f59e0b;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #92400e;
}

.info-card p {
  font-size: 0.75rem;
  color: #78350f;
  line-height: 1.4;
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

/* Scrollbar */
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
</style>