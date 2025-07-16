"use client"
import { Box, Typography, Card, CardContent, Chip, Avatar, Button, Paper, Container, Skeleton } from "@mui/material"
import { LocalPharmacy, Person, CalendarToday, Medication, ArrowForward, ViewList } from "@mui/icons-material"
import { Link } from "react-router-dom"

import { useNavigate } from "react-router-dom"

import useAllPendingPrescriptions from "@hooks/schoolnurse/useAllPendingPrescriptions"

const renderLoadingSkeleton = ({ length: length, linkPrescriptionRequestPage: linkPrescriptionRequestPage }) => (
    <Container maxWidth="md" sx={{ py: 3 }}>
        {Array.from({ length: length }, (_, i) => i).map((index) => (
            <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Skeleton variant="circular" width={48} height={48} />
                        <Box sx={{ flex: 1 }}>
                            <Skeleton variant="text" width="80%" height={24} />
                            <Skeleton variant="text" width="60%" height={20} />
                        </Box>
                        <Skeleton variant="rectangular" width={80} height={32} />
                    </Box>
                </CardContent>
            </Card>
        ))}
        <Button
            fullWidth
            variant="outlined"
            startIcon={<ViewList />}
            sx={{
                borderStyle: "dashed",
                borderWidth: 2,
                py: 1,
                "&:hover": {
                    borderStyle: "solid",
                    bgcolor: "primary.50",
                },
                bgcolor: "#fff"
            }}
            onClick={() => {
                // Navigate to the full prescription requests page:
                navigate(`${linkPrescriptionRequestPage}`);
            }}
        >
            View All Requests ({length})
        </Button>
    </Container>
)

const PrescriptionRequest = ({ linkPrescriptionRequestPage }) => {

    const navigate = useNavigate();

    const { pendingMedicationRequests, loading, error, refetch } = useAllPendingPrescriptions()

    if (loading) {
        if (pendingMedicationRequests.length === 0) {
            return renderLoadingSkeleton({ length: 1, linkPrescriptionRequestPage: linkPrescriptionRequestPage });
        }
        return renderLoadingSkeleton({ length: pendingMedicationRequests.length, linkPrescriptionRequestPage: linkPrescriptionRequestPage }); 
    }

    // Show only first 5 items
    const displayedRequests = pendingMedicationRequests.slice(0, 5)

    const formatDate = (dateString) => {
        const [datePart] = dateString.split(" ")
        const [day, month, year] = datePart.split("-")
        return `${day}/${month}`
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "warning"
            case "APPROVED":
                return "success"
            case "REJECTED":
                return "error"
            default:
                return "default"
        }
    }

    return (
        <Paper
            sx={{
                width: "100%",
                maxWidth: "400px", // Constrains to about 35-40% of typical dashboard
                height: "fit-content",
                p: 2,
                bgcolor: "background.paper",
            }}
        >
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                    <LocalPharmacy fontSize="small" />
                </Avatar>
                <Typography variant="h6" fontWeight="bold">
                    Prescription Requests
                </Typography>
                <Chip label={displayedRequests.length} size="small" color="primary" sx={{ ml: "auto" }} />
            </Box>

            {/* Request Cards */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
                {displayedRequests.map((request) => (
                    <Link
                        key={request.sendMedicationId}
                        to={linkPrescriptionRequestPage} // You'll add the actual link later
                        style={{ textDecoration: "none" }}
                    >
                        <Card
                            sx={{
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                "&:hover": {
                                    transform: "translateX(4px)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                },
                            }}
                        >
                            <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                                {/* Header Row */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <Person fontSize="small" color="primary" />
                                        <Typography variant="body2" fontWeight="bold">
                                            {request.pupilId}
                                        </Typography>
                                    </Box>
                                    <Chip label={request.status} color={getStatusColor(request.status)} size="small" />
                                </Box>

                                {/* Disease Name */}
                                <Typography
                                    variant="body1"
                                    fontWeight="bold"
                                    sx={{
                                        mb: 1,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {request.diseaseName}
                                </Typography>

                                {/* Bottom Row */}
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        <CalendarToday fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {formatDate(request.requestedDate)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                        <Medication fontSize="small" color="action" />
                                        <Typography variant="body2" color="text.secondary">
                                            {request.medicationItems.length} meds
                                        </Typography>
                                        <ArrowForward fontSize="small" color="action" sx={{ ml: 0.5 }} />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </Box>

            {/* View All Button */}
            <Button
                fullWidth
                variant="outlined"
                startIcon={<ViewList />}
                sx={{
                    borderStyle: "dashed",
                    borderWidth: 2,
                    py: 1,
                    "&:hover": {
                        borderStyle: "solid",
                        bgcolor: "primary.50",
                    },
                }}
                onClick={() => {
                    // Navigate to the full prescription requests page:
                    navigate('./prescription-requests');
                }}
            >
                View All Requests ({pendingMedicationRequests.length})
            </Button>
        </Paper>
    )
}

export default PrescriptionRequest;