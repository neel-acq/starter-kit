import React from "react";

const samplePosts = [
  {
    id: "1",
    title: "Launching faster with Next.js",
    excerpt:
      "How to structure your SaaS product and ship features quickly using Next.js and a starter template.",
  },
  {
    id: "2",
    title: "Practical tips for Stripe billing",
    excerpt:
      "Best practices for implementing subscriptions and webhooks with Stripe.",
  },
  {
    id: "3",
    title: "Scaling Postgres & Drizzle",
    excerpt:
      "Database patterns to keep your application performant as you grow.",
  },
];

export const BlogList: React.FC = () => {
  return (
    <section id="blogs" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900">From the blog</h2>
        <p className="mt-2 text-gray-600 max-w-2xl">
          Insights and stories about building SaaS products.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {samplePosts.map((post) => (
            <article key={post.id} className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{post.excerpt}</p>
              <a
                className="mt-4 inline-block text-orange-600 font-medium"
                href="#"
              >
                Read more →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogList;
