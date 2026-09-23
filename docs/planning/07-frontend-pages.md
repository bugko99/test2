# Frontend Page Structure: ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)
(Project Name: BUGKOShop)

เอกสารฉบับนี้สรุปโครงสร้างหน้าจอและส่วนติดต่อผู้ใช้งาน (User Interface) ซึ่งจะถูกพัฒนาด้วย React 18, Vite 5, MUI 5 และ React Router

## 1. Layout หลัก (Main Layout)
ระบบจะใช้ Layout 2 รูปแบบหลัก:
1. **Public Layout:** สำหรับหน้า Login และหน้าค้นหาสถานะของประชาชน (ไม่มี Sidebar, มีเฉพาะ Topbar หรือ Header แบบเรียบง่าย)
2. **Dashboard Layout:** สำหรับเจ้าหน้าที่หลังจาก Login เข้าสู่ระบบ
   - **Topbar:** แสดงชื่อผู้ใช้งาน, หน่วยงานต้นสังกัด, ไอคอนกระดิ่งแจ้งเตือน (Notifications), และปุ่ม Logout
   - **Sidebar (Navigation):** เมนูนำทางด้านซ้าย (ยืด/หดได้) เมนูจะแสดง/ซ่อนตาม Role ของผู้ใช้งาน
   - **Main Content:** พื้นที่แสดงเนื้อหาหลัก

---

## 2. โครงสร้างหน้าจอแยกตามกลุ่มผู้ใช้

### กลุ่มที่ 1: ประชาชน (Citizen / Public)
| หน้าจอ (Page) | URL Path | สิทธิ์ (Role) | ข้อมูล/UI ที่แสดง | Action/ปุ่มสำคัญ | เชื่อมโยง API |
|---|---|---|---|---|---|
| **Login** | `/login` | Public | ฟอร์มกรอก Username / Password | `เข้าสู่ระบบ` | `POST /api/auth/login` |
| **หน้าค้นหาสถานะ** | `/track` | Public | ฟอร์มกรอกเลข Tracking Number, Timeline บอกสถานะล่าสุด | `ค้นหาสถานะ` | `GET /api/track/:trackNo` |

---

### กลุ่มที่ 2: Admin (Super Admin)
*เข้าถึงหน้าของกลุ่มอื่นๆ ได้ และมีหน้าจัดการพื้นฐานเฉพาะกลุ่มตนเองดังนี้:*
| หน้าจอ (Page) | URL Path | สิทธิ์ (Role) | ข้อมูล/UI ที่แสดง | Action/ปุ่มสำคัญ | เชื่อมโยง API |
|---|---|---|---|---|---|
| **จัดการผู้ใช้งาน** | `/admin/users` | SA | ตารางรายชื่อ User (ชื่อ, อีเมล, สิทธิ์, หน่วยงาน) | `เพิ่มผู้ใช้`, `แก้ไข`, `ลบ` | `GET, POST, PUT, DELETE /api/users` |
| **จัดการหน่วยงาน** | `/admin/agencies` | SA | ตารางรายชื่อหน่วยงานที่รับผิดชอบ | `เพิ่มหน่วยงาน`, `แก้ไข` | `GET, POST, PUT /api/agencies` |
| **จัดการหมวดหมู่** | `/admin/categories` | SA | ตารางหมวดหมู่เรื่องร้องเรียน และ SLA มาตรฐาน | `เพิ่มหมวดหมู่`, `แก้ไข` | `GET, POST, PUT /api/categories` |
| **System Logs** | `/admin/logs` | SA | ตารางประวัติการทำงานของระบบ (System Audit) | `ค้นหา`, `กรองวันที่` | `GET /api/logs/system` |

---

### กลุ่มที่ 3: ผู้บริหาร (Executive)
*เน้นดูภาพรวม ไม่เน้นปฏิบัติการ*
| หน้าจอ (Page) | URL Path | สิทธิ์ (Role) | ข้อมูล/UI ที่แสดง | Action/ปุ่มสำคัญ | เชื่อมโยง API |
|---|---|---|---|---|---|
| **Executive Dashboard** | `/dashboard/executive` | EX, DH | - Dashboard Cards (เรื่องทั้งหมด, เสร็จแล้ว, เกิน SLA)<br>- กราฟแท่ง (เรื่องแยกตามหน่วยงาน)<br>- กราฟโดนัท (แยกตามสถานะ) | `กรองตามเดือน/ปี` | `GET /api/dashboard/summary`<br>`GET /api/dashboard/stats` |
| **รายงานสถิติ** | `/reports` | EX, DH, DS | ตารางสรุปข้อมูลเชิงลึก สำหรับนำไปทำรายงาน | `Export Excel`, `Export CSV` | `GET /api/reports/export` |

---

