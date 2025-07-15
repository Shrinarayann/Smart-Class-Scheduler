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
## Login Pages

<img width="990" height="2310" alt="Picture 1" src="https://github.com/user-attachments/assets/d0202d41-7226-4b60-84b2-119a8292e676" />


## Admin Page

![WhatsApp Image 2025-04-16 at 08 35 24](https://github.com/user-attachments/assets/7a5f9624-7660-4133-abdd-5b3f06a68e02)

![WhatsApp Image 2025-04-16 at 08 35 25](https://github.com/user-attachments/assets/3b6d229b-681f-464b-ab00-fb1f83d4b27c)

![WhatsApp Image 2025-04-16 at 08 35 25 (1)](https://github.com/user-attachments/assets/b501934f-e618-4023-8e12-6c55bd6bc2b3)

![WhatsApp Image 2025-04-16 at 08 35 25 (2)](https://github.com/user-attachments/assets/0b6a85ad-9d19-49c6-8f80-d4b701729d75)

## Student Page

![Picture 2](https://github.com/user-attachments/assets/a24cd745-d121-4e16-8cc1-a63df9081a8f)

![Picture 3](https://github.com/user-attachments/assets/78250441-893e-4447-a3c7-54c889ef2711)

![Picture 4](https://github.com/user-attachments/assets/98636358-4ac5-4ddc-bf9a-c14f1b8acbb7)

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
