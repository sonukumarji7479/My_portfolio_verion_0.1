document.addEventListener("DOMContentLoaded", () => {
  /* --- Lenis Smooth Scroll --- */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* -----------------------------------------------
   * HIGH-PERFORMANCE CANVAS STARFIELD & NEBULA
   * ----------------------------------------------- */
  const canvas = document.getElementById("starCanvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width, height;

    const resizeValues = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resizeValues);
    resizeValues();

    class Star {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5;
        this.opacity = Math.random();
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      }
      update() {
        this.x += this.speedX; this.y += this.speedY;
        this.opacity += this.twinkleSpeed;
        if (this.x < 0) this.x = width; if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height; if (this.y > height) this.y = 0;
        if (this.opacity > 1 || this.opacity < 0.2) this.twinkleSpeed = -this.twinkleSpeed;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 8; ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      }
    }

    class Meteor {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * width; this.y = Math.random() * height * 0.5;
        this.length = Math.random() * 80 + 20; this.speed = Math.random() * 25 + 10;
        this.angle = Math.PI / 4; this.opacity = 0; this.active = false;
        if (Math.random() < 0.05) { this.active = true; this.opacity = 1; }
      }
      update() {
        if (!this.active) {
          if (Math.random() < 0.01) { this.active = true; this.opacity = 1; this.x = Math.random() * width; this.y = Math.random() * height * 0.5; }
          return;
        }
        this.x += this.speed; this.y += this.speed; this.opacity -= 0.01;
        if (this.x > width || this.y > height || this.opacity <= 0) { this.reset(); this.active = false; }
      }
      draw() {
        if (!this.active) return;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y - this.length); ctx.stroke();
      }
    }

    const stars = []; const meteors = [];
    for (let i = 0; i < 200; i++) stars.push(new Star());
    for (let i = 0; i < 10; i++) meteors.push(new Meteor());

    const animate = () => {
      ctx.clearRect(0, 0, width, height); ctx.shadowBlur = 0;
      stars.forEach(star => { star.update(); star.draw(); });
      meteors.forEach(meteor => { meteor.update(); meteor.draw(); });
      requestAnimationFrame(animate);
    };
    animate();
  }

  /* --- MOBILE MENU LOGIC --- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* --- Audio Control Logic --- */
  const audio = document.getElementById("audio");
  const btn = document.getElementById("btn");
  const audioText = document.querySelector(".audio-text");

  if (btn && audio) {
    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play(); btn.classList.add("playing");
        audioText.textContent = "Pause Reading";
      } else {
        audio.pause(); btn.classList.remove("playing");
        audioText.textContent = "Read About Me";
      }
    });
    audio.addEventListener("ended", () => {
      btn.classList.remove("playing"); audioText.textContent = "Read About Me";
    });
  }

  /* --- Contact Form Logic --- */
  try {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const subject = `Portfolio Contact: ${name}`;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;
        window.location.href = `mailto:sonu9303343@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
      });
    }
  } catch (error) { console.error("Error in contact form script:", error); }

  /* --- Typing Animation --- */
  const h1Element = document.querySelector(".type-h1");
  const sonuElement = document.querySelector(".type-sonu");
  const kumarElement = document.querySelector(".type-kumar");
  const subtitleElement = document.querySelector(".typing-text");

  const h1Text = "Hi, I'm"; const sonuText = "SONU"; const kumarText = "KUMAR"; const subtitleWords = ["Full Stack Developer"];

  function typeString(element, text, minSpeed = 50, maxSpeed = 150) {
    return new Promise((resolve) => {
      let i = 0; element.classList.add("typing-active"); element.textContent = "";
      function typing() {
        if (i < text.length) {
          element.textContent += text.charAt(i); i++;
          setTimeout(typing, Math.random() * (maxSpeed - minSpeed) + minSpeed);
        } else { element.classList.remove("typing-active"); resolve(); }
      }
      typing();
    });
  }

  async function loopSubtitle() {
    let wordIndex = 0;
    while (true) {
      const currentWord = subtitleWords[wordIndex];
      subtitleElement.classList.add("typing-active");
      for (let i = 0; i <= currentWord.length; i++) {
        subtitleElement.textContent = currentWord.substring(0, i);
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
      }
      await new Promise(r => setTimeout(r, 2000));
      for (let i = currentWord.length; i >= 0; i--) {
        subtitleElement.textContent = currentWord.substring(0, i);
        await new Promise(r => setTimeout(r, 30));
      }
      subtitleElement.classList.remove("typing-active");
      wordIndex = (wordIndex + 1) % subtitleWords.length;
      await new Promise(r => setTimeout(r, 500));
    }
  }

  async function startTypingSequence() {
    if (h1Element && sonuElement && kumarElement && subtitleElement) {
      await typeString(h1Element, h1Text);
      await typeString(sonuElement, sonuText);
      await typeString(kumarElement, kumarText);
      loopSubtitle();
    }
  }
  startTypingSequence();
});
