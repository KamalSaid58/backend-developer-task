/**
 * Standardized error response shape across the application
 */
export class ErrorResponseDTO {
  statusCode: number;
  message: string;
  details?: string | string[];
  path?: string;
}
