import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  sizes: string[];
  colors: string[];
  material: string;
  care: string[];
  features: string[];
}

const products: Product[] = [
  {
    id: 1,
    name: "Classic Leather Jacket",
    price: 8999,
    category: "Кожаные",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80",
    description: "Классическая кожаная куртка из натуральной кожи высшего качества. Идеально подходит для создания стильного образа в любое время года.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Черный", "Коричневый"],
    material: "100% натуральная кожа",
    care: ["Химчистка", "Избегать влаги", "Хранить в прохладном месте"],
    features: ["Подкладка из полиэстера", "YKK молнии", "Боковые карманы", "Регулируемые манжеты"]
  },
  {
    id: 2,
    name: "Urban Bomber Jacket",
    price: 5499,
    category: "Бомберы",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
    description: "Современный бомбер с эластичными манжетами и поясом. Легкий и комфортный для повседневной носки.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Хаки", "Черный", "Синий"],
    material: "Полиэстер с водоотталкивающей пропиткой",
    care: ["Стирка при 30°C", "Не отбеливать", "Гладить при низкой температуре"],
    features: ["Водоотталкивающая ткань", "Эластичные манжеты", "Внутренний карман", "Легкая подкладка"]
  },
  {
    id: 3,
    name: "Denim Jacket",
    price: 3999,
    category: "Джинсовые",
    image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80",
    description: "Классическая джинсовая куртка из плотного денима. Универсальная вещь для любого гардероба.",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Синий деним", "Черный", "Светло-голубой"],
    material: "100% хлопок деним",
    care: ["Стирка при 40°C", "Можно гладить", "Не использовать сушильную машину"],
    features: ["Металлические пуговицы", "Нагрудные карманы", "Регулируемая талия", "Усиленные швы"]
  },
  {
    id: 4,
    name: "Winter Parka",
    price: 12999,
    category: "Парки",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800&q=80",
    description: "Теплая зимняя парка с утеплителем и меховой отделкой капюшона. Защитит от самых суровых морозов.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Черный", "Хаки", "Темно-синий"],
    material: "Нейлон с пуховым наполнителем",
    care: ["Химчистка", "Не стирать в машине", "Хранить в сухом месте"],
    features: ["Пуховый утеплитель", "Съемный мех на капюшоне", "Снегозащитная юбка", "Множество карманов"]
  },
  {
    id: 5,
    name: "Sport Windbreaker",
    price: 2999,
    category: "Спортивные",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    description: "Легкая спортивная ветровка с капюшоном. Идеальна для пробежек и активного отдыха.",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    colors: ["Красный", "Черный", "Белый", "Синий"],
    material: "Нейлон с DWR покрытием",
    care: ["Машинная стирка", "Быстросохнущая", "Не требует глажки"],
    features: ["Отражающие элементы", "Вентиляционные отверстия", "Капюшон с утяжкой", "Компактно складывается"]
  },
  {
    id: 6,
    name: "Quilted Jacket",
    price: 6499,
    category: "Стеганые",
    image: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&q=80",
    description: "Стеганая куртка с синтетическим утеплителем. Легкая, теплая и практичная.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Черный", "Темно-синий", "Оливковый"],
    material: "Полиамид с синтетическим утеплителем",
    care: ["Стирка при 30°C", "Можно гладить", "Сушка в машине на низкой температуре"],
    features: ["Легкий утеплитель", "Боковые карманы на молнии", "Внутренний карман", "Компактная посадка"]
  }
];

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === Number(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedSize(foundProduct.sizes[0]);
      setSelectedColor(foundProduct.colors[0]);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Icon name="PackageX" size={64} className="mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-2xl font-bold mb-2">Товар не найден</h2>
          <Button onClick={() => navigate('/')}>Вернуться в каталог</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : [];
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      selectedSize: selectedSize,
      quantity: quantity
    };
    
    const existingItemIndex = cart.findIndex((item: any) => 
      item.id === product.id && item.selectedSize === selectedSize
    );
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    toast({
      title: "Добавлено в корзину",
      description: `${product.name} (${selectedSize}) — ${quantity} шт.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <Icon name="ArrowLeft" size={20} />
            Назад к каталогу
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/cart')}
            className="gap-2"
          >
            <Icon name="ShoppingCart" size={20} />
            Корзина
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Badge className="mb-2">{product.category}</Badge>
              <h1 className="text-4xl font-black mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-primary mb-4">
                {product.price.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Размер</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Цвет</label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <Button
                        key={color}
                        variant={selectedColor === color ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedColor(color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Количество</label>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Icon name="Minus" size={16} />
                    </Button>
                    <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Icon name="Plus" size={16} />
                    </Button>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAddToCart}
                >
                  <Icon name="ShoppingCart" size={20} className="mr-2" />
                  Добавить в корзину
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Shirt" size={20} />
                    Материал
                  </h3>
                  <p className="text-muted-foreground">{product.material}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Sparkles" size={20} />
                    Особенности
                  </h3>
                  <ul className="space-y-1">
                    {product.features.map((feature, index) => (
                      <li key={index} className="text-muted-foreground flex items-start gap-2">
                        <Icon name="Check" size={16} className="mt-1 text-primary flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Icon name="Droplet" size={20} />
                    Уход
                  </h3>
                  <ul className="space-y-1">
                    {product.care.map((instruction, index) => (
                      <li key={index} className="text-muted-foreground flex items-start gap-2">
                        <Icon name="Info" size={16} className="mt-1 text-primary flex-shrink-0" />
                        {instruction}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}