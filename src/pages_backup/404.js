import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useLottieAnimation from "@/hooks/useLottieAnimation";
import Animate from "@/components/atoms/Animate/Animate";
import BoxComponent from "@/components/atoms/boxComponent/BoxComponent";

export default function Custom404() {
  const router = useRouter();
  const { animationData: errorIcon } = useLottieAnimation("404(2)");

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 8000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        justifyContent: "center",
        width: "100%",
        position: "relative",
      }}
    >
      <BoxComponent
        sx={{
          // background: "pink",
          height: "calc(100vh - 70px)",
          // mb: -11,
          mt: -5,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <Animate animationData={errorIcon} />
      </BoxComponent>
      {/* <TypographyComp
    //     variant="h4"
    //     sx={{ marginBottom: "20px", marginTop: { xs: "80px", sm: "150px" } }}
    //   >
    //     Oops! We can&apos;t find that page.
    //   </TypographyComp>
    //   <p style={{ marginBottom: "20px", fontSize: "18px" }}>
    //     It seems the page you are looking for has either moved or doesn&apos;t
    //     exist. But no worries, you&apos;re being redirected to our homepage.
    //   </p>
 
    //     Go to Homepage
    //   </Link> */}
    </div>
  );
}

Custom404.withFooter = false;
