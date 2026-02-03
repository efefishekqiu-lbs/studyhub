const root = document.documentElement;
const btn = document.querySelector(".tema");
console.log(btn)

// root.dataset.theme = localStorage.theme || "dark";

btn.addEventListener("click", () => {
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

function setModeType(type) {
   document.documentElement.setAttribute("data-theme", type);
   document.body.dataset.theme = type;
}

const tooltipTexts = {
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