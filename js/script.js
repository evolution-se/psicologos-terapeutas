/* Espaco Aurora Psicologia — script.js (vanilla) */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';
  /* 1. WhatsApp centralizado — SUBSTITUIR pelo numero real */
  var WHATSAPP_NUMBER = '5511900000000';
  function buildWaLink(message) {
    return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(message);
  }
  document.querySelectorAll('[data-whatsapp-message]').forEach(function (el) {
    var msg = el.getAttribute('data-whatsapp-message') || 'Olá! Gostaria de agendar uma primeira conversa.';
    el.setAttribute('href', buildWaLink(msg));
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });
  /* 2. Header compacto ao rolar */
  var header = document.getElementById('siteHeader');
  function onScrollHeader() {
    if (header) header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* 3. Fecha menu mobile + scroll spy */
  var navCollapse = document.getElementById('mainNav');
  if (navCollapse) {
    navCollapse.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (navCollapse.classList.contains('show') && window.bootstrap) {
          window.bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
        }
      });
    });
  }
  var spyLinks = document.querySelectorAll('.site-nav .nav-link[data-spy]');
  var sections = [];
  spyLinks.forEach(function (l) {
    var s = document.querySelector(l.getAttribute('href'));
    if (s) sections.push(s);
  });
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          spyLinks.forEach(function (l) {
            l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
  /* 4. Reveal suave */
  var revealEls = document.querySelectorAll('.reveal');
  revealEls.forEach(function (el, i) { el.style.transitionDelay = ((i % 4) * 110) + 'ms'; });
  if ('IntersectionObserver' in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); revealer.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }
  /* 5. Voltar ao topo + ano */
  var toTop = document.getElementById('toTop');
  function onScrollTop() { if (toTop) toTop.classList.toggle('show', window.scrollY > 600); }
  window.addEventListener('scroll', onScrollTop, { passive: true });
  onScrollTop();
  if (toTop) { toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }); }
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
  /* 6. Mascara de telefone */
  var phone = document.getElementById('fieldPhone');
  if (phone) {
    phone.addEventListener('input', function () {
      var d = phone.value.replace(/\D/g, '').slice(0, 11);
      if (d.length > 6) phone.value = '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
      else if (d.length > 2) phone.value = '(' + d.slice(0, 2) + ') ' + d.slice(2);
      else phone.value = d;
    });
  }
  /* 7. Formulario -> WhatsApp */
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var name = document.getElementById('fieldName');
      var modality = document.getElementById('fieldModality');
      var message = document.getElementById('fieldMessage');
      var consent = document.getElementById('fieldConsent');
      var ok = true;
      function flag(input, invalid) {
        input.setAttribute('aria-invalid', invalid ? 'true' : 'false');
        var err = document.getElementById(input.id + 'Error');
        if (err) err.classList.toggle('show', invalid);
        if (invalid) ok = false;
      }
      flag(name, !name.value.trim());
      flag(phone, phone.value.replace(/\D/g, '').length < 10);
      flag(modality, !modality.value);
      var consentErr = document.getElementById('fieldConsentError');
      if (!consent.checked) { ok = false; if (consentErr) consentErr.classList.add('show'); }
      else if (consentErr) consentErr.classList.remove('show');
      var status = document.getElementById('formStatus');
      if (!ok) { if (status) status.textContent = 'Verifique os campos destacados — faltou alguma informação.'; return; }
      if (status) status.textContent = 'Abrindo o WhatsApp com a sua mensagem…';
      var text = 'Olá! Meu nome é ' + name.value.trim() + '. Tenho interesse em atendimento ' + modality.value + '.' + (message.value.trim() ? ' Observação: ' + message.value.trim() : '') + ' Gostaria de agendar uma primeira conversa.';
      window.open(buildWaLink(text), '_blank', 'noopener');
    });
  }
  /* 8. Modal da galeria (evita salto do href="#") */
  document.querySelectorAll('[data-bs-target="#galleryModal"]').forEach(function (a) {
    a.addEventListener('click', function (ev) { ev.preventDefault(); });
  });
  var galleryModal = document.getElementById('galleryModal');
  if (galleryModal) {
    galleryModal.addEventListener('show.bs.modal', function (event) {
      var trigger = event.relatedTarget;
      if (!trigger) return;
      var img = trigger.querySelector('img');
      var modalImg = galleryModal.querySelector('#galleryModalImg');
      var caption = galleryModal.querySelector('#galleryModalCaption');
      if (img && modalImg) { modalImg.src = img.src; modalImg.alt = img.alt; }
      if (caption) { var fc = trigger.querySelector('figcaption'); caption.textContent = fc ? fc.textContent : (img ? img.alt : ''); }
    });
  }
});
