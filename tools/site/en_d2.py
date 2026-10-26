from en_d1 import EDITS, en, quote, line, summary_qa

REPORT_EN = """Our plan is simple: in 90 days, help 18 professional-services firms in Taipei refresh to Windows 11 with peace of mind.

Who: accounting, law, consulting and architecture firms with 25 to 100 people, still on Windows 10, with no dedicated IT. Their three pains are client data leaks, waiting days for IT support, and hours lost on paperwork. Their trigger is tax season, a client audit, or a lost laptop.

What: our Peace of Mind Refresh Bundle. Intel vPro Windows 11 Pro laptops, Copilot+ PCs for managers, Microsoft 365 Business Premium, plus Autopilot deployment, data migration and a three-year on-site warranty. Customers can pay over 36 months.

How: in month one we train 10 core resellers and send co-branded emails. In month two, resellers run 30-minute refresh assessments with our demo units, and we host two security seminars with the accountants' association. In month three, we send proposals within a week of each assessment and close with quarter-end promotions.

Numbers: 600 leads. 15% book an assessment, which gives 90. Half of those get a proposal, which gives 45. 40% close, which gives 18 customers and about 540 devices. We review every 30 days and shift budget if we fall more than 30% behind.

What we need: demo units, Traditional Chinese content, and co-marketing funds for the seminars.

We're not selling computers. We're helping customers shut down their risk before tax season."""

EDITS['d2-sessions'] = [
    line('代理商如何把計畫資源分享給轄下的經銷商', 'How can a distributor share program resources with its resellers, and what reporting is required?', '</li>'),
    line('計畫在台灣與澳洲／紐西蘭的執行方式', 'How will the program run differently in Taiwan compared with Australia and New Zealand?', '</li>'),
    line('報告中有台灣的資料嗎', 'Does the report include Taiwan data? Could we get a Taiwan cut after the session?', '</li>'),
    line('這份報告多久更新一次', 'How often is this report updated, and how can partners access it?', '</li>'),
    line('對 25 人以下、沒有 IT 的公司', 'For companies under 25 people with no IT, which single bundle would you recommend most?', '</li>'),
    line('有沒有給經銷商的 Demo 環境', 'Is there a demo environment or demo tenant that resellers can apply for?', '</li>'),
    line('素材在地化翻譯可以由夥伴自行處理', 'Can partners localize and translate the content themselves, or does it need approval?', '</li>'),
    line('哪一個素材或活動在 SMB 的名單轉換率最高', 'Which asset or campaign has the highest lead conversion rate with SMBs?', '</li>'),
    line('進場時先確認名稱與定義', 'Ask first: "Could you clarify what CPET stands for and how it is defined?"', '</div>'),
    quote('中小企業不是小市場', 'SMB is not a small market. It is ten thousand big markets waiting to be served.'),
    quote('計畫寫在簡報上沒有用', 'A plan on a slide means nothing. It only counts once it is on the calendar.'),
    quote('數據不會幫你賣電腦', 'Data won\'t sell PCs for you, but it tells you which doors to knock on.'),
    quote('SMB 老闆不買規格', 'SMB owners don\'t buy specs. They buy peace of mind.'),
    quote('一台電腦是交易', 'A single PC is a transaction. A complete work environment is a relationship.'),
    quote('好的素材會自己說話', 'Good content speaks for itself. Good salespeople make sure the right people hear it.'),
]

