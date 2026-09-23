# Implementation Plan: ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)
(Project Name: BUGKOShop)

เอกสารฉบับนี้คือแผนการพัฒนา (Roadmap) แบบละเอียด โดยแบ่งการทำงานออกเป็น 16 Phase เพื่อให้การทำงานร่วมกับ AI เป็นไปอย่างมีระบบ ตรวจสอบได้ และสามารถย้อนกลับ (Rollback) ได้หากเกิดข้อผิดพลาด

---

### Phase 0: Requirement and Architecture
- **เป้าหมาย:** สรุปความต้องการและออกแบบสถาปัตยกรรมระบบให้ชัดเจนก่อนลงมือโค้ด
- **งานที่ต้องทำ:** รวบรวมข้อมูล จัดทำเอกสาร System Overview, Requirements, DB Design, API Contract
- **ไฟล์ที่เกี่ยวข้อง:** `docs/planning/*`
- **ผลลัพธ์:** เอกสาร Planning ทั้งหมดครบถ้วน
- **วิธีทดสอบ:** ตรวจสอบความสอดคล้องของเอกสารทั้งหมด
- **Acceptance Criteria:**
  - [x] มีเอกสารครบทุกฉบับตาม Documentation Structure
  - [x] ตกลง Tech Stack ชัดเจน
- **Dependency:** -
- **Git Commit:** `docs: complete phase 0 requirement and architecture planning`
- **ความเสี่ยง:** หากเอกสารขัดแย้งกันอาจทำให้เขียนโค้ดผิดพลาดในอนาคต

---

### Phase 1: Project Setup
- **เป้าหมาย:** สร้างโครงสร้างโปรเจกต์พื้นฐานสำหรับ Frontend และ Backend
- **งานที่ต้องทำ:** Initialize Node.js/Express ในโฟลเดอร์ `backend/`, Initialize React/Vite ในโฟลเดอร์ `frontend/`, ติดตั้ง Dependencies พื้นฐาน (MUI, React Router, Express, CORS, Dotenv)
- **ไฟล์ที่เกี่ยวข้อง:** `package.json` (ทั้งสองฝั่ง), `vite.config.js`, `backend/src/server.js`, `.env.example`
- **ผลลัพธ์:** โครงสร้างโฟลเดอร์พร้อมรัน
- **วิธีทดสอบ:** รัน `npm run dev` ทั้งสองโฟลเดอร์ ต้องไม่มี Error และขึ้นหน้าจอเริ่มต้น
- **Acceptance Criteria:**
  - [x] Frontend รันที่ Port 5173 ได้
  - [x] Backend รันที่ Port 5001 ได้และตอบกลับ "Hello"
- **Dependency:** Phase 0
- **Git Commit:** `chore: setup project structure for frontend and backend`
- **ความเสี่ยง:** Version conflict ของ Node.js หรือ React

---

### Phase 2: Database Schema and Seed Data
- **เป้าหมาย:** สร้างตารางฐานข้อมูลและข้อมูลจำลองเริ่มต้น (Seed Data)
- **งานที่ต้องทำ:** เขียนไฟล์ `schema.sql` และ `seed.sql` ตาม Database Design Overview
- **ไฟล์ที่เกี่ยวข้อง:** `db/init/schema.sql`, `db/init/seed.sql`
- **ผลลัพธ์:** ไฟล์ SQL ที่พร้อมรันใน MySQL
- **วิธีทดสอบ:** นำไฟล์ไปรันใน MySQL / phpMyAdmin และตรวจสอบโครงสร้างตาราง
- **Acceptance Criteria:**
  - [x] สร้างตารางครบ 8 ตารางหลัก
  - [x] มีข้อมูล Master Data เริ่มต้น (Users, Agencies, Categories)
- **Dependency:** Phase 1
- **Git Commit:** `feat: create database schema and initial seed data`
- **ความเสี่ยง:** Syntax Error ของ MySQL 8 หรือลืมใส่ Foreign Key

---

