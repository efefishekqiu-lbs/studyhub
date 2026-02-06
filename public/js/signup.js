let loginType = "login";
$(document).on("click", ".createButton", function () {
  if (loginType == "login") {
    setLoginType("register")
  } else {
    setLoginType("login")
  }
})

function setLoginType(type) {
  loginType = type;
  if (type == "login") {
    $(".signup-wrapper-inputWrapper[data-type='repeatPassword']").hide();
    $(".signup-wrapper>h2").html("Login")
    $("button").html("Login")
    $(".signup-wrapper>span").html(`Dont have a account? <span class="createButton opacityLow">Create</span>`)
    if (window.innerWidth > 800) {

      $("#info").css({
        left: '65%'
      })
      $(".signup-wrapper").css({
        left: '17%'
      })
      $("#info-heading").html("Log In")
    }

  } else {
    $(".signup-wrapper-inputWrapper[data-type='repeatPassword']").show();
    $(".signup-wrapper>h2").html("Register")
    $("button").html("Register")
    $(".signup-wrapper>span").html(`I have already a account? <span class="createButton opacityLow">Login</span>`)
    if (window.innerWidth > 1000) {
      $("#info").css({
        left: '0%'
      })
      $(".signup-wrapper").css({
        left: '51%'
      })
      $("#info-heading").html("Registrera")
    }
  }
}

const allowedDomain = "elev.ga.lbs.se";
$(document).on("click", "#signupBtn", async function(e) {
  e.preventDefault();
  submitSignup()
});

$(document).on("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();
    submitSignup()
  }
});

async function submitSignup() {
  const email = $(".signup-wrapper-inputWrapper[data-type='email'] input").val().trim();
  const password = $(".signup-wrapper-inputWrapper[data-type='password'] input").val();
  const repeatPassword = $(".signup-wrapper-inputWrapper[data-type='repeatPassword'] input").val();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    return swalError("E-post saknas", "Vänligen ange din e-postadress.");
  }

  if (!emailRegex.test(email)) {
    return swalError("Ogiltig e-post", "Ange en giltig e-postadress.");
  }

  const emailDomain = email.split("@")[1];
  if (emailDomain !== allowedDomain) {
    return swalError(
      "Fel e-postdomän",
      `E-postadressen måste sluta med @${allowedDomain}`
    );
  }


  if (!password) {
    return swalError("Lösenord saknas", "Vänligen ange ditt lösenord.");
  }

  if (password.length < 4) {
    return swalError(
      "För kort lösenord",
      "Lösenordet måste vara minst 4 tecken långt."
    );
  }

  if (loginType === "register") {
    if (!repeatPassword) {
      return swalError(
        "Bekräfta lösenord",
        "Vänligen upprepa ditt lösenord."
      );
    }

    if (password !== repeatPassword) {
      return swalError(
        "Lösenorden matchar inte",
        "Lösenorden måste vara identiska."
      );
    }
  }
  $("#signupBtn").css({
    "pointer-events": "none",
    "opacity": "60%",
  })

  try {
    const res = await fetch("/website/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password,
        loginType,
      })
    })
    const data = await res.json()
    if (!data.success) {
      swalError("Signup", data.message)
      $("#signupBtn").css({
        "pointer-events": "auto",
        "opacity": "100%",
      })
      return
    }
    if (data.redirect) {
      Swal.fire({
        icon: "success",
        title: loginType === "login" ? "Inloggning lyckades" : "Registrering lyckades",
        text: "Allt ser bra ut!",
        confirmButtonText: "OK"
      });
      $("#signupBtn").css({
        "pointer-events": "auto",
        "opacity": "100%",
      })
      setTimeout(() => {
        window.location.href = data.redirect
      }, 500);
    }
  } catch (err) {
    console.error(err)
    $("#signupBtn").css({
      "pointer-events": "auto",
      "opacity": "100%",
    })
    Swal.fire({
      icon: "error",
      title: "Signup",
      text: "A unknown error happend",
      confirmButtonText: "OK"
    });

  }
}


function swalError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonText: "OK"
  });
  $("#signupBtn").css({
    "pointer-events": "auto",
    "opacity": "100%",
  })
}

setTimeout(() => {
  setLoginType("login")
}, 10);

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


function setModeType(type) {
  document.documentElement.setAttribute("data-theme", type);
  document.body.dataset.theme = type;
  console.log("hasdasjd")

}

setModeType(localStorage.getItem("theme"))

$(document).ready(function() {
  if (localStorage.getItem("theme")) {
    setModeType(localStorage.getItem("theme")) 
    if (localStorage.getItem("theme") === "lightmode") {
      $("canvas").css({
        "display": "none"
      }) 
    }
  }
})
