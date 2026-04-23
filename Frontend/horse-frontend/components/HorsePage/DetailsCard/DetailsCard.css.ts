import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const detailsSection = style({
  backgroundColor: vars.color.white,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  padding: vars.spacing.xl,
  boxShadow: vars.shadow.sm,
});

export const lineageSection = style({
  marginTop: vars.spacing.xl,
});

export const parentGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: vars.spacing.md,
  marginTop: vars.spacing.sm,
});

export const parentBox = style({
  padding: vars.spacing.md,
  backgroundColor: vars.color.secondary,
  border: `1px solid ${vars.color.border}`,
  borderRadius: vars.borderRadius.md,
  transition: "border-color 0.2s ease",
  selectors: {
    '&[data-gender="sire"]': { borderLeft: `6px solid #3b82f6` },
    '&[data-gender="dam"]': { borderLeft: `6px solid #ec4899` },
  },
});

export const parentLabel = style({
  display: "block",
  fontSize: vars.fontSize.xs,
  textTransform: "uppercase",
  color: vars.color.textMuted,
  fontWeight: vars.fontWeight.extrabold,
  marginBottom: vars.spacing.xs,
  letterSpacing: "0.05em",
});

export const parentName = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.semibold,
  color: vars.color.textMain,
  margin: 0,
});

export const divider = style({
  border: 0,
  borderTop: `2px dashed ${vars.color.border}`,
  margin: `${vars.spacing.xl} 0`,
});

export const bloodlineWrapper = style({
  marginTop: vars.spacing.sm,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.sm,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: vars.fontWeight.extrabold,
  color: vars.color.textMuted,
  marginBottom: vars.spacing.md,
});

export const detailRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: `${vars.spacing.md} 0`,
  fontSize: vars.fontSize.md,
  borderBottom: `1px solid ${vars.color.secondary}`,
});

// Target the 'strong' tag inside 'detailRow'
globalStyle(`${detailRow} strong`, {
  color: vars.color.textMain,
  fontWeight: vars.fontWeight.bold,
});

// Target the 'span' tag inside 'detailRow'
globalStyle(`${detailRow} span`, {
  color: vars.color.textMain,
  fontWeight: vars.fontWeight.medium,
  backgroundColor: vars.color.secondary,
  padding: "4px 12px",
  borderRadius: vars.borderRadius.sm,
  border: `1px solid ${vars.color.border}`,
});