
import ReloadIcon from '@mui/icons-material/Cached';
import { Box } from '@mui/material';

import './StyleReloadPageBtn.scss';

const ReloadPageBtn = () => {

  const handleReload = (e) => {
    e.preventDefault();
    location.reload();
  }

  return (
    <Box onClick={handleReload} component={'button'} className="reload-button">
      <Box component={"span"}  className='reload-button__wrapper'>
        <span className='reload-button__letters'>
          Reload
        </span>
        <span className='reload-button__icon'>
          <ReloadIcon fontSize='large' className='icon' />
        </span>
      </Box>
    </Box>
  );
}

export default ReloadPageBtn;