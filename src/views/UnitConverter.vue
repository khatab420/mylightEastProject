<template>
  <div class="unit-converter">
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-icon">
          <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 class="hero-title">Unit Converter</h1>
        <p class="hero-description">
          Convert between length, weight, temperature, currency, and more. Fast and accurate conversions.
        </p>
      </div>
    </div>

    <div class="main-container">
      <!-- Category Selection -->
      <div class="category-card">
        <div class="category-header">
          <h3>📐 Conversion Category</h3>
        </div>
        <div class="category-buttons">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="['category-btn', { active: selectedCategory === cat.id }]"
          >
            <span class="category-icon">{{ cat.icon }}</span>
            <span class="category-name">{{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Converter Main Card -->
      <div class="converter-card">
        <div class="converter-header">
          <h3>{{ currentCategory.name }} Converter</h3>
          <button @click="swapUnits" class="swap-btn" title="Swap units">
            <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            Swap
          </button>
        </div>

        <!-- Input Section -->
        <div class="converter-inputs">
          <div class="input-group">
            <label class="input-label">From</label>
            <div class="input-wrapper">
              <input 
                type="number" 
                v-model.number="fromValue" 
                @input="convertFrom"
                class="value-input"
                placeholder="Enter value"
              />
              <select v-model="fromUnit" @change="convertFrom" class="unit-select">
                <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="converter-arrow">
            <svg class="arrow-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          <div class="input-group">
            <label class="input-label">To</label>
            <div class="input-wrapper">
              <input 
                type="number" 
                v-model.number="toValue" 
                @input="convertTo"
                class="value-input"
                placeholder="Result"
              />
              <select v-model="toUnit" @change="convertFrom" class="unit-select">
                <option v-for="unit in currentUnits" :key="unit.value" :value="unit.value">
                  {{ unit.label }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Quick Conversion Info -->
        <div class="conversion-info" v-if="fromValue && toValue">
          <div class="info-card">
            <span class="info-label">1 {{ getUnitLabel(fromUnit) }} =</span>
            <span class="info-value">{{ formatNumber(getConversionRate(fromUnit, toUnit)) }} {{ getUnitLabel(toUnit) }}</span>
          </div>
          <div class="info-card">
            <span class="info-label">1 {{ getUnitLabel(toUnit) }} =</span>
            <span class="info-value">{{ formatNumber(getConversionRate(toUnit, fromUnit)) }} {{ getUnitLabel(fromUnit) }}</span>
          </div>
        </div>
      </div>

      <!-- Currency Section (Special) -->
      <div v-if="selectedCategory === 'currency'" class="currency-card">
        <div class="currency-header">
          <h3>💱 Live Exchange Rates</h3>
          <div class="currency-status">
            <span class="status-dot" :class="{ updating: isUpdatingRates }"></span>
            <span class="status-text">{{ isUpdatingRates ? 'Updating...' : 'Live' }}</span>
            <button @click="fetchExchangeRates" class="refresh-btn" :disabled="isUpdatingRates">
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
        <div class="currency-info">
          <p class="currency-note">
            💡 Exchange rates are updated daily using free API. No API key required.
          </p>
        </div>
        <!-- Popular Rates -->
        <div class="popular-rates">
          <div class="popular-header">Popular Exchange Rates</div>
          <div class="rates-grid">
            <div v-for="rate in popularRates" :key="rate.code" class="rate-item">
              <span class="rate-code">{{ rate.code }}</span>
              <span class="rate-value">{{ formatNumber(rate.rate) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Common Conversions -->
      <div class="common-card">
        <h3>⚡ Common Conversions</h3>
        <div class="common-grid">
          <div v-for="conv in commonConversions" :key="conv.label" class="common-item" @click="applyCommonConversion(conv)">
            <span class="common-label">{{ conv.label }}</span>
            <span class="common-value">{{ conv.value }}</span>
          </div>
        </div>
      </div>

      <!-- Tips Section -->
      <div class="tips-card">
        <h3>💡 Conversion Tips</h3>
        <div class="tips-grid">
          <div class="tip-item">
            <span class="tip-icon">🔄</span>
            <div class="tip-content">
              <strong>Swap Units</strong>
              <p>Click the swap button to quickly reverse the conversion direction</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">💰</span>
            <div class="tip-content">
              <strong>Live Currency</strong>
              <p>Currency rates update daily for accurate conversions</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">📊</span>
            <div class="tip-content">
              <strong>Precision</strong>
              <p>Results show up to 6 decimal places for accuracy</p>
            </div>
          </div>
          <div class="tip-item">
            <span class="tip-icon">⚡</span>
            <div class="tip-content">
              <strong>Quick Access</strong>
              <p>Use common conversions for frequently used values</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toastMessage" class="toast-notification">
        <svg class="toast-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ toastMessage }}
      </div>
    </Transition>
  </div>
</template>

<script>
export default {
  name: 'UnitConverter',
  data() {
    return {
      selectedCategory: 'length',
      fromValue: 1,
      toValue: 0,
      fromUnit: 'm',
      toUnit: 'ft',
      exchangeRates: {},
      isUpdatingRates: false,
      toastMessage: '',
      categories: [
        { id: 'length', name: 'Length', icon: '📏' },
        { id: 'weight', name: 'Weight', icon: '⚖️' },
        { id: 'volume', name: 'Volume', icon: '🧪' },
        { id: 'temperature', name: 'Temperature', icon: '🌡️' },
        { id: 'area', name: 'Area', icon: '📐' },
        { id: 'speed', name: 'Speed', icon: '🚀' },
        { id: 'time', name: 'Time', icon: '⏰' },
        { id: 'currency', name: 'Currency', icon: '💵' }
      ],
      conversionRates: {
        length: {
          units: [
            { value: 'mm', label: 'Millimeters (mm)' },
            { value: 'cm', label: 'Centimeters (cm)' },
            { value: 'm', label: 'Meters (m)' },
            { value: 'km', label: 'Kilometers (km)' },
            { value: 'in', label: 'Inches (in)' },
            { value: 'ft', label: 'Feet (ft)' },
            { value: 'yd', label: 'Yards (yd)' },
            { value: 'mi', label: 'Miles (mi)' }
          ],
          toBase: {
            mm: 0.001, cm: 0.01, m: 1, km: 1000,
            in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344
          }
        },
        weight: {
          units: [
            { value: 'mg', label: 'Milligrams (mg)' },
            { value: 'g', label: 'Grams (g)' },
            { value: 'kg', label: 'Kilograms (kg)' },
            { value: 't', label: 'Tonnes (t)' },
            { value: 'oz', label: 'Ounces (oz)' },
            { value: 'lb', label: 'Pounds (lb)' },
            { value: 'st', label: 'Stones (st)' }
          ],
          toBase: {
            mg: 0.001, g: 1, kg: 1000, t: 1000000,
            oz: 28.3495, lb: 453.592, st: 6350.29
          }
        },
        volume: {
          units: [
            { value: 'ml', label: 'Milliliters (ml)' },
            { value: 'l', label: 'Liters (l)' },
            { value: 'm3', label: 'Cubic Meters (m³)' },
            { value: 'tsp', label: 'Teaspoons (tsp)' },
            { value: 'tbsp', label: 'Tablespoons (tbsp)' },
            { value: 'floz', label: 'Fluid Ounces (fl oz)' },
            { value: 'cup', label: 'Cups' },
            { value: 'gal', label: 'Gallons (gal)' }
          ],
          toBase: {
            ml: 0.001, l: 1, m3: 1000,
            tsp: 0.00492892, tbsp: 0.0147868, floz: 0.0295735,
            cup: 0.236588, gal: 3.78541
          }
        },
        temperature: {
          units: [
            { value: 'c', label: 'Celsius (°C)' },
            { value: 'f', label: 'Fahrenheit (°F)' },
            { value: 'k', label: 'Kelvin (K)' }
          ]
        },
        area: {
          units: [
            { value: 'mm2', label: 'Square Millimeters (mm²)' },
            { value: 'cm2', label: 'Square Centimeters (cm²)' },
            { value: 'm2', label: 'Square Meters (m²)' },
            { value: 'ha', label: 'Hectares (ha)' },
            { value: 'km2', label: 'Square Kilometers (km²)' },
            { value: 'in2', label: 'Square Inches (in²)' },
            { value: 'ft2', label: 'Square Feet (ft²)' },
            { value: 'ac', label: 'Acres' }
          ],
          toBase: {
            mm2: 0.000001, cm2: 0.0001, m2: 1, ha: 10000, km2: 1000000,
            in2: 0.00064516, ft2: 0.092903, ac: 4046.86
          }
        },
        speed: {
          units: [
            { value: 'mps', label: 'Meters/sec (m/s)' },
            { value: 'kmh', label: 'Kilometers/hour (km/h)' },
            { value: 'mph', label: 'Miles/hour (mph)' },
            { value: 'knot', label: 'Knots' },
            { value: 'fps', label: 'Feet/sec (ft/s)' }
          ],
          toBase: {
            mps: 1, kmh: 0.277778, mph: 0.44704, knot: 0.514444, fps: 0.3048
          }
        },
        time: {
          units: [
            { value: 'ms', label: 'Milliseconds (ms)' },
            { value: 's', label: 'Seconds (s)' },
            { value: 'min', label: 'Minutes' },
            { value: 'h', label: 'Hours' },
            { value: 'd', label: 'Days' },
            { value: 'wk', label: 'Weeks' },
            { value: 'mo', label: 'Months' },
            { value: 'yr', label: 'Years' }
          ],
          toBase: {
            ms: 0.001, s: 1, min: 60, h: 3600, d: 86400,
            wk: 604800, mo: 2592000, yr: 31536000
          }
        },
        currency: {
          units: [
            { value: 'USD', label: 'US Dollar (USD)' },
            { value: 'EUR', label: 'Euro (EUR)' },
            { value: 'GBP', label: 'British Pound (GBP)' },
            { value: 'JPY', label: 'Japanese Yen (JPY)' },
            { value: 'CNY', label: 'Chinese Yuan (CNY)' },
            { value: 'INR', label: 'Indian Rupee (INR)' },
            { value: 'CAD', label: 'Canadian Dollar (CAD)' },
            { value: 'AUD', label: 'Australian Dollar (AUD)' },
            { value: 'CHF', label: 'Swiss Franc (CHF)' },
            { value: 'KRW', label: 'South Korean Won (KRW)' }
          ]
        }
      }
    }
  },
  computed: {
    currentCategory() {
      return this.categories.find(c => c.id === this.selectedCategory) || this.categories[0]
    },
    currentUnits() {
      return this.conversionRates[this.selectedCategory]?.units || []
    },
    popularRates() {
      if (!this.exchangeRates.rates) return []
      const popular = ['USD', 'EUR', 'GBP', 'JPY', 'CNY', 'INR']
      return popular.map(code => ({
        code: code,
        rate: this.exchangeRates.rates[code] || 0
      }))
    },
    commonConversions() {
      const conversions = {
        length: [
          { label: '1 inch = 2.54 cm', fromUnit: 'in', toUnit: 'cm', fromValue: 1 },
          { label: '1 foot = 0.3048 m', fromUnit: 'ft', toUnit: 'm', fromValue: 1 },
          { label: '1 mile = 1.609 km', fromUnit: 'mi', toUnit: 'km', fromValue: 1 },
          { label: '1 meter = 3.281 ft', fromUnit: 'm', toUnit: 'ft', fromValue: 1 }
        ],
        weight: [
          { label: '1 kg = 2.205 lb', fromUnit: 'kg', toUnit: 'lb', fromValue: 1 },
          { label: '1 lb = 0.454 kg', fromUnit: 'lb', toUnit: 'kg', fromValue: 1 },
          { label: '1 oz = 28.35 g', fromUnit: 'oz', toUnit: 'g', fromValue: 1 }
        ],
        temperature: [
          { label: '0°C = 32°F', fromUnit: 'c', toUnit: 'f', fromValue: 0 },
          { label: '100°C = 212°F', fromUnit: 'c', toUnit: 'f', fromValue: 100 },
          { label: '32°F = 0°C', fromUnit: 'f', toUnit: 'c', fromValue: 32 }
        ],
        volume: [
          { label: '1 liter = 33.814 oz', fromUnit: 'l', toUnit: 'floz', fromValue: 1 },
          { label: '1 gallon = 3.785 L', fromUnit: 'gal', toUnit: 'l', fromValue: 1 },
          { label: '1 cup = 236.6 ml', fromUnit: 'cup', toUnit: 'ml', fromValue: 1 }
        ]
      }
      return conversions[this.selectedCategory] || []
    }
  },
  mounted() {
    this.convertFrom()
    this.fetchExchangeRates()
  },
  methods: {
    convertFrom() {
      if (this.selectedCategory === 'temperature') {
        this.convertTemperature()
      } else if (this.selectedCategory === 'currency') {
        this.convertCurrency()
      } else {
        this.convertStandard()
      }
    },
    convertTo() {
      if (this.selectedCategory === 'temperature') {
        const temp = this.toValue
        this.fromValue = this.convertTemperatureValue(temp, this.toUnit, this.fromUnit)
      } else if (this.selectedCategory === 'currency') {
        const rate = this.getCurrencyRate(this.toUnit, this.fromUnit)
        this.fromValue = this.toValue / rate
      } else {
        const rate = this.getConversionRate(this.toUnit, this.fromUnit)
        this.fromValue = this.toValue / rate
      }
    },
    convertStandard() {
      const rate = this.getConversionRate(this.fromUnit, this.toUnit)
      this.toValue = this.fromValue * rate
    },
    convertTemperature() {
      this.toValue = this.convertTemperatureValue(this.fromValue, this.fromUnit, this.toUnit)
    },
    convertTemperatureValue(value, from, to) {
      let celsius
      // Convert to Celsius first
      if (from === 'c') celsius = value
      else if (from === 'f') celsius = (value - 32) * 5/9
      else if (from === 'k') celsius = value - 273.15
      
      // Convert from Celsius to target
      if (to === 'c') return celsius
      if (to === 'f') return celsius * 9/5 + 32
      if (to === 'k') return celsius + 273.15
      return value
    },
    convertCurrency() {
      const rate = this.getCurrencyRate(this.fromUnit, this.toUnit)
      this.toValue = this.fromValue * rate
    },
    getConversionRate(from, to) {
      const rates = this.conversionRates[this.selectedCategory]
      if (!rates || !rates.toBase) return 1
      const fromBase = rates.toBase[from] || 1
      const toBase = rates.toBase[to] || 1
      return fromBase / toBase
    },
    getCurrencyRate(from, to) {
      if (!this.exchangeRates.rates) return 1
      const baseRate = this.exchangeRates.rates[from]
      const targetRate = this.exchangeRates.rates[to]
      if (!baseRate || !targetRate) return 1
      return targetRate / baseRate
    },
    getUnitLabel(unitValue) {
      const unit = this.currentUnits.find(u => u.value === unitValue)
      return unit ? unit.label.split(' ')[0] : unitValue
    },
    formatNumber(num) {
      if (isNaN(num)) return '0'
      if (num > 1000000) return num.toExponential(4)
      if (num < 0.000001) return num.toExponential(4)
      return num.toFixed(6).replace(/\.?0+$/, '')
    },
    swapUnits() {
      const tempUnit = this.fromUnit
      this.fromUnit = this.toUnit
      this.toUnit = tempUnit
      this.convertFrom()
    },
    applyCommonConversion(conv) {
      this.fromUnit = conv.fromUnit
      this.toUnit = conv.toUnit
      this.fromValue = conv.fromValue
      this.convertFrom()
    },
    async fetchExchangeRates() {
      this.isUpdatingRates = true
      try {
        // Using free API without key from exchangerate.host [citation:6]
        const response = await fetch('https://api.exchangerate.host/latest?base=USD')
        const data = await response.json()
        if (data.success !== false) {
          this.exchangeRates = {
            base: data.base,
            rates: data.rates,
            date: data.date
          }
          this.convertFrom()
          this.showToast('Exchange rates updated!')
        } else {
          // Fallback rates if API fails
          this.setFallbackRates()
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
        this.setFallbackRates()
        this.showToast('Using cached exchange rates')
      } finally {
        this.isUpdatingRates = false
      }
    },
    setFallbackRates() {
      this.exchangeRates = {
        base: 'USD',
        rates: {
          USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CNY: 7.24,
          INR: 83.2, CAD: 1.35, AUD: 1.52, CHF: 0.88, KRW: 1330
        },
        date: new Date().toISOString().split('T')[0]
      }
    },
    showToast(message) {
      this.toastMessage = message
      setTimeout(() => {
        this.toastMessage = ''
      }, 3000)
    }
  },
  watch: {
    selectedCategory() {
      // Reset units when category changes
      const units = this.currentUnits
      if (units.length >= 2) {
        this.fromUnit = units[0].value
        this.toUnit = units[1].value
      }
      this.fromValue = 1
      this.convertFrom()
    }
  }
}
</script>

<style scoped>
.unit-converter {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  z-index: 10;
}

.hero-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
  text-align: center;
}

.hero-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  margin-bottom: 24px;
  color: white;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: white;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.hero-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* Main Container */
.main-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 24px 48px;
  position: relative;
  z-index: 20;
}

/* Category Card */
.category-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.category-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.category-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 10px;
}

.category-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-btn:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.category-btn.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.category-icon {
  font-size: 24px;
}

.category-name {
  font-size: 12px;
  font-weight: 500;
}

/* Converter Card */
.converter-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.converter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.converter-header h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.swap-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.2s;
}

.swap-btn:hover {
  background: #e5e7eb;
  transform: scale(1.05);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.converter-inputs {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 20px;
  align-items: center;
  margin-bottom: 24px;
}

.input-group {
  flex: 1;
}

.input-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  display: flex;
  gap: 12px;
}

.value-input {
  flex: 1;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  outline: none;
  transition: all 0.2s;
}

.value-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.unit-select {
  padding: 14px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;
}

.unit-select:focus {
  border-color: #667eea;
}

.converter-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
}

.arrow-icon {
  width: 32px;
  height: 32px;
  color: #667eea;
}

.conversion-info {
  display: flex;
  justify-content: center;
  gap: 32px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.info-card {
  text-align: center;
  padding: 8px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.info-label {
  font-size: 12px;
  color: #6b7280;
  margin-right: 8px;
}

.info-value {
  font-size: 14px;
  font-weight: 600;
  color: #667eea;
}

/* Currency Card */
.currency-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.currency-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.currency-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.currency-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
}

.status-dot.updating {
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.status-text {
  font-size: 12px;
  color: #6b7280;
}

.refresh-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #e5e7eb;
  transform: rotate(180deg);
}

.refresh-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.currency-note {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 16px;
}

.popular-header {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.rates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

.rate-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
}

.rate-code {
  font-weight: 600;
  color: #1f2937;
}

.rate-value {
  font-family: monospace;
  font-size: 13px;
  color: #667eea;
}

/* Common Card */
.common-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.common-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.common-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 10px;
}

.common-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: #f9fafb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.common-item:hover {
  background: #f3f4f6;
  transform: translateX(4px);
}

.common-label {
  font-size: 13px;
  color: #374151;
}

.common-value {
  font-family: monospace;
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
}

/* Tips Card */
.tips-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.tips-card h3 {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.tip-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: transform 0.2s;
}

.tip-item:hover {
  transform: translateX(4px);
}

.tip-icon {
  font-size: 24px;
}

.tip-content {
  flex: 1;
}

.tip-content strong {
  display: block;
  margin-bottom: 4px;
  color: #1f2937;
}

.tip-content p {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

/* Toast Notification */
.toast-notification {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #1f2937;
  color: white;
  padding: 12px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 1100;
  animation: toastSlideIn 0.3s ease-out;
}

.toast-icon {
  width: 20px;
  height: 20px;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 36px;
  }
  
  .converter-inputs {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  .converter-arrow {
    transform: rotate(90deg);
  }
  
  .category-buttons {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .conversion-info {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }
  
  .rates-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .common-grid {
    grid-template-columns: 1fr;
  }
  
  .tips-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .hero-content {
    padding: 40px 20px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .main-container {
    padding: 20px 16px 32px;
  }
  
  .category-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .input-wrapper {
    flex-direction: column;
  }
  
  .unit-select {
    width: 100%;
  }
}
</style>