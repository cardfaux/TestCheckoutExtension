// @ts-check
// Use JSDoc annotations for type safety
/**
 * @typedef {import("../generated/api").InputQuery} InputQuery
 * @typedef {import("../generated/api").FunctionResult} FunctionResult
 */
// The @shopify/shopify_function package will use the default export as your function entrypoint
export default /**
 * @param {InputQuery} input
 * @returns {FunctionResult}
 */
(input) => {
  const theTags = input.cart.buyerIdentity?.customer?.hasTags;
  // The error
  const error = {
    // @ts-ignore
    localizedMessage: `There is an order maximum of $1,000 for customers without established order history. ${
      input.cart.buyerIdentity?.customer?.hasAnyTag
    }. ${JSON.stringify(theTags)} `,
    target: 'cart',
  };
  // Parse the decimal (serialized as a string) into a float.
  const orderSubtotal = parseFloat(input.cart.cost.subtotalAmount.amount);
  const errors = [];

  // Orders with subtotals greater than $1,000 are available only to established customers.
  if (orderSubtotal > 1000.0) {
    if (input.cart.buyerIdentity && input.cart.buyerIdentity.customer) {
      // If the customer has ordered less than 5 times in the past,
      // then treat them as a new customer.
      if (
        input.cart.buyerIdentity.customer.numberOfOrders < 15 &&
        input.cart.buyerIdentity.customer.hasAnyTag === true
      ) {
        errors.push(error);
      }
    } else {
      errors.push(error);
    }
  }

  return { errors };
};
