import { style } from "@vanilla-extract/css";

export const switchWrapper = style({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  margin: "10px 0",
});

export const reverse = style({
  flexDirection: "row-reverse",
  justifyContent: "flex-end",
});

export const label = style({
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: "11px",
  fontWeight: 800,
  color: "#2d4a3e",
});

export const switchContainer = style({
  position: "relative",
  display: "inline-block",
  width: "40px",
  height: "20px",
});

// We style the input directly instead of targeting it from the container
export const input = style({
  opacity: 0,
  width: 0,
  height: 0,
  position: "absolute", // ensure it doesn't take up space
});

export const slider = style({
  position: "absolute",
  cursor: "pointer",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "#ccc",
  transition: ".4s",
  borderRadius: "20px",
  ":before": {
    position: "absolute",
    content: '""',
    height: "16px",
    width: "16px",
    left: "2px",
    bottom: "2px",
    backgroundColor: "white",
    transition: ".4s",
    borderRadius: "50%",
  },
  selectors: {
    // Look "up" to see if the sibling input is checked
    [`${input}:checked + &`]: {
      backgroundColor: "#2d4a3e",
    },
    [`${input}:checked + &:before`]: {
      transform: "translateX(20px)",
    },
  },
});