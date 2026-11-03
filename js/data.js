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
    color: "#e9212a",
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
    color: "#2fb6a8",
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
    color: "#f2a93b",
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
    color: "#7b6cf6",
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
    color: "#ec5aa8",
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

const CATEGORIES = {
  "canh-quan": { label: "Cảnh quan & Nghệ thuật", icon: "🌿" },
  "giai-tri": { label: "Giải trí & Thư giãn", icon: "☕" },
  "the-thao": { label: "Thể thao & Hồ bơi", icon: "🏊" },
  "tien-ich": { label: "Tiện ích & Kỹ thuật", icon: "⚡" }
};
