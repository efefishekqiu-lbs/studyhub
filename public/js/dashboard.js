const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let w, h, isMobile;
let particles = [];
let particleCount;

class Particle {
  constructor() {
    if (isMobile) {
      this.x = w / 2 + (Math.random() - 0.5) * w * 0.6;
      this.y = h / 2 + (Math.random() - 0.5) * h * 0.6;
    } else {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
    }

    const speed = isMobile ? 0.15 : 0.3;
    this.vx = (Math.random() - 0.5) * speed;
    this.vy = (Math.random() - 0.5) * speed;

    this.size = isMobile ? Math.random() * 1.2 + 0.3 : Math.random() * 1.5 + 0.5;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }

  draw() {
    ctx.fillStyle = "#5f63e2a9";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ===== SETUP ===== */
function setupParticles() {
  particles = [];
  particleCount = isMobile ? 45 : 80;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function getGridSize() {
  return isMobile ? 40 : 65;
}

function drawGrid() {
  ctx.strokeStyle = "#1f1f204f";
  ctx.lineWidth = 1.1;

  const gridSize = getGridSize();

  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }

  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
}

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  isMobile = w < 768;
  setupParticles(); 
}
window.addEventListener("resize", resize);
resize();

function animate() {
  ctx.clearRect(0, 0, w, h);
  drawGrid();
  for (const p of particles) {
    p.update();
    p.draw();
  }
  requestAnimationFrame(animate);
}
animate();

function smoothScrollTo(targetY, duration = 600) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;
  function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      window.scrollTo(0, startY + distance * easeInOutQuad(progress));
      if (timeElapsed < duration) {
          requestAnimationFrame(step);
      }
  }
  function easeInOutQuad(t) {
    return t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t;
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if(target) {
      e.preventDefault();
      const headerOffset = 80; 
      const targetY = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      smoothScrollTo(targetY, 500); 
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".features-box");

  boxes.forEach(box => {
    const canvas = document.createElement("canvas");
    box.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = box.clientWidth;
      canvas.height = box.clientHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

  function drawBoxGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const targetGridCount = 35; 
    const gridX = canvas.width / targetGridCount;
    const gridY = canvas.height / targetGridCount;

    ctx.strokeStyle = "#1f1f204f";
    ctx.lineWidth = 1;

    for (let x = 0; x <= canvas.width; x += gridX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = 0; y <= canvas.height; y += gridY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }


    function animate() {
      drawBoxGrid();
      requestAnimationFrame(animate);
    }

    animate();
  });
});

const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach(item => {
  item.addEventListener('click', () => {
    if (item.classList.contains('active')) {
      item.classList.remove('active');
    } else {
      faqItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('globe');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(300, 300);
  container.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.PointsMaterial({
    color: 0x3264E2,
    size: 0.025,
    transparent: false,
    opacity: 0.8
  });

  const globe = new THREE.Points(geometry, material);
  scene.add(globe);

  function animate() {
    requestAnimationFrame(animate);
    globe.rotation.y += 0.002;
    renderer.render(scene, camera);
  }

  animate();

})

const sections = document.querySelectorAll('.section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    } else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.15 
});

sections.forEach(section => {
  observer.observe(section);
});