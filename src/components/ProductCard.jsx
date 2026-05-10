import { Link } from 'react-router-dom'
import CartQtyControl from './CartQtyControl'
import styles from './ProductCard.module.css'

export default function ProductCard({ product, animDelay = 0 }) {
  const outOfStock = product.status === 'out_of_stock' || product.stock_quantity === 0

  return (
    <Link to={`/products/${product.sku}`} className={styles.card}
      style={{ animationDelay: `${animDelay}ms` }}>
      <div className={styles.imageWrap}>
        <img src={product.primary_image} alt={product.name}
          className={styles.image} loading="lazy"
          onError={e => { e.target.onerror=null; e.target.src='/images/led-e27-9w.jpg' }}/>
        {outOfStock && <div className={styles.outOfStock}>Нет в наличии</div>}
        {product.old_price && !outOfStock && <div className={styles.saleBadge}>Скидка</div>}
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{product.category.name}</span>
        <h3 className={styles.name}>{product.name}</h3>
        <div className={styles.priceBlock}>
          <span className={styles.price}>{product.price} ₽</span>
          {product.old_price && <span className={styles.oldPrice}>{product.old_price} ₽</span>}
        </div>
        <div className={styles.footer}>
          <CartQtyControl product={product} outOfStock={outOfStock} size="md"/>
        </div>
      </div>
    </Link>
  )
}
