import { Button } from "@mui/material";
import { cancelButtonStyle } from "../../styles/buttonStyles";

export default function CancelButton(props) {
  return (
    <Button
      data-testid="cancel-btn"
      onClick={props.onClick}
      variant="text"
      sx={cancelButtonStyle}
    >
      Cancel
    </Button>
  );
}
