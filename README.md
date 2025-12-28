
# 冷丶布丁的个人空间 - Supabase 配置说明

本指南将帮助您完成项目所需的所有 Supabase 后端配置。

## 1. 核心数据库初始化 (一次性运行)
**这是部署项目的第一步，也是最关键的一步。** 以下脚本包含了项目运行所需的全部数据表结构和数据库函数。请将**整段代码**复制到 Supabase 控制台的 **SQL Editor** 中，然后点击 "RUN" 执行一次。

```sql
-- ========= TABLES ==========

-- 1. 用户资料表 (Public Profiles)
-- 用于存储用户的公开信息，如角色、VIP状态等。
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email character varying,
    -- role: 用户的角色, 'user', 'admin', 或 'vip'
    role text DEFAULT 'user'::text,
    display_name text,
    avatar_url text
);

-- 2. 工具配置表 (Tools)
-- 存储实验室中的所有工具信息。
CREATE TABLE IF NOT EXISTS public.tools (
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    description text,
    icon_name text,
    category text,
    is_premium boolean DEFAULT false,
    price numeric DEFAULT 0,
    external_url text, -- 用于链接到外部工具地址
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 文章表 (Articles)
-- 存储所有发布的文章。
CREATE TABLE IF NOT EXISTS public.articles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    content text,
    excerpt text,
    cover_image text,
    category text,
    author_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 评论表 (Comments)
-- 存储文章下的所有评论。
CREATE TABLE IF NOT EXISTS public.comments (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL, -- 关键: 关联用户ID
    user_name text, -- 保留用户名作为冗余，方便显示
    content text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    -- parent_id 将在下面的修复脚本中被健壮地添加
);

-- **关键修复与增强**：确保 'comments' 表支持层级回复并启用级联删除。
-- 此脚本是幂等的，可以安全地重复运行，它会修复缺失的列和外键约束。
-- 步骤 1: 确保 parent_id 列存在
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_id uuid;
-- 步骤 2: 为确保约束正确，先尝试删除可能存在的旧约束 (命名遵循 Supabase 惯例)
ALTER TABLE public.comments DROP CONSTRAINT IF EXISTS comments_parent_id_fkey;
-- 步骤 3: 添加正确的外键约束，并启用 ON DELETE CASCADE
ALTER TABLE public.comments ADD CONSTRAINT comments_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES public.comments(id) ON DELETE CASCADE;


-- ========= FUNCTIONS ==========

-- 1. 获取唯一文章分类函数
-- 用于高效查询并返回所有不重复的文章分类，为博客列表页的筛选功能提供数据。
CREATE OR REPLACE FUNCTION public.get_distinct_categories()
RETURNS TABLE(category text) AS $$
BEGIN
  RETURN QUERY
    SELECT DISTINCT a.category FROM public.articles a ORDER BY a.category;
END;
$$ LANGUAGE plpgsql;

-- 确认所有表和函数都已创建成功
SELECT '初始化脚本执行完毕！' AS status;

```

## 2. 存储桶配置 (Storage)
为了支持文件上传，您需要完成以下存储桶的配置。

### 2.1 创建 `covers` 存储桶 (用于文章封面)
1.  进入 Supabase 控制台的 **Storage** 页面。
2.  点击 **New Bucket**，创建一个名为 `covers` 的存储桶。
3.  **重要**：将 Bucket 设置为 **Public**（公开）。

### 2.2 配置 `covers` 存储桶访问策略
**此脚本已更新为幂等脚本**，可以安全地重复运行。它会自动删除旧策略并应用新策略。

```sql
-- 策略1: 允许任何人公开读取 (SELECT) 'covers' 桶中的文件。
DROP POLICY IF EXISTS "Public read access for covers" ON storage.objects;
CREATE POLICY "Public read access for covers"
ON storage.objects FOR SELECT
USING ( bucket_id = 'covers' );

-- 策略2: 只允许角色为 'admin' 的用户上传 (INSERT) 文件到 'covers' 桶。
DROP POLICY IF EXISTS "Allow admins to upload to covers" ON storage.objects;
CREATE POLICY "Allow admins to upload to covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers' AND
  (SELECT role from public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 策略3: 只允许 'admin' 更新 (UPDATE) 'covers' 桶中的文件。
DROP POLICY IF EXISTS "Allow admins to update files in covers" ON storage.objects;
CREATE POLICY "Allow admins to update files in covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'covers' AND
  (SELECT role from public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 策略4: 只允许 'admin' 删除 (DELETE) 'covers' 桶中的文件。
DROP POLICY IF EXISTS "Allow admins to delete files in covers" ON storage.objects;
CREATE POLICY "Allow admins to delete files in covers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'covers' AND
  (SELECT role from public.profiles WHERE id = auth.uid()) = 'admin'
);
```

