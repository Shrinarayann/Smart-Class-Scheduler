# 📅 Smart Class Scheduler

Smart Class Scheduler is a web-based application that simplifies university class timetable generation by leveraging graph coloring algorithms. Designed to resolve scheduling conflicts and optimize classroom allocation, it provides an intuitive dashboard for students and faculty.

---

## ✨ Key Features
- 📊 **Graph Coloring Algorithm:** Automatically generates conflict-free timetables.
- 🏫 **Optimized Resource Allocation:** Ensures efficient classroom and resource usage.
- 👥 **User Dashboards:** Personalized student and faculty dashboards for real-time access.
- 🔒 **Authentication:** Secure login and session management.
- 🌐 **Responsive UI:** Accessible across devices with a modern web interface.

---

## 🛠️ Tech Stack
| Layer          | Technology                  |
|----------------|------------------------------|
| **Frontend**   | React.js, Tailwind CSS       |
| **Backend**    | Flask (Python)               |
| **Database**   | MongoDB                      |
| **Algorithms** | Graph Coloring (Greedy)      |
| **Deployment** | Render                        |

---

## 🚀 Getting Started

### 📦 Clone and Install
```bash
git clone https://github.com/Shrinarayann/Smart-Class-Scheduler.git
cd Smart-Class-Scheduler
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```
Backend runs at: `http://localhost:5000`

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs at: `http://localhost:3000`

---

## ⚡ How It Works
1. **Input Data:** Add classes, rooms, and faculty constraints.
2. **Generate Timetable:** The algorithm calculates an optimized, conflict-free schedule.
3. **View Dashboard:** Students and faculty can access schedules in real-time.
4. **Manage Updates:** Modify schedules dynamically as per requirements.

---

## 📡 API Endpoints
### POST `/api/generate_schedule`
Generates a timetable based on input constraints.

### GET `/api/view_schedule`
Fetches the generated timetable for users.

---

## 🌱 Future Enhancements
- Multi-campus scheduling support
- Faculty preference-based slot allocation
- Notification system for schedule changes
- Integration with university ERP systems

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
