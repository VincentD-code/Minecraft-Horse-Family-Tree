import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const menuWrapper = style({
  position: "absolute",
  top: "16px",
  right: "16px",
  zIndex: 100,
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  backgroundColor: vars.color.white,
  padding: vars.spacing.md,
  borderRadius: vars.borderRadius.lg,
  boxShadow: vars.shadow.lg,
  border: `1px solid ${vars.color.border}`,
  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.2s ease",
  width: "240px",
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
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  padding: "8px 16px",
  cursor: "pointer",
  boxShadow: vars.shadow.md,
  fontSize: "12px",
  fontWeight: 700,
  color: vars.color.primary,
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  ":hover": {
    backgroundColor: vars.color.secondary,
    transform: "translateY(-1px)",
  },
});

export const closeButton = style({
  alignSelf: "flex-end",
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "18px",
  color: vars.color.textMuted,
  padding: "4px",
  lineHeight: 1,
  ":hover": {
    color: vars.color.textMain,
  },
});

export const menuHeader = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: vars.spacing.sm,
  borderBottom: `1px solid ${vars.color.border}`,
  paddingBottom: vars.spacing.sm,
});

export const menuLabel = style({
  fontSize: "10px",
  fontWeight: 800,
  color: vars.color.primary,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  marginBottom: vars.spacing.xs,
});

const buttonBase = style({
  width: "100%",
  padding: "10px",
  borderRadius: vars.borderRadius.md,
  fontSize: "12px",
  fontWeight: 700,
  transition: "all 0.15s ease",
  cursor: "pointer",
  border: `1px solid ${vars.color.border}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "8px",
  backgroundColor: vars.color.white,
  color: vars.color.textMain,
  ":hover": {
    backgroundColor: vars.color.secondary,
    borderColor: vars.color.primary,
  }
});

export const statButtonActive = style([
  buttonBase,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.white,
    borderColor: vars.color.primary,
  },
]);

export const statButtonInactive = style([
  buttonBase,
]);

export const resetButton = style([
  buttonBase,
  {
    marginTop: vars.spacing.md,
    backgroundColor: vars.color.textMain,
    color: vars.color.white,
    borderColor: vars.color.textMain,
    ":hover": { backgroundColor: "#000000" },
  },
]);

export const baseButtonActive = style([
  buttonBase,
  {
    backgroundColor: vars.color.primary,
    color: vars.color.white,
    borderColor: vars.color.primary,
    marginBottom: vars.spacing.xs,
  },
]);

export const baseButtonInactive = style([
  buttonBase,
  {
    marginBottom: vars.spacing.xs,
  },
]);

export const statGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(1, 1fr)",
  gap: "6px",
});
