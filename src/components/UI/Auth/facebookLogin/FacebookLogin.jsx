"use client";

import React, { useState } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import useSocialAuth from "@/hooks/useSocialAuth";
import { ASSET_PATHS } from "@/utils/assets";
const facebook = ASSET_PATHS.social.facebook;
import SocialAuthBtn from "@/components/advance/SocialAuthBtn";

const FacebookLogin = () => {
	const socialAuth = useSocialAuth();
	const facebookId = process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "";

	const [provider, setProvider] = useState("");

	const resolveHandler = (data) => {
		socialAuth("facebook", data.accessToken, data);
	};

	console.info({ provider });
	return (
		<>
			{typeof window !== "undefined" && (
				<LoginSocialFacebook
					version="v18.0"
					fieldsProfile="id,first_name,last_name,middle_name,name,name_format,picture,short_name,email,gender"
					appId={facebookId}
					onResolve={({ provider, data }) => {
						setProvider(provider);
						resolveHandler(data);
					}}
					onReject={(err) => {
						console.log(err);
					}}
				>
					<SocialAuthBtn source={facebook} />
				</LoginSocialFacebook>
			)}
		</>
	);
};

export default FacebookLogin;
