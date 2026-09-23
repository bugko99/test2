# Database Design Overview: ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)
(Project Name: BUGKOShop)

เอกสารฉบับนี้สรุปการออกแบบโครงสร้างฐานข้อมูล (Database Schema) เชิงแนวคิด เพื่อให้ครอบคลุม Requirements, Roles และ Workflow ที่กำหนดไว้ โดยใช้ฐานข้อมูล **MySQL 8**

## 1. รายชื่อตารางทั้งหมด (List of Tables)
**Master Data Tables:**
1. `users`
2. `agencies`
3. `complaint_categories`

**Transaction Tables:**
4. `complainants`
5. `complaints`
6. `complaint_attachments`

**Log / History Tables:**
7. `complaint_status_logs`
8. `complaint_comments`

---

## 2-5. รายละเอียดและวัตถุประสงค์ของแต่ละตาราง (Table Details)

### 2.1 ตาราง `agencies` (Master Data)
- **วัตถุประสงค์:** เก็บรายชื่อหน่วยงานหรือส่วนราชการที่รับผิดชอบการแก้ปัญหาเรื่องร้องเรียน
- **Primary Key:** `id`
- **Field สำคัญ:** `name`, `description`, `is_active`, `created_at`, `updated_at`

### 2.2 ตาราง `users` (Master Data)
- **วัตถุประสงค์:** เก็บข้อมูลเจ้าหน้าที่ผู้ใช้งานระบบ
- **Primary Key:** `id`
- **Foreign Key:** `agency_id` (อ้างอิง `agencies.id`)
- **Field สำคัญ:** `username`, `password_hash`, `email`, `role` (enum: `super_admin`, `dcms_staff`, `dcms_head`, `agency_officer`, `executive`), `is_active`

### 2.3 ตาราง `complaint_categories` (Master Data)
- **วัตถุประสงค์:** จัดเก็บประเภทหรือหมวดหมู่ของเรื่องร้องเรียน เพื่อใช้ในการจัดกลุ่มและกำหนดเวลามาตรฐาน (SLA) พื้นฐาน
- **Primary Key:** `id`
- **Field สำคัญ:** `name`, `default_sla_days`, `is_active`

### 2.4 ตาราง `complainants` (Transaction Data)
- **วัตถุประสงค์:** เก็บข้อมูลผู้ร้องเรียน (ตั้งใจแยกตารางออกมาเพื่อจัดการเรื่องความปลอดภัยของข้อมูลส่วนบุคคล - PDPA ได้ง่ายขึ้น)
- **Primary Key:** `id`
- **Field สำคัญ:** `id_card_number`, `first_name`, `last_name`, `phone_number`, `address`, `is_anonymous` (boolean)

### 2.5 ตาราง `complaints` (Transaction Data - Core)
- **วัตถุประสงค์:** เป็นตารางหลักสำหรับเก็บข้อมูลเรื่องร้องเรียนแต่ละเคส
- **Primary Key:** `id`
- **Foreign Key:** 
  - `complainant_id` (อ้างอิง `complainants.id`)
  - `category_id` (อ้างอิง `complaint_categories.id`)
  - `assigned_agency_id` (อ้างอิง `agencies.id` - บ่งบอกว่าหน่วยงานไหนเป็นผู้รับผิดชอบหลัก)
- **Field สำคัญ:** `tracking_number` (เลขที่รับเรื่อง แบบอ่านง่าย), `title`, `description`, `incident_date`, `incident_location`, `source_channel` (enum: in-person, phone, letter, web, api), `status` (enum: NEW, ASSIGNED, IN_PROGRESS, PENDING_INFO, RESOLVED, CLOSED, REJECTED), `sla_due_date`, `created_at`

### 2.6 ตาราง `complaint_attachments` (Transaction Data)
- **วัตถุประสงค์:** เก็บข้อมูลรายละเอียดของไฟล์แนบ หลักฐานต่างๆ
- **Primary Key:** `id`
- **Foreign Key:** `complaint_id` (อ้างอิง `complaints.id`), `uploaded_by` (อ้างอิง `users.id`)
- **Field สำคัญ:** `file_name`, `file_path` (หรือ URL), `file_type`, `created_at`

### 2.7 ตาราง `complaint_status_logs` (Log/History Data)
- **วัตถุประสงค์:** ตารางสำหรับระบบ Audit Trail เพื่อเก็บประวัติว่าเรื่องร้องเรียนเปลี่ยนสถานะเมื่อไหร่ อย่างไร และโดยใคร
- **Primary Key:** `id`
- **Foreign Key:** `complaint_id` (อ้างอิง `complaints.id`), `changed_by` (อ้างอิง `users.id`)
- **Field สำคัญ:** `old_status`, `new_status`, `remark` (เหตุผลการเปลี่ยนสถานะ), `created_at`

