import TextField from '@mui/material/TextField';
// import { useEffect, useState } from 'react';

export default function PopUpTextField(props) {

    const {field, postInfo, defaultValue} = props;

    let textValue = defaultValue;
    
    if (field === 'imageSrc') {
        postInfo.current.imageSrc = textValue;
    }

    if (field === 'postCaption') {
        postInfo.current.postCaption = textValue;
    }

    const changeRef = (e) => {
        textValue = e.target.value;
        if (field === 'imageSrc') {
            postInfo.current.imageSrc = textValue;
        }
        if (field === 'postCaption') {
            postInfo.current.postCaption = textValue;
        }
    }

    return(
        <TextField fullWidth onChange={changeRef} defaultValue={defaultValue || ''} />
    );
}