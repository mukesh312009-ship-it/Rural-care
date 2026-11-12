import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ConsultationChartProps {
  data: { month: string; consultations: number }[];
}

export const ConsultationChart: React.FC<ConsultationChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
          <YAxis stroke="#94a3b8" fontSize={11} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '12px',
            }}
          />
          <Bar dataKey="consultations" fill="#0d9488" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
