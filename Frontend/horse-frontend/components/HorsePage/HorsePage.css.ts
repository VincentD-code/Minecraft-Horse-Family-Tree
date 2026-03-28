import { style, globalStyle } from "@vanilla-extract/css";

export const pageWrapper = style({
  padding: "40px 20px",
  maxWidth: "850px",
  margin: "0 auto",
  backgroundColor: "#fdfbf7", 
  minHeight: "100vh",
  borderLeft: "8px solid #2d4a3e",
  fontFamily: "Inter, system-ui, sans-serif",
});

export const header = style({
  display: "flex",
  alignItems: "center",
  gap: "20px",
  marginBottom: "32px",
});

export const heading = style({
  fontSize: "42px",
  fontWeight: 800,
  margin: 0,
  letterSpacing: "-0.04em",
  textShadow: "0.5px 1px 2px rgba(0,0,0,0.1)",
  textTransform: "capitalize",
});

// Matches the 'statsGrid' property in your TSX
export const statsShapeGrid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "24px",
  marginBottom: "40px",
});

/** * HORSE SHAPE CARDS
 * Replaces the old rectangular statCard logic
 */
export const shapeCard = style({
  position: "relative",
  width: "100%",
  aspectRatio: "1 / 1",
  paddingTop: "100%", 
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  ":hover": {
    transform: "scale(1.08) rotate(2deg)",
  },
  ":before": {
    content: '""',
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "var(--shape-color)", 
    WebkitMaskSize: "contain", 
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    imageRendering: "pixelated",
  },
});

export const shapeTextContainer = style({
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center", 
  alignItems: "center",   
  color: "white", 
  zIndex: 10,
  textAlign: "center",
  textShadow: "0px 1px 4px rgba(0,0,0,0.4)",
  padding: "15%",
});

export const shapeLabel = style({
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  opacity: 0.9,
});

export const shapeValue = style({
  fontSize: "26px", 
  fontWeight: 900,
  margin: "0",
  zIndex: 20,
  display: "flex",
  alignItems: "baseline", 
  gap: "4px", 
});

export const shapeUnit = style({
  fontSize: "10px", // Standardizing the units
  fontWeight: 500,
  opacity: 0.8,
});

/** * SHAPE MASKS
 * Replace these URLs with your actual SVG paths 
 */
globalStyle(`${shapeCard}[data-shape="speed"]::before`, {
  WebkitMaskImage: 'url("/shapes/horse-running.svg")',
  maskImage: 'url("/shapes/horse-running.svg")',
});

globalStyle(`${shapeCard}[data-shape="jump"]::before`, {
  WebkitMaskImage: 'url("/shapes/horse-jumping.svg")',
  maskImage: 'url("/shapes/horse-jumping.svg")',
});

globalStyle(`${shapeCard}[data-shape="health"]::before`, {
  WebkitMaskImage: 'url("/shapes/heart.svg")',
  maskImage: 'url("/shapes/heart.svg")',
});

globalStyle(`${shapeCard}[data-shape="generation"]::before`, {
  WebkitMaskImage: 'url("/shapes/scroll.svg")',
  maskImage: 'url("/shapes/scroll.svg")',
});

/** * UI ELEMENTS 
 */
export const statusAlive = style({
  padding: "6px 16px",
  borderRadius: "99px",
  backgroundColor: "#2d4a3e", 
  color: "#fdfbf7",
  fontSize: "13px",
  fontWeight: 700,
  textTransform: "uppercase",
});

export const statusDead = style({
  padding: "6px 16px",
  borderRadius: "99px",
  backgroundColor: "#fee2e2",
  color: "#991b1b",
  fontSize: "13px",
  fontWeight: 700,
  textTransform: "uppercase",
});

export const backButton = style({
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: "11px",
  fontWeight: 800,
  color: "#2d4a3e",
  border: "2px solid #2d4a3e",
  background: "transparent",
  padding: "10px 24px",
  cursor: "pointer",
  marginBottom: "40px",
  transition: "all 0.2s ease",
  ":hover": {
    background: "#2d4a3e",
    color: "white"
  }
});

export const detailsSection = style({
  backgroundColor: "white",
  border: "1px solid #e5e0d8",
  borderRadius: "8px",
  padding: "32px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", 
});

export const detailRow = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "16px 0",
  fontSize: "15px",
  borderBottom: "1px solid #f1f1f1", 
});

// Target the 'strong' tag inside 'detailRow'
globalStyle(`${detailRow} strong`, {
  color: "#1e293b",
  fontWeight: 700,
});

// Target the 'span' tag inside 'detailRow'
globalStyle(`${detailRow} span`, {
  color: "#334155",
  fontWeight: 500,
  backgroundColor: "#f8fafc",
  padding: "4px 12px",
  borderRadius: "6px",
  border: "1px solid #e2e8f0",
});

export const sectionTitle = style({
  fontSize: "14px",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontWeight: 800,
  color: "#475569",
  marginBottom: "16px",
});

/** * LINEAGE & BLOODLINES
 */
export const lineageSection = style({
  marginTop: "32px",
});

export const parentGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "16px",
  marginTop: "12px",
});

export const parentBox = style({
  padding: "16px",
  backgroundColor: "#fcfaf7",
  border: "1px solid #e5e0d8",
  borderRadius: "8px",
  transition: "border-color 0.2s ease",
  selectors: {
    '&[data-gender="sire"]': { borderLeft: '6px solid #3b82f6' },
    '&[data-gender="dam"]': { borderLeft: '6px solid #ec4899' },
  }
});

export const parentLabel = style({
  display: "block",
  fontSize: "11px",
  textTransform: "uppercase",
  color: "#64748b", 
  fontWeight: 800,
  marginBottom: "6px",
  letterSpacing: "0.05em"
});

export const parentName = style({
  fontSize: "16px",
  fontWeight: 600,
  color: "#334155",
  margin: 0,
});

export const divider = style({
  border: 0,
  borderTop: "2px dashed #e5e0d8",
  margin: "32px 0",
});

export const bloodlineWrapper = style({
  marginTop: "8px",
});

export const shapeSubtext = style({
  fontSize: "10px",
  fontWeight: 700,
  textTransform: "uppercase",
  opacity: 0.8,
  marginTop: "4px"
});