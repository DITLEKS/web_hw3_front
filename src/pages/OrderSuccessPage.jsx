import { useLocation, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectLastOrder } from '../store/ordersSlice'
import styles from './OrderSuccessPage.module.css'

const STEPS = [
  { key: 'created',    label: 'Заказ принят',    icon: '✓' },
  { key: 'confirmed',  label: 'Подтверждён',     icon: '✓' },
  { key: 'assembly',   label: 'Сборка',          icon: '📦' },
  { key: 'shipped',    label: 'В пути',          icon: '🚚' },
  { key: 'delivered',  label: 'Доставлен',       icon: '🏠' },
]

const DELIVERY_ICONS = {
  'Курьерская доставка': '🚚',
  'Доставка СДЭК':       '📦',
  'Самовывоз':           '🏪',
}

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
  const items = order.raw?.items ?? []

  return (
    <main className={styles.page}>
      <div className={`container ${styles.wrapper}`}>

        {/* Иконка + заголовок */}
        <div className={styles.content}>
          <div className={styles.iconWrap}>
            <svg className={styles.checkSvg} viewBox="0 0 80 80" fill="none">
              <circle
                className={styles.circle}
                cx="40" cy="40" r="38"
                stroke="#E8A000" strokeWidth="3"
                strokeDasharray="239" strokeDashoffset="239"
              />
              <polyline
                className={styles.check}
                points="22,42 34,54 58,28"
                stroke="#E8A000" strokeWidth="3.5"
                strokeLinecap="round" strokeLinejoin="round"
                fill="none"
              />
            </svg>
          </div>

          <div className={styles.textBlock}>
            <h1 className={styles.title}>Заказ оформлен!</h1>
            <p className={styles.sub}>Ваш заказ успешно принят. Подтверждение отправлено на почту.</p>
          </div>

          {/* Статус-таймлайн */}
          <div className={styles.timeline}>
            {STEPS.map((step, idx) => {
              const isDone   = idx === 0
              const isActive = idx === 1
              const dotCls   = isDone ? styles.done : isActive ? styles.active : styles.pending
              const lblCls   = isDone ? styles.doneLabel : isActive ? styles.activeLabel : styles.pendingLabel
              return (
                <div key={step.key} style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <div className={styles.step}>
                    <div className={`${styles.stepDot} ${dotCls}`}>
                      {isDone && <span style={{ color: '#fff', fontSize: 13, fontWeight: 700 }}>✓</span>}
                      {isActive && <span className={styles.activePulse}/>}
                    </div>
                    <span className={`${styles.stepLabel} ${lblCls}`}>{step.label}</span>
                  </div>
                  {idx < STEPS.length - 1 && <div className={styles.timelineLine}/>}
                </div>
              )
            })}
          </div>

          {/* Карточка заказа */}
          <div className={`${styles.card} anim-scale-in`}>

            {/* Номер заказа */}
            <div className={styles.orderNumRow}>
              <span className={styles.orderNumLabel}>Номер заказа</span>
              <span className={styles.orderNum}>{orderNumber}</span>
            </div>

            {/* Позиции товаров */}
            {items.length > 0 && (
              <>
                <div className={styles.detailsTitle}>Состав заказа</div>
                <div className={styles.itemsList}>
                  {items.map((item, i) => (
                    <div key={i} className={styles.orderItem}>
                      <span className={styles.orderItemName}>{item.name}</span>
                      <span className={styles.orderItemMeta}>{item.quantity} шт.</span>
                      <span className={styles.orderItemTotal}>
                        {(parseFloat(item.total_price || item.unit_price) * (item.total_price ? 1 : item.quantity)).toFixed(0)} ₽
                      </span>
                    </div>
                  ))}
                </div>
                <div className={styles.orderTotal}>
                  <span>Итого</span>
                  <span>{Number(total).toFixed(0)} ₽</span>
                </div>
              </>
            )}

            {/* Детали доставки и оплаты */}
            <div className={styles.deliveryInfo}>
              <div className={styles.deliveryRow}>
                <span className={styles.deliveryIcon}>{DELIVERY_ICONS[delivery] ?? '🚚'}</span>
                <div>
                  <div className={styles.deliveryLabel}>Доставка</div>
                  <div className={styles.deliveryVal}>{delivery}</div>
                </div>
              </div>
              <div className={styles.deliveryRow}>
                <span className={styles.deliveryIcon}>💳</span>
                <div>
                  <div className={styles.deliveryLabel}>Оплата</div>
                  <div className={styles.deliveryVal}>{payment}</div>
                </div>
              </div>
              {items.length === 0 && (
                <div className={styles.deliveryRow}>
                  <span className={styles.deliveryIcon}>💰</span>
                  <div>
                    <div className={styles.deliveryLabel}>Сумма</div>
                    <div className={styles.deliveryVal}>{Number(total).toFixed(0)} ₽</div>
                  </div>
                </div>
              )}
            </div>

            {/* Email */}
            {email && (
              <div className={styles.emailNote}>
                Подтверждение заказа отправлено на <strong>{email}</strong>
              </div>
            )}

          </div>

          {/* Кнопки */}
          <div className={styles.actions}>
            <Link to="/catalog" className="btn btn-primary">Продолжить покупки</Link>
            <Link to="/orders"  className="btn btn-outline">Мои заказы</Link>
          </div>

        </div>
      </div>
    </main>
  )
}
