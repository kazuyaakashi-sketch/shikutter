-- ダミーの失敗談（is_dummy = true）。本番公開前に管理画面の「ダミーを削除」で消せます。
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d01','取引先50社に社内メールを誤送信しました。','取引先50社に、絶対見せちゃいけないメールを送りました。','新入社員だった頃。','["社内向けに作ったメールを、間違えて取引先約50社に一斉送信。","送信済みフォルダを見た瞬間、血の気が引きました。"]'::jsonb,'終わった。クビになる。','結局、上司と一緒に謝罪。大きな損害はありませんでした。','3年後——普通に同じ会社で働いてます。','新入社員だった頃。

社内向けに作ったメールを、間違えて取引先約50社に一斉送信。

送信済みフォルダを見た瞬間、血の気が引きました。

「終わった。クビになる。」

当時の絶望度 ★★★★★

結局、上司と一緒に謝罪。大きな損害はありませんでした。

実際のヤバさ ★★☆☆☆

3年後——普通に同じ会社で働いてます。

まあ、生きてる。','HOOK：
取引先50社に、絶対見せちゃいけないメールを送りました。

SETUP：
新入社員だった頃。

MISTAKE：
社内向けに作ったメールを、間違えて取引先約50社に一斉送信。

REALIZATION：
送信済みフォルダを見た瞬間、血の気が引きました。

INNER_VOICE：
「終わった。クビになる。」

DESPAIR：
★★★★★

CONSEQUENCE：
結局、上司と一緒に謝罪。大きな損害はありませんでした。

ACTUAL_DAMAGE：
★★☆☆☆

CURRENT_STATUS：
3年後——普通に同じ会社で働いてます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
取引先50社に、絶対見せちゃいけないメールを送りました。

【2枚目】
新入社員だった頃。

【3枚目】
社内向けに作ったメールを、間違えて取引先約50社に一斉送信。
送信済みフォルダを見た瞬間、血の気が引きました。

【4枚目】
「終わった。クビになる。」

当時の絶望度
★★★★★

【5枚目】
結局どうなった？
結局、上司と一緒に謝罪。大きな損害はありませんでした。

【6枚目】
実際のヤバさ
★★☆☆☆

【7枚目】
現在
3年後——普通に同じ会社で働いてます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','取引先50社に社内メールを誤送信しました。
「終わった。クビになる。」と思った。
当時の絶望度：★★★★★
結局、上司と一緒に謝罪。大きな損害はありませんでした。
実際のヤバさ：★★☆☆☆
3年後——普通に同じ会社で働いてます。
まあ、生きてる。',5,2,array['信用']::text[],'','','普通に働いてる','','仕事',array['メール','誤送信']::text[],'それより前','20代','会社員','approved','published','2026-09-26T01:00:00.000Z','2026-09-26T01:00:00.000Z',128,42,18,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d02','好きな人の相談LINEを、本人に送りました。','「どうやったら振り向いてくれると思う？」を、本人に送った。','友達に恋愛相談をしていた夜。','["トークを切り替えたつもりで、相談の長文を本人に送信。","既読がついて、送り先を見て気づきました。"]'::jsonb,'スマホごと海に投げたい。','2日間既読スルー。3日目に「相談って私のこと？」と返信が来ました。付き合いはしませんでした。','今では普通に友達。たまにこの話でいじられます。','友達に恋愛相談をしていた夜。

トークを切り替えたつもりで、相談の長文を本人に送信。

既読がついて、送り先を見て気づきました。

「スマホごと海に投げたい。」

当時の絶望度 ★★★★★

2日間既読スルー。3日目に「相談って私のこと？」と返信が来ました。付き合いはしませんでした。

実際のヤバさ ★★★☆☆

今では普通に友達。たまにこの話でいじられます。

まあ、生きてる。','HOOK：
「どうやったら振り向いてくれると思う？」を、本人に送った。

SETUP：
友達に恋愛相談をしていた夜。

MISTAKE：
トークを切り替えたつもりで、相談の長文を本人に送信。

REALIZATION：
既読がついて、送り先を見て気づきました。

INNER_VOICE：
「スマホごと海に投げたい。」

DESPAIR：
★★★★★

CONSEQUENCE：
2日間既読スルー。3日目に「相談って私のこと？」と返信が来ました。付き合いはしませんでした。

ACTUAL_DAMAGE：
★★★☆☆

CURRENT_STATUS：
今では普通に友達。たまにこの話でいじられます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
「どうやったら振り向いてくれると思う？」を、本人に送った。

【2枚目】
友達に恋愛相談をしていた夜。

【3枚目】
トークを切り替えたつもりで、相談の長文を本人に送信。
既読がついて、送り先を見て気づきました。

【4枚目】
「スマホごと海に投げたい。」

当時の絶望度
★★★★★

【5枚目】
結局どうなった？
2日間既読スルー。3日目に「相談って私のこと？」と返信が来ました。付き合いはしませんでした。

【6枚目】
実際のヤバさ
★★★☆☆

