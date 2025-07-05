import React from 'react';
import AthleteLayout from '../../components/AthleteLayout.jsx';
import AthleteDashboard from '../../components/AthleteDashboard.jsx';
import '../../css/athlete-dashboard.css';
import '../../css/athlete-layout.css';

function Athlete() {
  return (
    <AthleteLayout>
      <AthleteDashboard />
    </AthleteLayout>
  );
}

export default Athlete;
