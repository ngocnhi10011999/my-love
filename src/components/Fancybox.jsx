import { useEffect, useRef } from 'react';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

export default function Fancybox({ delegate = '[data-fancybox]', options, children }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    NativeFancybox.bind(container, delegate, options || {});
    return () => {
      NativeFancybox.unbind(container);
      NativeFancybox.close();
    };
  }, [delegate, options]);

  return <div ref={containerRef}>{children}</div>;
}
