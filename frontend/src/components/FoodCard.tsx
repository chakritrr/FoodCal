import { useState } from 'react'
import type { Food } from '../data/foods'
import styles from './FoodCard.module.css'

interface Props {
  food: Food
  onAddToCart: (food: Food, weight: number) => void
}

const CAT_LABEL: Record<string, string> = { vegetable: 'ผัก', fruit: 'ผลไม้' }
const CAT_COLOR: Record<string, string> = { vegetable: styles.vegBadge, fruit: styles.fruitBadge }

function calLevel(kcal: number): { label: string; cls: string } {
  if (kcal < 30) return { label: 'แคลต่ำมาก', cls: styles.lvlLow }
  if (kcal < 60) return { label: 'แคลต่ำ', cls: styles.lvlMedLow }
  if (kcal < 100) return { label: 'แคลปานกลาง', cls: styles.lvlMed }
  return { label: 'แคลสูง', cls: styles.lvlHigh }
}

export default function FoodCard({ food, onAddToCart }: Props) {
  const [weight, setWeight] = useState(100)
  const [added, setAdded] = useState(false)

  const calories = Math.round((food.caloriesPer100g * weight) / 100)
  const level = calLevel(food.caloriesPer100g)

  const handleAdd = () => {
    onAddToCart(food, weight)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={`${styles.catBadge} ${CAT_COLOR[food.category]}`}>
          {CAT_LABEL[food.category]}
        </span>
        <span className={`${styles.lvlBadge} ${level.cls}`}>{level.label}</span>
      </div>

      <div className={styles.emojiWrap}>
        <span className={styles.emoji}>{food.emoji}</span>
      </div>

      <div className={styles.name}>{food.name}</div>
      <div className={styles.baseKcal}>{food.caloriesPer100g} kcal / 100g</div>

      {/* Weight slider */}
      <div className={styles.sliderSection}>
        <div className={styles.sliderHeader}>
          <span className={styles.sliderLabel}>น้ำหนัก</span>
          <div className={styles.weightInputWrap}>
            <input
              type="number"
              className={styles.weightInput}
              value={weight}
              min={10}
              max={1000}
              onChange={(e) => {
                const v = parseInt(e.target.value)
                if (!isNaN(v)) setWeight(Math.max(10, Math.min(1000, v)))
              }}
            />
            <span className={styles.unit}>g</span>
          </div>
        </div>
        <input
          type="range"
          className={styles.slider}
          min={10}
          max={500}
          step={10}
          value={Math.min(weight, 500)}
          onChange={(e) => setWeight(Number(e.target.value))}
        />
        <div className={styles.sliderTicks}>
          {[50, 100, 200, 300, 500].map((v) => (
            <button key={v} className={styles.tick} onClick={() => setWeight(v)}>
              {v}g
            </button>
          ))}
        </div>
      </div>

      {/* Calorie result */}
      <div className={styles.calBox}>
        <span className={styles.calNum}>{calories}</span>
        <span className={styles.calUnit}>kcal</span>
      </div>

      <button className={`${styles.addBtn} ${added ? styles.addBtnDone : ''}`} onClick={handleAdd}>
        {added ? '✓ เพิ่มแล้ว!' : '+ ใส่ตะกร้า'}
      </button>
    </div>
  )
}
