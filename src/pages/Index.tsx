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
  { id: 'schedule', label: 'Расписание' },
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
  { name: 'Центральная набережная', time: '40 мин', dist: '8 км', icon: 'MapPin' },
  { name: 'Острова и заливы', time: '1 ч 10 мин', dist: '15 км', icon: 'TreePine' },
  { name: 'Закатный круиз', time: '1 ч', dist: '12 км', icon: 'Sunset' },
];

const SCHEDULE = [
  { time: '10:00', route: 'Центральная набережная', seats: 'Свободно' },
  { time: '12:30', route: 'Острова и заливы', seats: 'Свободно' },
  { time: '15:00', route: 'Центральная набережная', seats: 'Мало мест' },
  { time: '18:30', route: 'Закатный круиз', seats: 'Свободно' },
];

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<string>('');

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const chooseFormat = (name: string) => {
    setSelected(name);
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

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
            <div className="grid md:grid-cols-3 gap-4">
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
              <Input type="date" className="rounded-xl h-12" />
              <Select>
                <SelectTrigger className="rounded-xl h-12">
                  <SelectValue placeholder="Время" />
                </SelectTrigger>
                <SelectContent>
                  {SCHEDULE.map((s) => (
                    <SelectItem key={s.time} value={s.time}>
                      {s.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Input placeholder="Ваше имя" className="rounded-xl h-12" />
              <Input placeholder="Телефон" className="rounded-xl h-12" />
              <Input placeholder="Email" className="rounded-xl h-12" />
            </div>
            <Button className="mt-5 rounded-xl h-12 px-8 font-semibold">
              Забронировать
            </Button>
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

      {/* SCHEDULE */}
      <section id="schedule" className="py-20 md:py-28 bg-secondary/40">
        <div className="container">
          <div className="max-w-xl">
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              Расписание
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Отправления каждый день. Приходи за 15 минут до старта.
            </p>
          </div>

          <div className="mt-12 bg-card rounded-3xl border border-border overflow-hidden">
            {SCHEDULE.map((s, i) => (
              <div
                key={s.time}
                className={`flex items-center justify-between p-5 md:px-8 ${
                  i !== SCHEDULE.length - 1 ? 'border-b border-border' : ''
                }`}
              >
                <div className="flex items-center gap-5">
                  <span className="font-display font-bold text-xl text-primary w-16">{s.time}</span>
                  <span className="font-medium">{s.route}</span>
                </div>
                <span
                  className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    s.seats === 'Свободно'
                      ? 'bg-accent/10 text-accent'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {s.seats}
                </span>
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
        <div className="container grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl tracking-tight">
              Контакты
            </h2>
            <p className="mt-4 text-primary-foreground/80 text-lg max-w-md">
              Свяжись с нами или приходи на причал — будем рады прокатить!
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: 'Phone', t: '+7 (900) 123-45-67' },
                { icon: 'Mail', t: 'hello@rechgortrans.ru' },
                { icon: 'MapPin', t: 'Центральная набережная, причал №3' },
                { icon: 'Clock', t: 'Ежедневно 10:00 — 21:00' },
              ].map((c) => (
                <div key={c.t} className="flex items-center gap-3">
                  <span className="grid place-items-center w-10 h-10 rounded-xl bg-primary-foreground/10">
                    <Icon name={c.icon} size={20} />
                  </span>
                  <span className="font-medium">{c.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-primary-foreground text-foreground rounded-3xl p-7 md:p-8">
            <h3 className="font-display font-bold text-xl mb-5">Остались вопросы?</h3>
            <div className="space-y-4">
              <Input placeholder="Ваше имя" className="rounded-xl h-12" />
              <Input placeholder="Телефон или email" className="rounded-xl h-12" />
              <Input placeholder="Сообщение" className="rounded-xl h-12" />
              <Button className="w-full rounded-xl h-12 font-semibold">Отправить</Button>
            </div>
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