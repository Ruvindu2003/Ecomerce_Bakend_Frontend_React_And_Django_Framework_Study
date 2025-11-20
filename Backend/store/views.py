from django.shortcuts import render
from django.http import HttpResponse
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from .models import Product, Category, Order, OrderItem, UserProfile
from django.contrib.auth.models import User
from .serializers import ProductSerializer, CategorySerializer, UserSerializer, UserSerializerWithToken, OrderSerializer, OrderItemSerializer, UserProfileSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    data = request.data
    
    # Validate required fields
    required_fields = ['username', 'email', 'password']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return Response(
            {'detail': f'Missing required fields: {", ".join(missing_fields)}'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        # Check if username already exists
        if User.objects.filter(username=data['username']).exists():
            return Response(
                {'username': ['A user with that username already exists.']}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if email already exists
        if User.objects.filter(email=data['email']).exists():
            return Response(
                {'email': ['A user with that email already exists.']}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user with proper error handling
        user = User.objects.create_user(
            username=data['username'],
            email=data['email'],
            password=data['password'],
            first_name=data.get('first_name', ''),
            last_name=data.get('last_name', '')
        )
        
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
        
    except ValidationError as e:
        # Handle Django validation errors (password validation, etc.)
        if hasattr(e, 'error_dict'):
            # Handle field-specific errors
            error_response = {}
            for field, errors in e.error_dict.items():
                error_response[field] = [str(error) for error in errors]
            return Response(error_response, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    except IntegrityError as e:
        # Handle database integrity constraints
        if 'username' in str(e):
            return Response(
                {'username': ['A user with that username already exists.']}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        elif 'email' in str(e):
            return Response(
                {'email': ['A user with that email already exists.']}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        else:
            return Response({'detail': 'Database integrity error.'}, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        # Catch any other unexpected errors
        return Response({'detail': f'An unexpected error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    
    data = request.data
    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['username']
    user.email = data['email']
    
    if data['password'] != '':
        user.set_password(data['password'])
    
    user.save()
    return Response(serializer.data)

# Product CRUD Operations
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    data = request.data
    try:
        category = Category.objects.get(id=data['category'])
        product = Product.objects.create(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            category=category,
            slug=data['slug'],
            image=data.get('image', None)
        )
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        data = request.data
        
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)
        product.slug = data.get('slug', product.slug)
        product.image = data.get('image', product.image)
        
        if 'category' in data:
            category = Category.objects.get(id=data['category'])
            product.category = category
            
        product.save()
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        product.delete()
        return Response({'detail': 'Product deleted successfully'})
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)

# Category CRUD Operations
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCategory(request, pk):
    try:
        category = Category.objects.get(id=pk)
        serializer = CategorySerializer(category, many=False)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createCategory(request):
    data = request.data
    try:
        category = Category.objects.create(
            name=data['name'],
            slug=data['slug']
        )
        serializer = CategorySerializer(category, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateCategory(request, pk):
    try:
        category = Category.objects.get(id=pk)
        data = request.data
        
        category.name = data.get('name', category.name)
        category.slug = data.get('slug', category.slug)
        
        category.save()
        serializer = CategorySerializer(category, many=False)
        return Response(serializer.data)
    except Category.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteCategory(request, pk):
    try:
        category = Category.objects.get(id=pk)
        category.delete()
        return Response({'detail': 'Category deleted successfully'})
    except Category.DoesNotExist:
        return Response({'detail': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)

# Order CRUD Operations
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrders(request):
    if request.user.is_staff:
        orders = Order.objects.all()
    else:
        orders = Order.objects.filter(user=request.user)
    
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrder(request, pk):
    try:
        order = Order.objects.get(id=pk)
        # Check if user is owner or admin
        if order.user == request.user or request.user.is_staff:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createOrder(request):
    user = request.user
    data = request.data
    
    try:
        # Create order
        order = Order.objects.create(
            user=user,
            total_price=data['total_price']
        )
        
        # Create order items
        for item in data['order_items']:
            product = Product.objects.get(id=item['product'])
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item['quantity']
            )
        
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrder(request, pk):
    try:
        order = Order.objects.get(id=pk)
        data = request.data
        
        order.total_price = data.get('total_price', order.total_price)
        order.save()
        
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteOrder(request, pk):
    try:
        order = Order.objects.get(id=pk)
        order.delete()
        return Response({'detail': 'Order deleted successfully'})
    except Order.DoesNotExist:
        return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

# Create your views here.
def home(request):
    return HttpResponse("Welcome to the Store Home Page")