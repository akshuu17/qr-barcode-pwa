# 🌌 QR Barcode PWA — Premium Logistics Suite

[![React Version](https://img.shields.io/badge/react-v19.0-blue.svg?logo=react)](https://react.dev/)
[![Vite Speed](https://img.shields.io/badge/vite-v8.0-indigo.svg?logo=vite)](https://vite.dev/)
[![TypeScript Safe](https://img.shields.io/badge/typescript-v6.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/tailwind_css-v4.0-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PWA Installable](https://img.shields.io/badge/pwa-installable-090d16.svg?logo=progressive-web-apps)](https://vite-pwa-org.netlify.app/)
[![Vercel Deployed](https://img.shields.io/badge/vercel-deployed-black.svg?logo=vercel)](https://vercel.com/)

A modern, production-ready, highly interactive **Progressive Web App (PWA)** styled in a breathtaking **3D Frosted Glassmorphism** visual theme. 

Users fill out a sleek form, secure transactions sync instantly to a **Google Sheets** database via a custom Google Apps Script API, and the app auto-generates high-resolution **QR Codes** and linear **1D Barcodes**. Includes an offline-first **LocalStorage fallback database** and an interactive **"My Codes" Generated History Drawer** in the navigation bar.

---

## 🌟 Key Features

*   🌌 **3D Cosmic Glassmorphism**: Stunning space obsidian backdrop with three slowly-floating, glowing colored mesh spheres that refract elegantly through the frosted registration card.
*   ⚡ **CORS Preflight Bypass Sync**: Employs an optimized `text/plain;charset=utf-8` JSON stringified pipeline to bypass standard browser `OPTIONS` preflight blocks, enabling seamless writing directly to your Google Sheets.
*   💾 **Resilient Offline Backups**: If network drops or Google Sheets rate-limits, the API fallback automatically saves data in local memory (`LocalStorage`) so QR/Barcode generation is **never interrupted**.
*   📂 **NavBar "My Codes" History Drawer**: A slide-over database panel in the navigation bar that displays all historically generated barcodes and QR codes from local memory. You can view, copy IDs, download, or delete records.
*   🔍 **Unified Scan Inspector (`/view/:id`)**: When someone scans the QR or Barcode, they land on a clean, professional card showing their full registered details at the top, and their corresponding codes at the bottom.
*   📲 **Installable PWA**: Meets all strict PWA criteria with high-resolution PNG manifest icons and immediate Service Worker registration hooks (`registerSW({ immediate: true })`), enabling direct, native home screen installation prompts.

---

## 🛠️ Technology Stack

*   **Core Framework**: React 19 + TypeScript + Vite
*   **Styling Engine**: Tailwind CSS v4.0 (CSS-first `@theme` configuration)
*   **Routing**: React Router DOM (Single-page rewrites configured for Vercel)
*   **HTTP Client**: Axios (configured with 15s execution timeouts)
*   **PWA compiler**: `vite-plugin-pwa` (Workbox caching for offline loads)
*   **Utilities**: `qrcode.react`, `react-barcode`, `canvas-confetti`, `lucide-react`, `react-hot-toast`

---

## 💻 Local Setup & Installation

Follow these steps to run the application on your computer:

### 1. Clone the repository:
```bash
git clone <your-github-repository-url>
cd qr-barcode-pwa
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Setup your environment variables:
Create a `.env` file at the project root and add your Google Apps Script URL:
```bash
VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
```
*(Leave it blank to test the app instantly on the LocalStorage backup database!)*

### 4. Run the local development server:
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 📊 Google Sheets Apps Script Setup

To link the PWA with your Google Spreadsheet, follow these steps:

1.  Create a new **Google Sheet**.
2.  Open **Extensions** -> **Apps Script**.
3.  Paste the following robust, preflight-ready script into the editor:

```javascript
// 1. POST Request: Saves registration data to Google Sheets
function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Generate readable Logistics ID (e.g. REC-G8T9K4)
    var id = "REC-" + Math.random().toString(36).substring(2, 8).toUpperCase();
    var createdAt = new Date().toISOString();
    
    // Append to sheet: ID, Name, Mobile, Email, Address, Date
    sheet.appendRow([id, data.name, data.mobile, data.email, data.address, createdAt]);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      id: id
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// 2. GET Request: Fetches registration data by ID from Google Sheets
function doGet(e) {
  try {
    var id = e.parameter.id;
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][0] === id) {
        var record = {
          id: rows[i][0],
          name: rows[i][1],
          mobile: rows[i][2],
          email: rows[i][3],
          address: rows[i][4],
          createdAt: rows[i][5]
        };
        return ContentService.createTextOutput(JSON.stringify(record))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ error: "Record not found" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4.  Click **Deploy** -> **New deployment**.
5.  Select **Web App**.
6.  Set **Execute as** to **"Me (your-email)"**.
7.  Set **Who has access** to **"Anyone"** *(crucial for public PWA read/write access)*.
8.  Click **Deploy** and copy the **Web app URL** (ending in `/exec`). Add this URL to your `.env` file under `VITE_API_URL`.

---

## 🚀 Deployment on Vercel

If you deploy this repository on Vercel, make sure to configure these settings:

### 1. single-page application Routing (`vercel.json`)
The project contains a pre-configured `vercel.json` file to ensure React Router paths (like `/success` and `/view/:id`) don't return 404s when refreshed on Vercel:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Add Environment Variables on Vercel Settings
Since `.env` is ignored by git for security, add your environment variable in Vercel Dashboard:
*   **Key**: `VITE_API_URL`
*   **Value**: `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`
*   *Note: After adding the variable, trigger a **Redeploy** on Vercel for the changes to apply!*

### 3. Disable Vercel Deployment Protection
If Vercel prompts users with a "Vercel Login" or password screen when scanning codes on a second phone:
1.  Go to your Vercel Project -> **Settings** -> **Deployment Protection**.
2.  Set **Protection Mode** to **Disabled**.
3.  Click **Save**. Now your PWA is completely public and scan-ready!
