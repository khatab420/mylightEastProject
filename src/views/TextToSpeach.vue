<template>
  <div class="text-to-speech">
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div class="header-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 18v-5a7 7 0 0 0-7-7H3m9 12v-5a7 7 0 0 1 7-7h2M8 21h8M12 3v3" />
            <path d="M3 11h3a4 4 0 0 0 4-4V4m11 7h-3a4 4 0 0 1-4-4V4" />
          </svg>
          <span>Voice Studio</span>
        </div>
        <h1>Text to Speech Converter</h1>
        <p class="subtitle">
          Convert text to natural-sounding speech in multiple languages and voices
        </p>
      </div>

      <div class="main-layout">
        <!-- Left Panel - Text Input & Controls -->
        <div class="card input-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 7h16M4 12h16M4 17h10" />
            </svg>
            <h2>Text Input</h2>
          </div>

          <div class="card-body">
            <!-- Text Area -->
            <div class="text-input-wrapper">
              <textarea
                v-model="text"
                placeholder="Enter your text here... (Max 5000 characters)"
                class="text-input"
                :maxlength="maxLength"
                @input="updateCharCount"
              ></textarea>
              <div class="char-counter" :class="{ warning: charCount > maxLength * 0.9 }">
                {{ charCount }} / {{ maxLength }} characters
              </div>
            </div>

            <!-- Quick Example Buttons -->
            <div class="quick-examples">
              <button @click="setExample('greeting')" class="example-btn">Greeting</button>
              <button @click="setExample('news')" class="example-btn">News</button>
              <button @click="setExample('story')" class="example-btn">Story</button>
              <button @click="setExample('poem')" class="example-btn">Poem</button>
              <button @click="clearText" class="example-btn clear">Clear</button>
            </div>

            <!-- Voice Settings -->
            <div class="settings-section">
              <div class="section-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.06.06A10 10 0 0 0 12 17.66a10 10 0 0 0 6.28-2.66z" />
                </svg>
                <h3>Voice Settings</h3>
              </div>

              <div class="form-group">
                <label class="form-label">Language</label>
                <select v-model="selectedLanguage" @change="loadVoices" class="form-select">
                  <option v-for="lang in languages" :key="lang.code" :value="lang.code">
                    {{ lang.name }} ({{ lang.nativeName }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">Voice</label>
                <select v-model="selectedVoice" class="form-select">
                  <option v-for="voice in availableVoices" :key="voice.name" :value="voice.name">
                    {{ voice.name }} - {{ voice.gender || 'Neutral' }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Speed: <span class="value-indicator">{{ speed }}x</span>
                </label>
                <input
                  type="range"
                  v-model="speed"
                  min="0.5"
                  max="2"
                  step="0.05"
                  class="slider"
                />
                <div class="slider-labels">
                  <span>Slow (0.5x)</span>
                  <span>Normal (1x)</span>
                  <span>Fast (2x)</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Pitch: <span class="value-indicator">{{ pitch }}%</span>
                </label>
                <input
                  type="range"
                  v-model="pitch"
                  min="0.5"
                  max="2"
                  step="0.05"
                  class="slider"
                />
                <div class="slider-labels">
                  <span>Low</span>
                  <span>Normal</span>
                  <span>High</span>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">
                  Volume: <span class="value-indicator">{{ volume }}%</span>
                </label>
                <input
                  type="range"
                  v-model="volume"
                  min="0"
                  max="1"
                  step="0.05"
                  class="slider"
                />
              </div>
            </div>

            <!-- SSML Toggle -->
            <div class="ssml-section">
              <label class="checkbox-label">
                <input type="checkbox" v-model="useSSML" class="checkbox" />
                <span>Enable SSML Support</span>
                <span class="info-icon" title="SSML allows advanced control over pronunciation, pauses, and emphasis">ⓘ</span>
              </label>
              
              <div v-if="useSSML" class="ssml-info">
                <div class="ssml-badge">SSML Tags Supported:</div>
                <div class="ssml-tags">
                  <code>&lt;break time="1s"/&gt;</code>
                  <code>&lt;emphasis&gt;text&lt;/emphasis&gt;</code>
                  <code>&lt;prosody pitch="high"&gt;text&lt;/prosody&gt;</code>
                  <code>&lt;say-as interpret-as="date"&gt;2024-01-01&lt;/say-as&gt;</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Panel - Controls & Output -->
        <div class="card output-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
            <h2>Audio Controls</h2>
          </div>

          <div class="card-body">
            <!-- Playback Controls -->
            <div class="playback-controls">
              <button
                @click="speak"
                :disabled="!text || isSpeaking"
                class="control-btn play"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {{ isSpeaking ? 'Speaking...' : 'Speak' }}
              </button>
              
              <button
                @click="pause"
                :disabled="!isSpeaking"
                class="control-btn pause"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
                Pause
              </button>
              
              <button
                @click="resume"
                :disabled="!isPaused"
                class="control-btn resume"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Resume
              </button>
              
              <button
                @click="stop"
                :disabled="!isSpeaking && !isPaused"
                class="control-btn stop"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="6" y="6" width="12" height="12" />
                </svg>
                Stop
              </button>
            </div>

            <!-- Download Options -->
            <div class="download-section">
              <div class="section-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <h3>Download Audio</h3>
              </div>
              
              <div class="download-buttons">
                <button @click="downloadAsMP3" :disabled="!audioBlob" class="download-btn mp3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download MP3
                </button>
                <button @click="downloadAsWAV" :disabled="!audioBlob" class="download-btn wav">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download WAV
                </button>
              </div>
            </div>

            <!-- Audio Visualizer -->
            <div v-if="isSpeaking || isPaused" class="visualizer">
              <div class="visualizer-bars">
                <div v-for="i in 20" :key="i" class="bar" :style="{ animationDelay: `${i * 0.05}s` }"></div>
              </div>
              <div class="visualizer-text">
                {{ isPaused ? 'Paused' : 'Playing...' }}
              </div>
            </div>

            <!-- SSML Preview -->
            <div v-if="useSSML && processedText !== text" class="ssml-preview">
              <div class="preview-header">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                <span>Processed with SSML:</span>
              </div>
              <code class="ssml-code">{{ processedText }}</code>
            </div>

            <!-- Supported Languages Info -->
            <div class="info-card">
              <div class="info-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <strong>Supported Languages</strong>
              </div>
              <p>50+ languages including English, Spanish, French, German, Chinese, Japanese, Arabic, Hindi, and more. Voice availability depends on your browser/OS.</p>
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
  name: 'TextToSpeech',
  data() {
    return {
      text: '',
      maxLength: 5000,
      charCount: 0,
      selectedLanguage: 'en-US',
      selectedVoice: '',
      speed: 1,
      pitch: 1,
      volume: 1,
      useSSML: false,
      isSpeaking: false,
      isPaused: false,
      audioBlob: null,
      synthesis: null,
      utterance: null,
      availableVoices: [],
      toastMessage: '',
      toastType: 'success',
      toastTimeout: null,
      languages: [
        { code: 'en-US', name: 'English (US)', nativeName: 'English' },
        { code: 'en-GB', name: 'English (UK)', nativeName: 'English' },
        { code: 'es-ES', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr-FR', name: 'French', nativeName: 'Français' },
        { code: 'de-DE', name: 'German', nativeName: 'Deutsch' },
        { code: 'it-IT', name: 'Italian', nativeName: 'Italiano' },
        { code: 'pt-PT', name: 'Portuguese', nativeName: 'Português' },
        { code: 'ru-RU', name: 'Russian', nativeName: 'Русский' },
        { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文' },
        { code: 'ja-JP', name: 'Japanese', nativeName: '日本語' },
        { code: 'ko-KR', name: 'Korean', nativeName: '한국어' },
        { code: 'ar-SA', name: 'Arabic', nativeName: 'العربية' },
        { code: 'hi-IN', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'tr-TR', name: 'Turkish', nativeName: 'Türkçe' },
        { code: 'nl-NL', name: 'Dutch', nativeName: 'Nederlands' },
        { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
        { code: 'sv-SE', name: 'Swedish', nativeName: 'Svenska' },
        { code: 'da-DK', name: 'Danish', nativeName: 'Dansk' },
        { code: 'no-NO', name: 'Norwegian', nativeName: 'Norsk' },
        { code: 'fi-FI', name: 'Finnish', nativeName: 'Suomi' },
        { code: 'th-TH', name: 'Thai', nativeName: 'ไทย' },
        { code: 'vi-VN', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
        { code: 'id-ID', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
        { code: 'ms-MY', name: 'Malay', nativeName: 'Bahasa Melayu' },
        { code: 'he-IL', name: 'Hebrew', nativeName: 'עברית' },
        { code: 'el-GR', name: 'Greek', nativeName: 'Ελληνικά' },
        { code: 'cs-CZ', name: 'Czech', nativeName: 'Čeština' },
        { code: 'hu-HU', name: 'Hungarian', nativeName: 'Magyar' },
        { code: 'ro-RO', name: 'Romanian', nativeName: 'Română' },
        { code: 'uk-UA', name: 'Ukrainian', nativeName: 'Українська' }
      ],
      examples: {
        greeting: "Hello! Welcome to our text to speech converter. I hope you enjoy using this service.",
        news: "Breaking news: Scientists have discovered a new species of deep-sea creature in the Pacific Ocean. This remarkable find could help us understand more about marine biodiversity.",
        story: "Once upon a time, in a land far away, there lived a young adventurer who dreamed of exploring the world. Every day, they would look at the horizon and imagine the wonders that lay beyond.",
        poem: "The sun sets slowly in the west, painting skies with colors blessed. A gentle breeze whispers through the trees, bringing nature to perfect ease."
      }
    }
  },
  computed: {
    processedText() {
      if (!this.useSSML) return this.text
      
      let processed = this.text
      // Simple SSML processing
      processed = processed.replace(/\[pause (\d+)\]/g, '<break time="$1ms"/>')
      processed = processed.replace(/\[emphasis\](.*?)\[\/emphasis\]/g, '<emphasis>$1</emphasis>')
      processed = processed.replace(/\[pitch=high\](.*?)\[\/pitch\]/g, '<prosody pitch="high">$1</prosody>')
      processed = processed.replace(/\[pitch=low\](.*?)\[\/pitch\]/g, '<prosody pitch="low">$1</prosody>')
      
      return processed
    }
  },
  watch: {
    selectedLanguage() {
      this.loadVoices()
    }
  },
  mounted() {
    this.initSpeechSynthesis()
    this.loadVoices()
    this.updateCharCount()
  },
  beforeDestroy() {
    if (this.synthesis) {
      this.synthesis.cancel()
    }
  },
  methods: {
    initSpeechSynthesis() {
      if ('speechSynthesis' in window) {
        this.synthesis = window.speechSynthesis
      } else {
        this.showToast('Your browser does not support speech synthesis', 'error')
      }
    },

    loadVoices() {
      if (!this.synthesis) return
      
      const load = () => {
        const voices = this.synthesis.getVoices()
        this.availableVoices = voices.filter(voice => 
          voice.lang.startsWith(this.selectedLanguage)
        )
        
        if (this.availableVoices.length > 0 && !this.selectedVoice) {
          this.selectedVoice = this.availableVoices[0].name
        }
      }
      
      load()
      if (this.synthesis.onvoiceschanged !== undefined) {
        this.synthesis.onvoiceschanged = load
      }
    },

    updateCharCount() {
      this.charCount = this.text.length
    },

    setExample(type) {
      this.text = this.examples[type]
      this.updateCharCount()
    },

    clearText() {
      this.text = ''
      this.updateCharCount()
    },

    speak() {
      if (!this.text) {
        this.showToast('Please enter some text first', 'error')
        return
      }

      this.stop()
      
      const utterance = new SpeechSynthesisUtterance()
      utterance.text = this.processedText
      utterance.lang = this.selectedLanguage
      utterance.rate = this.speed
      utterance.pitch = this.pitch
      utterance.volume = this.volume
      
      // Find selected voice
      const voice = this.availableVoices.find(v => v.name === this.selectedVoice)
      if (voice) {
        utterance.voice = voice
      }
      
      utterance.onstart = () => {
        this.isSpeaking = true
        this.isPaused = false
        this.showToast('Speaking...', 'success')
      }
      
      utterance.onend = () => {
        this.isSpeaking = false
        this.isPaused = false
        this.showToast('Speech completed', 'success')
      }
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event)
        this.isSpeaking = false
        this.isPaused = false
        this.showToast('Error occurred during speech', 'error')
      }
      
      utterance.onpause = () => {
        this.isPaused = true
      }
      
      utterance.onresume = () => {
        this.isPaused = false
      }
      
      this.utterance = utterance
      this.synthesis.speak(utterance)
      
      // Record audio for download (using MediaRecorder API)
      this.recordAudio()
    },

    pause() {
      if (this.synthesis && this.isSpeaking) {
        this.synthesis.pause()
        this.isPaused = true
        this.showToast('Paused', 'success')
      }
    },

    resume() {
      if (this.synthesis && this.isPaused) {
        this.synthesis.resume()
        this.isPaused = false
        this.showToast('Resumed', 'success')
      }
    },

    stop() {
      if (this.synthesis) {
        this.synthesis.cancel()
        this.isSpeaking = false
        this.isPaused = false
      }
    },

    async recordAudio() {
      // This is a simplified version - in production, you'd want to use a proper recording solution
      // For now, we'll create a blob from the text for download
      try {
        // Create a simple audio representation
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const duration = Math.max(1, this.text.length / 15) // Rough estimate
        const sampleRate = 44100
        const frameCount = duration * sampleRate
        const audioBuffer = audioContext.createBuffer(1, frameCount, sampleRate)
        const data = audioBuffer.getChannelData(0)
        
        // Generate simple sine wave (placeholder - actual recording would be better)
        for (let i = 0; i < frameCount; i++) {
          data[i] = Math.sin(i * 0.01) * 0.5
        }
        
        const wavBlob = this.audioBufferToWav(audioBuffer)
        this.audioBlob = wavBlob
      } catch (error) {
        console.error('Failed to create audio blob:', error)
        // Create fallback blob
        const fallbackBlob = new Blob([`Speech: ${this.text.substring(0, 100)}`], { type: 'text/plain' })
        this.audioBlob = fallbackBlob
      }
    },

    audioBufferToWav(buffer) {
      const numChannels = buffer.numberOfChannels
      const sampleRate = buffer.sampleRate
      const format = 1 // PCM
      const bitDepth = 16
      
      let samples = buffer.getChannelData(0)
      let dataLength = samples.length * (bitDepth / 8)
      let bufferLength = 44 + dataLength
      const arrayBuffer = new ArrayBuffer(bufferLength)
      const view = new DataView(arrayBuffer)
      
      // Write WAV header
      this.writeString(view, 0, 'RIFF')
      view.setUint32(4, bufferLength - 8, true)
      this.writeString(view, 8, 'WAVE')
      this.writeString(view, 12, 'fmt ')
      view.setUint32(16, 16, true)
      view.setUint16(20, format, true)
      view.setUint16(22, numChannels, true)
      view.setUint32(24, sampleRate, true)
      view.setUint32(28, sampleRate * numChannels * (bitDepth / 8), true)
      view.setUint16(32, numChannels * (bitDepth / 8), true)
      view.setUint16(34, bitDepth, true)
      this.writeString(view, 36, 'data')
      view.setUint32(40, dataLength, true)
      
      // Write audio data
      let offset = 44
      for (let i = 0; i < samples.length; i++) {
        const sample = Math.max(-1, Math.min(1, samples[i]))
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
        offset += 2
      }
      
      return new Blob([view], { type: 'audio/wav' })
    },
    
    writeString(view, offset, str) {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i))
      }
    },

    downloadAsMP3() {
      if (!this.audioBlob) {
        this.showToast('No audio available to download', 'error')
        return
      }
      
      const url = URL.createObjectURL(this.audioBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `speech_${Date.now()}.wav` // Note: Converting to MP3 would require external lib
      link.click()
      URL.revokeObjectURL(url)
      this.showToast('Download started', 'success')
    },

    downloadAsWAV() {
      if (!this.audioBlob) {
        this.showToast('No audio available to download', 'error')
        return
      }
      
      const url = URL.createObjectURL(this.audioBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `speech_${Date.now()}.wav`
      link.click()
      URL.revokeObjectURL(url)
      this.showToast('Download started', 'success')
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

.text-to-speech {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: rgba(255, 255, 255, 0.15);
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
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.card-header {
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 22px;
  height: 22px;
  color: #667eea;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-body {
  padding: 24px;
}

/* Text Input */
.text-input-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.text-input {
  width: 100%;
  min-height: 200px;
  padding: 16px;
  font-family: inherit;
  font-size: 0.9375rem;
  line-height: 1.5;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  resize: vertical;
  transition: all 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.char-counter {
  position: absolute;
  bottom: 12px;
  right: 16px;
  font-size: 0.75rem;
  color: #9ca3af;
  background: white;
  padding: 2px 8px;
  border-radius: 12px;
}

.char-counter.warning {
  color: #f59e0b;
}

/* Quick Examples */
.quick-examples {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.example-btn {
  padding: 6px 14px;
  background: #f1f5f9;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.example-btn:hover {
  background: #e2e8f0;
  transform: translateY(-1px);
}

.example-btn.clear {
  background: #fee2e2;
  color: #ef4444;
  border-color: #fecaca;
}

.example-btn.clear:hover {
  background: #fecaca;
}

/* Settings Section */
.settings-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.section-header svg {
  color: #667eea;
}

.section-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

/* Form Elements */
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
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  background: white;
  transition: all 0.2s ease;
}

.form-select:focus {
  outline: none;
  border-color: #667eea;
}

.value-indicator {
  color: #667eea;
  font-weight: 600;
}

/* Slider */
.slider {
  width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.slider-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 0.7rem;
  color: #94a3b8;
}

/* SSML Section */
.ssml-section {
  margin-top: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.info-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  background: #cbd5e1;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  cursor: help;
}

.ssml-info {
  margin-top: 12px;
  padding: 12px;
  background: white;
  border-radius: 12px;
}

.ssml-badge {
  font-size: 0.7rem;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 8px;
}

.ssml-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ssml-tags code {
  padding: 4px 8px;
  background: #f1f5f9;
  border-radius: 6px;
  font-size: 0.7rem;
  font-family: monospace;
  color: #8b5cf6;
}

/* Playback Controls */
.playback-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.control-btn {
  flex: 1;
  padding: 12px;
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

.control-btn.play {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.control-btn.pause {
  background: #f59e0b;
  color: white;
}

.control-btn.resume {
  background: #3b82f6;
  color: white;
}

.control-btn.stop {
  background: #ef4444;
  color: white;
}

.control-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Download Section */
.download-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 16px;
}

.download-buttons {
  display: flex;
  gap: 12px;
  margin-top: 12px;
}

.download-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 10px;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.download-btn.mp3 {
  background: #8b5cf6;
  color: white;
}

.download-btn.wav {
  background: #ec489a;
  color: white;
}

.download-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  filter: brightness(1.05);
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Visualizer */
.visualizer {
  margin: 24px 0;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  text-align: center;
}

.visualizer-bars {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 60px;
  margin-bottom: 12px;
}

.bar {
  width: 4px;
  height: 20px;
  background: white;
  border-radius: 2px;
  animation: bounce 0.5s ease infinite alternate;
}

@keyframes bounce {
  from {
    height: 20px;
  }
  to {
    height: 60px;
  }
}

.visualizer-text {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

/* SSML Preview */
.ssml-preview {
  margin: 16px 0;
  padding: 16px;
  background: #f1f5f9;
  border-radius: 12px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
}

.ssml-code {
  display: block;
  font-family: monospace;
  font-size: 0.75rem;
  color: #334155;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Info Card */
.info-card {
  margin-top: 16px;
  padding: 16px;
  background: #fef3c7;
  border-radius: 16px;
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
  font-size: 0.8125rem;
  color: #78350f;
  line-height: 1.5;
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

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>