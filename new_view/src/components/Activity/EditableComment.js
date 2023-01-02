import React, { useState } from "react";
import { Avatar, Button, Grid, Typography } from "@mui/material";
import CustomInput from "./CustomInput";
import { deleteComment, updateComment } from "../../api/mock_api_k";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import {
  editCommentButtonStyle,
  editCommentIconStyle,
} from "../../styles/buttonStyles";

export default function EditableComment(props) {
  const {
    commentText,
    commentorName,
    commentorProfile,
    createdAt,
    postId,
    commentId,
    commentorId,
    reFetchComments,
  } = props;
  const [value, setValue] = useState(commentText);
  const [edit, setEdit] = useState(false);
  const formattedTime = new Date(createdAt).toLocaleDateString("en-US");

  const handleEdit = () => {
    setEdit(true);
  };

  const handleDelete = async () => {
    try {
      await deleteComment(postId, commentId);
      reFetchComments(postId);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async (val) => {
    setValue(val); // now the value state stores the comment after editing
    const newCommentObj = {
      commentText: val,
      commentorId: commentorId,
      createdAt: createdAt,
    };
    try {
      await updateComment(commentId, newCommentObj);
      setEdit(false);
    } catch (e) {
      console.error(e);
    }
  };

  const close = () => {
    setEdit(false);
  };

  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      mb={2}
    >
      <Grid container item justifyContent="flex-start">
        <Grid item>
          <Avatar src={commentorProfile} alt={commentorName} />
        </Grid>
        <Grid item pl={1} pt={1}>
          <Typography data-testid="test-name" variant="subtitle1">
            {commentorName ? commentorName : "userName"}
          </Typography>
        </Grid>
        <Grid item pl={1} pt={1.5}>
          <Typography sx={{ fontSize: "14px" }}>{formattedTime}</Typography>
        </Grid>
      </Grid>

      <Grid item container ml={1} mt={1} flexDirection="column">
        {!edit ? (
          <>
            <Grid item>
              <Typography className="myComment">{value}</Typography>
            </Grid>
            <Grid alignSelf="flex-end">
              <Button
                data-testid="edit-btn"
                onClick={handleEdit}
                style={editCommentButtonStyle}
              >
                <ModeEditOutlineOutlinedIcon style={editCommentIconStyle} />
              </Button>
              <Button
                className="deleteCyComment"
                data-testid="delete-btn"
                onClick={handleDelete}
                style={editCommentButtonStyle}
              >
                <DeleteOutlineIcon style={editCommentIconStyle} />
              </Button>
            </Grid>
          </>
        ) : (
          <CustomInput
            data-testid="input-test"
            defaultValue={value}
            saveText={handleSave}
            cancelEdit={close}
          />
        )}
      </Grid>
    </Grid>
  );
}
