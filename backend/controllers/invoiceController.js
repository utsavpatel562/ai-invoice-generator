const Invoice = require("../modules/Invoice");
// @desc     Create new invoice
// @route    POST /api/invoices
// @access   Private
exports.createInvoice = async(req, res) => {
    try {

    } catch(error) {
        res.status(500).json({message: "Error creating invoice", error: error.message});
    }
};

// @desc     Get all invoices of logged-in user
// @route    POST /api/invoices
// @access   Private
exports.getInvoices = async(req, res) => {}

// @desc     Get single invoice by ID
// @route    POST /api/invoices
// @access   Private
exports.getInvoiceById = async(req, res) => {}

// @desc     Update invoice
// @route    POST /api/invoices
// @access   Private
exports.updateInvoice = async(req, res) => {}

// @desc     Delete invoice
// @route    POST /api/invoices
// @access   Private
exports.deleteInvoice = async(req, res) => {}