import React from "react";
// import { useNavigate } from 'react-router-dom';
// import { useGetProfile } from '../../../api';
// import useResponsiveScreen from '../../../hooks/useResponsiveScreen';
import BoxComponent from "../../../../../components/atoms/boxComponent/BoxComponent";
import TypographyComp from "../../../../../components/atoms/typography/TypographyComp";
import StackComponent from "../../../../../components/atoms/StackComponent";
import ButtonComp from "../../../../../components/atoms/buttonComponent/ButtonComp";
import { resendEmailVerificationLoggedIn } from "../../../../../api/post-api-services";
import toast from "react-hot-toast";
import useResponsiveScreen from "../../../../../hooks/useResponsiveScreen";
// import useResponsiveScreen from '../../../../../hooks/useResponsiveScreen';
// import BoxComponent from '../../../components/atoms/boxComponent/BoxComponent';
// import TypographyComp from '../../../components/atoms/typography/TypographyComp';
// import ButtonComp from '../../../components/atoms/buttonComponent/ButtonComp';
// import StackComponent from '../../../components/atoms/StackComponent';
// import TransferSkeleton from './TransferSkeleton';
// import Status from '../../../components/atoms/status/Status';

const styles = {
	box: {
		display: "flex",
		flexDirection: { xs: "column", sm: "row" },
		// justifyContent: 'space-between',
		alignItems: { xs: "flex-start", sm: "center" },
		// border: '1px solid #E9E9EB',
		borderRadius: "28px",
		width: "100%",
		height: { xs: "126px", sm: "88px" },
		px: 2,
		py: { xs: 2 },
		mt: 3,
		mb: 1,
		backgroundColor: "#F8F8F8",
	},
	typography: {
		thankYou: {
			fontWeight: 400,
			fontSize: "16px",
			color: "#A1A1A8",
		},
		startReceiving: {
			fontWeight: 500,
			fontSize: "18px",
			lineHeight: "22px",
		},
		resend: {
			fontWeight: 500,
			fontSize: "15px",
			lineHeight: "16px",
			color: "#6363E6",
			marginTop: "10px !important",
		},
	},
	button: {
		borderRadius: "25px",
		marginTop: "21px !important",
		textAlign: "left",
	},
};

const EmailVerification = () => {
	const { isSmallScreen } = useResponsiveScreen();
	const handleResendEmail = () => {
		resendEmailVerificationLoggedIn()
			.then((res) => {
				const result = res?.data;
				if (result.success) {
					toast.success("Email link sent");
				} else {
					toast.error(result.message);
				}
			})
			.catch(() => {
				toast.error("Something went wrong");
			});
	};

	return (
		<BoxComponent sx={styles.box}>
			<BoxComponent>
				<TypographyComp align="left" sx={styles.typography.startReceiving}>
					Email verification needed
				</TypographyComp>
				<TypographyComp align="left" sx={styles.typography.thankYou}>
					Check your email to confirm your email address. Not seeing a message
					from us?
				</TypographyComp>
			</BoxComponent>
			<StackComponent
				spacing={2}
				alignItems="center"
				justifyContent="space-between"
				sx={{ width: { xs: "100%", sm: "auto" } }}
			>
				{isSmallScreen ? (
					<TypographyComp
						sx={styles.typography.resend}
						onClick={handleResendEmail}
					>
						Resend verification
					</TypographyComp>
				) : (
					<ButtonComp
						size={"normal"}
						variant="text"
						sx={styles.button}
						onClick={handleResendEmail}
					>
						Resend verification
					</ButtonComp>
				)}
			</StackComponent>
		</BoxComponent>
	);
};

export default EmailVerification;
