import { style } from "@vanilla-extract/css";

export const menuWrapper = style({
  position: "absolute",
  top: "16px",
  right: "16px",
  zIndex: 100, // Increased z-index
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  backgroundColor: "white",
  padding: "12px",
  borderRadius: "8px",
  boxShadow:
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  border: "1px solid #e5e7eb",
  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
});

export const menuClosed = style({
  transform: "translateX(calc(100% + 20px))",
  opacity: 0,
  pointerEvents: "none",
});

export const toggleButton = style({
  position: "absolute",
  top: "16px",
  right: "16px",
  zIndex: 90,
  backgroundColor: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "8px 12px",
  cursor: "pointer",
  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  fontSize: "12px",
  fontWeight: "bold",
  color: "#2d4a3e",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: "6px",
  ":hover": {
    backgroundColor: "#f9fafb",
    transform: "translateY(-1px)",
  },
});

export const closeButton = style({
  alignSelf: "flex-end",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  color: "#9ca3af",
  padding: "4px",
  lineHeight: 1,
  ":hover": {
    color: "#374151",
  },
});

export const menuHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "4px",
});

export const menuLabel = style({
  fontSize: "11px",
  fontWeight: 800,
  color: "#2d4a3e",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  marginBottom: "4px",
});

const buttonBase = style({
  width: "100%",
  padding: "8px 0",
  borderRadius: "6px",
  fontSize: "12px",
  fontWeight: "bold",
  transition: "all 0.2s",
  cursor: "pointer",
  border: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
});

export const statButtonActive = style([
  buttonBase,
  {
    fontSize: "10px",
    backgroundColor: "#16a34a",
    color: "white",
    textTransform: "capitalize",
  },
]);

export const statButtonInactive = style([
  buttonBase,
  {
    fontSize: "10px",
    backgroundColor: "#f3f4f6",
    color: "#6b7280",
    textTransform: "capitalize",
    ":hover": { backgroundColor: "#e5e7eb" },
  },
]);

export const resetButton = style([
  buttonBase,
  {
    marginTop: "16px",
    backgroundColor: "#1f2937",
    color: "white",
    ":hover": { backgroundColor: "#000000" },
  },
]);

export const baseButtonActive = style([
  buttonBase,
  {
    backgroundColor: "#2563eb",
    color: "white",
    marginBottom: "4px",
  },
]);

export const baseButtonInactive = style([
  buttonBase,
  {
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    marginBottom: "4px",
    ":hover": { backgroundColor: "#e5e7eb" },
  },
]);

export const statGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "4px",
});
