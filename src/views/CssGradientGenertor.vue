<template>
  <div class="gradient-generator">
    <div class="generator-header">
      <h2>CSS Gradient Generator</h2>
      <p>Create beautiful CSS gradients with live preview and export code.</p>
    </div>

    <div class="generator-main">
      <!-- Live Preview Section -->
      <div class="preview-section">
        <div class="preview-box" :style="gradientStyle">
          <div class="preview-overlay">
            <span class="gradient-code">{{ gradientCSS }}</span>
          </div>
        </div>
      </div>

      <div class="controls-section">
        <!-- Gradient Type Selection -->
        <div class="control-group">
          <label>
            <span class="label-icon">🎨</span>
            Gradient Type
          </label>
          <div class="type-buttons">
            <button
              v-for="type in gradientTypes"
              :key="type.value"
              @click="gradientType = type.value"
              :class="['type-btn', { active: gradientType === type.value }]"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <!-- Angle/Direction Control -->
        <div class="control-group" v-if="gradientType === 'linear'">
          <label>
            <span class="label-icon">↗️</span>
            Angle: {{ angle }}°
          </label>
          <div class="angle-control">
            <input
              type="range"
              v-model="angle"
              min="0"
              max="360"
              step="1"
              class="angle-slider"
            />
            <div class="angle-presets">
              <button
                v-for="preset in anglePresets"
                :key="preset.value"
                @click="angle = preset.value"
                class="angle-preset-btn"
              >
                {{ preset.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Radial Position Control -->
        <div class="control-group" v-if="gradientType === 'radial'">
          <label>
            <span class="label-icon">📍</span>
            Position
          </label>
          <div class="radial-position">
            <select v-model="radialPosition" class="position-select">
              <option value="center">Center</option>
              <option value="top">Top</option>
              <option value="bottom">Bottom</option>
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="top left">Top Left</option>
              <option value="top right">Top Right</option>
              <option value="bottom left">Bottom Left</option>
              <option value="bottom right">Bottom Right</option>
            </select>
          </div>
        </div>

        <!-- Color Stops -->
        <div class="control-group">
          <label>
            <span class="label-icon">🎨</span>
            Color Stops
          </label>
          <div class="color-stops">
            <div
              v-for="(stop, index) in colorStops"
              :key="index"
              class="color-stop-item"
            >
              <input
                type="color"
                v-model="stop.color"
                @input="updateGradient"
                class="color-picker"
              />
              <input
                type="range"
                v-model="stop.position"
                min="0"
                max="100"
                step="1"
                class="position-slider"
              />
              <span class="position-value">{{ stop.position }}%</span>
              <button
                @click="removeColorStop(index)"
                class="remove-stop-btn"
                v-if="colorStops.length > 2"
              >
                ✕
              </button>
            </div>
          </div>
          <button @click="addColorStop" class="add-stop-btn">
            + Add Color Stop
          </button>
        </div>

        <!-- Preset Gradients -->
        <div class="control-group">
          <label>
            <span class="label-icon">💎</span>
            Preset Gradients
          </label>
          <div class="preset-grid">
            <div
              v-for="(preset, index) in presetGradients"
              :key="index"
              @click="applyPreset(preset)"
              class="preset-item"
              :style="{ background: preset.css }"
            >
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
            <pre class="css-code">{{ gradientCSS }}</pre>
            <button @click="copyToClipboard" class="copy-css-btn">
              📋 Copy CSS
            </button>
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
            <button @click="exportAsImage" class="export-btn">
              Download as Image
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from 'html2canvas';

export default {
  name: 'CssGradientGenerator',
  data() {
    return {
      gradientType: 'linear',
      gradientTypes: [
        { value: 'linear', name: 'Linear' },
        { value: 'radial', name: 'Radial' }
      ],
      angle: 135,
      anglePresets: [
        { name: '→', value: 90 },
        { name: '←', value: 270 },
        { name: '↑', value: 0 },
        { name: '↓', value: 180 },
        { name: '↗', value: 45 },
        { name: '↘', value: 135 },
        { name: '↙', value: 225 },
        { name: '↖', value: 315 }
      ],
      radialPosition: 'center',
      colorStops: [
        { color: '#667eea', position: 0 },
        { color: '#764ba2', position: 100 }
      ],
      presetGradients: [
        {
          name: 'Sunset',
          css: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)'
        },
        {
          name: 'Ocean',
          css: 'linear-gradient(135deg, #00b4db 0%, #0083b0 100%)'
        },
        {
          name: 'Forest',
          css: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
        },
        {
          name: 'Purple Dream',
          css: 'linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%)'
        },
        {
          name: 'Peach',
          css: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
        },
        {
          name: 'Midnight',
          css: 'linear-gradient(135deg, #232526 0%, #414345 100%)'
        },
        {
          name: 'Aurora',
          css: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)'
        },
        {
          name: 'Candy',
          css: 'linear-gradient(135deg, #ff0844 0%, #ffb199 100%)'
        },
        {
          name: 'Radial Sunset',
          css: 'radial-gradient(circle at center, #f12711 0%, #f5af19 100%)'
        },
        {
          name: 'Radial Ocean',
          css: 'radial-gradient(circle at center, #00b4db 0%, #0083b0 100%)'
        }
      ]
    };
  },
  computed: {
    gradientStyle() {
      if (this.gradientType === 'linear') {
        return {
          background: `linear-gradient(${this.angle}deg, ${this.getColorStopsString()})`
        };
      } else {
        const shape = 'circle';
        return {
          background: `radial-gradient(${shape} at ${this.radialPosition}, ${this.getColorStopsString()})`
        };
      }
    },
    gradientCSS() {
      if (this.gradientType === 'linear') {
        return `background: linear-gradient(${this.angle}deg, ${this.getColorStopsString()});`;
      } else {
        return `background: radial-gradient(circle at ${this.radialPosition}, ${this.getColorStopsString()});`;
      }
    }
  },
  watch: {
    colorStops: {
      deep: true,
      handler() {
        this.updateGradient();
      }
    },
    angle() {
      this.updateGradient();
    },
    radialPosition() {
      this.updateGradient();
    },
    gradientType() {
      this.updateGradient();
    }
  },
  mounted() {
    this.updateGradient();
  },
  methods: {
    getColorStopsString() {
      return this.colorStops
        .map(stop => `${stop.color} ${stop.position}%`)
        .join(', ');
    },
    updateGradient() {
      // Force reactivity update
      this.$forceUpdate();
    },
    addColorStop() {
      if (this.colorStops.length < 8) {
        // Calculate a middle position for the new stop
        const positions = this.colorStops.map(s => s.position);
        const newPosition = positions.reduce((a, b) => a + b, 0) / positions.length;
        this.colorStops.push({
          color: '#ff6b6b',
          position: Math.round(newPosition)
        });
        // Sort by position
        this.colorStops.sort((a, b) => a.position - b.position);
      }
    },
    removeColorStop(index) {
      if (this.colorStops.length > 2) {
        this.colorStops.splice(index, 1);
      }
    },
    applyPreset(preset) {
      // Parse preset CSS to extract gradient parameters
      const css = preset.css;
      if (css.includes('linear-gradient')) {
        this.gradientType = 'linear';
        const match = css.match(/linear-gradient\(([^,]+),/);
        if (match) {
          const angleStr = match[1].trim();
          if (angleStr.includes('deg')) {
            this.angle = parseInt(angleStr);
          } else {
            // Convert named directions to angles
            const directionMap = {
              'to right': 90,
              'to left': 270,
              'to top': 0,
              'to bottom': 180,
              'to top right': 45,
              'to bottom right': 135,
              'to bottom left': 225,
              'to top left': 315
            };
            this.angle = directionMap[angleStr] || 135;
          }
        }
        
        // Extract color stops
        const colorsMatch = css.match(/linear-gradient\([^,]+,\s*(.+)\)/);
        if (colorsMatch) {
          const colorsStr = colorsMatch[1];
          const stops = colorsStr.split(',').map(stop => {
            const parts = stop.trim().split(' ');
            return {
              color: parts[0],
              position: parts[1] ? parseInt(parts[1]) : 0
            };
          });
          
          // Normalize positions
          if (stops.length === 2) {
            stops[0].position = 0;
            stops[1].position = 100;
          }
          
          this.colorStops = stops;
        }
      } else if (css.includes('radial-gradient')) {
        this.gradientType = 'radial';
        // Extract position
        const positionMatch = css.match(/at\s+([^,]+)/);
        if (positionMatch) {
          this.radialPosition = positionMatch[1].trim();
        }
        
        // Extract color stops
        const colorsMatch = css.match(/radial-gradient\([^,]+,\s*(.+)\)/);
        if (colorsMatch) {
          const colorsStr = colorsMatch[1];
          const stops = colorsStr.split(',').map(stop => {
            const parts = stop.trim().split(' ');
            return {
              color: parts[0],
              position: parts[1] ? parseInt(parts[1]) : 0
            };
          });
          
          if (stops.length === 2) {
            stops[0].position = 0;
            stops[1].position = 100;
          }
          
          this.colorStops = stops;
        }
      }
      
      this.updateGradient();
    },
    async copyToClipboard() {
      try {
        await navigator.clipboard.writeText(this.gradientCSS);
        // Show temporary success message
        const btn = document.querySelector('.copy-css-btn');
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
    },
    exportAsCSS() {
      const cssContent = `/* Generated by CSS Gradient Generator */
.gradient {
    ${this.gradientCSS}
    /* Add vendor prefixes for better compatibility */
    ${this.getVendorPrefixes()}
}`;
      
      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'gradient.css';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    getVendorPrefixes() {
      if (this.gradientType === 'linear') {
        return `background: -webkit-linear-gradient(${this.angle}deg, ${this.getColorStopsString()});
    background: -moz-linear-gradient(${this.angle}deg, ${this.getColorStopsString()});
    background: -o-linear-gradient(${this.angle}deg, ${this.getColorStopsString()});`;
      } else {
        return `background: -webkit-radial-gradient(circle at ${this.radialPosition}, ${this.getColorStopsString()});
    background: -moz-radial-gradient(circle at ${this.radialPosition}, ${this.getColorStopsString()});
    background: -o-radial-gradient(circle at ${this.radialPosition}, ${this.getColorStopsString()});`;
      }
    },
    async exportAsImage() {
      const previewBox = document.querySelector('.preview-box');
      if (!previewBox) return;
      
      try {
        // Temporarily remove overlay for cleaner screenshot
        const overlay = previewBox.querySelector('.preview-overlay');
        if (overlay) {
          overlay.style.opacity = '0';
        }
        
        const canvas = await html2canvas(previewBox, {
          scale: 2,
          backgroundColor: null
        });
        
        // Restore overlay
        if (overlay) {
          overlay.style.opacity = '1';
        }
        
        const link = document.createElement('a');
        link.download = 'gradient.png';
        link.href = canvas.toDataURL();
        link.click();
      } catch (error) {
        console.error('Error generating image:', error);
        alert('Failed to generate image. Please make sure html2canvas is installed.');
      }
    }
  }
};
</script>

<style scoped>
.gradient-generator {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
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

.preview-box {
  width: 100%;
  height: 400px;
  border-radius: 20px;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.preview-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 16px;
  text-align: center;
}

.gradient-code {
  color: #e2e8f0;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  word-break: break-all;
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
  gap: 12px;
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

.type-buttons {
  display: flex;
  gap: 12px;
}

.type-btn {
  flex: 1;
  padding: 10px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 10px;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.type-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border-color: #3b82f6;
  color: white;
}

.angle-control {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.angle-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #334155;
  outline: none;
  -webkit-appearance: none;
}

.angle-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 2px solid white;
}

.angle-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.angle-preset-btn {
  padding: 6px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.angle-preset-btn:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

.radial-position {
  width: 100%;
}

.position-select {
  width: 100%;
  padding: 10px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 10px;
  color: #e2e8f0;
  cursor: pointer;
}

.color-stops {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.color-stops::-webkit-scrollbar {
  width: 6px;
}

.color-stops::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 3px;
}

.color-stops::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}

.color-stop-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #0f172a;
  padding: 12px;
  border-radius: 10px;
}

.color-picker {
  width: 50px;
  height: 40px;
  border: 2px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  background: transparent;
}

.position-slider {
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: #334155;
  outline: none;
  -webkit-appearance: none;
}

.position-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

.position-value {
  min-width: 45px;
  color: #94a3b8;
  font-size: 0.85rem;
  font-family: monospace;
}

.remove-stop-btn {
  width: 30px;
  height: 30px;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.remove-stop-btn:hover {
  background: #dc2626;
  transform: scale(1.05);
}

.add-stop-btn {
  padding: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-stop-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
}

.preset-item {
  height: 80px;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.preset-item:hover {
  transform: scale(1.02);
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.preset-name {
  position: absolute;
  bottom: 8px;
  left: 8px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  color: white;
  font-weight: 500;
}

.css-output {
  background: #0f172a;
  border-radius: 12px;
  padding: 16px;
  position: relative;
}

.css-code {
  color: #86efac;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  margin: 0 0 12px 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.copy-css-btn {
  width: 100%;
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
</style>