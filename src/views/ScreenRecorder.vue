<template>
  <div class="screen-recorder">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 class="hero-title">Screen Recorder</h1>
        <p class="hero-description">
          Record your screen, window, or browser tab. Export as MP4 or animated GIF for tutorials and demos.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Recording Controls -->
      <div class="controls-card">
        <div class="controls-header">
          <h3>🎥 Recording Controls</h3>
          <div class="recording-status" :class="{ recording: isRecording }">
            <span class="status-dot"></span>
            <span class="status-text">{{ isRecording ? 'Recording' : 'Ready' }}</span>
            <span v-if="recordingTime" class="timer">{{ formatTime(recordingTime) }}</span>
          </div>
        </div>

        <div class="controls-grid">
          <div class="control-group">
            <label class="control-label">Source Type</label>
            <div class="source-buttons">
              <button 
                @click="selectSource('screen')" 
                :class="['source-btn', { active: sourceType === 'screen' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Entire Screen
              </button>
              <button 
                @click="selectSource('window')" 
                :class="['source-btn', { active: sourceType === 'window' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                Application Window
              </button>
              <button 
                @click="selectSource('tab')" 
                :class="['source-btn', { active: sourceType === 'tab' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                </svg>
                Browser Tab
              </button>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">Export Format</label>
            <div class="format-buttons">
              <button 
                @click="exportFormat = 'mp4'" 
                :class="['format-btn', { active: exportFormat === 'mp4' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
                MP4 Video
              </button>
              <button 
                @click="exportFormat = 'gif'" 
                :class="['format-btn', { active: exportFormat === 'gif' }]"
              >
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Animated GIF
              </button>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">Quality (FPS)</label>
            <div class="quality-slider">
              <input 
                type="range" 
                v-model.number="frameRate" 
                min="5" 
                max="60" 
                step="5"
                class="quality-range"
              />
              <span class="quality-value">{{ frameRate }} fps</span>
            </div>
          </div>

          <div class="control-group">
            <label class="control-label">
              <input type="checkbox" v-model="includeAudio" />
              Include Audio (Microphone)
            </label>
          </div>
        </div>

        <div class="recording-buttons">
          <button 
            v-if="!isRecording && !isProcessing"
            @click="startRecording" 
            class="record-btn start"
            :disabled="!isSourceSupported"
          >
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Start Recording
          </button>
          <button 
            v-if="isRecording"
            @click="stopRecording" 
            class="record-btn stop"
          >
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
            Stop Recording
          </button>
          <div v-if="isProcessing" class="processing-indicator">
            <div class="spinner"></div>
            Processing recording...
          </div>
        </div>
      </div>

      <!-- Preview Section -->
      <div v-if="recordedVideo" class="preview-card">
        <div class="preview-header">
          <h3>🎬 Recording Preview</h3>
          <div class="preview-actions">
            <button @click="downloadRecording" class="download-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button @click="clearRecording" class="clear-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
          </div>
        </div>
        
        <video ref="videoPreview" class="video-preview" controls></video>
        
        <!-- Trimming Tools -->
        <div class="trimming-tools">
          <h4>✂️ Trimming Tools</h4>
          <div class="trim-controls">
            <div class="trim-input">
              <label>Start Time (seconds)</label>
              <input type="number" v-model.number="trimStart" min="0" :max="videoDuration" step="0.5" />
            </div>
            <div class="trim-input">
              <label>End Time (seconds)</label>
              <input type="number" v-model.number="trimEnd" :min="trimStart" :max="videoDuration" step="0.5" />
            </div>
            <div class="trim-input">
              <label>Duration</label>
              <input type="text" :value="formatTime(trimEnd - trimStart)" disabled />
            </div>
            <button @click="applyTrim" class="trim-btn">
              Apply Trim
            </button>
            <button @click="resetTrim" class="reset-trim-btn">
              Reset
            </button>
          </div>
          
          <!-- Timeline -->
          <div class="timeline" v-if="videoDuration > 0">
            <div class="timeline-track" @click="seekToPosition">
              <div class="timeline-progress" :style="{ width: trimProgress + '%' }"></div>
              <div class="timeline-handle start" :style="{ left: trimStartPercent + '%' }" @mousedown="startDrag('start', $event)"></div>
              <div class="timeline-handle end" :style="{ left: trimEndPercent + '%' }" @mousedown="startDrag('end', $event)"></div>
            </div>
            <div class="timeline-labels">
              <span>0:00</span>
              <span>{{ formatTime(videoDuration) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recording List -->
      <div v-if="recordings.length > 0" class="recordings-card">
        <div class="recordings-header">
          <h3>📁 Recent Recordings</h3>
          <button @click="clearAllRecordings" class="clear-all-btn">Clear All</button>
        </div>
        <div class="recordings-list">
          <div v-for="(rec, index) in recordings" :key="index" class="recording-item">
            <div class="recording-info">
              <span class="recording-icon">🎥</span>
              <div class="recording-details">
                <div class="recording-name">Recording {{ recordings.length - index }}</div>
                <div class="recording-meta">
                  {{ formatDate(rec.timestamp) }} • {{ formatFileSize(rec.size) }} • {{ rec.format.toUpperCase() }}
                </div>
              </div>
            </div>
            <div class="recording-actions">
              <button @click="previewRecording(rec)" class="preview-rec-btn">Preview</button>
              <button @click="downloadRecordingById(rec)" class="download-rec-btn">Download</button>
              <button @click="deleteRecording(index)" class="delete-rec-btn">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <h3>💡 Recording Tips</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">🎯</span>
            <div class="tip-content">
              <strong>Choose the right source</strong>
              <p>Select specific windows or tabs to avoid recording sensitive information</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⚡</span>
            <div class="tip-content">
              <strong>Frame rate</strong>
              <p>30fps is good for most content, 60fps for gaming/high motion</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🎤</span>
            <div class="tip-content">
              <strong>Audio narration</strong>
              <p>Enable microphone to add voice-over to your tutorials</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">✂️</span>
            <div class="tip-content">
              <strong>Trim recordings</strong>
              <p>Remove unwanted parts at the beginning or end of your recording</p>
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
  name: 'ScreenRecorder',
  data() {
    return {
      sourceType: 'screen',
      exportFormat: 'mp4',
      frameRate: 30,
      includeAudio: false,
      isRecording: false,
      isProcessing: false,
      isSourceSupported: true,
      mediaStream: null,
      mediaRecorder: null,
      recordedChunks: [],
      recordedVideo: null,
      recordedBlob: null,
      recordings: [],
      recordingTime: 0,
      recordingInterval: null,
      trimStart: 0,
      trimEnd: 0,
      videoDuration: 0,
      dragging: null,
      toastMessage: '',
      videoUrl: null
    }
  },
  computed: {
    trimProgress() {
      if (this.videoDuration === 0) return 0
      return ((this.trimEnd - this.trimStart) / this.videoDuration) * 100
    },
    trimStartPercent() {
      if (this.videoDuration === 0) return 0
      return (this.trimStart / this.videoDuration) * 100
    },
    trimEndPercent() {
      if (this.videoDuration === 0) return 100
      return (this.trimEnd / this.videoDuration) * 100
    }
  },
  mounted() {
    this.checkBrowserSupport()
  },
  beforeUnmount() {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval)
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop())
    }
  },
  methods: {
    checkBrowserSupport() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        this.isSourceSupported = false
        this.showToast('Your browser does not support screen recording. Please use Chrome, Edge, or Firefox.')
      }
    },

    selectSource(type) {
      this.sourceType = type
      this.showToast(`Selected ${type === 'screen' ? 'entire screen' : type === 'window' ? 'application window' : 'browser tab'} as recording source`)
    },

    async startRecording() {
      try {
        const constraints = {
          video: {
            cursor: 'always',
            frameRate: { ideal: this.frameRate }
          },
          audio: this.includeAudio
        }

        if (this.sourceType === 'window') {
          constraints.video.displaySurface = 'window'
        } else if (this.sourceType === 'tab') {
          constraints.video.displaySurface = 'browser'
        }

        this.mediaStream = await navigator.mediaDevices.getDisplayMedia(constraints)
        
        let finalStream = this.mediaStream
        
        if (this.includeAudio) {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          const audioTrack = audioStream.getAudioTracks()[0]
          finalStream.addTrack(audioTrack)
        }
        
        const mimeType = this.exportFormat === 'mp4' ? 'video/webm' : 'video/webm'
        this.mediaRecorder = new MediaRecorder(finalStream, {
          mimeType: mimeType,
          videoBitsPerSecond: 2500000
        })
        
        this.recordedChunks = []
        
        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.recordedChunks.push(event.data)
          }
        }
        
        this.mediaRecorder.onstop = () => {
          this.onRecordingStopped()
        }
        
        this.mediaRecorder.start(1000)
        this.isRecording = true
        this.startTimer()
        this.showToast('Recording started... Press "Stop Recording" when done')
        
        // Handle stream end (when user clicks "Stop Sharing" in browser)
        this.mediaStream.getVideoTracks()[0].onended = () => {
          this.stopRecording()
        }
      } catch (error) {
        console.error('Error starting recording:', error)
        this.showToast('Failed to start recording. Please check permissions.')
      }
    },

    stopRecording() {
      if (this.mediaRecorder && this.isRecording) {
        this.mediaRecorder.stop()
        this.isRecording = false
        this.stopTimer()
        this.showToast('Recording stopped, processing video...')
        
        if (this.mediaStream) {
          this.mediaStream.getTracks().forEach(track => track.stop())
        }
      }
    },

    onRecordingStopped() {
      this.isProcessing = true
      
      const blob = new Blob(this.recordedChunks, { 
        type: this.exportFormat === 'mp4' ? 'video/webm' : 'video/webm'
      })
      
      this.recordedBlob = blob
      this.recordedVideo = URL.createObjectURL(blob)
      
      const videoElement = this.$refs.videoPreview
      if (videoElement) {
        videoElement.src = this.recordedVideo
        videoElement.addEventListener('loadedmetadata', () => {
          this.videoDuration = videoElement.duration
          this.trimEnd = this.videoDuration
          this.isProcessing = false
          this.showToast('Recording completed successfully!')
        })
      }
    },

    async applyTrim() {
      if (!this.recordedBlob) return
      
      this.isProcessing = true
      
      const video = document.createElement('video')
      video.src = this.recordedVideo
      
      await new Promise((resolve) => {
        video.addEventListener('loadedmetadata', resolve)
      })
      
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      
      const stream = canvas.captureStream(this.frameRate)
      const recorder = new MediaRecorder(stream, {
        mimeType: 'video/webm',
        videoBitsPerSecond: 2500000
      })
      
      const chunks = []
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }
      
      await new Promise((resolve) => {
        recorder.onstop = resolve
        recorder.start()
        
        video.currentTime = this.trimStart
        video.play()
        
        const drawFrame = () => {
          if (video.currentTime >= this.trimEnd) {
            recorder.stop()
            video.pause()
            return
          }
          
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          requestAnimationFrame(drawFrame)
        }
        
        drawFrame()
      })
      
      const trimmedBlob = new Blob(chunks, { type: 'video/webm' })
      this.recordedBlob = trimmedBlob
      URL.revokeObjectURL(this.recordedVideo)
      this.recordedVideo = URL.createObjectURL(trimmedBlob)
      this.$refs.videoPreview.src = this.recordedVideo
      this.isProcessing = false
      this.showToast('Video trimmed successfully!')
    },

    resetTrim() {
      this.trimStart = 0
      this.trimEnd = this.videoDuration
      this.showToast('Trim reset to original length')
    },

    seekToPosition(event) {
      const rect = event.currentTarget.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width
      const time = percent * this.videoDuration
      if (this.$refs.videoPreview) {
        this.$refs.videoPreview.currentTime = time
      }
    },

    startDrag(handle, event) {
      this.dragging = handle
      const timeline = event.target.closest('.timeline-track')
      
      const onMouseMove = (e) => {
        const rect = timeline.getBoundingClientRect()
        const percent = Math.min(Math.max(0, (e.clientX - rect.left) / rect.width), 1)
        const time = percent * this.videoDuration
        
        if (this.dragging === 'start' && time < this.trimEnd) {
          this.trimStart = Math.max(0, time)
        } else if (this.dragging === 'end' && time > this.trimStart) {
          this.trimEnd = Math.min(this.videoDuration, time)
        }
      }
      
      const onMouseUp = () => {
        this.dragging = null
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      event.preventDefault()
    },

    downloadRecording() {
      if (!this.recordedBlob) return
      
      const timestamp = Date.now()
      const extension = this.exportFormat === 'mp4' ? 'webm' : 'webm'
      const filename = `recording_${timestamp}.${extension}`
      
      const url = URL.createObjectURL(this.recordedBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      
      this.recordings.unshift({
        id: timestamp,
        blob: this.recordedBlob,
        timestamp: timestamp,
        size: this.recordedBlob.size,
        format: this.exportFormat,
        url: this.recordedVideo
      })
      
      this.showToast('Recording saved successfully!')
    },

    downloadRecordingById(recording) {
      const extension = recording.format === 'mp4' ? 'webm' : 'webm'
      const url = URL.createObjectURL(recording.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `recording_${recording.id}.${extension}`
      a.click()
      URL.revokeObjectURL(url)
      this.showToast('Recording downloaded!')
    },

    previewRecording(recording) {
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl)
      }
      this.videoUrl = URL.createObjectURL(recording.blob)
      this.recordedVideo = this.videoUrl
      this.recordedBlob = recording.blob
      
      if (this.$refs.videoPreview) {
        this.$refs.videoPreview.src = this.videoUrl
        this.$refs.videoPreview.addEventListener('loadedmetadata', () => {
          this.videoDuration = this.$refs.videoPreview.duration
          this.trimEnd = this.videoDuration
        })
      }
      
      this.showToast('Previewing recording')
    },

    clearRecording() {
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl)
      }
      if (this.recordedVideo) {
        URL.revokeObjectURL(this.recordedVideo)
      }
      this.recordedVideo = null
      this.recordedBlob = null
      this.trimStart = 0
      this.trimEnd = 0
      this.videoDuration = 0
      this.showToast('Recording cleared')
    },

    deleteRecording(index) {
      const recording = this.recordings[index]
      if (recording.url) {
        URL.revokeObjectURL(recording.url)
      }
      this.recordings.splice(index, 1)
      this.showToast('Recording deleted')
    },

    clearAllRecordings() {
      this.recordings.forEach(recording => {
        if (recording.url) {
          URL.revokeObjectURL(recording.url)
        }
      })
      this.recordings = []
      this.clearRecording()
      this.showToast('All recordings cleared')
    },

    startTimer() {
      this.recordingTime = 0
      this.recordingInterval = setInterval(() => {
        this.recordingTime++
      }, 1000)
    },

    stopTimer() {
      if (this.recordingInterval) {
        clearInterval(this.recordingInterval)
        this.recordingInterval = null
      }
    },

    formatTime(seconds) {
      if (!seconds || isNaN(seconds)) return '00:00'
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },

    formatDate(timestamp) {
      const date = new Date(timestamp)
      return date.toLocaleString()
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
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
/* Same styles as before - keeping them for consistency */
.screen-recorder {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

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

.main-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px 48px;
  position: relative;
  z-index: 20;
}

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

.recording-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: #f3f4f6;
  border-radius: 20px;
  font-size: 14px;
}

