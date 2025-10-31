const Invoice = require("../modules/Invoice");
// @desc     Create new invoice
// @route    POST /api/invoices
// @access   Private
exports.createInvoice = async(req, res) => {
    try {
        const user = req.user;
        const {
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
        } = req.body;

        // subtotal calculation
        let subtotal = 0;
        let taxTotal = 0;
        items.forEach((item) => {
            subtotal += item.unitPrice * item.quantity;
            taxTotal += ((item.unitPrice * item.quantity) * (item.taxPercent || 0)) / 100;
        })
        const total = subtotal + taxTotal;
        const invoice = new Invoice ({
            invoiceNumber,
            invoiceDate,
            dueDate,
            billFrom,
            billTo,
            items,
            notes,
            paymentTerms,
            subtotal,
            taxTotal,
            total
        })
        await invoice.save();
        res.status(201).json(invoice);
    } catch(error) {
        res.status(500).json({message: "Error creating invoice", error: error.message});
    }
};

// @desc     Get all invoices of logged-in user
// @route    POST /api/invoices
// @access   Private
exports.getInvoices = async(req, res) => {
     try {

    } catch(error) {
        res.status(500).json({message: "Error creating invoice", error: error.message});
    }
}

// @desc     Get single invoice by ID
// @route    POST /api/invoices
// @access   Private
exports.getInvoiceById = async(req, res) => {
     try {

    } catch(error) {
        res.status(500).json({message: "Error creating invoice", error: error.message});
    }
}

// @desc     Update invoice
// @route    POST /api/invoices
// @access   Private
exports.updateInvoice = async(req, res) => {
     try {

    } catch(error) {
        res.status(500).json({message: "Error creating invoice", error: error.message});
    }
}

// @desc     Delete invoice
// @route    POST /api/invoices
// @access   Private
exports.deleteInvoice = async(req, res) => {
     try {

    } catch(error) {
        res.status(500).json({message: "Error creating invoice", error: error.message});
    }
}