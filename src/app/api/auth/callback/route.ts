import { NextRequest, NextResponse } from "next/server";

import { authClient } from "@/utilities/auth";
import { waitFor } from "@/utilities/delay";
import { PUBLIC_URL } from "@/utilities/variables";

export const GET = async (request: NextRequest) => {
    let response: NextResponse | null = null;

    authClient.verifyAssertion(request.url, async (error, authResult) => {
        if (error != null || !authResult?.authenticated) {
            console.error("OpenID login failed: ", error, authResult);

            response = NextResponse.json({ message: "OpenID login failed" }, { status: 500 });

            return;
        }

        if (!authResult.claimedIdentifier) {
            response = NextResponse.json({ message: "Response identifier was invalid" }, { status: 500 });

            return;
        }

        const segments = authResult.claimedIdentifier.split("/");
        const steamId = segments[segments.length - 1];

        if (!steamId) {
            console.log("Steam ID parsing failed: ", authResult);

            response = NextResponse.json({ message: "SteamID was invalid" }, { status: 500 });

            return;
        }

        console.debug("User authenticated: ", steamId);

        const redirectUrl = `${PUBLIC_URL}/achievements`;

        response = NextResponse.redirect(redirectUrl);

        // Cookie expires in 3 months
        const cookieExpiration = new Date();
        cookieExpiration.setMonth(cookieExpiration.getMonth() + 3);
        
        response.cookies.set("STEAM_USER_ID", steamId, {
            secure: process.env.NODE_ENV === "production",
            sameSite: true,
            expires: cookieExpiration
        });
    });

    console.debug("Verification started. Waiting for response...");

    const success = await waitFor(() => response != null);

    if (!success || response == null) {
        return NextResponse.json({ message: "OpenID authorization failed. Timeout exceeded" }, { status: 500 });
    }

    return response;
};

