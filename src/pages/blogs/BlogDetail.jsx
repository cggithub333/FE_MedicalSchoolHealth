import { Link, useParams } from "react-router-dom";
import HomepageHeader from "@components/homepage-resources/homepage-header";
import HomepageFooter from "@components/homepage-resources/homepage-footer";
import useMyInformation from "@hooks/common/useMyInformation";

import { useEffect, useState } from "react";
import { Grid, Box, Typography, CardContent, Card, Paper, Avatar } from "@mui/material";
import BlogCard from "@components/blog-resources/blog-card";
import useBlogById from "@hooks/common/useBlogById";
import useAllBlogs from "@hooks/common/useAllBlogs";
import NewspaperIcon from '@mui/icons-material/Newspaper';

import { useNavigate } from "react-router-dom";
import { getTwoUniqueRandomInts } from "@utils/number-utils";

const BlogDetail = () => {
  // Get the blogId from the URL parameters
  const { blogId: paramBlogId } = useParams();

  const navigate = useNavigate();

  // get specific blog by ID:
  const { blog, loading: blogLoading, error: blogError, refetchBlog } = useBlogById(paramBlogId);
  const { sortedBlogsByDescId } = useAllBlogs();

  const { personalInforState, loading } = useMyInformation();
  const [currentUser, setCurrentUser] = useState({
    role: personalInforState?.role || "guest",
  });

  // debug:
  // console.log("getBlogsExceptCurrentBlog:", JSON.stringify(getBlogsExceptCurrentBlog(sortedBlogsByDescId, paramBlogId), null, 2));

  // refetch content properly the user roles if the state changes:
  useEffect(() => {
    if (!loading) {
      setCurrentUser({
        role: personalInforState?.role || "guest",
      });
    }
  }, [loading, personalInforState]);


  const handleNavigateDetail = (blogId) => {
    if (!blogId) return;
    navigate(`/blogs/view/${blogId}`);
  }


  const isInAdminPower = () => {
    return ["admin", "manager"].some(role => role === currentUser.role.toLowerCase());
  }

  return (
    <div>
      <HomepageHeader currentUser={currentUser} />
      <Grid container spacing={2} sx={{ padding: "50px 30px" }} backgroundColor="#E6F8F9" >
        <Grid size={{ xs: 8 }}>
          {blog && (<BlogCard blog={blog} height="550px" isInAdminPower={isInAdminPower()} />)}
          {!blog && (
            <Box sx={{ background: "#fff", padding: "20px", borderRadius: "8px", textAlign: "center", width: "100%" }}>
              <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                <img src="/assets/images/Blog-not-found.png" alt="Blog Not Found" style={{ width: "100%", height: "auto", marginBottom: "20px" }} />
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid size={{ xs: 4 }}>
          <Grid item size={{ xs: 12 }}>
            <Box sx={{ position: "sticky", top: 20 }}>
              <Box>
                <Paper sx={{  backgroundColor: "#fff", 
                              borderRadius: "8px", 
                              boxShadow: 1, textAlign: "center", 
                              padding: "5px 0px", mb: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: 2}}>
                  <Avatar sx={{ bgcolor: "#8fc6ee" }}>
                    <NewspaperIcon />
                  </Avatar>
                  <Typography variant="h5">
                    Related Blogs
                  </Typography>
                </Paper>
              </Box>
              {/* related blogs */}
              <Box>
                <Grid container spacing={3}>
                  {(get2RandomBlogs(getBlogsExceptCurrentBlog(sortedBlogsByDescId, paramBlogId))).map((post) => {

                    if (!post) return null; // Skip if post is undefined or null

                    return (
                      <Grid size={{ xs: 12 }} key={post.blogId}>
                        <BlogCard blog={post} height="200px" isInAdminPower={isInAdminPower()} isRelatedBlogs={true} handleNavigateDetail={handleNavigateDetail} />
                      </Grid>
                    )
                  })}
                </Grid>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
      <HomepageFooter />
    </div>
  )

}

function getBlogsExceptCurrentBlog(blogs, currentBlogId) {
  if (!blogs || !Array.isArray(blogs)) {
    return [];
  }
  return blogs.filter(blog => blog.blogId != currentBlogId);
}

function get2RandomBlogs(blogs) {
  if (!blogs || !Array.isArray(blogs)) {
    return [];
  }
  const [a, b] = getTwoUniqueRandomInts(0, blogs.length - 1);
  return [blogs[a], blogs[b]];
}

export default BlogDetail;