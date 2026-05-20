(function () {
  "use strict";

  var translateLoaded = false;

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function initMotionPreferences() {
    if (prefersReducedMotion()) {
      document.documentElement.classList.add("reduce-motion");
    }
    window
      .matchMedia("(prefers-reduced-motion: reduce)")
      .addEventListener("change", function (e) {
        document.documentElement.classList.toggle("reduce-motion", e.matches);
        initHeroVideo();
      });
  }

  function initHeroVideo() {
    var video = document.querySelector(".hero-video");
    if (!video) return;

    var hideVideo =
      prefersReducedMotion() ||
      window.matchMedia("(max-width: 767px)").matches ||
      (navigator.connection &&
        navigator.connection.saveData === true);

    if (hideVideo) {
      video.pause();
      video.removeAttribute("autoplay");
      document.documentElement.classList.add("hero-video-off");
    } else {
      document.documentElement.classList.remove("hero-video-off");
    }
  }

  function googleTranslateElementInit() {
    if (
      typeof google !== "object" ||
      !google.translate ||
      !google.translate.TranslateElement
    ) {
      setTimeout(googleTranslateElementInit, 500);
      return;
    }

    new google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,hi,fr,de,es,ta,te,bn,ml",
        autoDisplay: false,
      },
      "google_translate_element",
    );

    if (typeof jQuery !== "undefined") {
      var $googleDiv = jQuery("#google_translate_element .skiptranslate");
      var $googleDivChild = jQuery(
        "#google_translate_element .skiptranslate div",
      );
      $googleDivChild.next().remove();
      $googleDiv
        .contents()
        .filter(function () {
          return this.nodeType === 3 && jQuery.trim(this.nodeValue) !== "";
        })
        .remove();
    }
  }

  window.googleTranslateElementInit = googleTranslateElementInit;

  function loadGoogleTranslateScript() {
    if (translateLoaded) return;
    translateLoaded = true;

    if (typeof google === "object" && typeof google.translate === "object") {
      googleTranslateElementInit();
      return;
    }

    var script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }

  function initDeferredTranslate() {
    var trigger = document.querySelector(".language-btn");
    if (!trigger) return;

    trigger.addEventListener(
      "click",
      function () {
        loadGoogleTranslateScript();
      },
      { once: false },
    );

    trigger.addEventListener(
      "focusin",
      function () {
        loadGoogleTranslateScript();
      },
      { once: true },
    );
  }

  function init() {
    initMotionPreferences();
    initHeroVideo();
    initDeferredTranslate();

    window.addEventListener("resize", function () {
      initHeroVideo();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
