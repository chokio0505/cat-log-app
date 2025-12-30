import { useState, useEffect } from 'react'
import axios from 'axios'
// Framer Motion をインポート
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { Plus } from 'lucide-react'
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
              // 横方向(x)のみドラッグ可能にする
              drag="x"
              // ドラッグの制約（左には動くが、右には行かせない等）
              dragConstraints={{ left: 0, right: 0 }}
              // 指を離した時にバネのように戻る設定
              dragElastic={{ left: 0.7, right: 0.1 }}
              // スワイプ終了時の処理
              onDragEnd={(e, info) => handleDragEnd(e, info, record.id)}
              // 消える時のアニメーション
              exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
              // スタイル
              style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                position: 'relative', // 重要
                touchAction: 'pan-y' // 縦スクロールを邪魔しない設定
              }}
              // 左にスワイプしている時に「削除」の赤色を裏に見せる演出などのため
              whileDrag={{ scale: 1.02, zIndex: 10 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold' }}>{record.record_type}</span>
                <span>{record.value}</span>
              </div>

              {/* スワイプを促すヒント（削除アイコンなどを絶対配置で入れても良い） */}
              <div style={{
                position: 'absolute',
                right: -80,
                top: 0,
                bottom: 0,
                width: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'red',
                fontWeight: 'bold'
              }}>
                削除
              </div>
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