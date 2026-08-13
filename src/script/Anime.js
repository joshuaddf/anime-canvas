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
  const headerText = document.querySelectorAll(".header-text");
  const overlay = document.querySelector(".overlay");

  const headerSplit = new SplitText(headerText, {
    type: "lines",
    mask: "lines",
  });

  gsap.set(headerSplit.lines, {
    y: 80,
  });

  let active = 0;

  function setPanel(open) {
    const tl = gsap.timeline({
      defaults: {
        ease: "expo.out",
        duration: 1.2,
      },
    });

    active = Number(open);
    button.setAttribute("aria-label", open ? "Close information panel" : "Open information panel");
    button.setAttribute("aria-expanded", String(open));
    header.setAttribute("aria-hidden", String(!open));
    header.classList.toggle("is-open", open);
    overlay.classList.toggle("is-active", open);
    document.body.style.overflow = open ? "hidden" : "";

    tl.to(buttonSlider, {
      y: -active * 100 + "%",
      duration: 1.2,
    });

    tl.to(
      headerSplit.lines,
      {
        y: active ? 0 : 20,
        stagger: 0.12,
        delay: active ? 0.1 : 0,
      },
      "< "
    );

    tl.to(
      overlay,
      {
        opacity: active ? 1 : 0,
      },
      "<"
    );

  }

  button.addEventListener("click", () => setPanel(!active));
  overlay.addEventListener("click", () => setPanel(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && active) {
      setPanel(false);
      button.focus();
    }
  });


// constellation animation
const constellation = document.querySelector("#constellation");
const imgStack = constellation.querySelector(".img-stack");
const images = imgStack.querySelectorAll("img");

function getPosition(index) {
  const isMobile = window.innerWidth <= 768;
  const availableX = Math.max(0, (window.innerWidth - imgStack.offsetWidth) / 2 - 12);
  const horizontal = Math.min(isMobile ? 150 : 520, availableX);
  const vertical = Math.min(isMobile ? 220 : 300, window.innerHeight * 0.31);
  const xFactors = isMobile
    ? [-0.85, 0.08, 0.9, -0.95, 0.1, 0.82]
    : [-0.9, -0.16, 0.88, -0.74, 0.08, 0.94];
  const yFactors = [-0.64, -0.98, -0.52, 0.7, 1, 0.58];
  const rotations = [-12, -3, 9, 7, 2, -10];
  const scales = isMobile
    ? [0.72, 0.58, 0.7, 0.62, 0.74, 0.6]
    : [0.78, 0.62, 0.86, 0.7, 0.9, 0.68];

  return {
    x: horizontal * xFactors[index],
    y: vertical * yFactors[index],
    rotation: rotations[index],
    scale: scales[index],
  };
}

gsap.set(images, {
  opacity: 0,
  scale: 0.72,
  rotation: (index) => [-6, 4, -3, 5, -5, 2][index],
});

const disperseTl = gsap.timeline({
  scrollTrigger: {
    trigger: constellation,
    start: "top top",
    end: "bottom bottom",
    scrub: 1,
    invalidateOnRefresh: true,
  },
});

images.forEach((img, i) => {
  disperseTl.to(
    img,
    {
      opacity: 1,
      x: () => getPosition(i).x,
      y: () => getPosition(i).y,
      rotation: () => getPosition(i).rotation,
      scale: () => getPosition(i).scale,
      ease: "power2.inOut",
    },
    i * 0.08
  );
});

gsap.utils.toArray(".feature-image, .diptych figure").forEach((figure) => {
  gsap.fromTo(
    figure,
    { y: 70 },
    {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: figure,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    }
  );
});
}