【7枚目】
現在
今では普通に友達。たまにこの話でいじられます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','好きな人の相談LINEを、本人に送りました。
「スマホごと海に投げたい。」と思った。
当時の絶望度：★★★★★
2日間既読スルー。3日目に「相談って私のこと？」と返信が来ました。付き合いはしませんでした。
実際のヤバさ：★★★☆☆
今では普通に友達。たまにこの話でいじられます。
まあ、生きてる。',5,3,array['恋人']::text[],'','','今では笑い話','送信取消の機能を毎日ありがたく思ってます。','恋愛',array['LINE','誤送信']::text[],'1年以内','20代','学生','approved','published','2026-09-25T15:00:00.000Z','2026-09-25T15:00:00.000Z',211,96,33,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d03','引っ越し後も、前の家に家賃を振り込み続けました。','2ヶ月間、住んでいない家の家賃を払っていました。','引っ越して、バタバタしていた時期。','["自動振込の解約を忘れて、前の家に2ヶ月分の家賃を振り込み続けていました。","新しい家の大家さんから「家賃が入ってない」と電話が来て気づきました。"]'::jsonb,'え、私バカなの？','前の大家さんに連絡したら、1ヶ月分は返ってきました。','普通に生きてます。振込は全部見直しました。','引っ越して、バタバタしていた時期。

自動振込の解約を忘れて、前の家に2ヶ月分の家賃を振り込み続けていました。

新しい家の大家さんから「家賃が入ってない」と電話が来て気づきました。

「え、私バカなの？」

当時の絶望度 ★★★★☆

前の大家さんに連絡したら、1ヶ月分は返ってきました。

実際のヤバさ ★★☆☆☆

普通に生きてます。振込は全部見直しました。

まあ、生きてる。','HOOK：
2ヶ月間、住んでいない家の家賃を払っていました。

SETUP：
引っ越して、バタバタしていた時期。

MISTAKE：
自動振込の解約を忘れて、前の家に2ヶ月分の家賃を振り込み続けていました。

REALIZATION：
新しい家の大家さんから「家賃が入ってない」と電話が来て気づきました。

INNER_VOICE：
「え、私バカなの？」

DESPAIR：
★★★★☆

CONSEQUENCE：
前の大家さんに連絡したら、1ヶ月分は返ってきました。

ACTUAL_DAMAGE：
★★☆☆☆

CURRENT_STATUS：
普通に生きてます。振込は全部見直しました。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
2ヶ月間、住んでいない家の家賃を払っていました。

【2枚目】
引っ越して、バタバタしていた時期。

【3枚目】
自動振込の解約を忘れて、前の家に2ヶ月分の家賃を振り込み続けていました。
新しい家の大家さんから「家賃が入ってない」と電話が来て気づきました。

【4枚目】
「え、私バカなの？」

当時の絶望度
★★★★☆

【5枚目】
結局どうなった？
前の大家さんに連絡したら、1ヶ月分は返ってきました。

【6枚目】
実際のヤバさ
★★☆☆☆

【7枚目】
現在
普通に生きてます。振込は全部見直しました。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','引っ越し後も、前の家に家賃を振り込み続けました。
「え、私バカなの？」と思った。
当時の絶望度：★★★★☆
前の大家さんに連絡したら、1ヶ月分は返ってきました。
実際のヤバさ：★★☆☆☆
普通に生きてます。振込は全部見直しました。
まあ、生きてる。',4,2,array['お金']::text[],'約8万円','','なんとかなった','','お金',array['家賃','振込ミス']::text[],'1年以内','30代','会社員','approved','published','2026-09-25T03:00:00.000Z','2026-09-25T03:00:00.000Z',74,51,40,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d04','新幹線で寝過ごして、新大阪のはずが博多まで行きました。','目が覚めたら、目的地の2時間半先にいました。','出張帰り、東京から新大阪へ向かう新幹線。','["座った瞬間に寝落ち。","車内アナウンスの「博多」で目が覚めました。"]'::jsonb,'ここ……どこ？','博多で一泊して、翌日帰りました。明太子は美味しかったです。','普通に生きてます。今もよく寝ます。','出張帰り、東京から新大阪へ向かう新幹線。

座った瞬間に寝落ち。

車内アナウンスの「博多」で目が覚めました。

「ここ……どこ？」

当時の絶望度 ★★★★☆

博多で一泊して、翌日帰りました。明太子は美味しかったです。

実際のヤバさ ★☆☆☆☆

普通に生きてます。今もよく寝ます。

まあ、生きてる。','HOOK：
目が覚めたら、目的地の2時間半先にいました。

SETUP：
出張帰り、東京から新大阪へ向かう新幹線。

MISTAKE：
座った瞬間に寝落ち。

REALIZATION：
車内アナウンスの「博多」で目が覚めました。

INNER_VOICE：
「ここ……どこ？」

DESPAIR：
★★★★☆

CONSEQUENCE：
博多で一泊して、翌日帰りました。明太子は美味しかったです。

ACTUAL_DAMAGE：
★☆☆☆☆

CURRENT_STATUS：
普通に生きてます。今もよく寝ます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
目が覚めたら、目的地の2時間半先にいました。

【2枚目】
出張帰り、東京から新大阪へ向かう新幹線。

【3枚目】
座った瞬間に寝落ち。
車内アナウンスの「博多」で目が覚めました。

【4枚目】
「ここ……どこ？」

当時の絶望度
★★★★☆

【5枚目】
結局どうなった？
博多で一泊して、翌日帰りました。明太子は美味しかったです。

【6枚目】
実際のヤバさ
★☆☆☆☆

