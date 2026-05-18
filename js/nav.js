(function () {
  "use strict";

  var headerOffset = 88;

  function scrollToHash(hash) {
    if (!hash || hash === "#") return;
    var target = document.querySelector(hash);
    if (!target) return;
    var top =
      target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    var href = link.getAttribute("href");
    if (!href || href === "#") return;
    link.addEventListener("click", function (e) {
      var id = href.slice(1);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      if (window.innerWidth < 1200) {
        var nav = document.querySelector(".main-navigation");
        var trigger = document.getElementById("menu_trigger");
        if (nav && nav.classList.contains("open")) {
          nav.classList.remove("open");
          if (trigger) trigger.classList.remove("active");
        }
      }
      history.pushState(null, "", href);
      scrollToHash(href);
    });
  });
})();
