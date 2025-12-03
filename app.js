// Main application JavaScript for Elegance Nails Ostrava
// Handles GSAP animations for Hero, Gallery, and Services sections

// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// ========== HERO ANIMATIONS ==========
function initHeroAnimations() {
  const tl = gsap.timeline();

  // Background scale and fade in
  tl.from(".hero-bg", {
    scale: 1.1,
    opacity: 0,
    duration: 2,
    ease: "power2.out"
  })

  // Staggered Text Reveal
  .from(".hero-text-item", {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out"
  }, "-=1.5") // Overlap with bg animation

  // Fade in buttons
  .from(".hero-actions", {
    y: 20,
    opacity: 0,
    duration: 1,
    ease: "power2.out"
  }, "-=0.5")

  // Scroll Indicator
  .from(".hero-scroll", {
    opacity: 0,
    y: -20,
    duration: 1,
    delay: 0.5
  });
}

// ========== SERVICES ANIMATIONS ==========
function initServicesAnimations() {
  const items = gsap.utils.toArray('.service-item');

  items.forEach((item) => {
    gsap.from(item, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        toggleActions: "play none none reverse"
      }
    });
  });

  gsap.from(".sidebar-promo", {
    opacity: 0,
    x: 50,
    duration: 1.5,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".sidebar-promo",
      start: "top 80%",
    }
  });
}

// ========== GALLERY ANIMATIONS ==========
function initGalleryAnimations() {
  const items = gsap.utils.toArray('.gallery-item');

  gsap.from(items, {
    y: 100,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power3.out",
    scrollTrigger: {
      trigger: '#gallery',
      start: "top 70%",
    }
  });
}

// ========== INITIALIZE ALL ANIMATIONS ==========
function initAnimations() {
  initHeroAnimations();
  initServicesAnimations();
  initGalleryAnimations();
}

// Run animations when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}
