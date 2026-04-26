<template>
  <div class="lorem-generator">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </div>
        <h1 class="hero-title">Lorem Ipsum Generator</h1>
        <p class="hero-description">
          Generate placeholder text for your designs, mockups, and content layouts. Multiple formats and lengths.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Generation Controls -->
      <div class="controls-card">
        <div class="controls-header">
          <h3>⚙️ Generation Settings</h3>
          <button @click="resetToDefaults" class="reset-btn">Reset to Defaults</button>
        </div>

        <div class="controls-grid">
          <!-- Generation Type -->
          <div class="control-group">
            <label class="control-label">Generate Type</label>
            <div class="type-buttons">
              <button 
                @click="generationType = 'paragraphs'" 
                :class="['type-btn', { active: generationType === 'paragraphs' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Paragraphs
              </button>
              <button 
                @click="generationType = 'sentences'" 
                :class="['type-btn', { active: generationType === 'sentences' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Sentences
              </button>
              <button 
                @click="generationType = 'words'" 
                :class="['type-btn', { active: generationType === 'words' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
                Words
              </button>
            </div>
          </div>

          <!-- Count Sliders -->
          <div class="control-group">
            <label class="control-label">
              {{ generationType === 'paragraphs' ? 'Number of Paragraphs' : generationType === 'sentences' ? 'Number of Sentences' : 'Number of Words' }}
            </label>
            <div class="count-control">
              <input 
                type="range" 
                v-model.number="count" 
                :min="generationType === 'paragraphs' ? 1 : generationType === 'sentences' ? 1 : 1"
                :max="generationType === 'paragraphs' ? 20 : generationType === 'sentences' ? 50 : 200"
                class="count-slider"
              />
              <div class="count-value">
                <button @click="decrementCount" class="count-btn">-</button>
                <span class="count-number">{{ count }}</span>
                <button @click="incrementCount" class="count-btn">+</button>
              </div>
            </div>
            <div class="slider-limits">
              <span>Min</span>
              <span>Max</span>
            </div>
          </div>

          <!-- Paragraph Length (only for paragraphs) -->
          <div class="control-group" v-if="generationType === 'paragraphs'">
            <label class="control-label">Paragraph Length</label>
            <div class="length-buttons">
              <button 
                @click="paragraphLength = 'short'" 
                :class="['length-btn', { active: paragraphLength === 'short' }]"
              >
                Short (~50 words)
              </button>
              <button 
                @click="paragraphLength = 'medium'" 
                :class="['length-btn', { active: paragraphLength === 'medium' }]"
              >
                Medium (~100 words)
              </button>
              <button 
                @click="paragraphLength = 'long'" 
                :class="['length-btn', { active: paragraphLength === 'long' }]"
              >
                Long (~200 words)
              </button>
            </div>
          </div>

          <!-- Output Format -->
          <div class="control-group">
            <label class="control-label">Output Format</label>
            <div class="format-buttons">
              <button 
                @click="outputFormat = 'plain'" 
                :class="['format-option', { active: outputFormat === 'plain' }]"
              >
                Plain Text
              </button>
              <button 
                @click="outputFormat = 'html'" 
                :class="['format-option', { active: outputFormat === 'html' }]"
              >
                HTML (with &lt;p&gt; tags)
              </button>
              <button 
                @click="outputFormat = 'markdown'" 
                :class="['format-option', { active: outputFormat === 'markdown' }]"
              >
                Markdown
              </button>
            </div>
          </div>
        </div>

        <div class="generate-button">
          <button @click="generateLorem" class="generate-btn">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Generate Lorem Ipsum
          </button>
        </div>
      </div>

      <!-- Generated Content -->
      <div class="output-card">
        <div class="output-header">
          <h3>📝 Generated Content</h3>
          <div class="output-actions">
            <button @click="copyToClipboard" class="copy-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy
            </button>
            <button @click="downloadContent" class="download-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button @click="clearContent" class="clear-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        </div>
        
        <div class="output-content" :class="{ 'html-output': outputFormat === 'html' }">
          <div v-if="!generatedText" class="empty-state">
            <svg class="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Click "Generate Lorem Ipsum" to create placeholder text</p>
          </div>
          <div v-else v-html="displayText"></div>
        </div>

        <!-- Statistics -->
        <div v-if="generatedText" class="output-stats">
          <div class="stat-item">
            <span class="stat-label">Words:</span>
            <span class="stat-value">{{ wordCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Characters:</span>
            <span class="stat-value">{{ charCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Sentences:</span>
            <span class="stat-value">{{ sentenceCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">Paragraphs:</span>
            <span class="stat-value">{{ paragraphCount }}</span>
          </div>
        </div>
      </div>

      <!-- Examples & Variations -->
      <div class="examples-card">
        <h3>🎨 Examples & Variations</h3>
        <div class="examples-grid">
          <div class="example-item" @click="loadExample('standard')">
            <div class="example-icon">📄</div>
            <div class="example-content">
              <strong>Standard Lorem Ipsum</strong>
              <p>Classic Lorem Ipsum text for general use</p>
            </div>
          </div>
          <div class="example-item" @click="loadExample('short')">
            <div class="example-icon">⚡</div>
            <div class="example-content">
              <strong>Short Version</strong>
              <p>Brief placeholder text for small spaces</p>
            </div>
          </div>
          <div class="example-item" @click="loadExample('long')">
            <div class="example-icon">📚</div>
            <div class="example-content">
              <strong>Long Version</strong>
              <p>Extended text for content-heavy layouts</p>
            </div>
          </div>
          <div class="example-item" @click="loadExample('html')">
            <div class="example-icon">🔧</div>
            <div class="example-content">
              <strong>HTML Ready</strong>
              <p>Pre-formatted with paragraph tags</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <h3>💡 Tips & Best Practices</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">🎯</span>
            <div class="tip-content">
              <strong>Use appropriate length</strong>
              <p>Match the generated text length to your design needs</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">📱</span>
            <div class="tip-content">
              <strong>Test responsiveness</strong>
              <p>Use different text lengths to test layout flexibility</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🎨</span>
            <div class="tip-content">
              <strong>Design mockups</strong>
              <p>Perfect for wireframes and design presentations</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">📝</span>
            <div class="tip-content">
              <strong>Content planning</strong>
              <p>Use as placeholder while planning real content</p>
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
export default {
  name: 'LoremGenerator',
  data() {
    return {
      generationType: 'paragraphs',
      count: 3,
      paragraphLength: 'medium',
      outputFormat: 'plain',
      generatedText: '',
      toastMessage: ''
    }
  },
  computed: {
    wordCount() {
      if (!this.generatedText) return 0
      const text = this.stripHtml(this.generatedText)
      return text.split(/\s+/).filter(w => w.length > 0).length
    },
    charCount() {
      if (!this.generatedText) return 0
      const text = this.stripHtml(this.generatedText)
      return text.length
    },
    sentenceCount() {
      if (!this.generatedText) return 0
      const text = this.stripHtml(this.generatedText)
      return text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    },
    paragraphCount() {
      if (!this.generatedText) return 0
      if (this.outputFormat === 'html') {
        const matches = this.generatedText.match(/<p>/g)
        return matches ? matches.length : 0
      } else if (this.outputFormat === 'markdown') {
        return this.generatedText.split(/\n\n+/).filter(p => p.trim().length > 0).length
      } else {
        return this.generatedText.split(/\n\n+/).filter(p => p.trim().length > 0).length
      }
    },
    displayText() {
      if (this.outputFormat === 'html') {
        return this.generatedText
      } else if (this.outputFormat === 'markdown') {
        return this.renderMarkdown(this.generatedText)
      } else {
        return this.generatedText.replace(/\n/g, '<br>')
      }
    }
  },
  mounted() {
    this.generateLorem()
  },
  methods: {
    generateLorem() {
      let result = ''
      
      if (this.generationType === 'paragraphs') {
        result = this.generateParagraphs()
      } else if (this.generationType === 'sentences') {
        result = this.generateSentences()
      } else {
        result = this.generateWords()
      }
      
      // Apply output format
      if (this.outputFormat === 'html') {
        result = this.convertToHtml(result)
      } else if (this.outputFormat === 'markdown') {
        result = this.convertToMarkdown(result)
      }
      
      this.generatedText = result
    },
    
    generateParagraphs() {
      let paragraphs = []
      const wordsPerParagraph = this.getWordsPerParagraph()
      
      for (let i = 0; i < this.count; i++) {
        let paragraph = this.generateLoremText(wordsPerParagraph)
        paragraphs.push(paragraph)
      }
      
      return paragraphs.join('\n\n')
    },
    
    generateSentences() {
      let sentences = []
      for (let i = 0; i < this.count; i++) {
        let sentence = this.generateRandomSentence()
        sentences.push(sentence)
      }
      return sentences.join(' ')
    },
    
    generateWords() {
      let words = []
      for (let i = 0; i < this.count; i++) {
        words.push(this.getRandomWord())
      }
      return words.join(' ')
    },
    
    generateLoremText(wordCount) {
      const words = this.getLoremWords()
      let text = []
      
      for (let i = 0; i < wordCount; i++) {
        text.push(words[Math.floor(Math.random() * words.length)])
      }
      
      let result = text.join(' ')
      result = result.charAt(0).toUpperCase() + result.slice(1)
      result += '.'
      
      return result
    },
    
    generateRandomSentence() {
      const wordCount = Math.floor(Math.random() * 15) + 5
      const words = this.getLoremWords()
      let sentence = []
      
      for (let i = 0; i < wordCount; i++) {
        sentence.push(words[Math.floor(Math.random() * words.length)])
      }
      
      let result = sentence.join(' ')
      result = result.charAt(0).toUpperCase() + result.slice(1)
      result += '.'
      
      return result
    },
    
    getRandomWord() {
      const words = this.getLoremWords()
      return words[Math.floor(Math.random() * words.length)]
    },
    
    getWordsPerParagraph() {
      switch(this.paragraphLength) {
        case 'short': return 50
        case 'medium': return 100
        case 'long': return 200
        default: return 100
      }
    },
    
    getLoremWords() {
      return [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'ut', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'ut', 'aliquip', 'ex', 'ea',
        'commodo', 'consequat', 'duis', 'aute', 'irure', 'dolor', 'in', 'reprehenderit',
        'in', 'voluptate', 'velit', 'esse', 'cillum', 'dolore', 'eu', 'fugiat', 'nulla',
        'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat', 'non', 'proident',
        'sunt', 'in', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id',
        'est', 'laborum', 'fugiat', 'nulla', 'pariatur', 'nemo', 'enim', 'ipsam',
        'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'aut', 'fugit'
      ]
    },
    
    convertToHtml(text) {
      const paragraphs = text.split('\n\n')
      return paragraphs.map(p => `<p>${p}</p>`).join('')
    },
    
    convertToMarkdown(text) {
      const paragraphs = text.split('\n\n')
      return paragraphs.map(p => `${p}\n`).join('\n\n')
    },
    
    renderMarkdown(markdown) {
      // Simple markdown rendering
      let html = markdown
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
      return `<p>${html}</p>`
    },
    
    stripHtml(html) {
      const div = document.createElement('div')
      div.innerHTML = html
      return div.textContent || div.innerText || ''
    },
    
    async copyToClipboard() {
      if (!this.generatedText) {
        this.showToast('Nothing to copy')
        return
      }
      
      const textToCopy = this.stripHtml(this.generatedText)
      try {
        await navigator.clipboard.writeText(textToCopy)
        this.showToast('Copied to clipboard!')
      } catch (err) {
        this.showToast('Failed to copy text')
      }
    },
    
    downloadContent() {
      if (!this.generatedText) {
        this.showToast('Nothing to download')
        return
      }
      
      const extension = this.outputFormat === 'html' ? 'html' : this.outputFormat === 'markdown' ? 'md' : 'txt'
      const content = this.outputFormat === 'html' ? this.generatedText : this.stripHtml(this.generatedText)
      const blob = new Blob([content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lorem-ipsum.${extension}`
      a.click()
      URL.revokeObjectURL(url)
      this.showToast('Downloaded successfully!')
    },
    
    clearContent() {
      this.generatedText = ''
      this.showToast('Content cleared')
    },
    
    loadExample(type) {
      switch(type) {
        case 'standard':
          this.count = 3
          this.generationType = 'paragraphs'
          this.paragraphLength = 'medium'
          this.outputFormat = 'plain'
          break
        case 'short':
          this.count = 1
          this.generationType = 'paragraphs'
          this.paragraphLength = 'short'
          this.outputFormat = 'plain'
          break
        case 'long':
          this.count = 5
          this.generationType = 'paragraphs'
          this.paragraphLength = 'long'
          this.outputFormat = 'plain'
          break
        case 'html':
          this.count = 3
          this.generationType = 'paragraphs'
          this.paragraphLength = 'medium'
          this.outputFormat = 'html'
          break
      }
      this.generateLorem()
      this.showToast(`Loaded ${type} example`)
    },
    
    incrementCount() {
      const max = this.generationType === 'paragraphs' ? 20 : this.generationType === 'sentences' ? 50 : 200
      if (this.count < max) {
        this.count++
        this.generateLorem()
      }
    },
    
    decrementCount() {
      if (this.count > 1) {
        this.count--
        this.generateLorem()
      }
    },
    
    resetToDefaults() {
      this.generationType = 'paragraphs'
      this.count = 3
      this.paragraphLength = 'medium'
      this.outputFormat = 'plain'
      this.generateLorem()
      this.showToast('Reset to default settings')
    },
    
    showToast(message) {
      this.toastMessage = message
      setTimeout(() => {
        this.toastMessage = ''
      }, 3000)
    }
  },
  watch: {
    generationType() {
      // Adjust count when switching types
      if (this.generationType === 'paragraphs' && this.count > 20) this.count = 5
      if (this.generationType === 'sentences' && this.count > 50) this.count = 10
      if (this.generationType === 'words' && this.count > 200) this.count = 50
      this.generateLorem()
    },
    count() {
      this.generateLorem()
    },
    paragraphLength() {
      if (this.generationType === 'paragraphs') {
        this.generateLorem()
      }
    },
    outputFormat() {
      this.generateLorem()
    }
  }
}
</script>

<style scoped>
.lorem-generator {
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

.controls-grid {
  display: grid;
  gap: 24px;
  margin-bottom: 24px;
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

.type-buttons,
.length-buttons,
.format-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.type-btn,
.length-btn,
.format-option {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
  background: white;
  color: #374151;
}

.type-btn:hover,
.length-btn:hover,
.format-option:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.type-btn.active,
.length-btn.active,
.format-option.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.count-control {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.count-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.count-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.count-value {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f9fafb;
  padding: 4px;
  border-radius: 10px;
}

.count-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s;
}

.count-btn:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.count-number {
  min-width: 40px;
  text-align: center;
  font-weight: 700;
  font-size: 18px;
  color: #1f2937;
}

.slider-limits {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #9ca3af;
}

.generate-button {
  display: flex;
  justify-content: center;
  margin-top: 16px;
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

.generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
}

/* Output Card */
.output-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.output-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.output-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.output-actions {
  display: flex;
  gap: 12px;
}

.copy-btn,
.download-btn,
.clear-btn {
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

.copy-btn:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.download-btn:hover {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.clear-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.output-content {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  font-family: 'Georgia', serif;
  line-height: 1.6;
  color: #1f2937;
}

.output-content.html-output {
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.empty-state {
  text-align: center;
  color: #9ca3af;
  padding: 40px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  color: #d1d5db;
}

.output-stats {
  display: flex;
  gap: 24px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.stat-label {
  color: #6b7280;
}

.stat-value {
  font-weight: 600;
  color: #667eea;
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

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .controls-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .type-buttons,
  .length-buttons,
  .format-buttons {
    flex-direction: column;
  }
  
  .type-btn,
  .length-btn,
  .format-option {
    width: 100%;
    justify-content: center;
  }
  
  .count-control {
    flex-direction: column;
  }
  
  .count-slider {
    width: 100%;
  }
  
  .output-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .output-actions {
    justify-content: center;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
  
  .output-stats {
    justify-content: center;
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
}
</style>