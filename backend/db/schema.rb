# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_12_29_090148) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "cats", force: :cascade do |t|
    t.date "birthday"
    t.string "color"
    t.datetime "created_at", null: false
    t.integer "gender"
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "records", force: :cascade do |t|
    t.bigint "cat_id", null: false
    t.datetime "created_at", null: false
    t.text "memo"
    t.integer "record_type"
    t.datetime "recorded_at"
    t.datetime "updated_at", null: false
    t.float "value"
    t.index ["cat_id"], name: "index_records_on_cat_id"
  end

  add_foreign_key "records", "cats"
end
