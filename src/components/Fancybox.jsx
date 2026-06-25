import { useEffect, useRef } from 'react';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export default function Fancybox({ delegate = '[data-fancybox]', options, children }) {
  const containerRef = useRef(null);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  useEffect(() => {
    const container = containerRef.current;
    NativeFancybox.bind(container, delegate, optionsRef.current || {});
    return () => {
      NativeFancybox.unbind(container);
    };
  }, [delegate]);

  return <div ref={containerRef}>{children}</div>;
}