EDITS['d2-workshop'] = [
    summary_qa('為什麼選專業服務業，而不是製造業？', 'Why professional services rather than manufacturing?',
               '"Three reasons: they handle lots of sensitive client data, so security is the most tangible pain; most have no dedicated IT, so vPro and managed services show the most value; and we can reach them efficiently through professional associations. Manufacturing is next quarter."'),
    summary_qa('這個客群在台灣有多大？', 'How big is this segment in Taiwan?',
               '"We estimated reachable leads from association membership and our resellers\' customer lists, starting with 600 firms. What matters is not the total market but how many we can reach in 90 days."'),
    summary_qa('15% 的健檢轉換率會不會太樂觀？', 'Isn\'t a 15% assessment conversion rate too optimistic?',
               '"Email alone won\'t get there, so in month two we add association seminars and reseller phone follow-up. If the day-30 check shows only 8%, we move budget from email to seminars."'),
    summary_qa('經銷商為什麼要配合你的計畫？', 'Why would resellers sign up for your plan?',
               '"Because we take on the hardest parts: training, demo units, deployment services and marketing content. Resellers focus on the customer relationship and closing, and this bundle has a higher average price and attach rate than selling PCs alone."'),
    summary_qa('為什麼方案要包 Microsoft 365 商務進階版？', 'Why include Microsoft 365 Business Premium in the bundle?',
               '"Without it, Autopilot, Intune management and advanced security don\'t work, and peace of mind is just a slogan. It also gives us recurring monthly revenue."'),
    summary_qa('如果客戶只想買電腦呢？', 'What if the customer only wants PCs?',
               '"We\'ll still sell them, but we start with an assessment so they see the risk of skipping the services. Our target is for 60% of closed deals to include services."'),
    summary_qa('你們最需要 Microsoft 和 Intel 提供什麼？', 'What do you need most from Microsoft and Intel?',
               '"Three things, in order: demo units, because the demo is our highest-converting step; Traditional Chinese content; and co-marketing funds for the association seminars."'),
    summary_qa('90 天後怎麼判斷成功或失敗？', 'After 90 days, how will you judge success?',
               '"Primary: 18 customers and 540 devices closed. Secondary: a 60% service attach rate. We check leads at day 30 and assessments at day 60, and adjust if either is more than 30% behind."'),
    line('我們的計畫是 90 天內，讓 18 家', '<b>One line:</b> "Our plan: in 90 days, get 18 professional-services firms working with peace of mind."'),
    line('為什麼選這個客群，三個痛點與換機觸發點', '<b>Segment and pains:</b> why this segment, its three pains, and the triggers that make them refresh now.'),
    line('「安心辦公換機包」的三個組成', '<b>Offer:</b> the three parts of the Peace of Mind Refresh Bundle, plus installment options.'),
    line('名單 → 健檢 → 成交，強調', '<b>90-day rhythm:</b> leads, then assessments, then deals. Stress that the assessment is the key step.'),
    line('漏斗數字與轉換率，三項資源需求', '<b>KPIs and asks:</b> funnel numbers with conversion rates, and our three resource requests.'),
    line('我們不是在賣電腦，是在幫客戶在報稅季前把風險關掉', '<b>Close:</b> "We\'re not selling computers. We\'re helping customers shut down their risk before tax season."'),
    ('<section class="blk" id="report">', '</section>', 'before', en(
        '<div class="codebox"><div class="codebar"><span>Full English report script · about 3 min</span>'
        '<button class="btn-sm" type="button" data-copy="report-en">複製</button></div>'
        f'<pre id="report-en">{REPORT_EN}</pre></div>')),
    quote('計畫的價值不在寫得多完整', 'A plan\'s value is not how complete it looks. It is whether anyone is still running it 30 days later.'),
    quote('選一個客群做到第一', 'Being number one in one segment beats being number ten in ten.'),
    quote('代理商的工作', 'A distributor\'s job is to help every reseller sell like the vendor itself.'),
    quote('我們不是在賣電腦', 'We\'re not selling computers. We\'re helping customers shut down their risk before their busiest season.'),
]

EDITS['d2-envision'] = [
    line('<b>「明年這個時候，公司最希望有什麼不一樣？」</b>', 'Facilitator line: "A year from now, what is the one thing you most want to be different?" Example answer: "Take on 20% more engagements without adding headcount."', '</p>', 'after'),
    line('「這件事在你們公司會發生嗎？如果做到了，對目標有幫助嗎？」', '"Does this happen in your company? If we solved it, would it help your goal?"', '</p>', 'after'),
    line('讓客戶自己操作一次</b>', '"Why don\'t you try it yourself? Type the question you\'d ask on a normal day."', '</p>', 'after'),
    line('「我下週三前把導入路徑與預算寄給您，週五 30 分鐘確認。」', '"I\'ll send you the roadmap and budget by next Wednesday, and we can review it for 30 minutes on Friday."', '</p>', 'after'),
    summary_qa('客戶說「我們沒有想要用 AI」，工作坊還要做嗎？', 'The customer says, "We\'re not interested in AI." Should I still run the workshop?',
               'Yes, but don\'t lead with AI. Start from the business goal and the scenario cards, and the scenarios they pick will naturally include AI. If "processing receipts takes too long" is the pain, the fix happens to be AI, and they won\'t push back.'),
    summary_qa('客戶的目標太模糊，例如「希望公司更好」，怎麼辦？', 'What if the goal is vague, like "We want the company to do better"?',
               'Make it measurable: "Better as in revenue, number of engagements, efficiency or staff retention? If you could pick only one?" Then ask for a number: "How much of an increase would feel like success?"'),
    summary_qa('排序時老闆和主管意見不同，怎麼處理？', 'The owner and managers disagree during prioritization. What do I do?',
               'Write the disagreement down and go back to the goal at the top of the whiteboard: "Which one helps more with 20% more engagements?" Let the goal be the referee, not the salesperson. The decision-maker still has the final say.'),
    summary_qa('現場 Demo 失敗了怎麼辦？', 'What if the live demo fails?',
               'Have a recording or screenshots ready: "Here is what it produced yesterday." Or ask the customer to describe the output they would want, which often clarifies the requirements even better.'),
    summary_qa('第一波情境需要 Microsoft 365 Copilot，但客戶預算有限？', 'The first-wave scenarios need Microsoft 365 Copilot, but the budget is tight.',
               'Prove the value first with Copilot Chat (work sign-in with enterprise data protection) and on-device AI on Copilot+ PCs. Pilot paid licenses with the 2–3 heaviest users and let the time saved decide whether to expand.'),
    summary_qa('經銷商說「我們沒有能力帶工作坊」？', 'A reseller says, "We can\'t run workshops like this."',
               'The distributor provides three things: scenario cards and slide templates, a co-facilitated first session, and help with the proposal and quote afterward. After two sessions, resellers can run it on their own.'),
    summary_qa('Envisioning 工作坊要收費嗎？', 'Should we charge for envisioning workshops?',
               'For SMBs, offer it free as an assessment, an investment before the sale. For customers with 100+ people or custom agent needs, you can charge and credit the fee against the deal. Adjust based on the official guidance from the morning sessions.'),
    quote('先讓客戶看見未來', 'Once customers can see the future, the price is just the ticket to get there.'),
    quote('客戶自己選的方案', 'A plan customers choose themselves doesn\'t need selling.'),
    quote('不要賣 AI', 'Don\'t sell AI. Sell "next year, you get an extra day every week."'),
    quote('探索提問找到問題', 'Discovery finds the problem. Envisioning finds the scope.'),
]

