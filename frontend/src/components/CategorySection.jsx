import MenuItemCard from "./MenuItemCard";

export default function CategorySection({ category }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-3">{category.name}</h2>
      <div className="space-y-3">
        {category.items.map((item) => (
          <MenuItemCard key={item._id} item={item} />
        ))}
      </div>
    </section>
  );
}
