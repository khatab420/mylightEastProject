<template>
  <div class="pomodoro-timer">
    <div class="timer-header">
      <h2>Pomodoro Timer</h2>
      <p>Boost productivity with Pomodoro technique timers. Work in focused intervals with breaks.</p>
    </div>

    <div class="timer-main">
      <!-- Timer Display -->
      <div class="timer-display" :class="{ 'break-mode': isBreak }">
        <div class="timer-circle">
          <svg class="progress-ring" width="300" height="300">
            <circle
              class="progress-ring-bg"
              stroke="#334155"
              stroke-width="8"
              fill="transparent"
              r="138"
              cx="150"
              cy="150"
            />
            <circle
              class="progress-ring-fill"
              :stroke="isBreak ? '#10b981' : '#3b82f6'"
              stroke-width="8"
              fill="transparent"
              r="138"
              cx="150"
              cy="150"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="strokeDashOffset"
              stroke-linecap="round"
            />
          </svg>
          <div class="timer-text">
            <div class="timer-label">{{ isBreak ? 'Break Time' : 'Focus Time' }}</div>
            <div class="timer-time">{{ formattedTime }}</div>
            <div class="timer-session">Session {{ currentSession }} / {{ totalSessions }}</div>
          </div>
        </div>
      </div>

      <!-- Timer Controls -->
      <div class="timer-controls">
        <button @click="startTimer" :disabled="isRunning" class="control-btn start">
          ▶ Start
        </button>
        <button @click="pauseTimer" :disabled="!isRunning" class="control-btn pause">
          ⏸ Pause
        </button>
        <button @click="resetTimer" class="control-btn reset">
          🔄 Reset
        </button>
        <button @click="skipTimer" class="control-btn skip">
          ⏭ Skip
        </button>
      </div>

      <!-- Custom Settings -->
      <div class="settings-section">
        <div class="settings-header" @click="showSettings = !showSettings">
          <span class="settings-icon">⚙️</span>
          <span>Custom Timer Settings</span>
          <span class="toggle-icon">{{ showSettings ? '▲' : '▼' }}</span>
        </div>
        
        <div v-show="showSettings" class="settings-content">
          <div class="setting-group">
            <label>Focus Duration (minutes)</label>
            <div class="setting-control">
              <button @click="decreaseFocusTime" class="setting-btn">-</button>
              <span class="setting-value">{{ focusTime }} min</span>
              <button @click="increaseFocusTime" class="setting-btn">+</button>
            </div>
          </div>

          <div class="setting-group">
            <label>Short Break (minutes)</label>
            <div class="setting-control">
              <button @click="decreaseShortBreak" class="setting-btn">-</button>
              <span class="setting-value">{{ shortBreak }} min</span>
              <button @click="increaseShortBreak" class="setting-btn">+</button>
            </div>
          </div>

          <div class="setting-group">
            <label>Long Break (minutes)</label>
            <div class="setting-control">
              <button @click="decreaseLongBreak" class="setting-btn">-</button>
              <span class="setting-value">{{ longBreak }} min</span>
              <button @click="increaseLongBreak" class="setting-btn">+</button>
            </div>
          </div>

          <div class="setting-group">
            <label>Long Break After</label>
            <div class="setting-control">
              <button @click="decreaseLongBreakAfter" class="setting-btn">-</button>
              <span class="setting-value">{{ longBreakAfter }} sessions</span>
              <button @click="increaseLongBreakAfter" class="setting-btn">+</button>
            </div>
          </div>

          <div class="setting-group">
            <label>Auto Start Breaks</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="autoStartBreaks">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-group">
            <label>Auto Start Focus</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="autoStartFocus">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <div class="setting-group">
            <label>Sound Alerts</label>
            <label class="toggle-switch">
              <input type="checkbox" v-model="soundEnabled">
              <span class="toggle-slider"></span>
            </label>
          </div>

          <button @click="applySettings" class="apply-btn">Apply Settings</button>
        </div>
      </div>

      <!-- Session Statistics -->
      <div class="stats-section">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-value">{{ completedSessions }}</div>
            <div class="stat-label">Completed Sessions</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ totalFocusTime }}h {{ totalFocusMinutes }}m</div>
            <div class="stat-label">Total Focus Time</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ todaySessions }}</div>
            <div class="stat-label">Today's Sessions</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ productivityScore }}%</div>
            <div class="stat-label">Productivity Score</div>
          </div>
        </div>
      </div>

      <!-- Task List Integration -->
      <div class="tasks-section">
        <div class="tasks-header">
          <span>📝 Tasks for this Session</span>
          <button @click="addTask" class="add-task-btn">+ Add Task</button>
        </div>
        <div class="tasks-list">
          <div v-for="(task, index) in tasks" :key="index" class="task-item">
            <input
              type="checkbox"
              v-model="task.completed"
              @change="updateTaskStatus"
              class="task-checkbox"
            />
            <input
              type="text"
              v-model="task.text"
              @blur="saveTasks"
              class="task-input"
              :class="{ completed: task.completed }"
              placeholder="Enter task..."
            />
            <button @click="deleteTask(index)" class="delete-task-btn">🗑️</button>
          </div>
        </div>
      </div>

      <!-- Quote of the Day -->
      <div class="quote-section">
        <div class="quote-text">{{ currentQuote }}</div>
        <div class="quote-author">- {{ quoteAuthor }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PomodoroTimer',
  data() {
    return {
      // Timer state
      timeLeft: 25 * 60, // in seconds
      isRunning: false,
      isBreak: false,
      timerInterval: null,
      
      // Settings
      focusTime: 25,
      shortBreak: 5,
      longBreak: 15,
      longBreakAfter: 4,
      autoStartBreaks: true,
      autoStartFocus: true,
      soundEnabled: true,
      showSettings: false,
      
      // Statistics
      currentSession: 1,
      completedSessions: 0,
      totalFocusMinutes: 0,
      todaySessions: 0,
      sessionsToday: [],
      
      // Tasks
      tasks: [],
      
      // Quotes
      quotes: [
        { text: "The secret of getting ahead is getting started", author: "Mark Twain" },
        { text: "Focus on being productive instead of busy", author: "Tim Ferriss" },
        { text: "You don't have to be extreme, just consistent", author: "James Clear" },
        { text: "The key is not to prioritize what's on your schedule, but to schedule your priorities", author: "Stephen Covey" },
        { text: "Work smarter, not harder", author: "Peter Drucker" },
        { text: "The future depends on what you do today", author: "Mahatma Gandhi" },
        { text: "Productivity is never an accident", author: "Paul J. Meyer" },
        { text: "Do the hard jobs first", author: "Brian Tracy" }
      ],
      currentQuote: "",
      quoteAuthor: ""
    };
  },
  computed: {
    formattedTime() {
      const minutes = Math.floor(this.timeLeft / 60);
      const seconds = this.timeLeft % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },
    totalSessions() {
      return this.longBreakAfter;
    },
    circumference() {
      return 2 * Math.PI * 138;
    },
    strokeDashOffset() {
      const totalTime = this.isBreak 
        ? (this.currentSession % this.longBreakAfter === 0 ? this.longBreak : this.shortBreak) * 60
        : this.focusTime * 60;
      const progress = this.timeLeft / totalTime;
      return this.circumference * (1 - progress);
    },
    totalFocusTime() {
      return Math.floor(this.totalFocusMinutes / 60);
    },
    productivityScore() {
      if (this.completedSessions === 0) return 0;
      const expectedSessions = Math.floor((Date.now() - new Date().setHours(0, 0, 0, 0)) / (1000 * 60 * 60 * 24) * 8);
      return Math.min(100, Math.floor((this.completedSessions / (expectedSessions || 1)) * 100));
    }
  },
  mounted() {
    this.loadSettings();
    this.loadStats();
    this.loadTasks();
    this.selectRandomQuote();
    this.resetTimer();
    
    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  },
  beforeUnmount() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  },
  methods: {
    startTimer() {
      if (!this.isRunning) {
        this.isRunning = true;
        this.timerInterval = setInterval(() => {
          if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateTitle();
          } else {
            this.timerComplete();
          }
        }, 1000);
      }
    },
    
    pauseTimer() {
      if (this.isRunning) {
        clearInterval(this.timerInterval);
        this.isRunning = false;
        this.updateTitle(true);
      }
    },
    
    resetTimer() {
      this.pauseTimer();
      this.timeLeft = this.isBreak 
        ? (this.currentSession % this.longBreakAfter === 0 ? this.longBreak : this.shortBreak) * 60
        : this.focusTime * 60;
      this.updateTitle();
    },
    
    skipTimer() {
      this.timerComplete();
    },
    
    timerComplete() {
      this.pauseTimer();
      
      // Play sound
      if (this.soundEnabled) {
        this.playSound();
      }
      
      // Send notification
      this.sendNotification();
      
      if (!this.isBreak) {
        // Focus session completed
        this.completedSessions++;
        this.totalFocusMinutes += this.focusTime;
        this.todaySessions++;
        this.saveStats();
        
        if (this.currentSession === this.longBreakAfter) {
          // Long break
          this.isBreak = true;
          this.timeLeft = this.longBreak * 60;
          this.currentSession = 1;
        } else {
          // Short break
          this.isBreak = true;
          this.timeLeft = this.shortBreak * 60;
          this.currentSession++;
        }
        
        if (this.autoStartBreaks) {
          this.startTimer();
        }
      } else {
        // Break completed
        this.isBreak = false;
        this.timeLeft = this.focusTime * 60;
        
        if (this.autoStartFocus) {
          this.startTimer();
        }
      }
      
      this.updateTitle();
      this.selectRandomQuote();
    },
    
    playSound() {
      // Create web audio context for beep sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.3;
        
        oscillator.start();
        gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + 1);
        oscillator.stop(audioContext.currentTime + 1);
      } catch (e) {
        // Fallback to simple beep using Audio
        const audio = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZA==');
        audio.play().catch(() => {});
      }
    },
    
    sendNotification() {
      if (Notification.permission === 'granted') {
        new Notification('Pomodoro Timer', {
          body: this.isBreak ? 'Break time is over! Time to focus!' : 'Focus session completed! Take a break!',
          icon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%233b82f6"/%3E%3Ctext x="50" y="65" text-anchor="middle" fill="white" font-size="40" font-weight="bold"%3E🍅%3C/text%3E%3C/svg%3E'
        });
      }
    },
    
    updateTitle(paused = false) {
      if (paused) {
        document.title = `⏸ Pomodoro Timer`;
      } else {
        const emoji = this.isBreak ? '☕' : '🍅';
        document.title = `${emoji} ${this.formattedTime} - Pomodoro Timer`;
      }
    },
    
    decreaseFocusTime() {
      if (this.focusTime > 1) this.focusTime--;
    },
    
    increaseFocusTime() {
      if (this.focusTime < 60) this.focusTime++;
    },
    
    decreaseShortBreak() {
      if (this.shortBreak > 1) this.shortBreak--;
    },
    
    increaseShortBreak() {
      if (this.shortBreak < 30) this.shortBreak++;
    },
    
    decreaseLongBreak() {
      if (this.longBreak > 1) this.longBreak--;
    },
    
    increaseLongBreak() {
      if (this.longBreak < 60) this.longBreak++;
    },
    
    decreaseLongBreakAfter() {
      if (this.longBreakAfter > 2) this.longBreakAfter--;
    },
    
    increaseLongBreakAfter() {
      if (this.longBreakAfter < 8) this.longBreakAfter++;
    },
    
    applySettings() {
      this.saveSettings();
      this.resetTimer();
      this.showSettings = false;
    },
    
    saveSettings() {
      const settings = {
        focusTime: this.focusTime,
        shortBreak: this.shortBreak,
        longBreak: this.longBreak,
        longBreakAfter: this.longBreakAfter,
        autoStartBreaks: this.autoStartBreaks,
        autoStartFocus: this.autoStartFocus,
        soundEnabled: this.soundEnabled
      };
      localStorage.setItem('pomodoro_settings', JSON.stringify(settings));
    },
    
    loadSettings() {
      const saved = localStorage.getItem('pomodoro_settings');
      if (saved) {
        const settings = JSON.parse(saved);
        this.focusTime = settings.focusTime;
        this.shortBreak = settings.shortBreak;
        this.longBreak = settings.longBreak;
        this.longBreakAfter = settings.longBreakAfter;
        this.autoStartBreaks = settings.autoStartBreaks;
        this.autoStartFocus = settings.autoStartFocus;
        this.soundEnabled = settings.soundEnabled;
      }
    },
    
    saveStats() {
      const stats = {
        completedSessions: this.completedSessions,
        totalFocusMinutes: this.totalFocusMinutes,
        todaySessions: this.todaySessions,
        lastUpdated: new Date().toDateString()
      };
      localStorage.setItem('pomodoro_stats', JSON.stringify(stats));
    },
    
    loadStats() {
      const saved = localStorage.getItem('pomodoro_stats');
      if (saved) {
        const stats = JSON.parse(saved);
        // Reset daily stats if new day
        if (stats.lastUpdated !== new Date().toDateString()) {
          this.todaySessions = 0;
        } else {
          this.todaySessions = stats.todaySessions;
        }
        this.completedSessions = stats.completedSessions || 0;
        this.totalFocusMinutes = stats.totalFocusMinutes || 0;
      }
    },
    
    addTask() {
      this.tasks.push({
        text: '',
        completed: false,
        createdAt: new Date()
      });
      this.saveTasks();
    },
    
    deleteTask(index) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    },
    
    updateTaskStatus() {
      this.saveTasks();
    },
    
    saveTasks() {
      localStorage.setItem('pomodoro_tasks', JSON.stringify(this.tasks));
    },
    
    loadTasks() {
      const saved = localStorage.getItem('pomodoro_tasks');
      if (saved) {
        this.tasks = JSON.parse(saved);
      } else {
        // Add sample tasks
        this.tasks = [
          { text: 'Complete Pomodoro Timer component', completed: false, createdAt: new Date() },
          { text: 'Test timer functionality', completed: false, createdAt: new Date() },
          { text: 'Add custom settings', completed: true, createdAt: new Date() }
        ];
      }
    },
    
    selectRandomQuote() {
      const randomIndex = Math.floor(Math.random() * this.quotes.length);
      this.currentQuote = this.quotes[randomIndex].text;
      this.quoteAuthor = this.quotes[randomIndex].author;
    }
  }
};
</script>

