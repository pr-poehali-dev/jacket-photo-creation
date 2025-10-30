import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface OrderDetails {
  orderNumber: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  deliveryMethod: string;
  paymentMethod: string;
  totalPrice: number;
  deliveryPrice: number;
  finalPrice: number;
  items: Array<{
    id: number;
    name: string;
    price: number;
    quantity: number;
    selectedSize: string;
  }>;
}

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails: OrderDetails | null = location.state?.orderDetails || null;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!orderDetails) {
      navigate('/');
    }
  }, [orderDetails, navigate]);

  const copyOrderNumber = () => {
    if (orderDetails) {
      navigator.clipboard.writeText(orderDetails.orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getDeliveryMethodName = (method: string) => {
    switch (method) {
      case 'courier':
        return 'Курьерская доставка';
      case 'pickup':
        return 'Самовывоз';
      case 'express':
        return 'Экспресс-доставка';
      default:
        return method;
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method) {
      case 'card':
        return 'Банковская карта';
      case 'cash':
        return 'Наличные при получении';
      case 'online':
        return 'Онлайн-оплата';
      default:
        return method;
    }
  };

  const getEstimatedDelivery = (method: string) => {
    const today = new Date();
    let days = 3;
    if (method === 'express') days = 1;
    if (method === 'pickup') days = 2;
    
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + days);
    
    return deliveryDate.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long',
      year: 'numeric'
    });
  };

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Icon name="Shirt" className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              FashionStore
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Card className="animate-fade-in border-2 border-green-200 bg-green-50/50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Icon name="CheckCircle2" size={48} className="text-white" />
              </div>
              <h1 className="text-3xl font-black mb-2 text-green-800">
                Заказ успешно оформлен! 🎉
              </h1>
              <p className="text-lg text-green-700 mb-6">
                Спасибо за покупку! Мы отправили детали заказа на {orderDetails.email}
              </p>
              
              <div className="bg-white rounded-lg p-6 mb-4">
                <p className="text-sm text-muted-foreground mb-2">Номер заказа</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {orderDetails.orderNumber}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyOrderNumber}
                    className="gap-2"
                  >
                    <Icon name={copied ? "Check" : "Copy"} size={16} />
                    {copied ? 'Скопировано' : 'Копировать'}
                  </Button>
                </div>
              </div>

              <Badge className="bg-blue-500 text-white text-base px-4 py-2">
                <Icon name="Calendar" size={16} className="mr-2" />
                Ожидаемая доставка: {getEstimatedDelivery(orderDetails.deliveryMethod)}
              </Badge>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="Package" size={24} />
                Детали заказа
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Получатель</p>
                  <p className="font-semibold">{orderDetails.fullName}</p>
                  <p className="text-sm text-muted-foreground">{orderDetails.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Адрес доставки</p>
                  <p className="font-semibold">{orderDetails.city}</p>
                  <p className="text-sm text-muted-foreground">{orderDetails.address}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Способ доставки</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Icon name="Truck" size={16} />
                    {getDeliveryMethodName(orderDetails.deliveryMethod)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Способ оплаты</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Icon name="CreditCard" size={16} />
                    {getPaymentMethodName(orderDetails.paymentMethod)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="ShoppingBag" size={24} />
                Состав заказа ({orderDetails.items.length} {orderDetails.items.length === 1 ? 'товар' : 'товара'})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderDetails.items.map((item) => (
                <div key={`${item.id}-${item.selectedSize}`} className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Размер: {item.selectedSize} • Количество: {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-primary">
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              ))}
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Товары:</span>
                  <span>{orderDetails.totalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Доставка:</span>
                  <span>{orderDetails.deliveryPrice === 0 ? 'Бесплатно' : `${orderDetails.deliveryPrice.toLocaleString('ru-RU')} ₽`}</span>
                </div>
                <Separator />
                <div className="flex justify-between text-xl font-bold">
                  <span>Итого:</span>
                  <span className="text-primary">{orderDetails.finalPrice.toLocaleString('ru-RU')} ₽</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="animate-fade-in bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Info" size={24} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">Что дальше?</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Мы обработаем ваш заказ в течение 1-2 часов</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Отправим SMS с информацией о доставке на {orderDetails.phone}</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Курьер свяжется с вами за день до доставки</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Icon name="Check" size={16} className="text-green-500 mt-0.5" />
                      <span>Вы можете отследить заказ по номеру {orderDetails.orderNumber}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 gap-2"
              size="lg"
            >
              <Icon name="Home" size={20} />
              Вернуться в магазин
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
              className="gap-2"
              size="lg"
            >
              <Icon name="Printer" size={20} />
              Распечатать заказ
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
