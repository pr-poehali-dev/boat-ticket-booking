import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const HERO_IMG =
  'https://cdn.poehali.dev/projects/a5dd474c-e0ba-4701-8436-3b7dfc217e42/files/89539e0d-5977-4fd1-83bc-f386f0e81207.jpg';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'tickets', label: 'Билеты' },
  { id: 'routes', label: 'Маршруты' },
  { id: 'about', label: 'О нас' },
  { id: 'contacts', label: 'Контакты' },
];

const TICKETS = [
  {
    icon: 'Sailboat',
    name: 'Катание на надувной лодке',
    desc: 'Спокойная прогулка по реке на комфортной надувной лодке с капитаном.',
    price: '500 ₽',
    unit: 'за человека',
    tag: 'Хит',
  },
  {
    icon: 'Waves',
    name: 'Надувная плюшка',
    desc: 'Драйв и брызги! Катание на буксируемом надувном кольце за катером.',
    price: '300 ₽',
    unit: '30 минут',
    tag: 'Экстрим',
  },
  {
    icon: 'Ship',
    name: 'Катамаран',
    desc: 'Спокойная прогулка по реке на катамаране.',
    price: '600 ₽',
    unit: 'за человека',
    tag: 'Уют',
  },
  {
    icon: 'Users',
    name: 'Семейный пакет',
    desc: 'Лодка + плюшка для всей семьи. До 4 человек, выгодная цена.',
    price: '1 000 ₽',
    unit: 'до 4 чел.',
    tag: 'Выгодно',
  },
];

const ROUTES = [
  { name: 'Речная заводь', time: '~45 мин', dist: '1 400 м', icon: 'Waves' },
  { name: 'До моста', time: '~1 ч 30 мин', dist: '3 600 м', icon: 'Bridge' },
  { name: 'До бассейна', time: '~1 ч 30 мин', dist: '6 км', icon: 'Droplets' },
];

