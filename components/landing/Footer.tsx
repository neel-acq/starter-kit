"use client";

import Link from "next/link";

interface FooterProps {
  text: string;
  // links?: { label: string; url: string }[];
  links:string;
}

export default function Footer({ text, links }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-6">
            <Link href={links} className="hover:text-white">
              {text}
            </Link>
        </div>
      </div>
    </footer>
  );
}
