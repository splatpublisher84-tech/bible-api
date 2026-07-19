---
description: Phỏng vấn owner từng câu một rồi viết spec 1 trang (Objective / Context / Out of scope / Acceptance criteria / Boundaries).
---

# /spec-interview — phỏng vấn ra spec 1 trang

Mục tiêu: giúp owner CHỐT yêu cầu trước khi code, bằng phỏng vấn — không phải
tự bịa spec. Chủ đề phỏng vấn: $ARGUMENTS (nếu trống, hỏi owner muốn chốt spec cho cái gì).

## Luật phỏng vấn

- Hỏi **TỪNG CÂU MỘT** (dùng AskUserQuestion hoặc hỏi trực tiếp), chờ trả lời rồi mới hỏi tiếp.
  KHÔNG dồn 5 câu một lượt.
- Mỗi câu phải xuất phát từ câu trả lời trước — đào sâu, không đi theo checklist máy móc.
- Ưu tiên hỏi những gì owner CHƯA nghĩ tới: người dùng thật là ai, tình huống dùng cụ thể,
  điều gì KHÔNG làm, tiêu chí "xong" đo được, trade-off chấp nhận được.
- Khi phát hiện mâu thuẫn với hiện trạng repo (AGENTS.md, code, backlog), nêu ra ngay.
- Dừng phỏng vấn khi đủ chất liệu cho 5 mục dưới — thường 5–10 câu. Hỏi owner xác nhận
  "đủ chưa?" trước khi viết.

## Đầu ra: spec đúng 1 trang

```
# Spec: <tên>
## Objective        — 1-2 câu: làm gì, cho ai, vì sao
## Context          — hiện trạng liên quan, ràng buộc kỹ thuật
## Out of scope     — liệt kê rõ những gì KHÔNG làm (quan trọng ngang phần làm)
## Acceptance criteria — đo được, kiểm chứng được, đánh số
## Boundaries       — điều agent được/không được tự quyết khi thực thi spec này
```

- Viết xong, đưa owner duyệt và sửa đến khi owner chốt.
- **Lưu spec thành Backlog document** (KHÔNG append vào task notes, KHÔNG tạo file rời):
  `backlog doc create "<tên> Spec" -t specification` rồi `backlog doc update doc-N --content "..."`.
  Spec sản phẩm chính của repo này: **doc-1 "Bible API Product Spec"** — spec mới cho tính năng
  lớn thì cân nhắc sửa doc-1 (thêm FR mới + dòng Amendments) thay vì tạo doc mới.
- Cấu trúc spec dùng **ID bất biến**: `FR-n` cho tính năng, `AC-n.m` cho acceptance criteria.
  Không đánh lại số; bỏ tính năng thì ghi `FR-n: RETIRED`. Điều chưa chốt ghi `PENDING-n`.
- **Link task→spec 1 chiều**: task implement tạo với `--doc "<file doc spec>"` và dòng đầu
  description là `Implements: FR-n (AC-n.m)` — task KHÔNG paste lại nội dung AC.
  Tra ngược khi cần: `backlog search "FR-n"`. Không duy trì bảng spec→task.
- Khi làm task phát hiện spec sai/thiếu: sửa spec + thêm dòng vào mục **Amendments**
  (ngày, đổi gì, phát hiện ở task nào) TRƯỚC khi task Done.
