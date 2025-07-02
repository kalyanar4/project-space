import Image from 'next/image';

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
      className="service-card transition-transform hover:scale-105 flex flex-col"
    >
      <div className="relative w-full h-40 mb-4">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover rounded"
        />
      </div>
      <h3 className="text-lg font-semibold text-center">{item.title}</h3>
    </a>
  );
}
