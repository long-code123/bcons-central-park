/* ============================================================
   DỮ LIỆU DỰ ÁN — chỉnh sửa trực tiếp ở file này.
   - points: toạ độ polygon (x,y) theo hệ 2000x1125 (kích thước gốc
     ảnh mặt bằng assets/siteplan.jpg). Dùng "Chế độ hiệu chỉnh"
     (nút ở góc dưới bản đồ) để click lấy toạ độ chính xác rồi dán
     lại vào đây.
   - Các trường "—" là placeholder, cần cập nhật số liệu thật.
================================================================ */

const BLOCKS = [
  {
    id: "tamarind",
    name: "TAMARIND",
    color: "#c14a1f",
    points: "235,200 480,195 483,290 350,293 352,430 232,428",
    tag: "Khối căn hộ",
    desc: "Khối căn hộ phía Bắc dự án, tiếp giáp Hẻm 238 Phan Trung, gần công viên tre vàng và khu vườn cổng chào.",
    floors: "—",
    units: "—",
    types: "—",
    handover: "—",
    nearby: [36, 37, 38, 39, 30, 31]
  },
  {
    id: "palm",
    name: "PALM",
    color: "#15806b",
    points: "277,563 423,558 428,1012 282,1015",
    tag: "Khối căn hộ",
    desc: "Khối căn hộ phía Tây, view trọn công viên nội khu và chuỗi hồ bơi — hồ Resort, hồ Massage, hồ trẻ em.",
    floors: "—",
    units: "—",
    types: "—",
    handover: "—",
    nearby: [43, 44, 45, 46, 51, 52]
  },
  {
    id: "lotus",
    name: "LOTUS",
    color: "#a66a00",
    points: "452,458 650,452 655,985 457,990",
    tag: "Khối căn hộ",
    desc: "Khối căn hộ trung tâm, kết nối trực tiếp với quảng trường ánh sáng và sân chơi nghệ thuật.",
    floors: "—",
    units: "—",
    types: "—",
    handover: "—",
    nearby: [1, 2, 3, 4, 5, 15]
  },
  {
    id: "bamboo",
    name: "BAMBOO",
    color: "#5b4b9e",
    points: "687,410 905,403 908,900 690,905",
    tag: "Khối căn hộ",
    desc: "Khối căn hộ trung tâm, liền kề đường hầm khám phá và cụm sân thể thao ngoài trời.",
    floors: "—",
    units: "—",
    types: "—",
    handover: "—",
    nearby: [13, 14, 15, 16, 17, 18]
  },
  {
    id: "orchid",
    name: "ORCHID",
    color: "#a83368",
    points: "945,405 1065,398 1068,985 950,988",
    tag: "Khối căn hộ",
    desc: "Khối căn hộ phía Đông, gần nhà trẻ B.School, trạm sạc xe điện và khu shopping mall.",
    floors: "—",
    units: "—",
    types: "—",
    handover: "—",
    nearby: [58, 9, 8, 10, 59]
  }
];