【7枚目】
現在
普通に生きてます。今もよく寝ます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','新幹線で寝過ごして、新大阪のはずが博多まで行きました。
「ここ……どこ？」と思った。
当時の絶望度：★★★★☆
博多で一泊して、翌日帰りました。明太子は美味しかったです。
実際のヤバさ：★☆☆☆☆
普通に生きてます。今もよく寝ます。
まあ、生きてる。',4,1,array['お金','時間']::text[],'約1.5万円','半日','今では笑い話','','日常',array['新幹線','寝過ごし']::text[],'1ヶ月以内','40代','会社員','approved','published','2026-09-24T13:00:00.000Z','2026-09-24T13:00:00.000Z',302,88,12,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d05','友人の結婚式スピーチで、新婦の名前を間違えました。','友人代表スピーチ、いちばん大事な名前を間違えました。','大学時代の親友の結婚式。友人代表のスピーチ中。','["緊張で、新婦の名前を1回だけ別の名前で呼びました。","会場が一瞬静かになって気づきました。"]'::jsonb,'今すぐ消えたい。','新婦さんが笑って「誰それ〜」と拾ってくれて、会場は笑いに。二次会で何度も謝りました。','今も二人とは仲良しです。','大学時代の親友の結婚式。友人代表のスピーチ中。

緊張で、新婦の名前を1回だけ別の名前で呼びました。

会場が一瞬静かになって気づきました。

「今すぐ消えたい。」

当時の絶望度 ★★★★★

新婦さんが笑って「誰それ〜」と拾ってくれて、会場は笑いに。二次会で何度も謝りました。

実際のヤバさ ★★☆☆☆

今も二人とは仲良しです。

まあ、生きてる。','HOOK：
友人代表スピーチ、いちばん大事な名前を間違えました。

SETUP：
大学時代の親友の結婚式。友人代表のスピーチ中。

MISTAKE：
緊張で、新婦の名前を1回だけ別の名前で呼びました。

REALIZATION：
会場が一瞬静かになって気づきました。

INNER_VOICE：
「今すぐ消えたい。」

DESPAIR：
★★★★★

CONSEQUENCE：
新婦さんが笑って「誰それ〜」と拾ってくれて、会場は笑いに。二次会で何度も謝りました。

ACTUAL_DAMAGE：
★★☆☆☆

CURRENT_STATUS：
今も二人とは仲良しです。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
友人代表スピーチ、いちばん大事な名前を間違えました。

【2枚目】
大学時代の親友の結婚式。友人代表のスピーチ中。

【3枚目】
緊張で、新婦の名前を1回だけ別の名前で呼びました。
会場が一瞬静かになって気づきました。

【4枚目】
「今すぐ消えたい。」

当時の絶望度
★★★★★

【5枚目】
結局どうなった？
新婦さんが笑って「誰それ〜」と拾ってくれて、会場は笑いに。二次会で何度も謝りました。

【6枚目】
実際のヤバさ
★★☆☆☆

【7枚目】
現在
今も二人とは仲良しです。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','友人の結婚式スピーチで、新婦の名前を間違えました。
「今すぐ消えたい。」と思った。
当時の絶望度：★★★★★
新婦さんが笑って「誰それ〜」と拾ってくれて、会場は笑いに。二次会で何度も謝りました。
実際のヤバさ：★★☆☆☆
今も二人とは仲良しです。
まあ、生きてる。',5,2,array['特になし']::text[],'','','今では笑い話','','人間関係',array['結婚式','スピーチ']::text[],'それより前','30代','会社員','approved','published','2026-09-23T21:00:00.000Z','2026-09-23T21:00:00.000Z',156,37,61,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d06','全社会議の画面共有で、転職サイトが映りました。','全社会議で画面共有したら、転職サイトが開いていました。','オンラインの全社会議。自分の発表の番。','["資料を共有したつもりが、ブラウザごと共有。","一番上のタブが転職サイトでした。チャット欄が一瞬止まって気づきました。"]'::jsonb,'人生のログアウトボタンどこ。','誰も何も言いませんでした。それが一番こわかったです。','まだ同じ会社にいます。','オンラインの全社会議。自分の発表の番。

資料を共有したつもりが、ブラウザごと共有。

一番上のタブが転職サイトでした。チャット欄が一瞬止まって気づきました。

「人生のログアウトボタンどこ。」

当時の絶望度 ★★★★★

誰も何も言いませんでした。それが一番こわかったです。

実際のヤバさ ★★★☆☆

まだ同じ会社にいます。

まあ、生きてる。','HOOK：
全社会議で画面共有したら、転職サイトが開いていました。

SETUP：
オンラインの全社会議。自分の発表の番。

MISTAKE：
資料を共有したつもりが、ブラウザごと共有。

REALIZATION：
一番上のタブが転職サイトでした。チャット欄が一瞬止まって気づきました。

INNER_VOICE：
「人生のログアウトボタンどこ。」

DESPAIR：
★★★★★

CONSEQUENCE：
誰も何も言いませんでした。それが一番こわかったです。

ACTUAL_DAMAGE：
★★★☆☆

CURRENT_STATUS：
まだ同じ会社にいます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
全社会議で画面共有したら、転職サイトが開いていました。

【2枚目】
オンラインの全社会議。自分の発表の番。

【3枚目】
資料を共有したつもりが、ブラウザごと共有。
一番上のタブが転職サイトでした。チャット欄が一瞬止まって気づきました。

【4枚目】
「人生のログアウトボタンどこ。」

当時の絶望度
★★★★★

【5枚目】
結局どうなった？
誰も何も言いませんでした。それが一番こわかったです。

【6枚目】
実際のヤバさ
★★★☆☆

