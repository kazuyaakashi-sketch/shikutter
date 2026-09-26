-- =========================================================
-- シクッター MVP スキーマ
-- Supabase の SQL Editor にこのファイルをまるごと貼り付けて実行してください。
-- テーブルへの直接アクセスはすべて閉じ、サーバー（Vercel の API）から
-- service_role キーで関数を呼ぶ形にしています。
-- =========================================================

create extension if not exists pgcrypto;

-- ---------- 失敗談（公開用・AI編集済み） ----------
create table if not exists failures (
  failure_id          text primary key default ('f' || substr(replace(gen_random_uuid()::text, '-', ''), 1, 16)),
  -- AI生成
  title               text not null,
  hook                text,
  setup               text,
  story               jsonb not null default '[]'::jsonb,
  inner_voice         text,
  consequence_text    text,
  current_line        text,
  edited_story        text,
  tiktok_script       text,
  instagram_carousel  text,
  x_post              text,
  -- スコア
  despair_score       int  not null check (despair_score between 1 and 5),
  actual_damage_score int  not null check (actual_damage_score between 1 and 5),
  relief_gap          int  generated always as (despair_score - actual_damage_score) stored,
  -- 実害
  loss_types          text[] not null default '{}',
  loss_amount         text,
  loss_time           text,
  -- 現在
  current_status      text,
  current_comment     text,
  -- 分類
  category            text not null check (category in ('仕事','恋愛','お金','人間関係','日常')),
  subcategory         text[] not null default '{}',
  time_since          text,
  age_group           text,
  occupation          text,
  -- モデレーション
  pii_detected        boolean not null default false,
  pii_removed         jsonb   not null default '[]'::jsonb,
  moderation_status   text not null default 'unchecked' check (moderation_status in ('unchecked','approved','needs_fix','hidden')),
  moderation_note     text,
  ai_used             boolean not null default false,
  -- 公開
  created_at          timestamptz not null default now(),
  published_at        timestamptz,
  status              text not null default 'published' check (status in ('published','hidden')),
  -- リアクション（reactions テーブルのトリガーで増減）
  laugh_count         int not null default 0,
  same_count          int not null default 0,
  support_count       int not null default 0,
  -- 管理
  is_dummy            boolean not null default false,
  ip_hash             text,
  device_id           text
);
-- 既存環境（テーブルがすでにある場合）にも安全に列を追加する
alter table failures add column if not exists device_id text;

create index if not exists failures_status_created on failures (status, created_at desc);
create index if not exists failures_ip_device_created on failures (ip_hash, device_id, created_at);
create index if not exists failures_device on failures (device_id);

-- ---------- ユーザー原文（管理画面だけで使う） ----------
create table if not exists failure_raw (
  failure_id          text primary key references failures(failure_id) on delete cascade,
  mistake_summary     text,
  context             text,
  action              text,
  result              text,
  realization_moment  text,
  inner_voice         text,
  consequence         text,
  current_comment     text,
  loss_amount         text,
  loss_time           text,
  created_at          timestamptz not null default now()
);

-- ---------- リアクション（端末ごとに1種類1回） ----------
create table if not exists reactions (
  failure_id  text not null references failures(failure_id) on delete cascade,
  device_id   text not null,
  type        text not null check (type in ('laugh','same','support')),
  ip_hash     text,
  created_at  timestamptz not null default now(),
  primary key (failure_id, device_id, type)
);
create index if not exists reactions_ip_created on reactions (ip_hash, created_at);

-- ---------- 行動ログ ----------
create table if not exists events (
  id          bigserial primary key,
  sid         text not null,
  device_id   text,
  name        text not null,
  failure_id  text,
  props       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);
create index if not exists events_sid on events (sid);
create index if not exists events_name on events (name);

