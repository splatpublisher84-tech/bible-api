---
id: TASK-1
title: Fix throttler trustProxy (rate-limit hong sau proxy Fly)
status: Done
assignee: []
created_date: '2026-07-10 17:09'
updated_date: '2026-07-10 18:55'
labels:
  - security
dependencies: []
priority: high
ordinal: 1000
---

## Description

<!-- SECTION:DESCRIPTION:BEGIN -->
FastifyAdapter mac dinh trustProxy=false -> request.ip la IP proxy Fly, moi user chung 1 ro dem 500/15ph. Fix: new FastifyAdapter({trustProxy:true}); neu them Cloudflare chi trust IP Cloudflare. Ref main.ts:17
<!-- SECTION:DESCRIPTION:END -->

## Acceptance Criteria
<!-- AC:BEGIN -->
- [ ] #1 Rate-limit key theo IP client thật, không phải IP proxy Fly dùng chung
- [ ] #2 Client KHÔNG bypass được bằng cách giả mạo X-Forwarded-For / xoay IP giả
- [ ] #3 KHÔNG dùng trustProxy:true (spoof được); local dev vẫn chạy (fallback req.ip)
- [ ] #4 npm test xanh
- [ ] #5 VERIFY THỰC NGHIỆM: curl Fly-Client-IP gia tren app live, xac nhan Fly ghi de/khong pass-through (cong cuoi truoc khi tin tuyet doi)
<!-- AC:END -->

## Implementation Plan

<!-- SECTION:PLAN:BEGIN -->
1. Thêm helper clientIpTracker(req) đọc header fly-client-ip, fallback req.ip (src/common/client-ip.ts). 2. Truyền getTracker: clientIpTracker vào ThrottlerModule.forRoot (app.module.ts). 3. Unit test 3 case: uu tien fly-client-ip / bo qua x-forwarded-for / fallback req.ip. 4. Verify: npm test + sau deploy curl voi X-Forwarded-For gia de chung minh khong spoof duoc.
<!-- SECTION:PLAN:END -->

## Implementation Notes

<!-- SECTION:NOTES:BEGIN -->
DONE + deployed + verified tren prod. Rate-limit gio key theo Fly-Client-IP (getTracker), khong dung trustProxy:true. VERIFY THUC NGHIEM tren app live (IP_DEBUG=1, /api/debug/ip): gui 'Fly-Client-IP: 9.9.9.9' gia -> Fly GHI DE, tracker van = IP that (9.9.9.9 bi vut) => KHONG spoof duoc. XFF gia bi bo qua. reqIp=172.16.x (IP noi bo Fly, chung cho moi client = bug goc). Full test 33/33. Endpoint debug/ip giu lai (inert, IP_DEBUG unset) dung lai cho TASK-2. Commit 75c5dfe, deployed.
<!-- SECTION:NOTES:END -->
