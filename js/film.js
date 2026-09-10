(function () {
  var LOCAL = "media/SH-breed-style.mp4";
  var HOSTED = "https://litter.catbox.moe/j3dw69.mp4";
  function blobUrlFromB64(b64) {
    var bin = atob(b64);
    var bytes = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return URL.createObjectURL(new Blob([bytes], { type: "video/mp4" }));
  }
  function attach(videoEl, url, done) {
    function ok() {
      videoEl.removeEventListener("error", bad);
      if (done) done();
    }
    function bad() {
      videoEl.removeEventListener("loadeddata", ok);
      if (done) done(new Error("load"));
    }
    videoEl.addEventListener("loadeddata", ok, { once: true });
    videoEl.addEventListener("error", bad, { once: true });
    videoEl.src = url;
  }
  window.SHD_loadFilm = function (videoEl, done) {
    if (window.SHD_FILM_URL) {
      videoEl.src = window.SHD_FILM_URL;
      if (done) done();
      return;
    }
    attach(videoEl, LOCAL, function (err) {
      if (!err) {
        window.SHD_FILM_URL = LOCAL;
        if (done) done();
        return;
      }
      if (window.SHD_FILM) {
        window.SHD_FILM_URL = blobUrlFromB64(window.SHD_FILM);
        videoEl.src = window.SHD_FILM_URL;
        if (done) done();
        return;
      }
      var n = 8;
      var left = n;
      var failed = false;
      function finishChunks() {
        if (window.SHD_FILM) {
          window.SHD_FILM_URL = blobUrlFromB64(window.SHD_FILM);
          videoEl.src = window.SHD_FILM_URL;
          if (done) done();
          return;
        }
        attach(videoEl, HOSTED, function (err2) {
          if (!err2) window.SHD_FILM_URL = HOSTED;
          if (done) done(err2);
        });
      }
      function tick() {
        left -= 1;
        if (failed) return;
        if (left > 0) return;
        finishChunks();
      }
      var sawScript = false;
      for (var i = 1; i <= n; i++) {
        var s = document.createElement("script");
        s.src = "js/film-" + i + ".js";
        s.onload = function () { sawScript = true; tick(); };
        s.onerror = tick;
        document.head.appendChild(s);
      }
    });
  };
})();
