/** Форматирование числа как цены в рублях: 1234.5 → "1 234 ₽" */
export function formatPrice(value) {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return `${Math.round(num).toLocaleString('ru-RU')} ₽`
}

/** Русское склонение числительных: plural(3, 'товар','товара','товаров') → 'товара' */
export function plural(n, one, few, many) {
  if (n % 100 >= 11 && n % 100 <= 19) return many
  if (n % 10 === 1) return one
  if (n % 10 >= 2 && n % 10 <= 4) return few
  return many
}
