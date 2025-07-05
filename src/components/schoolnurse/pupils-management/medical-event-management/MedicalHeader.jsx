import { useState } from "react";
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Fade,
    Grow,
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
    Avatar,
    Checkbox,
    IconButton,
    Menu,
    MenuItem as MenuItemComponent,
    InputAdornment,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import MedicalEventResultForm from '../medical-event-result/EventFormResult.jsx';
import "./StyleMedicalHeader.scss";
import {
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material"

//custom hooks
import { useGetPupilsInformation } from "../../../../hooks/schoolnurse/new-event/useGetPupilsInformation.js";
import { useGetAllMedicalEvent } from "../../../../hooks/schoolnurse/new-event/useGetAllMedicalEvent.js"

const MedicalHeader = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [categoryFilter, setCategoryFilter] = useState("all")
    const [customerFilter, setCustomerFilter] = useState("all")
    const [selected, setSelected] = useState([])
    const [anchorEl, setAnchorEl] = useState(null)
    const [menuRowId, setMenuRowId] = useState(null)
    const [page, setPage] = useState(1)
    const [eventFilter, setEventFilter] = useState("event") // default is event
    const rowsPerPage = 5

    const { pupilsList, loading: pupilsLoading, error: pupilsError } = useGetPupilsInformation();
    const { medicalEventList, loading, error, refetch } = useGetAllMedicalEvent();


    const handleMenuClick = (event, rowId) => {
        setAnchorEl(event.currentTarget)
        setMenuRowId(rowId)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setMenuRowId(null)
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "Paid":
                return <CheckCircleIcon />
            case "Refunded":
                return <RefreshIcon />
            case "Cancelled":
                return <CancelIcon />
            default:
                return null
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case "low":
                return "success"
            case "medium":
                return "warning"
            case "high":
                return "error"
            default:
                return "default"
        }
    }

    // Pagination logic
    const filteredData = pupilsList.filter((row) => {
        const matchesSearch =
            row.pupilId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (row.firstName + ' ' + row.lastName).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGrade = categoryFilter === "all" || String(row.gradeId) === categoryFilter;
        return matchesSearch && matchesGrade;
    });
    const pageCount = Math.ceil(filteredData.length / rowsPerPage)
    const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelected(filteredData.map((row) => row.id))
        } else {
            setSelected([])
        }
    }

    const handleSelectRow = (event, id) => {
        if (event.target.checked) {
            setSelected([...selected, id])
        } else {
            setSelected(selected.filter((selectedId) => selectedId !== id))
        }
    }

    const isSelected = (id) => selected.includes(id)

    const [showForm, setShowForm] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(null);
    const statsData = [
        {
            title: "Total Pupils",
            value: pupilsList.length,
            subtitle: "All registered students",
            color: "primary",
            delay: 200,
        },
        {
            title: "Total Events",
            value: medicalEventList.length,
            subtitle: "Requiring medical attention",
            color: "secondary",
            delay: 400,
        }
    ];

    const handleShowResult = (eventId) => {
        setSelectedEventId(eventId);
        setShowResult(true);
    };
    const handleBackFromResult = () => {
        setShowResult(false);
        setSelectedEventId(null);
    };

    const handleNewEventClick = () => {
        setShowForm(true); // Show the form
    };

    const handleCancelForm = () => {
        setShowForm(false); // Hide the form
    };

    if (showResult) {
        return (
            <MedicalEventResultForm onBack={handleBackFromResult} eventId={selectedEventId} />
        );
    }


    return (
        <>
            <div maxWidth="xxl" className="medical-header" style={{}}>
                {/* Header Section */}
                <Box className="header-section" sx={{ position: 'relative' }}>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Fade in timeout={800}>
                                <Box className="header-content">
                                    <Typography variant="h2" className="main-title">
                                        Pupils Management
                                    </Typography>

                                    <Typography variant="h6" className="subtitle">
                                        Comprehensive health records and medical information system
                                    </Typography>
                                    <Box className="title-accent" />
                                </Box>
                            </Fade>
                        </Grid>
                    </Grid>
                </Box>

                {/* Stats Cards Section */}
                <Box className="stats-section">
                    <Grid container spacing={10}>
                        {statsData.map((stat, index) => (
                            <Grid item xs={12} sm={6} lg={3} key={stat.title}>
                                <Grow in timeout={stat.delay}>
                                    <Card
                                        className={`stat-card ${stat.color}`} // 🛠️ Fixed className bug here
                                        elevation={0}
                                        sx={{
                                            minHeight: 150,
                                            maxHeight: 150,
                                            minWidth: 200,
                                            maxWidth: 200,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                width: '100%',
                                                p: 1,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                height: '100%'
                                            }}
                                        >
                                            <Box className="stat-header" sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="body2" className="stat-title">
                                                    {stat.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="h3" className="stat-value" sx={{ mt: 1, mb: 1 }}>
                                                {stat.value}
                                            </Typography>
                                            <Typography variant="body2" className="stat-subtitle">
                                                {stat.subtitle}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grow>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </div>
            <div className="invoice-table-container" style={{ background: '#f7f9fb' }}>
                {/* Search and Filters */}
                <Box className="filters-container" sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    alignItems: 'center',
                    background: '#fff',
                    borderRadius: 2,
                    boxShadow: 1,
                    p: 2,
                    mb: 3,
                }}>
                    <TextField
                        className="search-field"
                        placeholder="Search by pupil name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 240, background: '#f5f7fa', borderRadius: 1 }}
                    />
                    <FormControl size="small" className="filter-select" sx={{ minWidth: 120 }}>
                        <InputLabel>Grade</InputLabel>
                        <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} label="Grade">
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="1">1</MenuItem>
                            <MenuItem value="2">2</MenuItem>
                            <MenuItem value="3">3</MenuItem>
                            <MenuItem value="4">4</MenuItem>
                            <MenuItem value="5">5</MenuItem>
                        </Select>
                    </FormControl>

                </Box>

                {/* Table */}
                <TableContainer component={Paper} className="table-container" sx={{ borderRadius: 3, boxShadow: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ background: '#f0f4f8' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Pupil</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Grade</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Contact</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pupilsLoading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#aaa' }}>
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#aaa' }}>
                                        No data found.
                                    </TableCell>
                                </TableRow>
                            ) : paginatedData.map((row) => {
                                return (
                                    <TableRow key={row.pupilId} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#f5f7fa' } }}>
                                        <TableCell>
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Avatar sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 600 }}>{row.firstName[0]}</Avatar>
                                                <Box>
                                                    <div style={{ fontWeight: 500 }}>{row.lastName} {row.firstName}</div>
                                                    <div style={{ fontSize: 12, color: '#888' }}>{row.pupilId}</div>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{row.gradeName}</TableCell>
                                        <TableCell>{row.gender === 'M' ? 'Male' : 'Female'}</TableCell>
                                        <TableCell>{row.parents && row.parents[0] ? `0${row.parents[0].phoneNumber}` : ''}</TableCell>
                                        <TableCell>
                                            <IconButton size="small" color="primary" sx={{ borderRadius: 2, background: '#e3f2fd', '&:hover': { background: '#bbdefb' } }} onClick={() => handleShowResult(row.pupilId)}>
                                                Details
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* Pagination Controls */}
                <Box display="flex" justifyContent="center" alignItems="center" mt={3} gap={2}>
                    <IconButton
                        size="small"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        sx={{ borderRadius: 2, background: '#f5f7fa', '&:hover': { background: '#e3eaf2' } }}
                    >
                        &lt;
                    </IconButton>
                    <span style={{ fontWeight: 500 }}>Page {page} of {pageCount}</span>
                    <IconButton
                        size="small"
                        onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
                        disabled={page === pageCount || pageCount === 0}
                        sx={{ borderRadius: 2, background: '#f5f7fa', '&:hover': { background: '#e3eaf2' } }}
                    >
                        &gt;
                    </IconButton>
                </Box>
                {/* Action Menu */}
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItemComponent onClick={handleMenuClose}>Edit</MenuItemComponent>
                    <MenuItemComponent onClick={handleMenuClose}>Rename</MenuItemComponent>
                    <MenuItemComponent onClick={handleMenuClose}>Move</MenuItemComponent>
                    <MenuItemComponent onClick={handleMenuClose} sx={{ color: "error.main" }}>
                        Delete
                    </MenuItemComponent>
                </Menu>
            </div >

        </>
    );
};

export default MedicalHeader;
