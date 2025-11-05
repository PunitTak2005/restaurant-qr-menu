// backend/src/controllers/tableController.js
import Table from "../models/Table.js";

export const getTableBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Correctly find table by QR slug (field is qrSlug)
    const table = await Table.findOne({ qrSlug: slug });

    if (!table) {
      return res.status(404).json({
        success: false,
        error: "Table not found",
        data: null,
      });
    }

    // Return table info and menu link (absolute, if needed)
    return res.status(200).json({
      success: true,
      data: {
        tableNumber: table.number,
        menuLink: `/menu/items?table=${table._id}`,
        qrSlug: table.qrSlug,
        tableId: table._id
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      data: null,
    });
  }
};
