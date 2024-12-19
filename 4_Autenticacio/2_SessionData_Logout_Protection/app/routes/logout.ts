import type { ActionFunctionArgs } from "@remix-run/node";
import { destroyUserSession } from "../data/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  //console.log("logging out");

  if (request.method !== "POST") {
    throw Response.json({ message: "Method not allowed" }, { status: 405 });
  }
  return destroyUserSession(request);
}
