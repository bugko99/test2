-- 02-seed.sql
USE `bugkoshop_db`;

-- 1. Insert Master Data: Agencies
INSERT INTO `agencies` (`id`, `name`, `description`) VALUES
(1, 'ศูนย์ดำรงธรรมจังหวัดศรีสะเกษ', 'หน่วยงานหลักรับเรื่องร้องเรียน'),
(2, 'สำนักงานสาธารณสุขจังหวัดศรีสะเกษ', 'รับผิดชอบด้านสุขภาพและสาธารณสุข'),
(3, 'ตำรวจภูธรจังหวัดศรีสะเกษ', 'รับผิดชอบด้านความปลอดภัยและกฎหมาย'),
(4, 'สำนักงานโยธาธิการและผังเมืองจังหวัด', 'รับผิดชอบด้านสาธารณูปโภคและสิ่งก่อสร้าง');

-- 2. Insert Master Data: Users
-- All users share the same password: 'password123'
-- Hash: $2b$10$YRRvdawXDV1FJoR9vqxH1OxwQulHbhOu7jJF0fYw4ZCK33aga8K86
INSERT INTO `users` (`id`, `username`, `password_hash`, `email`, `role`, `agency_id`) VALUES
(1, 'admin', '$2b$10$YRRvdawXDV1FJoR9vqxH1OxwQulHbhOu7jJF0fYw4ZCK33aga8K86', 'admin@dcms.go.th', 'super_admin', 1),
(2, 'staff1', '$2b$10$YRRvdawXDV1FJoR9vqxH1OxwQulHbhOu7jJF0fYw4ZCK33aga8K86', 'staff1@dcms.go.th', 'dcms_staff', 1),
(3, 'head1', '$2b$10$YRRvdawXDV1FJoR9vqxH1OxwQulHbhOu7jJF0fYw4ZCK33aga8K86', 'head1@dcms.go.th', 'dcms_head', 1),
(4, 'agency_health', '$2b$10$YRRvdawXDV1FJoR9vqxH1OxwQulHbhOu7jJF0fYw4ZCK33aga8K86', 'health@agency.go.th', 'agency_officer', 2),
(5, 'agency_police', '$2b$10$YRRvdawXDV1FJoR9vqxH1OxwQulHbhOu7jJF0fYw4ZCK33aga8K86', 'police@agency.go.th', 'agency_officer', 3),
(6, 'exec1', '$2b$10$YRRvdawXDV1FJoR9vqxH1OxwQulHbhOu7jJF0fYw4ZCK33aga8K86', 'exec1@gov.th', 'executive', NULL);

-- 3. Insert Master Data: Complaint Categories
INSERT INTO `complaint_categories` (`id`, `name`, `default_sla_days`) VALUES
(1, 'ความเดือดร้อนรำคาญ', 15),
(2, 'การทุจริตประพฤติมิชอบ', 30),
(3, 'ปัญหาสาธารณูปโภค', 15),
(4, 'ข้อเสนอแนะ/ร้องเรียนทั่วไป', 15);

-- 4. Insert Transaction Data: Complainants
INSERT INTO `complainants` (`id`, `id_card_number`, `first_name`, `last_name`, `phone_number`, `address`, `is_anonymous`) VALUES
(1, '1339900000001', 'สมชาย', 'ใจดี', '0812345678', '123 ม.1 ต.เมืองเหนือ อ.เมือง จ.ศรีสะเกษ', FALSE),
(2, NULL, NULL, NULL, NULL, NULL, TRUE);

-- 5. Insert Transaction Data: Complaints
INSERT INTO `complaints` (`id`, `tracking_number`, `title`, `description`, `incident_date`, `incident_location`, `source_channel`, `status`, `sla_due_date`, `complainant_id`, `category_id`, `assigned_agency_id`) VALUES
(1, 'CMP-2026-0001', 'เสียงดนตรีดังรบกวนยามวิกาล', 'ร้านอาหารใกล้บ้านเปิดเพลงเสียงดังมากจนถึงตี 2', '2026-09-20', 'ซอย 5 ถ.ขุขันธ์', 'web', 'IN_PROGRESS', '2026-10-05', 1, 1, 3),
(2, 'CMP-2026-0002', 'ท่อประปาแตก น้ำท่วมขัง', 'ท่อแตกหน้าปากซอยมา 3 วันแล้ว', '2026-09-22', 'หน้าหมู่บ้าน A', 'phone', 'ASSIGNED', '2026-10-07', 2, 3, 4);

-- 6. Insert Log/History Data: Status Logs
INSERT INTO `complaint_status_logs` (`complaint_id`, `changed_by`, `old_status`, `new_status`, `remark`) VALUES
(1, 2, NULL, 'NEW', 'รับเรื่องเข้าระบบ'),
(1, 3, 'NEW', 'ASSIGNED', 'มอบหมายให้ตำรวจภูธรตรวจสอบ'),
(1, 5, 'ASSIGNED', 'IN_PROGRESS', 'รับทราบ กำลังจัดส่งเจ้าหน้าที่ลงพื้นที่'),
(2, 2, NULL, 'NEW', 'รับแจ้งทางโทรศัพท์'),
(2, 3, 'NEW', 'ASSIGNED', 'มอบหมายโยธาธิการ');
