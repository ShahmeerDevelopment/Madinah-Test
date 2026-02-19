/**
 * Server Component - Fully Static Footer
 *
 * Pure HTML/CSS implementation for optimal performance:
 * - No client-side JavaScript required for rendering
 * - No MUI components (no hydration overhead)
 * - Included in static HTML shell
 * - Cookie links hidden by default, shown via inline script for EU users
 */

import Link from "next/link";
import Image from "next/image";

// Footer links - static content
const FOOTER_LINKS = [
  { id: 1, name: "About Us", path: "/about-us" },
  { id: 2, name: "Privacy Policy", path: "/privacy-policy" },
  { id: 5, name: "Terms & Conditions", path: "/terms-and-conditions" },
];

const CURRENT_YEAR = 2026;

export default function FooterServer() {
  return (
    <footer className="footer-static" style={styles.footer}>
      <div style={styles.container}>
        {/* Links and Logo Row */}
        <div className="footer-top-row" style={styles.topRow}>
          {/* Footer Links */}
          <nav className="footer-links-container" style={styles.linksContainer}>
            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.id}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
                style={styles.link}
                prefetch={false}
              >
                {item.name}
              </Link>
            ))}
            {/* Cookie links - hidden by default, shown for EU users via inline script */}
            <Link
              href="/cookie-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link footer-cookie-link"
              style={{ ...styles.link, display: "none" }}
              prefetch={false}
            >
              Cookie Policy
            </Link>
            <button
              type="button"
              className="footer-link footer-cookie-link footer-cookie-btn"
              style={{ ...styles.cookieButton, display: "none" }}
              data-action="open-cookie-settings"
            >
              Cookie Settings
            </button>
          </nav>

          {/* Logo */}
          <Link
            href="/"
            className="footer-logo-link"
            style={styles.logoLink}
            prefetch={false}
          >
            <Image
              src="/assets/images/Madinahl_logo.png"
              alt="Madinah logo"
              width={114}
              height={114}
              style={styles.logoImage}
              priority={false}
            />
          </Link>
        </div>

        {/* Copyright */}
        <p className="footer-copyright" style={styles.copyright}>
          <span>©{CURRENT_YEAR} Madinah</span>
        </p>
      </div>

      {/* Inline script: Show cookie links for EU users & handle cookie settings click */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var EU_COUNTRIES = ['AL','AD','AT','BY','BE','BA','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','XK','LV','LI','LT','LU','MT','MD','MC','ME','NL','MK','NO','PL','PT','RO','RU','SM','RS','SK','SI','ES','SE','CH','UA','GB','VA'];
              var cfCountry = localStorage.getItem('cfCountry');
              if (cfCountry && EU_COUNTRIES.indexOf(cfCountry.toUpperCase()) !== -1) {
                var cookieLinks = document.querySelectorAll('.footer-cookie-link');
                cookieLinks.forEach(function(el) { el.style.display = ''; });
              }
              var cookieBtn = document.querySelector('[data-action="open-cookie-settings"]');
              if (cookieBtn) {
                cookieBtn.addEventListener('click', function() {
                  if (window.openCookiePreferences) window.openCookiePreferences();
                  else window.dispatchEvent(new CustomEvent('openCookiePreferences'));
                });
              }
            })();
          `,
        }}
      />

      {/* Responsive styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media (max-width: 600px) {
              .footer-static {
                padding: 47px 16px 47px 16px !important;
                width: 100% !important;
                marginLeft: 0 !important;
                marginRight: 0 !important;
              }
              .footer-top-row {
                flex-direction: column !important;
                gap: 39px !important;
              }
              .footer-links-container {
                order: 2 !important;
                width: 100% !important;
              }
              .footer-logo-link {
                order: 1 !important;
              }
              .footer-link {
                color: black !important;
                line-height: 22px !important;
              }
              .footer-copyright {
                justify-content: center !important;
                text-align: center !important;
              }
            }
            @media (max-width: 900px) {
              .footer-static {
                padding: 32px 40px 24px 40px !important;
              }
            }
            .footer-link:hover {
              text-decoration: underline;
            }
            .footer-cookie-btn:hover {
              text-decoration: underline;
            }
          `,
        }}
      />
    </footer>
  );
}

// Static styles object
const styles = {
  footer: {
    background: "white",
    position: "relative",
    bottom: "-65px",
    left: 0,
    right: 0,
    marginTop: "24px",
    padding: "32px 160px 24px 160px",
    zIndex: 10,
    boxShadow: "0px 0px 100px 0px rgba(0, 0, 0, 0.06)",
  },
  container: {
    width: "100%",
  },
  topRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "39px",
    marginBottom: "24px",
  },
  linksContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "16px",
    alignItems: "center",
  },
  link: {
    color: "#A1A1A8",
    textDecoration: "none",
    fontSize: "22px",
    fontWeight: 500,
    lineHeight: "28px",
  },
  cookieButton: {
    background: "none",
    border: "none",
    color: "#A1A1A8",
    fontSize: "22px",
    fontWeight: 500,
    lineHeight: "28px",
    cursor: "pointer",
    padding: 0,
    fontFamily: "inherit",
  },
  logoLink: {
    transform: "translateX(10px)",
    display: "block",
  },
  logoImage: {
    width: "114px",
    height: "auto",
    objectFit: "contain",
  },
  copyright: {
    color: "#A1A1A8",
    fontSize: "16px",
    fontWeight: 400,
    lineHeight: "20px",
    margin: 0,
    display: "flex",
    justifyContent: "flex-start",
  },
};
