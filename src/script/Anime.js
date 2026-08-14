import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function setupAnimations() {
  document.addEventListener("DOMContentLoaded", () => {
    const sectionText = document.querySelectorAll(".section-text");

    // section text animation
    sectionText.forEach((text) => {
      const split = new SplitText(text, { type: "lines", mask: "lines" });
      gsap.set(split.lines, { y: 90 });

      gsap.to(split.lines, {
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: text,
          start: "top 70%",
          end: "top 20%",
          // markers: true,
          // scrub: true,
        },
      });
    });
  });

  // header animation
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
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close information panel" : "Open information panel");
    header.setAttribute("aria-hidden", String(!open));
    header.classList.toggle("is-open", open);
    overlay.classList.toggle("is-active", open);
    document.body.style.overflow = open ? "hidden" : "";

    const timeline = gsap.timeline({ defaults: { ease: "expo.out", duration: 1 } });
    timeline.to(buttonSlider, { yPercent: open ? -100 : 0 }, 0);
    timeline.to(overlay, { opacity: open ? 1 : 0 }, 0);
    timeline.to(headerSplit.lines, { yPercent: open ? 0 : 120, stagger: open ? 0.08 : 0.03 }, open ? 0.18 : 0);
  }

  button.addEventListener("click", () => setPanel(!panelOpen));
  overlay.addEventListener("click", () => setPanel(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panelOpen) {
      setPanel(false);
      button.focus();
    }
  });


// stack animation
const section2 = document.querySelector("#section-2");
const sections2Text = section2.querySelector(".section-text");
const imgStack = section2.querySelector(".img-stack");
const images = imgStack.querySelectorAll("img");
const section3 = document.querySelector("#section-3");
const section3Text = section3.querySelector(".section-text");
const section2Wrapper = document.querySelector(".section-2-wrapper");

function getPositions() {
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    return [
      { x: -150, y: -300, rotation: -15, scale: 0.3 },
      { x: 0, y: -300, rotation: 0, scale: 0.3 },
      { x: 150, y: -300, rotation: 15, scale: 0.3 },
      { x: -150, y: 300, rotation: 15, scale: 0.3 },
      { x: 0, y: 300, rotation: 0, scale: 0.3 },
      { x: 150, y: 300, rotation: -15, scale: 0.3 },
    ];
  } else {
    return [
      { x: -500, y: -250, rotation: -15, scale: 0.5 },
      { x: 0, y: -300, rotation: -5, scale: 0.5 },
      { x: 500, y: -250, rotation: 15, scale: 0.5 },
      { x: -500, y: 250, rotation: 15, scale: 0.5 },
      { x: 0, y: 300, rotation: 5, scale: 0.5 },
      { x: 500, y: 250, rotation: -15, scale: 0.5 },
    ];
  }
}

gsap.set(images, {
  opacity: 0,
  scale: 0.8,
});

gsap.to(images, {
  opacity: 1,
  scale: 1,
  // stagger: 0.1,
  ease: "power4.out",
  scrollTrigger: {
    trigger: section2,
    start: "top 70%",
    end: "top 20%",
    scrub: 1,
  },
});

const disperseTl = gsap.timeline({
  scrollTrigger: {
    trigger: section2,
    start: "top top",
    end: `+=${section2.offsetHeight + 50}`,
    scrub: 1, 
    pin: imgStack, 
    anticipatePin: 1, 
    pinSpacing: true,
    invalidateOnRefresh: true,
  },
});

const positions = getPositions();

images.forEach((img, i) => {
  const pos = positions[i]; 

  disperseTl.to(
    img,
    {
      x: pos.x,
      y: pos.y,
      rotation: pos.rotation,
      // scale: pos.scale, 
      ease: "power2.inOut",
    },
    i * 0.15 
  );
});
}
