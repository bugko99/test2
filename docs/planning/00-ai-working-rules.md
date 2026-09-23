# AI Working Rules for BUGKOShop

## 1. General AI Rules
- ห้ามเขียน Code ก่อนที่กระบวนการ Planning จะเสร็จสมบูรณ์และได้รับการอนุมัติ
- ห้ามทำงานเกินขอบเขตของ Phase ปัจจุบันที่กำหนดไว้
- ห้ามเพิ่ม Feature ที่อยู่นอกเหนือแผนงานโดยพลการ
- ห้ามเปลี่ยนแปลง Tech Stack (React 18, Vite 5, MUI 5, Node.js 20 LTS, Express 4, MySQL 8) โดยไม่ได้รับอนุญาต
- ห้ามเปลี่ยนแปลง Database Schema, API Contract หรือ Project Structure โดยไม่มีเหตุผลอันสมควร
- หากมีความจำเป็นต้องเปลี่ยนแปลงจากแผนเดิม ต้องแจ้งเหตุผลและขออนุมัติก่อนเสมอ

## 2. Planning Rules
- วิเคราะห์และออกแบบการทำงานอย่างละเอียดก่อนเริ่มพัฒนา
- จัดทำเอกสารและข้อตกลงต่างๆ ในรูปแบบที่ชัดเจนและเป็นระบบ
- ในกรณีที่ Requirements ไม่ชัดเจน ต้องสอบถามเพื่อความเข้าใจที่ถูกต้องก่อนเสมอ

## 3. Implementation Rules
- เขียนโค้ดให้สอดคล้องกับสถาปัตยกรรมที่ได้ตกลงไว้
- โค้ดต้องสะอาด อ่านง่าย และเป็นไปตามมาตรฐานของภาษาหรือ Framework นั้นๆ

## 4. Phase Control Rules
- การทำงานจะถูกแบ่งเป็น Phase อย่างชัดเจน
- ห้ามข้าม Phase หรือรวมงานของหลาย Phase เข้าด้วยกัน
- ทุก Phase ต้องมี วิธีการรันระบบ, วิธีการทดสอบ, และ Acceptance Criteria ที่ชัดเจน
- ต้องมี Git Commit Message ที่แนะนำในทุก Phase
- หลังจบแต่ละ Phase จะต้องมีการจัดทำ **Phase Completion Report** เพื่อสรุปผลการทำงาน

## 5. Code Generation Rules
- สร้างโค้ดที่สามารถรันได้จริงตามโครงสร้างโปรเจกต์
- ไม่สร้าง Placeholder ที่ไม่จำเป็น หากสามารถเขียนโค้ดที่สมบูรณ์ได้
- อ้างอิงตัวแปรและ Environment ให้ถูกต้องตามที่กำหนด

## 6. Debugging Rules
- หากเกิดข้อผิดพลาด ต้องวิเคราะห์หาสาเหตุจาก Log หรือข้อความแจ้งเตือนอย่างเป็นระบบ
- ไม่ควรสุ่มเปลี่ยนโค้ดโดยไม่เข้าใจสาเหตุของปัญหาที่แท้จริง

## 7. Documentation Rules
- จัดทำเอกสารที่เกี่ยวข้องกับการตั้งค่าและการทำงานของระบบ
- อัปเดตเอกสาร (เช่น `README.md`) ทันทีที่มีการเปลี่ยนแปลง Port, คำสั่งรัน, หรือ Dependencies สำคัญ

## 8. Testing Rules
- แนะนำวิธีการทดสอบที่เหมาะสมสำหรับแต่ละส่วนของระบบ
- ตรวจสอบให้แน่ใจว่าฟังก์ชันการทำงานพื้นฐานผ่าน Acceptance Criteria

## 9. Git Commit Rules
- แนะนำ Conventional Commits message เสมอ (เช่น `feat:`, `fix:`, `docs:`, `chore:`, `refactor:`)
- เสนอ Commit message ที่ชัดเจน สอดคล้องกับงานในแต่ละ Phase
- ให้ตรวจสถานะด้วย `git status` ก่อนเสมอ เพื่อดูว่า `.env` หรือไฟล์ที่ไม่เกี่ยวข้องถูกละเว้นเรียบร้อยหรือไม่

## 10. Forbidden Actions
- ห้ามเปลี่ยน Tech Stack นอกเหนือจากที่ตกลงไว้
- ห้าม Commit หรือเปิดเผย Secrets, Production Credentials, Token หรือข้อมูลส่วนบุคคลจริง
- ห้ามทำขั้นตอนการ Login/Authorize ผ่าน GitHub CLI (`gh`) แทนผู้ใช้โดยไม่แจ้งล่วงหน้า

## 11. Required Output Format
- ใช้ Markdown อย่างเป็นระเบียบ แบ่งหัวข้อชัดเจน
- ใช้ Code block พร้อมระบุภาษาเพื่อความง่ายในการอ่านและคัดลอก

## 12. How AI Should Ask Questions
- ถามคำถามแบบตัวเลือก (Multiple-choice) หรือคำถามที่เฉพาะเจาะจง เพื่อให้ผู้ใช้ตอบได้ง่ายและตรงประเด็น
- หลีกเลี่ยงคำถามที่กว้างเกินไป

## 13. How AI Should Handle Unclear Requirements
- หยุดและสอบถามผู้ใช้ทันที ห้ามคาดเดาหรือเขียนโค้ดไปเอง
- สรุปความเข้าใจเบื้องต้นและขอคำยืนยันจากผู้ใช้

## 14. How AI Should Report Changes
- อธิบายสิ่งที่ถูกแก้ไข เหตุผลที่แก้ไข และผลกระทบต่อระบบ
- ใช้ Bullet points หรือโครงสร้างที่กระชับ อ่านง่าย

