import orderModel from "../models/orderModel.js";

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

// Get all orders with livreurId = "waiting"
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