import React from 'react';

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = '#2563eb',
  bgColor = '#eff6ff',
  subtitle,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: bgColor, color: color }}>
        <Icon size={24} />
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{title}</div>
        {subtitle && (
          <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.15rem' }}>
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
