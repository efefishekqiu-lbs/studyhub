let accountInfo = {
  username: APP_DATA.user.username,
  email: APP_DATA.user.email,
  assignments: JSON.parse(APP_DATA.user.assignments),
  calendar: JSON.parse(APP_DATA.user.calendar),
  classes: JSON.parse(APP_DATA.user.classes),
}
let defaultClasses = APP_DATA.defaultClasses;
defaultClasses = Object.entries(defaultClasses)
  .sort((a, b) => a[1].label.localeCompare(b[1].label))
  .reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});


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
async function openSwal(info, klassKod) {
  const dateStr = info.date.toISOString().split("T")[0];

  try {
    const result = await Swal.fire({
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
    });

    if (!result.isConfirmed) return;

    const { title, startTime, endTime } = result.value;
    if (!title || !startTime || !endTime) return;

    const res = await fetch("/website/addKalender", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, startTime, endTime, dateStr })
    });

    const data = await res.json();
    if (!data.success) {
      swalError("Kalender", data.message);
      return;
    }
  
    accountInfo.calendar[data.newData.id] = data.newData
    reloadCalender()

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Kalender",
      text: "A unknown error happend",
      confirmButtonText: "OK"
    });
  }
}

$(document).on("click", ".sumarize-bot-minimize", function () {
  const $btn = $(this)
  const $bot = $btn.parent()
  const isOpen = $bot.hasClass("open")

  if (isOpen == false) {
    $bot.addClass("open")

    $bot.css({
      height: "10vh",
      bottom: "2%",
      width: "80%",
      left: "10%",
      "border-radius": "30px",
      display: "flex",
      "align-items": "center"
    })

    $(".sumarize-bot-loading, .sumarizebot-postAnswer, .sumarize-bot-sumarizedText")
      .css({ opacity: "0%" })

    $(".sumarize-bot-sumarizedText-notify").css({ opacity: "1" })
    $(".sumarize-bot-sumarizedText-notify").css({ "display": "block"})

    $btn.css({
      transform: "rotate(180deg)",
      width: "40px",
      height: "40px",
      right: "5vw"
    })


  } else {
    $bot.removeClass("open")
    $bot.css({
      height: "100%",
      bottom: "0",
      width: "100%",
      left: "0",
      "border-radius": "6px",
    })

    $(".sumarize-bot-loading, .sumarizebot-postAnswer, .sumarize-bot-sumarizedText")
      .css({ opacity: "100%" })

    $(".sumarize-bot-sumarizedText-notify").css({ opacity: "0" })

    if ($(".sumarize-bot-sumarizedText").html() === "") {
      $(".sumarize-bot-sumarizedText-notify").text("Analyserar")
    }
    $(".sumarize-bot-sumarizedText-notify").css({ "display": "none"})

    $btn.css({
      transform: "rotate(0deg)",
      right:  "5vw"
    })

  }
})

function reloadBetyg() {
  const results = {};
  Object.entries(accountInfo.classes).forEach(([classCode, isInClass]) => {
    if (!isInClass) return; 

    const classData = defaultClasses[classCode];
    if (!classData || !classData.assignments) return;
    const totalAssignments = Object.keys(classData.assignments).length;
    let submittedCount = 0;

    Object.entries(accountInfo.assignments).forEach(([fileName, submittedClassCode]) => {
      if (submittedClassCode === classCode) {
        submittedCount++;
      }
    });

    const percent =
      totalAssignments === 0
        ? 0
        : Math.round((submittedCount / totalAssignments) * 100);

    results[classCode] = {
      label: classData.label,
      totalAssignments,
      submittedCount,
      percent
    };
  });

  $(".header-betyger").html("")
  $.each(results, function(k, v) {
    let style = "";

    if (v.percent <= 50) {
      style = `
        <div class="header-betyger-betyg-box betyg-rod">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M400 145.49 366.51 112 256 222.51 145.49 112 112 145.49 222.51 256 112 366.51 145.49 400 256 289.49 366.51 400 400 366.51 289.49 256 400 145.49z"></path>
          </svg>
        </div>
      `;
    } else if (v.percent <= 75) {
      style = `
        <div class="header-betyger-betyg-box betyg-gul">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M376.2 224H268l52.4-186.9c.9-4.5-4.6-7.1-7.2-3.4L129.5 274.6c-3.8 5.6-.2 13.4 6.3 13.4H244l-52.4 186.9c-.9 4.5 4.6 7.1 7.2 3.4l183.7-240.8c3.7-5.7.2-13.5-6.3-13.5z"></path>
          </svg>
        </div>
      `;
    } else {
      style = `
        <div class="header-betyger-betyg-box">
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
          </svg>
        </div>
      `;
    }

    
    $(".header-betyger").append(`
      <div class="header-betyger-betyg">
        <h1>${v.label}</h1>
        <h2>${defaultClasses[k].teacher}</h2>
        ${style}
      </div>
    `)
  })

  return results;
}


