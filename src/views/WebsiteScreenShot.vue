<template>
  <div class="screenshot-tool">
    <div class="tool-header">
      <h2>Website Screenshot Tool</h2>
      <p>Capture full-page screenshots of any website. Perfect for documentation, previews, and design reviews.</p>
    </div>

    <div class="tool-main">
      <!-- Input Section -->
      <div class="input-section">
        <div class="url-input-group">
          <label>
            <span class="label-icon">🌐</span>
            Website URL
          </label>
          <div class="url-input-wrapper">
            <input
              v-model="url"
              type="url"
              placeholder="https://example.com"
              @keyup.enter="captureScreenshot"
              class="url-input"
            />
            <button @click="captureScreenshot" :disabled="isCapturing" class="capture-btn">
              {{ isCapturing ? 'Capturing...' : 'Capture Screenshot' }}
            </button>
          </div>
        </div>

        <div class="options-grid">
          <div class="option-group">
            <label>Device Type</label>
            <div class="device-buttons">
              <button
                v-for="device in devices"
                :key="device.value"
                @click="selectedDevice = device.value"
                :class="['device-btn', { active: selectedDevice === device.value }]"
              >
                <span class="device-icon">{{ device.icon }}</span>
                <span>{{ device.name }}</span>
              </button>
            </div>
          </div>

          <div class="option-group">
            <label>Quality</label>
            <select v-model="quality" class="quality-select">
              <option value="0.5">Standard (50%)</option>
              <option value="0.8">High (80%)</option>
              <option value="1">Very High (100%)</option>
            </select>
          </div>

          <div class="option-group">
            <label>Capture Mode</label>
            <div class="mode-buttons">
              <button
                @click="captureMode = 'viewport'"
                :class="['mode-btn', { active: captureMode === 'viewport' }]"
              >
                Viewport Only
              </button>
              <button
                @click="captureMode = 'fullpage'"
                :class="['mode-btn', { active: captureMode === 'fullpage' }]"
              >
                Full Page
              </button>
            </div>
          </div>

          <div class="option-group">
            <label>Delay (ms)</label>
            <input
              type="number"
              v-model="delay"
              min="0"
              max="10000"
              step="500"
              class="delay-input"
            />
            <span class="help-text">Wait for dynamic content to load</span>
          </div>
        </div>

        <!-- Custom Dimensions (for desktop) -->
        <div v-if="selectedDevice === 'custom'" class="custom-dimensions">
          <div class="dimension-input">
            <label>Width (px)</label>
            <input type="number" v-model="customWidth" min="320" max="3840" step="100" />
          </div>
          <div class="dimension-input">
            <label>Height (px)</label>
            <input type="number" v-model="customHeight" min="480" max="2160" step="100" />
          </div>
        </div>

        <!-- Recent URLs -->
        <div v-if="recentUrls.length > 0" class="recent-urls">
          <label>Recent URLs</label>
          <div class="recent-list">
            <button
              v-for="(recent, index) in recentUrls"
              :key="index"
              @click="url = recent"
              class="recent-btn"
            >
              {{ recent }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isCapturing" class="loading-container">
        <div class="loading-spinner"></div>
        <p>Loading website and capturing screenshot...</p>
        <p class="loading-status">{{ loadingStatus }}</p>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="error-message">
        <span class="error-icon">⚠️</span>
        <span>{{ errorMessage }}</span>
        <button @click="errorMessage = null" class="close-error">✕</button>
      </div>

      <!-- Screenshot Preview -->
      <div v-if="screenshotUrl" class="preview-section">
        <div class="preview-header">
          <h3>Screenshot Preview</h3>
          <div class="preview-actions">
            <button @click="downloadScreenshot" class="preview-btn download">
              💾 Download PNG
            </button>
            <button @click="copyToClipboard" class="preview-btn copy">
              📋 Copy to Clipboard
            </button>
            <button @click="clearScreenshot" class="preview-btn clear">
              🗑️ Clear
            </button>
          </div>
        </div>

        <div class="screenshot-container">
          <img :src="screenshotUrl" :alt="`Screenshot of ${url}`" class="screenshot-image" />
        </div>

        <!-- Screenshot Info -->
        <div class="screenshot-info">
          <div class="info-item">
            <span class="info-label">URL:</span>
            <span class="info-value">{{ url }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Dimensions:</span>
            <span class="info-value">{{ screenshotDimensions }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">File Size:</span>
            <span class="info-value">{{ screenshotSize }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Captured:</span>
            <span class="info-value">{{ new Date().toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- History Section -->
      <div v-if="screenshotHistory.length > 0" class="history-section">
        <div class="history-header">
          <h3>Recent Screenshots</h3>
          <button @click="clearHistory" class="clear-history-btn">Clear History</button>
        </div>
        <div class="history-grid">
          <div
            v-for="(item, index) in screenshotHistory"
            :key="index"
            class="history-item"
          >
            <img :src="item.thumbnail" class="history-thumb" />
            <div class="history-info">
              <div class="history-url">{{ truncateUrl(item.url) }}</div>
              <div class="history-date">{{ formatDate(item.timestamp) }}</div>
            </div>
            <div class="history-actions">
              <button @click="loadHistoryScreenshot(item)" class="history-btn view">👁️</button>
              <button @click="downloadHistoryScreenshot(item)" class="history-btn download">💾</button>
              <button @click="deleteHistoryItem(index)" class="history-btn delete">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-section">
        <div class="tips-header">
          <span class="tips-icon">💡</span>
          <h4>Pro Tips</h4>
        </div>
        <ul class="tips-list">
          <li>Use "Full Page" mode to capture entire websites, even those with infinite scroll</li>
          <li>Add a delay for websites that load content dynamically with JavaScript</li>
          <li>Mobile view helps test responsive designs and mobile layouts</li>
          <li>Higher quality settings produce larger file sizes - balance quality and performance</li>
          <li>Some websites may block screenshot services - check CORS policies</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// Using html2canvas for DOM-based screenshots
// For cross-domain websites, we'll use an API approach

export default {
  name: 'WebsiteScreenshotTool',
  data() {
    return {
      url: '',
      isCapturing: false,
      errorMessage: null,
      screenshotUrl: null,
      loadingStatus: 'Connecting to website...',
      selectedDevice: 'desktop',
      devices: [
        { value: 'desktop', name: 'Desktop', icon: '💻', width: 1920, height: 1080 },
        { value: 'tablet', name: 'Tablet', icon: '📱', width: 768, height: 1024 },
        { value: 'mobile', name: 'Mobile', icon: '📱', width: 375, height: 667 },
        { value: 'custom', name: 'Custom', icon: '⚙️', width: null, height: null }
      ],
      quality: 0.8,
      captureMode: 'fullpage',
      delay: 1000,
      customWidth: 1280,
      customHeight: 800,
      recentUrls: [],
      screenshotHistory: [],
      screenshotDimensions: '',
      screenshotSize: ''
    };
  },
  computed: {
    deviceWidth() {
      const device = this.devices.find(d => d.value === this.selectedDevice);
      if (this.selectedDevice === 'custom') {
        return this.customWidth;
      }
      return device?.width || 1920;
    },
    deviceHeight() {
      const device = this.devices.find(d => d.value === this.selectedDevice);
      if (this.selectedDevice === 'custom') {
        return this.customHeight;
      }
      return device?.height || 1080;
    }
  },
  mounted() {
    this.loadRecentUrls();
    this.loadHistory();
  },
  methods: {
    async captureScreenshot() {
      if (!this.url) {
        this.errorMessage = 'Please enter a valid URL';
        return;
      }

      // Validate URL
      let validUrl;
      try {
        validUrl = new URL(this.url);
        if (!validUrl.protocol.startsWith('http')) {
          throw new Error('Invalid protocol');
        }
      } catch {
        this.errorMessage = 'Please enter a valid URL starting with http:// or https://';
        return;
      }

      this.isCapturing = true;
      this.errorMessage = null;
      this.loadingStatus = 'Loading website...';

      try {
        // For cross-domain screenshots, we'll use a proxy approach
        // Since direct iframe capture has CORS limitations, we'll use an API approach
        
        // Method 1: Try to use a free screenshot API (for demonstration)
        // Note: In production, you'd want to use your own backend service
        const screenshotApiUrl = this.getScreenshotApiUrl(validUrl.href);
        
        this.loadingStatus = 'Capturing screenshot...';
        
        // Create an image element to load the screenshot
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        // Using a timeout for the image load
        const imageLoadPromise = new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to capture screenshot'));
          img.src = screenshotApiUrl;
        });
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Screenshot capture timed out')), 30000);
        });
        
        await Promise.race([imageLoadPromise, timeoutPromise]);
        
        // Create canvas to get image data
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        // Get screenshot as data URL
        const dataUrl = canvas.toDataURL('image/png', this.quality);
        this.screenshotUrl = dataUrl;
        
        // Calculate file size
        const sizeInBytes = Math.round((dataUrl.length * 3) / 4);
        this.screenshotSize = this.formatBytes(sizeInBytes);
        this.screenshotDimensions = `${img.width} x ${img.height}px`;
        
        // Save to history
        this.saveToHistory(validUrl.href, dataUrl);
        
        // Save to recent URLs
        this.addToRecentUrls(validUrl.href);
        
      } catch (error) {
        console.error('Screenshot capture error:', error);
        this.errorMessage = `Failed to capture screenshot: ${error.message}. Try using a different URL or check CORS policies.`;
      } finally {
        this.isCapturing = false;
      }
    },
    
    getScreenshotApiUrl(url) {
      // Using a free screenshot API (screenshotapi.io has a free tier)
      // Note: For production, consider setting up your own screenshot service
      
      // Option 1: Use a free API (you'll need to sign up for an API key)
      // const apiKey = 'YOUR_API_KEY'; // Get from https://screenshotapi.io/
      
      // Option 2: Use a public CORS proxy with a screenshot service
      // This is a demonstration - in production, use a proper backend service
      
      // For demo purposes, we'll use a proxy approach that works for some websites
      // Note: This may not work for all websites due to CORS
      
      const encodedUrl = encodeURIComponent(url);
      
      // Using a combination of services for better compatibility
      // Option A: Microlink API (has rate limits but works for demo)
      const microlinkApi = `https://api.microlink.io?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url`;
      
      // Option B: Alternative service
      // const screenshotApi = `https://image.thum.io/get/width/${this.deviceWidth}/crop/675/${url}`;
      
      // For better results, we'll use a service that supports full-page screenshots
      if (this.captureMode === 'fullpage') {
        return `https://api.microlink.io?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url&fullPage=true`;
      } else {
        return `https://api.microlink.io?url=${encodedUrl}&screenshot=true&meta=false&embed=screenshot.url&viewport=${this.deviceWidth}x${this.deviceHeight}`;
      }
    },
    
    // Alternative method using html2canvas for same-origin websites
    async captureIframeScreenshot() {
      // This method works for same-origin websites or when you have access to the DOM
      // For cross-origin, you'll need a proxy or API service
      
      return new Promise((resolve, reject) => {
        const iframe = document.createElement('iframe');
        iframe.style.position = 'absolute';
        iframe.style.top = '-9999px';
        iframe.style.left = '-9999px';
        iframe.style.width = `${this.deviceWidth}px`;
        iframe.style.height = `${this.deviceHeight}px`;
        iframe.src = this.url;
        
        iframe.onload = async () => {
          try {
            await new Promise(r => setTimeout(r, this.delay));
            
            // This will throw CORS error for cross-origin websites
            const canvas = await import('html2canvas').then(module => {
              return module.default(iframe.contentDocument.body);
            });
            
            const dataUrl = canvas.toDataURL('image/png', this.quality);
            document.body.removeChild(iframe);
            resolve(dataUrl);
          } catch (error) {
            document.body.removeChild(iframe);
            reject(error);
          }
        };
        
        iframe.onerror = () => {
          document.body.removeChild(iframe);
          reject(new Error('Failed to load website'));
        };
        
        document.body.appendChild(iframe);
      });
    },
    
    downloadScreenshot() {
      if (!this.screenshotUrl) return;
      
      const link = document.createElement('a');
      const domain = new URL(this.url).hostname;
      link.download = `screenshot-${domain}-${Date.now()}.png`;
      link.href = this.screenshotUrl;
      link.click();
    },
    
    async copyToClipboard() {
      if (!this.screenshotUrl) return;
      
      try {
        const blob = await (await fetch(this.screenshotUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert('Screenshot copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
    },
    
    clearScreenshot() {
      this.screenshotUrl = null;
      this.screenshotDimensions = '';
      this.screenshotSize = '';
    },
    
    saveToHistory(url, screenshotDataUrl) {
      // Create thumbnail (smaller version)
      const img = new Image();
      img.src = screenshotDataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = 100 / img.width;
        canvas.width = 100;
        canvas.height = img.height * ratio;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const thumbnail = canvas.toDataURL('image/jpeg', 0.5);
        
        const historyItem = {
          url,
          screenshot: screenshotDataUrl,
          thumbnail,
          timestamp: Date.now(),
          dimensions: this.screenshotDimensions,
          size: this.screenshotSize
        };
        
        this.screenshotHistory.unshift(historyItem);
        // Keep only last 20 screenshots
        if (this.screenshotHistory.length > 20) {
          this.screenshotHistory = this.screenshotHistory.slice(0, 20);
        }
        localStorage.setItem('screenshot_history', JSON.stringify(this.screenshotHistory));
      };
    },
    
    loadHistory() {
      const saved = localStorage.getItem('screenshot_history');
      if (saved) {
        this.screenshotHistory = JSON.parse(saved);
      }
    },
    
    loadHistoryScreenshot(item) {
      this.screenshotUrl = item.screenshot;
      this.url = item.url;
      this.screenshotDimensions = item.dimensions;
      this.screenshotSize = item.size;
    },
    
    downloadHistoryScreenshot(item) {
      const link = document.createElement('a');
      const domain = new URL(item.url).hostname;
      link.download = `screenshot-${domain}-${item.timestamp}.png`;
      link.href = item.screenshot;
      link.click();
    },
    
    deleteHistoryItem(index) {
      this.screenshotHistory.splice(index, 1);
      localStorage.setItem('screenshot_history', JSON.stringify(this.screenshotHistory));
    },
    
    clearHistory() {
      if (confirm('Clear all screenshot history?')) {
        this.screenshotHistory = [];
        localStorage.removeItem('screenshot_history');
      }
    },
    
    addToRecentUrls(url) {
      const index = this.recentUrls.indexOf(url);
      if (index !== -1) {
        this.recentUrls.splice(index, 1);
      }
      this.recentUrls.unshift(url);
      if (this.recentUrls.length > 10) {
        this.recentUrls = this.recentUrls.slice(0, 10);
      }
      localStorage.setItem('recent_urls', JSON.stringify(this.recentUrls));
    },
    
    loadRecentUrls() {
      const saved = localStorage.getItem('recent_urls');
      if (saved) {
        this.recentUrls = JSON.parse(saved);
      }
    },
    
    truncateUrl(url) {
      const maxLength = 40;
      if (url.length <= maxLength) return url;
      return url.substring(0, maxLength) + '...';
    },
    
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diff = now - date;
      
      if (diff < 60000) return 'Just now';
      if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
      return date.toLocaleDateString();
    },
    
    formatBytes(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
  }
};
</script>

<style scoped>
.screenshot-tool {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.tool-header {
  margin-bottom: 32px;
  text-align: center;
}

.tool-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.tool-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.tool-main {
  background: #1e293b;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 24px;
}

.url-input-group {
  margin-bottom: 24px;
}

.url-input-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
}

.url-input-wrapper {
  display: flex;
  gap: 12px;
}

.url-input {
  flex: 1;
  padding: 12px 16px;
  background: #1e293b;
  border: 2px solid #334155;
  border-radius: 12px;
  color: #e2e8f0;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.url-input:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.capture-btn {
  padding: 12px 24px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.capture-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.capture-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.option-group label {
  display: block;
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.device-buttons,
.mode-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.device-btn,
.mode-btn {
  flex: 1;
  padding: 8px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.device-btn:hover,
.mode-btn:hover {
  background: #334155;
}

.device-btn.active,
.mode-btn.active {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}

.quality-select,
.delay-input {
  width: 100%;
  padding: 8px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
}

.help-text {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 4px;
}

.custom-dimensions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #334155;
}

.dimension-input label {
  display: block;
  color: #94a3b8;
  font-size: 0.8rem;
  margin-bottom: 4px;
}

.dimension-input input {
  width: 100%;
  padding: 8px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
}

.recent-urls {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #334155;
}

.recent-urls label {
  display: block;
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.recent-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.recent-btn {
  padding: 4px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  color: #94a3b8;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.recent-btn:hover {
  background: #334155;
  color: #e2e8f0;
}

.loading-container {
  text-align: center;
  padding: 40px;
  background: #0f172a;
  border-radius: 16px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #334155;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-status {
  color: #64748b;
  font-size: 0.85rem;
  margin-top: 8px;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  border-left: 3px solid #ef4444;
  border-radius: 8px;
  color: #fca5a5;
}

.error-icon {
  font-size: 1.2rem;
}

.close-error {
  margin-left: auto;
  background: none;
  border: none;
  color: #fca5a5;
  cursor: pointer;
  font-size: 1.2rem;
}

.preview-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 24px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.preview-header h3 {
  color: #e2e8f0;
  margin: 0;
}

.preview-actions {
  display: flex;
  gap: 12px;
}

.preview-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.preview-btn.download {
  background: #10b981;
  color: white;
}

.preview-btn.download:hover {
  background: #059669;
  transform: translateY(-1px);
}

.preview-btn.copy {
  background: #3b82f6;
  color: white;
}

.preview-btn.copy:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.preview-btn.clear {
  background: #6b7280;
  color: white;
}

.preview-btn.clear:hover {
  background: #4b5563;
  transform: translateY(-1px);
}

.screenshot-container {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  max-height: 600px;
  overflow: auto;
}

.screenshot-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.screenshot-info {
  margin-top: 16px;
  padding: 12px;
  background: #1e293b;
  border-radius: 8px;
}

.info-item {
  display: flex;
  gap: 8px;
  font-size: 0.85rem;
  padding: 4px 0;
}

.info-label {
  font-weight: 600;
  color: #94a3b8;
  min-width: 100px;
}

.info-value {
  color: #e2e8f0;
  word-break: break-all;
}

.history-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 24px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.history-header h3 {
  color: #e2e8f0;
  margin: 0;
}

.clear-history-btn {
  padding: 6px 12px;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.8rem;
}

.history-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #1e293b;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.history-item:hover {
  transform: translateX(4px);
  background: #334155;
}

.history-thumb {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
}

.history-info {
  flex: 1;
}

.history-url {
  color: #e2e8f0;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.history-date {
  color: #64748b;
  font-size: 0.7rem;
}

.history-actions {
  display: flex;
  gap: 6px;
}

.history-btn {
  padding: 4px 8px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-btn.view:hover {
  background: #3b82f6;
}

.history-btn.download:hover {
  background: #10b981;
}

.history-btn.delete:hover {
  background: #ef4444;
}

.tips-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 20px;
}

.tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.tips-icon {
  font-size: 1.2rem;
}

.tips-header h4 {
  color: #e2e8f0;
  margin: 0;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  color: #94a3b8;
  font-size: 0.85rem;
  padding: 6px 0;
  padding-left: 20px;
  position: relative;
}

.tips-list li::before {
  content: "•";
  color: #8b5cf6;
  position: absolute;
  left: 0;
}

@media (max-width: 768px) {
  .screenshot-tool {
    padding: 16px;
  }
  
  .tool-main {
    padding: 16px;
  }
  
  .url-input-wrapper {
    flex-direction: column;
  }
  
  .preview-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .history-grid {
    grid-template-columns: 1fr;
  }
  
  .custom-dimensions {
    grid-template-columns: 1fr;
  }
}
</style>