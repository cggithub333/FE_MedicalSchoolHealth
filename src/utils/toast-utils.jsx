import { toast as hotToast } from 'react-hot-toast';

export const showConfirmToast = (message = 'Are you sure?') => {
  return new Promise((resolve) => {
    const id = hotToast.custom((t) => (
      <div
        style={{
          padding: '16px',
          background: '#1e1e1e',
          color: '#fff',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          minWidth: '250px',
        }}
      >
        <span>{message}</span>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button
            onClick={() => {
              hotToast.dismiss(t.id);
              resolve(false);
            }}
            style={{ background: 'gray', border: 'none', padding: '6px 12px', color: '#fff' }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              hotToast.dismiss(t.id);
              resolve(true);
            }}
            style={{ background: 'green', border: 'none', padding: '6px 12px', color: '#fff' }}
          >
            OK
          </button>
        </div>
      </div>
    ));
  });
};