# Rails バックエンド 2ヶ月集中ロードマップ - プロフィール機能特化

## 🎯 目標
**2ヶ月で認証とプロフィール管理のコア機能を完成させ、スケーラブルな基盤を構築する**

## 📊 前提条件
- **開発者**: 1人（フルスタック）
- **稼働**: 週5日 × 8時間 = 週40時間
- **期間**: 8週間 = 約320時間
- **フロントエンド**: Next.js（既存）
- **バックエンド**: Ruby on Rails 7.1+
- **データベース**: PostgreSQL

## 🛠️ 技術スタック

### バックエンド
- **フレームワーク**: Ruby on Rails 7.1+ (API mode)
- **認証**: Devise + JWT
- **画像処理**: Active Storage + ImageMagick
- **バックグラウンドジョブ**: Sidekiq + Redis
- **API仕様**: JSON:API準拠
- **テスト**: RSpec + FactoryBot
- **コード品質**: RuboCop

### インフラ（スケーラビリティ重視）
- **データベース**: PostgreSQL (AWS RDS or Railway)
- **キャッシュ**: Redis (ElastiCache or Railway)
- **ストレージ**: AWS S3 or Cloudinary
- **CDN**: CloudFront or Cloudinary
- **デプロイ**: Railway.app or Heroku (初期) → AWS ECS (将来)
- **CI/CD**: GitHub Actions
- **監視**: Sentry + LogDNA

### スケーラビリティ設計
- **水平スケーリング対応**: ステートレスAPI設計
- **データベース最適化**: インデックス戦略、N+1問題対策
- **キャッシュ戦略**: Fragment caching, Low-level caching
- **非同期処理**: メール送信、画像処理などをバックグラウンド化
- **CDN配信**: 静的アセット・画像の高速配信

---

## 📅 2ヶ月開発スケジュール

```
Week 1-2: Rails環境構築 + DB設計 + 認証基盤
Week 3-4: プロフィール管理 + 画像アップロード
Week 5-6: API最適化 + フロント連携
Week 7-8: テスト + デプロイ + 本番リリース
```

---

## 📆 Week 1-2: Rails環境構築 + 認証システム

### Week 1: プロジェクトセットアップ + DB設計

#### 目標
Rails APIサーバーの基盤構築とデータベース設計の完成

#### タスク

**環境構築（Day 1-2）**
```bash
# Rails API mode プロジェクト作成
rails new community-platform-api \
  --api \
  --database=postgresql \
  --skip-test \
  --skip-bundle

# 必須 Gem 追加
# Gemfile
gem 'devise'
gem 'devise-jwt'
gem 'jsonapi-serializer'
gem 'rack-cors'
gem 'sidekiq'
gem 'redis'
gem 'aws-sdk-s3'
gem 'image_processing'
gem 'pagy'

# 開発・テスト用
group :development, :test do
  gem 'rspec-rails'
  gem 'factory_bot_rails'
  gem 'faker'
  gem 'pry-rails'
  gem 'bullet'
end

group :development do
  gem 'rubocop-rails'
  gem 'annotate'
end

bundle install
```

**データベース設計（Day 2-3）**

```ruby
# db/migrate/20250113000001_create_users.rb
class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users do |t|
      t.string :email, null: false
      t.string :encrypted_password, null: false
      t.string :reset_password_token
      t.datetime :reset_password_sent_at
      t.datetime :remember_created_at
      t.integer :sign_in_count, default: 0
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string :current_sign_in_ip
      t.string :last_sign_in_ip
      t.string :role, default: 'member', null: false
      t.boolean :active, default: true, null: false
      t.timestamps

      t.index :email, unique: true
      t.index :reset_password_token, unique: true
    end
  end
end

# db/migrate/20250113000002_create_profiles.rb
class CreateProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :profiles do |t|
      t.references :user, null: false, foreign_key: true, index: true
      t.string :nickname, null: false
      t.string :diagnosis # 16Personalities診断結果
      t.text :bio
      t.string :avatar_url
      t.string :cover_image_url
      t.date :birthday
      t.string :location
      t.string :website
      t.jsonb :social_links, default: {}
      t.jsonb :interests, default: []
      t.timestamps

      t.index :nickname
    end
  end
end

# db/migrate/20250113000003_create_jwt_denylist.rb
class CreateJwtDenylist < ActiveRecord::Migration[7.1]
  def change
    create_table :jwt_denylists do |t|
      t.string :jti, null: false
      t.datetime :exp, null: false

      t.index :jti
    end
  end
end
```

**設定ファイル（Day 3-4）**

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV.fetch('FRONTEND_URL', 'http://localhost:3000')
    
    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      credentials: true,
      expose: ['Authorization']
  end
end

# config/initializers/devise.rb
Devise.setup do |config|
  config.mailer_sender = ENV.fetch('MAILER_FROM', 'noreply@example.com')
  config.jwt do |jwt|
    jwt.secret = ENV.fetch('DEVISE_JWT_SECRET_KEY')
    jwt.dispatch_requests = [
      ['POST', %r{^/api/v1/auth/login$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/api/v1/auth/logout$}]
    ]
    jwt.expiration_time = 24.hours.to_i
  end
end

# config/initializers/sidekiq.rb
Sidekiq.configure_server do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }
end

