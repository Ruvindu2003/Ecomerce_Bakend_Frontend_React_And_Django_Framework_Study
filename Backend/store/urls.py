from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("", views.home, name="home"),
    
    # Authentication
    path("api/users/register/", views.registerUser, name="register"),
    path("api/users/profile/", views.getUserProfile, name="user-profile"),
    path("api/users/profile/update/", views.updateUserProfile, name="user-profile-update"),
    path('api/token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Product CRUD
    path("api/products/", views.getProducts, name="products"),
    path("api/products/<int:pk>/", views.getProduct, name="product"),
    path("api/products/create/", views.createProduct, name="product-create"),
    path("api/products/update/<int:pk>/", views.updateProduct, name="product-update"),
    path("api/products/delete/<int:pk>/", views.deleteProduct, name="product-delete"),
    
    # Category CRUD
    path("api/categories/", views.getCategories, name="categories"),
    path("api/categories/<int:pk>/", views.getCategory, name="category"),
    path("api/categories/create/", views.createCategory, name="category-create"),
    path("api/categories/update/<int:pk>/", views.updateCategory, name="category-update"),
    path("api/categories/delete/<int:pk>/", views.deleteCategory, name="category-delete"),
    
    # Order CRUD
    path("api/orders/", views.getOrders, name="orders"),
    path("api/orders/<int:pk>/", views.getOrder, name="order"),
    path("api/orders/create/", views.createOrder, name="order-create"),
    path("api/orders/update/<int:pk>/", views.updateOrder, name="order-update"),
    path("api/orders/delete/<int:pk>/", views.deleteOrder, name="order-delete"),
]