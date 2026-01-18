(function () {
  var params = new URLSearchParams(window.location.search);
  var rid = params.get("rid");
  var ridEl = document.getElementById("requestId");
  var tsEl = document.getElementById("timestamp");

  if (ridEl) {
    ridEl.textContent = rid ? rid : ".";
  }

  if (tsEl) {
    try {
      tsEl.textContent = new Date().toLocaleString("es-AR", {
        dateStyle: "medium",
        timeStyle: "medium",
      });
    } catch (e) {
      tsEl.textContent = new Date().toString();
    }
  }
})();