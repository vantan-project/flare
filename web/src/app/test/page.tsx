import { BlogSideCard } from "@/components/blog-sidecard/blog-sidecard";

export default function () {
  return (
    <div>
      <BlogSideCard
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
