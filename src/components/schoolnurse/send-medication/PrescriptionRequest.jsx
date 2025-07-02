"use client"
import { Box, Typography, Card, CardContent, Chip, Avatar, Button, Paper } from "@mui/material"
import { LocalPharmacy, Person, CalendarToday, Medication, ArrowForward, ViewList } from "@mui/icons-material"
import { Link } from "react-router-dom"

import { useNavigate } from "react-router-dom"


const pendingMedicationRequests = [
    {
        pupilId: "PP0001",
        sendMedicationId: 2,
        diseaseName: "Seasonal allergy",
        startDate: "03-07-2025",
        endDate: "08-07-2025",
        requestedDate: "02-07-2025 08:15:10",
        prescriptionImage: "https://cdn.medigoapp.com/website/uploads/2022/10/toa-thuoc-mau-1.jpg",
        note: "Child is sneezing and has watery eyes in the morning.",
        status: "PENDING",
        medicationItems: [
            {
                medicationId: 4,
                medicationName: "Loratadine",
                unitAndUsage: "1 tablet for allergy relief",
                medicationSchedule: "After breakfast: 8h00-8h30",
            },
            {
                medicationId: 5,
                medicationName: "Saline nasal spray",
                unitAndUsage: "1 spray per nostril",
                medicationSchedule: "Before bed: 20h30-21h00",
            },
        ],
        medicationLogs: [],
    },
    {
        pupilId: "PP0002",
        sendMedicationId: 3,
        diseaseName: "Stomach flu",
        startDate: "02-07-2025",
        endDate: "06-07-2025",
        requestedDate: "02-07-2025 12:33:44",
        prescriptionImage: "https://images.benhvienvinhchuc.vn/2023/03/toa-thuoc-viem-da-co-dia.jpg",
        note: "She has mild diarrhea and stomach cramps.",
        status: "PENDING",
        medicationItems: [
            {
                medicationId: 6,
                medicationName: "ORS (Oral Rehydration Salts)",
                unitAndUsage: "100ml after each loose stool",
                medicationSchedule: "As needed",
            },
            {
                medicationId: 7,
                medicationName: "Buscopan",
                unitAndUsage: "1 tablet to ease abdominal pain",
                medicationSchedule: "After lunch: 12h30-13h00",
            },
        ],
        medicationLogs: [],
    },
    {
        pupilId: "PP0003",
        sendMedicationId: 4,
        diseaseName: "Mild fever and fatigue",
        startDate: "04-07-2025",
        endDate: "07-07-2025",
        requestedDate: "03-07-2025 10:20:33",
        prescriptionImage: "https://toathuoc.vn/wp-content/uploads/2021/06/toa-thuoc-1.jpg",
        note: "Child feels tired with a slight fever.",
        status: "PENDING",
        medicationItems: [
            {
                medicationId: 8,
                medicationName: "Paracetamol 250mg",
                unitAndUsage: "1 tablet to reduce fever",
                medicationSchedule: "Every 6 hours as needed",
            },
        ],
        medicationLogs: [],
    },
    {
        pupilId: "PP0004",
        sendMedicationId: 5,
        diseaseName: "Eye infection",
        startDate: "05-07-2025",
        endDate: "09-07-2025",
        requestedDate: "04-07-2025 15:45:01",
        prescriptionImage: "https://trungtamthuoc.com/images/ckeditor/toathuoc.jpg",
        note: "His right eye is red and watery.",
        status: "PENDING",
        medicationItems: [
            {
                medicationId: 9,
                medicationName: "Tobramycin eye drops",
                unitAndUsage: "1 drop in affected eye",
                medicationSchedule: "Morning, noon, and evening",
            },
        ],
        medicationLogs: [],
    },
    {
        pupilId: "PP0005",
        sendMedicationId: 6,
        diseaseName: "Sore throat",
        startDate: "01-07-2025",
        endDate: "05-07-2025",
        requestedDate: "01-07-2025 19:12:59",
        prescriptionImage: "https://ytevietnhat.com/upload/images/news/toathuocmau.jpg",
        note: "She complains of throat pain when swallowing.",
        status: "PENDING",
        medicationItems: [
            {
                medicationId: 10,
                medicationName: "Cefixime 100mg",
                unitAndUsage: "1 tablet to treat infection",
                medicationSchedule: "After dinner: 18h00-18h30",
            },
            {
                medicationId: 11,
                medicationName: "Betadine gargle",
                unitAndUsage: "Gargle for 30 seconds",
                medicationSchedule: "Morning and night",
            },
        ],
        medicationLogs: [],
    },
    {
        pupilId: "PP0006",
        sendMedicationId: 1,
        diseaseName: "Common cold with cough",
        startDate: "01-07-2025",
        endDate: "10-07-2025",
        requestedDate: "01-07-2025 21:54:22",
        prescriptionImage: "https://anh.24h.com.vn/upload/4-2014/images/2014-10-24/1414124020-toa-thuoc.jpg",
        note: "My child has a mild cough and sore throat. Please help him take the medicine on time.",
        status: "PENDING",
        medicationItems: [
            {
                medicationId: 1,
                medicationName: "Dextromethorphan",
                unitAndUsage: "1 capsule taken by mouth to suppress dry cough",
                medicationSchedule: "After breakfast: 9h00-9h30",
            },
            {
                medicationId: 2,
                medicationName: "Guaifenesin",
                unitAndUsage: "1 tablet taken to loosen mucus and ease chest congestion",
                medicationSchedule: "After lunch: 11h30-12h00",
            },
            {
                medicationId: 3,
                medicationName: "Strepsils lozenges",
                unitAndUsage: "1 lozenge dissolved slowly in mouth to soothe throat",
                medicationSchedule: "Before lunch: 10h30-11h00",
            },
        ],
        medicationLogs: [],
    },
    {
        pupilId: "PP0007",
        sendMedicationId: 7,
        diseaseName: "Skin rash",
        startDate: "06-07-2025",
        endDate: "11-07-2025",
        requestedDate: "05-07-2025 11:00:15",
        prescriptionImage: "https://cdn.medigoapp.com/website/uploads/2022/11/toa-thuoc-bac-si.jpg",
        note: "Red rash appeared on his arms and back.",
        status: "PENDING",
        medicationItems: [
            {
                medicationId: 12,
                medicationName: "Hydrocortisone cream",
                unitAndUsage: "Apply a thin layer on affected area",
                medicationSchedule: "Morning and night",
            },
            {
                medicationId: 13,
                medicationName: "Cetirizine",
                unitAndUsage: "1 tablet for itching",
                medicationSchedule: "After dinner: 19h00-19h30",
            },
        ],
        medicationLogs: [],
    },
]

const PrescriptionRequest = ({ linkPrescriptionRequestPage }) => {

    const navigate = useNavigate();


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