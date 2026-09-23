# Project & Docker Architecture: ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)
(Project Name: BUGKOShop)

เอกสารฉบับนี้กำหนดโครงสร้างโฟลเดอร์ของโปรเจกต์ และสถาปัตยกรรม Docker สำหรับการพัฒนา (Development) และการนำขึ้นระบบจริง (Production)

## 1. Project Folder Structure

```text
/
├── backend/                  # โฟลเดอร์ Source code ฝั่ง Backend (Node.js/Express)
│   ├── src/
│   │   ├── controllers/      # ควบคุม logic และรับส่ง request/response
│   │   ├── routes/           # กำหนดเส้นทาง API (Endpoints)
│   │   ├── models/           # จัดการ Database Query
│   │   ├── middlewares/      # ตรวจสอบสิทธิ์ (Auth/JWT) และจัดการ Error
│   │   ├── uploads/          # โฟลเดอร์เก็บไฟล์แนบหลักฐาน
│   │   └── server.js         # จุดเริ่มต้นรันแอปพลิเคชัน (Entry point)
│   ├── package.json
│   └── .env.example
├── frontend/                 # โฟลเดอร์ Source code ฝั่ง Frontend (React/Vite)
│   ├── public/               # Static assets (ไอคอน, รูปภาพดิบ)
│   ├── src/
│   │   ├── components/       # UI Components ย่อยที่ใช้ซ้ำ (Buttons, Modals)
│   │   ├── pages/            # หน้าจอหลัก (Views) แยกตาม Route
│   │   ├── services/         # จัดการ API Calls เชื่อมต่อ Backend (Axios/Fetch)
│   │   ├── utils/            # Helper functions, Format date
│   │   └── main.jsx          # จุดเริ่มต้นรันแอปพลิเคชัน
│   ├── package.json
│   └── vite.config.js
├── db/                       
│   └── init/                 # โฟลเดอร์สำหรับวางสคริปต์ .sql เพื่อ Init Database
├── docs/                     # เก็บเอกสาร Planning และคู่มือ (เช่น 01-system-overview.md)
├── docker-compose.yml        # สำหรับรันระบบรวมแบบ Development (มี db, phpmyadmin, front, back)
├── docker-compose.prod.yml   # สำหรับนำระบบขึ้น On-premise Server
├── Dockerfile                # Multi-stage build สำหรับรวม Front/Back ให้อยู่ใน Image เดียวกัน
├── nginx/
│   └── default.conf          # Nginx Config สำหรับใช้ร่วมกับ On-premise Deployment
├── railway.toml              # Configuration ช่วยกำหนดค่า Deploy บน Railway
├── .gitignore
├── README.md
└── SKILL.md                  # AI Working Rules และ Guideline ส่วนตัวของโปรเจกต์
```

## 2. คำอธิบายแต่ละ Folder
- **`backend/`:** เป็น API Server ด้วย Node.js + Express 
- **`frontend/`:** เป็น Client-side Application ด้วย React + Vite + MUI 5
- **`db/init/`:** โฟลเดอร์สำคัญที่จะถูก Mount เข้าไปยัง `/docker-entrypoint-initdb.d` ของ MySQL คอนเทนเนอร์ หาก Database ว่างเปล่า MySQL จะดึงไฟล์ `.sql` ในนี้ไปรันอัตโนมัติตอนสตาร์ท
- **`docs/`:** แหล่งรวมองค์ความรู้และกติกา (Single Source of Truth) เพื่อควบคุมโครงสร้าง

---

## 3. Docker Services ที่ต้องมี (สำหรับ Development)
อ้างอิงไฟล์ `docker-compose.yml` (โหมด Dev) จะประกอบด้วย 4 Services หลัก:
1. **`db`:** คอนเทนเนอร์ MySQL 8 จัดเก็บข้อมูลทั้งหมด
2. **`phpmyadmin`:** คอนเทนเนอร์ Web UI สำหรับจัดการ `db`
3. **`backend`:** คอนเทนเนอร์รัน Node.js API (รองรับ Hot Reload ด้วย nodemon)
4. **`frontend`:** คอนเทนเนอร์รัน Vite Dev Server (รองรับ HMR - Hot Module Replacement)

---

## 4. Port ที่ใช้ (Dev Host Mapping)
| Service | Container Port | Host Port (เครื่องนักพัฒนา) | อธิบาย |
|---|---|---|---|
| `frontend` | 5173 | **5173** | เข้าถึงเว็บ UI ของระบบผ่าน `http://localhost:5173` |
| `backend` | 5001 | **5001** | เข้าถึง API ผ่าน `http://localhost:5001/api` |
| `db` | 3306 | **3307** | หากต้องการต่อ Tool จากนอก Docker ให้ต่อผ่าน IP `127.0.0.1` พอร์ต `3307` |
| `phpmyadmin`| 80 | **8081** | เข้าจัดการฐานข้อมูลผ่านเว็บ `http://localhost:8081` |

---

## 5. Network ระหว่าง Containers
- คอนเทนเนอร์ทั้งหมดในโหมด Dev จะเชื่อมกันผ่าน Bridge Network โดยปริยาย
- **ข้อกำหนดที่เข้มงวด:** `backend` ต้องเชื่อมต่อฐานข้อมูลโดยระบุ Host เป็น `db:3306` หรือ `db` เท่านั้น (ห้ามใช้ `localhost` เด็ดขาด เพราะ `localhost` ของ backend จะหมายถึงตัวคอนเทนเนอร์ backend เอง)
- สำหรับ `frontend` ฝั่งเบราว์เซอร์จะเชื่อมต่อ `backend` โดยเรียกไปที่ `http://localhost:5001` (เพราะโค้ดรันบน Browser ของ Host) เว้นแต่จะเซ็ต Proxy ใน `vite.config.js`

