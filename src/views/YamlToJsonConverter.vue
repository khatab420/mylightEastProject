<template>
  <div class="yaml-json-converter">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="hero-title">YAML to JSON Converter</h1>
        <p class="hero-description">
          Convert YAML to JSON and JSON to YAML instantly. Perfect for config files and API development.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Conversion Controls -->
      <div class="controls-card">
        <div class="controls-header">
          <h3>⚙️ Conversion Settings</h3>
          <div class="direction-buttons">
            <button 
              @click="conversionDirection = 'yaml-to-json'" 
              :class="['direction-btn', { active: conversionDirection === 'yaml-to-json' }]"
            >
              YAML → JSON
            </button>
            <button 
              @click="conversionDirection = 'json-to-yaml'" 
              :class="['direction-btn', { active: conversionDirection === 'json-to-yaml' }]"
            >
              JSON → YAML
            </button>
          </div>
        </div>

        <div class="controls-grid">
          <div class="control-group">
            <label class="control-label">Output Format</label>
            <div class="format-buttons">
              <button 
                @click="outputFormat = 'pretty'" 
                :class="['format-btn', { active: outputFormat === 'pretty' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Pretty Print
              </button>
              <button 
                @click="outputFormat = 'minify'" 
                :class="['format-btn', { active: outputFormat === 'minify' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Minify
              </button>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">
              <input type="checkbox" v-model="autoConvert" />
              Auto-convert on input change
            </label>
          </div>
        </div>
      </div>

      <!-- Main Editor Area -->
      <div class="editor-container">
        <!-- Input Section -->
        <div class="input-section">
          <div class="section-header">
            <h3>{{ conversionDirection === 'yaml-to-json' ? '📄 YAML Input' : '📄 JSON Input' }}</h3>
            <div class="section-actions">
              <label class="upload-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload File
                <input type="file" @change="handleFileUpload" :accept="conversionDirection === 'yaml-to-json' ? '.yaml,.yml' : '.json'" class="hidden">
              </label>
              <button @click="clearInput" class="clear-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear
              </button>
            </div>
          </div>
          <div class="editor-wrapper">
            <textarea
              v-model="inputText"
              @input="handleInput"
              class="editor-input"
              :placeholder="getInputPlaceholder()"
              spellcheck="false"
            ></textarea>
            <div v-if="inputError" class="error-message">
              <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ inputError }}
            </div>
          </div>
          <div class="section-footer">
            <span class="stats-badge">Lines: {{ inputLines }}</span>
            <span class="stats-badge">Chars: {{ inputChars }}</span>
            <span class="stats-badge">Size: {{ formatFileSize(inputSize) }}</span>
          </div>
        </div>

        <!-- Conversion Arrow -->
        <div class="conversion-arrow">
          <button @click="swapConversion" class="swap-btn" title="Swap conversion direction">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
          <div class="arrow-icon">→</div>
        </div>

        <!-- Output Section -->
        <div class="output-section">
          <div class="section-header">
            <h3>{{ conversionDirection === 'yaml-to-json' ? '✨ JSON Output' : '✨ YAML Output' }}</h3>
            <div class="section-actions">
              <button @click="copyToClipboard" class="copy-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
              <button @click="downloadOutput" class="download-btn">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download
              </button>
            </div>
          </div>
          <div class="editor-wrapper">
            <textarea
              v-model="outputText"
              readonly
              class="editor-output"
              placeholder="Converted content will appear here..."
              spellcheck="false"
            ></textarea>
          </div>
          <div class="section-footer">
            <span class="stats-badge">Lines: {{ outputLines }}</span>
            <span class="stats-badge">Chars: {{ outputChars }}</span>
            <span class="stats-badge">Size: {{ formatFileSize(outputSize) }}</span>
          </div>
        </div>
      </div>

      <!-- Examples Section -->
      <div class="examples-card">
        <h3>📚 Examples & Templates</h3>
        <div class="examples-grid">
          <div class="example-item" @click="loadExample('simple')">
            <div class="example-icon">🔧</div>
            <div class="example-content">
              <strong>Simple Config</strong>
              <p>Basic key-value pairs and nested objects</p>
            </div>
          </div>
          <div class="example-item" @click="loadExample('array')">
            <div class="example-icon">📊</div>
            <div class="example-content">
              <strong>Array Example</strong>
              <p>Lists and arrays in YAML/JSON</p>
            </div>
          </div>
          <div class="example-item" @click="loadExample('complex')">
            <div class="example-icon">🏗️</div>
            <div class="example-content">
              <strong>Complex Structure</strong>
              <p>Nested objects and mixed types</p>
            </div>
          </div>
          <div class="example-item" @click="loadExample('api')">
            <div class="example-icon">🌐</div>
            <div class="example-content">
              <strong>API Response</strong>
              <p>Typical API response structure</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <h3>💡 Tips & Best Practices</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">📝</span>
            <div class="tip-content">
              <strong>YAML Syntax</strong>
              <p>Use spaces (not tabs) for indentation. 2 spaces is standard.</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🔍</span>
            <div class="tip-content">
              <strong>JSON Validation</strong>
              <p>Ensure JSON keys are in double quotes and no trailing commas.</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⚡</span>
            <div class="tip-content">
              <strong>Auto-convert</strong>
              <p>Enable auto-convert for real-time conversion as you type.</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">💾</span>
            <div class="tip-content">
              <strong>File Support</strong>
              <p>Upload .yaml, .yml, or .json files directly.</p>
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
import yaml from 'js-yaml'

