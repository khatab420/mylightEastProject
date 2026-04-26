<template>
  <div class="code-diff-checker">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="hero-title">Code Diff Checker</h1>
        <p class="hero-description">
          Compare text, code, or files side-by-side to spot differences instantly.
          Perfect for developers and writers.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Toolbar -->
      <div class="toolbar">
        <div class="toolbar-group">
          <button
            @click="viewMode = 'side-by-side'"
            :class="['toolbar-btn', { active: viewMode === 'side-by-side' }]"
          >
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Side by Side
          </button>
          <button
            @click="viewMode = 'inline'"
            :class="['toolbar-btn', { active: viewMode === 'inline' }]"
          >
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            Inline
          </button>
        </div>

        <div class="toolbar-divider"></div>

        <div class="toolbar-group">
          <div class="language-selector">
            <svg class="select-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <select v-model="language" class="language-select">
              <option value="auto">Auto Detect</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="go">Go</option>
              <option value="rust">Rust</option>
              <option value="php">PHP</option>
              <option value="ruby">Ruby</option>
              <option value="swift">Swift</option>
              <option value="kotlin">Kotlin</option>
              <option value="html">HTML</option>
              <option value="css">CSS</option>
              <option value="sql">SQL</option>
              <option value="json">JSON</option>
              <option value="yaml">YAML</option>
              <option value="markdown">Markdown</option>
            </select>
          </div>

          <button @click="swapTexts" class="toolbar-btn" title="Swap Texts">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap
          </button>

          <button @click="clearAll" class="toolbar-btn" title="Clear All">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear
          </button>
        </div>
      </div>

      <!-- Change Analysis Panel -->
      <div v-if="changeAnalysis.length > 0" class="analysis-panel">
        <div class="analysis-header">
          <h3>🔍 Change Analysis & Causes</h3>
          <button @click="showAnalysis = !showAnalysis" class="analysis-toggle">
            {{ showAnalysis ? 'Hide' : 'Show' }} Details
          </button>
        </div>
        <div v-if="showAnalysis" class="analysis-content">
          <div v-for="(change, index) in changeAnalysis" :key="index" :class="['analysis-item', change.type]">
            <div class="analysis-icon">
              <span v-if="change.type === 'addition'">➕</span>
              <span v-else-if="change.type === 'deletion'">➖</span>
              <span v-else>🔄</span>
            </div>
            <div class="analysis-details">
              <div class="analysis-title">{{ change.title }}</div>
              <div class="analysis-description">{{ change.description }}</div>
              <div class="analysis-location">Line {{ change.lineNumber }}</div>
              <div class="analysis-code">
                <code>{{ change.codeSnippet }}</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Side by Side View -->
      <div v-if="viewMode === 'side-by-side'" class="side-by-side-view">
        <!-- Left Panel -->
        <div class="editor-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="title-badge original">Original</span>
              <span class="title-text">Left Version</span>
            </div>
            <div class="panel-actions">
              <label class="action-btn">
                <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <input type="file" @change="handleFileUpload($event, 'left')" class="hidden" accept=".txt,.js,.py,.java,.cpp,.c,.html,.css,.json,.xml,.md,.sql,.ts,.php,.rb,.go,.rs,.swift,.kt">
              </label>
              <button @click="copyToClipboard('left')" class="action-btn">
                <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
          <div class="editor-container">
            <div class="line-numbers" ref="leftLineNumbers">
              <div v-for="(line, index) in leftLines" :key="index" 
                   :class="['line-number', getLeftLineHighlightClass(index + 1)]">
                {{ index + 1 }}
              </div>
            </div>
            <textarea
              v-model="leftText"
              @input="updateDiff"
              class="editor-textarea"
              placeholder="// Paste or type your original text here..."
              @scroll="syncScroll('left')"
              ref="leftTextarea"
            ></textarea>
          </div>
          <div class="panel-footer">
            <span class="stats-badge">{{ leftLines.length }} lines</span>
            <span class="stats-badge">{{ leftText.length }} chars</span>
          </div>
        </div>

        <div class="diff-divider">
          <div class="divider-icon">VS</div>
        </div>

        <!-- Right Panel -->
        <div class="editor-panel">
          <div class="panel-header">
            <div class="panel-title">
              <span class="title-badge modified">Modified</span>
              <span class="title-text">Right Version</span>
            </div>
            <div class="panel-actions">
              <label class="action-btn">
                <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <input type="file" @change="handleFileUpload($event, 'right')" class="hidden" accept=".txt,.js,.py,.java,.cpp,.c,.html,.css,.json,.xml,.md,.sql,.ts,.php,.rb,.go,.rs,.swift,.kt">
              </label>
              <button @click="copyToClipboard('right')" class="action-btn">
                <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
          <div class="editor-container">
            <div class="line-numbers" ref="rightLineNumbers">
              <div v-for="(line, index) in rightLines" :key="index"
                   :class="['line-number', getRightLineHighlightClass(index + 1)]">
                {{ index + 1 }}
              </div>
            </div>
            <textarea
              v-model="rightText"
              @input="updateDiff"
              class="editor-textarea"
              placeholder="// Paste or type your modified text here..."
              @scroll="syncScroll('right')"
              ref="rightTextarea"
            ></textarea>
          </div>
          <div class="panel-footer">
            <span class="stats-badge">{{ rightLines.length }} lines</span>
            <span class="stats-badge">{{ rightText.length }} chars</span>
          </div>
        </div>
      </div>

      <!-- Inline View -->
      <div v-else class="inline-view">
        <div class="inline-header">
          <div class="inline-header-left">
            <span class="inline-badge removed">Removed</span>
            <span class="inline-badge added">Added</span>
            <span class="inline-badge unchanged">Unchanged</span>
          </div>
          <div class="inline-header-right">
            <label class="action-btn">
              <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Left
              <input type="file" @change="handleFileUpload($event, 'left')" class="hidden">
            </label>
            <label class="action-btn">
              <svg class="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload Right
              <input type="file" @change="handleFileUpload($event, 'right')" class="hidden">
            </label>
          </div>
        </div>
        <div class="inline-content" ref="inlineContent">
          <div v-html="highlightedInlineDiffWithAnalysis" class="diff-lines"></div>
        </div>
      </div>

      <!-- Statistics Dashboard -->
      <div v-if="diffStats" class="stats-dashboard">
        <div class="stat-card">
          <div class="stat-icon green">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ diffStats.additions }}</div>
            <div class="stat-label">Additions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ diffStats.deletions }}</div>
            <div class="stat-label">Deletions</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ diffStats.modifications }}</div>
            <div class="stat-label">Modifications</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ diffStats.similarity }}%</div>
            <div class="stat-label">Similarity</div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="shareDiff" class="btn-primary">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Share Diff Link
        </button>
        <button @click="exportDiff" class="btn-secondary">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Diff
        </button>
        <button @click="copyDiffToClipboard" class="btn-secondary">
          <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Diff
        </button>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">Share Diff Link</h3>
          <button @click="closeModal" class="modal-close">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <p class="modal-text">Share this link to show the current diff comparison:</p>
          <div class="share-url-container">
            <input type="text" v-model="shareableUrl" readonly class="share-url-input">
            <button @click="copyShareableUrl" class="copy-url-btn">Copy</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
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
import * as Diff from 'diff'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-dark.css'

