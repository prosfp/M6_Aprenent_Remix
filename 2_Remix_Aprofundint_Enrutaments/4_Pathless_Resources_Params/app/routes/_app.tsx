import { Outlet } from "@remix-run/react";
import ExpensesHeader from "../components/navigation/ExpensesHeader";

export default function ExpensesAppLayout(): JSX.Element {
  return (
    <>
      <ExpensesHeader />
      <Outlet />
    </>
  );
}
