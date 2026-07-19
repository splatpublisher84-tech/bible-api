---
id: doc-1
title: Bible API Product Spec
type: specification
created_date: '2026-07-19 06:39'
updated_date: '2026-07-19 06:40'
---
# Bible API Product Spec

Phiên bản: v1.1 (19/07/2026). Nguồn: phỏng vấn /spec-interview (TASK-20) + research TASK-25 (thị trường/bản dịch) + TASK-24 (content playbook).

Quy ước: mỗi section có ID bất biến (FR-n, AC-n.m). Task tham chiếu bằng `Implements: FR-n (AC-n.m)`; tra ngược bằng `backlog search "FR-n"`. Không đánh lại số; tính năng bỏ thì ghi RETIRED.

## 0. Objective & Context

Bible API là backend RIÊNG cho app mobile đọc Kinh Thánh của owner (không phải public API — contract được đổi tự do đến khi app tích hợp). App: mỗi ngày 1 bộ content curate tay + explore verse theo chủ đề + đọc theo sách/chương đa bản dịch. Nội dung curate soạn thủ công, nạp qua seed — API read-only, không auth (user data app lưu local).

Hiện trạng kỹ thuật: NestJS 11 + Fastify + Drizzle + PostgreSQL 16, deploy Fly.io + Supabase (free 500MB). Đã có: translations/books/verses/search/votd, 2 bản dịch (Cadman vi, KJV en).

## FR-1: Daily content (verse + reflection + question + pray)

Mỗi ngày mọi user thấy CÙNG 1 verse (cơ chế chọn theo ngày như votd hiện tại). Nội dung gắn THEO VERSE (không theo lịch riêng): ngày ra verse nào thì kèm bộ content của verse đó. Cấu trúc 4 block theo thứ tự, tổng trải nghiệm ≤3–5 phút:

1. Verse: 1–4 câu, NGUYÊN VĂN bản dịch, reference chính xác.
2. Reflection siêu ngắn: 1–2 câu (1 ý bối cảnh + 1 ý áp dụng).
3. Question suy ngẫm: 1 câu hỏi + 3 lựa chọn, không đúng/sai (app xử lý hiển thị local).
4. Pray đóng: 40–80 từ.

Ràng buộc schema (chừa đường, không làm ở v1): cột reflection cho phép mở rộng độ dài; cấu trúc cho phép sau này pray theo lựa chọn của question (v1: 1 pray chung).

- AC-1.1: GET votd trả verse của ngày + reflection + question (3 lựa chọn) + pray, theo ngôn ngữ client yêu cầu.
- AC-1.2: Cùng 1 ngày (theo ngày local của client — xem FR-6), mọi request trả cùng 1 verse.
- AC-1.3: Payload đủ gọn và cache được để dùng cho widget màn hình chính (cache dài).

## FR-2: Explore theo chủ đề

Kho chủ đề đặt tên theo CẢM XÚC/HOÀN CẢNH SỐNG (không theo sách/thần học). V1 gồm đúng 2 lớp: chủ đề → danh sách verse gán vào chủ đề. API trả TOÀN BỘ verses của 1 chủ đề (ổn định, cache 24h); client tự shuffle.

V1 launch với 8 chủ đề Tier 1: Lo âu & sợ hãi, Tình yêu thương, Sức mạnh, Hy vọng, Bình an, Chữa lành, Khích lệ, Cầu nguyện. (Tier 2, pack theo mùa, series nhiều ngày: out of scope v1 — xem mục Out of scope.)

- AC-2.1: Endpoint danh sách chủ đề theo ngôn ngữ client.
- AC-2.2: Endpoint trả toàn bộ verses của 1 chủ đề, cache 24h.
- AC-2.3: Đủ 8 chủ đề Tier 1 có data thật khi launch.

## FR-3: Đọc theo sách/chương, đa bản dịch

Giữ như hiện tại: danh sách sách, đọc trọn chương, chọn bản dịch (endpoints books/verses).

