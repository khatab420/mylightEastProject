<template>
  <div class="date-converter">
    <div class="converter-header">
      <h2>📅 Calendar Converter</h2>
      <p class="subtitle">Convert between Gregorian, Solar Hijri (Jalali) & Lunar Hijri (Islamic)</p>
    </div>

    <div class="converter-panels">
      <!-- Source Calendar Panel -->
      <div class="panel source-panel">
        <div class="panel-header">
          <h3>📆 From</h3>
          <select v-model="sourceCalendar" class="calendar-select">
            <option value="gregorian">Gregorian (Miladi)</option>
            <option value="solar-hijri">Solar Hijri (Jalali / Shamsi)</option>
            <option value="lunar-hijri">Lunar Hijri (Islamic / Qamari)</option>
          </select>
        </div>

        <div class="date-inputs" :key="sourceCalendar">
          <!-- Gregorian Inputs -->
          <template v-if="sourceCalendar === 'gregorian'">
            <div class="input-group">
              <label>Year</label>
              <input type="number" v-model.number="sourceDate.year" @input="convertFromSource" min="1" max="9999">
            </div>
            <div class="input-group">
              <label>Month</label>
              <select v-model.number="sourceDate.month" @change="convertFromSource">
                <option v-for="m in 12" :key="m" :value="m">{{ m }} - {{ gregorianMonths[m-1] }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>Day</label>
              <select v-model.number="sourceDate.day" @change="convertFromSource">
                <option v-for="d in daysInGregorianMonth" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </template>

          <!-- Solar Hijri Inputs -->
          <template v-if="sourceCalendar === 'solar-hijri'">
            <div class="input-group">
              <label>Year</label>
              <input type="number" v-model.number="sourceDate.year" @input="convertFromSource" min="1" max="1500">
            </div>
            <div class="input-group">
              <label>Month</label>
              <select v-model.number="sourceDate.month" @change="convertFromSource">
                <option v-for="(m, idx) in solarMonths" :key="idx" :value="idx+1">{{ idx+1 }} - {{ m }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>Day</label>
              <select v-model.number="sourceDate.day" @change="convertFromSource">
                <option v-for="d in daysInSolarMonth" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </template>

          <!-- Lunar Hijri Inputs -->
          <template v-if="sourceCalendar === 'lunar-hijri'">
            <div class="input-group">
              <label>Year</label>
              <input type="number" v-model.number="sourceDate.year" @input="convertFromSource" min="1" max="1500">
            </div>
            <div class="input-group">
              <label>Month</label>
              <select v-model.number="sourceDate.month" @change="convertFromSource">
                <option v-for="(m, idx) in lunarMonths" :key="idx" :value="idx+1">{{ idx+1 }} - {{ m }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>Day</label>
              <select v-model.number="sourceDate.day" @change="convertFromSource">
                <option v-for="d in daysInLunarMonth" :key="d" :value="d">{{ d }}</option>
              </select>
            </div>
          </template>
        </div>

        <!-- Quick Today Button -->
        <button class="today-btn" @click="setToday">📌 Today</button>
      </div>

      <!-- Converted Results -->
      <div class="panel results-panel">
        <div class="panel-header">
          <h3>📅 To</h3>
        </div>

        <div class="result-card gregorian-result">
          <div class="result-icon">🌍</div>
          <div class="result-details">
            <h4>Gregorian (Miladi)</h4>
            <div class="date-display">{{ converted.gregorian }}</div>
            <div class="weekday" v-if="converted.weekday">{{ converted.weekday }}</div>
          </div>
        </div>

        <div class="result-card solar-result">
          <div class="result-icon">☀️</div>
          <div class="result-details">
            <h4>Solar Hijri (Jalali / Shamsi)</h4>
            <div class="date-display">{{ converted.solarHijri }}</div>
          </div>
        </div>

        <div class="result-card lunar-result">
          <div class="result-icon">🌙</div>
          <div class="result-details">
            <h4>Lunar Hijri (Islamic / Qamari)</h4>
            <div class="date-display">{{ converted.lunarHijri }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Extra Info -->
    <div class="info-bar" v-if="converted.julianDay">
      <span>📐 Julian Day: {{ converted.julianDay.toFixed(2) }}</span>
      <span>📅 Weekday number: {{ converted.weekdayNum }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateConverter',
  data() {
    return {
      sourceCalendar: 'gregorian',
      sourceDate: {
        year: 2024,
        month: 3,
        day: 21
      },
      converted: {
        gregorian: '',
        solarHijri: '',
        lunarHijri: '',
        weekday: '',
        weekdayNum: 0,
        julianDay: 0
      },
      gregorianMonths: [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ],
      solarMonths: [
        'Farvardin', 'Ordibehesht', 'Khordad', 'Tir', 'Mordad', 'Shahrivar',
        'Mehr', 'Aban', 'Azar', 'Dey', 'Bahman', 'Esfand'
      ],
      lunarMonths: [
        'Muharram', 'Safar', 'Rabi\' al-awwal', 'Rabi\' al-thani',
        'Jumada al-awwal', 'Jumada al-thani', 'Rajab', 'Sha\'ban',
        'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
      ]
    }
  },
  computed: {
    daysInGregorianMonth() {
      return this.getDaysInGregorian(this.sourceDate.year, this.sourceDate.month)
    },
    daysInSolarMonth() {
      return this.getDaysInSolar(this.sourceDate.year, this.sourceDate.month)
    },
    daysInLunarMonth() {
      return this.getDaysInLunar(this.sourceDate.year, this.sourceDate.month)
    }
  },
  watch: {
    sourceCalendar() {
      this.setToday()
    }
  },
  mounted() {
    this.setToday()
  },
  methods: {
    // ------------------- Core Conversion Algorithms -------------------
    // Gregorian to Julian Day Number (JD) - Accurate algorithm
    gregorianToJD(year, month, day) {
      if (month <= 2) {
        year -= 1
        month += 12
      }
      const A = Math.floor(year / 100)
      const B = 2 - A + Math.floor(A / 4)
      const JD = Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5
      return JD
    },

    // JD to Gregorian
    jdToGregorian(jd) {
      const J = Math.floor(jd + 0.5)
      const F = jd + 0.5 - J
      let a = J + 32044
      let b = Math.floor((4 * a + 3) / 146097)
      let c = a - Math.floor((146097 * b) / 4)
      let d = Math.floor((4 * c + 3) / 1461)
      let e = c - Math.floor((1461 * d) / 4)
      let m = Math.floor((5 * e + 2) / 153)
      let day = e - Math.floor((153 * m + 2) / 5) + 1
      let month = m + 3 - 12 * Math.floor(m / 10)
      let year = 100 * b + d - 4800 + Math.floor(m / 10)
      return { year, month, day }
    },

    // Solar Hijri (Jalali) to JD - Based on accurate algorithm by Kazemi / Birashk
    solarToJD(year, month, day) {
      let gregYear = year + 621
      let gregMonth = month + 3
      let gregDay = day
      if (month < 4) {
        gregYear -= 1
        gregMonth = month + 9
        gregDay = day
      }
      // Adjust for leap years
      const epBase = (gregYear - 1) * 365 + Math.floor((gregYear - 1) / 4) - Math.floor((gregYear - 1) / 100) + Math.floor((gregYear - 1) / 400)
      let daysSince = 0
      if (month <= 6) daysSince = (month - 1) * 31 + day - 1
      else daysSince = (month - 1) * 30 + day - 1 + 6
      
      // March 21 of gregYear is start of solar year (approx)
      const march21JD = this.gregorianToJD(gregYear, 3, 21)
      return march21JD + daysSince
    },

    // JD to Solar Hijri (Jalali)
    jdToSolar(jd) {
      const gregDate = this.jdToGregorian(jd)
      let year = gregDate.year - 621
      let month = 10
      let day = gregDate.day
      
      // Find the start of solar year (Norooz = March 20/21)
      let noroozJD = this.gregorianToJD(gregDate.year, 3, 20)
      if (jd < noroozJD) {
        year -= 1
        noroozJD = this.gregorianToJD(gregDate.year - 1, 3, 20)
      }
      const dayOfYear = Math.floor(jd - noroozJD)
      
      if (dayOfYear < 186) {
        month = Math.floor(dayOfYear / 31) + 1
        day = (dayOfYear % 31) + 1
      } else {
        const adjusted = dayOfYear - 186
        month = Math.floor(adjusted / 30) + 7
        day = (adjusted % 30) + 1
      }
      return { year, month, day }
    },

    // Lunar Hijri (Islamic) to JD - Based on accurate astronomical epoch (Hijri epoch: July 16, 622 CE)
    lunarToJD(year, month, day) {
      // Hijri epoch: 1948439.5 (Julian Day of July 16, 622 CE)
      let JD = 1948439.5 + (year - 1) * 354.367068
      // Add months
      for (let i = 1; i < month; i++) {
        JD += this.getLunarMonthLength(year, i)
      }
      JD += day - 1
      return JD
    },

    // JD to Lunar Hijri (Islamic) - Using approximation and correction
    jdToLunar(jd) {
      const hijriEpoch = 1948439.5
      let year = Math.floor((jd - hijriEpoch) / 354.367068) + 1
      let remaining = jd - (hijriEpoch + (year - 1) * 354.367068)
      let month = 1
      while (month <= 12) {
        const monthLen = this.getLunarMonthLength(year, month)
        if (remaining <= monthLen) break
        remaining -= monthLen
        month++
      }
      let day = Math.floor(remaining) + 1
      // Adjust for edge cases
      if (month > 12) {
        month = 1
        year += 1
        day = 1
      }
      return { year, month, day }
    },

    // Get lunar month length based on astronomical cycles (30-year cycle with 11 leap days)
    getLunarMonthLength(year, month) {
      // Standard Islamic calendar: 30-year cycle with 354, 355 days
      // Odd months 30 days, even 29, with leap year adding 1 day to last month
      const isLeap = this.isLunarLeapYear(year)
      if (month === 12 && isLeap) return 30
      return (month % 2 === 1) ? 30 : 29
    },

    isLunarLeapYear(year) {
      // 30-year cycle: years 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29 are leap
      const cycle = (year - 1) % 30
      const leapYears = [1, 4, 6, 9, 12, 15, 17, 20, 23, 25, 28] // zero-indexed within cycle
      return leapYears.includes(cycle)
    },

    getDaysInGregorian(year, month) {
      return new Date(year, month, 0).getDate()
    },

    getDaysInSolar(year, month) {
      if (month <= 6) return 31
      if (month <= 11) return 30
      // Esfand: 29 or 30 depending on leap year
      return this.isSolarLeapYear(year) ? 30 : 29
    },

    isSolarLeapYear(year) {
      // Jalali leap years follow a 33-year cycle
      const remains = (year - 1348) % 33
      const leapYears = [1, 5, 9, 13, 17, 22, 26, 30]
      return leapYears.includes(remains)
    },

    getDaysInLunar(year, month) {
      return this.getLunarMonthLength(year, month)
    },

    // Main conversion driver
    convertFromSource() {
      let jd = 0
      const { year, month, day } = this.sourceDate

      // Validate basic ranges
      if (!year || !month || !day) return

      try {
        switch (this.sourceCalendar) {
          case 'gregorian':
            if (day > this.daysInGregorianMonth) return
            jd = this.gregorianToJD(year, month, day)
            break
          case 'solar-hijri':
            if (day > this.daysInSolarMonth) return
            jd = this.solarToJD(year, month, day)
            break
          case 'lunar-hijri':
            if (day > this.daysInLunarMonth) return
            jd = this.lunarToJD(year, month, day)
            break
        }

        // Convert JD to all calendars
        const greg = this.jdToGregorian(jd)
        const solar = this.jdToSolar(jd)
        const lunar = this.jdToLunar(jd)

        this.converted.gregorian = `${greg.year}-${this.pad(greg.month)}-${this.pad(greg.day)}`
        this.converted.solarHijri = `${solar.year}-${this.pad(solar.month)}-${this.pad(solar.day)}`
        this.converted.lunarHijri = `${lunar.year}-${this.pad(lunar.month)}-${this.pad(lunar.day)}`
        this.converted.julianDay = jd
        
        // Weekday calculation (0=Monday? Let's do 0=Sunday for readability)
        const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
        const weekdayNum = (Math.floor(jd + 1.5) % 7)
        this.converted.weekday = weekdayNames[weekdayNum]
        this.converted.weekdayNum = weekdayNum
      } catch (e) {
        console.warn("Conversion error", e)
      }
    },

    setToday() {
      const today = new Date()
      let year, month, day
      switch (this.sourceCalendar) {
        case 'gregorian':
          year = today.getFullYear()
          month = today.getMonth() + 1
          day = today.getDate()
          break
        case 'solar-hijri':
          {
            const jd = this.gregorianToJD(today.getFullYear(), today.getMonth() + 1, today.getDate())
            const solar = this.jdToSolar(jd)
            year = solar.year
            month = solar.month
            day = solar.day
          }
          break
        case 'lunar-hijri':
          {
            const jd = this.gregorianToJD(today.getFullYear(), today.getMonth() + 1, today.getDate())
            const lunar = this.jdToLunar(jd)
            year = lunar.year
            month = lunar.month
            day = lunar.day
          }
          break
      }
      this.sourceDate = { year, month, day }
      this.convertFromSource()
    },

    pad(num) {
      return String(num).padStart(2, '0')
    }
  }
}
</script>

<style scoped>
.date-converter {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.converter-header {
  text-align: center;
  margin-bottom: 30px;
}

.converter-header h2 {
  margin: 0;
  color: #2c3e50;
  font-weight: 600;
}

.subtitle {
  color: #34495e;
  font-size: 0.9rem;
  margin-top: 8px;
}

.converter-panels {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.panel {
  flex: 1;
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.panel:hover {
  transform: translateY(-2px);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
}

.panel-header h3 {
  margin: 0;
  color: #2d3748;
}

.calendar-select {
  padding: 8px 12px;
  border-radius: 12px;
  border: 1px solid #cbd5e0;
  background: #f8fafc;
  font-weight: 500;
  cursor: pointer;
}

.date-inputs {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  min-width: 80px;
}

.input-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 6px;
}

.input-group input, .input-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #fefefe;
}

.input-group input:focus, .input-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102,126,234,0.1);
}

.today-btn {
  width: 100%;
  background: #edf2f7;
  border: none;
  padding: 12px;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: #2d3748;
}

.today-btn:hover {
  background: #e2e8f0;
  transform: scale(0.98);
}

.result-card {
  background: #f8fafc;
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
  border-left: 6px solid;
}

.gregorian-result { border-left-color: #3b82f6; }
.solar-result { border-left-color: #f59e0b; }
.lunar-result { border-left-color: #10b981; }

.result-icon {
  font-size: 2rem;
}

.result-details h4 {
  margin: 0 0 6px 0;
  font-size: 1rem;
  color: #1e293b;
}

.date-display {
  font-size: 1.3rem;
  font-weight: 700;
  font-family: monospace;
  letter-spacing: 1px;
}

.weekday {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 4px;
}

.info-bar {
  margin-top: 24px;
  background: #eef2ff;
  padding: 12px 20px;
  border-radius: 40px;
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #1e40af;
  font-family: monospace;
  flex-wrap: wrap;
}

@media (max-width: 720px) {
  .converter-panels {
    flex-direction: column;
  }
  .date-inputs {
    flex-direction: column;
  }
}
</style>