(function () {
  function blobUrlFromB64(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: "video/mp4" }));
  }
  window.SHD_loadFilm = function (videoEl, done) {
    if (window.SHD_FILM_URL) {
      videoEl.src = window.SHD_FILM_URL;
      if (done) done();
      return;
    }
    if (window.SHD_FILM) {
      window.SHD_FILM_URL = blobUrlFromB64(window.SHD_FILM);
      videoEl.src = window.SHD_FILM_URL;
      if (done) done();
      return;
    }
    var n = 10;
    var left = n;
    var failed = false;
    function tick() {
      left -= 1;
      if (failed) return;
      if (left > 0) return;
      if (!window.SHD_FILM) { if (done) done(new Error("empty film")); return; }
      window.SHD_FILM_URL = blobUrlFromB64(window.SHD_FILM);
      videoEl.src = window.SHD_FILM_URL;
      if (done) done();
    }
    for (var i = 1; i <= n; i++) {
      var s = document.createElement("script");
      s.src = "js/film-" + i + ".js";
      s.onload = tick;
      s.onerror = function () { failed = true; if (done) done(new Error("load")); };
      document.head.appendChild(s);
    }
  };
})();
