# 📚 Virtual Classroom Management System

A full-stack web application to manage online classrooms, built with **MERN stack** (MongoDB, Express.js, React.js, Node.js).

This system includes **student and teacher dashboards**, session management, file uploads, Q&A forum, test management, and attendance/marks tracking.

---

## 🚀 Features

### ✅ Admin
- Approve/reject student and teacher registrations
- Manage subjects, announcements, and tests
- View all users and their dashboards
- Monitor attendance and marks

### 👨‍🏫 Teacher
- Conduct sessions (add from & to time with links)
- Upload resources (images, videos, PDFs, docs)
- View and respond to student Q&A
- Assign tests and mark attendance

### 👨‍🎓 Student
- Join live sessions via links
- View uploaded resources
- Ask questions (Q&A)
- View tests, announcements, attendance, and marks

---

## 🧑‍💻 Technologies Used

| Tech          | Description                          |
|---------------|--------------------------------------|
| React         | Frontend UI library                  |
| Node.js       | JavaScript runtime (backend)         |
| Express.js    | Server-side framework                |
| MongoDB       | NoSQL database                       |
| Axios         | For making API requests              |
| Multer        | Middleware for file uploads          |
| MongoDB Atlas | Cloud-hosted MongoDB cluster         |
| CSS (Inline)  | UI styling in React                  |

---

## 📁 Project Structure

virtual-classroom/ │ ├── client/ # React frontend │ ├── components/ │ ├── pages/ │ ├── routes/ │ └── App.js │ ├── server/ # Node + Express backend │ ├── models/ │ ├── routes/ │ ├── controllers/ │ ├── uploads/ │ └── server.js │ ├── README.md └── .env


---

## 📦 Dependencies

### 🔧 Backend (`/server`) and 💻 Frontend (`/client or /virtualclassroom`)

```bash
- npm install express mongoose cors dotenv multer body-parser
- npm install axios react-router-dom

---

## 🧪 API Highlights 

| Method | Route                    | Description                    |
|--------|--------------------------|--------------------------------|
| POST   | /api/users/register      | User registration              |
| POST   | /api/users/login         | Login based on role & email    |
| POST   | /api/resources/upload    | Upload resource files          |
| POST   | /api/questions/ask       | Ask a question                 |
| GET    | /api/questions           | View all questions             |
| POST   | /api/tests/create        | Add a test                     |
| DELETE | /api/tests/:id           | Delete a test                  |
| POST   | /api/attendance/mark     | Mark attendance                |

> ✅ **All routes are protected** by **role-based access control** (admin, teacher, student)

---

## 📸 Screenshots

![Screenshot 1](https://github.com/user-attachments/assets/188711f8-0056-4ae3-afbf-7adb300a6456)  
![Screenshot 2](https://github.com/user-attachments/assets/f6b5d2f3-7069-4799-aad1-f55a72aaed21)  
![Screenshot 3](https://github.com/user-attachments/assets/5939ebb0-d813-4599-86b1-e7e1954ad7b9)  
![Screenshot 4](https://github.com/user-attachments/assets/f6cfe0b5-e1c1-4fd0-ac4a-5e44cae3b5d7)

---

## 🧠 Key Learnings

- 🧩 Reusable component design in React  
- ⚙️ Axios + Express for smooth API integration  
- 🧬 MongoDB schema relationships  
- 📁 File uploads with Multer  
- 🔐 Role-based routing & dashboard management  
- 🏗️ Deployment-ready architecture  

---

## 🚀 Future Enhancements

- 💬 Real-time chat for sessions  
- 🔔 Notifications for students  
- 📊 Admin analytics dashboard  


🙋‍♂️ Author
Varun B P
🧑‍💼 https://www.linkedin.com/in/varun-b-p-/
📧 varunbp98@gmail.com
