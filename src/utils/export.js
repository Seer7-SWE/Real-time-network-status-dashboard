import jsPDF from "jspdf";


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

/* PDF export using jsPDF + autotable */
import jsPDF from "jspdf";
import "jspdf-autotable";

export function exportIncidentsPDF(incidents) {
  if (!incidents || incidents.length === 0) {
    alert("No incidents to export.");
    return;
  }
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // Title
  doc.setFontSize(14);
  doc.text("Incident Report", 40, 50);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 66);

  const headers = ["ID", "Region", "Service", "Type", "Severity", "Status", "Started", "Resolved", "Impact"];
  const rows = incidents.map(i => [
    i.id, i.region, i.service || "", i.type || "", i.severity || "",
    i.status || "", i.startedAt ? new Date(i.startedAt).toLocaleString() : "", i.resolvedAt ? new Date(i.resolvedAt).toLocaleString() : "", String(i.impactEstimate ?? "")
  ]);

  doc.autoTable({
    head: [headers],
    body: rows,
    startY: 90,
    theme: "striped",
    headStyles: { fillColor: [22, 78, 138], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 6 },
    margin: { left: 40, right: 40 }
  });

  doc.save(`incident-report-${new Date().toISOString().slice(0,10)}.pdf`);
}
