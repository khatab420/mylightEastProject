<template>
  <div class="jwt-decoder">
    <div class="decoder-header">
      <h2>JWT Decoder & Validator</h2>
      <p>Decode, verify, and inspect JSON Web Tokens securely.</p>
    </div>

    <div class="decoder-main">
      <!-- JWT Input Section -->
      <div class="input-section">
        <label>
          <span class="label-icon">🔑</span>
          JWT Token
        </label>
        <textarea
          v-model="jwtToken"
          @input="decodeJWT"
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
          class="jwt-input"
          rows="4"
        ></textarea>
        
        <!-- Parse Status -->
        <div v-if="parseError" class="parse-error">
          ⚠️ {{ parseError }}
        </div>
        <div v-else-if="isValidFormat" class="parse-success">
          ✓ Valid JWT format
        </div>
      </div>

      <!-- Algorithm Selection & Verification Section -->
      <div class="verification-section" v-if="isValidFormat">
        <div class="algorithm-selector">
          <label>
            <span class="label-icon">⚙️</span>
            Algorithm
          </label>
          <div class="algorithm-buttons">
            <button
              v-for="alg in algorithms"
              :key="alg"
              @click="selectedAlgorithm = alg"
              :class="['alg-btn', { active: selectedAlgorithm === alg }]"
            >
              {{ alg }}
            </button>
          </div>
        </div>

        <div class="secret-section">
          <label>
            <span class="label-icon" v-if="isAsymmetric">🔐</span>
            <span class="label-icon" v-else>🗝️</span>
            {{ isAsymmetric ? 'Public Key (PEM format)' : 'Secret Key' }}
          </label>
          <textarea
            v-model="secretKey"
            @input="verifySignature"
            :placeholder="isAsymmetric ? '-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----' : 'Enter your secret key for signature verification...'"
            class="secret-input"
            rows="3"
          ></textarea>
          
          <div class="verification-status" v-if="verificationPerformed">
            <div v-if="signatureValid" class="verified-badge">
              ✓ Signature Verified
            </div>
            <div v-else-if="verificationError" class="invalid-badge">
              ✗ Signature Invalid: {{ verificationError }}
            </div>
          </div>
        </div>
      </div>

      <!-- Decoded Content -->
      <div class="decoded-section" v-if="decodedHeader && decodedPayload">
        <div class="decoded-header-section">
          <div class="section-header">
            <span class="label-icon">📋</span>
            <h3>Header</h3>
            <button @click="copyToClipboard(JSON.stringify(decodedHeader, null, 2))" class="copy-btn-small">Copy</button>
          </div>
          <pre class="json-viewer">{{ JSON.stringify(decodedHeader, null, 2) }}</pre>
        </div>

        <div class="decoded-payload-section">
          <div class="section-header">
            <span class="label-icon">📦</span>
            <h3>Payload</h3>
            <button @click="copyToClipboard(JSON.stringify(decodedPayload, null, 2))" class="copy-btn-small">Copy</button>
          </div>
          <pre class="json-viewer">{{ JSON.stringify(decodedPayload, null, 2) }}</pre>
        </div>

        <div class="signature-section" v-if="signature">
          <div class="section-header">
            <span class="label-icon">✍️</span>
            <h3>Signature</h3>
            <button @click="copyToClipboard(signature)" class="copy-btn-small">Copy</button>
          </div>
          <div class="signature-value">{{ signature }}</div>
        </div>
      </div>

      <!-- Claims Validation -->
      <div class="claims-section" v-if="decodedPayload">
        <div class="section-header">
          <span class="label-icon">✅</span>
          <h3>Claims Validation</h3>
        </div>
        <div class="claims-grid">
          <div class="claim-card" v-for="claim in claimsValidation" :key="claim.name">
            <div class="claim-header">
              <span class="claim-name">{{ claim.name }}</span>
              <span :class="['claim-status', claim.valid ? 'valid' : 'invalid']">
                {{ claim.valid ? '✓ Valid' : '✗ Invalid' }}
              </span>
            </div>
            <div class="claim-details">
              <span class="claim-label">{{ claim.label }}:</span>
              <span class="claim-value">{{ claim.value }}</span>
            </div>
            <div v-if="claim.message" class="claim-message">{{ claim.message }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JWTDecoder',
  data() {
    return {
      jwtToken: '',
      decodedHeader: null,
      decodedPayload: null,
      signature: null,
      parseError: null,
      isValidFormat: false,
      selectedAlgorithm: 'HS256',
      algorithms: ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512'],
      secretKey: '',
      verificationPerformed: false,
      signatureValid: false,
      verificationError: null
    };
  },
  computed: {
    isAsymmetric() {
      return this.selectedAlgorithm.startsWith('RS');
    },
    claimsValidation() {
      if (!this.decodedPayload) return [];
      
      const now = Math.floor(Date.now() / 1000);
      const claims = [];
      
      // Expiration Time (exp)
      if (this.decodedPayload.exp !== undefined) {
        const expTime = this.decodedPayload.exp;
        const isValid = expTime > now;
        claims.push({
          name: 'exp',
          label: 'Expiration Time',
          value: new Date(expTime * 1000).toLocaleString(),
          valid: isValid,
          message: isValid ? 'Token is still valid' : `Token expired on ${new Date(expTime * 1000).toLocaleString()}`
        });
      } else {
        claims.push({
          name: 'exp',
          label: 'Expiration Time',
          value: 'Not set',
          valid: false,
          message: 'No expiration claim (exp) - token never expires'
        });
      }
      
      // Issued At (iat)
      if (this.decodedPayload.iat !== undefined) {
        const iatTime = this.decodedPayload.iat;
        const isValid = iatTime <= now;
        claims.push({
          name: 'iat',
          label: 'Issued At',
          value: new Date(iatTime * 1000).toLocaleString(),
          valid: isValid,
          message: isValid ? 'Token issued in the past' : 'Token issued in the future!'
        });
      }
      
      // Not Before (nbf)
      if (this.decodedPayload.nbf !== undefined) {
        const nbfTime = this.decodedPayload.nbf;
        const isValid = nbfTime <= now;
        claims.push({
          name: 'nbf',
          label: 'Not Before',
          value: new Date(nbfTime * 1000).toLocaleString(),
          valid: isValid,
          message: isValid ? 'Token is active' : 'Token not yet active'
        });
      }
      
      // Subject (sub)
      if (this.decodedPayload.sub !== undefined) {
        claims.push({
          name: 'sub',
          label: 'Subject',
          value: this.decodedPayload.sub,
          valid: true,
          message: 'Subject identifier'
        });
      }
      
      // Issuer (iss)
      if (this.decodedPayload.iss !== undefined) {
        claims.push({
          name: 'iss',
          label: 'Issuer',
          value: this.decodedPayload.iss,
          valid: true,
          message: 'Token issuer'
        });
      }
      
      // Audience (aud)
      if (this.decodedPayload.aud !== undefined) {
        claims.push({
          name: 'aud',
          label: 'Audience',
          value: Array.isArray(this.decodedPayload.aud) ? this.decodedPayload.aud.join(', ') : this.decodedPayload.aud,
          valid: true,
          message: 'Intended audience'
        });
      }
      
      return claims;
    }
  },
  watch: {
    selectedAlgorithm() {
      this.verifySignature();
    }
  },
  methods: {
    decodeJWT() {
      this.parseError = null;
      this.decodedHeader = null;
      this.decodedPayload = null;
      this.signature = null;
      this.isValidFormat = false;
      this.verificationPerformed = false;
      
      if (!this.jwtToken.trim()) {
        return;
      }
      
      const parts = this.jwtToken.split('.');
      if (parts.length !== 3) {
        this.parseError = 'Invalid JWT format. Expected 3 parts separated by dots.';
        return;
      }
      
      try {
        // Decode header
        const headerJson = this.base64UrlDecode(parts[0]);
        this.decodedHeader = JSON.parse(headerJson);
        
        // Decode payload
        const payloadJson = this.base64UrlDecode(parts[1]);
        this.decodedPayload = JSON.parse(payloadJson);
        
        // Store signature
        this.signature = parts[2];
        
        this.isValidFormat = true;
        
        // Auto-detect algorithm from header if available
        if (this.decodedHeader.alg && this.algorithms.includes(this.decodedHeader.alg)) {
          this.selectedAlgorithm = this.decodedHeader.alg;
        }
        
        // Verify signature if secret is provided
        if (this.secretKey) {
          this.verifySignature();
        }
      } catch (e) {
        this.parseError = `Failed to decode JWT: ${e.message}`;
      }
    },
    
    base64UrlDecode(str) {
      // Replace URL-safe characters and pad
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      return decodeURIComponent(escape(atob(base64)));
    },
    
    base64UrlEncode(str) {
      const base64 = btoa(unescape(encodeURIComponent(str)));
      return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    },
    
    async verifySignature() {
      if (!this.isValidFormat || !this.jwtToken) {
        return;
      }
      
      this.verificationPerformed = true;
      this.signatureValid = false;
      this.verificationError = null;
      
      if (!this.secretKey) {
        this.verificationError = 'No key provided for verification';
        return;
      }
      
      const parts = this.jwtToken.split('.');
      const message = `${parts[0]}.${parts[1]}`;
      const providedSignature = parts[2];
      
      try {
        let isValid = false;
        
        if (this.isAsymmetric) {
          // RS256, RS384, RS512 verification
          isValid = await this.verifyRSA(message, providedSignature);
        } else {
          // HS256, HS384, HS512 verification
          isValid = await this.verifyHMAC(message, providedSignature);
        }
        
        this.signatureValid = isValid;
        if (!isValid) {
          this.verificationError = 'Signature does not match';
        }
      } catch (e) {
        this.verificationError = `Verification failed: ${e.message}`;
      }
    },
    
    async verifyHMAC(message, signature) {
      const algorithm = this.getCryptoAlgorithm();
      const encoder = new TextEncoder();
      const keyData = encoder.encode(this.secretKey);
      const messageData = encoder.encode(message);
      
      try {
        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          keyData,
          { name: 'HMAC', hash: algorithm },
          false,
          ['sign']
        );
        
        const signatureBuffer = this.base64UrlToBuffer(signature);
        const isValid = await crypto.subtle.verify(
          'HMAC',
          cryptoKey,
          signatureBuffer,
          messageData
        );
        
        return isValid;
      } catch (e) {
        console.error('HMAC verification error:', e);
        return false;
      }
    },
    
    async verifyRSA(message, signature) {
      const algorithm = this.getCryptoAlgorithm();
      const encoder = new TextEncoder();
      const messageData = encoder.encode(message);
      
      try {
        // Import public key
        const cryptoKey = await crypto.subtle.importKey(
          'spki',
          this.pemToBinary(this.secretKey),
          { name: 'RSASSA-PKCS1-v1_5', hash: algorithm },
          false,
          ['verify']
        );
        
        const signatureBuffer = this.base64UrlToBuffer(signature);
        const isValid = await crypto.subtle.verify(
          'RSASSA-PKCS1-v1_5',
          cryptoKey,
          signatureBuffer,
          messageData
        );
        
        return isValid;
      } catch (e) {
        console.error('RSA verification error:', e);
        return false;
      }
    },
    
    getCryptoAlgorithm() {
      switch (this.selectedAlgorithm) {
        case 'HS256':
        case 'RS256':
          return { name: 'SHA-256' };
        case 'HS384':
        case 'RS384':
          return { name: 'SHA-384' };
        case 'HS512':
        case 'RS512':
          return { name: 'SHA-512' };
        default:
          return { name: 'SHA-256' };
      }
    },
    
    base64UrlToBuffer(base64Url) {
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) {
        base64 += '=';
      }
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },
    
    pemToBinary(pem) {
      const pemHeader = '-----BEGIN PUBLIC KEY-----';
      const pemFooter = '-----END PUBLIC KEY-----';
      let pemContents = pem;
      
      if (pem.includes(pemHeader)) {
        pemContents = pem.substring(
          pem.indexOf(pemHeader) + pemHeader.length,
          pem.indexOf(pemFooter)
        );
      }
      
      const base64 = pemContents.replace(/\s/g, '');
      const binaryString = atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },
    
    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text);
        // Optional: Show a temporary notification
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✓ Copied!';
        setTimeout(() => {
          btn.textContent = originalText;
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  }
};
</script>

