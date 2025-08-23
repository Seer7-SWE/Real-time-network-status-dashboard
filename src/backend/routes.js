export default function setupRoutes(app) {
  app.get("/api/history", (req, res) => {
    // TODO: fetch from Mongo/Postgres
    res.json([
      { date: "2025-08-20", outages: 3, severe: 1 },
      { date: "2025-08-21", outages: 5, severe: 2 },
      { date: "2025-08-22", outages: 2, severe: 0 },
      { date: "2025-08-23", outages: 4, severe: 1 },
    ]);
  });
}
