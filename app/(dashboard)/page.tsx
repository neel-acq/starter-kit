import Hero from "@/components/landing/Hero";
import BlogList from "@/components/landing/BlogList";
import PricingPlans from "@/components/landing/PricingPlans";
import ContactForm from "@/components/landing/ContactForm";
import { Terminal } from "./terminal";
import Footer from "@/components/landing/Footer";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import Features from "@/components/landing/Features";

export default function HomePage() {
  const filePath = path.join(process.cwd(), "content/pages/landing.md");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data } = matter(fileContent);

  const { section1, section2, footer } = data;
  
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
      <Features/>
      <BlogList />
      <PricingPlans />
      <ContactForm />
      {footer && <Footer text={footer.text} links={footer.links} />}
    </main>
  );
}
