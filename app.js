let isHeaderOpened = false;
$(document).on("click", ".header-profile", function () {
   if (isHeaderOpened == false) {
      isHeaderOpened = true;
      setHeaderMode(isHeaderOpened); 
   // } else {
   //    isHeaderOpened = false;
   //    setHeaderMode(isHeaderOpened);
   }
});

$(document).on("click", ".header-profile-exit", function () {
   setTimeout(() => {
      isHeaderOpened = false;
   setHeaderMode(isHeaderOpened);
   }, 10);
})

function setHeaderMode(status) {
   if (status == true) {
      $(".header-profile-secondProfile").css({
         "position": "absolute",
         "top": "-20vh",
         "right": "-20vw",
      })
      $(".header-profile").css({
         "position": "absolute",
         "transform": "none",
         "width": "30vw",
         "height": "90vh",
         "border-radius": "25px",
         "border-top-right-radius": "8px",
         "border-color": "#6a6969",
      })
      $(".header-profile-secondProfile").css({
         "position": "absolute",
         "top": "18vh",
         "left": "50%",
         "transform": "translate(-50%, -50%)",
         "display": "flex",
      })
      $(".header-profile-exist-letter").hide()
      setTimeout(() => {
         $(".header-email, .header-velkommen, .header-betyger").show()
         $(".header-profile-exit").css("display", "flex")
      }, 100);
   } else {
      $(".header-profile").css({
         "position": "absolute",
         "transform": "translate(0, -50%)",
         "width": "2.8vw",
         "height": "2.8vw",
         "border-radius": "50%",
         "border-color": "#303030",
      })
      $(".header-profile-exist-letter").show()
      $(".header-profile-exit, .header-profile-secondProfile, .header-email, .header-velkommen, .header-betyger").hide()
   }
}

const root = document.documentElement;
const btn = document.querySelector(".tema");

// root.dataset.theme = localStorage.theme || "dark";

btn.addEventListener("click", () => {
   if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "lightmode");
   } else {
      if (localStorage.getItem("theme") == "darkmode") {
         localStorage.setItem("theme", "lightmode");
         document.querySelector('canvas').style.opacity = "0"
      } else {
         localStorage.setItem("theme", "darkmode");
         document.querySelector('canvas').style.opacity = "1"
      }
   }
   setModeType(localStorage.getItem("theme"))
});

function setModeType(type) {
   document.documentElement.setAttribute("data-theme", type);
   document.body.dataset.theme = type;
}

let isNavbarActive = true;

$(document).on("click", ".burger-menu", function () {
   if (isNavbarActive) {
      isNavbarActive = false;
      $(this).css("transform", "rotate(90deg)");
      $("nav").css({
         width: "5%",
      })
      $("main").css({
         position: "absolute",
         left: "3%",
         width: "97.2%"
      })
      $(".lektioner>h1").hide()
   } else {
      isNavbarActive = true;
      $(this).css("transform", "rotate(0deg)");
      $("nav").css({
         width: "16%",
      })
      $("main").css({
         position: "absolute",
         left: "16%",
         width: "84%"
      })
      $(".lektioner>h1").show()
   }
});



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

document.addEventListener("DOMContentLoaded", () => {
  const boxes = document.querySelectorAll(".test");

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
