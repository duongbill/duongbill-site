// Enhanced Animations for DuongBill Website
document.addEventListener("DOMContentLoaded", function () {
  // 1. Scroll Progress Indicator
  function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    document.querySelector(".scroll-progress").style.width =
      scrollPercent + "%";
  }

  window.addEventListener("scroll", updateScrollProgress);

  // 2. Particles.js Configuration
  if (typeof particlesJS !== "undefined") {
    // Reduce particles on mobile
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 40 : 80;

    particlesJS("particles-js", {
      particles: {
        number: {
          value: particleCount,
          density: {
            enable: true,
            value_area: 800,
          },
        },
        color: {
          value: "#59ECFF",
        },
        shape: {
          type: "circle",
          stroke: {
            width: 0,
            color: "#000000",
          },
        },
        opacity: {
          value: 0.5,
          random: false,
          anim: {
            enable: false,
            speed: 1,
            opacity_min: 0.1,
            sync: false,
          },
        },
        size: {
          value: 3,
          random: true,
          anim: {
            enable: false,
            speed: 40,
            size_min: 0.1,
            sync: false,
          },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#59ECFF",
          opacity: 0.4,
          width: 1,
        },
        move: {
          enable: true,
          speed: 6,
          direction: "none",
          random: false,
          straight: false,
          out_mode: "out",
          bounce: false,
          attract: {
            enable: false,
            rotateX: 600,
            rotateY: 1200,
          },
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: {
            enable: true,
            mode: "repulse",
          },
          onclick: {
            enable: true,
            mode: "push",
          },
          resize: true,
        },
        modes: {
          grab: {
            distance: 400,
            line_linked: {
              opacity: 1,
            },
          },
          bubble: {
            distance: 400,
            size: 40,
            duration: 2,
            opacity: 8,
            speed: 3,
          },
          repulse: {
            distance: 200,
            duration: 0.4,
          },
          push: {
            particles_nb: 4,
          },
          remove: {
            particles_nb: 2,
          },
        },
      },
      retina_detect: true,
    });
  }

  // 3. Enhanced Text Animation (using original clip animation)
  // Ensure clip animation is working
  function ensureClipAnimation() {
    const clipHeadline = document.querySelector(".cd-headline.clip");
    if (clipHeadline) {
      const words = clipHeadline.querySelectorAll(".cd-words-wrapper b");
      if (words.length > 0) {
        // Make sure first word is visible
        words.forEach((word) => word.classList.remove("is-visible"));
        words[0].classList.add("is-visible");

        // Trigger headline animation if jQuery is available
        if (
          typeof jQuery !== "undefined" &&
          jQuery(".cd-headline").length > 0
        ) {
          // The headline.js will handle the animation
          console.log("Clip animation initialized");
        }
      }
    }
  }

  // Initialize clip animation after a delay
  setTimeout(ensureClipAnimation, 1000);

  // 4. Enhanced Skill Bars Animation
  function animateSkillBars() {
    const skillBars = document.querySelectorAll(".skill-progress");

    skillBars.forEach((bar) => {
      const progress = bar.getAttribute("data-progress");
      bar.style.width = "0%";

      setTimeout(() => {
        bar.style.width = progress + "%";
      }, 500);
    });
  }

  // Trigger skill bars animation when in view
  const skillsSection = document.querySelector("#about");
  if (skillsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateSkillBars();
          observer.unobserve(entry.target);
        }
      });
    });
    observer.observe(skillsSection);
  }

  // 5. Enhanced Loading Screen
  function hideLoadingScreen() {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      setTimeout(() => {
        loadingScreen.style.opacity = "0";
        loadingScreen.style.transform = "scale(1.1)";
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 500);
      }, 2000);
    }
  }

  // Hide loading screen after page load
  window.addEventListener("load", hideLoadingScreen);

  // 6. Smooth Scroll Enhancement
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // 7. Parallax Effect for Hero Section (Fixed)
  function parallaxEffect() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll(".parallaxie");

    parallaxElements.forEach((element) => {
      // Only apply parallax if element is in viewport
      const rect = element.getBoundingClientRect();
      if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
        const speed = 0.3; // Reduced speed for smoother effect
        element.style.backgroundPosition = `center ${scrolled * speed}px`;
      }
    });
  }

  // Use throttled scroll for better performance
  let ticking = false;
  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(parallaxEffect);
      ticking = true;
      setTimeout(() => {
        ticking = false;
      }, 16);
    }
  }

  window.addEventListener("scroll", requestTick);

  // 8. Enhanced Hover Effects for Cards
  function addCardHoverEffects() {
    const cards = document.querySelectorAll(
      ".project-card, .post-box, .contact-info"
    );

    cards.forEach((card) => {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-10px) scale(1.02)";
        this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
        this.style.boxShadow = "";
      });
    });
  }

  addCardHoverEffects();

  // 9. Text Reveal Animation
  function revealText() {
    const textElements = document.querySelectorAll("h1, h2, h3, p");

    textElements.forEach((element) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      });

      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

      observer.observe(element);
    });
  }

  // Initialize text reveal after a short delay
  setTimeout(revealText, 1000);

  // 10. Dynamic Background Color Change
  function changeBackgroundOnScroll() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const sections = document.querySelectorAll("section");

    sections.forEach((section, index) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (
        scrollPosition >= sectionTop - windowHeight / 2 &&
        scrollPosition < sectionTop + sectionHeight - windowHeight / 2
      ) {
        // Change navbar background based on section
        const navbar = document.querySelector("#mainNav");
        if (navbar) {
          if (index % 2 === 0) {
            navbar.style.backgroundColor = "rgba(51, 51, 51, 0.95)";
          } else {
            navbar.style.backgroundColor = "rgba(45, 55, 72, 0.95)";
          }
        }
      }
    });
  }

  window.addEventListener("scroll", changeBackgroundOnScroll);
});
