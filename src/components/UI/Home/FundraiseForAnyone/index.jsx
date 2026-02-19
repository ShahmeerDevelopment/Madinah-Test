"use client";

import React from "react";
import { createSearchParams } from "../../../../utils/helpers";
import useTransitionNavigate from "../../../../hooks/useTransitionNavigate";
import StackComponent from "@/components/atoms/StackComponent";
import SelectAbleFieldComp from "@/components/atoms/selectAbleField/SelectAbleFieldComp";

const FundraiseForAnyone = () => {
	const navigate = useTransitionNavigate();
	return (
		<StackComponent direction="column" spacing="16px">
			<SelectAbleFieldComp
				onClick={() => {
					const path = createSearchParams(
						{
							option: "myself",
						},
						"/create-campaign",
					);
					navigate(path);
				}}
				selectable={false}
				heading="Yourself"
				title="Funds are delivered to your bank account for your own use"
			/>
			<SelectAbleFieldComp
				onClick={() => {
					const path = createSearchParams(
						{
							option: "someone-else",
						},
						"/create-campaign",
					);
					navigate(path);
				}}
				selectable={false}
				heading="Friends & Family"
				title="You'll invite a beneficiary to receive funds or distribute them yourself"
			/>
			<SelectAbleFieldComp
				onClick={() => {
					const path = createSearchParams(
						{
							option: "charity-organization",
						},
						"/create-campaign",
					);
					navigate(path);
				}}
				selectable={false}
				heading="Charity"
				title="Funds are delivered to your chosen nonprofit for you"
			/>
		</StackComponent>
	);
};

export default FundraiseForAnyone;
