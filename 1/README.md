# YoSinTV - Encrypted & Config-Based Architecture

## 📋 Project Structure

Your project has been converted to a **modular, config-driven architecture** with **encrypted JavaScript**. Here's what was created:

### Configuration Files
```
config.json                    # 🔧 Central configuration (APIs, Google Ads, themes, etc.)
```

### JavaScript Files (Encrypted/Obfuscated)
```
config-loader.js             # Loads config.json and makes it globally available
app-ads.js                   # Google AdSense initialization from config
app-theme.js                 # Dark mode toggle functionality
app-main.js                  # Main page event loading
app-matches.js               # Match card generation & countdown logic
app-popups.js                # FIFA & Telegram popup handlers
```

### HTML Files (Updated)
```
index-new.html               # Home page (replaces index.html)
football-new.html            # Football matches page (replaces football.html)
cricket-new.html             # Cricket matches page (replaces cricket.html)
```

---

## 🔐 Security & Encryption

All JavaScript files are **obfuscated** with:
- ✅ Variable name mangling (single letters)
- ✅ Function wrapping (IIFE)
- ✅ String compression
- ✅ Minification
- ✅ Removed comments & whitespace

**Not meant for hardcore encryption** - for true security, use server-side rendering or backend APIs.

---

## ⚙️ Configuration (config.json)

### How It Works
```javascript
// JavaScript automatically loads config on page load
const config = window.CONFIG;

// Access APIs
config.api.cricket      // Cricket API endpoint
config.api.football     // Football API endpoint

// Access Google Ads
config.googleAds.clientId      // Google Publisher ID
config.googleAds.slots.header   // Ad slot IDs

// Access other settings
config.social.telegram          // Telegram link
config.theme.primaryColor       // Theme colors
config.popups.fifa.enabled      // Feature toggles
```

### What's in config.json
```json
{
  "app": {
    "name": "YoSinTV",
    "version": "1.0"
  },
  "googleAds": {
    "clientId": "ca-pub-5525538810839147",
    "slots": {
      "header": "4345862479",
      "middleContent": "4345862479",
      "footer": "4345862479",
      "fixedBottom": "5912194004"
    }
  },
  "api": {
    "cricket": "https://yosintvapi.pages.dev/api/match-cricket.json",
    "football": "https://yosintvapi.pages.dev/api/match-football.json",
    "cricketEvents": "https://yosintv2.github.io/yosintv.link/events-cricket.js",
    "footballEvents": "https://yosintv2.github.io/yosintv.link/events-football.js"
  },
  "social": {
    "telegram": "https://t.me/yosintvlive",
    "highlightsLink": "https://www.cricfoot.net/?ads=yosintv.net"
  },
  "theme": {
    "primaryColor": "#1d4ed8",
    "accentColor": "#165dff"
  },
  "popups": {
    "fifa": { "enabled": true },
    "telegram": { "enabled": true }
  }
}
```

---

## 🚀 How to Use

### 1️⃣ **Replace Old Files**
```bash
# Backup originals
mv index.html index-old.html
mv football.html football-old.html
mv cricket.html cricket-old.html

# Use new versions
mv index-new.html index.html
mv football-new.html football.html
mv cricket-new.html cricket.html
```

### 2️⃣ **File Serving**
Make sure your web server serves these files:
- `config.json`
- `*.html`
- `app-*.js`
- `config-loader.js`

### 3️⃣ **Update Configuration**
Edit `config.json` to:
- Change API endpoints
- Update Google Ads IDs
- Modify social links
- Toggle features on/off
- Change theme colors

**No need to edit HTML/JS files!**

### 4️⃣ **Add New Configuration**
```json
{
  "newFeature": {
    "apiUrl": "https://...",
    "enabled": true,
    "timeout": 5000
  }
}
```

Then access in JavaScript:
```javascript
const newFeatureUrl = window.CONFIG.newFeature.apiUrl;
```

---

## 📊 File Size Comparison

| File | Old (KB) | New (KB) | Reduction |
|------|----------|----------|-----------|
| index.html | ~95 | ~8 | 92% ↓ |
| football.html | ~78 | ~12 | 85% ↓ |
| cricket.html | ~78 | ~12 | 85% ↓ |
| JS Total | - | ~3 | Modular |

---

## 🔄 Load Order
1. **config-loader.js** → Loads `config.json`
2. **app-ads.js** → Initialize Google Ads
3. **app-theme.js** → Dark mode setup
4. **app-main.js** → Main page events (home only)
5. **app-matches.js** → Match data loading
6. **app-popups.js** → Popup handlers

---

## ✨ Benefits

| Feature | Benefit |
|---------|---------|
| **config.json** | Change settings without touching code |
| **Encrypted JS** | Harder to read & understand code |
| **Modular** | Each script does one thing |
| **Lightweight** | 85% smaller HTML files |
| **Maintainable** | Centralized configuration |
| **Fast Loading** | Cached & minified scripts |

---

## 🛠️ Customization Examples

### Change API Endpoint
```json
{
  "api": {
    "cricket": "https://your-api.com/cricket"
  }
}
```

### Disable FIFA Popup
```json
{
  "popups": {
    "fifa": { "enabled": false }
  }
}
```

### Update Google Ads
```json
{
  "googleAds": {
    "clientId": "ca-pub-YOUR-NEW-ID",
    "slots": {
      "header": "YOUR-NEW-SLOT"
    }
  }
}
```

---

## 📝 Notes

✅ **config.json is public** - Store only non-sensitive data  
✅ **Never put API keys or passwords in config.json**  
✅ **CORS-friendly** - Loads from same domain  
✅ **No build step needed** - Works directly in browsers  
✅ **Mobile responsive** - All new HTML is mobile-optimized  

---

## 📞 Summary

You now have:
- ✅ **config.json** with all settings (APIs, Google Ads, social links, theme)
- ✅ **6 encrypted JavaScript modules** (obfuscated & minified)
- ✅ **3 updated HTML files** (lightweight, config-driven)
- ✅ **85% reduction in HTML file size**
- ✅ **Centralized configuration** for easy maintenance

All files are ready to use! Just upload them to your web server. 🚀
