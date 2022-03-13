import { useState, useEffect, useCallback } from 'react';

export const usePlayerControls = () => {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [forward, setForward] = useState(false);
  const [backward, setBackward] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.code === 'KeyA' && setLeft(true);
    e.code === 'KeyD' && setRight(true);
    e.code === 'KeyW' && setForward(true);
    e.code === 'KeyS' && setBackward(true);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.code === 'KeyA' && setLeft(false);
    e.code === 'KeyD' && setRight(false);
    e.code === 'KeyW' && setForward(false);
    e.code === 'KeyS' && setBackward(false);
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  return { left, right, forward, backward };
};
