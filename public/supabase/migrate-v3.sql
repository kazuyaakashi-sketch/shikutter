-- =========================================================
-- シクッター v3 更新用SQL（migrate-v3.sql）
--
-- 【これは何？】
--   いま動いている本番のデータベースを、新しいデザイン（v3）に対応させるための追加分だけです。
--   テーブルの中身（投稿・リアクション・ログ）は消えません。何度実行しても安全です。
--
-- 【やっていること】
--   1. 行動ログで受け付けるイベント名に、次の3つを追加
--        relief_prompt_view（「ちょっとマシになった？」を表示した）
--        post_complete_view（投稿完了画面を表示した）
--        post_complete_return_timeline（完了画面からタイムラインへ戻った）
--   2. 投稿直後に「年代・職業」を任意で追加できる関数 set_own_profile を作成
--      （投稿した端末と同じ device_id のときだけ更新できます）
--   3. 管理画面のKPIに「質問の表示数」「完了画面→タイムライン」を追加
--   4. 上の関数をサーバー（service_role）からだけ呼べるように権限を設定
--
-- 【使い方】
--   Supabase の「SQL Editor」→「New query」に、このファイルをまるごと貼り付けて「Run」。
--   「Success. No rows returned」と出ればOKです。
-- =========================================================

-- 念のため：使う列がなければ追加（すでにあれば何もしない）
alter table failures add column if not exists age_group  text;
alter table failures add column if not exists occupation text;

-- 1. 行動ログ（イベント名の許可リストを更新）
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
    'post_complete_view','post_complete_return_timeline',
    'relief_prompt_view','relief_answer','relief_dismiss','mood_answer','mood_dismiss'
  );
  get diagnostics n = row_count;
  return n;
end $$;

-- 2. 年代・職業を自分の投稿に追加する
create or replace function set_own_profile(fid text, dev text, age text, job text) returns jsonb
language plpgsql as $$
declare
  n int;
begin
  if dev is null or dev = '' then
    return jsonb_build_object('error', 'not_found');
  end if;
  if coalesce(age, '') not in ('', '10代', '20代', '30代', '40代', '50代以上', '秘密')
     or coalesce(job, '') not in ('', '会社員', '学生', '経営者・フリーランス', 'その他', '秘密') then
    return jsonb_build_object('error', 'bad_request');
  end if;
  update failures set
    age_group  = coalesce(nullif(age, ''), age_group),
    occupation = coalesce(nullif(job, ''), occupation)
  where failure_id = fid and device_id = dev;
  get diagnostics n = row_count;
  if n = 0 then
    return jsonb_build_object('error', 'not_found');
  end if;
  return jsonb_build_object('ok', true);
end $$;

-- 3. 管理画面のKPI
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
      count(*) filter (where name = 'relief_prompt_view') as rv,
      count(*) filter (where name = 'post_complete_view') as pcv,
      count(*) filter (where name = 'post_complete_return_timeline') as pcr,
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
    'relief_views',         count(*) filter (where rv > 0),
    'post_complete_views',  count(*) filter (where pcv > 0),
    'post_complete_returns', count(*) filter (where pcr > 0),
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

-- 4. 権限（サーバーからだけ呼べるようにする）
revoke all on function set_own_profile(text, text, text, text) from public, anon, authenticated;
grant execute on function set_own_profile(text, text, text, text) to service_role;
revoke all on function log_events(text, text, jsonb) from public, anon, authenticated;
grant execute on function log_events(text, text, jsonb) to service_role;
revoke all on function admin_kpis() from public, anon, authenticated;
grant execute on function admin_kpis() to service_role;
