import { useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectLastOrder } from '../store/ordersSlice'
import styles from './OrderSuccessPage.module.css'

export default function OrderSuccessPage() {
  const { state } = useLocation()
  const lastOrder = useSelector(selectLastOrder)
  const order = state?.orderNumber ? state : lastOrder

  if (!order?.orderNumber) {
    return (
      <main className={`container ${styles.center}`}>
        <h2>Страница не найдена</h2>
        <Link to="/catalog" className="btn btn-primary">В каталог</Link>
      </main>
    )
  }

  const { orderNumber, total, delivery, payment, email } = order

  return (
    <main className={styles.page}>
      <div className={`container ${styles.wrapper}`}>
        <div className={`${styles.card} anim-scale-in`}>
          <div className={styles.icon}>✓</div>
          <h1 className={styles.heading}>Заказ оформлен!</h1>
          <p className={styles.sub}>Ваш заказ успешно принят. Подтверждение отправлено на почту.</p>
          <div className={styles.details}>
            <div className={styles.detailRow}><span>Номер заказа</span><strong>{orderNumber}</strong></div>
            <div className={styles.detailRow}><span>Сумма</span><strong>{total} ₽</strong></div>
            <div className={styles.detailRow}><span>Доставка</span><strong>{delivery}</strong></div>
            <div className={styles.detailRow}><span>Оплата</span><strong>{payment}</strong></div>
            {email && <div className={styles.detailRow}><span>E-mail</span><strong>{email}</strong></div>}
          </div>
          <div className={styles.actions}>
            <Link to="/catalog" className="btn btn-primary">Продолжить покупки</Link>
            <Link to="/orders" className="btn btn-outline">Мои заказы</Link>
          </div>
        </div>
      </div>
    </main>
  )
}
