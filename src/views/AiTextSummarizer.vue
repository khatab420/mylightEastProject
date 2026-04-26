<template>
  <div class="ai-summarizer">
    <div class="summarizer-header">
      <h2>AI Text Summarizer</h2>
      <p>Summarize long articles, documents, or text into concise summaries using AI.</p>
    </div>

    <div class="summarizer-main">
      <!-- Input Section -->
      <div class="input-section">
        <div class="section-header">
          <label>
            <span class="label-icon">📝</span>
            Text to Summarize
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
            <button @click="uploadFile" class="action-btn" title="Upload File">
              📄 Upload
            </button>
          </div>
        </div>
        
        <textarea
          v-model="inputText"
          @input="onTextChange"
          placeholder="Paste or type your text here (minimum 100 characters for best results)..."
          class="text-input"
          rows="10"
        ></textarea>
        
        <input
          type="file"
          ref="fileInput"
          @change="handleFileUpload"
          accept=".txt,.doc,.docx,.pdf"
          style="display: none"
        />
        
        <div class="input-stats">
          <span>Characters: {{ inputText.length }}</span>
          <span>Words: {{ wordCount }}</span>
          <span>Sentences: {{ sentenceCount }}</span>
        </div>
      </div>

      <!-- Summary Options -->
      <div class="options-section">
        <div class="options-grid">
          <div class="option-group">
            <label>Summary Type</label>
            <div class="type-buttons">
              <button
                @click="summaryType = 'short'"
                :class="['type-btn', { active: summaryType === 'short' }]"
              >
                Short (20-30%)
              </button>
              <button
                @click="summaryType = 'detailed'"
                :class="['type-btn', { active: summaryType === 'detailed' }]"
              >
                Detailed (40-50%)
              </button>
            </div>
          </div>

          <div class="option-group">
            <label>Number of Sentences</label>
            <input
              type="range"
              v-model="numSentences"
              min="3"
              max="15"
              step="1"
              class="sentences-slider"
            />
            <span class="sentence-value">{{ numSentences }} sentences</span>
          </div>

          <div class="option-group">
            <label>Language</label>
            <select v-model="language" class="language-select">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="pt">Portuguese</option>
              <option value="ru">Russian</option>
              <option value="zh">Chinese (Simplified)</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </select>
          </div>
        </div>

        <button
          @click="generateSummary"
          :disabled="isLoading || !isValidText"
          class="summarize-btn"
        >
          <span v-if="!isLoading">✨ Generate Summary</span>
          <span v-else class="loading-spinner">⏳ Generating Summary...</span>
        </button>
      </div>

      <!-- Summary Output Section -->
      <div class="output-section" v-if="summaryText">
        <div class="section-header">
          <label>
            <span class="label-icon">✨</span>
            AI Summary
          </label>
          <div class="header-actions">
            <button @click="copySummary" class="action-btn" title="Copy">
              📋 Copy
            </button>
            <button @click="downloadSummary" class="action-btn" title="Download">
              💾 Download
            </button>
            <button @click="speakSummary" class="action-btn" title="Listen">
              🔊 Listen
            </button>
          </div>
        </div>
        
        <div class="summary-content">
          <p>{{ summaryText }}</p>
        </div>
        
        <div class="summary-stats">
          <span>Original: {{ originalLength }} characters</span>
          <span>Summary: {{ summaryLength }} characters</span>
          <span>Compression: {{ compressionRatio }}%</span>
          <span>Reading time: {{ readingTime }}</span>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <div class="loading-spinner-large"></div>
        <p>Analyzing text and generating summary...</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        ⚠️ {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script>
// Advanced Text Summarization Algorithm
class TextSummarizer {
  constructor() {
    this.stopWords = new Set([
      'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
      'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'were',
      'will', 'with', 'i', 'you', 'we', 'they', 'them', 'their', 'our', 'your'
    ]);
  }

  preprocessText(text) {
    // Clean and normalize text
    text = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return text;
  }

  sentenceTokenize(text) {
    // Split text into sentences
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    return sentences.map(s => s.trim()).filter(s => s.length > 0);
  }

  wordTokenize(sentence) {
    return sentence.toLowerCase().split(/\s+/).filter(word => word.length > 0);
  }

  calculateWordFrequency(sentences) {
    const wordFreq = new Map();
    
    sentences.forEach(sentence => {
      const words = this.wordTokenize(sentence);
      words.forEach(word => {
        if (!this.stopWords.has(word) && word.length > 2) {
          wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
        }
      });
    });
    
    // Normalize frequencies
    const maxFreq = Math.max(...wordFreq.values());
    wordFreq.forEach((value, key) => {
      wordFreq.set(key, value / maxFreq);
    });
    
    return wordFreq;
  }

  scoreSentences(sentences, wordFreq) {
    const sentenceScores = [];
    
    sentences.forEach((sentence, index) => {
      let score = 0;
      const words = this.wordTokenize(sentence);
      
      words.forEach(word => {
        if (wordFreq.has(word)) {
          score += wordFreq.get(word);
        }
      });
      
      // Normalize by sentence length
      score = words.length > 0 ? score / words.length : 0;
      
      // Boost first sentence
      if (index === 0) score *= 1.2;
      
      sentenceScores.push({ index, score, sentence });
    });
    
    return sentenceScores;
  }

  extractSummary(text, numSentences, summaryType = 'detailed') {
    if (!text || text.length < 50) {
      return text;
    }
    
    const sentences = this.sentenceTokenize(text);
    if (sentences.length <= numSentences) {
      return text;
    }
    
    const processedText = this.preprocessText(text);
    const processedSentences = this.sentenceTokenize(processedText);
    const wordFreq = this.calculateWordFrequency(processedSentences);
    const sentenceScores = this.scoreSentences(processedSentences, wordFreq);
    
    // Sort by score and select top sentences
    sentenceScores.sort((a, b) => b.score - a.score);
    const selectedIndices = new Set();
    
    let targetSentences = numSentences;
    if (summaryType === 'short') {
      targetSentences = Math.max(3, Math.floor(sentences.length * 0.25));
    } else {
      targetSentences = Math.max(5, Math.floor(sentences.length * 0.4));
    }
    
    targetSentences = Math.min(targetSentences, sentences.length, numSentences);
    
    for (let i = 0; i < targetSentences && i < sentenceScores.length; i++) {
      selectedIndices.add(sentenceScores[i].index);
    }
    
    // Reconstruct summary in original order
    const summarySentences = [];
    for (let i = 0; i < sentences.length; i++) {
      if (selectedIndices.has(i)) {
        summarySentences.push(sentences[i]);
      }
    }
    
    return summarySentences.join(' ');
  }
}

export default {
  name: 'AiTextSummarizer',
  data() {
    return {
      inputText: '',
      summaryText: '',
      isLoading: false,
      errorMessage: null,
      summaryType: 'detailed',
      numSentences: 8,
      language: 'en',
      summarizer: null
    };
  },
  computed: {
    wordCount() {
      return this.inputText.trim().split(/\s+/).filter(w => w.length > 0).length;
    },
    sentenceCount() {
      const sentences = this.inputText.match(/[^.!?]+[.!?]+/g);
      return sentences ? sentences.length : 0;
    },
    isValidText() {
      return this.inputText.trim().length > 50;
    },
    originalLength() {
      return this.inputText.length;
    },
    summaryLength() {
      return this.summaryText.length;
    },
    compressionRatio() {
      if (!this.originalLength) return 0;
      return ((1 - this.summaryLength / this.originalLength) * 100).toFixed(1);
    },
    readingTime() {
      const wordsPerMinute = 200;
      const words = this.summaryText.split(/\s+/).length;
      const minutes = Math.ceil(words / wordsPerMinute);
      return `${minutes} min read`;
    }
  },
  mounted() {
    this.summarizer = new TextSummarizer();
  },
  methods: {
    onTextChange() {
      this.errorMessage = null;
    },
    async generateSummary() {
      if (!this.isValidText) {
        this.errorMessage = 'Please enter at least 50 characters for summarization.';
        return;
      }
      
      this.isLoading = true;
      this.errorMessage = null;
      
      try {
        // Simulate AI processing time for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let summary = this.summarizer.extractSummary(
          this.inputText,
          this.numSentences,
          this.summaryType
        );
        
        // Post-process summary based on language
        summary = this.postProcessSummary(summary);
        
        this.summaryText = summary;
      } catch (error) {
        console.error('Summarization error:', error);
        this.errorMessage = 'Failed to generate summary. Please try again with different text.';
      } finally {
        this.isLoading = false;
      }
    },
    
    postProcessSummary(summary) {
      // Clean up the summary
      summary = summary.replace(/\s+/g, ' ').trim();
      
      // Ensure summary ends with proper punctuation
      if (!summary.match(/[.!?]$/)) {
        summary += '.';
      }
      
      // Capitalize first letter
      summary = summary.charAt(0).toUpperCase() + summary.slice(1);
      
      return summary;
    },
    
    clearInput() {
      this.inputText = '';
      this.summaryText = '';
      this.errorMessage = null;
    },
    
    async pasteFromClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        this.inputText = text;
        this.errorMessage = null;
      } catch (err) {
        this.errorMessage = 'Failed to paste from clipboard. Please check permissions.';
      }
    },
    
    loadSample() {
      this.inputText = `Artificial intelligence (AI) is transforming the world in unprecedented ways. From healthcare to transportation, education to entertainment, AI systems are becoming increasingly integrated into our daily lives. Machine learning algorithms can now diagnose diseases more accurately than human doctors in some cases, self-driving cars are navigating city streets, and virtual assistants are helping us manage our schedules and homes.

However, the rapid advancement of AI also raises important ethical questions. How do we ensure that AI systems are fair and unbiased? What happens to jobs that are automated? How do we maintain human control over increasingly autonomous systems? These are questions that researchers, policymakers, and society as a whole must grapple with.

Despite these challenges, the potential benefits of AI are enormous. AI can help us solve some of humanity's biggest problems, from climate change to poverty to disease. By augmenting human intelligence rather than replacing it, AI has the potential to create a better future for everyone. The key is to develop AI responsibly, with careful consideration of ethical implications and a commitment to using this powerful technology for the greater good.`;
      this.errorMessage = null;
    },
    
    uploadFile() {
      this.$refs.fileInput.click();
    },
    
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      this.isLoading = true;
      
      try {
        const text = await this.readFileAsText(file);
        this.inputText = text;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = 'Failed to read file. Please ensure it\'s a text file.';
      } finally {
        this.isLoading = false;
        event.target.value = '';
      }
    },
    
    readFileAsText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (e) => reject(e);
        reader.readAsText(file);
      });
    },
    
    async copySummary() {
      if (!this.summaryText) return;
      
      try {
        await navigator.clipboard.writeText(this.summaryText);
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        this.errorMessage = 'Failed to copy to clipboard';
      }
    },
    
    downloadSummary() {
      if (!this.summaryText) return;
      
      const content = `# AI Generated Summary\n\n${this.summaryText}\n\n---\nGenerated by AI Text Summarizer\nOriginal text length: ${this.originalLength} characters\nSummary length: ${this.summaryLength} characters\nCompression: ${this.compressionRatio}%`;
      
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `summary-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    speakSummary() {
      if (!this.summaryText) return;
      
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(this.summaryText);
        utterance.lang = this.getSpeechLanguage();
        utterance.rate = 0.9;
        utterance.pitch = 1;
        
        window.speechSynthesis.cancel(); // Stop any ongoing speech
        window.speechSynthesis.speak(utterance);
      } else {
        this.errorMessage = 'Text-to-speech is not supported in your browser.';
      }
    },
    
    getSpeechLanguage() {
      const langMap = {
        en: 'en-US',
        es: 'es-ES',
        fr: 'fr-FR',
        de: 'de-DE',
        it: 'it-IT',
        pt: 'pt-PT',
        ru: 'ru-RU',
        zh: 'zh-CN',
        ja: 'ja-JP',
        ko: 'ko-KR'
      };
      return langMap[this.language] || 'en-US';
    }
  }
};
</script>

<style scoped>
.ai-summarizer {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.summarizer-header {
  margin-bottom: 32px;
  text-align: center;
}

.summarizer-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.summarizer-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.summarizer-main {
  background: #1e293b;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-section,
.options-section,
.output-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #e2e8f0;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.action-btn:hover {
  background: #334155;
  color: #e2e8f0;
  transform: translateY(-1px);
}

.text-input {
  width: 100%;
  padding: 16px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 12px;
  color: #e2e8f0;
  font-family: inherit;
  font-size: 0.95rem;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-stats {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  padding: 8px 12px;
  background: #1e293b;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #94a3b8;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.option-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-group label {
  color: #e2e8f0;
  font-weight: 500;
  font-size: 0.85rem;
}

.type-buttons {
  display: flex;
  gap: 12px;
}

.type-btn {
  flex: 1;
  padding: 8px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.type-btn:hover {
  background: #334155;
}

.type-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.sentences-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #334155;
  outline: none;
  -webkit-appearance: none;
}

.sentences-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
}

.sentence-value {
  text-align: center;
  color: #94a3b8;
  font-size: 0.85rem;
}

.language-select {
  padding: 8px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  cursor: pointer;
  font-size: 0.85rem;
}

.summarize-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.summarize-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.summarize-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.summary-content {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;
  line-height: 1.6;
  color: #e2e8f0;
  font-size: 1rem;
}

.summary-content p {
  margin: 0;
}

.summary-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 12px;
  background: #1e293b;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #94a3b8;
}

.loading-container {
  text-align: center;
  padding: 40px;
  background: #0f172a;
  border-radius: 16px;
}

.loading-spinner-large {
  width: 50px;
  height: 50px;
  border: 4px solid #334155;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

.loading-spinner {
  display: inline-block;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.error-message {
  padding: 12px;
  background: rgba(220, 38, 38, 0.1);
  border-left: 3px solid #ef4444;
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .ai-summarizer {
    padding: 16px;
  }
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .type-buttons {
    flex-direction: column;
  }
  
  .header-actions {
    flex-wrap: wrap;
  }
}
</style>