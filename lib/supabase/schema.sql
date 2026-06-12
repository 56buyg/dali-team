-- DALI 数据库初始化 SQL
-- 在 Supabase SQL Editor 中执行此脚本

-- 1. profiles 表 —— 用户资料（用户名与 auth.users 关联）
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username   text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. user_images 表 —— 用户生成图片历史
CREATE TABLE IF NOT EXISTS public.user_images (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_type  text NOT NULL,          -- 工具标识: text-to-image, image-to-image, etc.
  prompt     text,                   -- 用户输入的 prompt（可选）
  image_urls jsonb NOT NULL DEFAULT '[]'::jsonb,  -- 图片 URL 列表
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_user_images_user_id ON public.user_images(user_id);
CREATE INDEX IF NOT EXISTS idx_user_images_created ON public.user_images(created_at DESC);

-- 3. RLS —— 用户只能读写自己的数据
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_images ENABLE ROW LEVEL SECURITY;

-- profiles RLS
DO $$ BEGIN
  CREATE POLICY "Users can read own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- user_images RLS
DO $$ BEGIN
  CREATE POLICY "Users can read own images"
    ON public.user_images FOR SELECT
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert own images"
    ON public.user_images FOR INSERT
    WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Users can delete own images"
    ON public.user_images FOR DELETE
    USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
