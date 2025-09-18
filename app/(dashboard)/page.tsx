import Hero from "@/components/landing/Hero";
import BlogList from "@/components/landing/BlogList";
import PricingPlans from "@/components/landing/PricingPlans";
import ContactForm from "@/components/landing/ContactForm";
import { Terminal } from "./terminal";

export default function HomePage() {
  return (
    <main>
      <Hero />

      <div className="relative -mt-16">
        {/* keep small terminal preview tucked into the layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg overflow-hidden shadow-lg">
            <div className="bg-white p-6">
              <Terminal />
            </div>
          </div>
        </div>
      </div>

      <BlogList />
      <PricingPlans />
      <ContactForm />
    </main>
  );
}
