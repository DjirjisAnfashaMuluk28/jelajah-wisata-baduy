// Koordinat pin Google Maps (!3d/!4d), bukan pusat tampilan pada bagian @ URL.
// Sumber dan cara verifikasi tercatat di README.md.
const DESTINATIONS = [
  {
    id:"baduy-dalam", name:"Kawasan Baduy Dalam", type:"Kawasan adat",
    short:"Kawasan adat dengan aturan ketat. Ikuti ketentuan setempat saat berkunjung.",
    attraction:"Kehidupan adat dan hubungan masyarakat dengan alam.",
    challenge:"Berat. Pengunjung umumnya berjalan kaki.",
    detail:"Baduy Dalam menerapkan pembatasan adat yang ketat. Tanyakan aturan terbaru, termasuk pemotretan dan izin masuk, kepada pihak setempat sebelum berkunjung. Kawasan ini tidak ditandai di peta.",
    coords:null, restricted:true, lookup:"Baduy Dalam, Kanekes, Lebak, Banten"
  },
  {
    id:"baduy-luar", name:"Kawasan Baduy Luar", type:"Kawasan adat",
    short:"Permukiman Baduy Luar. Pengunjung boleh datang selama mengikuti aturan adat.",
    attraction:"Rumah tradisional, kerajinan lokal, dan suasana kampung.",
    challenge:"Ringan hingga sedang, bergantung pada jalur.",
    detail:"Titik peta mengikuti pin Wisata Suku Baduy Luar di Google Maps, bukan batas seluruh kawasan Baduy Luar. Ikuti arahan warga dan pemandu lokal serta konfirmasi akses sebelum berangkat.",
    coords:[-6.5958483,106.2256021], mapLabel:"Wisata Suku Baduy Luar", source:"Google Maps", mapsSourceUrl:"https://maps.app.goo.gl/shmm6xuk7fjrLCx6A", restricted:false
  },
  {
    id:"marengo", name:"Kampung Marengo", type:"Lokasi wisata",
    short:"Kampung di kawasan Baduy Luar dengan suasana permukiman tradisional.",
    attraction:"Suasana kampung dan rumah adat.",
    challenge:"Konfirmasi jalur serta waktu tempuh kepada pemandu.",
    detail:"Kampung Marengo berada di kawasan Baduy Luar. Cek ulang rute, aturan, dan akses sebelum berkunjung.",
    coords:[-6.6078819,106.2224494], mapLabel:"Wisata Kampung Marengo Baduy Luar", source:"Google Maps", mapsSourceUrl:"https://maps.app.goo.gl/51wzLEWwCBtxNg7k7", restricted:false
  },
  {
    id:"ciboleger", name:"Terminal dan Gapura Ciboleger", type:"Titik awal perjalanan",
    short:"Salah satu titik gerbang menuju kawasan permukiman Baduy.",
    attraction:"Gapura dan akses menuju kawasan wisata budaya.",
    challenge:"Konfirmasi kondisi transportasi dan jalur sebelum berangkat.",
    detail:"Titik peta mengikuti pin Terminal Ciboleger pada tautan Google Maps dari Dinas Pariwisata Banten. Terminal ini menjadi salah satu titik awal menuju kawasan Baduy. Tanyakan kondisi rute dan aturan terbaru kepada pemandu atau pihak setempat.",
    coords:[-6.5940006,106.2251326], mapLabel:"Terminal Ciboleger", source:"Google Maps / Dinas Pariwisata Banten", mapsSourceUrl:"https://www.google.com/maps/place/Terminal+Ciboleger/data=!4m5!3m4!1s0x2e42691704d8eb0d:0xee273a9bc8db4895!8m2!3d-6.5940006!4d106.2251326", restricted:false
  },
  {
    id:"trekking", name:"Jalur Trekking dan Perbukitan", type:"Aktivitas alam",
    short:"Menikmati lanskap perbukitan, ladang, dan jalur pedesaan.",
    attraction:"Pemandangan hijau dan perjalanan berjalan kaki.",
    challenge:"Sedang hingga berat, bergantung pada rute.",
    detail:"Entri ini mencakup banyak rute, jadi tidak punya satu titik di peta. Tanyakan jarak dan waktu tempuh kepada pemandu lokal. Hindari jalur saat cuaca buruk.",
    coords:null, restricted:false
  },
  {
    id:"sungai", name:"Sungai dan Panorama Alam", type:"Aktivitas alam",
    short:"Menikmati sungai dan lanskap alam di sepanjang jalur yang diperbolehkan.",
    attraction:"Pemandangan alam terbuka dan aliran sungai.",
    challenge:"Bergantung pada lokasi dan kondisi jalur.",
    detail:"Koordinat belum diverifikasi, jadi lokasi spesifik belum ditandai. Jangan pakai sabun atau sampo di sungai.",
    coords:null, restricted:false
  },
  {
    id:"budaya", name:"Permukiman Tradisional dan Budaya", type:"Pengalaman budaya",
    short:"Mengenal rumah tradisional dan kerajinan lokal dengan menghormati warga.",
    attraction:"Arsitektur tradisional dan kerajinan setempat.",
    challenge:"Ikuti arahan warga dan aturan adat.",
    detail:"Minta izin sebelum memotret. Sepakati harga langsung dengan penjual bila membeli kerajinan, dan hormati batasan adat.",
    coords:null, restricted:false
  }
];

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

