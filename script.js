/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC (Adarsh Singh Redesign)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

  // ===== 1. PRE LOADER =====
  window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    // Add small delay for smooth experience
    setTimeout(() => {
      loader.classList.add("fade-out");
    }, 600);
  });

  // Fallback loader removal if load event fired earlier
  setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader && !loader.classList.contains("fade-out")) {
      loader.classList.add("fade-out");
    }
  }, 2500);


  // ===== 2. SCROLL PROGRESS INDICATOR =====
  const scrollProgress = document.getElementById("scroll-progress");
  
  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const percentage = (window.scrollY / totalHeight) * 100;
      scrollProgress.style.width = percentage + "%";
    }
  });


  // ===== 3. STICKY HEADER & NAV ACTIVE STATES =====
  const header = document.querySelector("header");
  const navLinks = document.querySelectorAll("nav a");
  const sections = document.querySelectorAll("section");

  // Sticky header background padding transition
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scroll-scrolled");
    } else {
      header.classList.remove("scroll-scrolled");
    }
  });

  // Track active section to highlight corresponding nav link
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // triggers when section is in active view area
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${activeId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    if (section.id) sectionObserver.observe(section);
  });


  // ===== 4. DYNAMIC TYPING EFFECT =====
  const roles = [
    "Full Stack Developer",
    "Data Analyst",
    "AI-ML Enthusiast",
    "SaaS Builder",
    "Problem Solver"
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let currentRole = "";
  let isDeleting = false;
  const typingElement = document.getElementById("typing");

  function typeEffect() {
    currentRole = roles[roleIndex];

    if (isDeleting) {
      // Erase character
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Type character
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    // Typing speed control
    let typeSpeed = isDeleting ? 40 : 80;

    // Word complete states
    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 1500; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length; // Next word
      typeSpeed = 400; // Small pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
  }

  // Start typing
  if (typingElement) {
    typeEffect();
  }


  // ===== 5. ANIMATED STATS COUNTERS =====
  const statsSection = document.querySelector(".stats-section");
  let statsAnimated = false;

  const countUp = () => {
    const statNumbers = document.querySelectorAll(".stat-number");
    
    statNumbers.forEach(numberEl => {
      const target = parseFloat(numberEl.getAttribute("data-target"));
      const decimals = parseInt(numberEl.getAttribute("data-decimals") || 0);
      const duration = 1800; // ms
      let startTime = null;

      const animateStep = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function outQuad
        const easeProgress = progress * (2 - progress);
        const currentValue = easeProgress * target;

        if (decimals > 0) {
          numberEl.textContent = currentValue.toFixed(decimals);
        } else {
          numberEl.textContent = Math.floor(currentValue);
        }

        if (progress < 1) {
          requestAnimationFrame(animateStep);
        } else {
          // Ensure exact final value with correct symbols
          const isPlus = target === 10 || target === 5;
          numberEl.textContent = target.toFixed(decimals) + (isPlus ? "+" : "");
        }
      };

      requestAnimationFrame(animateStep);
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsAnimated) {
        countUp();
        statsAnimated = true;
      }
    });
  }, { threshold: 0.25 });

  if (statsSection) {
    statsObserver.observe(statsSection);
  }


  // ===== 6. PROJECTS FILTERING =====
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(button => {
    button.addEventListener("click", () => {
      // Toggle active classes on buttons
      filterButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const filterValue = button.getAttribute("data-filter");

      projectCards.forEach(card => {
        if (filterValue === "all") {
          card.classList.remove("hide");
        } else {
          if (card.classList.contains(filterValue)) {
            card.classList.remove("hide");
          } else {
            card.classList.add("hide");
          }
        }
      });

      // Refresh AOS positions since cards shifted layout
      setTimeout(() => {
        AOS.refresh();
      }, 400);
    });
  });


  // ===== 7. GITHUB API DYNAMIC STATS FETCH =====
  const fetchGithubStats = async () => {
    const username = "AdarshSingh4455";
    const reposEl = document.getElementById("gh-repos");
    const followersEl = document.getElementById("gh-followers");
    const avatarEl = document.getElementById("gh-avatar");

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (response.ok) {
        const data = await response.json();
        // Update elements with API data
        if (reposEl && data.public_repos !== undefined) {
          reposEl.textContent = data.public_repos;
        }
        if (followersEl && data.followers !== undefined) {
          followersEl.textContent = data.followers + "+";
        }
        if (avatarEl && data.avatar_url) {
          avatarEl.src = data.avatar_url;
        }
        console.log("GitHub user statistics fetched dynamically.");
      } else {
        console.warn("GitHub API fetch failed. Using fallback static stats.");
      }
    } catch (err) {
      console.warn("GitHub API error:", err, "Using fallback static stats.");
    }
  };

  fetchGithubStats();


  // ===== 8. EMAILJS CONTACT FORM =====
  const contactForm = document.getElementById("contact-form");
  const btnSubmit = document.getElementById("btn-submit");
  const btnText = btnSubmit.querySelector(".btn-text");
  const btnSpinner = btnSubmit.querySelector(".btn-spinner");
  const statusSuccess = document.getElementById("status-success");
  const statusError = document.getElementById("status-error");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Show submitting states
      btnSubmit.disabled = true;
      btnText.classList.add("hidden");
      btnSpinner.classList.remove("hidden");
      statusSuccess.classList.add("hidden");
      statusError.classList.add("hidden");

      // Replace these credentials with your actual EmailJS IDs
      const serviceId = "YOUR_SERVICE_ID";
      const templateId = "YOUR_TEMPLATE_ID";
      const publicKey = "YOUR_PUBLIC_KEY";

      // Check if credentials are still placeholder template values
      if (serviceId === "YOUR_SERVICE_ID" || templateId === "YOUR_TEMPLATE_ID" || publicKey === "YOUR_PUBLIC_KEY") {
        // Run simulation mode for recruiter testing
        setTimeout(() => {
          btnSubmit.disabled = false;
          btnText.classList.remove("hidden");
          btnSpinner.classList.add("hidden");
          statusSuccess.classList.remove("hidden");
          contactForm.reset();
          console.info("Form simulation successful. To receive real emails, set up your serviceID, templateID, and publicKey in script.js.");
        }, 1500);
      } else {
        // Run actual EmailJS transmission
        emailjs.sendForm(serviceId, templateId, contactForm, publicKey)
          .then(() => {
            btnSubmit.disabled = false;
            btnText.classList.remove("hidden");
            btnSpinner.classList.add("hidden");
            statusSuccess.classList.remove("hidden");
            contactForm.reset();
          })
          .catch((error) => {
            btnSubmit.disabled = false;
            btnText.classList.remove("hidden");
            btnSpinner.classList.add("hidden");
            statusError.classList.remove("hidden");
            console.error("EmailJS transmission error:", error);
          });
      }
    });
  }


  // ===== 9. BACK TO TOP BUTTON =====
  const topBtn = document.getElementById("topBtn");

  if (topBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        topBtn.classList.add("show");
      } else {
        topBtn.classList.remove("show");
      }
    });

    topBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  // ===== 10. AOS INITIALIZATION =====
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 800,
      once: true,
      offset: 50,
      disable: 'mobile' // disables on mobile for maximum scrolling performance
    });
  }


  // ===== 11. PARTICLES BACKGROUND CONFIG =====
  if (typeof particlesJS !== "undefined" && document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 65, density: { enable: true, value_area: 800 } },
        color: { value: ["#38BDF8", "#8B5CF6"] },
        shape: { type: "circle" },
        opacity: {
          value: 0.22,
          random: true,
          anim: { enable: false }
        },
        size: {
          value: 3,
          random: true,
          anim: { enable: false }
        },
        line_linked: {
          enable: true,
          distance: 140,
          color: "#38BDF8",
          opacity: 0.08,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.2,
          direction: "none",
          random: true,
          straight: false,
          out_mode: "out",
          bounce: false
        }
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true
        },
        modes: {
          grab: { distance: 140, line_linked: { opacity: 0.22 } },
          push: { particles_nb: 3 }
        }
      },
      retina_detect: true
    });
  }

  // ===== 12. SCREENSHOTS GALLERY LIGHTBOX =====
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxCaption = document.getElementById("lightbox-caption");

  if (galleryItems.length > 0 && lightbox) {
    galleryItems.forEach(item => {
      item.addEventListener("click", () => {
        const img = item.querySelector("img");
        const alt = img.getAttribute("alt");
        const src = img.getAttribute("src");
        
        if (lightboxImg) lightboxImg.src = src;
        if (lightboxCaption) lightboxCaption.textContent = alt;
        lightbox.classList.add("show");
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener("click", () => {
        lightbox.classList.remove("show");
      });
    }

    // Close on click outside the image
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        lightbox.classList.remove("show");
      }
    });
  }

});