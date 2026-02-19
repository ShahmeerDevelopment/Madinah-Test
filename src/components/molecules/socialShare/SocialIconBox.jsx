"use client";

import PropTypes from "prop-types";
import React from "react";
import toast from "react-hot-toast";
import Image from "next/image";

import {
	EmailShareButton,
	FacebookShareButton,
	TwitterShareButton,
	WhatsappShareButton,
	TelegramShareButton,
} from "react-share";

import { SocialText, SocialWrapper } from "./SocialShare.style";
import { ASSET_PATHS } from "@/utils/assets";
import CopyToClipboard from "react-copy-to-clipboard";
import StackComponent from "../../atoms/StackComponent";
import GridComp from "@/components/atoms/GridComp/GridComp";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";
import TextFieldComp from "@/components/atoms/inputFields/TextFieldComp";

const SocialIconBox = ({ customUrlData, customTitle }) => {
	return (
		<div>
			<TextFieldComp
				name="fundraiserURL"
				label={"Custom URL"}
				value={customUrlData}
				placeholder={"Enter Enter Custom URL"}
				fullWidth
			/>
			<GridComp container spacing={2}>
				<GridComp item xs={6} sx={{ zIndex: 1 }}>
					<CopyToClipboard
						text={customUrlData}
						onCopy={() =>
							toast.success("Copied to clipboard!", {
								duration: 1000,
							})
						}
					>
						<SocialWrapper>
							<Image src={ASSET_PATHS.social.copyLink} width={22} height={22} alt="copyLink" />
							<SocialText>Copy link</SocialText>
						</SocialWrapper>
					</CopyToClipboard>
				</GridComp>
				<GridComp item xs={6} sx={{ zIndex: 1 }}>
					<BoxComponent sx={{ width: "100% !important" }}>
						<WhatsappShareButton
							url={customUrlData}
							title={customTitle}
							separator=": "
							className="Demo__some-network__share-button"
							style={{ width: "100%" }}
						>
							<SocialWrapper>
								<Image src={ASSET_PATHS.social.whatsapp} width={22} height={22} alt="WatsApp" />
								<SocialText>WhatsApp</SocialText>
							</SocialWrapper>
						</WhatsappShareButton>
					</BoxComponent>
				</GridComp>
				<GridComp item xs={6} sx={{ zIndex: 1 }}>
					<EmailShareButton
						url={customUrlData}
						subject={customTitle}
						className="Demo__some-network__share-button"
						style={{ width: "100%" }}
					>
						<SocialWrapper>
							<Image src={ASSET_PATHS.social.email} width={22} height={22} alt="x" />
							<SocialText>Email</SocialText>
						</SocialWrapper>
					</EmailShareButton>
				</GridComp>
				<GridComp item xs={6} sx={{ zIndex: 1 }}>
					<TwitterShareButton
						url={customUrlData}
						title={customTitle}
						className="Demo__some-network__share-button"
						style={{ width: "100%" }}
					>
						<SocialWrapper>
							<Image src={ASSET_PATHS.social.twitter} width={22} height={22} alt="x" />
							<SocialText>X</SocialText>
						</SocialWrapper>
					</TwitterShareButton>
				</GridComp>
				<GridComp item xs={6} sx={{ zIndex: 1 }}>
					<FacebookShareButton
						url={customUrlData}
						title={customTitle}
						className="Demo__some-network__share-button"
						style={{ width: "100%" }}
					>
						<SocialWrapper>
							<Image src={ASSET_PATHS.social.facebook} width={22} height={22} alt="facebook" />
							<SocialText>Facebook</SocialText>
						</SocialWrapper>
					</FacebookShareButton>
				</GridComp>

				<GridComp item xs={6} sx={{ zIndex: 1 }}>
					<TelegramShareButton
						url={customUrlData}
						title={customTitle}
						className="Demo__some-network__share-button"
						style={{ width: "100%" }}
					>
						<SocialWrapper>
							<Image src={ASSET_PATHS.social.telegram} width={22} height={22} alt="x" />
							<SocialText>Telegram</SocialText>
						</SocialWrapper>
					</TelegramShareButton>
				</GridComp>

				<GridComp item xs={12} sx={{ zIndex: 1 }}>
					<CopyToClipboard
						text={customUrlData}
						onCopy={() =>
							toast.success("Copied to clipboard!", {
								duration: 1000,
							})
						}
					>
						<BoxComponent
							sx={{
								background: "#F7F7FF",
								borderRadius: "12px",
								padding: "16px 0px",
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								cursor: "pointer",
							}}
						>
							<Paragraph textColor={"black"}>
								Tip: Paste this fundraiser link anywhere
							</Paragraph>
							<StackComponent direction="row" spacing={2} mt={1}>
								<Image src={ASSET_PATHS.social.instagram} width={24} height={24} alt="instagram" />
								<Image src={ASSET_PATHS.social.slack} width={24} height={24} alt="slack" />
								<Image src={ASSET_PATHS.social.youtube} width={24} height={24} alt="youtube" />
								<Image src={ASSET_PATHS.social.tiktok} width={24} height={24} alt="tiktok" />
							</StackComponent>
						</BoxComponent>
					</CopyToClipboard>
				</GridComp>
			</GridComp>
		</div>
	);
};

SocialIconBox.propTypes = {
	customUrlData: PropTypes.string,
	customTitle: PropTypes.string,
};
export default SocialIconBox;
