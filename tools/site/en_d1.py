def en(html):
    return f'<details class="en"><summary>EN</summary><div lang="en">{html}</div></details>'


def qa(q, a):
    return en(f'<p><b>Q:</b> {q}</p><p><b>A:</b> {a}</p>')


def quote(zh, eng):
    # insert before </figure> of the matching quote
    return ('<blockquote>' + zh, '</figure>', 'before', en(f'<p>{eng}</p>'))


def line(anchor, eng, closing='</span></li>', mode='before'):
    return (anchor, closing, mode, en(f'<p>{eng}</p>'))


def summary_qa(zh_q, q, a):
    return (zh_q + '</summary>', '<div class="qa-body">', 'after', qa(q, a))


EDITS = {}

EDITS['d1-keynotes'] = [
    quote('工作在哪裡發生', 'Wherever work happens, that is the platform. And most work happens on Windows.'),
    quote('換機不是成本', 'A PC refresh is not a cost. It is trading risk for productivity.'),
    quote('以前是人去找功能', 'We used to go looking for features. Now agents get the work done for you.'),
    quote('AI 不只在雲端', 'AI is not only in the cloud. It is on your desk, running on your NPU.'),
    quote('客戶要的不是一台漂亮的電腦', 'Customers do not want a pretty computer. They want a business that does not break.'),
    quote('不要贏辯論', 'Don\'t win the argument, win the trust: acknowledge what is great about Mac, then show why Windows is better for the business.'),
    quote('一家賣不如三家一起賣', 'Three sell better than one: Microsoft brings the reason, Intel brings the performance, we bring the service.'),
    quote('行銷基金不是補貼', 'Marketing funds are not a subsidy. They are an amplifier for what you are already doing right.'),
    line('對仍在使用 Windows 10 ESU 的 SMB', 'For SMBs still running Windows 10 on ESU, how do you recommend partners prioritize which customers to refresh first?', '</li>'),
    line('FY27 對 SMB 換機有沒有新的獎勵', 'Are there new incentives or promotional tools for SMB device refresh in FY27?', '</li>'),
    line('代理程式在 Windows 上的權限與稽核', 'For SMBs without a dedicated IT person, what is the simplest way to manage agent permissions and auditing on Windows?', '</li>'),
    line('NPU 的價值要怎麼用', 'How would you explain the value of the NPU in plain business language? Is there official battery or performance comparison material we can use?', '</li>'),
    line('面對設計、行銷部門已經用 Mac 的客戶', 'When a customer\'s design or marketing team already uses Mac, what is the recommended approach for a mixed environment?', '</li>'),
    line('Intel vPro 對沒有 IT 人員的 10–50 人公司', 'For a 10–50 person company with no IT staff, which single Intel vPro capability makes the biggest difference?', '</li>'),
    line('代理商（Distributor）帶著多家經銷商一起辦活動', 'When a distributor runs a joint campaign with multiple resellers, how are funds requested and allocated?', '</li>'),
    line('有沒有亞太區已經成功的聯合活動範本', 'Are there successful joint campaign templates from Asia Pacific that we could replicate in Taiwan?', '</li>'),
    line('「安全不是看品牌', '"Security is not about the brand. It is about whether you can manage every device."', '</td>'),
    line('「開機那一刻', '"From the moment it powers on, Windows is already managed."', '</td>'),
    line('「便宜的不是機器價格', '"The real savings are not in the sticker price. They are in not retraining staff or replacing software."', '</td>'),
    line('「出差一整天，看的是實際用起來', '"On a full day of travel, what matters is real-world use, not the ad."', '</td>'),
    line('「你的生意跑在哪些軟體上', '"Choose the computer that runs the software your business runs on."', '</td>'),
    line('「AI 的價值不在晶片跑分', '"AI\'s value is not in benchmark scores. It is in whether it shows up in your daily work."', '</td>'),
]

