import { useCart } from "../context/CartContext";

export default function MenuItemCard({ item }) {
  const { cart, addToCart, removeFromCart } = useCart();
  const quantity = cart[item._id] || 0;

  return (
    <div className="flex justify-between items-center p-3 border-b">
      <div>
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-600">{item.description}</p>
        <p className="font-medium mt-1">₹{item.price}</p>
      </div>
      <div>
        {quantity === 0 ? (
          <button
            onClick={() => addToCart(item)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => removeFromCart(item)}
              className="bg-gray-300 px-2 py-1 rounded"
            >
              –
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => addToCart(item)}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
