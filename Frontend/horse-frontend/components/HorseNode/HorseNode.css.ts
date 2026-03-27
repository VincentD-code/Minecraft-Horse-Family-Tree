import { style } from "@vanilla-extract/css";

export const nodeContainer = style({
  padding: "8px 16px",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  borderRadius: "6px",
  backgroundColor: "white",
  border: "2px solid #9ca3af",
  minWidth: "150px",
  transition: "all 0.2s ease-in-out",
  ":hover": {
    borderColor: "#3b82f6",
    transform: "translateY(-2px)",
    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
});

export const contentWrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const horseName = style({
  fontSize: "14px",
  fontWeight: "bold",
  color: "#1f2937",
  whiteSpace: "nowrap",
});

export const statText = style({
  fontSize: "10px",
  color: "#6b7280",
  fontStyle: "italic",
  textTransform: "none",
});

// Target the React Flow handles specifically
export const handleStyle = style({
  width: "8px !important",
  height: "8px !important",
  backgroundColor: "#9ca3af !important",
  border: "none !important",
});