EDITS['d1-lab'] = [
    quote('代理程式不取代業務', 'Agents don\'t replace salespeople. They make every salesperson perform like a senior one.'),
    quote('給它你的資料', 'Give it your data and your rules, and it gives you consistent answers.'),
    quote('從半天到三分鐘', 'From half a day to three minutes. The time saved is one more customer visit.'),
    quote('會用 Word 的人', 'If you can use Word, you can build an agent.'),
    line('開場痛點：「業務每做一份換機建議要半天', 'Open with the pain: "Every refresh proposal takes a salesperson half a day: digging through spec sheets, asking product managers, writing the email."'),
    line('開啟代理程式，說明它只讀我們自己的分級表', 'Open the agent. Explain that it only uses our own tier sheet and FAQ, so it will not invent prices.'),
    line('點「規劃換機方案」，等待時說明客戶情境', 'Click "Plan a refresh." While it runs, describe the customer: a 25-person accounting firm.'),
    line('指出表格：會計人員配 S2', 'Walk through the table: accountants get S2 for vPro remote management and data protection, and the total adds up to exactly 18.'),
    line('點「寫提案信」，展示可直接寄出的 email。', 'Click "Write the proposal email" and show an email that is ready to send.'),
    line('收尾：從半天縮到 3 分鐘', 'Wrap up: from half a day to 3 minutes, and every salesperson gives the same quality of advice.'),
    line('金句結束：「代理程式不取代業務', 'Close: "Agents don\'t replace salespeople. They make every salesperson perform like a senior one."'),
    ('<td>用老闆聽得懂的話，說明 Copilot+ PC 和一般 Windows 11 電腦差在哪裡，100 字以內。</td>', '</table></div>', 'after', en(
        '<p><b>English starter prompts</b>（若現場以英文展示，請在 Instructions 的「語氣與格式」改為「依使用者的語言回答」）</p>'
        '<ol>'
        '<li><b>Plan a refresh:</b> The customer is a 25-person accounting firm with 18 Windows 10 PCs. Staff often audit at client sites, they worry about data leaks, they have no dedicated IT, and the budget is under NT$40,000 per device. Recommend a refresh plan.</li>'
        '<li><b>Handle "it still works":</b> The customer says Windows 10 still works and they don\'t want to upgrade now. Give me three ways to respond.</li>'
        '<li><b>Write the proposal email:</b> Turn that plan into an email to the customer\'s owner.</li>'
        '<li><b>Explain Copilot+ PC:</b> In under 60 words, explain to a business owner how a Copilot+ PC differs from a regular Windows 11 PC.</li>'
        '</ol>')),
]

