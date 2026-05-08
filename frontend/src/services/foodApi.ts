import type { Food } from '../data/foods'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3030/api'

export interface FoodPaginatedResponse {
  data: Food[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export async function fetchFoodsPaginated(
  page: number,
  limit: number,
  category?: string,
): Promise<FoodPaginatedResponse> {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  if (category) params.set('category', category)

  const res = await fetch(`${API_URL}/v1/foods?${params}`)
  if (!res.ok) throw new Error('Failed to fetch foods')
  return res.json()
}
