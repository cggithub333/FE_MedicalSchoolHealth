
import React from 'react'
import { useParams } from 'react-router-dom'


const BlogEdit = () => {

  const { blogId} = useParams();

  
  return (
    <div>
      Blog Edit Page
      <p>Here you can edit your blog posts for blog with id = {blogId}</p>
    </div>
  )
}

export default BlogEdit
