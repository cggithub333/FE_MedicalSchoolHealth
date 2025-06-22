import Box from '@mui/material/Box';
import CampaignIcon from '@mui/icons-material/Campaign';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import img1 from '../../../../assets/images/1.jpg';
import img2 from '../../../../assets/images/2.jpg';
import img3 from '../../../../assets/images/3.jpg';
import img4 from '../../../../assets/images/4.jpg';
import img5 from '../../../../assets/images/5.jpg';
import './Campaign.scss';

const Campaign = () => {
    const textRef = useRef();    // Create a ref for the animated text element
    const animationRef = useRef();    // Create a ref to store the animation frame id for cleanup
    const navigate = useNavigate();    // React Router hook for navigation
    const [currentIndex, setCurrentIndex] = useState(0);    // State for the current image index in the carousel
    const cardRef = useRef();    // Ref for the campaign card (used for scroll reveal)
    const [isVisible, setIsVisible] = useState(false);    // State to track if the card is visible in the viewport
    const [fade, setFade] = useState(true);    // State to control the fade animation for image transitions
    const images = [img1, img2, img3, img4, img5];

    // Button labels for each image
    const buttonLabelsNext = [
        'Detail', // 1st image
        'Goals',  // 2nd image
        'TimeLine', // 3rd image
        'Cooperation', // 4th image
        'Cooperation' // 5th image (last)
    ];
    const buttonLabelsPrev = [
        'Previous',
        'Detail', // 1st image
        'Goals',  // 2nd image
        'TimeLine', // 3rd image
        'Cooperation' // 5th image (last)
    ];

    // Handle click on the card to navigate to the campaign details page
    useEffect(() => {
        const text = textRef.current;
        let pos = -100; // Start off-screen left
        const end = 100; // End off-screen right
        const speed = 0.15; // Lower is slower, smoother

        const animate = () => {
            pos += speed;
            text.style.transform = `translateX(${pos}vw)`;
            text.style.transition = 'transform 0.08s cubic-bezier(.4,0,.2,1)'; // Add smooth transition
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

    // Scroll reveal effect
    useEffect(() => {
        const observer = new window.IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    // Fade effect on image change
    useEffect(() => {
        setFade(false);
        const timeout = setTimeout(() => setFade(true), 500);
        return () => clearTimeout(timeout);
    }, [currentIndex]);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };
    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <Box
            ref={cardRef}
            className={`campaign-card${!isVisible ? ' hidden' : ''}`}
        >
            <img
                src={images[currentIndex]}
                alt={`Health Check ${currentIndex + 1}`}
                className={`campaign-image${fade ? ' fade' : ' not-fade'}`}
            />
            <div
                ref={textRef}
                className="campaign-title"
            >
                Health Check Campaign - Welcome!
            </div>
            <Box className="campaign-controls" >
                {/* Prev button on the left */}
                <div>
                    {currentIndex > 0 && (
                        <button onClick={handlePrev} className="campaign-btn">{buttonLabelsPrev[currentIndex - 1]}</button>
                    )}
                </div>
                {/* Next/Detail/Goals/Timeline/Cooperation button on the right */}
                <div>
                    {currentIndex < images.length - 1 && (
                        <button onClick={handleNext} className="campaign-btn">{buttonLabelsNext[currentIndex]}</button>
                    )}
                </div>
            </Box>
        </Box>
    );
}

export default Campaign;