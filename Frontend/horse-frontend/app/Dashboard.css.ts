import { style } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const container = style({
  padding: vars.spacing.xl,
  maxWidth: "1200px",
  margin: "0 auto",
});

export const header = style({
  marginBottom: vars.spacing.xl,
});

export const title = style({
  fontSize: vars.fontSize.xxl,
  fontWeight: vars.fontWeight.extrabold,
  color: vars.color.primary,
  marginBottom: vars.spacing.xs,
});

export const subtitle = style({
  fontSize: vars.fontSize.md,
  color: vars.color.textMuted,
});

export const statsGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: vars.spacing.lg,
  marginBottom: vars.spacing.xl,
});

export const statCard = style({
  backgroundColor: vars.color.white,
  padding: vars.spacing.lg,
  borderRadius: vars.borderRadius.lg,
  boxShadow: vars.shadow.md,
  border: `1px solid ${vars.color.border}`,
  display: "flex",
  flexDirection: "column",
  gap: vars.spacing.xs,
});

export const statLabel = style({
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  color: vars.color.textMuted,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
});

export const statValue = style({
  fontSize: vars.fontSize.xxl,
  fontWeight: vars.fontWeight.extrabold,
  color: vars.color.primary,
});

export const section = style({
  backgroundColor: vars.color.white,
  borderRadius: vars.borderRadius.lg,
  boxShadow: vars.shadow.md,
  border: `1px solid ${vars.color.border}`,
  overflow: "hidden",
});

export const sectionHeader = style({
  padding: vars.spacing.lg,
  borderBottom: `1px solid ${vars.color.border}`,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: vars.color.secondary,
});

export const sectionTitle = style({
  fontSize: vars.fontSize.lg,
  fontWeight: vars.fontWeight.extrabold,
  color: vars.color.primary,
  letterSpacing: "-0.01em",
});

export const tableWrapper = style({
  overflowX: "auto",
});

export const table = style({
  width: "100%",
  borderCollapse: "collapse",
  fontSize: vars.fontSize.sm,
});

export const th = style({
  textAlign: "left",
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  backgroundColor: vars.color.white,
  color: vars.color.textMuted,
  fontSize: vars.fontSize.xs,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  fontWeight: vars.fontWeight.bold,
  borderBottom: `1px solid ${vars.color.border}`,
});

export const td = style({
  padding: `${vars.spacing.md} ${vars.spacing.lg}`,
  borderBottom: `1px solid ${vars.color.border}`,
  color: vars.color.textMain,
  verticalAlign: "middle",
});

export const imageCell = style({
  width: "48px",
  paddingRight: 0,
});

export const smallImageContainer = style({
  width: "36px",
  height: "36px",
  borderRadius: vars.borderRadius.sm,
  backgroundColor: vars.color.secondary,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
});

export const smallHorseImage = style({
  objectFit: "contain",
});

export const tr = style({
  ":hover": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  cursor: "pointer",
});

export const badge = style({
  padding: "4px 12px",
  borderRadius: vars.borderRadius.full,
  fontSize: vars.fontSize.xs,
  fontWeight: vars.fontWeight.bold,
  textTransform: "uppercase",
});

export const badgeAlive = style([
  badge,
  {
    backgroundColor: "#dcfce7",
    color: "#166534",
  },
]);

export const badgeDead = style([
  badge,
  {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
]);
