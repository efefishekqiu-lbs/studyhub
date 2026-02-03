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

$(document).on("click", ".add-lektion", async function () {
  const { value: ipAddress } = await Swal.fire({
    title: "Lägg till en klass ",
    input: "text",
    inputLabel: "Lägg koden för klassen",
    inputPlaceholder: "12345",
    showCancelButton: true,
    theme: "dark",
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    }
  });
  if (ipAddress) {
    Swal.fire(`Your IP address is ${ipAddress}`);
  }
})

// $(document).on("click", ".klasser-wrapper", function () {
//   const clicked = $(this);
// })
$(document).on("click", ".klasser-remove", function (event) {
  event.stopPropagation(); 
  let id = $(this).parent().attr("data-id");
  Swal.fire({
    title: "Är du säker?",
    text: "Detta går inte att ångra!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ja, ta bort det!",
    theme: "dark",
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Borttagen!",
        text: "Din fil har tagits bort.",
        icon: "success"
      });
      console.log(id)
      $(`.klasser-wrapper[data-id="${id}"]`).remove();
      $(`.lektioner[data-id="${id}"]`).remove();
    }
  });
});

$(document).on("click", ".klasser-wrapper", function () {
  const clicked = $(this);
  const isActive = clicked.hasClass("active");

  $(".klasser-wrapper").find(".klasser-arrow").css("transform", "rotate(0deg)")

  $(".klasser-wrapper-footerInfo").hide();
  $(".klasser-wrapper").removeClass("active");
  $(".klasser-remove").hide()

  if (isActive) return;
  clicked.find(".klasser-remove").show()
  clicked.find(".klasser-arrow").css("transform", "rotate(180deg)")
  clicked.addClass("active");
  clicked.find(".klasser-wrapper-footerInfo").show();
});

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
const changeSvg = document.querySelector("#tema")
console.log(btn)

// root.dataset.theme = localStorage.theme || "dark";

$(document).on("click", ".tema", function () {
  if (!localStorage.getItem("theme")) {
      localStorage.setItem("theme", "lightmode");
   } else {
      if (localStorage.getItem("theme") == "darkmode") {
         localStorage.setItem("theme", "lightmode");
      } else {
         localStorage.setItem("theme", "darkmode");
      }
   }
   setModeType(localStorage.getItem("theme"))
});

$(document).ready(function() {
  if (localStorage.getItem("theme")) {
    setModeType(localStorage.getItem("theme"))
  }
})

function setModeType(type) {
   document.documentElement.setAttribute("data-theme", type);
   document.body.dataset.theme = type;
   console.log("hasdasjd")
   if (type == "darkmode") {
    $("canvas").show()
    changeSvg.innerHTML = `<svg stroke="currentColor" class="tema opacityLow" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path></svg>`

  } else {
    $("canvas").hide()
    changeSvg.innerHTML = `<svg stroke="currentColor" class="tema opacityLow" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path></svg>`

   }
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
  ctx.strokeStyle = "#cccccc26";
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


const tooltipTexts = {
  [".add-lektion"]: "Add lektion text",
  [".klasser-remove"]: "Ta bort klassen",
  [".tema"]: "Ändra färg teman",
}

$.each(tooltipTexts, function(k, v) {
  console.log(k)
  $(k).tooltipster({
    content: v,
    animation: 'fade',
    delay: 0,
    speed: 120,
  });
})