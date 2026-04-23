import { getRecentHorses } from "@/lib/horses";
import Sidebar from "./Sidebar";
import * as styles from "./Sidebar.css";

export default async function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const fallbackHorses = await getRecentHorses(5);

  return (
    <div style={{ display: "flex" }}>
      <Sidebar fallbackHorses={fallbackHorses} />
      <main className={styles.contentArea}>{children}</main>
    </div>
  );
}
