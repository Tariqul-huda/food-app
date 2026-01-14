import { useAuth } from '../../context/AuthContext';
import { PageHeader } from '../../components/PageHeader';

export const RestaurantDashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Dashboard" 
        subtitle={`Welcome back, ${user?.name || 'Restaurant'}!`} 
      />
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Orders</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">0</p>
            </div>
            <div className="rounded-lg bg-blue-100 p-3">
              <span className="text-2xl">📦</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Menu Items</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">0</p>
            </div>
            <div className="rounded-lg bg-green-100 p-3">
              <span className="text-2xl">🍔</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Revenue</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">$0.00</p>
            </div>
            <div className="rounded-lg bg-orange-100 p-3">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <a
            href="/restaurant/foods"
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
          >
            <span className="text-2xl">➕</span>
            <div>
              <p className="font-medium text-slate-900">Add Food Item</p>
              <p className="text-sm text-slate-600">Create a new menu item</p>
            </div>
          </a>
          <a
            href="/restaurant/orders"
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
          >
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-medium text-slate-900">View Orders</p>
              <p className="text-sm text-slate-600">Check recent orders</p>
            </div>
          </a>
          <a
            href="/restaurant/profile"
            className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="font-medium text-slate-900">Edit Profile</p>
              <p className="text-sm text-slate-600">Update restaurant info</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

