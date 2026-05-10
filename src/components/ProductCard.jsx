import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addItem, selectCartItems } from '../store/cartSlice'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, animDelay = 0 }) {
  const dispatch  = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const inCart    = cartItems.some(i => i.sku === product.sku)
  const outOfStock = product.status === 'out_of_stock' || product.stock_quantity === 0

  const handleAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!outOfStock) dispatch(addItem({ product, qty: 1 }))
  }

  return (
    <Link to={`/products/${product.sku}`} className={styles.card}
      style={{ animationDelay: `${animDelay}ms` }}>
      <div className={styles.imageWrap}>
        <img src={product.primary_image} alt={product.name}
          className={styles.image} loading="lazy"/>
        {outOfStock && <div className={styles.outOfStock}>Нет в наличии</div>}
        {product.old_price && !outOfStock && <div className={styles.saleBadge}>Скидка</div>}
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category.name}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.footer}>
          <div className={styles.priceBlock}>
            <span className={styles.price}>{product.price} ₽</span>
            {product.old_price && <span className={styles.oldPrice}>{product.old_price} ₽</span>}
          </div>
          <button
            className={`${styles.addBtn} ${inCart ? styles.inCart : ''} ${outOfStock ? styles.disabled : ''}`}
            onClick={handleAdd} disabled={outOfStock}
            aria-label={inCart ? 'Уже в корзине' : 'Добавить в корзину'}>
            {inCart ? <CheckIcon /> : outOfStock ? '—' : <PlusIcon />}
          </button>
        </div>
      </div>
    </Link>
  )
}

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  )
}