_say = [
    ('一秒登入，也不用把密碼貼在螢幕上。', 'Sign in within a second, with no password taped to the screen.'),
    ('離開座位忘了鎖，電腦自己會鎖。', 'Forget to lock it when you walk away? It locks itself.'),
    ('電腦掉了，別人拿到也讀不到資料。', 'If the laptop is lost, whoever finds it still can\'t read your data.'),
    ('把重複的寫作交給 AI，你專心做判斷。', 'Hand the repetitive writing to AI and focus on the decisions.'),
    ('看到什麼，就能直接處理什麼。', 'Whatever you see on screen, you can act on right away.'),
    ('一個螢幕同時開報表、email 和會議，不用一直切視窗。', 'Report, email and meeting on one screen, without constant window switching.'),
    ('AI 效果交給 NPU，電腦不卡、電池更久。', 'The NPU handles AI effects, so the PC stays fast and the battery lasts longer.'),
    ('跟國外客戶開會，字幕即時幫你翻。', 'Meeting overseas clients? Captions translate for you in real time.'),
    ('打開就能工作，跟手機一樣。', 'Open it and get to work, just like your phone.'),
    ('出差一整天，不用一直找插座。', 'A full day on the road without hunting for a power outlet.'),
    ('系統開不了機，技術人員也能遠端修。', 'Even if Windows won\'t boot, a technician can fix it remotely.'),
]
EDITS['d2-handson'] = [line(f'對客戶說：「{zh}」', f'Say to the customer: "{e}"', '</span>', 'after') for zh, e in _say] + [
    summary_qa('怎麼最快分辨一台機器是不是 Copilot+ PC？', 'What is the fastest way to tell whether a device is a Copilot+ PC?',
               'Check for an NPU of 40+ TOPS, Copilot+ PC branding, and whether exclusive features like Click to Do appear. A Copilot key alone does not mean it is a Copilot+ PC.'),
    summary_qa('vPro 和非 vPro 的 Core Ultra，對 SMB 客戶最大的差別是什麼？', 'For SMB customers, what is the biggest difference between Core Ultra with and without vPro?',
               'Remote out-of-band management with Intel AMT, firmware-level protection from Intel Hardware Shield, and a stable platform built for business. For customers without IT, remote repair matters most.'),
    summary_qa('哪一個功能在客戶面前最有「哇」的效果？', 'Which feature gets the biggest "wow" from customers?',
               'Usually Windows Studio Effects eye contact and background effects, plus Click to Do. Note the trainer\'s recommended demo order.'),
    summary_qa('Demo 時網路不穩，哪些 AI 功能還能用？', 'If the network is unreliable during a demo, which AI features still work?',
               'On-device features that run on the NPU, such as Windows Studio Effects and live captions. Copilot chat and Microsoft 365 Copilot need a connection. It is a great way to show the value of the NPU.'),
    summary_qa('經銷商要怎麼取得示範機？', 'How can resellers get demo units?',
               'Through Intel or OEM demo programs, or co-marketing campaign requests. Note the contact person and eligibility.'),
    summary_qa('客戶最常問、最難回答的問題是什麼？', 'What is the most common, and hardest, question customers ask you?',
               'Open question. Note the trainer\'s answer and add it to the Day 1 objection list.'),
    line('假設你是常外出的業務', '"Imagine you\'re a salesperson on the road, opening your laptop on the high-speed train." Sign in with your face.'),
    line('「客戶寄來一份 10 頁合約。」', '"A client just sent a 10-page contract." Use Copilot or Click to Do to pull out three key points.'),
    line('「接著跟客戶視訊。」', '"Now a video call with the client." Turn on background blur and eye contact, then show the NPU working in Task Manager.'),
    line('「電腦掉了怎麼辦？」說明加密與遠端管理', '"What if you lose the laptop?" Explain encryption and remote management.'),
    line('金句收尾：「這台電腦不只是工具', 'Close: "This PC is not just a tool. It is a personal assistant and a security guard you carry with you."'),
    quote('讓客戶摸到', 'Letting customers touch it is ten times more powerful than telling them about it.'),
    quote('這台電腦不只是工具', 'This PC is not just a tool. It is a personal assistant and a security guard you carry with you.'),
    quote('NPU 是讓 AI 安靜工作的引擎', 'The NPU is the engine that lets AI work quietly: no lag, no fan noise, no battery drain.'),
    quote('沒有網路的時候', 'When the network drops, you find out whose AI really runs on the device.'),
]

