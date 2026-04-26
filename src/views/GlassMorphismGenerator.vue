<template>
  <div class="glass-generator">
    <div class="generator-header">
      <h2>Glassmorphism Generator</h2>
      <p>Create modern glass UI effects with blur and transparency.</p>
    </div>

    <div class="generator-main">
      <!-- Live Preview Section -->
      <div class="preview-section">
        <div class="preview-container" :style="backgroundStyle">
          <div class="glass-preview" :style="glassStyle">
            <div class="glass-content">
              <h3>Glassmorphism Effect</h3>
              <p>Modern glass UI with blur and transparency</p>
              <div class="demo-elements">
                <button class="demo-btn">Button</button>
                <span class="demo-badge">New</span>
              </div>
            </div>
          </div>
          <div class="preview-backdrop-controls">
            <label>Background Pattern</label>
            <div class="bg-patterns">
              <button
                v-for="pattern in bgPatterns"
                :key="pattern.value"
                @click="backgroundPattern = pattern.value"
                :class="['pattern-btn', { active: backgroundPattern === pattern.value }]"
              >
                {{ pattern.name }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="controls-section">
        <!-- Glass Effect Controls -->
        <div class="control-group">
          <label>
            <span class="label-icon">🔮</span>
            Glass Effect
          </label>
          
          <div class="control-item">
            <label>Background Color</label>
            <div class="color-control">
              <input
                type="color"
                v-model="glassColor"
                @input="updateGlass"
                class="color-picker"
              />
              <input
                type="range"
                v-model="glassOpacity"
                min="0"
                max="1"
                step="0.01"
                @input="updateGlass"
                class="slider"
              />
              <span class="value-display">{{ Math.round(glassOpacity * 100) }}%</span>
            </div>
          </div>

          <div class="control-item">
            <label>Blur Amount: {{ blurAmount }}px</label>
            <input
              type="range"
              v-model="blurAmount"
              min="0"
              max="30"
              step="1"
              @input="updateGlass"
              class="slider"
            />
          </div>

          <div class="control-item">
            <label>Border Radius: {{ borderRadius }}px</label>
            <input
              type="range"
              v-model="borderRadius"
              min="0"
              max="50"
              step="1"
              @input="updateGlass"
              class="slider"
            />
          </div>

          <div class="control-item">
            <label>Border Width: {{ borderWidth }}px</label>
            <input
              type="range"
              v-model="borderWidth"
              min="0"
              max="5"
              step="0.5"
              @input="updateGlass"
              class="slider"
            />
          </div>

          <div class="control-item">
            <label>Border Color</label>
            <input
              type="color"
              v-model="borderColor"
              @input="updateGlass"
              class="color-picker"
            />
          </div>
        </div>

        <!-- Shadow Effects -->
        <div class="control-group">
          <label>
            <span class="label-icon">🌑</span>
            Shadow Effects
          </label>
          
          <div class="control-item">
            <label>Box Shadow Intensity</label>
            <input
              type="range"
              v-model="shadowIntensity"
              min="0"
              max="1"
              step="0.05"
              @input="updateGlass"
              class="slider"
            />
          </div>

          <div class="control-item">
            <label>Drop Shadow</label>
            <input
              type="checkbox"
              v-model="dropShadow"
              @change="updateGlass"
              class="checkbox"
            />
          </div>
        </div>

        <!-- Presets -->
        <div class="control-group">
          <label>
            <span class="label-icon">💎</span>
            Modern UI Presets
          </label>
          <div class="preset-grid">
            <div
              v-for="(preset, index) in presets"
              :key="index"
              @click="applyPreset(preset)"
              class="preset-item"
            >
              <div class="preset-preview" :style="preset.style"></div>
              <div class="preset-name">{{ preset.name }}</div>
            </div>
          </div>
        </div>

        <!-- CSS Output -->
        <div class="control-group">
          <label>
            <span class="label-icon">📋</span>
            CSS Code
          </label>
          <div class="css-output">
            <pre class="css-code">{{ glassCSS }}</pre>
            <div class="output-actions">
              <button @click="copyToClipboard('full')" class="copy-css-btn">
                📋 Copy Full CSS
              </button>
              <button @click="copyToClipboard('glass')" class="copy-css-btn">
                📋 Copy Glass Only
              </button>
            </div>
          </div>
        </div>

        <!-- Export Options -->
        <div class="control-group">
          <label>
            <span class="label-icon">💾</span>
            Export
          </label>
          <div class="export-buttons">
            <button @click="exportAsCSS" class="export-btn">
              Download CSS File
            </button>
            <button @click="exportAsHTML" class="export-btn">
              Download HTML Demo
            </button>
          </div>
        </div>

        <!-- Additional Info -->
        <div class="control-group">
          <div class="info-box">
            <span class="info-icon">ℹ️</span>
            <span class="info-text">Glassmorphism works best on colorful backgrounds. Try different background patterns!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlassMorphismGenerator',
  data() {
    return {
      glassColor: '#ffffff',
      glassOpacity: 0.2,
      blurAmount: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowIntensity: 0.3,
      dropShadow: true,
      backgroundPattern: 'gradient',
      bgPatterns: [
        { value: 'gradient', name: 'Gradient' },
        { value: 'waves', name: 'Waves' },
        { value: 'grid', name: 'Grid' },
        { value: 'dots', name: 'Dots' },
        { value: 'circuit', name: 'Circuit' }
      ],
      presets: [
        {
          name: 'Frosted Glass',
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }
        },
        {
          name: 'Dark Glass',
          style: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(12px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }
        },
        {
          name: 'Neon Glass',
          style: {
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: '24px',
            border: '1px solid rgba(59, 130, 246, 0.4)'
          }
        },
        {
          name: 'Minimal',
          style: {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(5px)',
            borderRadius: '12px',
            border: 'none'
          }
        },
        {
          name: 'Vibrant',
          style: {
            backgroundColor: 'rgba(236, 72, 153, 0.2)',
            backdropFilter: 'blur(15px)',
            borderRadius: '28px',
            border: '2px solid rgba(236, 72, 153, 0.4)'
          }
        },
        {
          name: 'Cyberpunk',
          style: {
            backgroundColor: 'rgba(255, 0, 255, 0.1)',
            backdropFilter: 'blur(6px)',
            borderRadius: '0px',
            border: '1px solid rgba(0, 255, 255, 0.5)'
          }
        }
      ]
    };
  },
  computed: {
    glassStyle() {
      const backgroundColor = this.hexToRgba(this.glassColor, this.glassOpacity);
      const shadowValue = this.shadowIntensity > 0 
        ? `0 8px 32px rgba(0, 0, 0, ${this.shadowIntensity * 0.3})` 
        : 'none';
      
      return {
        backgroundColor,
        backdropFilter: `blur(${this.blurAmount}px)`,
        borderRadius: `${this.borderRadius}px`,
        border: this.borderWidth > 0 ? `${this.borderWidth}px solid ${this.borderColor}` : 'none',
        boxShadow: shadowValue,
        filter: this.dropShadow ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' : 'none'
      };
    },
    backgroundStyle() {
      switch (this.backgroundPattern) {
        case 'gradient':
          return {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          };
        case 'waves':
          return {
            background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
            position: 'relative',
            overflow: 'hidden'
          };
        case 'grid':
          return {
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            backgroundColor: '#1e293b'
          };
        case 'dots':
          return {
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
            backgroundColor: '#0f172a'
          };
        case 'circuit':
          return {
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 100%)',
            position: 'relative'
          };
        default:
          return {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          };
      }
    },
    glassCSS() {
      const backgroundColor = this.hexToRgba(this.glassColor, this.glassOpacity);
      const shadowValue = this.shadowIntensity > 0 
        ? `0 8px 32px rgba(0, 0, 0, ${this.shadowIntensity * 0.3})` 
        : 'none';
      
      return `.glass {
    background: ${backgroundColor};
    backdrop-filter: blur(${this.blurAmount}px);
    border-radius: ${this.borderRadius}px;
    ${this.borderWidth > 0 ? `border: ${this.borderWidth}px solid ${this.borderColor};` : ''}
    box-shadow: ${shadowValue};
    ${this.dropShadow ? 'filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));' : ''}
}`;
    }
  },
  methods: {
    hexToRgba(hex, opacity) {
      let r, g, b;
      if (hex.startsWith('#')) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        if (result) {
          r = parseInt(result[1], 16);
          g = parseInt(result[2], 16);
          b = parseInt(result[3], 16);
          return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        }
      } else if (hex.startsWith('rgba')) {
        return hex;
      }
      return `rgba(255, 255, 255, ${opacity})`;
    },
    updateGlass() {
      this.$forceUpdate();
    },
    applyPreset(preset) {
      // Parse preset style
      const bgMatch = preset.style.backgroundColor.match(/rgba?\([^)]+\)/);
      if (bgMatch) {
        const rgba = bgMatch[0];
        if (rgba.includes('rgba')) {
          const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
          if (match) {
            this.glassColor = this.rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
            this.glassOpacity = parseFloat(match[4]);
          }
        } else if (rgba.includes('rgb')) {
          const match = rgba.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          if (match) {
            this.glassColor = this.rgbToHex(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]));
            this.glassOpacity = 0.2;
          }
        }
      }
      
      const blurMatch = preset.style.backdropFilter.match(/blur\((\d+)px\)/);
      if (blurMatch) {
        this.blurAmount = parseInt(blurMatch[1]);
      }
      
      const radiusMatch = preset.style.borderRadius.match(/(\d+)px/);
      if (radiusMatch) {
        this.borderRadius = parseInt(radiusMatch[1]);
      }
      
      if (preset.style.border && preset.style.border !== 'none') {
        const borderMatch = preset.style.border.match(/(\d+)px\s+solid\s+(.+)/);
        if (borderMatch) {
          this.borderWidth = parseFloat(borderMatch[1]);
          this.borderColor = borderMatch[2];
        }
      } else {
        this.borderWidth = 0;
      }
      
      this.updateGlass();
    },
    rgbToHex(r, g, b) {
      return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    async copyToClipboard(type = 'full') {
      const textToCopy = type === 'full' ? this.getFullCSS() : this.glassCSS;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        const btns = document.querySelectorAll('.copy-css-btn');
        btns.forEach(btn => {
          if (btn.textContent.includes('Copy')) {
            const originalText = btn.textContent;
            btn.textContent = '✓ Copied!';
            setTimeout(() => {
              btn.textContent = originalText;
            }, 2000);
          }
        });
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
    },
    getFullCSS() {
      return `/* Glassmorphism CSS Generated */
.glass-card {
    ${this.glassCSS.replace('.glass', '').trim()}
    /* Additional styles for content */
    padding: 2rem;
    color: #fff;
    transition: all 0.3s ease;
}

.glass-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
}`;
    },
    exportAsCSS() {
      const cssContent = this.getFullCSS();
      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'glassmorphism.css';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    exportAsHTML() {
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Glassmorphism Demo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            ${this.getBackgroundCSS()}
        }
        
        ${this.glassCSS}
        
        .glass-content {
            text-align: center;
            padding: 2rem;
        }
        
        .glass-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: #fff;
        }
        
        .glass-content p {
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 1rem;
        }
        
        .demo-btn {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .demo-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
        }
    </style>
</head>
<body>
    <div class="glass glass-content">
        <h3>Glassmorphism Effect</h3>
        <p>Modern glass UI with blur and transparency</p>
        <button class="demo-btn">Get Started</button>
    </div>
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'glassmorphism-demo.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    getBackgroundCSS() {
      switch (this.backgroundPattern) {
        case 'gradient':
          return 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';
        case 'waves':
          return 'background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);';
        case 'grid':
          return `background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px);
    background-size: 40px 40px;
    background-color: #1e293b;`;
        case 'dots':
          return `background-image: radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px);
    background-size: 30px 30px;
    background-color: #0f172a;`;
        default:
          return 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);';
      }
    }
  },
  mounted() {
    // Add wave animation for circuit pattern if needed
    if (this.backgroundPattern === 'circuit') {
      const style = document.createElement('style');
      style.textContent = `
        .preview-container {
          position: relative;
          overflow: hidden;
        }
        .preview-container::before {
          content: '';
          position: absolute;
          width: 200%;
          height: 200%;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.03) 20px,
            rgba(255, 255, 255, 0.03) 40px
          );
          animation: move 20s linear infinite;
        }
        @keyframes move {
          0% {
            transform: translate(-25%, -25%);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
};
</script>

<style scoped>
.glass-generator {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.generator-header {
  margin-bottom: 32px;
  text-align: center;
}

.generator-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.generator-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.generator-main {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 24px;
}

@media (max-width: 968px) {
  .generator-main {
    grid-template-columns: 1fr;
  }
}

.preview-section {
  position: sticky;
  top: 24px;
  height: fit-content;
}

.preview-container {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 40px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.glass-preview {
  width: 100%;
  max-width: 350px;
  padding: 2rem;
  transition: all 0.3s ease;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.glass-content {
  text-align: center;
}

.glass-content h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #fff;
}

.glass-content p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.demo-elements {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 1rem;
}

.demo-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.85rem;
}

.demo-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.demo-badge {
  background: rgba(59, 130, 246, 0.8);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  color: white;
  font-weight: 600;
}

.preview-backdrop-controls {
  position: absolute;
  bottom: 20px;
  left: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 12px;
  border-radius: 12px;
}

.preview-backdrop-controls label {
  color: white;
  font-size: 0.8rem;
  margin-bottom: 8px;
  display: block;
}

.bg-patterns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.pattern-btn {
  flex: 1;
  padding: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.pattern-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.pattern-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.controls-section {
  background: #1e293b;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1.1rem;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-item label {
  font-size: 0.85rem;
  color: #94a3b8;
  font-weight: 500;
}

.color-control {
  display: flex;
  gap: 12px;
  align-items: center;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: 2px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  background: #0f172a;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #334155;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
}

.value-display {
  min-width: 45px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-family: monospace;
}

.checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.preset-item {
  background: #0f172a;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid #334155;
  text-align: center;
}

.preset-item:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preset-preview {
  width: 100%;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.preset-name {
  color: #e2e8f0;
  font-size: 0.8rem;
  font-weight: 500;
}

.css-output {
  background: #0f172a;
  border-radius: 12px;
  padding: 16px;
}

.css-code {
  color: #86efac;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  margin: 0 0 12px 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.output-actions {
  display: flex;
  gap: 12px;
}

.copy-css-btn {
  flex: 1;
  padding: 10px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.copy-css-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.export-buttons {
  display: flex;
  gap: 12px;
}

.export-btn {
  flex: 1;
  padding: 10px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.export-btn:hover {
  background: #1e293b;
  border-color: #3b82f6;
  transform: translateY(-1px);
}

.info-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #0f172a;
  border-radius: 12px;
  border-left: 3px solid #3b82f6;
}

.info-icon {
  font-size: 1.2rem;
}

.info-text {
  color: #94a3b8;
  font-size: 0.85rem;
  line-height: 1.4;
}
</style>