import { BlogCard } from "@/components/blog-card/blog-card";

export default function () {
  return (
    <div>
      <BlogCard
        title="たいとるtytuiytrewertyuuiytrertyukytryetwrrytrytuytretreyturyituyiutyrtyee"
        user={{
          name: "けいと",
          iconImageUrl: "/bliss_1_m.jpg",
        }}
        wishedCount={2134}
        bookmarkedCount={3243}
        thumbnailImageUrl="/bliss_1_m.jpg"
      />
    </div>
  );
}
