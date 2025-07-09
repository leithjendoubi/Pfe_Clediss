import orderModel from "../models/orderModel.js";

import productModel from "../models/productModel.js"; // Assuming you have a product model

export const setListOfUsersToConfirm = async (req, res) => {
    try {
        // 1. Find orders with an empty userConfirmations array
        const ordersToUpdate = await orderModel.find({
            userConfirmations: { $size: 0 } // Finds arrays that are empty
        });

        if (ordersToUpdate.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No orders found with empty userConfirmations to update.",
                data: []
            });
        }

        const updatedOrders = [];

        // 2. For each order found
        for (const order of ordersToUpdate) {
            const confirmationsToAdd = [];
            const productIds = order.items.map(item => item.productId);

            // Fetch all necessary product details in one go (more efficient)
            const products = await productModel.find({ _id: { $in: productIds } });

            // Create a map for quick lookup
            const productMap = new Map();
            products.forEach(product => {
                productMap.set(product._id.toString(), product);
            });

            for (const item of order.items) {
                const product = productMap.get(item.productId);
                if (product && product.userId) {
                    const userIdFromProduct = product.userId;
                    // Check if this userId is already in the confirmationsToAdd array to avoid duplicates
                    if (!confirmationsToAdd.some(conf => conf[0] === userIdFromProduct)) {
                        confirmationsToAdd.push([userIdFromProduct, "not confirmed"]);
                    }
                } else {
                    console.warn(`Product or userId not found for item: ${item.productId} in order ${order._id}`);
                    // Optionally, handle cases where product or userId might be missing
                    // For example, add a generic confirmation or skip
                }
            }

            // Only update if there are new confirmations to add
            if (confirmationsToAdd.length > 0) {
                // Use $addToSet to prevent duplicate arrays if the same confirmation [userId, "not confirmed"] somehow exists
                // Although with the check above, this might not be strictly necessary, it's safer.
                const result = await orderModel.findByIdAndUpdate(
                    order._id,
                    { $addToSet: { userConfirmations: { $each: confirmationsToAdd } } },
                    { new: true } // Return the updated document
                );
                if (result) {
                    updatedOrders.push(result);
                }
            } else {
                 console.log(`No product user IDs found for order ${order._id}, userConfirmations remains empty.`);
                 // You might want to handle this case differently, e.g., set a specific status
                 // or log it for review.
            }
        }

        res.status(200).json({
            success: true,
            message: `Successfully updated userConfirmations for ${updatedOrders.length} orders.`,
            updatedOrders: updatedOrders
        });

    } catch (error) {
        console.error("Error in setListOfUsersToConfirm:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update userConfirmations.",
            error: error.message
        });
    }
};
// Create a new order
export const addOrder = async (req, res) => {
  try {
    const {
      userId,
      numeroPhone,
      items,
      amount,
      amount_livraison,
      address,
      typeLivraison,
      paymentMethod,
    
    } = req.body;

    if (
      !userId ||
      !numeroPhone ||
      !items ||
      !amount ||
      !address ||
      !typeLivraison ||
      !paymentMethod
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new orderModel({
      userId,
      numeroPhone,
      items,
      amount,
      amount_livraison: amount_livraison || 0,
      address,
      typeLivraison,
      livreurId: "waiting", // Default value
      status: "Order Placed", // Default value
      paymentMethod,
      paymentStatut: "waiting", // Default value
    });

    const savedOrder = await newOrder.save();
res.status(201).json({
  success: true,
  message: "Order successfully placed",
  order: savedOrder,
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await orderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders by user ID
export const getOrdersByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel.find({ userId });

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this user" });
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateUserConfirmationStatus = async (req, res) => {
    try {
        const { id } = req.params; // Order ID
        const { userId, confirmationStatus } = req.body; // User ID and their new confirmation status

        // 1. Validate inputs
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "userId is required to update confirmation status."
            });
        }
        if (!confirmationStatus) {
            return res.status(400).json({
                success: false,
                message: "confirmationStatus is required."
            });
        }

        // Define valid confirmation statuses (optional, but highly recommended)
        const validConfirmationStatuses = [
            "confirmed",
            "not confirmed",
            "pending review",
            // Add any other valid statuses for user confirmation
        ];

        if (!validConfirmationStatuses.includes(confirmationStatus)) {
            return res.status(400).json({
                success: false,
                message: `Invalid confirmationStatus. Must be one of: ${validConfirmationStatuses.join(', ')}.`
            });
        }

        // 2. Find the order and update the specific user's confirmation status
        // We use $set with arrayFilters to target the specific sub-array element
        const updatedOrder = await orderModel.findOneAndUpdate(
            {
                _id: id,
                "userConfirmations.0": userId // Checks if the userId exists as the first element of any sub-array
            },
            {
                $set: { "userConfirmations.$[elem].1": confirmationStatus } // Set the second element (status)
            },
            {
                new: true, // Return the updated document
                arrayFilters: [{ "elem.0": userId }] // Filter the array to find the element where the first item (userId) matches
            }
        );

        // 3. Handle scenarios
        if (!updatedOrder) {
            // This could mean:
            // a) Order not found (id is wrong)
            // b) Order found, but the userId is not present in userConfirmations
            // We can try to be more specific
            const orderExists = await orderModel.findById(id);
            if (!orderExists) {
                return res.status(404).json({
                    success: false,
                    message: "Order not found."
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: `User ${userId} not found in userConfirmations for this order, or status already updated.`
                });
            }
        }

        // 4. Send success response
        res.status(200).json({
            success: true,
            message: `Confirmation status for user ${userId} updated successfully.`,
            order: updatedOrder
        });

    } catch (error) {
        console.error("Error updating user confirmation status:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user confirmation status.",
            error: error.message
        });
    }
};


export const getOrdersWithWaitingLivreur = async (req, res) => {
  try {
    const waitingOrders = await orderModel.find({ livreurId: "waiting" });

    if (!waitingOrders || waitingOrders.length === 0) {
      return res.status(404).json({ message: "No orders waiting for livreur" });
    }

    res.json(waitingOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Assign a delivery person (affecter livreur)
export const affectLivreurId = async (req, res) => {
  try {
    const { id } = req.params;
    const { livreurId } = req.body;

    if (!livreurId) {
      return res.status(400).json({ message: "livreurId is required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { livreurId, status: "Delivery Assigned" }, // Update status as well
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status
export const updateStatut = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "status is required" });
    }

    const updatedOrder = await orderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrdersByLivreurId = async (req, res) => {
  try {
    const { livreurId } = req.params;

    if (!livreurId) {
      return res.status(400).json({ 
        success: false,
        message: "livreurId is required" 
      });
    }

    // Find all orders assigned to this livreur
    const orders = await orderModel.find({ livreurId });

    if (orders.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No orders assigned - livreur is free of charge",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders retrieved successfully",
      count: orders.length,
      data: orders
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};