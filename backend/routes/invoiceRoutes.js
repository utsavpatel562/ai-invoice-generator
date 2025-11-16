const express = require("express");
const {
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require("../controllers/invoiceController.js");
const { protect } = require("../middlewares/authMiddleware.js"); // match your folder

const router = express.Router();

// Routes for creating and fetching all invoices
router.route("/").post(protect, createInvoice).get(protect, getInvoices);

// Routes for fetching, updating, and deleting a single invoice
router
  .route("/:id")
  .get(protect, getInvoiceById)
  .put(protect, updateInvoice)
  .delete(protect, deleteInvoice);

module.exports = router;
