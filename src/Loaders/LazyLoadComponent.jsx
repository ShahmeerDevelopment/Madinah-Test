import SkeletonComponent from "@/components/atoms/SkeletonComponent";
import PropTypes from "prop-types";
import React, { Suspense } from "react";

const LazyLoadComponent = ({ component }) => {
	return (
		<Suspense
			fallback={
				<div>
					<SkeletonComponent width="100%" />
				</div>
			}
		>
			{component}
		</Suspense>
	);
};

LazyLoadComponent.propTypes = {
	component: PropTypes.any,
};

export default LazyLoadComponent;
