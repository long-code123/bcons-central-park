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

  /* ---------- Build SVG polygons from BLOCKS ---------- */
  const svg = document.getElementById("mapSvg");
  const mapCanvas = document.getElementById("mapCanvas");
  const labelsHost = document.getElementById("mapLabels");

  BLOCKS.forEach(block => {
    const poly = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    poly.setAttribute("points", block.points);
    poly.setAttribute("data-id", block.id);
    poly.style.setProperty("--c", block.color);
    poly.addEventListener("mouseenter", () => {
      poly.style.stroke = block.color;
      poly.style.fill = hexToRgba(block.color, 0.16);
      showLabel(block, true);
    });
    poly.addEventListener("mouseleave", () => {
      poly.style.stroke = "";
      poly.style.fill = "";
      showLabel(block, false);
    });
    poly.addEventListener("click", () => openBlockModal(block.id));
    svg.appendChild(poly);

    const label = document.createElement("div");
    label.className = "block-label";
    label.id = "label-" + block.id;
    label.textContent = block.name;
    const c = polygonCenter(block.points);
    label.style.left = c.x + "%";
    label.style.top = c.y + "%";
    labelsHost.appendChild(label);
  });

  function showLabel(block, on) {
    document.getElementById("label-" + block.id).classList.toggle("show", on);
  }

  function polygonCenter(pointsStr) {
    const pts = pointsStr.trim().split(/\s+/).map(p => p.split(",").map(Number));
    const avgX = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const avgY = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    return { x: (avgX / 2000) * 100, y: (avgY / 1125) * 100 };
  }

  function hexToRgba(hex, a) {
    const v = hex.replace("#", "");
    const r = parseInt(v.substring(0, 2), 16);
    const g = parseInt(v.substring(2, 4), 16);
    const b = parseInt(v.substring(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  /* ---------- Legend tags ---------- */
  const legendTags = document.getElementById("legendTags");
  BLOCKS.forEach(b => {
    const el = document.createElement("div");
    el.className = "tag";
    el.innerHTML = `<i style="background:${b.color}"></i>${b.name}`;
    el.addEventListener("click", () => openBlockModal(b.id));
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
      <div class="go">Xem chi tiết &rarr;</div>
    `;
    card.addEventListener("click", () => openBlockModal(b.id));
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
    document.querySelectorAll("#mapSvg polygon").forEach(p =>
      p.classList.toggle("active", p.dataset.id === id)
    );
  }
  function closeModal() {
    overlay.classList.remove("open");
    document.body.style.overflow = "";
    document.querySelectorAll("#mapSvg polygon").forEach(p => p.classList.remove("active"));
  }
  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalContactBtn").addEventListener("click", closeModal);
  overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

  /* ---------- Amenity list / search / filter ---------- */
  const amenityList = document.getElementById("amenityList");
  const amenitySearch = document.getElementById("amenitySearch");
  const amenityCount = document.getElementById("amenityCount");
  const chips = document.querySelectorAll(".chip");
  let activeCat = "all";

  function renderAmenities() {
    const q = amenitySearch.value.trim().toLowerCase();
    const filtered = AMENITIES.filter(a => {
      const matchCat = activeCat === "all" || a.cat === activeCat;
      const matchQ = !q || a.name.toLowerCase().includes(q) || String(a.id).includes(q);
      return matchCat && matchQ;
    });
    amenityList.innerHTML = "";
    filtered.forEach(a => {
      const row = document.createElement("div");
      row.className = "amenity-item";
      row.innerHTML = `<div class="num">${String(a.id).padStart(2, "0")}</div><div class="name">${a.name}</div>`;
      amenityList.appendChild(row);
    });
    amenityCount.textContent = `${filtered.length} / ${AMENITIES.length} tiện ích`;
  }
  amenitySearch.addEventListener("input", renderAmenities);
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeCat = chip.dataset.cat;
      renderAmenities();
    });
  });
  renderAmenities();

  /* ---------- Calibration mode (dev tool to fine-tune polygon points) ---------- */
  const calibBtn = document.getElementById("calibBtn");
  const calibOutput = document.getElementById("calibOutput");
  let calibOn = false;
  let calibPoints = [];

  calibBtn.addEventListener("click", () => {
    calibOn = !calibOn;
    calibPoints = [];
    calibBtn.textContent = calibOn ? "⏹ Dừng hiệu chỉnh (click ảnh để lấy toạ độ)" : "🎯 Chế độ hiệu chỉnh toạ độ";
    calibOutput.style.display = calibOn ? "block" : "none";
    calibOutput.textContent = calibOn ? "Click vào các góc của khối trên ảnh để lấy toạ độ (hệ 2000x1125)..." : "";
    svg.style.pointerEvents = calibOn ? "none" : "auto";
  });

  mapCanvas.addEventListener("click", e => {
    if (!calibOn) return;
    const rect = mapCanvas.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width;
    const yPct = (e.clientY - rect.top) / rect.height;
    const x = Math.round(xPct * 2000);
    const y = Math.round(yPct * 1125);
    calibPoints.push(`${x},${y}`);
    calibOutput.textContent = calibPoints.join(" ");
  });

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
});
