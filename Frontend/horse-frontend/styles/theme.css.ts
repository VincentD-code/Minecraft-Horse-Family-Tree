import { createGlobalTheme } from "@vanilla-extract/css";

export const vars = createGlobalTheme(":root", {
  color: {
    primary: "#2d4a3e",       // Forest Green
    primaryHover: "#1e3229",
    secondary: "#fdfbf7",     // Off-white/Cream
    danger: "#800505",
    dangerBg: "#fee2e2",
    textMain: "#1f2937",
    textMuted: "#6b7280",
    border: "#e5e7eb",
    background: "#fdfbf7",
    backgroundDark: "#1a2c25", // Dark Forest Green
    white: "#ffffff",
    accent: "#d4a373",        // Sandy/Wood accent
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  font: {
    main: "var(--font-geist-sans), sans-serif",
    mono: "var(--font-geist-mono), monospace",
  },
  fontSize: {
    xs: "11px",
    sm: "13px",
    md: "15px",
    lg: "18px",
    xl: "24px",
    xxl: "32px",
    display: "48px",
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
    black: "900",
  }
});
