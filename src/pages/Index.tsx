import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
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
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/b88b744f-24d8-48fb-9014-f4abbac17917.jpg',
    category: 'Зима',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 2,
    name: 'Orange Bomber',
    price: 8990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/99771fe5-6707-4a8c-9a70-695388bc82de.jpg',
    category: 'Весна',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 3,
    name: 'Pink Puffer',
    price: 14990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/f0dfce24-5fb1-41d4-80f5-673eb9eb8a0c.jpg',
    category: 'Зима',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 4,
    name: 'Black Leather Jacket',
    price: 19990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/b88b744f-24d8-48fb-9014-f4abbac17917.jpg',
    category: 'Демисезон',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 5,
    name: 'Denim Jacket',
    price: 6990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/99771fe5-6707-4a8c-9a70-695388bc82de.jpg',
    category: 'Весна',
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 6,
    name: 'Green Parka',
    price: 16990,
    image: 'https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/f0dfce24-5fb1-41d4-80f5-673eb9eb8a0c.jpg',
    category: 'Зима',
    sizes: ['S', 'M', 'L', 'XL']
  }
];

export default function Index() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Все');
  const [selectedSize, setSelectedSize] = useState<{ [key: number]: string }>({});
  const [favorites, setFavorites] = useState<number[]>([]);

  const categories = ['Все', 'Зима', 'Весна', 'Демисезон'];

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (productId: number) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const filteredProducts = selectedCategory === 'Все' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

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
        <section className="mb-12 text-center animate-fade-in">
          <h2 className="text-5xl font-black mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Коллекция 2025
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Откройте для себя стильные куртки на любой сезон
          </p>
        </section>

        <div className="flex flex-wrap gap-3 justify-center mb-8 animate-fade-in">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="lg"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category 
                ? "bg-gradient-to-r from-primary to-secondary hover:opacity-90" 
                : "hover:scale-105 transition-transform"}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product, index) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 animate-fade-in border-2 hover:border-primary"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <Badge className="absolute top-4 left-4 bg-secondary hover:bg-secondary">
                    {product.category}
                  </Badge>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-4 right-4 bg-white/90 hover:bg-white shadow-lg"
                    onClick={() => toggleFavorite(product.id)}
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
                          onClick={() => setSelectedSize({ ...selectedSize, [product.id]: size })}
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
                    onClick={() => addToCart(product)}
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