【7枚目】
現在
まだ同じ会社にいます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','全社会議の画面共有で、転職サイトが映りました。
「人生のログアウトボタンどこ。」と思った。
当時の絶望度：★★★★★
誰も何も言いませんでした。それが一番こわかったです。
実際のヤバさ：★★★☆☆
まだ同じ会社にいます。
まあ、生きてる。',5,3,array['信用']::text[],'','','普通に働いてる','共有は「ウィンドウ単位」にしてます。','仕事',array['画面共有','会議']::text[],'1年以内','30代','会社員','approved','published','2026-09-23T03:00:00.000Z','2026-09-23T03:00:00.000Z',244,73,29,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d07','マヨネーズを1本頼んだつもりが、24本届きました。','業務用マヨネーズ24本と暮らすことになりました。','夜中にスマホで日用品をまとめ買い。','["数量ではなく「ケース」を選んでいました。","玄関に届いた大きな段ボールを見て気づきました。"]'::jsonb,'1年かけて食べるしかない。','近所の人と職場に配りました。','普通に生きてます。マヨネーズはまだ3本あります。','夜中にスマホで日用品をまとめ買い。

数量ではなく「ケース」を選んでいました。

玄関に届いた大きな段ボールを見て気づきました。

「1年かけて食べるしかない。」

当時の絶望度 ★★★☆☆

近所の人と職場に配りました。

実際のヤバさ ★☆☆☆☆

普通に生きてます。マヨネーズはまだ3本あります。

まあ、生きてる。','HOOK：
業務用マヨネーズ24本と暮らすことになりました。

SETUP：
夜中にスマホで日用品をまとめ買い。

MISTAKE：
数量ではなく「ケース」を選んでいました。

REALIZATION：
玄関に届いた大きな段ボールを見て気づきました。

INNER_VOICE：
「1年かけて食べるしかない。」

DESPAIR：
★★★☆☆

CONSEQUENCE：
近所の人と職場に配りました。

ACTUAL_DAMAGE：
★☆☆☆☆

CURRENT_STATUS：
普通に生きてます。マヨネーズはまだ3本あります。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
業務用マヨネーズ24本と暮らすことになりました。

【2枚目】
夜中にスマホで日用品をまとめ買い。

【3枚目】
数量ではなく「ケース」を選んでいました。
玄関に届いた大きな段ボールを見て気づきました。

【4枚目】
「1年かけて食べるしかない。」

当時の絶望度
★★★☆☆

【5枚目】
結局どうなった？
近所の人と職場に配りました。

【6枚目】
実際のヤバさ
★☆☆☆☆

【7枚目】
現在
普通に生きてます。マヨネーズはまだ3本あります。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','マヨネーズを1本頼んだつもりが、24本届きました。
「1年かけて食べるしかない。」と思った。
当時の絶望度：★★★☆☆
近所の人と職場に配りました。
実際のヤバさ：★☆☆☆☆
普通に生きてます。マヨネーズはまだ3本あります。
まあ、生きてる。',3,1,array['お金']::text[],'約6,000円','','なんとかなった','','お金',array['通販','注文ミス']::text[],'1ヶ月以内','20代','会社員','approved','published','2026-09-22T07:00:00.000Z','2026-09-22T07:00:00.000Z',187,22,9,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d08','初デートのお店を、翌月の日付で予約していました。','初デート、予約したお店に「ご予約はありません」と言われました。','何度も誘ってやっと決まった初デート。','["お店に着いて名前を伝えると、予約は来月の同じ日でした。","予約確認メールを見返して気づきました。"]'::jsonb,'終わった、第一印象。','近くのラーメン屋に入りました。2回目のデートはありませんでした。','普通に生きてます。ラーメンは美味しかったです。','何度も誘ってやっと決まった初デート。

お店に着いて名前を伝えると、予約は来月の同じ日でした。

予約確認メールを見返して気づきました。

「終わった、第一印象。」

当時の絶望度 ★★★★☆

近くのラーメン屋に入りました。2回目のデートはありませんでした。

実際のヤバさ ★★☆☆☆

普通に生きてます。ラーメンは美味しかったです。

まあ、生きてる。','HOOK：
初デート、予約したお店に「ご予約はありません」と言われました。

SETUP：
何度も誘ってやっと決まった初デート。

MISTAKE：
お店に着いて名前を伝えると、予約は来月の同じ日でした。

REALIZATION：
予約確認メールを見返して気づきました。

INNER_VOICE：
「終わった、第一印象。」

DESPAIR：
★★★★☆

CONSEQUENCE：
近くのラーメン屋に入りました。2回目のデートはありませんでした。

ACTUAL_DAMAGE：
★★☆☆☆

CURRENT_STATUS：
普通に生きてます。ラーメンは美味しかったです。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
初デート、予約したお店に「ご予約はありません」と言われました。

【2枚目】
何度も誘ってやっと決まった初デート。

【3枚目】
お店に着いて名前を伝えると、予約は来月の同じ日でした。
予約確認メールを見返して気づきました。

【4枚目】
「終わった、第一印象。」

当時の絶望度
★★★★☆

【5枚目】
結局どうなった？
近くのラーメン屋に入りました。2回目のデートはありませんでした。

【6枚目】
実際のヤバさ
★★☆☆☆

【7枚目】
現在
普通に生きてます。ラーメンは美味しかったです。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','初デートのお店を、翌月の日付で予約していました。
「終わった、第一印象。」と思った。
当時の絶望度：★★★★☆
近くのラーメン屋に入りました。2回目のデートはありませんでした。
実際のヤバさ：★★☆☆☆
普通に生きてます。ラーメンは美味しかったです。
まあ、生きてる。',4,2,array['恋人']::text[],'','','普通に生きてる','','恋愛',array['デート','予約ミス']::text[],'1年以内','20代','会社員','approved','published','2026-09-21T09:00:00.000Z','2026-09-21T09:00:00.000Z',98,64,47,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d09','パジャマのまま、家から閉め出されました。','朝のゴミ出し。戻ったら、家に入れませんでした。','日曜の朝、パジャマでゴミ出し。','["オートロックの鍵を持たずに外へ出ていました。","エントランスの前で、手ぶらなことに気づきました。"]'::jsonb,'この格好で世界に出るのか。','管理会社に電話して、鍵屋さんを待つこと2時間。','普通に生きてます。鍵は首から下げてます。','日曜の朝、パジャマでゴミ出し。

