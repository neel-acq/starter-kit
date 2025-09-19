import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function Features() {
  const featuresDir = path.join(process.cwd(), "content/features");
  const files = fs.readdirSync(featuresDir);
  const features = files.map((file) => {
    const filePath = path.join(featuresDir, file);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return data;
  });

  return (
    <section>
      {features.map((feature, index) => (
        <div key={index}>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
          {feature.image && <img src={`/assets/${feature.image}`} alt={feature.title} />}
          {feature.cta && (
            <a href={feature.cta.url}>{feature.cta.label}</a>
          )}
        </div>
      ))}
    </section>
  );
}