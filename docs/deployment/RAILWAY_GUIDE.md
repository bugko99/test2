# คู่มือการนำระบบ DCMS ขึ้นใช้งานจริง (Production Deployment Guide)

เอกสารฉบับนี้อธิบายขั้นตอนการนำระบบบริหารจัดการเรื่องร้องเรียน (DCMS) ขึ้นไปรันบนเซิร์ฟเวอร์สำหรับใช้งานจริง โดยรองรับทั้งการ Deploy บน Cloud (Railway) และ On-Premise (Docker Compose)

---

## 1. การ Deploy บน Railway (Cloud)

Railway เป็น Cloud Platform ที่รองรับการ Deploy ทั้ง Backend (Node.js) และ Frontend (React) รวมถึงมีระบบ Database ให้ในตัว

### ขั้นตอนการเตรียม Railway
1. สมัครสมาชิกและเข้าสู่ระบบ Railway (https://railway.app)
2. สร้าง Project ใหม่
3. เพิ่ม Database: กด **New** -> **Database** -> เลือก **MySQL**
4. จดจำค่าการเชื่อมต่อ (Database URL) เช่น `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` ของ Railway ไว้

### ขั้นตอน Deploy Backend
1. ในหน้า Project ของ Railway กด **New** -> **GitHub Repo** แล้วเลือก Repository ของโปรเจกต์นี้
2. เลือก Root Directory เป็น `backend` (เข้าไปที่ Settings -> Root Directory)
3. ไปที่แถบ **Variables** แล้วเพิ่มค่า Environment Variables:
   - `DB_HOST` = (จาก Railway MySQL)
   - `DB_PORT` = 3306
   - `DB_USER` = (จาก Railway MySQL)
   - `DB_PASSWORD` = (จาก Railway MySQL)
   - `DB_NAME` = railway (หรือชื่อฐานข้อมูลที่ Railway สร้างให้)
   - `PORT` = 5001
   - `JWT_SECRET` = (สุ่มรหัสผ่านยาวๆ)
4. Railway จะดึง `Dockerfile` ในโฟลเดอร์ `backend` ไปทำการ Build และ Deploy ให้อัตโนมัติ

### ขั้นตอน Deploy Frontend
1. กด **New** -> **GitHub Repo** อีกครั้ง เลือก Repository เดิม
2. เลือก Root Directory เป็น `frontend`
3. ไปที่แถบ **Variables** เพิ่มค่า:
   - `VITE_API_URL` = URL ของ Backend ที่ได้จากขั้นตอนก่อนหน้า (เช่น `https://backend-production-xyz.up.railway.app`)
4. ระบบจะ Build ตาม `Dockerfile` ของ Frontend (ซึ่งมีการรัน Nginx ด้วย) และเสิร์ฟหน้าเว็บอัตโนมัติ

---

## 2. การ Deploy บน On-Premise (Server หน่วยงาน)

สำหรับการรันบนเครื่องเซิร์ฟเวอร์ภายในหน่วยงานโดยใช้ **Docker Compose**

### สิ่งที่ต้องเตรียม
- เครื่อง Server (Linux เช่น Ubuntu 22.04)
- ติดตั้ง `docker` และ `docker-compose`

### ขั้นตอนการรัน
1. คัดลอก Source Code ไปยัง Server (เช่น ผ่าน Git Clone หรือ SCP)
2. เข้าไปในโฟลเดอร์โปรเจกต์:
   ```bash
   cd /path/to/bugkoshop-dcms
   ```
3. รันคำสั่งเปิดระบบ:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d --build
   ```
4. ระบบจะทำการ:
   - ดึง Image `mysql:8.0` ขึ้นมารัน
   - รัน Script ใน `db/init/` เพื่อสร้างและ Seed ฐานข้อมูล
   - Build Backend Container
   - Build Frontend Container (Nginx) พร้อมทำ Reverse Proxy ไปหา Backend
5. ทดสอบเข้าใช้งานผ่าน Browser โดยพิมพ์ IP ของ Server ที่ Port 80
   - ตัวอย่าง: `http://192.168.1.100`

---

## 3. การตรวจสอบระบบหลังการ Deploy
- **ฐานข้อมูล:** ทดลองล็อกอินด้วย `admin` รหัส `password123`
- **การเชื่อมต่อ:** ทดสอบสร้างเรื่องร้องเรียน ระบบต้องสามารถบันทึกลงฐานข้อมูลและแสดงใน Dashboard ได้ทันที
- **Logs:** ตรวจสอบความผิดปกติด้วยคำสั่ง:
  ```bash
  docker-compose -f docker-compose.prod.yml logs -f backend
  ```
