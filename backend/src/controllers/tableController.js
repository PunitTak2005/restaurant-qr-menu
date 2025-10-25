// backend/src/controllers/tableController.js
import Table from "../models/Table.js";

export const getTableBySlug = async (req, res) => {
    try {
        const { slug } = req.params;

        // Find table by slug
        const table = await Table.findOne({ slug });

        if (!table) {
            return res.status(404).json({
                success: false,
                error: "Table not found"
            });
        }

        // Return table info + menu link
        return res.json({
            success: true,
            data: {
                tableNumber: table.number,
                menuLink: `/menu/items?table=${table._id}`,
                qrSlug: table.slug
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
};
