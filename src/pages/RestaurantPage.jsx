import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi } from '../api/userClient';
import { MenuItemCard } from '../components/MenuItemCard';
import { useAppState } from '../context/AppContext';
import { nextRewardProgress } from '../utils/coin';

export const RestaurantPage = () => {
  const { id } = useParams();
  const { user } = useAppState();
  const [restaurant, setRestaurant] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [restaurantData, menuData] = await Promise.all([
          userApi.getRestaurant(id),
          userApi.getMenuItems(id),
        ]);
        setRestaurant(restaurantData);
        setMenu(menuData);
      } catch (err) {
        console.error('Failed to load restaurant:', err);
        setError(err.message || 'Failed to load restaurant');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const restaurantId = restaurant?.id || restaurant?._id;
  const coins = restaurantId ? user?.coinBalances?.find((c) => c.restaurantId === restaurantId)?.coins ?? 0 : 0;
  const { progress, remaining } = restaurant ? nextRewardProgress(coins, restaurant.coinThreshold || 100) : { progress: 0, remaining: 0 };

  const groupedMenu = useMemo(() => {
    const groups = {};
    menu.forEach((item) => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });
    return groups;
  }, [menu]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-slate-600">Loading restaurant...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="space-y-4">
        <p className="text-rose-600">{error}</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }
  if (!restaurant) {
    return (
      <div className="space-y-4">
        <p className="text-slate-600">Restaurant not found.</p>
        <Link
          to="/"
          className="inline-block rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 transition-colors"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Restaurant</p>
            <h1 className="text-3xl font-bold text-slate-900">{restaurant.name}</h1>
            <p className="text-slate-600">{restaurant.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-slate-600">
              {restaurant.rating && (
                <span className="rounded-full bg-slate-100 px-3 py-1">⭐ {restaurant.rating.toFixed(1)}</span>
              )}
              {restaurant.cuisine && (
                <span className="rounded-full bg-slate-100 px-3 py-1">{restaurant.cuisine}</span>
              )}
              {restaurant.eta && (
                <span className="rounded-full bg-slate-100 px-3 py-1">ETA {restaurant.eta}</span>
              )}
              <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">
                Coins {restaurant.coinRate || 5}/$ · Redeem at {restaurant.coinThreshold || 100}
              </span>
            </div>
          </div>
          <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-700">Your coins here</p>
            <div className="mt-2 text-2xl font-bold text-brand-700">{coins}</div>
            <p className="text-sm text-slate-600">
              {remaining === 0 ? 'You can redeem a free item now!' : `${remaining} coins to unlock a free item.`}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-brand-500" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {Object.entries(groupedMenu).map(([category, items]) => (
        <section key={category} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">{category}</h2>
            <span className="text-sm text-slate-600">{items.length} items</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {items.map((item) => (
              <MenuItemCard key={item._id || item.id} item={item} restaurant={restaurant} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

