# SmartLight — Frontend (React)

Пользовательская часть интернет-магазина SmartLight на **React 18 + React Router 6 + Vite**.

## Страницы

| Маршрут | Страница | Описание |
|---|---|---|
| `/` | Каталог | Список товаров с фильтрами по категориям |
| `/products/:sku` | Карточка товара | Детали, характеристики, атрибуты, похожие товары |
| `/cart` | Корзина | Управление позициями, промокоды |
| `/checkout` | Оформление | Форма доставки и оплаты |
| `/order-success` | Успех | Подтверждение заказа с номером и статусом |

## Запуск

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production-сборка
npm run preview    # превью production-сборки
```

## Структура

```
src/
├── components/
│   └── Layout/      Header, Footer, Layout-обёртка
│   └── ProductCard  Карточка товара в сетке
├── context/
│   └── CartContext  Глобальное состояние корзины (useReducer)
├── data/
│   └── mock.js      Mock-данные (товары, категории, промокоды)
├── pages/
│   ├── CatalogPage
│   ├── ProductPage
│   ├── CartPage
│   ├── CheckoutPage
│   └── OrderSuccessPage
├── index.css        Глобальные стили, дизайн-токены, утилиты
└── main.jsx         Точка входа, роутер
```

## Промокоды для тестирования

| Код | Скидка | Условие |
|---|---|---|
| `SALE20` | 20% | от 500 ₽ |
| `WELCOME` | 150 ₽ | без ограничений |
| `SMART15` | 15% | от 1000 ₽ |
