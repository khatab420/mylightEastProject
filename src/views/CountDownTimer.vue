<template>
  <div class="countdown-timer">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 class="hero-title">Countdown Timer</h1>
        <p class="hero-description">
          Create custom countdown timers for events, deadlines, or productivity sessions. Simple and visual.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Timer Setup Card -->
      <div class="setup-card">
        <div class="setup-header">
          <h3>⏰ Set Your Countdown</h3>
          <div class="preset-buttons">
            <button @click="setPreset('newYear')" class="preset-btn">🎉 New Year</button>
            <button @click="setPreset('christmas')" class="preset-btn">🎄 Christmas</button>
            <button @click="setPreset('birthday')" class="preset-btn">🎂 Birthday</button>
            <button @click="setPreset('custom')" class="preset-btn">📅 Custom</button>
          </div>
        </div>

        <div class="setup-grid">
          <div class="date-inputs">
            <div class="input-group">
              <label>Target Date</label>
              <input type="date" v-model="targetDate" @change="updateTargetTime" />
            </div>
            <div class="input-group">
              <label>Target Time</label>
              <input type="time" v-model="targetTime" @change="updateTargetTime" />
            </div>
            <div class="input-group">
              <label>Event Name</label>
              <input type="text" v-model="eventName" placeholder="e.g., Project Deadline, Birthday, Launch" />
            </div>
          </div>
          <div class="action-buttons">
            <button @click="startTimer" class="start-btn" :disabled="!isValidDate">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Timer
            </button>
            <button @click="stopTimer" class="stop-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Stop
            </button>
            <button @click="resetTimer" class="reset-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </div>

      <!-- Countdown Display -->
      <div class="countdown-card" :class="{ expired: isExpired }">
        <div class="event-info" v-if="eventName">
          <h2>{{ eventName }}</h2>
          <p class="target-date">Target: {{ formatTargetDate }}</p>
        </div>
        
        <div v-if="!isExpired" class="timer-display">
          <div class="timer-block">
            <div class="timer-value">{{ days }}</div>
            <div class="timer-label">Days</div>
          </div>
          <div class="timer-separator">:</div>
          <div class="timer-block">
            <div class="timer-value">{{ hours }}</div>
            <div class="timer-label">Hours</div>
          </div>
          <div class="timer-separator">:</div>
          <div class="timer-block">
            <div class="timer-value">{{ minutes }}</div>
            <div class="timer-label">Minutes</div>
          </div>
          <div class="timer-separator">:</div>
          <div class="timer-block">
            <div class="timer-value">{{ seconds }}</div>
            <div class="timer-label">Seconds</div>
          </div>
        </div>

        <div v-else class="expired-message">
          <div class="expired-icon">🎉</div>
          <h2>Time's Up!</h2>
          <p>{{ eventName ? eventName : 'Countdown' }} has reached its target time.</p>
          <button @click="resetTimer" class="new-timer-btn">Create New Timer</button>
        </div>

        <!-- Progress Bar -->
        <div v-if="!isExpired && totalDuration > 0" class="progress-section">
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
          </div>
          <div class="progress-text">{{ progressPercentage }}% Complete</div>
        </div>
      </div>

      <!-- Share Section -->
      <div class="share-card" v-if="shareableUrl">
        <div class="share-header">
          <h3>🔗 Share Countdown</h3>
          <button @click="copyShareableLink" class="copy-link-btn">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
            Copy Link
          </button>
        </div>
        <div class="share-url">
          <input type="text" :value="shareableUrl" readonly class="url-input" />
        </div>
        <div class="share-buttons">
          <button @click="shareOnTwitter" class="social-btn twitter">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
            Twitter
          </button>
          <button @click="shareOnFacebook" class="social-btn facebook">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
            Facebook
          </button>
          <button @click="shareOnWhatsApp" class="social-btn whatsapp">
            <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-5.46-4.45-9.91-9.91-9.91zm0 18.21c-1.5 0-2.97-.4-4.26-1.16l-.31-.18-3.11.82.83-3.04-.2-.32c-.83-1.34-1.27-2.88-1.27-4.46 0-4.61 3.76-8.37 8.37-8.37 4.61 0 8.37 3.76 8.37 8.37 0 4.61-3.76 8.37-8.37 8.37zm4.59-6.27c-.25-.13-1.47-.73-1.7-.81-.23-.08-.39-.13-.56.13-.16.26-.64.81-.78.98-.14.16-.29.18-.54.06-.25-.12-1.06-.39-2.02-1.25-.75-.67-1.25-1.49-1.4-1.74-.14-.25-.01-.39.11-.52.11-.11.25-.29.38-.44.13-.16.17-.27.26-.45.09-.18.04-.34-.02-.47-.07-.13-.56-1.35-.77-1.85-.2-.48-.41-.41-.56-.42-.15-.01-.31-.01-.48-.01-.17 0-.44.06-.67.31-.23.25-.87.85-.87 2.08 0 1.23.89 2.41 1.02 2.58.13.17 1.76 2.69 4.27 3.77.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.07-.1-.25-.16-.5-.28z" />
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      <!-- Sound Settings -->
      <div class="sound-card">
        <div class="sound-header">
          <h3>🔔 Notification Settings</h3>
          <label class="sound-toggle">
            <input type="checkbox" v-model="soundEnabled" />
            <span class="toggle-slider"></span>
            <span class="toggle-label">Enable Sound Alert</span>
          </label>
        </div>
        <div v-if="soundEnabled" class="sound-options">
          <select v-model="soundType" class="sound-select">
            <option value="default">Default Bell</option>
            <option value="gentle">Gentle Chime</option>
            <option value="alert">Alert Siren</option>
            <option value="cheer">Cheerful Fanfare</option>
          </select>
          <button @click="testSound" class="test-sound-btn">Test Sound</button>
        </div>
      </div>

      <!-- Recent Timers -->
      <div class="recent-card" v-if="recentTimers.length > 0">
        <div class="recent-header">
          <h3>🕒 Recent Timers</h3>
          <button @click="clearRecentTimers" class="clear-recent-btn">Clear All</button>
        </div>
        <div class="recent-list">
          <div v-for="timer in recentTimers" :key="timer.id" class="recent-item">
            <div class="recent-info">
              <div class="recent-name">{{ timer.eventName || 'Untitled Timer' }}</div>
              <div class="recent-date">{{ formatDate(timer.targetDate) }}</div>
            </div>
            <div class="recent-actions">
              <button @click="loadRecentTimer(timer)" class="load-recent-btn">Load</button>
              <button @click="deleteRecentTimer(timer.id)" class="delete-recent-btn">Delete</button>
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

    <!-- Sound Audio Elements (hidden) -->
    <audio ref="defaultSound" preload="auto">
      <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg">
    </audio>
    <audio ref="gentleSound" preload="auto">
      <source src="https://www.soundjay.com/misc/sounds/chime-up-1.mp3" type="audio/mpeg">
    </audio>
    <audio ref="alertSound" preload="auto">
      <source src="https://www.soundjay.com/misc/sounds/air-horn-02.mp3" type="audio/mpeg">
    </audio>
    <audio ref="cheerSound" preload="auto">
      <source src="https://www.soundjay.com/misc/sounds/crowd-cheering-01.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script>
