/**
 * Server Component - Section wrapper
 * Can be used to wrap both server and client components
 */
import StackComponent from "@/components/atoms/StackComponent";
import TypographyComp from "@/components/atoms/typography/TypographyComp";

const SectionServer = ({
  withoutHeading = false,
  children,
  heading,
  sectionRightActions,
  sx,
  ...otherProps
}) => {
  return (
    <StackComponent
      sx={{
        height: "max-content",
        zIndex: 1,
        boxShadow: "0px 0px 100px 0px #0000000F",
        borderRadius: "40px",
        backgroundColor: "#FFFFFF",
        p: "32px",
        ...sx,
        "@media (max-width:600px)": {
          px: "16px !important",
        },
      }}
      component="section"
      {...otherProps}
    >
      {!withoutHeading ? (
        <>
          <StackComponent
            sx={{ width: "100%" }}
            justifyContent="space-between"
            alignItems="center"
          >
            <TypographyComp
              sx={{
                fontFamily: "var(--font-league-spartan)",
                fontSize: "32px",
                fontWeight: 600,
                lineHeight: "36px",
                letterSpacing: "-0.41px",
                color: "#1F1F1F",
              }}
            >
              {heading}
            </TypographyComp>
            {sectionRightActions ? sectionRightActions : null}
          </StackComponent>
          {children}
        </>
      ) : (
        <>{children}</>
      )}
    </StackComponent>
  );
};

export default SectionServer;