EDITS['d1-discovery'] = [
    summary_qa('公司現在大概有多少台電腦？其中筆電和桌機各多少？',
               'Roughly how many computers does the company have today? How many are laptops versus desktops?',
               '"Mostly laptops, so your team takes them out a lot. Where do people usually work when they are out?"'),
    summary_qa('這些電腦大多用了幾年？還有幾台是 Windows 10？',
               'How old are most of these PCs, and how many still run Windows 10?',
               '"They do still work. But Windows 10 stopped receiving security updates in October 2025, so new vulnerabilities will not be fixed. Of these 18, whose machines hold the most sensitive data?"'),
    summary_qa('同事一天中最常用的三個軟體是什麼？',
               'What are the three applications your team uses most every day?',
               '"All of these run on Windows 11, so nobody has to relearn their software. During tax season, do they run smoothly?"'),
    summary_qa('如果請同事抱怨一件電腦的事，他們最常抱怨什麼？',
               'If I asked your team to complain about one thing with their computers, what would it be?',
               '"When it freezes during tax season, how much time is lost? Has anyone ever lost unsaved work?"'),
    summary_qa('過去一年，有沒有發生過電腦壞掉或資料遺失，影響到工作的事？',
               'In the past year, has a computer failure or data loss ever disrupted work?',
               '"How was that handled? If someone had turned that laptop on, could they have read the data?" Then explain: with BitLocker and Windows Hello on new devices, a lost laptop does not mean lost data, and vPro models can be managed remotely.'),
    summary_qa('新同事到職時，從拿到電腦到能開始工作，大概要多久？',
               'When a new hire joins, how long does it take from getting a computer to being able to work?',
               '"What if the new laptop were shipped straight to the employee, and the apps and settings installed themselves as soon as they signed in with their work account? Would that help?"'),
    summary_qa('你們的客戶或主管機關，對資料保護有沒有要求？',
               'Do your clients or regulators have any requirements around data protection?',
               '"If a client audited you and asked how you protect data on a lost laptop, or how you make sure every device is patched, could you answer today? Windows 11 with Intune gives you a report showing whether each device is encrypted and up to date."'),
    summary_qa('同事登入電腦是用密碼嗎？密碼多久換一次？',
               'Does your team sign in with passwords? How often are they changed?',
               '"New devices let you sign in with your face or fingerprint in a second, with no password to remember. No more passwords taped to the monitor."'),
    summary_qa('電腦出問題時，現在是誰處理？通常多久能解決？',
               'When a computer has a problem, who fixes it today, and how long does it usually take?',
               '"For those one or two days, that person cannot work. With Intel vPro, a technician can fix it remotely, even when the operating system will not boot."'),
    summary_qa('怎麼確認每台電腦都有更新、都有防毒？',
               'How do you know every computer is updated and protected?',
               '"Most companies are in the same position. With Intune in Microsoft 365 Business Premium, you see every device\'s update and security status on one screen and get alerts when something is wrong."'),
    summary_qa('同事現在有在用 ChatGPT、Copilot 之類的 AI 工具嗎？',
               'Is your team already using AI tools like ChatGPT or Copilot?',
               '"With personal accounts, any client data pasted in is outside company control. Microsoft 365 Copilot Chat, signed in with a work account, has enterprise data protection. If a secure AI could help your team with one task first, what would it be?"'),
    summary_qa('哪一件工作最花時間、最重複，又最沒有價值？',
               'Which task takes the most time, is the most repetitive, and adds the least value?',
               '"AI is great at both of those. On a Copilot+ PC you can select content on screen and have AI summarize it, and an agent can draft those recurring letters from a template. Shall I bring a device next time and show you?"'),
    summary_qa('每週大概開多少視訊會議？跟客戶開會時，畫面和聲音的品質重要嗎？',
               'How many video meetings do you have a week? Does picture and sound quality matter with clients?',
               '"The NPU in a Copilot+ PC handles background blur, eye contact and noise suppression without draining the battery. Partners who often meet from outside the office are a great fit for this tier."'),
    summary_qa('如果要換，最希望什麼時候完成？有沒有不能停機的時段？',
               'If you refresh, when would you want it done? Are there periods when you cannot afford downtime?',
               '"Then let\'s work backwards: finish by March, order in February, confirm the plan in January. I\'ll send a proposal this week. Could we meet for 30 minutes next week?"'),
    summary_qa('除了您之外，還有誰會參與這個決定？',
               'Besides you, who else will be involved in this decision?',
               '"I\'ll prepare two versions: benefits and risks for the partners, budget and payment options for the accounting manager. Could all three of you join next time?"'),
    summary_qa('預算是怎麼編的？一次購買、分期或租賃，哪一種比較好處理？',
               'How is your budget planned? Is a one-time purchase, installments or leasing easiest for you?',
               '"We can do it in two phases: the 10 devices with the most sensitive data first, the other 8 next quarter. Or lease them so it becomes a fixed monthly cost that includes warranty and repairs."'),
    summary_qa('「Windows 10 還能用，等壞了再換。」',
               '"Windows 10 still works. We\'ll replace them when they break."',
               '"Turning on is not the same as being secure. Windows 10 no longer gets security updates. It is like a broken lock nobody will fix. The cost of an incident is usually far higher than new PCs. We can start with the devices holding the most sensitive data."'),
    summary_qa('「預算不夠。」',
               '"We don\'t have the budget."',
               '"Understood. We use three tiers, so not everyone needs the top model. Admin staff get the entry tier, people handling client data get the vPro security tier, and the overall budget stays under control. Installments or leasing are options too."'),
    summary_qa('「我們在考慮換 Mac。」',
               '"We\'re thinking about switching to Mac."',
               '"Macs are great. Before switching, check two things: whether your accounting and tax software runs on Mac, and who will manage and repair them. I can put together a compatibility checklist for you."'),
    summary_qa('「AI 我們用不到。」',
               '"We don\'t need AI."',
               '"You mentioned the monthly client letters take the most time. That is exactly what AI does best. And even if you don\'t use AI today, more AI features will arrive over the 4 to 5 years you will own these PCs."'),
    summary_qa('「我們跟原來的電腦行合作很久了。」',
               '"We\'ve worked with our local computer shop for years."',
               '"Long relationships matter. We can work together with your computer shop: we provide the devices and Microsoft solutions, and they keep providing local service."'),
    ('帶新電腦讓大家試用臉部登入。</td>', '</div>', 'after', en(
        '<p><b>English role play (Persona A)</b></p>'
        '<div class="scroll"><table class="tbl en-table"><tbody>'
        '<tr><td>Rep</td><td>Thanks for your time. I\'d like to understand how your firm uses its computers today. About 20 minutes, is that OK?</td></tr>'
        '<tr><td>Customer</td><td>Sure. Our computers have been a bit slow lately.</td></tr>'
        '<tr><td>Rep</td><td>How many computers do you have, and how old are they?</td></tr>'
        '<tr><td>Customer</td><td>18 laptops, mostly six years old, on Windows 10.</td></tr>'
        '<tr><td>Rep</td><td>What do people complain about most?</td></tr>'
        '<tr><td>Customer</td><td>They freeze when we open lots of files during tax season, and they are slow to start.</td></tr>'
        '<tr><td>Rep</td><td>In the past year, has a computer ever failed or gone missing?</td></tr>'
        '<tr><td>Customer</td><td>Last month someone left a laptop on the high-speed train. It had client tax records on it.</td></tr>'
        '<tr><td>Rep</td><td>That must have been stressful. If someone had opened that laptop, could they have read the data? And if it had leaked, what would that have meant for the firm?</td></tr>'
        '<tr><td>Customer</td><td>Probably, yes. We could lose clients, and there could be legal liability.</td></tr>'
        '<tr><td>Rep</td><td>So what matters most is: data stays safe when you are out, no freezes during tax season, and fast help when something breaks. Is that right?</td></tr>'
        '<tr><td>Customer</td><td>Yes, exactly those three.</td></tr>'
        '<tr><td>Rep</td><td>If a new laptop were encrypted, unlocked with your face, and could be fixed remotely, would that meet your expectations?</td></tr>'
        '<tr><td>Customer</td><td>Sounds good, but our budget is tight, under NT$40,000 per device.</td></tr>'
        '<tr><td>Rep</td><td>No problem. We can tier devices by role. To finish before tax season, we would confirm the plan in January and be done by March. Besides you, who else is involved in the decision?</td></tr>'
        '<tr><td>Customer</td><td>My partner and our accounting manager.</td></tr>'
        '<tr><td>Rep</td><td>Great. I\'ll send a proposal this week. Let\'s meet with all three of you for 30 minutes next week, and I\'ll bring a new laptop so everyone can try face sign-in.</td></tr>'
        '</tbody></table></div>')),
    quote('問對問題', 'Ask the right questions, and customers will convince themselves.'),
    quote('先問電腦', 'Ask about the computers, then the work, then the business.'),
    quote('客戶記得的不是你說了什麼', 'Customers don\'t remember what you said. They remember what you asked.'),
    quote('能開機不等於安全，就像門關著', 'A PC that turns on is not necessarily secure, just as a closed door is not necessarily locked.'),
]

