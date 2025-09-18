import React from "react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    features: ["1 user", "Basic support", "Community access"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    features: ["Up to 10 users", "Email support", "Billing & analytics"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Contact",
    features: ["Custom users", "Priority support", "SLA & onboarding"],
  },
];

export const PricingPlans: React.FC = () => {
  return (
    <section id="pricing" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900">Pricing Plans</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Simple pricing to grow with your business.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="p-6 bg-white rounded-lg border shadow-sm"
            >
              <h3 className="text-xl font-semibold text-gray-900">
                {plan.name}
              </h3>
              <p className="mt-4 text-3xl font-bold text-gray-900">
                {plan.price}
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                {plan.features.map((f) => (
                  <li key={f} className="text-sm">
                    • {f}
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <Button size="sm" className="rounded-full">
                  Choose {plan.name}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingPlans;
