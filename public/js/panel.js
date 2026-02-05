let accountInfo = {
  username: APP_DATA.user.username,
  email: APP_DATA.user.email,
  assignments: JSON.parse(APP_DATA.user.assignments),
  calendar: JSON.parse(APP_DATA.user.calendar),
  classes: JSON.parse(APP_DATA.user.classes),
}

let w, h, isMobile;
let isTypingEffectActive = false;

let isHeaderOpened = false;
$(document).on("click", ".header-profile", function () {
   if (isHeaderOpened == false) {
      isHeaderOpened = true;
      setHeaderMode(isHeaderOpened); 
   }
});
let calendar = null;

document.addEventListener("DOMContentLoaded", function () {
  const calendarEl = document.querySelector(".kalender-main");
  calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "timeGridWeek",
    initialDate: new Date(),
    nowIndicator: true,
    selectable: true,

    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "timeGridWeek,dayGridMonth"
    },
    dateClick: function(info) {
      openSwal(info);
    }
  });
});

function openSwal(info) {
  const dateStr = info.date.toISOString().split("T")[0];

  Swal.fire({
    title: "Ny händelse",
    customClass: {
      popup: "custom-swal"
    },
    html: `
      <div class="swal-row">
        <label>Rubrik</label>
        <input id="swal-title" type="text">
      </div>

      <div class="swal-row">
        <label>Start tid</label>
        <input id="swal-start" type="time" value="09:00">
      </div>

      <div class="swal-row">
        <label>Slut tid</label>
        <input id="swal-end" type="time" value="10:00">
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Lägg till",
    cancelButtonText: "Avbryt",
    focusConfirm: false,
    preConfirm: () => {
      return {
        title: document.getElementById("swal-title").value,
        startTime: document.getElementById("swal-start").value,
        endTime: document.getElementById("swal-end").value
      };
    }
  }).then((result) => {
    if (!result.isConfirmed) return;

    const { title, startTime, endTime } = result.value;
    if (!title || !startTime || !endTime) return;

    calendar.addEvent({
      title,
      start: `${dateStr}T${startTime}`,
      end: `${dateStr}T${endTime}`,
      allDay: false
    });

    setTimeout(() => {
      $('.fc-event-main').each(function () {
        const titleText = $(this).find('.fc-event-title').text().trim();
        
        if ($(this).hasClass('tooltipstered')) return;
    
        $(this).tooltipster({
          content: titleText,
          animation: 'fade',
          delay: 0,
          speed: 120
        });
      });
    }, 0);
  });
}

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

$(document).on("click", ".klasser-wrapper-info-uppgift div input", function (event) {
  event.stopPropagation(); 
  $(this).remove()
})

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
      $(`.klasser-wrapper[data-id="${id}"]`).remove();
      $(`.lektioner[data-id="${id}"]`).remove();
    }
  });
});

$(document).on("click", ".klasser-wrapper", function () {
  let id = $(this).attr("data-id")
  handleKlassWrapper(id)
});

function handleKlassWrapper(id) {
  const clicked = $(`.klasser-wrapper[data-id="${id}"]`)
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
}

function setHeaderMode(status) {
  
  if (isMobile===false) {
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
         "border-top-right-radius": "4px",
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
         $(".header-email, .header-velkommen, .header-title, .header-betyger").show()
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
      $(".header-profile-exit, .header-profile-secondProfile, .header-email, .header-velkommen, .header-title, .header-betyger").hide()
   }
  } else {

    if (status == true) {
       $(".header-profile-secondProfile").css({
          "position": "absolute",
          "top": "-20vh",
          "right": "-20vw",
       })
       $(".header-profile").css({
          "position": "absolute",
          "transform": "none",
          "width": "90vw",
          "height": "90vh",
          "border-radius": "25px",
          "border-top-right-radius": "4px",
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
          $(".header-email, .header-velkommen, .header-title, .header-betyger").show()
          $(".header-profile-exit").css("display", "flex")
       }, 100);
    } else {
       $(".header-profile").css({
          "position": "absolute",
          "transform": "translate(0, -50%)",
          "width": "45px",
          "height": "45px",
          "border-radius": "50%",
          "border-color": "#303030",
       })
       $(".header-profile-exist-letter").show()
       $(".header-profile-exit, .header-profile-secondProfile, .header-email, .header-velkommen, .header-title, .header-betyger").hide()
    }
  }

}

const root = document.documentElement;
const btn = document.querySelector(".tema");
const changeSvg = document.querySelector("#tema")

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
   if (type == "darkmode") {
    $("canvas").show()
    changeSvg.innerHTML = `<svg stroke="currentColor" class="tema opacityLow" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M283.211 512c78.962 0 151.079-35.925 198.857-94.792 7.068-8.708-.639-21.43-11.562-19.35-124.203 23.654-238.262-71.576-238.262-196.954 0-72.222 38.662-138.635 101.498-174.394 9.686-5.512 7.25-20.197-3.756-22.23A258.156 258.156 0 0 0 283.211 0c-141.309 0-256 114.511-256 256 0 141.309 114.511 256 256 256z"></path></svg>`

  } else {
    $("canvas").hide()
    changeSvg.innerHTML = `<svg stroke="currentColor" class="tema opacityLow" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path></svg>`
   }
}

function smoothScrollTo(targetY, duration = 500) {
  const startY = window.pageYOffset;
  const distance = targetY - startY;
  let startTime = null;

  function animation(currentTime) {
      if (!startTime) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const ease = 0.5 * (1 - Math.cos(Math.PI * progress));
      window.scrollTo(0, startY + distance * ease);
      if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

$(document).on('click', '.lektioner', function(e) {
  const target = $(`.klasser-wrapper[data-id="${$(this).attr('data-id')}"]`)

  // const target = $($(this).attr('href'));
  if (target.length) {
      e.preventDefault();
      const headerOffset = 80; // header offset
      const targetY = target.offset().top - headerOffset;
      smoothScrollTo(targetY, 500);
  }
});


$(document).on("click", ".lektioner", function () {
  let type = $(this).attr("data-type")
  let id = $(this).attr("data-id");

  if (type == "selectable") {
    selectNavbarButton(id);
  }
  if (type == "clickable") {
    handleKlassWrapper(id)
  }
})

let isNavbarActive = true;
function selectNavbarButton(id) {
  if (id == "startsida") {
    $(".kalender-main").hide(100)
    $("main").show(200)
    $("canvas").show()
  }
  if (id == "kalender") {
    if (isMobile) {
      $("nav").hide()
      isNavbarActive = false
      $("main").hide(100)
      $(".kalender-main").show(200)
      calendar.render();
      $("canvas").hide()
      if (isNavbarActive) {
        isNavbarActive = false;
        $(".burger-menu").css("transform", "rotate(90deg)");
        $("nav").show();
        $("nav").css({
          width: "100%",
          height: "90vh",
          position: "absolute",
          display: "flex"
  
       })
       document.querySelector("nav").innerHTML = `
       <div class="lektioner" data-id="startsida" data-type="selectable" style="margin-top: 10px;">
       <div> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg> </div>
       <h1 onclick="window.location.href='/'">Startsida</h1>
     </div>
   
     <div class="lektioner" data-id="kalender" data-type="selectable">
     <div> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg> </div>
       <h1>Kalender</h1>
     </div>`
        $(".lektioner>h1").show()
        $(".lektioner>div").show()
     } else {
        isNavbarActive = true;
        $(".burger-menu").css("transform", "rotate(0deg)");
        $("nav").hide();
        $(".lektioner>h1").show()
     }
    } else {
      $("main").hide(100)
      $(".kalender-main").show(200)
      calendar.render();
      $("canvas").hide()
    }
  }
  $(".lektioner").removeClass("lektioner-selected")
  $(`.lektioner[data-id="${id}"]`).addClass("lektioner-selected")
}

setTimeout(() => {
  selectNavbarButton("startsida")
}, 10);
  

$(document).on("click", ".burger-menu", function () {
  if (isMobile) {
    if (isNavbarActive) {
      isNavbarActive = false;
      $(this).css("transform", "rotate(90deg)");
      $("nav").show();
      $("nav").css({
        width: "100%",
        height: "90vh",
        position: "absolute",
        display: "flex"

     })
     document.querySelector("nav").innerHTML = `
     <h1 style="padding: 25px">Navigering</h1>
     <div class="lektioner" data-id="startsida" data-type="selectable" style="margin-top: 10px;">
     <div> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg> </div>
     <h1 onclick="window.location.href='/'">Startsida</h1>
   </div>
 
   <div class="lektioner" data-id="kalender" data-type="selectable">
   <div> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg> </div>
     <h1>Kalender</h1>
   </div>`
      $(".lektioner>h1").show()
      $(".lektioner>div").show()
   } else {
      isNavbarActive = true;
      $(this).css("transform", "rotate(0deg)");
      $("nav").hide();
      $(".lektioner>h1").show()
   }
  } else {
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
  }
});

let isChatBotOpened = false;
$(document).on("mouseover", ".chatbot-wrapper", function () {
  if (isChatBotOpened == true) { return }
  $(".chatbot-wrapper-beforeHover").hide()
  $(".chatbot-wrapper-afterHover").show()
})
$(document).on("mouseleave", ".chatbot-wrapper", function () {
  if (isChatBotOpened == true) { return }
  $(".chatbot-wrapper-beforeHover").show()
  $(".chatbot-wrapper-afterHover").hide()
})

$(document).on("click", ".chatbot-wrapper-close", function () {
  if (isChatBotOpened == false) { return }
  $(".chatbot-wrapper-close").hide()
  $(".chatbot-wrapper-beforeHover").show()
  $(".chatbot-wrapper-afterHover").hide()
  $(".chatbot-wrapper").addClass("opacityLow")
  $(".chatbot-wrapper").css({
    "position": "absolute",
    "transform": "none",
    "width": "3.5vw",
    "height": "3.5vw",
    "border-radius": "50%",
    "border-color": "#303030",
  })
  $(".chatbot-answer").html("")
  $(".chatbot-wrapper-questionsWrapper, .chatbot-logo, .chatbot-dots, .chatbot-answer").hide()
  setTimeout(() => {
    isChatBotOpened = false;
  }, 50);
})

$(document).on("click", ".chatbot-wrapper", function () {
  if (isMobile) {
    if (isChatBotOpened == false) {
      isChatBotOpened = true;
      $(".chatbot-wrapper-close").show(200)
      $(".chatbot-wrapper-beforeHover").hide()
      $(".chatbot-wrapper-afterHover").hide()
      $(".chatbot-wrapper").removeClass("opacityLow")
      $(".chatbot-wrapper").css({
        "position": "absolute",
        "transform": "none",
        "width": "90vw",
        "height": "65vh",
        "border-radius": "25px",
        "border-bottom-right-radius": "4px",
        "border-color": "#6a6969",
      })
      $(".chatbot-wrapper-questionsWrapper, .chatbot-logo, .chatbot-dots, .chatbot-answer").show()
    }
  } else {
    if (isChatBotOpened == false) {
      isChatBotOpened = true;
      $(".chatbot-wrapper-close").show(200)
      $(".chatbot-wrapper-beforeHover").hide()
      $(".chatbot-wrapper-afterHover").hide()
      $(".chatbot-wrapper").removeClass("opacityLow")
      $(".chatbot-wrapper").css({
        "position": "absolute",
        "transform": "none",
        "width": "30vw",
        "height": "65vh",
        "border-radius": "25px",
        "border-bottom-right-radius": "4px",
        "border-color": "#6a6969",
      })
      $(".chatbot-wrapper-questionsWrapper, .chatbot-logo, .chatbot-dots, .chatbot-answer").show()
    }
  }
})

let answersForChatBot = {
  "activeAssigments": "Du har inga aktiva uppgifter just nu.",  
  "sommarlov": "Det är sommarlov nu!",                      
  "howold": "Jag är tidlös",                                
  "weather": "Vädret är soligt och varmt",                 
  "clock": ""                                                 
};

function fillAnswer(id) {
  if (id === "clock") {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      answersForChatBot.clock = `Klockan är ${hours}:${minutes}`;
  }
  return answersForChatBot[id] || "Jag vet inte svar på det.";
}

function typeText(element, text, speed = 40) {
    isTypingEffectActive = true
    let index = 0;
    $(element).html("");
    const interval = setInterval(() => {
        $(element).html($(element).html() + text.charAt(index));
        index++;
        if (index >= text.length) { 
          clearInterval(interval)
          isTypingEffectActive = false;
        }
    }, speed);
}

$(document).on("click", ".chatbot-wrapper-questionsWrapper-question", function () {
  if (isTypingEffectActive == true) { return }
  const id = $(this).attr("data-id");
  const answer = fillAnswer(id);
  typeText(".chatbot-answer", answer, 40);
});

const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

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
  $(k).tooltipster({
    content: v,
    animation: 'fade',
    delay: 0,
    speed: 120,
  });
})