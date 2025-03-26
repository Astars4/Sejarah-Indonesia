function handleMenu(menu) {
  alert(`Menu ${menu} diklik!`);
}

const backgrounds = [
  "img/Zaman Prasejarah.jpg",
  "img/Reformasi.jpg",
  "img/G 30 S PKI.jpg",
  "img/Kerajaan Kesultanan 3.jpg",
];

let currentIndex = 0;
const bgElement = document.getElementById("bg");

function changeBackground() {
  currentIndex = (currentIndex + 1) % backgrounds.length;
  bgElement.style.backgroundImage = `url('${backgrounds[currentIndex]}')`;
}

setInterval(changeBackground, 5000);

function handleMenu(menu) {
  const contents = document.querySelectorAll("#output .content");
  contents.forEach((content) => {
    content.classList.add("hidden");
  });
  document.getElementById(`${menu}Content`).classList.remove("hidden");

  // Jika menu Quiz dipilih, muat pertanyaan pertama
  if (menu === "quiz") {
    resetQuiz();
  }

  // Jika menu Materi dipilih, reset slide materi
  if (menu === "materi") {
    goToSlide(0);
    showMateri(1);
  }

  // Jika menu Timeline dipilih, reset slide timeline
  if (menu === "timeline") {
    goToTimelineSlide(0);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // Efek Fade In saat halaman pertama kali dimuat
  document.body.style.opacity = 0;
  document.body.style.transition = "opacity 1.5s";
  document.body.style.opacity = 1;

  const fadeElements = document.querySelectorAll(".fade-in-out");

  function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top < window.innerHeight - 100 && rect.bottom > 100;
  }

  function handleScroll() {
    fadeElements.forEach((el) => {
      if (isElementInViewport(el)) {
        el.classList.add("opacity-100");
        el.classList.remove("opacity-0");
      } else {
        el.classList.add("opacity-0");
        el.classList.remove("opacity-100");
      }
    });
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Panggil sekali saat pertama kali halaman dimuat
});

// ========== Fungsi untuk Slide Materi ==========
let currentSlideIndex = 0;
const materiSlides = document.querySelectorAll("#materiContent .slide");
const totalMateriSlides = materiSlides.length;
const materiIndicators = document.querySelectorAll(
  "#materiContent .indicator-dot"
);

function showSlide(index) {
  // Validasi index
  if (index < 0) index = totalMateriSlides - 1;
  if (index >= totalMateriSlides) index = 0;

  currentSlideIndex = index;

  // Update posisi slide
  materiSlides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - index)}%)`;
  });

  // Update indikator
  materiIndicators.forEach((dot, i) => {
    dot.classList.toggle("active", i === index);
  });

  // Update navigasi materi
  showMateri(index + 1);
}

function nextSlide() {
  showSlide(currentSlideIndex + 1);
}

function prevSlide() {
  showSlide(currentSlideIndex - 1);
}

function goToSlide(index) {
  showSlide(index);
}

// ========== Fungsi untuk Navigasi Materi ==========
let currentMateri = 1;
const totalMateri = 11;

function showMateri(index) {
  // Validasi index
  if (index < 1) index = totalMateri;
  if (index > totalMateri) index = 1;

  currentMateri = index;

  // Nonaktifkan semua navigasi
  document.querySelectorAll(".materi-nav").forEach((nav) => {
    nav.classList.remove("active");
  });

  // Aktifkan navigasi yang dipilih
  document.getElementById(`nav${index}`).classList.add("active");

  // Pindah ke slide yang sesuai
  goToSlide(index - 1);
}

function nextMateri() {
  showMateri(currentMateri + 1);
}

function prevMateri() {
  showMateri(currentMateri - 1);
}

// Fungsi untuk tab
function openTab(tabId, element) {
  // Hide all tab contents
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.add("hidden");
  });

  // Remove active class from all buttons
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("border-b-2", "border-blue-500");
  });

  // Show selected tab
  document.getElementById(tabId).classList.remove("hidden");

  // Add active class to clicked button
  element.classList.add("border-b-2", "border-blue-500");
}

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
  // Navigasi slide materi
  if (
    document.getElementById("materiContent").classList.contains("hidden") ===
    false
  ) {
    if (e.key === "ArrowRight") nextSlide();
    else if (e.key === "ArrowLeft") prevSlide();
  }

  // Navigasi slide timeline
  if (
    document.getElementById("timelineContent").classList.contains("hidden") ===
    false
  ) {
    if (e.key === "ArrowRight") nextTimelineSlide();
    else if (e.key === "ArrowLeft") prevTimelineSlide();
  }
});

// Initialize
showSlide(0);
showTimelineSlide(0);
showMateri(1);

// Load quiz if quiz is active on page load
if (window.location.hash === "#quiz") {
  handleMenu("quiz");
}
