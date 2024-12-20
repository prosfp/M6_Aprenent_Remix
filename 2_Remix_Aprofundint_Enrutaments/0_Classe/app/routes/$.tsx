// app/routes/$.tsx
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ params }: LoaderFunctionArgs) {
  if (params["*"] === "exp") {
    return redirect("/expenses");
  }

  throw Response.json("Not found", { status: 404 });
}
