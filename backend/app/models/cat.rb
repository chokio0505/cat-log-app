class Cat < ApplicationRecord
  has_many :records, dependent: :destroy
  enum :gender, { male: 0, female: 1, unknown: 2 }
end
