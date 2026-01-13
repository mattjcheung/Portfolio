# Portfolio

This repository contains the source code for my personal portfolio website, built using modern web technologies and featuring an interactive Three.js background alongside responsive, animated UI components.

---

## ⚠️ Important: Clone Location Matters

**Do NOT clone this repository inside OneDrive, iCloud, or synced Desktop folders.**

Cloud-synced directories (such as OneDrive or Desktop on Windows) are known to cause:
- File locking issues
- Hot-reload failures
- Inconsistent behaviour with Vite’s dev server
- Broken module resolution

### ✅ Recommended
Clone the repository into a **local, non-synced directory**, for example:

```bash
C:\Projects\portfolio
or

bash
Copy code
~/projects/portfolio
This will save you a lot of headaches.

🚀 Running the Project Locally
1. Clone the repository
bash
Copy code
git clone <repo-url>
cd <repo-name>
2. Install dependencies
Make sure you have Node.js (LTS) installed.

bash
Copy code
npm install
3. Start the development server
bash
Copy code
npm run dev
4. Open in browser
Vite will output a local development URL, typically:

arduino
Copy code
http://localhost:5173
Open this link in your browser to view the site.

🛠️ Tech Stack
Vite – Fast development build tool

Three.js – Interactive 3D background and animations

HTML / CSS – Responsive layout and UI

JavaScript (ES Modules) – Application logic

WebGL – GPU-accelerated rendering

📁 Project Structure (Simplified)
text
Copy code
.
├── index.html
├── style.css
├── src/
│   └── main.js
├── assets/
│   └── *.glb
├── package.json
└── README.md
📌 Notes
This project is intended to be run locally using the Vite dev server.

Production builds can be generated using:

bash
Copy code
npm run build
The site is fully responsive and designed to scale across screen sizes.

📫 Contact
If you have any questions or would like to discuss this project:

Email: mattjcheung03@gmail.com

LinkedIn: https://www.linkedin.com/in/mattjcheung/

Thanks for checking it out!

yaml
Copy code

---

### Why this README works well
- Immediately prevents the **OneDrive/Vite issue** (huge)
- Clear setup steps (recruiters *do* try running projects)
- Professional tone without being bloated
- Shows you understand tooling and developer experience

If you want next, I can:
- Add a **“Deployment”** section (GitHub Pages / Netlify)
- Rewrite this to be even more recruiter-facing
- Add badges (Vite, Three.js, Node)

Just let me know.