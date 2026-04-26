<template>
  <div class="meta-generator">
    <div class="generator-header">
      <h2>Meta Tag Generator</h2>
      <p>Generate comprehensive meta tags for better SEO and social media sharing. Preview how your content will appear on Google, Facebook, and Twitter.</p>
    </div>

    <div class="generator-main">
      <div class="generator-grid">
        <!-- Input Section -->
        <div class="input-section">
          <!-- Basic Meta Tags -->
          <div class="meta-group">
            <div class="group-header">
              <span class="group-icon">📝</span>
              <h3>Basic Meta Tags</h3>
            </div>
            
            <div class="input-field">
              <label>Title *</label>
              <input 
                type="text" 
                v-model="metaData.title" 
                @input="generateMetaTags"
                placeholder="Page Title (50-60 characters recommended)"
                maxlength="120"
              />
              <span class="char-count">{{ metaData.title.length }}/120</span>
            </div>

            <div class="input-field">
              <label>Meta Description *</label>
              <textarea 
                v-model="metaData.description" 
                @input="generateMetaTags"
                placeholder="Brief description of your page (150-160 characters recommended)"
                rows="3"
                maxlength="320"
              ></textarea>
              <span class="char-count">{{ metaData.description.length }}/320</span>
            </div>

            <div class="input-field">
              <label>Keywords</label>
              <input 
                type="text" 
                v-model="metaData.keywords" 
                @input="generateMetaTags"
                placeholder="keyword1, keyword2, keyword3"
              />
              <span class="help-text">Separate keywords with commas</span>
            </div>

            <div class="input-field">
              <label>Author</label>
              <input 
                type="text" 
                v-model="metaData.author" 
                @input="generateMetaTags"
                placeholder="Author name"
              />
            </div>

            <div class="input-field">
              <label>Robots</label>
              <select v-model="metaData.robots" @change="generateMetaTags">
                <option value="index, follow">index, follow (Default)</option>
                <option value="noindex, follow">noindex, follow</option>
                <option value="index, nofollow">index, nofollow</option>
                <option value="noindex, nofollow">noindex, nofollow</option>
              </select>
            </div>

            <div class="input-field">
              <label>Canonical URL</label>
              <input 
                type="url" 
                v-model="metaData.canonical" 
                @input="generateMetaTags"
                placeholder="https://example.com/page"
              />
            </div>
          </div>

          <!-- Open Graph Tags (Facebook, LinkedIn) -->
          <div class="meta-group">
            <div class="group-header">
              <span class="group-icon">📘</span>
              <h3>Open Graph Tags (Facebook, LinkedIn)</h3>
            </div>

            <div class="input-field">
              <label>OG Title</label>
              <input 
                type="text" 
                v-model="ogData.title" 
                @input="generateMetaTags"
                placeholder="Title for social sharing"
              />
            </div>

            <div class="input-field">
              <label>OG Description</label>
              <textarea 
                v-model="ogData.description" 
                @input="generateMetaTags"
                placeholder="Description for social sharing"
                rows="2"
              ></textarea>
            </div>

            <div class="input-field">
              <label>OG Image URL</label>
              <input 
                type="url" 
                v-model="ogData.image" 
                @input="generateMetaTags"
                placeholder="https://example.com/image.jpg"
              />
              <div v-if="ogData.image" class="image-preview">
                <img :src="ogData.image" @error="handleImageError" class="preview-img" />
              </div>
            </div>

            <div class="input-field">
              <label>OG URL</label>
              <input 
                type="url" 
                v-model="ogData.url" 
                @input="generateMetaTags"
                placeholder="https://example.com/page"
              />
            </div>

            <div class="input-field">
              <label>OG Type</label>
              <select v-model="ogData.type" @change="generateMetaTags">
                <option value="website">website</option>
                <option value="article">article</option>
                <option value="product">product</option>
                <option value="video.movie">video.movie</option>
                <option value="music.song">music.song</option>
              </select>
            </div>

            <div class="input-field">
              <label>Site Name</label>
              <input 
                type="text" 
                v-model="ogData.siteName" 
                @input="generateMetaTags"
                placeholder="Your Website Name"
              />
            </div>

            <div class="input-field">
              <label>Locale</label>
              <select v-model="ogData.locale" @change="generateMetaTags">
                <option value="en_US">English (US)</option>
                <option value="en_GB">English (UK)</option>
                <option value="es_ES">Spanish</option>
                <option value="fr_FR">French</option>
                <option value="de_DE">German</option>
                <option value="it_IT">Italian</option>
                <option value="pt_BR">Portuguese (Brazil)</option>
                <option value="ja_JP">Japanese</option>
                <option value="zh_CN">Chinese (Simplified)</option>
              </select>
            </div>
          </div>

          <!-- Twitter Card Tags -->
          <div class="meta-group">
            <div class="group-header">
              <span class="group-icon">🐦</span>
              <h3>Twitter Card Tags</h3>
            </div>

            <div class="input-field">
              <label>Twitter Card Type</label>
              <select v-model="twitterData.card" @change="generateMetaTags">
                <option value="summary">Summary Card</option>
                <option value="summary_large_image">Summary Card with Large Image</option>
                <option value="app">App Card</option>
                <option value="player">Player Card</option>
              </select>
            </div>

            <div class="input-field">
              <label>Twitter Site (@username)</label>
              <input 
                type="text" 
                v-model="twitterData.site" 
                @input="generateMetaTags"
                placeholder="@username"
              />
            </div>

            <div class="input-field">
              <label>Twitter Creator (@username)</label>
              <input 
                type="text" 
                v-model="twitterData.creator" 
                @input="generateMetaTags"
                placeholder="@creator"
              />
            </div>

            <div class="input-field">
              <label>Twitter Title</label>
              <input 
                type="text" 
                v-model="twitterData.title" 
                @input="generateMetaTags"
                placeholder="Title for Twitter card"
              />
            </div>

            <div class="input-field">
              <label>Twitter Description</label>
              <textarea 
                v-model="twitterData.description" 
                @input="generateMetaTags"
                placeholder="Description for Twitter card"
                rows="2"
              ></textarea>
            </div>

            <div class="input-field">
              <label>Twitter Image URL</label>
              <input 
                type="url" 
                v-model="twitterData.image" 
                @input="generateMetaTags"
                placeholder="https://example.com/twitter-image.jpg"
              />
            </div>
          </div>

          <!-- Additional Meta Tags -->
          <div class="meta-group">
            <div class="group-header">
              <span class="group-icon">⚙️</span>
              <h3>Additional Tags</h3>
            </div>

            <div class="input-field">
              <label>Viewport</label>
              <select v-model="additionalData.viewport" @change="generateMetaTags">
                <option value="width=device-width, initial-scale=1.0">Default (width=device-width, initial-scale=1.0)</option>
                <option value="width=device-width, initial-scale=1.0, maximum-scale=1.0">No Zoom</option>
                <option value="width=device-width, initial-scale=0.75">75% Zoom</option>
              </select>
            </div>

            <div class="input-field">
              <label>Theme Color</label>
              <input 
                type="color" 
                v-model="additionalData.themeColor" 
                @input="generateMetaTags"
              />
            </div>

            <div class="input-field">
              <label>Charset</label>
              <select v-model="additionalData.charset" @change="generateMetaTags">
                <option value="UTF-8">UTF-8</option>
                <option value="ISO-8859-1">ISO-8859-1</option>
              </select>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="copyHtmlTags" class="action-btn copy-btn">
              📋 Copy HTML Tags
            </button>
            <button @click="downloadTags" class="action-btn download-btn">
              💾 Download Tags (HTML)
            </button>
            <button @click="resetForm" class="action-btn reset-btn">
              🔄 Reset Form
            </button>
            <button @click="loadSample" class="action-btn sample-btn">
              📂 Load Sample
            </button>
          </div>
        </div>

        <!-- Preview Section -->
        <div class="preview-section">
          <div class="preview-header">
            <span class="preview-icon">👁️</span>
            <h3>Live Preview</h3>
          </div>

          <!-- Google Search Preview -->
          <div class="preview-card">
            <div class="preview-title">Google Search Result Preview</div>
            <div class="google-preview">
              <div class="google-url">{{ getDisplayUrl() }}</div>
              <div class="google-title">{{ getPreviewTitle() }}</div>
              <div class="google-description">{{ getPreviewDescription() }}</div>
            </div>
          </div>

          <!-- Facebook / Open Graph Preview -->
          <div class="preview-card">
            <div class="preview-title">Facebook / LinkedIn Preview</div>
            <div class="social-preview facebook-preview">
              <div class="social-card">
                <div class="social-image" v-if="ogData.image">
                  <img :src="ogData.image" @error="handleImageError" />
                </div>
                <div class="social-content">
                  <div class="social-site">{{ ogData.siteName || 'Your Website' }}</div>
                  <div class="social-title">{{ ogData.title || metaData.title || 'No Title' }}</div>
                  <div class="social-description">{{ ogData.description || metaData.description || 'No description provided' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Twitter Card Preview -->
          <div class="preview-card">
            <div class="preview-title">Twitter Card Preview</div>
            <div class="social-preview twitter-preview">
              <div class="twitter-card" :class="{ 'large-image': twitterData.card === 'summary_large_image' }">
                <div class="twitter-header">
                  <span class="twitter-icon">🐦</span>
                  <span class="twitter-handle">{{ twitterData.site || '@yourhandle' }}</span>
                </div>
                <div class="twitter-image" v-if="twitterData.image || ogData.image">
                  <img :src="twitterData.image || ogData.image" @error="handleImageError" />
                </div>
                <div class="twitter-content">
                  <div class="twitter-title">{{ twitterData.title || metaData.title || 'No Title' }}</div>
                  <div class="twitter-description">{{ twitterData.description || metaData.description || 'No description provided' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Generated Meta Tags -->
          <div class="preview-card">
            <div class="preview-title">Generated Meta Tags</div>
            <div class="code-preview">
              <pre class="meta-code">{{ generatedTags }}</pre>
            </div>
          </div>

          <!-- SEO Score -->
          <div class="preview-card">
            <div class="preview-title">SEO Score</div>
            <div class="seo-score">
              <div class="score-circle">
                <svg viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#334155" stroke-width="8"/>
                  <circle cx="50" cy="50" r="45" fill="none" :stroke="seoScoreColor" stroke-width="8" 
                          :stroke-dasharray="283" :stroke-dashoffset="283 - (283 * seoScore / 100)"
                          transform="rotate(-90 50 50)"/>
                  <text x="50" y="55" text-anchor="middle" fill="#e2e8f0" font-size="24" font-weight="bold">{{ seoScore }}%</text>
                </svg>
              </div>
              <div class="score-details">
                <div class="score-item" :class="{ good: metaData.title.length >= 30 && metaData.title.length <= 60 }">
                  ✓ Title length: {{ metaData.title.length }}/60
                </div>
                <div class="score-item" :class="{ good: metaData.description.length >= 120 && metaData.description.length <= 160 }">
                  ✓ Description length: {{ metaData.description.length }}/160
                </div>
                <div class="score-item" :class="{ good: ogData.image }">
                  ✓ OG Image: {{ ogData.image ? 'Set' : 'Missing' }}
                </div>
                <div class="score-item" :class="{ good: twitterData.card }">
                  ✓ Twitter Card: {{ twitterData.card ? 'Set' : 'Missing' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetaTagGenerator',
  data() {
    return {
      metaData: {
        title: '',
        description: '',
        keywords: '',
        author: '',
        robots: 'index, follow',
        canonical: ''
      },
      ogData: {
        title: '',
        description: '',
        image: '',
        url: '',
        type: 'website',
        siteName: '',
        locale: 'en_US'
      },
      twitterData: {
        card: 'summary_large_image',
        site: '',
        creator: '',
        title: '',
        description: '',
        image: ''
      },
      additionalData: {
        viewport: 'width=device-width, initial-scale=1.0',
        themeColor: '#3b82f6',
        charset: 'UTF-8'
      },
      generatedTags: ''
    };
  },
  computed: {
    seoScore() {
      let score = 0;
      
      // Title score (max 25 points)
      if (this.metaData.title.length >= 30 && this.metaData.title.length <= 60) score += 25;
      else if (this.metaData.title.length > 0) score += 15;
      
      // Description score (max 25 points)
      if (this.metaData.description.length >= 120 && this.metaData.description.length <= 160) score += 25;
      else if (this.metaData.description.length > 0) score += 15;
      
      // Keywords score (max 10 points)
      if (this.metaData.keywords) score += 10;
      
      // OG tags score (max 20 points)
      if (this.ogData.title) score += 5;
      if (this.ogData.description) score += 5;
      if (this.ogData.image) score += 10;
      
      // Twitter card score (max 20 points)
      if (this.twitterData.card) score += 10;
      if (this.twitterData.site) score += 5;
      if (this.twitterData.title || this.twitterData.description) score += 5;
      
      return score;
    },
    seoScoreColor() {
      if (this.seoScore >= 80) return '#10b981';
      if (this.seoScore >= 60) return '#f59e0b';
      return '#ef4444';
    }
  },
  mounted() {
    this.loadSample();
  },
  methods: {
    generateMetaTags() {
      let tags = '';
      
      // Basic Meta Tags
      tags += `<!-- Basic Meta Tags -->\n`;
      tags += `<meta charset="${this.additionalData.charset}">\n`;
      tags += `<meta name="viewport" content="${this.additionalData.viewport}">\n`;
      if (this.metaData.title) tags += `<title>${this.escapeHtml(this.metaData.title)}</title>\n`;
      if (this.metaData.description) tags += `<meta name="description" content="${this.escapeHtml(this.metaData.description)}">\n`;
      if (this.metaData.keywords) tags += `<meta name="keywords" content="${this.escapeHtml(this.metaData.keywords)}">\n`;
      if (this.metaData.author) tags += `<meta name="author" content="${this.escapeHtml(this.metaData.author)}">\n`;
      if (this.metaData.robots) tags += `<meta name="robots" content="${this.metaData.robots}">\n`;
      if (this.metaData.canonical) tags += `<link rel="canonical" href="${this.escapeHtml(this.metaData.canonical)}">\n`;
      if (this.additionalData.themeColor) tags += `<meta name="theme-color" content="${this.additionalData.themeColor}">\n`;
      
      tags += `\n<!-- Open Graph Tags (Facebook, LinkedIn) -->\n`;
      if (this.ogData.title || this.metaData.title) tags += `<meta property="og:title" content="${this.escapeHtml(this.ogData.title || this.metaData.title)}">\n`;
      if (this.ogData.description || this.metaData.description) tags += `<meta property="og:description" content="${this.escapeHtml(this.ogData.description || this.metaData.description)}">\n`;
      if (this.ogData.image) tags += `<meta property="og:image" content="${this.escapeHtml(this.ogData.image)}">\n`;
      if (this.ogData.url || this.metaData.canonical) tags += `<meta property="og:url" content="${this.escapeHtml(this.ogData.url || this.metaData.canonical)}">\n`;
      if (this.ogData.type) tags += `<meta property="og:type" content="${this.ogData.type}">\n`;
      if (this.ogData.siteName) tags += `<meta property="og:site_name" content="${this.escapeHtml(this.ogData.siteName)}">\n`;
      if (this.ogData.locale) tags += `<meta property="og:locale" content="${this.ogData.locale}">\n`;
      
      tags += `\n<!-- Twitter Card Tags -->\n`;
      tags += `<meta name="twitter:card" content="${this.twitterData.card}">\n`;
      if (this.twitterData.site) tags += `<meta name="twitter:site" content="${this.twitterData.site}">\n`;
      if (this.twitterData.creator) tags += `<meta name="twitter:creator" content="${this.twitterData.creator}">\n`;
      if (this.twitterData.title || this.metaData.title) tags += `<meta name="twitter:title" content="${this.escapeHtml(this.twitterData.title || this.metaData.title)}">\n`;
      if (this.twitterData.description || this.metaData.description) tags += `<meta name="twitter:description" content="${this.escapeHtml(this.twitterData.description || this.metaData.description)}">\n`;
      if (this.twitterData.image || this.ogData.image) tags += `<meta name="twitter:image" content="${this.escapeHtml(this.twitterData.image || this.ogData.image)}">\n`;
      
      this.generatedTags = tags;
    },
    
    getPreviewTitle() {
      return this.metaData.title || 'No Title Set - Add a title for better SEO';
    },
    
    getPreviewDescription() {
      return this.metaData.description || 'No description set - Add a meta description to improve click-through rates.';
    },
    
    getDisplayUrl() {
      const url = this.metaData.canonical || this.ogData.url || 'https://example.com/page';
      try {
        const urlObj = new URL(url);
        return urlObj.hostname + (urlObj.pathname === '/' ? '' : urlObj.pathname);
      } catch {
        return 'example.com/page';
      }
    },
    
    escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },
    
    handleImageError(e) {
      e.target.style.display = 'none';
    },
    
    async copyHtmlTags() {
      if (!this.generatedTags) {
        this.generateMetaTags();
      }
      
      try {
        await navigator.clipboard.writeText(this.generatedTags);
        alert('✓ Meta tags copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
      }
    },
    
    downloadTags() {
      if (!this.generatedTags) {
        this.generateMetaTags();
      }
      
      const htmlContent = `<!DOCTYPE html>
<html>
<head>
${this.generatedTags}
</head>
<body>
  <!-- Your page content here -->
</body>
</html>`;
      
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `meta-tags-${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    
    resetForm() {
      this.metaData = {
        title: '',
        description: '',
        keywords: '',
        author: '',
        robots: 'index, follow',
        canonical: ''
      };
      this.ogData = {
        title: '',
        description: '',
        image: '',
        url: '',
        type: 'website',
        siteName: '',
        locale: 'en_US'
      };
      this.twitterData = {
        card: 'summary_large_image',
        site: '',
        creator: '',
        title: '',
        description: '',
        image: ''
      };
      this.generateMetaTags();
    },
    
    loadSample() {
      this.metaData = {
        title: 'Complete Guide to SEO Meta Tags | Boost Your Website Ranking',
        description: 'Learn how to optimize your meta tags for better SEO performance. Includes best practices for title tags, meta descriptions, Open Graph, and Twitter Cards.',
        keywords: 'SEO, meta tags, Open Graph, Twitter Cards, web development',
        author: 'SEO Expert',
        robots: 'index, follow',
        canonical: 'https://example.com/seo-guide'
      };
      
      this.ogData = {
        title: 'Complete Guide to SEO Meta Tags',
        description: 'Master the art of meta tags optimization. Learn best practices for title tags, descriptions, Open Graph, and Twitter Cards.',
        image: 'https://via.placeholder.com/1200x630/3b82f6/ffffff?text=SEO+Guide',
        url: 'https://example.com/seo-guide',
        type: 'article',
        siteName: 'SEO Mastery',
        locale: 'en_US'
      };
      
      this.twitterData = {
        card: 'summary_large_image',
        site: '@seomastery',
        creator: '@seoexpert',
        title: 'Complete Guide to SEO Meta Tags',
        description: 'Learn how to optimize your meta tags for better SEO. Includes best practices and examples.',
        image: 'https://via.placeholder.com/1200x675/3b82f6/ffffff?text=SEO+Guide'
      };
      
      this.generateMetaTags();
    }
  },
  watch: {
    metaData: {
      deep: true,
      handler() {
        this.generateMetaTags();
      }
    },
    ogData: {
      deep: true,
      handler() {
        this.generateMetaTags();
      }
    },
    twitterData: {
      deep: true,
      handler() {
        this.generateMetaTags();
      }
    },
    additionalData: {
      deep: true,
      handler() {
        this.generateMetaTags();
      }
    }
  }
};
</script>

<style scoped>
.meta-generator {
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
  background: #1e293b;
  border-radius: 20px;
  padding: 24px;
}

.generator-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 1024px) {
  .generator-grid {
    grid-template-columns: 1fr;
  }
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.meta-group {
  background: #0f172a;
  border-radius: 16px;
  padding: 20px;
}

.group-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #334155;
}

.group-icon {
  font-size: 1.5rem;
}

.group-header h3 {
  color: #e2e8f0;
  font-size: 1.1rem;
  margin: 0;
}

.input-field {
  margin-bottom: 16px;
}

.input-field label {
  display: block;
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.input-field input,
.input-field textarea,
.input-field select {
  width: 100%;
  padding: 10px 12px;
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #e2e8f0;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.input-field input:focus,
.input-field textarea:focus,
.input-field select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.char-count {
  display: block;
  text-align: right;
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 4px;
}

.help-text {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  margin-top: 4px;
}

.image-preview {
  margin-top: 8px;
}

.preview-img {
  max-width: 100%;
  max-height: 100px;
  border-radius: 8px;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-btn {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.copy-btn {
  background: #3b82f6;
  color: white;
}

.copy-btn:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.download-btn {
  background: #10b981;
  color: white;
}

.download-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.reset-btn {
  background: #6b7280;
  color: white;
}

.reset-btn:hover {
  background: #4b5563;
  transform: translateY(-2px);
}

.sample-btn {
  background: #8b5cf6;
  color: white;
}

.sample-btn:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

.preview-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.preview-icon {
  font-size: 1.5rem;
}

.preview-header h3 {
  color: #e2e8f0;
  font-size: 1.1rem;
  margin: 0;
}

.preview-card {
  background: #0f172a;
  border-radius: 16px;
  padding: 20px;
}

.preview-title {
  color: #94a3b8;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.google-preview {
  background: white;
  padding: 16px;
  border-radius: 12px;
}

.google-url {
  color: #202124;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.google-title {
  color: #1a0dab;
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 8px;
  text-decoration: none;
}

.google-description {
  color: #4d5156;
  font-size: 0.85rem;
  line-height: 1.4;
}

.social-preview {
  background: #f0f2f5;
  border-radius: 12px;
  padding: 16px;
}

.social-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.social-image img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
}

.social-content {
  padding: 16px;
}

.social-site {
  color: #606770;
  font-size: 0.75rem;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.social-title {
  color: #1d2129;
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.social-description {
  color: #606770;
  font-size: 0.85rem;
  line-height: 1.4;
}

.twitter-preview {
  background: #15202b;
}

.twitter-card {
  background: #1e293b;
  border-radius: 12px;
  overflow: hidden;
}

.twitter-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #0f172a;
}

.twitter-icon {
  font-size: 1rem;
}

.twitter-handle {
  color: #8899a6;
  font-size: 0.85rem;
}

.twitter-image img {
  width: 100%;
  height: auto;
  max-height: 200px;
  object-fit: cover;
}

.twitter-content {
  padding: 12px;
}

.twitter-title {
  color: #e2e8f0;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.twitter-description {
  color: #8899a6;
  font-size: 0.85rem;
}

.code-preview {
  background: #0f172a;
  border-radius: 12px;
  overflow-x: auto;
}

.meta-code {
  color: #86efac;
  font-family: 'Fira Code', monospace;
  font-size: 0.75rem;
  padding: 16px;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
}

.seo-score {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
}

.score-circle {
  width: 120px;
  height: 120px;
}

.score-details {
  flex: 1;
}

.score-item {
  color: #94a3b8;
  font-size: 0.85rem;
  margin-bottom: 8px;
  padding: 4px;
}

.score-item.good {
  color: #10b981;
}

@media (max-width: 768px) {
  .meta-generator {
    padding: 16px;
  }
  
  .generator-main {
    padding: 16px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .seo-score {
    flex-direction: column;
    text-align: center;
  }
}
</style>