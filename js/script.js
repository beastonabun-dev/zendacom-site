/* Zendacom — contact form.
 *
 * The form itself is a plain HTML POST to Web3Forms, so it still works with
 * JavaScript disabled: the browser posts, Web3Forms emails the submission on,
 * and the visitor lands on thanks.html.
 *
 * This file is a progressive enhancement. It submits the same data with fetch
 * so the visitor stays on the page and gets an inline confirmation instead of
 * a redirect.
 *
 * Nothing here needs editing to change where mail goes — that is determined by
 * the address you registered against the access_key in the HTML.
 */
(function () {
  "use strict";

  var PLACEHOLDER = "REPLACE_WITH_YOUR_WEB3FORMS_ACCESS_KEY";

  function setNote(note, message, state) {
    if (!note) return;
    note.textContent = message;
    note.dataset.state = state || "";
  }

  function fallbackText(form) {
    var address = form.dataset.fallbackEmail;
    return address ? " Please email us directly at " + address + "." : "";
  }

  function handle(form, note) {
    return function (event) {
      // The form has no `novalidate`, so the browser has already enforced the
      // required fields and email format before this fires.
      event.preventDefault();

      var key = form.elements.access_key;
      if (key && key.value === PLACEHOLDER) {
        setNote(
          note,
          "This form isn't connected yet — the Web3Forms access key is still a placeholder." +
            fallbackText(form),
          "error"
        );
        return;
      }

      var button = form.querySelector('button[type="submit"]');
      var label = button ? button.textContent : "";

      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }
      setNote(note, "Sending your message…", "pending");

      fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form)
      })
        .then(function (response) {
          // Web3Forms answers with JSON when Accept: application/json is sent,
          // but treat a bare 2xx as success rather than failing on a parse error.
          return response
            .json()
            .catch(function () {
              return { success: response.ok };
            })
            .then(function (data) {
              return { ok: response.ok, data: data };
            });
        })
        .then(function (result) {
          if (!result.ok || !result.data.success) {
            throw new Error(result.data && result.data.message);
          }
          form.reset();
          setNote(
            note,
            "Thanks — your message is on its way. We'll reply within one business day.",
            "success"
          );
        })
        .catch(function () {
          setNote(note, "Sorry, that didn't send." + fallbackText(form), "error");
        })
        .then(function () {
          if (button) {
            button.disabled = false;
            button.textContent = label;
          }
        });
    };
  }

  var forms = document.querySelectorAll('form[action*="web3forms"]');

  Array.prototype.forEach.call(forms, function (form) {
    form.addEventListener("submit", handle(form, form.querySelector(".form-note")));
  });
})();
