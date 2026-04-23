import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const sidebar = style({
  width: "280px",
  height: "100vh",
  backgroundColor: vars.color.primary,
  color: vars.color.secondary,
  display: "flex",
  flexDirection: "column",
  padding: vars.spacing.lg,
  position: "fixed",
  left: 0,
  top: 0,
  zIndex: 1000,
  borderRight: `1px solid ${vars.color.primaryHover}`,
  boxShadow: vars.shadow.lg,
});

export const logo = style({
  fontSize: "24px",
  fontWeight: 800,
  marginBottom: vars.spacing.xl,
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  color: vars.color.secondary,
  textDecoration: "none",
  letterSpacing: "-0.04em",
});

export const logoEmoji = style({
  fontSize: "28px",
});

export const logoText = style({
  background: `linear-gradient(to right, ${vars.color.secondary}, ${vars.color.accent})`,
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
});

export const nav = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xl,
  flex: 1,
});

export const navSection = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const sectionLabel = style({
  fontSize: "10px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "rgba(255, 255, 255, 0.4)",
  paddingLeft: vars.spacing.md,
  marginBottom: vars.spacing.xs,
});

export const navLink = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.md,
  padding: `${vars.spacing.sm} ${vars.spacing.md}`,
  borderRadius: vars.borderRadius.md,
  color: vars.color.secondary,
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: 600,
  transition: "all 0.2s",
  opacity: 0.8,
  ":hover": {
    opacity: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    transform: "translateX(4px)",
  },
});

export const navIcon = style({
  fontSize: "18px",
});

export const navLinkActive = style([
  navLink,
  {
    opacity: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderLeft: `4px solid ${vars.color.accent}`,
    color: vars.color.white,
  },
]);

export const recentList = style({
  display: "flex",
  flexDirection: "column",
  gap: "2px",
});

export const recentItem = style({
  display: "flex",
  alignItems: "center",
  gap: vars.spacing.sm,
  padding: `${vars.spacing.xs} ${vars.spacing.md}`,
  borderRadius: vars.borderRadius.sm,
  color: "rgba(255, 255, 255, 0.7)",
  textDecoration: "none",
  fontSize: "13px",
  transition: "all 0.15s",
  ":hover": {
    color: vars.color.white,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
});

export const recentImageContainer = style({
  width: "24px",
  height: "24px",
  borderRadius: vars.borderRadius.sm,
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

export const recentName = style({
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export const footer = style({
  marginTop: "auto",
  paddingTop: vars.spacing.lg,
  borderTop: "1px solid rgba(255, 255, 255, 0.1)",
});

export const createButton = style({
  width: "100%",
  backgroundColor: vars.color.accent,
  color: vars.color.primary,
  border: "none",
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  borderRadius: vars.borderRadius.md,
  fontSize: "12px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  cursor: "pointer",
  transition: "all 0.2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: vars.spacing.sm,
  ":hover": {
    backgroundColor: "#e5b484",
    transform: "translateY(-1px)",
    boxShadow: vars.shadow.md,
  },
});

export const contentArea = style({
  marginLeft: "280px",
  width: "calc(100% - 280px)",
  minHeight: "100vh",
  backgroundColor: vars.color.background,
});
