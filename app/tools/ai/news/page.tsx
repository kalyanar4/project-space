import ToolsNav from "../../ToolsNav";
import latestNews from "../../../data/latestNews.json";
import NewsCard from "../../../../components/NewsCard";

export default function AINewsPage() {
  return (
    <div className="bg-gradient-to-b from-gray-900 to-black text-white min-h-screen">
      <ToolsNav />
      <div className="max-w-6xl mx-auto p-6 sm:p-12">
        <h1 className="text-3xl sm:text-5xl font-bold text-center mb-10">Latest News</h1>
        <div className="section-divider mb-10" />
        <div className="grid gap-6 sm:grid-cols-2">
          {latestNews.map((item, idx) => (
            <NewsCard key={idx} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
