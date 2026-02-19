import DiscoverProviders from "./DiscoverProviders.client";
import DiscoverChrome from "./DiscoverChrome.client";
import { Suspense } from "react";

export default function DiscoverLayout({ children }) {
  return (
    // <Suspense>
      // <DiscoverProviders>
    <DiscoverChrome>{children}</DiscoverChrome>
    //  </DiscoverProviders>
    // </Suspense>
  );
}