-- ---------- AI呼び出しの回数制限用 ----------
create table if not exists ai_calls (
  id          bigserial primary key,
  ip_hash     text,
  created_at  timestamptz not null default now()
);
create index if not exists ai_calls_ip_created on ai_calls (ip_hash, created_at);

-- すべてのテーブルでRLSを有効化（ポリシー無し = 公開キーからは一切読めない）
alter table failures    enable row level security;
alter table failure_raw enable row level security;
alter table reactions   enable row level security;
alter table events      enable row level security;
alter table ai_calls    enable row level security;

-- ---------- リアクション数の自動集計 ----------
create or replace function reactions_count() returns trigger
language plpgsql as $$
begin
  if tg_op = 'INSERT' then
    update failures set
      laugh_count   = laugh_count   + (new.type = 'laugh')::int,
      same_count    = same_count    + (new.type = 'same')::int,
      support_count = support_count + (new.type = 'support')::int
    where failure_id = new.failure_id;
    return new;
  else
    update failures set
      laugh_count   = greatest(0, laugh_count   - (old.type = 'laugh')::int),
      same_count    = greatest(0, same_count    - (old.type = 'same')::int),
      support_count = greatest(0, support_count - (old.type = 'support')::int)
    where failure_id = old.failure_id;
    return old;
  end if;
end $$;

drop trigger if exists reactions_count_trg on reactions;
create trigger reactions_count_trg after insert or delete on reactions
for each row execute function reactions_count();

-- =========================================================
-- API から呼ぶ関数
-- =========================================================

-- タイムライン（公開中のみ・公開してよい列だけ）
create or replace function list_failures() returns jsonb
language sql stable as $$
  select coalesce(jsonb_agg(to_jsonb(x) order by x.created_at desc), '[]'::jsonb)
  from (
    select failure_id as id, title, hook, setup, story, inner_voice, consequence_text, current_line,
           despair_score, actual_damage_score, relief_gap, loss_types, loss_amount, loss_time,
           current_status, category, subcategory, time_since,
           laugh_count, same_count, support_count, created_at
    from failures
    where status = 'published'
    order by created_at desc
    limit 300
  ) x
$$;

-- 既存デプロイからの更新用: 旧シグネチャ（引数3つ）が残っていれば削除してから作り直す
drop function if exists create_failure(jsonb, jsonb, text);

-- 投稿（1時間に5件まで / 同じ ip_hash + device_id の組み合わせ）
create or replace function create_failure(p jsonb, raw jsonb, ip text, dev text default null) returns jsonb
language plpgsql as $$
declare
  n   int;
  fid text;
begin
  select count(*) into n from failures
  where ip_hash = ip and device_id is not distinct from dev and created_at > now() - interval '1 hour';
  if n >= 5 then
    return jsonb_build_object('error', 'rate_limited');
  end if;

  insert into failures (
    title, hook, setup, story, inner_voice, consequence_text, current_line, edited_story,
    tiktok_script, instagram_carousel, x_post,
    despair_score, actual_damage_score, loss_types, loss_amount, loss_time,
    current_status, current_comment, category, subcategory, time_since, age_group, occupation,
    pii_detected, pii_removed, moderation_status, moderation_note, ai_used,
    status, published_at, ip_hash, device_id
  )
  select
    r.title, r.hook, r.setup, coalesce(r.story, '[]'::jsonb), r.inner_voice, r.consequence_text, r.current_line, r.edited_story,
    r.tiktok_script, r.instagram_carousel, r.x_post,
    r.despair_score, r.actual_damage_score, coalesce(r.loss_types, '{}'), r.loss_amount, r.loss_time,
    r.current_status, r.current_comment, r.category, coalesce(r.subcategory, '{}'), r.time_since, r.age_group, r.occupation,
    coalesce(r.pii_detected, false), coalesce(r.pii_removed, '[]'::jsonb), coalesce(r.moderation_status, 'unchecked'), r.moderation_note, coalesce(r.ai_used, false),
    coalesce(r.status, 'published'),
    case when coalesce(r.status, 'published') = 'published' then now() else null end,
    ip, dev
  from jsonb_populate_record(null::failures, p) r
  returning failure_id into fid;

  insert into failure_raw (failure_id, mistake_summary, context, action, result, realization_moment,
                           inner_voice, consequence, current_comment, loss_amount, loss_time)
  select fid, r.mistake_summary, r.context, r.action, r.result, r.realization_moment,
         r.inner_voice, r.consequence, r.current_comment, r.loss_amount, r.loss_time
  from jsonb_populate_record(null::failure_raw, raw) r;

  return jsonb_build_object('id', fid, 'status', coalesce(p->>'status', 'published'));
