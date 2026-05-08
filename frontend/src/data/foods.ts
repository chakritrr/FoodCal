export type Category = 'vegetable' | 'fruit'

export interface Food {
  id: string
  name: string
  emoji: string
  category: Category
  caloriesPer100g: number
}

export const foods: Food[] = [
  // ผัก
  { id: 'broccoli', name: 'บรอกโคลี', emoji: '🥦', category: 'vegetable', caloriesPer100g: 34 },
  { id: 'carrot', name: 'แครอท', emoji: '🥕', category: 'vegetable', caloriesPer100g: 41 },
  { id: 'spinach', name: 'ผักโขม', emoji: '🌿', category: 'vegetable', caloriesPer100g: 23 },
  { id: 'tomato', name: 'มะเขือเทศ', emoji: '🍅', category: 'vegetable', caloriesPer100g: 18 },
  { id: 'cucumber', name: 'แตงกวา', emoji: '🥒', category: 'vegetable', caloriesPer100g: 16 },
  { id: 'corn', name: 'ข้าวโพด', emoji: '🌽', category: 'vegetable', caloriesPer100g: 86 },
  { id: 'cabbage', name: 'กะหล่ำปลี', emoji: '🥬', category: 'vegetable', caloriesPer100g: 25 },
  { id: 'longbean', name: 'ถั่วฝักยาว', emoji: '🫘', category: 'vegetable', caloriesPer100g: 47 },
  { id: 'mushroom', name: 'เห็ดหอม', emoji: '🍄', category: 'vegetable', caloriesPer100g: 35 },
  { id: 'pumpkin', name: 'ฟักทอง', emoji: '🎃', category: 'vegetable', caloriesPer100g: 26 },
  // ผลไม้
  { id: 'apple', name: 'แอปเปิ้ล', emoji: '🍎', category: 'fruit', caloriesPer100g: 52 },
  { id: 'banana', name: 'กล้วย', emoji: '🍌', category: 'fruit', caloriesPer100g: 89 },
  { id: 'orange', name: 'ส้ม', emoji: '🍊', category: 'fruit', caloriesPer100g: 47 },
  { id: 'grape', name: 'องุ่น', emoji: '🍇', category: 'fruit', caloriesPer100g: 69 },
  { id: 'mango', name: 'มะม่วง', emoji: '🥭', category: 'fruit', caloriesPer100g: 60 },
  { id: 'strawberry', name: 'สตรอว์เบอร์รี่', emoji: '🍓', category: 'fruit', caloriesPer100g: 32 },
  { id: 'watermelon', name: 'แตงโม', emoji: '🍉', category: 'fruit', caloriesPer100g: 30 },
  { id: 'papaya', name: 'มะละกอ', emoji: '🍈', category: 'fruit', caloriesPer100g: 43 },
  { id: 'pineapple', name: 'สับปะรด', emoji: '🍍', category: 'fruit', caloriesPer100g: 50 },
  { id: 'durian', name: 'ทุเรียน', emoji: '🟡', category: 'fruit', caloriesPer100g: 147 },
]
