<template>
  <div class="minifier">
    <div class="minifier-header">
      <h2>HTML/CSS/JS Minifier</h2>
      <p>Minify HTML, CSS, and JavaScript to reduce file size and improve performance.</p>
    </div>

    <div class="minifier-main">
      <!-- Language Selector -->
      <div class="language-selector">
        <button
          v-for="lang in languages"
          :key="lang.id"
          @click="selectedLanguage = lang.id"
          :class="['lang-btn', { active: selectedLanguage === lang.id }]"
        >
          <span class="lang-icon">{{ lang.icon }}</span>
          <span class="lang-name">{{ lang.name }}</span>
        </button>
      </div>

      <div class="editor-container">
        <!-- Input Section -->
        <div class="input-section">
          <div class="section-header">
            <label>
              <span class="label-icon">📝</span>
              Input {{ currentLanguage.name }}
            </label>
            <div class="header-actions">
              <button @click="clearInput" class="action-btn" title="Clear">
                🗑️ Clear
              </button>
              <button @click="pasteFromClipboard" class="action-btn" title="Paste">
                📋 Paste
              </button>
              <button @click="loadSample" class="action-btn" title="Load Sample">
                📂 Sample
              </button>
            </div>
          </div>
          <textarea
            v-model="inputCode"
            @input="minifyCode"
            :placeholder="getPlaceholder()"
            class="code-input"
            rows="12"
          ></textarea>
          <div class="input-stats" v-if="inputCode">
            <span>Original: {{ formatBytes(getSize(inputCode)) }}</span>
            <span>Lines: {{ getLineCount(inputCode) }}</span>
          </div>
        </div>

        <!-- Output Section -->
        <div class="output-section">
          <div class="section-header">
            <label>
              <span class="label-icon">✨</span>
              Minified {{ currentLanguage.name }}
            </label>
            <div class="header-actions">
              <button @click="copyOutput" class="action-btn" title="Copy">
                📋 Copy
              </button>
              <button @click="downloadOutput" class="action-btn" title="Download">
                💾 Download
              </button>
            </div>
          </div>
          
          <!-- Minification Options -->
          <div class="minify-options">
            <label class="option-checkbox">
              <input type="checkbox" v-model="options.removeComments" @change="minifyCode">
              <span>Remove Comments</span>
            </label>
            <label class="option-checkbox">
              <input type="checkbox" v-model="options.removeWhitespace" @change="minifyCode">
              <span>Remove Whitespace</span>
            </label>
            <label class="option-checkbox" v-if="selectedLanguage === 'js'">
              <input type="checkbox" v-model="options.mangleVariables" @change="minifyCode">
              <span>Mangle Variables (Basic)</span>
            </label>
            <label class="option-checkbox" v-if="selectedLanguage === 'css'">
              <input type="checkbox" v-model="options.removeUnused" @change="minifyCode">
              <span>Remove Empty Rules</span>
            </label>
          </div>

          <textarea
            v-model="outputCode"
            readonly
            class="code-output"
            rows="12"
          ></textarea>
          
          <div class="output-stats" v-if="outputCode">
            <span>Minified: {{ formatBytes(getSize(outputCode)) }}</span>
            <span>Saved: {{ getSavedPercentage() }}</span>
            <span>Lines: {{ getLineCount(outputCode) }}</span>
          </div>
        </div>
      </div>

      <!-- Preview Section (for HTML) -->
      <div class="preview-section" v-if="selectedLanguage === 'html' && outputCode">
        <div class="section-header">
          <label>
            <span class="label-icon">👁️</span>
            Live Preview
          </label>
          <button @click="refreshPreview" class="action-btn">🔄 Refresh</button>
        </div>
        <iframe
          ref="previewFrame"
          class="preview-frame"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
          title="Preview"
        ></iframe>
      </div>

      <!-- Minification Errors -->
      <div v-if="minifyError" class="error-message">
        ⚠️ Minification Error: {{ minifyError }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HtmlCssJsMagnifier',
  data() {
    return {
      selectedLanguage: 'html',
      languages: [
        { id: 'html', name: 'HTML', icon: '🌐' },
        { id: 'css', name: 'CSS', icon: '🎨' },
        { id: 'js', name: 'JavaScript', icon: '⚡' }
      ],
      inputCode: '',
      outputCode: '',
      minifyError: null,
      options: {
        removeComments: true,
        removeWhitespace: true,
        mangleVariables: false,
        removeUnused: false
      },
      samples: {
        html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        h1 {
            color: #333;
            text-align: center;
        }
        button {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hello World!</h1>
        <p>This is a sample HTML document with CSS and JavaScript.</p>
        <button onclick="alert('Button clicked!')">Click Me</button>
    </div>
    <script>
        console.log("Page loaded");
        const greeting = "Welcome to the minifier!";
        console.log(greeting);
    <\/script>
</body>
<\/html>`,
        css: `/* Main Stylesheet */
body {
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #f0f2f5;
}

/* Header Styles */
.header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    text-align: center;
}

.card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    margin: 20px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn {
    display: inline-block;
    padding: 10px 20px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .container {
        padding: 10px;
    }
}`,
        js: `// Utility functions for data processing
class DataProcessor {
    constructor(data) {
        this.data = data;
        this.processed = false;
    }
    
    process() {
        if (!this.data || this.processed) {
            console.log("Invalid state");
            return null;
        }
        
        const unique = [...new Set(this.data)];
        const filtered = unique.filter(item => item !== null && item !== undefined && item !== '');
        const processed = filtered.map((item, index) => ({
            id: index,
            value: item,
            timestamp: new Date().toISOString()
        }));
        
        this.processed = true;
        this.result = processed;
        return processed;
    }
    
    getStats() {
        if (!this.result) return null;
        return {
            total: this.result.length,
            unique: new Set(this.result.map(r => r.value)).size,
            timestamp: new Date().toISOString()
        };
    }
}

function formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return year + "-" + month + "-" + day;
}

const sampleData = [1, 2, 2, 3, 4, 4, 5, null, '', 'hello', 'world'];
const processor = new DataProcessor(sampleData);
const result = processor.process();
console.log("Processing complete:", result);`
      }
    };
  },
  computed: {
    currentLanguage() {
      return this.languages.find(l => l.id === this.selectedLanguage);
    }
  },
  watch: {
    selectedLanguage() {
      this.inputCode = '';
      this.outputCode = '';
      this.minifyError = null;
    }
  },
  mounted() {
    this.loadSample();
  },
  updated() {
    if (this.selectedLanguage === 'html' && this.outputCode && this.$refs.previewFrame) {
      this.refreshPreview();
    }
  },
  methods: {
    getPlaceholder() {
      const placeholders = {
        html: '<!-- Paste your HTML code here -->\n<div class="example">\n    <h1>Hello World</h1>\n    <p>This will be minified...</p>\n</div>',
        css: '/* Paste your CSS code here */\nbody {\n    margin: 0;\n    padding: 20px;\n    background: #f0f0f0;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n}',
        js: '// Paste your JavaScript code here\nfunction hello(name) {\n    console.log("Hello, " + name + "!");\n    return { message: "Welcome" };\n}\n\nconst data = [1, 2, 3, 4, 5];\nconst doubled = data.map(x => x * 2);'
      };
      return placeholders[this.selectedLanguage];
    },
    
    minifyCode() {
      if (!this.inputCode.trim()) {
        this.outputCode = '';
        this.minifyError = null;
        return;
      }
      
      try {
        switch (this.selectedLanguage) {
          case 'html':
            this.outputCode = this.minifyHTML(this.inputCode);
            break;
          case 'css':
            this.outputCode = this.minifyCSS(this.inputCode);
            break;
          case 'js':
            this.outputCode = this.minifyJS(this.inputCode);
            break;
        }
        this.minifyError = null;
      } catch (e) {
        this.minifyError = e.message;
        this.outputCode = '';
      }
    },
    
    minifyHTML(html) {
      let minified = html;
      
      if (this.options.removeComments) {
        minified = minified.replace(/<!--[\s\S]*?-->/g, '');
      }
      
      if (this.options.removeWhitespace) {
        minified = minified.replace(/>\s+</g, '><');
        minified = minified.trim();
        minified = minified.replace(/\s{2,}/g, ' ');
        minified = minified.replace(/\s*=\s*/g, '=');
      }
      
      return minified;
    },
    
    minifyCSS(css) {
      let minified = css;
      
      if (this.options.removeComments) {
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
      }
      
      if (this.options.removeWhitespace) {
        minified = minified.replace(/\s+/g, ' ');
        minified = minified.replace(/\s*{\s*/g, '{');
        minified = minified.replace(/\s*}\s*/g, '}');
        minified = minified.replace(/\s*:\s*/g, ':');
        minified = minified.replace(/\s*;\s*/g, ';');
        minified = minified.replace(/\s*,\s*/g, ',');
        minified = minified.replace(/;}/g, '}');
      }
      
      if (this.options.removeUnused) {
        minified = minified.replace(/[^{}]*\{\s*\}/g, '');
      }
      
      return minified.trim();
    },
    
    minifyJS(js) {
      let minified = js;
      
      if (this.options.removeComments) {
        minified = minified.replace(/\/\/.*$/gm, '');
        minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
      }
      
      if (this.options.removeWhitespace) {
        minified = minified.replace(/\s+/g, ' ');
        minified = minified.replace(/\s*=\s*/g, '=');
        minified = minified.replace(/\s*\+\s*/g, '+');
        minified = minified.replace(/\s*-\s*/g, '-');
        minified = minified.replace(/\s*{\s*/g, '{');
        minified = minified.replace(/\s*}\s*/g, '}');
        minified = minified.replace(/\s*\(\s*/g, '(');
        minified = minified.replace(/\s*\)\s*/g, ')');
        minified = minified.replace(/\s*\[\s*/g, '[');
        minified = minified.replace(/\s*\]\s*/g, ']');
        minified = minified.replace(/\s*,\s*/g, ',');
        minified = minified.replace(/\s*;\s*/g, ';');
      }
      
      if (this.options.mangleVariables) {
        const varPattern = /\b(let|const|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
        let counter = 0;
        const varMap = new Map();
        let match;
        
        while ((match = varPattern.exec(minified)) !== null) {
          const varName = match[2];
          if (!varMap.has(varName) && !this.isReservedWord(varName)) {
            varMap.set(varName, `a${counter++}`);
          }
        }
        
        varMap.forEach((newName, oldName) => {
          const regex = new RegExp(`\\b${oldName}\\b`, 'g');
          minified = minified.replace(regex, newName);
        });
      }
      
      minified = minified.replace(/;;+/g, ';');
      minified = minified.replace(/;}/g, '}');
      
      return minified.trim();
    },
    
    isReservedWord(word) {
      const reserved = ['break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'new', 'null', 'return', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'let', 'static', 'yield'];
      return reserved.includes(word);
    },
    
    getSize(str) {
      return new Blob([str]).size;
    },
    
    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    getSavedPercentage() {
      if (!this.inputCode || !this.outputCode) return '0%';
      const original = this.getSize(this.inputCode);
      const minified = this.getSize(this.outputCode);
      const saved = ((original - minified) / original * 100).toFixed(1);
      return `${saved}% saved`;
    },
    
    getLineCount(str) {
      if (!str) return 0;
      return str.split(/\r\n|\r|\n/).length;
    },
    
    clearInput() {
      this.inputCode = '';
      this.outputCode = '';
      this.minifyError = null;
    },
    
    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        this.inputCode = text;
        this.minifyCode();
      } catch (err) {
        this.minifyError = 'Failed to paste from clipboard. Please check permissions.';
        setTimeout(() => {
          if (this.minifyError === 'Failed to paste from clipboard. Please check permissions.') {
            this.minifyError = null;
          }
        }, 3000);
      }
    },
    
    loadSample() {
      this.inputCode = this.samples[this.selectedLanguage];
      this.minifyCode();
    },
    
    async copyOutput() {
      if (!this.outputCode) return;
      try {
        await navigator.clipboard.writeText(this.outputCode);
        alert('✓ Copied to clipboard!');
      } catch (err) {
        this.minifyError = 'Failed to copy to clipboard';
        setTimeout(() => {
          if (this.minifyError === 'Failed to copy to clipboard') {
            this.minifyError = null;
          }
        }, 3000);
      }
    },
    
    downloadOutput() {
      if (!this.outputCode) return;
      
      const extensions = {
        html: 'html',
        css: 'css',
        js: 'js'
      };
      
      const ext = extensions[this.selectedLanguage];
      const filename = `minified.${ext}`;
      const blob = new Blob([this.outputCode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    refreshPreview() {
      if (this.$refs.previewFrame && this.outputCode) {
        const doc = this.$refs.previewFrame.contentDocument || this.$refs.previewFrame.contentWindow.document;
        doc.open();
        doc.write(this.outputCode);
        doc.close();
      }
    }
  }
};
</script>

<style scoped>
.minifier {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.minifier-header {
  margin-bottom: 32px;
  text-align: center;
}

.minifier-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #e0e7ff 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.minifier-header p {
  color: #e0e7ff;
  font-size: 0.95rem;
}

.minifier-main {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.language-selector {
  display: flex;
  gap: 12px;
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.lang-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.lang-btn:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.lang-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}

.lang-icon {
  font-size: 1.2rem;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
}

@media (max-width: 968px) {
  .editor-container {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .minifier {
    padding: 16px;
  }
  
  .language-selector {
    flex-direction: column;
  }
  
  .lang-btn {
    justify-content: center;
  }
}

.input-section,
.output-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.code-input,
.code-output {
  width: 100%;
  padding: 16px;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.85rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  resize: vertical;
  transition: all 0.2s ease;
  background: #fafcff;
}

.code-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.code-output {
  background: #f8fafc;
  color: #0f172a;
}

.minify-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
}

.option-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  color: #475569;
}

.option-checkbox input {
  cursor: pointer;
  width: 16px;
  height: 16px;
}

.input-stats,
.output-stats {
  display: flex;
  gap: 16px;
  font-size: 0.75rem;
  color: #64748b;
  padding: 8px 12px;
  background: #f1f5f9;
  border-radius: 8px;
}

.preview-section {
  padding: 24px;
  border-top: 1px solid #e2e8f0;
}

.preview-frame {
  width: 100%;
  height: 400px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  background: white;
  margin-top: 12px;
}

.error-message {
  margin: 16px 24px 24px;
  padding: 12px;
  background: #fee2e2;
  border-left: 3px solid #ef4444;
  border-radius: 8px;
  color: #991b1b;
  font-size: 0.85rem;
}
</style>