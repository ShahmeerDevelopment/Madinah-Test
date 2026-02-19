// import React from "react";
// import { signIn, useSession } from "next-auth/react";
// import googleIcon from "@/assets/svg/socialIcons/googleIcon.svg";
// import SocialAuthBtn from "@/components/advance/SocialAuthBtn";
// import useSocialAuth from "@/hooks/useSocialAuth";

// const GoogleSignIn = () => {
//   const handleSignIn = () => {
//     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//     const clientSecret = process.env.NEXT_PUBLIC_GOOGLE_SECRET;
//     console.log(clientId);
//     console.log(clientSecret);
//     // Specify the provider and callback URL
//     signIn("google", {
//       callbackUrl:
//         "https://md-user-frontend-dev-next-4c9fe5dacf4c.herokuapp.com/",
//     });
//   };

//   return <SocialAuthBtn source={googleIcon} action={handleSignIn} />;
// };

// export default GoogleSignIn;
"use client";

import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import useSocialAuth from "@/hooks/useSocialAuth";
import { ASSET_PATHS } from "@/utils/assets";
const googleIcon = ASSET_PATHS.social.google;
import SocialAuthBtn from "@/components/advance/SocialAuthBtn";

const GoogleSignIn = () => {
	const socialAuth = useSocialAuth();

	const login = useGoogleLogin({
		onSuccess: (codeResponse) => {
			socialAuth("google", codeResponse.access_token);
		},
		onError: (error) => console.error("Login Failed:", error),
	});

	return <SocialAuthBtn source={googleIcon} action={login} />;
};

export default GoogleSignIn;
