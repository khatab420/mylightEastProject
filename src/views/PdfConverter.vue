
<template>
  <div class="pdf-converter-page">
    <div class="container">

      <!-- Header -->
      <header class="hero-section">
        <h1>PDF Converter Studio</h1>
        <p>Merge PDFs, convert images, and preview PDF pages</p>
      </header>

      <!-- Tabs -->
      <div class="feature-tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.icon }} {{ tab.name }}
        </button>
      </div>

      <!-- CONVERT -->
      <div v-if="activeTab === 'convert'" class="feature-panel">
        <h2>Images → PDF</h2>

        <div class="upload-area" @click="triggerFileInput('convert')">
          <input ref="convertInput" type="file" multiple accept="image/*"
                 @change="handleFileSelect($event, 'convert')" hidden />
          <p>Click or drag images</p>
        </div>

        <div v-if="convertFiles.length">
          <div v-for="(item, i) in convertFiles" :key="item.id">
            {{ item.file.name }}
            <button @click="removeFile('convert', i)">✕</button>
          </div>

          <button @click="convertToPdf">Convert</button>
        </div>

        <div v-if="convertResult">
          <button @click="downloadFile(convertResult)">Download PDF</button>
        </div>
      </div>

      <!-- MERGE -->
      <div v-if="activeTab === 'merge'" class="feature-panel">
        <h2>Merge PDFs</h2>

        <div class="upload-area" @click="triggerFileInput('merge')">
          <input ref="mergeInput" type="file" multiple accept=".pdf"
                 @change="handleFileSelect($event, 'merge')" hidden />
          <p>Upload PDFs</p>
        </div>

        <div v-if="mergeFiles.length">
          <div v-for="(item, i) in mergeFiles" :key="item.id">
            {{ item.file.name }}
            <button @click="removeFile('merge', i)">✕</button>
          </div>

          <button @click="mergePdfs">Merge</button>
        </div>

        <div v-if="mergeResult">
          <button @click="downloadFile(mergeResult)">Download</button>
        </div>
      </div>

      <!-- EXTRACT -->
      <div v-if="activeTab === 'extract'" class="feature-panel">
        <h2>Preview PDF Pages</h2>

        <div class="upload-area" @click="triggerFileInput('extract')">
          <input ref="extractInput" type="file" multiple accept=".pdf"
                 @change="handleFileSelect($event, 'extract')" hidden />
          <p>Upload PDF</p>
        </div>

        <button v-if="extractFiles.length" @click="extractImages">
          Render Pages
        </button>

        <div v-if="extractedImages.length">
          <div v-for="(img, i) in extractedImages" :key="i">
            <img :src="img.data" style="width:150px" />
          </div>
        </div>
      </div>

      <!-- LOADING -->
      <div v-if="isProcessing">
        <p>{{ processingMessage }}</p>
      </div>

    </div>
  </div>
</template>

<script>
import { PDFDocument } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

export default {
  name: 'PdfConverter',

  data() {
    return {
      activeTab: 'convert',
      isProcessing: false,
      processingMessage: '',

      convertFiles: [],
      convertResult: null,

      mergeFiles: [],
      mergeResult: null,

      extractFiles: [],
      extractedImages: [],

      tabs: [
        { id: 'convert', name: 'Convert', icon: '🖼️' },
        { id: 'merge', name: 'Merge', icon: '🔗' },
        { id: 'extract', name: 'Extract', icon: '📄' }
      ]
    }
  },

  methods: {
    triggerFileInput(tab) {
      this.$refs[tab + 'Input'].click()
    },

    handleFileSelect(e, tab) {
      const files = Array.from(e.target.files)
      this.addFiles(files, tab)
    },

    addFiles(files, tab) {
      const mapped = files.map(f => ({
        file: f,
        id: crypto.randomUUID()
      }))

      if (tab === 'convert') this.convertFiles.push(...mapped)
      if (tab === 'merge') this.mergeFiles.push(...mapped)
      if (tab === 'extract') this.extractFiles.push(...mapped)
    },

    removeFile(tab, i) {
      if (tab === 'convert') this.convertFiles.splice(i, 1)
      if (tab === 'merge') this.mergeFiles.splice(i, 1)
      if (tab === 'extract') this.extractFiles.splice(i, 1)
    },

    async convertToPdf() {
      this.isProcessing = true
      this.processingMessage = 'Creating PDF...'

      const pdf = await PDFDocument.create()

      for (const item of this.convertFiles) {
        const bytes = await item.file.arrayBuffer()
        let img

        if (item.file.type.includes('png')) {
          img = await pdf.embedPng(bytes)
        } else {
          img = await pdf.embedJpg(bytes)
        }

        const page = pdf.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }

      const bytes = await pdf.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })

      this.convertResult = {
        name: 'images.pdf',
        blob,
        url: URL.createObjectURL(blob)
      }

      this.isProcessing = false
    },

    async mergePdfs() {
      this.isProcessing = true
      this.processingMessage = 'Merging PDFs...'

      const merged = await PDFDocument.create()

      for (const item of this.mergeFiles) {
        const bytes = await item.file.arrayBuffer()
        const pdf = await PDFDocument.load(bytes)

        const pages = await merged.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => merged.addPage(p))
      }

      const bytes = await merged.save()
      const blob = new Blob([bytes], { type: 'application/pdf' })

      this.mergeResult = {
        name: 'merged.pdf',
        blob,
        url: URL.createObjectURL(blob)
      }

      this.isProcessing = false
    },

    async extractImages() {
      this.isProcessing = true
      this.processingMessage = 'Rendering pages...'

      this.extractedImages = []

      for (const item of this.extractFiles) {
        const pdf = await pdfjsLib.getDocument(await item.file.arrayBuffer()).promise

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1 })

          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')

          canvas.width = viewport.width
          canvas.height = viewport.height

          await page.render({ canvasContext: ctx, viewport }).promise

          this.extractedImages.push({
            data: canvas.toDataURL()
          })
        }
      }

      this.isProcessing = false
    },

    downloadFile(file) {
      const url = file.url || URL.createObjectURL(file.blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    }
  }
}
</script>



