import { useState } from "react"
import {
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
    Box,
    InputAdornment,
} from "@mui/material"
import {
    Search as SearchIcon,
    MoreVert as MoreVertIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Refresh as RefreshIcon,
} from "@mui/icons-material"
import "./StyleMedicalEvent.scss"

const rows = [
    {
        medical_event_id: "ME001",
        pupilsInfor: [
            {
                pupilId: "P001",
                lastName: "Smith",
                firstName: "John",
                Grade: "3",
            },
        ],
        medicationInfor: [
            {
                injuryDescription: "Sprained ankle",
                detailedInformation: "Nurse Anna Tran",
                date: "2025-07-01",
                Status: "medium",
            },
        ],
    },
    {
        medical_event_id: "ME002",
        pupilsInfor: [
            {
                pupilId: "P002",
                lastName: "Johnson",
                firstName: "Emma",
                Grade: "4",
            },
        ],
        medicationInfor: [
            {
                injuryDescription: "Minor cut",
                detailedInformation: "Nurse Anna Tran",
                date: "2025-07-02",
                Status: "low",
            },
        ],
    },
    {
        medical_event_id: "ME003",
        pupilsInfor: [
            {
                pupilId: "P003",
                lastName: "Brown",
                firstName: "Michael",
                Grade: "5",
            },
        ],
        medicationInfor: [
            {
                injuryDescription: "Headache",
                detailedInformation: "Nurse Anna Tran",
                date: "2025-07-03",
                Status: "low",
            },
        ],
    },
    {
        medical_event_id: "ME004",
        pupilsInfor: [
            {
                pupilId: "P004",
                lastName: "Lee",
                firstName: "Sophia",
                Grade: "2",
            },
        ],
        medicationInfor: [
            {
                injuryDescription: "Bruised knee",
                detailedInformation: "Nurse Anna Tran",
                date: "2025-07-03",
                Status: "medium",
            },
        ],
    },
    {
        medical_event_id: "ME005",
        pupilsInfor: [
            {
                pupilId: "P005",
                lastName: "Nguyen",
                firstName: "Liam",
                Grade: "1",
            },
        ],
        medicationInfor: [
            {
                injuryDescription: "High fever",
                detailedInformation: "Nurse Anna Tran",
                date: "2025-07-04",
                Status: "high",
            },
        ],
    },
]


const MedicalEvent = () => {
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
    const filteredData = rows.filter((row) => {
        const pupil = row.pupilsInfor[0]
        const med = row.medicationInfor[0]
        const matchesSearch =
            row.medical_event_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (pupil.firstName + ' ' + pupil.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
            pupil.pupilId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || med.Status === statusFilter
        const matchesGrade = categoryFilter === "all" || pupil.Grade === categoryFilter
        return matchesSearch && matchesStatus && matchesGrade
    })
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

    return (
        <div className="invoice-table-container" style={{ padding: 24, background: '#f7f9fb', minHeight: '100vh' }}>
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
                <FormControl size="small" className="filter-select" sx={{ minWidth: 140 }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                    </Select>
                </FormControl>
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
                            <TableCell sx={{ fontWeight: 600 }}>Injury Description</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>School Nurse</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 6, color: '#aaa' }}>
                                    No data found.
                                </TableCell>
                            </TableRow>
                        ) : paginatedData.map((row) => {
                            const pupil = row.pupilsInfor[0]
                            const med = row.medicationInfor[0]
                            return (
                                <TableRow key={row.medical_event_id} hover sx={{ transition: 'background 0.2s', '&:hover': { background: '#f5f7fa' } }}>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 600 }}>{pupil.firstName[0]}</Avatar>
                                            <Box>
                                                <div style={{ fontWeight: 500 }}>{pupil.firstName} {pupil.lastName}</div>
                                                <div style={{ fontSize: 12, color: '#888' }}>{pupil.pupilId}</div>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{pupil.Grade}</TableCell>
                                    <TableCell>{med.injuryDescription}</TableCell>
                                    <TableCell>{med.detailedInformation}</TableCell>
                                    <TableCell>{med.date}</TableCell>
                                    <TableCell>
                                        <Chip label={med.Status} color={getStatusColor(med.Status)} size="small" sx={{ textTransform: 'capitalize', fontWeight: 500 }} />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" color="primary" sx={{ borderRadius: 2, background: '#e3f2fd', '&:hover': { background: '#bbdefb' } }} onClick={() => alert(`Details for ${pupil.firstName} ${pupil.lastName}`)}>
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
        </div>
    )
}
export default MedicalEvent