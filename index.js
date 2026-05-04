const navbar = document.getElementById("navbar");
const scrollTopBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 50);
  scrollTopBtn.classList.toggle("visible", window.scrollY > 500);
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const fadeElements = document.querySelectorAll(".fade-in");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

fadeElements.forEach((el) => fadeObserver.observe(el));

const statNumbers = document.querySelectorAll(".stat-number");
let statsAnimated = false;

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNumbers.forEach((stat) => {
          const target = parseInt(stat.dataset.target);
          let current = 0;
          const increment = target / 80;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            if (target >= 1000) {
              stat.textContent = Math.floor(current).toLocaleString() + "+";
            } else {
              stat.textContent =
                Math.floor(current) + (target === 98 ? "%" : "+");
            }
          }, 25);
        });
      }
    });
  },
  { threshold: 0.5 }
);

document
  .querySelectorAll(".stats-section")
  .forEach((el) => statsObserver.observe(el));

const scheduleTabs = document.querySelectorAll(".schedule-tab");
const scheduleDays = document.querySelectorAll(".schedule-day");

scheduleTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    scheduleTabs.forEach((t) => t.classList.remove("active"));
    scheduleDays.forEach((d) => d.classList.remove("active"));

    tab.classList.add("active");
    const dayId = tab.dataset.day;
    document.getElementById(dayId).classList.add("active");
  });
});

document.getElementById("trialForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = e.target.querySelector(".form-btn");
  const originalText = btn.textContent;
  btn.textContent = "You're In!";
  btn.style.background = "#2d8a4e";
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = "";
    e.target.reset();
  }, 3000);
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

const canvas = document.getElementById("particles-canvas");
const ctx = canvas.getContext("2d");
let particles = [];

function resizeCanvas() {
  canvas.width = canvas.parentElement.offsetWidth;
  canvas.height = canvas.parentElement.offsetHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.fadeSpeed = Math.random() * 0.005 + 0.002;
    this.growing = Math.random() > 0.5;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.growing) {
      this.opacity += this.fadeSpeed;
      if (this.opacity >= 0.6) this.growing = false;
    } else {
      this.opacity -= this.fadeSpeed;
      if (this.opacity <= 0.05) this.growing = true;
    }

    if (
      this.x < 0 ||
      this.x > canvas.width ||
      this.y < 0 ||
      this.y > canvas.height
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 57, 70, ${this.opacity})`;
    ctx.fill();
  }
}

for (let i = 0; i < 50; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((p) => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();
