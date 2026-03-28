import { style, globalStyle } from "@vanilla-extract/css";

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginTop: "40px",
  marginBottom: "32px",
});

export const statusAlive = style({
  padding: "6px 16px",
  borderRadius: "99px",
  backgroundColor: "#2d4a3e", 
  color: "#fdfbf7",
  fontSize: "13px",
  fontWeight: 700,
  textTransform: "uppercase",
});

export const statusDead = style({
  padding: "6px 16px",
  borderRadius: "99px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontSize: "13px",
  fontWeight: 700,
  textTransform: "uppercase",
});

export const heading = style({
  fontSize: "42px",
  fontWeight: 800,
  margin: 0,
  letterSpacing: "-0.04em",
  textShadow: "0.5px 1px 2px rgba(0,0,0,0.1)",
  textTransform: "capitalize",
});