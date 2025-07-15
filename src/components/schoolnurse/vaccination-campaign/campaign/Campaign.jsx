import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Skeleton from "@mui/material/Skeleton"
import CampaignIcon from "@mui/icons-material/Campaign"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./VaccinationCampaign.scss"
import { useNewestCampaignByStatus } from "../../../../hooks/schoolnurse/healthcheck/campaign/useNewestCampaignByStatus"

// Import your images
import img1 from "../../../../assets/images/6.jpg"
import img2 from "../../../../assets/images/7.jpg"
import img3 from "../../../../assets/images/8.jpg"
import img4 from "../../../../assets/images/9.jpg"
import img5 from "../../../../assets/images/10.jpg"

const Campaign = () => {
    const textRef = useRef()
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0)
    const cardRef = useRef()
    const [isVisible, setIsVisible] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const autoPlayRef = useRef()

    const images = [img1, img2, img3, img4, img5]
    const { newestCampaign, isLoading, error } = useNewestCampaignByStatus()

    const buttonLabelsNext = ["Detail", "Goals", "Timeline", "Cooperation", "Cooperation"]
    const buttonLabelsPrev = ["Previous", "Detail", "Goals", "Timeline", "Cooperation"]

    // Enhanced scroll reveal effect
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 0.2,
                rootMargin: "50px",
            },
        )

        if (cardRef.current) {
            observer.observe(cardRef.current)
        }

        return () => observer.disconnect()
    }, [])

    // Auto-play carousel
    useEffect(() => {
        if (isAutoPlaying) {
            autoPlayRef.current = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % images.length)
            }, 4000)
        }

        return () => {
            if (autoPlayRef.current) {
                clearInterval(autoPlayRef.current)
            }
        }
    }, [isAutoPlaying, images.length])

    // Reset image loaded state when index changes
    useEffect(() => {
        setImageLoaded(false)
    }, [currentIndex])

    // Enhanced marquee animation
    useEffect(() => {
        const text = textRef.current
        if (!text) return

        let animationId
        let position = -100
        const speed = 0.08
        const endPosition = 100

        const animate = () => {
            position += speed
            text.style.transform = `translateX(${position}vw)`

            if (position >= endPosition) {
                position = -100
            }

            animationId = requestAnimationFrame(animate)
        }

        animationId = requestAnimationFrame(animate)

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
        }
    }, [])

    const handleNext = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev + 1) % images.length)
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const handlePrev = () => {
        setIsAutoPlaying(false)
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
        // Resume auto-play after 10 seconds
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const handleDotClick = (index) => {
        setIsAutoPlaying(false)
        setCurrentIndex(index)
        setTimeout(() => setIsAutoPlaying(true), 10000)
    }

    const handleImageLoad = () => {
        setImageLoaded(true)
    }

    let campaignTitle = "Vaccination Campaign - Welcome!"
    if (!isLoading && newestCampaign && newestCampaign.length > 0) {
        if (newestCampaign[0].description) {
            campaignTitle = newestCampaign[0].description
        }
    }

    return (
        <Box className="campaign-container">
            <Card ref={cardRef} className={`campaign-card ${isVisible ? "visible" : "hidden"}`} elevation={8}>
                <CardContent className="campaign-content">
                    {/* Image Container */}
                    <Box className="image-container">
                        {images.map((image, index) => (
                            <Box
                                key={index}
                                className={`image-slide ${index === currentIndex ? "active" : ""} ${index < currentIndex ? "prev" : index > currentIndex ? "next" : ""
                                    }`}
                            >
                                <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Health Check ${index + 1}`}
                                    className={`campaign-image${index === currentIndex && imageLoaded ? " loaded" : ""}`}
                                    onLoad={index === currentIndex ? handleImageLoad : undefined}
                                    style={index === currentIndex ? {} : { filter: "none" }}
                                />
                                <Box className="image-overlay" />
                            </Box>
                        ))}

                        {/* Loading Skeleton */}
                        {!imageLoaded && <Skeleton variant="rectangular" className="image-skeleton" animation="wave" />}
                    </Box>

                    {/* Animated Title */}
                    <Box className="title-container">
                        <Box ref={textRef} className="campaign-title">
                            <CampaignIcon className="title-icon" />
                            {isLoading ? "Loading campaign..." : campaignTitle}
                        </Box>
                    </Box>

                    {/* Navigation Controls */}
                    <Box className="campaign-controls">
                        {/* Previous Button */}
                        <Box className="control-left">
                            {currentIndex > 0 && (
                                <Button
                                    onClick={handlePrev}
                                    variant="contained"
                                    className="nav-button prev-button"
                                    startIcon={<ArrowBackIosIcon />}
                                >
                                    {buttonLabelsPrev[currentIndex - 1]}
                                </Button>
                            )}
                        </Box>

                        {/* Progress Dots */}
                        <Box className="progress-dots">
                            {images.map((_, index) => (
                                <IconButton
                                    key={index}
                                    onClick={() => handleDotClick(index)}
                                    className={`dot ${index === currentIndex ? "active" : ""}`}
                                    size="small"
                                >
                                    <FiberManualRecordIcon />
                                </IconButton>
                            ))}
                        </Box>

                        {/* Next Button */}
                        <Box className="control-right">
                            {currentIndex < images.length - 1 && (
                                <Button
                                    onClick={handleNext}
                                    variant="contained"
                                    className="nav-button next-button"
                                    endIcon={<ArrowForwardIosIcon />}
                                >
                                    {buttonLabelsNext[currentIndex]}
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Loading Overlay */}
                    {isLoading && (
                        <Box className="loading-overlay">
                            <Box className="loading-content">
                                <Box className="loading-spinner" />
                                <Box className="loading-text">Loading campaign...</Box>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}

export default Campaign
