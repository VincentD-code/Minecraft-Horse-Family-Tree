import { style, globalStyle } from "@vanilla-extract/css";

export const detailsSection = style({
  backgroundColor: "white",
  border: "1px solid #e5e0d8",
  borderRadius: "8px",
  padding: "32px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
});

export const lineageSection = style({
  marginTop: "32px",
});

export const parentGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginTop: "12px",
});

export const parentBox = style({
  padding: "16px",
  backgroundColor: "#fcfaf7",
  border: "1px solid #e5e0d8",
  borderRadius: "8px",
  transition: "border-color 0.2s ease",
  selectors: {
    '&[data-gender="sire"]': { borderLeft: "6px solid #3b82f6" },
    '&[data-gender="dam"]': { borderLeft: "6px solid #ec4899" },
  },
});

export const parentLabel = style({
  display: "block",
  fontSize: "11px",
  textTransform: "uppercase",
  color: "#64748b",
  fontWeight: 800,
  marginBottom: "6px",
  letterSpacing: "0.05em",
});

export const parentName = style({
  fontSize: "16px",
  fontWeight: 600,
  color: "#334155",
  margin: 0,
});

export const divider = style({
  border: 0,
  borderTop: "2px dashed #e5e0d8",
  margin: "32px 0",
});

export const bloodlineWrapper = style({
  marginTop: "8px",
});

export const sectionTitle = style({
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 800,
  color: "#475569",
  marginBottom: "16px",
});

export const detailRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 0",
  fontSize: "15px",
  borderBottom: "1px solid #f1f1f1",
});

// Target the 'strong' tag inside 'detailRow'
globalStyle(`${detailRow} strong`, {
  color: "#1e293b",
  fontWeight: 700,
});

// Target the 'span' tag inside 'detailRow'
globalStyle(`${detailRow} span`, {
  color: "#334155",
  fontWeight: 500,
  backgroundColor: "#f8fafc",
  padding: "4px 12px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
});