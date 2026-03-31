import { FormControlLabel } from "@mui/material";
import Switch from "@mui/material/Switch";

interface SwitchProps{
    rawStatsView: boolean;
    handleViewChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ViewSwitch({rawStatsView, handleViewChange}: SwitchProps) {
  return (
    <FormControlLabel
      control={
        <Switch
          checked={!rawStatsView}
          onChange={handleViewChange}
          size="small"
        />
      }
      label={rawStatsView ? "Raw Stats" : "Processed Stats"}
    />
  );
}
