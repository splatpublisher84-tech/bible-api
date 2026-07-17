---
description: Verify (check + typecheck + build + test) rồi commit + push
---

Ship các thay đổi hiện tại theo đúng trình tự, DỪNG NGAY khi một bước đỏ:

1. `git status` — xem có gì để ship; nếu working tree sạch thì báo và dừng.
2. Verify (chạy tuần tự, bước nào fail thì sửa rồi chạy lại từ bước đó):
   - `npm run check`
   - `npm run typecheck`
   - `npm run build`
   - `npm test` — cần PostgreSQL local có data; nếu DB chưa chạy: `docker-compose up -d` rồi thử lại; nếu vẫn không có DB thì HỎI user, không được bỏ qua test âm thầm.
3. Commit: message theo conventional commits (feat/fix/chore/docs...), mô tả đúng thay đổi thật. Nếu đang ở main và thay đổi lớn/rủi ro, hỏi user có muốn tách branch không.
4. `git push`.
5. Báo kết quả: các bước verify pass, commit hash, đã push đến đâu. KHÔNG deploy — deploy là việc của user qua `/deploy`.

$ARGUMENTS
