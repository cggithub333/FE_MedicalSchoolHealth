import { useParams } from "react-router-dom";
import HomepageHeader from "@components/homepage-resources/homepage-header";
import HomepageFooter from "@components/homepage-resources/homepage-footer";
import useMyInformation from "@hooks/common/useMyInformation";

import { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";
import BlogCard from "@components/blog-resources/blog-card";
import useAllBlogs from "@hooks/common/useAllBlogs";
import useBlogById from "@hooks/common/useBlogById";

const BlogDetail = () => {
  // Get the blogId from the URL parameters
  const { blogId: paramBlogId } = useParams();

  // get specific blog by ID:
  const { sortedBlogsByDescId: allBlogs } = useAllBlogs();
  const { blog, loading: blogLoading, error: blogError, refetchBlog } = useBlogById(paramBlogId);

  const { personalInforState, loading } = useMyInformation();
  const [currentUser, setCurrentUser] = useState({
    role: personalInforState?.role || "guest",
  });

  // debug:
  console.log("blog:", JSON.stringify(blog, null, 2));

  // refetch content properly the user roles if the state changes:
  useEffect(() => {
    if (!loading) {
      setCurrentUser({
        role: personalInforState?.role || "guest",
      });
    }
  }, [loading, personalInforState]);

  const administrativeBlogRole = ["admin", "manager"];

  return (
    <div>
        <HomepageHeader currentUser={currentUser} />
        <Grid container spacing={2} sx={{ padding: "50px 30px" }} backgroundColor="#E6F8F9" >
          <Grid size={{xs: 8}}>
          {blog && (<BlogCard blog={blog} height="550px" isInAdminPower={(administrativeBlogRole.some(role => role === currentUser.role.toLowerCase()))} />)}
          {!blog && (
            <Box sx={{background: "#fff", padding: "20px", borderRadius: "8px", textAlign: "center", width: "100%"}}>
              <Typography variant="h5" sx={{ color: 'text.secondary' }}>
                <img src="/assets/images/Blog-not-found.png" alt="Blog Not Found" style={{ width: "100%", height: "auto", marginBottom: "20px" }} />
              </Typography>
            </Box>
          )}
          </Grid>
          <Grid size={{xs: 3}}>
            {/* Additional content or sidebar can go here */}
          </Grid>
        </Grid>
        <HomepageFooter/>
    </div>
  )

}

export default BlogDetail;