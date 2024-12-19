import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireUserSession } from "../data/auth.server";
import { getExpenses } from "../data/expenses.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireUserSession(request);
  return getExpenses();
}