<style scoped>
.jwt-decoder {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 24px;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.decoder-header {
  margin-bottom: 32px;
  text-align: center;
}

.decoder-header h2 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-bottom: 8px;
}

.decoder-header p {
  color: #94a3b8;
  font-size: 0.95rem;
}

.decoder-main {
  background: #1e293b;
  border-radius: 20px;
  box-shadow: 0 20px 35px -10px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.input-section {
  padding: 24px;
  border-bottom: 1px solid #334155;
}

.input-section label,
.algorithm-selector label,
.secret-section label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #e2e8f0;
  margin-bottom: 12px;
  font-size: 0.9rem;
}

.label-icon {
  font-size: 1.1rem;
}

.jwt-input,
.secret-input {
  width: 100%;
  padding: 14px;
  background: #0f172a;
  border: 2px solid #334155;
  border-radius: 12px;
  color: #e2e8f0;
  font-family: 'Fira Code', monospace;
  font-size: 0.85rem;
  resize: vertical;
  transition: all 0.2s ease;
}

.jwt-input:focus,
.secret-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.parse-error {
  margin-top: 12px;
  padding: 10px;
  background: rgba(220, 38, 38, 0.1);
  border-left: 3px solid #ef4444;
  border-radius: 8px;
  color: #fca5a5;
  font-size: 0.85rem;
}

