export function exportIncidentsCSV(incidents) {
  const headers = [
    "id","region","service","type","severity","status","startedAt","resolvedAt","impactEstimate"
  ];
  const rows = incidents.map(i => [
    i.id, i.region, i.service, i.type, i.severity, i.status, i.startedAt, i.resolvedAt || "", i.impactEstimate
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `incident-report-${new Date().toISOString().slice(0,10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
