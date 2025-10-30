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
    name: "Purple Winter Jacket",
    price: 12990,
    category: "Куртки",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/f4f555a7-e32a-4c2f-a087-cea6897a050b.jpg",
    description: "Стильная фиолетовая зимняя куртка с утеплителем. Отлично защищает от холода и ветра.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Фиолетовый"],
    material: "Полиэстер с синтетическим утеплителем",
    care: ["Стирка при 30°C", "Не отбеливать", "Гладить при низкой температуре"],
    features: ["Водоотталкивающая ткань", "Капюшон", "Боковые карманы", "YKK молнии"]
  },
  {
    id: 2,
    name: "Orange Bomber",
    price: 8990,
    category: "Куртки",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/a0d1e8dc-2f18-41d2-9cb6-f0ee8d9b15d2.jpg",
    description: "Яркий оранжевый бомбер для смелых образов. Легкий и комфортный.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Оранжевый"],
    material: "Нейлон",
    care: ["Стирка при 30°C", "Машинная стирка"],
    features: ["Эластичные манжеты", "Два боковых кармана", "Легкая подкладка"]
  },
  {
    id: 7,
    name: "Вязаная шапка с помпоном",
    price: 1990,
    category: "Шапки",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/f97c1269-ebb5-4342-a0fd-f754749562c8.jpg",
    description: "Теплая вязаная шапка с модным помпоном. Идеальна для холодной погоды.",
    sizes: ["Универсальный"],
    colors: ["Серый", "Бежевый", "Черный"],
    material: "Акрил с шерстью",
    care: ["Ручная стирка", "Не отжимать", "Сушить на горизонтальной поверхности"],
    features: ["Мягкая подкладка", "Помпон из искусственного меха", "Эластичная посадка"]
  },
  {
    id: 8,
    name: "Шапка-ушанка",
    price: 2990,
    category: "Шапки",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/aca4f13f-c7aa-4473-b21d-d8af3fe9adfe.jpg",
    description: "Классическая русская ушанка с искусственным мехом. Максимальная защита от мороза.",
    sizes: ["S/M", "L/XL"],
    colors: ["Черный", "Коричневый"],
    material: "Искусственный мех, полиэстер",
    care: ["Химчистка", "Избегать влаги"],
    features: ["Завязки на ушах", "Теплая подкладка", "Ветрозащита"]
  },
  {
    id: 10,
    name: "Зимние ботинки Timberland",
    price: 15990,
    category: "Ботинки",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/bdf4e389-ed31-43b4-9095-77b4d269a219.jpg",
    description: "Прочные зимние ботинки с водонепроницаемой кожей. Надежное сцепление на любой поверхности.",
    sizes: ["39", "40", "41", "42", "43", "44", "45"],
    colors: ["Коричневый", "Черный"],
    material: "Натуральная кожа с водоотталкивающей пропиткой",
    care: ["Чистка специальными средствами", "Обработка водоотталкивающим спреем"],
    features: ["Утепленная подкладка", "Противоскользящая подошва", "Анатомическая стелька"]
  },
  {
    id: 11,
    name: "Треккинговые ботинки",
    price: 12990,
    category: "Ботинки",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/44493105-7a54-45f3-b7d4-cc64c0aa95ad.jpg",
    description: "Легкие треккинговые ботинки для походов и активного отдыха.",
    sizes: ["39", "40", "41", "42", "43", "44"],
    colors: ["Серый", "Черный"],
    material: "Синтетика с мембраной",
    care: ["Машинная стирка", "Сушка при комнатной температуре"],
    features: ["Дышащая мембрана", "Усиленный носок", "Виброзащита"]
  },
  {
    id: 13,
    name: "Кожаные рукавицы",
    price: 3990,
    category: "Рукавицы",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/85d1cdcd-82a9-4208-bfd2-44bdff13832c.jpg",
    description: "Элегантные кожаные рукавицы с меховой подкладкой.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Черный", "Коричневый"],
    material: "Натуральная кожа, шерстяная подкладка",
    care: ["Химчистка", "Избегать намокания"],
    features: ["Меховая подкладка", "Эластичная манжета", "Усиленные швы"]
  },
  {
    id: 14,
    name: "Вязаные варежки",
    price: 1490,
    category: "Рукавицы",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/09bae8d0-f9d8-441b-acdc-27f039ee188c.jpg",
    description: "Уютные вязаные варежки ручной работы.",
    sizes: ["S/M", "L/XL"],
    colors: ["Красный", "Зеленый", "Синий"],
    material: "Шерсть с акрилом",
    care: ["Ручная стирка", "Сушка в расправленном виде"],
    features: ["Ручная вязка", "Теплая шерсть", "Яркие узоры"]
  },
  {
    id: 16,
    name: "Зимние штаны с утеплителем",
    price: 8990,
    category: "Штаны",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/5482ff8d-83bf-47b9-b2d9-e4e44eee67f9.jpg",
    description: "Теплые зимние штаны с синтетическим утеплителем для максимального комфорта.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Черный", "Темно-синий"],
    material: "Полиэстер с утеплителем",
    care: ["Стирка при 30°C", "Не отбеливать"],
    features: ["Регулировка по талии", "Боковые карманы", "Усиленные колени"]
  },
  {
    id: 17,
    name: "Горнолыжные брюки",
    price: 12990,
    category: "Штаны",
    image: "https://cdn.poehali.dev/projects/9e89350b-a4e3-4b59-9b5f-cceb089d7f20/files/cde9ed02-75e9-4f82-98ec-3ac043b3894f.jpg",
    description: "Профессиональные горнолыжные брюки с мембраной и защитой от снега.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Черный", "Красный", "Синий"],
    material: "Мембранная ткань",
    care: ["Специальная стирка", "Не использовать кондиционер"],
    features: ["Водонепроницаемость", "Снегозащитные гетры", "Вентиляционные молнии"]
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