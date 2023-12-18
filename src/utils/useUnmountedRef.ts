import { useRef, useEffect } from 'react';

export default function useUnmountedRef() {
  const unmountedRef = useRef(false);
  useEffect(
    () => () => {
      unmountedRef.current = true;
    },
    []
  );
  return unmountedRef;
}
