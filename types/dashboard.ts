export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  guestOrders: number;
  registeredOrders: number;
  guestConversionRate: number;

  monthlyOrders: {
    month: string;
    orders: number;
  }[];

  monthlyRevenue: {
    month: string;
    revenue: number;
  }[];
}