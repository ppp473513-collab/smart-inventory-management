const express = require("express");

const User = require("../models/User");
const Product = require("../models/Product");
const StockTransaction = require("../models/StockTransaction");
const AuditLog = require("../models/AuditLog");

const authMiddleware = require("../middleware/authMiddleware");

const {
  adminMiddleware,
} = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// ADMIN DASHBOARD
// GET /api/admin/dashboard
// ADMIN ONLY
// =====================================================

router.get(
  "/dashboard",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // =================================================
      // GET BASIC DATA
      // =================================================

      const [
        totalUsers,
        totalProducts,
        products,
        recentTransactions,
        recentAuditLogs,
      ] = await Promise.all([
        User.countDocuments(),

        Product.countDocuments(),

        Product.find(
          {},
          "name category quantity price"
        ).lean(),

        StockTransaction.find()
          .populate(
            "product",
            "name category"
          )
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          })
          .limit(8)
          .lean(),

        AuditLog.find()
          .populate(
            "user",
            "name email role"
          )
          .sort({
            createdAt: -1,
          })
          .limit(8)
          .lean(),
      ]);

      // =================================================
      // CALCULATE INVENTORY
      // =================================================

      let totalUnits = 0;

      let inventoryValue = 0;

      let lowStock = 0;

      let outOfStock = 0;

      let healthyProducts = 0;

      // -------------------------------------------------
      // LOW STOCK THRESHOLD
      // -------------------------------------------------

      const LOW_STOCK_LIMIT = 10;

      // =================================================
      // PROCESS PRODUCTS
      // =================================================

      products.forEach(
        (product) => {
          const quantity =
            Number(
              product.quantity || 0
            );

          const price =
            Number(
              product.price || 0
            );

          // Total units

          totalUnits += quantity;

          // Inventory value

          inventoryValue +=
            quantity * price;

          // Out of stock

          if (quantity === 0) {
            outOfStock++;
          }

          // Low stock

          else if (
            quantity <=
            LOW_STOCK_LIMIT
          ) {
            lowStock++;
          }

          // Healthy

          else {
            healthyProducts++;
          }
        }
      );

      // =================================================
      // INVENTORY HEALTH
      // =================================================

      let inventoryHealth = 100;

      if (totalProducts > 0) {
        inventoryHealth =
          Math.round(
            (healthyProducts /
              totalProducts) *
              100
          );
      }

      // -------------------------------------------------
      // Make sure health stays between 0 and 100
      // -------------------------------------------------

      inventoryHealth = Math.max(
        0,
        Math.min(
          100,
          inventoryHealth
        )
      );

      // =================================================
      // RESPONSE
      // =================================================

      return res.json({
        success: true,

        data: {
          totalUsers,

          totalProducts,

          totalUnits,

          inventoryValue,

          lowStock,

          outOfStock,

          healthyProducts,

          inventoryHealth,

          lowStockLimit:
            LOW_STOCK_LIMIT,

          recentTransactions,

          recentAuditLogs,
        },
      });
    } catch (error) {
      console.error(
        "ADMIN DASHBOARD ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to load admin dashboard",
      });
    }
  }
);

// =====================================================
// ADMIN INVENTORY SUMMARY
// GET /api/admin/inventory-summary
// ADMIN ONLY
// =====================================================

router.get(
  "/inventory-summary",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const products =
        await Product.find(
          {},
          "name category quantity price"
        ).lean();

      const LOW_STOCK_LIMIT = 10;

      const criticalProducts =
        [];

      const lowStockProducts =
        [];

      const healthyProducts =
        [];

      let totalUnits = 0;

      let inventoryValue = 0;

      products.forEach(
        (product) => {
          const quantity =
            Number(
              product.quantity || 0
            );

          const price =
            Number(
              product.price || 0
            );

          totalUnits += quantity;

          inventoryValue +=
            quantity * price;

          if (quantity === 0) {
            criticalProducts.push(
              product
            );
          } else if (
            quantity <=
            LOW_STOCK_LIMIT
          ) {
            lowStockProducts.push(
              product
            );
          } else {
            healthyProducts.push(
              product
            );
          }
        }
      );

      return res.json({
        success: true,

        data: {
          totalProducts:
            products.length,

          totalUnits,

          inventoryValue,

          criticalProducts,

          lowStockProducts,

          healthyProducts,

          lowStockLimit:
            LOW_STOCK_LIMIT,
        },
      });
    } catch (error) {
      console.error(
        "ADMIN INVENTORY SUMMARY ERROR:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          "Failed to load inventory summary",
      });
    }
  }
);

module.exports = router;