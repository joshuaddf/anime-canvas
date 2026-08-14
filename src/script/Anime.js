import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function setupAnimations() {
  const button = document.querySelector(".btn");
  const buttonSlider = document.querySelector(".btn-slider");
  const header = document.querySelector(".header-container");
  const headerText = document.querySelector(".header-text");
  const overlay = document.querySelector(".overlay");

  const headerSplit = new SplitText(headerText, { type: "lines", mask: "lines" });
  gsap.set(headerSplit.lines, { yPercent: 120 });

  let panelOpen = false;

  function setPanel(open) {
    panelOpen = open;
    button.setAttribute("aria-label", open ? "Close information panel" : "Open information panel");
    button.setAttribute("aria-expanded", String(open));
    header.setAttribute("aria-hidden", String(!open));
    header.classList.toggle("is-open", open);
    overlay.classList.toggle("is-active", open);
    document.body.style.overflow = open ? "hidden" : "";

    const timeline = gsap.timeline({ defaults: { ease: "expo.out", duration: 1 } });
    timeline.to(buttonSlider, { yPercent: open ? -100 : 0 }, 0);
    timeline.to(overlay, { opacity: open ? 1 : 0 }, 0);
    timeline.to(
      headerSplit.lines,
      { yPercent: open ? 0 : 120, stagger: open ? 0.08 : 0.03 },
      open ? 0.18 : 0
    );
  }

  button.addEventListener("click", () => setPanel(!panelOpen));
  overlay.addEventListener("click", () => setPanel(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panelOpen) {
      setPanel(false);
      button.focus();
    }
  });

  gsap.fromTo(
    ".hero-image",
    { clipPath: "inset(50% 50% 50% 50%)" },
    { clipPath: "inset(0% 0% 0% 0%)", duration: 1.5, delay: 0.15, ease: "power3.inOut" }
  );
  gsap.fromTo(
    ".hero-image img",
    { scale: 1.08 },
    { scale: 1, duration: 1.5, delay: 0.15, ease: "power3.inOut" }
  );

  document.querySelectorAll(".numbered-notes article").forEach((note) => {
    gsap.fromTo(note, { opacity: 0, scale: 0.98, filter: "blur(14px)" }, {
      opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.1, ease: "power3.out",
      scrollTrigger: { trigger: note, start: "top 80%", once: true },
    });
  });

  document.querySelectorAll(".photograph-image").forEach((image) => {
    const photograph = image.querySelector("img");
    const timeline = gsap.timeline({ scrollTrigger: { trigger: image, start: "top 90%", once: true } });
    timeline.fromTo(image, { clipPath: "inset(11% 11% 11% 11%)" }, {
      clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power3.inOut",
    });
    timeline.fromTo(photograph, { scale: 1.02 }, { scale: 1, duration: 1.2, ease: "power3.inOut" }, 0);
  });

  ScrollTrigger.refresh();
}
