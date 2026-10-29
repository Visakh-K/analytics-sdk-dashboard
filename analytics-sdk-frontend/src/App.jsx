// src/App.jsx
import React, { useState } from 'react';
import AnalyticsDashboard from './components/AnalyticsDashboard';

export default function App() {
  const [view, setView] = useState('menu'); // 'menu' or 'dashboard'
  const [cartCount, setCartCount] = useState(0);

  const handleAddToCart = (item) => {
    setCartCount(prev => prev + 1);
    if (window.Analytics) {
      window.Analytics.track('menu_item_clicked', {
        item_id: item.id,
        item_name: item.name,
        price: item.price
      });
    }
    alert(`Added ${item.name} to cart!`);
  };

  const handleCheckout = () => {
    if (window.Analytics) {
      window.Analytics.track('order_created', {
        order_id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        total_amount: 14.99,
        item_count: cartCount
      });
      window.Analytics.flush();
    }
    alert('Order placed successfully!');
    setCartCount(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm">
        <h1 className="text-xl font-bold text-red-600">Analytics SDK & Dashboard</h1>
        <div className="flex gap-6">
          <button 
            onClick={() => setView('menu')} 
            className={`font-semibold transition ${view === 'menu' ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-gray-600 hover:text-red-600'}`}
          >
            Restaurant Menu
          </button>
          <button 
            onClick={() => setView('dashboard')} 
            className={`font-semibold transition ${view === 'dashboard' ? 'text-red-600 border-b-2 border-red-600 pb-1' : 'text-gray-600 hover:text-red-600'}`}
          >
            Analytics Dashboard
          </button>
        </div>
      </nav>

      {/* Conditional Rendering based on selected view */}
      {view === 'menu' ? (
        <main className="p-6 max-w-2xl mx-auto mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Menu</h2>
            <div className="flex items-center gap-4">
              <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-semibold">
                Cart Items: {cartCount}
              </span>
              {cartCount > 0 && (
                <button 
                  onClick={handleCheckout}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-semibold shadow"
                >
                  Checkout
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border">
            <h3 className="text-xl font-bold mb-2">Margherita Pizza</h3>
            <p className="text-gray-600 mb-4">Fresh tomatoes, mozzarella, and fresh basil.</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-green-600">$14.99</span>
              <button 
                onClick={() => handleAddToCart({ id: 101, name: 'Margherita Pizza', price: 14.99 })}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </main>
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  );
}