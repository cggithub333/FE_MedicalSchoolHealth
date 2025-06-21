import * as React from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

export default function CustomSeparator({ breadcrumbPairs }) {

  console.log(breadcrumbPairs);

  const breadcrumbs = [];

  for (let idx in breadcrumbPairs) {

    if (idx == breadcrumbPairs.length - 1) { // last pair;
      breadcrumbs.push(
        <Typography key={idx}
                    sx={{ 
                        color: 'text.primary',
                        fontSize: "17px"
                    }}
        >
          {breadcrumbPairs[idx].title}
        </Typography>,
      )
      break;
    }

    breadcrumbs.push(
      <Link
        underline="hover"
        key={idx}
        color="inherit"
        href={`${breadcrumbPairs[idx].link}`}
        sx={{
          fontSize: "17px",
        }}
      >
        {breadcrumbPairs[idx].title}
      </Link>,
    );

    idx += 1;
  }

  return (
    <Stack spacing={2} sx={{ margin: "10px 20px" }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
    </Stack>
  );
}