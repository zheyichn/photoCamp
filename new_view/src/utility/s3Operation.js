import axios from "axios";
import { setHeaders } from "../api/session_management";
// get secure url from our server
// import env from "react-dotenv";

export async function s3Operation(imageFile) {
  // get secure url from our server
  setHeaders();

  const domain =
    !process.env.NODE_ENV || process.env.NODE_ENV === "development"
      ? "http://localhost:8080"
      : "";
  const res = await axios.get(`${domain}/api/s3Url`);
  const url = res.data.url;
  // console.log(url);
  // post the image direclty to the s3 bucket
  await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: imageFile,
  });

  const imageUrl = url.split("?")[0];
  return imageUrl;
}
