import {Bucket} from "@upstash/blob";
import dotenv from "dotenv";
dotenv.config();

const bucket = new Bucket({
  token: process.env.UPSTASH_BLOB_TOKEN,
});
// console.log("Upstash bucket initialized", bucket);
export default bucket;