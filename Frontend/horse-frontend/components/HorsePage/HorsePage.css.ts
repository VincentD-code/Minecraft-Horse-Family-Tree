import { style } from "@vanilla-extract/css";

export const heading = style({
  margin: 10,
  fontSize: 24,
});

export const container = style({
  margin: 10,
  font: "inherit",
});

export const backButton = style({
  margin: 8,
  paddingLeft: 16,
  paddingRight: 16,
  borderRadius: "8px",
  border: "2px solid #3b82f6",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "#eff6ff"
  }
});

// New Bloodline Styles
export const bloodlineSection = style({
  marginTop: "24px",
  maxWidth: "400px",
});

export const bloodlineList = style({
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "12px",
});

export const bloodlineRow = style({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

export const bloodlineInfo = style({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "14px",
  fontWeight: 500,
});

export const progressTrack = style({
  width: "100%",
  height: "12px", 
  backgroundColor: "rgba(0, 0, 0, 0.2)", 
  borderRadius: "6px",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)", 
});

export const progressBar = style({
  height: "100%",
  borderRadius: "6px",
  transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)", 
  borderRight: "1px solid rgba(255, 255, 255, 0.3)", 
});