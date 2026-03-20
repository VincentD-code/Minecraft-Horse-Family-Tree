import { style } from "@vanilla-extract/css";

export const container = style({
  margin: 10,
  padding: 10,
  borderRadius: 8,
  backgroundColor: "#E0E0E0"
});

export const row = style({
    display: "flex"
})

export const field = style({
    maxHeight: 40,
    maxWidth: 300,
});
