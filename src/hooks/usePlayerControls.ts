import { useState, useEffect, useCallback, useRef, MutableRefObject } from 'react';
declare global {
  interface Document {
    mozPointerLockElement?: Element;
    webkitPointerLockElement?: Element;

    mozExitPointerLock?: Function;
    webkitExitPointerLock?: Function;
  }

  interface MouseEvent {
    mozMovementX?: number;
    webkitMovementX?: number;
    mozMovementY?: number;
    webkitMovementY?: number;
  }
}

export const usePlayerControls = (canvasRef: MutableRefObject<null>) => {
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const [forward, setForward] = useState(false);
  const [backward, setBackward] = useState(false);

  const sizes = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const cursor = useRef({
    x: 0,
    y: 0,
  });

  const exitPointerLock = useCallback(() => {
    document.exitPointerLock =
      document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock;

    document.exitPointerLock();
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      e.code === 'Escape' && exitPointerLock();

      e.code === 'KeyA' && setLeft(true);
      e.code === 'KeyD' && setRight(true);
      e.code === 'KeyW' && setForward(true);
      e.code === 'KeyS' && setBackward(true);
    },
    [exitPointerLock]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.code === 'KeyA' && setLeft(false);
    e.code === 'KeyD' && setRight(false);
    e.code === 'KeyW' && setForward(false);
    e.code === 'KeyS' && setBackward(false);
  }, []);

  const handleMouseMove = useCallback((ev: MouseEvent) => {
    cursor.current.x = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0;
    cursor.current.y = ev.movementX || ev.mozMovementX || ev.webkitMovementX || 0;
  }, []);

  const handleWindowResize = useCallback(() => {
    sizes.current = { width: window.innerWidth, height: window.innerHeight };
  }, []);

  const pointerLockChange = useCallback(
    (ev, requestedElement) => {
      if (
        document.pointerLockElement === requestedElement ||
        document.mozPointerLockElement === requestedElement ||
        document.webkitPointerLockElement === requestedElement
      ) {
        // Pointer was just locked
        // Enable the mousemove listener
        document.addEventListener('mousemove', handleMouseMove, false);
      } else {
        // Pointer was just unlocked
        // Disable the mousemove listener
        document.removeEventListener('mousemove', handleMouseMove, false);
        exitPointerLock();
      }
    },
    [exitPointerLock, handleMouseMove]
  );

  const pointerLockEventRef = useCallback(
    (ev: Event) => {
      pointerLockChange(ev, canvasRef.current);
    },
    [canvasRef, pointerLockChange]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', handleWindowResize);

    // Hook pointer lock state change events
    document.addEventListener('pointerlockchange', pointerLockEventRef, false);
    document.addEventListener('mozpointerlockchange', pointerLockEventRef, false);
    document.addEventListener('webkitpointerlockchange', pointerLockEventRef, false);

    // Hook mouse move events
    document.addEventListener('mousemove', handleMouseMove, false);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleWindowResize);

      document.removeEventListener('pointerlockchange', pointerLockEventRef);
      document.removeEventListener('mozpointerlockchange', pointerLockEventRef);
      document.removeEventListener('webkitpointerlockchange', pointerLockEventRef);
    };
  }, [
    canvasRef,
    handleKeyDown,
    handleKeyUp,
    handleMouseMove,
    handleWindowResize,
    pointerLockChange,
    pointerLockEventRef,
  ]);

  return { left, right, forward, backward, cursor: cursor.current };
};
