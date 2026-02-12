document.addEventListener("DOMContentLoaded", () => {
  /* --- Lenis Smooth Scroll --- */
  const lenis = new Lenis();
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

    // Resize handling
    const resizeValues = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", resizeValues);
    resizeValues();

    // 1. Star Class
    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.5; // Size between 0.5 and 2.5
        this.opacity = Math.random();
        this.speedX = (Math.random() - 0.5) * 0.2; // Slow drift
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity += this.twinkleSpeed;

        // Wrap around screen
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Twinkle Logic
        if (this.opacity > 1 || this.opacity < 0.2) {
          this.twinkleSpeed = -this.twinkleSpeed;
        }
      }

      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Star Glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
      }
    }

    // 2. Meteor (Shooting Star) Class
    class Meteor {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height * 0.5; // Start in top half
        this.length = Math.random() * 80 + 20;
        this.speed = Math.random() * 25 + 10; // MUCH FASTER (10 to 35)
        this.angle = Math.PI / 4; // 45 degrees
        this.opacity = 0;
        this.active = false;
        // Randomly activate
        if (Math.random() < 0.05) { // 5% chance to be active on init
          this.active = true;
          this.opacity = 1;
        }
      }

      update() {
        if (!this.active) {
          if (Math.random() < 0.01) { // 1% chance to spawn per frame (was 0.2%)
            this.active = true;
            this.opacity = 1;
            this.x = Math.random() * width;
            this.y = Math.random() * height * 0.5;
          }
          return;
        }

        this.x += this.speed;
        this.y += this.speed;
        this.opacity -= 0.01;

        if (this.x > width || this.y > height || this.opacity <= 0) {
          this.reset();
          this.active = false;
        }
      }

      draw() {
        if (!this.active) return;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y - this.length);
        ctx.stroke();
      }
    }

    // Initialize Arrays
    const stars = [];
    const meteors = [];

    // Create 200 Stars
    for (let i = 0; i < 200; i++) {
      stars.push(new Star());
    }

    // Create 10 Meteors (Increased from 2)
    for (let i = 0; i < 10; i++) {
      meteors.push(new Meteor());
    }

    // 3. Nebula Effect (Subtle Background Clouds)
    const drawNebula = () => {
      // Create a subtle gradient or cloud effect
      // For performance, we can just draw large, very transparent radial gradients
      // drifting slowly. Or keep it simple with CSS.
      // Let's rely on CSS for the deep background and keep Canvas for stars.
    };

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Reset shadow for performance (only stars need glow)
      ctx.shadowBlur = 0;

      // Draw Stars
      stars.forEach(star => {
        star.update();
        star.draw();
      });

      // Draw Meteors
      meteors.forEach(meteor => {
        meteor.update();
        meteor.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();
  }

  const navToggle = document.getElementById("navToggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navToggle.classList.toggle("active");
      navToggle.setAttribute(
        "aria-expanded",
        navLinks.classList.contains("active")
      );
    });

    // Close nav links when a link is clicked (for mobile UX)
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          navToggle.classList.remove("active");
          navToggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }

  // 2. Audio Control Logic
  const audio = document.getElementById("audio");
  const btn = document.getElementById("btn");
  const audioText = document.querySelector(".audio-text");

  if (btn && audio) {
    btn.addEventListener("click", () => {
      if (audio.paused) {
        audio.play();
        btn.classList.add("playing");
        audioText.textContent = "Pause Reading";
      } else {
        audio.pause();
        btn.classList.remove("playing");
        audioText.textContent = "Read About Me";
      }
    });

    // Reset state when audio ends
    audio.addEventListener("ended", () => {
      btn.classList.remove("playing");
      audioText.textContent = "Read About Me";
    });
  }
  // 3. Contact Form Logic (Mailto Redirect) - Isolated Block
  try {
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
      console.log("Contact form found, attaching listener");
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        console.log("Form submitted");

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;

        const subject = `Portfolio Contact: ${name}`;
        const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;

        const mailtoLink = `mailto:sonu9303343@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

        console.log("Redirecting to: " + mailtoLink);
        window.location.href = mailtoLink;
      });
    } else {
      console.error("Contact form element not found!");
    }
  } catch (error) {
    console.error("Error in contact form script:", error);
  }

  /* --- Advanced Sequential Typing Animation --- */
  const h1Element = document.querySelector(".type-h1");
  const h2Element = document.querySelector(".type-h2");
  const subtitleElement = document.querySelector(".typing-text");

  // Texts to type
  const h1Text = "Hi, I'm";
  const h2Text = "SONU KUMAR";
  const subtitleWords = ["Full Stack Web Developer", "Python Developer", "UI/UX Designer", "Software Engineer"];

  // Helper function to type text into an element
  // Helper function to type text into an element with variable speed
  function typeString(element, text, minSpeed = 50, maxSpeed = 150) {
    return new Promise((resolve) => {
      let i = 0;
      element.classList.add("typing-active");
      element.textContent = "";

      function typing() {
        if (i < text.length) {
          element.textContent += text.charAt(i);
          i++;
          // Random delay for natural typing feel
          const randomDelay = Math.random() * (maxSpeed - minSpeed) + minSpeed;
          setTimeout(typing, randomDelay);
        } else {
          element.classList.remove("typing-active");
          resolve();
        }
      }
      typing();
    });
  }

  // Infinite loop for subtitle
  async function loopSubtitle() {
    let wordIndex = 0;

    while (true) {
      const currentWord = subtitleWords[wordIndex];
      subtitleElement.classList.add("typing-active");

      // Type
      for (let i = 0; i <= currentWord.length; i++) {
        subtitleElement.textContent = currentWord.substring(0, i);
        // Random typing speed for subtitle
        await new Promise(r => setTimeout(r, Math.random() * 100 + 50));
      }

      await new Promise(r => setTimeout(r, 2000)); // Pause at end

      // Delete (faster and more consistent)
      for (let i = currentWord.length; i >= 0; i--) {
        subtitleElement.textContent = currentWord.substring(0, i);
        await new Promise(r => setTimeout(r, 30));
      }

      subtitleElement.classList.remove("typing-active");
      wordIndex = (wordIndex + 1) % subtitleWords.length;
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Master Sequence
  async function startTypingSequence() {
    if (h1Element && h2Element && subtitleElement) {
      // 1. Type "Hi, I'm"
      await typeString(h1Element, h1Text);

      // 2. Type "SONU KUMAR"
      await typeString(h2Element, h2Text);

      // 3. Start Subtitle Loop
      loopSubtitle();
    }
  }

  // Start the animation
  startTypingSequence();
});

