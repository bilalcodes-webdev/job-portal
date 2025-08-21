type JobListingPriceProps = {
  id: string;
  days: number;
  price: number;
  description: string;
};

export const listingPlans: JobListingPriceProps[] = [
  {
    id: "standard",
    days: 30,
    price: 50,
    description: "Standard listing visible for 30 days.",
  },
  {
    id: "extended",
    days: 60,
    price: 150,
    description: "Extended visibility for 60 days to attract more candidates.",
  },
  {
    id: "premium",
    days: 90,
    price: 250,
    description: "Premium 90-day listing with maximum reach.",
  },
];
