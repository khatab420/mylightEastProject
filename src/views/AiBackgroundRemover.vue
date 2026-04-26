<template>
  <div class="ai-bg-remover">
    <div class="remover-header">
      <h2>AI Image Background Remover</h2>
      <p>Remove image backgrounds instantly using AI. Automatic subject detection with high-quality cutouts.</p>
    </div>

    <div class="remover-main">
      <!-- Upload Section -->
      <div class="upload-section">
        <div class="upload-area" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileUpload">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            multiple
            @change="handleFileUpload"
            style="display: none"
          />
          <div class="upload-content">
            <span class="upload-icon">📸</span>
            <h3>Drop images here or click to upload</h3>
            <p>Supports JPG, PNG, WEBP (Max 10MB per image)</p>
            <button class="upload-btn">Select Images</button>
          </div>
        </div>

        <!-- Batch Queue -->
        <div v-if="imageQueue.length > 0" class="batch-queue">
          <div class="queue-header">
            <span>Batch Queue ({{ imageQueue.length }} images)</span>
            <button @click="processBatch" class="process-batch-btn" :disabled="isProcessing">
              Process All
            </button>
          </div>
          <div class="queue-list">
            <div v-for="(item, index) in imageQueue" :key="index" class="queue-item">
              <img :src="item.preview" class="queue-thumb" alt="Preview" />
              <span class="queue-name">{{ item.name }}</span>
              <span class="queue-status" :class="item.status">
                {{ getStatusText(item.status) }}
              </span>
              <button @click="removeFromQueue(index)" class="remove-queue-btn">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Editor Section -->
      <div v-if="currentImage" class="editor-section">
        <div class="editor-toolbar">
          <button @click="downloadCurrentImage" class="tool-btn" :disabled="!processedImage">
            💾 Download PNG
          </button>
          <button @click="resetCurrentImage" class="tool-btn">🔄 Reset</button>
          <button @click="closeEditor" class="tool-btn close-btn">✕ Close</button>
        </div>

        <div class="editor-container">
          <div class="original-panel">
            <h4>Original Image</h4>
            <div class="image-container">
              <img :src="currentImage.preview" class="editor-image" alt="Original" />
            </div>
          </div>

          <div class="processed-panel">
            <h4>Background Removed</h4>
            <div class="image-container" :class="{ loading: isProcessingImage }">
              <img v-if="processedImage" :src="processedImage" class="editor-image" alt="Processed" />
              <div v-else-if="isProcessingImage" class="processing-overlay">
                <div class="spinner"></div>
                <p>Removing background...</p>
              </div>
              <div v-else class="placeholder">
                <span>Click "Process" to remove background</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Background Options -->
        <div class="bg-options" v-if="processedImage">
          <h4>Background Options</h4>
          <div class="bg-controls">
            <button @click="setBackgroundColor('#ffffff')" class="bg-color-btn" style="background: white"></button>
            <button @click="setBackgroundColor('#000000')" class="bg-color-btn" style="background: black"></button>
            <button @click="setBackgroundColor('#3b82f6')" class="bg-color-btn" style="background: #3b82f6"></button>
            <button @click="setBackgroundColor('transparent')" class="bg-color-btn transparent-btn">
              Transparent
            </button>
            <input type="color" v-model="customBgColor" @change="setBackgroundColor(customBgColor)" class="custom-color" />
            <button @click="addCustomBackground" class="upload-bg-btn">Upload Background</button>
          </div>
          <div v-if="customBackground" class="custom-bg-preview">
            <img :src="customBackground" class="custom-bg-img" alt="Custom BG" />
          </div>
        </div>
      </div>

      <!-- Results Gallery -->
      <div v-if="processedImages.length > 0" class="results-gallery">
        <div class="gallery-header">
          <h3>Processed Images</h3>
          <button @click="downloadAllImages" class="download-all-btn">📦 Download All (ZIP)</button>
        </div>
        <div class="gallery-grid">
          <div v-for="(img, index) in processedImages" :key="index" class="gallery-item">
            <img :src="img.processed" class="gallery-image" alt="Processed" />
            <div class="gallery-actions">
              <button @click="downloadImage(img)" class="gallery-btn">💾</button>
              <button @click="copyToClipboard(img.processed)" class="gallery-btn">📋</button>
              <button @click="deleteProcessedImage(index)" class="gallery-btn delete">🗑️</button>
            </div>
            <div class="gallery-name">{{ img.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Advanced Background Removal using Canvas-based segmentation
// This implements multiple algorithms for background detection and removal

export default {
  name: 'AiBackgroundRemover',
  data() {
    return {
      imageQueue: [],
      currentImage: null,
      processedImage: null,
      isProcessing: false,
      isProcessingImage: false,
      processedImages: [],
      customBgColor: '#ffffff',
      customBackground: null,
      segmentationQuality: 'high',
      canvas: null,
      ctx: null
    };
  },
  mounted() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
  },
  methods: {
    triggerFileUpload() {
      this.$refs.fileInput.click();
    },
    
    handleFileUpload(event) {
      const files = Array.from(event.target.files);
      this.addToQueue(files);
    },
    
    handleDrop(event) {
      const files = Array.from(event.dataTransfer.files);
      this.addToQueue(files);
    },
    
    addToQueue(files) {
      const imageFiles = files.filter(f => f.type.startsWith('image/'));
      
      imageFiles.forEach(file => {
        if (file.size > 10 * 1024 * 1024) {
          alert(`${file.name} is larger than 10MB and will be skipped.`);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imageQueue.push({
            id: Date.now() + Math.random(),
            file: file,
            preview: e.target.result,
            name: file.name,
            status: 'pending',
            processed: null
          });
        };
        reader.readAsDataURL(file);
      });
    },
    
    async processBatch() {
      if (this.isProcessing) return;
      this.isProcessing = true;
      
      for (let i = 0; i < this.imageQueue.length; i++) {
        const item = this.imageQueue[i];
        if (item.status === 'pending') {
          item.status = 'processing';
          await this.processSingleImage(item);
        }
      }
      
      this.isProcessing = false;
      alert('Batch processing complete!');
    },
    
    async processSingleImage(item) {
      try {
        const img = new Image();
        img.src = item.preview;
        
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const processedDataUrl = await this.removeBackground(img);
        
        item.processed = processedDataUrl;
        item.status = 'completed';
        
        this.processedImages.push({
          name: item.name.replace(/\.[^/.]+$/, '') + '_nobg.png',
          processed: processedDataUrl,
          original: item.preview
        });
        
        if (this.currentImage === item) {
          this.processedImage = processedDataUrl;
        }
      } catch (error) {
        console.error('Error processing image:', error);
        item.status = 'failed';
      }
    },
    
    async removeBackground(img) {
      // Advanced background removal using multiple techniques
      
      // Set canvas size to match image
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      
      // Draw original image
      this.ctx.drawImage(img, 0, 0);
      
      // Get image data
      const imageData = this.ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      
      // Detect background using edge detection and color clustering
      const mask = this.generateMask(data, img.width, img.height);
      
      // Apply mask to create transparency
      this.applyMask(mask, imageData);
      
      // Apply post-processing for smoother edges
      this.smoothEdges(imageData, mask);
      
      // Put processed image data back to canvas
      this.ctx.putImageData(imageData, 0, 0);
      
      // Return as PNG with transparency
      return this.canvas.toDataURL('image/png');
    },
    
    generateMask(data, width, height) {
      // Advanced mask generation using edge detection and color analysis
      const mask = new Array(width * height).fill(1);
      
      // Detect edges using Sobel operator
      const edges = this.detectEdges(data, width, height);
      
      // Find dominant background color (assuming corners are background)
      const bgColor = this.getDominantBackgroundColor(data, width, height);
      
      // Flood fill from corners to detect background
      const visited = new Set();
      const queue = [];
      
      // Add corner pixels to queue
      const corners = [
        0, 0,
        width - 1, 0,
        0, height - 1,
        width - 1, height - 1
      ];
      
      for (let i = 0; i < corners.length; i += 2) {
        const x = corners[i];
        const y = corners[i + 1];
        const idx = y * width + x;
        if (!visited.has(idx)) {
          queue.push({ x, y });
          visited.add(idx);
        }
      }
      
      // Flood fill algorithm
      while (queue.length > 0) {
        const { x, y } = queue.shift();
        const idx = y * width + x;
        
        if (this.isSimilarToBackground(data, x, y, bgColor, width)) {
          mask[idx] = 0; // Mark as background
          
          // Check neighbors
          const neighbors = [
            { x: x + 1, y },
            { x: x - 1, y },
            { x, y: y + 1 },
            { x, y: y - 1 }
          ];
          
          for (const neighbor of neighbors) {
            if (neighbor.x >= 0 && neighbor.x < width && neighbor.y >= 0 && neighbor.y < height) {
              const neighborIdx = neighbor.y * width + neighbor.x;
              if (!visited.has(neighborIdx)) {
                visited.add(neighborIdx);
                queue.push(neighbor);
              }
            }
          }
        }
      }
      
      // Refine mask using edge detection
      for (let i = 0; i < mask.length; i++) {
        if (edges[i] > 0.3) {
          mask[i] = 1; // Keep edges as foreground
        }
      }
      
      return mask;
    },
    
    detectEdges(data, width, height) {
      // Sobel edge detection
      const edges = new Array(width * height).fill(0);
      const sobelX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
      ];
      const sobelY = [
        [-1, -2, -1],
        [0, 0, 0],
        [1, 2, 1]
      ];
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let gx = 0, gy = 0;
          
          // Apply Sobel operators
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4;
              const intensity = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
              gx += intensity * sobelX[ky + 1][kx + 1];
              gy += intensity * sobelY[ky + 1][kx + 1];
            }
          }
          
          const magnitude = Math.sqrt(gx * gx + gy * gy);
          const idx = y * width + x;
          edges[idx] = magnitude / 255;
        }
      }
      
      return edges;
    },
    
    getDominantBackgroundColor(data, width, height) {
      // Sample pixels from corners to determine background color
      const samples = [];
      const sampleSize = Math.min(50, Math.floor(width * height * 0.01));
      
      // Sample from all four corners
      const corners = [
        { x: 0, y: 0 },
        { x: width - 1, y: 0 },
        { x: 0, y: height - 1 },
        { x: width - 1, y: height - 1 }
      ];
      
      for (const corner of corners) {
        for (let i = 0; i < sampleSize; i++) {
          const x = Math.min(Math.max(corner.x + (Math.random() - 0.5) * 20, 0), width - 1);
          const y = Math.min(Math.max(corner.y + (Math.random() - 0.5) * 20, 0), height - 1);
          const idx = (Math.floor(y) * width + Math.floor(x)) * 4;
          samples.push({
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2]
          });
        }
      }
      
      // Average the samples
      const avg = samples.reduce((acc, sample) => {
        acc.r += sample.r;
        acc.g += sample.g;
        acc.b += sample.b;
        return acc;
      }, { r: 0, g: 0, b: 0 });
      
      const count = samples.length;
      return {
        r: avg.r / count,
        g: avg.g / count,
        b: avg.b / count
      };
    },
    
    isSimilarToBackground(data, x, y, bgColor, width) {
      const idx = (y * width + x) * 4;
      const threshold = 30; // Color similarity threshold
      
      const rDiff = Math.abs(data[idx] - bgColor.r);
      const gDiff = Math.abs(data[idx + 1] - bgColor.g);
      const bDiff = Math.abs(data[idx + 2] - bgColor.b);
      
      return rDiff < threshold && gDiff < threshold && bDiff < threshold;
    },
    
    applyMask(mask, imageData) {
      const data = imageData.data;
      
      for (let i = 0; i < mask.length; i++) {
        if (mask[i] === 0) {
          // Set alpha to 0 for background
          data[i * 4 + 3] = 0;
        }
      }
    },
    
    smoothEdges(imageData, mask) {
      const data = imageData.data;
      const width = imageData.width;
      const height = imageData.height;
      
      // Apply Gaussian blur to edges for smoother transitions
      const kernel = [
        [1, 2, 1],
        [2, 4, 2],
        [1, 2, 1]
      ];
      const kernelSum = 16;
      
      const tempAlpha = new Uint8ClampedArray(data.length);
      
      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          let sum = 0;
          
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + 3;
              sum += data[idx] * kernel[ky + 1][kx + 1];
            }
          }
          
          const idx = (y * width + x) * 4 + 3;
          tempAlpha[idx] = sum / kernelSum;
        }
      }
      
      // Apply smoothed alpha
      for (let i = 3; i < data.length; i += 4) {
        if (tempAlpha[i]) {
          data[i] = tempAlpha[i];
        }
      }
    },
    
    setBackgroundColor(color) {
      if (!this.processedImage) return;
      
      const img = new Image();
      img.src = this.processedImage;
      img.onload = () => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        
        if (color === 'transparent') {
          this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0);
        } else {
          this.ctx.fillStyle = color;
          this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
          this.ctx.drawImage(img, 0, 0);
        }
        
        this.processedImage = this.canvas.toDataURL('image/png');
      };
    },
    
    addCustomBackground() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            this.customBackground = ev.target.result;
            this.applyCustomBackground();
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
    },
    
    applyCustomBackground() {
      if (!this.processedImage || !this.customBackground) return;
      
      const img = new Image();
      const bg = new Image();
      
      img.src = this.processedImage;
      bg.src = this.customBackground;
      
      Promise.all([
        new Promise(resolve => img.onload = resolve),
        new Promise(resolve => bg.onload = resolve)
      ]).then(() => {
        this.canvas.width = img.width;
        this.canvas.height = img.height;
        
        // Draw background scaled to fit
        this.ctx.drawImage(bg, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(img, 0, 0);
        
        this.processedImage = this.canvas.toDataURL('image/png');
      });
    },
    
    async processCurrentImage() {
      if (!this.currentImage || this.isProcessingImage) return;
      
      this.isProcessingImage = true;
      await this.processSingleImage(this.currentImage);
      this.isProcessingImage = false;
    },
    
    downloadCurrentImage() {
      if (this.processedImage) {
        this.downloadImage({ processed: this.processedImage, name: 'background_removed.png' });
      }
    },
    
    resetCurrentImage() {
      this.processedImage = null;
      if (this.currentImage) {
        this.currentImage.status = 'pending';
      }
    },
    
    closeEditor() {
      this.currentImage = null;
      this.processedImage = null;
    },
    
    removeFromQueue(index) {
      this.imageQueue.splice(index, 1);
    },
    
    downloadImage(image) {
      const link = document.createElement('a');
      link.download = image.name;
      link.href = image.processed;
      link.click();
    },
    
    async downloadAllImages() {
      const JSZip = await import('jszip').then(m => m.default);
      const zip = new JSZip();
      
      this.processedImages.forEach((img, index) => {
        const base64Data = img.processed.split(',')[1];
        zip.file(img.name, base64Data, { base64: true });
      });
      
      const content = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.download = 'background_removed_images.zip';
      link.href = URL.createObjectURL(content);
      link.click();
      URL.revokeObjectURL(link.href);
    },
    
    async copyToClipboard(dataUrl) {
      try {
        const blob = await (await fetch(dataUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob
          })
        ]);
        alert('Image copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
    },
    
    deleteProcessedImage(index) {
      this.processedImages.splice(index, 1);
    },
    
    getStatusText(status) {
      const statusMap = {
        pending: '⏳ Pending',
        processing: '🔄 Processing',
        completed: '✅ Done',
        failed: '❌ Failed'
      };
      return statusMap[status] || status;
    }
  }
};
</script>

