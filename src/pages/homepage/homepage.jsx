"use client"

import { useEffect, useState } from "react"
import {
  Box,
} from "@mui/material"
import HomepageHeader from "@components/homepage-resources/homepage-header.jsx"
import HomepageBanner from "@components/homepage-resources/homepage-banner.jsx"
import HomepageHealthServices from "@components/homepage-resources/homepage-health-services.jsx"
import HomepageBlogsUpdates from "@components/homepage-resources/homepage-blogs-updates.jsx"
import HomepageFooter from "@components/homepage-resources/homepage-footer.jsx"

import useMyInformation from "@hooks/common/useMyInformation.js"

export default function Homepage() {
  const { personalInforState, loading} = useMyInformation();

  const [currentUser, setCurrentUser] = useState({
    role: personalInforState?.role || "guest",
  })

  // reload if redux state changes:
  useEffect(() => {
    if (!loading) {
      setCurrentUser({
        role: personalInforState?.role || "guest",
      })
    }
  }, [loading, personalInforState]);

  // debug:
  console.log("Current User Role:", JSON.stringify(currentUser, null, 2));

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Header and Navigation */}
      <HomepageHeader currentUser={currentUser} />

      {/* Banner Section */}
      <HomepageBanner currentUser={currentUser} />

      {/* Features Section */}
      <HomepageHealthServices currentUser={currentUser} />

      {/* Latest News Section */}
      <HomepageBlogsUpdates currentUser={currentUser} />

      {/* Footer */}
      <HomepageFooter currentUser={currentUser} />
    </Box>
  )
}