.recording-status.recording {
  background: #fee2e2;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #9ca3af;
}

.recording-status.recording .status-dot {
  background: #ef4444;
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.timer {
  font-family: monospace;
  font-weight: 600;
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

.source-buttons,
.format-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.source-btn,
.format-btn {
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

.source-btn:hover,
.format-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.source-btn.active,
.format-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.quality-slider {
  display: flex;
  align-items: center;
  gap: 16px;
}

.quality-range {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.quality-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
}

.quality-value {
  font-weight: 600;
  color: #667eea;
  min-width: 60px;
}

.recording-buttons {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.record-btn {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.record-btn.start {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.record-btn.start:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.record-btn.stop {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.processing-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 32px;
  background: #f3f4f6;
  border-radius: 12px;
  color: #374151;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #e5e7eb;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.preview-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.preview-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

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

.download-btn:hover {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.clear-btn:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.video-preview {
  width: 100%;
  border-radius: 12px;
  margin-bottom: 24px;
  background: #000;
}

.trimming-tools {
  border-top: 1px solid #e5e7eb;
  padding-top: 20px;
}

.trimming-tools h4 {
  margin-bottom: 16px;
  color: #1f2937;
}

.trim-controls {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.trim-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.trim-input label {
  font-size: 12px;
  color: #6b7280;
}

.trim-input input {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  width: 120px;
}

.trim-btn,
.reset-trim-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.trim-btn {
  background: #667eea;
  color: white;
}

.trim-btn:hover {
  background: #5a67d8;
}

.reset-trim-btn {
  background: #f3f4f6;
  color: #374151;
}

.reset-trim-btn:hover {
  background: #e5e7eb;
}

.timeline {
  margin-top: 20px;
}

.timeline-track {
  position: relative;
  height: 40px;
  background: #e5e7eb;
  border-radius: 20px;
  cursor: pointer;
}

.timeline-progress {
  position: absolute;
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 20px;
  pointer-events: none;
}

.timeline-handle {
  position: absolute;
  top: -8px;
  width: 16px;
  height: 56px;
  background: white;
  border: 2px solid #667eea;
  border-radius: 8px;
  cursor: ew-resize;
  transform: translateX(-50%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.timeline-handle:hover {
  background: #667eea;
}

.timeline-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.recordings-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.recordings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.recordings-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.clear-all-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-all-btn:hover {
  background: #e5e7eb;
}

.recordings-list {
  max-height: 400px;
  overflow-y: auto;
}

.recording-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  margin-bottom: 8px;
  transition: transform 0.2s;
}

.recording-item:hover {
  transform: translateX(4px);
  background: #f3f4f6;
}

.recording-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.recording-icon {
  font-size: 24px;
}

.recording-details {
  display: flex;
  flex-direction: column;
}

.recording-name {
  font-weight: 600;
  color: #1f2937;
}

.recording-meta {
  font-size: 12px;
  color: #6b7280;
}

.recording-actions {
  display: flex;
  gap: 8px;
}

.preview-rec-btn,
.download-rec-btn,
.delete-rec-btn {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.preview-rec-btn {
  background: #667eea;
  color: white;
}

.download-rec-btn {
  background: #10b981;
  color: white;
}

.delete-rec-btn {
  background: #ef4444;
  color: white;
}

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
  
  .source-buttons,
  .format-buttons {
    flex-direction: column;
  }
  
  .source-btn,
  .format-btn {
    width: 100%;
    justify-content: center;
  }
  
  .trim-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .trim-input input {
    width: 100%;
  }
  
  .recording-item {
    flex-direction: column;
    gap: 12px;
  }
  
  .recording-actions {
    width: 100%;
    justify-content: center;
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
}
</style>