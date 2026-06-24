import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

const API = func2url.bookings;
const WEBHOOK_TARGET = func2url['telegram-bot'];
const BOT_WEBHOOK_REGISTER_URL = (token: string) =>
  `https://api.telegram.org/bot${token}/setWebhook?url=${encodeURIComponent(WEBHOOK_TARGET)}`;

interface Booking {
  id: number;
  ticket_code: string;
  format: string;
  trip_date: string;
  passenger_name: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
}

const Admin = () => {
  const [key, setKey] = useState('');
  const [authed, setAuthed] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [tgToken, setTgToken] = useState('');
  const [tgStep, setTgStep] = useState<'idle' | 'token' | 'done'>('idle');
  const [tgWebhookUrl, setTgWebhookUrl] = useState('');

  const login = async () => {
    setLoading(true);
    setError('');
    const res = await fetch(`${API}?admin=1`, {
      headers: { 'X-Admin-Key': key },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError('Неверный пароль');
      return;
    }
    setBookings(data.bookings || []);
    setAuthed(true);
  };

  const refresh = async () => {
    setLoading(true);
    const res = await fetch(`${API}?admin=1`, { headers: { 'X-Admin-Key': key } });
    const data = await res.json();
    setLoading(false);
    setBookings(data.bookings || []);
  };

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.passenger_name.toLowerCase().includes(q) ||
      b.phone.includes(q) ||
      b.ticket_code.toLowerCase().includes(q) ||
      b.format.toLowerCase().includes(q)
    );
  });

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 font-display font-extrabold text-2xl mb-8">
            <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <Icon name="Anchor" size={20} />
            </span>
            Речгортранс
          </div>
          <div className="bg-card rounded-3xl border border-border p-7 shadow-sm">
            <h1 className="font-display font-bold text-xl mb-1">Вход в админку</h1>
            <p className="text-sm text-muted-foreground mb-6">Введите пароль для доступа к бронированиям</p>
            <div className="space-y-3">
              <Input
                type="password"
                placeholder="Пароль"
                className="rounded-xl h-12"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
              />
              {error && (
                <p className="text-sm text-destructive flex items-center gap-1.5">
                  <Icon name="AlertCircle" size={15} /> {error}
                </p>
              )}
              <Button
                className="w-full rounded-xl h-12 font-semibold"
                onClick={login}
                disabled={loading || !key}
              >
                {loading ? 'Проверка...' : 'Войти'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
              <Icon name="Anchor" size={18} />
            </span>
            <div>
              <div className="font-display font-bold text-base leading-tight">Речгортранс</div>
              <div className="text-xs text-muted-foreground">Панель администратора</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="rounded-full gap-1.5">
              <Icon name="RefreshCw" size={15} /> Обновить
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="rounded-full gap-1.5">
              <Icon name="Home" size={15} /> На сайт
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8">

        {/* Telegram Setup */}
        <div className="bg-card rounded-3xl border border-border p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <span className="grid place-items-center w-10 h-10 rounded-xl bg-[#229ED9]/10 text-[#229ED9]">
                <Icon name="Send" size={20} />
              </span>
              <div>
                <div className="font-display font-bold">Telegram-бот</div>
                <div className="text-sm text-muted-foreground">Уведомления о новых бронях в Telegram</div>
              </div>
            </div>
            {tgStep === 'idle' && (
              <Button variant="outline" className="rounded-full gap-2" onClick={() => setTgStep('token')}>
                <Icon name="Zap" size={15} /> Подключить бота
              </Button>
            )}
          </div>

          {tgStep === 'token' && (
            <div className="mt-5 border-t border-border pt-5 space-y-4">
              <p className="text-sm font-semibold">Шаг 1 — введи токен бота:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="1234567890:AAFxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="rounded-xl h-10 font-mono text-sm"
                  value={tgToken}
                  onChange={(e) => setTgToken(e.target.value)}
                />
                <Button
                  className="rounded-xl px-5 shrink-0"
                  disabled={!tgToken.includes(':')}
                  onClick={() => {
                    const url = BOT_WEBHOOK_REGISTER_URL(tgToken);
                    setTgWebhookUrl(url);
                    setTgStep('done');
                  }}
                >
                  Далее
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Токен можно скопировать у @BotFather → выбери бота → API Token</p>
            </div>
          )}

          {tgStep === 'done' && (
            <div className="mt-5 border-t border-border pt-5 space-y-4">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-accent/10 text-accent text-sm">
                <Icon name="Info" size={16} className="shrink-0 mt-0.5" />
                <span>Нажми кнопку ниже — откроется вкладка браузера, увидишь <b>{"\"ok\":true"}</b> — значит готово!</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Шаг 2 — зарегистрировать webhook:</p>
                <a
                  href={tgWebhookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#229ED9] text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-[#1a8cbf] transition-colors"
                >
                  <Icon name="ExternalLink" size={15} /> Открыть и зарегистрировать
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold">Шаг 3 — активировать уведомления:</p>
                <p className="text-sm text-muted-foreground">
                  Открой своего бота в Telegram и напиши команду:
                </p>
                <code className="block bg-muted px-4 py-2.5 rounded-xl text-sm font-mono">
                  /start {key}
                </code>
                <p className="text-xs text-muted-foreground">После этого ты будешь получать уведомление в Telegram при каждом новом бронировании.</p>
              </div>

              <Button variant="outline" size="sm" className="rounded-full" onClick={() => { setTgStep('idle'); setTgToken(''); }}>
                Сбросить
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Всего броней', value: bookings.length, icon: 'Ticket', color: 'text-primary' },
            { label: 'Активных', value: bookings.filter(b => b.status === 'active').length, icon: 'CheckCircle2', color: 'text-accent' },
            { label: 'Уникальных номеров', value: new Set(bookings.map(b => b.phone)).size, icon: 'Users', color: 'text-primary' },
            { label: 'Сегодня', value: bookings.filter(b => b.created_at.startsWith(new Date().toISOString().slice(0,10))).length, icon: 'CalendarDays', color: 'text-accent' },
          ].map((s) => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-5">
              <div className={`${s.color} mb-2`}><Icon name={s.icon} size={22} /></div>
              <div className="font-display font-bold text-3xl">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          <div className="flex items-center justify-between p-5 md:px-7 border-b border-border gap-4">
            <h2 className="font-display font-bold text-lg">Все бронирования</h2>
            <div className="relative w-64">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск..."
                className="rounded-xl h-10 pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Icon name="Inbox" size={40} className="mx-auto mb-3 opacity-30" />
              <p>Бронирований пока нет</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    {['Код билета', 'Пассажир', 'Телефон', 'Формат', 'Дата поездки', 'Статус', 'Забронировано'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((b, i) => (
                    <tr key={b.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                      <td className="px-5 py-4 font-display font-bold text-primary whitespace-nowrap">{b.ticket_code}</td>
                      <td className="px-5 py-4 font-medium whitespace-nowrap">{b.passenger_name}</td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap">{b.phone}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{b.format}</span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        {new Date(b.trip_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${b.status === 'active' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                          {b.status === 'active' ? 'Активна' : b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(b.created_at).toLocaleString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;