import { FaTrophy, FaHandshake } from "react-icons/fa";
import type { MetaFunction } from "@remix-run/react";

import PricingPlan from "../components/marketing/PricingPlan";

interface PricingPlanType {
  id: string;
  title: string;
  price: string;
  perks: string[];
  icon: React.ComponentType; // Perquè és un component d'icona
}

const PRICING_PLANS: PricingPlanType[] = [
  {
    id: "p1",
    title: "Basic",
    price: "Free forever",
    perks: ["1 User", "Up to 100 expenses/year", "Basic analytics"],
    icon: FaHandshake,
  },
  {
    id: "p2",
    title: "Pro",
    price: "$9.99/month",
    perks: ["Unlimited Users", "Unlimited expenses/year", "Detailed analytics"],
    icon: FaTrophy,
  },
];

export default function PricingPage(): JSX.Element {
  return (
    <main id="pricing">
      <h2>Great Product, Simple Pricing</h2>
      <ol id="pricing-plans">
        {PRICING_PLANS.map((plan) => (
          <li key={plan.id} className="plan">
            <PricingPlan
              title={plan.title}
              price={plan.price}
              perks={plan.perks}
              icon={plan.icon}
            />
          </li>
        ))}
      </ol>
    </main>
  );
}

// Meta information for the page
export const meta: MetaFunction = () => {
  return [
    { title: "Pricing Plans" },
    { name: "description", content: "Explore our affordable pricing plans." },
  ];
};
