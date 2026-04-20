import { Megaphone, Users, Lightbulb, CalendarDays, HandHeart, ShoppingBag, AlertTriangle, Inbox, LayoutGrid } from 'lucide-react';

export const CATEGORY_CONFIG = {
  'Avisos oficiales': { Icon: Megaphone,    color: '#DD686D' },
  'Reuniones':        { Icon: Users,         color: '#68A7DD' },
  'Sugerencias':      { Icon: Lightbulb,     color: '#68DD9E' },
  'Eventos':          { Icon: CalendarDays,  color: '#DDC068' },
  'Favores':          { Icon: HandHeart,     color: '#68DD9E' },
  'Mercadillo':       { Icon: ShoppingBag,   color: '#F97316' },
  'Incidencias':      { Icon: AlertTriangle, color: '#A868DD' },
  'Cajón desastre':   { Icon: Inbox,         color: '#DD6899' },
};

export const DEFAULT_CONFIG = { Icon: LayoutGrid, color: '#6B7280' };
