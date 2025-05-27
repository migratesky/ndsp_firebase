export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">School Visits</h2>
          <p className="text-muted-foreground">Chart will be displayed here</p>
        </div>
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-semibold">User Activity</h2>
          <p className="text-muted-foreground">Chart will be displayed here</p>
        </div>
      </div>
    </div>
  );
}
