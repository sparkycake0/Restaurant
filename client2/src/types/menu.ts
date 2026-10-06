export type Category = {
  name: string;
  id: number;
};
export type Food = {
  id: number;
  name: string;
  price: number;
  category: Category;
  description: string;
  image: string | null;
  available: boolean;
};
