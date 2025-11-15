import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function setupAnimations() {
  document.addEventListener("DOMContentLoaded", () => {
    const sectionText = document.querySelectorAll(".section-text");

    sectionText.forEach((text) => {
      const split = new SplitText(text, { type: "lines", mask: "lines" });
      gsap.set(split.lines, { y: 90 });

      gsap.to(split.lines, {
        y: 0,
        // opacity: 1,
        duration: 1,
        stagger: 0.15,
        ease: "power4.out",
        scrollTrigger: {
          trigger: text,
          start: "top 80%",
          end: "top 20%",
          markers: true,
          // scrub: true,
        },
      });
    });
  });

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

    active = 1 - active; // toggle 0 ↔ 1

    tl.to(buttonSlider, {
      y: -active * 100 + "%",
      duration: 1.2,
    });

    tl.to(
      header,
      {
        height: active * 23 + "%",
        duration: 1.2,
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
        duration: 1.2,
      },
      "<"
    )

    if (overlay === 1) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  });
}
