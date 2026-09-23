---
name: damrongdham-dev
description: AI Working Rules and Development Guide for the BUGKOShop / DCMS Project
---

# SKILL: damrongdham-dev (Project Working Guide)

## 1. Purpose
- เป็นคู่มือหลักที่กำหนดวิธีและแนวทางการทำงานของ AI ภายในโปรเจกต์นี้
- ใช้สำหรับควบคุม AI ให้ทำงานอย่างเป็นระบบ ถูกต้องตามมาตรฐาน ขอบเขต และข้อห้ามที่ตกลงกันไว้
- ต้องใช้ร่วมกับไฟล์ `docs/planning/PROJECT_CONTEXT.md` และ `docs/planning/10-implementation-plan.md` เพื่อให้ได้ผลลัพธ์ที่ถูกต้องและสมบูรณ์

## 2. Project Working Principles
- **อ่านก่อนเริ่ม:** AI ต้องอ่านไฟล์ `SKILL.md` นี้ทุกครั้งก่อนเริ่มทำงาน
- **เข้าใจภาพรวม:** AI ต้องอ่าน `docs/planning/PROJECT_CONTEXT.md` ก่อนลงมือ Implementation เสมอ
- **ทำตามแผน:** AI ต้องอ่าน `docs/planning/10-implementation-plan.md` ก่อนลงมือทำแต่ละ Phase เพื่อให้เข้าใจเป้าหมายที่ตรงกัน
- **อ้างอิงเสมอ:** ทุกครั้งที่มีการแก้ไข ค้นหา หรือสร้างไฟล์ใหม่ ต้องระบุชื่อไฟล์และ Path ที่เกี่ยวข้องให้ชัดเจน

## 3. AI General Rules
- ทำเฉพาะ Phase ที่ได้รับมอบหมายในขณะนั้นเท่านั้น
- **ห้าม** ทำ Phase ถัดไปล่วงหน้าเด็ดขาด
- **ห้าม** เพิ่ม Feature นอกเหนือจากที่ระบุใน Planning
- **ห้าม** เปลี่ยน Architecture ของระบบเว้นแต่จำเป็นจริงๆ และหากต้องเปลี่ยน **ต้องแจ้งเหตุผลและรอการอนุมัติก่อน**

## 4. Planning Rules
- นำเสนอแผนการทำงานอย่างเป็นระบบ ไม่เริ่มเขียนโค้ดก่อนที่แผนจะได้รับการอนุมัติ
- ทบทวนว่า Requirements ในแผนงานครอบคลุม Tech Stack และเงื่อนไขที่ตกลงกันไว้หรือไม่

## 5. Implementation by Phase Rules
- 1 Phase = 1 เป้าหมายการพัฒนา (เช่น ทำ UI, ต่อ API, ทำ Database)
- ทุก Phase ต้องจบด้วยความสมบูรณ์ในตัวของมันเอง
- หลังจบ Phase ต้องมี **วิธีการรัน**, **วิธีการทดสอบ**, และ **Acceptance Criteria Checklist** กำกับเสมอ

## 6. Frontend Development Rules
- ใช้ **React 18 + Vite 5 + MUI 5**
- จัดโครงสร้าง Folder และ Component ให้แยกส่วนอย่างชัดเจน เป็นระเบียบ (Reusable Components)
- รันด้วย Port **5173** (พร้อม Bind Mounts เพื่อ Hot Reload)

## 7. Backend Development Rules
- ใช้ **Node.js 20 LTS + Express 4**
- เขียนโค้ดเน้นเรื่องความปลอดภัย โครงสร้าง Middleware ที่ชัดเจน และแยก Controller, Route, Service ออกจากกัน
- รันด้วย Port **5001** (หลีกเลี่ยง Port 5000)

## 8. Database Development Rules
- ใช้ **MySQL 8** (Container Port: 3306, Host Port: 3307)
- รักษากฎของ Foreign Key, Index และ Collation/Charset (`utf8mb4`) อย่างเคร่งครัด
- ห้ามเปลี่ยน Schema โดยพลการ ต้องเสนอ Schema Modification Plan ก่อน

