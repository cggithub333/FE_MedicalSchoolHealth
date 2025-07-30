import React from 'react'

import BlogCreatingContent from '@components/magic/TextEditor/BlogCreatingContent'

import { Grid } from '@mui/material';

const BlogCreate = () => {

  return (
    <div style={{ width: "100%", height: "100%", overflowY: "auto", padding: "20px", paddingTop: "50px" }}>
      <Grid width={'100%'} container>
        <Grid size={{ xs: 12 }}>
          <BlogCreatingContent />
        </Grid>
      </Grid>
    </div>
  )
}

export default BlogCreate
