import { useEffect, useState } from 'react';
import { Box, IconButton, Badge } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { Link as RouterLink } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';

const NotificationBell = ({ totalNotificationQuantity, toLink }) => {
  const controls = useAnimation();

  useEffect(() => {
    const interval = setInterval(() => {
      controls.start({
        rotate: [0, -20, 20, -10, 10, 0],
        transition: { duration: 0.8 },
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [controls]);

  return (
    <Box
      component={RouterLink}
      to={toLink || '/parent/dashboard'}
      sx={{ textDecoration: 'none', color: 'inherit' }}
    >
      <IconButton color="inherit" sx={{ mr: 1 }}>
        <Badge color="secondary" badgeContent={totalNotificationQuantity} max={10}>
          <motion.div animate={controls}>
            <NotificationsActiveIcon />
          </motion.div>
        </Badge>
      </IconButton>
    </Box>
  );
};

export default NotificationBell;