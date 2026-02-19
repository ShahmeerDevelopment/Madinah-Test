// pages/auth/error.js
import { useRouter } from "next/router";

const ErrorPage = () => {
	const router = useRouter();
	const { error } = router.query;

	return (
		<div>
			<h1>An error occurred</h1>
			<p>{error}</p>
		</div>
	);
};

export default ErrorPage;
