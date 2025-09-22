// app/page.tsx

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import PricingPage from "./pricing/page";

function Hero({ data }: { data: any }) {
  return (
    <section className="relative bg-gray-900 text-white py-24 overflow-hidden">
      {data.backgroundImage && (
        <img
          src={`${data.backgroundImage}`}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
      )}
      <div className="relative container mx-auto px-6 text-center max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {data.title || "Welcome"}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-200">
          {data.description || "Discover our amazing features."}
        </p>
        {data.cta && (
          <a
            href={data.cta.url || "#"}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition"
          >
            {data.cta.label || "Get Started"}
          </a>
        )}
      </div>
    </section>
  );
}

function Features({ features }: { features: any[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-14">Our Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-gray-50 rounded-2xl shadow hover:shadow-lg transition"
            >
              {feature.image && (
                <img
                  src={`${feature.image}`}
                  alt={feature.title}
                  className="w-full h-40 object-cover rounded-lg mb-6"
                />
              )}
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              {feature.cta && (
                <a
                  href={feature.cta.url}
                  className="text-blue-600 font-medium hover:underline"
                >
                  {feature.cta.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogList({ blogs }: { blogs: any[] }) {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-14">Latest Blogs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow hover:shadow-lg overflow-hidden transition"
            >
              {blog.coverImage && (
                <img
                  src={`${blog.coverImage}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4">{blog.excerpt}</p>
                <p className="text-sm text-gray-500">
                  {new Date(blog.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingPlans({ data }: { data: any }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6 text-center max-w-2xl">
        <h2 className="text-3xl font-bold mb-6">
          {data.title || "Subscribe Now"}
        </h2>
        <p className="text-lg text-gray-600 mb-10">
          {data.description || "Join our community today."}
        </p>
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition">
          {data.buttonLabel || "Subscribe"}
        </button>
      </div>
    </section>
  );
}

function Footer({ links }: { links: any[] }) {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 text-center">
        <ul className="flex flex-wrap justify-center gap-8 mb-6">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.url} className="hover:text-gray-300 transition">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  // --------- Load Markdown Content on server (App Router allows this) ---------

  // Hero
  const heroPath = path.join(process.cwd(), "content/pages/hero.md");
  const hero = matter(fs.readFileSync(heroPath, "utf-8")).data;

  // Features
  const featuresDir = path.join(process.cwd(), "content/features");
  const features = fs.readdirSync(featuresDir).map((file) => {
    const filePath = path.join(featuresDir, file);
    return matter(fs.readFileSync(filePath, "utf-8")).data;
  });

  // Blogs
  const blogsDir = path.join(process.cwd(), "content/blogs");
  const blogs = fs
    .readdirSync(blogsDir)
    .map((file) => {
      const filePath = path.join(blogsDir, file);
      const { data } = matter(fs.readFileSync(filePath, "utf-8"));
      return data;
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

  // Subscription
  const subscriptionPath = path.join(
    process.cwd(),
    "content/pages/subscription.md"
  );
  const subscription = matter(fs.readFileSync(subscriptionPath, "utf-8")).data;

  // Footer
  const footerDir = path.join(process.cwd(), "content/footer");
  const footer = fs.readdirSync(footerDir).map((file) => {
    const filePath = path.join(footerDir, file);
    return matter(fs.readFileSync(filePath, "utf-8")).data;
  });

  return (
    <main>
      <Hero data={hero} />
      <Features features={features} />
      <BlogList blogs={blogs} />
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center max-w-2xl">
          <h2 className="text-3xl font-bold">{"Subscribe Now"}</h2>
          <PricingPage />
        </div>
      </section>
      <Footer links={footer} />
    </main>
  );
}