オートロックの鍵を持たずに外へ出ていました。

エントランスの前で、手ぶらなことに気づきました。

「この格好で世界に出るのか。」

当時の絶望度 ★★★★☆

管理会社に電話して、鍵屋さんを待つこと2時間。

実際のヤバさ ★☆☆☆☆

普通に生きてます。鍵は首から下げてます。

まあ、生きてる。','HOOK：
朝のゴミ出し。戻ったら、家に入れませんでした。

SETUP：
日曜の朝、パジャマでゴミ出し。

MISTAKE：
オートロックの鍵を持たずに外へ出ていました。

REALIZATION：
エントランスの前で、手ぶらなことに気づきました。

INNER_VOICE：
「この格好で世界に出るのか。」

DESPAIR：
★★★★☆

CONSEQUENCE：
管理会社に電話して、鍵屋さんを待つこと2時間。

ACTUAL_DAMAGE：
★☆☆☆☆

CURRENT_STATUS：
普通に生きてます。鍵は首から下げてます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
朝のゴミ出し。戻ったら、家に入れませんでした。

【2枚目】
日曜の朝、パジャマでゴミ出し。

【3枚目】
オートロックの鍵を持たずに外へ出ていました。
エントランスの前で、手ぶらなことに気づきました。

【4枚目】
「この格好で世界に出るのか。」

当時の絶望度
★★★★☆

【5枚目】
結局どうなった？
管理会社に電話して、鍵屋さんを待つこと2時間。

【6枚目】
実際のヤバさ
★☆☆☆☆

【7枚目】
現在
普通に生きてます。鍵は首から下げてます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','パジャマのまま、家から閉め出されました。
「この格好で世界に出るのか。」と思った。
当時の絶望度：★★★★☆
管理会社に電話して、鍵屋さんを待つこと2時間。
実際のヤバさ：★☆☆☆☆
普通に生きてます。鍵は首から下げてます。
まあ、生きてる。',4,1,array['お金','時間']::text[],'約1.2万円','2時間','今では笑い話','','日常',array['鍵','閉め出し']::text[],'1週間以内','30代','経営者・フリーランス','approved','published','2026-09-20T09:00:00.000Z','2026-09-20T09:00:00.000Z',133,58,15,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d10','友達の誕生日を、1ヶ月まちがえて祝いました。','サプライズで誕生日を祝ったら、1ヶ月早かったです。','仲のいい友達の誕生日。ケーキまで用意しました。','["「おめでとう！」とケーキを出したら、友達がきょとんとしていました。","「来月だよ」と言われて気づきました。"]'::jsonb,'祝うべきか、謝るべきか。','その場で2人でケーキを食べました。翌月もちゃんと祝いました。','普通に生きてます。毎年2回祝うネタになりました。','仲のいい友達の誕生日。ケーキまで用意しました。

「おめでとう！」とケーキを出したら、友達がきょとんとしていました。

「来月だよ」と言われて気づきました。

「祝うべきか、謝るべきか。」

当時の絶望度 ★★★☆☆

その場で2人でケーキを食べました。翌月もちゃんと祝いました。

実際のヤバさ ★☆☆☆☆

普通に生きてます。毎年2回祝うネタになりました。

まあ、生きてる。','HOOK：
サプライズで誕生日を祝ったら、1ヶ月早かったです。

SETUP：
仲のいい友達の誕生日。ケーキまで用意しました。

MISTAKE：
「おめでとう！」とケーキを出したら、友達がきょとんとしていました。

REALIZATION：
「来月だよ」と言われて気づきました。

INNER_VOICE：
「祝うべきか、謝るべきか。」

DESPAIR：
★★★☆☆

CONSEQUENCE：
その場で2人でケーキを食べました。翌月もちゃんと祝いました。

ACTUAL_DAMAGE：
★☆☆☆☆

CURRENT_STATUS：
普通に生きてます。毎年2回祝うネタになりました。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
サプライズで誕生日を祝ったら、1ヶ月早かったです。

【2枚目】
仲のいい友達の誕生日。ケーキまで用意しました。

【3枚目】
「おめでとう！」とケーキを出したら、友達がきょとんとしていました。
「来月だよ」と言われて気づきました。

【4枚目】
「祝うべきか、謝るべきか。」

当時の絶望度
★★★☆☆

【5枚目】
結局どうなった？
その場で2人でケーキを食べました。翌月もちゃんと祝いました。

【6枚目】
実際のヤバさ
★☆☆☆☆