export default {
  name: 'CodeDiffChecker',
  data() {
    return {
      leftText: '',
      rightText: '',
      viewMode: 'side-by-side',
      language: 'auto',
      diffStats: null,
      showShareModal: false,
      shareableUrl: '',
      toastMessage: '',
      leftLines: [''],
      rightLines: [''],
      changeAnalysis: [],
      showAnalysis: true,
      hoveredLine: null,
      hoveredSide: null,
      lineChangeMap: {
        left: {},
        right: {}
      }
    }
  },
  computed: {
    highlightedInlineDiffWithAnalysis() {
      if (!this.leftText && !this.rightText) {
        return '<div class="empty-state">Enter text to see differences...</div>'
      }
      
      const diff = Diff.diffLines(this.leftText, this.rightText)
      let html = ''
      
      diff.forEach((part) => {
        const lines = part.value.split('\n')
        lines.forEach((line, index) => {
          if (line.trim() || index < lines.length - 1) {
            const escapedLine = this.escapeHtml(line || ' ')
            const highlighted = this.highlightCode(escapedLine)
            const changeType = part.added ? 'added' : (part.removed ? 'removed' : 'unchanged')
            const changeInfo = this.analyzeLineChange(line, changeType)
            
            let tooltipHtml = ''
            if (changeInfo.cause) {
              tooltipHtml = `<div class="change-tooltip">${changeInfo.cause}</div>`
            }
            
            html += `<div class="diff-line ${changeType}" data-change-type="${changeType}">
                      <span class="diff-gutter">${part.added ? '+' : (part.removed ? '-' : ' ')}</span>
                      <span class="diff-content">
                        ${highlighted || ' '}
                        ${tooltipHtml}
                      </span>
                    </div>`
          }
        })
      })
      
      return html
    }
  },
  watch: {
    leftText: {
      handler() {
        this.leftLines = this.leftText.split('\n')
        this.analyzeChanges()
        this.calculateDiff()
      },
      immediate: true
    },
    rightText: {
      handler() {
        this.rightLines = this.rightText.split('\n')
        this.analyzeChanges()
        this.calculateDiff()
      },
      immediate: true
    }
  },
  mounted() {
    this.checkForSharedDiff()
  },
  methods: {
    updateDiff() {
      this.calculateDiff()
      this.analyzeChanges()
    },
    
    calculateDiff() {
      const diff = Diff.diffLines(this.leftText, this.rightText)
      
      let additions = 0
      let deletions = 0
      let modifications = 0
      
      diff.forEach((part) => {
        const lines = part.value.split('\n').filter(l => l.trim()).length
        if (part.added) {
          additions += lines
          modifications += lines
        } else if (part.removed) {
          deletions += lines
          modifications += lines
        }
      })
      
      const totalLines = Math.max(
        this.leftText.split('\n').filter(l => l.trim()).length,
        this.rightText.split('\n').filter(l => l.trim()).length
      )
      
      const similarity = totalLines > 0 
        ? Math.round(((totalLines - modifications) / totalLines) * 100)
        : 100
      
      this.diffStats = {
        additions,
        deletions,
        modifications,
        similarity: Math.max(0, similarity)
      }
    },
    
    analyzeChanges() {
      const diff = Diff.diffLines(this.leftText, this.rightText)
      const analysis = []
      let leftLineNum = 1
      let rightLineNum = 1
      
      // Reset line change map
      this.lineChangeMap = { left: {}, right: {} }
      
      diff.forEach((part) => {
        const lines = part.value.split('\n')
        lines.forEach((line, index) => {
          if (line.trim() || index < lines.length - 1) {
            if (part.added) {
              const cause = this.determineChangeCause(line, 'addition')
              analysis.push({
                type: 'addition',
                title: 'Content Added',
                description: cause,
                lineNumber: rightLineNum,
                codeSnippet: line.substring(0, 100)
              })
              this.lineChangeMap.right[rightLineNum] = { type: 'addition', cause }
              rightLineNum++
            } else if (part.removed) {
              const cause = this.determineChangeCause(line, 'deletion')
              analysis.push({
                type: 'deletion',
                title: 'Content Removed',
                description: cause,
                lineNumber: leftLineNum,
                codeSnippet: line.substring(0, 100)
              })
              this.lineChangeMap.left[leftLineNum] = { type: 'deletion', cause }
              leftLineNum++
            } else {
              leftLineNum++
              rightLineNum++
            }
          }
        })
      })
      
      this.changeAnalysis = analysis
    },
    
    determineChangeCause(line, changeType) {
      const lowerLine = line.toLowerCase()
      
      if (lowerLine.includes('function') || lowerLine.includes('=>') || lowerLine.includes('def ')) {
        return changeType === 'addition' ? 'New function/method added' : 'Function/method removed'
      }
      if (lowerLine.includes('import') || lowerLine.includes('require') || lowerLine.includes('from ')) {
        return changeType === 'addition' ? 'New dependency imported' : 'Dependency import removed'
      }
      if (lowerLine.includes('console.log') || lowerLine.includes('print(') || lowerLine.includes('debug')) {
        return changeType === 'addition' ? 'Debug statement added' : 'Debug statement removed'
      }
      if (lowerLine.includes('if ') || lowerLine.includes('else') || lowerLine.includes('switch')) {
        return 'Conditional logic changed'
      }
      if (lowerLine.includes('for ') || lowerLine.includes('while ') || lowerLine.includes('forEach')) {
        return 'Loop structure modified'
      }
      if (lowerLine.includes('return')) {
        return 'Return value changed'
      }
      if (lowerLine.includes('const ') || lowerLine.includes('let ') || lowerLine.includes('var ')) {
        return changeType === 'addition' ? 'New variable declared' : 'Variable declaration removed'
      }
      if (lowerLine.includes('class ')) {
        return changeType === 'addition' ? 'New class added' : 'Class removed'
      }
      if (lowerLine.includes('try ') || lowerLine.includes('catch ') || lowerLine.includes('throw')) {
        return 'Error handling logic modified'
      }
      if (lowerLine.match(/[+\-*/%=]/)) {
        return 'Expression or operation changed'
      }
      
      return changeType === 'addition' ? 'New content inserted' : 'Content removed from original'
    },
    
    analyzeLineChange(line, changeType) {
      const cause = this.determineChangeCause(line, changeType)
      return { cause }
    },
    
    getLeftLineHighlightClass(lineNum) {
      if (this.lineChangeMap.left[lineNum]) {
        return `highlight-${this.lineChangeMap.left[lineNum].type}`
      }
      return ''
    },
    
    getRightLineHighlightClass(lineNum) {
      if (this.lineChangeMap.right[lineNum]) {
        return `highlight-${this.lineChangeMap.right[lineNum].type}`
      }
      return ''
    },
    
    swapTexts() {
      const temp = this.leftText
      this.leftText = this.rightText
      this.rightText = temp
      this.updateDiff()
      this.showToast('Texts swapped successfully!')
    },
    
    clearAll() {
      this.leftText = ''
      this.rightText = ''
      this.changeAnalysis = []
      this.lineChangeMap = { left: {}, right: {} }
      this.updateDiff()
      this.showToast('All content cleared')
    },
    
    handleFileUpload(event, side) {
      const file = event.target.files[0]
      if (!file) return
      
      const reader = new FileReader()
      reader.onload = (e) => {
        if (side === 'left') {
          this.leftText = e.target.result
        } else {
          this.rightText = e.target.result
        }
        this.updateDiff()
        this.showToast(`Loaded file: ${file.name}`)
      }
      reader.readAsText(file)
    },
    
    async copyToClipboard(side) {
      const text = side === 'left' ? this.leftText : this.rightText
      try {
        await navigator.clipboard.writeText(text)
        this.showToast(`${side === 'left' ? 'Left' : 'Right'} text copied!`)
      } catch (err) {
        this.showToast('Failed to copy text')
      }
    },
    
    async copyDiffToClipboard() {
      const diffText = this.generateDiffText()
      try {
        await navigator.clipboard.writeText(diffText)
        this.showToast('Diff copied to clipboard!')
      } catch (err) {
        this.showToast('Failed to copy diff')
      }
    },
    
    generateDiffText() {
      const diff = Diff.diffLines(this.leftText, this.rightText)
      let result = ''
      
      diff.forEach((part) => {
        if (part.added) {
          result += `+ ${part.value}`
        } else if (part.removed) {
          result += `- ${part.value}`
        } else {
          result += `  ${part.value}`
        }
      })
      
      return result
    },
    
    exportDiff() {
      const diffText = this.generateDiffText()
      const blob = new Blob([diffText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `diff_${Date.now()}.txt`
      a.click()
      URL.revokeObjectURL(url)
      this.showToast('Diff exported successfully!')
    },
    
    shareDiff() {
      const diffData = {
        left: this.leftText,
        right: this.rightText,
        language: this.language,
        timestamp: Date.now()
      }
      
      const encoded = btoa(encodeURIComponent(JSON.stringify(diffData)))
      this.shareableUrl = `${window.location.origin}${window.location.pathname}?shared=${encoded}`
      this.showShareModal = true
    },
    
    checkForSharedDiff() {
      const params = new URLSearchParams(window.location.search)
      const shared = params.get('shared')
      
      if (shared) {
        try {
          const decoded = JSON.parse(decodeURIComponent(atob(shared)))
          this.leftText = decoded.left
          this.rightText = decoded.right
          this.language = decoded.language || 'auto'
          this.updateDiff()
          this.showToast('Loaded shared diff!')
          
          window.history.replaceState({}, document.title, window.location.pathname)
        } catch (err) {
          console.error('Failed to load shared diff:', err)
        }
      }
    },
    
    async copyShareableUrl() {
      await navigator.clipboard.writeText(this.shareableUrl)
      this.showToast('Shareable link copied!')
      this.closeModal()
    },
    
    closeModal() {
      this.showShareModal = false
    },
    
    highlightCode(code) {
      if (this.language === 'auto' || !code || code === ' ') return code
      
      try {
        const result = hljs.highlight(code, { language: this.language })
        return result.value
      } catch (err) {
        return code
      }
    },
    
    escapeHtml(text) {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    },
    
    syncScroll(side) {
      const leftTextarea = this.$refs.leftTextarea
      const rightTextarea = this.$refs.rightTextarea
      const leftLineNumbers = this.$refs.leftLineNumbers
      const rightLineNumbers = this.$refs.rightLineNumbers
      
      if (side === 'left' && rightTextarea) {
        rightTextarea.scrollTop = leftTextarea.scrollTop
        if (rightLineNumbers) rightLineNumbers.scrollTop = leftTextarea.scrollTop
      } else if (side === 'right' && leftTextarea) {
        leftTextarea.scrollTop = rightTextarea.scrollTop
        if (leftLineNumbers) leftLineNumbers.scrollTop = rightTextarea.scrollTop
      }
      
      // Sync line numbers scroll
      if (side === 'left' && leftLineNumbers) {
        leftLineNumbers.scrollTop = leftTextarea?.scrollTop || 0
      }
      if (side === 'right' && rightLineNumbers) {
        rightLineNumbers.scrollTop = rightTextarea?.scrollTop || 0
      }
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
.code-diff-checker {
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

/* Toolbar */
.toolbar {
  background: white;
  border-radius: 16px;
  padding: 12px 20px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.toolbar-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.toolbar-divider {
  width: 1px;
  height: 32px;
  background: #e5e7eb;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.toolbar-btn:hover {
  background: #f3f4f6;
  border-color: #e5e7eb;
}

.toolbar-btn.active {
  background: #667eea;
  color: white;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Language Selector */
.language-selector {
  position: relative;
  display: inline-block;
}

.select-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #6b7280;
  pointer-events: none;
}

.language-select {
  padding: 8px 32px 8px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.language-select:hover {
  border-color: #667eea;
}

.language-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Analysis Panel */
.analysis-panel {
  background: white;
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.analysis-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.analysis-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.analysis-toggle {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.analysis-toggle:hover {
  background: rgba(255, 255, 255, 0.3);
}

.analysis-content {
  max-height: 400px;
  overflow-y: auto;
  padding: 16px;
}

.analysis-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 12px;
  background: #f9fafb;
  border-left: 4px solid;
  transition: transform 0.2s;
}

.analysis-item:hover {
  transform: translateX(4px);
}

.analysis-item.addition {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.analysis-item.deletion {
  border-left-color: #ef4444;
  background: #fef2f2;
}

.analysis-icon {
  font-size: 24px;
}

.analysis-details {
  flex: 1;
}

.analysis-title {
  font-weight: 700;
  margin-bottom: 6px;
  color: #1f2937;
}

.analysis-description {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.analysis-location {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 8px;
  font-family: monospace;
}

.analysis-code {
  background: #1f2937;
  padding: 8px 12px;
  border-radius: 8px;
  overflow-x: auto;
}

.analysis-code code {
  color: #e5e7eb;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

/* Side by Side View */
.side-by-side-view {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.editor-panel {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.title-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.title-badge.original {
  background: #dbeafe;
  color: #1e40af;
}

.title-badge.modified {
  background: #fef3c7;
  color: #92400e;
}

.title-text {
  font-weight: 600;
  color: #1f2937;
}

.panel-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  background: white;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.action-icon {
  width: 16px;
  height: 16px;
}

.hidden {
  display: none;
}

/* Editor Container */
.editor-container {
  display: flex;
  height: 500px;
  overflow: hidden;
}

.line-numbers {
  background: #f9fafb;
  padding: 16px 12px;
  text-align: right;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #9ca3af;
  border-right: 1px solid #e5e7eb;
  user-select: none;
  overflow-y: auto;
  width: 50px;
  flex-shrink: 0;
}

.line-number {
  line-height: 1.6;
  min-height: 24px;
}

.line-number.highlight-addition {
  background: #dcfce7;
  color: #166534;
  font-weight: 600;
}

.line-number.highlight-deletion {
  background: #fee2e2;
  color: #991b1b;
  font-weight: 600;
}

.editor-textarea {
  flex: 1;
  padding: 16px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.6;
  border: none;
  resize: none;
  outline: none;
  background: white;
  color: #1f2937;
  overflow-y: auto;
}

.editor-textarea::placeholder {
  color: #d1d5db;
  font-style: italic;
}

.panel-footer {
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

/* Diff Divider */
.diff-divider {
  display: flex;
  align-items: center;
  justify-content: center;
}

.divider-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #667eea;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  font-weight: 800;
}

/* Inline View */
.inline-view {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  margin-bottom: 32px;
}

.inline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.inline-header-left {
  display: flex;
  gap: 12px;
}

.inline-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
}

.inline-badge.removed {
  background: #fee2e2;
  color: #991b1b;
}

.inline-badge.added {
  background: #dcfce7;
  color: #166534;
}

.inline-badge.unchanged {
  background: #f3f4f6;
  color: #374151;
}

.inline-content {
  max-height: 600px;
  overflow-y: auto;
  font-family: 'Courier New', monospace;
  font-size: 13px;
}

.diff-lines {
  padding: 0;
}

.diff-line {
  display: flex;
  border-bottom: 1px solid #f3f4f6;
  line-height: 1.6;
  position: relative;
}

.diff-line.added {
  background: #f0fdf4;
}

.diff-line.removed {
  background: #fef2f2;
}

.diff-line.unchanged {
  background: white;
}

.diff-gutter {
  width: 40px;
  padding: 4px 8px;
  text-align: center;
  font-weight: 600;
  border-right: 1px solid #e5e7eb;
  user-select: none;
}

.diff-line.added .diff-gutter {
  background: #dcfce7;
  color: #166534;
}

.diff-line.removed .diff-gutter {
  background: #fee2e2;
  color: #991b1b;
}

.diff-line.unchanged .diff-gutter {
  background: #f9fafb;
  color: #9ca3af;
}

.diff-content {
  flex: 1;
  padding: 4px 12px;
  white-space: pre-wrap;
  word-break: break-word;
  position: relative;
}

.change-tooltip {
  position: absolute;
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  background: #1f2937;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  white-space: nowrap;
  margin-right: 8px;
  display: none;
  z-index: 100;
}

.diff-line:hover .change-tooltip {
  display: block;
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: #9ca3af;
  font-size: 14px;
}

/* Statistics Dashboard */
.stats-dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.green {
  background: #dcfce7;
  color: #166534;
}

.stat-icon.red {
  background: #fee2e2;
  color: #991b1b;
}

.stat-icon.blue {
  background: #dbeafe;
  color: #1e40af;
}

.stat-icon.purple {
  background: #f3e8ff;
  color: #6b21a5;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 20px;
  max-width: 500px;
  width: 90%;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #374151;
}

.modal-body {
  padding: 24px;
}

.modal-text {
  color: #6b7280;
  margin-bottom: 16px;
}

.share-url-container {
  display: flex;
  gap: 12px;
}

.share-url-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-family: monospace;
  font-size: 13px;
  background: #f9fafb;
  color: #1f2937;
}

.copy-url-btn {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.copy-url-btn:hover {
  background: #5a67d8;
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
  .side-by-side-view {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .diff-divider {
    display: none;
  }
  
  .hero-title {
    font-size: 36px;
  }
  
  .stats-dashboard {
    grid-template-columns: repeat(2, 1fr);
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
  
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .toolbar-group {
    justify-content: center;
  }
  
  .toolbar-divider {
    display: none;
  }
  
  .stats-dashboard {
    grid-template-columns: 1fr;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
  
  .editor-container {
    height: 300px;
  }
  
  .analysis-item {
    flex-direction: column;
  }
}
</style>