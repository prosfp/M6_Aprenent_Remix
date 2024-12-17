import { Outlet } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import marketingStyles from "../styles/marketing.css?url";
import sharedStyles from "../styles/shared.css?url";
import MainHeader from "../components/navigation/MainHeader";
import { getUserFromSession } from "../data/auth.server";

export default function MarketingLayout() {
  return (
    <>
      <MainHeader />
      <Outlet />;
    </>
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  return await getUserFromSession(request);
}

export function links() {
  return [
    { rel: "stylesheet", href: marketingStyles },
    {
      rel: "stylesheet",
      href: sharedStyles,
    },
  ];
}
