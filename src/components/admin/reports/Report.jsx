import { useEffect, useState } from "react"
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import { Card, CardContent, CardHeader, Typography } from "@mui/material"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts"
import { School, LocalHospital, Vaccines, EventNote, Medication } from "@mui/icons-material"

import "./StyleReport.scss"

const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#3B82F6", "#EC4899", "#8B5CF6", "#14B8A6"]

// Styled Item component as provided by the user
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(2), // Increased padding for better visual
    textAlign: "center",
    color: (theme.vars ?? theme).palette.text.secondary,
    ...theme.applyStyles("dark", {
        backgroundColor: "#1A2027",
    }),
    borderRadius: "12px", // Added border-radius for consistent design
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)", // Softer shadow
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
}))

export default function AdminReportsDashboard() {
    // Summary Data
    const [totalPupils, setTotalPupils] = useState(0)
    const [totalHealthChecks, setTotalHealthChecks] = useState(0)
    const [totalVaccinations, setTotalVaccinations] = useState(0)
    const [totalMedicalEvents, setTotalMedicalEvents] = useState(0)
    const [prescriptionsLastMonth, setPrescriptionsLastMonth] = useState({ count: 0, commonTypes: [] })
    const currentYear = new Date().getFullYear();
    // Chart Data
    const [campaigns, setCampaigns] = useState([])
    const [vaccinations, setVaccinations] = useState([])
    const [events, setEvents] = useState([])

    useEffect(() => {
        // Mock Summary Data
        setTotalPupils(480)
        setTotalHealthChecks(520)
        setTotalVaccinations(275)
        setTotalMedicalEvents(74)
        setPrescriptionsLastMonth({
            count: 35,
            commonTypes: ["Antibiotics", "Allergy Meds", "Pain Relievers"],
        })

        // Mock Chart Data (from previous response)
        setCampaigns([
            { title: "Health Check Q1", pupilCount: 120 },
            { title: "Health Check Q2", pupilCount: 140 },
            // { title: "Mid-Year Campaign", pupilCount: 100 },
            // { title: "Year End Review", pupilCount: 160 },
        ])
        setVaccinations([
            { vaccine: "Hepatitis A", count: 60 },
            { vaccine: "Measles", count: 45 },
            // { vaccine: "Polio", count: 70 },
            // { vaccine: "COVID-19", count: 100 },
        ])
        setEvents([
            { date: "Jan", eventCount: 10 },
            { date: "Feb", eventCount: 14 },
            { date: "Mar", eventCount: 18 },
            { date: "Apr", eventCount: 12 },
            { date: "May", eventCount: 20 },
        ])
    }, [])

    return (
        <>
            <Typography
                variant="h3"
                component="h1"
                sx={{ fontWeight: 800, textAlign: "center", color: "#1f2937", letterSpacing: "-0.025em", paddingBottom: "20px" }}
            >
                Reports In {currentYear}
            </Typography>
            <Grid container spacing={2}>
                {/* Summary Boxes */}
                <Grid item size={{ xs: 12, sm: 6, md: 3 }} >
                    <Item className="fade-in">
                        <School sx={{ fontSize: 40, color: COLORS[0], mb: 1 }} />
                        <Typography variant="h8" sx={{ color: "#4b5563", mb: 1 }}>
                            Total Pupils
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS[0] }}>
                            {totalPupils}
                        </Typography>
                    </Item>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Item className="fade-in">
                        <LocalHospital sx={{ fontSize: 40, color: COLORS[1], mb: 1 }} />
                        <Typography variant="h8" sx={{ color: "#4b5563", mb: 1 }}>
                            Health Checks
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS[1] }}>
                            Total Pupils : {totalHealthChecks}
                        </Typography>
                    </Item>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Item className="fade-in">
                        <Vaccines sx={{ fontSize: 40, color: COLORS[2], mb: 1 }} />
                        <Typography variant="h8" sx={{ color: "#4b5563", mb: 1 }}>
                            Vaccinations
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS[2] }}>
                            Total Pupils : {totalVaccinations}
                        </Typography>
                    </Item>
                </Grid>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    <Item className="fade-in">
                        <EventNote sx={{ fontSize: 40, color: COLORS[3], mb: 1 }} />
                        <Typography variant="h8" sx={{ color: "#4b5563", mb: 1 }}>
                            Total Medical Events
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: "bold", color: COLORS[3] }}>
                            {totalMedicalEvents}
                        </Typography>
                    </Item>
                </Grid>

                {/* Health Check Campaign Chart */}
                <Grid item size={{ xs: 7 }}>
                    <Card className="card fade-in">
                        <CardHeader title="Health Check Campaigns" className="cardHeader" />
                        <CardContent className="cardContent">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={campaigns} >
                                    <XAxis dataKey="title" axisLine={false} tickLine={false} className="chartAxisText" />
                                    <YAxis axisLine={false} tickLine={false} className="chartAxisText" />
                                    <Tooltip
                                        cursor={{ fill: "transparent" }}
                                        contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "none" }}
                                    />
                                    <Bar dataKey="pupilCount" fill={COLORS[0]} barSize={40} radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Medical Event Chart */}
                <Grid item size={{ xs: 5 }}>
                    <Card className="card fade-in">
                        <CardHeader title="Medical Event Trends" className="cardHeader" />
                        <CardContent className="cardContent">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={events} >
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} className="chartAxisText" />
                                    <YAxis axisLine={false} tickLine={false} className="chartAxisText" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "none" }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="eventCount"
                                        stroke={COLORS[1]}
                                        strokeWidth={2}
                                        dot={{ r: 6, fill: COLORS[1], stroke: "white", strokeWidth: 2 }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>
                {/* Vaccination Campaign Chart */}
                <Grid item size={{ xs: 7 }}>
                    <Card className="card fade-in">
                        <CardHeader title="Vaccination Campaigns" className="cardHeader" />
                        <CardContent className="cardContent pieChartContent">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={vaccinations}
                                        dataKey="count"
                                        nameKey="vaccine"
                                        outerRadius={100}
                                        innerRadius={70}
                                        paddingAngle={5}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    >
                                        {vaccinations.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: "8px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: "none" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Prescription in 1 Month */}
                <Grid item size={{ xs: 5 }}>
                    <Item className="fade-in">
                        <Medication sx={{ fontSize: 40, color: COLORS[4], mb: 1 }} />
                        <Typography variant="h6" sx={{ color: "#4b5563", mb: 1 }}>
                            Prescriptions (Last Month)
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: "bold", color: COLORS[4], mb: 2 }}>
                            {prescriptionsLastMonth.count}
                        </Typography>
                    </Item>
                </Grid>
            </Grid>
        </>
    )
}
