import { LoaderFunctionArgs, redirect } from "@remix-run/node";

export function loader({ params }: LoaderFunctionArgs) {
  console.log(params);
  if (params["*"] === "exp") {
    return redirect("/expenses");
  }

  throw Response.json("Not found", { status: 404 });
}
