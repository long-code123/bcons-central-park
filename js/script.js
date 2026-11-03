document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Header scroll + mobile nav ---------- */
  const header = document.querySelector("header");
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  });
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  burger.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => navLinks.classList.remove("open"))
  );

  /* ---------- Block click dispatcher ----------
     Khối nào đã có mặt bằng tầng (FLOOR_PLANS) thì bấm vào đi thẳng tới
     trang mặt bằng tầng; khối chưa có dữ liệu thì mở modal thông tin
     chung như trước. */
  function handleBlockClick(id) {
    if (FLOOR_PLANS[id]) {
      location.hash = "/floorplan/" + id;
    } else {
      openBlockModal(id);
    }
  }

  /* ---------- Legend tags (clickable block names above the site plan image) ---------- */
  const legendTags = document.getElementById("legendTags");
  BLOCKS.forEach(b => {
    const el = document.createElement("div");
    el.className = "tag";
    el.innerHTML = `<i style="background:${b.color}"></i>${b.name}`;
    el.addEventListener("click", () => handleBlockClick(b.id));
    el.style.cursor = "pointer";
    legendTags.appendChild(el);
  });

  /* ---------- Blocks grid (below map) ---------- */
  const blocksGrid = document.getElementById("blocksGrid");
  BLOCKS.forEach(b => {
    const card = document.createElement("div");
    card.className = "block-card";
    card.style.setProperty("--c", b.color);
    card.innerHTML = `
      <div class="dot"></div>
      <h4>${b.name}</h4>
      <p>${b.desc}</p>
      <div class="go">${FLOOR_PLANS[b.id] ? "Xem mặt bằng tầng" : "Xem chi tiết"} &rarr;</div>
    `;
    card.addEventListener("click", () => handleBlockClick(b.id));
    blocksGrid.appendChild(card);
  });

  /* ---------- Modal ---------- */
  const overlay = document.getElementById("modalOverlay");
  const modalTag = document.getElementById("modalTag");
  const modalTitle = document.getElementById("modalTitle");
  const modalDesc = document.getElementById("modalDesc");
  const modalFloors = document.getElementById("modalFloors");
  const modalUnits = document.getElementById("modalUnits");
  const modalTypes = document.getElementById("modalTypes");
  const modalHandover = document.getElementById("modalHandover");
  const modalNearby = document.getElementById("modalNearby");
  const modalBar = document.getElementById("modalBar");

  function openBlockModal(id) {
    const b = BLOCKS.find(x => x.id === id);
    if (!b) return;
    modalBar.style.setProperty("--c", b.color);
    modalTag.style.color = b.color;
    modalTag.textContent = b.tag;
    modalTitle.textContent = "Khối " + b.name;
    modalDesc.textContent = b.desc;
    modalFloors.textContent = b.floors;
    modalUnits.textContent = b.units;
    modalTypes.textContent = b.types;
    modalHandover.textContent = b.handover;
    modalNearby.innerHTML = "";
    b.nearby.forEach(nid => {
      const a = AMENITIES.find(x => x.id === nid);
      if (!a) return;
      const pill = document.createElement("div");
      pill.className = "pill";
      pill.textContent = `${String(a.id).padStart(2, "0")} · ${a.name}`;
      modalNearby.appendChild(pill);
    });
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalContactBtn").addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------- Contact form (demo only — no backend) ---------- */
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const btn = form.querySelector("button");
    const original = btn.textContent;
    btn.textContent = "Đã gửi — cảm ơn bạn!";
    btn.disabled = true;
    setTimeout(() => { btn.textContent = original; btn.disabled = false; form.reset(); }, 2600);
  });

  /* ---------- Footer year ---------- */
  document.getElementById("year").textContent = new Date().getFullYear();

  /* ====================================================================
     PAGE ROUTING — home / floor-plan / price-list
     Routes are plain hash strings so the pages are shareable links and
     need no server config: "#/floorplan/<blockId>/<floor>" and
     "#/price-list". Any other hash (incl. normal "#section" anchors)
     falls back to the home view.
  ==================================================================== */
  const floorplanView = document.getElementById("floorplanView");
  const priceListView = document.getElementById("priceListView");

  function showHomeView() {
    document.body.classList.remove("on-subpage");
    floorplanView.classList.remove("active");
    priceListView.classList.remove("active");
  }
  function showFloorplanView(blockId, floor) {
    document.body.classList.add("on-subpage");
    priceListView.classList.remove("active");
    floorplanView.classList.add("active");
    renderFloorplan(blockId, floor);
    window.scrollTo(0, 0);
  }
  function showPriceListView() {
    document.body.classList.add("on-subpage");
    floorplanView.classList.remove("active");
    priceListView.classList.add("active");
    renderPriceList();
    window.scrollTo(0, 0);
  }
  function handleRoute() {
    const h = location.hash;
    if (h.startsWith("#/floorplan/")) {
      const parts = h.replace("#/floorplan/", "").split("/");
      showFloorplanView(parts[0], parts[1] ? parseInt(parts[1], 10) : null);
    } else if (h === "#/price-list") {
      showPriceListView();
    } else {
      showHomeView();
    }
  }
  window.addEventListener("hashchange", handleRoute);
  document.getElementById("fpBack").addEventListener("click", () => { location.hash = "gioi-thieu"; });
  document.getElementById("plBack").addEventListener("click", () => { location.hash = "gioi-thieu"; });

  function goToContactWithMessage(message) {
    location.hash = "lien-he";
    setTimeout(() => {
      const ta = document.querySelector("#contactForm textarea");
      if (ta) ta.value = message;
    }, 60);
  }

  /* ====================================================================
     FLOOR PLAN PAGE
  ==================================================================== */
  let fpState = { blockId: null, floor: null, selectedUnit: null };

  const fpBlockName = document.getElementById("fpBlockName");
  const fpBlockSub = document.getElementById("fpBlockSub");
  const fpNote = document.getElementById("fpNote");
  const fpFloorSwitcher = document.getElementById("fpFloorSwitcher");
  const fpImage = document.getElementById("fpImage");
  const fpHotspots = document.getElementById("fpHotspots");
  const fpCanvas = document.getElementById("fpCanvas");
  const unitPanelEmpty = document.getElementById("unitPanelEmpty");
  const unitPanelContent = document.getElementById("unitPanelContent");

  function renderFloorplan(blockId, floor) {
    const block = BLOCKS.find(b => b.id === blockId);
    const fp = FLOOR_PLANS[blockId];
    fpBlockName.textContent = block ? "Khối " + block.name : blockId;
    hideUnitPanel();

    if (!fp) {
      fpBlockSub.textContent = "";
      fpNote.innerHTML = "⚠️ Mặt bằng tầng của khối này đang được cập nhật. Bấm thử khối <strong>Orchid</strong> để xem demo, hoặc bổ sung dữ liệu vào <code>FLOOR_PLANS</code> trong js/data.js.";
      fpFloorSwitcher.innerHTML = "";
      fpImage.removeAttribute("src");
      fpHotspots.innerHTML = "";
      return;
    }

    if (!floor || !fp.floors.includes(floor)) floor = fp.floors[0];
    fpState = { blockId, floor, selectedUnit: null };

    fpBlockSub.textContent = fp.title + " — Tầng " + floor;
    fpNote.innerHTML = hasLivePricing(blockId)
      ? "Giá tham khảo theo bảng giá CĐT (file Rổ hàng/Check giá), chưa phải cam kết cuối cùng — số tiền cuối cùng theo hợp đồng và thông báo chính thức của CĐT. Vị trí số căn trên ảnh là ước lượng, dùng nút hiệu chỉnh bên dưới nếu cần chỉnh lại."
      : "⚠️ Danh sách tầng và vị trí số căn trên ảnh là dữ liệu demo (ước lượng) — dùng nút hiệu chỉnh bên dưới để chỉnh lại chính xác trước khi dùng thật.";

    fpImage.src = fp.image;
    fpImage.alt = fp.title;

    fpFloorSwitcher.innerHTML = "";
    fp.floors.forEach(f => {
      const pill = document.createElement("div");
      pill.className = "floor-pill" + (f === floor ? " active" : "");
      pill.textContent = "Tầng " + f;
      pill.addEventListener("click", () => { location.hash = "/floorplan/" + blockId + "/" + f; });
      fpFloorSwitcher.appendChild(pill);
    });

    const fpStatusLegend = document.getElementById("fpStatusLegend");
    fpStatusLegend.innerHTML = hasLivePricing(blockId)
      ? `<span class="lg-item"><i class="dot-open"></i>Còn bán</span>
         <span class="lg-item"><i class="dot-sold"></i>Đã bán</span>
         <span class="lg-item"><i class="dot-lock"></i>CĐT giữ lại</span>
         <span class="lg-item"><i class="dot-good">★</i>Rổ giá tốt</span>`
      : "";

    fpHotspots.innerHTML = "";
    fp.units.forEach(u => {
      const dot = document.createElement("div");
      const live = liveUnitData(blockId, floor, u.num);
      dot.className = "unit-dot" + (live ? " status-" + live.status : "") + (live && live.goodBasket ? " good" : "");
      dot.style.left = u.x + "%";
      dot.style.top = u.y + "%";
      dot.innerHTML = String(u.num).padStart(2, "0") + (live && live.goodBasket ? '<i class="star">★</i>' : "");
      dot.addEventListener("click", () => selectUnit(u, dot));
      fpHotspots.appendChild(dot);
    });
  }

  /* ---------- Real per-unit pricing bridge (currently: Orchid only) ---------- */
  function hasLivePricing(blockId) {
    return blockId === "orchid" && typeof findOrchidUnitPrice === "function";
  }
  function liveUnitData(blockId, floor, unitNo) {
    return hasLivePricing(blockId) ? findOrchidUnitPrice(floor, unitNo) : null;
  }

  function selectUnit(u, dotEl) {
    fpState.selectedUnit = u;
    fpHotspots.querySelectorAll(".unit-dot").forEach(d => d.classList.remove("active"));
    dotEl.classList.add("active");

    unitPanelEmpty.style.display = "none";
    unitPanelContent.style.display = "block";
    const block = BLOCKS.find(b => b.id === fpState.blockId);
    const live = liveUnitData(fpState.blockId, fpState.floor, u.num);

    document.getElementById("uCode").textContent = "Căn " + u.code + " · #" + String(u.num).padStart(2, "0");
    document.getElementById("uFloorLabel").textContent = "Tầng " + fpState.floor + (block ? " — Khối " + block.name : "") + (live ? " · " + live.type : "");
    document.getElementById("uTT").textContent = (live ? live.tt : u.tt).toFixed(2) + " m²";
    document.getElementById("uLL").textContent = (live ? live.ll : u.ll).toFixed(2) + " m²";

    renderUnitPriceArea(live, fpState.blockId, u.code, u.tt);
  }

  function renderUnitPriceArea(live, blockId, code, ttFallback) {
    const badge = document.getElementById("uStatusBadge");
    const area = document.getElementById("uPriceArea");

    if (!live) {
      badge.textContent = "";
      badge.className = "status-badge";
      const pricePerM2 = getUnitPricePerM2(blockId, code);
      area.innerHTML = `<div class="unit-price-box"><span>Giá dự kiến</span><b>${pricePerM2 ? formatVND(Math.round(pricePerM2 * ttFallback)) : "Liên hệ nhận báo giá"}</b></div>`;
      return;
    }

    badge.textContent = UNIT_STATUS_LABELS[live.status] + (live.goodBasket ? " · ★ Rổ giá tốt" : "");
    badge.className = "status-badge status-" + live.status;

    if (live.status !== "open") {
      area.innerHTML = `<div class="unit-price-box muted"><span>${live.status === "sold" ? "Căn đã giao dịch, không hiển thị giá" : "Căn chưa mở bán, chưa công bố giá"}</span><b>Liên hệ tư vấn các căn còn lại</b></div>`;
      return;
    }

    area.innerHTML = `
      <div class="price-table">
        <div class="price-row head"><span>Phương thức</span><span>Chưa VAT</span><span>Có VAT</span></div>
        <div class="price-row"><span>${PAYMENT_PLANS["01"]}</span><span>${formatBillion(live.p01.noVat)}</span><span>${formatBillion(live.p01.vat)}</span></div>
        <div class="price-row"><span>${PAYMENT_PLANS["23"]}</span><span>${formatBillion(live.p23.noVat)}</span><span>${formatBillion(live.p23.vat)}</span></div>
        <div class="price-row"><span>${PAYMENT_PLANS["45"]}</span><span>${formatBillion(live.p45.noVat)}</span><span>${formatBillion(live.p45.vat)}</span></div>
      </div>
      <div class="unit-fee-note">Phí bảo trì (2%): ${formatVND(live.maintenanceFee)}. Giá tham khảo theo bảng giá CĐT, chưa phải cam kết cuối cùng.</div>
    `;
  }
  function hideUnitPanel() {
    unitPanelEmpty.style.display = "block";
    unitPanelContent.style.display = "none";
  }
  document.getElementById("uContactBtn").addEventListener("click", () => {
    const u = fpState.selectedUnit;
    if (!u) return;
    const block = BLOCKS.find(b => b.id === fpState.blockId);
    goToContactWithMessage(
      `Tôi quan tâm căn ${u.code} (#${String(u.num).padStart(2, "0")}), tầng ${fpState.floor}, khối ${block ? block.name : fpState.blockId}.`
    );
  });

  /* Floor-plan hotspot calibration (percentage-based, image-size independent) */
  const fpCalibBtn = document.getElementById("fpCalibBtn");
  const fpCalibOutput = document.getElementById("fpCalibOutput");
  let fpCalibOn = false;
  let fpCalibPoints = [];
  fpCalibBtn.addEventListener("click", () => {
    fpCalibOn = !fpCalibOn;
    fpCalibPoints = [];
    fpCanvas.classList.toggle("calib-mode", fpCalibOn);
    fpCalibBtn.textContent = fpCalibOn ? "⏹ Dừng hiệu chỉnh (bấm ảnh để lấy % toạ độ)" : "🎯 Chế độ hiệu chỉnh toạ độ";
    fpCalibOutput.style.display = fpCalibOn ? "block" : "none";
    fpCalibOutput.textContent = fpCalibOn ? "Bấm lần lượt vào từng số căn trên ảnh theo đúng thứ tự trong data.js..." : "";
  });
  fpCanvas.addEventListener("click", e => {
    if (!fpCalibOn) return;
    const rect = fpImage.getBoundingClientRect();
    const x = (((e.clientX - rect.left) / rect.width) * 100).toFixed(1);
    const y = (((e.clientY - rect.top) / rect.height) * 100).toFixed(1);
    fpCalibPoints.push(`x: ${x}, y: ${y}`);
    fpCalibOutput.textContent = fpCalibPoints.join("\n");
  });

  /* ====================================================================
     PRICE LIST PAGE
     Dùng thẳng dữ liệu giá thật (ORCHID_UNIT_PRICES) cho khối đã có,
     cộng với các khối còn lại (nếu có FLOOR_PLANS nhưng chưa có giá
     thật) dùng PRICE_CONFIG làm phương án dự phòng.
  ==================================================================== */
  const plState = { pttt: "23", vat: false };

  function buildPriceRows() {
    const rows = [];
    Object.keys(FLOOR_PLANS).forEach(blockId => {
      const fp = FLOOR_PLANS[blockId];
      const block = BLOCKS.find(b => b.id === blockId);
      const codeByNum = {};
      fp.units.forEach(u => { codeByNum[u.num] = u.code; });

      fp.floors.forEach(floor => {
        fp.units.forEach(u => {
          const live = liveUnitData(blockId, floor, u.num);
          rows.push({
            blockId,
            blockName: block ? block.name : blockId,
            floor,
            num: u.num,
            code: u.code,
            type: live ? live.type : null,
            tt: live ? live.tt : u.tt,
            ll: live ? live.ll : u.ll,
            status: live ? live.status : null,
            goodBasket: live ? live.goodBasket : false,
            live,
            pricePerM2: live ? null : getUnitPricePerM2(blockId, u.code)
          });
        });
      });
    });
    return rows;
  }

  function priceOfRow(r) {
    if (!r.live) {
      return r.pricePerM2 ? Math.round(r.pricePerM2 * r.tt) : null;
    }
    if (r.live.status !== "open") return null;
    const plan = r.live[plState.pttt === "01" ? "p01" : plState.pttt === "45" ? "p45" : "p23"];
    return plState.vat ? plan.vat : plan.noVat;
  }

  const plBlockFilter = document.getElementById("plBlockFilter");
  const plFloorFilter = document.getElementById("plFloorFilter");
  const plTypeFilter = document.getElementById("plTypeFilter");
  const plStatusFilter = document.getElementById("plStatusFilter");
  const plSearch = document.getElementById("plSearch");
  const plTableBody = document.getElementById("plTableBody");
  const plCount = document.getElementById("plCount");
  const plPagination = document.getElementById("plPagination");
  const plNote = document.getElementById("plNote");
  const plPtttSeg = document.getElementById("plPtttSeg");
  const plVatSeg = document.getElementById("plVatSeg");
  const PL_PAGE_SIZE = 50;
  let plPage = 1;
  let plFiltersBuilt = false;

  function buildPtttVatControls() {
    plPtttSeg.innerHTML = Object.keys(PAYMENT_PLANS).map(k =>
      `<button type="button" class="btn btn-sm seg-btn" data-pttt="${k}" aria-pressed="${plState.pttt === k}">${PAYMENT_PLANS[k]}</button>`
    ).join("");
    plVatSeg.innerHTML = `
      <button type="button" class="btn btn-sm seg-btn" data-vat="0" aria-pressed="${!plState.vat}">Chưa VAT</button>
      <button type="button" class="btn btn-sm seg-btn" data-vat="1" aria-pressed="${plState.vat}">Có VAT</button>`;

    plPtttSeg.querySelectorAll("[data-pttt]").forEach(btn =>
      btn.addEventListener("click", () => {
        plState.pttt = btn.dataset.pttt;
        plPtttSeg.querySelectorAll("[data-pttt]").forEach(b => b.setAttribute("aria-pressed", b === btn));
        renderPriceList();
      })
    );
    plVatSeg.querySelectorAll("[data-vat]").forEach(btn =>
      btn.addEventListener("click", () => {
        plState.vat = btn.dataset.vat === "1";
        plVatSeg.querySelectorAll("[data-vat]").forEach(b => b.setAttribute("aria-pressed", b.dataset.vat === (plState.vat ? "1" : "0")));
        renderPriceList();
      })
    );
  }

  function buildPriceFilters(rows) {
    if (plFiltersBuilt) return;
    plFiltersBuilt = true;
    const blocks = [...new Set(rows.map(r => r.blockId))];
    plBlockFilter.innerHTML = '<option value="all">Tất cả khối</option>' +
      blocks.map(id => {
        const b = BLOCKS.find(x => x.id === id);
        return `<option value="${id}">${b ? b.name : id}</option>`;
      }).join("");

    const floors = [...new Set(rows.map(r => r.floor))].sort((a, b) => a - b);
    plFloorFilter.innerHTML = '<option value="all">Tất cả tầng</option>' +
      floors.map(f => `<option value="${f}">Tầng ${f}</option>`).join("");

    const types = [...new Set(rows.map(r => r.code))].sort();
    plTypeFilter.innerHTML = '<option value="all">Tất cả loại căn</option>' +
      types.map(t => `<option value="${t}">${t}</option>`).join("");

    plStatusFilter.innerHTML = '<option value="all">Mọi trạng thái</option>' +
      Object.keys(UNIT_STATUS_LABELS).map(s => `<option value="${s}">${UNIT_STATUS_LABELS[s]}</option>`).join("");

    [plBlockFilter, plFloorFilter, plTypeFilter, plStatusFilter].forEach(sel =>
      sel.addEventListener("change", () => { plPage = 1; renderPriceList(); })
    );
    plSearch.addEventListener("input", () => { plPage = 1; renderPriceList(); });

    buildPtttVatControls();
  }

  function renderPriceList() {
    const rows = buildPriceRows();
    buildPriceFilters(rows);

    plNote.innerHTML = 'Giá tham khảo theo bảng giá CĐT ("FILE CHECK GIÁ BCONS CENTRAL PARK" · "RỔ HÀNG GIÁ TỐT"), PTTT 04·05 = PTTT 02·03 trừ chiết khấu 2,45%; chưa gồm phí bảo trì 2%. Không phải cam kết cuối cùng — số tiền theo hợp đồng và thông báo chính thức của CĐT. Khối chưa có bảng giá CĐT hiển thị "Liên hệ".';

    if (!rows.length) {
      plTableBody.innerHTML = `<tr><td colspan="9" style="color:var(--text-dim);text-align:center;padding:40px">Chưa có dữ liệu mặt bằng tầng nào. Thêm dữ liệu vào FLOOR_PLANS trong js/data.js.</td></tr>`;
      plCount.textContent = "";
      plPagination.innerHTML = "";
      return;
    }

    const blockVal = plBlockFilter.value || "all";
    const floorVal = plFloorFilter.value || "all";
    const typeVal = plTypeFilter.value || "all";
    const statusVal = plStatusFilter.value || "all";
    const q = plSearch.value.trim().toLowerCase();

    const filtered = rows.filter(r => {
      if (blockVal !== "all" && r.blockId !== blockVal) return false;
      if (floorVal !== "all" && String(r.floor) !== floorVal) return false;
      if (typeVal !== "all" && r.code !== typeVal) return false;
      if (statusVal !== "all" && r.status !== statusVal) return false;
      if (q && !(`${r.code} ${r.blockName} ${r.num} ${r.type || ""}`.toLowerCase().includes(q))) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PL_PAGE_SIZE));
    if (plPage > totalPages) plPage = totalPages;
    const pageRows = filtered.slice((plPage - 1) * PL_PAGE_SIZE, plPage * PL_PAGE_SIZE);

    plTableBody.innerHTML = pageRows.map(r => {
      const price = priceOfRow(r);
      const priceCell = price ? formatBillion(price) : `<span class="price-contact">Liên hệ</span>`;
      const statusCell = r.status
        ? `<span class="status-badge status-${r.status} sm">${UNIT_STATUS_LABELS[r.status]}${r.goodBasket ? " ★" : ""}</span>`
        : `<span class="price-contact">—</span>`;
      return `<tr>
        <td>${r.blockName}</td>
        <td>Tầng ${r.floor}</td>
        <td>#${String(r.num).padStart(2, "0")}</td>
        <td>${r.type || r.code}</td>
        <td>${r.tt.toFixed(2)}</td>
        <td>${r.ll.toFixed(2)}</td>
        <td>${priceCell}</td>
        <td>${statusCell}</td>
        <td><button class="mini-btn" data-block="${r.blockId}" data-floor="${r.floor}" data-code="${r.code}" data-num="${r.num}">Tư vấn</button></td>
      </tr>`;
    }).join("");

    plTableBody.querySelectorAll(".mini-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const block = BLOCKS.find(b => b.id === btn.dataset.block);
        goToContactWithMessage(
          `Tôi quan tâm căn ${btn.dataset.code} (#${btn.dataset.num.padStart(2, "0")}), tầng ${btn.dataset.floor}, khối ${block ? block.name : btn.dataset.block}.`
        );
      });
    });

    plCount.textContent = `${filtered.length} căn`;
    plPagination.innerHTML = "";
    if (totalPages > 1) {
      const prev = document.createElement("button");
      prev.textContent = "← Trước";
      prev.disabled = plPage <= 1;
      prev.addEventListener("click", () => { plPage--; renderPriceList(); });
      const info = document.createElement("span");
      info.textContent = `Trang ${plPage} / ${totalPages}`;
      const next = document.createElement("button");
      next.textContent = "Sau →";
      next.disabled = plPage >= totalPages;
      next.addEventListener("click", () => { plPage++; renderPriceList(); });
      plPagination.append(prev, info, next);
    }
  }

  handleRoute();
});
