export default function RecentActivity() {
  return (
    <div>
      <h3 style={{ fontSize: 18, marginBottom: 8 }}>Recent Activity</h3>
      <div
        style={{
          background: '#f6f6f6',
          padding: 12,
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <div style={{ color: 'green' }}>
          + $250.00{' '}
          <span style={{ color: '#888', fontSize: 12 }}>From John Doe</span>
        </div>
        <div style={{ fontSize: 12, color: '#888' }}>Today, 2:30 PM</div>
      </div>
      <div style={{ background: '#f6f6f6', padding: 12, borderRadius: 8 }}>
        <div style={{ color: 'red' }}>
          - $120.50{' '}
          <span style={{ color: '#888', fontSize: 12 }}>To Coffee Shop</span>
        </div>
        <div style={{ fontSize: 12, color: '#888' }}>Yesterday, 9:15 AM</div>
      </div>
    </div>
  );
}
