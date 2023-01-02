const aws = require("aws-sdk");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const crypto = require("crypto");
const util = require("util");

const randomBytes = util.promisify(crypto.randomBytes);

const region = "us-east-1";
const bucketName = "cis557jjk";
const accessKeyId = process.env.accessKeyId;
const secrectAccessKey = process.env.secrectAccessKey;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secrectAccessKey,
  signatureVersion: "v4",
});

module.exports = async function generateUploadURL() {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 60,
  };

  const uploadURL = await s3.getSignedUrlPromise("putObject", params);
  return uploadURL;
};