Sidekiq.configure_client do |config|
  config.redis = { url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/1') }
end
```

**API設計書作成（Day 4-5）**
- エンドポイント一覧
- リクエスト/レスポンス仕様（JSON:API形式）
- エラーハンドリング仕様

#### 成果物
- ✅ Rails API プロジェクト構築完了
- ✅ データベース設計完了（マイグレーション作成）
- ✅ 開発環境が動作（`rails s` で起動確認）
- ✅ API設計書（Notion or Markdown）

---

### Week 2: 認証システム実装

#### 目標
セキュアなJWT認証基盤の完成

#### タスク

**モデル実装（Day 1-2）**

```ruby
# app/models/user.rb
class User < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable,
         :trackable,
         :jwt_authenticatable, jwt_revocation_strategy: JwtDenylist

  has_one :profile, dependent: :destroy

  accepts_nested_attributes_for :profile

  after_create :create_default_profile

  enum role: { member: 'member', manager: 'manager', admin: 'admin' }

  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :role, presence: true

  private

  def create_default_profile
    create_profile!(nickname: email.split('@').first)
  end
end

# app/models/profile.rb
class Profile < ApplicationRecord
  belongs_to :user

  has_one_attached :avatar
  has_one_attached :cover_image

  validates :nickname, presence: true, length: { minimum: 2, maximum: 30 }
  validates :bio, length: { maximum: 500 }
  validates :website, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true }

  # 画像バリデーション
  validates :avatar, content_type: ['image/png', 'image/jpg', 'image/jpeg'],
                     size: { less_than: 5.megabytes }
  validates :cover_image, content_type: ['image/png', 'image/jpg', 'image/jpeg'],
                          size: { less_than: 10.megabytes }
end

# app/models/jwt_denylist.rb
class JwtDenylist < ApplicationRecord
  include Devise::JWT::RevocationStrategies::Denylist

  self.table_name = 'jwt_denylists'
end
```

**コントローラー実装（Day 2-4）**

```ruby
# app/controllers/api/v1/auth/registrations_controller.rb
module Api
  module V1
    module Auth
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: {
              message: 'Signed up successfully.',
              user: UserSerializer.new(resource).serializable_hash
            }, status: :created
          else
            render json: {
              message: 'User could not be created.',
              errors: resource.errors.full_messages
            }, status: :unprocessable_entity
          end
        end
      end
    end
  end
end

# app/controllers/api/v1/auth/sessions_controller.rb
module Api
  module V1
    module Auth
      class SessionsController < Devise::SessionsController
        respond_to :json

        private

        def respond_with(resource, _opts = {})
          render json: {
            message: 'Logged in successfully.',
            user: UserSerializer.new(resource).serializable_hash
          }, status: :ok
        end

        def respond_to_on_destroy
          if current_user
            render json: { message: 'Logged out successfully.' }, status: :ok
          else
            render json: { message: 'No active session.' }, status: :unauthorized
          end
        end
      end
    end
  end
end
```

**Serializer実装（Day 4）**

```ruby
# app/serializers/user_serializer.rb
class UserSerializer
  include JSONAPI::Serializer

  attributes :email, :role, :created_at

  has_one :profile, serializer: ProfileSerializer
end

# app/serializers/profile_serializer.rb
class ProfileSerializer
  include JSONAPI::Serializer

  attributes :nickname, :diagnosis, :bio, :birthday, :location, :website, 
             :social_links, :interests, :created_at, :updated_at

  attribute :avatar_url do |profile|
    profile.avatar.attached? ? Rails.application.routes.url_helpers.rails_blob_url(profile.avatar, only_path: false) : nil
  end

  attribute :cover_image_url do |profile|
    profile.cover_image.attached? ? Rails.application.routes.url_helpers.rails_blob_url(profile.cover_image, only_path: false) : nil
  end
end
```

**ルーティング（Day 5）**

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      devise_for :users,
                 controllers: {
                   registrations: 'api/v1/auth/registrations',
                   sessions: 'api/v1/auth/sessions'
                 }

      # カスタム認証エンドポイント
      namespace :auth do
        post 'signup', to: 'registrations#create'
        post 'login', to: 'sessions#create'
        delete 'logout', to: 'sessions#destroy'
        get 'me', to: 'current_user#show'
      end
    end
  end
end
```

**テスト実装（Day 5）**

```ruby
# spec/requests/api/v1/auth/registrations_spec.rb
require 'rails_helper'

RSpec.describe 'Api::V1::Auth::Registrations', type: :request do
  describe 'POST /api/v1/auth/signup' do
    context 'with valid parameters' do
      let(:valid_attributes) do
        {
          user: {
            email: 'test@example.com',
            password: 'password123',
            password_confirmation: 'password123'
          }
        }
      end

      it 'creates a new user' do
        expect {
          post '/api/v1/auth/signup', params: valid_attributes
        }.to change(User, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(json_response['message']).to eq('Signed up successfully.')
      end

      it 'creates a default profile' do
        post '/api/v1/auth/signup', params: valid_attributes
        user = User.last
        expect(user.profile).to be_present
        expect(user.profile.nickname).to eq('test')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_attributes) do
        {
          user: {
            email: 'invalid-email',
            password: 'short'
          }
        }
      end

      it 'does not create a new user' do
        expect {
          post '/api/v1/auth/signup', params: invalid_attributes
        }.not_to change(User, :count)

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
```

