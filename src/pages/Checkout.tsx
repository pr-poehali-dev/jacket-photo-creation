import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selectedSize: string;
}

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const cart: CartItem[] = location.state?.cart || [];
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    apartment: '',
    floor: '',
    entrance: '',
    comment: '',
    paymentMethod: 'card',
    deliveryMethod: 'courier',
    deliveryTime: 'anytime'
  });

  const [promoCode, setPromoCode] = useState('DEV100');
  const [appliedPromo, setAppliedPromo] = useState<{code: string, discount: number} | null>(null);

  const promoCodes: {[key: string]: {discount: number, type: 'percent' | 'fixed', expiresAt?: string, description: string}} = {
    'WINTER2025': { discount: 15, type: 'percent', expiresAt: '2025-03-01', description: 'Зимняя распродажа' },
    'SAVE500': { discount: 500, type: 'fixed', description: 'Скидка на первый заказ' },
    'NEW10': { discount: 10, type: 'percent', expiresAt: '2025-12-31', description: 'Для новых покупателей' },
    'FREESHIP': { discount: 0, type: 'fixed', description: 'Бесплатная доставка' },
    'FLASH50': { discount: 50, type: 'percent', expiresAt: '2025-11-15', description: 'Флеш-распродажа' },
    'DEV100': { discount: 100, type: 'percent', description: 'Скидка для разработчиков' }
  };

  useEffect(() => {
    if (cart.length > 0 && !appliedPromo) {
      setAppliedPromo({ code: 'DEV100', discount: 100 });
      toast({
        title: 'Промокод DEV100 применён! 💻',
        description: 'Скидка 100% для разработчиков активирована',
      });
    }
  }, []);

  const getTimeLeft = (expiresAt: string) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} дн.`;
    return `${hours} ч.`;
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let deliveryPrice = formData.deliveryMethod === 'courier' ? 500 : formData.deliveryMethod === 'express' ? 1500 : 0;
  
  if (appliedPromo?.code === 'FREESHIP') {
    deliveryPrice = 0;
  }

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.code === 'FREESHIP') {
      discount = formData.deliveryMethod === 'courier' ? 500 : formData.deliveryMethod === 'express' ? 1500 : 0;
    } else if (promoCodes[appliedPromo.code].type === 'percent') {
      discount = Math.round(totalPrice * (appliedPromo.discount / 100));
    } else {
      discount = appliedPromo.discount;
    }
  }

  const finalPrice = totalPrice + deliveryPrice - discount;

  const applyPromoCode = () => {
    const upperCode = promoCode.toUpperCase();
    if (promoCodes[upperCode]) {
      const promo = promoCodes[upperCode];
      
      if (promo.expiresAt) {
        const now = new Date();
        const expiry = new Date(promo.expiresAt);
        if (now > expiry) {
          toast({
            title: 'Промокод истёк',
            description: 'Срок действия промокода закончился',
            variant: 'destructive'
          });
          return;
        }
      }
      
      setAppliedPromo({ code: upperCode, discount: promo.discount });
      toast({
        title: 'Промокод применён! 🎉',
        description: upperCode === 'FREESHIP' 
          ? 'Бесплатная доставка активирована'
          : promo.type === 'percent'
          ? `Скидка ${promo.discount}% на заказ`
          : `Скидка ${promo.discount} ₽ на заказ`,
      });
    } else {
      toast({
        title: 'Неверный промокод',
        description: 'Проверьте правильность ввода',
        variant: 'destructive'
      });
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoCode('');
    toast({
      title: 'Промокод удалён',
      description: 'Скидка отменена',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.phone || !formData.email || !formData.address || !formData.city) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive"
      });
      return;
    }

    const orderNumber = `FS${Date.now().toString().slice(-8)}`;
    const orderDetails = {
      orderNumber,
      fullName: formData.fullName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
      totalPrice,
      deliveryPrice,
      finalPrice,
      items: cart
    };

    navigate('/order-success', { state: { orderDetails } });
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <Icon name="ShoppingBag" size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Корзина пуста</h2>
            <p className="text-muted-foreground mb-6">Добавьте товары для оформления заказа</p>
            <Button onClick={() => navigate('/')} className="bg-gradient-to-r from-primary to-secondary">
              Вернуться в каталог
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-border shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
            <Icon name="ArrowLeft" size={20} />
            Вернуться в магазин
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Оформление заказа
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="User" size={24} />
                  Контактные данные
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Полное имя *</Label>
                    <Input
                      id="fullName"
                      placeholder="Иван Иванов"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Телефон *</Label>
                    <Input
                      id="phone"
                      placeholder="+7 (999) 123-45-67"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MapPin" size={24} />
                  Адрес доставки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Город *</Label>
                    <Input
                      id="city"
                      placeholder="Москва"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Индекс</Label>
                    <Input
                      id="postalCode"
                      placeholder="123456"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Улица и дом *</Label>
                  <Input
                    id="address"
                    placeholder="ул. Примерная, д. 10"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="apartment">Квартира</Label>
                    <Input
                      id="apartment"
                      placeholder="5"
                      value={formData.apartment}
                      onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="floor">Этаж</Label>
                    <Input
                      id="floor"
                      placeholder="3"
                      value={formData.floor}
                      onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="entrance">Подъезд</Label>
                    <Input
                      id="entrance"
                      placeholder="2"
                      value={formData.entrance}
                      onChange={(e) => setFormData({ ...formData, entrance: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Truck" size={24} />
                  Способ доставки
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={formData.deliveryMethod} onValueChange={(value) => setFormData({ ...formData, deliveryMethod: value })}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="courier" id="courier" />
                    <Label htmlFor="courier" className="flex-1 cursor-pointer">
                      <div className="font-semibold flex items-center gap-2">
                        <Icon name="Bike" size={18} />
                        Курьерская доставка
                      </div>
                      <div className="text-sm text-muted-foreground">3-5 рабочих дней • 500 ₽</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex-1 cursor-pointer">
                      <div className="font-semibold flex items-center gap-2">
                        <Icon name="Store" size={18} />
                        Самовывоз
                      </div>
                      <div className="text-sm text-muted-foreground">Готов к выдаче через 1-2 дня • Бесплатно</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="express" id="express" />
                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                      <div className="font-semibold flex items-center gap-2">
                        <Icon name="Zap" size={18} className="text-orange-500" />
                        Экспресс-доставка
                      </div>
                      <div className="text-sm text-muted-foreground">В течение 24 часов • 1500 ₽</div>
                    </Label>
                  </div>
                </RadioGroup>
                
                {formData.deliveryMethod === 'courier' || formData.deliveryMethod === 'express' ? (
                  <div>
                    <Label htmlFor="deliveryTime">Удобное время доставки</Label>
                    <Select value={formData.deliveryTime} onValueChange={(value) => setFormData({ ...formData, deliveryTime: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Выберите время" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="anytime">Любое время</SelectItem>
                        <SelectItem value="morning">Утро (9:00 - 12:00)</SelectItem>
                        <SelectItem value="afternoon">День (12:00 - 15:00)</SelectItem>
                        <SelectItem value="evening">Вечер (15:00 - 18:00)</SelectItem>
                        <SelectItem value="late">Поздний вечер (18:00 - 21:00)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '250ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageSquare" size={24} />
                  Комментарий к заказу
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Укажите дополнительные пожелания: код домофона, особенности подъезда и т.д."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: '300ms' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CreditCard" size={24} />
                  Способ оплаты
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Банковская карта</div>
                      <div className="text-sm text-muted-foreground">Visa, MasterCard, Мир</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Наличными при получении</div>
                      <div className="text-sm text-muted-foreground">Оплата курьеру или в пункте выдачи</div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-24 animate-fade-in" style={{ animationDelay: '400ms' }}>
              <CardHeader>
                <CardTitle>Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          Размер: {item.selectedSize} × {item.quantity}
                        </p>
                        <p className="text-sm font-bold text-primary">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="promoCode" className="text-sm font-semibold">
                      Промокод
                    </Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const promoList = Object.entries(promoCodes)
                          .map(([code, data]) => {
                            const timeLeft = data.expiresAt ? getTimeLeft(data.expiresAt) : null;
                            return `• ${code} - ${data.description}${timeLeft ? ` (осталось ${timeLeft})` : ''}`;
                          })
                          .join('\n');
                        toast({
                          title: 'Доступные промокоды',
                          description: promoList,
                        });
                      }}
                      className="text-xs text-primary hover:text-primary/80 gap-1 h-auto p-1"
                    >
                      <Icon name="Sparkles" size={14} />
                      Акции
                    </Button>
                  </div>

                  {appliedPromo ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="CheckCircle2" size={20} className="text-green-600" />
                        <div>
                          <p className="font-semibold text-green-800">{appliedPromo.code}</p>
                          <p className="text-xs text-green-600">
                            {promoCodes[appliedPromo.code].description}
                            {promoCodes[appliedPromo.code].expiresAt && getTimeLeft(promoCodes[appliedPromo.code].expiresAt!) && (
                              <span className="ml-1">• осталось {getTimeLeft(promoCodes[appliedPromo.code].expiresAt!)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                        className="text-green-700 hover:text-green-900"
                      >
                        <Icon name="X" size={18} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        id="promoCode"
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        onClick={applyPromoCode}
                        disabled={!promoCode}
                        className="gap-2"
                      >
                        <Icon name="Tag" size={16} />
                        Применить
                      </Button>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)} шт)</span>
                    <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Доставка</span>
                    <span className={appliedPromo?.code === 'FREESHIP' ? 'line-through text-muted-foreground' : ''}>
                      {(formData.deliveryMethod === 'courier' ? 500 : formData.deliveryMethod === 'express' ? 1500 : 0) > 0 
                        ? `${formData.deliveryMethod === 'courier' ? 500 : 1500} ₽` 
                        : 'Бесплатно'}
                    </span>
                  </div>
                  {appliedPromo?.code === 'FREESHIP' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Бесплатная доставка</span>
                      <span>0 ₽</span>
                    </div>
                  )}
                  {discount > 0 && appliedPromo?.code !== 'FREESHIP' && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Скидка по промокоду</span>
                      <span>-{discount.toLocaleString('ru-RU')} ₽</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{finalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                {discount > 0 && (
                  <p className="text-sm text-green-600 text-center font-semibold">
                    Вы экономите {discount.toLocaleString('ru-RU')} ₽ 🎉
                  </p>
                )}

                <Button 
                  className="w-full h-12 text-lg bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  onClick={handleSubmit}
                >
                  Оформить заказ
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}