end $$;

-- リアクション（on=true で付ける / false で外す）。1時間に300回まで / 同じ ip_hash + device_id の組み合わせ
create or replace function react(fid text, dev text, t text, on_ boolean, ip text) returns jsonb
language plpgsql as $$
declare
  n int;
begin
  if not exists (select 1 from failures where failure_id = fid and status = 'published') then
    return jsonb_build_object('error', 'not_found');
  end if;
  if on_ then
    select count(*) into n from reactions where ip_hash = ip and device_id = dev and created_at > now() - interval '1 hour';
    if n >= 300 then
      return jsonb_build_object('error', 'rate_limited');
    end if;
    insert into reactions (failure_id, device_id, type, ip_hash)
    values (fid, dev, t, ip)
    on conflict do nothing;
  else
    delete from reactions where failure_id = fid and device_id = dev and type = t;
  end if;
  return (select jsonb_build_object('laugh', laugh_count, 'same', same_count, 'support', support_count)
          from failures where failure_id = fid);
end $$;

-- 自分の投稿を削除（投稿時に記録した device_id と一致する場合のみ、物理削除）
create or replace function delete_own_failure(fid text, dev text) returns jsonb
language plpgsql as $$
declare
  ok boolean;
begin
  select exists(
    select 1 from failures
    where failure_id = fid and device_id is not distinct from dev and dev is not null and dev <> ''
  ) into ok;
  if not ok then
    return jsonb_build_object('error', 'not_found');
  end if;
  delete from failures where failure_id = fid and device_id is not distinct from dev;
  return jsonb_build_object('ok', true);
end $$;

-- 行動ログ（1回50件まで、決まったイベント名だけ）
create or replace function log_events(s text, dev text, rows jsonb) returns int
language plpgsql as $$
declare
  n int;
begin
  insert into events (sid, device_id, name, failure_id, props)
  select s, dev, e->>'name', nullif(e->>'fid', ''), coalesce(e->'props', '{}'::jsonb)
  from (select value as e from jsonb_array_elements(rows) limit 50) x
  where e->>'name' in (
    'timeline_view','failure_impression','failure_open','failure_read',
    'reaction_laugh','reaction_same','reaction_support','category_filter',
    'post_start','post_step_complete','post_preview','post_complete',
    'relief_answer','relief_dismiss','mood_answer','mood_dismiss'
  );
  get diagnostics n = row_count;
  return n;
end $$;

-- AI呼び出しを記録して、直近1時間の回数を返す
create or replace function log_ai_call(ip text) returns int
language plpgsql as $$
declare
  n int;
begin
  insert into ai_calls (ip_hash) values (ip);
  select count(*) into n from ai_calls where ip_hash = ip and created_at > now() - interval '1 hour';
  return n;
end $$;

-- 管理画面：全投稿＋原文
create or replace function admin_list() returns jsonb
language sql stable as $$
  select coalesce(jsonb_agg(
           (to_jsonb(f) - 'ip_hash' - 'device_id') || jsonb_build_object('id', f.failure_id, 'raw', to_jsonb(r) - 'failure_id')
           order by f.created_at desc), '[]'::jsonb)
  from failures f
  left join failure_raw r using (failure_id)
$$;