#### 成果物
- ✅ JWT認証が動作（signup, login, logout）
- ✅ 自動プロフィール作成
- ✅ RSpec テスト実装済み
- ✅ Postman/Insomnia でAPI動作確認

---

## 📆 Week 3-4: プロフィール管理 + 画像アップロード

### Week 3: プロフィールCRUD実装

#### 目標
プロフィール取得・更新APIの完成

#### タスク

**コントローラー実装（Day 1-3）**

```ruby
# app/controllers/api/v1/profiles_controller.rb
module Api
  module V1
    class ProfilesController < ApplicationController
      before_action :authenticate_user!, except: [:index, :show]
      before_action :set_profile, only: [:show, :update]
      before_action :authorize_profile_owner!, only: [:update]

      # GET /api/v1/profiles
      def index
        @profiles = Profile.includes(:user, avatar_attachment: :blob)
                           .page(params[:page])
                           .per(params[:per_page] || 20)

        render json: ProfileSerializer.new(@profiles, include: [:user]).serializable_hash,
               status: :ok
      end

      # GET /api/v1/profiles/:id
      def show
        render json: ProfileSerializer.new(@profile, include: [:user]).serializable_hash,
               status: :ok
      end

      # PUT /api/v1/profiles/:id
      def update
        if @profile.update(profile_params)
          render json: ProfileSerializer.new(@profile).serializable_hash,
                 status: :ok
        else
          render json: { errors: @profile.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      private

      def set_profile
        @profile = Profile.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Profile not found' }, status: :not_found
      end

      def authorize_profile_owner!
        unless @profile.user_id == current_user.id
          render json: { error: 'Unauthorized' }, status: :forbidden
        end
      end

      def profile_params
        params.require(:profile).permit(
          :nickname, :diagnosis, :bio, :birthday, :location, :website,
          social_links: {}, interests: []
        )
      end
    end
  end
end

# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      before_action :authenticate_user!, except: [:show]

      # GET /api/v1/users/:id
      def show
        @user = User.includes(profile: { avatar_attachment: :blob }).find(params[:id])
        render json: UserSerializer.new(@user, include: [:profile]).serializable_hash,
               status: :ok
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'User not found' }, status: :not_found
      end
    end
  end
end
```

**クエリ最適化（Day 3-4）**

```ruby
# app/queries/profile_query.rb
class ProfileQuery
  def initialize(relation = Profile.all)
    @relation = relation.extending(Scopes)
  end

  def call
    @relation
  end

  def with_user
    @relation = @relation.includes(:user)
    self
  end

  def with_avatar
    @relation = @relation.includes(avatar_attachment: :blob)
    self
  end

  def search(keyword)
    return self if keyword.blank?

    @relation = @relation.where('nickname ILIKE ?', "%#{keyword}%")
    self
  end

  def by_diagnosis(diagnosis)
    return self if diagnosis.blank?

    @relation = @relation.where(diagnosis: diagnosis)
    self
  end

  module Scopes
    def active
      joins(:user).where(users: { active: true })
    end
  end
end
```

**ルーティング追加（Day 4）**

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 既存の認証ルート...

      resources :users, only: [:show]
      resources :profiles, only: [:index, :show, :update]
    end
  end
end
```

**テスト実装（Day 5）**

```ruby
# spec/requests/api/v1/profiles_spec.rb
require 'rails_helper'

RSpec.describe 'Api::V1::Profiles', type: :request do
  let(:user) { create(:user) }
  let(:profile) { user.profile }
  let(:other_user) { create(:user) }

  describe 'GET /api/v1/profiles/:id' do
    it 'returns the profile' do
      get "/api/v1/profiles/#{profile.id}"

      expect(response).to have_http_status(:ok)
      expect(json_response['data']['attributes']['nickname']).to eq(profile.nickname)
    end
  end

  describe 'PUT /api/v1/profiles/:id' do
    context 'when authenticated as profile owner' do
      before { sign_in user }

      it 'updates the profile' do
        put "/api/v1/profiles/#{profile.id}", params: {
          profile: { nickname: 'Updated Name', bio: 'New bio' }
        }

        expect(response).to have_http_status(:ok)
        expect(profile.reload.nickname).to eq('Updated Name')
        expect(profile.bio).to eq('New bio')
      end
    end

    context 'when not the profile owner' do
      before { sign_in other_user }

      it 'returns forbidden' do
        put "/api/v1/profiles/#{profile.id}", params: {
          profile: { nickname: 'Hacked' }
        }

        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
```

#### 成果物
- ✅ プロフィール一覧・詳細・更新API
- ✅ N+1問題対策（includes使用）
- ✅ ページネーション実装
- ✅ 権限チェック実装
- ✅ RSpecテスト完了

---

### Week 4: 画像アップロード実装

#### 目標
Active Storageでの画像管理とS3連携

#### タスク

**Active Storage設定（Day 1）**

```bash
rails active_storage:install
rails db:migrate
```

```ruby
# config/storage.yml
local:
  service: Disk
  root: <%= Rails.root.join("storage") %>

