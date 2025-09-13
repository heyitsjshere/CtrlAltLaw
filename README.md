Ctrl Lit Law presents...LawHive!

⸻

🚀 Features
	•	Smart NLP (Singapore-specific acronyms, intent detection, entity recognition)
	•	Multi-source integration (Hansard, press releases, official social media)
	•	Cross-verification engine (contradiction detection, timeline tracking, confidence scoring)
	•	Side-by-side comparisons & dual interfaces (lawyer vs public)
	•	Full source attribution with links & metadata

⸻

⚙️ Tech Stack
	•	Frontend: React, TypeScript, React Router DOM
	•	Backend: Node.js, Express, OpenAI API (mock API for demo)
	•	Other: RESTful API, modular architecture, ESLint, etc.

⸻

📦 Dependencies

Frontend

cd frontend
npm install

Key dependencies:
	•	react
	•	react-dom
	•	react-router-dom
	•	typescript (and @types/* for TS support)

Backend

cd backend
npm install

Key dependencies:
	•	express
	•	dotenv
	•	axios (if fetching data)
	•	openai (or whichever AI lib you use)

⸻

▶️ Running the Project

Start frontend

cd frontend
npm start   # or npm run dev if using Vite

Start backend

cd backend
npm run dev   # if nodemon
# or
npm start

App should now be available at http://localhost:3000 (frontend) and API at http://localhost:5000 (backend).

⸻

📂 Folder Structure

/frontend   -> React client
/backend    -> Node.js server


⸻

Notes
	•	Requires Node.js v18+ (check with node -v).
	•	Uses mock API for demo reliability due to 24-hour hackathon constraints. Core logic tested and ready for live data integration.
	•	Remember to create a .env file in backend/ with your API keys. Example:

OPENAI_API_KEY=your_key_here



⸻

👥 Contributors
	•	Lim Junsheng
    •   Marcus Chew Wen Geng
    •   Kimerlin Foo
    •   Megan Tan
    •   Neo Shao qin