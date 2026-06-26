const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      observer.unobserve(entry.target); // anima só 1 vez
    }
  });
}, {
  threshold: 0.2 // 20% visível já ativa
});

document.querySelectorAll(".item").forEach(el => {
  observer.observe(el);
});