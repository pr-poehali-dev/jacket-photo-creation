import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
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

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<number[]>([]);

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

  const favoriteProducts = products.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Вернуться в магазин
          </Button>
          
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Icon name="Heart" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Избранное
            </h1>
          </div>
          
          <div className="w-[120px]"></div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {favoriteProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6">
              <Icon name="Heart" size={64} className="text-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-3">Здесь пока пусто</h2>
            <p className="text-lg text-muted-foreground mb-6 text-center max-w-md">
              Добавьте товары в избранное, чтобы не потерять их
            </p>
            <Button 
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              size="lg"
            >
              <Icon name="ShoppingBag" size={20} className="mr-2" />
              Перейти в каталог
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-8 animate-fade-in">
              <h2 className="text-3xl font-bold mb-2">Ваши избранные товары</h2>
              <p className="text-muted-foreground">
                Сохранено {favoriteProducts.length} {favoriteProducts.length === 1 ? 'товар' : favoriteProducts.length < 5 ? 'товара' : 'товаров'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteProducts.map((product, index) => (
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
                          className="fill-primary text-primary"
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
                      
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                          onClick={() => navigate('/')}
                        >
                          <Icon name="ShoppingCart" size={18} className="mr-2" />
                          В корзину
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => toggleFavorite(product.id)}
                        >
                          <Icon name="X" size={18} />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="bg-gradient-to-r from-primary/10 to-secondary/10 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">© 2025 FashionStore. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