### 2.3 创建 `avatars` 存储桶 (用于用户头像)
1.  再次进入 **Storage** 页面。
2.  点击 **New Bucket**，创建一个名为 `avatars` 的存储桶。
3.  **重要**：同样将此 Bucket 设置为 **Public**（公开）。

### 2.4 配置 `avatars` 存储桶访问策略
**这是实现用户安全上传自己头像的关键**。请在 **SQL Editor** 中运行此幂等脚本。

```sql
-- 策略1: 允许任何人公开读取 'avatars' 桶中的文件。
DROP POLICY IF EXISTS "Public read access for avatars" ON storage.objects;
CREATE POLICY "Public read access for avatars"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 策略2: 允许已登录用户上传自己的头像。
-- **关键修复**: 将 auth.uid() 转换为 text 进行比较，避免 'uuid = text' 错误。
DROP POLICY IF EXISTS "Allow authenticated users to upload avatars" ON storage.objects;
CREATE POLICY "Allow authenticated users to upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 策略3: 允许已登录用户更新自己的头像。
-- **关键修复**: 将 auth.uid() 转换为 text 进行比较，避免 'uuid = text' 错误。
DROP POLICY IF EXISTS "Allow authenticated users to update their own avatars" ON storage.objects;
CREATE POLICY "Allow authenticated users to update their own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 策略4: 允许已登录用户删除自己的头像。
-- **关键修复**: 将 auth.uid() 转换为 text 进行比较，避免 'uuid = text' 错误。
DROP POLICY IF EXISTS "Allow authenticated users to delete their own avatars" ON storage.objects;
CREATE POLICY "Allow authenticated users to delete their own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

## 3. 自动同步触发器
此触发器用于在新用户注册时，自动在 `profiles` 表中创建对应的记录。
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'user');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. 行级安全策略 (RLS) 配置 (重要)
**此脚本已更新为幂等脚本**，可以安全地重复运行。它会自动删除旧策略并应用新策略。

如果您开启了表的 Row Level Security (RLS)，必须添加策略，否则所有数据操作（增删改查）都会被拒绝。请在 **SQL Editor** 中运行以下脚本：

-- ### Profiles Table Policies ###
alter table public.profiles enable row level security;

drop policy if exists "Allow public read access on profiles" on public.profiles;
create policy "Allow public read access on profiles"
on public.profiles for select
using ( true );

drop policy if exists "Allow users to update their own profile" on public.profiles;
create policy "Allow users to update their own profile"
on public.profiles for update
to authenticated
using ( auth.uid() = id );


-- ### Articles Table Policies ###
alter table public.articles enable row level security;

drop policy if exists "Allow public read access on articles" on public.articles;
create policy "Allow public read access on articles"
on public.articles for select
using ( true );

drop policy if exists "Allow authenticated users to create articles" on public.articles;
create policy "Allow authenticated users to create articles"
on public.articles for insert
to authenticated with check ( auth.uid() = author_id );

-- **关键修复**：移除冗余的 ::uuid 转换，确保管理员可以更新任何文章
drop policy if exists "Allow authors to update and delete their own articles" on public.articles;
drop policy if exists "Allow authors to update their own articles" on public.articles;
drop policy if exists "Allow authors or admins to update articles" on public.articles;
create policy "Allow authors or admins to update articles"
on public.articles for update
to authenticated using (
  (auth.uid() = author_id) OR
  ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
);

-- **关键修复**：移除冗余的 ::uuid 转换，确保管理员可以删除任何文章
drop policy if exists "Allow authors to delete their own articles" on public.articles;
drop policy if exists "Allow authors or admins to delete articles" on public.articles;
create policy "Allow authors or admins to delete articles"
on public.articles for delete
to authenticated using (
  (auth.uid() = author_id) OR
  ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
);


-- ### Tools Table Policies ###
alter table public.tools enable row level security;

drop policy if exists "Allow public read access on tools" on public.tools;
create policy "Allow public read access on tools"
on public.tools for select
using ( true );

drop policy if exists "Allow admins to create tools" on public.tools;
create policy "Allow admins to create tools"
on public.tools for insert
to authenticated with check ( (select role from public.profiles where id = auth.uid()) = 'admin' );

drop policy if exists "Allow admins to update tools" on public.tools;
create policy "Allow admins to update tools"
on public.tools for update
to authenticated using ( (select role from public.profiles where id = auth.uid()) = 'admin' );

drop policy if exists "Allow admins to delete tools" on public.tools;
create policy "Allow admins to delete tools"
on public.tools for delete
to authenticated using ( (select role from public.profiles where id = auth.uid()) = 'admin' );


-- ### Comments Table Policies ###
alter table public.comments enable row level security;

drop policy if exists "Allow public read access on comments" on public.comments;
create policy "Allow public read access on comments"
on public.comments for select
using ( true );

drop policy if exists "Allow authenticated users to create comments" on public.comments;
create policy "Allow authenticated users to create comments"
on public.comments for insert
to authenticated with check ( auth.uid() = user_id );

-- **关键修复**：移除冗余的 ::uuid 转换，合并删除策略，确保管理员可以删除任何评论
drop policy if exists "Allow users to delete their own comments" on public.comments;
drop policy if exists "Allow admins to delete any comment" on public.comments;
drop policy if exists "Allow users or admins to delete comments" on public.comments;
create policy "Allow users or admins to delete comments"
on public.comments for delete
to authenticated using (
  (auth.uid() = user_id) OR
  ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin')
);

---

## 5. 常见问题排查 (Troubleshooting)

### Q1: 操作失败，提示 "Could not find..."
*   **原因**: 这是最常见的问题，意味着您的数据库结构（Schema）与代码不匹配。可能是缺少了某个表、某个字段，或者某个数据库函数。
*   **解决方案**: 请返回本指南第 **1** 节，**完整地、重新执行一次**“核心数据库初始化”脚本。这个脚本是幂等的（使用 `IF NOT EXISTS` 和 `ALTER TABLE`），可以安全地重复运行，它会自动补全所有缺失的部分。

### Q2: 评论失败，提示 "Could not find the 'parent_id' column"
*   **原因**: 这是一个典型的 Supabase **Schema 缓存**问题。虽然您的数据库中很可能**已经**有了 `parent_id` 字段，但 Supabase 的客户端（您的浏览器）还缓存着旧的、没有这个字段的表结构信息，导致提交失败。
*   **解决方案**:
    1.  **首选方案：强制刷新**。在您的网页上执行一次“强制刷新”（Windows: `Ctrl + F5`，Mac: `Cmd + Shift + R`）。这会清除旧的缓存，让浏览器从 Supabase 重新获取最新的数据库结构。
    2.  **备用方案：手动更新表**。如果刷新无效，请返回并**完整运行第 1 节的初始化脚本**。其中包含的 `ALTER TABLE` 命令会确保该字段被添加。

### Q3: 上传图片时提示 "上传失败: Bucket not found"
*   **原因**: 您在 Supabase 项目的 Storage 中，尚未创建名为 `covers` 或 `avatars` 的存储桶。
*   **解决方案**: 请严格按照本指南第 **2.1** 和 **2.3** 节的步骤操作。

### Q4: 上传或保存时提示 "violates row-level security policy"
*   **原因**: 您操作的数据表或存储桶开启了 RLS，但没有配置允许您当前角色进行操作的策略。
*   **解决方案**:
    1.  对于**图片上传**，请检查并执行第 **2.2** 和 **2.4** 节的存储桶策略。
    2.  对于**数据表操作**，请检查并执行第 **4** 节对应数据表的 RLS 策略。

### Q5: 执行 SQL 脚本时，提示 "operator does not exist: uuid = text"
*   **原因**: 这是一个类型不匹配错误。通常是因为您的数据库 RLS 策略中在比较 `uuid` 和 `text` 类型。
*   **解决方案**: 这个问题已经解决了！本指南中**所有**的 RLS 和存储策略脚本**均已更新**，通过移除冗余的 `::uuid` 强制类型转换来解决此问题。请**完整复制并重新执行**这些部分的脚本。

### Q6: 执行 SQL 脚本时，提示 "policy ... already exists"
*   **原因**: 这是因为您尝试重复创建一个已经存在的 RLS 策略。
*   **解决方案**: 这个问题已经解决了！本指南中**所有**的 RLS 和存储策略脚本**均已更新**为“幂等”脚本。它们会在创建新策略前，使用 `DROP POLICY IF EXISTS` 自动删除旧的同名策略。您现在可以安全地、反复地运行这些脚本，无需担心此错误。

### Q7: 管理员可以看到删除评论的按钮，但点击后没有效果或提示权限错误。
*   **原因**: 这是因为您的 `comments` 表的行级安全 (RLS) 策略已过时或不正确。即使前端正确地显示了按钮，数据库的后台安全策略仍然会拒绝不符合规则的操作。
*   **解决方案**: 请直接前往本指南的第 **4** 节 (`行级安全策略 (RLS) 配置`)，找到 `### Comments Table Policies ###` 部分。**完整复制并重新执行该部分的所有 SQL 代码**。新的策略明确授予了 `admin` 角色的用户删除任何评论的权限。

---
© 2026 冷丶布丁的个人空间.