- AC-3.1: Đọc theo sách/chương hoạt động với mọi bản dịch đã nạp (danh sách bản dịch: PENDING-1).

## FR-4: Gỡ full-text search

/api/search gỡ khỏi API surface (app không có tính năng tìm kiếm). GIN index gỡ nếu không còn gì dùng.

- AC-4.1: /api/search không còn trong API surface (404 theo format lỗi chuẩn).

## FR-5: Quy trình data (import bản dịch + seed content curate)

Thêm bản dịch = import data (converter theo định dạng nguồn USFM/SWORD/CSV + record translations + book_names) — không đổi code API. Content curate (chủ đề, reflection, question, pray) nạp qua seed/script.

- AC-5.1: Quy trình import bản dịch mới + nạp content curate được document trong AGENTS.md.
- AC-5.2: Kiểm dung lượng Supabase 500MB trước khi import thêm bản dịch.

## FR-6: Đa ngôn ngữ theo client

Nội dung curate (tên chủ đề, reflection, question, pray) đa ngôn ngữ, trả theo ngôn ngữ client gửi lên. Endpoint daily (FR-1) resolve theo ngày local + locale của client.

- AC-6.1: Ngôn ngữ client không có content → fallback được định nghĩa rõ (mặc định: en).

## PENDING — chưa chốt (không code phần phụ thuộc khi chưa chốt)

- PENDING-1: Bộ ngôn ngữ + bản dịch launch. Kiểm kê đầy đủ + đề xuất nằm ở TASK-25 notes (đề xuất đang treo: 6 ngôn ngữ / ~13 bản PD; content curate ưu tiên es+en). Owner sẽ chốt sau.
- PENDING-2: Số lượng verse/chủ đề và tổng số verse có content daily ở launch.

## Out of scope (v1)

1. Full-text search (FR-4 gỡ bỏ).
2. Auth, user accounts, mọi write/admin API. Prayer list sync, streak server-side (streak để client-side).
3. Series nhiều ngày theo chủ đề (ứng viên v2 — cần schema series riêng, quyết khi có tín hiệu retention).
4. Chủ đề Tier 2 + pack theo mùa (soạn sau launch).
5. AI sinh nội dung runtime (content do người soạn — ghi rõ trong app/store listing).
6. Parse Strong's numbers (TASK-16 riêng).
7. Audio cho daily content (ứng viên v2).
8. Cam kết API contract cho bên ngoài.

## Content guideline (ràng buộc khi soạn content — chi tiết đầy đủ ở TASK-24 notes)

- Checklist thần học đa hệ phái: verse nguyên văn + double-check reference; đọc cả chương trước khi gán verse vào chủ đề; pray hướng thẳng God/Jesus/Holy Spirit; chỉ 66 sách chung; tránh danh sách chủ đề cấm (Mary/thánh, sola scriptura, Eucharist, chính trị, prosperity gospel...).
- Per-market: vi dùng 100% từ vựng hệ Tin Lành (Đức Chúa Trời, Giăng — theo bản Cadman); es viết bản riêng không dịch máy; pt/fr chưa launch content khi chưa research văn hóa.

## Boundaries (cho agent thực thi spec này)

- Tự quyết (trình bày trước khi implement): shape schema/DTO/endpoint mới, tổ chức bảng đa ngôn ngữ.
- Hỏi owner trước: xoá bảng/code hiện có (search, votd_calendar, book_aliases), merge PR #7, đổi contract sau khi app tích hợp, mọi việc dính PENDING-1/2.
- Cấm: thêm auth/write API, commit secret, tự bịa content thay owner.

## Amendments

- 19/07/2026: v1.1 — gộp content playbook (TASK-24): thêm block reflection siêu ngắn + thứ tự 4 block (FR-1), chốt 8 chủ đề Tier 1 lớp 1+2 (FR-2), thêm FR-6 (ngày local + fallback ngôn ngữ); phần ngôn ngữ/bản dịch chuyển từ "đã chốt 6 ngôn ngữ" (v1.0, 18/07) về PENDING-1 theo quyết định owner.