const AMENITIES = [
  { id: 1, name: "Cổng chào nghệ thuật", cat: "canh-quan" },
  { id: 2, name: "Quảng trường ánh sáng", cat: "giai-tri" },
  { id: 3, name: "Ghế đá di động", cat: "giai-tri" },
  { id: 4, name: "Sàn nước nghệ thuật", cat: "canh-quan" },
  { id: 5, name: "Bồn cây chà là di động", cat: "giai-tri" },
  { id: 6, name: "Khu Shopping Mall", cat: "tien-ich" },
  { id: 7, name: "Khu Coffee ngoài trời", cat: "giai-tri" },
  { id: 8, name: "Khu thư giãn cọ Mỹ", cat: "giai-tri" },
  { id: 9, name: "Cây nguyện ước", cat: "canh-quan" },
  { id: 10, name: "Mái che điểm nhấn", cat: "canh-quan" },
  { id: 11, name: "Khu chiếu phim ngoài trời", cat: "giai-tri" },
  { id: 12, name: "Thảm cỏ sự kiện", cat: "canh-quan" },
  { id: 13, name: "Sân chơi nghệ thuật", cat: "the-thao" },
  { id: 14, name: "Tường cây xanh", cat: "canh-quan" },
  { id: 15, name: "Đường hầm khám phá", cat: "the-thao" },
  { id: 16, name: "Cầu trượt ngoài trời", cat: "the-thao" },
  { id: 17, name: "Xà đơn liên hoàn", cat: "the-thao" },
  { id: 18, name: "Sân bóng rổ ngoài trời", cat: "the-thao" },
  { id: 19, name: "Cây bằng lăng tím điểm nhấn", cat: "canh-quan" },
  { id: 20, name: "Hồ Nhật Nguyệt", cat: "the-thao" },
  { id: 21, name: "Bãi đỗ xe máy ngoài trời", cat: "tien-ich" },
  { id: 22, name: "Sân thiền định", cat: "giai-tri" },
  { id: 23, name: "Hồ hoa thuỷ sinh", cat: "giai-tri" },
  { id: 24, name: "Đường dạo trên hồ", cat: "canh-quan" },
  { id: 25, name: "Đá bước dằm", cat: "canh-quan" },
  { id: 26, name: "Sảnh bàn ghế ngoài trời", cat: "giai-tri" },
  { id: 27, name: "Khu hoá vàng", cat: "tien-ich" },
  { id: 28, name: "Hàng cau vàng nhiệt đới", cat: "tien-ich" },
  { id: 29, name: "Ghế ngồi dài", cat: "giai-tri" },
  { id: 30, name: "Vườn tre vàng", cat: "canh-quan" },
  { id: 31, name: "Hòn đá chữ tín", cat: "canh-quan" },
  { id: 32, name: "Khu bàn ghế gia đình", cat: "giai-tri" },
  { id: 33, name: "Đảo nhiệt đới", cat: "canh-quan" },
  { id: 34, name: "Bếp nướng di động", cat: "giai-tri" },
  { id: 35, name: "Cung đường hoa Lan Ý", cat: "canh-quan" },
  { id: 36, name: "Bậc thang kết nối", cat: "canh-quan" },
  { id: 37, name: "Cung đường nhiệt đới", cat: "canh-quan" },
  { id: 38, name: "Cung đường hoa tím", cat: "canh-quan" },
  { id: 39, name: "Cây hoa vàng điểm nhấn", cat: "canh-quan" },
  { id: 40, name: "Đường dạo dưới tán cây", cat: "canh-quan" },
  { id: 41, name: "Cây me tây điểm nhấn", cat: "canh-quan" },
  { id: 42, name: "Sàn gỗ ngoài trời", cat: "the-thao" },
  { id: 43, name: "Hồ bơi Resort", cat: "the-thao" },
  { id: 44, name: "Hồ massage thư giãn", cat: "the-thao" },
  { id: 45, name: "Hồ bơi trẻ em", cat: "the-thao" },
  { id: 46, name: "Ghế tắm nắng", cat: "the-thao" },
  { id: 47, name: "Trục cảnh quan cây cỏ", cat: "canh-quan" },
  { id: 48, name: "Chòi nghỉ thư giãn", cat: "giai-tri" },
  { id: 49, name: "Thang kính kết nối", cat: "the-thao" },
  { id: 50, name: "Cung đường hạnh phúc", cat: "canh-quan" },
  { id: 51, name: "Khu máy tập thể dục ngoài trời", cat: "the-thao" },
  { id: 52, name: "Quảng trường sự kiện", cat: "giai-tri" },
  { id: 53, name: "Khu bàn ghế thương mại", cat: "giai-tri" },
  { id: 54, name: "Bồn cây tường vi di động", cat: "canh-quan" },
  { id: 55, name: "Bảng chỉ dẫn khu vực", cat: "tien-ich" },
  { id: 56, name: "Trạm sạc xe ô tô điện", cat: "tien-ich" },
  { id: 57, name: "Trạm sạc pin xe máy điện", cat: "tien-ich" },
  { id: 58, name: "Trạm nước năng lượng", cat: "tien-ich" },
  { id: 59, name: "Nhà trẻ B. School", cat: "tien-ich" },
  { id: 60, name: "Vườn hoa theo mùa", cat: "canh-quan" }
];

/* ============================================================
   MẶT BẰNG TẦNG ĐIỂN HÌNH — theo từng khối.
   - Chỉ "orchid" có dữ liệu thật (từ bản vẽ mặt bằng tầng điển hình
     bạn cung cấp). Các khối khác sẽ hiện "đang cập nhật" cho đến khi
     bạn thêm dữ liệu theo đúng cấu trúc bên dưới.
   - floors (Orchid): tầng 3–22, lấy đúng theo dữ liệu giá thật trong
     js/orchid-prices.js (không còn là placeholder).
   - units[].tt / ll: diện tích mặc định cho khối CHƯA có giá thật
     (dùng khi không tra được dữ liệu theo tầng). Với Orchid, script.js
     ưu tiên lấy TT/LL theo đúng tầng từ orchid-prices.js vì diện tích
     thông thuỷ (LL) có thể chênh lệch nhẹ giữa các cụm tầng.
   - units[].x / y: vị trí tâm số thứ tự căn trên ảnh, tính theo %
     (0–100) so với chiều rộng/cao ảnh. Dùng nút "Chế độ hiệu chỉnh"
     trong trang mặt bằng tầng để bấm lấy toạ độ chính xác rồi dán lại.
================================================================ */

