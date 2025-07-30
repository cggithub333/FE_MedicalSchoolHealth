
import HomepageHeader from "@components/homepage-resources/homepage-header";
import BasicHomepageFooter from "@components/homepage-resources/homepage-footer-short";
import useMyInformation from "@hooks/common/useMyInformation";

import { useEffect, useState } from "react";
import { Grid, Box } from "@mui/material";

import { useNavigate } from "react-router-dom";
import BlogManageBoard from "@components/blog-resources/blog-manage-board";


const BlogManagePage = () => {

  const navigate = useNavigate();
  const { personalInforState, loading } = useMyInformation();

  const [currentUser, setCurrentUser] = useState({
      role: personalInforState?.role || "guest",
  });

  useEffect(() => {
    if (!loading) {
      const userRole = personalInforState?.role || "guest";
      setCurrentUser({
        role: userRole || "guest",
      });
    }
  }, [loading, personalInforState]);

  return (
    <div>
      <HomepageHeader currentUser={currentUser} />
      <Grid container justifyContent={'center'} backgroundColor={"#f4f4f4"}>
        <Grid size={{ xs: 11}} paddingBottom={'80px'}>
          <BlogManageBoard />
        </Grid>
      </Grid>
      <Box position={'fixed'} bottom={0} left={0} width={'100%'}>
        <BasicHomepageFooter />
      </Box>
    </div>
  )
}

export default BlogManagePage
