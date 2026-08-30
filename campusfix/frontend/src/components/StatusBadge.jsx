import React from 'react';
import {
  FileText,
  Search,
  UserCheck,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

const STATUS_CONFIG = {
  'Submitted': {
    className: 'badge-submitted',
    icon: FileText,
    label: 'Submitted',
  },
  'Under Review': {
    className: 'badge-review',
    icon: Search,
    label: 'Under Review',
  },
  'Assigned': {
    className: 'badge-assigned',
    icon: UserCheck,
    label: 'Assigned',
  },
  'In Progress': {
    className: 'badge-progress',
    icon: Clock,
    label: 'In Progress',
  },
  'Resolved': {
    className: 'badge-resolved',
    icon: CheckCircle2,
    label: 'Resolved',
  },
  'Closed': {
    className: 'badge-closed',
    icon: XCircle,
    label: 'Closed',
  },
};

export default function StatusBadge({ status = 'Submitted' }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Submitted'];
  const Icon = config.icon;

  return (
    <span className={`badge ${config.className}`}>
      <Icon size={13} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}
