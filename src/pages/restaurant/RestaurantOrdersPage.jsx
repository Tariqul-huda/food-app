import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { PageHeader } from '../../components/PageHeader';
import { useAuth } from '../../context/AuthContext';

export const RestaurantOrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch orders from API filtered by restaurant ID
    // For now, using empty array
    setLoading(false);
  }, []);

  const handleStatusChange = (orderId, newStatus) => {
    // TODO: Implement API call to update order status
    console.log('Update order status:', orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" subtitle="View and manage incoming orders" />
      
      {loading ? (
        <p className="text-slate-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <p className="text-slate-600">No orders yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">Order #{order.id}</h3>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'ready' ? 'bg-green-100 text-green-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {order.status || 'pending'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {format(new Date(order.createdAt), 'PP p')}
                  </p>
                  {order.customerName && (
                    <p className="text-sm text-slate-600 mt-1">
                      Customer: {order.customerName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-slate-900">${order.total?.toFixed(2)}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mb-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-2">Items:</h4>
                <ul className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-slate-900 font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {order.status !== 'completed' && order.status !== 'cancelled' && (
                <div className="flex gap-2 pt-4 border-t border-slate-200">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(order.id, 'preparing')}
                        className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 transition-colors"
                      >
                        Start Preparing
                      </button>
                      <button
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                        className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'ready')}
                      className="rounded-lg bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 transition-colors"
                    >
                      Mark as Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button
                      onClick={() => handleStatusChange(order.id, 'completed')}
                      className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
                    >
                      Complete Order
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

