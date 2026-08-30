import React from 'react';
import { AlertCircle, AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

const PRIORITY_CONFIG = {
  'Low': {
    className: 'badge-priority-low',
    icon: ArrowDown,
    label: 'Low Priority',
  },
  'Medium': {
    className: 'badge-priority-medium',
    icon: ArrowUp,
    label: 'Medium Priority',
  },
  'High': {
    className: 'badge-priority-high',
    icon: AlertTriangle,
    label: 'High Priority',
  },
  'Critical': {
    className: 'badge-priority-critical',
    icon: AlertCircle,
    label: 'Critical Priority',
  },
};

export default function PriorityBadge({ priority = 'Medium' }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG['Medium'];
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={13} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}
