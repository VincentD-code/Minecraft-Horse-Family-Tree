import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: "32px",
  marginTop: "40px",
  marginBottom: "48px",
  backgroundColor: vars.color.white,
  padding: vars.spacing.xl,
  borderRadius: vars.borderRadius.lg,
  boxShadow: vars.shadow.md,
  border: `1px solid ${vars.color.border}`,
});

export const imageContainer = style({
  width: "120px",
  height: "120px",
  borderRadius: vars.borderRadius.md,
  backgroundColor: vars.color.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
  flexShrink: 0,
  border: `1px solid ${vars.color.border}`,
});

export const variantImage = style({
  objectFit: "contain",
});

export const titles = style({
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const statusAlive = style({
  padding: "4px 12px",
  borderRadius: vars.borderRadius.full,
  backgroundColor: "#dcfce7",
  color: "#166534",
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  alignSelf: "flex-start",
});

export const statusDead = style({
  padding: "4px 12px",
  borderRadius: vars.borderRadius.full,
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
  alignSelf: "flex-start",
});

export const heading = style({
  fontSize: vars.fontSize.display,
  fontWeight: vars.fontWeight.black,
  margin: 0,
  letterSpacing: "-0.05em",
  color: vars.color.primary,
  lineHeight: 1,
});

export const subHeading = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textMuted,
  fontWeight: vars.fontWeight.medium,
  margin: 0,
});
