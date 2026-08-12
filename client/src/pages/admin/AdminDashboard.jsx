import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const AdminDashboard = () => {
  useDocumentTitle('Admin Dashboard');

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-text-primary font-display tracking-tight mb-2">
          Admin Overview
        </h1>
        <p className="text-text-muted">
          Welcome to the VocaPrep administration console.
        </p>
      </div>
      
      <div className="bg-surface-elevated border border-surface-elevated rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold text-text-primary mb-4">Phase 4 Data Pending</h2>
        <p className="text-text-muted">
          The charts and detailed statistics will be implemented in the next phase.
          This placeholder confirms the layout and routing are functioning correctly.
        </p>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
