import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { DELIVERY_OPTIONS, PAYMENT_OPTIONS } from '../data/mock'
import { ordersApi } from '../api/client'
import { getSessionId } from '../utils/session'
import styles from './CheckoutPage.module.css'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || !import.meta.env.VITE_ORDERS_API_URL

const INITIAL_FORM = {
  first_name: '', last_name: '', phone: '', email: '',
  delivery_type: 'courier',
  city: '', street: '', zip: '',
  payment_method: 'card_online',
  comment: '',
}

const STEPS = ['Данные', 'Доставка', 'Оплата']

export default function CheckoutPage() {
  const { items, subtotal, discount, promo, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)          // 0 | 1 | 2
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

  if (items.length === 0) {
    return (
      <main className={`container ${styles.empty}`}>
        <h2>Корзина пуста</h2>
        <Link to="/catalog" className="btn btn-primary">В каталог</Link>
      </main>
    )
  }

  const delivery = DELIVERY_OPTIONS.find(d => d.value === form.delivery_type) ?? DELIVERY_OPTIONS[0]
  const total = subtotal - discount + delivery.price

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: null }))
  }

  const validateStep = (s) => {
    const errs = {}
    if (s === 0) {
      if (!form.first_name.trim()) errs.first_name = 'Введите имя'
      if (!form.last_name.trim())  errs.last_name  = 'Введите фамилию'
      if (!form.phone.trim())      errs.phone      = 'Введите телефон'
      if (!form.email.trim())      errs.email      = 'Введите email'
    }
    if (s === 1 && form.delivery_type !== 'pickup') {
      if (!form.city.trim())   errs.city   = 'Введите город'
      if (!form.street.trim()) errs.street = 'Введите адрес'
    }
    return errs
  }

  const handleNext = () => {
    const errs = validateStep(step)
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(s => s + 1)
  }

  const handleBack = () => {
    setErrors({})
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setApiError(null)
    try {
      let orderNumber, orderTotal, orderDelivery, orderPayment

      if (USE_MOCK) {
        await new Promise(r => setTimeout(r, 1200))
        orderNumber  = `LX-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(Math.floor(Math.random()*9000)+1000)}`
        orderTotal   = total
        orderDelivery= delivery.label
        orderPayment = PAYMENT_OPTIONS.find(p => p.value === form.payment_method)?.label
      } else {
        const sessionId = getSessionId()
        const payload = {
          delivery_type:   form.delivery_type,
          delivery_city:   form.delivery_type !== 'pickup' ? form.city : undefined,
          delivery_street: form.delivery_type !== 'pickup' ? form.street : undefined,
          delivery_zip:    form.zip || undefined,
          payment_method:  form.payment_method,
          promo_code:      promo?.code || undefined,
        }
        const res = await ordersApi.createOrder(sessionId, payload)
        const d = res.data
        orderNumber  = d.order_number
        orderTotal   = parseFloat(d.total_amount)
        orderDelivery= delivery.label
        orderPayment = PAYMENT_OPTIONS.find(p => p.value === form.payment_method)?.label
      }

      clearCart()
      navigate('/order-success', {
        state: {
          orderNumber, total: orderTotal,
          delivery: orderDelivery, payment: orderPayment,
          email: form.email,
          address: form.delivery_type !== 'pickup'
            ? `г. ${form.city}, ${form.street}${form.zip ? `, ${form.zip}` : ''}`
            : 'Самовывоз',
          items: items.map(i => ({
            name: i.name,
            qty: i.quantity,
            price: parseFloat(i.price),
          })),
        },
      })
    } catch (err) {
      setApiError(err.message || 'Не удалось оформить заказ. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  // Ожидаемая дата доставки: +3 рабочих дня
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 3)
  const deliveryDateStr = deliveryDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <main className={styles.page}>
      <div className="container">

        <h1 className={styles.title}>Оформление заказа</h1>

        {/* Степпер */}
        <div className={styles.stepper}>
          {STEPS.map((label, i) => (
            <div key={i} className={styles.stepperItem}>
              <div className={`${styles.stepperDot}
                ${i < step ? styles.stepDone : ''}
                ${i === step ? styles.stepActive : ''}
                ${i > step ? styles.stepPending : ''}`}
              >
                {i < step
                  ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  : i + 1
                }
              </div>
              <span className={`${styles.stepperLabel}
                ${i === step ? styles.stepLabelActive : ''}
                ${i < step ? styles.stepLabelDone : ''}`}
              >{label}</span>
              {i < STEPS.length - 1 && (
                <div className={`${styles.stepperLine} ${i < step ? styles.stepLineDone : ''}`} />
              )}
            </div>
          ))}
        </div>

        {apiError && <div className={styles.apiError} role="alert">⚠️ {apiError}</div>}

        <div className={styles.layout}>
          {/* Левая колонка — текущий шаг */}
          <div className={styles.formSection}>

            {/* Шаг 0: Контактные данные */}
            {step === 0 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Контактные данные</h2>
                <div className={styles.grid2}>
                  <Field label="Имя" error={errors.first_name}>
                    <input className={`input ${errors.first_name ? styles.errInput : ''}`}
                      name="first_name" placeholder="Иван" value={form.first_name}
                      onChange={handleChange} autoComplete="given-name" />
                  </Field>
                  <Field label="Фамилия" error={errors.last_name}>
                    <input className={`input ${errors.last_name ? styles.errInput : ''}`}
                      name="last_name" placeholder="Иванов" value={form.last_name}
                      onChange={handleChange} autoComplete="family-name" />
                  </Field>
                </div>
                <div className={styles.grid2}>
                  <Field label="Email" error={errors.email}>
                    <input className={`input ${errors.email ? styles.errInput : ''}`}
                      name="email" type="email" placeholder="ivan@example.com"
                      value={form.email} onChange={handleChange} autoComplete="email" />
                  </Field>
                  <Field label="Телефон" error={errors.phone}>
                    <input className={`input ${errors.phone ? styles.errInput : ''}`}
                      name="phone" type="tel" placeholder="+7 (999) 123-45-67"
                      value={form.phone} onChange={handleChange} autoComplete="tel" />
                  </Field>
                </div>
                <div className={styles.stepActions}>
                  <button type="button" className="btn btn-primary btn-full" onClick={handleNext}>
                    Далее
                  </button>
                </div>
              </div>
            )}

            {/* Шаг 1: Доставка */}
            {step === 1 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Способ доставки</h2>
                <div className={styles.radioGroup}>
                  {DELIVERY_OPTIONS.map(opt => (
                    <label key={opt.value}
                      className={`${styles.radioCard} ${form.delivery_type === opt.value ? styles.selected : ''}`}
                    >
                      <input type="radio" name="delivery_type" value={opt.value}
                        checked={form.delivery_type === opt.value}
                        onChange={handleChange} className={styles.srOnly} />
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
                        name="city" placeholder="Москва" value={form.city}
                        onChange={handleChange} autoComplete="address-level2" />
                    </Field>
                    <Field label="Адрес" error={errors.street}>
                      <input className={`input ${errors.street ? styles.errInput : ''}`}
                        name="street" placeholder="ул. Ленина, д. 10, кв. 5"
                        value={form.street} onChange={handleChange} autoComplete="street-address" />
                    </Field>
                    <Field label="Индекс">
                      <input className="input" name="zip" placeholder="101000"
                        value={form.zip} onChange={handleChange}
                        maxLength={6} autoComplete="postal-code" />
                    </Field>
                  </div>
                )}

                <div className={styles.stepActions}>
                  <button type="button" className={`btn btn-outline`} onClick={handleBack}>Назад</button>
                  <button type="button" className="btn btn-primary" onClick={handleNext}>Далее</button>
                </div>
              </div>
            )}

            {/* Шаг 2: Оплата */}
            {step === 2 && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Способ оплаты</h2>
                <div className={styles.radioGroup}>
                  {PAYMENT_OPTIONS.map(opt => (
                    <label key={opt.value}
                      className={`${styles.radioCard} ${form.payment_method === opt.value ? styles.selected : ''}`}
                    >
                      <input type="radio" name="payment_method" value={opt.value}
                        checked={form.payment_method === opt.value}
                        onChange={handleChange} className={styles.srOnly} />
                      <span className={styles.payIcon}>{opt.icon}</span>
                      <div className={styles.radioContent}>
                        <div className={styles.radioTitle}>{opt.label}</div>
                        {opt.description && <div className={styles.radioSub}>{opt.description}</div>}
                      </div>
                    </label>
                  ))}
                </div>

                <div className={styles.stepActions}>
                  <button type="button" className="btn btn-outline" onClick={handleBack}>Назад</button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Оформляем...' : 'Оформить заказ'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Правая колонка — сводка заказа */}
          <div className={styles.summary}>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>Ваш заказ</h3>
              <div className={styles.summaryItems}>
                {items.map(item => (
                  <div key={item.id} className={styles.summaryItem}>
                    <img
                      src={item.primary_image || item.image || `https://picsum.photos/seed/${item.id}/80/80`}
                      alt={item.name}
                      className={styles.summaryThumb}
                    />
                    <div className={styles.summaryItemInfo}>
                      <span className={styles.summaryItemName}>
                        {item.name.length > 30 ? item.name.slice(0, 30) + '…' : item.name}
                      </span>
                      <span className={styles.summaryItemMeta}>× {item.quantity}</span>
                    </div>
                    <span className={styles.summaryItemPrice}>
                      {parseFloat(item.price) * item.quantity} ₽
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.summaryDivider} />
              <div className={styles.summaryRow}>
                <span>Товары</span><span>{subtotal} ₽</span>
              </div>
              {discount > 0 && (
                <div className={`${styles.summaryRow} ${styles.summaryDiscount}`}>
                  <span>Скидка</span><span>−{discount} ₽</span>
                </div>
              )}
              <div className={styles.summaryRow}>
                <span>Доставка</span>
                <span>{delivery.price > 0 ? `${delivery.price} ₽` : 'Бесплатно'}</span>
              </div>
              <div className={styles.summaryDivider} />
              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Итого</span><strong>{total} ₽</strong>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

function Field({ label, error, children }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {children}
      {error && <span className={styles.fieldError}>{error}</span>}
    </div>
  )
}
