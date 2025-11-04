import { useState, useEffect } from "react";

export default function useFetchMenu(slug) {
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`/api/menu/${slug}`);
        const data = await res.json();
        setMenuData(data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMenu();
  }, [slug]);

  return { menuData, loading };
}
