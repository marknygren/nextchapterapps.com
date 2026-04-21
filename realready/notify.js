(function () {
  'use strict';

  const SUPABASE_URL = 'https://chzajsqxypbgwmacsbik.supabase.co';
  const SUPABASE_ANON_KEY =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoemFqc3F4eXBiZ3dtYWNzYmlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNTYxOTcsImV4cCI6MjA4NjgzMjE5N30.shqu7cjG8l_AilGjQvPCxdhbsjiqNupaRDHxqNIPdtk';
  const TABLE = 'realready_waitlist';

  const modal = document.getElementById('rr-notify-modal');
  if (!modal) return;

  const dialog = modal.querySelector('.rr-modal__dialog');
  const formBody = modal.querySelector('.rr-modal__body');
  const successBody = modal.querySelector('.rr-modal__success');
  const form = modal.querySelector('.rr-notify-form');
  const input = form.querySelector('.rr-notify-form__input');
  const honeypot = form.querySelector('.rr-notify-form__hp');
  const errorEl = form.querySelector('.rr-notify-form__error');
  const submitBtn = form.querySelector('.rr-notify-form__submit');
  const submitLabel = submitBtn.querySelector('.rr-notify-form__submit-label');

  let lastTrigger = null;

  const supabase =
    window.supabase && window.supabase.createClient
      ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
      : null;

  function open(trigger) {
    lastTrigger = trigger || null;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('rr-modal-open');
    resetForm();
    setTimeout(() => input.focus(), 60);
  }

  function close() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('rr-modal-open');
    if (lastTrigger && typeof lastTrigger.focus === 'function') {
      lastTrigger.focus();
    }
  }

  function resetForm() {
    formBody.hidden = false;
    successBody.hidden = true;
    errorEl.hidden = true;
    errorEl.textContent = '';
    input.value = '';
    honeypot.value = '';
    input.disabled = false;
    submitBtn.disabled = false;
    submitLabel.textContent = 'Add me to the list';
  }

  function showError(message) {
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function showSuccess() {
    formBody.hidden = true;
    successBody.hidden = false;
    const closeBtn = successBody.querySelector('[data-close-notify]');
    if (closeBtn) closeBtn.focus();
  }

  function isValidEmail(value) {
    // Simple, permissive check; server/db handles the real validation.
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function submit(event) {
    event.preventDefault();
    errorEl.hidden = true;

    // Honeypot — silently succeed if filled.
    if (honeypot.value.trim() !== '') {
      showSuccess();
      return;
    }

    const email = input.value.trim().toLowerCase();
    if (!isValidEmail(email)) {
      showError('Please enter a valid email address.');
      input.focus();
      return;
    }

    if (!supabase) {
      showError("Couldn't reach the sign-up service. Please try again in a moment.");
      return;
    }

    input.disabled = true;
    submitBtn.disabled = true;
    submitLabel.textContent = 'Adding you…';

    try {
      const { error } = await supabase
        .from(TABLE)
        .insert({ email: email, source: 'realready-site' });

      if (error) {
        // 23505 = unique_violation (already on list) — treat as success.
        if (error.code === '23505' || /duplicate key/i.test(error.message || '')) {
          showSuccess();
          return;
        }
        console.error('Supabase insert error:', error);
        showError("Something went wrong on our end. Please try again shortly.");
        input.disabled = false;
        submitBtn.disabled = false;
        submitLabel.textContent = 'Add me to the list';
        return;
      }

      showSuccess();
    } catch (err) {
      console.error('Unexpected notify error:', err);
      showError("Couldn't connect. Check your network and try again.");
      input.disabled = false;
      submitBtn.disabled = false;
      submitLabel.textContent = 'Add me to the list';
    }
  }

  // Open triggers
  document.querySelectorAll('[data-open-notify]').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      open(this);
    });
  });

  // Close triggers (backdrop + close button + success close)
  modal.querySelectorAll('[data-close-notify]').forEach((el) => {
    el.addEventListener('click', close);
  });

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      close();
    }
  });

  // Form submit
  form.addEventListener('submit', submit);

  // Prevent backdrop clicks when clicking inside the dialog
  dialog.addEventListener('click', function (e) {
    e.stopPropagation();
  });
})();
