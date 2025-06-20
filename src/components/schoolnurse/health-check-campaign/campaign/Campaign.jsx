import Box from '@mui/material/Box';
import campaign from '../../../../assets/images/HealthCheckPoster1.png'; // Adjust the path as necessary
import CampaignIcon from '@mui/icons-material/Campaign';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Campaign = () => {
    const textRef = useRef();
    const animationRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        const text = textRef.current;
        let pos = -100; // Start off-screen left
        const end = 100; // End off-screen right
        const speed = 0.2; // Lower is slower

        const animate = () => {
            pos += speed;
            text.style.transform = `translateX(${pos}vw)`;
            if (pos < end) {
                animationRef.current = requestAnimationFrame(animate);
            } else {
                // Reset and repeat
                pos = -100;
                animationRef.current = requestAnimationFrame(animate);
            }
        };
        animationRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationRef.current);
    }, []);

    const handleBoxClick = () => {
        navigate('campaigns');
    };

    return (
        <Box
            onClick={handleBoxClick}
            sx={{
                backgroundColor: '#f5f5f5',
                borderRadius: 1,
                height: '100%',
                backgroundImage: `url(${campaign})`,
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
            }}
        >
            <div
                ref={textRef}
                style={{
                    position: 'absolute',
                    top: 30,
                    left: 0,
                    fontSize: '2.5rem',
                    fontWeight: 'bold',
                    color: '#1976d2',
                    whiteSpace: 'nowrap',
                    transition: 'none',
                    zIndex: 2,
                    textShadow: '2px 2px 8px #fff',
                }}
            >
                Health Check Campaign - Welcome!
            </div>
        </Box>
    );
}

export default Campaign;