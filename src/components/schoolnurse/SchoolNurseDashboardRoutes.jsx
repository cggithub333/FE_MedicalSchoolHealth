import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SchoolNurseDashboardLayout from './SchoolNurseDashboardLayout';


const SchoolNurseDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<SchoolNurseDashboardLayout />}>
      </Route>
    </Routes>
  );
};

export default SchoolNurseDashboardRoutes; 