function reloadCalender() {
  if (!calendar) return;

  calendar.removeAllEvents();

  Object.values(accountInfo.calendar).forEach(ev => {
    let start = ev.startTime ? `${ev.dateStr}T${ev.startTime}` : ev.dateStr;
    let end = ev.endTime ? `${ev.dateStr}T${ev.endTime}` : ev.dateStr;
    calendar.addEvent({
      title: ev.title,
      start,
      end,
      allDay: false
    });
  });

  setTimeout(() => {
    reloadCalenderTipsters();
  }, 100);
}

function reloadCalenderTipsters() {
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
}

$(document).on("click", ".header-profile-exit", function () {
   setTimeout(() => {
    isHeaderOpened = false;
    setHeaderMode(isHeaderOpened);
   }, 10);
})

$(document).on("click", ".add-lektion", async function () {
  const { value: klassKod } = await Swal.fire({
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
  if (klassKod) {
    
    try {
      const res = await fetch("/website/addClass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          klassKod,
        })
      })
      const data = await res.json()
      if (!data.success) {
        swalError("Klass", data.message)
        return
      }
      accountInfo.classes[klassKod] = true;
      reloadClassesData()
      setTimeout(() => {
        reloadBetyg()
      }, 200);
    } catch (err) {
      console.error(err)
      Swal.fire({
        icon: "error",
        title: "Kl",
        text: "A unknown error happend",
        confirmButtonText: "OK"
      });
    }

  }
})

function swalError(title, text) {
  Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonText: "OK"
  });
}

