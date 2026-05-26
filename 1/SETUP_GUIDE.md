# 🚀 Quick Setup Guide

## Files Created (11 Total)

### 📋 Configuration
- **config.json** - Master configuration file (APIs, ads, social links, colors)

### 🔐 JavaScript (Encrypted/Obfuscated)
- **config-loader.js** - Loads config.json globally
- **app-ads.js** - Google AdSense manager
- **app-theme.js** - Dark mode toggle
- **app-main.js** - Main page functionality
- **app-matches.js** - Cricket/Football match loader
- **app-popups.js** - Popups (FIFA + Telegram)

### 🌐 HTML (Updated & Lightweight)
- **index-new.html** - Home page (use instead of index.html)
- **football-new.html** - Football page (use instead of football.html)
- **cricket-new.html** - Cricket page (use instead of cricket.html)

### 📚 Documentation
- **README.md** - Full documentation
- **SETUP_GUIDE.md** - This file!

---

## ⚡ 3-Step Installation

### Step 1: Backup Old Files
```bash
# Save your original files
mv index.html index-old.html
mv football.html football-old.html
mv cricket.html cricket-old.html
```

### Step 2: Use New Files
```bash
# Rename new files
mv index-new.html index.html
mv football-new.html football.html
mv cricket-new.html cricket.html
```

### Step 3: Upload to Server
Upload all these files to your web server:
```
your-domain.com/
├── config.json
├── index.html
├── football.html
├── cricket.html
├── config-loader.js
├── app-ads.js
├── app-theme.js
├── app-main.js
├── app-matches.js
└── app-popups.js
```

✅ Done! Your site is now running with encrypted code.

---

## 🔧 Customization (Most Common)

### Change Cricket API
Edit `config.json`:
```json
{
  "api": {
    "cricket": "https://your-new-api.com/cricket.json"
  }
}
```

### Change Google Ads ID
Edit `config.json`:
```json
{
  "googleAds": {
    "clientId": "ca-pub-YOUR-NEW-ID-HERE"
  }
}
```

### Change Telegram Link
Edit `config.json`:
```json
{
  "social": {
    "telegram": "https://t.me/YOUR-CHANNEL"
  }
}
```

### Change Primary Color
Edit `config.json`:
```json
{
  "theme": {
    "primaryColor": "#YOUR-COLOR-CODE"
  }
}
```

### Disable Popups
Edit `config.json`:
```json
{
  "popups": {
    "fifa": { "enabled": false },
    "telegram": { "enabled": false }
  }
}
```

---

## 📊 What Changed?

| Aspect | Before | After |
|--------|--------|-------|
| HTML Size | 95-250 KB | 8-12 KB |
| Code Visibility | Plain & Readable | Obfuscated |
| Configuration | Hardcoded | Centralized (config.json) |
| Updates | Edit HTML/JS | Edit config.json only |
| Mobile Ready | ✓ | ✓ (improved) |
| Ad Management | Hardcoded | Config-driven |
| API Updates | Code change needed | config.json only |

---

## 🔐 Security Notes

✅ **What's Encrypted:**
- JavaScript logic (obfuscated & minified)
- Function names
- Variable names
- Code flow

⚠️ **What's NOT Encrypted:**
- config.json (intentionally public)
- HTML structure
- CSS styling
- API endpoints

💡 **Best Practice:**
Store sensitive data (API keys, secrets) on your backend, NOT in config.json.

---

## 🐛 Troubleshooting

### "config.json not found"
- Make sure config.json is in the same directory as HTML files
- Check file permissions (should be readable)

### "Ads not showing"
- Verify Google Publisher ID in config.json
- Check browser console for errors
- Wait 24-48 hours for Google Ads to activate

### "Dark mode not working"
- Clear browser cache (Ctrl+F5)
- Check if JavaScript is enabled
- Verify app-theme.js is loaded

### "Popups not appearing"
- Check if popups are enabled in config.json
- Verify app-popups.js is loaded
- Check browser's popup blocker

---

## 📱 File Hosting Options

You can host these files on:
- Your own web server (Apache, Nginx)
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any web hosting provider

---

## 💾 Backup Your config.json

Always keep a backup of config.json!
```bash
cp config.json config.json.backup
```

---

## 🎉 You're All Set!

Your website now has:
- ✅ Encrypted JavaScript code
- ✅ Centralized configuration
- ✅ 85% smaller HTML files
- ✅ Easy maintenance & updates
- ✅ Professional structure

Need help? Check **README.md** for detailed documentation.

Happy deploying! 🚀
