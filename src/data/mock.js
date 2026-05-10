// Данные для разработки. Потом заменятся на вызовы к catalog-service.

export const CATEGORIES = [
  { id: 1, slug: 'led',      name: 'LED',      color: '#3B82F6', description: 'Энергосберегающие лампы нового поколения' },
  { id: 2, slug: 'filament', name: 'Filament',  color: '#F59E0B', description: 'Ретро-лампы с нитью накаливания' },
  { id: 3, slug: 'smart',    name: 'Smart',     color: '#10B981', description: 'Умные лампы с Wi-Fi управлением' },
  { id: 4, slug: 'halogen',  name: 'Halogen',   color: '#EF4444', description: 'Классические галогенные лампы' },
]

export const PRODUCTS = [
  {
    id: 1,
    sku: 'LX-LED-E27-9W',
    category: { id: 1, slug: 'led', name: 'LED' },
    name: 'Лампа светодиодная груша 9 Вт E27',
    description:
      'Энергосберегающая LED лампа с цоколем E27. Мощность 9 Вт заменяет лампу накаливания 75 Вт. ' +
      'Тёплый белый свет 4000K обеспечивает комфортное освещение для жилых помещений. ' +
      'Ресурс работы — 25 000 часов.',
    price: 89,
    old_price: null,
    stock_quantity: 150,
    status: 'active',
    primary_image: '/images/led-e27-9w.jpg',
    images: [
      { id: 1, url: '/images/led-e27-9w.jpg', alt_text: 'LED лампа E27', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage',    attr_value: '9',     unit: 'Вт' },
      { attr_key: 'socket',     attr_value: 'E27',   unit: null },
      { attr_key: 'lumens',     attr_value: '806',   unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '4000',  unit: 'K' },
      { attr_key: 'lifespan',   attr_value: '25000', unit: 'ч' },
    ],
  },
  {
    id: 2,
    sku: 'LX-LED-E14-7W',
    category: { id: 1, slug: 'led', name: 'LED' },
    name: 'Лампа светодиодная свеча 7 Вт E14',
    description:
      'Компактная LED лампа формы свечи с цоколем E14. Идеальна для люстр, бра и настольных ламп. ' +
      'Потребляет на 90% меньше энергии по сравнению с лампами накаливания той же яркости.',
    price: 79,
    old_price: 99,
    stock_quantity: 200,
    status: 'active',
    primary_image: '/images/led-e14-7w.jpg',
    images: [
      { id: 2, url: '/images/led-e14-7w.jpg', alt_text: 'LED свеча E14', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage',    attr_value: '7',     unit: 'Вт' },
      { attr_key: 'socket',     attr_value: 'E14',   unit: null },
      { attr_key: 'lumens',     attr_value: '630',   unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '2700',  unit: 'K' },
      { attr_key: 'lifespan',   attr_value: '25000', unit: 'ч' },
    ],
  },
  {
    id: 3,
    sku: 'LX-LED-GU10-5W',
    category: { id: 1, slug: 'led', name: 'LED' },
    name: 'Лампа светодиодная рефлектор 5 Вт GU10',
    description:
      'Направленная LED лампа с цоколем GU10 для точечных светильников и спотов. ' +
      'Угол рассеивания 36°. Подходит для акцентного освещения в кухнях, магазинах и офисах.',
    price: 119,
    old_price: null,
    stock_quantity: 80,
    status: 'active',
    primary_image: '/images/led-gu10-5w.jpg',
    images: [
      { id: 3, url: '/images/led-gu10-5w.jpg', alt_text: 'LED GU10', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage',    attr_value: '5',    unit: 'Вт' },
      { attr_key: 'socket',     attr_value: 'GU10', unit: null },
      { attr_key: 'lumens',     attr_value: '400',  unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '3000', unit: 'K' },
      { attr_key: 'angle',      attr_value: '36',   unit: '°' },
    ],
  },
  {
    id: 4,
    sku: 'LX-FIL-E27-4W',
    category: { id: 2, slug: 'filament', name: 'Filament' },
    name: 'Лампа филаментная 4 Вт E27',
    description:
      'Ретро-лампа с видимой нитью накаливания в колбе шар. Создаёт тёплое уютное свечение 2200K. ' +
      'Незаменима для создания атмосферного освещения в ресторанах, кафе и жилых пространствах.',
    price: 299,
    old_price: null,
    stock_quantity: 50,
    status: 'active',
    primary_image: '/images/fil-e27-4w.jpg',
    images: [
      { id: 4, url: '/images/fil-e27-4w.jpg', alt_text: 'Филаментная лампа', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage',    attr_value: '4',    unit: 'Вт' },
      { attr_key: 'socket',     attr_value: 'E27',  unit: null },
      { attr_key: 'lumens',     attr_value: '300',  unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '2200', unit: 'K' },
      { attr_key: 'lifespan',   attr_value: '15000',unit: 'ч' },
    ],
  },
  {
    id: 5,
    sku: 'LX-FIL-E27-6W',
    category: { id: 2, slug: 'filament', name: 'Filament' },
    name: 'Лампа филаментная 6 Вт E27',
    description:
      'Филаментная лампа повышенной яркости в форме вытянутого эллипса (ST64). ' +
      'Декоративная нить Edison создаёт атмосферное освещение. Диммируется большинством диммеров.',
    price: 349,
    old_price: 399,
    stock_quantity: 35,
    status: 'active',
    primary_image: '/images/fil-e27-6w.jpg',
    images: [
      { id: 5, url: '/images/fil-e27-6w.jpg', alt_text: 'Лампа Эдисона', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage',    attr_value: '6',    unit: 'Вт' },
      { attr_key: 'socket',     attr_value: 'E27',  unit: null },
      { attr_key: 'lumens',     attr_value: '500',  unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '2200', unit: 'K' },
      { attr_key: 'dimmable',   attr_value: 'Да',   unit: null },
    ],
  },
  {
    id: 6,
    sku: 'LX-SMT-E27-10W',
    category: { id: 3, slug: 'smart', name: 'Smart' },
    name: 'Умная лампа Smart 10 Вт E27',
    description:
      'Wi-Fi лампа с управлением через смартфон или голосовой ассистент. ' +
      'Поддерживает 16 миллионов цветов, регулировку яркости и тёплой/холодной температуры. ' +
      'Совместима с Яндекс Алиса, Google Home, Amazon Alexa. Не требует хаба.',
    price: 890,
    old_price: null,
    stock_quantity: 30,
    status: 'active',
    primary_image: '/images/smt-e27-10w.jpg',
    images: [
      { id: 6, url: '/images/smt-e27-10w.jpg', alt_text: 'Smart лампа E27', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage',    attr_value: '10',         unit: 'Вт' },
      { attr_key: 'socket',     attr_value: 'E27',        unit: null },
      { attr_key: 'lumens',     attr_value: '900',        unit: 'лм' },
      { attr_key: 'colors',     attr_value: '16 000 000', unit: null },
      { attr_key: 'protocol',   attr_value: 'Wi-Fi 2.4G', unit: null },
    ],
  },
  {
    id: 7,
    sku: 'LX-SMT-E14-9W',
    category: { id: 3, slug: 'smart', name: 'Smart' },
    name: 'Умная лампа Smart 9 Вт E14',
    description:
      'Компактная Smart-лампа с цоколем E14 для малых светильников. ' +
      'Полный набор функций: цвет, яркость, расписания, сценарии. ' +
      'Совместима с Яндекс Алиса и Google Home.',
    price: 790,
    old_price: null,
    stock_quantity: 25,
    status: 'active',
    primary_image: '/images/smt-e14-9w.jpg',
    images: [
      { id: 7, url: '/images/smt-e14-9w.jpg', alt_text: 'Smart лампа E14', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage',  attr_value: '9',         unit: 'Вт' },
      { attr_key: 'socket',   attr_value: 'E14',       unit: null },
      { attr_key: 'lumens',   attr_value: '800',       unit: 'лм' },
      { attr_key: 'protocol', attr_value: 'Wi-Fi 2.4G',unit: null },
    ],
  },
  {
    id: 8,
    sku: 'LX-HAL-GU10-50W',
    category: { id: 4, slug: 'halogen', name: 'Halogen' },
    name: 'Лампа галогенная рефлектор 50 Вт GU10',
    description:
      'Классическая галогенная лампа с цоколем GU10. ' +
      'Идеальная цветопередача (CRI 100), мгновенный розжиг. ' +
      'Подходит для светильников, не поддерживающих LED.',
    price: 49,
    old_price: null,
    stock_quantity: 0,
    status: 'out_of_stock',
    primary_image: '/images/hal-gu10-50w.jpg',
    images: [
      { id: 8, url: '/images/hal-gu10-50w.jpg', alt_text: 'Галогенная лампа GU10', is_primary: true },
    ],
    attributes: [
      { attr_key: 'wattage', attr_value: '50',  unit: 'Вт' },
      { attr_key: 'socket',  attr_value: 'GU10',unit: null },
      { attr_key: 'lumens',  attr_value: '700', unit: 'лм' },
      { attr_key: 'cri',     attr_value: '100', unit: null },
    ],
  },
  {
    id: 9,
    sku: 'LX-LED-E27-12W',
    category: { id: 1, slug: 'led', name: 'LED' },
    name: 'Лампа светодиодная груша 12 Вт E27',
    description: 'Мощная LED лампа для больших помещений. 1100 лм, нейтральный белый свет 4000K.',
    price: 129, old_price: 159, stock_quantity: 90, status: 'active',
    primary_image: '/images/led-e27-12w.jpg',
    images: [{ id: 9, url: '/images/led-e27-12w.jpg', alt_text: 'LED 12W E27', is_primary: true }],
    attributes: [
      { attr_key: 'wattage', attr_value: '12', unit: 'Вт' },
      { attr_key: 'socket', attr_value: 'E27', unit: null },
      { attr_key: 'lumens', attr_value: '1100', unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '4000', unit: 'K' },
      { attr_key: 'lifespan', attr_value: '30000', unit: 'ч' },
    ],
  },
  {
    id: 10,
    sku: 'LX-FIL-E14-4W',
    category: { id: 2, slug: 'filament', name: 'Filament' },
    name: 'Лампа филаментная свеча 4 Вт E14',
    description: 'Филаментная лампа форм-фактора свеча с цоколем E14. Идеальна для хрустальных люстр.',
    price: 249, old_price: null, stock_quantity: 40, status: 'active',
    primary_image: '/images/fil-e14-4w.jpg',
    images: [{ id: 10, url: '/images/fil-e14-4w.jpg', alt_text: 'Filament E14', is_primary: true }],
    attributes: [
      { attr_key: 'wattage', attr_value: '4', unit: 'Вт' },
      { attr_key: 'socket', attr_value: 'E14', unit: null },
      { attr_key: 'lumens', attr_value: '280', unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '2200', unit: 'K' },
      { attr_key: 'lifespan', attr_value: '15000', unit: 'ч' },
    ],
  },
  {
    id: 11,
    sku: 'LX-SMT-GU10-6W',
    category: { id: 3, slug: 'smart', name: 'Smart' },
    name: 'Умная лампа GU10 6 Вт RGB',
    description: 'Умная лампа с цоколем GU10, поддержкой RGB и управлением через приложение. 16 млн цветов.',
    price: 590, old_price: 690, stock_quantity: 20, status: 'active',
    primary_image: '/images/smt-gu10-6w.jpg',
    images: [{ id: 11, url: '/images/smt-gu10-6w.jpg', alt_text: 'Smart GU10', is_primary: true }],
    attributes: [
      { attr_key: 'wattage', attr_value: '6', unit: 'Вт' },
      { attr_key: 'socket', attr_value: 'GU10', unit: null },
      { attr_key: 'lumens', attr_value: '500', unit: 'лм' },
      { attr_key: 'color_temp', attr_value: 'RGB', unit: null },
      { attr_key: 'lifespan', attr_value: '25000', unit: 'ч' },
    ],
  },
  {
    id: 12,
    sku: 'LX-HAL-E27-42W',
    category: { id: 4, slug: 'halogen', name: 'Halogen' },
    name: 'Лампа галогенная груша 42 Вт E27',
    description: 'Классическая галогенная лампа с улучшенной цветопередачей. Замена 60 Вт лампы накаливания.',
    price: 65, old_price: null, stock_quantity: 0, status: 'active',
    primary_image: '/images/hal-e27-42w.jpg',
    images: [{ id: 12, url: '/images/hal-e27-42w.jpg', alt_text: 'Halogen E27', is_primary: true }],
    attributes: [
      { attr_key: 'wattage', attr_value: '42', unit: 'Вт' },
      { attr_key: 'socket', attr_value: 'E27', unit: null },
      { attr_key: 'lumens', attr_value: '630', unit: 'лм' },
      { attr_key: 'color_temp', attr_value: '2900', unit: 'K' },
      { attr_key: 'lifespan', attr_value: '2000', unit: 'ч' },
    ],
  },
]

// Словарь названий атрибутов для красивого отображения
export const ATTR_LABELS = {
  wattage:    'Мощность',
  socket:     'Цоколь',
  lumens:     'Световой поток',
  color_temp: 'Цветовая температура',
  lifespan:   'Срок службы',
  angle:      'Угол рассеивания',
  dimmable:   'Диммирование',
  colors:     'Цветов RGB',
  protocol:   'Протокол',
  cri:        'Индекс цветопередачи',
}

// Стоимость доставки по типу
export const DELIVERY_OPTIONS = [
  { value: 'courier', label: 'Курьерская доставка',  price: 300,  description: 'Доставка в течение 1–3 дней' },
  { value: 'cdek',    label: 'Доставка СДЭК',        price: 250,  description: 'Доставка в течение 2–5 дней' },
  { value: 'pickup',  label: 'Самовывоз',             price: 0,    description: 'Готово к выдаче в течение 2 часов' },
]

export const PAYMENT_OPTIONS = [
  { value: 'card_online',       label: 'Картой онлайн',         icon: '💳' },
  { value: 'cash_on_delivery',  label: 'Наличными при получении', icon: '💵' },
  { value: 'card_on_delivery',  label: 'Картой при получении',   icon: '🏧' },
]

// Промокоды для тестирования
export const PROMO_CODES = {
  SALE20:  { type: 'percent', value: 20, min: 500,  label: '−20%' },
  WELCOME: { type: 'fixed',   value: 150, min: 0,   label: '−150 ₽' },
  SMART15: { type: 'percent', value: 15, min: 1000, label: '−15%' },
}
