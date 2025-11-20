import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleAddToCart = () => {
    // Get existing cart from localStorage
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    // Check if product already in cart
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Update quantity if already exists
      existingItem.quantity += 1;
    } else {
      // Add new item
      existingCart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    
    // Update cart count in navbar (trigger event)
    window.dispatchEvent(new Event('cartUpdated'));
    
    // Show success feedback
    const button = document.getElementById(`add-to-cart-${product.id}`);
    if (button) {
      button.textContent = 'Added!';
      button.classList.add('bg-green-600', 'hover:bg-green-700');
      button.classList.remove('bg-primary-600', 'hover:bg-primary-700');
      
      setTimeout(() => {
        button.textContent = 'Add to Cart';
        button.classList.remove('bg-green-600', 'hover:bg-green-700');
        button.classList.add('bg-primary-600', 'hover:bg-primary-700');
      }, 2000);
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    
    // Get existing wishlist
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    
    if (isWishlisted) {
      // Remove from wishlist
      const updatedWishlist = wishlist.filter(item => item.id !== product.id);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    } else {
      // Add to wishlist
      wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  };

  const formatDiscount = () => {
    // Simulate discount calculation
    const discount = Math.floor(Math.random() * 30) + 10;
    return discount;
  };

  const hasDiscount = Math.random() > 0.5;
  const discount = hasDiscount ? formatDiscount() : 0;
  const originalPrice = hasDiscount ? (product.price * 1.5) : product.price;

  const formatCurrency = (amount) => {
    // Handle both string and number formats
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(numericAmount)) return '$0.00';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(numericAmount);
  };

  const renderRating = (rating) => {
    // Default to 4.5 stars if no rating is provided
    const ratingValue = rating || 4.5;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < Math.floor(ratingValue) ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="ml-1 text-sm text-gray-600">({ratingValue})</span>
      </div>
    );
  };

  return (
    <div 
      className="card group cursor-pointer animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        {/* Placeholder images with different seeds for variety */}
        <div className="relative h-72 bg-gray-100">
          <img
            src={`https://images.unsplash.com/photo-${1505740420928 === 0 ? '1505740420928-5e560c06d30e' : '1523275335684-e399a5a7575b'}?w=500&h=500&fit=crop&random=${product.id}`}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Hover image (alternative view) */}
          <img
            src={`https://images.unsplash.com/photo-${1523275335684 === 0 ? '1523275335684-e399a5a7575b' : '1505740420928-5e560c06d30e'}?w=500&h=500&fit=crop&random=${product.id + 1000}`}
            alt={`${product.name} - Alternate view`}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${isHovered && imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
          />
        </div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md animate-bounce-in">
              -{discount}%
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-md">
              Out of Stock
            </span>
          )}
          {product.is_new && (
            <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md animate-bounce-in">
              NEW
            </span>
          )}
        </div>
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Add to wishlist"
        >
          <svg
            className={`w-5 h-5 transition-colors duration-300 ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-400'}`}
            fill={isWishlisted ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        
        {/* Quick Actions Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-full'}`}>
          <div className="flex gap-2">
            <button
              className="flex-1 bg-white text-gray-900 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Quick view functionality
              }}
            >
              Quick View
            </button>
            <button
              className="bg-white text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                // Compare functionality
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Product Name & Category */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-2">
            <Link to={`/products/${product.id}`} className="group">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {product.name}
              </h3>
            </Link>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            {product.category || 'Electronics'}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description || 'High-quality product with premium features and modern design.'}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {renderRating(4.5)}
            <span className="text-sm text-gray-500 ml-2">({Math.floor(Math.random() * 100) + 10} reviews)</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Free Ship
          </div>
        </div>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900">
              {formatCurrency(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                {formatCurrency(originalPrice)}
              </span>
            )}
          </div>
          {product.stock > 0 && product.stock < 10 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            id={`add-to-cart-${product.id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] ${
              product.stock === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white shadow-medium hover:shadow-strong'
            }`}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
          <button 
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-all duration-300 group"
            onClick={(e) => {
              e.stopPropagation();
              // Share functionality
            }}
            title="Share product"
          >
            <svg className="w-5 h-5 text-gray-600 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m9.032 4.026A9.001 9.001 0 012.968 7.326" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;