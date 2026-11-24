import { Request } from 'express';

export interface TokenRequest extends Request {
  token?: string;
}

export interface ServiceSuccess<T> {
  success: true;
  data: T;
}

export type WithCmcKey<T> = T & { cmcKey?: string };