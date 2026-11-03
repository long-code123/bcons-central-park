# Bcons Central Park — Website demo mặt bằng tương tác

Website tĩnh (HTML/CSS/JS thuần, không cần build) demo mặt bằng 2D dự án
Bcons Central Park: khách bấm vào từng khối căn hộ (Tamarind, Palm, Lotus,
Bamboo, Orchid) để xem chi tiết, kèm danh mục 60 tiện ích nội khu có thể
tìm kiếm / lọc theo nhóm.

## Cấu trúc

```
index.html        trang chính
css/style.css      giao diện
js/data.js         dữ liệu khối căn hộ + 60 tiện ích — SỬA Ở ĐÂY
js/script.js       logic tương tác (bản đồ, modal, tìm kiếm...)
assets/siteplan.jpg ảnh mặt bằng tổng thể (đã nén cho web)
```

## Trước khi gửi khách: việc cần làm

1. Mở `js/data.js`, điền số liệu thật cho từng khối (số tầng, tổng số
   căn, loại hình căn hộ, thời gian bàn giao) — hiện đang để `"—"`.
2. Điền hotline/email thật trong `index.html` ở mục Liên hệ (`#lien-he`).
3. Toạ độ polygon của 5 khối (trong `js/data.js`, trường `points`) là
   ước lượng bằng mắt. Để chỉnh chính xác theo từng góc khối:
   - Mở site, bấm nút **"🎯 Chế độ hiệu chỉnh toạ độ"** ở góc dưới bản đồ.
   - Bấm lần lượt vào các góc của khối trên ảnh — toạ độ hiện ra ở ô
     bên dưới (hệ 2000×1125, đúng kích thước ảnh gốc).
   - Copy chuỗi đó dán vào `points` của khối tương ứng trong `data.js`.
4. (Tuỳ chọn) Thay `assets/siteplan.jpg` bằng ảnh phối cảnh/flycam thật
   nếu có, giữ nguyên tên file hoặc cập nhật lại đường dẫn trong
   `index.html`.

## Chạy thử ở máy local

Không cần cài gì nếu máy có Node.js:

```
npx serve .
```

rồi mở `http://localhost:3000` (hoặc port hiển thị trong terminal).

## Deploy miễn phí — chọn 1 trong 2 cách

### Cách 1 — Netlify Drop (nhanh nhất, không cần tài khoản GitHub)

1. Vào https://app.netlify.com/drop
2. Kéo thả cả thư mục `D:\bcons_central_park` vào trang đó.
3. Có link live ngay (dạng `random-name.netlify.app`).
4. Tạo tài khoản Netlify (miễn phí) nếu muốn link cố định / deploy lại
   sau này khi sửa code.

### Cách 2 — GitHub Pages (bền hơn, có thể gắn domain riêng sau này)

Thư mục này đã là một git repo (đã commit sẵn). Các bước:

1. Tạo repo mới (trống) trên https://github.com/new, ví dụ tên
   `bcons-central-park`.
2. Trong terminal tại thư mục dự án:
   ```
   git remote add origin https://github.com/<username>/bcons-central-park.git
   git branch -M main
   git push -u origin main
   ```
3. Vào repo trên GitHub → **Settings → Pages** → Source chọn
   **Deploy from a branch** → branch `main`, folder `/ (root)` → Save.
4. Sau ~1 phút, site chạy tại
   `https://<username>.github.io/bcons-central-park/`.
5. Mỗi lần sửa `data.js`/`index.html`, chạy `git add -A && git commit -m "..."
   && git push` để cập nhật site.

### Cách khác (tương đương, cũng miễn phí)

- **Vercel** — vercel.com, kết nối GitHub repo, deploy tự động mỗi lần push.
- **Cloudflare Pages** — pages.cloudflare.com, tương tự Vercel.

Cả hai không cần cấu hình build gì thêm vì đây là site tĩnh thuần.
