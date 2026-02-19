export const TABLE_HEAD_DATA = [
	{ label: "", key: "" },
	{ label: "Campaign Amount(USD)" },
	{ label: "Settled Amount(USD)" },
];

export const BODY_DATA = {
	_id: 0,
	grossFundsRaised: 6507.34,
	summaryTableDetails: [
		{
			_id: "a1b1c1d1",
			platformName: "Online",
			totalCampaignAmount: 6508.34,
			totalSettledAmount: 6508.34,
			transactionsCount: null,
			details: [
				{
					feePurposeName: "Madinah Platform Fees 0%",
					campaignAmount: 1200,
					settledAmount: 8000,
				},
				{
					feePurposeName: "Credit card processing Fees",
					campaignAmount: 100,
					settledAmount: 8000.8,
				},
			],
		},
		{
			_id: "9drert8",
			platformName: "Fees",
			totalCampaignAmount: 6508.34,
			totalSettledAmount: 6508.34,
			transactionsCount: 292,
			details: [
				{
					feePurposeName: "Madinah Platform Fees 0%",
					campaignAmount: 10,
					settledAmount: 0,
				},
				{
					feePurposeName: "Credit card processing Fees",
					campaignAmount: 276.34,
					settledAmount: 400.8,
				},
			],
		},
	],
	net: {
		platformName: "Net",
		campaignNetAmount: 6230.93,
		settledAmount: 234.3,
	},

	paid: {
		platformName: "Paid",
		campaignPaidAmount: 6230.93,
		settledPaidAmount: 234.3,
	},

	totalDue: {
		platformName: "Total Due",
		campaignTotalAmount: null,
		settledTotalAmount: 0.0,
	},

	outStandingBalance: 0.0,
	outStandingTableDetails: [
		{
			_id: "a1b1c1d1",
			totalAmount: 6508.34,
			details: [
				{
					date: "Nov 5, 2023",
					amount: 1200,
				},
				{
					date: "Dec 10, 2024",
					amount: 100,
				},
			],
		},
	],
};
