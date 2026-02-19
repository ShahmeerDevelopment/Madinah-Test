"use client";

import React, { useState } from "react";
import { LoginSocialApple } from "reactjs-social-login";
import useSocialAuth from "@/hooks/useSocialAuth";
import { ASSET_PATHS } from "@/utils/assets";
const apple = ASSET_PATHS.social.apple;
import SocialAuthBtn from "@/components/advance/SocialAuthBtn";

const AppleLogin = () => {
	const socialAuth = useSocialAuth();
	const [provider, setProvider] = useState("");
	const [profile, setProfile] = useState(null);
	console.info(provider);
	console.info(profile);
	const REDIRECT_URI = process.env.NEXT_PUBLIC_APPLE_REDIRECT_URL;

	const handleAppleLoginSuccess = (response) => {
		const user = response.data.user;
		setProvider("apple");
		setProfile(user);
		socialAuth("apple", response, user);
	};

	return (
		<>
			{typeof window !== "undefined" && (
				<LoginSocialApple
					client_id={process.env.NEXT_PUBLIC_APPLE_ID || ""}
					scope={"name email"}
					redirect_uri={REDIRECT_URI}
					onResolve={handleAppleLoginSuccess}
					onReject={(err) => {
						console.log(err);
					}}
				>
					<SocialAuthBtn source={apple} />
				</LoginSocialApple>
			)}
		</>
	);
};

export default AppleLogin;
