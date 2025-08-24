// Gallery Lightbox Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Gallery data
    const galleryData = [
        {
            src: './assets/image/galeri1.jpg',
            title: 'Hamparan Sawah Hijau',
            description: 'Pemandangan sawah yang menghijau siap panen di musim kemarau',
            category: 'Pertanian'
        },
        {
            src: './assets/image/galeri2.jpg',
            title: 'Kegiatan Gotong Royong',
            description: 'Warga bergotong royong membersihkan lingkungan desa',
            category: 'Kegiatan'
        },
        {
            src: './assets/image/galeri3.jpg',
            title: 'Balai Desa Belor',
            description: 'Gedung balai desa yang menjadi pusat pelayanan masyarakat',
            category: 'Fasilitas'
        },
        {
            src: './assets/image/galeri4.jpeg',
            title: 'Panen Raya',
            description: 'Momentum panen raya yang dilakukan bersama-sama',
            category: 'Event'
        },
        {
            src: './assets/image/galeri5.jpg',
            title: 'Pepohonan Rindang',
            description: 'Keindahan alam desa dengan pepohonan yang rindang',
            category: 'Alam'
        }
    ];

    // Get gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = new bootstrap.Modal(document.getElementById('galleryModal'));
    const modalImage = document.getElementById('galleryModalImage');
    const modalTitle = document.getElementById('galleryModalTitle');
    const modalDescription = document.getElementById('galleryModalDescription');

    // Add click event to each gallery item
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function() {
            const data = galleryData[index];
            if (data) {
                modalImage.src = data.src;
                modalImage.alt = data.title;
                modalTitle.textContent = data.title;
                modalDescription.textContent = data.description;
                modal.show();
            }
        });

        // Add keyboard support
        item.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });

        // Make items focusable
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `Lihat gambar: ${galleryData[index]?.title || 'Galeri'}`);
    });

    // Lazy loading for images
    const images = document.querySelectorAll('.gallery-item img');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.remove('loading');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        img.classList.add('loading');
        imageObserver.observe(img);
    });

    // Stats animation on scroll
    const statsSection = document.querySelector('.gallery-stats');
    const statNumbers = document.querySelectorAll('.gallery-stats h3');
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                animateStats();
                statsAnimated = true;
            }
        });
    });

    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    function animateStats() {
        const targets = [150, 25, 12, 2025];
        
        statNumbers.forEach((stat, index) => {
            const target = targets[index];
            const increment = target / 50;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                if (index === 3) {
                    stat.textContent = Math.floor(current);
                } else {
                    stat.textContent = Math.floor(current) + (index === 0 ? '+' : index === 1 ? '+' : '');
                }
            }, 50);
        });
    }

    // Keyboard navigation for modal
    document.getElementById('galleryModal').addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modal.hide();
        }
    });

    // Preload images for better UX
    function preloadImages() {
        galleryData.forEach(data => {
            const img = new Image();
            img.src = data.src;
        });
    }

    // Initialize preloading after a short delay
    setTimeout(preloadImages, 1000);

    // Error handling for missing images
    images.forEach(img => {
        img.addEventListener('error', function() {
            this.src = './assets/image/placeholder.jpg';
            this.alt = 'Gambar tidak tersedia';
        });
    });

    // Smooth scroll to gallery when accessing from hash
    if (window.location.hash === '#gallery') {
        setTimeout(() => {
            document.getElementById('gallery').scrollIntoView({ 
                behavior: 'smooth' 
            });
        }, 100);
    }
});