### Phase 3: Backend Core and MySQL Connection
- **เป้าหมาย:** เชื่อมต่อ Backend เข้ากับ Database อย่างสมบูรณ์
- **งานที่ต้องทำ:** เขียนไฟล์เชื่อมต่อ Database (เช่น ใช้ `mysql2`), ตั้งค่า Error Handler, ตั้งค่า Environment Variables
- **ไฟล์ที่เกี่ยวข้อง:** `backend/src/config/db.js`, `backend/.env`, `backend/src/server.js`
- **ผลลัพธ์:** Backend สามารถ query ข้อมูลจาก MySQL ได้
- **วิธีทดสอบ:** สร้าง Test Route `/api/test-db` ดึงข้อมูล agencies มาแสดง
- **Acceptance Criteria:**
  - [ ] เชื่อมต่อ MySQL ได้สำเร็จ
  - [ ] จัดการ Error กรณีเชื่อมต่อ Database ไม่ได้
- **Dependency:** Phase 2
- **Git Commit:** `feat: implement backend database connection pool`
- **ความเสี่ยง:** เชื่อมต่อ Database ไม่ได้เนื่องจากตั้งค่า Host/Port ผิด

---

### Phase 4: Authentication and Authorization
- **เป้าหมาย:** ระบบ Login และการตรวจสอบสิทธิ์ (JWT)
- **งานที่ต้องทำ:** สร้าง Auth API (Login, Me), สร้าง Middleware ตรวจสอบ JWT Token และ Role-based Access Control
- **ไฟล์ที่เกี่ยวข้อง:** `backend/src/controllers/authController.js`, `backend/src/middlewares/authMiddleware.js`, `backend/src/routes/authRoutes.js`
- **ผลลัพธ์:** API Login คืนค่า JWT และ Middleware ป้องกัน API อื่นๆ ได้
- **วิธีทดสอบ:** ยิง Postman ไปที่ `/api/auth/login` และทดสอบยิง API ที่ถูกล็อคด้วย Token
- **Acceptance Criteria:**
  - [ ] Login ด้วย Password ที่ถูกต้องได้ Token
  - [ ] API ที่ถูกป้องกัน (Protected) ปฏิเสธ Request ที่ไม่มี Token
- **Dependency:** Phase 3
- **Git Commit:** `feat: implement jwt authentication and role middleware`
- **ความเสี่ยง:** ความปลอดภัยของ Secret Key หรือลืม Hash Password (Bcrypt)

---

### Phase 5: Complaint CRUD API
- **เป้าหมาย:** API พื้นฐานสำหรับสร้าง ดึงข้อมูล แก้ไข เรื่องร้องเรียน
- **งานที่ต้องทำ:** สร้าง Controller และ Route สำหรับ Complaints (GET All, GET By ID, POST New, PUT Update)
- **ไฟล์ที่เกี่ยวข้อง:** `backend/src/controllers/complaintController.js`, `backend/src/routes/complaintRoutes.js`
- **ผลลัพธ์:** API สำหรับรับเรื่องร้องเรียนใหม่และดึงรายการเรื่องร้องเรียน
- **วิธีทดสอบ:** ใช้ Postman สร้างเรื่องร้องเรียน และดึงรายการมาดู
- **Acceptance Criteria:**
  - [ ] บันทึกข้อมูลลงตาราง `complaints` และ `complainants` ได้ถูกต้อง
  - [ ] ดึงข้อมูลพร้อม Join หมวดหมู่และหน่วยงานได้
- **Dependency:** Phase 4
- **Git Commit:** `feat: implement complaint crud api endpoints`
- **ความเสี่ยง:** ลืม Validation ข้อมูลก่อนบันทึกลง Database

---

