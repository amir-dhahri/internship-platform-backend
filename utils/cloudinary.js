import { Readable } from "node:stream";
import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
    throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export async function uploadImage(file) {
    const base64Data = file.buffer.toString("base64");
    const fileUri = `data:${file.mimetype};base64,${base64Data}`;
    const result = await cloudinary.uploader.upload(fileUri, {
        folder: "university",
    });
    return result.secure_url;
}

export async function uploadPdf(file) {
    const base64Data = file.buffer.toString("base64");
    const fileUri = `data:${file.mimetype};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(fileUri, {
        folder: "university/cvs",
        resource_type: "raw", 
    });

    return {
        url: result.secure_url,
        public_id: result.public_id,
    };
}