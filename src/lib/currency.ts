
// Currency formatting utility for Indian Rupees
export const formatINR = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculateDiscount = (mrp: number, discountPercentage: number): number => {
  return Math.round(mrp - (mrp * discountPercentage / 100));
};

export const calculateSavings = (mrp: number, sellingPrice: number): number => {
  return mrp - sellingPrice;
};

export const calculateDiscountPercentage = (mrp: number, sellingPrice: number): number => {
  return Math.round(((mrp - sellingPrice) / mrp) * 100);
};
