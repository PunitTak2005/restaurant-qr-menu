// controllers/adminController.js

import Order from "../models/Order.js";
import Table from "../models/Table.js";

// Helper for time ranges
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
    // Orders count for today/week/month
    const [todayOrders, weekOrders, monthOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: getStartOf("today") } }),
      Order.countDocuments({ createdAt: { $gte: getStartOf("week") } }),
      Order.countDocuments({ createdAt: { $gte: getStartOf("month") } }),
    ]);
    // Revenue for today/week/month
    async function revenueAgg(from) {
      const agg = await Order.aggregate([
        { $match: { createdAt: { $gte: from } } },
        { $group: { _id: null, sum: { $sum: "$totalPrice" } } }
      ]);
      return agg[0]?.sum || 0;
    }
    const [todayRevenue, weekRevenue, monthRevenue] = await Promise.all([
      revenueAgg(getStartOf("today")),
      revenueAgg(getStartOf("week")),
      revenueAgg(getStartOf("month"))
    ]);
    // Top ordered items for month
    const topItems = await Order.aggregate([
      { $match: { createdAt: { $gte: getStartOf("month") } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.menuItemId", orderCount: { $sum: "$items.qty" } } },
      { $sort: { orderCount: -1 } },
      { $limit: 5 },
      { $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "menuItem"
        }
      },
      { $addFields: { name: { $arrayElemAt: ["$menuItem.name", 0] } } },
      { $project: { menuItem: 0 } }
    ]);
    // Top tables (most used this month)
    const tableUsageAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: getStartOf("month") } } },
      { $group: { _id: "$tableId", usageCount: { $sum: 1 } } },
      { $sort: { usageCount: -1 } },
      { $limit: 5 }
    ]);
    const tableIds = tableUsageAgg.map(t => t._id);
    const tables = await Table.find({ _id: { $in: tableIds } }).select("number");
    const tableUsage = tableUsageAgg.map(tbl => ({
      tableId: tbl._id,
      tableNumber: tables.find(t => t._id.equals(tbl._id))?.number ?? "Unknown",
      usageCount: tbl.usageCount
    }));

    res.json({
      todayOrders,
      weekOrders,
      monthOrders,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      topItems,
      tableUsage
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics error.", detail: err.message });
  }
};
