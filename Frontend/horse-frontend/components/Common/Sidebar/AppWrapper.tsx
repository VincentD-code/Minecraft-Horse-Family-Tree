import { getAllHorses } from "@/lib/horses";
import Sidebar from "./Sidebar";
import * as styles from "./Sidebar.css";

export default async function AppWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const horses = await getAllHorses();

  return (
    <div style={{ display: "flex" }}>
      <Sidebar horses={horses} />
      <main className={styles.contentArea}>{children}</main>
    </div>
  );
}
