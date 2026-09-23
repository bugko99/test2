# REST API Contract: ระบบรับเรื่องร้องเรียนศูนย์ดำรงธรรมจังหวัดศรีสะเกษ (DCMS)
(Project Name: BUGKOShop)

เอกสารฉบับนี้กำหนดรูปแบบของ RESTful API (Application Programming Interface) เบื้องต้น สำหรับใช้งานระหว่าง Frontend และ Backend ของระบบ

**คำย่อสำหรับสิทธิ์ (Roles):**
- **SA:** Super Admin
- **DS:** เจ้าหน้าที่ศูนย์ดำรงธรรม (DCMS Staff)
- **DH:** หัวหน้าศูนย์ดำรงธรรม (DCMS Head)
- **AO:** หน่วยงานที่รับผิดชอบ (Agency Officer)
- **EX:** ผู้บริหารจังหวัด (Executive)
- **SYS:** System / Public API (กรณีเชื่อมระบบกลาง)
- **ALL:** ใช้งานได้ทุก Role ที่ Login แล้ว

---

## 1. Auth Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| POST | `/api/auth/login` | เข้าสู่ระบบ | `username`, `password` | `token`, `user_profile` | ❌ | - | คืนค่า JWT |
| POST | `/api/auth/logout` | ออกจากระบบ | - | `message` | ✅ | ALL | |
| GET | `/api/auth/me` | ดึงข้อมูลผู้ใช้ปัจจุบัน | - | `user_profile` | ✅ | ALL | ใช้เมื่อ Refresh หน้า |

## 2. Users Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/users` | ดูรายชื่อเจ้าหน้าที่ | `?role`, `?agency_id` | `[users]` | ✅ | SA, DH | |
| POST | `/api/users` | เพิ่มเจ้าหน้าที่ | `username`, `password`, `role`, `agency_id` | `user_object` | ✅ | SA | |
| PUT | `/api/users/:id` | แก้ไขข้อมูลเจ้าหน้าที่ | `email`, `role`, `agency_id` | `user_object` | ✅ | SA | |
| DELETE| `/api/users/:id` | ระงับเจ้าหน้าที่ | - | `message` | ✅ | SA | Soft Delete |

## 3. Agencies Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/agencies` | ดูรายชื่อหน่วยงาน | - | `[agencies]` | ✅ | ALL | ใช้ทำ Dropdown |
| POST | `/api/agencies` | เพิ่มหน่วยงาน | `name`, `description` | `agency_object` | ✅ | SA | |
| PUT | `/api/agencies/:id`| แก้ไขชื่อหน่วยงาน | `name`, `is_active` | `agency_object` | ✅ | SA | |

## 4. Complaint Categories Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/categories` | ดูหมวดหมู่ทั้งหมด | - | `[categories]` | ✅ | ALL | ใช้ทำ Dropdown |
| POST | `/api/categories` | เพิ่มหมวดหมู่ | `name`, `default_sla` | `category_object` | ✅ | SA | |
| PUT | `/api/categories/:id`| แก้ไขหมวดหมู่ | `name`, `default_sla`, `active`| `category_object` | ✅ | SA | |

## 5. Complaints Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/complaints` | ดูรายการเรื่องร้องเรียน | `?status`, `?agency`, `?search` | `[complaints_list]`, pagination| ✅ | DS, DH, AO, EX | AO เห็นเฉพาะเรื่องของตน |
| GET | `/api/complaints/:id`| ดูรายละเอียด 1 เรื่อง | - | `complaint_detail_obj` | ✅ | DS, DH, AO, EX | |
| POST | `/api/complaints` | สร้างเรื่องร้องเรียนใหม่ | ข้อมูลผู้ร้อง + รายละเอียดเรื่อง + รูปแบบ | `complaint_obj`, `tracking_id` | ✅ | DS, DH, SYS | SYS = นำเข้าจากส่วนกลาง |
| PUT | `/api/complaints/:id`| แก้ไขรายละเอียดเรื่อง | ข้อมูลแก้ไข | `complaint_obj` | ✅ | DS, DH | แก้ได้ตอนสถานะ NEW |
| GET | `/api/track/:trackNo`| ติดตามเรื่อง (Public) | - | `status`, `timeline` | ❌ | - | สำหรับประชาชนค้นหา |

## 6. Complaint Assignment Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| PUT | `/api/complaints/:id/assign` | มอบหมายให้หน่วยงาน | `agency_id`, `sla_due_date` | `complaint_obj` (สถานะ ASSIGNED) | ✅ | DS, DH | |

## 7. Complaint Updates Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| PUT | `/api/complaints/:id/status`| เปลี่ยนสถานะ | `new_status`, `remark` | `complaint_obj` (สถานะเปลี่ยน) | ✅ | DS, DH, AO | เช่น AO รับเรื่อง, DS ปิดเรื่อง |
| GET | `/api/complaints/:id/comments`| ดึงประวัติการคุย/คอมเมนต์ | - | `[comments]` | ✅ | DS, DH, AO | |
| POST | `/api/complaints/:id/comments`| พิมพ์ข้อความอัปเดต | `comment_text`, `is_internal` | `comment_obj` | ✅ | DS, DH, AO | |

## 8. Attachments Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| POST | `/api/complaints/:id/files` | อัปโหลดไฟล์แนบ | `FormData(file)` | `file_path/url` | ✅ | DS, DH, AO, SYS| |
| DELETE| `/api/attachments/:id` | ลบไฟล์แนบ | - | `message` | ✅ | DS, DH, AO | ลบได้เฉพาะคนที่อัปโหลด |

## 9. Notifications Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/notifications` | ดูการแจ้งเตือนของฉัน | `?is_read=false` | `[notifications]` | ✅ | DS, DH, AO | |
| PUT | `/api/notifications/:id/read` | มาร์คว่าอ่านแล้ว | - | `message` | ✅ | DS, DH, AO | |

## 10. Dashboard Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/dashboard/summary`| สรุปตัวเลขสถิติ (Cards) | `?date_range` | `total`, `completed`, `overdue` | ✅ | DS, DH, EX | |
| GET | `/api/dashboard/stats` | ข้อมูลกราฟ | `?group_by=agency/category` | `chart_data` | ✅ | DH, EX | |

## 11. Reports Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/reports/export` | Export ข้อมูล Excel/CSV | `?status`, `?date_range`, `?agency` | `File Download Stream` | ✅ | DS, DH, EX | |

## 12. Audit Logs Module
| Method | Endpoint | Description | Request Body สรุป | Response สรุป | Auth Req. | Role ที่ใช้งานได้ | หมายเหตุ |
|---|---|---|---|---|---|---|---|
| GET | `/api/logs/complaints/:id`| ดูประวัติการเปลี่ยนสถานะ | - | `[status_logs]` | ✅ | DS, DH, SA | สำหรับเช็ค Timeline ของ 1 เรื่อง |
| GET | `/api/logs/system` | ดู Log การทำงานรวมของระบบ| `?date_range`, `?user_id` | `[system_logs]` | ✅ | SA | สำหรับหาคนทำข้อมูลผิดพลาด |
