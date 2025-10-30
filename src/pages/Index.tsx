import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  isNew?: boolean;
  popularity?: number;
  rating?: number;
  reviewCount?: number;
}

interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

const products: Product[] = [
  {
    id: 1,
    name: 'Purple Winter Jacket',
    price: 12990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/f4f555a7-e32a-4c2f-a087-cea6897a050b.jpg',
    category: 'Куртки',
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    popularity: 95,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: 2,
    name: 'Orange Bomber',
    price: 8990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/a0d1e8dc-2f18-41d2-9cb6-f0ee8d9b15d2.jpg',
    category: 'Куртки',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 88,
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: 3,
    name: 'Pink Puffer',
    price: 14990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/e869b8a6-b6e0-4576-8c15-6f8a7c561ee0.jpg',
    category: 'Куртки',
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    popularity: 92,
    rating: 4.9,
    reviewCount: 156
  },
  {
    id: 4,
    name: 'Black Leather Jacket',
    price: 19990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/a407ee41-b97d-4dcf-a669-cfb719e6ac31.jpg',
    category: 'Куртки',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 78,
    rating: 4.3,
    reviewCount: 67
  },
  {
    id: 5,
    name: 'Denim Jacket',
    price: 6990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/17d98437-5732-4520-9279-b3ffc11186ef.jpg',
    category: 'Куртки',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 85,
    rating: 4.6,
    reviewCount: 98
  },
  {
    id: 6,
    name: 'Green Parka',
    price: 16990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/efe0f07e-2d52-45ce-b03b-86a536c7da94.jpg',
    category: 'Куртки',
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    popularity: 90,
    rating: 4.7,
    reviewCount: 112
  },
  {
    id: 7,
    name: 'Вязаная шапка с помпоном',
    price: 1990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/f97c1269-ebb5-4342-a0fd-f754749562c8.jpg',
    category: 'Шапки',
    sizes: ['Универсальный'],
    isNew: true,
    popularity: 87,
    rating: 4.4,
    reviewCount: 73
  },
  {
    id: 8,
    name: 'Шапка-ушанка',
    price: 2990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/aca4f13f-c7aa-4473-b21d-d8af3fe9adfe.jpg',
    category: 'Шапки',
    sizes: ['S/M', 'L/XL'],
    popularity: 93,
    rating: 4.9,
    reviewCount: 201
  },
  {
    id: 9,
    name: 'Спортивная шапка',
    price: 1490,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/8dd7be39-7800-4542-8c5d-696d45bc4875.jpg',
    category: 'Шапки',
    sizes: ['Универсальный'],
    popularity: 80,
    rating: 4.2,
    reviewCount: 54
  },
  {
    id: 10,
    name: 'Зимние ботинки Timberland',
    price: 15990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/bdf4e389-ed31-43b4-9095-77b4d269a219.jpg',
    category: 'Ботинки',
    sizes: ['39', '40', '41', '42', '43', '44', '45'],
    isNew: true,
    popularity: 96,
    rating: 4.9,
    reviewCount: 287
  },
  {
    id: 11,
    name: 'Треккинговые ботинки',
    price: 12990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/44493105-7a54-45f3-b7d4-cc64c0aa95ad.jpg',
    category: 'Ботинки',
    sizes: ['39', '40', '41', '42', '43', '44'],
    popularity: 89,
    rating: 4.6,
    reviewCount: 143
  },
  {
    id: 12,
    name: 'Кожаные ботинки Chelsea',
    price: 18990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/0de97760-84f2-4c1f-a01b-b0c4f95a6100.jpg',
    category: 'Ботинки',
    sizes: ['40', '41', '42', '43', '44'],
    popularity: 84,
    rating: 4.7,
    reviewCount: 92
  },
  {
    id: 13,
    name: 'Кожаные рукавицы',
    price: 3990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/85d1cdcd-82a9-4208-bfd2-44bdff13832c.jpg',
    category: 'Рукавицы',
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    popularity: 86,
    rating: 4.5,
    reviewCount: 81
  },
  {
    id: 14,
    name: 'Вязаные варежки',
    price: 1490,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/09bae8d0-f9d8-441b-acdc-27f039ee188c.jpg',
    category: 'Рукавицы',
    sizes: ['S/M', 'L/XL'],
    popularity: 82,
    rating: 4.3,
    reviewCount: 65
  },
  {
    id: 15,
    name: 'Перчатки с сенсорными пальцами',
    price: 2490,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/ac005337-77c1-4171-8df9-69d47a3577b3.jpg',
    category: 'Рукавицы',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 91,
    rating: 4.8,
    reviewCount: 176
  },
  {
    id: 16,
    name: 'Зимние штаны с утеплителем',
    price: 8990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/5482ff8d-83bf-47b9-b2d9-e4e44eee67f9.jpg',
    category: 'Штаны',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isNew: true,
    popularity: 88,
    rating: 4.6,
    reviewCount: 104
  },
  {
    id: 17,
    name: 'Горнолыжные брюки',
    price: 12990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/cde9ed02-75e9-4f82-98ec-3ac043b3894f.jpg',
    category: 'Штаны',
    sizes: ['S', 'M', 'L', 'XL'],
    popularity: 94,
    rating: 4.8,
    reviewCount: 189
  },
  {
    id: 18,
    name: 'Утепленные карго',
    price: 7990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/9dcdde27-5f21-4a0e-9431-4e9b8f246db9.jpg',
    category: 'Штаны',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    popularity: 85,
    rating: 4.4,
    reviewCount: 97
  }
];

