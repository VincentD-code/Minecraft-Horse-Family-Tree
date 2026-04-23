import { style, globalStyle } from "@vanilla-extract/css";
import { vars } from "@/styles/theme.css";

export const overlay = style({
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
})

export const modal = style({
    backgroundColor: vars.color.white,
    color: vars.color.textMain,
    padding: vars.spacing.xl,
    borderRadius: vars.borderRadius.lg,
    width: "440px",
    maxWidth: "95%",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: vars.shadow.lg,
    display: "flex",
    flexDirection: "column",
    gap: vars.spacing.lg,
})

globalStyle(`${modal} h2`, {
    margin: 0,
    fontSize: vars.fontSize.xl,
    fontWeight: vars.fontWeight.extrabold,
    color: vars.color.primary,
    letterSpacing: "-0.02em",
    borderBottom: `2px solid ${vars.color.secondary}`,
    paddingBottom: vars.spacing.sm,
    marginBottom: vars.spacing.sm,
});