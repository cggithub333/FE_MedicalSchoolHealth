"use client"
import { useState } from "react"
import {
    Container,
    Typography,
    Card,
    CardContent,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Avatar,
    Divider,
    Pagination
} from "@mui/material"
import { Medication, Search, FilterList } from "@mui/icons-material"
import { TypographyInheritContext } from "@mui/joy/Typography/Typography"

// const medicationPreparations = [
//     {
//         pupilId: "PP0006",
//         className: "1A",
//         sendMedicationId: 101,
//         medicationName: "Paracetamol",
//         diseaseName: "Fever and mild pain",
//         unitMedicationAndUsage: "1 tablet every 6 hours",
//     },
//     {
//         pupilId: "PP0006",
//         className: "1A",
//         sendMedicationId: 101,
//         medicationName: "Paracetamol type 2",
//         diseaseName: "Fever and mild pain",
//         unitMedicationAndUsage: "1 tablet every 6 hours",
//     },
//     {
//         pupilId: "PP0007",
//         className: "2C",
//         sendMedicationId: 102,
//         medicationName: "Ibuprofen type 2",
//         diseaseName: "Inflammation and pain",
//         unitMedicationAndUsage: "1 tablet every 8 hours after meals",
//     },
//     {
//         pupilId: "PP0007",
//         className: "2C",
//         sendMedicationId: 102,
//         medicationName: "Ibuprofen",
//         diseaseName: "Inflammation and pain",
//         unitMedicationAndUsage: "1 tablet every 8 hours after meals",
//     },
//     {
//         pupilId: "PP0008",
//         className: "5B",
//         sendMedicationId: 103,
//         medicationName: "Loratadine",
//         diseaseName: "Allergic rhinitis",
//         unitMedicationAndUsage: "1 tablet once daily",
//     },
// ]


import useMedicationPreparation from "@hooks/schoolnurse/send-medication/useMedicationPreparation"

const ITEMS_EACH_PAGE = 10;
const MedicationPreparation = () => {

    // run custom hook to fetch medication preparations
    const { medicationPreparations, loading, error, refetch } = useMedicationPreparation(5, 1) // (grade, session)

    // debug:
    console.log("medicationPreparations:", JSON.stringify(medicationPreparations, null, 2))

    // State for filters
    const [selectedGrade, setSelectedGrade] = useState(1)
    const [selectedSession, setSelectedSession] = useState(1)
    const [currPage, setCurrPage] = useState(1)
    const [filteredMssgNoRecords, setFilteredMssgNoRecords] = useState("")

    // Sort medications by className
    const sortedMedications = [...(medicationPreparations || [])].sort((a, b) => {
        // Extract grade number and class letter for proper sorting
        const getGradeAndClass = (gradeName) => {
            const grade = Number.parseInt((gradeName).charAt(0))
            const classLetter = gradeName.charAt(1)
            return { grade, classLetter }
        }

        const aData = getGradeAndClass(a.gradeName)
        const bData = getGradeAndClass(b.gradeName)

        // First sort by grade number
        if (aData.grade !== bData.grade) {
            return aData.grade - bData.grade
        }
        // Then sort by class letter
        return aData.classLetter.localeCompare(bData.classLetter)
    })

    // Handle search button click
    const handleSearchClick = () => {
        // debug:
        setFilteredMssgNoRecords(`No results for searching medications of Grade: ${selectedGrade}, Session: ${selectedSession}`)

        if (!selectedGrade || !selectedSession || (selectedGrade < 1 || selectedGrade > 5) || (selectedSession < 1 || selectedSession > 3)) {
            console.error("Invalid grade or session selected")
            return
        }
        else {
            refetch(selectedGrade, selectedSession) // Refetch with selected filters
            setCurrPage(1) // Reset to first page after search
        }
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4 }}>
                <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                    <Medication />
                </Avatar>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        Medication Preparation
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Prepare and organize medications for administration
                    </Typography>
                </Box>
            </Box>

            {/* Medications Table */}
            <Card sx={{ mb: 4 }}>
                <CardContent sx={{ p: 0 }}>
                    {/* <Box sx={{ p: 3, pb: 0 }}>
                        <Typography variant="h6" fontWeight="bold">
                            Medication List ({sortedMedications.length} items)
                        </Typography>
                    </Box> */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "primary.50" }}>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold" textAlign={'center'}>
                                            Class Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold" textAlign={'center'}>
                                            Pupil Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Medication Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            Disease Name
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight="bold" >
                                            Usage and Quantity
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedMedications.map((medication, index) => {

                                    if (!medication) {
                                        return null; // Skip rendering if medication is undefined
                                    }

                                    // pagination logic:
                                    const startIndex = (currPage - 1) * ITEMS_EACH_PAGE;
                                    const endIndex = startIndex + ITEMS_EACH_PAGE;
                                    if (index < startIndex || index >= endIndex) {
                                        return null; // Skip rendering this row
                                    }

                                    const className = medication.gradeName;
                                    let realClassName = className.split(" ")[1]; 

                                    return (
                                        <TableRow key={`${medication.sendMedicationId}-${index}`} sx={{ "&:hover": { bgcolor: "grey.50" } }}>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold" color="primary.main" textAlign={'center'}>
                                                    {realClassName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {`${medication.pupilLastName} ${medication.pupilFirstName}`}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {medication.medicationName}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{medication.diseaseName}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{medication.unitAndUsage}</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                                {sortedMedications.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                            <Typography variant="body1" color="text.secondary">
                                                {filteredMssgNoRecords || "No records found. Please adjust your filters."}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        <Grid container mt={3} ml={5}>
                            <Grid item size={{xs: 12, md: 6}}>
                                <Pagination count={(Math.ceil(sortedMedications.length / ITEMS_EACH_PAGE) || 1)} 
                                            variant="outlined"
                                            color="primary"
                                            onChange={(event, page) => setCurrPage(page)}/>
                            </Grid>
                        </Grid>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Filter Section */}
            <Card>
                <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
                        <FilterList color="primary" />
                        <Typography variant="h6" fontWeight="bold">
                            Search Filters
                        </Typography>
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3} alignItems="center">
                        <Grid item size={{xs:12, md:4}}>
                            <FormControl fullWidth>
                                <InputLabel>Grade</InputLabel>
                                <Select value={selectedGrade} label="Grade" onChange={(e) => setSelectedGrade(e.target.value)}>
                                    <MenuItem value={1}>Grade 1</MenuItem>
                                    <MenuItem value={2}>Grade 2</MenuItem>
                                    <MenuItem value={3}>Grade 3</MenuItem>
                                    <MenuItem value={4}>Grade 4</MenuItem>
                                    <MenuItem value={5}>Grade 5</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item size={{xs:12, md:4}}>
                            <FormControl fullWidth>
                                <InputLabel>Session</InputLabel>
                                <Select value={selectedSession} label="Session" onChange={(e) => setSelectedSession(e.target.value)}>
                                    <MenuItem value={1}>Session 1</MenuItem>
                                    <MenuItem value={2}>Session 2</MenuItem>
                                    <MenuItem value={3}>Session 3</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item size={{xs:12, md:4}}>
                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<Search />}
                                onClick={handleSearchClick}
                                sx={{
                                    height: 56,
                                    width: "100%",
                                    fontWeight: "bold",
                                }}
                            >
                                Search Medications
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 2, p: 2, bgcolor: "info.50", borderRadius: 1 }}>
                        <Typography variant="body2" color="info.main">
                            <strong>Current Selection:</strong> Grade {selectedGrade}, Session {selectedSession}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Container>
    )
}

export default MedicationPreparation