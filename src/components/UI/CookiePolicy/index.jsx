"use client";

import React, { useEffect } from "react";
import StackComponent from "@/components/atoms/StackComponent";
import CampaignHeading from "@/components/atoms/createCampaigns/CampaignHeading";
import { theme } from "@/config/customTheme";
import Paragraph from "@/components/atoms/createCampaigns/Paragraph";
import SubHeading from "@/components/atoms/createCampaigns/SubHeading";
import { getAllVisits } from "@/api/get-api-services";
import { useSelector } from "react-redux";

const CookiePolicy = () => {
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
    }, [utmParameters.utmSource, utmParameters.utmMedium, utmParameters.utmCampaign, utmParameters.utmTerm, utmParameters.utmContent, utmParameters.referral]);

    const handleManageCookies = () => {
        // Use the global function to open the GDPR banner preferences modal
        if (typeof window !== "undefined" && window.openCookiePreferences) {
            window.openCookiePreferences();
        } else if (typeof window !== "undefined") {
            // Fallback: dispatch custom event
            window.dispatchEvent(new CustomEvent("openCookiePreferences"));
        }
    };
    return (
        <>
            <StackComponent
                direction="column"
                spacing={2}
                sx={{ padding: { xs: 1, sm: 2 } }}
            >
                <CampaignHeading
                    align={"left"}
                    sx={{ color: theme.palette.primary.main, mb: "16px !important" }}
                >
                    Madinah Cookie Policy
                </CampaignHeading>
                <Paragraph sx={{ fontStyle: "italic", mb: "24px !important" }}>
                    Last Updated: September 17, 2025
                </Paragraph>
                <Paragraph>
                    This Cookie Policy (&quot;Cookie Policy&quot;) describes how Madinah together with
                    its affiliates and subsidiaries (collectively, &quot;Madinah&quot; &quot;we,&quot; &quot;our,&quot; and &quot;us&quot;)
                    use cookies and similar technologies when you interact with our websites, mobile apps,
                    and websites we host on behalf of our clients (collectively, the &quot;Sites&quot;). It also explains
                    your choices regarding our use of these technologies. We will refer to the cookies
                    and similar technologies identified here collectively as &quot;Cookies&quot; for purposes
                    of this Cookie Policy.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important" }}>About Cookies</SubHeading>
                <Paragraph>
                    A cookie is a small text file of letters and numbers stored on your browser or
                    device. When you interact with the Sites, we try to make that experience simple
                    and meaningful. Our Sites use Cookies to distinguish you from other visitors to
                    our Sites. This helps us to provide secure website functionality to you,
                    understand our visitors, manage your preferences, advertise our Sites and services and
                    improve our Sites.
                </Paragraph>
                <Paragraph>
                    When you visit our Sites, both first-party and third-party Cookies may be placed
                    on your browser or device. First-party Cookies are those placed directly by us
                    or from our website domain. Third-party Cookies are those placed by our vendors
                    or partners, which may include social networking and advertising services. Both
                    types of Cookies allow us or our vendors or partners to access information about
                    your device and visit. We use both persistent Cookies and session Cookies.
                    Persistent Cookies stay on your browser until they are deleted or expire. Session
                    Cookies last until you close our Sites or your browser.
                </Paragraph>
                <Paragraph>
                    We also use pixels, JavaScript tags, and similar tracking technologies on our
                    Sites. Pixels (also known as clear GIFs) are tiny images embedded in a webpage and
                    can be used to place cookies on a browser or device. JavaScript tags are
                    snippets of code that are embedded in a webpage. Both pixels and JavaScript tags
                    require calling a server (a computer that delivers web pages), which provides us or
                    our vendor or partner with information about your device and visit. Similarly,
                    our website and email campaigns use tracking URLs (also known as tracking links),
                    which are used to track the performance of marketing and advertising campaigns
                    across websites and engagement channels.
                </Paragraph>
                <Paragraph>
                    We use Cookies for the following purposes:
                </Paragraph>
                <Paragraph>
                    • <strong>Strictly Necessary or Essential Cookies.</strong> These are essential Cookies that are
                    enabled by default because they are necessary to operate our Sites. They include, for example,
                    Cookies that enable you to log in, complete forms, and make donations, as well as protect you and us from
                    security threats, display our content, and record your privacy choices. They
                    also enable us to identify and prevent security risks and comply with our legal
                    obligations.
                </Paragraph>
                <Paragraph>
                    • <strong>Functional Cookies.</strong> These Cookies allow us to enable additional functionality (e.g., third-party
                    video or audio), remember your settings and preferences (e.g., language or
                    region), and customize or personalize your experience (e.g., greeting you or
                    recommending content based on prior visits).
                </Paragraph>
                <Paragraph>
                    • <strong>Analytics Cookies.</strong> These Cookies allow us to recognize and count visitors and understand how you
                    interact with our Sites. They help us to know how visitors reach our Sites,
                    analyze usage patterns, and improve our Sites (e.g., by ensuring that users find
                    what they are looking for). These Cookies may also be used to limit the number of
                    times you see our online advertisements and to measure the effectiveness of our
                    advertising campaigns.
                </Paragraph>
                <Paragraph>
                    • <strong>Marketing Cookies.</strong> These Cookies use information about your activity on our Sites (e.g., pages
                    you view and links you click) to deliver advertisements that are relevant to your
                    interests and optimize our ad campaigns on third-party websites and apps. This
                    includes our ads on social media platforms. These Cookies may also share
                    information through social media &quot;share&quot; or other similar features on our Sites, or when
                    you engage with social content on or through a social media platform such as
                    YouTube, TikTok, LinkedIn, Facebook, and X/Twitter. If you disable these Cookies,
                    you may still see our ads on third-party websites or apps, but they will be less
                    relevant to you.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important" }}>Why We Use Cookies</SubHeading>
                <Paragraph>
                    We use Cookies to collect information about your access to and use of the Sites,
                    including to:
                </Paragraph>
                <Paragraph>
                    1. Allow you to navigate and use all the features provided by our Sites;<br />
                    2. Allow you to access and interact with videos and other media content;<br />
                    3. Customize elements of the layout and/or content within the Sites and remember
                    that you have visited us before;<br />
                    4. Identify the number of unique visitors we receive;<br />
                    5. Improve the Sites and learn which functions of the Sites are most popular with
                    users;<br />
                    6. Understand how you use the Sites (e.g., by learning how long you spend on the
                    Sites and where you have come to the Sites from); and<br />
                    7. Advertise our Sites and services to you.
                </Paragraph>
                <Paragraph>
                    The vendors we use to help us provide certain features, understand and analyze
                    how visitors use our services, and to improve the Sites, may collect the
                    following types of information from users of our Sites: device IP Address, device screen
                    size, device type (unique device identifiers), browser information, imprecise
                    geographic location, preferred language used to display the Sites, and details
                    about your use of the Sites. Some pages of the Sites may include embedded videos
                    hosted by third parties such as Youtube, TikTok and Wistia, among other such video
                    sharing platforms. As described above this may result in the video sharing
                    platform also collecting information about your viewing and sharing activities for
                    analytics and advertising purposes.
                </Paragraph>
                <Paragraph>
                    As we adopt additional technologies, we or our vendors may gather additional
                    information through other methods. We will notify you of such changes with updates
                    to this Cookie Policy.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important" }}>Your Cookie Preferences</SubHeading>
                <Paragraph>
                    You may choose to disable Cookies we use that are not essential. If you disable
                    or opt out of our use of Cookies, some or all of our Sites may not work as
                    intended.
                </Paragraph>
                <Paragraph>
                    Some web and mobile device browsers automatically accept Cookies but, if you
                    prefer, you can change your browser to prevent that or to notify you each time a
                    cookie is set.
                </Paragraph>
                <Paragraph>
                    Depending on your jurisdiction, you may receive a cookie notification when you
                    first visit our Sites. By clicking &quot;Accept&quot; or &quot;Okay&quot; in that notification, you
                    consent to the use of all cookies described there. Where applicable, you may also
                    choose to reject cookies that are not essential to provide you our Site and
                    services by clicking &quot;Essentials only&quot;. In California you may use similar options
                    to opt out of data &quot;sales&quot; or &quot;sharing&quot;, which will disable &quot;cross-context
                    behavioral advertising&quot; Cookies and affect the relevance of the marketing or
                    advertising you may receive. You can change these choices at any time using our cookie
                    preferences tool, accessible using the Manage Cookie Preferences button in the
                    footer of our website. If you do not see a notification, you consent to the use of cookies and similar technologies for the
                    purposes described in this Cookie Policy by continuing to visit or use our Sites.
                </Paragraph>
                <Paragraph>
                    You can also consult the &quot;Help&quot; section of your browser for more information,
                    including about the automated browser privacy preference signals like the Global Privacy Control that your browser may support (e.g., Internet Explorer, Google Chrome, Mozilla Firefox, or Apple Safari).
                </Paragraph>
                <Paragraph>
                    The Digital Advertising Alliance (&quot;DAA&quot;) offers tools for you to choose whether
                    participating third parties may use your information for targeted advertising.
                    To opt out of such use by such third parties, visit the DAA AdChoices Tool at youradchoices.com/control.
                </Paragraph>
                <Paragraph>
                    For European Economic Area (EEA) and United Kingdom users, visit the European
                    Interactive Digital Advertising Alliance&apos;s youronlinechoices.eu. For Canadian users, visit youradchoices.ca/en/tools.
                </Paragraph>
                <Paragraph>
                    In connection with Cookies operated by social networking services, you can visit
                    your settings with each of the social networking services to exercise your
                    choice about those technologies. We encourage you to review the comprehensive
                    information Meta, Google, TikTok and Snapchat provide.
                </Paragraph>
                <Paragraph>
                    We do not control any of the above third-party mechanisms or opt-out links and
                    are not responsible for any choices you make using these mechanisms or the
                    continued availability or accuracy of these mechanisms. If your browsers are
                    configured to reject Cookies when you visit these opt-out pages, or you subsequently
                    erase your Cookies, use a different computer, or change web browsers, your opt-out
                    may no longer be effective.
                </Paragraph>
                <Paragraph>
                    Please note that because these opt-out mechanisms are specific to the device or
                    browser on which they are exercised, you will need to opt out on every browser
                    and device that you use.
                </Paragraph>
                <SubHeading sx={{ mb: "-12px !important" }}>Manage Cookie Preferences</SubHeading>
                <Paragraph>
                    Depending on applicable law, you may be able to disable cookies for
                    functionality, analytics, and/or advertising in your cookie preferences{" "}
                    <span
                        onClick={handleManageCookies}
                        style={{
                            color: theme.palette.primary.main,
                            textDecoration: "underline",
                            cursor: "pointer",
                            fontWeight: "inherit"
                        }}
                    >
                        here
                    </span>.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important" }}>Cookies We May Use</SubHeading>
                <Paragraph>
                    The following sections describe the types of cookies we may use on our Sites:
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important", fontSize: "1.1rem" }}>Essential Cookies</SubHeading>
                <Paragraph>
                    These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as setting your privacy preferences, logging in or filling in forms. You can set your browser to block or alert you about these cookies, but some parts of the site will not then work.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important", fontSize: "1.1rem" }}>Analytics Cookies</SubHeading>
                <Paragraph>
                    These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular and see how visitors move around the site. All information these cookies collect is aggregated and therefore anonymous. If you do not allow these cookies we will not know when you have visited our site, and will not be able to monitor its performance.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important", fontSize: "1.1rem" }}>Advertising Cookies</SubHeading>
                <Paragraph>
                    These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites. They do not store directly personal information, but are based on uniquely identifying your browser and internet device. If you do not allow these cookies, you will experience less targeted advertising.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important" }}>Changes to Madinah&apos;s Cookie Policy</SubHeading>
                <Paragraph>
                    Madinah reserves the right to update or modify this Cookie Policy at any time
                    and from time to time. We will notify you of any material updates or changes we
                    make to this Cookie Policy. Please review this Cookie Policy periodically for any
                    updates or changes to this Notice with a &quot;Last Updated&quot; effective date for the
                    revisions.
                </Paragraph>

                <SubHeading sx={{ mb: "-12px !important" }}>Contacting Madinah</SubHeading>
                <Paragraph>
                    For more information about our use of Cookies, please contact us at support@madinah.com.
                </Paragraph>
                <Paragraph>
                    You can also contact us via mail as follows:
                </Paragraph>
                <Paragraph>
                    Madinah<br />
                    155 Commerce Valley Drive E<br />
                    Markham Ontario, Canada L3T 7X6
                </Paragraph>
            </StackComponent>
        </>
    );
};

export default CookiePolicy;