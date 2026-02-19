/**
 * Server Component - External Link
 * Simple link component rendered on server
 */
import Link from "next/link";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const ExternalLinkServer = ({ to, children }) => {
  return (
    <Link href={to} style={{ textDecoration: "none" }} prefetch={false}>
      <TypographyComp
        sx={{
          fontFamily: "var(--font-league-spartan)",
          color: "#3D67FF",
          fontWeight: 500,
          fontSize: "16px",
          lineHeight: "20px",
          letterSpacing: "-0.41px",
          cursor: "pointer",
          "&:hover": {
            textDecoration: "underline",
          },
        }}
      >
        {children}
      </TypographyComp>
    </Link>
  );
};

export default ExternalLinkServer;
