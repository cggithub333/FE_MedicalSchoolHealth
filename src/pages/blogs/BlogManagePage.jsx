
import HomepageHeader from "@components/homepage-resources/homepage-header";
import BasicHomepageFooter from "@components/homepage-resources/homepage-footer-short";
import useMyInformation from "@hooks/common/useMyInformation";

import { useEffect, useState } from "react";
import { Grid } from "@mui/material";

import { useNavigate } from "react-router-dom";


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
        <Grid size={{ xs: 10}}>
          Manage page content goes here!
        </Grid>
      </Grid>
      <BasicHomepageFooter />
    </div>
  )
}

export default BlogManagePage
