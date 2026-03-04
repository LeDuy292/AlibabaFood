import React from 'react';
import FoodCard from './FoodCard';
import './LatestFoodSection.css';

const LATEST_FOODS = [
    {
        id: 1,
        title: 'Mì Quảng',
        price: '2',
        image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 2,
        title: 'Gà BBQ',
        price: '10',
        image: 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 3,
        title: 'Bún Thịt Nướng',
        price: '2',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400'
    },
    {
        id: 4,
        title: 'Bún Chả',
        price: '2',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=400'
    }
];

const LatestFoodSection = () => {
    return (
        <section className="latest-food-section">
            <h2 className="section-title">Latest New Food</h2>

            <div className="food-grid">
                {LATEST_FOODS.map((food, index) => (
                    <FoodCard
                        key={food.id}
                        title={food.title}
                        price={food.price}
                        image={food.image}
                        index={index}
                    />
                ))}
            </div>
        </section>
    );
};

export default LatestFoodSection;