【7枚目】
現在
普通に生きてます。毎年2回祝うネタになりました。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','友達の誕生日を、1ヶ月まちがえて祝いました。
「祝うべきか、謝るべきか。」と思った。
当時の絶望度：★★★☆☆
その場で2人でケーキを食べました。翌月もちゃんと祝いました。
実際のヤバさ：★☆☆☆☆
普通に生きてます。毎年2回祝うネタになりました。
まあ、生きてる。',3,1,array['特になし']::text[],'','','今では笑い話','','人間関係',array['誕生日','勘違い']::text[],'1年以内','10代','学生','approved','published','2026-09-19T07:00:00.000Z','2026-09-19T07:00:00.000Z',88,30,11,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d11','コピー用紙を、0を1個多く発注しました。','会社の廊下が、コピー用紙の箱で埋まりました。','備品の発注担当になって1ヶ月目。','["10箱のつもりが、100箱で発注。","朝、総務の前に段ボールの壁ができていて気づきました。"]'::jsonb,'倉庫が紙で埋まる。','一部は返品。返品の送料は会社負担になりました。残りは少しずつ使っています。','普通に働いてます。','備品の発注担当になって1ヶ月目。

10箱のつもりが、100箱で発注。

朝、総務の前に段ボールの壁ができていて気づきました。

「倉庫が紙で埋まる。」

当時の絶望度 ★★★★★

一部は返品。返品の送料は会社負担になりました。残りは少しずつ使っています。

実際のヤバさ ★★★☆☆

普通に働いてます。

まあ、生きてる。','HOOK：
会社の廊下が、コピー用紙の箱で埋まりました。

SETUP：
備品の発注担当になって1ヶ月目。

MISTAKE：
10箱のつもりが、100箱で発注。

REALIZATION：
朝、総務の前に段ボールの壁ができていて気づきました。

INNER_VOICE：
「倉庫が紙で埋まる。」

DESPAIR：
★★★★★

CONSEQUENCE：
一部は返品。返品の送料は会社負担になりました。残りは少しずつ使っています。

ACTUAL_DAMAGE：
★★★☆☆

CURRENT_STATUS：
普通に働いてます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
会社の廊下が、コピー用紙の箱で埋まりました。

【2枚目】
備品の発注担当になって1ヶ月目。

【3枚目】
10箱のつもりが、100箱で発注。
朝、総務の前に段ボールの壁ができていて気づきました。

【4枚目】
「倉庫が紙で埋まる。」

当時の絶望度
★★★★★

【5枚目】
結局どうなった？
一部は返品。返品の送料は会社負担になりました。残りは少しずつ使っています。

【6枚目】
実際のヤバさ
★★★☆☆

【7枚目】
現在
普通に働いてます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','コピー用紙を、0を1個多く発注しました。
「倉庫が紙で埋まる。」と思った。
当時の絶望度：★★★★★
一部は返品。返品の送料は会社負担になりました。残りは少しずつ使っています。
実際のヤバさ：★★★☆☆
普通に働いてます。
まあ、生きてる。',5,3,array['お金','信用']::text[],'約4万円','','普通に働いてる','数字は2回見る派になりました。','仕事',array['発注','桁ミス']::text[],'1年以内','20代','会社員','approved','published','2026-09-18T03:00:00.000Z','2026-09-18T03:00:00.000Z',119,77,35,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d12','解約したはずのサブスクを、5年間払っていました。','5年間、一度も使っていないサービスにお金を払っていました。','クレカの明細をたまたま見返した日。','["毎月980円の見覚えのない引き落とし。","調べたら、5年前に「解約したつもり」だったサービスでした。"]'::jsonb,'5年間の私、何してた。','すぐ解約しました。返金はありませんでした。','普通に生きてます。明細は毎月見てます。','クレカの明細をたまたま見返した日。

毎月980円の見覚えのない引き落とし。

調べたら、5年前に「解約したつもり」だったサービスでした。

「5年間の私、何してた。」

当時の絶望度 ★★★☆☆

すぐ解約しました。返金はありませんでした。

実際のヤバさ ★★☆☆☆

普通に生きてます。明細は毎月見てます。

まあ、生きてる。','HOOK：
5年間、一度も使っていないサービスにお金を払っていました。

SETUP：
クレカの明細をたまたま見返した日。

MISTAKE：
毎月980円の見覚えのない引き落とし。

REALIZATION：
調べたら、5年前に「解約したつもり」だったサービスでした。

INNER_VOICE：
「5年間の私、何してた。」

DESPAIR：
★★★☆☆

CONSEQUENCE：
すぐ解約しました。返金はありませんでした。

ACTUAL_DAMAGE：
★★☆☆☆

CURRENT_STATUS：
普通に生きてます。明細は毎月見てます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
5年間、一度も使っていないサービスにお金を払っていました。

【2枚目】
クレカの明細をたまたま見返した日。

【3枚目】
毎月980円の見覚えのない引き落とし。
調べたら、5年前に「解約したつもり」だったサービスでした。

【4枚目】
「5年間の私、何してた。」

当時の絶望度
★★★☆☆

【5枚目】
結局どうなった？
すぐ解約しました。返金はありませんでした。

【6枚目】
実際のヤバさ
★★☆☆☆

【7枚目】
現在
普通に生きてます。明細は毎月見てます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','解約したはずのサブスクを、5年間払っていました。
「5年間の私、何してた。」と思った。
当時の絶望度：★★★☆☆
すぐ解約しました。返金はありませんでした。
実際のヤバさ：★★☆☆☆
普通に生きてます。明細は毎月見てます。
まあ、生きてる。',3,2,array['お金']::text[],'約5.8万円','','まだちょっと引きずってる','','お金',array['サブスク','解約忘れ']::text[],'1週間以内','40代','会社員','approved','published','2026-09-16T21:00:00.000Z','2026-09-16T21:00:00.000Z',64,112,20,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d13','初めての手料理で、砂糖と塩を間違えました。','初めて作った手料理、ひと口目で空気が止まりました。','付き合って1ヶ月。家で晩ごはんを作った日。','["肉じゃがに、砂糖のつもりで塩を大さじ3杯。","相手がひと口食べて無言になって気づきました。"]'::jsonb,'味見しなかった過去の自分をつかまえたい。','2人で笑って、ピザを頼みました。','普通に生きてます。調味料にはラベルを貼りました。','付き合って1ヶ月。家で晩ごはんを作った日。

