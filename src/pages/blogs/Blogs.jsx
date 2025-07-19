
import HomepageHeader from "@components/homepage-resources/homepage-header";
import HomepageFooter from "@components/homepage-resources/homepage-footer";
import useMyInformation from "@hooks/common/useMyInformation";

import { useEffect, useState } from "react";
import BlogContent from "@components/blog-resources/blogs-content";
import { Grid } from "@mui/material";

const Blogs = () => {

  const { personalInforState, loading} = useMyInformation();

  const [currentUser, setCurrentUser] = useState({
    role: personalInforState?.role || "guest",
  });

  // refetch content properly the user roles if the state changes:
  useEffect(() => {
    if (!loading) {
      setCurrentUser({
        role: personalInforState?.role || "guest",
      });
    }
  }, [loading, personalInforState]);

  return (
    <div>
      <HomepageHeader currentUser={currentUser} />

      {/* Viết nội dung trang blogs ở chỗ này này */}
      <Grid container justifyContent={'center'} backgroundColor={"#f4f4f4"}>
        <Grid size={{ xs: 10}}>
          <BlogContent />
        </Grid>
      </Grid>

      <HomepageFooter/>
    </div>
  );
};

export default Blogs;