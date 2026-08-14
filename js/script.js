/* Zendacom — contact form.
 *
 * GitHub Pages has no server to send mail from, so the form composes a
 * message and hands it to the visitor's own email client. The destination
 * address lives in the `data-mailto` attribute on the <form>, so changing
 * it is a one-word HTML edit — nothing here needs touching.
 *
 * To move to a real form service later (Formspree, Web3Forms, etc.), give
 * the form an `action` and `method="POST"` and delete this file's <script>
 * tag. The field names below are already the conventional ones.
 */
(function () {
  "use strict";

  // Some mail clients silently truncate very long mailto: bodies.
  var BODY_LIMIT = 1800;

  function fieldValue(form, name) {
    var el = form.elements[name];
    return el ? el.value.trim() : "";
  }

  function setNote(note, text) {
    if (note) {
      note.textContent = text;
    }
  }

  function handleSubmit(form, note) {
    return function (event) {
      event.preventDefault();

      // Let the browser do the required/email-format checks and focus the
      // first offending field.
      if (!form.reportValidity()) {
        return;
      }

      var first = fieldValue(form, "firstName");
      var last = fieldValue(form, "lastName");
      var email = fieldValue(form, "email");
      var message = fieldValue(form, "message");

      var subject = "Website enquiry from " + first + " " + last;
      var body =
        message +
        "\r\n\r\n--\r\n" +
        "From: " + first + " " + last + "\r\n" +
        "Email: " + email;

      if (body.length > BODY_LIMIT) {
        body = body.slice(0, BODY_LIMIT) + "\r\n\r\n[message truncated]";
      }

      // The address is author-controlled, so it goes in as-is; everything
      // typed by a visitor is escaped.
      var href =
        "mailto:" + form.dataset.mailto +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      setNote(note, "Opening your email app… if nothing happens, write to " + form.dataset.mailto + " directly.");

      window.location.href = href;
    };
  }

  var forms = document.querySelectorAll("form[data-mailto]");

  Array.prototype.forEach.call(forms, function (form) {
    var note = form.querySelector(".form-note");
    form.addEventListener("submit", handleSubmit(form, note));
  });
})();
