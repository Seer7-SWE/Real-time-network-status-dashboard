

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
export async function exportIncidentsPDF(incidents) {
  if (!incidents || incidents.length === 0) {
    alert("No incidents to export.");
    return;
  }

  try {
    // dynamic import - handles different module shapes & avoids build issues
    const jspdfModule = await import("jspdf");
    const autoTableModule = await import("jspdf-autotable"); // side-effect registers plugin

    const jsPDFClass = jspdfModule.default || jspdfModule.jsPDF || jspdfModule;
    const doc = new jsPDFClass({ unit: "pt", format: "a4" });

    doc.setFontSize(14);
    doc.text("Incident Report", 40, 50);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 66);

    const head = [["ID","Region","Service","Type","Severity","Status","Started At","Resolved At","Impact"]];
    const body = incidents.map(i => [
      i.id ?? "",
      i.region ?? "",
      i.service ?? "",
      i.type ?? "",
      i.severity ?? "",
      i.status ?? "",
      i.startedAt ? new Date(i.startedAt).toLocaleString() : "",
      i.resolvedAt ? new Date(i.resolvedAt).toLocaleString() : "",
      i.impactEstimate != null ? String(i.impactEstimate) : ""
    ]);

    // autoTable call
    doc.autoTable({
      head,
      body,
      startY: 90,
      theme: "striped",
      headStyles: { fillColor: [22, 78, 138], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 6 },
      margin: { left: 40, right: 40 },
      didDrawPage: (data) => {
        // page footer with page number
        const page = doc.getNumberOfPages();
        doc.setFontSize(8);
        doc.text(`Page ${page}`, doc.internal.pageSize.getWidth() - 60, doc.internal.pageSize.getHeight() - 30);
      }
    });

    // Save file (trigger download)
    const filename = `incident-report-${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(filename);
  } catch (err) {
    console.error("PDF export failed:", err);
    // fallback to CSV with user notice
    alert("PDF export failed — falling back to CSV. See console for details.");
    exportIncidentsCSV(incidents);
  }
}
