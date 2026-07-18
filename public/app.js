/* Cybercon Solutions — site interactivity
 * Sticky header, smooth-scroll, scroll reveals, stat count-ups,
 * active-section nav, hero illustration entrance, contact form.
 *
 * Motion honors the brand spec: fade + small translate, 140/220/420ms,
 * no parallax, no scroll-jacking. Everything degrades gracefully and
 * fully respects prefers-reduced-motion.
 */
(function () {
  "use strict";

  var HEADER_OFFSET = 84;        // fixed header (72px) + a little breathing room
  var SCROLL_TRIGGER = 8;        // px before the header turns solid
  var FLOATING_CTA_THRESHOLD = 600;
  var STAGGER = 60;              // ms between staggered children (brand: 60ms)

  var REDUCED = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var HAS_IO = "IntersectionObserver" in window;

  /* ---------- Icons (Lucide CDN substitution) ---------- */
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  /* ---------- Sticky header ---------- */
  function initStickyHeader() {
    var header = document.getElementById("siteHeader");
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > SCROLL_TRIGGER);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Floating CTA ---------- */
  function initFloatingCta() {
    var cta = document.getElementById("floatingCta");
    if (!cta) return;
    var onScroll = function () {
      cta.classList.toggle("is-visible", window.scrollY > FLOATING_CTA_THRESHOLD);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Smooth in-page scrolling ---------- */
  function scrollToTarget(selector) {
    var target = document.querySelector(selector);
    if (!target) return;
    var top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
    window.scrollTo({
      top: Math.max(top, 0),
      behavior: REDUCED ? "auto" : "smooth"
    });
  }

  function initSmoothScroll() {
    document.addEventListener("click", function (e) {
      var trigger = e.target.closest("[data-scroll-to], a[href^='#']:not([href='#'])");
      if (!trigger) return;
      var selector = trigger.getAttribute("data-scroll-to") ||
        trigger.getAttribute("href");
      if (!selector || selector.charAt(0) !== "#") return;
      if (!document.querySelector(selector)) return;
      e.preventDefault();
      scrollToTarget(selector);
      // Move focus for keyboard/screen-reader users without re-scrolling.
      var dest = document.querySelector(selector);
      if (dest) {
        dest.setAttribute("tabindex", "-1");
        dest.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- Scroll reveals ----------
   * [data-reveal-group]  staggers its .reveal descendants on enter.
   * [data-reveal]        reveals itself on enter.
   * Children carry the .reveal class so no-JS / reduced-motion shows them.
   */
  function showAll() {
    var hidden = document.querySelectorAll(".reveal");
    for (var i = 0; i < hidden.length; i++) hidden[i].classList.add("is-visible");
    var marks = document.querySelectorAll("[data-reveal], [data-reveal-group]");
    for (var j = 0; j < marks.length; j++) marks[j].classList.add("is-visible");
  }

  function staggerGroup(group) {
    var kids = group.querySelectorAll(".reveal");
    for (var i = 0; i < kids.length; i++) {
      kids[i].style.transitionDelay = (i * STAGGER) + "ms";
      kids[i].classList.add("is-visible");
    }
  }

  function initReveals() {
    var nodes = document.querySelectorAll("[data-reveal-group], [data-reveal]");
    if (!nodes.length) return;

    if (REDUCED || !HAS_IO) { showAll(); return; }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        if (el.hasAttribute("data-reveal-group")) staggerGroup(el);
        else el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.15 });

    for (var i = 0; i < nodes.length; i++) io.observe(nodes[i]);
  }

  /* ---------- Stat count-ups ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var duration = 1100;
    var startTime = null;

    function frame(now) {
      if (startTime === null) startTime = now;
      var p = Math.min((now - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = (target * eased).toFixed(decimals);
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(frame);
  }

  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    if (REDUCED || !HAS_IO || !window.requestAnimationFrame) return; // keep final values

    for (var i = 0; i < nums.length; i++) nums[i].textContent = "0";

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.6 });

    for (var j = 0; j < nums.length; j++) io.observe(nums[j]);
  }

  /* ---------- Active-section nav highlight ---------- */
  function initActiveNav() {
    if (!HAS_IO) return;
    var links = {};
    var anchors = document.querySelectorAll(".site-header nav a[href^='#']");
    for (var i = 0; i < anchors.length; i++) {
      var id = anchors[i].getAttribute("href").slice(1);
      if (id) links[id] = anchors[i];
    }
    var sections = [];
    for (var key in links) {
      var node = document.getElementById(key);
      if (node) sections.push(node);
    }
    if (!sections.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        for (var k in links) links[k].classList.remove("is-active");
        var active = links[entry.target.id];
        if (active) active.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    for (var s = 0; s < sections.length; s++) io.observe(sections[s]);
  }

  /* ---------- Contact form ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(field, message) {
    var input = field.querySelector("input, textarea");
    var error = field.querySelector(".field-error");
    if (message) {
      field.classList.add("has-error");
      if (input) input.setAttribute("aria-invalid", "true");
      if (error) error.textContent = message;
    } else {
      field.classList.remove("has-error");
      if (input) input.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }
  }

  function validateField(field) {
    var input = field.querySelector("input, textarea");
    if (!input || !input.hasAttribute("required")) return true;
    var value = (input.value || "").trim();
    if (!value) { setError(field, "This field is required."); return false; }
    if (input.type === "email" && !EMAIL_RE.test(value)) {
      setError(field, "Enter a valid email address.");
      return false;
    }
    setError(field, "");
    return true;
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) return;
    var fieldsWrap = document.getElementById("formFields");
    var success = document.getElementById("formSuccess");
    var submitBtn = form.querySelector("button[type='submit']");
    var fields = form.querySelectorAll(".field");
    var honeypot = form.querySelector("[name='company_website']");
    var errorEl = document.getElementById("formError");

    // Posts to the form's action — Web3Forms (https://api.web3forms.com/submit).
    // The access key lives in the hidden "access_key" field in index.html.
    var FORM_ENDPOINT = form.getAttribute("action") || "/";

    // Validate on blur once the user has left a field.
    for (var i = 0; i < fields.length; i++) {
      (function (field) {
        var input = field.querySelector("input, textarea");
        if (!input) return;
        input.addEventListener("blur", function () { validateField(field); });
        input.addEventListener("input", function () {
          if (field.classList.contains("has-error")) validateField(field);
        });
      })(fields[i]);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Honeypot: silently succeed for bots, do nothing real.
      if (honeypot && honeypot.value) return;

      var valid = true;
      var firstInvalid = null;
      for (var j = 0; j < fields.length; j++) {
        var ok = validateField(fields[j]);
        if (!ok && !firstInvalid) firstInvalid = fields[j];
        valid = valid && ok;
      }
      if (!valid) {
        if (firstInvalid) {
          var input = firstInvalid.querySelector("input, textarea");
          if (input) input.focus();
        }
        return;
      }

      // Real submission — POST to FORM_ENDPOINT.
      if (errorEl) errorEl.hidden = true;
      if (submitBtn) {
        submitBtn.classList.add("is-loading");
        submitBtn.setAttribute("aria-busy", "true");
        submitBtn.disabled = true;
      }

      function showSuccess() {
        if (fieldsWrap) fieldsWrap.hidden = true;
        if (success) {
          success.hidden = false;
          success.setAttribute("tabindex", "-1");
          success.focus({ preventScroll: true });
        }
        initIcons(); // re-render icons revealed inside the success panel
      }
      function showError() {
        if (submitBtn) {
          submitBtn.classList.remove("is-loading");
          submitBtn.removeAttribute("aria-busy");
          submitBtn.disabled = false;
        }
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.setAttribute("tabindex", "-1");
          if (errorEl.focus) errorEl.focus();
        }
      }

      var fd = new FormData(form);
      fd.delete("company_website"); // never transmit the honeypot field
      var body = new URLSearchParams(fd).toString();
      if (window.fetch) {
        fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body
        }).then(function (res) {
          if (res.ok) showSuccess();
          else showError();
        }).catch(showError);
      } else {
        form.submit(); // very old browsers: native POST fallback
      }
    });
  }

  /* ---------- Pricing calculator ----------
   * Estimate model only. These rates are placeholders — adjust the RATES
   * object to match real Cybercon pricing. Calculator is capped at <50
   * workstations (mirrors the ExoSource pattern); larger networks -> contact.
   */
  function initPricing() {
    var root = document.getElementById("pricing");
    if (!root) return;

    var RATES = {
      base: 99,
      station: 45,
      user: 25,
      server: 175,
      m365: 12,
      av: 7,
      backupStation: 10,
      backupServer: 35,
      security: 15
    };

    var out = document.getElementById("pr-value");
    var breakdown = document.getElementById("prBreakdown");
    var displayed = 0;

    function animateTo(target) {
      if (REDUCED || !window.requestAnimationFrame) {
        if (out) out.textContent = target.toLocaleString("en-US");
        displayed = target;
        return;
      }
      var from = displayed, startTs = null, dur = 420;
      function step(ts) {
        if (startTs === null) startTs = ts;
        var p = Math.min((ts - startTs) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(from + (target - from) * eased);
        if (out) out.textContent = val.toLocaleString("en-US");
        if (p < 1) requestAnimationFrame(step);
        else { if (out) out.textContent = target.toLocaleString("en-US"); displayed = target; }
      }
      requestAnimationFrame(step);
    }

    function getNum(id) {
      var el = document.getElementById(id);
      if (!el) return 0;
      var min = parseInt(el.min, 10); if (isNaN(min)) min = 0;
      var max = parseInt(el.max, 10); if (isNaN(max)) max = Infinity;
      var v = parseInt(el.value, 10);
      if (isNaN(v)) v = min;
      return Math.max(min, Math.min(max, v));
    }

    function hasAddon(name) {
      var el = root.querySelector('[data-addon="' + name + '"]');
      return !!(el && el.checked);
    }

    function recalc() {
      var stations = getNum("in-stations");
      var users = getNum("in-users");
      var servers = getNum("in-servers");
      var core = RATES.base + stations * RATES.station + users * RATES.user + servers * RATES.server;
      var rows = [["Managed IT · " + stations + " stations", core]];
      var total = core;
      if (hasAddon("m365")) { var m = users * RATES.m365; rows.push(["Microsoft 365", m]); total += m; }
      if (hasAddon("av")) { var av = stations * RATES.av; rows.push(["Managed antivirus", av]); total += av; }
      if (hasAddon("backup")) { var bk = stations * RATES.backupStation + servers * RATES.backupServer; rows.push(["Cloud backups", bk]); total += bk; }
      if (hasAddon("security")) { var sc = users * RATES.security; rows.push(["Advanced security", sc]); total += sc; }
      if (breakdown) {
        var out2 = "";
        for (var i = 0; i < rows.length; i++) {
          out2 += "<li><span>" + rows[i][0] + "</span><span>$" + rows[i][1].toLocaleString("en-US") + "</span></li>";
        }
        breakdown.innerHTML = out2;
      }
      animateTo(total);
    }

    root.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-step]");
      if (!btn) return;
      var el = document.getElementById("in-" + btn.getAttribute("data-step"));
      if (!el) return;
      var dir = parseInt(btn.getAttribute("data-dir"), 10) || 0;
      var min = parseInt(el.min, 10); if (isNaN(min)) min = 0;
      var max = parseInt(el.max, 10); if (isNaN(max)) max = Infinity;
      var v = parseInt(el.value, 10); if (isNaN(v)) v = min;
      el.value = Math.max(min, Math.min(max, v + dir));
      recalc();
    });

    root.addEventListener("input", function (e) {
      if (e.target.matches('input[type="number"]')) recalc();
    });
    root.addEventListener("change", function (e) {
      if (e.target.matches('input[type="checkbox"]')) recalc();
    });
    root.addEventListener("blur", function (e) {
      if (!e.target.matches('input[type="number"]')) return;
      var el = e.target;
      var min = parseInt(el.min, 10); if (isNaN(min)) min = 0;
      var max = parseInt(el.max, 10); if (isNaN(max)) max = Infinity;
      var v = parseInt(el.value, 10); if (isNaN(v)) v = min;
      el.value = Math.max(min, Math.min(max, v));
      recalc();
    }, true);

    recalc();
  }

  /* ---------- Boot ---------- */
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    initIcons();
    initStickyHeader();
    initFloatingCta();
    initSmoothScroll();
    initReveals();
    initCounters();
    initActiveNav();
    initPricing();
    initContactForm();
  });
})();
