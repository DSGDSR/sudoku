import { useEffect, useCallback, useState } from 'react';

const usePadMenu = (onSelection: () => void) => {
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  const [show, setShow] = useState(false);
  const [showInterval, setShowInterval] = useState<any>();

  const handleContextMenu = useCallback(
    (event: any) => {
      // Only show for empty cells
      const classList = event.target?.classList;
      if (
        classList &&
        (!event.target.textContent || classList.contains('error')) &&
        classList.contains('cell')
      ) {
        const interval = setInterval(() => {
          setAnchorPoint({ x: event.clientX, y: event.clientY });
          setShow(true);
          setShowInterval((prev: any) => {
            clearInterval(prev);
            return null;
          });
        }, 300);
        setShowInterval(interval);
      }
    },
    [setShow, setAnchorPoint]
  );

  const handleClose = useCallback(() => {
    if (show) {
      setShow(false);
      onSelection();
    } else if (showInterval) {
      clearInterval(showInterval);
      setShowInterval((prev: any) => {
        clearInterval(prev);
        return null;
      });
    }
  }, [show, showInterval]);

  useEffect(() => {
    document.addEventListener('mouseup', handleClose);
    document.addEventListener('mousedown', handleContextMenu);
    return () => {
      document.removeEventListener('mouseup', handleClose);
      document.removeEventListener('mousedown', handleContextMenu);
    };
  });

  return { anchorPoint, show };
};

export default usePadMenu;
