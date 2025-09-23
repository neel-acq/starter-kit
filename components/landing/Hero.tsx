import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero: React.FC = () => {
  return (
    <section className="relative bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Build and Scale Your SaaS
              <span className="block text-white/90">
                Ship faster with a modern starter
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/85 max-w-2xl">
              A production-ready Next.js + Drizzle + Tailwind template to get
              your product off the ground quickly. Includes auth, billing, and
              team management patterns.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a href="#pricing">
                <Button
                  size="lg"
                  className="rounded-full bg-white text-orange-600 button-color"
                >
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a
                href="#blogs"
                className="inline-flex items-center justify-center"
              >
                <Button
                  variant="ghost"
                  size="lg"
                  className="rounded-full text-white/95 button-color"
                >
                  Read our blog
                </Button>
              </a>
            </div>
          </div>

          <div className="mt-10 lg:mt-0 lg:col-span-5 flex items-center justify-center">
            {/* small decorative card to match theme */}
            <div className="w-full max-w-md bg-white/10 border border-white/20 rounded-lg p-6">
              <pre className="text-sm text-white/90">
                $ npx create-saas --template nextjs
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
