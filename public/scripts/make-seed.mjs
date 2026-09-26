// supabase/seed.sql を seeds.json から生成する
import fs from "node:fs";
import { buildSNS } from "../api/_lib.js";
const seeds = JSON.parse(fs.readFileSync(new URL("./seeds.json", import.meta.url)));
const q = (v) => v == null ? "null" : `'${String(v).replace(/'/g, "''")}'`;
const arr = (a) => `array[${a.map(q).join(",")}]::text[]`;
const js = (o) => `${q(JSON.stringify(o))}::jsonb`;
let sql = `-- ダミーの失敗談（is_dummy = true）。本番公開前に管理画面の「ダミーを削除」で消せます。\n`;
for (const s of seeds) {
  const sns = buildSNS(s);
  sql += `insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values (${q("dummy_" + s.id)},${q(s.title)},${q(s.hook)},${q(s.setup)},${js(s.story)},${q(s.inner_voice)},${q(s.consequence_text)},${q(s.current_line)},${q(sns.edited_story)},${q(sns.tiktok_script)},${q(sns.instagram_carousel)},${q(sns.x_post)},${s.despair_score},${s.actual_damage_score},${arr(s.loss_types)},${q(s.loss_amount)},${q(s.loss_time)},${q(s.current_status)},${q(s.current_comment)},${q(s.category)},${arr(s.subcategory)},${q(s.time_since)},${q(s.age_group)},${q(s.occupation)},'approved','published',${q(s.created_at)},${q(s.created_at)},${s.seed_counts.laugh},${s.seed_counts.same},${s.seed_counts.support},true)
on conflict (failure_id) do nothing;\n`;
}
fs.writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
console.log("seed.sql:", seeds.length, "rows");
