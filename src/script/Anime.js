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
          markers: true,
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

  let active = 1;

  button.addEventListener("click", () => {
    const tl = gsap.timeline({
      defaults: {
        ease: "expo.out",
        duration: 1.2,
      },
    });

    active = 1 - active;

    tl.to(buttonSlider, {
      y: -active * 100 + "%",
      duration: 1.2,
    });

    tl.to(
      header,
      {
        height: active * 23 + "%",
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

    if (overlay === 1) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });

  // stack animation
  const section2 = document.querySelector("#section-2");
  const sections2Text = section2.querySelector(".section-text");
  const imgStack = section2.querySelector(".img-stack");
  const images = imgStack.querySelectorAll("img");
  const section3 = document.querySelector("#section-3");
  const section3Text = section3.querySelector(".section-text");

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
    duration: 2,
    // stagger: 0.5,
    ease: "power4.out",
    scrollTrigger: {
      trigger: section2,
      start: "top 70%",
      end: "top 20%",
      scrub: true,
    },
  });

  const disperseTl = gsap.timeline({
    scrollTrigger: {
      trigger: section2,
      start: "top top",
      end: () => `+=${section2.offsetHeight} + 50`,
      scrub: true,
      pin: imgStack,
      invalidateOnRefresh: true,
    },
  });

  images.forEach((img, i) => {
    const positions = getPositions();
    const pos = positions[i];

    disperseTl.to(
      img,
      {
        x: pos.x,
        y: pos.y,
        rotation: pos.rotation,
        // scale: pos.scale,
        duration: 1,
        ease: "power4.out",
      },
      i * 0.2
    );
  });
}
