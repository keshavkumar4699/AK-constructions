(function () {
  'use strict';

  var WA_BASE = 'https://wa.me/918770418045';

  function formatINR(num) {
    return '\u20B9' + Math.round(num).toLocaleString('en-IN');
  }

  /* ===== Mobile nav toggle ===== */
  var navToggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobileNav');
  if (navToggle && mobileNav) {
    navToggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.textContent = open ? '\u00D7' : '\u2630';
    });
  }

  /* ===== FAQ accordion ===== */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) {
        i.classList.remove('open');
        var ans = i.querySelector('.faq-a');
        if (ans) ans.style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ===== Project tabs ===== */
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = btn.getAttribute('data-tab');
      document.querySelectorAll('.tab-btn').forEach(function (b) { b.classList.remove('active'); });
      document.querySelectorAll('.tab-panel').forEach(function (p) { p.classList.remove('active'); });
      btn.classList.add('active');
      var panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });

  /* ===== Cost calculator ===== */
  var areaInput = document.getElementById('area');
  var floorsInput = document.getElementById('floors');
  var cityInput = document.getElementById('city');
  var tierBtns = document.querySelectorAll('.tier-btn');
  var resultAmount = document.getElementById('resultAmount');
  var cityNote = document.getElementById('cityNote');

  if (areaInput && floorsInput && cityInput && resultAmount) {
    var currentRate = 2200;

    function calcCost() {
      var area = parseFloat(areaInput.value) || 0;
      var floors = parseFloat(floorsInput.value) || 1;
      var cityFactor = parseFloat(cityInput.value) || 1;
      var base = area * floors * currentRate * cityFactor;
      var low = base * 0.95;
      var high = base * 1.10;
      resultAmount.textContent = formatINR(low) + ' \u2013 ' + formatINR(high);
      if (cityNote && cityInput.selectedOptions.length) {
        cityNote.textContent = 'Rate factor for ' + cityInput.selectedOptions[0].textContent + ' applied.';
      }
    }

    tierBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        tierBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        currentRate = parseFloat(btn.getAttribute('data-rate'));
        calcCost();
      });
    });

    [areaInput, floorsInput, cityInput].forEach(function (el) {
      el.addEventListener('input', calcCost);
      el.addEventListener('change', calcCost);
    });

    calcCost();
  }

  /* ===== EMI calculator ===== */
  var loanAmt = document.getElementById('loanAmt');
  var rate = document.getElementById('rate');
  var tenure = document.getElementById('tenure');

  if (loanAmt && rate && tenure) {
    var loanAmtVal = document.getElementById('loanAmtVal');
    var rateVal = document.getElementById('rateVal');
    var tenureVal = document.getElementById('tenureVal');
    var emiOut = document.getElementById('emiOut');

    function calcEMI() {
      var P = parseFloat(loanAmt.value);
      var annualR = parseFloat(rate.value);
      var years = parseFloat(tenure.value);
      var r = annualR / 12 / 100;
      var n = years * 12;
      var emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      loanAmtVal.textContent = formatINR(P);
      rateVal.textContent = annualR.toFixed(1) + '%';
      tenureVal.textContent = years + ' yrs';
      emiOut.textContent = formatINR(emi);
    }

    [loanAmt, rate, tenure].forEach(function (el) { el.addEventListener('input', calcEMI); });
    calcEMI();
  }

  /* ===== Reviews loader (from assets/data/reviews.json) ===== */
  var reviewList = document.getElementById('reviewList');
  if (reviewList) {
    var fallbackShown = false;

    function starsHTML(n) {
      n = Math.max(0, Math.min(5, Math.round(Number(n) || 5)));
      return new Array(n + 1).join('\u2605') + new Array(6 - n).join('\u2606');
    }

    function cardHTML(r) {
      return '<div class="review-card">' +
        '<div class="r-head">' +
          '<div class="r-name">' + escapeHTML(r.name || 'Google User') +
            '<span class="stars">' + starsHTML(r.rating) + '</span></div>' +
          '<div class="r-meta">' + escapeHTML(r.time || '') + '</div>' +
        '</div>' +
        '<p>' + escapeHTML(r.text || '') + '</p>' +
      '</div>';
    }

    function escapeHTML(s) {
      return String(s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    function showFallback() {
      if (fallbackShown) return;
      fallbackShown = true;
      reviewList.innerHTML =
        '<div class="testi-card"><div class="ph-title">Review Yahan Aayega</div>' +
        '<p>Google se real reviews auto-load honge — iske liye tools/fetch-reviews.js chalayein (REVIEWS-GUIDE.md dekhein). Tab tak, aapke 4.9\u2605 rating aur 115 reviews Google/Justdial par live hain.</p></div>' +
        '<div class="testi-card"><div class="ph-title">Review Yahan Aayega</div>' +
        '<p>Apne recent customers se Google par review likhwane ke liye, unhe yeh short link bhejein: apna review likhne ka link Contact page par milta hai.</p></div>';
    }

    fetch('assets/data/reviews.json', { cache: 'no-store' })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var items = (data && Array.isArray(data.reviews)) ? data.reviews : [];
        if (!items.length) { showFallback(); return; }
        reviewList.innerHTML = items.map(cardHTML).join('');
      })
      .catch(showFallback);
  }

  /* ===== Naksha slider (home hero) ===== */
  var nakshaSlider = document.getElementById('nakshaSlider');
  if (nakshaSlider) {
    var track = document.getElementById('nakshaTrack');
    var slides = track.querySelectorAll('img');
    var dotsWrap = document.getElementById('nakshaDots');
    var prevBtn = document.getElementById('nakshaPrev');
    var nextBtn = document.getElementById('nakshaNext');
    var idx = 0;
    var dots = [];

    slides.forEach(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.setAttribute('aria-label', 'Naksha ' + (i + 1));
      d.addEventListener('click', function () { goTo(i); });
      dotsWrap.appendChild(d);
      dots.push(d);
    });

    function render() {
      track.style.transform = 'translateX(-' + (idx * 100) + '%)';
      dots.forEach(function (d, i) { d.classList.toggle('active', i === idx); });
    }

    function goTo(i) {
      idx = (i + slides.length) % slides.length;
      render();
    }

    prevBtn.addEventListener('click', function () { goTo(idx - 1); });
    nextBtn.addEventListener('click', function () { goTo(idx + 1); });
    render();
  }

  /* ===== Contact form (front-end only; opens WhatsApp with details) ===== */
  var leadForm = document.getElementById('leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('name') || {}).value || '';
      var mobile = (document.getElementById('mobile') || {}).value || '';
      var town = (document.getElementById('townInput') || {}).value || '';
      var plot = (document.getElementById('plotSize') || {}).value || '';
      var msg = (document.getElementById('msg') || {}).value || '';
      var text = 'Namaste, main ' + name + ' hun. ' +
        (town ? 'Shehar/Gaon: ' + town + '. ' : '') +
        (plot ? 'Plot size: ' + plot + ' sqft. ' : '') +
        (msg ? msg + ' ' : '') +
        (mobile ? '(Mobile: ' + mobile + ')' : '');
      var formNote = document.getElementById('formNote');
      if (formNote) {
        formNote.textContent = 'Dhanyavaad, ' + name + '! Aapka WhatsApp message taiyaar ho gaya hai — abhi bhejein aur 24 ghanton mein jawab paayein.';
        formNote.style.display = 'block';
      }
      window.open(WA_BASE + '?text=' + encodeURIComponent(text), '_blank');
    });
  }
})();
