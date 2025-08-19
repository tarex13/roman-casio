# 🏛️ Roman Casio

*A Casio calculator… but for Roman numerals.*  
Why? Because Roman Numerals, **“MM + XXV = 2025”** makes Math feel fun.  

👉 [Live Demo](https://roman-casio.vercel.app)

---

## Screenshots
![Roman Casio Screenshot](./assets/screenshot.png)

---

## Features
-  **Addition, Subtraction, Multiplication, Division** [+,-,*,/...(maybe more)] with Roman numerals.  
-  **Roman numeral validation** — prevents invalid sequences like `IIII` or `VV`.  
-  **Conversion** — integers back to Roman numerals(if valid).  
-  **Slick UI & animations** powered by TailwindCSS + Framer Motion for powerful animations and good style.  

---

## How It Works
- Input Roman numerals using the on-screen buttons or keyboard.  
- The app enforces the **rules of Roman numerals** (e.g., no more than 3 in a row, only valid subtractive pairs like `IV`, `IX`, `XL`, etc.).  
- You can combine numerals with operators (`+`, `-`, `*`, `/`).  
- Hitting `=` evaluates the expression and returns the result **as a Roman numeral** (or integer if > 3999).  

---

## 🛠️ Tech Stack
- [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)  
- [TailwindCSS](https://tailwindcss.com/)  
- [Framer Motion](https://www.framer.com/motion/)  

---

## 🚀 Run Locally
Clone the repo and start the dev server:

```bash
git clone <your-repo-url>
cd roman-casio
npm install
npm run dev
```

For production build:

```bash
npm run build
npm run preview
```

---

## 🎥 Demo GIF
![Roman Casio Demo](./assets/demo.gif)

---

## ℹ️ Notes
This is a personal project — no contributions planned.  
Built with cleverly placed rules, code, and some patience.  
*(Also: no Gen AI was used in the making of the project itself — just for this README)*  

---
