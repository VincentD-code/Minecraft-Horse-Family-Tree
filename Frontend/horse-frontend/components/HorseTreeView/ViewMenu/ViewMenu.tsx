import { Dispatch, SetStateAction } from "react";
import { ViewMode } from "../HorseTreeView";
import * as styles from "./ViewMenu.css";
import { setCookie } from "cookies-next";
import { useReactFlow } from "@xyflow/react";
import Button from "@/components/Button/Button";
import StatusModeSwitch from "../StatusModeSwitch/StatusModeSwitch";

interface ViewMenuProps {
  setView: Dispatch<SetStateAction<ViewMode>>;
  view: ViewMode;
  showStatusMode: boolean;
  setShowStatusMode: Dispatch<SetStateAction<boolean>>;
}

export default function ViewMenu({ 
  setView, 
  view, 
  showStatusMode, 
  setShowStatusMode 
}: ViewMenuProps) {
  const { fitView } = useReactFlow();
  const toggleView = (mode: ViewMode) => {
    setView(mode);
    setCookie("horse-tree-view", mode, { maxAge: 60 * 60 * 24 * 30 }); // Save for 30 days

    setTimeout(() => fitView({ duration: 800 }), 50);
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
        View Options
      </p>
      <div style={{ padding: "0 8px" }}>
        <StatusModeSwitch 
          showStatusMode={showStatusMode} 
          handleToggle={(e) => setShowStatusMode(e.target.checked)} 
        />
      </div>

      <p className={styles.menuLabel} style={{ marginTop: "16px" }}>
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