## 15. Docker Development Rules
- ใช้ไฟล์ `docker-compose.yml` สำหรับ Development environment เท่านั้น
- **ไม่ใส่** attribute `version` ใน `docker-compose.yml` เนื่องจากล้าสมัยแล้ว
- ตั้งค่า Frontend port เป็น **5173** และ Backend port เป็น **5001** (หลีกเลี่ยง port 5000 เนื่องจากอาจชนกับ macOS AirPlay Receiver)
- MySQL ตั้งค่า Host port เป็น **3307** และ Map เข้า Container port **3306**
- phpMyAdmin ตั้งค่า Host port เป็น **8081** และ Map เข้า Container port **80**
- หากพัฒนาบนเครื่อง **Apple Silicon (M1/M2/M3/M4)** ให้พิจารณาเพิ่ม `platform: linux/amd64` เฉพาะกับ Service ที่พบปัญหา (เช่น phpMyAdmin)
- ใช้ **Bind Mounts** สำหรับ Source Code ทั้ง Frontend และ Backend เพื่อรองรับ Hot Reload
- ใช้ **Anonymous Volume** สำหรับโฟลเดอร์ `node_modules` (เพื่อเลี่ยงปัญหา OS architecture ทับซ้อน)
- ภายในเครือข่าย Docker, Backend และ phpMyAdmin ต้องติดต่อ Database ผ่าน Service name `db` และ Internal port `3306` (ห้ามใช้ `localhost`)
- Service `db` (MySQL) ต้องมีการกำหนด **Healthcheck**
- Service อื่นๆ ที่ต้องพึ่งพา Database ต้องกำหนด `depends_on` ควบคู่กับ `condition: service_healthy`
- หากมีการเพิ่ม Dependency ใหม่ (เช่น การแก้ไข `package.json`) ต้องแจ้งเตือนเสมอว่าผู้ใช้จำเป็นต้อง **Rebuild Container** หรือ Restart Service

## 16. Git / GitHub Workflow Rules
- ตรวจสอบ `git status` ก่อน Commit เสมอ เพื่อให้แน่ใจว่าไฟล์ที่ถูก Track นั้นถูกต้อง
- ไฟล์ `.gitignore` ต้องครอบคลุม `.env`, `node_modules`, `dist`, logs และไฟล์ Local configurations ที่ไม่ควรถูก Commit
- ยึดหลักการเขียน Commit Message แบบ **Conventional Commits** (`feat:`, `fix:`, `docs:`, ฯลฯ)
- ต้องมีการระบุ Commit Message ที่ชัดเจนสำหรับตอนจบทุก Phase
- อัปเดต `README.md` ทันทีที่มีการเปลี่ยนแปลง Port, คำสั่ง, Workflow หรือ Dependencies สำคัญ
- หากมีการ Push โค้ดผ่าน GitHub CLI (`gh`) ต้องไม่ทำการ Login หรือ Authorize แทนผู้ใช้โดยไม่ขออนุญาตล่วงหน้า
- **ห้าม** Commit Secrets หรือ Token เด็ดขาด
- หาก Repository ยังไม่มี `README.md` ที่สมบูรณ์ ให้ AI แนะนำโครงสร้าง ได้แก่: Project name, Description, Tech stack, Install/Run guide, Port mapping, Docker commands, Folder structure, License/Owner

## 17. Skill / Project Instruction Rules
- AI ต้องอ่าน Project Instruction หรือ Skill ที่เกี่ยวข้อง (หากมี) ก่อนเริ่มทำงานเสมอ
- หากโปรเจกต์มีไฟล์ `.agents/skills/[skill-name]/SKILL.md` ให้ถือเป็น **แหล่งกติกาหลัก** ร่วมกับเอกสาร Planning
- ชื่อ Skill ควรใช้ตัวพิมพ์เล็กและคั่นด้วยขีดกลาง (เช่น `bugkoshop-dev`)
- ภายในไฟล์ `SKILL.md` ควรมี YAML Frontmatter ประกอบด้วย `name` และ `description` ที่กระชับ ตรงกับโปรเจกต์
- เนื้อหาของ Skill ควรครอบคลุม: When to Use, When NOT to Use, Project Architecture, Service Map & Ports, Network Rules, Environment Variables, Commands, Coding Guidelines, Output Format และ Examples
- หลีกเลี่ยงการคัดลอกข้อมูลที่ยาวมาก (เช่น API Spec หรือ DB Schema) ลงใน Skill แต่ให้อ้างอิงไปยังเอกสารในโฟลเดอร์ `docs/planning/` แทน
- เมื่อมีการเปลี่ยนแปลง Architecture, Ports, Service หรือ Conventions ต้องพิจารณาเสนอให้อัปเดตไฟล์ Skill และ Planning Docs ควบคู่กันไป

## 18. Environment & Secret Handling Rules
- ใช้งานไฟล์ `.env` สำหรับ Local Development และให้มีไฟล์ `.env.example` เป็นตัวอย่างค่า Configuration ที่ไม่มีความลับ
- **ห้าม** ใส่ข้อมูล Secret จริงใน Source Code, Prompt, สคริปต์ต่างๆ, ไฟล์ `README.md` หรือเอกสาร Planning โดยเด็ดขาด
- สำหรับ Production Environment ค่า Secret ต้องถูกตั้งค่าผ่าน Platform Environment Variables (เช่น Railway variables) แทนการใช้ไฟล์
- เมื่อ AI จำเป็นต้องแสดงตัวอย่าง Code หรือ Configuration ที่เกี่ยวกับ Secret ให้ใช้ Placeholder แทนเสมอ (เช่น `YOUR_SECRET_KEY`)
