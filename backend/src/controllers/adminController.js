// controllers/adminController.js
import Order from "../models/Order.js";
import Table from "../models/Table.js";

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
    const [todayOrders, weekOrders, monthOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: getStartOf("today") } }),
      Order.countDocuments({ createdAt: { $gte: getStartOf("week") } }),
      Order.countDocuments({ createdAt: { $gte: getStartOf("month") } })
    ]);

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

    const topItems = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItemId",
          orderCount: { $sum: "$items.qty" }
        }
      },
      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "item"
        }
      },
      { $unwind: "$item" },
      {
        $project: {
          name: "$item.name",
          orderCount: 1
        }
      },
      { $sort: { orderCount: -1 } },
      { $limit: 5 }
    ]);

    const topTables = await Order.aggregate([
      { $group: {
          _id: "$tableId",
          usageCount: { $sum: 1 }
        }
      },
      { $lookup: {
          from: "tables",
          localField: "_id",
          foreignField: "_id",
          as: "table"
        }
      },
      { $unwind: "$table" },
      { $project: {
          tableNumber: "$table.number",
          usageCount: 1
        }
      },
      { $sort: { usageCount: -1 } },
      { $limit: 5 }
    ]);

    // Debug logs
    console.log("todayOrders:", todayOrders);
    console.log("weekOrders:", weekOrders);
    console.log("monthOrders:", monthOrders);
    console.log("todayRevenue:", todayRevenue);
    console.log("weekRevenue:", weekRevenue);
    console.log("monthRevenue:", monthRevenue);
    console.log("topItems:", topItems);
    console.log("topTables:", topTables);

    res.json({
      todayOrders,
      weekOrders,
      monthOrders,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      topItems,
      topTables
    });
  } catch (err) {
    res.status(500).json({ error: err.message || "Analytics failed" });
  }
};