$(document).on("click", ".klasser-remove", async function (event) {
  event.stopPropagation(); 
  let klassKod = $(this).parent().attr("data-id");

  Swal.fire({
    title: "Är du säker?",
    text: "Detta går inte att ångra!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Ja, ta bort det!",
    theme: "dark",
  }).then(async (result) => { 
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Borttagen!",
          text: "Din klass har tagits bort.",
          icon: "success"
        });

        const res = await fetch("/website/removeClass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ klassKod })
        });

        const data = await res.json();

        if (!data.success) {
          swalError("Klass", data.message);
          return;
        }

        $(`.klasser-wrapper[data-id="${klassKod}"]`).remove();
        $(`.lektioner[data-id="${klassKod}"]`).remove();

        accountInfo.classes[klassKod] = false;

        reloadClassesData();
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Klass",
          text: "A unknown error happend",
          confirmButtonText: "OK"
        });
      }
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
  if (status == true) {
    $(".header-logout").show(100)
  } else {
    $(".header-logout").hide()
  }
  if (isMobile===false) {
    if (status == true) {
      $(".header-profile-secondProfile").css({
         "position": "absolute",
         "top": "-20vh",
         "right": "-20vw",
      })
      if (window.innerWidth < 1040 && window.innerWidth > 560) {
        $(".header-profile").css({
          "position": "absolute",
          "transform": "none",
          "width": "60vw",
          "height": "90vh",
          "border-radius": "25px",
          "border-top-right-radius": "4px",
          "border-color": "#6a6969",
        })
      } else {
        $(".header-profile").css({
          "position": "absolute",
          "transform": "none",
          "width": "30vw",
          "height": "90vh",
          "border-radius": "25px",
          "border-top-right-radius": "4px",
          "border-color": "#6a6969",
        })
      }
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
  reloadBetyg()
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

  if (target.length) {
      e.preventDefault();
      const headerOffset = 80; 
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
    if (isNavbarActive == false) {
      if (isMobile) {
        isNavbarActive = true;
        $(".burger-menu").css("transform", "rotate(0deg)");
        $("nav").hide();
        $(".lektioner>h1").show()
      }
    } 
  }
  if (id == "kalender") {
    if (isMobile) {
      $("nav").hide()
      isNavbarActive = false
      $("main").hide(100)
      $(".kalender-main").show(200)
      calendar.render();
      setTimeout(() => {
        reloadCalender()
      }, 200);
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

        $("main").hide(100);
        $(".kalender-main").show(200);
        calendar.render();
        setTimeout(() => {
          reloadCalender()
        }, 200);
        $("canvas").hide();
      
      
    }
  }
  $(".lektioner").removeClass("lektioner-selected")
  $(`.lektioner[data-id="${id}"]`).addClass("lektioner-selected")
}

function reloadClassesData() {
  $(`.lektioner[data-type="clickable"]`).remove();
  $(".klasser-wrapper").remove();

  $.each(defaultClasses, function(k, v) {
    if (accountInfo.classes[k] == true) {
      $("nav").append(`
        <div class="lektioner" data-type="clickable" data-id="${k}" style="margin-top: 6px;">
          <div class="logo-letkioner">${v.label.charAt(0).toUpperCase()}</div>
          <h1>${v.label}</h1>
        </div>
      `);

      $("main").append(`
        <div class="klasser-wrapper" data-id="${k}">
          <svg class="klasser-arrow" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15.0006L7.75732 10.758L9.17154 9.34375L12 12.1722L14.8284 9.34375L16.2426 10.758L12 15.0006Z"></path>
          </svg>
          <svg stroke="currentColor" class="klasser-remove" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path fill="none" d="M296 64h-80a7.91 7.91 0 0 0-8 8v24h96V72a7.91 7.91 0 0 0-8-8z"></path>
            <path d="M432 96h-96V72a40 40 0 0 0-40-40h-80a40 40 0 0 0-40 40v24H80a16 16 0 0 0 0 32h17l19 304.92c1.42 26.85 22 47.08 48 47.08h184c26.13 0 46.3-19.78 48-47l19-305h17a16 16 0 0 0 0-32zM192.57 416H192a16 16 0 0 1-16-15.43l-8-224a16 16 0 1 1 32-1.14l8 224A16 16 0 0 1 192.57 416zM272 400a16 16 0 0 1-32 0V176a16 16 0 0 1 32 0zm32-304h-96V72a7.91 7.91 0 0 1 8-8h80a7.91 7.91 0 0 1 8 8zm32 304.57A16 16 0 0 1 320 416h-.58A16 16 0 0 1 304 399.43l8-224a16 16 0 1 1 32 1.14z"></path>
          </svg>
          <section>
            <h1>${v.label}</h1>
            <h2>${v.teacher}</h2>
            <div class="klasser-wrapper-element-footer"></div>
          </section>
          <div class="klasser-wrapper-footerInfo">
            <h3>Uppgifter:</h3>
            <div class="klasser-wrapper-alla-uppgifter"></div>
          </div>
        </div>
      `);

      $.each(v.assignments, function(kk, vv) {
        let buttonClass = ""
        if (accountInfo.assignments[vv.file]) {
          buttonClass = `uppgifterDone` 
        }
        
        $(`.klasser-wrapper[data-id="${k}"]`).find(".klasser-wrapper-alla-uppgifter").append(`
          <div class="klasser-wrapper-info-uppgift" data-id="${kk}">
            <h4 class="klasser-wrapper-info-uppgift-namn">${vv.label}</h4>
            <div>
              <a href="${vv.href}" target="_blank">
                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 384 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path d="M181.9 256.1c-5-16-4.9-46.9-2-46.9 8.4 0 7.6 36.9 2 46.9zm-1.7 47.2c-7.7 20.2-17.3 43.3-28.4 62.7 18.3-7 39-17.2 62.9-21.9-12.7-9.6-24.9-23.4-34.5-40.8zM86.1 428.1c0 .8 13.2-5.4 34.9-40.2-6.7 6.3-29.1 24.5-34.9 40.2zM248 160h136v328c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V24C0 10.7 10.7 0 24 0h200v136c0 13.2 10.8 24 24 24zm-8 171.8c-20-12.2-33.3-29-42.7-53.8 4.5-18.5 11.6-46.6 6.2-64.2-4.7-29.4-42.4-26.5-47.8-6.8-5 18.3-.4 44.1 8.1 77-11.6 27.6-28.7 64.6-40.8 85.8-.1 0-.1.1-.2.1-27.1 13.9-73.6 44.5-54.5 68 5.6 6.9 16 10 21.5 10 17.9 0 35.7-18 61.1-61.8 25.8-8.5 54.1-19.1 79-23.2 21.7 11.8 47.1 19.5 64 19.5 29.2 0 31.2-32 19.7-43.4-13.9-13.6-54.3-9.7-73.6-7.2zM377 105L279 7c-4.5-4.5-10.6-7-17-7h-6v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zm-74.1 255.3c4.1-2.7-2.5-11.9-42.8-9 37.1 15.8 42.8 9 42.8 9z"></path>
                </svg>
              </a>
              <input class="uppgifter ${buttonClass}" type="button" data-lektion="${k}" data-file="${vv.file}" data-type="analyze" value="Analysera">
              <input class="uppgifter ${buttonClass}" type="button" data-lektion="${k}" data-file="${vv.file}" data-type="submit" value="Lämna in">
            </div>
          </div>
        `);
      });
    }
  });
}


if (window.innerWidth < 1040 && window.innerWidth > 560) {
  $("nav").css({ "width": "30%", "z-index": "99999999" });
  $(".burger-menu").css({ width: "30px" });
  $(".logo").css({ left: "40px" })
  $("nav").hide()
  $(".add-lektion").css({left: "87%"})
  $(".tema").css({left: "50%"})
  $(".header-profile").css({ width: "40px", height: "40px", "margin-left": "100px"})
  $(".kalender-main").css({ left: "0px", width: "100%"})
  $("main").css({
    width: "100%",
    left: 0
  })
  $(".lektioner").css({
    top: "210px",
 })
}

$(document).ready(function() {
  selectNavbarButton("startsida")
  reloadClassesData()

  $(".header-email").html(accountInfo.email)
  $(".header-profile-secondProfile, .header-profile-exist-letter").html(accountInfo.username.charAt(0).toUpperCase())
  $(".header-velkommen").html(`Välkommen <white>${accountInfo.username}</white>!`)
})


$(document).on("click", ".burger-menu", function () {
  if (isMobile || window.innerWidth < 1060) {
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
     <h1 onclick="selectNavbarButton("startsida")" style="padding: 25px">Navigering</h1>
      <div class="lektioner" data-id="startsida" data-type="selectable" style="margin-top: 10px;">
        <div class="lektioner" data-id="kalender" data-type="selectable">
        <div> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12zm436-44v-36c0-26.5-21.5-48-48-48h-48V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H160V12c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12v52H48C21.5 64 0 85.5 0 112v36c0 6.6 5.4 12 12 12h424c6.6 0 12-5.4 12-12z"></path></svg> </div>
          <h1>Kalender</h1>
        </div>
        
        <div> <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 576 512" xmlns="http://www.w3.org/2000/svg"><path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path></svg> </div>
        <h1>Startsida</h1>
      </div>
    `
   
      $(".lektioner>h1").show()
      $(".lektioner>div").show()
      if (window.innerWidth < 1060 && window.innerWidth > 560) {
        $("nav").css({ width: "30%" }); 
      }
   } else {
      isNavbarActive = true;
      $(this).css("transform", "rotate(0deg)");
      $("nav").hide();
      $(".lektioner>h1").show()
   }
  } else {
    if (isNavbarActive) {
      if (window.innerWidth < 1060 && window.innerWidth > 560) {
        $(".burger-menu").css({ width: "30px" });
        $(this).css("transform", "rotate(90deg)");
        $("nav").css({
           width: "6.5%",
        })
        $("main").css({
           position: "absolute",
           left: "3%",
           width: "97.2%"
        })
        $(".lektioner>h1").hide()
        isNavbarActive = false;
      } else {
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
      }
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
      if (window.innerWidth < 1040 && window.innerWidth > 560) {
        $(".chatbot-wrapper").css({
          "position": "absolute",
          "transform": "none",
          "width": "60vw",
          "height": "65vh",
          "border-radius": "25px",
          "border-bottom-right-radius": "4px",
          "border-color": "#6a6969",
        })
      } else {
        $(".chatbot-wrapper").css({
          "position": "absolute",
          "transform": "none",
          "width": "30vw",
          "height": "65vh",
          "border-radius": "25px",
          "border-bottom-right-radius": "4px",
          "border-color": "#6a6969",
        })
      }
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

let typeInterval = null;
function stopTypingEffect() {
  if (typeInterval) {
    clearInterval(typeInterval);
    typeInterval = null;
    setTimeout(() => {
      $('.sumarize-bot-sumarizedText').html('')
    }, 100);
  }
}

function typeText(element, text, type, speed = 40) {
  return new Promise(resolve => {
    isTypingEffectActive = true
    let index = 0
    $(element).html("")

    typeInterval = setInterval(() => {
      $(element).html($(element).html() + text.charAt(index))
      index++

      if (index >= text.length) {
        clearInterval(typeInterval)
        typeInterval = null
        isTypingEffectActive = false
        resolve()
      }
    }, speed)
  })
}

$(document).on("click", ".chatbot-wrapper-questionsWrapper-question", function () {
  if (isTypingEffectActive == true) { return }
  const id = $(this).attr("data-id");
  const answer = fillAnswer(id);
  typeText(".chatbot-answer", answer, 'chatbot', 40);
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

$(document).on("click", ".sumarize-bot-close", function (event) {
  event.stopPropagation();
  $('.sumarize-bot').hide(200)
  $(".sumarize-bot-sumarizedText").html("")
  stopTypingEffect()
})

$(document).on("click", ".klasser-wrapper-info-uppgift div input", function (event) {
  event.stopPropagation(); 
  let type = $(this).attr("data-type");
  if (type == "analyze") {
    sumarizeFile($(this).attr("data-file"))
  }
  if (type == "submit") {
    submitFile($(this).attr("data-file"), $(this).attr("data-lektion"))
  }
})

async function submitFile(fileName, lektion) {
  const res = await fetch("/website/submitFile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fileName: fileName, lektion: lektion })
  });
  let response = await res.json()
  if (response.success == true) {
    $(`.uppgifter[data-file="${fileName}"]`).addClass("uppgifterDone")
    accountInfo.assignments[fileName] = lektion;
    setTimeout(() => {
      reloadBetyg()
    }, 100);
  }
}

async function sumarizeFile(fileName) {
  $('.sumarizebot-postAnswer').hide()
  $('.sumarize-bot').show(200)
  $('.sumarize-bot-loading').show()

  $(".sumarize-bot-sumarizedText-notify").html("Analyserar").show()

  const res = await fetch("/website/readFile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName })
  })

  const content = await res.text()

  const response = await puter.ai.chat(
    "Du ska analysera och sammanfatta följande dokument. Börja direkt med innehållet, utan någon introduktion eller förklaring\n\n" + content,
    { model: "gpt-5-nano" }
  )

  $('.sumarize-bot-loading').hide()

  $('.sumarizebot-postAnswer').show(100)
  await typeText(
    ".sumarize-bot-sumarizedText",
    response.message.content,
    'sumarizebot',
    5
  )

  $(".sumarize-bot-sumarizedText-notify").html("Klart!")
  $(".sumarize-bot-sumarizedText-notify").css({
    "animation-name": "none"
  })
}