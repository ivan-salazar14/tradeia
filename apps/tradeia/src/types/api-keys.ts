
export interface UserApiKey {
  id: string;
  user_id: string;
  name: string;
  exchange: 'binance'; // Extendable for other exchanges
  api_key: string; // This will be masked on the client
  created_at: string;
  updated_at: string;
}

export interface CreateUserApiKey {
  name: string;
  exchange: 'binance';
  api_key: string;
  api_secret: string;
}

export interface UpdateUserApiKey {
  name?: string;
  api_key?: string;
  api_secret?: string;
}
