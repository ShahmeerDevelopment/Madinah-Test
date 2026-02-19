import DiscoverPage from "./DiscoverPage.server";


export default function Page() {
  return <DiscoverPage />;
}

// Metadata for the discover page
export const metadata = {
  title: "Discover - Madinah",
  description:
    "Discover and explore charitable campaigns around the world. Find causes that matter to you and make a difference.",
  openGraph: {
    title: "Discover - Madinah",
    description:
      "Discover and explore charitable campaigns around the world. Find causes that matter to you and make a difference.",
  },
};
