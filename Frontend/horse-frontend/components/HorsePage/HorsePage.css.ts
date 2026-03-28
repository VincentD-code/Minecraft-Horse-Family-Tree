import { style } from "@vanilla-extract/css";

export const pageWrapper = style({
  padding: "24px",
  maxWidth: "800px",
  margin: "0 auto",
  fontFamily: "Inter, system-ui, sans-serif",
  color: "#1e293b",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: "16px",
  marginBottom: "32px",
});

export const heading = style({
  fontSize: "32px",
  fontWeight: 700,
  margin: 0,
  color: "#64748b"
});

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  gap: "16px",
  marginBottom: "32px",
});

export const statCard = style({
  padding: "20px",
  borderRadius: "12px",
  backgroundColor: "#f8fafc",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
});

export const statLabel = style({
  fontSize: "14px",
  color: "#64748b",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.025em",
});

export const statValue = style({
  fontSize: "24px",
  fontWeight: 700,
  margin: "8px 0 4px 0",
});

export const statUnit = style({
  fontSize: "14px",
  fontWeight: 400,
  color: "#94a3b8",
});

export const statSubtext = style({
  fontSize: "12px",
  color: "#94a3b8",
});

export const statusAlive = style({
  padding: "4px 12px",
  borderRadius: "99px",
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontSize: "14px",
  fontWeight: 600,
});

export const statusDead = style({
  padding: "4px 12px",
  borderRadius: "99px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: 600,
});

export const backButton = style({
  marginBottom: "20px",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  backgroundColor: "white",
  color: "#64748b",
  fontWeight: 500,
  cursor: "pointer",
  transition: "all 0.2s",
  ":hover": {
    backgroundColor: "#f1f5f9",
    color: "#1e293b",
    borderColor: "#cbd5e1",
  }
});

export const detailsSection = style({
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  padding: "24px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)", 
});

export const detailRow = style({
  display: "flex",
  justifyContent: "space-between",
  padding: "8px 0",
});

export const divider = style({
  border: 0,
  borderTop: "1px solid #f1f5f9",
  margin: "16px 0",
});

export const bloodlineWrapper = style({
  marginTop: "24px",
});

export const sectionTitle = style({
  fontSize: "18px",
  fontWeight: 700,
  color: "#1e293b",
  marginBottom: "16px",
});

