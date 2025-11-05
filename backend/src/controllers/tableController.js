// backend/src/controllers/tableController.js
import Table from "../models/Table.js";

export const getTableBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Find table by QR slug
    const table = await Table.findOne({ qrSlug: slug });

    if (!table) {
      return res.status(404).json({
        success: false,
        error: "Table not found",
        data: null,
      });
    }

    // Return table info and menu link
    return res.status(200).json({
      success: true,
      data: {
        tableNumber: table.number,
        menuLink: `/menu/items?table=${table._id}`,
        qrSlug: table.qrSlug,
        tableId: table._id,
        status: table.status,
        seats: table.seats,
        active: table.active
      }
    });
  } catch (error) {
    console.error("getTableBySlug error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};
