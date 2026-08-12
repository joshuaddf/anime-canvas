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
    overlay.classList.toggle("is-active", open);
    document.body.style.overflow = open ? "hidden" : "";

    tl.to(buttonSlider, {
      y: -active * 100 + "%",
      duration: 1.2,
    });

    tl.to(
      header,
      {
        height: open ? "auto" : 0,
      },
      "<"
    );

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


// stack animation
const section2 = document.querySelector("#section-2");
const imgStack = section2.querySelector(".img-stack");
const images = imgStack.querySelectorAll("img");

function getPosition(index) {
  const isMobile = window.innerWidth <= 768;
  const availableX = Math.max(0, (window.innerWidth - imgStack.offsetWidth) / 2 - 16);
  const horizontal = isMobile
    ? Math.min(110, availableX)
    : Math.min(500, availableX);
  const vertical = isMobile
    ? Math.min(230, window.innerHeight * 0.28)
    : Math.min(300, window.innerHeight * 0.32);
  const columns = [-1, 0, 1, -1, 0, 1];
  const rows = [-1, -1, -1, 1, 1, 1];
  const rotations = [-15, isMobile ? 0 : -5, 15, 15, isMobile ? 0 : 5, -15];

  return {
    x: horizontal * columns[index],
    y: vertical * rows[index],
    rotation: rotations[index],
  };
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

images.forEach((img, i) => {
  disperseTl.to(
    img,
    {
      x: () => getPosition(i).x,
      y: () => getPosition(i).y,
      rotation: () => getPosition(i).rotation,
      // scale: pos.scale, 
      ease: "power2.inOut",
    },
    i * 0.15 
  );
});
}
