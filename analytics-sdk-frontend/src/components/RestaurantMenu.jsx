
import React from 'react';
import { trackEvent } from '../utils/analytics-sdk';

export default function RestaurantMenu({ onAddToCart }) {
    const handleAddItem = (item) => {
        trackEvent('menu_item_clicked', { item_id: item.id, item_name: item.name, price: item.price });
        onAddToCart(item);
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">Our Restaurant Menu</h1>
            <button 
                onClick={() => handleAddItem({ id: 101, name: 'Margherita Pizza', price: 14.99 })}
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700"
            >
                Add Margherita Pizza ($14.99)
            </button>
        </div>
    );
}