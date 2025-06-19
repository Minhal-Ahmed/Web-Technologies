const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        imageUrl: String
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true,
            default: 'US'
        }
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'debit_card', 'paypal', 'cash_on_delivery'],
        default: 'credit_card'
    },
    orderNotes: {
        type: String,
        maxlength: 500
    }
}, {
    timestamps: true
});

// Calculate total amount before saving
orderSchema.pre('save', function(next) {
    if (this.items && this.items.length > 0) {
        this.totalAmount = this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    next();
});

// Index for better query performance
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

module.exports = mongoose.model('Order', orderSchema);