### กลุ่มที่ 4: เจ้าหน้าที่ศูนย์ดำรงธรรม (DCMS Staff & Head)
*เป็นกลุ่มที่ใช้งานระบบหนักที่สุด มีหน้าจอการจัดการเรื่องร้องเรียนเต็มรูปแบบ*
| หน้าจอ (Page) | URL Path | สิทธิ์ (Role) | ข้อมูล/UI ที่แสดง | Action/ปุ่มสำคัญ | เชื่อมโยง API |
|---|---|---|---|---|---|
| **Staff Dashboard** | `/dashboard/staff` | DS, DH | สรุปงานรายวัน: เรื่องเข้าใหม่ (NEW), เรื่องที่แก้เสร็จรอปิดเคส (RESOLVED), งานที่ล่าช้า | `คลิกเพื่อดูรายการ` | `GET /api/dashboard/summary` |
| **รายการเรื่องร้องเรียน** | `/complaints` | DS, DH | ตารางรายการเรื่องร้องเรียนทั้งหมดของศูนย์ฯ (มี Filter สถานะ/หมวดหมู่/วันที่) | `ดูรายละเอียด`, `+ สร้างเรื่องใหม่` | `GET /api/complaints` |
| **ฟอร์มรับเรื่องร้องเรียน** | `/complaints/new` | DS, DH | ฟอร์ม 2 ส่วน: 1. ข้อมูลผู้ร้อง 2. ข้อมูลเรื่องร้องเรียน | `บันทึกเรื่อง`, `แนบไฟล์` | `POST /api/complaints` |
| **รายละเอียดเรื่อง** | `/complaints/:id` | DS, DH | ข้อมูลเรื่องทั้งหมดเต็มหน้า, Timeline สถานะ, ประวัติการคอมเมนต์ | `มอบหมายงาน`, `ปิดเรื่อง`, `ขอข้อมูลเพิ่ม`, `ยกเลิกเรื่อง` | `GET /api/complaints/:id`<br>`PUT /api/complaints/:id/assign`<br>`PUT /api/complaints/:id/status` |
| **แจ้งเตือน** | `/notifications` | DS, DH | รายการแจ้งเตือน (เช่น มีหน่วยงานตอบกลับ, เรื่องใกล้หมดเวลา SLA) | `Mark as Read` | `GET /api/notifications` |

---

### กลุ่มที่ 5: หน่วยงานที่รับผิดชอบ (Agency Officer)
*เห็นเฉพาะเรื่องของตัวเอง และไม่มีสิทธิ์สร้างเรื่องใหม่หรือปิดเรื่องขั้นสุดท้าย*
| หน้าจอ (Page) | URL Path | สิทธิ์ (Role) | ข้อมูล/UI ที่แสดง | Action/ปุ่มสำคัญ | เชื่อมโยง API |
|---|---|---|---|---|---|
| **Agency Dashboard** | `/dashboard/agency` | AO | สรุปงานเฉพาะหน่วยงาน: งานเข้าใหม่ (ASSIGNED), งานกำลังทำ (IN_PROGRESS), งานรอข้อมูล (PENDING_INFO) | `คลิกเพื่อดูรายการ` | `GET /api/dashboard/summary` |
| **รายการเรื่องร้องเรียน** | `/agency/complaints` | AO | ตารางรายการงาน **เฉพาะที่ถูกมอบหมายมาที่หน่วยงานตนเอง** | `ดูรายละเอียด` | `GET /api/complaints?agency_id=ตนเอง` |
| **รายละเอียดเรื่อง** | `/agency/complaints/:id`| AO | ข้อมูลเรื่องร้องเรียน, ฟอร์มอัปเดตความคืบหน้า (ไม่เห็นปุ่มมอบหมายงาน) | `รับเรื่อง`, `อัปเดตความคืบหน้า`, `แนบรายงานผล`, `แจ้งว่าแก้ไขแล้ว` | `GET /api/complaints/:id`<br>`PUT /api/complaints/:id/status`<br>`POST /api/complaints/:id/comments`<br>`POST /api/complaints/:id/files` |

---

## 3. สรุป Components และ Forms ที่ต้องสร้าง (UI Components)
จากการออกแบบหน้าจอข้างต้น จะต้องพัฒนา React Components หลักๆ ด้วย MUI ดังนี้:

1. **Tables (DataGrid):**
   - `ComplaintListTable` (ตารางเรื่องร้องเรียน รองรับ Pagination/Sorting/Filtering)
   - `UserListTable` (ตารางจัดการผู้ใช้)

2. **Forms (React Hook Form + Yup Validation):**
   - `ComplaintIntakeForm` (ฟอร์มรับเรื่องขนาดใหญ่ แบ่ง Section ชัดเจน)
   - `StatusUpdateForm` (ฟอร์ม Pop-up สำหรับเปลี่ยนสถานะ พร้อมช่องกรอกหมายเหตุบังคับ)
   - `AssignAgencyForm` (Dropdown ค้นหาหน่วยงาน พร้อม DatePicker เลือกวัน SLA)

3. **Displays & Views:**
   - `StatusBadge` (ป้ายสีสถานะ เช่น สีเขียว=CLOSED, สีส้ม=IN_PROGRESS, สีแดง=REJECTED/OVERDUE)
   - `TimelineView` (องค์ประกอบแสดงเส้นเวลาจาก `complaint_status_logs`)
   - `CommentSection` (ส่วนแสดงข้อความอัปเดต คล้ายช่องแชท)
   - `FileUploadDropzone` (รองรับการลากวางไฟล์ Drag & Drop)

4. **Dashboard Cards:**
   - `StatCard` (แสดงตัวเลขสถิติกลมๆ)
   - `PieChartCard` (กราฟสัดส่วนเรื่องตามสถานะ)
   - `BarChartCard` (กราฟสถิติแยกตามหน่วยงาน)