<style scoped>
.pomodoro-timer {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.timer-header {
  margin-bottom: 32px;
  text-align: center;
}

.timer-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.timer-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.timer-main {
  background: #1e293b;
  border-radius: 20px;
  padding: 32px;
}

.timer-display {
  text-align: center;
  margin-bottom: 32px;
  transition: all 0.3s ease;
}

.timer-circle {
  position: relative;
  width: 300px;
  height: 300px;
  margin: 0 auto;
}

.progress-ring {
  transform: rotate(-90deg);
}

.progress-ring-fill {
  transition: stroke-dashoffset 0.3s ease;
}

.timer-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.timer-label {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: 8px;
}

.timer-time {
  font-size: 3rem;
  font-weight: 700;
  color: #e2e8f0;
  font-family: monospace;
  letter-spacing: 4px;
}

.timer-session {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 8px;
}

.break-mode .timer-label {
  color: #10b981;
}

.break-mode .timer-time {
  color: #34d399;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

.control-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.control-btn.start {
  background: #10b981;
  color: white;
}

.control-btn.start:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
}

.control-btn.pause {
  background: #f59e0b;
  color: white;
}

.control-btn.pause:hover:not(:disabled) {
  background: #d97706;
  transform: translateY(-2px);
}

.control-btn.reset {
  background: #6b7280;
  color: white;
}

.control-btn.reset:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.control-btn.skip {
  background: #3b82f6;
  color: white;
}

.control-btn.skip:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.settings-section {
  background: #0f172a;
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
}

.settings-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s ease;
}

