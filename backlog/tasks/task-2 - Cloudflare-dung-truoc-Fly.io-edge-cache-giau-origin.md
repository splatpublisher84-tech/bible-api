---
id: TASK-2
title: Cloudflare dung truoc Fly.io (edge cache + giau origin)
status: Done
assignee: []
created_date: '2026-07-10 17:09'
updated_date: '2026-07-17 11:34'
labels:
  - security
dependencies: []
priority: high
ordinal: 2000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
Data Kinh Thanh tinh -> cache o edge + 1 rate-rule free + giau origin -> bao ve quota free tier manh nhat (ROI cao nhat)
<!-- SECTION:DESCRIPTION:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
PARKED (2026-07-12) — chan boi prerequisite: chua co custom domain (Fly certs rong). Research + adversarial DA XONG, ket luan chinh:
- Loi ich lon nhat = EDGE CACHE data tinh (bao ve quota), KHONG phai giau origin.
- KHONG the giau han *.fly.dev tren free tier (public, doan duoc ten app). 2 nhanh: (A) giu scale-to-zero + guard chan direct-hit o L7 (403 van wake may); (B) Cloudflare Tunnel + release IP public = dong han nhung MAT scale-to-zero.
- CANH BAO: dung doi rate-limit sang cf-connecting-ip cho toi KHI da co CloudflareOnlyGuard (kiem Fly-Client-IP thuoc dai CF) — neu khong se la BUOC LUI (cf-connecting-ip bia duoc o direct-origin).
- CF free rate-limit (1 rule, per-IP 10s) KHONG chan crawler phan tan; cache moi la thu chan.
- Da co san: buoc setup (fly certs add + CF proxied + Full strict + Cache Rule), code CloudflareOnlyGuard (net.BlockList dai IP CF) trong ket qua workflow wf_f2fe4573. Khi co domain -> lay ra dung.
DECISION: user hoan TASK-2, uu tien hardening re truoc (TASK-3/4/6/7).

Quyết định KHÔNG làm: Cloudflare không có gói free tier phù hợp với quy mô dự án hiện tại. Có thể mở lại nếu nhu cầu edge cache / giấu origin trở nên cấp thiết.
<!-- SECTION:NOTES:END -->

## Final Summary

<!-- SECTION:FINAL_SUMMARY:BEGIN -->
Đóng không thực hiện (won't do) — free tier Cloudflare không phù hợp dự án hiện giờ, quyết định của owner 17/07/2026.
<!-- SECTION:FINAL_SUMMARY:END -->
