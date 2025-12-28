# 冷丶布丁的个人空间 - Supabase 配置说明

本指南将帮助您完成项目所需的所有 Supabase 后端配置。

## 1. 核心数据库初始化
请在 Supabase **SQL Editor** 中运行以下脚本，创建必要的表：

```sql
-- 如果已存在 tools 表，添加 external_url 字段
alter table public.tools add column if not exists external_url text;

-- 完整表定义参考
create table if not exists public.tools (
  id text primary key, 
  name text not null,
  description text,
  icon_name text, 
  category text,
  is_premium boolean default false,
  price numeric default 0,
  external_url text, -- 新增字段：用于链接到外部工具地址
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- (其他表结构... articles, profiles, comments)
```

## 2. 存储桶配置 (Storage)
为了支持文章封面的本地上传，您需要完成以下两步配置。

### 2.1 创建存储桶
1.  进入 Supabase 控制台的 **Storage** 页面。
2.  点击 **New Bucket**，创建一个名为 `covers` 的存储桶。
3.  **重要**：将 Bucket 设置为 **Public**（公开）。

### 2.2 配置存储桶访问策略 (Storage RLS)
**这是解决上传失败和图片无法显示的关键步骤。** 请进入 Supabase 控制台的 **Storage** > **Policies** 页面，为 `covers` 存储桶创建以下策略，或者直接在 **SQL Editor** 中运行此完整脚本。

**提示：** 如果您之前创建过相关策略，建议先删除旧的，再运行以下脚本以避免冲突。

```sql
-- 策略1: 允许任何人公开读取 (SELECT) 'covers' 桶中的文件。
-- 这是让图片能在网站上显示的前提。
CREATE POLICY "Public read access for covers"
ON storage.objects FOR SELECT
USING ( bucket_id = 'covers' );

-- 策略2: 只允许角色为 'admin' 的用户上传 (INSERT) 文件到 'covers' 桶。
-- 这需要 profiles 表有相应的 role 字段，并且当前登录用户在该表中的角色为 'admin'。
CREATE POLICY "Allow admins to upload to covers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'covers' AND
  (SELECT role from public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 策略3: 只允许 'admin' 更新 (UPDATE) 'covers' 桶中的文件。
CREATE POLICY "Allow admins to update files in covers"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'covers' AND
  (SELECT role from public.profiles WHERE id = auth.uid()) = 'admin'
);

-- 策略4: 只允许 'admin' 删除 (DELETE) 'covers' 桶中的文件。
CREATE POLICY "Allow admins to delete files in covers"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'covers' AND
  (SELECT role from public.profiles WHERE id = auth.uid()) = 'admin'
);
```

## 3. 自动同步触发器
此触发器用于在新用户注册时，自动在 `profiles` 表中创建对应的记录。
```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, is_premium_user)
  values (new.id, new.email, 'user', false);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## 4. 行级安全策略 (RLS) 配置 (重要)
如果您开启了表的 Row Level Security (RLS)，必须添加策略，否则所有数据操作（增删改查）都会被拒绝。这是导致 **“文章发布失败”** 的最常见原因。

请在 **SQL Editor** 中运行以下脚本：
```sql
-- 开启 articles 表的 RLS
alter table public.articles enable row level security;

-- 策略1: 允许任何人读取文章 (公开)
create policy "Allow public read access on articles"
on public.articles for select
using ( true );

-- 策略2: 允许登录用户创建文章
create policy "Allow authenticated users to create articles"
on public.articles for insert
to authenticated with check ( true );

-- 策略3: 允许文章作者更新或删除自己的文章
create policy "Allow authors to update and delete their own articles"
on public.articles for update
using ( auth.uid() = author_id );

create policy "Allow authors to delete their own articles"
on public.articles for delete
using ( auth.uid() = author_id );

-- (您可以为 comments 等其他表设置类似的策略)
```

---

## 5. 常见问题排查 (Troubleshooting)

### Q1: 上传图片时提示 "上传失败: Bucket not found"
*   **原因**: 您在 Supabase 项目的 Storage 中，尚未创建名为 `covers` 的存储桶。
*   **解决方案**: 请严格按照本指南第 **2.1** 节的步骤操作。

### Q2: 图片上传成功，但在网站上显示为破碎的图片或无法加载。
*   **原因**: 这是典型的 Storage 访问策略 (RLS) 未配置或配置错误。您的网站没有权限从存储桶读取图片。
*   **解决方案**: 请严格按照本指南第 **2.2** 节的步骤，添加允许公开读取 (`SELECT`) 的策略。

### Q3: 添加/编辑文章或工具后，点击保存没反应或提示失败。
*   **原因**: 这几乎总是因为您启用了表的 RLS (Row Level Security)，但没有设置允许操作的策略 (Policy)。
*   **解决方案**: 请严格按照本指南第 **4** 节的步骤，为相关数据表添加必要的安全策略。

### Q4: 上传图片时提示 "上传失败: new row violates row-level security policy"
*   **原因**: 您当前登录的用户（即使是管理员）没有被授予向存储桶上传文件的权限。Storage 的 `INSERT` 策略检查失败。
*   **解决方案**: 请严格按照本指南第 **2.2** 节的**最新指导**，完整地运行其中的 SQL 脚本。新的策略会精确地为角色是 `admin` 的用户授予上传、修改和删除权限。同时，请确保您在 `public.profiles` 表中的管理员账户，其 `role` 字段的值确实是 `admin`。

---
© 2026 冷丶布丁的个人空间.