import React, { useState } from "react";
import { Grid, TextField } from "@mui/material";
import ConfirmButton from "../Button/ConfirmButton";
import CancelButton from "../Button/CancelButton";

export default function CustomInput(props) {
  const { defaultValue, saveText, cancelEdit } = props;
  const [value, setValue] = useState(defaultValue);
  const [disableConfirm, setDisableComfirm] = useState(true);

  const updateText = () => {
    saveText(value);
  };

  return (
    <>
      <Grid flex-direction="row" container>
        <Grid item width="100%">
          <TextField
            fullWidth
            onChange={(e) => {
              if (e.target.value != defaultValue && e.target.value != "") {
                setDisableComfirm(false);
              }
              setValue(e.target.value);
            }}
            value={value}
          />
        </Grid>
        <Grid item container mt={1} flexDirection="row">
          <Grid mr={2}>
            <ConfirmButton disabled={disableConfirm} onClick={updateText} />
          </Grid>
          <Grid>
            <CancelButton pl={2} onClick={cancelEdit}></CancelButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
