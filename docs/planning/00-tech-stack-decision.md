# 1. Project Name
ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (Damrongdhama Center Complaint Management System - DCMS)

# 2. Purpose of the System
ระบบสำหรับการจัดการ รับเรื่อง และติดตามข้อร้องเรียนของประชาชนผ่านศูนย์ดำรงธรรมจังหวัดศรีสะเกษ

# 3. Selected Tech Stack
- **Frontend:** React 18 + Vite 5 + MUI 5
- **Backend:** Node.js 20 LTS + Express 4
- **Database:** MySQL 8
- **Docker:** Docker Compose (Dev)
- **Database Tool:** phpMyAdmin (Dev)
- **Deploy:** Railway (single-container จาก Dockerfile multi-stage — ไม่ใช้ Nginx แยก)

# 4. Reason for Each Technology
- **React 18 + Vite 5:** ให้ประสิทธิภาพสูง การพัฒนาและการ Build ที่รวดเร็ว รองรับ Hot Reload อย่างมีประสิทธิภาพ
- **MUI 5:** มี UI Components ที่ได้มาตรฐาน สวยงาม และช่วยลดเวลาในการพัฒนา UI
- **Node.js 20 LTS + Express 4:** เป็นเทคโนโลยีมาตรฐานสำหรับการสร้าง RESTful API มีความเสถียร มีชุมชนนักพัฒนาขนาดใหญ่
- **MySQL 8:** ระบบจัดการฐานข้อมูลเชิงสัมพันธ์ที่มีประสิทธิภาพสูง รองรับภาษาไทยได้ดีผ่าน `utf8mb4`
- **Docker & Docker Compose:** ช่วยให้ Environment ระหว่างนักพัฒนาแต่ละคนตรงกัน ลดปัญหาทำงานบนเครื่องหนึ่งแต่ไม่ทำงานบนอีกเครื่อง
- **phpMyAdmin:** เครื่องมือที่มี UI ง่ายต่อการจัดการฐานข้อมูลในช่วง Development
- **Railway:** แพลตฟอร์มสำหรับการ Deploy ที่ตั้งค่าได้ง่ายและรวดเร็ว รองรับ Dockerfile multi-stage สำหรับ Node.js

# 5. Development Environment
- Frontend ใช้ Vite ทำงานบน port 5173 และรองรับ Hot Reload
- Backend ใช้ Express ทำงานบน port 5001 และรองรับ Hot Reload ด้วย nodemon (หลีกเลี่ยง port 5000 เพราะ macOS ใช้กับ AirPlay Receiver)
- MySQL 8 ใช้ host port 3307 map ไป container port 3306
- phpMyAdmin ใช้ host port 8081 map ไป container port 80
- ถ้าเครื่องที่พัฒนาเป็น Apple Silicon (M1/M2/M3/M4) ให้ระวังว่า phpMyAdmin อาจต้องใช้ `platform: linux/amd64`
- ทุก service อยู่ใน custom Docker bridge network เดียวกัน
- Backend และ phpMyAdmin ต้องเชื่อมต่อ MySQL ผ่านชื่อ service `db` และ internal port 3306 (ห้ามใช้ `localhost`)
- ใช้ bind mounts สำหรับ Frontend/Backend เพื่อการพัฒนาแบบ Hot Reload
- ใช้ anonymous volume สำหรับ `node_modules` เพื่อป้องกัน host overwrite และปัญหา architecture ไม่ตรง
- กำหนด environment variables ผ่านไฟล์ `.env` และอ้างอิงใน `docker-compose.yml` ด้วยรูปแบบ `${VARIABLE:-default}`
- ไม่ต้องใส่ `version` ใน `docker-compose.yml` เพราะ Docker Compose รุ่นใหม่ไม่ใช้แล้ว (เป็น attribute ที่ล้าสมัย)
- MySQL ต้องมี healthcheck และ service ที่พึ่งพา DB ต้องใช้ `depends_on` พร้อม `condition: service_healthy`
- SQL init script ให้วางใน `db/init/01-init.sql` และใช้ charset/collation ที่รองรับภาษาไทย เช่น `utf8mb4`

# 6. Production Environment
- **Platform หลัก:** Railway โดยใช้การ deploy ผ่าน root `Dockerfile` แบบ multi-stage สำหรับ single-container app
- **SSL & Domain:** Railway จัดการให้ทั้งหมด ไม่ต้องใช้ Nginx แยก
- **Alternative:** หากมี on-premise/Ubuntu เป็นทางเลือก สามารถใช้ image/app เดียวกันร่วมกับ MySQL และ Nginx reverse proxy ได้ แต่ต้องไม่ทำให้โค้ดผูกกับ target ใด target หนึ่ง
- **Security:** ห้ามใส่ secrets หรือ production config ลงใน source code โดยตรง ให้ใช้ environment variables ทั้งหมด
- **Storage Constraints:** ต้องระวังว่า Railway filesystem เป็น ephemeral หากมี uploads ในอนาคตต้องใช้ Railway Volume หรือ Object Storage (เช่น AWS S3)

