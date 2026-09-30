const express = require("express");

const StockTransaction = require("../models/StockTransaction");
const Product = require("../models/Product");

const authMiddleware = require("../middleware/authMiddleware");
const createAuditLog = require("../utils/createAuditLog");

const router = express.Router();

// =====================================================
// STOCK IN
// POST /api/stock/in
// =====================================================

router.post(
  "/in",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        productId,
        quantity,
        note,
      } = req.body;

      // -----------------------------------------
      // VALIDATION
      // -----------------------------------------

      if (!productId) {
        return res.status(400).json({
          message:
            "Product ID is required",
        });
      }

      const qty = Number(quantity);

      if (
        !Number.isFinite(qty) ||
        qty <= 0
      ) {
        return res.status(400).json({
          message:
            "Quantity must be greater than 0",
        });
      }

      if (
        !Number.isInteger(qty)
      ) {
        return res.status(400).json({
          message:
            "Quantity must be a whole number",
        });
      }

      // -----------------------------------------
      // FIND PRODUCT
      // -----------------------------------------

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      // -----------------------------------------
      // UPDATE STOCK
      // -----------------------------------------

      product.quantity =
        Number(
          product.quantity || 0
        ) + qty;

      await product.save();

      // -----------------------------------------
      // CREATE TRANSACTION
      // -----------------------------------------

      const transaction =
        await StockTransaction.create({
          product:
            product._id,

          type: "IN",

          quantity: qty,

          note: note
            ? String(note).trim()
            : "",

          user: req.user.id,
        });

      // -----------------------------------------
      // AUDIT
      // -----------------------------------------

      await createAuditLog({
        action: "STOCK_IN",

        description:
          `Stock IN: ${qty} units of "${product.name}"`,

        user: req.user.id,

        metadata: {
          productId:
            product._id,

          transactionId:
            transaction._id,

          quantity: qty,

          type: "IN",

          newStock:
            product.quantity,
        },
      });

      return res.status(201).json({
        message:
          "Stock added successfully",

        product,

        transaction,
      });
    } catch (error) {
      console.error(
        "STOCK IN ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to add stock",
      });
    }
  }
);

// =====================================================
// STOCK OUT
// POST /api/stock/out
// =====================================================

router.post(
  "/out",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        productId,
        quantity,
        note,
      } = req.body;

      // -----------------------------------------
      // VALIDATION
      // -----------------------------------------

      if (!productId) {
        return res.status(400).json({
          message:
            "Product ID is required",
        });
      }

      const qty = Number(quantity);

      if (
        !Number.isFinite(qty) ||
        qty <= 0
      ) {
        return res.status(400).json({
          message:
            "Quantity must be greater than 0",
        });
      }

      if (
        !Number.isInteger(qty)
      ) {
        return res.status(400).json({
          message:
            "Quantity must be a whole number",
        });
      }

      // -----------------------------------------
      // FIND PRODUCT
      // -----------------------------------------

      const product =
        await Product.findById(
          productId
        );

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      // -----------------------------------------
      // CHECK STOCK
      // -----------------------------------------

      const available =
        Number(
          product.quantity || 0
        );

      if (qty > available) {
        return res.status(400).json({
          message:
            `Only ${available} units are available`,
        });
      }

      // -----------------------------------------
      // UPDATE STOCK
      // -----------------------------------------

      product.quantity =
        available - qty;

      await product.save();

      // -----------------------------------------
      // CREATE TRANSACTION
      // -----------------------------------------

      const transaction =
        await StockTransaction.create({
          product:
            product._id,

          type: "OUT",

          quantity: qty,

          note: note
            ? String(note).trim()
            : "",

          user: req.user.id,
        });

      // -----------------------------------------
      // AUDIT
      // -----------------------------------------

      await createAuditLog({
        action: "STOCK_OUT",

        description:
          `Stock OUT: ${qty} units of "${product.name}"`,

        user: req.user.id,

        metadata: {
          productId:
            product._id,

          transactionId:
            transaction._id,

          quantity: qty,

          type: "OUT",

          newStock:
            product.quantity,
        },
      });

      return res.status(201).json({
        message:
          "Stock removed successfully",

        product,

        transaction,
      });
    } catch (error) {
      console.error(
        "STOCK OUT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to remove stock",
      });
    }
  }
);

// =====================================================
// STOCK HISTORY
// GET /api/stock/history
// =====================================================

router.get(
  "/history",
  authMiddleware,
  async (req, res) => {
    try {
      const transactions =
        await StockTransaction.find()
          .populate(
            "product",
            "name category quantity price"
          )
          .populate(
            "user",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      return res.status(200).json(
        transactions
      );
    } catch (error) {
      console.error(
        "STOCK HISTORY ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to load stock history",
      });
    }
  }
);

module.exports = router;