### Phase 6: Assignment and Status Workflow API
- **เป้าหมาย:** API สำหรับควบคุม Workflow (มอบหมายงาน, เปลี่ยนสถานะ, ขอข้อมูล)
- **งานที่ต้องทำ:** สร้าง API สำหรับเปลี่ยน `status`, สร้าง Log ลง `complaint_status_logs`, สร้าง API สำหรับคอมเมนต์
- **ไฟล์ที่เกี่ยวข้อง:** `backend/src/controllers/workflowController.js` (หรือคล้ายกัน)
- **ผลลัพธ์:** ระบบสามารถเลื่อนสถานะเรื่องร้องเรียนและเก็บประวัติได้
- **วิธีทดสอบ:** จำลองสถานการณ์มอบหมายงาน ➔ รับเรื่อง ➔ แก้ไขแล้ว ผ่าน Postman
- **Acceptance Criteria:**
  - [ ] สถานะเปลี่ยนตามเงื่อนไขที่ตั้งไว้
  - [ ] มีบันทึก Log การเปลี่ยนสถานะทุกครั้ง
- **Dependency:** Phase 5
- **Git Commit:** `feat: implement complaint workflow and status transition api`
- **ความเสี่ยง:** Logic การบังคับข้ามสถานะผิดพลาด (เช่น ข้ามจาก NEW ไป CLOSED ทันที)

---

### Phase 7: Dashboard and Report API
- **เป้าหมาย:** API สำหรับดึงข้อมูลสรุปสถิติเพื่อแสดงผล
- **งานที่ต้องทำ:** เขียน SQL Query สำหรับสรุปข้อมูล (Count, Group By), สร้าง Export API (Excel/CSV)
- **ไฟล์ที่เกี่ยวข้อง:** `backend/src/controllers/dashboardController.js`, `backend/src/controllers/reportController.js`
- **ผลลัพธ์:** API สำหรับดึงตัวเลข Dashboard และดาวน์โหลดไฟล์
- **วิธีทดสอบ:** ยิง API สรุปข้อมูลเปรียบเทียบกับจำนวนข้อมูลจริงใน Database
- **Acceptance Criteria:**
  - [x] ดึงตัวเลขสรุป (Card) ได้แม่นยำ
  - [x] ดึงข้อมูลสำหรับทำกราฟแยกตามหน่วยงานได้
- **Dependency:** Phase 6
- **Git Commit:** `feat: implement dashboard statistics and report export api`
- **ความเสี่ยง:** Query อาจทำงานช้าหากข้อมูลมีจำนวนมาก (Performance issue)

---

### Phase 8: Frontend Layout and Routing
- **เป้าหมาย:** โครงสร้างหน้าเว็บและระบบนำทาง (React Router)
- **งานที่ต้องทำ:** ตั้งค่า React Router, สร้าง Layout หลัก (Sidebar, Topbar), สร้างหน้าเปล่าๆ (Placeholder) ของทุกหน้า
- **ไฟล์ที่เกี่ยวข้อง:** `frontend/src/App.jsx`, `frontend/src/components/Layout/*`, `frontend/src/pages/*`
- **ผลลัพธ์:** หน้าเว็บที่คลิกเมนูเพื่อเปลี่ยนหน้าได้
- **วิธีทดสอบ:** คลิกทุกเมนูใน Sidebar ว่า URL เปลี่ยนและแสดงหน้าจอที่ถูกต้อง
- **Acceptance Criteria:**
  - [ ] มีโครงสร้าง Sidebar ที่ยืดหดได้
  - [ ] Route ต่างๆ ไม่ Error (404)
- **Dependency:** Phase 1
- **Git Commit:** `feat: setup frontend routing and core layout components`
- **ความเสี่ยง:** ปัญหาโครงสร้าง CSS ทับซ้อนหากไม่ได้ใช้ Theme อย่างถูกต้อง

---

### Phase 9: Frontend Authentication
- **เป้าหมาย:** หน้า Login และการเก็บสถานะผู้ใช้ (Context/Zustand)
- **งานที่ต้องทำ:** สร้างหน้า Login, ต่อ API `/api/auth/login`, เก็บ JWT ลง LocalStorage, ทำ Protected Routes กั้นหน้าจอที่ต้อง Login
- **ไฟล์ที่เกี่ยวข้อง:** `frontend/src/pages/Auth/Login.jsx`, `frontend/src/contexts/AuthContext.jsx`
- **ผลลัพธ์:** ระบบ Login หน้าเว็บที่ใช้งานได้จริง
- **วิธีทดสอบ:** กรอกรหัสถูกเข้า Dashboard, กรอกรหัสผิดแจ้งเตือน, ถ้าไม่ Login จะเข้า Dashboard ไม่ได้
- **Acceptance Criteria:**
  - [ ] ซ่อน/แสดง เมนูตาม Role ได้
  - [ ] เด้งกลับหน้า Login เมื่อ Token หมดอายุ
