<script setup>
import { ref } from 'vue'

const title = ref('Amazing Feature')
const description = ref("Describe your app's key feature that makes it stand out")
const icon = ref('📱')
const iconFile = ref(null)
const screenshot = ref(null)
const screenshotMode = ref(false)

const fileInput = ref(null)
const iconInput = ref(null)

const handleScreenshotUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    screenshot.value = URL.createObjectURL(file)
  }
}

const handleIconUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    iconFile.value = URL.createObjectURL(file)
  }
}

const toggleScreenshotMode = () => {
  screenshotMode.value = !screenshotMode.value
}
</script>

<template>
  <div class="body" :class="{ 'screenshot-mode': screenshotMode }">
    
    <!-- Controls -->
    <div class="controls" v-show="!screenshotMode">
      <h3>🎨 Customize Your App Screenshot</h3>

      <div class="control-grid">
        
        <div class="control-group">
          <label>App Title</label>
          <input v-model="title" type="text" />
        </div>

        <div class="control-group">
          <label>Description</label>
          <input v-model="description" type="text" />
        </div>

        <div class="control-group">
          <label>App Icon</label>
          <div style="display: flex; gap: 8px;">
            <select v-model="icon" style="flex: 1;">
              <option value="📱">📱 Phone</option>
              <option value="⚡">⚡ Lightning</option>
              <option value="🎨">🎨 Art</option>
              <option value="🚀">🚀 Rocket</option>
              <option value="💎">💎 Diamond</option>
              <option value="🔥">🔥 Fire</option>
              <option value="⭐">⭐ Star</option>
              <option value="🎯">🎯 Target</option>
            </select>

            <button class="btn" @click="iconInput.click()">Upload</button>
          </div>

          <input type="file" ref="iconInput" class="file-input" @change="handleIconUpload" />
        </div>

        <div class="control-group">
          <label>Screenshot</label>
          <button class="btn" @click="fileInput.click()">Upload Image</button>
          <input type="file" ref="fileInput" class="file-input" @change="handleScreenshotUpload" />
        </div>

        <button class="btn btn-download" @click="toggleScreenshotMode">
          📸 Screenshot Mode
        </button>
      </div>
    </div>

    <!-- Preview -->
    <div class="screenshot-container">
      <div class="screenshot-frame">
        
        <!-- Icon -->
        <div class="app-icon">
          <img v-if="iconFile" :src="iconFile" />
          <span v-else>{{ icon }}</span>
        </div>

        <!-- Phone -->
        <div class="phone-mockup">
          <div class="phone-screen" @click="fileInput.click()">
            
            <img v-if="screenshot" :src="screenshot" class="screenshot-img" />
            
            <div v-else class="screenshot-placeholder">
              <div>📸</div>
              <div>Click to upload</div>
            </div>

          </div>
        </div>

        <!-- Text -->
        <div class="feature-title">{{ title }}</div>
        <div class="feature-description">{{ description }}</div>

      </div>
    </div>

  </div>
</template>
<style>


        .body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            transition: all 0.3s ease;
        }

        .controls {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            margin-bottom: 30px;
            width: 100%;
            max-width: 800px;
            border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .controls h3 {
            margin-bottom: 15px;
            color: #333;
            font-size: 18px;
            text-align: center;
        }

        .control-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            align-items: start;
        }

        .control-group {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .control-group label {
            font-size: 12px;
            color: #666;
            font-weight: 500;
        }

        .control-group input, .control-group select {
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .control-group input:focus, .control-group select:focus {
            outline: none;
            border-color: #667eea;
        }

        .color-input {
            width: 100%;
            height: 40px;
            border: none;
            border-radius: 6px;
            cursor: pointer;
        }

        .btn {
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.2s;
        }

        .btn:hover {
            background: #5a6fd8;
            transform: translateY(-2px);
        }

        .btn-download {
            background: #28a745;
            grid-column: 1 / -1;
            justify-self: center;
            margin-top: 10px;
        }

        .btn-download:hover {
            background: #218838;
        }

        .screenshot-container {
            display: flex;
            justify-content: center;
            width: 100%;
            max-width: 400px;
        }

        .screenshot-frame {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            padding: 30px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            width: 100%;
        }

        .screenshot-frame:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        .screenshot-frame::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-color, #ff6b6b), var(--secondary-color, #4ecdc4));
            background-size: 300% 100%;
            animation: gradient 3s ease infinite;
        }

        @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
        }

        .phone-mockup {
            background: #1a1a1a;
            border-radius: 25px;
            padding: 8px;
            margin: 0 auto 20px;
            width: 240px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
            position: relative;
        }

        .phone-mockup::before {
            content: '';
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: #333;
            border-radius: 2px;
        }

        .phone-screen {
            background: #f8f9fa;
            border-radius: 18px;
            height: 420px;
            overflow: hidden;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }

        .phone-screen:hover {
            transform: scale(1.02);
        }

        .screenshot-placeholder {
            width: 100%;
            height: 100%;
            background: linear-gradient(45deg, #e3f2fd, #f3e5f5);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #666;
            font-size: 14px;
            text-align: center;
            border: 2px dashed #ccc;
            border-radius: 16px;
            transition: all 0.2s;
        }

        .screenshot-placeholder:hover {
            border-color: #667eea;
            background: linear-gradient(45deg, #e8f0fe, #f8e6ff);
        }

        .screenshot-img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 16px;
        }

        .feature-title {
            color: white;
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 12px;
            text-align: center;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .feature-description {
            color: rgba(255, 255, 255, 0.9);
            font-size: 16px;
            line-height: 1.6;
            text-align: center;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }

        .app-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, var(--accent-color, #667eea), var(--secondary-color, #764ba2));
            border-radius: 12px;
            margin: 0 auto 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 24px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            overflow: hidden;
        }

        .app-icon img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 12px;
        }

        .file-input {
            display: none;
        }

        .hide-controls {
            display: none !important;
        }

        .screenshot-mode {
            padding-top: 40px;
        }
</style>