肉じゃがに、砂糖のつもりで塩を大さじ3杯。

相手がひと口食べて無言になって気づきました。

「味見しなかった過去の自分をつかまえたい。」

当時の絶望度 ★★★☆☆

2人で笑って、ピザを頼みました。

実際のヤバさ ★☆☆☆☆

普通に生きてます。調味料にはラベルを貼りました。

まあ、生きてる。','HOOK：
初めて作った手料理、ひと口目で空気が止まりました。

SETUP：
付き合って1ヶ月。家で晩ごはんを作った日。

MISTAKE：
肉じゃがに、砂糖のつもりで塩を大さじ3杯。

REALIZATION：
相手がひと口食べて無言になって気づきました。

INNER_VOICE：
「味見しなかった過去の自分をつかまえたい。」

DESPAIR：
★★★☆☆

CONSEQUENCE：
2人で笑って、ピザを頼みました。

ACTUAL_DAMAGE：
★☆☆☆☆

CURRENT_STATUS：
普通に生きてます。調味料にはラベルを貼りました。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
初めて作った手料理、ひと口目で空気が止まりました。

【2枚目】
付き合って1ヶ月。家で晩ごはんを作った日。

【3枚目】
肉じゃがに、砂糖のつもりで塩を大さじ3杯。
相手がひと口食べて無言になって気づきました。

【4枚目】
「味見しなかった過去の自分をつかまえたい。」

当時の絶望度
★★★☆☆

【5枚目】
結局どうなった？
2人で笑って、ピザを頼みました。

【6枚目】
実際のヤバさ
★☆☆☆☆

【7枚目】
現在
普通に生きてます。調味料にはラベルを貼りました。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','初めての手料理で、砂糖と塩を間違えました。
「味見しなかった過去の自分をつかまえたい。」と思った。
当時の絶望度：★★★☆☆
2人で笑って、ピザを頼みました。
実際のヤバさ：★☆☆☆☆
普通に生きてます。調味料にはラベルを貼りました。
まあ、生きてる。',3,1,array['モノ']::text[],'','','今では笑い話','','恋愛',array['料理','味付け']::text[],'1ヶ月以内','20代','会社員','approved','published','2026-09-15T13:00:00.000Z','2026-09-15T13:00:00.000Z',95,41,8,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d14','美容院で「おまかせ」と言ったら、ベリーショートになりました。','「おまかせで」の一言で、髪が10センチになりました。','疲れていた平日の夜、いつもと違う美容院へ。','["「おまかせで」と言って目を閉じました。","目を開けたら、鏡の中に知らない人がいました。"]'::jsonb,'明日、会社どうしよう。','翌日、同僚に3回「誰？」と言われました。','3ヶ月で元に戻りました。','疲れていた平日の夜、いつもと違う美容院へ。

「おまかせで」と言って目を閉じました。

目を開けたら、鏡の中に知らない人がいました。

「明日、会社どうしよう。」

当時の絶望度 ★★★★☆

翌日、同僚に3回「誰？」と言われました。

実際のヤバさ ★☆☆☆☆

3ヶ月で元に戻りました。

まあ、生きてる。','HOOK：
「おまかせで」の一言で、髪が10センチになりました。

SETUP：
疲れていた平日の夜、いつもと違う美容院へ。

MISTAKE：
「おまかせで」と言って目を閉じました。

REALIZATION：
目を開けたら、鏡の中に知らない人がいました。

INNER_VOICE：
「明日、会社どうしよう。」

DESPAIR：
★★★★☆

CONSEQUENCE：
翌日、同僚に3回「誰？」と言われました。

ACTUAL_DAMAGE：
★☆☆☆☆

CURRENT_STATUS：
3ヶ月で元に戻りました。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
「おまかせで」の一言で、髪が10センチになりました。

【2枚目】
疲れていた平日の夜、いつもと違う美容院へ。

【3枚目】
「おまかせで」と言って目を閉じました。
目を開けたら、鏡の中に知らない人がいました。

【4枚目】
「明日、会社どうしよう。」

当時の絶望度
★★★★☆

【5枚目】
結局どうなった？
翌日、同僚に3回「誰？」と言われました。

【6枚目】
実際のヤバさ
★☆☆☆☆

【7枚目】
現在
3ヶ月で元に戻りました。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','美容院で「おまかせ」と言ったら、ベリーショートになりました。
「明日、会社どうしよう。」と思った。
当時の絶望度：★★★★☆
翌日、同僚に3回「誰？」と言われました。
実際のヤバさ：★☆☆☆☆
3ヶ月で元に戻りました。
まあ、生きてる。',4,1,array['特になし']::text[],'','','なんとかなった','','日常',array['美容院','髪型']::text[],'1年以内','30代','会社員','approved','published','2026-09-14T03:00:00.000Z','2026-09-14T03:00:00.000Z',176,26,19,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d15','面接官なのに、候補者の名前を最後まで間違えていました。','面接官として、候補者の名前を1時間ずっと間違えていました。','初めて面接官を任された日。','["履歴書を見間違えて、ずっと違う名字で呼んでいました。","面接の最後に「あの、名字は○○です」と言われて気づきました。"]'::jsonb,'この人、絶対入社しない。','その場で謝りました。その人は入社しました。','今では隣の席で、ときどきその名前で呼ばれます。','初めて面接官を任された日。