- **Dependency:** Phase 4, Phase 8
- **Git Commit:** `feat: implement frontend login and protected routes`
- **ความเสี่ยง:** ข้อมูล Token รั่วไหล (ควรเก็บอย่างปลอดภัย)

---

### Phase 10: Complaint Management UI
- **เป้าหมาย:** หน้าจอสำหรับรับเรื่อง, ดูรายการ, และอัปเดตสถานะ (หน้ารายละเอียด)
- **งานที่ต้องทำ:** สร้างฟอร์ม `ComplaintIntakeForm`, สร้างตาราง `ComplaintListTable` (DataGrid), สร้างหน้ารายละเอียดพร้อม Timeline
- **ไฟล์ที่เกี่ยวข้อง:** `frontend/src/pages/Complaints/*`
- **ผลลัพธ์:** เจ้าหน้าที่สามารถใช้งานระบบร้องเรียนบน UI ได้ 100%
- **วิธีทดสอบ:** ทำ Manual Test แบบ End-to-End: รับเรื่อง -> มอบหมาย -> รับเรื่อง -> ปิดเคส ผ่าน UI
- **Acceptance Criteria:**
  - [ ] แสดงตารางข้อมูลได้ถูกต้อง
  - [ ] เปลี่ยนสถานะผ่าน UI ได้ และ Timeline อัปเดต
- **Dependency:** Phase 5, Phase 6, Phase 9
- **Git Commit:** `feat: build complaint management interfaces`
- **ความเสี่ยง:** UI/UX ซับซ้อนเกินไปทำให้เจ้าหน้าที่ใช้งานยาก

---

### Phase 11: Dashboard and Report UI
- **เป้าหมาย:** แสดงผลข้อมูลสรุปผ่าน Card และ Charts
- **งานที่ต้องทำ:** นำเข้าไลบรารีทำกราฟ (เช่น Recharts หรือ Chart.js), ดึง API มาแสดง, สร้างหน้า Report สำหรับ Export
- **ไฟล์ที่เกี่ยวข้อง:** `frontend/src/pages/Dashboard/*`
- **ผลลัพธ์:** Dashboard ที่สวยงามและแสดงข้อมูลแบบ Real-time
- **วิธีทดสอบ:** เปรียบเทียบข้อมูลบนกราฟกับข้อมูลดิบในหน้าตาราง
- **Acceptance Criteria:**
  - [ ] แสดง Card ครบทั้ง 5 ตัวบ่งชี้
  - [ ] กราฟแสดงผลได้ถูกต้องและ Responsive
- **Dependency:** Phase 7, Phase 10
- **Git Commit:** `feat: implement executive dashboard and charts`
- **ความเสี่ยง:** ปัญหาความล่าช้าในการดึงข้อมูลมาวาดกราฟ

---

### Phase 12: Notification and SLA Alert
- **เป้าหมาย:** ระบบแจ้งเตือน In-app และตรวจสอบเวลา
- **งานที่ต้องทำ:** สร้าง UI แจ้งเตือนตรง Topbar, สร้าง Cron Job หรือ Logic ฝั่ง Backend เพื่อเช็ค SLA Overdue
- **ไฟล์ที่เกี่ยวข้อง:** `backend/src/jobs/*`, `frontend/src/components/Layout/Topbar.jsx`
- **ผลลัพธ์:** เจ้าหน้าที่ได้รับแจ้งเตือนเมื่อมีเหตุการณ์สำคัญหรือเรื่องเกินกำหนด
- **วิธีทดสอบ:** จำลองปรับ `sla_due_date` ให้อยู่ในอดีต แล้วตรวจสอบว่าระบบแจ้งเตือนว่า Overdue หรือไม่
- **Acceptance Criteria:**
  - [ ] ขึ้นแจ้งเตือนเมื่อมอบหมายงานใหม่
  - [ ] โชว์ป้ายสถานะ (Badge) สีแดงเมื่อเกิน SLA