amazon:
  service: S3
  access_key_id: <%= ENV['AWS_ACCESS_KEY_ID'] %>
  secret_access_key: <%= ENV['AWS_SECRET_ACCESS_KEY'] %>
  region: <%= ENV['AWS_REGION'] %>
  bucket: <%= ENV['AWS_S3_BUCKET'] %>

# config/environments/production.rb
config.active_storage.service = :amazon

# config/environments/development.rb
config.active_storage.service = :local
```

**画像アップロードコントローラー（Day 2-3）**

```ruby
# app/controllers/api/v1/profiles/avatars_controller.rb
module Api
  module V1
    module Profiles
      class AvatarsController < ApplicationController
        before_action :authenticate_user!
        before_action :set_profile
        before_action :authorize_profile_owner!

        # POST /api/v1/profiles/:profile_id/avatar
        def create
          if @profile.avatar.attach(avatar_params)
            ImageProcessingJob.perform_async(@profile.id, 'avatar')
            
            render json: ProfileSerializer.new(@profile).serializable_hash,
                   status: :ok
          else
            render json: { errors: @profile.errors.full_messages },
                   status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/profiles/:profile_id/avatar
        def destroy
          @profile.avatar.purge
          render json: { message: 'Avatar deleted successfully' }, status: :ok
        end

        private

        def set_profile
          @profile = Profile.find(params[:profile_id])
        end

        def authorize_profile_owner!
          unless @profile.user_id == current_user.id
            render json: { error: 'Unauthorized' }, status: :forbidden
          end
        end

        def avatar_params
          params.require(:avatar)
        end
      end
    end
  end
end

# app/controllers/api/v1/profiles/cover_images_controller.rb
module Api
  module V1
    module Profiles
      class CoverImagesController < ApplicationController
        before_action :authenticate_user!
        before_action :set_profile
        before_action :authorize_profile_owner!

        # POST /api/v1/profiles/:profile_id/cover_image
        def create
          if @profile.cover_image.attach(cover_image_params)
            ImageProcessingJob.perform_async(@profile.id, 'cover_image')
            
            render json: ProfileSerializer.new(@profile).serializable_hash,
                   status: :ok
          else
            render json: { errors: @profile.errors.full_messages },
                   status: :unprocessable_entity
          end
        end

        # DELETE /api/v1/profiles/:profile_id/cover_image
        def destroy
          @profile.cover_image.purge
          render json: { message: 'Cover image deleted successfully' }, status: :ok
        end

        private

        def set_profile
          @profile = Profile.find(params[:profile_id])
        end

        def authorize_profile_owner!
          unless @profile.user_id == current_user.id
            render json: { error: 'Unauthorized' }, status: :forbidden
          end
        end

        def cover_image_params
          params.require(:cover_image)
        end
      end
    end
  end
end
```

**画像処理バックグラウンドジョブ（Day 3-4）**

```ruby
# app/jobs/image_processing_job.rb
class ImageProcessingJob
  include Sidekiq::Job

  def perform(profile_id, image_type)
    profile = Profile.find(profile_id)
    image = profile.send(image_type)
    
    return unless image.attached?

    # サムネイル生成（Avatar用）
    if image_type == 'avatar'
      image.variant(
        resize_to_limit: [200, 200],
        format: :webp,
        saver: { quality: 80 }
      ).processed
    end

    # カバー画像のリサイズ
    if image_type == 'cover_image'
      image.variant(
        resize_to_limit: [1200, 400],
        format: :webp,
        saver: { quality: 85 }
      ).processed
    end

    Rails.logger.info "Image processing completed for profile #{profile_id}"
  rescue StandardError => e
    Rails.logger.error "Image processing failed: #{e.message}"
    Sentry.capture_exception(e) if defined?(Sentry)
  end
end
```

**ルーティング追加（Day 4）**

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # 既存ルート...

      resources :profiles, only: [:index, :show, :update] do
        resource :avatar, only: [:create, :destroy], controller: 'profiles/avatars'
        resource :cover_image, only: [:create, :destroy], controller: 'profiles/cover_images'
      end
    end
  end
end
```

**テスト実装（Day 5）**

```ruby
# spec/requests/api/v1/profiles/avatars_spec.rb
require 'rails_helper'

RSpec.describe 'Api::V1::Profiles::Avatars', type: :request do
  let(:user) { create(:user) }
  let(:profile) { user.profile }

  describe 'POST /api/v1/profiles/:profile_id/avatar' do
    before { sign_in user }

    context 'with valid image' do
      let(:avatar) { fixture_file_upload('spec/fixtures/files/avatar.jpg', 'image/jpeg') }

      it 'attaches the avatar' do
        post "/api/v1/profiles/#{profile.id}/avatar", params: { avatar: avatar }

        expect(response).to have_http_status(:ok)
        expect(profile.reload.avatar).to be_attached
      end

      it 'enqueues image processing job' do
        expect {
          post "/api/v1/profiles/#{profile.id}/avatar", params: { avatar: avatar }
        }.to have_enqueued_job(ImageProcessingJob)
      end
    end
  end

  describe 'DELETE /api/v1/profiles/:profile_id/avatar' do
    before do
      sign_in user
      profile.avatar.attach(
        io: File.open('spec/fixtures/files/avatar.jpg'),
        filename: 'avatar.jpg',
        content_type: 'image/jpeg'
      )
    end

    it 'deletes the avatar' do
      delete "/api/v1/profiles/#{profile.id}/avatar"

      expect(response).to have_http_status(:ok)
      expect(profile.reload.avatar).not_to be_attached
    end
  end
end
```