EDITS['d1-pitch'] = [
    ('不必重新學。</pre>', '</div>', 'after', en(
        '<p><b>Positioning statement</b></p>'
        '<p>For small and midsize businesses still on Windows 10 that need to protect client data without a dedicated IT team, '
        'Windows 11 Pro business PCs powered by Intel Core Ultra with Intel vPro are a work platform that is secure out of the box, '
        'managed from day one, and AI-ready. They make employees more productive, free owners from worrying about data leaks, '
        'and keep the software and habits the company already has, with nothing new to learn.</p>'
        '<p><b>Four pillars:</b> Secure out of the box · Managed from day one · AI built in · Nothing new to learn</p>')),
    line('開場不要先介紹公司', 'Don\'t open by introducing your company. Ask: "How many Windows 10 PCs are still in your office?" Have people raise their hands so the room sees the problem for itself. <b>Key line:</b> Today we\'re not talking specs. We\'re talking about your business.', '</div>'),
    line('四個改變各講一句', 'One sentence per change, under 60 seconds in total. Focus on the first box: still working does not mean secure. The fourth box introduces the data risk of shadow AI and sets up the AI slide. <b>Key line:</b> A PC that turns on is not necessarily a secure PC.', '</div>'),
    line('用「老闆說過的話」呈現痛點', 'Quoting what owners actually say lands better than statistics. Pause for 3 seconds, then ask: "Which one sounds most like your company?" Demo that part first.', '</div>'),
    line('這頁是整份簡報的核心', 'This is the core slide. The four pillars answer the three pains on the previous slide, and "nothing new to learn" removes the mental cost of switching. <b>Key line:</b> Windows 11 is not a new operating system. It is a new way of working.', '</div>'),
    line('對老闆只講一句', 'For owners, one sentence: "Every layer is looked after, and Microsoft and Intel designed it together." Save the technical detail for IT.', '</div>'),
    line('對沒有 IT 的公司，用「電腦行不用到現場」', 'For companies without IT, explain vPro as "the technician does not need to come on site." <b>Key line:</b> When a PC breaks, you don\'t need a faster PC. You need a PC that gets fixed faster.', '</div>'),
    line('這頁之後直接切到 Demo', 'Go straight to the demo after this slide: "Rather than tell you, let me show you."', '</div>'),
    line('把 Demo 包裝成「一位員工的一天」', 'Frame the demo as a day in the life of one employee. It is easier to remember than a feature tour. Spend more time on the pain the customer picked on slide 3.', '</div>'),
    line('不在這頁報價', 'Don\'t quote prices here. Just say: "We configure by role. Not everyone needs the most expensive model." Save pricing for the next meeting. <b>Key line:</b> We don\'t sell a computer. We deliver a work environment that is ready to go.', '</div>'),
    line('結尾只給一個行動', 'End with one action only: book a 30-minute refresh assessment. Take out your calendar and set the time on the spot.', '</div>'),
    line('今天跟著一位會計小美過一天', '<b>Opening:</b> "Today we\'ll follow Mei, an accountant, through her day." Ask the customer to pick the pain they care about most.'),
    line('說明新電腦直接寄到小美家', '<b>Onboarding:</b> the new laptop ships straight to Mei\'s home. She signs in with her work account, and Office, Wi-Fi and policies install automatically. A 60-second recording works on site.'),
    line('蓋上再打開筆電，臉部辨識一秒登入', '<b>Sign-in and protection:</b> close and reopen the lid, and face recognition signs her in within a second. Open Settings, Privacy &amp; security, Device encryption to show it is on.'),
    line('用 Copilot 摘要客戶寄來的 PDF', '<b>Work:</b> use Copilot to summarize a client PDF. On a Copilot+ PC, use Click to Do to turn a table into a summary. Open the agent to draft a proposal email.'),
    line('開相機，切換背景模糊、自動取景、眼神校正；打開即時字幕', '<b>Meeting:</b> turn on the camera and toggle background blur, automatic framing and eye contact. Turn on live captions.'),
    line('「小美電腦藍屏了。」', '<b>Something breaks:</b> "Mei\'s PC just blue-screened." Switch to the admin console and show vPro remote power-on and remote BIOS access.'),
    line('回到三個痛點各一句', '<b>Close:</b> one sentence for each of the three pains, then propose a 30-minute refresh assessment and book it on the spot.'),
    summary_qa('我的舊電腦能不能直接升級就好？', 'Can\'t we just upgrade our existing PCs?',
               '"We can check. Windows 11 requires TPM 2.0 and a supported processor, and most PCs over five years old don\'t qualify. Even if they do, older PCs have no NPU for on-device AI and no vPro remote management. We can audit which ones can be upgraded and which should be replaced."'),
    summary_qa('Copilot+ PC 要不要每個人都配？', 'Does everyone need a Copilot+ PC?',
               '"No. We recommend them for managers and people who travel or video-call a lot. Admin staff are fine on the entry tier, and people handling sensitive data get the vPro security tier. Configuring by role gives the best value."'),
    summary_qa('Microsoft 365 商務進階版一定要買嗎？', 'Do we have to buy Microsoft 365 Business Premium?',
               '"Not necessarily, but without it you would need other ways to handle Intune management, Autopilot deployment and advanced security. For a company without IT, it is like having a virtual IT person looking after your PCs."'),
    summary_qa('vPro 遠端管理需要什麼環境？', 'What do we need for vPro remote management?',
               '"vPro-capable models with Intel AMT provisioned during deployment, plus Intel Endpoint Management Assistant (EMA) or a supported management tool. Provisioning can be part of our deployment service."'),
    summary_qa('Recall 會不會有隱私問題？', 'Does Recall raise privacy concerns?',
               '"Recall is off by default. Users must opt in and verify with Windows Hello to view it, and the data stays on the device. Businesses can disable or manage it through policy."'),
    quote('Windows 11 不是新的作業系統', 'Windows 11 is not a new operating system. It is a new way of working.'),
    quote('今天不談規格', 'Today we\'re not talking specs. We\'re talking about your business.'),
    quote('能開機，不等於安全。', 'A PC that turns on is not necessarily a secure PC.'),
    quote('電腦壞的時候', 'When a PC breaks, you don\'t need a faster PC. You need a PC that gets fixed faster.'),
    quote('遺失的是硬體', 'You lose the hardware, not your client data.'),
    quote('不是賣一台電腦', 'We don\'t sell a computer. We deliver a work environment that is ready to go.'),
    quote('換機不是成本', 'A PC refresh is not a cost. It is trading risk for productivity.'),
]
