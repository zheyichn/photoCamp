import { Button } from "@mui/material";
import { confirmButtonStyle } from "../../styles/buttonStyles";

export default function ConfirmButton(props) {
  return (
    <Button
      data-testid="confirm-btn"
      variant="text"
      disabled={props.disabled}
      onClick={props.onClick}
      sx={confirmButtonStyle}
    >
      Confirm
    </Button>
  );
}
