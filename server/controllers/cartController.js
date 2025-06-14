import userModel from "../models/userModel.js";

// add products to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const qty = Number(quantity) || 1; // Default to 1 if quantity is not provided or invalid

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += qty; // Add the specified quantity
      } else {
        cartData[itemId][size] = qty; // Initialize with specified quantity
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = qty; // Initialize with specified quantity
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart", cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// update user cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// get user cart data
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const deleteProductFromCart = async (req, res) => {
  try {
    const { userId, itemId, size, removeCompletely = false } = req.body;

    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;

    if (!cartData[itemId] || !cartData[itemId][size]) {
      return res.json({ success: false, message: "Item not found in cart" });
    }

    if (removeCompletely || cartData[itemId][size] <= 1) {
      // Remove the size entry completely
      delete cartData[itemId][size];
      
      // If no sizes left for this item, remove the item completely
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    } else {
      // Just decrement the quantity
      cartData[itemId][size] -= 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Product updated in cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const deleteUserCart = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Find user and update cartData to empty object
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { $set: { cartData: {} } }, // Set cartData to empty object
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      message: "Cart cleared successfully",
      cartData: updatedUser.cartData // Will be empty {}
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};







export { addToCart, updateCart, getUserCart , deleteProductFromCart , deleteUserCart };