ENGLISH_SECTION = """      <section class="blk" id="english">
        <h2><small>SPEAK UP IN ENGLISH</small>英文自我介紹與交流用語</h2>
        <p class="muted small">現場以英文進行。這一區本身就是英文素材，所以直接顯示。方括號內換成自己的資訊。</p>
        <div class="codebox">
          <div class="codebar"><span>30 秒自我介紹</span><button class="btn-sm" type="button" data-copy="intro-en">複製</button></div>
<pre id="intro-en" lang="en">Hi, I'm Allen from Weblink in Taiwan. We're an IT distributor working with [number] resellers across Taiwan, and I focus on [Windows and commercial PCs].
This year our big push is helping SMB customers move off Windows 10 onto Windows 11 and AI PCs.
I'm here to learn how partners in other markets are doing it, and I'd love to hear what's working for you.</pre>
        </div>
        <div class="grid2">
          <div class="card" lang="en">
            <span class="k">在場次中提問 · ASKING A QUESTION</span>
            <ul class="small">
              <li>Thanks for a great session. I'm Allen from Weblink, a distributor in Taiwan. My question is…</li>
              <li>Could you share where partners can download that material?</li>
              <li>Would it be possible to get a copy of the slides after the session?</li>
              <li>Could you give an example of how a partner in Asia Pacific applied this?</li>
            </ul>
          </div>
          <div class="card" lang="en">
            <span class="k">交流破冰 · NETWORKING</span>
            <ul class="small">
              <li>What has been your most effective way to reach SMB customers this year?</li>
              <li>How are your customers reacting to Copilot+ PCs?</li>
              <li>Which co-marketing activity gave you the best return?</li>
              <li>Is this your first time at Power On?</li>
            </ul>
          </div>
          <div class="card" lang="en">
            <span class="k">分組討論 · GROUP WORK</span>
            <ul class="small">
              <li>Shall I take notes for our group?</li>
              <li>In Taiwan, we usually work through resellers, so the distributor's role is…</li>
              <li>Can we agree on one target segment before we move on?</li>
              <li>We have about five minutes left. Let's lock in the numbers.</li>
            </ul>
          </div>
          <div class="card" lang="en">
            <span class="k">卡丁車與晚宴 · KART NIGHT</span>
            <ul class="small">
              <li>Good race! Which group were you in?</li>
              <li>Could we connect on LinkedIn? I'd love to compare notes after the event.</li>
              <li>Would you be open to a quick call next month to share what's working?</li>
              <li>Congratulations on the podium!</li>
            </ul>
          </div>
        </div>
      </section>

"""

EDITS['home'] = [
    quote('這趟不是去聽簡報', 'I\'m not here just to hear presentations. I\'m here to take proven playbooks back to Taiwan.'),
    quote('白天談的是生意', 'By day we talk business; by night we build trust. The friends you make at the race track are the easiest meetings to book later.'),
    ('<section class="blk" id="support">', '<section class="blk" id="support">', 'before', ENGLISH_SECTION),
    ('<li><a href="#support">', '<li><a href="#support">', 'before', '<li><a href="#english">英文交流用語</a></li>\n        '),
]