.parse-success {
  margin-top: 12px;
  padding: 10px;
  background: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22c55e;
  border-radius: 8px;
  color: #86efac;
  font-size: 0.85rem;
}

.verification-section {
  padding: 24px;
  border-bottom: 1px solid #334155;
}

.algorithm-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.alg-btn {
  padding: 8px 16px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 8px;
  color: #94a3b8;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.alg-btn:hover {
  background: #1e293b;
  transform: translateY(-1px);
}

.alg-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.verification-status {
  margin-top: 16px;
}

.verified-badge {
  padding: 10px;
  background: rgba(34, 197, 94, 0.1);
  border-radius: 8px;
  color: #86efac;
  font-weight: 600;
  text-align: center;
}

.invalid-badge {
  padding: 10px;
  background: rgba(220, 38, 38, 0.1);
  border-radius: 8px;
  color: #fca5a5;
  font-weight: 600;
  text-align: center;
}

.decoded-section {
  padding: 24px;
  border-bottom: 1px solid #334155;
}

.decoded-header-section,
.decoded-payload-section,
.signature-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.section-header h3 {
  color: #e2e8f0;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.copy-btn-small {
  padding: 4px 12px;
  background: #0f172a;
  border: 1px solid #334155;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  font-size: 0.75rem;
  transition: all 0.2s ease;
}

