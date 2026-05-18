(function () {
  "use strict";

  var API_URL = "https://api.web3forms.com/submit";

  function getAccessKey() {
    return window.AMANTRA_WEB3FORMS_KEY || "";
  }

  function showMessage(selector, html, isError) {
    var err = document.querySelector(".print-error-msg");
    var ok = document.querySelector(".print-success-msg");
    if (selector === ".print-error-msg" || isError) {
      if (ok) ok.style.display = "none";
      if (err) {
        err.innerHTML = html;
        err.style.display = "block";
      }
    } else {
      if (err) err.style.display = "none";
      if (ok) {
        ok.innerHTML = html;
        ok.style.display = "block";
      }
    }
  }

  function submitWeb3Forms(payload) {
    var key = getAccessKey();
    if (!key || key === "YOUR_ACCESS_KEY_HERE") {
      return Promise.reject(
        new Error(
          "Web3Forms is not configured. Add your access key in js/config.js.",
        ),
      );
    }
    payload.access_key = key;
    return fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).then(function (res) {
      return res.json().then(function (data) {
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Submission failed. Please try again.");
        }
        return data;
      });
    });
  }

  function initNewsletter() {
    var btn = document.getElementById("GetSubscriptionForm");
    var input = document.getElementById("subscriptionemail");
    var form = document.getElementById("subsciption_form");
    if (!btn || !input) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var email = (input.value || "").trim();
      if (!email) {
        showMessage(".print-error-msg", "Please enter your email address.", true);
        return;
      }

      btn.disabled = true;
      submitWeb3Forms({
        email: email,
        subject: "Newsletter Subscription — Amantra Website",
        from_name: "Amantra Website",
        botcheck: "",
      })
        .then(function () {
          showMessage(
            ".print-success-msg",
            "Thank you for subscribing! We will be in touch soon.",
            false,
          );
          if (form) form.reset();
        })
        .catch(function (err) {
          showMessage(".print-error-msg", err.message, true);
        })
        .finally(function () {
          btn.disabled = false;
        });
    });
  }

  function initSampleKit() {
    var form = document.querySelector(".orderursamplekit");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = {
        order_person_name: "name",
        order_person_email: "email",
        order_person_mobile: "phone",
        order_subject: "subject",
        order_message: "message",
      };

      var payload = {
        subject: "Sample Kit Request — Amantra Website",
        from_name: "Amantra Website",
        botcheck: "",
      };

      Object.keys(fields).forEach(function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        if (el && el.value) {
          payload[fields[name]] = el.value.trim();
        }
      });

      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      document.querySelectorAll(".error-txt").forEach(function (el) {
        el.style.display = "none";
        el.textContent = "";
      });

      submitWeb3Forms(payload)
        .then(function () {
          var success = document.querySelector(".order-success");
          if (success) {
            success.style.display = "block";
            success.textContent =
              "Thank you! Your sample kit request has been received.";
          }
          form.reset();
          if (window.jQuery && jQuery.fancybox) {
            setTimeout(function () {
              jQuery.fancybox.close();
            }, 2500);
          }
        })
        .catch(function (err) {
          var success = document.querySelector(".order-success");
          if (success) {
            success.style.display = "block";
            success.classList.remove("alert-success");
            success.classList.add("alert-danger");
            success.textContent = err.message;
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initNewsletter();
      initSampleKit();
    });
  } else {
    initNewsletter();
    initSampleKit();
  }
})();
