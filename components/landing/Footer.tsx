"use client";

interface FooterProps {
  text: string;
  links?: { label: string; url: string }[];
}

export default function Footer({ text, links }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="mb-4 md:mb-0">{text}</p>
        <div className="flex gap-6">
          {links?.map((link, idx) => (
            <a key={idx} href={link.url} className="hover:text-white">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
