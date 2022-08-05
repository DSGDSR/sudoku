import './styles/FloatingMenu.css';

const FloatingMenu = () => {
  return (
    <>
      <button className="floating-menu__icon" popover-left="Menu">
        <label htmlFor="menu-modal">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="35"
            height="35"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </label>
      </button>

      {/* Modal */}
      <input className="modal-state" id="menu-modal" type="checkbox" />
      <div className="modal">
        <label className="modal-bg" htmlFor="menu-modal"></label>
        <div
          className="modal-body"
          style={{
            width: '300px',
            height: '400px',
          }}
        >
          <label className="btn-close" htmlFor="menu-modal">
            X
          </label>
          <h4 className="modal-title">menu</h4>
        </div>
      </div>
    </>
  );
};

export default FloatingMenu;