// Navbar transparan di hero, lalu berlapis kaca gelap saat digulir.
const siteNav = document.querySelector(".nav");
function updateMenuSpace() {
  const viewport = window.visualViewport;
  const viewportBottom = viewport ? viewport.height + viewport.offsetTop : window.innerHeight;
  const availableHeight = Math.max(0, viewportBottom - siteNav.getBoundingClientRect().bottom - 12);
  siteNav.style.setProperty("--menu-available-height", `${availableHeight}px`);
}
const updateNavAppearance = () => {
  siteNav.classList.toggle("scrolled", window.scrollY > 40);
  updateMenuSpace();
};
window.addEventListener("scroll", updateNavAppearance, { passive: true });
window.addEventListener("resize", updateMenuSpace, { passive: true });
window.visualViewport?.addEventListener("resize", updateMenuSpace, { passive: true });
window.visualViewport?.addEventListener("scroll", updateMenuSpace, { passive: true });
updateNavAppearance();

// Navbar mobile
const toggle = document.getElementById("navToggle");
const menu = document.getElementById("menu");
const mobileNavigation = window.matchMedia("(max-width: 1080px)");

function setMenuOpen(isOpen, returnFocus = false) {
  if (isOpen) updateMenuSpace();
  menu.classList.toggle("open", isOpen);
  siteNav.classList.toggle("menu-open", isOpen);
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute("aria-label", isOpen ? "Tutup menu" : "Buka menu");
  toggle.textContent = isOpen ? "Tutup" : "Menu";
  if (returnFocus) toggle.focus();
}

// Tinggi aktual juga mencakup perubahan akibat pembesaran teks.
if ("ResizeObserver" in window) {
  new ResizeObserver(() => {
    document.documentElement.style.setProperty("--header-offset", `${Math.ceil(siteNav.getBoundingClientRect().height)}px`);
    updateMenuSpace();
  }).observe(siteNav);
}

toggle.addEventListener("click", () => {
  setMenuOpen(toggle.getAttribute("aria-expanded") !== "true");
});

menu.addEventListener("click", event => {
  if (event.target.closest("a")) {
    setMenuOpen(false);
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && menu.classList.contains("open")) {
    setMenuOpen(false, true);
  }
});

