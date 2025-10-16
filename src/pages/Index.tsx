import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

type Screen = 'login' | 'verify' | 'app';
type Tab = 'chats' | 'calls' | 'contacts' | 'profile';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread?: number;
  avatar?: string;
}

interface Call {
  id: number;
  name: string;
  type: 'incoming' | 'outgoing' | 'missed';
  time: string;
  avatar?: string;
}

interface Contact {
  id: number;
  name: string;
  phone: string;
  avatar?: string;
}

const Index = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const [activeTab, setActiveTab] = useState<Tab>('chats');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');

  const [chats] = useState<Chat[]>([
    { id: 1, name: 'Мария Петрова', lastMessage: 'Привет! Как дела?', time: '14:23', unread: 2 },
    { id: 2, name: 'Команда VneChat', lastMessage: 'Добро пожаловать в VneChat!', time: '12:05', unread: 1 },
    { id: 3, name: 'Александр', lastMessage: 'Созвонимся завтра', time: 'Вчера' },
    { id: 4, name: 'Елена Смирнова', lastMessage: 'Отправила файлы', time: 'Вчера' },
  ]);

  const [calls] = useState<Call[]>([
    { id: 1, name: 'Мария Петрова', type: 'incoming', time: 'Сегодня, 14:15' },
    { id: 2, name: 'Александр', type: 'outgoing', time: 'Сегодня, 11:20' },
    { id: 3, name: 'Елена Смирнова', type: 'missed', time: 'Вчера, 18:45' },
    { id: 4, name: 'Команда VneChat', type: 'outgoing', time: 'Вчера, 16:30' },
  ]);

  const [contacts] = useState<Contact[]>([
    { id: 1, name: 'Мария Петрова', phone: '+7 999 123 45 67' },
    { id: 2, name: 'Александр', phone: '+7 999 234 56 78' },
    { id: 3, name: 'Елена Смирнова', phone: '+7 999 345 67 89' },
    { id: 4, name: 'Команда VneChat', phone: '+7 999 456 78 90' },
  ]);

  const handleLogin = () => {
    if (phone.length >= 10) {
      setScreen('verify');
    }
  };

  const handleVerify = () => {
    if (otp.length === 6) {
      setScreen('app');
    }
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.startsWith('7')) {
      const match = numbers.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/);
      if (match) {
        return `+7 ${match[1]}${match[2] ? ' ' + match[2] : ''}${match[3] ? ' ' + match[3] : ''}${match[4] ? ' ' + match[4] : ''}`.trim();
      }
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
  };

  if (screen === 'login') {
    return (
      <div className="min-h-screen bg-[#075E54] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center mb-4">
              <Icon name="MessageCircle" size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">VneChat</h1>
            <p className="text-muted-foreground">Введите номер телефона для входа</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <Input
                type="tel"
                placeholder="+7 999 123 45 67"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={16}
                className="text-lg"
              />
            </div>
            <Button 
              onClick={handleLogin} 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
            >
              Получить код
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (screen === 'verify') {
    return (
      <div className="min-h-screen bg-[#075E54] flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-20 h-20 bg-primary rounded-full mx-auto flex items-center justify-center mb-4">
              <Icon name="Shield" size={40} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Подтверждение</h1>
            <p className="text-muted-foreground">Введите код из SMS на номер {phone}</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button 
              onClick={handleVerify} 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              size="lg"
              disabled={otp.length !== 6}
            >
              Войти
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setScreen('login')} 
              className="w-full"
            >
              Изменить номер
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <div className="bg-[#075E54] text-white p-4 shadow-md">
        <h1 className="text-xl font-semibold">
          {activeTab === 'chats' && 'Чаты'}
          {activeTab === 'calls' && 'Звонки'}
          {activeTab === 'contacts' && 'Контакты'}
          {activeTab === 'profile' && 'Профиль'}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-20">
        {activeTab === 'chats' && (
          <div className="divide-y">
            {chats.map(chat => (
              <div key={chat.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback className="bg-primary text-white">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">{chat.name}</h3>
                    <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    {chat.unread && (
                      <Badge className="bg-primary text-white ml-2">{chat.unread}</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'calls' && (
          <div className="divide-y">
            {calls.map(call => (
              <div key={call.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={call.avatar} />
                  <AvatarFallback className="bg-primary text-white">
                    {call.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold">{call.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Icon 
                      name={call.type === 'incoming' ? 'PhoneIncoming' : call.type === 'outgoing' ? 'PhoneOutgoing' : 'PhoneMissed'} 
                      size={14}
                      className={call.type === 'missed' ? 'text-destructive' : 'text-muted-foreground'}
                    />
                    <span>{call.time}</span>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Icon name="Phone" className="text-primary" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className="p-4 bg-muted/50 flex gap-2">
              <Button className="bg-primary hover:bg-primary/90 text-white" size="icon">
                <Icon name="Plus" />
              </Button>
              <Input placeholder="Поиск контактов..." className="flex-1" />
            </div>
            <div className="divide-y">
              {contacts.map(contact => (
                <div key={contact.id} className="p-4 hover:bg-muted/50 cursor-pointer transition-colors flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback className="bg-primary text-white">
                      {contact.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4 space-y-6">
            <div className="flex flex-col items-center gap-4 py-6">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="bg-primary text-white text-4xl">ВЧ</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-2xl font-bold">Вы в VneChat</h2>
                <p className="text-muted-foreground">{phone}</p>
              </div>
            </div>

            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                <Icon name="User" className="text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Имя</p>
                  <p className="text-sm text-muted-foreground">Не указано</p>
                </div>
                <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                <Icon name="Info" className="text-primary" />
                <div className="flex-1">
                  <p className="font-medium">О себе</p>
                  <p className="text-sm text-muted-foreground">Не указано</p>
                </div>
                <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
              </div>

              <div className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer">
                <Icon name="Phone" className="text-primary" />
                <div className="flex-1">
                  <p className="font-medium">Изменить номер</p>
                  <p className="text-sm text-muted-foreground">{phone}</p>
                </div>
                <Icon name="ChevronRight" className="text-muted-foreground" size={20} />
              </div>
            </Card>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex justify-around p-2">
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'chats' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('chats')}
          >
            <Icon name="MessageCircle" size={24} />
            <span className="text-xs">Чаты</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'calls' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('calls')}
          >
            <Icon name="Phone" size={24} />
            <span className="text-xs">Звонки</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'contacts' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('contacts')}
          >
            <Icon name="Users" size={24} />
            <span className="text-xs">Контакты</span>
          </Button>
          <Button
            variant="ghost"
            className={`flex-1 flex flex-col items-center gap-1 ${activeTab === 'profile' ? 'text-primary' : 'text-muted-foreground'}`}
            onClick={() => setActiveTab('profile')}
          >
            <Icon name="User" size={24} />
            <span className="text-xs">Профиль</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