#### 成果物
- ✅ Active Storage セットアップ完了
- ✅ 画像アップロードAPI実装
- ✅ バックグラウンド画像処理
- ✅ S3連携設定完了
- ✅ RSpecテスト完了

---

## 📆 Week 5-6: API最適化 + フロント連携

### Week 5: パフォーマンス最適化

#### 目標
API応答速度の改善とキャッシュ戦略の実装

#### タスク

**N+1問題対策（Day 1-2）**

```ruby
# config/initializers/bullet.rb
if Rails.env.development?
  Bullet.enable = true
  Bullet.alert = true
  Bullet.bullet_logger = true
  Bullet.console = true
  Bullet.rails_logger = true
end

# app/controllers/concerns/query_optimizer.rb
module QueryOptimizer
  extend ActiveSupport::Concern

  def optimized_profiles
    Profile.includes(:user, avatar_attachment: :blob, cover_image_attachment: :blob)
           .references(:user)
  end
end
```

**キャッシュ実装（Day 2-4）**

```ruby
# app/models/profile.rb
class Profile < ApplicationRecord
  # キャッシュキー
  def cache_key_with_version
    super + avatar_cache_key + cover_image_cache_key
  end

  private

  def avatar_cache_key
    avatar.attached? ? "-avatar-#{avatar.blob.checksum}" : ''
  end

  def cover_image_cache_key
    cover_image.attached? ? "-cover-#{cover_image.blob.checksum}" : ''
  end
end

# app/controllers/api/v1/profiles_controller.rb
def index
  cache_key = "profiles-index-page-#{params[:page]}-per-#{params[:per_page]}"
  
  @profiles = Rails.cache.fetch(cache_key, expires_in: 10.minutes) do
    ProfileQuery.new
                .with_user
                .with_avatar
                .call
                .page(params[:page])
                .per(params[:per_page] || 20)
  end

  render json: ProfileSerializer.new(@profiles).serializable_hash
end

def show
  @profile = Rails.cache.fetch(['profile', @profile], expires_in: 1.hour) do
    @profile
  end

  render json: ProfileSerializer.new(@profile).serializable_hash
end
```

**レート制限実装（Day 4）**

```ruby
# Gemfile
gem 'rack-attack'

# config/initializers/rack_attack.rb
class Rack::Attack
  # ログイン試行制限
  throttle('logins/ip', limit: 5, period: 60.seconds) do |req|
    if req.path == '/api/v1/auth/login' && req.post?
      req.ip
    end
  end

  # API全体のレート制限
  throttle('api/ip', limit: 300, period: 5.minutes) do |req|
    req.ip if req.path.start_with?('/api/')
  end

  # 認証済みユーザー用のレート制限
  throttle('authenticated_api', limit: 1000, period: 1.hour) do |req|
    if req.path.start_with?('/api/') && req.env['warden'].user
      req.env['warden'].user.id
    end
  end
end

# config/application.rb
config.middleware.use Rack::Attack
```

**データベースインデックス追加（Day 5）**

```ruby
# db/migrate/20250113000010_add_performance_indexes.rb
class AddPerformanceIndexes < ActiveRecord::Migration[7.1]
  def change
    # プロフィール検索用
    add_index :profiles, :diagnosis
    add_index :profiles, :created_at
    
    # 複合インデックス
    add_index :profiles, [:user_id, :nickname]
    
    # JSONB用のGINインデックス（PostgreSQL）
    add_index :profiles, :social_links, using: :gin
    add_index :profiles, :interests, using: :gin
  end
end
```

#### 成果物
- ✅ N+1問題解決
- ✅ Redisキャッシュ実装
- ✅ レート制限実装
- ✅ データベースインデックス最適化
- ✅ API応答速度 < 200ms 達成

---

### Week 6: フロントエンド連携

#### 目標
Next.jsフロントエンドとの完全統合

#### タスク

**API クライアント実装（Next.js側）（Day 1-2）**

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// リクエストインターセプター（JWT付与）
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// レスポンスインターセプター（エラーハンドリング）
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// lib/api/auth.ts
import apiClient from './client';

export const authApi = {
  signup: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/signup', {
      user: { email, password, password_confirmation: password },
    });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post('/auth/login', {
      user: { email, password },
    });
    const token = response.headers.authorization;
    if (token) {
      localStorage.setItem('authToken', token);
    }
    return response.data;
  },

  logout: async () => {
    await apiClient.delete('/auth/logout');
    localStorage.removeItem('authToken');
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },
};

// lib/api/profiles.ts
import apiClient from './client';