履歴書を見間違えて、ずっと違う名字で呼んでいました。

面接の最後に「あの、名字は○○です」と言われて気づきました。

「この人、絶対入社しない。」

当時の絶望度 ★★★★☆

その場で謝りました。その人は入社しました。

実際のヤバさ ★★☆☆☆

今では隣の席で、ときどきその名前で呼ばれます。

まあ、生きてる。','HOOK：
面接官として、候補者の名前を1時間ずっと間違えていました。

SETUP：
初めて面接官を任された日。

MISTAKE：
履歴書を見間違えて、ずっと違う名字で呼んでいました。

REALIZATION：
面接の最後に「あの、名字は○○です」と言われて気づきました。

INNER_VOICE：
「この人、絶対入社しない。」

DESPAIR：
★★★★☆

CONSEQUENCE：
その場で謝りました。その人は入社しました。

ACTUAL_DAMAGE：
★★☆☆☆

CURRENT_STATUS：
今では隣の席で、ときどきその名前で呼ばれます。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
面接官として、候補者の名前を1時間ずっと間違えていました。

【2枚目】
初めて面接官を任された日。

【3枚目】
履歴書を見間違えて、ずっと違う名字で呼んでいました。
面接の最後に「あの、名字は○○です」と言われて気づきました。

【4枚目】
「この人、絶対入社しない。」

当時の絶望度
★★★★☆

【5枚目】
結局どうなった？
その場で謝りました。その人は入社しました。

【6枚目】
実際のヤバさ
★★☆☆☆

【7枚目】
現在
今では隣の席で、ときどきその名前で呼ばれます。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','面接官なのに、候補者の名前を最後まで間違えていました。
「この人、絶対入社しない。」と思った。
当時の絶望度：★★★★☆
その場で謝りました。その人は入社しました。
実際のヤバさ：★★☆☆☆
今では隣の席で、ときどきその名前で呼ばれます。
まあ、生きてる。',4,2,array['信用']::text[],'','','今では笑い話','','仕事',array['面接','名前']::text[],'それより前','30代','会社員','approved','published','2026-09-12T15:00:00.000Z','2026-09-12T15:00:00.000Z',141,19,24,true)
on conflict (failure_id) do nothing;
insert into failures (failure_id,title,hook,setup,story,inner_voice,consequence_text,current_line,edited_story,tiktok_script,instagram_carousel,x_post,despair_score,actual_damage_score,loss_types,loss_amount,loss_time,current_status,current_comment,category,subcategory,time_since,age_group,occupation,moderation_status,status,created_at,published_at,laugh_count,same_count,support_count,is_dummy)
values ('dummy_d16','近所の人だと思って10分話した相手が、別人でした。','10分間、知らない人と世間話をしていました。','スーパーの帰り道。','["近所の人だと思って声をかけ、天気や町内会の話を10分。","別れ際に「ところで、どちら様でしたっけ？」と聞かれて気づきました。"]'::jsonb,'じゃあ今の10分は何。','お互い笑って、普通に別れました。','普通に生きてます。その人とはたまに会釈します。','スーパーの帰り道。

近所の人だと思って声をかけ、天気や町内会の話を10分。

別れ際に「ところで、どちら様でしたっけ？」と聞かれて気づきました。

「じゃあ今の10分は何。」

当時の絶望度 ★★★☆☆

お互い笑って、普通に別れました。

実際のヤバさ ★☆☆☆☆

普通に生きてます。その人とはたまに会釈します。

まあ、生きてる。','HOOK：
10分間、知らない人と世間話をしていました。

SETUP：
スーパーの帰り道。

MISTAKE：
近所の人だと思って声をかけ、天気や町内会の話を10分。

REALIZATION：
別れ際に「ところで、どちら様でしたっけ？」と聞かれて気づきました。

INNER_VOICE：
「じゃあ今の10分は何。」

DESPAIR：
★★★☆☆

CONSEQUENCE：
お互い笑って、普通に別れました。

ACTUAL_DAMAGE：
★☆☆☆☆

CURRENT_STATUS：
普通に生きてます。その人とはたまに会釈します。

ENDING：
まあ、生きてる。

CTA：
あなたの「しくった」も教えて。','【1枚目】
10分間、知らない人と世間話をしていました。

【2枚目】
スーパーの帰り道。

【3枚目】
近所の人だと思って声をかけ、天気や町内会の話を10分。
別れ際に「ところで、どちら様でしたっけ？」と聞かれて気づきました。

【4枚目】
「じゃあ今の10分は何。」

当時の絶望度
★★★☆☆

【5枚目】
結局どうなった？
お互い笑って、普通に別れました。

【6枚目】
実際のヤバさ
★☆☆☆☆

【7枚目】
現在
普通に生きてます。その人とはたまに会釈します。

【8枚目】
まあ、生きてる。

しくったら、シクッター。','近所の人だと思って10分話した相手が、別人でした。
「じゃあ今の10分は何。」と思った。
当時の絶望度：★★★☆☆
お互い笑って、普通に別れました。
実際のヤバさ：★☆☆☆☆
普通に生きてます。その人とはたまに会釈します。
まあ、生きてる。',3,1,array['時間']::text[],'','10分','今では笑い話','','人間関係',array['人違い','あいさつ']::text[],'今日','50代以上','その他','approved','published','2026-09-11T01:00:00.000Z','2026-09-11T01:00:00.000Z',109,57,6,true)
on conflict (failure_id) do nothing;
