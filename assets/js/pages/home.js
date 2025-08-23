/**
 * HOME PAGE SCRIPT
 * Scripts specific to the home page
 */

DesaBelor.pages.home = {
  init() {
    this.animateHeroStats();
    this.loadLatestNews();
    console.log("🏠 Home page script initialized");
  },

  animateHeroStats() {
    const stats = {
      "population-count": 1250,
      "area-size": 320,
      "farmer-count": 180
    };

    for (const id in stats) {
      const el = document.getElementById(id);
      if (el) {
        DesaBelor.utils.animateNumber(el, 0, stats[id], 2000);
      }
    }
  },

  loadLatestNews() {
    const newsGrid = document.getElementById("news-grid");
    if (!newsGrid) return;

    // Clear placeholder
    newsGrid.innerHTML = '';

    const newsData = [
      {
        img: "./assets/image/galeri1.jpg",
        date: "20 Agustus 2025",
        title: "Musyawarah Desa Membahas Rencana Pembangunan Jangka Menengah",
        excerpt: "Seluruh elemen masyarakat diundang untuk memberikan masukan dalam musyawarah desa..."
      },
      {
        img: "./assets/image/galeri2.jpg",
        date: "18 Agustus 2025",
        title: "Penyuluhan Pertanian Organik untuk Petani Muda Desa Belor",
        excerpt: "Dinas Pertanian Kabupaten memberikan pelatihan tentang metode pertanian organik modern..."
      },
      {
        img: "./assets/image/galeri3.jpg",
        date: "15 Agustus 2025",
        title: "Kerja Bakti Membersihkan Saluran Irigasi Menjelang Musim Tanam",
        excerpt: "Warga desa bergotong-royong memastikan kelancaran distribusi air untuk sawah..."
      }
    ];

    newsData.forEach(news => {
      const newsCard = this.createNewsCard(news);
      newsGrid.appendChild(newsCard);
    });
  },

  createNewsCard(news) {
    const card = DesaBelor.utils.createElement('div', { className: 'news-card' });
    
    card.innerHTML = `
      <div class="news-image">
          <img src="${news.img}" alt="${news.title}" loading="lazy">
      </div>
      <div class="news-content">
          <span class="news-date">${news.date}</span>
          <h3>${news.title}</h3>
          <p>${news.excerpt}</p>
          <a href="./pages/berita.html" class="news-link">Baca Selengkapnya</a>
      </div>
    `;
    
    return card;
  }
};

// Initialize the page script
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => DesaBelor.pages.home.init());
} else {
  DesaBelor.pages.home.init();
}