### 2.8 ตาราง `complaint_comments` (Log/History Data)
- **วัตถุประสงค์:** เก็บข้อความสนทนา การรายงานผลความคืบหน้า หรือการขอข้อมูลเพิ่มเติมระหว่างหน่วยงานและศูนย์ดำรงธรรม (แยกจาก Log สถานะ)
- **Primary Key:** `id`
- **Foreign Key:** `complaint_id` (อ้างอิง `complaints.id`), `user_id` (อ้างอิง `users.id`)
- **Field สำคัญ:** `comment_text`, `is_internal` (boolean - ซ่อนไม่ให้ประชาชนเห็น หากมีระบบให้ประชาชนตามเรื่อง), `created_at`

---

## 6. ความสัมพันธ์ระหว่างตาราง (Table Relationships)
- `users` (Many) ➔ (1) `agencies` : ผู้ใช้ 1 คนจะสังกัด 1 หน่วยงาน (แต่หน่วยงานมีผู้ใช้หลายคน)
- `complaints` (Many) ➔ (1) `complainants` : ผู้ร้องเรียน 1 คนอาจมีการแจ้งร้องเรียนหลายเรื่อง
- `complaints` (Many) ➔ (1) `complaint_categories` : เรื่องร้องเรียน 1 เรื่องถูกจัดอยู่ใน 1 หมวดหมู่หลัก
- `complaints` (Many) ➔ (1) `agencies` : เรื่องร้องเรียน 1 เรื่องถูกมอบหมายให้ 1 หน่วยงานหลักรับผิดชอบ (การออกแบบนี้เหมาะสมกับ Phase ปัจจุบัน หากในอนาคตต้องการ 1 เรื่อง ➔ หลายหน่วยงาน อาจต้องสร้างตารางเชื่อม `complaint_assignments`)
- `complaint_attachments` (Many) ➔ (1) `complaints` : 1 เรื่องสามารถแนบหลักฐานได้หลายไฟล์
- `complaint_status_logs` (Many) ➔ (1) `complaints` : 1 เรื่องจะมีประวัติการเปลี่ยนสถานะ (Log) สะสมเพิ่มขึ้นเรื่อยๆ
- `complaint_comments` (Many) ➔ (1) `complaints` : 1 เรื่องมีประวัติการสื่อสาร/อัปเดตงานหลายครั้ง

---

## 7. ตาราง Master Data ที่ควรมี
1. `agencies` (รายชื่อหน่วยงาน)
2. `complaint_categories` (หมวดหมู่เรื่องร้องเรียน)
3. `users` (รายชื่อเจ้าหน้าที่ผู้ใช้งาน)

## 8. ตาราง Transaction ที่ควรมี
1. `complainants` (ข้อมูลประชาชนผู้ร้อง)
2. `complaints` (ใบคำร้อง/เรื่องร้องเรียน)
3. `complaint_attachments` (ไฟล์แนบประกอบคำร้อง)

## 9. ตาราง Log/History ที่ควรมี
1. `complaint_status_logs` (Audit Trails สำหรับติดตามกระบวนการทำงาน)
2. `complaint_comments` (Progress Updates & Internal Communications)

---

## 10. ข้อควรระวังเรื่องข้อมูลส่วนบุคคล (PDPA Concerns)
- **การแยกตาราง `complainants` ออกมาอย่างชัดเจน:** การออกแบบนี้ทำเพื่อให้ข้อมูลที่มีความเป็นส่วนตัวสูง (PII - Personally Identifiable Information) เช่น ชื่อ เบอร์โทร บัตรประชาชน ถูกแยกออกมาจากข้อมูลเรื่องร้องเรียนทั่วไป ทำให้จำกัดสิทธิ์การเข้าถึงข้อมูลตารางนี้ระดับ Database หรือ API ได้ง่ายขึ้น
- **การปกปิดข้อมูล (Data Masking):** หากหน่วยงานที่รับผิดชอบไม่มีสิทธิ์เห็นชื่อผู้ร้องเรียน ระบบควรดึงข้อมูลแค่จากตาราง `complaints` โดยไม่ต้อง Join กับ `complainants` หรือทำ Masking ข้อมูล
- **กรณีไม่ประสงค์ออกนาม (Anonymous):** ตาราง `complainants` ต้องออกแบบให้ Field ส่วนใหญ่ยอมรับค่า `NULL` ได้ หรือมี Flag `is_anonymous = true` เพื่อรองรับสิทธิในการปกปิดตัวตนของประชาชนตามกฎหมาย
- **ความโปร่งใสและตรวจสอบได้ (Accountability):** ตาราง `complaint_status_logs` ขาดไม่ได้เลย เพราะระบบราชการจำเป็นต้องสามารถระบุตัวตนเจ้าหน้าที่ที่กดทำรายการเปลี่ยนแปลงทุกขั้นตอนได้ ป้องกันข้อครหาการละเว้นปฏิบัติหน้าที่หรือทุจริต