## 6. Volume สำหรับ MySQL
- สร้าง Named Volume เช่น `mysql_data:/var/lib/mysql` เพื่อเก็บรักษาข้อมูลให้คงอยู่ (Persistent Data) ไม่หายไปเวลาปิด-เปิด หรือสั่ง `docker-compose down`
- ทำ Bind Mount: `./db/init:/docker-entrypoint-initdb.d` ไว้สำหรับให้ Docker สั่งรันสคริปต์ SQL ครั้งแรก

---

## 7. Environment Variables ที่จำเป็น (.env)
ต้องสร้างไฟล์ `.env` แยกเพื่อความปลอดภัย

**Backend (`backend/.env`):**
```env
PORT=5001
DB_HOST=db       # สำหรับ Dev ใน Docker ใช้ชื่อ service 'db'
DB_PORT=3306     
DB_USER=root
DB_PASSWORD=your_root_password
DB_NAME=bugkoshop_db
JWT_SECRET=your_super_secret_key
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5001/api
```

---

## 8. Dev Environment Workflow
- เน้นความสะดวกในการเขียนโค้ด (DX - Developer Experience)
- ใช้ `docker-compose up` คำสั่งเดียว รันระบบพร้อมกันทั้ง 4 ส่วน
- ทำ Bind Mounts `./backend:/app` และ `./frontend:/app` เข้าไปใน Container 
- โค้ดที่เปลี่ยนใน VSCode/IDE จะซิงก์เข้าไปใน Container อัตโนมัติ ทำให้เว็บรีเฟรชหรือ Backend รีสตาร์ทได้ทันที

---

## 9. Production Environment (2 Targets)
โครงสร้างโปรเจกต์นี้ออกแบบมาให้ประหยัดทรัพยากรบน Server จริง โดยใช้ **Dockerfile แบบ Multi-stage** สร้าง Image เดียวที่รวมทั้ง Frontend และ Backend เอาไว้

**กระบวนการ Multi-stage Dockerfile (วางที่ Root):**
1. **Stage 1 (Build Frontend):** ติดตั้ง dependencies ของ Frontend และรัน `npm run build` จะได้ไฟล์ Static assets อยู่ในโฟลเดอร์ `dist/`
2. **Stage 2 (Setup Backend):** ติดตั้ง dependencies ของ Backend และ **คัดลอก** โฟลเดอร์ `dist/` จาก Stage 1 มาไว้ในโฟลเดอร์ `./public` ของ Backend
3. **Stage 3 (Serve):** เมื่อสั่งรัน `node src/server.js` Backend (Express) จะทำหน้าที่ 2 อย่างคือ:
   - `app.use(express.static('public'))` (ให้บริการหน้าเว็บ UI)
   - ฟัง Request ที่ส่งมายัง `/api/*` เพื่อทำหน้าที่ประมวลผลข้อมูล

**เป้าหมายการ Deploy A: Railway (Cloud Single-container)**
- นำโค้ดขึ้น GitHub และเชื่อมต่อเข้า Railway
- Railway จะอ่าน `Dockerfile` และสร้างเป็น 1 Container ที่รันพอร์ตเดียว (Single-container)
- ไม่ต้องใช้ Nginx
- ค่าตัวแปร (Env Vars) และการเริ่มต้น ให้ควบคุมผ่านไฟล์ `railway.toml`

**เป้าหมายการ Deploy B: On-premise (Local Server / VM)**
- หากศูนย์ดำรงธรรมต้องการติดตั้งบนเซิร์ฟเวอร์ตัวเอง จะใช้ไฟล์ `docker-compose.prod.yml`
- ประกอบด้วย Service: `app` (ใช้ Dockerfile หลัก), `db` (MySQL)
- เพิ่ม `nginx` เข้ามาเป็น Service ยืนขวางด้านหน้า (`nginx/default.conf`) รับ Port 80/443 ทำตัวเป็น Reverse Proxy โยนทราฟฟิกไปหา `app`

---

## 10. ข้อควรระวังและการเตรียมการ
1. **CORS (Cross-Origin Resource Sharing):** 
   - ในตอน **Dev** Frontend (5173) กับ Backend (5001) อยู่คนละ Origin ดังนั้น Backend ต้องเปิดใช้งาน `cors()`
   - ในตอน **Prod** Frontend และ Backend ถูกเสิร์ฟออกมาจากพอร์ตเดียวกันโดย Express ปัญหา CORS จะหมดไป
2. **Database Connection String:** 
   - บน **Railway** หากเชื่อมกับ MySQL Plugin จะได้ค่าแยก Host/Port มาต่างหาก ต้องตั้งค่าผ่าน Dashboard ให้ตรงกัน
3. **File Upload (Ephemeral File System):** 
   - **สำคัญมาก:** บน Cloud (เช่น Railway) Container จะเป็นสถานะไร้ความจำ (Stateless) หากมีการรีสตาร์ท ไฟล์หลักฐานการร้องเรียนที่เก็บไว้ในโฟลเดอร์ `/uploads` ภายใน Container **จะสูญหายทั้งหมด**
   - **แนวทางแก้ในอนาคต:** ควรวางแผนใช้ Cloud Storage (เช่น AWS S3, Cloudinary หรือ Supabase Storage) แทนการบันทึกลง Local Filesystem