export default {
  name: 'CountdownTimer',
  data() {
    return {
      targetDate: '',
      targetTime: '23:59',
      eventName: '',
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      timerInterval: null,
      isExpired: false,
      soundEnabled: true,
      soundType: 'default',
      shareableUrl: '',
      recentTimers: [],
      toastMessage: '',
      targetTimestamp: null,
      totalDuration: 0,
      currentRemaining: 0
    }
  },
  computed: {
    isValidDate() {
      return this.targetDate && this.targetTime
    },
    formatTargetDate() {
      if (!this.targetDate) return ''
      const date = new Date(this.targetDate)
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    },
    progressPercentage() {
      if (this.totalDuration === 0) return 0
      const elapsed = this.totalDuration - this.currentRemaining
      return Math.min(100, Math.max(0, Math.floor((elapsed / this.totalDuration) * 100)))
    }
  },
  mounted() {
    // Set default target to 7 days from now
    const defaultDate = new Date()
    defaultDate.setDate(defaultDate.getDate() + 7)
    this.targetDate = defaultDate.toISOString().split('T')[0]
    
    this.loadRecentTimers()
    this.checkForSharedTimer()
    
    // Check for stored timer
    const storedTimer = localStorage.getItem('activeCountdown')
    if (storedTimer) {
      const timer = JSON.parse(storedTimer)
      this.targetDate = timer.targetDate
      this.targetTime = timer.targetTime
      this.eventName = timer.eventName
      this.startTimer()
    }
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    updateTargetTime() {
      if (this.targetDate && this.targetTime) {
        this.targetTimestamp = new Date(`${this.targetDate}T${this.targetTime}`).getTime()
        this.generateShareableLink()
      }
    },
    startTimer() {
      if (!this.isValidDate) {
        this.showToast('Please set a target date and time')
        return
      }

      this.stopTimer()
      
      const targetDateTime = new Date(`${this.targetDate}T${this.targetTime}`)
      this.targetTimestamp = targetDateTime.getTime()
      this.totalDuration = this.targetTimestamp - Date.now()
      
      if (this.targetTimestamp <= Date.now()) {
        this.showToast('Target time must be in the future')
        return
      }
      
      this.updateCountdown()
      this.timerInterval = setInterval(this.updateCountdown, 1000)
      
      // Save to localStorage
      localStorage.setItem('activeCountdown', JSON.stringify({
        targetDate: this.targetDate,
        targetTime: this.targetTime,
        eventName: this.eventName
      }))
      
      this.saveToRecentTimers()
      this.showToast('Timer started!')
    },
    
    stopTimer() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval)
        this.timerInterval = null
      }
      localStorage.removeItem('activeCountdown')
    },
    
    resetTimer() {
      this.stopTimer()
      this.isExpired = false
      this.days = 0
      this.hours = 0
      this.minutes = 0
      this.seconds = 0
      this.totalDuration = 0
      this.currentRemaining = 0
      this.showToast('Timer reset')
    },
    
    updateCountdown() {
      const now = Date.now()
      const remaining = this.targetTimestamp - now
      this.currentRemaining = remaining
      
      if (remaining <= 0) {
        this.stopTimer()
        this.isExpired = true
        this.playSound()
        this.showToast(`${this.eventName || 'Countdown'} has ended!`)
        return
      }
      
      this.days = Math.floor(remaining / (1000 * 60 * 60 * 24))
      this.hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      this.minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
      this.seconds = Math.floor((remaining % (1000 * 60)) / 1000)
    },
    
    playSound() {
      if (!this.soundEnabled) return
      
      let audio = null
      switch(this.soundType) {
        case 'default':
          audio = this.$refs.defaultSound
          break
        case 'gentle':
          audio = this.$refs.gentleSound
          break
        case 'alert':
          audio = this.$refs.alertSound
          break
        case 'cheer':
          audio = this.$refs.cheerSound
          break
      }
      
      if (audio) {
        audio.play().catch(e => console.log('Audio play failed:', e))
      }
    },
    
    testSound() {
      this.playSound()
    },
    
    generateShareableLink() {
      const timerData = {
        targetDate: this.targetDate,
        targetTime: this.targetTime,
        eventName: this.eventName
      }
      const encoded = btoa(encodeURIComponent(JSON.stringify(timerData)))
      this.shareableUrl = `${window.location.origin}${window.location.pathname}?timer=${encoded}`
    },
    
    async copyShareableLink() {
      try {
        await navigator.clipboard.writeText(this.shareableUrl)
        this.showToast('Shareable link copied to clipboard!')
      } catch (err) {
        this.showToast('Failed to copy link')
      }
    },
    
    shareOnTwitter() {
      const text = `Check out my countdown to ${this.eventName || 'my event'}!`
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(this.shareableUrl)}`
      window.open(url, '_blank')
    },
    
    shareOnFacebook() {
      const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.shareableUrl)}`
      window.open(url, '_blank')
    },
    
    shareOnWhatsApp() {
      const text = `Check out my countdown to ${this.eventName || 'my event'}! ${this.shareableUrl}`
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`
      window.open(url, '_blank')
    },
    
    checkForSharedTimer() {
      const params = new URLSearchParams(window.location.search)
      const shared = params.get('timer')
      
      if (shared) {
        try {
          const decoded = JSON.parse(decodeURIComponent(atob(shared)))
          this.targetDate = decoded.targetDate
          this.targetTime = decoded.targetTime
          this.eventName = decoded.eventName
          this.startTimer()
          this.showToast('Loaded shared timer!')
          
          // Clean URL
          window.history.replaceState({}, document.title, window.location.pathname)
        } catch (err) {
          console.error('Failed to load shared timer:', err)
        }
      }
    },
    
    setPreset(type) {
      const now = new Date()
      let target = new Date()
      
      switch(type) {
        case 'newYear':
          target = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0)
          this.eventName = `New Year ${target.getFullYear()}`
          break
        case 'christmas':
          target = new Date(now.getFullYear(), 11, 25, 0, 0, 0)
          if (target < now) target.setFullYear(now.getFullYear() + 1)
          this.eventName = `Christmas ${target.getFullYear()}`
          break
        case 'birthday':
          target.setDate(now.getDate() + 30)
          this.eventName = 'Birthday Celebration'
          break
        case 'custom':
          target.setDate(now.getDate() + 7)
          this.eventName = 'Custom Event'
          break
      }
      
      this.targetDate = target.toISOString().split('T')[0]
      this.targetTime = `${target.getHours().toString().padStart(2, '0')}:${target.getMinutes().toString().padStart(2, '0')}`
      this.updateTargetTime()
      this.showToast(`${type} preset loaded!`)
    },
    
    saveToRecentTimers() {
      const timer = {
        id: Date.now(),
        targetDate: this.targetDate,
        targetTime: this.targetTime,
        eventName: this.eventName,
        timestamp: new Date().toISOString()
      }
      
      // Remove duplicate if exists
      const existingIndex = this.recentTimers.findIndex(t => 
        t.targetDate === timer.targetDate && t.targetTime === timer.targetTime
      )
      if (existingIndex !== -1) {
        this.recentTimers.splice(existingIndex, 1)
      }
      
      this.recentTimers.unshift(timer)
      if (this.recentTimers.length > 10) {
        this.recentTimers.pop()
      }
      
      localStorage.setItem('recentTimers', JSON.stringify(this.recentTimers))
    },
    
    loadRecentTimers() {
      const stored = localStorage.getItem('recentTimers')
      if (stored) {
        this.recentTimers = JSON.parse(stored)
      }
    },
    
    loadRecentTimer(timer) {
      this.targetDate = timer.targetDate
      this.targetTime = timer.targetTime
      this.eventName = timer.eventName
      this.updateTargetTime()
      this.startTimer()
      this.showToast('Timer loaded!')
    },
    
    deleteRecentTimer(id) {
      this.recentTimers = this.recentTimers.filter(t => t.id !== id)
      localStorage.setItem('recentTimers', JSON.stringify(this.recentTimers))
      this.showToast('Timer deleted')
    },
    
    clearRecentTimers() {
      this.recentTimers = []
      localStorage.removeItem('recentTimers')
      this.showToast('All recent timers cleared')
    },
    
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString()
    },
    
    showToast(message) {
      this.toastMessage = message
      setTimeout(() => {
        this.toastMessage = ''
      }, 3000)
    }
  },
  watch: {
    soundEnabled() {
      localStorage.setItem('soundEnabled', this.soundEnabled)
    },
    soundType() {
      localStorage.setItem('soundType', this.soundType)
    }
  }
}
</script>

<style scoped>
.countdown-timer {
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
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 24px 48px;
  position: relative;
  z-index: 20;
}

/* Setup Card */
.setup-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.setup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.setup-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.preset-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.preset-btn {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.preset-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.setup-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.date-inputs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.input-group input {
  padding: 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
}

.input-group input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.start-btn,
.stop-btn,
.reset-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.start-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
}

.start-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.start-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stop-btn {
  background: #ef4444;
  color: white;
}

.reset-btn {
  background: #6b7280;
  color: white;
}

.stop-btn:hover,
.reset-btn:hover {
  transform: translateY(-2px);
}

.btn-icon {
  width: 18px;
  height: 18px;
}

/* Countdown Card */
.countdown-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 24px;
  text-align: center;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.countdown-card.expired {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
}

.event-info h2 {
  font-size: 28px;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 8px;
}

.target-date {
  color: #6b7280;
  font-size: 14px;
}

.timer-display {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin: 30px 0;
}

.timer-block {
  text-align: center;
}

.timer-value {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  min-width: 100px;
}

.timer-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 8px;
}

.timer-separator {
  font-size: 48px;
  font-weight: 800;
  color: #667eea;
}

.expired-message {
  text-align: center;
}

.expired-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.expired-message h2 {
  font-size: 36px;
  font-weight: 800;
  color: #dc2626;
  margin-bottom: 12px;
}

.expired-message p {
  color: #6b7280;
  margin-bottom: 24px;
}

.new-timer-btn {
  padding: 10px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.new-timer-btn:hover {
  background: #5a67d8;
  transform: translateY(-2px);
}

.progress-section {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.progress-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #34d399);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
}

/* Share Card */
.share-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.share-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.share-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.copy-link-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.copy-link-btn:hover {
  background: #e5e7eb;
}

.share-url {
  margin-bottom: 16px;
}

.url-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 12px;
  font-family: monospace;
  background: #f9fafb;
}

.share-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.social-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  color: white;
}

.social-btn.twitter {
  background: #1DA1F2;
}

.social-btn.facebook {
  background: #4267B2;
}

.social-btn.whatsapp {
  background: #25D366;
}

.social-btn:hover {
  transform: translateY(-2px);
  filter: brightness(0.9);
}

/* Sound Card */
.sound-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.sound-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.sound-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.sound-toggle {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.sound-toggle input {
  display: none;
}

.toggle-slider {
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s;
}

.toggle-slider:before {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}

.sound-toggle input:checked + .toggle-slider {
  background: #667eea;
}

.sound-toggle input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-label {
  font-size: 14px;
  color: #374151;
}

.sound-options {
  display: flex;
  gap: 12px;
  align-items: center;
}

.sound-select {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.test-sound-btn {
  padding: 8px 16px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.test-sound-btn:hover {
  background: #e5e7eb;
}

/* Recent Card */
.recent-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.recent-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.recent-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.clear-recent-btn {
  padding: 4px 12px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
}

.recent-list {
  max-height: 300px;
  overflow-y: auto;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  margin-bottom: 8px;
}

.recent-info {
  flex: 1;
}

.recent-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.recent-date {
  font-size: 12px;
  color: #6b7280;
}

.recent-actions {
  display: flex;
  gap: 8px;
}

.load-recent-btn,
.delete-recent-btn {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  border: none;
}

.load-recent-btn {
  background: #667eea;
  color: white;
}

.delete-recent-btn {
  background: #ef4444;
  color: white;
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
  
  .setup-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .preset-buttons {
    justify-content: center;
  }
  
  .timer-display {
    flex-direction: column;
    gap: 15px;
  }
  
  .timer-separator {
    display: none;
  }
  
  .timer-value {
    font-size: 36px;
    min-width: auto;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .share-buttons {
    flex-direction: column;
  }
  
  .sound-options {
    flex-direction: column;
  }
  
  .sound-select {
    width: 100%;
  }
  
  .recent-item {
    flex-direction: column;
    gap: 10px;
  }
  
  .recent-actions {
    width: 100%;
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
  
  .countdown-card {
    padding: 24px;
  }
  
  .date-inputs {
    grid-template-columns: 1fr;
  }
}
</style>