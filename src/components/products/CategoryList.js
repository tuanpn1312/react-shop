import React from 'react';
import { ListGroup } from 'react-bootstrap';

const CategoryList = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <div className="category-container mb-4">
      <h5 className="category-title mb-3">Categories</h5>
      <ListGroup className="category-list">
        <ListGroup.Item 
          action 
          active={!activeCategory} 
          onClick={() => onSelectCategory(null)}
          className="category-item"
        >
          <span className="category-icon">🏠</span>
          All Products
        </ListGroup.Item>
        {categories.map((category) => (
          <ListGroup.Item
            key={category.id}
            action
            active={activeCategory === category.id}
            onClick={() => onSelectCategory(category.id)}
            className="category-item"
          >
            <span className="category-icon">📦</span>
            {category.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default CategoryList;