document.addEventListener("click", event => {
  if (!siteNav.contains(event.target)) setMenuOpen(false);
});
siteNav.addEventListener("focusout", event => {
  if (!siteNav.contains(event.relatedTarget)) setMenuOpen(false);
});
mobileNavigation.addEventListener("change", () => setMenuOpen(false));

// Render kartu destinasi
const cards = document.getElementById("cards");
const dialog = document.getElementById("detail");

DESTINATIONS.forEach(destination => {
  const card = document.createElement("article");
  card.className = "card";

  const image = document.createElement("div");
  image.className = "card-img";
  image.setAttribute("aria-hidden", "true");
  image.style.backgroundImage = `linear-gradient(0deg, rgba(41,73,54,.12), rgba(41,73,54,.02)), url("img/${destination.id}.jpg")`;

  const body = document.createElement("div");
  body.className = "card-body";

  const badge = document.createElement("p");
  badge.className = "badge";
  badge.textContent = destination.type;

  const title = document.createElement("h3");
  title.textContent = destination.name;

  const short = document.createElement("p");
  short.textContent = destination.short;

  const dl = document.createElement("dl");
  const dt1 = document.createElement("dt");
  dt1.textContent = "Daya tarik";
  const dd1 = document.createElement("dd");
  dd1.textContent = destination.attraction;
  const dt2 = document.createElement("dt");
  dt2.textContent = "Tingkat tantangan";
  const dd2 = document.createElement("dd");
  dd2.textContent = destination.challenge;
  dl.append(dt1, dd1, dt2, dd2);

  const buttons = document.createElement("div");
  buttons.className = "btns";

  const detailButton = document.createElement("button");
  detailButton.className = "btn btn-small";
  detailButton.type = "button";
  detailButton.textContent = "Lihat Detail";
  detailButton.addEventListener("click", () => {
    document.getElementById("dTitle").textContent = destination.name;
    document.getElementById("dType").textContent = destination.type;
    document.getElementById("dText").textContent = destination.detail;
    dialog.showModal();
    document.body.classList.add("modal-open");
  });

  const mapButton = document.createElement("button");
  mapButton.className = "btn btn-small";
  mapButton.type = "button";
  mapButton.textContent = "Lihat di Peta";
  mapButton.addEventListener("click", () => focusDestination(destination, true));

  buttons.append(detailButton, mapButton);
  body.append(badge, title, short, dl, buttons);
  card.append(image, body);
  cards.appendChild(card);
});

