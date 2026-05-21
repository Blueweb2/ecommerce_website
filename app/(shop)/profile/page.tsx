import { redirect } from "next/navigation";

type ProfileRedirectPageProps = {
  searchParams: Promise<{
    tab?: string;
  }>;
};

const tabRouteMap: Record<string, string> = {
  "account-details": "/account/details",
  "my-orders": "/account/orders",
  orders: "/account/orders",
  "address-book": "/account/addresses",
  addresses: "/account/addresses",
  "privacy-settings": "/account/preferences",
  preferences: "/account/preferences",
};

export default async function ProfileRedirectPage({
  searchParams,
}: ProfileRedirectPageProps) {
  const { tab } = await searchParams;
  const normalizedTab = tab?.trim().toLowerCase();

  redirect(
    normalizedTab && tabRouteMap[normalizedTab]
      ? tabRouteMap[normalizedTab]
      : "/account"
  );
}
