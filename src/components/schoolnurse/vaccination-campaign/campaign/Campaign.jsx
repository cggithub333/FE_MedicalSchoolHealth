import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import IconButton from "@mui/material/IconButton"
import Skeleton from "@mui/material/Skeleton"
import VaccinesIcon from "@mui/icons-material/Vaccines"
// import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
// import ArrowForwardIosIcon from "@mui/material/ArrowForwardIos"
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import "./VaccinationCampaign.scss"

// Import vaccination images
import img1 from "../../../../assets/images/1.jpg"
import img2 from "../../../../assets/images/2.jpg"
import img3 from "../../../../assets/images/3.jpg"
import img4 from "../../../../assets/images/4.jpg"
import img5 from "../../../../assets/images/5.jpg"

// custom hook
import { useNewestVaccinationCampaign } from "../../../../hooks/schoolnurse/vaccination/campaign/useNewestCampaignByStatus"

const VaccinationCampaign = () => {
    const textRef = useRef()
    const navigate = useNavigate()
    const [currentIndex, setCurrentIndex] = useState(0)
    const cardRef = useRef()
    const [isVisible, setIsVisible] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isAutoPlaying, setIsAutoPlaying] = useState(true)
    const autoPlayRef = useRef()

    const images = [img1, img2, img3, img4, img5]
    const { newestVaccinationCampaign, isLoading } = useNewestVaccinationCampaign()

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

    // Get campaign title from your data structure
    let campaignTitle = "Vaccination Campaign - Welcome!"
    if (!isLoading && newestVaccinationCampaign && newestVaccinationCampaign.length > 0) {
        if (newestVaccinationCampaign[0].campaign && newestVaccinationCampaign[0].campaign.notes) {
            campaignTitle = newestVaccinationCampaign[0].campaign.notes
        }
    }

    return (
        <Box className="vaccination-campaign-container">
            <Card ref={cardRef} className={`vaccination-campaign-card ${isVisible ? "visible" : "hidden"}`} elevation={8}>
                <CardContent className="vaccination-campaign-content">
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
                                    alt={`Vaccination Campaign ${index + 1}`}
                                    className={`vaccination-campaign-image ${imageLoaded ? "loaded" : ""}`}
                                    onLoad={index === currentIndex ? handleImageLoad : undefined}
                                />
                                <Box className="image-overlay" />
                            </Box>
                        ))}

                        {/* Loading Skeleton */}
                        {!imageLoaded && <Skeleton variant="rectangular" className="image-skeleton" animation="wave" />}
                    </Box>

                    {/* Animated Title */}
                    <Box className="title-container">
                        <Box ref={textRef} className="vaccination-campaign-title">
                            <VaccinesIcon className="title-icon" />
                            {isLoading ? "Loading vaccination campaign..." : campaignTitle}
                        </Box>
                    </Box>

                    {/* Navigation Controls */}
                    <Box className="vaccination-campaign-controls">
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
                                <Box className="loading-text">Loading vaccination campaign...</Box>
                            </Box>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
}

export default VaccinationCampaign