export default function Index() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 25000]);
  const [filterSize, setFilterSize] = useState<string>('Все');
  const [sortBy, setSortBy] = useState<string>('default');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const categories = ['Все', 'Куртки', 'Шапки', 'Ботинки', 'Рукавицы', 'Штаны'];
  const sizes = ['Все', 'S', 'M', 'L', 'XL', '39', '40', '41', '42', '43', '44', '45', 'S/M', 'L/XL', 'Универсальный'];

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const difference = endOfDay.getTime() - now.getTime();

      if (difference > 0) {
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleFavorite = (productId: number) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const jacketsSaleCount = products.filter(p => p.category === 'Куртки').length;
  const totalProductsCount = products.length;

  const filteredAndSortedProducts = products
    .filter(p => {
      const categoryMatch = selectedCategory === 'Все' || p.category === selectedCategory;
      const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
      const sizeMatch = filterSize === 'Все' || p.sizes.includes(filterSize);
      const searchMatch = searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && priceMatch && sizeMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'popularity':
          return (b.popularity || 0) - (a.popularity || 0);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'new':
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return 0;
        default:
          return 0;
      }
    });

  const addToCart = (product: Product) => {
    const size = selectedSize[product.id] || product.sizes[0];
    const existingItem = cart.find(item => item.id === product.id && item.selectedSize === size);
    
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === product.id && item.selectedSize === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1, selectedSize: size }]);
    }
  };

  const removeFromCart = (id: number, size: string) => {
    setCart(cart.filter(item => !(item.id === id && item.selectedSize === size)));
  };

  const updateQuantity = (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, size);
    } else {
      setCart(cart.map(item => 
        item.id === id && item.selectedSize === size
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Icon name="Shirt" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FashionStore
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="lg" 
              className="relative hover:scale-105 transition-transform"
              onClick={() => navigate('/favorites')}
            >
              <Icon name="Heart" size={20} />
              {favorites.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-accent hover:bg-accent px-2">
                  {favorites.length}
                </Badge>
              )}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
              <Button variant="outline" size="lg" className="relative hover:scale-105 transition-transform">
                <Icon name="ShoppingCart" size={20} />
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-secondary hover:bg-secondary px-2">
                    {totalItems}
                  </Badge>
                )}
              </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-lg">
              <SheetHeader>
                <SheetTitle className="text-2xl">Корзина</SheetTitle>
              </SheetHeader>
              <div className="mt-8 space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <Icon name="ShoppingBag" size={64} className="mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Корзина пуста</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                      {cart.map((item) => (
                        <Card key={`${item.id}-${item.selectedSize}`} className="overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">Размер: {item.selectedSize}</p>
                                <p className="font-bold text-primary mt-1">{item.price.toLocaleString('ru-RU')} ₽</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity - 1)}
                                  >
                                    <Icon name="Minus" size={14} />
                                  </Button>
                                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                  <Button 
                                    size="sm" 
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, item.selectedSize, item.quantity + 1)}
                                  >
                                    <Icon name="Plus" size={14} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="ml-auto text-destructive"
                                    onClick={() => removeFromCart(item.id, item.selectedSize)}
                                  >
                                    <Icon name="Trash2" size={16} />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <div className="border-t pt-4 space-y-4">
                      <div className="flex justify-between items-center text-xl font-bold">
                        <span>Итого:</span>
                        <span className="text-primary">{totalPrice.toLocaleString('ru-RU')} ₽</span>
                      </div>
                      <Button 
                        className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        onClick={() => navigate('/checkout', { state: { cart } })}
                      >
                        Оформить заказ
                      </Button>
                    </div>
                  </>
                )}
              </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-10 animate-fade-in">
          <div className="bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-orange-500/30 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                <div className="text-center lg:text-left flex-1">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                    <Icon name="Tag" size={28} className="text-orange-600" />
                    <h3 className="text-2xl sm:text-3xl font-bold text-foreground">Активные промокоды</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Используй промокоды при оформлении заказа и получи выгоду!
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-purple-600 text-white font-bold text-xs">WINTER2025</Badge>
                        <Badge variant="outline" className="text-[10px] border-purple-500/50">до 1 марта</Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground">Скидка 15%</p>
                      <p className="text-xs text-muted-foreground">на весь заказ</p>
                    </div>

                    <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer relative overflow-hidden">
                      <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                        HOT 🔥
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-red-600 text-white font-bold text-xs">FLASH50</Badge>
                        <Badge variant="outline" className="text-[10px] border-red-500/50">до 15 ноя</Badge>
                      </div>
                      <p className="text-sm font-semibold text-foreground">Скидка 50%</p>
                      <p className="text-xs text-muted-foreground">флеш-распродажа</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-green-600 text-white font-bold text-xs">FREESHIP</Badge>
                        <Icon name="Truck" size={16} className="text-green-600" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Бесплатная доставка</p>
                      <p className="text-xs text-muted-foreground">экономия до 1500 ₽</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-xl p-4 hover:scale-105 transition-transform cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <Badge className="bg-blue-600 text-white font-bold text-xs">SAVE500</Badge>
                        <Icon name="Gift" size={16} className="text-blue-600" />
                      </div>
                      <p className="text-sm font-semibold text-foreground">Скидка 500 ₽</p>
                      <p className="text-xs text-muted-foreground">на первый заказ</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                  <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 border-2 border-orange-500/30 shadow-lg">
                    <div className="text-center mb-2">
                      <Icon name="Clock" size={24} className="text-orange-600 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground font-semibold">Акция закончится через</p>
                    </div>
                    <div className="flex items-center gap-2 text-2xl font-bold text-orange-600">
                      <div className="bg-background px-3 py-2 rounded-lg shadow-md min-w-[60px] text-center border border-orange-200">
                        {String(timeLeft.hours).padStart(2, '0')}
                        <div className="text-[10px] text-muted-foreground font-normal">ч</div>
                      </div>
                      <div>:</div>
                      <div className="bg-background px-3 py-2 rounded-lg shadow-md min-w-[60px] text-center border border-orange-200">
                        {String(timeLeft.minutes).padStart(2, '0')}
                        <div className="text-[10px] text-muted-foreground font-normal">м</div>
                      </div>
                      <div>:</div>
                      <div className="bg-background px-3 py-2 rounded-lg shadow-md min-w-[60px] text-center border border-orange-200">
                        {String(timeLeft.seconds).padStart(2, '0')}
                        <div className="text-[10px] text-muted-foreground font-normal">с</div>
                      </div>
                    </div>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold shadow-lg"
                    onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                  >
                    <Icon name="Sparkles" size={20} className="mr-2" />
                    Смотреть товары
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gradient-to-br from-red-500 to-orange-500 text-white overflow-hidden relative group hover:shadow-2xl transition-shadow">
              <CardContent className="p-8 relative z-10">
                <Badge className="bg-white text-red-600 mb-4 text-sm font-bold px-3 py-1">
                  <Icon name="Zap" size={14} className="mr-1" />
                  Горящее предложение
                </Badge>
                <h3 className="text-3xl font-black mb-2">Скидки до 50%</h3>
                <p className="text-white/90 mb-2 text-lg">
                  На зимние куртки и верхнюю одежду
                </p>
                <Badge className="bg-yellow-400 text-yellow-900 mb-4">
                  <Icon name="Package" size={14} className="mr-1" />
                  {jacketsSaleCount} товаров в акции
                </Badge>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
                  <p className="text-sm text-white/80 mb-2 font-semibold flex items-center gap-2">
                    <Icon name="Clock" size={16} />
                    Акция заканчивается через:
                  </p>
                  <div className="flex gap-3 justify-center">
                    <div className="text-center">
                      <div className="bg-white/30 backdrop-blur-md rounded-lg px-3 py-2 min-w-[60px]">
                        <div className="text-2xl font-black">{timeLeft.hours.toString().padStart(2, '0')}</div>
                      </div>
                      <div className="text-xs mt-1 text-white/80">часов</div>
                    </div>
                    <div className="text-2xl font-black self-center pb-5">:</div>
                    <div className="text-center">
                      <div className="bg-white/30 backdrop-blur-md rounded-lg px-3 py-2 min-w-[60px]">
                        <div className="text-2xl font-black">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                      </div>
                      <div className="text-xs mt-1 text-white/80">минут</div>
                    </div>
                    <div className="text-2xl font-black self-center pb-5">:</div>
                    <div className="text-center">
                      <div className="bg-white/30 backdrop-blur-md rounded-lg px-3 py-2 min-w-[60px]">
                        <div className="text-2xl font-black">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                      </div>
                      <div className="text-xs mt-1 text-white/80">секунд</div>
                    </div>
                  </div>
                </div>
                <Button 
                  className="bg-white text-red-600 hover:bg-red-50 font-bold w-full"
                  onClick={() => setSelectedCategory('Куртки')}
                >
                  Смотреть акции
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </CardContent>
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon name="Percent" size={180} />
              </div>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden relative group hover:shadow-2xl transition-shadow">
              <CardContent className="p-8 relative z-10">
                <Badge className="bg-white text-blue-600 mb-4 text-sm font-bold px-3 py-1">
                  <Icon name="Gift" size={14} className="mr-1" />
                  Специальное предложение
                </Badge>
                <h3 className="text-3xl font-black mb-2">2+1 в подарок</h3>
                <p className="text-white/90 mb-2 text-lg">
                  При покупке 2 любых товаров — третий в подарок
                </p>
                <Badge className="bg-white/90 text-blue-600 mb-6">
                  <Icon name="ShoppingBag" size={14} className="mr-1" />
                  Доступно на {totalProductsCount} товаров
                </Badge>
                <Button 
                  className="bg-white text-blue-600 hover:bg-blue-50 font-bold"
                  onClick={() => setSelectedCategory('Все')}
                >
                  Выбрать товары
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
              </CardContent>
              <div className="absolute -right-10 -bottom-10 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon name="Gift" size={180} />
              </div>
            </Card>
          </div>
        </section>

        <section className="mb-8 text-center animate-fade-in">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Коллекция 2025
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Откройте для себя стильные куртки на любой сезон
          </p>
          <div className="max-w-xl mx-auto">
            <div className="relative">
              <Icon name="Search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
              <Input
                type="text"
                placeholder="Поиск по названию куртки..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-12 h-12 text-base"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery('')}
                >
                  <Icon name="X" size={20} />
                </Button>
              )}
            </div>
          </div>
        </section>

        <div className="mb-8 space-y-6">
          <Card className="animate-fade-in">
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <Label className="text-base font-semibold mb-3 block">Сезон</Label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category)}
                        className={selectedCategory === category 
                          ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                          : "hover:scale-105 transition-transform"}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">Размер</Label>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <Button
                        key={size}
                        variant={filterSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilterSize(size)}
                        className={filterSize === size 
                          ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                          : "hover:scale-105 transition-transform"}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold mb-3 block">
                    Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₽
                  </Label>
                  <Slider
                    min={0}
                    max={25000}
                    step={1000}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>0 ₽</span>
                    <span>25 000 ₽</span>
                  </div>
                </div>
              </div>

              {(selectedCategory !== 'Все' || filterSize !== 'Все' || priceRange[0] > 0 || priceRange[1] < 25000 || sortBy !== 'default' || searchQuery !== '') && (
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Найдено товаров: {filteredAndSortedProducts.length}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCategory('Все');
                      setFilterSize('Все');
                      setPriceRange([0, 25000]);
                      setSortBy('default');
                      setSearchQuery('');
                    }}
                  >
                    <Icon name="X" size={16} className="mr-2" />
                    Сбросить всё
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Показано товаров: {filteredAndSortedProducts.length}
          </h3>
          <div className="flex items-center gap-3">
            <Label className="text-sm font-medium">Сортировка:</Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Выберите сортировку" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">По умолчанию</SelectItem>
                <SelectItem value="price-asc">Цена: по возрастанию</SelectItem>
                <SelectItem value="price-desc">Цена: по убыванию</SelectItem>
                <SelectItem value="popularity">По популярности</SelectItem>
                <SelectItem value="rating">По рейтингу</SelectItem>
                <SelectItem value="new">Новинки</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in border-2 hover:border-primary cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <Badge className="bg-secondary hover:bg-secondary">
                      {product.category}
                    </Badge>
                    {product.isNew && (
                      <Badge className="bg-accent hover:bg-accent">
                        Новинка
                      </Badge>
                    )}
                  </div>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(product.id);
                    }}
                  >
                    <Icon 
                      name="Heart" 
                      size={20} 
                      className={favorites.includes(product.id) ? "fill-primary text-primary" : ""}
                    />
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    {product.rating && product.reviewCount && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Icon
                              key={star}
                              name="Star"
                              size={16}
                              className={star <= Math.round(product.rating!) 
                                ? "fill-yellow-400 text-yellow-400" 
                                : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.reviewCount})</span>
                      </div>
                    )}
                    <p className="text-2xl font-black text-primary">
                      {product.price.toLocaleString('ru-RU')} ₽
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold mb-2 text-muted-foreground">Размер:</p>
                    <div className="flex gap-2">
                      {product.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize[product.id] === size ? "default" : "outline"}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedSize({ ...selectedSize, [product.id]: size });
                          }}
                          className={selectedSize[product.id] === size 
                            ? "bg-gradient-to-r from-primary to-secondary" 
                            : ""}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full h-12 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-base font-semibold"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    <Icon name="ShoppingCart" size={18} className="mr-2" />
                    В корзину
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">© 2025 FashionStore. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}