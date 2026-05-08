import type { CartItem } from '../App'
import styles from './Cart.module.css'

interface Props {
  items: CartItem[]
  onRemove: (id: string) => void
  onClear: () => void
}

export default function Cart({ items, onRemove, onClear }: Props) {
  const totalCalories = items.reduce(
    (sum, item) => sum + Math.round((item.food.caloriesPer100g * item.weight) / 100),
    0
  )

  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)

  return (
    <div className={styles.cart}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.headerIcon}>🛒</span>
          <span className={styles.title}>ตะกร้าของฉัน</span>
        </div>
        {items.length > 0 && (
          <span className={styles.badge}>{items.length} รายการ</span>
        )}
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🥗</div>
          <p className={styles.emptyText}>ยังไม่มีรายการ</p>
          <p className={styles.emptyHint}>เลือกผักหรือผลไม้แล้วกด "ใส่ตะกร้า"</p>
        </div>
      ) : (
        <>
          <ul className={styles.list}>
            {items.map((item) => {
              const cal = Math.round((item.food.caloriesPer100g * item.weight) / 100)
              return (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemEmoji}>{item.food.emoji}</div>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemName}>{item.food.name}</span>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemWeight}>{item.weight}g</span>
                      <span className={styles.itemDot}>·</span>
                      <span className={styles.itemCal}>{cal} kcal</span>
                    </div>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => onRemove(item.id)}
                    aria-label="ลบ"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>น้ำหนักรวม</span>
              <span className={styles.summaryVal}>{totalWeight}g</span>
            </div>
            <div className={styles.divider} />
            <div className={styles.summaryRow}>
              <span>แคลอรี่ทั้งหมด</span>
              <span className={styles.totalCal}>{totalCalories} kcal</span>
            </div>
            <div className={styles.calBar}>
              <div
                className={styles.calBarFill}
                style={{ width: `${Math.min((totalCalories / 2000) * 100, 100)}%` }}
              />
            </div>
            <p className={styles.calHint}>{Math.round((totalCalories / 2000) * 100)}% ของพลังงานต่อวัน (2,000 kcal)</p>
          </div>

          <button className={styles.clearBtn} onClick={onClear}>
            🗑 ล้างตะกร้า
          </button>
        </>
      )}
    </div>
  )
}
