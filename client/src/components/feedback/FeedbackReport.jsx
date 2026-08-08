import React from 'react';
import ContentScoreCard from './ContentScoreCard';
import DeliveryMetricsCard from './DeliveryMetricsCard';
import CoachingTipCard from './CoachingTipCard';

const FeedbackReport = ({ evaluationResult }) => {
  if (!evaluationResult) return null;

  const { contentEvaluation, deliveryEvaluation, coachingReport } = evaluationResult;

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ContentScoreCard evaluation={contentEvaluation} />
        <DeliveryMetricsCard delivery={deliveryEvaluation} />
      </div>

      <CoachingTipCard coaching={coachingReport} />
    </div>
  );
};

export default FeedbackReport;
