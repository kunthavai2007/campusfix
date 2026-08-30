import React from 'react';
import { Check } from 'lucide-react';

const STATUS_ORDER = [
  'Submitted',
  'Under Review',
  'Assigned',
  'In Progress',
  'Resolved',
  'Closed',
];

export default function StatusTimeline({ currentStatus = 'Submitted' }) {
  const currentIndex = STATUS_ORDER.indexOf(currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div style={{ padding: '0.5rem 0' }}>
      <div className="status-timeline">
        <div className="timeline-line" />
        {STATUS_ORDER.map((status, index) => {
          const isCompleted = index < activeIndex;
          const isCurrent = index === activeIndex;

          let stateClass = '';
          if (isCompleted) stateClass = 'completed';
          else if (isCurrent) stateClass = 'current';

          return (
            <div key={status} className={`status-step ${stateClass}`}>
              <div className="step-circle">
                {isCompleted ? <Check size={16} strokeWidth={3} /> : index + 1}
              </div>
              <span className="step-label">{status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
