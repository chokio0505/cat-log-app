import { useState, useEffect } from 'react'
import axios from 'axios'
// Framer Motion をインポート
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { InputModal } from './components/InputModal'
// APIのURL（環境に合わせて変更してください）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const API_URL = `${API_BASE_URL}/records`

// 型定義
type Record = {
  id: number
  record_type: string
  value: number
}

function App() {
  const [records, setRecords] = useState<Record[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchRecords = async () => {
    try {
      const res = await axios.get(API_URL)
      setRecords(res.data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchRecords()
  }, [])


  const handleDelete = async (id: number) => {
    // 画面から先に消す（楽観的UI）
    setRecords(prev => prev.filter(r => r.id !== id))

    try {
      await axios.delete(`${API_URL}/${id}`)
      console.log('Deleted!')
    } catch (e) {
      alert('削除に失敗しました')
      fetchRecords() // 戻す
    }
  }

  // スワイプ終了時の判定
  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, id: number) => {
    // 左に100px以上スワイプしたら削除とみなす
    if (info.offset.x < -100) {
      handleDelete(id)
    }
  }

  const handleSave = async (data: any) => {
    // 1. Cat IDは一旦固定（シードデータの最初の猫を使う想定）
    // 本来は猫選択UIが必要ですが、まずは入力機能を優先
    const payload = {
      ...data,
      cat_id: 1 // 仮置き。DBにある猫のIDに合わせてください
    }

    try {
      await axios.post(API_URL, payload)
      fetchRecords() // リストを再取得
    } catch (e) {
      alert('保存失敗')
      console.error(e)
    }
  }

  return (
    <div style={{ padding: 20, paddingBottom: 100 /* ボタンが被らないように余白 */, maxWidth: 600, margin: '0 auto' }}>
      <h1>CatLog 🐱</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {/* AnimatePresenceで「消える時のアニメーション」を管理 */}
        <AnimatePresence>
          {records.map((record) => (
            <motion.div
              key={record.id}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              style={{ marginBottom: 10, position: 'relative', overflow: 'hidden', borderRadius: '12px' }}
            >
              {/* 背景の削除ボタン（スワイプで見えるようになる） */}
              <div style={{
                position: 'absolute',
                top: 0, bottom: 0, left: 0, right: 0,
                background: '#ff4d4f', // Red
                // borderRadius: '12px', // 親のoverflow:hiddenで切り抜くため削除
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '20px',
                color: 'white',
                zIndex: 0
              }}>
                <Trash2 size={24} />
              </div>

              {/* コンテンツ本体（スワイプ可能） */}
              <motion.div
                // 横方向(x)のみドラッグ可能
                drag="x"
                // ドラッグの制約（左には動くが、右には行かせない）
                dragConstraints={{ left: 0, right: 0 }}
                // 指を離した時にバネのように戻る設定
                dragElastic={{ left: 0.7, right: 0.1 }}
                // スワイプ終了時の処理
                onDragEnd={(e, info) => handleDragEnd(e, info, record.id)}
                // スタイル
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 0 0 1px white, 0 2px 5px rgba(0,0,0,0.05)',
                  position: 'relative', // 背景の上に表示
                  zIndex: 1,
                  display: 'flex', // コンテンツのレイアウト
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  touchAction: 'pan-y'
                }}
                whileDrag={{ cursor: 'grabbing' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                  <span style={{ fontWeight: 'bold' }}>{record.record_type}</span>
                  <span>{record.value}</span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          style={{
            position: 'fixed', bottom: 30, right: 30,
            width: 60, height: 60, borderRadius: '30px',
            background: '#333', color: 'white', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)', zIndex: 50
          }}
        >
          <Plus size={32} />
        </motion.button>

        <InputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />

      </div>
    </div>
  )
}

export default App