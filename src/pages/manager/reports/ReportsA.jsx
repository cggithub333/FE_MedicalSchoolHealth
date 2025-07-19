import { Grid } from '@mui/material';
import Reports from '../../../components/admin/reports/Report.jsx';
const ReportsA = () => {

    return (
        <Grid container justifyContent={'center'} sx={{ backgroundColor: "#E6F8F9", pb: "50px" }}>
            <Grid item size={{ xs: 11 }}>
                <Reports />
            </Grid>
        </Grid>

    );
}

export default ReportsA;