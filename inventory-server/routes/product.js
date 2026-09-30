const express = require("express");
const mongoose = require("mongoose");

const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");
const createAuditLog = require("../utils/createAuditLog");

const router = express.Router();

// =====================================================
// GET ALL PRODUCTS
// GET /api/products
// =====================================================

router.get(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const products =
        await Product.find().sort({
          createdAt: -1,
        });

      return res.json(products);
    } catch (error) {
      console.error(
        "GET PRODUCTS ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch products",
      });
    }
  }
);

// =====================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// =====================================================

router.get(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid product ID",
        });
      }

      const product =
        await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      return res.json(product);
    } catch (error) {
      console.error(
        "GET SINGLE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to fetch product",
      });
    }
  }
);

// =====================================================
// ADD PRODUCT
// POST /api/products
// =====================================================

router.post(
  "/",
  authMiddleware,
  async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        quantity,
      } = req.body;

      // -----------------------------------------
      // VALIDATION
      // -----------------------------------------

      if (!name || !name.trim()) {
        return res.status(400).json({
          message:
            "Product name is required",
        });
      }

      if (
        !category ||
        !category.trim()
      ) {
        return res.status(400).json({
          message:
            "Category is required",
        });
      }

      if (
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(
          Number(price)
        ) ||
        Number(price) <= 0
      ) {
        return res.status(400).json({
          message:
            "Price must be greater than 0",
        });
      }

      if (
        quantity === undefined ||
        quantity === null ||
        quantity === "" ||
        !Number.isFinite(
          Number(quantity)
        ) ||
        Number(quantity) < 0
      ) {
        return res.status(400).json({
          message:
            "Quantity cannot be negative",
        });
      }

      if (
        !Number.isInteger(
          Number(quantity)
        )
      ) {
        return res.status(400).json({
          message:
            "Quantity must be a whole number",
        });
      }

      // -----------------------------------------
      // CLEAN DATA
      // -----------------------------------------

      const cleanName =
        name.trim();

      const cleanCategory =
        category.trim();

      // -----------------------------------------
      // CHECK DUPLICATE
      // -----------------------------------------

      const escapedName =
        cleanName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const existingProduct =
        await Product.findOne({
          name: {
            $regex: `^${escapedName}$`,
            $options: "i",
          },
        });

      if (existingProduct) {
        return res.status(400).json({
          message:
            "Product with this name already exists",
        });
      }

      // -----------------------------------------
      // CREATE
      // -----------------------------------------

      const product =
        await Product.create({
          name: cleanName,
          category: cleanCategory,
          price: Number(price),
          quantity: Number(quantity),
        });

      // -----------------------------------------
      // AUDIT
      // -----------------------------------------

      await createAuditLog({
        action: "PRODUCT_CREATED",

        description:
          `Product "${product.name}" was created`,

        user: req.user.id,

        metadata: {
          productId:
            product._id,

          category:
            product.category,

          quantity:
            product.quantity,

          price:
            product.price,
        },
      });

      return res.status(201).json({
        message:
          "Product added successfully",

        product,
      });
    } catch (error) {
      console.error(
        "ADD PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to add product",
      });
    }
  }
);

// =====================================================
// UPDATE PRODUCT
// PUT /api/products/:id
// =====================================================

router.put(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid product ID",
        });
      }

      const {
        name,
        category,
        price,
        quantity,
      } = req.body;

      // -----------------------------------------
      // VALIDATION
      // -----------------------------------------

      if (!name || !name.trim()) {
        return res.status(400).json({
          message:
            "Product name is required",
        });
      }

      if (
        !category ||
        !category.trim()
      ) {
        return res.status(400).json({
          message:
            "Category is required",
        });
      }

      if (
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(
          Number(price)
        ) ||
        Number(price) <= 0
      ) {
        return res.status(400).json({
          message:
            "Price must be greater than 0",
        });
      }

      if (
        quantity === undefined ||
        quantity === null ||
        quantity === "" ||
        !Number.isFinite(
          Number(quantity)
        ) ||
        Number(quantity) < 0
      ) {
        return res.status(400).json({
          message:
            "Quantity cannot be negative",
        });
      }

      if (
        !Number.isInteger(
          Number(quantity)
        )
      ) {
        return res.status(400).json({
          message:
            "Quantity must be a whole number",
        });
      }

      const cleanName =
        name.trim();

      const cleanCategory =
        category.trim();

      // -----------------------------------------
      // CHECK DUPLICATE
      // -----------------------------------------

      const escapedName =
        cleanName.replace(
          /[.*+?^${}()|[\]\\]/g,
          "\\$&"
        );

      const duplicateProduct =
        await Product.findOne({
          name: {
            $regex: `^${escapedName}$`,
            $options: "i",
          },

          _id: {
            $ne: id,
          },
        });

      if (duplicateProduct) {
        return res.status(400).json({
          message:
            "Another product with this name already exists",
        });
      }

      // -----------------------------------------
      // GET OLD PRODUCT
      // -----------------------------------------

      const oldProduct =
        await Product.findById(id);

      if (!oldProduct) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      // -----------------------------------------
      // UPDATE
      // -----------------------------------------

      const product =
        await Product.findByIdAndUpdate(
          id,
          {
            name: cleanName,
            category: cleanCategory,
            price: Number(price),
            quantity: Number(quantity),
          },
          {
            new: true,
            runValidators: true,
          }
        );

      // -----------------------------------------
      // AUDIT
      // -----------------------------------------

      await createAuditLog({
        action:
          "PRODUCT_UPDATED",

        description:
          `Product "${product.name}" was updated`,

        user: req.user.id,

        metadata: {
          productId:
            product._id,

          oldQuantity:
            oldProduct.quantity,

          newQuantity:
            product.quantity,

          oldPrice:
            oldProduct.price,

          newPrice:
            product.price,

          category:
            product.category,
        },
      });

      return res.json({
        message:
          "Product updated successfully",

        product,
      });
    } catch (error) {
      console.error(
        "UPDATE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to update product",
      });
    }
  }
);

// =====================================================
// DELETE PRODUCT
// DELETE /api/products/:id
// =====================================================

router.delete(
  "/:id",
  authMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(
          id
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid product ID",
        });
      }

      // -----------------------------------------
      // FIND PRODUCT FIRST
      // -----------------------------------------

      const product =
        await Product.findById(id);

      if (!product) {
        return res.status(404).json({
          message:
            "Product not found",
        });
      }

      // -----------------------------------------
      // DELETE
      // -----------------------------------------

      await Product.findByIdAndDelete(
        id
      );

      // -----------------------------------------
      // AUDIT
      // -----------------------------------------

      await createAuditLog({
        action:
          "PRODUCT_DELETED",

        description:
          `Product "${product.name}" was deleted`,

        user: req.user.id,

        metadata: {
          productId:
            product._id,

          category:
            product.category,

          quantity:
            product.quantity,

          price:
            product.price,
        },
      });

      return res.json({
        message:
          "Product deleted successfully",
      });
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      return res.status(500).json({
        message:
          "Failed to delete product",
      });
    }
  }
);

module.exports = router;