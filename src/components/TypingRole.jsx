import { useEffect, useState } from 'react';
import { roles } from '../data/story';

export default function TypingRole({ reduced, paused }) {
  const [text, setText] = useState(roles[0]);
  useEffect(() => {
    if (reduced || paused) return;
    let role = 0;
    let length = roles[0].length;
    let removing = true;
    let timeout;
    function step() {
      if (removing) {
        length--;
        setText(roles[role].slice(0, Math.max(0, length)));
        if (length <= 0) { removing = false; role = (role + 1) % roles.length; }
      } else {
        length++;
        setText(roles[role].slice(0, length));
        if (length >= roles[role].length) { removing = true; timeout = setTimeout(step, 2600); return; }
      }
      timeout = setTimeout(step, removing ? 35 : 65);
    }
    timeout = setTimeout(step, 2600);
    return () => clearTimeout(timeout);
  }, [reduced, paused]);
  return <div className="typing-role"><span className="sr-only">Full Stack Developer &amp; AI Application Builder</span><span aria-hidden="true">{reduced ? roles[0] : text}<span className="typing-caret"/></span></div>;
}
