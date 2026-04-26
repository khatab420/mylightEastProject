<template>
  <div class="password-generator">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 class="hero-title">Password Generator</h1>
        <p class="hero-description">
          Generate secure, customizable passwords for all your accounts. Strong passwords made simple.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Main Password Display -->
      <div class="password-card">
        <div class="password-header">
          <h3>🔐 Generated Password</h3>
          <div class="password-actions">
            <button @click="copyToClipboard" class="action-btn" :class="{ copied: copied }">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {{ copied ? 'Copied!' : 'Copy' }}
            </button>
            <button @click="generatePassword" class="action-btn primary">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generate New
            </button>
          </div>
        </div>
        <div class="password-display">
          <div class="password-text">{{ currentPassword || 'Click Generate to create a password' }}</div>
          <div class="password-strength" v-if="currentPassword">
            <div class="strength-bar">
              <div class="strength-fill" :class="strengthClass" :style="{ width: strengthPercentage + '%' }"></div>
            </div>
            <div class="strength-text">
              <span class="strength-label">Strength:</span>
              <span class="strength-value" :class="strengthClass">{{ strengthText }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Bulk Passwords Section -->
      <div class="bulk-section" v-if="showBulkPasswords">
        <div class="bulk-header">
          <h3>📋 Bulk Generated Passwords (5)</h3>
          <div class="bulk-actions">
            <button @click="copyAllToClipboard" class="action-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy All
            </button>
            <button @click="regenerateBulk" class="action-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Regenerate All
            </button>
            <button @click="showBulkPasswords = false" class="action-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Close
            </button>
          </div>
        </div>
        <div class="bulk-list">
          <div v-for="(password, index) in bulkPasswords" :key="index" class="bulk-item">
            <div class="bulk-number">{{ index + 1 }}</div>
            <div class="bulk-password">{{ password }}</div>
            <button @click="copyBulkPassword(password, index)" class="bulk-copy">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Options Card -->
      <div class="options-card">
        <div class="options-header">
          <h3>⚙️ Password Options</h3>
          <button @click="resetToDefaults" class="reset-btn">Reset to Defaults</button>
        </div>

        <!-- Length Slider -->
        <div class="option-group">
          <div class="option-label">
            <span>Password Length</span>
            <span class="length-value">{{ passwordLength }}</span>
          </div>
          <input 
            type="range" 
            v-model.number="passwordLength" 
            min="8" 
            max="64" 
            class="length-slider"
            @input="generatePassword"
          />
          <div class="length-limits">
            <span>8</span>
            <span>16</span>
            <span>24</span>
            <span>32</span>
            <span>40</span>
            <span>48</span>
            <span>56</span>
            <span>64</span>
          </div>
        </div>

        <!-- Character Options -->
        <div class="options-grid">
          <label class="option-item">
            <input type="checkbox" v-model="includeUppercase" @change="generatePassword">
            <div class="option-content">
              <span class="option-name">Uppercase Letters</span>
              <span class="option-example">A B C D ... Z</span>
            </div>
          </label>

          <label class="option-item">
            <input type="checkbox" v-model="includeLowercase" @change="generatePassword">
            <div class="option-content">
              <span class="option-name">Lowercase Letters</span>
              <span class="option-example">a b c d ... z</span>
            </div>
          </label>

          <label class="option-item">
            <input type="checkbox" v-model="includeNumbers" @change="generatePassword">
            <div class="option-content">
              <span class="option-name">Numbers</span>
              <span class="option-example">0 1 2 3 ... 9</span>
            </div>
          </label>

          <label class="option-item">
            <input type="checkbox" v-model="includeSymbols" @change="generatePassword">
            <div class="option-content">
              <span class="option-name">Symbols</span>
              <span class="option-example">! @ # $ % ^ &amp; *</span>
            </div>
          </label>

          <label class="option-item">
            <input type="checkbox" v-model="excludeAmbiguous" @change="generatePassword">
            <div class="option-content">
              <span class="option-name">Exclude Ambiguous Characters</span>
              <span class="option-example">Avoid 0, O, I, l, etc.</span>
            </div>
          </label>

          <label class="option-item">
            <input type="checkbox" v-model="noDuplicateChars" @change="generatePassword">
            <div class="option-content">
              <span class="option-name">No Duplicate Characters</span>
              <span class="option-example">Each character appears once</span>
            </div>
          </label>
        </div>

        <!-- Additional Options -->
        <div class="advanced-options">
          <div class="option-group">
            <div class="option-label">
              <span>Number of Passwords</span>
              <span class="length-value">{{ bulkCount }}</span>
            </div>
            <input 
              type="range" 
              v-model.number="bulkCount" 
              min="1" 
              max="20" 
              class="length-slider"
            />
          </div>

          <div class="action-buttons">
            <button @click="generateBulkPasswords" class="bulk-generate-btn">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Generate {{ bulkCount }} Passwords
            </button>
            <button v-if="bulkPasswords.length > 0" @click="showBulkPasswords = true" class="view-bulk-btn">
              View Generated Passwords
            </button>
          </div>
        </div>
      </div>

      <!-- Password Statistics -->
      <div v-if="currentPassword" class="stats-card">
        <h3>📊 Password Statistics</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">{{ currentPassword.length }}</div>
            <div class="stat-label">Length</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ countUppercase }}</div>
            <div class="stat-label">Uppercase</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ countLowercase }}</div>
            <div class="stat-label">Lowercase</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ countNumbers }}</div>
            <div class="stat-label">Numbers</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ countSymbols }}</div>
            <div class="stat-label">Symbols</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ entropyBits }}</div>
            <div class="stat-label">Entropy (bits)</div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <h3>💡 Password Security Tips</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">🔒</span>
            <div class="tip-content">
              <strong>Length over Complexity</strong>
              <p>Longer passwords are more secure than complex short ones. Aim for 16+ characters.</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🚫</span>
            <div class="tip-content">
              <strong>Don't Reuse Passwords</strong>
              <p>Use unique passwords for each account to prevent credential stuffing attacks.</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🔑</span>
            <div class="tip-content">
              <strong>Use a Password Manager</strong>
              <p>Store your generated passwords securely in a trusted password manager.</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">🔄</span>
            <div class="tip-content">
              <strong>Regular Updates</strong>
              <p>Update important passwords every 3-6 months for better security.</p>
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
  name: 'PasswordGenerator',
  data() {
    return {
      currentPassword: '',
      passwordLength: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeAmbiguous: true,
      noDuplicateChars: false,
      bulkCount: 5,
      bulkPasswords: [],
      showBulkPasswords: false,
      copied: false,
      toastMessage: ''
    }
  },
  computed: {
    strengthPercentage() {
      if (!this.currentPassword) return 0
      
      let score = 0
      
      // Length contribution
      if (this.currentPassword.length >= 8) score += 10
      if (this.currentPassword.length >= 12) score += 10
      if (this.currentPassword.length >= 16) score += 10
      if (this.currentPassword.length >= 20) score += 10
      
      // Character variety
      const hasUpper = /[A-Z]/.test(this.currentPassword)
      const hasLower = /[a-z]/.test(this.currentPassword)
      const hasNumber = /[0-9]/.test(this.currentPassword)
      const hasSymbol = /[^A-Za-z0-9]/.test(this.currentPassword)
      
      if (hasUpper) score += 10
      if (hasLower) score += 10
      if (hasNumber) score += 10
      if (hasSymbol) score += 15
      
      // Uniqueness
      const uniqueChars = new Set(this.currentPassword.split('')).size
      if (uniqueChars === this.currentPassword.length) score += 15
      
      return Math.min(100, score)
    },
    
    strengthText() {
      if (this.strengthPercentage < 40) return 'Weak'
      if (this.strengthPercentage < 60) return 'Fair'
      if (this.strengthPercentage < 80) return 'Good'
      return 'Strong'
    },
    
    strengthClass() {
      if (this.strengthPercentage < 40) return 'weak'
      if (this.strengthPercentage < 60) return 'fair'
      if (this.strengthPercentage < 80) return 'good'
      return 'strong'
    },
    
    countUppercase() {
      return (this.currentPassword.match(/[A-Z]/g) || []).length
    },
    
    countLowercase() {
      return (this.currentPassword.match(/[a-z]/g) || []).length
    },
    
    countNumbers() {
      return (this.currentPassword.match(/[0-9]/g) || []).length
    },
    
    countSymbols() {
      return (this.currentPassword.match(/[^A-Za-z0-9]/g) || []).length
    },
    
    entropyBits() {
      if (!this.currentPassword) return 0
      
      let poolSize = 0
      if (this.includeUppercase) poolSize += 26
      if (this.includeLowercase) poolSize += 26
      if (this.includeNumbers) poolSize += 10
      if (this.includeSymbols) poolSize += 32
      
      if (poolSize === 0) return 0
      
      const entropy = Math.log2(Math.pow(poolSize, this.currentPassword.length))
      return Math.round(entropy)
    }
  },
  watch: {
    passwordLength() {
      this.generatePassword()
    },
    includeUppercase() {
      this.validateOptions()
      this.generatePassword()
    },
    includeLowercase() {
      this.validateOptions()
      this.generatePassword()
    },
    includeNumbers() {
      this.validateOptions()
      this.generatePassword()
    },
    includeSymbols() {
      this.validateOptions()
      this.generatePassword()
    },
    excludeAmbiguous() {
      this.generatePassword()
    },
    noDuplicateChars() {
      this.generatePassword()
    }
  },
  mounted() {
    this.generatePassword()
  },
  methods: {
    generatePassword() {
      let chars = ''
      
      if (this.includeUppercase) chars += 'ABCDEFGHJKLMNPQRSTUVWXYZ'
      if (this.includeLowercase) chars += 'abcdefghijkmnopqrstuvwxyz'
      if (this.includeNumbers) chars += '23456789'
      if (this.includeSymbols) chars += '!@#$%^&*()_+[]{}|;:,.<>?'
      
      if (this.excludeAmbiguous) {
        chars = chars.replace(/[0OIl]/g, '')
      }
      
      if (chars.length === 0) {
        this.currentPassword = 'Please select at least one character type'
        return
      }
      
      let password = ''
      let maxAttempts = 100
      
      while (password.length < this.passwordLength && maxAttempts-- > 0) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        
        if (this.noDuplicateChars && password.includes(char)) {
          continue
        }
        
        password += char
      }
      
      // Ensure minimum requirements
      if (this.includeUppercase && !/[A-Z]/.test(password)) {
        password = this.ensureCharacter(password, 'ABCDEFGHJKLMNPQRSTUVWXYZ')
      }
      if (this.includeLowercase && !/[a-z]/.test(password)) {
        password = this.ensureCharacter(password, 'abcdefghijkmnopqrstuvwxyz')
      }
      if (this.includeNumbers && !/[0-9]/.test(password)) {
        password = this.ensureCharacter(password, '23456789')
      }
      if (this.includeSymbols && !/[^A-Za-z0-9]/.test(password)) {
        password = this.ensureCharacter(password, '!@#$%^&*()_+[]{}|;:,.<>?')
      }
      
      // Shuffle the password
      password = this.shuffleString(password)
      
      // Trim to exact length
      if (password.length > this.passwordLength) {
        password = password.substring(0, this.passwordLength)
      }
      
      this.currentPassword = password
    },
    
    ensureCharacter(password, charSet) {
      const randomChar = charSet[Math.floor(Math.random() * charSet.length)]
      const position = Math.floor(Math.random() * password.length)
      return password.substring(0, position) + randomChar + password.substring(position + 1)
    },
    
    shuffleString(str) {
      const array = str.split('')
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
      }
      return array.join('')
    },
    
    generateBulkPasswords() {
      const passwords = []
      const originalPassword = this.currentPassword
      
      for (let i = 0; i < this.bulkCount; i++) {
        this.generatePassword()
        passwords.push(this.currentPassword)
      }
      
      this.bulkPasswords = passwords
      this.currentPassword = originalPassword
      this.showBulkPasswords = true
      this.showToast(`Generated ${this.bulkCount} passwords successfully!`)
    },
    
    regenerateBulk() {
      this.generateBulkPasswords()
    },
    
    async copyToClipboard() {
      if (!this.currentPassword) return
      
      try {
        await navigator.clipboard.writeText(this.currentPassword)
        this.copied = true
        this.showToast('Password copied to clipboard!')
        setTimeout(() => {
          this.copied = false
        }, 2000)
      } catch (err) {
        this.showToast('Failed to copy password')
      }
    },
    
    async copyBulkPassword(password, index) {
      try {
        await navigator.clipboard.writeText(password)
        this.showToast(`Password ${index + 1} copied to clipboard!`)
      } catch (err) {
        this.showToast('Failed to copy password')
      }
    },
    
    async copyAllToClipboard() {
      const allPasswords = this.bulkPasswords.join('\n')
      try {
        await navigator.clipboard.writeText(allPasswords)
        this.showToast('All passwords copied to clipboard!')
      } catch (err) {
        this.showToast('Failed to copy passwords')
      }
    },
    
    validateOptions() {
      if (!this.includeUppercase && !this.includeLowercase && !this.includeNumbers && !this.includeSymbols) {
        this.includeUppercase = true
        this.includeLowercase = true
        this.showToast('At least one character type must be selected')
      }
    },
    
    resetToDefaults() {
      this.passwordLength = 16
      this.includeUppercase = true
      this.includeLowercase = true
      this.includeNumbers = true
      this.includeSymbols = true
      this.excludeAmbiguous = true
      this.noDuplicateChars = false
      this.bulkCount = 5
      this.generatePassword()
      this.showToast('Reset to default settings')
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
.password-generator {
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

/* Password Card */
.password-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.password-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.password-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.password-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
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

.action-btn:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.action-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.action-btn.copied {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.password-display {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
}

.password-text {
  font-family: 'Courier New', monospace;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  word-break: break-all;
  margin-bottom: 16px;
  letter-spacing: 1px;
}

.password-strength {
  margin-top: 16px;
}

.strength-bar {
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background 0.3s ease;
}

.strength-fill.weak {
  background: #ef4444;
}

.strength-fill.fair {
  background: #f59e0b;
}

.strength-fill.good {
  background: #3b82f6;
}

.strength-fill.strong {
  background: #10b981;
}

.strength-text {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.strength-label {
  color: #6b7280;
}

.strength-value {
  font-weight: 600;
}

.strength-value.weak {
  color: #ef4444;
}

.strength-value.fair {
  color: #f59e0b;
}

.strength-value.good {
  color: #3b82f6;
}

.strength-value.strong {
  color: #10b981;
}

/* Bulk Section */
.bulk-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.bulk-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.bulk-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.bulk-actions {
  display: flex;
  gap: 12px;
}

.bulk-list {
  max-height: 400px;
  overflow-y: auto;
}

.bulk-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  margin-bottom: 8px;
  transition: transform 0.2s;
}

.bulk-item:hover {
  transform: translateX(4px);
  background: #f3f4f6;
}

.bulk-number {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #667eea;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
}

.bulk-password {
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #1f2937;
  word-break: break-all;
}

.bulk-copy {
  padding: 6px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.bulk-copy:hover {
  background: #667eea;
  border-color: #667eea;
}

.bulk-copy:hover .btn-icon {
  color: white;
}

/* Options Card */
.options-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.options-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.options-header h3 {
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

.option-group {
  margin-bottom: 24px;
}

.option-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-weight: 500;
  color: #374151;
}

.length-value {
  color: #667eea;
  font-weight: 700;
  font-size: 18px;
}

.length-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e5e7eb;
  outline: none;
  -webkit-appearance: none;
}

.length-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.length-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.length-limits {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 11px;
  color: #9ca3af;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.option-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.option-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.option-content {
  flex: 1;
}

.option-name {
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 2px;
}

.option-example {
  font-size: 11px;
  color: #6b7280;
}

.advanced-options {
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.bulk-generate-btn,
.view-bulk-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.bulk-generate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  flex: 1;
}

.bulk-generate-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.view-bulk-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
}

.view-bulk-btn:hover {
  background: #e5e7eb;
}

/* Stats Card */
.stats-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.stats-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
}

.stat-value {
  font-size: 24px;
  font-weight: 800;
  color: #667eea;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
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
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .password-text {
    font-size: 18px;
  }
  
  .password-header,
  .bulk-header,
  .options-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .password-actions,
  .bulk-actions {
    justify-content: center;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
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
  
  .options-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>