export const profileApi = {
  getProfiles: async (page = 1, perPage = 20) => {
    const response = await apiClient.get('/profiles', {
      params: { page, per_page: perPage },
    });
    return response.data;
  },

  getProfile: async (id: string) => {
    const response = await apiClient.get(`/profiles/${id}`);
    return response.data;
  },

  updateProfile: async (id: string, data: any) => {
    const response = await apiClient.put(`/profiles/${id}`, {
      profile: data,
    });
    return response.data;
  },

  uploadAvatar: async (profileId: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiClient.post(
      `/profiles/${profileId}/avatar`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  deleteAvatar: async (profileId: string) => {
    const response = await apiClient.delete(`/profiles/${profileId}/avatar`);
    return response.data;
  },
};
```

**AuthContext更新（Next.js側）（Day 2-3）**

```typescript
// contexts/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';

interface User {
  id: string;
  email: string;
  role: string;
  profile: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  };
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          const response = await authApi.getCurrentUser();
          setCurrentUser(response.data.attributes);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        localStorage.removeItem('authToken');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    setCurrentUser(response.user.data.attributes);
  };

  const signup = async (email: string, password: string) => {
    const response = await authApi.signup(email, password);
    setCurrentUser(response.user.data.attributes);
  };

  const logout = async () => {
    await authApi.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**統合テスト（Day 4-5）**

```ruby
# spec/requests/api/v1/integration_spec.rb
require 'rails_helper'

RSpec.describe 'Full User Flow Integration', type: :request do
  it 'completes signup, login, profile update, and avatar upload flow' do
    # 1. サインアップ
    post '/api/v1/auth/signup', params: {
      user: {
        email: 'integration@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      }
    }
    
    expect(response).to have_http_status(:created)
    user_id = json_response['user']['data']['id']
    profile_id = json_response['user']['data']['relationships']['profile']['data']['id']
    
    # 2. ログイン
    post '/api/v1/auth/login', params: {
      user: {
        email: 'integration@example.com',
        password: 'password123'
      }
    }
    
    expect(response).to have_http_status(:ok)
    token = response.headers['Authorization']
    
    # 3. プロフィール更新
    put "/api/v1/profiles/#{profile_id}",
        headers: { 'Authorization' => token },
        params: {
          profile: {
            nickname: 'Integration Test User',
            bio: 'This is a test bio'
          }
        }
    
    expect(response).to have_http_status(:ok)
    expect(json_response['data']['attributes']['nickname']).to eq('Integration Test User')
    
    # 4. アバターアップロード
    avatar = fixture_file_upload('spec/fixtures/files/avatar.jpg', 'image/jpeg')
    post "/api/v1/profiles/#{profile_id}/avatar",
         headers: { 'Authorization' => token },
         params: { avatar: avatar }
    
    expect(response).to have_http_status(:ok)
    expect(json_response['data']['attributes']['avatar_url']).to be_present
  end
end
```

#### 成果物
- ✅ Next.js APIクライアント実装
- ✅ AuthContext のバックエンド連携完了
- ✅ プロフィール管理UI連携完了
- ✅ 画像アップロード連携完了
- ✅ E2E統合テスト完了

---

## 📆 Week 7-8: テスト + デプロイ + リリース

### Week 7: テスト + セキュリティ強化

#### 目標
本番リリースに向けた品質保証

#### タスク

**セキュリティ対策（Day 1-2）**

```ruby
# Gemfile
gem 'brakeman'
gem 'bundler-audit'

# セキュリティスキャン
bundle exec brakeman
bundle exec bundle-audit check --update

# config/initializers/content_security_policy.rb
Rails.application.config.content_security_policy do |policy|
  policy.default_src :self, :https
  policy.font_src    :self, :https, :data
  policy.img_src     :self, :https, :data, :blob
  policy.object_src  :none
  policy.script_src  :self, :https
  policy.style_src   :self, :https
end

# config/application.rb
config.force_ssl = true if Rails.env.production?
config.ssl_options = { hsts: { subdomains: true, preload: true } }
```

**テストカバレッジ向上（Day 2-4）**

```ruby
# Gemfile
gem 'simplecov', require: false, group: :test

# spec/spec_helper.rb
require 'simplecov'
SimpleCov.start 'rails' do
  add_filter '/spec/'
  add_filter '/config/'
  add_filter '/vendor/'
  
  add_group 'Models', 'app/models'
  add_group 'Controllers', 'app/controllers'
  add_group 'Serializers', 'app/serializers'
  add_group 'Jobs', 'app/jobs'
end

# 目標カバレッジ: 80%以上
```

**パフォーマンステスト（Day 4-5）**

```ruby
# spec/performance/api_performance_spec.rb
require 'rails_helper'

RSpec.describe 'API Performance', type: :request do
  let(:user) { create(:user) }
  let!(:profiles) { create_list(:profile, 50) }

  before { sign_in user }

  it 'loads profiles index within 200ms' do
    start_time = Time.current
    
    get '/api/v1/profiles'
    
    response_time = (Time.current - start_time) * 1000
    
    expect(response).to have_http_status(:ok)
    expect(response_time).to be < 200
  end

  it 'loads single profile within 100ms' do
    start_time = Time.current
    
    get "/api/v1/profiles/#{profiles.first.id}"
    
    response_time = (Time.current - start_time) * 1000
    
    expect(response).to have_http_status(:ok)
    expect(response_time).to be < 100
  end
end
```

#### 成果物
- ✅ セキュリティスキャン完了（脆弱性ゼロ）
- ✅ テストカバレッジ > 80%
- ✅ パフォーマンステスト合格
- ✅ Railsベストプラクティス準拠

---

### Week 8: デプロイ + ドキュメント + リリース

#### 目標
本番環境へのリリース

#### タスク

**Railway.app デプロイ（Day 1-2）**

```bash
# railway CLIインストール
npm install -g @railway/cli

# プロジェクト初期化
railway login
railway init

# 環境変数設定
railway variables set RAILS_ENV=production
railway variables set SECRET_KEY_BASE=$(rails secret)
railway variables set DEVISE_JWT_SECRET_KEY=$(rails secret)
railway variables set DATABASE_URL=<Railway PostgreSQL URL>
railway variables set REDIS_URL=<Railway Redis URL>
railway variables set AWS_ACCESS_KEY_ID=<your-key>
railway variables set AWS_SECRET_ACCESS_KEY=<your-secret>
railway variables set AWS_REGION=ap-northeast-1
railway variables set AWS_S3_BUCKET=<your-bucket>
railway variables set FRONTEND_URL=https://cocoty-cbjq88krm-kl-kis-projects.vercel.app

# デプロイ
railway up
```

**Procfile作成（Day 2）**

```
# Procfile
web: bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -C config/sidekiq.yml
release: bundle exec rails db:migrate
```

**CI/CD設定（Day 2-3）**

```yaml
# .github/workflows/rails-ci.yml
name: Rails CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
    - uses: actions/checkout@v3
    
    - name: Set up Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: 3.2
        bundler-cache: true
    
    - name: Install dependencies
      run: |
        sudo apt-get update
        sudo apt-get install -y imagemagick libvips
    
    - name: Setup database
      env:
        RAILS_ENV: test
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
        REDIS_URL: redis://localhost:6379/1
      run: |
        bundle exec rails db:create db:migrate
    
    - name: Run tests
      env:
        RAILS_ENV: test
        DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
        REDIS_URL: redis://localhost:6379/1
      run: |
        bundle exec rspec
    
    - name: Run security checks
      run: |
        bundle exec brakeman -q -z
        bundle exec bundle-audit check --update
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        files: ./coverage/.resultset.json
```

**API ドキュメント作成（Day 3-4）**

```ruby
# Gemfile
gem 'rswag'

# API仕様書生成
rails g rswag:install
rails rswag:specs:swaggerize

# spec/swagger_helper.rb
RSpec.configure do |config|
  config.swagger_root = Rails.root.join('swagger').to_s

  config.swagger_docs = {
    'v1/swagger.yaml' => {
      openapi: '3.0.1',
      info: {
        title: 'Community Platform API V1',
        version: 'v1',
        description: 'API documentation for Community Platform'
      },
      paths: {},
      servers: [
        {
          url: 'https://api.example.com',
          variables: {
            defaultHost: {
              default: 'api.example.com'
            }
          }
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: :http,
            scheme: :bearer,
            bearerFormat: 'JWT'
          }
        }
      }
    }
  }

  config.swagger_format = :yaml
end
```

**README更新（Day 4-5）**

```markdown
# Community Platform API

## 🚀 技術スタック
- Ruby on Rails 7.1+ (API mode)
- PostgreSQL 15
- Redis 7
- Sidekiq
- AWS S3

## 📦 セットアップ

### 必要要件
- Ruby 3.2+
- PostgreSQL 15+
- Redis 7+
- ImageMagick or libvips

### インストール
```bash
git clone https://github.com/your-org/community-platform-api.git
cd community-platform-api
bundle install
rails db:create db:migrate db:seed
```

### 環境変数
```bash
cp .env.example .env
# .envファイルを編集
```

### 起動
```bash
# Railsサーバー
rails s -p 4000

# Sidekiq（別ターミナル）
bundle exec sidekiq
```

## 📚 API ドキュメント
- Swagger UI: http://localhost:4000/api-docs
- APIエンドポイント一覧: [docs/api-endpoints.md](docs/api-endpoints.md)

## 🧪 テスト
```bash
bundle exec rspec
```

## 🚢 デプロイ
Railway.app を使用
```bash
railway up
```

## 📈 監視
- エラー監視: Sentry
- ログ: LogDNA
- パフォーマンス: New Relic (Optional)

## 📄 ライセンス
MIT
```

**リリース（Day 5）**

```bash
# タグ付け
git tag -a v1.0.0 -m "Initial release: Authentication & Profile Management"
git push origin v1.0.0

# リリースノート作成
# GitHub Releases で公開
```

#### 成果物
- ✅ 本番環境デプロイ完了（Railway.app）
- ✅ CI/CD パイプライン構築
- ✅ Swagger API ドキュメント公開
- ✅ README・運用マニュアル整備
- ✅ v1.0.0 リリース完了

---

## 🎯 2ヶ月後の完成機能

### ✅ 実装完了機能

**認証システム**
- ✅ JWT認証（signup, login, logout）
- ✅ トークンリフレッシュ
- ✅ パスワードリセット
- ✅ セキュリティ対策（bcrypt, CSRF, XSS, SQLインジェクション）
- ✅ レート制限

**プロフィール管理**
- ✅ プロフィール作成（自動）
- ✅ プロフィール取得・更新
- ✅ プロフィール一覧（ページネーション）
- ✅ プロフィール検索

**画像管理**
- ✅ アバター画像アップロード
- ✅ カバー画像アップロード
- ✅ 画像リサイズ（バックグラウンド処理）
- ✅ S3/Cloudinary 連携
- ✅ CDN配信

**パフォーマンス**
- ✅ N+1問題対策
- ✅ Redisキャッシュ
- ✅ データベースインデックス最適化
- ✅ API応答速度 < 200ms

**品質保証**
- ✅ RSpecテスト（カバレッジ > 80%）
- ✅ セキュリティスキャン
- ✅ CI/CD パイプライン
- ✅ API ドキュメント（Swagger）

---

## 📊 技術指標（2ヶ月後）

### 達成目標
- ✅ API応答時間: < 200ms
- ✅ エラー率: < 1%
- ✅ テストカバレッジ: > 80%
- ✅ セキュリティ脆弱性: ゼロ
- ✅ 稼働率: > 99.5%

---

## 🚀 Month 3以降の拡張（参考）

### Month 3-4: 投稿・イベント機能
- 投稿CRUD
- いいね・コメント
- イベント作成・参加管理
- 通知システム

### Month 5-6: チーム機能
- チーム作成・管理
- メンバー管理
- ロール・権限管理
- チーム専用タイムライン

### Month 7以降: スケールアップ
- AWS ECS/Fargate 移行
- マイクロサービス化検討
- リードレプリカ導入
- 全文検索（Elasticsearch）
- リアルタイム通知（Action Cable）

---

## ⚠️ リスク管理

### 技術的リスク
1. **Active Storage のパフォーマンス**
   - 対策: S3直接アップロード、CDN活用

2. **Railsのメモリ使用量**
   - 対策: Puma ワーカー数調整、Sidekiq導入

3. **PostgreSQLの負荷**
   - 対策: インデックス最適化、クエリチューニング

### スケジュールリスク
1. **想定外のバグ**
   - バッファ: Week 7で対応時間確保

2. **AWS/Railway設定トラブル**
   - 対策: 早めにデプロイ環境構築

---

## 💡 スケーラビリティのポイント

### 1. ステートレス設計
- JWTによるステートレス認証
- セッションをRedisで管理
- ファイルストレージは外部サービス（S3）

### 2. データベース最適化
- 適切なインデックス設計
- EXPLAIN ANALYZEでクエリ分析
- N+1問題の徹底排除

### 3. キャッシュ戦略
- Fragment caching（ビュー）
- Low-level caching（クエリ結果）
- CDN（静的アセット）

### 4. 非同期処理
- Sidekiq でバックグラウンドジョブ
- メール送信の非同期化
- 画像処理の非同期化

### 5. 水平スケーリング対応
- ロードバランサー対応設計
- アプリケーションサーバーの複数台運用
- データベースリードレプリカ（将来）

---

## 📚 学習リソース

### Rails関連
- [Rails Guides](https://guides.rubyonrails.org/)
- [RSpec Best Practices](https://www.betterspecs.org/)
- [Rails API Documentation](https://api.rubyonrails.org/)

### パフォーマンス
- [Bullet Gem](https://github.com/flyerhzm/bullet)
- [Rails Performance Guide](https://guides.rubyonrails.org/performance_testing.html)

### デプロイ
- [Railway.app Docs](https://docs.railway.app/)
- [Heroku Rails Guide](https://devcenter.heroku.com/articles/getting-started-with-rails7)

---

## ✅ リリース前チェックリスト

### 必須項目
- [ ] すべてのAPI エンドポイントが動作する
- [ ] 認証・認可が正しく機能する
- [ ] 画像アップロード・表示が動作する
- [ ] RSpec テストが全て通過する
- [ ] セキュリティスキャン完了（脆弱性ゼロ）
- [ ] 本番環境でスモークテスト完了
- [ ] 環境変数が正しく設定されている
- [ ] S3バケットが正しく設定されている
- [ ] Redis接続が正常
- [ ] Sidekiq が動作している
- [ ] エラー監視設定済み（Sentry）
- [ ] ログ収集設定済み
- [ ] API ドキュメント公開（Swagger）
- [ ] README 更新完了
- [ ] CORS設定確認

### 推奨項目
- [ ] データベースバックアップ設定
- [ ] ロールバック手順確認
- [ ] パフォーマンス監視設定
- [ ] アラート設定
- [ ] 障害対応マニュアル作成

---

**2ヶ月で本番運用可能なスケーラブルなRails APIを構築しましょう！🚀**

## 📝 補足: 次の拡張に向けて

このロードマップで構築したバックエンドは、以下の拡張に対応可能な設計です：

### すぐに追加可能な機能
- ✅ 投稿機能（Post モデル追加）
- ✅ いいね機能（Like モデル追加）
- ✅ コメント機能（Comment モデル追加）
- ✅ イベント機能（Event モデル追加）
- ✅ チーム機能（Team モデル追加）

### スケーリングパス
**Phase 1（〜100ユーザー）**: Railway.app 単一サーバー
**Phase 2（100〜1,000ユーザー）**: Railway.app 複数ワーカー + Redis
**Phase 3（1,000〜10,000ユーザー）**: AWS ECS/Fargate + RDS Multi-AZ
**Phase 4（10,000ユーザー〜）**: マイクロサービス化、リードレプリカ、Elasticsearch

この設計なら、ユーザー数が増えても段階的にスケールアップ可能です！
