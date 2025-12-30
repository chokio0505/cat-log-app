class Record < ApplicationRecord
  belongs_to :cat

  enum :record_type, {
    food: 0, water: 1, pee: 2, poop: 3, weight: 4, care: 5, other: 99
  }

  before_validation :set_default_recorded_at
  validates :record_type, :recorded_at, presence: true

  private
  def set_default_recorded_at
    self.recorded_at ||= Time.current
  end
end
