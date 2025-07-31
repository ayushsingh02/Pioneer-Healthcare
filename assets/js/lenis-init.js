document.addEventListener("DOMContentLoaded", function () {
  // 1. Initialize Lenis Smooth Scroll
  setTimeout(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Make Lenis globally available
    window.lenis = lenis;

    // 3. Text Animation Controller
    
    if (document.querySelector(".text-animate")) {
      gsap.registerPlugin(ScrollTrigger);
    
      function prepareText(element) {
        if (element.dataset.textStructured) return Promise.resolve();
    
        return document.fonts.ready.then(() => {
          const split = new SplitText(element, {
            type: "lines",
            linesClass: "lineParent",
          });
    
          element._splitText = split;
          element.dataset.textStructured = "true";
    
          element.querySelectorAll(".lineParent").forEach((line) => {
            const lineChild = document.createElement("div");
            lineChild.className = "lineChild";
            Array.from(line.childNodes).forEach((n) => lineChild.appendChild(n));
            line.appendChild(lineChild);
          });
    
          gsap.set(element.querySelectorAll(".lineChild"), {
            opacity: 0,
            y: 50,
            rotationX: 55,
            transformOrigin: "center bottom",
          });
        });
      }
    
      function animateSlideIn(section) {
        return new Promise((resolve) => {
          const elements = section.querySelectorAll(
            ".slide-in-text p, .slide-in-text h1, .slide-in-text h2, .slide-in-text h3, .slide-in-text h4, .slide-in-text .label, .slide-in-text .animate-btn"
          );
    
          const tl = gsap.timeline({ onComplete: resolve });
    
          elements.forEach((el, i) => {
            const lines = el.querySelectorAll(".lineChild");
            if (!lines.length) return;
    
            tl.to(el, { opacity: 1, duration: 0.2 }, i * 0.15).to(
              lines,
              {
                opacity: 1,
                y: 0,
                rotationX: 0,
                stagger: 0.05,
                ease: "power2.out",
              },
              i * 0.15 + 0.1
            );
          });
        });
      }
    
      function animateFadeIn(section) {
        return new Promise((resolve) => {
          const elements = section.querySelectorAll(".fade-in-text");
          if (!elements.length) return resolve();
    
          gsap.to(elements, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.15,
            onComplete: resolve,
          });
        });
      }
    
      async function handleSection(section) {
        const elements = section.querySelectorAll(
          ".slide-in-text p, .slide-in-text h1, .slide-in-text h2, .slide-in-text h3, .slide-in-text h4, .slide-in-text .label, .slide-in-text .animate-btn"
        );
    
        await Promise.all([...elements].map(prepareText));
    
        ScrollTrigger.create({
          trigger: section,
          start: "top 80%",
          once: true,
          refreshPriority: -1,
          onEnter: async () => {
            await animateSlideIn(section);
            await animateFadeIn(section);
            section.classList.add("fade-end");
          },
        });
      }
    
      async function init() {
        const sections = document.querySelectorAll(".text-animate");
        for (const section of sections) {
          gsap.set(section.querySelectorAll(".fade-in-text"), {
            opacity: 0,
            y: 200,
          });
    
          section
            .querySelectorAll(
              ".slide-in-text p, .slide-in-text h1, .slide-in-text h2, .slide-in-text h3, .slide-in-text h4, .slide-in-text .label, .slide-in-text .animate-btn"
            )
            .forEach((el) => {
              gsap.set(el, { opacity: 0 });
            });
    
          await handleSection(section);
        }
    
        ScrollTrigger.refresh();
      }
    
      init();
    }
    
    
    

    // 4. Parallax Images (only on desktop)
    if (window.innerWidth >= 991 && document.querySelector(".image-parallax")) {
      const parallaxImages = document.querySelectorAll(".image-parallax");

      gsap.set(parallaxImages, { yPercent: -5 });

      function updateParallax() {
        parallaxImages.forEach((img) => {
          const rect = img.getBoundingClientRect();
          const windowHeight = window.innerHeight;

          if (rect.bottom > 0 && rect.top < windowHeight) {
            const percent = rect.top / windowHeight;
            const yOffset = gsap.utils.mapRange(0, 1, -25, 25, percent);

            gsap.to(img, {
              y: yOffset,
              ease: "linear-ease",
              overwrite: true,
              duration: 0.2,
            });
          }
        });
      }

      lenis.on("scroll", updateParallax);
      updateParallax(); // Initial call
    }

    // 5. Rotate Icons
    if (document.querySelector(".spin-icon")) {
      const spinIcons = document.querySelectorAll(".spin-icon");
  
      function updateSpin() {
        spinIcons.forEach((icon) => {
          const section = icon.closest("section") || icon.parentElement;
          const rect = section.getBoundingClientRect();
          const windowHeight = window.innerHeight;
  
          if (rect.bottom > 0 && rect.top < windowHeight) {
            const progress = 1 - rect.top / windowHeight;
            const rotation = progress * 360;
  
            gsap.to(icon, {
              rotation,
              transformOrigin: "center center",
              ease: "none",
              overwrite: true,
              duration: 0.3,
            });
          }
        });
      }
  
      lenis.on("scroll", updateSpin);
      updateSpin(); // Initial call
    }

    // Watch for new spin icons (mobile only)
    if (window.innerWidth < 991) {
      new MutationObserver((mutations) => {
        const hasSpinIcons = mutations.some((mutation) =>
          [...mutation.addedNodes].some(
            (node) =>
              node.nodeType === 1 &&
              (node.classList.contains("spin-icon") ||
                node.querySelector(".spin-icon"))
          )
        );

        if (hasSpinIcons) setupSpinAnimation();
      }).observe(document.body, { childList: true, subtree: true });
    }

    // 6. Header Behavior
    if (document.querySelector("header")) {
      const header = document.querySelector("header");

      // Scrolled class
      function toggleHeaderClass() {
        const scrollPos = lenis.scroll;
        header.classList.toggle("scrolled", scrollPos > 200);
      }
      lenis.on("scroll", toggleHeaderClass);
      toggleHeaderClass(); // Initial check

      // Hide/show on scroll
      let lastScrollY = 0;
      let scrollUpStartY = 0;
      let isScrollingUp = false;

      lenis.on("scroll", ({ scroll }) => {
        if (scroll <= 0) {
          header.classList.remove("scrolling-down");
          isScrollingUp = false;
          lastScrollY = scroll;
          return;
        }

        if (scroll > lastScrollY && scroll > 200) {
          header.classList.add("scrolling-down");
          isScrollingUp = false;
        } else if (scroll < lastScrollY) {
          if (!isScrollingUp) {
            scrollUpStartY = scroll;
            isScrollingUp = true;
          }

          if (scrollUpStartY - scroll >= 50) {
            header.classList.remove("scrolling-down");
            isScrollingUp = false;
          }
        }

        lastScrollY = scroll;
      });

      // Navlink hover behavior
      if (window.innerWidth > 1300) {
        const listItems = document.querySelectorAll(
          ".header-link-list > ul > li"
        );
        const header = document.querySelector("header"); // Make sure header is defined

        listItems.forEach((li) => {
          li.addEventListener("mouseenter", () => {
            header.classList.add("stop-hidding");
          });
          li.addEventListener("mouseleave", () => {
            header.classList.remove("stop-hidding");
          });
        });
      }
    }

    // 7. Viewport Observer
    if (document.querySelector(".check-view")) {
      function initViewportObserver() {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("on-viewport");
                observer.unobserve(entry.target); // stop observing after it's triggered once
              }
            });
          },
          {
            rootMargin: "-10% 0px -10% 0px",
            threshold: 0.1,
          }
        );

        document.querySelectorAll(".check-view").forEach((section) => {
          observer.observe(section);
        });
      }
      initViewportObserver();
    }

    // 8. Overlap animation
    if (document.querySelector(".pin-overlap-container")) {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);

      function initCardStackAnimation() {
        const cards = gsap.utils.toArray(".poc-card");
        const container = document.querySelector(".pin-overlap-container");
        const totalCards = cards.length;

        if (!totalCards || !container) return;

        // Kill existing triggers
        ScrollTrigger.getAll().forEach((trigger) => {
          if (trigger.vars.trigger === container) trigger.kill();
        });

        // Initial setup - first card on top (z-index: totalCards), others hidden
        cards.forEach((card, index) => {
          gsap.set(card, {
            transformOrigin: "center center",
            zIndex: index + 1, // Card 1:1, Card 2:2, etc.
            x: index === 0 ? "0%" : "100%",
            scale: index === 0 ? 1 : 0.9,
            rotationY: index === 0 ? 0 : -15,
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top 10px",
            end: () => `+=${(totalCards - 1) * 100}%`,
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const cardEnterDuration = 1;
        const cardScaleDuration = 0.5;
        let position = 0;

        if (totalCards > 1) {
          tl.to(
            cards[0],
            {
              scale: 0.8,
              x: "-2%",
              duration: cardScaleDuration,
              ease: "power2.out",
            },
            position + cardEnterDuration
          );
        }

        for (let i = 1; i < totalCards; i++) {
          position += cardEnterDuration;

          tl.set(
            cards[i],
            {
              zIndex: totalCards + 1,
            },
            position
          );

          tl.to(
            cards[i],
            {
              x: "0%",
              scale: 1,
              rotationY: 0,
              duration: cardEnterDuration,
              ease: "power2.out",
            },
            position
          );

          if (i > 0) {
            tl.to(
              cards[i - 1],
              {
                scale: 0.8,
                x: "-2%",
                zIndex: i,
                duration: cardScaleDuration,
                ease: "power2.out",
              },
              position
            );
          }

          tl.set(
            cards[i],
            {
              zIndex: i + 1,
            },
            position + cardEnterDuration
          );

          position += cardScaleDuration;
        }
      }

      function checkAndInit() {
        if (window.innerWidth > 991) {
          setTimeout(initCardStackAnimation, 200);
        } else {
          // Kill all triggers if resizing below threshold
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
          // Optionally reset cards here if needed
        }
      }

      checkAndInit();
      window.addEventListener("resize", () => {
        ScrollTrigger.refresh();
        checkAndInit();
      });
    }

    // 9. Horizontal Scroll Animation
    if (document.querySelector(".horizontal-scroll-section")) {
      gsap.registerPlugin(ScrollTrigger);

      // Set up ScrollTrigger to work with Lenis
      lenis.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy("body", {
        scrollTop(value) {
          return arguments.length
            ? lenis.scrollTo(value, { immediate: true })
            : lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        pinType: document.querySelector("body").style.transform
          ? "transform"
          : "fixed",
      });

      const cards = document.querySelector(".horizontal-scroll-section");
      const scrollSection = document.querySelector(".hss-cards");

      if (cards && scrollSection) {
        const scrollDistance = scrollSection.scrollWidth - window.innerWidth;

        gsap.to(scrollSection, {
          x: - scrollDistance,
          // ease: "none",
          scrollTrigger: {
            trigger: '.horizontal-scroll-section',
            start: "top 110px",
            end: () => `+=${scrollDistance}`,
            pinSection: ".horizontal-scroll-section",
            pin: true,
            pinSpacer: true,
            scrub: true,
            anticipatePin: 1,
          },
        });
      }

      // Refresh ScrollTrigger after setup
      ScrollTrigger.addEventListener("refresh", () =>
        lenis.scrollTo(0, { immediate: true })
      );
      ScrollTrigger.refresh();
    }
    
  }, 200);
});
