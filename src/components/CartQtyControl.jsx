import { useDispatch, useSelector } from 'react-redux'
import { addItem, updateItem, selectCartItems } from '../store/cartSlice'
import styles from './CartQtyControl.module.css'

/**
 * Универсальный контрол добавления в корзину.
 * - Если товара нет в корзине → кнопка «В корзину»
 * - Если есть → «− N +»; при N=0 возвращается к «В корзину»
 *
 * Пропсы:
 *   product       – объект товара из Redux/mock
 *   outOfStock?   – boolean
 *   size?         – 'sm' | 'md' (по умолчанию 'md')
 *   onClick?      – перехватчик клика (e.stopPropagation внутри)
 */
export default function CartQtyControl({ product, outOfStock = false, size = 'md', onClick }) {
  const dispatch  = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const cartItem  = cartItems.find(i => i.sku === product.sku)
  const qty       = cartItem?.quantity ?? 0

  const stop = (e) => { e.preventDefault(); e.stopPropagation(); onClick?.() }

  if (outOfStock) {
    return (
      <button className={`${styles.btnAdd} ${styles[size]} ${styles.disabled}`} disabled>
        Нет в наличии
      </button>
    )
  }

  if (!qty) {
    return (
      <button
        className={`${styles.btnAdd} ${styles[size]}`}
        onClick={(e) => { stop(e); dispatch(addItem({ product, qty: 1 })) }}
      >
        В корзину
      </button>
    )
  }

  return (
    <div className={`${styles.stepper} ${styles[size]}`} onClick={stop}>
      <button
        className={styles.stepBtn}
        onClick={() => dispatch(updateItem({ sku: product.sku, qty: qty - 1 }))}
        aria-label="Убрать из корзины"
      >−</button>
      <span className={styles.stepVal}>{qty}</span>
      <button
        className={styles.stepBtn}
        onClick={() => dispatch(addItem({ product, qty: 1 }))}
        aria-label="Добавить ещё"
        disabled={qty >= (product.stock_quantity ?? 999)}
      >+</button>
    </div>
  )
}
