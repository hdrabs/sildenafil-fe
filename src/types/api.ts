export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalCount: number
    perPage: number
  }
}

export interface ApiResponse<T> {
  data: T
  message?: string
}