.settings-header:hover {
  background: #1e293b;
}

.settings-icon {
  font-size: 1.2rem;
}

.toggle-icon {
  margin-left: auto;
  color: #94a3b8;
}

.settings-content {
  padding: 20px;
  border-top: 1px solid #334155;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.setting-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.setting-group label {
  color: #e2e8f0;
  font-size: 0.9rem;
}

.setting-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.setting-btn {
  width: 32px;
  height: 32px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #e2e8f0;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.setting-btn:hover {
  background: #3b82f6;
  border-color: #3b82f6;
}

.setting-value {
  min-width: 60px;
  text-align: center;
  color: #e2e8f0;
  font-weight: 600;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #334155;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3b82f6;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.apply-btn {
  grid-column: 1 / -1;
  padding: 12px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.apply-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background: #0f172a;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  background: #1e293b;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label {
  color: #94a3b8;
  font-size: 0.85rem;
}

.tasks-section {
  background: #0f172a;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #e2e8f0;
  font-weight: 600;
}

.add-task-btn {
  padding: 6px 12px;
  background: #3b82f6;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #1e293b;
  border-radius: 8px;
}

.task-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.task-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #e2e8f0;
  font-size: 0.9rem;
  padding: 4px;
}

.task-input:focus {
  outline: none;
}

.task-input.completed {
  text-decoration: line-through;
  color: #64748b;
}

.delete-task-btn {
  background: #ef4444;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
}

.quote-section {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border-left: 3px solid #3b82f6;
}

.quote-text {
  color: #e2e8f0;
  font-style: italic;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.quote-author {
  color: #64748b;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .pomodoro-timer {
    padding: 16px;
  }
  
  .timer-main {
    padding: 20px;
  }
  
  .timer-circle {
    width: 250px;
    height: 250px;
  }
  
  .timer-time {
    font-size: 2rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .settings-content {
    grid-template-columns: 1fr;
  }
}
</style>