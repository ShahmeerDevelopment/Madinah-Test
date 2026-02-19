"use client";
import React, { useEffect } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import { theme } from "@/config/customTheme";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import { getAllVisits } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const TermsAndConditionsUI = () => {
  const utmParameters = useSelector((state) => state.utmParameters);
  useEffect(() => {
    getAllVisits(
      utmParameters.utmSource,
      utmParameters.utmMedium,
      utmParameters.utmCampaign,
      utmParameters.utmTerm,
      utmParameters.utmContent,
      utmParameters.referral,
    );
  }, []);
  return (
    <StackComponent
      direction="column"
      spacing={2}
      sx={{ padding: { xs: 1, sm: 2 } }}
    >
      <CampaignHeading
        align={"left"}
        sx={{ color: theme.palette.primary.main, mb: "16px !important" }}
      >
        Welcome to Madinah: Our Terms of Service
      </CampaignHeading>
      <SubHeading sx={{ mb: "-12px !important" }}>IMPORTANT NOTICE</SubHeading>
      <Paragraph>
        This Agreement includes a binding arbitration provision and a class
        action waiver, which affect your legal rights as detailed in the
        &quot;Arbitration and Class Action Waiver&quot; section below. Please
        read carefully.
      </Paragraph>
      <Paragraph>
        Thank you for choosing Madinah. Madinah is an innovative online
        crowd-funding platform dedicated to supporting the global Muslim
        community in making a positive impact. These Terms of Use (“Terms”)
        govern your access to, use of, and participation in the services
        provided by Madinah (“Madinah,” “we,” “our,” or “us”), which
        include our website, products, tools, promotions, and any other services
        that reference these Terms (collectively, the “Services”). By accessing
        or using the Services, you agree to these Terms. If you do not agree,
        you are not authorized to use the Services.
      </Paragraph>
      <Paragraph>
        All references to “you” or “your” mean the person who accesses, uses,
        and/or participates in the Services in any manner. This extends to your
        heirs, assigns, and successors. If the Services are used on behalf of an
        entity, you represent that you have the authority to bind that entity,
        and “you” and “your” will refer to that entity.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Eligibility</SubHeading>
      <Paragraph>
        You must be of legal age (18 or the age of majority in your
        jurisdiction) and capable of forming a legally binding contract to use
        the Services. If you have been previously banned from using our
        Services, you may not access them.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Additional Terms and Policies
      </SubHeading>
      <Paragraph>
        Our Privacy Policy is incorporated by reference; please review it for
        our data handling practices. Specific areas or products on the Services
        may have their own terms and conditions. In case of conflict, the
        specific terms take precedence.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Modifications</SubHeading>
      <Paragraph>
        We may update these Terms occasionally. Please check this page regularly
        for updates. Your continued use of the Services after updates means you
        accept the new terms.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Account Registration
      </SubHeading>
      <Paragraph>
        You agree to provide accurate information when creating an account and
        to keep your password secure. You are responsible for all activity under
        your account.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Intellectual Property
      </SubHeading>
      <Paragraph>
        The Services, including all materials contained therein, are protected
        by copyright and intellectual property laws. You agree to respect these
        rights and notify us of any infringement claims.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>User Content</SubHeading>
      <Paragraph>
        You may be able to post content. You grant Madinah a license to use this
        content as detailed in the Terms. You are responsible for ensuring you
        have the right to post the content and indemnify Madinah against any
        claims resulting from your content.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Prohibited Uses</SubHeading>
      <Paragraph>
        The Services must not be used for illegal purposes or in ways not
        expressly permitted by these Terms.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>No Endorsement</SubHeading>
      <Paragraph>
        Madinah does not endorse any campaign, donor, or organization. Donors
        are responsible for their own due diligence.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Payments</SubHeading>
      <Paragraph>
        Madinah facilitates the transfer of donations, subject to certain
        conditions outlined in these Terms.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Perks and Incentives
      </SubHeading>
      <Paragraph>
        Campaign Organizers may offer perks. They are solely responsible for
        delivering these as promised.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Taxes</SubHeading>
      <Paragraph>
        Campaign Organizers are responsible for determining and fulfilling any
        tax obligations arising from donations.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Account Suspensions
      </SubHeading>
      <Paragraph>
        Madinah may place holds on accounts or funds if there are concerns about
        compliance with these Terms of the law.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Legal Compliance</SubHeading>
      <Paragraph>
        You agree to comply with all laws and cooperate with Madinah in
        enforcing these Terms, including providing information for security and
        legal compliance.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Disclaimers and Limitations of Liability
      </SubHeading>
      <Paragraph>
        The Services are provided &quot;as is&quot; without warranties. Madinah
        is not liable for damages arising from your use of the Services beyond
        the amount of donations made by you.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Indemnification</SubHeading>
      <Paragraph>
        You agree to indemnify Madinah against any claims arising from your use
        of the Services or violation of these Terms.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Third-Party Links and Services
      </SubHeading>
      <Paragraph>
        Madinah is not responsible for third-party services or content accessed
        through our Services.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Arbitration and Class Action Waiver
      </SubHeading>
      <Paragraph>
        Disputes under these Terms will be resolved through binding arbitration,
        and you waive the right to participate in class actions.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Governing Law</SubHeading>
      <Paragraph>
        These Terms are governed by the laws of the State of Michigan, without
        regard to its conflict of laws principles.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Feedback</SubHeading>
      <Paragraph>
        Any feedback you provide can be used by Madinah without obligation to
        you.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>General</SubHeading>
      <Paragraph>
        These Terms constitute the entire agreement between you and Madinah
        regarding the Services. They are binding and include provisions that
        survive after termination.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Refund Policy</SubHeading>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Requesting a Refund
      </SubHeading>
      <Paragraph>
        At Madinah, we recognize that circumstances can change, leading you to
        reconsider your contribution. If you find yourself needing to request a
        refund for your donation, please contact us directly at
        help@madinah.com. Our dedicated team is here to guide you through the
        refund process under specific conditions:
      </Paragraph>
      <Paragraph>
        - The donation has not yet been transferred to the beneficiary of the
        campaign.
        <br /> - Any rewards or incentives linked with the donation have not
        been finalized for distribution or dispatched by the campaign organizer.
      </Paragraph>
      <Paragraph>
        If your donation meets these criteria, we will proceed with processing
        your refund. You will receive an email notification once the refund
        process is complete. Please allow 5-10 business days for the refunded
        amount to be reflected in your bank account.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Campaign Conclusion and Disbursement of Funds
      </SubHeading>
      <Paragraph>
        In cases where the campaign has concluded and the funds have been
        distributed to the campaign organizer, any requests for refunds should
        be directed to the organizer themselves and will be subject to their own
        refund policy.
      </Paragraph>
      <Paragraph>
        Madinah aims to facilitate communication and resolution between donors
        and campaign organizers concerning refunds. Nonetheless, our platform
        cannot undertake responsibility for refunds beyond the parameters
        outlined in our Refund Policy. We encourage donors to directly engage
        with campaign organizers to address any refund requests. If you face
        challenges in this endeavor, please reach out to us at help@madinah.com
        for support.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>
        Concerns Regarding Campaign Legitimacy
      </SubHeading>
      <Paragraph>
        Madinah is committed to maintaining the integrity of its platform. If
        you harbor concerns regarding the legitimacy of a campaign or the
        allocation of funds, we urge you to inform us at compliance@madinah.com,
        providing detailed information about the campaign in question. Our team
        will conduct a thorough investigation into your concerns. Should we
        uncover evidence of misconduct or fraudulent activity, we will take
        appropriate measures, including the possibility of refunding donations
        to impacted donors.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Voicing Concerns</SubHeading>
      <Paragraph>
        Your confidence in our platform is of utmost importance to us. If you
        suspect any campaign of being misleading or fraudulent, please contact
        us with your concerns and any pertinent evidence. Our compliance team
        will review your submission and initiate an investigation. The duration
        of this process may vary, but rest assured, we are dedicated to
        upholding the integrity of our platform and will keep you informed of
        our findings.
      </Paragraph>
      <SubHeading sx={{ mb: "-12px !important" }}>Contact Us</SubHeading>
      <Paragraph>
        For any inquiries or assistance regarding our Refund Policy, or if you
        require help with a refund request, please do not hesitate to get in
        touch with us at help@madinah.com. Our team is committed to supporting
        you.
      </Paragraph>
    </StackComponent>
  );
};

export default TermsAndConditionsUI;
