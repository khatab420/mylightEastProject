<template>
  <div class="regex-tester">
    <div class="tester-header">
      <h2>Regex Tester</h2>
      <p>Test and debug regular expressions in real-time with instant match highlighting.</p>
    </div>

    <div class="tester-main">
      <!-- Regex Input Section -->
      <div class="input-section">
        <div class="regex-input-group">
          <div class="regex-field">
            <label>
              <span class="label-icon">/</span>
              Regular Expression
            </label>
            <div class="regex-input-wrapper">
              <span class="regex-delimiter">/</span>
              <input
                v-model="regexPattern"
                type="text"
                placeholder="e.g., \d+, [A-Za-z]+, (foo|bar)"
                @input="updateRegex"
                class="regex-input"
              />
              <span class="regex-delimiter">/</span>
              <div class="flags-wrapper">
                <button
                  v-for="flag in availableFlags"
                  :key="flag"
                  @click="toggleFlag(flag)"
                  :class="['flag-btn', { active: flags.includes(flag) }]"
                  :title="getFlagTitle(flag)"
                >
                  {{ flag }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Common Patterns Library -->
        <div class="patterns-section">
          <label>
            <span class="label-icon">📚</span>
            Common Patterns
          </label>
          <div class="patterns-grid">
            <button
              v-for="pattern in commonPatterns"
              :key="pattern.name"
              @click="applyPattern(pattern)"
              class="pattern-btn"
              :title="pattern.description"
            >
              <span class="pattern-name">{{ pattern.name }}</span>
              <span class="pattern-example">{{ pattern.example }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Test String Section -->
      <div class="test-section">
        <label>
          <span class="label-icon">📝</span>
          Test String
        </label>
        <textarea
          v-model="testString"
          @input="updateRegex"
          placeholder="Enter text to test against the regex pattern..."
          class="test-input"
          rows="6"
        ></textarea>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <div class="results-header">
          <label>
            <span class="label-icon">✨</span>
            Matches
          </label>
          <div class="results-stats" v-if="matches.length">
            <span class="match-count">{{ matches.length }} matches</span>
            <button @click="copyMatches" class="copy-btn" title="Copy matches">
              📋 Copy
            </button>
          </div>
        </div>

        <!-- Highlighted Text Area -->
        <div class="highlighted-container">
          <div
            v-if="regexError"
            class="error-message"
          >
            ⚠️ {{ regexError }}
          </div>
          <div
            v-else
            class="highlighted-text"
            v-html="highlightedText"
          ></div>
        </div>

        <!-- Match List -->
        <div v-if="matches.length" class="matches-list">
          <div class="matches-title">Match Details</div>
          <div class="matches-items">
            <div
              v-for="(match, index) in matches"
              :key="index"
              class="match-item"
            >
              <span class="match-index">{{ index + 1 }}.</span>
              <code class="match-value">{{ match }}</code>
            </div>
          </div>
        </div>
        <div v-else-if="testString && !regexError && regexPattern" class="no-matches">
          No matches found
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegTester',
  data() {
    return {
      regexPattern: '',
      flags: ['g'],
      testString: `Hello world@example.com
Contact: john.doe@company.co.uk
Visit https://regex-tester.com for more
Phone: +1-234-567-8900
Date: 2024-12-25`,
      regex: null,
      matches: [],
      regexError: null,
      availableFlags: ['g', 'i', 'm', 's', 'u', 'y'],
      commonPatterns: [
        {
          name: 'Email',
          pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
          example: 'user@example.com',
          description: 'Match email addresses',
          flags: ['g', 'i']
        },
        {
          name: 'URL',
          pattern: 'https?://[\\w\\-]+(\\.[\\w\\-]+)+(/[\\w\\-./?%&=]*)?',
          example: 'https://example.com',
          description: 'Match HTTP/HTTPS URLs',
          flags: ['g', 'i']
        },
        {
          name: 'Phone',
          pattern: '\\+?[\\d\\s-]{10,}',
          example: '+1-234-567-8900',
          description: 'Match phone numbers',
          flags: ['g']
        },
        {
          name: 'Date (YYYY-MM-DD)',
          pattern: '\\d{4}-\\d{2}-\\d{2}',
          example: '2024-12-25',
          description: 'Match dates in YYYY-MM-DD format',
          flags: ['g']
        },
        {
          name: 'IPv4',
          pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
          example: '192.168.1.1',
          description: 'Match IPv4 addresses',
          flags: ['g']
        },
        {
          name: 'Hex Color',
          pattern: '#?[A-Fa-f0-9]{6}',
          example: '#FF5733',
          description: 'Match hexadecimal colors',
          flags: ['g', 'i']
        },
        {
          name: 'Word',
          pattern: '\\b\\w+\\b',
          example: 'hello world',
          description: 'Match whole words',
          flags: ['g']
        },
        {
          name: 'Number',
          pattern: '\\b\\d+\\b',
          example: '123 4567',
          description: 'Match numbers',
          flags: ['g']
        }
      ]
    };
  },
  computed: {
    highlightedText() {
      if (!this.testString || !this.regex || this.regexError) {
        return this.escapeHtml(this.testString);
      }

      let lastIndex = 0;
      const parts = [];
      let match;

      // Reset regex lastIndex for global flag
      if (this.regex.global) {
        this.regex.lastIndex = 0;
      }

      while ((match = this.regex.exec(this.testString)) !== null) {
        const matchStart = match.index;
        const matchEnd = matchStart + match[0].length;

        // Add text before match
        if (matchStart > lastIndex) {
          parts.push(this.escapeHtml(this.testString.substring(lastIndex, matchStart)));
        }

        // Add highlighted match
        parts.push(`<mark class="match-highlight">${this.escapeHtml(match[0])}</mark>`);

        lastIndex = matchEnd;

        // Prevent infinite loops for zero-length matches
        if (match[0].length === 0) {
          this.regex.lastIndex++;
        }

        // Break if global flag not set
        if (!this.regex.global) break;
      }

      // Add remaining text
      if (lastIndex < this.testString.length) {
        parts.push(this.escapeHtml(this.testString.substring(lastIndex)));
      }

      return parts.join('');
    }
  },
  watch: {
    flags: {
      deep: true,
      handler() {
        this.updateRegex();
      }
    }
  },
  mounted() {
    this.updateRegex();
  },
  methods: {
    getFlagTitle(flag) {
      const titles = {
        g: 'Global - Find all matches',
        i: 'Case Insensitive',
        m: 'Multiline - ^ and $ match line boundaries',
        s: 'Dot All - . matches newlines',
        u: 'Unicode - Full unicode support',
        y: 'Sticky - Matches only from lastIndex'
      };
      return titles[flag] || flag;
    },
    toggleFlag(flag) {
      if (flag === 'g') {
        // Always keep 'g' flag for highlighting to work properly
        if (!this.flags.includes('g')) {
          this.flags.push('g');
        }
      } else {
        const index = this.flags.indexOf(flag);
        if (index === -1) {
          this.flags.push(flag);
        } else {
          this.flags.splice(index, 1);
        }
      }
    },
    updateRegex() {
      if (!this.regexPattern.trim()) {
        this.regex = null;
        this.matches = [];
        this.regexError = null;
        return;
      }

      try {
        const flagString = this.flags.join('');
        this.regex = new RegExp(this.regexPattern, flagString);
        this.regexError = null;
        this.extractMatches();
      } catch (e) {
        this.regexError = e.message;
        this.regex = null;
        this.matches = [];
      }
    },
    extractMatches() {
      if (!this.regex || !this.testString) {
        this.matches = [];
        return;
      }

      const matches = [];
      let match;

      // Reset regex lastIndex
      if (this.regex.global) {
        this.regex.lastIndex = 0;
      }

      while ((match = this.regex.exec(this.testString)) !== null) {
        matches.push(match[0]);
        if (!this.regex.global) break;
      }

      this.matches = matches;
    },
    applyPattern(pattern) {
      this.regexPattern = pattern.pattern;
      // Merge flags: keep 'g', add pattern's recommended flags
      const newFlags = new Set(this.flags);
      newFlags.add('g'); // Always keep global
      if (pattern.flags) {
        pattern.flags.forEach(flag => newFlags.add(flag));
      }
      this.flags = Array.from(newFlags);
      this.updateRegex();
      
      // Auto-focus on test string if it's empty
      if (!this.testString && pattern.example) {
        this.testString = pattern.example;
      }
    },
    escapeHtml(text) {
      if (!text) return '';
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },
    copyMatches() {
      if (!this.matches.length) return;
      
      const matchesText = this.matches.join('\n');
      navigator.clipboard.writeText(matchesText).then(() => {
        // Optional: Show a temporary tooltip/notification
        const copyBtn = this.$el.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy:', err);
      });
    }
  }
};
</script>

<style scoped>
.regex-tester {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.tester-header {
  margin-bottom: 32px;
  text-align: center;
}

.tester-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.tester-header p {
  color: #475569;
  font-size: 0.95rem;
}

.tester-main {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.input-section {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.regex-input-group {
  margin-bottom: 24px;
}

.regex-field label,
.patterns-section label,
.test-section label,
.results-header label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1.1rem;
}

.regex-input-wrapper {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.regex-input-wrapper:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.regex-delimiter {
  padding: 12px 8px;
  color: #64748b;
  font-weight: 600;
  font-family: monospace;
}

.regex-input {
  flex: 1;
  padding: 12px 8px;
  border: none;
  background: transparent;
  font-family: 'Fira Code', 'Courier New', monospace;
  font-size: 0.95rem;
  outline: none;
  color: #0f172a;
}

.flags-wrapper {
  display: flex;
  gap: 4px;
  padding-right: 12px;
}

.flag-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #cbd5e1;
  background: white;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #475569;
}

.flag-btn:hover {
  background: #f1f5f9;
  transform: translateY(-1px);
}

.flag-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.pattern-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.pattern-btn:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.pattern-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.85rem;
}

.pattern-example {
  font-family: monospace;
  font-size: 0.75rem;
  color: #64748b;
}

.test-section {
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.test-input {
  width: 100%;
  padding: 14px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  resize: vertical;
  transition: all 0.2s ease;
  background: #fafcff;
}

.test-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.results-section {
  padding: 24px;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.results-stats {
  display: flex;
  align-items: center;
  gap: 12px;
}

.match-count {
  background: #3b82f6;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.copy-btn {
  padding: 4px 12px;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.2s ease;
}

.copy-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.highlighted-container {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  min-height: 150px;
  border: 1px solid #e2e8f0;
  margin-bottom: 20px;
}

.highlighted-text {
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #0f172a;
}

.match-highlight {
  background: #fef08a;
  color: #854d0e;
  border-radius: 4px;
  padding: 0 2px;
  transition: all 0.1s ease;
}

.match-highlight:hover {
  background: #fde047;
  box-shadow: 0 0 0 2px #fef08a;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 12px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 0.85rem;
}

.no-matches {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
  font-style: italic;
}

.matches-list {
  margin-top: 20px;
  border-top: 1px solid #e2e8f0;
  padding-top: 20px;
}

.matches-title {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.matches-items {
  max-height: 200px;
  overflow-y: auto;
  background: #f8fafc;
  border-radius: 12px;
  padding: 8px;
}

.match-item {
  padding: 8px 12px;
  border-bottom: 1px solid #e2e8f0;
  font-family: monospace;
  font-size: 0.85rem;
  display: flex;
  gap: 12px;
  align-items: center;
}

.match-item:last-child {
  border-bottom: none;
}

.match-index {
  color: #64748b;
  font-weight: 600;
  min-width: 32px;
}

.match-value {
  background: white;
  padding: 4px 8px;
  border-radius: 6px;
  color: #0f172a;
  word-break: break-all;
}

@media (max-width: 768px) {
  .regex-tester {
    padding: 16px;
  }
  
  .patterns-grid {
    grid-template-columns: 1fr;
  }
  
  .flags-wrapper {
    flex-wrap: wrap;
  }
  
  .flag-btn {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }
}
</style>