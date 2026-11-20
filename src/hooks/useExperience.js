import { useEffect, useState } from 'react';

export function useMedia(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update(); media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}

export function useScrollSpy(ids) {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const update = () => {
      let current = 'home';
      ids.forEach(id => { if (document.getElementById(id)?.getBoundingClientRect().top <= 180) current = id; });
      setActive(current);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty('--scroll', `${total > 0 ? window.scrollY / total * 100 : 0}%`);
    };
    window.addEventListener('scroll', update, { passive: true }); update();
    return () => window.removeEventListener('scroll', update);
  }, [ids]);
  return active;
}
