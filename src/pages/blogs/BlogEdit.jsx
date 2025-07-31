
import React from 'react'
import { useParams } from 'react-router-dom'

import BlogEditingContent from '@components/magic/TextEditor/BlogEditingContent';
import useBlogById from '@hooks/common/useBlogById';

import { Grid } from '@mui/material';

const BlogEdit = () => {

  const { blogId} = useParams();

  const { blog } = useBlogById(blogId);

  
  return (
    <div style={{width: "100%", height: "100%", overflowY: "auto", padding: "20px", paddingTop: "50px"}}>
      <Grid width={'100%'} container>
        <Grid size={{xs: 12}}>
          {blog && (
              <BlogEditingContent blogId={blogId} blog={blog} />
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default BlogEdit
