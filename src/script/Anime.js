 document.addEventListener("DOMContentLoaded", () => {
    const introbg = document.querySelector(".intro");
    if (introbg) {
      setTimeout(() => {
        introbg.style.display = "none";
      }, 3000);
    }
  });