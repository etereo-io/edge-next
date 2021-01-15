// Register order create
  // Fetch the original product,
    // If it does not exist or is not buyable, return 400
   // check if the current user can buy
      // If it does not have permissions, cancel and 401
  // For each product: see if the stock is greater than 0
    // Return 400 if some product stock is 0 (?)

  // Create the order , mark it as created
    // Set the sellerID as the owner of the product
  // Return OK

// Fetch orders
  // Get all the orders with the sellerID 

// Update order
  // Check sellerId and userId or admin permissions