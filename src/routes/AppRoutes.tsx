import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Success } from '../pages/Success';
import { ViewRecord } from '../pages/ViewRecord';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/success" element={<Success />} />
      <Route path="/view/:id" element={<ViewRecord />} />
      {/* Catch all redirecting to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
