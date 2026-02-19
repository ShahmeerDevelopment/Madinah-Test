/**
 * CampaignRightSide - Server Component with Static Shell Strategy
 *
 * Architecture:
 * 1. Static Shell: Card containers render immediately on server
 * 2. Progress Bar: Client component for animation
 * 3. Client Components: Buttons stay client-side for interactivity
 * 4. No Refetch: Uses the same data from page.jsx (passed as props)
 *
 * This provides:
 * - Fast initial paint (server-rendered static content)
 * - No additional API calls
 * - Good SEO (server-rendered donation stats)
 * - Interactivity only where needed (buttons)
 */

import StackComponent from "@/components/atoms/StackComponent";
import WhiteBackgroundSection from "@/components/advance/WhiteBackgroundSection";
import CampaignBenefits from "@/components/advance/CampaignBenefits";
import { ASSET_PATHS } from "@/utils/assets";

// Client Components for interactivity
import { DonateButton, ShareButton } from "./RightSideButtons.client";
import DonationProgressBarClient from "./DonationProgressBar.client";
import CurrencyAwareGivingLevels from "./CurrencyAwareGivingLevels.client";
import CampaignRightSideWrapper from "./CampaignRightSideWrapper.client";

// Static asset paths
const zakatEligible = ASSET_PATHS.svg.zakatEligible;
const taxDonation = ASSET_PATHS.svg.taxDeductible;
const secureDonation = ASSET_PATHS.svg.secureDonation;

// ============================================
// Static Sub-Components (Server-Rendered)
// ============================================

/**
 * CampaignBenefitsStatic - Static badges for zakat/tax deductible
 * Uses the original CampaignBenefits component for consistent styling
 */
function CampaignBenefitsStatic({ isZakatEligible, isTaxDeductable }) {
  return (
    <StackComponent
      direction="row"
      sx={{
        mt: "32px !important",
        justifyContent: "space-between",
      }}
    >
      {isZakatEligible && (
        <CampaignBenefits title="Zakat Eligible" img={zakatEligible} />
      )}
      {isTaxDeductable && (
        <CampaignBenefits title="Tax Deductible" img={taxDonation} />
      )}
      <CampaignBenefits title="Secure Donation" img={secureDonation} />
    </StackComponent>
  );
}

// ============================================
// Main Server Component
// ============================================

export default function CampaignRightSideServer({
  campaignId,
  title,
  currency,
  currencyCode,
  initialGoal,
  raisedPercentage = 0,
  recentSupportersCount = 0,
  isZakatEligible,
  isTaxDeductable,
  oneTimeDonation,
  recurringDonation,
  gradingLevelsList = [],
  url,
  checkStatus,
  campaignEndDate,
  randomToken,
  meta = [],
  currencyConversionIdCampaign,
  previewMode = false,
}) {
  const defaultValue = Math.round(initialGoal * raisedPercentage);
  const hasGivingLevels = gradingLevelsList && gradingLevelsList.length > 0;

  return (
    <CampaignRightSideWrapper hasGivingLevels={hasGivingLevels}>
      <WhiteBackgroundSection direction="column">
        {/* Donation Progress Bar - Client Component for animation */}
        <DonationProgressBarClient
          recentSupportersCount={recentSupportersCount}
          isAnimation={false}
          oneTimeDonation={oneTimeDonation}
          recurringDonation={recurringDonation}
          defaultValue={defaultValue}
          maxVal={initialGoal > 0 ? initialGoal : 1}
          isStatic={false}
          minVal={0}
          currency={previewMode ? "$" : currency}
          status={checkStatus}
        />

        {/* Interactive Buttons (Client Components) */}
        <StackComponent direction="column" sx={{ width: "100%", mt: 2 }}>
          <DonateButton
            title={title}
            checkStatus={checkStatus}
            campaignEndDate={campaignEndDate}
            randomToken={randomToken}
            meta={meta}
            url={url}
            previewMode={previewMode}
          />
          <ShareButton title={title} url={url} previewMode={previewMode} />
        </StackComponent>

        {/* Campaign Benefits */}
        {(isZakatEligible || isTaxDeductable) && (
          <CampaignBenefitsStatic
            isZakatEligible={isZakatEligible}
            isTaxDeductable={isTaxDeductable}
          />
        )}
      </WhiteBackgroundSection>

      {/* Giving Levels - Client wrapper that handles currency changes */}
      {hasGivingLevels && (
        <CurrencyAwareGivingLevels
          initialCurrency={currency}
          initialCurrencyCode={currencyCode}
          initialGradingLevels={gradingLevelsList}
          currencyConversionIdCampaign={currencyConversionIdCampaign}
          randomToken={randomToken}
          checkStatus={checkStatus}
          previewMode={previewMode}
        />
      )}
    </CampaignRightSideWrapper>
  );
}
