class CreateCats < ActiveRecord::Migration[8.1]
  def change
    create_table :cats do |t|
      t.string :name
      t.date :birthday
      t.integer :gender
      t.string :color

      t.timestamps
    end
  end
end
