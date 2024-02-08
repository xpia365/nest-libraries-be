export interface IAuthenticatedRequest extends Request {
  userId: string;
  expired: Date;
}
