import { useState } from 'react';
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

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryPrice = formData.deliveryMethod === 'courier' ? 500 : formData.deliveryMethod === 'express' ? 1500 : 0;
  const finalPrice = totalPrice + deliveryPrice;

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

    toast({
      title: "Заказ оформлен! 🎉",
      description: `Спасибо за покупку! Мы свяжемся с вами по телефону ${formData.phone}`,
    });

    setTimeout(() => navigate('/'), 2000);
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

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Товары ({cart.reduce((sum, item) => sum + item.quantity, 0)} шт)</span>
                    <span>{totalPrice.toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Доставка</span>
                    <span>{deliveryPrice > 0 ? `${deliveryPrice} ₽` : 'Бесплатно'}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between text-xl font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{finalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>

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