.copy-btn-small:hover {
  background: #1e293b;
  color: #e2e8f0;
}

.json-viewer {
  background: #0f172a;
  padding: 16px;
  border-radius: 12px;
  overflow-x: auto;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  color: #86efac;
  border: 1px solid #334155;
  margin: 0;
}

.signature-value {
  background: #0f172a;
  padding: 16px;
  border-radius: 12px;
  font-family: 'Fira Code', monospace;
  font-size: 0.8rem;
  color: #fde047;
  word-break: break-all;
  border: 1px solid #334155;
}

.claims-section {
  padding: 24px;
}

.claims-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.claim-card {
  background: #0f172a;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #334155;
  transition: all 0.2s ease;
}

.claim-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
}

.claim-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #334155;
}

.claim-name {
  font-family: monospace;
  font-weight: 700;
  color: #60a5fa;
  font-size: 0.9rem;
}

.claim-status {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.claim-status.valid {
  background: rgba(34, 197, 94, 0.2);
  color: #86efac;
}

.claim-status.invalid {
  background: rgba(220, 38, 38, 0.2);
  color: #fca5a5;
}

.claim-details {
  margin-bottom: 8px;
  font-size: 0.85rem;
}

.claim-label {
  color: #94a3b8;
  font-weight: 500;
}

.claim-value {
  color: #e2e8f0;
  font-family: monospace;
}

.claim-message {
  font-size: 0.75rem;
  color: #64748b;
  margin-top: 8px;
  font-style: italic;
}

@media (max-width: 768px) {
  .jwt-decoder {
    padding: 16px;
  }
  
  .claims-grid {
    grid-template-columns: 1fr;
  }
  
  .algorithm-buttons {
    gap: 6px;
  }
  
  .alg-btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
}
</style>