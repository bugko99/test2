# Git Workflow & Commit Rules

## 1. Branch Strategy
- **`main`**: บรันช์หลักสำหรับเก็บโค้ดที่พร้อมใช้งานและทำงานได้อย่างสมบูรณ์ (Production-ready)
- **`dev` / `development`**: บรันช์หลักสำหรับการพัฒนาและทดสอบฟีเจอร์ต่างๆ ก่อนรวมเข้า `main`
- เนื่องจากการพัฒนาส่วนใหญ่ทำร่วมกับ AI และเป็นการรันไปทีละ Phase แนะนำให้ทำงานหลักบนบรันช์ `dev` หรือแยกบรันช์ตาม Phase (เช่น `feature/phase-1`) แล้วทำการ Merge เมื่อ Phase นั้นทำงานสำเร็จและผ่าน Acceptance Criteria

## 2. Commit Convention
- ยึดหลัก **Conventional Commits** เพื่อให้ประวัติการทำงานเป็นระเบียบและอ่านง่าย
- ประเภทหลักที่ใช้งาน:
  - `feat`: สำหรับการเพิ่มฟีเจอร์ใหม่
  - `fix`: สำหรับการแก้ไขบั๊กหรือข้อผิดพลาด
  - `docs`: สำหรับการเพิ่มหรือแก้ไขเอกสาร (เช่น โฟลเดอร์ `docs/`, `README.md`)
  - `chore`: สำหรับงานจิปาถะที่ไม่ส่งผลต่อโค้ดการทำงานหลัก (เช่น แก้ไข config, อัปเดต dependencies)
  - `refactor`: สำหรับการปรับปรุงโค้ดโดยไม่เปลี่ยนพฤติกรรมการทำงานเดิม
  - `test`: สำหรับการเพิ่มหรือแก้ไขสคริปต์ทดสอบระบบ

## 3. Commit Message Format
รูปแบบข้อความ Commit ต้องเป็นดังนี้:
```
<type>: <description>
```
- `<type>`: ประเภทของ Commit (ดูจาก Commit Convention)
- `<description>`: คำอธิบายสั้นๆ เข้าใจง่าย (ใช้ภาษาอังกฤษเป็นหลัก ใช้ตัวพิมพ์เล็ก)

## 4. When to Commit
- ควร Commit เมื่อการทำงานย่อยเสร็จสมบูรณ์ เพื่อให้มีจุดย้อนกลับ (Restore Point) อย่างสม่ำเสมอ
- ควรตรวจสอบความถูกต้องของไฟล์ด้วย `git status` หรือทดสอบระบบทุกครั้งก่อนสั่ง Commit

## 5. Commit per Planning Step
- ทุกครั้งที่ AI สร้างหรือแก้ไขเอกสารในช่วง Planning สำเร็จ จะต้องทำการ Commit แยกทีละไฟล์ หรือทีละขั้นตอน เพื่อบันทึกประวัติการวางแผนอย่างชัดเจน

## 6. Commit per Implementation Phase
- เมื่อ AI ทำการเขียนโค้ดและดำเนินการจนจบแต่ละ Phase (ตามเอกสาร Implementation Plan) และผ่านการทดสอบแล้ว **ต้องมีการ Commit ปิด Phase** (Phase Completion)
- วิธีนี้ทำให้หากการพัฒนาใน Phase ถัดไปพัง สามารถย้อนกลับมายังจุดสิ้นสุดของ Phase ก่อนหน้าที่ทำงานได้สมบูรณ์ล่าสุดได้ทันที

## 7. Commit after Bug Fix
- เมื่อพบปัญหา (Bug) และ AI ช่วยทำการแก้ไขจนระบบกลับมาใช้งานได้ตามปกติ ต้องทำการ Commit แยกทันทีพร้อมระบุปัญหาที่แก้ไข เพื่อไม่ให้ปะปนกับงานพัฒนาฟีเจอร์ใหม่

## 8. Rollback Strategy
- หากการทำงานใน Phase ปัจจุบันผิดพลาดร้ายแรง หรือ AI เขียนโค้ดที่ทำให้ระบบพัง ให้ใช้คำสั่งย้อนกลับไปยัง Commit ล่าสุดที่ทำงานได้ (เช่น `git reset --hard HEAD` กรณีแก้ไขแล้วพังยังไม่ได้ commit หรือ `git checkout <commit-hash>`/`git revert` กรณี commit ไปแล้ว)
- การวางเป้าหมายว่าจะ "Commit เมื่อจบ Phase และเมื่อวางแผนเสร็จ" จึงเป็นหัวใจสำคัญของการป้องกันโค้ดเสียแบบกู่ไม่กลับ

## 9. Files that Should Be Committed
- Source Code ทั้งหมด (`frontend/src/`, `backend/`, `db/init/`)
- เอกสารคู่มือต่างๆ (`docs/`, `SKILL.md`, `README.md`)
- ไฟล์ Configuration ที่ใช้ร่วมกัน (`docker-compose.yml`, `package.json`, `vite.config.js`)
- ไฟล์ `.gitignore`
- `.env.example` (ไฟล์ตัวอย่าง Configuration ที่ไม่มีข้อมูลความลับจริง)

## 10. Files that Should Not Be Committed
- ไฟล์ `.env` ที่มีข้อมูล Secrets รหัสผ่าน หรือ API Key ของจริง
- โฟลเดอร์ `node_modules/` (เนื่องจากสามารถใช้ `npm install` สร้างใหม่ได้)
- ไฟล์ Build / Compiled (เช่น โฟลเดอร์ `dist/`, `build/`)
- ไฟล์ Log หรือโฟลเดอร์ของระบบปฏิบัติการและ Code Editor (เช่น `.DS_Store`, `.vscode/`)

## 11. Suggested `.gitignore` Rules
ตัวอย่างเบื้องต้นของไฟล์ `.gitignore`:
```text
# Dependencies
node_modules/

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.production

# Editor/OS files
.DS_Store
.vscode/
.idea/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## 12. Example Commit Messages
**ตัวอย่างการ Commit งานด้านเอกสาร (Planning/Docs):**
- `docs: add tech stack decision`
- `docs: add AI working rules`
- `docs: add system overview`
- `docs: add project context`

**ตัวอย่างการ Commit งานพัฒนาฟีเจอร์ (Implementation):**
- `feat: complete phase 1 project setup`
- `feat: implement user login workflow`
- `feat: build admin dashboard UI`

**ตัวอย่างการ Commit แก้บั๊กและการตั้งค่า (Fix/Chore):**
- `fix: resolve backend database connection`
- `fix: correct flexbox alignment on mobile`
- `chore: update docker compose configuration`
- `chore: update dependencies in backend`
