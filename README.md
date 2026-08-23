# Playwright Automation - OrangeHRM

Repository ini berisi test automation untuk aplikasi demo OrangeHRM menggunakan **Playwright** dan **TypeScript**. 

Project ini dibangun sebagai bagian dari transisi QA Manual ke Automation Engineering, berfokus pada pembuatan test yang stabil, mudah dirawat (maintainable), dan mengikuti best practices (AAA Pattern, Semantic Locators).

## 🛠 Tech Stack
- **Framework:** Playwright Test
- **Language:** TypeScript
- **Node.js:** LTS version recommended
- **Target Application:** [OrangeHRM Demo](https://opensource-demo.orangehrmlive.com/)

## 📂 Struktur Project
```text
.
├── tests/                  # Berisi semua file spec test
│   ├── orangeHRM/          # Test suite spesifik OrangeHRM
│   └── ...
├── test-data/              # Data eksternal untuk testing (jika ada)
├── playwright.config.ts    # Konfigurasi utama (browser, timeout, reporter)
├── package.json            # Dependencies dan scripts
└── .gitignore              # File yang diabaikan oleh Git (node_modules, auth state, dll)

🚀 Cara Menjalankan di Lokal
Ikuti langkah berikut untuk menjalankan test di laptop Anda (Windows/macOS/Linux):
1. Prasyarat
Pastikan Node.js (LTS) sudah terinstall. Cek versi dengan command:
node -v
npm -v
npm i
npx playwright install
npx playwright test tests/nama-testcase
npx playwright show-report
