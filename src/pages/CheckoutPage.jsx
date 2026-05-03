import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '../data/mock'
import styles from './CheckoutPage.module.css'

const INITIAL_FORM = {
  first_name: '', last_name: '', phone: '', email: '',
  delivery_type: 'courier',
  city: '', street: '', zip: '',
  payment_method: 'card_online',
  comment: '',
}

export default function CheckoutPage() {
  const { items, subtotal, discount, promo, clearCart } = useCart()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Редирект если корзина пуста
  if (items.length === 0) {
    return (
      <main className={`container ${styles.empty}`}>
        <h2>Корзина пуста</h2>
        <Link to="/" className="btn btn-primary">В каталог</Link>
      </main>
    )
  }

  const delivery = DELIVERY_OPTIONS.find(d => d.value === form.delivery_type)
  const total = subtotal - discount + delivery.price

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.first_name.trim()) errs.first_name = 'Введите имя'
    if (!form.last_name.trim())  errs.last_name  = 'Введите фамилию'
    if (!form.phone.trim())      errs.phone      = 'Введите телефон'
    if (!form.email.trim())      errs.email      = 'Введите email'
    if (form.delivery_type !== 'pickup') {
      if (!form.city.trim())   errs.city   = 'Введите город'
      if (!form.street.trim()) errs.street = 'Введите адрес'
    }
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)

    // Имитируем запрос к API
    const orderNumber = `LX-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*9000)+1000)}`

    setTimeout(() => {
      clearCart()
      navigate('/order-success', {
        state: {
          orderNumber,
          total,
          delivery: delivery.label,
          payment: PAYMENT_OPTIONS.find(p => p.value === form.payment_method)?.label,
          email: form.email,
        },
      })
    }, 1200)
  }

  return (
    <main className={styles.page}>
      <div className="container">

        <nav className={`${styles.breadcrumb} anim-fade-in`}>
          <Link to="/">Каталог</Link><span>/</span>
          <Link to="/cart">Корзина</Link><span>/</span>
          <span>Оформление</span>
        </nav>

        <h1 className={`${styles.title} anim-fade-up`}>Оформление заказа</h1>

        <form className={styles.layout} onSubmit={handleSubmit} noValidate>

          {/* ── Левая колонка — форма ── */}
          <div className={styles.formSection}>

            {/* Покупатель */}
            <Section title="Ваши данные" step="1">
              <div className={styles.grid2}>
                <Field label="Имя" error={errors.first_name}>
                  <input className={`input ${errors.first_name ? styles.errInput : ''}`}
                    name="first_name" placeholder="Иван" value={form.first_name} onChange={handleChange} />
                </Field>
                <Field label="Фамилия" error={errors.last_name}>
                  <input className={`input ${errors.last_name ? styles.errInput : ''}`}
                    name="last_name" placeholder="Иванов" value={form.last_name} onChange={handleChange} />
                </Field>
              </div>
              <div className={styles.grid2}>
                <Field label="Телефон" error={errors.phone}>
                  <input className={`input ${errors.phone ? styles.errInput : ''}`}
                    name="phone" type="tel" placeholder="+7 (___) ___-__-__"
                    value={form.phone} onChange={handleChange} />
                </Field>
                <Field label="E-mail" error={errors.email}>
                  <input className={`input ${errors.email ? styles.errInput : ''}`}
                    name="email" type="email" placeholder="ivan@example.com"
                    value={form.email} onChange={handleChange} />
                </Field>
              </div>
            </Section>

            {/* Доставка */}
            <Section title="Способ доставки" step="2">
              <div className={styles.radioGroup}>
                {DELIVERY_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`${styles.radioCard} ${form.delivery_type === opt.value ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="delivery_type"
                      value={opt.value}
                      checked={form.delivery_type === opt.value}
                      onChange={handleChange}
                      className={styles.srOnly}
                    />
                    <div className={styles.radioContent}>
                      <div className={styles.radioTitle}>{opt.label}</div>
                      <div className={styles.radioSub}>{opt.description}</div>
                    </div>
                    <div className={styles.radioPrice}>
                      {opt.price > 0 ? `${opt.price} ₽` : 'Бесплатно'}
                    </div>
                  </label>
                ))}
              </div>

              {form.delivery_type !== 'pickup' && (
                <div className={styles.addressFields}>
                  <Field label="Город" error={errors.city}>
                    <input className={`input ${errors.city ? styles.errInput : ''}`}
                      name="city" placeholder="Москва" value={form.city} onChange={handleChange} />
                  </Field>
                  <Field label="Улица, дом, квартира" error={errors.street}>
                    <input className={`input ${errors.street ? styles.errInput : ''}`}
                      name="street" placeholder="ул. Ленина, д. 1, кв. 42"
                      value={form.street} onChange={handleChange} />
                  </Field>
                  <Field label="Почтовый индекс">
                    <input className="input" name="zip" placeholder="101000"
                      value={form.zip} onChange={handleChange} maxLength={6} />
                  </Field>
                </div>
              )}
            </Section>

            {/* Оплата */}
            <Section title="Способ оплаты" step="3">
              <div className={styles.radioGroup}>
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`${styles.radioCard} ${form.payment_method === opt.value ? styles.selected : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={opt.value}
                      checked={form.payment_method === opt.value}
                      onChange={handleChange}
                      className={styles.srOnly}
                    />
                    <span className={styles.payIcon}>{opt.icon}</span>
                    <div className={styles.radioContent}>
                      <div className={styles.radioTitle}>{opt.label}</div>
                    </div>
                  </label>
                ))}
              </div>
            </Section>

            {/* Комментарий */}
            <Section title="Комментарий к заказу" step="4" optional>
              <textarea
                className="input"
                name="comment"
                placeholder="Дополнительные пожелания к заказу или доставке..."
                value={form.comment}
                onChange={handleChange}
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </Section>

          </div>

          {/* ── Правая колонка — итог ── */}
          <aside className={`${styles.orderSummary} anim-fade-up delay-2`}>
            <h2 className={styles.summaryTitle}>Ваш заказ</h2>

            <div className={styles.orderItems}>
              {items.map(item => (
                <div key={item.sku} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} className={styles.orderItemImg} />
                  <div className={styles.orderItemInfo}>
                    <span className={styles.orderItemName}>{item.name}</span>
                    <span className={styles.orderItemQty}>{item.quantity} шт. × {item.price} ₽</span>
                  </div>
                  <strong className={styles.orderItemTotal}>{item.price * item.quantity} ₽</strong>
                </div>
              ))}
            </div>

            <div className={styles.summaryLines}>
              <div className={styles.summaryLine}>
                <span>Товары</span><span>{subtotal} ₽</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.summaryLine} ${styles.discountLine}`}>
                  <span>Промокод {promo?.code}</span><span>−{discount} ₽</span>
                </div>
              )}
              <div className={styles.summaryLine}>
                <span>Доставка</span>
                <span>{delivery.price > 0 ? `${delivery.price} ₽` : 'Бесплатно'}</span>
              </div>
            </div>

            <div className={styles.summaryTotal}>
              <span>Итого</span>
              <strong>{total} ₽</strong>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? (
                <span className={styles.spinner} />
              ) : (
                'Подтвердить заказ'
              )}
            </button>

            <p className={styles.agree}>
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
            </p>
          </aside>

        </form>
      </div>
    </main>
  )
}

// ── Вспомогательные компоненты ────────────────────────────────────── //

function Section({ title, step, optional, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.step}>{step}</span>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {optional && <span className={styles.optional}>необязательно</span>}
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
      {error && <span className={styles.errMsg}>{error}</span>}
    </div>
  )
}