interface BookingData {
  format: string;
  date: string;
  name: string;
  phone: string;
  email: string;
}

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [confirmed, setConfirmed] = useState<BookingData | null>(null);
  const [form, setForm] = useState({ date: '', name: '', phone: '', email: '' });

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const chooseFormat = (name: string) => {
    setSelected(name);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBooking = () => {
    if (!selected || !form.date || !form.name || !form.phone) return;
    setConfirmed({ format: selected, ...form });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ticketCode = confirmed
    ? `RGT-${confirmed.date.replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`
    : '';

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 animate-fade-up">
            <span className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 text-accent mb-4">
              <Icon name="CheckCircle2" size={36} />
            </span>
            <h1 className="font-display font-extrabold text-3xl tracking-tight">Бронь подтверждена!</h1>
            <p className="mt-2 text-muted-foreground">Сохрани QR-код — предъяви его на причале</p>
          </div>

          <div className="bg-card rounded-3xl border border-border p-7 shadow-sm animate-fade-up">
            {/* QR placeholder */}
            <div className="flex flex-col items-center mb-7">
              <div className="w-44 h-44 bg-foreground rounded-2xl flex items-center justify-center relative overflow-hidden">
                {/* Imitated QR pattern */}
                <svg width="160" height="160" viewBox="0 0 160 160" className="fill-background">
                  {/* corners */}
                  <rect x="8" y="8" width="44" height="44" rx="4" className="fill-background stroke-background stroke-2" fill="none" stroke="currentColor" strokeWidth="0"/>
                  <rect x="8" y="8" width="44" height="44" rx="4" fill="none" stroke="white" strokeWidth="6"/>
                  <rect x="20" y="20" width="20" height="20" rx="2" fill="white"/>
                  <rect x="108" y="8" width="44" height="44" rx="4" fill="none" stroke="white" strokeWidth="6"/>
                  <rect x="120" y="20" width="20" height="20" rx="2" fill="white"/>
                  <rect x="8" y="108" width="44" height="44" rx="4" fill="none" stroke="white" strokeWidth="6"/>
                  <rect x="20" y="120" width="20" height="20" rx="2" fill="white"/>
                  {/* dots */}
                  {[68,80,92,104].map(x => [68,80,92,104].map(y => (
                    Math.random() > 0.45 ? <rect key={`${x}-${y}`} x={x} y={y} width="8" height="8" rx="1" fill="white"/> : null
                  )))}
                  <rect x="68" y="68" width="8" height="8" rx="1" fill="white"/>
                  <rect x="80" y="80" width="8" height="8" rx="1" fill="white"/>
                  <rect x="92" y="68" width="8" height="8" rx="1" fill="white"/>
                  <rect x="68" y="92" width="8" height="8" rx="1" fill="white"/>
                  <rect x="104" y="80" width="8" height="8" rx="1" fill="white"/>
                  <rect x="80" y="104" width="8" height="8" rx="1" fill="white"/>
                  <rect x="92" y="92" width="8" height="8" rx="1" fill="white"/>
                </svg>
              </div>
              <span className="mt-3 font-display font-bold text-sm tracking-widest text-muted-foreground">{ticketCode}</span>
            </div>

            <div className="space-y-3 text-sm">
              {[
                { icon: 'Ticket', label: 'Формат', value: confirmed.format },
                { icon: 'Calendar', label: 'Дата', value: new Date(confirmed.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: 'User', label: 'Пассажир', value: confirmed.name },
                { icon: 'Phone', label: 'Телефон', value: confirmed.phone },
                { icon: 'MapPin', label: 'Место отправления', value: 'р.п Краснозерское, Главный причал №13' },
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

            <div className="mt-6 p-4 rounded-2xl bg-accent/10 text-accent text-sm font-medium flex items-start gap-2">
              <Icon name="Info" size={18} className="shrink-0 mt-0.5" />
              Приходи за 10 минут до отправления. Работаем только в июле.
            </div>
          </div>

          <button
            onClick={() => { setConfirmed(null); setSelected(''); setForm({ date: '', name: '', phone: '', email: '' }); }}
            className="mt-6 w-full text-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            ← Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => scrollTo('home')}
            className="flex items-center gap-2 font-display font-extrabold text-lg md:text-xl"
          >
            <span className="grid place-items-center w-9 h-9 rounded-xl bg-primary text-primary-foreground">
              <Icon name="Anchor" size={18} />
            </span>
            Речгортранс
          </button>

          <nav className="hidden md:flex items-center gap-7">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <Button onClick={() => scrollTo('tickets')} className="hidden md:flex rounded-full font-semibold">
            Купить билет
          </Button>

          <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)}>
            <Icon name={menuOpen ? 'X' : 'Menu'} size={26} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background animate-fade-up">
            <div className="container flex flex-col py-4 gap-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => scrollTo(n.id)}
                  className="text-left py-2.5 font-medium text-muted-foreground hover:text-primary"
                >
                  {n.label}
                </button>
              ))}
              <Button onClick={() => scrollTo('tickets')} className="mt-2 rounded-full">
                Купить билет
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative pt-28 md:pt-40 pb-20 md:pb-28 overflow-hidden">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent font-semibold text-sm mb-6">
              <Icon name="Sparkles" size={16} /> Сезон катаний открыт
            </span>
            <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05] tracking-tight">
              Лови волну на <span className="text-primary">реке</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-md">
              Онлайн-билеты на катание на лодке и надувной плюшке. Выбери маршрут,
              дату и время — остальное мы берём на себя.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => scrollTo('tickets')}
                className="rounded-full font-semibold text-base h-13 px-7 hover-scale"
              >
                Выбрать билет
                <Icon name="ArrowRight" size={18} className="ml-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollTo('routes')}
                className="rounded-full font-semibold text-base h-13 px-7"
              >
                Маршруты
              </Button>
            </div>

            <div className="mt-10 flex gap-8">
              {[
                { n: '10 лет', l: 'на воде' },
                { n: '50 000+', l: 'довольных гостей' },
                { n: '4.9', l: 'рейтинг' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display font-bold text-2xl text-primary">{s.n}</div>
                  <div className="text-sm text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative animate-float">
            <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full" />
            <img
              src={HERO_IMG}
              alt="Катание на лодке по реке"
              className="relative rounded-[2rem] shadow-2xl w-full object-cover aspect-square"
            />
          </div>
        </div>
      </section>

      {/* TICKETS */}
      <section id="tickets" className="py-20 md:py-28 bg-secondary/40">
        <div className="container">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              Билеты
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Выбери формат катания. Бронируй онлайн за пару минут.
            </p>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TICKETS.map((t) => {
              const active = selected === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => chooseFormat(t.name)}
                  className={`group text-left bg-card rounded-3xl p-7 border-2 transition-all hover:shadow-xl ${
                    active
                      ? 'border-primary shadow-xl ring-2 ring-primary/20'
                      : 'border-border hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className={`grid place-items-center w-14 h-14 rounded-2xl transition-colors ${
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                      }`}
                    >
                      <Icon name={t.icon} size={26} />
                    </span>
                    <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">
                      {t.tag}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-lg">{t.name}</h3>
                  <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{t.desc}</p>
                  <div className="mt-6">
                    <div className="font-display font-extrabold text-2xl">{t.price}</div>
                    <div className="text-xs text-muted-foreground">{t.unit}</div>
                  </div>
                  <div
                    className={`mt-5 flex items-center gap-1.5 text-sm font-semibold ${
                      active ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    <Icon name={active ? 'CheckCircle2' : 'Circle'} size={18} />
                    {active ? 'Выбрано' : 'Выбрать'}
                  </div>
                </button>
              );
            })}
          </div>
          {/* BOOKING FORM */}
          <div id="booking" className="mt-12 bg-card rounded-3xl p-7 md:p-9 border border-border shadow-sm scroll-mt-24">
            <h3 className="font-display font-bold text-xl mb-2 flex items-center gap-2">
              <Icon name="Ticket" size={22} className="text-primary" /> Бронирование
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              {selected
                ? `Выбранный формат: ${selected}. Заполните данные ниже.`
                : 'Выберите формат катания выше, затем заполните свои данные.'}
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Select value={selected} onValueChange={setSelected}>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder="Формат катания" />
                </SelectTrigger>
                <SelectContent>
                  {TICKETS.map((t) => (
                    <SelectItem key={t.name} value={t.name}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="relative">
                <Input
                  type="date"
                  className="rounded-xl h-12"
                  min="2026-07-01"
                  max="2026-07-31"
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">Только июль</span>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Input
                placeholder="Ваше имя *"
                className="rounded-xl h-12"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <Input
                placeholder="Телефон *"
                className="rounded-xl h-12"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <Input
                placeholder="Email"
                className="rounded-xl h-12"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div className="mt-5 flex items-center gap-4">
              <Button
                className="rounded-xl h-12 px-8 font-semibold disabled:opacity-50"
                disabled={!selected || !form.date || !form.name || !form.phone}
                onClick={handleBooking}
              >
                Забронировать
                <Icon name="ArrowRight" size={18} className="ml-1" />
              </Button>
              {(!selected || !form.date || !form.name || !form.phone) && (
                <span className="text-sm text-muted-foreground">Заполните обязательные поля *</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ROUTES */}
      <section id="routes" className="py-20 md:py-28">
        <div className="container">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              Маршруты
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Три живописных направления по реке на любой вкус.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {ROUTES.map((r) => (
              <div
                key={r.name}
                className="relative overflow-hidden rounded-3xl p-7 bg-primary text-primary-foreground hover-scale"
              >
                <Icon name={r.icon} size={32} className="mb-6" />
                <h3 className="font-display font-bold text-xl">{r.name}</h3>
                <div className="mt-5 flex gap-6 text-sm text-primary-foreground/80">
                  <span className="flex items-center gap-1.5">
                    <Icon name="Clock" size={16} /> {r.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Icon name="Route" size={16} /> {r.dist}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 md:py-28">
        <div className="container grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              О нас
            </h2>
            <p className="mt-6 text-muted-foreground text-lg leading-relaxed">
              «Речгортранс» — это 12 лет на воде и тысячи незабываемых прогулок.
              Современный флот, опытные капитаны и полное соблюдение правил
              безопасности. Мы делаем отдых на реке доступным и ярким.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-5">
              {[
                { icon: 'ShieldCheck', t: 'Безопасность', d: 'Спасжилеты и инструктаж' },
                { icon: 'BadgeCheck', t: 'Лицензия', d: 'Все разрешения в порядке' },
                { icon: 'Smile', t: 'Опытные гиды', d: 'Капитаны с многолетним стажем' },
                { icon: 'Zap', t: 'Онлайн', d: 'Билеты за пару минут' },
              ].map((f) => (
                <div key={f.t} className="flex gap-3">
                  <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-accent/10 text-accent">
                    <Icon name={f.icon} size={20} />
                  </span>
                  <div>
                    <div className="font-semibold">{f.t}</div>
                    <div className="text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full" />
            <img
              src={HERO_IMG}
              alt="Флот Речгортранс"
              className="relative rounded-[2rem] shadow-xl w-full object-cover aspect-[4/3]"
            />
          </div>
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" className="py-20 md:py-28 bg-primary text-primary-foreground">
        <div className="container">
          <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
            Контакты
          </h2>
          <p className="mt-4 text-primary-foreground/80 text-lg max-w-md">
            Приходи на причал или свяжись с нами — будем рады!
          </p>
          <div className="mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {[
              { icon: 'Phone', label: 'Телефон', t: '+7 983 705 1983' },
              { icon: 'Mail', label: 'Email', t: 'v69607972@gmail.com' },
              { icon: 'MapPin', label: 'Адрес', t: 'р.п Краснозерское, Главный причал №13' },
              { icon: 'Calendar', label: 'Сезон', t: 'Июль 2026' },
            ].map((c) => (
              <div key={c.label} className="bg-primary-foreground/10 rounded-2xl p-5">
                <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-foreground/10 mb-3">
                  <Icon name={c.icon} size={20} />
                </span>
                <div className="text-xs text-primary-foreground/60 mb-1">{c.label}</div>
                <div className="font-semibold leading-snug">{c.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-background border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 font-display font-bold text-foreground">
            <Icon name="Anchor" size={16} className="text-primary" /> Речгортранс
          </div>
          <span>© {new Date().getFullYear()} Речгортранс. Все права защищены.</span>
        </div>
      </footer>
    </div>
  );
};

export default Index;