/**
 * Generic paginated response wrapper
 * Wraps paginated data with metadata
 */
export class PaginatedResponseDTO<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
