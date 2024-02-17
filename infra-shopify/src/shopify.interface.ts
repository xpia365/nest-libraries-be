export interface CallbackResponse {
  status: boolean;
  message?: string;
  url?: string | null;
}

export interface EventAuthRequest {
  shop: string;
  hmac: string;
  code?: string;
  state?: string;
  host: string;
  timestamp: string;
}

export interface AuthorizationRequest {
  authorization: string;
}

export interface AuthorizationResponse {
  status: boolean;
  token: string;
  message: string;
}

export interface ShopifyOptions {
  client_id: string;
  client_secret: string;
  redirect_url: string;
  scopes: string;
}

export interface ShopifyModuleOptions {
  useFactory?: (...args: any[]) => Promise<ShopifyOptions> | ShopifyOptions;
  inject?: any[];
}
