type Props = {
  title: string;
  value: string | number;
  unit: string;
  color: string;
};

import type { CSSProperties } from 'react';

export default function InfoCard({ title, value, unit, color }: Props) {
  return (
    <div style={{ ...styles.card, backgroundColor: color }}>
      <div style={styles.title}>{title}</div>
      <div style={styles.valueRow}>
        <span style={styles.value}>{value}</span>
        <span style={styles.unit}>{unit}</span>
      </div>
    </div>
  );
}

const styles: {
  card: CSSProperties;
  title: CSSProperties;
  valueRow: CSSProperties;
  value: CSSProperties;
  unit: CSSProperties;
} = {
  card: {
    width: '48%',
    padding: 16, // khoảng cách từ mép card đến nội dung
    borderRadius: 12, // bo góc cho card
    color: '#fff', // màu trắng
    display: 'flex', // sắp xếp nội dung gồm title, valueRow theo chiều dọc
    flexDirection: 'column', // sắp xếp các phần tử theo chiều dọc
    gap: 4, // khoảng cách giữa các phần tử gồm title và valueRow
  },

  title: {
    fontSize: 14,
    opacity: 0.8, // độ mờ cho title
  },

  valueRow: {
    display: 'flex', // sắp xếp value và unit theo chiều ngang
    alignItems: 'baseline', // căn chỉnh value và unit cùng nằm trên đường cơ sở
    gap: 4, // khoảng cách giữa value và unit
  },

  value: {
    fontSize: 28, 
    fontWeight: 'bold', // Đậm, tăng nổi bật
  },

  unit: {
    fontSize: 16,
    opacity: 0.8, // độ mờ cho unit
  },
};

