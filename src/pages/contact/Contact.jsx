
import HomepageHeader from "@components/homepage-resources/homepage-header";
import HomepageFooter from "@components/homepage-resources/homepage-footer";
import useMyInformation from "@hooks/common/useMyInformation";

import { useEffect, useState } from "react";

const Contact = () => {

  const { personalInforState, loading } = useMyInformation();

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

      {/* Viết nội dung trang contact ở chỗ này này */}
      <div style={{padding: "20px"}}>
        Contact here!!!
      </div>

      <HomepageFooter />
    </div>
  );
};

export default Contact;