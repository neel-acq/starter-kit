import Link from "next/link";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ✅ server-side helper
function getFooterLinks() {
  const dirPath = path.join(process.cwd(), "content/footer");
  const files = fs.readdirSync(dirPath);

  return files.map((fileName) => {
    const filePath = path.join(dirPath, fileName);
    const file = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(file);
    return {
      label: data.label,
      url: data.url,
      slug: fileName.replace(/\.md$/, ""),
    };
  });
}

// ✅ Footer is now a Server Component
export default function Footer() {
  const links = getFooterLinks();

  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.slug}
              href={link.url}
              className="hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="mt-4 md:mt-0 text-sm">
          © {new Date().getFullYear()} My Website
        </p>
      </div>
    </footer>
  );
}
