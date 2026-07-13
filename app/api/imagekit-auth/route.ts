import Imagekit from "imagekit";
import { NextResponse } from "next/server";

function getImageKit() {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey || !privateKey || !urlEndpoint) {
        throw new Error("ImageKit environment variables are not configured");
    }

    return new Imagekit({
        publicKey,
        privateKey,
        urlEndpoint,
    });
}

export async function GET() {
    try {
        const imagekit = getImageKit();
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch {
        return NextResponse.json({ message: "Failed to generate authentication parameters" }, { status: 500 });
    }
}
