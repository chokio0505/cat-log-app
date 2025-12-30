class CatsController < ApplicationController
  before_action :set_cat, only: %i[ show update destroy ]

  # GET /cats
  def index
    @cats = Cat.all

    render json: @cats
  end

  # GET /cats/1
  def show
    render json: @cat
  end

  # POST /cats
  def create
    @cat = Cat.new(cat_params)

    if @cat.save
      render json: @cat, status: :created, location: @cat
    else
      render json: @cat.errors, status: :unprocessable_content
    end
  end

  # PATCH/PUT /cats/1
  def update
    if @cat.update(cat_params)
      render json: @cat
    else
      render json: @cat.errors, status: :unprocessable_content
    end
  end

  # DELETE /cats/1
  def destroy
    @cat.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_cat
      @cat = Cat.find(params.expect(:id))
    end

    # Only allow a list of trusted parameters through.
    def cat_params
      params.expect(cat: [ :name, :birthday, :gender, :color ])
    end
end
