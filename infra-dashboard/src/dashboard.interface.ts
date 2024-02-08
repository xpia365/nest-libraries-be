export class DashboardOptions {
  routes!: string;
  path!: string;
  username!: string;
  password!: string;
  secret!: string;
}

export interface DashboardModuleAsyncOptions {
  useFactory?: (...args: any[]) => Promise<DashboardOptions> | DashboardOptions;
  inject?: any[];
}
