import { useQuery } from "@tanstack/react-query";
import { menuItems } from "@/data/menu";
import { queryKeys } from "@/lib/queryKeys";

// TODO(api): replace the sample data with a request to your Spring Boot server
// (same query the website uses: `{ foods { id name description price available image category { id name } } }`).
const foodService = {
  getAll: async () => menuItems,
};

// The screens only call this hook, so when the backend is ready only the service above changes.
// `initialData` is sample data so the screens render instantly - remove it once the server is connected.
export function useFoods() {
  return useQuery({ queryKey: queryKeys.foods, queryFn: foodService.getAll, initialData: menuItems });
}

export function useFood(id: number) {
  const { data } = useFoods();
  return data.find((f) => f.id === id);
}
