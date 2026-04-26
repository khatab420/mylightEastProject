<template>
  <div class="box-shadow-generator">
    <div class="generator-header">
      <h2>Box Shadow Generator</h2>
      <p>Generate CSS box-shadow effects visually with live preview.</p>
    </div>

    <div class="generator-main">
      <!-- Live Preview Section -->
      <div class="preview-section">
        <div class="preview-container">
          <div class="preview-box" :style="previewStyle">
            <div class="preview-content">
              <span class="preview-text">Preview</span>
              <span class="preview-dimensions">200x200</span>
            </div>
          </div>
        </div>
        <div class="preview-controls">
          <label>
            <span class="label-icon">📦</span>
            Preview Background
          </label>
          <div class="bg-controls">
            <button
              @click="previewBg = 'white'"
              :class="['bg-btn', { active: previewBg === 'white' }]"
            >
              Light
            </button>
            <button
              @click="previewBg = 'dark'"
              :class="['bg-btn', { active: previewBg === 'dark' }]"
            >
              Dark
            </button>
            <button
              @click="previewBg = 'custom'"
              :class="['bg-btn', { active: previewBg === 'custom' }]"
            >
              <input
                type="color"
                v-model="customBgColor"
                @click.stop
                class="custom-bg-picker"
              />
            </button>
          </div>
        </div>
      </div>

      <div class="controls-section">
        <!-- Shadow Layers -->
        <div class="control-group">
          <label>
            <span class="label-icon">🎨</span>
            Shadow Layers
          </label>
          <div class="layers-container">
            <div
              v-for="(shadow, index) in shadows"
              :key="index"
              class="shadow-layer"
              :class="{ active: activeLayer === index }"
              @click="activeLayer = index"
            >
              <div class="layer-header">
                <span class="layer-title">Shadow {{ index + 1 }}</span>
                <div class="layer-actions">
                  <button
                    @click.stop="duplicateShadow(index)"
                    class="layer-action-btn"
                    title="Duplicate"
                  >
                    📋
                  </button>
                  <button
                    @click.stop="removeShadow(index)"
                    class="layer-action-btn"
                    v-if="shadows.length > 1"
                    title="Remove"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div class="layer-controls" v-show="activeLayer === index">
                <div class="control-row">
                  <div class="control-item">
                    <label>Color</label>
                    <input
                      type="color"
                      v-model="shadow.color"
                      @input="updateShadow"
                      class="color-input"
                    />
                  </div>
                  <div class="control-item">
                    <label>Inset</label>
                    <input
                      type="checkbox"
                      v-model="shadow.inset"
                      @change="updateShadow"
                      class="inset-checkbox"
                    />
                  </div>
                </div>

                <div class="control-row">
                  <div class="control-item">
                    <label>Offset X: {{ shadow.offsetX }}px</label>
                    <input
                      type="range"
                      v-model="shadow.offsetX"
                      min="-100"
                      max="100"
                      step="1"
                      @input="updateShadow"
                      class="slider"
                    />
                  </div>
                  <div class="control-item">
                    <label>Offset Y: {{ shadow.offsetY }}px</label>
                    <input
                      type="range"
                      v-model="shadow.offsetY"
                      min="-100"
                      max="100"
                      step="1"
                      @input="updateShadow"
                      class="slider"
                    />
                  </div>
                </div>

                <div class="control-row">
                  <div class="control-item">
                    <label>Blur: {{ shadow.blur }}px</label>
                    <input
                      type="range"
                      v-model="shadow.blur"
                      min="0"
                      max="100"
                      step="1"
                      @input="updateShadow"
                      class="slider"
                    />
                  </div>
                  <div class="control-item">
                    <label>Spread: {{ shadow.spread }}px</label>
                    <input
                      type="range"
                      v-model="shadow.spread"
                      min="-50"
                      max="50"
                      step="1"
                      @input="updateShadow"
                      class="slider"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <button @click="addShadow" class="add-layer-btn">
            + Add Shadow Layer
          </button>
        </div>

        <!-- Preset Shadows -->
        <div class="control-group">
          <label>
            <span class="label-icon">💎</span>
            Preset Shadows
          </label>
          <div class="preset-grid">
            <div
              v-for="(preset, index) in presetShadows"
              :key="index"
              @click="applyPreset(preset)"
              class="preset-item"
            >
              <div class="preset-preview" :style="{ boxShadow: preset.css }"></div>
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
            <pre class="css-code">{{ boxShadowCSS }}</pre>
            <div class="output-actions">
              <button @click="copyToClipboard" class="copy-css-btn">
                📋 Copy CSS
              </button>
              <button @click="copyToClipboard('single')" class="copy-css-btn" v-if="shadows.length > 1">
                📋 Copy Single Line
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
          <button @click="exportAsCSS" class="export-btn">
            Download CSS File
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BoxShadowGenerator',
  data() {
    return {
      activeLayer: 0,
      previewBg: 'white',
      customBgColor: '#ffffff',
      shadows: [
        {
          offsetX: 10,
          offsetY: 10,
          blur: 20,
          spread: 0,
          color: 'rgba(0, 0, 0, 0.2)',
          inset: false
        }
      ],
      presetShadows: [
        {
          name: 'Soft',
          css: '0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1)'
        },
        {
          name: 'Deep',
          css: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)'
        },
        {
          name: 'Card',
          css: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)'
        },
        {
          name: 'Elevated',
          css: '0 25px 50px -12px rgba(0,0,0,0.25)'
        },
        {
          name: 'Inset',
          css: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)'
        },
        {
          name: 'Glow',
          css: '0 0 15px rgba(59,130,246,0.5)'
        },
        {
          name: 'Neon',
          css: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 20px #00ff00'
        },
        {
          name: '3D',
          css: '0 10px 0 rgba(0,0,0,0.2)'
        },
        {
          name: 'Floating',
          css: '0 20px 30px -10px rgba(0,0,0,0.2), 0 30px 40px -20px rgba(0,0,0,0.15)'
        },
        {
          name: 'Sharp',
          css: '8px 8px 0 rgba(0,0,0,0.1)'
        }
      ]
    };
  },
  computed: {
    boxShadowCSS() {
      const shadowStrings = this.shadows.map(shadow => this.shadowToString(shadow));
      return `box-shadow: ${shadowStrings.join(', ')};`;
    },
    boxShadowSingleLine() {
      const shadowStrings = this.shadows.map(shadow => this.shadowToString(shadow));
      return shadowStrings.join(', ');
    },
    previewStyle() {
      const bgColor = this.previewBg === 'white' ? '#ffffff' : 
                      this.previewBg === 'dark' ? '#1e293b' : 
                      this.customBgColor;
      
      return {
        background: bgColor,
        boxShadow: this.boxShadowSingleLine,
        transition: 'box-shadow 0.2s ease'
      };
    }
  },
  methods: {
    shadowToString(shadow) {
      const inset = shadow.inset ? 'inset ' : '';
      return `${inset}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
    },
    updateShadow() {
      this.$forceUpdate();
    },
    addShadow() {
      this.shadows.push({
        offsetX: 0,
        offsetY: 0,
        blur: 10,
        spread: 0,
        color: 'rgba(0, 0, 0, 0.2)',
        inset: false
      });
      this.activeLayer = this.shadows.length - 1;
    },
    duplicateShadow(index) {
      const shadowToDuplicate = { ...this.shadows[index] };
      this.shadows.splice(index + 1, 0, shadowToDuplicate);
      this.activeLayer = index + 1;
    },
    removeShadow(index) {
      if (this.shadows.length > 1) {
        this.shadows.splice(index, 1);
        if (this.activeLayer >= this.shadows.length) {
          this.activeLayer = this.shadows.length - 1;
        }
      }
    },
    applyPreset(preset) {
      // Parse preset CSS to extract shadows
      const css = preset.css;
      const shadowParts = css.split(',').map(part => part.trim());
      
      this.shadows = shadowParts.map(part => {
        const shadow = {
          offsetX: 0,
          offsetY: 0,
          blur: 0,
          spread: 0,
          color: 'rgba(0,0,0,0.2)',
          inset: false
        };
        
        // Check for inset
        if (part.includes('inset')) {
          shadow.inset = true;
          part = part.replace('inset', '').trim();
        }
        
        // Parse values
        const values = part.match(/([-\d.]+)px/g);
        if (values && values.length >= 2) {
          shadow.offsetX = parseInt(values[0]);
          shadow.offsetY = parseInt(values[1]);
          
          if (values.length >= 3) {
            shadow.blur = parseInt(values[2]);
          }
          
          if (values.length >= 4) {
            shadow.spread = parseInt(values[3]);
          }
        }
        
        // Parse color
        const colorMatch = part.match(/(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|[a-z]+)/);
        if (colorMatch && !colorMatch[0].includes('px')) {
          shadow.color = colorMatch[0];
        }
        
        return shadow;
      });
      
      this.activeLayer = 0;
      this.updateShadow();
    },
    async copyToClipboard(type = 'full') {
      const textToCopy = type === 'full' ? this.boxShadowCSS : this.boxShadowSingleLine;
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        // Show temporary success message
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
    exportAsCSS() {
      const cssContent = `/* Generated by Box Shadow Generator */
.element {
    ${this.boxShadowCSS}
    /* For better browser compatibility */
    -webkit-box-shadow: ${this.boxShadowSingleLine};
    -moz-box-shadow: ${this.boxShadowSingleLine};
}`;
      
      const blob = new Blob([cssContent], { type: 'text/css' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'box-shadow.css';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    getBoxShadowString() {
      return this.boxShadowSingleLine;
    }
  }
};
</script>

<style scoped>
.box-shadow-generator {
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

.preview-container {
  background: #0f172a;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
}

.preview-box {
  width: 250px;
  height: 250px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.preview-box:hover {
  transform: scale(1.02);
}

.preview-content {
  text-align: center;
}

.preview-text {
  display: block;
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

.preview-dimensions {
  display: block;
  font-size: 0.8rem;
  color: #64748b;
  font-family: monospace;
}

.preview-controls {
  background: #1e293b;
  border-radius: 12px;
  padding: 16px;
}

.preview-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.bg-controls {
  display: flex;
  gap: 12px;
}

.bg-btn {
  flex: 1;
  padding: 8px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.bg-btn:hover {
  transform: translateY(-1px);
  border-color: #3b82f6;
}

.bg-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.custom-bg-picker {
  width: 100%;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
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

.layers-container {
  max-height: 500px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 8px;
}

.layers-container::-webkit-scrollbar {
  width: 6px;
}

.layers-container::-webkit-scrollbar-track {
  background: #0f172a;
  border-radius: 3px;
}

.layers-container::-webkit-scrollbar-thumb {
  background: #3b82f6;
  border-radius: 3px;
}

.shadow-layer {
  background: #0f172a;
  border-radius: 12px;
  border: 2px solid #334155;
  transition: all 0.2s ease;
  cursor: pointer;
}

.shadow-layer.active {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.layer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #0f172a;
  border-radius: 10px;
}

.layer-title {
  font-weight: 600;
  color: #e2e8f0;
  font-size: 0.9rem;
}

.layer-actions {
  display: flex;
  gap: 8px;
}

.layer-action-btn {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 6px;
  padding: 4px 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #94a3b8;
}

.layer-action-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.05);
}

.layer-controls {
  padding: 16px;
  border-top: 1px solid #334155;
}

.control-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.control-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.control-item label {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-bottom: 0;
}

.color-input {
  width: 100%;
  height: 40px;
  border: 2px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  background: #0f172a;
}

.inset-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.slider {
  width: 100%;
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

.add-layer-btn {
  padding: 10px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-layer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 8px;
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
  height: 60px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: box-shadow 0.2s ease;
}

.preset-name {
  color: #e2e8f0;
  font-size: 0.75rem;
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
  font-size: 0.85rem;
  margin: 0 0 12px 0;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
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

.export-btn {
  padding: 12px;
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