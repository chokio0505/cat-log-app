// src/components/InputModal.tsx
import { useState } from 'react'
import { X, Check } from 'lucide-react'
import { motion } from 'framer-motion'

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { record_type: string; value: number | string; memo: string }) => void
}

// 記録の種類ごとの設定（ラベルや単位）
const RECORD_TYPES = [
  { id: 'food', label: 'ご飯', unit: 'g', color: '#FF9F1C' },
  { id: 'water', label: '水', unit: 'ml', color: '#2EC4B6' },
  { id: 'poop', label: 'うんち', unit: '', color: '#8D6E63' },
  { id: 'pee', label: 'おしっこ', unit: '', color: '#FFBF69' },
  { id: 'weight', label: '体重', unit: 'kg', color: '#CBF3F0' },
]

export const InputModal = ({ isOpen, onClose, onSave }: Props) => {
  const [selectedType, setSelectedType] = useState('food')
  const [value, setValue] = useState('')
  const [memo, setMemo] = useState('')

  const handleSubmit = () => {
    onSave({ record_type: selectedType, value: Number(value), memo })
    // 入力値をリセット
    setValue('')
    setMemo('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', zIndex: 100,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center'
    }} onClick={onClose}>

      {/* モーダル本体（下からニョキッと出るアニメーション） */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 500 }}
        style={{
          background: 'white', width: '100%', maxWidth: '600px',
          borderTopLeftRadius: '20px', borderTopRightRadius: '20px',
          padding: '20px', paddingBottom: '40px'
        }}
        onClick={(e) => e.stopPropagation()} // 中身をクリックしても閉じないように
      >
        {/* ヘッダー */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ margin: 0 }}>記録する</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none' }}><X /></button>
        </div>

        {/* 種類の選択ボタン */}
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, marginBottom: 20 }}>
          {RECORD_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              style={{
                flexShrink: 0,
                padding: '10px 15px',
                borderRadius: '20px',
                border: 'none',
                background: selectedType === type.id ? type.color : '#f0f0f0',
                color: selectedType === type.id ? 'white' : '#333',
                fontWeight: 'bold',
                transition: '0.2s'
              }}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* 数値入力 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5, color: '#666' }}>
            量 / 数値 {RECORD_TYPES.find(t => t.id === selectedType)?.unit && `(${RECORD_TYPES.find(t => t.id === selectedType)?.unit})`}
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{ width: '100%', padding: '15px', fontSize: '1.2rem', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            placeholder="例: 30"
          />
        </div>

        {/* メモ入力 */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', marginBottom: 5, color: '#666' }}>ひとことメモ</label>
          <input
            type="text"
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
            placeholder="よく食べた"
          />
        </div>

        {/* 保存ボタン */}
        <button
          onClick={handleSubmit}
          style={{
            width: '100%', background: '#333', color: 'white',
            padding: '15px', borderRadius: '12px', border: 'none',
            fontSize: '1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', gap: 10
          }}
        >
          <Check /> 記録する
        </button>

      </motion.div>
    </div>
  )
}