document.getElementById("dClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right ||
      event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
dialog.addEventListener("close", () => document.body.classList.remove("modal-open"));

// Peta Leaflet: fallback yang terlihat jika layanan peta tidak dapat dimuat.
const GENERAL_VIEW = { center: [-6.601, 106.224], zoom: 14 };
const noteEl = document.getElementById("mapNote");
const osmLink = document.getElementById("osmLink");
const gmapsLink = document.getElementById("gmapsLink");
const mapList = document.getElementById("mapList");
const mapContainer = document.getElementById("map");
const markers = {};
let map = null;
let userMarker = null;
let selectedDestinationId = null;
let mapResizeFrame = 0;

// Geser daftar secara horizontal saja, tanpa memindahkan halaman.
function revealSelectedDestination() {
  if (!selectedDestinationId || mapList.scrollWidth <= mapList.clientWidth) return;
  const selected = mapList.querySelector('button[aria-current="true"]');
  if (!selected) return;
  const listBounds = mapList.getBoundingClientRect();
  const itemBounds = selected.getBoundingClientRect();
  if (itemBounds.left < listBounds.left + 4) {
    mapList.scrollLeft += itemBounds.left - listBounds.left - 4;
  } else if (itemBounds.right > listBounds.right - 4) {
    mapList.scrollLeft += itemBounds.right - listBounds.right + 4;
  }
}

function mapPopupOptions() {
  const maxWidth = Math.max(80, Math.min(300, mapContainer.clientWidth - 64));
  return {
    minWidth: Math.min(120, maxWidth),
    maxWidth,
    maxHeight: Math.max(80, Math.min(280, mapContainer.clientHeight - 100)),
    autoPanPadding: [8, 8]
  };
}

function resizeMap() {
  if (mapResizeFrame) return;
  mapResizeFrame = requestAnimationFrame(() => {
    mapResizeFrame = 0;
    revealSelectedDestination();
    if (!map) return;
    map.invalidateSize({ pan: false });
    const options = mapPopupOptions();
    [...Object.values(markers), userMarker].forEach(layer => {
      const popup = layer?.getPopup();
      if (!popup) return;
      Object.assign(popup.options, options);
      if (popup.isOpen()) popup.update();
    });
  });
}

window.addEventListener("resize", resizeMap, { passive: true });
window.visualViewport?.addEventListener("resize", resizeMap, { passive: true });
if ("ResizeObserver" in window) new ResizeObserver(resizeMap).observe(mapContainer);

function moveMap(center, zoom) {
  if (!map) return;
  if (prefersReducedMotion.matches) map.setView(center, zoom);
  else map.flyTo(center, zoom);
}

function googleMapsUrl(destination) {
  const query = destination.coords
    ? destination.coords.join(",")
    : destination.lookup || `${destination.name}, Kanekes, Lebak, Banten`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function updateLinks(destination) {
  // Marker, popup, dan tautan eksternal memakai pasangan koordinat yang sama.
  gmapsLink.href = googleMapsUrl(destination);
  if (destination.coords) {
    const [lat, lon] = destination.coords;
    osmLink.href = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=16/${lat}/${lon}`;
  } else {
    const query = destination.lookup || `${destination.name}, Kanekes, Lebak, Banten`;
    osmLink.href = `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
  }
}

function addMarker(destination, source = "koordinat referensi") {
  if (!map || !destination.coords || destination.restricted || markers[destination.id]) return;
  markers[destination.id] = L.marker(destination.coords, { title: destination.name })
    .addTo(map)
    .bindPopup(`<strong>${destination.mapLabel || destination.name}</strong><br>${destination.short}<br><small>Posisi: ${source}</small><br><a href="${googleMapsUrl(destination)}" target="_blank" rel="noopener noreferrer">Buka di Google Maps</a>`, mapPopupOptions());
  markers[destination.id].on("click", () => focusDestination(destination));
  const status = document.querySelector(`#mapList button[data-id="${destination.id}"] small`);
  if (status) status.textContent = "Titik Google Maps";
}

function focusDestination(destination, scroll = false) {
  selectedDestinationId = destination.id;
  document.querySelectorAll("#mapList button").forEach(button => {
    button.setAttribute("aria-current", String(button.dataset.id === destination.id));
  });
  revealSelectedDestination();

  if (scroll) document.querySelector(".map-box").scrollIntoView({ behavior: prefersReducedMotion.matches ? "instant" : "smooth", block: "start" });
  updateLinks(destination);

  if (destination.restricted) {
    if (map) { map.closePopup(); moveMap(GENERAL_VIEW.center, GENERAL_VIEW.zoom); }
    noteEl.textContent = "Kawasan ini memiliki akses adat terbatas dan sengaja tidak ditandai di peta.";
    return;
  }

  if (destination.coords && map) {
    map.invalidateSize();
    addMarker(destination, destination.source || "koordinat referensi");
    moveMap(destination.coords, 15);
    if (markers[destination.id]) markers[destination.id].openPopup();
    noteEl.textContent = `${destination.mapLabel || destination.name} — ${destination.coords.join(", ")}. Marker dan tombol Google Maps menunjuk koordinat yang sama. Konfirmasi akses kepada pemandu lokal.`;
  } else {
    if (map) { map.closePopup(); moveMap(GENERAL_VIEW.center, GENERAL_VIEW.zoom); }
    noteEl.textContent = destination.coords
      ? `${destination.name}: peta interaktif belum tersedia. Gunakan tautan peta untuk membuka lokasinya.`
      : `${destination.name}: belum memiliki satu titik lokasi terverifikasi. Marker yang terlihat adalah destinasi lain; tautan peta hanya melakukan pencarian nama kawasan.`;
  }
}

DESTINATIONS.forEach(destination => {
  const li = document.createElement("li");
  const button = document.createElement("button");
  button.type = "button";
  button.dataset.id = destination.id;
  const name = document.createElement("span");
  name.textContent = destination.name;
  const status = document.createElement("small");
  status.textContent = destination.restricted
    ? "Tidak ditandai (akses adat)"
    : destination.coords ? "Titik Google Maps" : "Belum ada titik terverifikasi";
  button.append(name, status);
  button.addEventListener("click", () => focusDestination(destination));
  li.appendChild(button);
  mapList.appendChild(li);
});

if (window.L && mapContainer) {
  map = L.map("map", { scrollWheelZoom: false, minZoom: 8 }).setView(GENERAL_VIEW.center, GENERAL_VIEW.zoom);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  L.control.scale({ metric: true, imperial: false }).addTo(map);

  map.on("click", () => map.scrollWheelZoom.enable());
  map.on("mouseout", () => map.scrollWheelZoom.disable());

  const known = DESTINATIONS.filter(destination => destination.coords && !destination.restricted);
  known.forEach(destination => addMarker(destination, destination.source || "koordinat referensi"));
} else {
  noteEl.textContent = "Peta tidak dapat dimuat. Periksa koneksi internet dan pemuatan Leaflet.";
  mapContainer.classList.add("map-fallback");
  const fallbackTitle = document.createElement("strong");
  fallbackTitle.textContent = "Peta interaktif belum tersedia";
  const fallbackText = document.createElement("p");
  fallbackText.textContent = "Pilih destinasi, lalu gunakan tombol OpenStreetMap atau Google Maps di bawah untuk membuka lokasinya.";
  mapContainer.append(fallbackTitle, fallbackText);
}

// Pilihan awal dan tombol peta sudah selaras saat halaman pertama dibuka.
focusDestination(DESTINATIONS.find(destination => destination.id === "baduy-luar"));
if (map) {
  const known = DESTINATIONS.filter(destination => destination.coords && !destination.restricted);
  map.stop();
  map.fitBounds(L.latLngBounds(known.map(destination => destination.coords)), { padding: [35, 35], maxZoom: 15 });
}

document.getElementById("locateBtn").addEventListener("click", () => {
  if (!navigator.geolocation) {
    noteEl.textContent = "Browser ini tidak mendukung fitur lokasi.";
    return;
  }
  noteEl.textContent = "Meminta izin lokasi dari browser...";
  navigator.geolocation.getCurrentPosition(position => {
    if (!map) {
      noteEl.textContent = "Peta belum tersedia.";
      return;
    }
    const point = [position.coords.latitude, position.coords.longitude];
    if (userMarker) map.removeLayer(userMarker);
    userMarker = L.circleMarker(point, {
      radius: 8, color: "#FFFFFF", weight: 3, fillColor: "#8B7355", fillOpacity: 1
    }).addTo(map).bindPopup("Lokasi Anda", mapPopupOptions()).openPopup();
    map.flyTo(point, 13);
    noteEl.textContent = "Lokasi Anda ditampilkan. Fitur ini membutuhkan izin lokasi browser dan biasanya HTTPS atau localhost.";
  }, () => {
    noteEl.textContent = "Lokasi tidak tersedia atau izin ditolak. Anda tetap dapat memilih destinasi secara manual.";
  }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 });
});

// Navigasi aktif ketika bagian halaman terlihat
const navLinks = [...menu.querySelectorAll("a")];
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  document.querySelectorAll("main section[id]").forEach(section => observer.observe(section));
}
