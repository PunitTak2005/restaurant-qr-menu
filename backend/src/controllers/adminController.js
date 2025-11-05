// controllers/adminController.js
import Order from "../models/Order.js";
import Table from "../models/Table.js";

// Helper: Start dates for query
function getStartOf(period) {
  const now = new Date();
  if (period === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (period === "week") {
    const first = now.getDate() - now.getDay();
    return new Date(now.getFullYear(), now.getMonth(), first);
  }
  if (period === "month") return new Date(now.getFullYear(), now.getMonth(), 1);
  return new Date(0);
}

export const getAnalytics = async (req, res) => {
  try {
    // Orders
    const [todayOrders, weekOrders, monthOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: getStartOf("today") } }),
      Order.countDocuments({ createdAt: { $gte: getStartOf("week") } }),
      Order.countDocuments({ createdAt: { $gte: getStartOf("month") } })
    ]);

    // Revenue
    async function revenueAgg(from) {
      const agg = await Order.aggregate([
        { $match: { createdAt: { $gte: from } } },
        { $group: { _id: null, sum: { $sum: "$totalPrice" }} }
      ]);
      return agg[0]?.sum || 0;
    }
    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      revenueAgg(getStartOf("today")),
      revenueAgg(getStartOf("week")),
      revenueAgg(getStartOf("month"))
    ]);

    // Top Items (last 7 days)
    const topItemsAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7*24*60*60*1000) } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.name", qty: { $sum: "$items.qty" }} },
      { $sort: { qty: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", qty: 1, _id: 0 } }
    ]);

    // Table usage stats (last 30 days)
    const tableAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 30*24*60*60*1000) } } },
      { $group: { _id: "$table", usage: { $sum: 1 } } },
      { $sort: { usage: -1 } },
      { $project: { number: "$_id", usage: 1, _id: 0 } }
    ]);

    res.json({
      todayOrders,
      weekOrders,
      monthOrders,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      topItems: topItemsAgg,
      tableUsage: tableAgg
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Analytics failed" });
  }
};
