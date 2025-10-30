import React, { useEffect, useRef } from 'react';

const ContextMenu = ({ x, y, show, onClose, items }) => {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('contextmenu', onClose, { once: true });
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('contextmenu', onClose);
    };
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  return (
    <div ref={menuRef} className="context-menu" style={{ top: y, left: x }}>
      <ul>
        {items.map((item, index) => (
          <li key={index} onClick={item.onClick} className={item.className || ''}>
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContextMenu;
