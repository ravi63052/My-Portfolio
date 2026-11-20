import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { chapterAt, chapters } from '../data/story';

gsap.registerPlugin(ScrollTrigger, SplitText);

export function useStory(root, reduced) {
  const story = useRef({ chapter: 0, scroll: 0, intro: 1, paused: false, reduced: false });
  story.current.reduced = reduced;

  useEffect(() => {
    if (!root.current) return;
    const scope = root.current;
    let cancelled = false;
    let context;
    let media;
    const splits = [];
    const start = () => {
      if (cancelled) return;
      context = gsap.context(() => {
        media = gsap.matchMedia();
        media.add({ always: '(min-width: 0px)', desktop: '(min-width: 961px)', motion: '(prefers-reduced-motion: no-preference)' }, ({ conditions }) => {
          const moving = conditions.motion;
          if (conditions.motion && conditions.desktop) {
            ScrollTrigger.create({ trigger: '#about', pin: '.about-sticky', start: 'top top', end: '+=35%', pinSpacing: true, invalidateOnRefresh: true });
          }

          let anchors = [];
          const measure = () => {
            anchors = chapters.map(id => Math.max(0, (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY - (id === 'home' ? 0 : window.innerHeight * .18)));
            story.current.chapter = chapterAt(window.scrollY, anchors);
            story.current.invalidate?.();
          };
          // Global refresh fires after every pin has restored its final spacing.
          ScrollTrigger.addEventListener('refresh', measure);
          ScrollTrigger.create({
            trigger: scope, start: 0, end: 'max',
            onUpdate: self => {
              story.current.chapter = chapterAt(window.scrollY, anchors);
              story.current.scroll = self.progress;
              story.current.invalidate?.();
            },
          });
          measure(); story.current.chapter = chapterAt(window.scrollY, anchors);

          story.current.intro = 1;
          if (!moving) return () => ScrollTrigger.removeEventListener('refresh', measure);
          gsap.fromTo(story.current, { intro: 0 }, { intro: 1, duration: 1.6, ease: 'power3.out', onUpdate: () => story.current.invalidate?.() });
          gsap.from('.name-letter', { yPercent: 115, rotateX: -70, stagger: .065, duration: 1.15, ease: 'expo.out', delay: .15 });
          gsap.from('.hero-reveal', { y: 30, opacity: 0, stagger: .13, duration: 1, ease: 'power3.out', delay: .45 });

          scope.querySelectorAll('[data-words]').forEach(element => {
            const split = SplitText.create(element, { type: 'words', mask: 'words', wordsClass: 'animated-word', autoSplit: true,
              onSplit(self) { return gsap.from(self.words, { yPercent: 108, rotateZ: 3, stagger: .065, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 90%', end: 'clamp(top 55%)', scrub: .6 } }); },
            });
            splits.push(split);
          });
          scope.querySelectorAll('[data-lines]').forEach(element => {
            splits.push(SplitText.create(element, {
              type: 'lines', autoSplit: true, linesClass: 'animated-line',
              onSplit(self) {
                return gsap.fromTo(self.lines, { y: 35, opacity: .16, filter: 'blur(7px)' }, { y: 0, opacity: 1, filter: 'blur(0px)', stagger: .15, ease: 'none', scrollTrigger: { trigger: element, start: 'top 95%', end: 'top 72%', scrub: .6, invalidateOnRefresh: true } });
              },
            }));
          });
          scope.querySelectorAll('.project-stage').forEach(card => {
            gsap.fromTo(card, { rotateX: 6, y: 65, scale: .96 }, { rotateX: 0, y: 0, scale: 1, ease: 'none', scrollTrigger: { trigger: card, start: 'top 98%', end: 'top 42%', scrub: .65 } });
            gsap.fromTo(card.querySelector('.project-copy'), { x: 35 }, { x: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 30%', scrub: .8 } });
          });
          scope.querySelectorAll('.timeline-item, .early-education article').forEach((element, i) => {
            gsap.from(element, { x: i % 2 ? 28 : -28, clipPath: 'inset(0 100% 0 0)', ease: 'none', scrollTrigger: { trigger: element, start: 'top 95%', end: 'top 73%', scrub: .5 } });
          });
          gsap.from('.skills-visual', { y: 50, rotateX: 5, scale: .96, ease: 'none', scrollTrigger: { trigger: '#skills', start: 'top 90%', end: 'top 35%', scrub: .6 } });
          gsap.from('.contact-links>a', { y: 24, opacity: .2, stagger: .1, scrollTrigger: { trigger: '.contact-links', start: 'top 98%', end: 'clamp(top 80%)', scrub: .5 } });
          gsap.to('.hero-copy', { y: -65, ease: 'none', scrollTrigger: { trigger: '#home', start: 'top top', end: 'bottom top', scrub: true } });
          return () => ScrollTrigger.removeEventListener('refresh', measure);
        });
        ScrollTrigger.refresh();
      }, scope);
    };
    // Responsive line splitting updates as fonts load; scrolling starts immediately.
    start();
    return () => {
      cancelled = true;
      media?.revert();
      splits.forEach(split => split.revert());
      context?.revert();
    };
  }, [root, reduced]);
  return story;
}
