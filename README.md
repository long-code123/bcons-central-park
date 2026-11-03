# Bcons Central Park — Website demo mặt bằng tương tác

Website tĩnh (HTML/CSS/JS thuần, không cần build) demo mặt bằng 2D dự án
Bcons Central Park: khách bấm vào từng khối căn hộ (Tamarind, Palm, Lotus,
Bamboo, Orchid) để xem chi tiết, từ đó xem tiếp **mặt bằng tầng điển hình**
(bấm từng căn để xem diện tích/giá, chuyển qua lại giữa các tầng), và có
một trang **Bảng giá** liệt kê toàn bộ căn hộ của mọi tầng/mọi khối, lọc
và tìm kiếm được. Kèm danh mục 60 tiện ích nội khu có thể tìm kiếm/lọc.

## Cấu trúc

```
index.html                          trang chính (gồm cả 2 trang con: mặt bằng tầng, bảng giá)
css/style.css                       giao diện
js/data.js                          dữ liệu khối, tiện ích, mặt bằng tầng — SỬA Ở ĐÂY
js/orchid-prices.js                 GIÁ THẬT khối Orchid — sinh tự động, không sửa tay (xem bên dưới)
js/script.js                        logic tương tác (bản đồ, modal, routing, bảng giá...)
assets/siteplan.jpg                 ảnh mặt bằng tổng thể (đã nén cho web)
assets/floorplans/orchid-typical.jpg ảnh mặt bằng tầng điển hình khối Orchid
```

## Giá thật khối Orchid — `js/orchid-prices.js`

File này **sinh tự động** từ file giá CĐT gửi (`Giá & Mặt bằng Bcons_1.html`),
không gõ tay để tránh sai số ở các số tiền 10 chữ số. Dữ liệu: 537 căn,
tầng 3–22, mỗi căn có 3 phương thức thanh toán (PTTT 01 · CK 8,5% / PTTT
02·03 / PTTT 04·05 · CK 2,45%) × giá chưa VAT/có VAT, phí bảo trì, cờ
"rổ giá tốt" và trạng thái thật (`open`/`sold`/`lock`).

Khi có **file giá CĐT mới** (cùng định dạng, biến `const D = [...]`),
chạy lại script sinh file (không cần Claude, chạy thẳng bằng Node):

```
node tools/gen-orchid-prices.js "đường dẫn file giá mới.html" js/orchid-prices.js
```

(copy script từ `scratchpad` của phiên làm việc này vào `tools/` nếu muốn
dùng lại lâu dài — nội dung script chỉ ~40 dòng, đọc biến `const D` trong
file giá, lọc khối Orchid, ghi lại `js/orchid-prices.js`.)

Trang mặt bằng tầng và trang Bảng giá tự động ưu tiên dùng giá thật này
cho Orchid; khối nào chưa có file giá tương tự thì vẫn hiển thị "Liên hệ"
(qua `PRICE_CONFIG` trong `js/data.js`) như cũ.

## Mặt bằng tầng & Bảng giá — cách hoạt động

- Trong `js/data.js`, object `FLOOR_PLANS` khai báo mặt bằng tầng điển hình
  theo từng khối. Hiện chỉ `orchid` có dữ liệu thật (27 căn, đúng TT/LL
  từ bản vẽ bạn gửi). Khi có bản vẽ mặt bằng tầng của Tamarind/Palm/
  Lotus/Bamboo, thêm vào `FLOOR_PLANS` theo đúng cấu trúc của `orchid`
  (copy ảnh vào `assets/floorplans/`, liệt kê từng căn với `num/code/tt/ll/x/y`).
- `FLOOR_PLANS.orchid.floors` lấy đúng theo dữ liệu giá thật (tầng 3–22).
- Vị trí số căn trên ảnh Orchid (`x`, `y`, tính theo %) được dò bằng
  phân tích màu pixel trên ảnh gốc (không phải ước lượng bằng mắt) nên
  khá chính xác. Nếu sau này thêm mặt bằng tầng cho khối khác, đo thủ
  công toạ độ % của từng số căn theo ảnh mới rồi điền vào `units`.
- Giá: `PRICE_CONFIG` trong `data.js` đang để `null` toàn bộ → site hiển
  thị **"Liên hệ"** thay vì bịa số. Khi có bảng giá/m² chính thức, điền
  vào `PRICE_CONFIG.perBlock` (theo khối) hoặc `PRICE_CONFIG.perUnitCode`
  (theo loại căn, ví dụ `{ B5: 34000000 }`) — site sẽ tự tính thành tiền
  = đơn giá × TT cho từng căn, ở cả trang mặt bằng tầng và trang Bảng giá.
- Trang Bảng giá (`#/price-list`, vào từ menu "Bảng giá") tự sinh danh
  sách = mọi khối có trong `FLOOR_PLANS` × mọi tầng × mọi căn — không
  cần nhập tay từng dòng.

## Trước khi gửi khách: việc cần làm

1. Mở `js/data.js`, điền số liệu thật cho từng khối (số tầng, tổng số
   căn, loại hình căn hộ, thời gian bàn giao) — hiện đang để `"—"`.
   (Riêng Orchid đã có giá/số liệu thật, xem mục bên dưới.)
2. Điền hotline/email thật trong `index.html` ở mục Liên hệ (`#lien-he`).
3. (Tuỳ chọn) Thay `assets/siteplan.jpg` bằng ảnh phối cảnh/flycam thật
   nếu có, giữ nguyên tên file hoặc cập nhật lại đường dẫn trong
   `index.html`.
4. Xem mục "Mặt bằng tầng & Bảng giá" bên dưới khi cần thêm mặt bằng
   tầng cho khối khác hoặc điền giá chính thức.

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
