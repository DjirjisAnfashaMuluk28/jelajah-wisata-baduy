/*
 * Jelajah Baduy — Animasi React (progress scroll, tombol kembali ke atas,
 * efek masuk saat elemen terlihat, dan hero entrance).
 * React mengelola state/interaksi animasi; script.js tetap mengelola peta dan kartu.
 * Kompatibel React 18 dan fallback React lokal untuk penggunaan offline.
 */
(function () {
  "use strict";
  if (!window.React || !window.ReactDOM) return;

  var h = React.createElement;

  class MotionUI extends React.Component {
    constructor(props) {
      super(props);
      this.state = { progress: 0, showBackToTop: false };
      this.frame = 0;
      this.observer = null;
      this.reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.onScroll = this.onScroll.bind(this);
      this.updateScroll = this.updateScroll.bind(this);
      this.backToTop = this.backToTop.bind(this);
      this.onMotionChange = this.onMotionChange.bind(this);
    }

    componentDidMount() {
      this.setupEntrance();
      this.updateScroll();
      window.addEventListener("scroll", this.onScroll, { passive: true });
      window.addEventListener("resize", this.onScroll, { passive: true });
      if (this.reduce.addEventListener) this.reduce.addEventListener("change", this.onMotionChange);
      else if (this.reduce.addListener) this.reduce.addListener(this.onMotionChange);
    }

    componentWillUnmount() {
      window.removeEventListener("scroll", this.onScroll);
      window.removeEventListener("resize", this.onScroll);
      if (this.reduce.removeEventListener) this.reduce.removeEventListener("change", this.onMotionChange);
      else if (this.reduce.removeListener) this.reduce.removeListener(this.onMotionChange);
      if (this.frame) window.cancelAnimationFrame(this.frame);
      if (this.observer) this.observer.disconnect();
    }

    onMotionChange() {
      if (this.reduce.matches) {
        if (this.observer) this.observer.disconnect();
        document.querySelectorAll(".react-reveal").forEach(function (el) {
          el.classList.add("is-visible");
        });
      } else {
        this.setupEntrance();
      }
    }

    setupEntrance() {
      var hero = document.querySelector(".hero");
      if (hero && !this.reduce.matches) hero.classList.add("react-hero-ready");
      if (this.reduce.matches || !("IntersectionObserver" in window)) return;
      if (this.observer) this.observer.disconnect();

      this.observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });

      var self = this;
      [
        [".shortcut-grid .shortcut", 70],
        [".section-heading", 90],
        ["#cards .card", 90],
        ["#peta .map-list li", 45],
        ["#peta .map-bar", 0],
        [".news-grid .news-card", 100],
        [".guide article", 85],
        ["#tentang .about > div", 120],
        [".notice", 0]
      ].forEach(function (group) {
        document.querySelectorAll(group[0]).forEach(function (element, index) {
          if (element.classList.contains("is-visible")) return;
          // Elemen yang sudah terlihat tidak perlu disembunyikan saat React aktif.
          var bounds = element.getBoundingClientRect();
          if (bounds.top < window.innerHeight - 24 && bounds.bottom > 0) {
            element.classList.add("is-visible");
            return;
          }
          element.style.setProperty("--reveal-delay", Math.min(index * group[1], 330) + "ms");
          element.classList.add("react-reveal");
          self.observer.observe(element);
        });
      });
    }

    onScroll() {
      if (this.frame) return;
      this.frame = window.requestAnimationFrame(this.updateScroll);
    }

    updateScroll() {
      this.frame = 0;
      var maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      var progress = Math.min(100, Math.max(0, window.scrollY / maxScroll * 100));
      var showBackToTop = window.scrollY > Math.max(440, window.innerHeight * 0.65);
      // Menekan render berulang saat perubahan kurang dari setengah persen.
      if (Math.abs(progress - this.state.progress) >= 0.35 || showBackToTop !== this.state.showBackToTop) {
        this.setState({ progress: progress, showBackToTop: showBackToTop });
      }
    }

    backToTop() {
      window.scrollTo({ top: 0, behavior: this.reduce.matches ? "auto" : "smooth" });
    }

    render() {
      return h(React.Fragment || "div", null,
        h("div", {
          className: "react-progress",
          role: "progressbar",
          "aria-label": "Progres membaca halaman",
          "aria-valuemin": 0,
          "aria-valuemax": 100,
          "aria-valuenow": Math.round(this.state.progress),
          style: { transform: "scaleX(" + (this.state.progress / 100) + ")" }
        }),
        h("button", {
          type: "button",
          className: "react-back-top" + (this.state.showBackToTop ? " is-shown" : ""),
          onClick: this.backToTop,
          tabIndex: this.state.showBackToTop ? 0 : -1,
          "aria-label": "Kembali ke atas",
          "aria-hidden": this.state.showBackToTop ? "false" : "true",
          title: "Kembali ke atas"
        }, h("span", { "aria-hidden": "true" }, "↑"))
      );
    }
  }

  var target = document.getElementById("react-motion-root");
  if (!target) return;
  if (ReactDOM.createRoot) ReactDOM.createRoot(target).render(h(MotionUI));
  else ReactDOM.render(h(MotionUI), target);
})();