## 9. API Development Rules
- ออกแบบเป็น RESTful API
- ส่งค่า Response เป็น JSON format เสมอ
- ห้ามแก้ API Contract ที่ตกลงกับ Frontend ไว้แล้วโดยไม่แจ้งเหตุผล

## 10. Docker Development Rules
- ใช้ **Docker Compose** สำหรับการรันแบบ Development
- ห้ามใส่ค่า `version` ใน `docker-compose.yml`
- Backend และ phpMyAdmin ต้องคุยกับ Database ผ่านคำว่า `db:3306`
- **ห้ามใช้** `localhost` สำหรับการติดต่อข้าม Service ภายในเครือข่าย Docker
- Database Service ต้องมี Healthcheck ส่วน Service อื่นต้องใช้ `depends_on: condition: service_healthy`

## 11. Testing Rules
- ในระดับ Development Phase AI ต้องให้คำสั่งหรือวิธีการทดสอบ (Manual Testing หรือ Curl/Postman) ที่ชัดเจนกับผู้ใช้
- หากมีการเขียน Automated Test ให้ยึด Framework ที่เหมาะสมและระบุคำสั่งที่ใช้รันไว้อย่างชัดเจน

## 12. Debugging Rules
- หากเจอปัญหา ให้ AI ช่วยวิเคราะห์จาก Log โดยละเอียดก่อนเสนอวิธีแก้
- แก้ปัญหาที่ต้นเหตุ (Root Cause) ไม่ใช่แก้แค่ปลายเหตุ (Workaround) โดยไม่จำเป็น

## 13. Documentation Rules
- อัปเดตไฟล์ README.md หรือเอกสารใน `docs/` ทุกครั้งที่มีการเปลี่ยนแปลงที่สำคัญ (เช่น เปลี่ยน Port, เพิ่ม Dependencies, แก้วิธีการรัน)

## 14. Git Commit Rules
- ทุกการจบ Phase AI ต้องแนะนำ Git Commit Message ที่ชัดเจน
- ใช้รูปแบบ Conventional Commits (เช่น `feat:`, `fix:`, `refactor:`)
- เตือนให้ผู้ใช้เช็คว่า `.env` หรือ Secrets ไม่ถูก Track ด้วย Git ก่อนการ Commit

## 15. Security Rules
- **ห้าม** บันทึก Secrets จริงใดๆ (เช่น Password, API Key) ลงใน Source Code, เอกสาร หรือ Prompt
- การเก็บค่าลับต้องใช้งานผ่าน Environment Variables เท่านั้น

## 16. Forbidden Actions
- ห้ามเขียน Code ข้าม Phase หรือเริ่มงานก่อนสรุปแผน
- ห้ามแก้ Project Structure หรือ Tech Stack เอง
- ห้ามข้ามขั้นตอนการทดสอบเมื่อจบ Phase

## 17. Required Response Format
- ใช้ Markdown ล้วนๆ ในการตอบสนอง
- ตอบกระชับ เข้าใจง่าย ใช้ Bullet Point เมื่อต้องแจกแจงเงื่อนไขหรือสิ่งที่ต้องทำ

## 18. Phase Completion Report Format
เมื่อสิ้นสุดในแต่ละ Phase, AI จะต้องแสดง Report สรุปในรูปแบบต่อไปนี้:
```markdown
### 🟢 Phase [หมายเลข Phase] Completed

**1. สรุปสิ่งที่ทำไป:**
- [รายการงานที่ทำเสร็จ]

**2. ไฟล์ที่มีการสร้างหรือแก้ไข:**
- `path/to/file1`
- `path/to/file2`

**3. วิธีการรันและวิธีทดสอบ:**
- [คำสั่งรันระบบ]
- [ขั้นตอนการทดสอบ หรือ cURL/Postman requests]

**4. Acceptance Criteria Checklist:**
- [x] [เกณฑ์ข้อที่ 1]
- [x] [เกณฑ์ข้อที่ 2]

**5. Git Commit Message ที่แนะนำ:**
`[ประเภทของ Commit]: [ข้อความอธิบาย]`
```
