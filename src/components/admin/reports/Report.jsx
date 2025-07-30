import { useEffect, useState, useMemo } from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import { Card, CardContent, CardHeader, Typography } from "@mui/material"
import { LineChart } from "@mui/x-charts/LineChart"
import { BarChart } from "@mui/x-charts/BarChart"
import { PieChart } from "@mui/x-charts/PieChart"
import { School, LocalHospital, Vaccines, EventNote, Medication } from "@mui/icons-material"
import "./StyleReport.scss"

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6"]

// Mock hook - replace with your actual hook
import { useGetReportForCurrentYear } from "../../../hooks/common/useGetReportForCurrentYear"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
    "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
    },
}))

export default function AdminReportsDashboard() {
    const [totalPupils, setTotalPupils] = useState(0)
    const [totalHealthChecks, setTotalHealthChecks] = useState(0)
    const [totalVaccinations, setTotalVaccinations] = useState(0)
    const [totalMedicalEvents, setTotalMedicalEvents] = useState(0)
    const [prescriptionsLastMonth, setPrescriptionsLastMonth] = useState({ count: 0, commonTypes: [] })
    const currentYear = new Date().getFullYear()

    const { reportData, error, isLoading } = useGetReportForCurrentYear()

    useEffect(() => {
        if (!reportData) return
        setTotalPupils(reportData.totalPupils || 0)
        setTotalHealthChecks(reportData.totalHealthChecks || 0)
        setTotalVaccinations(reportData.totalVaccinations || 0)
        setTotalMedicalEvents(reportData.totalMedicalEvents || 0)
        setPrescriptionsLastMonth(reportData.prescriptionsLastMonth || { count: 0, commonTypes: [] })
    }, [reportData])

    // Compute chart data with useMemo to avoid chart rerender loops
    const newestCampaigns = useMemo(() => (reportData?.campaigns || []).slice().reverse().slice(0, 3), [reportData])
    const campaignLabels = useMemo(() => newestCampaigns.map((campaign, index) =>
        campaign.campaignTitle.length > 15 ? `Campaign ${index + 1}` : campaign.campaignTitle,
    ), [newestCampaigns])
    const agreedData = useMemo(() => newestCampaigns.map((c) => c.agreedCount || 0), [newestCampaigns])
    const examinedData = useMemo(() => newestCampaigns.map((c) => c.examinedCount || 0), [newestCampaigns])

    const totalAgreed = useMemo(() => (reportData?.vaccinations || []).reduce((sum, v) => sum + v.agreedCount, 0), [reportData])
    const totalDisagreed = useMemo(() => (reportData?.vaccinations || []).reduce((sum, v) => sum + v.disagreedCount, 0), [reportData])
    const totalVaccinated = useMemo(() => (reportData?.vaccinations || []).reduce((sum, v) => sum + v.vaccinatedCount, 0), [reportData])
    const totalAbsent = useMemo(() => (reportData?.vaccinations || []).reduce((sum, v) => sum + v.absentCount, 0), [reportData])

    const vaccinationPieData = useMemo(() => [
        { id: 0, value: totalAgreed, label: "Agreed", color: COLORS[1] },
        { id: 1, value: totalDisagreed, label: "Disagreed", color: COLORS[3] },
        { id: 2, value: totalVaccinated, label: "Vaccinated", color: COLORS[0] },
        { id: 3, value: totalAbsent, label: "Absent", color: COLORS[2] },
    ], [totalAgreed, totalDisagreed, totalVaccinated, totalAbsent])

    const diseaseMap = useMemo(() => {
        const map = {};
        (reportData?.vaccinations || []).forEach((v) => {
            if (map[v.diseaseName]) {
                map[v.diseaseName] += v.vaccinatedCount;
            } else {
                map[v.diseaseName] = v.vaccinatedCount;
            }
        });
        return map;
    }, [reportData])
    const diseaseLabels = useMemo(() => Object.keys(diseaseMap), [diseaseMap])
    const diseaseBarData = useMemo(() => Object.values(diseaseMap), [diseaseMap])

    // Memoize chart props to prevent unnecessary rerenders
    const lineChartSeries = useMemo(() => [
        {
            data: agreedData,
            label: "Agreed",
            yAxisId: "leftAxisId",
            color: COLORS[1],
        },
        {
            data: examinedData,
            label: "Examined",
            yAxisId: "rightAxisId",
            color: COLORS[0],
        },
    ], [agreedData, examinedData])
    const lineChartXAxis = useMemo(() => [{ scaleType: "point", data: campaignLabels }], [campaignLabels])
    const lineChartYAxis = useMemo(() => [
        { id: "leftAxisId", width: 50 },
        { id: "rightAxisId", position: "right" },
    ], [])
    const lineChartMargin = useMemo(() => ({ left: 60, right: 60, top: 40, bottom: 60 }), [])

    const barChartXAxis = useMemo(() => [{
        scaleType: "band",
        data: diseaseLabels,
        tickLabelStyle: {
            angle: -45,
            textAnchor: "end",
        },
    }], [diseaseLabels])
    const barChartSeries = useMemo(() => [{
        data: diseaseBarData,
        color: COLORS[2],
        label: "Vaccinations",
    }], [diseaseBarData])
    const barChartMargin = useMemo(() => ({ left: 60, right: 20, top: 40, bottom: 80 }), [])

    // Memoized medical event data for chart
    const medicalEvents = useMemo(() => (reportData?.events || []), [reportData])

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography variant="h6">Loading...</Typography>
            </Box>
        )
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <Typography variant="h6" color="error">
                    Error loading data
                </Typography>
            </Box>
        )
    }

    return (
        <Box >
            <Typography variant="h3" component="h1" className="dashboardTitle">
                Reports In {currentYear}
            </Typography>

            <Grid container spacing={4}>
                {/* Summary Cards - Updated Grid syntax */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Item className="fade-in">
                        <School sx={{ fontSize: 48, color: COLORS[0], mb: 2 }} />
                        <Typography variant="body1" sx={{ color: "#4b5563", mb: 1, fontWeight: 500 }}>
                            Total Pupils
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: COLORS[0] }}>
                            {totalPupils}
                        </Typography>
                    </Item>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Item className="fade-in">
                        <LocalHospital sx={{ fontSize: 48, color: COLORS[1], mb: 2 }} />
                        <Typography variant="body1" sx={{ color: "#4b5563", mb: 1, fontWeight: 500 }}>
                            Health Checks
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: COLORS[1] }}>
                            {totalHealthChecks}
                        </Typography>
                    </Item>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Item className="fade-in">
                        <Vaccines sx={{ fontSize: 48, color: COLORS[2], mb: 2 }} />
                        <Typography variant="body1" sx={{ color: "#4b5563", mb: 1, fontWeight: 500 }}>
                            Vaccinations
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: COLORS[2] }}>
                            {totalVaccinations}
                        </Typography>
                    </Item>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Item className="fade-in">
                        <EventNote sx={{ fontSize: 48, color: COLORS[3], mb: 2 }} />
                        <Typography variant="body1" sx={{ color: "#4b5563", mb: 1, fontWeight: 500 }}>
                            Medical Events
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: COLORS[3] }}>
                            {totalMedicalEvents}
                        </Typography>
                    </Item>
                </Grid>

                {/* Health Check Campaigns */}
                <Grid size={{ xs: 12 }}>
                    <Card className="card fade-in">
                        <CardHeader
                            title="Health Check Campaigns"
                            className="cardHeader"
                            subheader="Agreed vs Examined counts for recent campaigns"
                        />
                        <CardContent className="cardContent">
                            {campaignLabels.length > 0 ? (
                                <LineChart
                                    height={350}
                                    series={lineChartSeries}
                                    xAxis={lineChartXAxis}
                                    yAxis={lineChartYAxis}
                                    margin={lineChartMargin}
                                />
                            ) : (
                                <Box sx={{ height: 350, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Typography variant="h6" color="textSecondary">
                                        No campaign data available
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Medical Event Trends Chart */}
                <Grid size={{ xs: 12 }}>
                    <Card className="card fade-in">
                        <CardHeader title="Medical Event Trends" className="cardHeader" />
                        <CardContent className="cardContent">
                            <LineChart
                                height={300}
                                series={[{
                                    data: medicalEvents.map(e => e.eventCount),
                                    label: "Events",
                                    color: COLORS[1],
                                }]}
                                xAxis={[{ scaleType: "point", data: medicalEvents.map(e => e.date) }]}
                                yAxis={[{ id: "leftAxisId", width: 50 }]}
                                margin={{ left: 40, right: 40, top: 20, bottom: 40 }}
                            />
                        </CardContent>
                    </Card>
                </Grid>


                {/* Vaccination Status Pie Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="card fade-in">
                        <CardHeader
                            title="Overall Vaccination Status"
                            className="cardHeader"
                            subheader="Distribution of vaccination responses"
                        />
                        <CardContent className="cardContent pieChartContent">
                            <PieChart
                                series={[
                                    {
                                        data: vaccinationPieData,
                                        highlightScope: { faded: "global", highlighted: "item" },
                                        faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
                                        innerRadius: 40,
                                        outerRadius: 120,
                                        paddingAngle: 2,
                                        cornerRadius: 5,
                                    },
                                ]}
                                height={300}
                                slotProps={{
                                    legend: {
                                        direction: "row",
                                        position: { vertical: "bottom", horizontal: "middle" },
                                        padding: 0,
                                    },
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Vaccination by Disease Bar Chart */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card className="card fade-in">
                        <CardHeader
                            title="Vaccinations by Disease"
                            className="cardHeader"
                            subheader="Number of vaccinations per disease type"
                        />
                        <CardContent className="cardContent">
                            {diseaseLabels.length > 0 ? (
                                <BarChart
                                    xAxis={barChartXAxis}
                                    series={barChartSeries}
                                    height={300}
                                    margin={barChartMargin}
                                />
                            ) : (
                                <Box sx={{ height: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Typography variant="h6" color="textSecondary">
                                        No vaccination data available
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>



                {/* Additional Metrics Row */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Item className="fade-in">
                        <Typography variant="h6" sx={{ color: "#4b5563", mb: 2, fontWeight: 600 }}>
                            Campaign Participation Rate
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: COLORS[5] }}>
                            {totalPupils > 0 ? Math.round((totalHealthChecks / totalPupils) * 100) : 0}%
                        </Typography>
                    </Item>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <Item className="fade-in">
                        <Typography variant="h6" sx={{ color: "#4b5563", mb: 2, fontWeight: 600 }}>
                            Vaccination Coverage
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: COLORS[6] }}>
                            {totalPupils > 0 ? Math.round((totalVaccinations / totalPupils) * 100) : 0}%
                        </Typography>
                    </Item>
                </Grid>

                <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                    <Item className="fade-in">
                        <Typography variant="h6" sx={{ color: "#4b5563", mb: 2, fontWeight: 600 }}>
                            Prescriptions
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: "bold", color: COLORS[7] }}>
                            {prescriptionsLastMonth.count}
                        </Typography>
                    </Item>
                </Grid>
            </Grid>
        </Box>
    )
}
