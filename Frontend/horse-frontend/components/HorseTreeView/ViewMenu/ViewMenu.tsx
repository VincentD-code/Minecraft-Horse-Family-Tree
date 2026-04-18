import { Dispatch, SetStateAction } from "react";
import { ViewMode } from "../HorseTreeView";
import * as styles from "./ViewMenu.css";
import { setCookie } from "cookies-next";
import { useReactFlow } from "@xyflow/react";
import Button from "@/components/Button/Button";
import Switch from "@/components/Switch/Switch";

interface ViewMenuProps {
  setView: Dispatch<SetStateAction<ViewMode>>;
  view: ViewMode;
  statusView: boolean;
  setStatusView: Dispatch<SetStateAction<boolean>>;
}

export default function ViewMenu({ setView, view, statusView, setStatusView }: ViewMenuProps) {
  const { fitView } = useReactFlow();
  const toggleView = (mode: ViewMode) => {
    setView(mode);
    setCookie("horse-tree-view", mode, { maxAge: 60 * 60 * 24 * 30 }); // Save for 30 days

    setTimeout(() => fitView({ duration: 800 }), 50);
  };

  const handleStatusToggle = (checked: boolean) => {
    setStatusView(checked);
    setCookie("horse-status-view", checked ? "true" : "false", { maxAge: 60 * 60 * 24 * 30 });
  };

  return (
    <div className={styles.menuWrapper}>
      <p className={styles.menuLabel}>Layout Mode</p>

      <Button
        onClick={() => toggleView("base")}
        className={
          view === "base"
            ? styles.baseButtonActive
            : styles.baseButtonInactive
        }
        text="Traditional Lineage Tree"
      />

      <p className={styles.menuLabel} style={{ marginTop: "16px" }}>
        View Filters
      </p>
      <Switch 
        label="Dead/Alive Highlight" 
        checked={statusView} 
        onChange={handleStatusToggle} 
      />

      <p className={styles.menuLabel} style={{ marginTop: "8px" }}>
        Rank by Stat (Left to Right)
      </p>
      <div className={styles.statGrid}>
        {(["speed", "jump", "health"] as const).map((stat) => (
          <Button
            key={stat}
            onClick={() => toggleView(stat)}
            className={
              view === stat
                ? styles.statButtonActive
                : styles.statButtonInactive
            }
            text={stat}
          />
        ))}
      </div>

      <Button
        onClick={() => fitView({ duration: 800, padding: 0.2 })}
        className={styles.resetButton}
        text="🔍 Reset Zoom"
      />
    </div>
  );
}
