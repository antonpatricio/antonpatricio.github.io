document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('section[id]'));

  if (!navLinks.length || !sections.length) return;

  // Click -> make clicked link active (scroll handled by anchor + css scroll-behavior)
  navLinks.forEach(link =>
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    })
  );

  // IntersectionObserver -> auto highlight based on visible section
  const activateForId = id =>
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) activateForId(entry.target.id);
        });
      },
      { root: null, threshold: 0.5 }
    );
    sections.forEach(s => obs.observe(s));
  } else {
    // Fallback: highlight section nearest to viewport center
    const onScroll = () => {
      const center = window.scrollY + window.innerHeight / 2;
      let current = sections[0].id;
      for (const s of sections) {
        if (s.offsetTop <= center) current = s.id;
      }
      activateForId(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
});