# 7. Tools Required
- Node.js 20 LTS & npm
- Docker Desktop หรือ Docker Engine + Docker Compose
- Git
- Editor (เช่น VS Code) พร้อม Extension ที่จำเป็น

# 8. Folder Strategy เบื้องต้น
```text
.
├── backend/          # Source code ของ Node.js + Express
├── frontend/         # Source code ของ React + Vite
├── db/
│   └── init/         # วาง script 01-init.sql สำหรับ MySQL
├── docs/             # เอกสารระบบ (รวมถึง planning files)
├── .env              # Local environment variables
├── docker-compose.yml# สำหรับ Local Development
└── Dockerfile        # Multi-stage build สำหรับ Deploy ขึ้น Railway
```

# 9. Constraints
- ห้ามใช้ Nginx แยกใน Railway deploy
- Railway filesystem เป็น Ephemeral
- ห้ามใส่ Secret ลงใน Code
- Backend ห้ามใช้ Port 5000

# 10. Assumptions
- สมมติว่านักพัฒนาจะใช้ Docker ในการรัน Local Environment แทนการติดตั้ง MySQL ลงเครื่องโดยตรง
- ทีมพัฒนาคุ้นเคยกับการจัดการ Environment Variables
- จะใช้ `db` เป็น Service Name ใน Docker Compose สำหรับเข้าถึงฐานข้อมูล

# 11. Open Questions
- ปริมาณการร้องเรียนที่คาดหวังในแต่ละวัน/เดือน เป็นเท่าใด (เพื่อวางแผนการ Scale)
- มีความจำเป็นต้องเชื่อมต่อกับระบบภายนอก (API ของหน่วยงานอื่น) หรือไม่?
- การ Upload ไฟล์เอกสารหรือรูปภาพร้องเรียน จะใช้ Object Storage เจ้าไหนหากจำเป็น?

# 12. Key Decisions
- เลือกใช้โครงสร้างแบบ Monorepo เพื่อให้จัดการง่ายในช่วงเริ่มต้น แต่แยกส่วน Frontend และ Backend ในระดับ Folder
- ใช้ Docker Compose เพื่อมาตรฐานเดียวกันในการพัฒนาเท่านั้น แต่ใช้ Dockerfile (Single-container) เพื่อความเรียบง่ายตอน Deploy ขึ้น Railway
- ตัด Nginx ออกจากการ Deploy บน Railway เพราะ Platform รองรับ SSL/Domain Termination ให้แล้ว

# 13. Docker Service Map & Port Mapping
| Service | Image | Internal Port | Host Port (Dev) | Description |
|---|---|---|---|---|
| frontend | node:20 | 5173 | 5173 | React + Vite UI |
| backend | node:20 | 5001 | 5001 | Node.js API |
| db | mysql:8 | 3306 | 3307 | Database |
| phpmyadmin | phpmyadmin | 80 | 8081 | Database UI |

# 14. Docker Network Rules
- ทุก service จะอยู่ใน custom Docker bridge network เดียวกัน
- Backend เชื่อมต่อ Database ผ่าน `db:3306`
- phpMyAdmin เชื่อมต่อ Database ผ่าน `db:3306`
- การเข้าถึงจากเครื่อง Host (Browser/Postman) ใช้ `localhost:PORT` (ตามที่ Map ไว้ใน Host Port)

# 15. Environment Variable Strategy
- สร้างและจัดการค่าต่างๆ ผ่านไฟล์ `.env` สำหรับ Local Development
- อ้างอิงใน `docker-compose.yml` แบบ `${VARIABLE_NAME:-default}`
- ในระดับ Production บน Railway จะไม่มีไฟล์ `.env` แต่ให้เซ็ต Environment Variables ผ่านหน้า Dashboard ของ Railway โดยตรง

# 16. Known Setup Risks / Lessons Learned
- **Port 5000 อาจชนกับ macOS AirPlay Receiver** จึงใช้ backend port 5001
- **phpMyAdmin บน Apple Silicon** อาจต้องกำหนด `platform: linux/amd64`
- **`version` ใน Docker Compose** เป็น attribute ที่ล้าสมัย
- **`node_modules` ใน Docker** ควรใช้ anonymous volume และเมื่อเพิ่ม package ใหม่ต้อง rebuild container
- **Backend อาจเชื่อมต่อ DB ไม่ได้**ถ้าไม่มี MySQL healthcheck และ `depends_on` ที่รอ DB พร้อม
