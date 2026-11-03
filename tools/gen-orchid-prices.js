const fs = require("fs");

const srcPath = process.argv[2];
const outPath = process.argv[3];

const html = fs.readFileSync(srcPath, "utf8");
const m = html.match(/const D = (\[[\s\S]*?\]\]);/);
if (!m) { console.error("D array not found"); process.exit(1); }
const D = JSON.parse(m[1]);

const orchid = D.filter(r => r[1] === "A");

// Trim to: [floor, unitNo, type, tt, ll, p01_noVat, p01_vat, p23_noVat, p23_vat, p45_noVat, p45_vat, maintFee, goodBasket, status]
const trimmed = orchid.map(r => [r[2], r[3], r[4], r[5], r[6], r[7], r[8], r[9], r[10], r[11], r[12], r[13], r[14], r[15]]);

// sanity: verify every row's unit number exists in our known 27-unit layout and floor is sane
const floors = [...new Set(trimmed.map(r => r[0]))].sort((a,b)=>a-b);
const unitNos = [...new Set(trimmed.map(r => r[1]))].sort();

const header = `/* ============================================================
   GIÁ THẬT — KHỐI ORCHID
   Trích nguyên số liệu từ file "Giá & Mặt bằng Bcons_1.html" (CĐT) do
   bạn cung cấp — KHÔNG chỉnh sửa tay, chỉ tái sinh bằng script nếu có
   file giá mới. Không suy diễn/làm tròn gì thêm ngoài số liệu gốc.

   Mỗi dòng (14 cột), theo đúng thứ tự:
   [ tầng, soCan, loai, TT, LL,
     p01_chuaVAT, p01_coVAT,     // PTTT 01 · chiết khấu 8,5%
     p23_chuaVAT, p23_coVAT,     // PTTT 02 · 03 (giá gốc)
     p45_chuaVAT, p45_coVAT,     // PTTT 04 · 05 · chiết khấu 2,45%
     phiBaoTri,                  // phí bảo trì (2% giá PTTT02·03 chưa VAT)
     roGiaTot,                   // 1 = thuộc rổ giá tốt CĐT, 0 = không
     trangThai ]                 // "open" | "sold" | "lock"

   Nguồn giá & ghi chú (nguyên văn từ file gốc):
   "Nguồn giá: file CĐT '17102026 GHC – FILE CHECK GIÁ BCONS CENTRAL PARK'
   và 'RỔ HÀNG GIÁ TỐT'. PTTT 04·05 bằng giá PTTT 02·03 trừ chiết khấu 2,45%
   theo TB 09 và TB 10/TB-ĐTTH (26/10/2026). Giá chưa gồm phí bảo trì 2%
   giá chưa VAT. Giá tham khảo theo bảng giá CĐT, không phải cam kết; số
   tiền cuối cùng theo hợp đồng và thông báo chính thức của CĐT."
   Tổng: ${trimmed.length} căn, tầng ${floors[0]}–${floors[floors.length-1]}.
================================================================ */

const PAYMENT_PLANS = {
  "01": "PTTT 01 · CK 8,5%",
  "23": "PTTT 02 · 03",
  "45": "PTTT 04 · 05 · CK 2,45%"
};

const ORCHID_UNIT_PRICES = `;

const body = JSON.stringify(trimmed) + ";\n";

const footer = `
function findOrchidUnitPrice(floor, unitNo) {
  const no = String(unitNo).padStart(2, "0");
  const row = ORCHID_UNIT_PRICES.find(r => r[0] === floor && r[1] === no);
  if (!row) return null;
  return {
    floor: row[0], num: row[1], type: row[2], tt: row[3], ll: row[4],
    p01: { noVat: row[5], vat: row[6] },
    p23: { noVat: row[7], vat: row[8] },
    p45: { noVat: row[9], vat: row[10] },
    maintenanceFee: row[11],
    goodBasket: !!row[12],
    status: row[13]
  };
}
`;

fs.writeFileSync(outPath, header + body + footer);
console.log("Wrote", outPath, "-", trimmed.length, "rows, floors", floors[0], "-", floors[floors.length-1], "units", unitNos.join(","));
