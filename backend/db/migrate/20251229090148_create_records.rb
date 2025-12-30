class CreateRecords < ActiveRecord::Migration[8.1]
  def change
    create_table :records do |t|
      t.references :cat, null: false, foreign_key: true
      t.integer :record_type
      t.float :value
      t.text :memo
      t.datetime :recorded_at

      t.timestamps
    end
  end
end