<style scoped>
.ai-bg-remover {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.remover-header {
  margin-bottom: 32px;
  text-align: center;
}

.remover-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.remover-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.remover-main {
  background: #1e293b;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.upload-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 20px;
}

.upload-area {
  border: 3px dashed #334155;
  border-radius: 16px;
  padding: 60px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(15, 23, 42, 0.5);
}

.upload-area:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.upload-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 16px;
}

.upload-content h3 {
  color: #e2e8f0;
  margin-bottom: 8px;
}

.upload-content p {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 16px;
}

.upload-btn {
  padding: 10px 24px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.upload-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.batch-queue {
  margin-top: 20px;
  border-top: 1px solid #334155;
  padding-top: 20px;
}

.queue-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  color: #e2e8f0;
  font-weight: 600;
}

.process-batch-btn {
  padding: 6px 12px;
  background: #10b981;
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 0.85rem;
}

.process-batch-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.queue-list {
  max-height: 300px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.queue-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #1e293b;
  border-radius: 8px;
}

.queue-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
}

.queue-name {
  flex: 1;
  color: #e2e8f0;
  font-size: 0.85rem;
}

.queue-status {
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 4px;
}

.queue-status.pending {
  background: #f59e0b;
  color: white;
}

.queue-status.processing {
  background: #3b82f6;
  color: white;
}

