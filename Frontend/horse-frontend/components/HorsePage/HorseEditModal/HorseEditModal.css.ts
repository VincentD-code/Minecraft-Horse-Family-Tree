import { style, globalStyle } from "@vanilla-extract/css";

export const overlay = style({
    position: "fixed",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
})

export const modal = style({
    backgroundColor: "#fff",
    color: "#000000",
    padding: "24px",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
})

export const statRow = style({
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
})

export const buttonRow = style({
    display: "flex",
    justifyContent: "space-between",
})