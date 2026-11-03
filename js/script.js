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
    fpNote.innerHTML = "⚠️ Danh sách tầng và vị trí số căn trên ảnh là dữ liệu demo (ước lượng) — dùng nút hiệu chỉnh bên dưới để chỉnh lại chính xác trước khi dùng thật.";

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

    fpHotspots.innerHTML = "";
    fp.units.forEach(u => {
      const dot = document.createElement("div");
      dot.className = "unit-dot";
      dot.style.left = u.x + "%";
      dot.style.top = u.y + "%";
      dot.textContent = String(u.num).padStart(2, "0");
      dot.addEventListener("click", () => selectUnit(u, dot));
      fpHotspots.appendChild(dot);
    });
  }

  function selectUnit(u, dotEl) {
    fpState.selectedUnit = u;
    fpHotspots.querySelectorAll(".unit-dot").forEach(d => d.classList.remove("active"));
    dotEl.classList.add("active");

    unitPanelEmpty.style.display = "none";
    unitPanelContent.style.display = "block";
    const block = BLOCKS.find(b => b.id === fpState.blockId);
    document.getElementById("uCode").textContent = "Căn " + u.code + " · #" + String(u.num).padStart(2, "0");
    document.getElementById("uFloorLabel").textContent = "Tầng " + fpState.floor + (block ? " — Khối " + block.name : "");
    document.getElementById("uTT").textContent = u.tt.toFixed(2) + " m²";
    document.getElementById("uLL").textContent = u.ll.toFixed(2) + " m²";

    const pricePerM2 = getUnitPricePerM2(fpState.blockId, u.code);
    document.getElementById("uPrice").textContent = pricePerM2
      ? formatVND(Math.round(pricePerM2 * u.tt))
      : "Liên hệ nhận báo giá";
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
  ==================================================================== */
  let allPriceRows = null;
  function buildPriceRows() {
    if (allPriceRows) return allPriceRows;
    const rows = [];
    Object.keys(FLOOR_PLANS).forEach(blockId => {
      const fp = FLOOR_PLANS[blockId];
      const block = BLOCKS.find(b => b.id === blockId);
      fp.floors.forEach(floor => {
        fp.units.forEach(u => {
          rows.push({
            blockId,
            blockName: block ? block.name : blockId,
            floor,
            num: u.num,
            code: u.code,
            tt: u.tt,
            ll: u.ll,
            pricePerM2: getUnitPricePerM2(blockId, u.code)
          });
        });
      });
    });
    allPriceRows = rows;
    return rows;
  }

  const plBlockFilter = document.getElementById("plBlockFilter");
  const plFloorFilter = document.getElementById("plFloorFilter");
  const plTypeFilter = document.getElementById("plTypeFilter");
  const plSearch = document.getElementById("plSearch");
  const plTableBody = document.getElementById("plTableBody");
  const plCount = document.getElementById("plCount");
  const plPagination = document.getElementById("plPagination");
  const PL_PAGE_SIZE = 50;
  let plPage = 1;
  let plFiltersBuilt = false;

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

    [plBlockFilter, plFloorFilter, plTypeFilter].forEach(sel =>
      sel.addEventListener("change", () => { plPage = 1; renderPriceList(); })
    );
    plSearch.addEventListener("input", () => { plPage = 1; renderPriceList(); });
  }

  function renderPriceList() {
    const rows = buildPriceRows();
    buildPriceFilters(rows);

    if (!rows.length) {
      plTableBody.innerHTML = `<tr><td colspan="9" style="color:var(--text-dim);text-align:center;padding:40px">Chưa có dữ liệu mặt bằng tầng nào. Thêm dữ liệu vào FLOOR_PLANS trong js/data.js.</td></tr>`;
      plCount.textContent = "";
      plPagination.innerHTML = "";
      return;
    }

    const blockVal = plBlockFilter.value || "all";
    const floorVal = plFloorFilter.value || "all";
    const typeVal = plTypeFilter.value || "all";
    const q = plSearch.value.trim().toLowerCase();

    const filtered = rows.filter(r => {
      if (blockVal !== "all" && r.blockId !== blockVal) return false;
      if (floorVal !== "all" && String(r.floor) !== floorVal) return false;
      if (typeVal !== "all" && r.code !== typeVal) return false;
      if (q && !(`${r.code} ${r.blockName} ${r.num}`.toLowerCase().includes(q))) return false;
      return true;
    });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PL_PAGE_SIZE));
    if (plPage > totalPages) plPage = totalPages;
    const pageRows = filtered.slice((plPage - 1) * PL_PAGE_SIZE, plPage * PL_PAGE_SIZE);

    plTableBody.innerHTML = pageRows.map(r => {
      const priceM2 = r.pricePerM2
        ? `${formatVND(r.pricePerM2)}/m²`
        : `<span class="price-contact">Liên hệ</span>`;
      const total = r.pricePerM2
        ? formatVND(Math.round(r.pricePerM2 * r.tt))
        : `<span class="price-contact">Liên hệ</span>`;
      return `<tr>
        <td>${r.blockName}</td>
        <td>Tầng ${r.floor}</td>
        <td>#${String(r.num).padStart(2, "0")}</td>
        <td>${r.code}</td>
        <td>${r.tt.toFixed(2)}</td>
        <td>${r.ll.toFixed(2)}</td>
        <td>${priceM2}</td>
        <td>${total}</td>
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