-- 管理画面：KPI（セッション単位で集計）
create or replace function admin_kpis() returns jsonb
language sql stable as $$
  with s as (
    select sid,
      count(*) filter (where name = 'timeline_view')      as tl,
      count(*) filter (where name = 'failure_impression') as imp,
      count(*) filter (where name = 'failure_open')       as opn,
      count(*) filter (where name = 'failure_read')       as rd,
      count(*) filter (where name = 'reaction_laugh')     as rl,
      count(*) filter (where name = 'reaction_same')      as rs,
      count(*) filter (where name = 'reaction_support')   as rsu,
      count(*) filter (where name = 'post_start')         as ps,
      count(*) filter (where name = 'post_complete')      as pc,
      max(props->>'v') filter (where name = 'relief_answer')             as relief,
      max((props->>'v')::numeric) filter (where name = 'mood_answer')    as mood
    from events
    group by sid
  )
  select jsonb_build_object(
    'sessions',             count(*) filter (where tl > 0),
    'impressions',          coalesce(sum(imp), 0),
    'opens',                coalesce(sum(opn), 0),
    'reads',                coalesce(sum(rd), 0),
    'reads_in_tl_sessions', coalesce(sum(rd) filter (where tl > 0), 0),
    'reactions',            coalesce(sum(rl + rs + rsu), 0),
    'same',                 coalesce(sum(rs), 0),
    'post_start_sessions',  count(*) filter (where tl > 0 and ps > 0),
    'post_start_any',       count(*) filter (where ps > 0),
    'post_complete_sessions', count(*) filter (where ps > 0 and pc > 0),
    'relief_n',             count(relief),
    'relief_better',        count(*) filter (where relief = 'better'),
    'relief_same',          count(*) filter (where relief = 'same'),
    'relief_worse',         count(*) filter (where relief = 'worse'),
    'mood_n',               count(mood),
    'mood_avg',             round(avg(mood), 2),
    'mood_avg_better',      round(avg(mood) filter (where relief = 'better'), 2),
    'mood_avg_not_better',  round(avg(mood) filter (where relief in ('same','worse')), 2)
  )
  from s
$$;

-- 管理画面：ステータス更新
create or replace function admin_update(fid text, patch jsonb) returns jsonb
language plpgsql as $$
begin
  update failures set
    moderation_status = coalesce(patch->>'moderation_status', moderation_status),
    status            = coalesce(patch->>'status', status),
    published_at      = case when coalesce(patch->>'status', status) = 'published' and published_at is null
                             then now() else published_at end
  where failure_id = fid;
  return (select (to_jsonb(f) - 'ip_hash' - 'device_id') || jsonb_build_object('id', f.failure_id) from failures f where failure_id = fid);
end $$;

-- 管理画面：ダミーをまとめて非公開 / 削除
create or replace function admin_hide_dummies() returns int
language plpgsql as $$
declare n int;
begin
  update failures set status = 'hidden', moderation_status = 'hidden' where is_dummy and status = 'published';
  get diagnostics n = row_count;
  return n;
end $$;

create or replace function admin_delete_dummies() returns int
language plpgsql as $$
declare n int;
begin
  delete from failures where is_dummy;
  get diagnostics n = row_count;
  return n;
end $$;

-- 関数はサーバー（service_role）からだけ呼べるようにする
do $$
declare f text;
begin
  foreach f in array array[
    'list_failures()', 'create_failure(jsonb, jsonb, text, text)', 'react(text, text, text, boolean, text)',
    'delete_own_failure(text, text)',
    'log_events(text, text, jsonb)', 'log_ai_call(text)', 'admin_list()', 'admin_kpis()',
    'admin_update(text, jsonb)', 'admin_hide_dummies()', 'admin_delete_dummies()'
  ] loop
    execute format('revoke all on function %s from public, anon, authenticated', f);
    execute format('grant execute on function %s to service_role', f);
  end loop;
end $$;
