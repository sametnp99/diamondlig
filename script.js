// GSAP animasyonları
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray(".section").forEach(section => {
  gsap.to(section, {
    opacity: 1,
    y: 0,
    duration: 1,
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      toggleActions: "play none none none"
    }
  });
});

// Navbar mobil menü (animasyonlu)
const btn = document.getElementById("menuBtn");
const nav = document.getElementById("navMenu");

if (btn && nav) {
  btn.addEventListener("click", () => {
    if (nav.classList.contains("hidden")) {
      nav.classList.remove("hidden");
      gsap.fromTo(nav, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 0.3 });
    } else {
      gsap.to(nav, { height: 0, opacity: 0, duration: 0.3, onComplete: () => nav.classList.add("hidden") });
    }
  });
}

// Tema değiştirici
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });
}

// Puan tablosu için fonksiyon
function tabloOlustur(data, tableId, kolonlar) {
  const table = document.getElementById(tableId);
  if (!table) return;
  table.innerHTML = "";

  const thead = document.createElement("thead");
  const trHead = document.createElement("tr");
  kolonlar.forEach(col => {
    const th = document.createElement("th");
    th.className = "bg-black bg-opacity-60 text-yellow-400 uppercase text-sm p-2";
    th.textContent = col.toUpperCase();
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.className = "bg-white bg-opacity-10 hover:bg-opacity-30 transition text-white text-lg font-semibold";
    kolonlar.forEach(col => {
      const td = document.createElement("td");
      td.className = "p-2";
      td.textContent = item[col];
      if (col === "puan") td.classList.add("text-yellow-400");
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
}

// LocalStorage'dan puan tablosu yükle
function loadPuanTablosu() {
  const data = JSON.parse(localStorage.getItem("puanTablosu")) || [];
  tabloOlustur(data, "puan-tablosu-table", ["takim","o","g","b","m","puan"]);
}

// LocalStorage kayıt sistemi (Üye Ol)
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", () => {
    const team = document.getElementById("registerTeam").value.trim();
    const pass = document.getElementById("registerPass").value.trim();
    if (team && pass) {
      localStorage.setItem(`team_${team}`, pass);

      // Puan tablosuna sıfır değerlerle ekle
      const puanData = JSON.parse(localStorage.getItem("puanTablosu")) || [];
      puanData.push({ takim: team, o: 0, g: 0, b: 0, m: 0, puan: 0 });
      localStorage.setItem("puanTablosu", JSON.stringify(puanData));

      alert("Takım kaydedildi!");
      document.getElementById("registerTeam").value = "";
      document.getElementById("registerPass").value = "";

      loadPuanTablosu();
    } else {
      alert("Lütfen tüm alanları doldurun!");
    }
  });
}

// Giriş
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    const team = document.getElementById("loginTeam").value.trim();
    const pass = document.getElementById("loginPass").value.trim();
    if (localStorage.getItem(`team_${team}`) === pass) {
      alert("Giriş başarılı!");

      // Giriş yapan takımı kaydet
      localStorage.setItem("currentTeam", team);

      // Takım sayfasına yönlendir
      window.location.href = "takim.html";
    } else {
      alert("Hatalı giriş!");
    }
  });
}

// Üye Ol / Giriş toggle fonksiyonu
function toggleSection(id) {
  const section = document.getElementById(id);
  if (!section) return;

  const otherId = id === "uye-ol" ? "giris" : "uye-ol";
  const otherSection = document.getElementById(otherId);

  if (otherSection && !otherSection.classList.contains("hidden")) {
    otherSection.classList.add("hidden");
  }

  section.classList.toggle("hidden");
  section.scrollIntoView({ behavior: "smooth" });
}

// Butonlara event ekleme
document.querySelectorAll('a[href="#uye-ol"]').forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    toggleSection("uye-ol");
  });
});

document.querySelectorAll('a[href="#giris"]').forEach(btn => {
  btn.addEventListener("click", e => {
    e.preventDefault();
    toggleSection("giris");
  });
});

// Maç Sonuçları ekleme
const addResultBtn = document.getElementById("addResult");
const resultsList = document.getElementById("resultsList");

if (addResultBtn && resultsList) {
  addResultBtn.addEventListener("click", () => {
    const teamA = document.getElementById("resultTeamA").value.trim();
    const scoreA = document.getElementById("resultScoreA").value.trim();
    const teamB = document.getElementById("resultTeamB").value.trim();
    const scoreB = document.getElementById("resultScoreB").value.trim();

    if (teamA && scoreA !== "" && teamB && scoreB !== "") {
      const li = document.createElement("li");
      li.textContent = `${teamA} ${scoreA} - ${scoreB} ${teamB}`;
      resultsList.appendChild(li);

      document.getElementById("resultTeamA").value = "";
      document.getElementById("resultScoreA").value = "";
      document.getElementById("resultTeamB").value = "";
      document.getElementById("resultScoreB").value = "";
    } else {
      alert("Lütfen tüm alanları doldurun!");
    }
  });
}

// Maç günü planlama + fikstüre ekleme
document.getElementById("planMatchBtn").addEventListener("click", () => {
  const date = document.getElementById("matchDate").value;
  const time = document.getElementById("matchTime").value;
  const teamA = document.getElementById("teamA").value.trim();
  const teamB = document.getElementById("teamB").value.trim();

  if (date && time && teamA && teamB) {
    const text = `📅 ${date} ⏰ ${time} ⚽ ${teamA} vs ${teamB}`;

    // Maç Günü Altına ekle
    const liPlan = document.createElement("li");
    liPlan.textContent = text;
    document.getElementById("plannedMatches").appendChild(liPlan);

    // Fikstüre de ekle
    const liFixture = document.createElement("li");
    liFixture.textContent = text;
    document.getElementById("matchList").appendChild(liFixture);

    document.getElementById("matchDate").value = "";
    document.getElementById("matchTime").selectedIndex = 0;
    document.getElementById("teamA").value = "";
    document.getElementById("teamB").value = "";
  } else {
    alert("Lütfen tarih, saat ve takımları giriniz!");
  }
});

// Sayfa yüklenince puan tablosunu göster
window.addEventListener("DOMContentLoaded", () => {
  loadPuanTablosu();

  // Örnek gol kralı tablosu
  const golKraliData = [
    { oyuncu: "Ahmet Y.", takim: "Takım A", gol: 12 },
    { oyuncu: "Mehmet K.", takim: "Takım B", gol: 10 }
  ];
  tabloOlustur(golKraliData, "gol-krali-table", ["oyuncu","takim","gol"]);
});