export default {
  name: 'YamlToJsonConverter',
  data() {
    return {
      conversionDirection: 'yaml-to-json',
      outputFormat: 'pretty',
      autoConvert: true,
      inputText: '',
      outputText: '',
      inputError: '',
      toastMessage: ''
    }
  },
  computed: {
    inputLines() {
      return this.inputText.split('\n').length
    },
    inputChars() {
      return this.inputText.length
    },
    inputSize() {
      return new Blob([this.inputText]).size
    },
    outputLines() {
      return this.outputText.split('\n').length
    },
    outputChars() {
      return this.outputText.length
    },
    outputSize() {
      return new Blob([this.outputText]).size
    }
  },
  watch: {
    conversionDirection() {
      this.swapContent()
      this.convert()
    },
    outputFormat() {
      this.convert()
    }
  },
  mounted() {
    // Load default example
    this.loadExample('simple')
  },
  methods: {
    handleInput() {
      if (this.autoConvert) {
        this.convert()
      }
    },

    convert() {
      if (!this.inputText.trim()) {
        this.outputText = ''
        this.inputError = ''
        return
      }

      try {
        if (this.conversionDirection === 'yaml-to-json') {
          // Convert YAML to JSON
          const parsed = yaml.load(this.inputText)
          const jsonOutput = this.outputFormat === 'pretty' 
            ? JSON.stringify(parsed, null, 2)
            : JSON.stringify(parsed)
          this.outputText = jsonOutput
          this.inputError = ''
        } else {
          // Convert JSON to YAML
          const parsed = JSON.parse(this.inputText)
          const yamlOutput = yaml.dump(parsed, {
            indent: 2,
            lineWidth: -1,
            noRefs: true,
            sortKeys: false
          })
          this.outputText = yamlOutput
          this.inputError = ''
        }
      } catch (error) {
        this.inputError = error.message
        this.outputText = ''
      }
    },

    swapConversion() {
      // Swap the conversion direction
      this.conversionDirection = this.conversionDirection === 'yaml-to-json' 
        ? 'json-to-yaml' 
        : 'yaml-to-json'
    },

    swapContent() {
      // Swap input and output content
      const temp = this.inputText
      this.inputText = this.outputText
      this.outputText = temp
      this.inputError = ''
      this.convert()
    },

    handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        this.inputText = e.target.result
        this.convert()
        this.showToast(`Loaded file: ${file.name}`)
      }
      reader.onerror = () => {
        this.showToast('Error reading file')
      }
      reader.readAsText(file)
    },

    async copyToClipboard() {
      if (!this.outputText) {
        this.showToast('Nothing to copy')
        return
      }

      try {
        await navigator.clipboard.writeText(this.outputText)
        this.showToast('Copied to clipboard!')
      } catch (err) {
        this.showToast('Failed to copy text')
      }
    },

    downloadOutput() {
      if (!this.outputText) {
        this.showToast('Nothing to download')
        return
      }

      const extension = this.conversionDirection === 'yaml-to-json' ? 'json' : 'yaml'
      const blob = new Blob([this.outputText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `converted.${extension}`
      a.click()
      URL.revokeObjectURL(url)
      this.showToast('Downloaded successfully!')
    },

    clearInput() {
      this.inputText = ''
      this.outputText = ''
      this.inputError = ''
      this.showToast('Cleared all content')
    },

    loadExample(type) {
      let example = ''
      
      switch(type) {
        case 'simple':
          if (this.conversionDirection === 'yaml-to-json') {
            example = `# Simple Configuration
database:
  host: localhost
  port: 5432
  name: myapp_db
  username: admin
  password: secret123

server:
  port: 3000
  env: development
  debug: true

features:
  - authentication
  - logging
  - caching`
          } else {
            example = `{
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db",
    "username": "admin",
    "password": "secret123"
  },
  "server": {
    "port": 3000,
    "env": "development",
    "debug": true
  },
  "features": ["authentication", "logging", "caching"]
}`
          }
          break

        case 'array':
          if (this.conversionDirection === 'yaml-to-json') {
            example = `# Array of objects
users:
  - name: John Doe
    age: 30
    email: john@example.com
    roles:
      - admin
      - editor
  - name: Jane Smith
    age: 28
    email: jane@example.com
    roles:
      - user
      - viewer

products:
  - id: 1
    name: Laptop
    price: 999.99
    inStock: true
  - id: 2
    name: Mouse
    price: 29.99
    inStock: false`
          } else {
            example = `{
  "users": [
    {
      "name": "John Doe",
      "age": 30,
      "email": "john@example.com",
      "roles": ["admin", "editor"]
    },
    {
      "name": "Jane Smith",
      "age": 28,
      "email": "jane@example.com",
      "roles": ["user", "viewer"]
    }
  ],
  "products": [
    {
      "id": 1,
      "name": "Laptop",
      "price": 999.99,
      "inStock": true
    },
    {
      "id": 2,
      "name": "Mouse",
      "price": 29.99,
      "inStock": false
    }
  ]
}`
          }
          break

        case 'complex':
          if (this.conversionDirection === 'yaml-to-json') {
            example = `# Complex nested structure
application:
  name: "MyApp"
  version: "2.0.0"
  settings:
    api:
      endpoint: "https://api.example.com"
      timeout: 30
      retry:
        attempts: 3
        delay: 1000
    cache:
      enabled: true
      ttl: 3600
      redis:
        host: "redis.local"
        port: 6379
    logging:
      level: "info"
      outputs:
        - type: "console"
          format: "json"
        - type: "file"
          path: "/var/log/app.log"
          maxSize: "100MB"
  
  metadata:
    created: "2024-01-15"
    tags:
      - web
      - api
      - production`
          } else {
            example = `{
  "application": {
    "name": "MyApp",
    "version": "2.0.0",
    "settings": {
      "api": {
        "endpoint": "https://api.example.com",
        "timeout": 30,
        "retry": {
          "attempts": 3,
          "delay": 1000
        }
      },
      "cache": {
        "enabled": true,
        "ttl": 3600,
        "redis": {
          "host": "redis.local",
          "port": 6379
        }
      },
      "logging": {
        "level": "info",
        "outputs": [
          {
            "type": "console",
            "format": "json"
          },
          {
            "type": "file",
            "path": "/var/log/app.log",
            "maxSize": "100MB"
          }
        ]
      }
    },
    "metadata": {
      "created": "2024-01-15",
      "tags": ["web", "api", "production"]
    }
  }
}`
          }
          break

        case 'api':
          if (this.conversionDirection === 'yaml-to-json') {
            example = `# API Response Example
status: success
code: 200
data:
  users:
    - id: 1
      name: "Alice Johnson"
      email: "alice@example.com"
      profile:
        age: 32
        location: "New York"
        interests:
          - "reading"
          - "hiking"
          - "coding"
    - id: 2
      name: "Bob Wilson"
      email: "bob@example.com"
      profile:
        age: 28
        location: "San Francisco"
        interests:
          - "gaming"
          - "photography"
  pagination:
    page: 1
    per_page: 10
    total: 45
    pages: 5
meta:
  timestamp: "2024-01-15T10:30:00Z"
  version: "v2"
  request_id: "req_123abc"`
          } else {
            example = `{
  "status": "success",
  "code": 200,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "Alice Johnson",
        "email": "alice@example.com",
        "profile": {
          "age": 32,
          "location": "New York",
          "interests": ["reading", "hiking", "coding"]
        }
      },
      {
        "id": 2,
        "name": "Bob Wilson",
        "email": "bob@example.com",
        "profile": {
          "age": 28,
          "location": "San Francisco",
          "interests": ["gaming", "photography"]
        }
      }
    ],
    "pagination": {
      "page": 1,
      "per_page": 10,
      "total": 45,
      "pages": 5
    }
  },
  "meta": {
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v2",
    "request_id": "req_123abc"
  }
}`
          }
          break
      }
      
      this.inputText = example
      this.convert()
      this.showToast(`Loaded ${type} example`)
    },

    getInputPlaceholder() {
      return this.conversionDirection === 'yaml-to-json'
        ? '# Enter YAML code here...\n# Example:\nname: John Doe\nage: 30\ncity: New York'
        : '{\n  "name": "John Doe",\n  "age": 30,\n  "city": "New York"\n}'
    },

    formatFileSize(bytes) {
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
.yaml-json-converter {
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

/* Controls Card */
.controls-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.controls-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.controls-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.direction-buttons {
  display: flex;
  gap: 12px;
}

.direction-btn {
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
}

.direction-btn:hover {
  background: #f3f4f6;
}

.direction-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.controls-grid {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.control-label {
  font-weight: 600;
  color: #374151;
}

.format-buttons {
  display: flex;
  gap: 12px;
}

.format-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
}

.format-btn:hover {
  background: #f3f4f6;
}

.format-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Editor Container */
.editor-container {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  margin-bottom: 24px;
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
.clear-btn,
.copy-btn,
.download-btn {
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
.clear-btn:hover,
.copy-btn:hover,
.download-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.hidden {
  display: none;
}

.editor-wrapper {
  position: relative;
}

.editor-input,
.editor-output {
  width: 100%;
  height: 500px;
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

.editor-output {
  background: #f9fafb;
  color: #374151;
}

.editor-input::placeholder {
  color: #d1d5db;
  font-style: italic;
}

.error-message {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fee2e2;
  color: #991b1b;
  padding: 8px 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-top: 1px solid #fecaca;
}

.error-icon {
  width: 16px;
  height: 16px;
}

.section-footer {
  padding: 12px 20px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 16px;
}

.stats-badge {
  font-size: 12px;
  color: #6b7280;
  font-family: monospace;
}

/* Conversion Arrow */
.conversion-arrow {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.swap-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.swap-btn:hover {
  background: #f3f4f6;
  transform: scale(1.05);
}

.arrow-icon {
  font-size: 32px;
  color: #667eea;
  font-weight: bold;
}

/* Examples Card */
.examples-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.examples-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.example-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.example-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.example-icon {
  font-size: 24px;
}

.example-content {
  flex: 1;
}

.example-content strong {
  display: block;
  margin-bottom: 4px;
  color: #1f2937;
}

.example-content p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
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
  .editor-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .conversion-arrow {
    flex-direction: row;
    padding: 10px 0;
  }
  
  .arrow-icon {
    transform: rotate(90deg);
  }
  
  .hero-title {
    font-size: 36px;
  }
}

@media (max-width: 768px) {
  .controls-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .direction-buttons {
    justify-content: center;
  }
  
  .controls-grid {
    flex-direction: column;
    align-items: stretch;
  }
  
  .format-buttons {
    justify-content: center;
  }
  
  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .section-actions {
    justify-content: center;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
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
  
  .editor-input,
  .editor-output {
    height: 300px;
  }
}
</style>