<style scoped>
.pdf-converter-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.hero-section h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
}

.hero-section p {
  font-size: 1.1rem;
  opacity: 0.9;
}

.feature-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-bottom: 30px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 50px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.tab-btn.active {
  background: white;
  color: #667eea;
  font-weight: 600;
}

.tab-icon {
  font-size: 1.2rem;
}

.feature-panel {
  background: white;
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.panel-header {
  text-align: center;
  margin-bottom: 30px;
}

.panel-header h2 {
  color: #333;
  margin-bottom: 8px;
}

.panel-header p {
  color: #666;
}

.upload-area {
  border: 2px dashed #cbd5e1;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8fafc;
}

.upload-area.drag-over {
  border-color: #667eea;
  background: #eef2ff;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 15px;
}

.upload-content h3 {
  margin-bottom: 10px;
  color: #333;
}

.upload-content p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e2e8f0;
  color: #475569;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #cbd5e1;
}

.file-list {
  margin-top: 30px;
}

.file-list h3 {
  margin-bottom: 15px;
  color: #333;
}

.sort-hint {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 15px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  margin-bottom: 10px;
}

.drag-handle {
  cursor: grab;
  font-size: 1.5rem;
  color: #94a3b8;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}

.file-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  font-size: 1.5rem;
}

.file-details {
  display: flex;
  flex-direction: column;
}

.file-name {
  font-weight: 500;
  color: #333;
}

.file-size {
  font-size: 0.75rem;
  color: #888;
}

.btn-remove {
  background: #fee2e2;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  color: #ef4444;
  font-size: 1rem;
  transition: all 0.2s;
}

.btn-remove:hover {
  background: #fecaca;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 20px;
}

.result-area {
  margin-top: 30px;
  padding: 20px;
  background: #f0fdf4;
  border-radius: 16px;
  border: 1px solid #bbf7d0;
}

.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-weight: 600;
  color: #166534;
}

.result-file {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 8px;
}

.btn-download {
  background: #22c55e;
  color: white;
  border: none;
  padding: 6px 15px;
  border-radius: 20px;
  cursor: pointer;
}

.btn-download-sm {
  background: #22c55e;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  cursor: pointer;
}

.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.image-card {
  text-align: center;
  background: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.image-card img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.compress-options {
  margin-bottom: 20px;
  padding: 15px;
  background: #f1f5f9;
  border-radius: 12px;
}

.compress-options label {
  font-weight: 500;
  margin-right: 15px;
}

.compress-options select {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.compression-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.size-reduction {
  font-size: 0.8rem;
  color: #16a34a;
}

.processing-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.processing-content {
  background: white;
  padding: 40px;
  border-radius: 24px;
  text-align: center;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.drag-list {
  min-height: 100px;
}

@media (max-width: 768px) {
  .feature-panel {
    padding: 20px;
  }
  
  .upload-area {
    padding: 20px;
  }
  
  .tab-btn span:last-child {
    display: none;
  }
  
  .tab-btn {
    padding: 12px;
  }
  
  .tab-icon {
    font-size: 1.5rem;
  }
}
</style>