import { useLocation, Link } from 'react-router-dom'
import styles from './OrderSuccessPage.module.css'

export default function OrderSuccessPage() {
  const { state } = useLocation()

  // Если пришли напрямую без state — показываем заглушку
  if (!state?.orderNumber) {
    return (
      <main className={`container ${styles.center}`}>
        <h2>Страница не найдена</h2>
        <Link to="/catalog" className="btn btn-primary">В каталог</Link>
      </main>
    )
  }

  const { orderNumber, total, delivery, payment, email, address, items } = state

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 7)
  const deliveryDateStr = deliveryDate.toLocaleDateString('ru-RU',
    { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className={styles.page}>
      <div className={`container ${styles.content}`}>

        {/* Анимированная галочка */}
        <div className={`${styles.iconWrap} anim-scale-in`}>
          <svg className={styles.checkSvg} viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" stroke="var(--c-accent)" strokeWidth="2.5"
                    strokeDasharray="239" strokeDashoffset="0"
                    className={styles.circle} />
            <polyline points="24,40 35,52 56,28" stroke="var(--c-accent)"
                      strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                      className={styles.check} />
          </svg>
        </div>

        <div className={`${styles.textBlock} anim-fade-up delay-2`}>
          <h1 className={styles.title}>Заказ оформлен!</h1>
          <p className={styles.sub}>
            Спасибо за покупку. Мы уже начали его обрабатывать.
          </p>
        </div>

        {/* Карточка с деталями */}
        <div className={`${styles.card} anim-fade-up delay-3`}>

          <div className={styles.orderNumRow}>
            <span className={styles.orderNumLabel}>Номер заказа</span>
            <span className={styles.orderNum}>{orderNumber}</span>
          </div>

          {/* Список товаров */}
          {items?.length > 0 && (
            <div className={styles.itemsList}>
              <div className={styles.detailsTitle}>Детали заказа</div>
              {items.map((item, i) => (
                <div key={i} className={styles.orderItem}>
                  <span className={styles.orderItemName}>{item.name}</span>
                  <span className={styles.orderItemMeta}>{item.qty} шт. × {item.price} ₽</span>
                  <span className={styles.orderItemTotal}>{item.qty * item.price} ₽</span>
                </div>
              ))}
              <div className={styles.orderTotal}>
                <span>Итого</span>
                <strong>{total} ₽</strong>
              </div>
            </div>
          )}

          {/* Адрес и дата */}
          <div className={styles.deliveryInfo}>
            {address && (
              <div className={styles.deliveryRow}>
                <span className={styles.deliveryIcon}>📍</span>
                <div>
                  <div className={styles.deliveryLabel}>Адрес доставки</div>
                  <div className={styles.deliveryVal}>{address}</div>
                </div>
              </div>
            )}
            <div className={styles.deliveryRow}>
              <span className={styles.deliveryIcon}>📅</span>
              <div>
                <div className={styles.deliveryLabel}>Ожидаемая дата доставки</div>
                <div className={styles.deliveryVal}>{deliveryDateStr}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Статусы */}
        <div className={`${styles.timeline} anim-fade-up delay-4`}>
          <TimelineStep status="done"    label="Заказ принят"         />
          <TimelineLine />
          <TimelineStep status="active"  label="Подтверждение"        />
          <TimelineLine />
          <TimelineStep status="pending" label="Сборка"               />
          <TimelineLine />
          <TimelineStep status="pending" label="Доставка"             />
          <TimelineLine />
          <TimelineStep status="pending" label="Получение"            />
        </div>

        {/* Кнопки */}
        <div className={`${styles.actions} anim-fade-up delay-5`}>
          <Link to="/orders" className="btn btn-outline btn-lg">Отследить заказ</Link>
          <Link to="/catalog" className="btn btn-primary btn-lg">На главную</Link>
        </div>

      </div>
    </main>
  )
}

function TimelineStep({ status, label }) {
  return (
    <div className={styles.step}>
      <div className={`${styles.stepDot} ${styles[status]}`}>
        {status === 'done' && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
               stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        )}
        {status === 'active' && <div className={styles.activePulse} />}
      </div>
      <span className={`${styles.stepLabel} ${styles[status + 'Label']}`}>{label}</span>
    </div>
  )
}

function TimelineLine() {
  return <div className={styles.timelineLine} />
}
