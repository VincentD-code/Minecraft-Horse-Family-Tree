import { style } from "@vanilla-extract/css";

export const container = style({
  display: "flex",
  flexDirection: "column",
  margin: 10,
  padding: 10,
  borderRadius: 8,
  gap: "10px"
});

export const field = style({
  maxHeight: 40,
  maxWidth: 300,
});

export const fields = style({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

export const nameField = style({
  maxHeight: 40,
  maxWidth: 300,
  borderRadius: "3spx",
  borderWidth: "1px",
  borderColor: "grey",
});

export const nameRow = style({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
});
