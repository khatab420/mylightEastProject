<template>
  <div class="qr-code-generator">
    <div class="container">
      <!-- Header Section -->
      <div class="header">
        <div class="header-badge">
          <svg class="badge-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M7 7h3v3H7zM14 7h3v3h-3zM7 14h3v3H7zM17 14h3v3h-3z" />
          </svg>
          <span>QR Code Studio</span>
        </div>
        <h1>QR Code Generator</h1>
        <p class="subtitle">
          Generate custom QR codes for URLs, text, Wi-Fi, vCards, and more with beautiful designs
        </p>
      </div>

      <div class="two-column-grid">
        <!-- Left Panel - Configuration -->
        <div class="card config-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <h2>Configuration</h2>
          </div>

          <div class="card-body">
            <!-- Content Type Selector -->
            <div class="form-group">
              <label class="form-label">Content Type</label>
              <div class="button-group">
                <button
                  @click="contentType = 'url'"
                  :class="['type-btn', { active: contentType === 'url' }]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </svg>
                  URL / Text
                </button>
                <button
                  @click="contentType = 'wifi'"
                  :class="['type-btn', { active: contentType === 'wifi' }]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M5 13l4 4L19 7" />
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                  Wi-Fi
                </button>
                <button
                  @click="contentType = 'vcard'"
                  :class="['type-btn', { active: contentType === 'vcard' }]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  vCard
                </button>
              </div>
            </div>

            <!-- URL / Text Input -->
            <div v-if="contentType === 'url'" class="form-group">
              <label class="form-label">URL or Text</label>
              <input
                v-model="content"
                type="text"
                placeholder="https://example.com or any text..."
                class="form-input"
              />
            </div>

            <!-- Wi-Fi Configuration -->
            <div v-if="contentType === 'wifi'" class="form-group">
              <div class="form-group">
                <label class="form-label">SSID (Network Name)</label>
                <input v-model="wifiSsid" type="text" placeholder="MyWiFi" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Password</label>
                <input v-model="wifiPassword" type="text" placeholder="••••••••" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Encryption</label>
                <select v-model="wifiEncryption" class="form-select">
                  <option value="WPA">WPA/WPA2 (Recommended)</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open Network)</option>
                </select>
              </div>
              <div class="info-note">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="12" x2="12" y2="16" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>Works with iOS and Android for automatic Wi-Fi connection</span>
              </div>
            </div>

            <!-- vCard Configuration -->
            <div v-if="contentType === 'vcard'" class="form-group">
              <div class="two-col-grid-small">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input v-model="vcardFirstName" type="text" class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input v-model="vcardLastName" type="text" class="form-input" />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Phone</label>
                <input v-model="vcardPhone" type="tel" placeholder="+1 234 567 8900" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="vcardEmail" type="email" placeholder="contact@example.com" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Organization</label>
                <input v-model="vcardOrg" type="text" placeholder="Company Name" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Website</label>
                <input v-model="vcardUrl" type="url" placeholder="https://example.com" class="form-input" />
              </div>
            </div>

            <!-- Design Section -->
            <div class="section-divider">
              <span>Design Settings</span>
            </div>

            <div class="form-group">
              <label class="form-label">Custom Colors</label>
              <div class="color-picker-group">
                <div class="color-item">
                  <div class="color-label">Foreground</div>
                  <input type="color" v-model="foregroundColor" class="color-input" />
                </div>
                <div class="color-item">
                  <div class="color-label">Background</div>
                  <input type="color" v-model="backgroundColor" class="color-input" />
                </div>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Logo / Image (optional)</label>
              <div class="upload-area" @click="$refs.logoInput.click()">
                <input
                  ref="logoInput"
                  type="file"
                  accept="image/*"
                  @change="handleLogoUpload"
                  style="display: none"
                />
                <div v-if="!logoUrl" class="upload-placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                  <span>Click to upload logo</span>
                  <small>PNG, JPG, SVG up to 2MB</small>
                </div>
                <div v-if="logoUrl" class="upload-preview">
                  <img :src="logoUrl" class="preview-image" />
                  <button @click.stop="removeLogo" class="remove-logo">✕</button>
                </div>
              </div>
            </div>

            <div class="two-col-grid-small">
              <div class="form-group">
                <label class="form-label">Size (px)</label>
                <select v-model="size" class="form-select">
                  <option :value="256">256 x 256 (Small)</option>
                  <option :value="512">512 x 512 (Medium)</option>
                  <option :value="1024">1024 x 1024 (Large)</option>
                  <option :value="2048">2048 x 2048 (Extra Large)</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Error Correction</label>
                <select v-model="errorCorrection" class="form-select">
                  <option value="L">Low (7%) - Best for logos</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%) - Most robust</option>
                </select>
              </div>
            </div>

            <button
              @click="generateQRCode"
              :disabled="!isContentValid"
              class="btn-generate"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3" />
                <polyline points="12 2 12 16 16 12" />
                <line x1="8" y1="16" x2="8.01" y2="16" />
              </svg>
              Generate QR Code
            </button>
          </div>
        </div>

        <!-- Right Panel - Preview & Download -->
        <div class="card preview-panel">
          <div class="card-header">
            <svg class="card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <h2>Preview & Download</h2>
          </div>

          <div class="card-body">
            <!-- QR Code Display -->
            <div class="qr-container">
              <div v-if="qrCodeUrl" class="qr-wrapper">
                <img :src="qrCodeUrl" :width="Math.min(size, 300)" :height="Math.min(size, 300)" class="qr-image" />
                <div class="qr-overlay">
                  <span>✓ Ready to download</span>
                </div>
              </div>
              <div v-else class="qr-placeholder">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="3" y1="15" x2="21" y2="15" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                  <line x1="15" y1="21" x2="15" y2="9" />
                </svg>
                <p>Configure your QR code</p>
                <small>Adjust settings and click generate</small>
              </div>
            </div>

            <!-- Download Buttons -->
            <div class="download-buttons">
              <button @click="downloadSVG" :disabled="!qrCodeUrl" class="btn-download svg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download SVG
              </button>
              <button @click="downloadPNG" :disabled="!qrCodeUrl" class="btn-download png">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download PNG
              </button>
            </div>

            <!-- Bulk Generation -->
            <div class="bulk-section">
              <div class="section-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                </svg>
                <h3>Bulk QR Generation</h3>
              </div>
              <textarea
                v-model="bulkUrls"
                rows="3"
                placeholder="Enter one URL per line:&#10;https://example1.com&#10;https://example2.com&#10;https://example3.com"
                class="bulk-textarea"
              ></textarea>
              <button
                @click="generateBulkQRCodes"
                :disabled="!bulkUrls.trim()"
                class="btn-bulk"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Generate {{ bulkUrlCount }} QR Codes (ZIP)
              </button>
            </div>

            <!-- Trackable Info -->
            <div class="info-card">
              <div class="info-header">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <strong>Trackable QR Codes</strong>
              </div>
              <p>Use URL shorteners (Bitly, Rebrandly) with UTM parameters to track scans. Each scan will be recorded in your analytics platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode'