const FLOOR_PLANS = {
  orchid: {
    title: "Mặt bằng tầng điển hình",
    image: "assets/floorplans/orchid-typical.jpg",
    floors: Array.from({ length: 20 }, (_, i) => i + 3), // tầng 3–22, lấy từ dữ liệu giá thật (js/orchid-prices.js)
    units: [
      { num: 22, code: "B5", tt: 69.81, ll: 62.98, x: 10.1, y: 21.3 },
      { num: 23, code: "D3", tt: 37.60, ll: 33.85, x: 16.4, y: 21.3 },
      { num: 24, code: "D3", tt: 37.60, ll: 33.85, x: 22.7, y: 21.3 },
      { num: 25, code: "D3", tt: 37.60, ll: 33.85, x: 29.0, y: 21.3 },
      { num: 26, code: "D1", tt: 39.58, ll: 35.77, x: 35.3, y: 21.3 },
      { num: 27, code: "D1", tt: 39.53, ll: 35.72, x: 40.9, y: 21.3 },
      { num: 1,  code: "D5", tt: 53.48, ll: 49.40, x: 48.1, y: 21.3 },
      { num: 2,  code: "D1", tt: 39.58, ll: 35.90, x: 54.4, y: 21.3 },
      { num: 3,  code: "B1", tt: 66.36, ll: 60.73, x: 60.7, y: 21.3 },
      { num: 4,  code: "B1", tt: 65.92, ll: 60.51, x: 67.0, y: 21.3 },
      { num: 5,  code: "B4", tt: 73.24, ll: 67.26, x: 78.3, y: 21.3 },
      { num: 6,  code: "B1", tt: 66.36, ll: 60.73, x: 84.6, y: 21.3 },
      { num: 7,  code: "A2", tt: 87.14, ll: 79.84, x: 91.4, y: 21.3 },
      { num: 21, code: "B8", tt: 64.89, ll: 58.49, x: 10.1, y: 63.5 },
      { num: 20, code: "C4", tt: 62.02, ll: 56.75, x: 16.4, y: 63.5 },
      { num: 19, code: "D6", tt: 62.02, ll: 56.75, x: 22.7, y: 63.5 },
      { num: 18, code: "C4", tt: 62.02, ll: 56.75, x: 29.0, y: 63.5 },
      { num: 17, code: "D6", tt: 42.95, ll: 38.33, x: 35.3, y: 63.5 },
      { num: 16, code: "D6", tt: 42.95, ll: 38.33, x: 40.9, y: 63.5 },
      { num: 15, code: "C4", tt: 62.02, ll: 56.75, x: 46.5, y: 63.5 },
      { num: 14, code: "C4", tt: 62.02, ll: 56.75, x: 53.0, y: 63.5 },
      { num: 13, code: "D6", tt: 42.95, ll: 38.33, x: 59.3, y: 63.5 },
      { num: 12, code: "D6", tt: 42.95, ll: 38.33, x: 64.9, y: 63.5 },
      { num: 11, code: "C4", tt: 62.02, ll: 56.75, x: 70.6, y: 63.5 },
      { num: 10, code: "D6", tt: 42.95, ll: 38.33, x: 76.9, y: 63.5 },
      { num: 9,  code: "C4", tt: 62.02, ll: 56.75, x: 83.1, y: 63.5 },
      { num: 8,  code: "B8", tt: 64.90, ll: 58.44, x: 89.8, y: 63.5 }
    ]
  }
};

/* Đơn giá / m² — để trống (null) sẽ hiển thị "Liên hệ" thay vì bịa giá.
   Khi có bảng giá thật, điền VNĐ/m² theo khối hoặc theo loại căn. */
const PRICE_CONFIG = {
  perBlock: { orchid: null, tamarind: null, palm: null, lotus: null, bamboo: null },
  perUnitCode: {} // vd: { B5: 34000000, D3: 31000000 }
};

function getUnitPricePerM2(blockId, code) {
  if (PRICE_CONFIG.perUnitCode[code] != null) return PRICE_CONFIG.perUnitCode[code];
  if (PRICE_CONFIG.perBlock[blockId] != null) return PRICE_CONFIG.perBlock[blockId];
  return null;
}

function formatVND(n) {
  return n.toLocaleString("vi-VN") + " đ";
}
function formatBillion(n) {
  return (n / 1e9).toLocaleString("vi-VN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " tỷ";
}

const UNIT_STATUS_LABELS = { open: "Còn bán", sold: "Đã bán", lock: "CĐT giữ lại" };

const CATEGORIES = {
  "canh-quan": { label: "Cảnh quan & Nghệ thuật", icon: "🌿" },
  "giai-tri": { label: "Giải trí & Thư giãn", icon: "☕" },
  "the-thao": { label: "Thể thao & Hồ bơi", icon: "🏊" },
  "tien-ich": { label: "Tiện ích & Kỹ thuật", icon: "⚡" }
};
