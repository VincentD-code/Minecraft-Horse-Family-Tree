import { FormControlLabel, Switch } from "@mui/material";

interface StatusModeSwitchProps {
  showStatusMode: boolean;
  handleToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function StatusModeSwitch({
  showStatusMode,
  handleToggle,
}: StatusModeSwitchProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={showStatusMode}
          onChange={handleToggle}
          size="small"
          color="secondary"
        />
      }
      label={showStatusMode ? "Life Status View" : "Normal View"}
      style={{ margin: 0 }}
    />
  );
}