export default {
  name: 'QRCodeGenerator',
  data() {
    return {
      contentType: 'url',
      content: '',
      wifiSsid: '',
      wifiPassword: '',
      wifiEncryption: 'WPA',
      vcardFirstName: '',
      vcardLastName: '',
      vcardPhone: '',
      vcardEmail: '',
      vcardOrg: '',
      vcardUrl: '',
      foregroundColor: '#000000',
      backgroundColor: '#FFFFFF',
      size: 512,
      errorCorrection: 'H',
      logoFile: null,
      logoUrl: null,
      qrCodeUrl: null,
      qrCanvas: null,
      bulkUrls: '',
    }
  },
  computed: {
    isContentValid() {
      if (this.contentType === 'url') {
        return this.content.trim().length > 0
      } else if (this.contentType === 'wifi') {
        return this.wifiSsid.trim().length > 0
      } else if (this.contentType === 'vcard') {
        return (
          this.vcardFirstName.trim() ||
          this.vcardLastName.trim() ||
          this.vcardPhone.trim() ||
          this.vcardEmail.trim()
        )
      }
      return false
    },
    formattedContent() {
      if (this.contentType === 'url') {
        return this.content
      } else if (this.contentType === 'wifi') {
        let authType = this.wifiEncryption
        if (authType === 'nopass') authType = 'nopass'
        return `WIFI:T:${authType};S:${this.wifiSsid};P:${this.wifiPassword};;`
      } else if (this.contentType === 'vcard') {
        let vcard = 'BEGIN:VCARD\nVERSION:3.0\n'
        if (this.vcardFirstName || this.vcardLastName) {
          vcard += `N:${this.vcardLastName};${this.vcardFirstName};;;\n`
          vcard += `FN:${this.vcardFirstName} ${this.vcardLastName}\n`
        }
        if (this.vcardPhone) vcard += `TEL:${this.vcardPhone}\n`
        if (this.vcardEmail) vcard += `EMAIL:${this.vcardEmail}\n`
        if (this.vcardOrg) vcard += `ORG:${this.vcardOrg}\n`
        if (this.vcardUrl) vcard += `URL:${this.vcardUrl}\n`
        vcard += 'END:VCARD'
        return vcard
      }
      return ''
    },
    bulkUrlList() {
      return this.bulkUrls.split('\n').filter(line => line.trim().length > 0)
    },
    bulkUrlCount() {
      return this.bulkUrlList.length
    },
  },
  methods: {
    async generateQRCode() {
      if (!this.isContentValid) return

      try {
        const canvas = document.createElement('canvas')
        canvas.width = this.size
        canvas.height = this.size

        await QRCode.toCanvas(canvas, this.formattedContent, {
          width: this.size,
          margin: 2,
          color: {
            dark: this.foregroundColor,
            light: this.backgroundColor,
          },
          errorCorrectionLevel: this.errorCorrection,
        })

        if (this.logoFile) {
          await this.applyLogoToCanvas(canvas)
        }

        this.qrCanvas = canvas
        this.qrCodeUrl = canvas.toDataURL('image/png')
      } catch (error) {
        console.error('QR Code generation failed:', error)
        alert('Failed to generate QR code. Please check your input.')
      }
    },

    async applyLogoToCanvas(canvas) {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const ctx = canvas.getContext('2d')
          const logoSize = canvas.width * 0.2
          const x = (canvas.width - logoSize) / 2
          const y = (canvas.height - logoSize) / 2

          ctx.fillStyle = '#FFFFFF'
          ctx.fillRect(x - 2, y - 2, logoSize + 4, logoSize + 4)
          ctx.drawImage(img, x, y, logoSize, logoSize)
          resolve()
        }
        img.onerror = reject
        img.src = this.logoUrl
      })
    },

    handleLogoUpload(event) {
      const file = event.target.files[0]
      if (file) {
        this.logoFile = file
        const reader = new FileReader()
        reader.onload = (e) => {
          this.logoUrl = e.target.result
          if (this.qrCanvas) {
            this.generateQRCode()
          }
        }
        reader.readAsDataURL(file)
      }
    },

    removeLogo() {
      this.logoFile = null
      this.logoUrl = null
      if (this.qrCanvas) {
        this.generateQRCode()
      }
    },

    downloadPNG() {
      if (!this.qrCodeUrl) return
      const link = document.createElement('a')
      link.download = `qrcode-${Date.now()}.png`
      link.href = this.qrCodeUrl
      link.click()
    },

    downloadSVG() {
      if (!this.formattedContent) return

      QRCode.toString(this.formattedContent, {
        type: 'svg',
        width: this.size,
        margin: 2,
        color: {
          dark: this.foregroundColor,
          light: this.backgroundColor,
        },
        errorCorrectionLevel: this.errorCorrection,
      })
        .then(svgString => {
          if (this.logoFile) {
            this.downloadPNG()
            alert('For logos, PNG format is recommended. Downloading PNG instead.')
            return
          }

          const blob = new Blob([svgString], { type: 'image/svg+xml' })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.download = `qrcode-${Date.now()}.svg`
          link.href = url
          link.click()
          URL.revokeObjectURL(url)
        })
        .catch(err => {
          console.error('SVG generation failed:', err)
          alert('SVG generation failed. Downloading PNG instead.')
          this.downloadPNG()
        })
    },

    async generateBulkQRCodes() {
      if (this.bulkUrlList.length === 0) return

      const JSZip = (await import('jszip')).default
      const zip = new JSZip()

      let successCount = 0
      let failCount = 0

      for (let i = 0; i < this.bulkUrlList.length; i++) {
        const url = this.bulkUrlList[i].trim()
        if (!url) continue

        try {
          const canvas = document.createElement('canvas')
          canvas.width = 512
          canvas.height = 512

          await QRCode.toCanvas(canvas, url, {
            width: 512,
            margin: 2,
            color: {
              dark: this.foregroundColor,
              light: this.backgroundColor,
            },
            errorCorrectionLevel: this.errorCorrection,
          })

          const dataUrl = canvas.toDataURL('image/png')
          const base64Data = dataUrl.split(',')[1]
          const fileName = `qrcode_${i + 1}_${url.replace(/[^a-z0-9]/gi, '_').substring(0, 30)}.png`

          zip.file(fileName, base64Data, { base64: true })
          successCount++
        } catch (error) {
          console.error(`Failed to generate QR for ${url}:`, error)
          failCount++
        }
      }

      if (successCount > 0) {
        const content = await zip.generateAsync({ type: 'blob' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(content)
        link.download = `qrcodes_bulk_${Date.now()}.zip`
        link.click()
        URL.revokeObjectURL(link.href)
      }

      alert(`Generated ${successCount} QR codes. Failed: ${failCount}`)
    },
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.qr-code-generator {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 24px;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Header Styles */
.header {
  text-align: center;
  margin-bottom: 48px;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 100px;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 20px;
}

.badge-icon {
  width: 18px;
  height: 18px;
}

.header h1 {
  font-size: 3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
}

/* Grid Layout */
.two-column-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
}

@media (max-width: 968px) {
  .two-column-grid {
    grid-template-columns: 1fr;
  }
}

/* Card Styles */
.card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 72px rgba(0, 0, 0, 0.2);
}

.card-header {
  padding: 24px 28px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.card-icon {
  width: 24px;
  height: 24px;
  color: #667eea;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.card-body {
  padding: 28px;
}

/* Form Elements */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-input,
.form-select {
  width: 100%;
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-input:hover,
.form-select:hover {
  border-color: #9ca3af;
}

/* Button Group */
.button-group {
  display: flex;
  gap: 8px;
}

.type-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1.5px solid #e5e7eb;
  background: white;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.type-btn svg {
  transition: stroke 0.2s ease;
}

.type-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.type-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.type-btn.active svg {
  stroke: white;
}

/* Color Picker */
.color-picker-group {
  display: flex;
  gap: 16px;
}

.color-item {
  flex: 1;
}

.color-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 6px;
}

.color-input {
  width: 100%;
  height: 48px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  padding: 4px;
}

/* Upload Area */
.upload-area {
  border: 2px dashed #e5e7eb;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f8f9ff;
}

.upload-placeholder {
  padding: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.upload-placeholder svg {
  color: #9ca3af;
}

.upload-placeholder span {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.upload-placeholder small {
  font-size: 0.75rem;
  color: #9ca3af;
}

.upload-preview {
  position: relative;
  padding: 16px;
  text-align: center;
  background: #f9fafb;
}

.preview-image {
  max-width: 80px;
  max-height: 80px;
  object-fit: contain;
}

.remove-logo {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.1s ease;
}

.remove-logo:hover {
  transform: scale(1.1);
}

/* Section Divider */
.section-divider {
  margin: 28px 0 20px;
  text-align: center;
  position: relative;
}

.section-divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
}

.section-divider span {
  position: relative;
  background: white;
  padding: 0 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9ca3af;
}

/* Generate Button */
.btn-generate {
  width: 100%;
  margin-top: 16px;
  padding: 14px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-generate:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-generate:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* QR Container */
.qr-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 28px;
  min-height: 340px;
}

.qr-wrapper {
  position: relative;
  display: inline-block;
}

.qr-image {
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.qr-overlay {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(8px);
  padding: 6px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.75rem;
  font-weight: 500;
}

.qr-placeholder {
  text-align: center;
  padding: 48px;
  background: #f9fafb;
  border-radius: 20px;
  color: #9ca3af;
}

.qr-placeholder svg {
  margin-bottom: 16px;
  color: #d1d5db;
}

.qr-placeholder p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 8px;
}

.qr-placeholder small {
  font-size: 0.75rem;
  color: #9ca3af;
}

/* Download Buttons */
.download-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 28px;
}

.btn-download {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-download.svg {
  background: #10b981;
  color: white;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-download.png {
  background: #8b5cf6;
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.btn-download:hover:not(:disabled) {
  transform: translateY(-2px);
}

.btn-download:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Bulk Section */
.bulk-section {
  margin-bottom: 24px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 16px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.section-header h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

.bulk-textarea {
  width: 100%;
  padding: 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-family: 'Courier New', monospace;
  resize: vertical;
  transition: all 0.2s ease;
}

.bulk-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-bulk {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-bulk:hover:not(:disabled) {
  background: #4338ca;
  transform: translateY(-1px);
}

.btn-bulk:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Info Card */
.info-card {
  padding: 16px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 16px;
  border-left: 4px solid #f59e0b;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #92400e;
}

.info-card p {
  font-size: 0.8125rem;
  color: #78350f;
  line-height: 1.5;
}

.info-note {
  margin-top: 12px;
  padding: 10px;
  background: #eff6ff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.75rem;
  color: #1e40af;
}

.two-col-grid-small {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 480px) {
  .two-col-grid-small {
    grid-template-columns: 1fr;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .card-body {
    padding: 20px;
  }
}
</style>