import Image from "next/image";

export interface NewsItem {
  title: string;
  link: string;
  image: string;
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="service-card reveal-fade-up transition-transform hover:scale-[1.01] flex flex-col"
    >
      <div className="relative w-full h-44 mb-4 overflow-hidden rounded-xl">
        <Image src={item.image} alt={item.title} fill className="object-cover" />
      </div>
      <h3 className="text-lg font-semibold">{item.title}</h3>
    </a>
  );
}
