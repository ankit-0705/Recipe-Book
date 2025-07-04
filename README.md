# 📖 Recipe Book Application

A personalized digital recipe book built using the **MERN stack**. This app allows users to **register, log in**, and manage their own recipes by adding, updating, and saving them securely. Users can also upload images of their dishes, creating a visually appealing and functional culinary journal.

---

## 🌐 Live Demo
Coming soon...

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **TailwindCSS**
- **DaisyUI**
- **Axios**
- **React Router DOM**
- **React Simple Typewriter**
- **Vanilla Tilt**

### Backend
- **Node.js**
- **Express**
- **MongoDB (Mongoose)**
- **Multer (for image uploads)**
- **dotenv**
- **CORS**
- **Express Validator**
- **Nodemon**
- **Concurrently**

---

## 📑 Pages

- **Landing Page** – Introduction and call-to-action.
- **Register Page** – User registration.
- **Home Page** – Dashboard with personalized recipes.
- **Profile Page** – User info and saved recipes.
- **About Us Page** – Info about the creators or project.

---

## 🔄 Features

- 🔐 **User Authentication** – Register and log in securely.
- 📖 **Personalized Recipe Book** – Save, update, and delete recipes.
- 🖼️ **Image Upload** – Upload a photo with each recipe using Multer.
- 🌍 **Global Data Sharing** – Context API used for global state management.
- 🧩 **Reusable Components** – Organized code with reusable React components.

---

## 📁 Project Structure

recipe-book/
│
├── backend/
│ ├── config/
│ │ └── db.js
│ ├── models/
│ │ ├── recipeInfo.js
│ │ └── userInfo.js
│ ├── routes/
│ │ ├── profilePage.js
│ │ └── recipePage.js
│ └── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── context/
│ │ └── routes/
│ ├── App.jsx
│ ├── index.css
│ ├── main.jsx
│ ├── index.html
│ ├── vite.config.js
│ ├── eslint.config.js
│ └── .gitignore
│
├── .env
├── package.json
├── package-lock.json
└── README.md

🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to open a pull request or submit an issue.

🙌 Acknowledgments
Thanks to open-source libraries and tools that made this project possible:

React

Express

MongoDB

Tailwind CSS

DaisyUI

📬 Contact
For any questions or feedback, reach out via GitHub issues or open a discussion thread.
Let me know if you'd like me to customize this for deployment instructions, add screenshots, or create badges (e.g., build status, license, etc.).

---

## 📦 Installation

### Prerequisites

- Node.js & npm
- MongoDB running locally or on the cloud (e.g., MongoDB Atlas)

### Clone the Repository

```bash
git clone https://github.com/your-username/recipe-book.git
cd recipe-book
