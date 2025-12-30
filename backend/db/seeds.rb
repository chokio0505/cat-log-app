# backend/db/seeds.rb

# 既存データをクリーニング
puts "🧹 Cleaning database..."
Record.destroy_all
Cat.destroy_all

# ---------------------------------------------------------
# 🐱 猫の登録
# ---------------------------------------------------------
puts "🐱 Creating cats..."

mugi = Cat.create!(
  name: "むぎ",
  birthday: "2022-04-15",
  gender: :male,
  color: "#E6C229" # 黄色っぽいテーマカラー
)

goma = Cat.create!(
  name: "ごま",
  birthday: "2020-11-20",
  gender: :female,
  color: "#333333" # 黒色っぽいテーマカラー
)

# ---------------------------------------------------------
# 📝 記録の登録 (過去7日間分)
# ---------------------------------------------------------
puts "📝 Creating records..."

# 記録生成用ヘルパー
def create_daily_records(cat, date)
  # 1. 朝ごはん (カリカリ)
  Record.create!(
    cat: cat,
    record_type: :food,
    value: rand(25..35), # 25~35g
    memo: "完食",
    recorded_at: date.change(hour: 7, min: rand(0..59))
  )

  # 2. 昼の水
  Record.create!(
    cat: cat,
    record_type: :water,
    value: nil, # 水は量らず飲んだことだけ記録するスタイル
    memo: "よく飲んでた",
    recorded_at: date.change(hour: 12, min: rand(0..59))
  )

  # 3. トイレ (うんち) - 2日に1回くらいの確率
  if [true, false].sample
    Record.create!(
      cat: cat,
      record_type: :poop,
      value: nil,
      memo: ["立派な一本糞", "ちょっと硬めかも", nil].sample,
      recorded_at: date.change(hour: 14, min: rand(0..59))
    )
  end

  # 4. 夜ごはん (ウェットフード)
  Record.create!(
    cat: cat,
    record_type: :food,
    value: 1.0, # 1袋
    memo: "チュールもあげた",
    recorded_at: date.change(hour: 19, min: rand(0..59))
  )

  # 5. 体重測定 (3日に1回)
  if date.day % 3 == 0
    base_weight = cat.name == "むぎ" ? 4.5 : 3.8
    Record.create!(
      cat: cat,
      record_type: :weight,
      value: base_weight + rand(-0.1..0.1), # 微妙に変動させる
      recorded_at: date.change(hour: 20, min: 0)
    )
  end
end

# 過去7日分のデータを生成
(0..7).each do |days_ago|
  date = days_ago.days.ago
  create_daily_records(mugi, date)
  create_daily_records(goma, date)
end

puts "✅ Done! Created #{Cat.count} cats and #{Record.count} records."