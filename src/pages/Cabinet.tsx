import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import func2url from '../../backend/func2url.json';

const API = func2url.bookings;

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

const Cabinet = () => {
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTicket, setActiveTicket] = useState<Booking | null>(null);

  const search = async () => {
    if (!phone.trim()) return;
    setLoading(true);
    setError('');
    setSearched(false);
    const res = await fetch(API, {
      headers: { 'X-User-Phone': phone.trim() },
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError('Ошибка загрузки. Попробуйте ещё раз.');
      return;
    }
    setBookings(data.bookings || []);
    setSearched(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container flex items-center justify-between h-16">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 font-display font-extrabold text-lg">
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
              <Icon name="Anchor" size={18} />
            </span>
            Речгортранс
          </button>
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/'} className="rounded-full gap-1.5">
            <Icon name="ArrowLeft" size={15} /> На главную
          </Button>
        </div>
      </header>

      <main className="container py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display font-extrabold text-3xl md:text-4xl tracking-tight">Мои билеты</h1>
          <p className="mt-2 text-muted-foreground">Введи свой номер телефона, чтобы найти все свои бронирования.</p>
        </div>

        <div className="flex gap-3 mb-8">
          <Input
            placeholder="+7 900 000 00 00"
            className="rounded-xl h-12"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && search()}
          />
          <Button className="rounded-xl h-12 px-6 font-semibold shrink-0" onClick={search} disabled={loading || !phone.trim()}>
            {loading ? <Icon name="Loader2" size={18} className="animate-spin" /> : 'Найти'}
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-destructive text-sm mb-4">
            <Icon name="AlertCircle" size={16} /> {error}
          </div>
        )}

        {searched && bookings.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Icon name="Ticket" size={40} className="mx-auto mb-3 opacity-20" />
            <p className="font-medium">Билетов не найдено</p>
            <p className="text-sm mt-1">Проверь номер телефона или оформи новую бронь на главной</p>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => window.location.href = '/'}>
              Забронировать
            </Button>
          </div>
        )}

        {bookings.length > 0 && !activeTicket && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground font-medium">{bookings.length} {bookings.length === 1 ? 'билет' : bookings.length < 5 ? 'билета' : 'билетов'}</p>
            {bookings.map((b) => (
              <button
                key={b.id}
                onClick={() => setActiveTicket(b)}
                className="w-full text-left bg-card rounded-2xl border border-border p-5 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-display font-bold text-primary text-sm tracking-widest">{b.ticket_code}</span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${b.status === 'active' ? 'bg-accent/10 text-accent' : 'bg-muted text-muted-foreground'}`}>
                    {b.status === 'active' ? 'Активен' : b.status}
                  </span>
                </div>
                <div className="font-semibold">{b.format}</div>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Icon name="Calendar" size={14} />
                    {new Date(b.trip_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="User" size={14} />
                    {b.passenger_name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Detail view */}
        {activeTicket && (
          <div className="animate-fade-up">
            <button
              onClick={() => setActiveTicket(null)}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors"
            >
              <Icon name="ArrowLeft" size={15} /> Все билеты
            </button>

            <div className="bg-card rounded-3xl border border-border p-7 shadow-sm">
              <div className="flex flex-col items-center mb-7">
                <div className="w-40 h-40 bg-foreground rounded-2xl flex items-center justify-center">
                  <svg width="150" height="150" viewBox="0 0 160 160">
                    <rect x="8" y="8" width="44" height="44" rx="4" fill="none" stroke="white" strokeWidth="6"/>
                    <rect x="20" y="20" width="20" height="20" rx="2" fill="white"/>
                    <rect x="108" y="8" width="44" height="44" rx="4" fill="none" stroke="white" strokeWidth="6"/>
                    <rect x="120" y="20" width="20" height="20" rx="2" fill="white"/>
                    <rect x="8" y="108" width="44" height="44" rx="4" fill="none" stroke="white" strokeWidth="6"/>
                    <rect x="20" y="120" width="20" height="20" rx="2" fill="white"/>
                    <rect x="68" y="68" width="8" height="8" rx="1" fill="white"/>
                    <rect x="84" y="68" width="8" height="8" rx="1" fill="white"/>
                    <rect x="100" y="68" width="8" height="8" rx="1" fill="white"/>
                    <rect x="68" y="84" width="8" height="8" rx="1" fill="white"/>
                    <rect x="100" y="84" width="8" height="8" rx="1" fill="white"/>
                    <rect x="68" y="100" width="8" height="8" rx="1" fill="white"/>
                    <rect x="84" y="100" width="8" height="8" rx="1" fill="white"/>
                    <rect x="116" y="84" width="8" height="8" rx="1" fill="white"/>
                    <rect x="116" y="100" width="8" height="8" rx="1" fill="white"/>
                    <rect x="132" y="68" width="8" height="8" rx="1" fill="white"/>
                  </svg>
                </div>
                <span className="mt-3 font-display font-bold text-sm tracking-widest text-muted-foreground">{activeTicket.ticket_code}</span>
              </div>

              <div className="space-y-3 text-sm">
                {[
                  { icon: 'Ticket', label: 'Формат', value: activeTicket.format },
                  { icon: 'Calendar', label: 'Дата', value: new Date(activeTicket.trip_date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) },
                  { icon: 'User', label: 'Пассажир', value: activeTicket.passenger_name },
                  { icon: 'Phone', label: 'Телефон', value: activeTicket.phone },
                  { icon: 'MapPin', label: 'Место', value: 'р.п Краснозерское, Главный причал №13' },
                ].map((r) => (
                  <div key={r.label} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary/10 text-primary shrink-0">
                      <Icon name={r.icon} size={16} />
                    </span>
                    <span className="text-muted-foreground w-24 shrink-0">{r.label}</span>
                    <span className="font-semibold">{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-4 rounded-2xl bg-accent/10 text-accent text-sm font-medium flex items-start gap-2">
                <Icon name="Info" size={18} className="shrink-0 mt-0.5" />
                Приходи за 10 минут до отправления. Сезон — только июль.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cabinet;