- **Dependency:** Phase 10
- **Git Commit:** `feat: add notifications and sla overdue background alerts`
- **ความเสี่ยง:** Cron Job รันซ้ำซ้อนทำให้แจ้งเตือนรัวเกินไป

---

### Phase 13: Docker Integration
- **เป้าหมาย:** ห่อหุ้มระบบด้วย Docker ให้พร้อมสำหรับ Deploy (Multi-stage)
- **งานที่ต้องทำ:** เขียน `Dockerfile` เพื่อรวม Frontend/Backend, เขียน `docker-compose.prod.yml`, ตั้งค่า Nginx สำหรับ On-premise
- **ไฟล์ที่เกี่ยวข้อง:** `Dockerfile`, `docker-compose.prod.yml`, `nginx/default.conf`
- **ผลลัพธ์:** โปรเจกต์สามารถรันบน Production Environment ได้ด้วยคำสั่งเดียว
- **วิธีทดสอบ:** รัน `docker-compose -f docker-compose.prod.yml up` และเทสการเข้าเว็บ
- **Acceptance Criteria:**
  - [ ] ใช้งาน Production Build ได้โดยไม่มีปัญหา CORS
  - [ ] ใช้งานผ่าน Nginx Reverse Proxy ได้ (สำหรับ On-premise)
- **Dependency:** Phase 1-12
- **Git Commit:** `chore: setup dockerfile and production compose configuration`
- **ความเสี่ยง:** ปัญหา Path ฝั่ง Frontend ไม่ถูกต้องหลังจาก Build

---

### Phase 14: Testing and Bug Fix
- **เป้าหมาย:** ทำความสะอาดโค้ด, ปรับแต่ง Performance และแก้ไข Bug รอบสุดท้าย
- **งานที่ต้องทำ:** ทดสอบระบบทั้งหมด (QA), ตรวจสอบความปลอดภัยเบื้องต้น, ซ่อนข้อมูลส่วนบุคคล (Data Masking)
- **ไฟล์ที่เกี่ยวข้อง:** ทุกไฟล์
- **ผลลัพธ์:** ระบบที่เสถียรและพร้อมส่งมอบ (Release Candidate)
- **วิธีทดสอบ:** ทดสอบแบบไร้ทิศทาง (Exploratory Testing) ค้นหาจุดอ่อน
- **Acceptance Criteria:**
  - [ ] ไม่มี Critical Bug หรือ Console Error กวนใจ
  - [ ] ความเร็วในการโหลดหน้าจออยู่ในเกณฑ์ดี
- **Dependency:** Phase 13
- **Git Commit:** `fix: resolve remaining bugs and optimize performance`
- **ความเสี่ยง:** อาจพบปัญหาโครงสร้างรุนแรงจนต้องย้อนกลับไปแก้ API

---

### Phase 15: Production Deployment Guide
- **เป้าหมาย:** จัดทำคู่มือสำหรับแอดมินหรือเจ้าหน้าที่ไอทีเพื่อนำระบบขึ้นใช้งานจริง
- **งานที่ต้องทำ:** เขียนเอกสารคู่มือ Deploy บน Railway และ On-premise
- **ไฟล์ที่เกี่ยวข้อง:** `docs/deployment/*`, `README.md`
- **ผลลัพธ์:** เอกสาร Deployment Manual
- **วิธีทดสอบ:** ให้บุคคลที่ 3 ทำตามคู่มือว่าสามารถ Deploy สำเร็จหรือไม่
- **Acceptance Criteria:**
  - [ ] คู่มือชัดเจน มีตัวอย่าง Environment Variables
  - [ ] ครอบคลุมทั้งสอง Target (Cloud & Local)
- **Dependency:** Phase 14
- **Git Commit:** `docs: add production deployment guide`
- **ความเสี่ยง:** ข้อมูล Credentials จริงหลุดเข้าไปในคู่มือ
