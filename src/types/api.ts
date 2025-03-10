import { PriceEntry } from './analytics';

export type ApiResponse<T> = {
  data: T | null;
  error: Error | null;
};

export type PriceSubmissionResponse = {
  success: boolean;
  message: string;
  data?: PriceEntry;
};

export type ValidationError = {
  field: string;
  message: string;
};