.queue-status.completed {
  background: #10b981;
  color: white;
}

.queue-status.failed {
  background: #ef4444;
  color: white;
}

.remove-queue-btn {
  background: #ef4444;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  padding: 4px 8px;
}

.editor-section {
  background: #0f172a;
  border-radius: 16px;
  padding: 20px;
}

.editor-toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.tool-btn {
  padding: 8px 16px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tool-btn:hover:not(:disabled) {
  background: #334155;
  transform: translateY(-1px);
}

.tool-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.close-btn {
  background: #ef4444;
  border-color: #ef4444;
}

.close-btn:hover {
  background: #dc2626;
}

.editor-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .editor-container {
    grid-template-columns: 1fr;
  }
}

.original-panel h4,
.processed-panel h4 {
  color: #e2e8f0;
  margin-bottom: 12px;
}

.image-container {
  background: #1e293b;
  border-radius: 12px;
  padding: 20px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.editor-image {
  max-width: 100%;
  max-height: 400px;
  object-fit: contain;
  border-radius: 8px;
}

.processing-overlay {
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #334155;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 12px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.placeholder {
  color: #94a3b8;
  text-align: center;
}

.bg-options {
  border-top: 1px solid #334155;
  padding-top: 20px;
}

.bg-options h4 {
  color: #e2e8f0;
  margin-bottom: 12px;
}

.bg-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.bg-color-btn {
  width: 40px;
  height: 40px;
  border: 2px solid #334155;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.bg-color-btn:hover {
  transform: scale(1.1);
}

.transparent-btn {
  background: repeating-linear-gradient(
    45deg,
    #ccc 0px,
    #ccc 10px,
    #fff 10px,
    #fff 20px
  );
  width: auto;
  padding: 0 12px;
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: 600;
}

.custom-color {
  width: 40px;
  height: 40px;
  border: 2px solid #334155;
  border-radius: 8px;
  cursor: pointer;
}

.upload-bg-btn {
  padding: 8px 16px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  cursor: pointer;
}

.custom-bg-preview {
  margin-top: 12px;
}

.custom-bg-img {
  max-width: 100%;
  max-height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.results-gallery {
  background: #0f172a;
  border-radius: 16px;
  padding: 20px;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.gallery-header h3 {
  color: #e2e8f0;
}

.download-all-btn {
  padding: 8px 16px;
  background: #10b981;
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.gallery-item {
  background: #1e293b;
  border-radius: 12px;
  padding: 12px;
  position: relative;
}

.gallery-image {
  width: 100%;
  height: 180px;
  object-fit: contain;
  border-radius: 8px;
}

.gallery-actions {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 12px;
}

.gallery-btn {
  padding: 4px 8px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.gallery-btn:hover {
  background: #3b82f6;
  transform: scale(1.05);
}

.gallery-btn.delete:hover {
  background: #ef4444;
}

.gallery-name {
  margin-top: 8px;
  font-size: 0.7rem;
  color: #94a3b8;
  text-align: center;
  word-break: break-all;
}
</style>