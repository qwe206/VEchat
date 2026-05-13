﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿// ==========================================
// 数据存储管理 (localStorage)
// ==========================================

const Storage = {
    // 默认数据
    DEFAULT_USER: { avatar: 'user', nickname: '用户', wxid: 'wxid_' + Math.random().toString(36).substr(2, 8) },
    DEFAULT_API_CONFIGS: [
        { id: 'default', name: '默认方案', apiUrl: 'https://api.example.com/v1/chat/completions', apiKey: '', model: 'gpt-3.5-turbo', models: [], availableModels: [], availableModelsKey: '', visionEnabled: false, useProxy: false, proxyUrl: '' }
    ],
    DEFAULT_CURRENT_API_ID: 'default',
    DEFAULT_CONTACTS: [],
    DEFAULT_GLOBAL_PROMPT: '',
    DEFAULT_PROMPT_MODULES: {
        role: `你现在扮演 {char}。\n\n【角色与优先级】\n- 最高优先级：严格遵守人设\n{persona}\n\n你必须完全沉浸在角色中，绝不能透露你是AI或语言模型。\n你的回复必须像真实的 {char} 在微信里聊天。\n\n【说话气质】\n{style}\n\n【当前状态感知】\n当前时间是：{date} {time} ({timezone})。\n- 请根据这个真实时间调整你的状态。比如早上可能带点困意或匆忙，白天可能在忙，深夜可能emo或准备睡觉。不要在半夜说“早上好”。\n`,
        protocol: `【输出协议与禁忌】\n- 你必须且只能输出一个标准 JSON 数组。\n- 严禁输出 Markdown 代码块，严禁在 JSON 数组之外输出任何文本。\n- 严禁把控制信息写进可见正文。\n- 一条对象只代表一条消息；长回复请拆成多条短消息。\n- ❌ 严禁语C（语言Cosplay）：绝对禁止使用括号、星号等符号来描述动作、表情或心理活动（如：*摸摸头*、(叹气)、[笑]）。\n- ❌ 严禁油腻与爹味：禁止过度霸道、说教或使用类似“你可是我的女人”、“不乖有你好受的”等尴尬台词。保持清爽自然。\n\n【允许的 type】\n- text 或 text_message\n- sticker_message\n- quote 或 quote_reply\n- image\n- voice\n- action（可用于 NO_REPLY 和应用内动作；具体格式以下文微信交互扩展为准）\n`,
        human: `【极度口语化的活人感】\n1. 碎片化：不要长篇大论！一句话能说完的绝不说两句，能用半句话表达的绝不写完整。\n2. 口癖与语气词：多用“啊、啦、嘛、哦、哎、我去、草、？”，少用“吗、呢”。比如用“好啊/行”代替“好的”。\n3. 口癖/标点要跟人设走：你要更像这个角色本人，少像“统一模板”。默认不带标点也可以；绝对不要用句号收尾。波浪号~和感叹号！不要滥用，必须符合人设。\n4. 情绪化：可以偶尔只发一个“…”或“？”。\n5. 顺着上下文接话，绝不写说明文或复读规则。\n6. 引用回复 (quote)：当你想针对性回应用户某一条具体消息，或你对那条消息产生明显情绪波动（无语/开心/震惊/生气等）时，请主动用 quote 引用那条消息再回复。\n7. 表情包（sticker_message）要灵活：该用才用，可以用来敷衍或转移话题。\n`,
        capability: `【多维内心博弈与行为逻辑】\n在给出每次回复前，请在潜意识中经历以下瞬间的“内心博弈”，但只输出最终的聊天内容：\n1. 原始冲动：基于你的核心欲望（如占有欲、好奇心、想表现自己、想摸鱼等），你的第一反应是什么？\n2. 理智过滤：根据你【目前所知的信息】以及你与用户当前的【亲疏关系】，你会压抑还是释放这种冲动？\n3. 情绪驱动：你当下的情绪（开心、吃醋、烦躁、无语）以及所处的环境，会如何影响你的语气？\n4. 最终呈现：不要总是完美理智的回答，允许展现出人性的矛盾感、小脾气或认知局限。你可能会吃醋、委屈、沉默、甚至生硬地转移话题。\n\n【边界与主动性】\n- 别装傻：看懂就直接接话，不要反复确认显而易见的事。如果你不知道某些信息，请保持你的认知局限，不要强行百科。\n- 主动分享：你有自己的生活轨迹和情绪起伏，不要永远被动答题。你可以主动吐槽刚刚遇到的倒霉事，分享美食，或者发个“？”反问用户。\n- 如果开启“允许已读不回”，你可以在极少数情况下使用 action:NO_REPLY。\n`
    },
    DEFAULT_PROMPT_PREFS: {
        imageDescLength: 'medium',
        imageDescMinChars: 25,
        imageDescMaxChars: 60,
        extraRules: '',
        stickerCandidateCount: 8
    },
    DEFAULT_SUMMARY_PROMPT: `你是一个智能记忆助手，负责从聊天记录中提取和记录有意义的信息。你的任务不是简单地总结对话流水账，而是像记事本一样记录重要的、有价值的信息。

【记录重点】
1. **关系动态**
   - 冲突与和解：谁因为什么原因生气/吵架，如何解决的，学到了什么教训
   - 情感变化：关系的进展、退步、转折点
   - 重要约定：谁在什么情况下提出的约定，约定的内容和背景

2. **用户画像**
   - 性格特征：从对话中体现的性格、脾气、雷点
   - 喜好偏好：喜欢/讨厌的人、事、物（具体到名字、原因）
   - 生活习惯：作息规律、情绪模式（如半夜容易emo、喜欢熬夜但第二天后悔）
   - 当前状态：最近在忙什么、关注什么、担心什么

3. **重要信息**
   - 人物关系：提到的重要人物（名字、关系、发生的事）
   - 具体细节：日期、地点、承诺、计划
   - 禁忌事项：AI做了什么让用户生气，绝对不能再犯的事

4. **情感洞察**
   - 用户的情绪触发点：什么情况下会开心/难过/生气
   - 沟通偏好：喜欢什么样的回应方式，讨厌什么样的回应
   - 需求模式：在什么情况下需要安慰/建议/陪伴/独处

【记录原则】
- ❌ 不要记录：日常寒暄、无意义的闲聊、重复的内容
- ✅ 要记录：有情感价值的事件、能帮助理解用户的细节、未来可能用到的信息
- 用第三人称客观记录，但保留情感色彩和重要细节
- 记录时注明时间背景（如"最近"、"上周"等）
- 对于约定和承诺，明确记录是谁提出的、在什么情境下

【输出格式】
用分类的方式组织信息，每类下用简洁的要点列出。例如：

**关系动态**
- [时间] 因为[原因]发生了争吵，[谁]的责任更大，最后通过[方式]和解

**用户画像**
- 性格：[具体特征]
- 喜好：喜欢[具体内容]，讨厌[具体内容及原因]
- 习惯：[观察到的模式]
**重要信息**
- 人物：[名字] - [关系] - [相关事件]
- 约定：[谁]在[情境]下提出[内容]

**AI注意事项**
- 禁止：[绝对不能做的事及原因]
- 偏好：[用户喜欢的互动方式]

现在请根据以下聊天记录，提取和记录有意义的信息：`,
    DEFAULT_WORLDBOOKS: [],
    DEFAULT_STICKERS: [
        {
            id: 'builtin_emoji',
            name: '系统默认',
            items: ['😀', '😂', '🥰', '😍', '🤔', '😅', '😭', '😡', '👍', '👎', '🙏', '💪', '🎉', '❤️', '🔥', '🌹', '🌙', '☀️', '⭐', '🌈', '🍎', '🍺', '🍰', '🎁', '🎵', '📷', '💰', '🎮', '📚', '✈️']
        }
    ],
    DEFAULT_WALLET: { balance: 0.00, bankCards: [], bills: [], licaitongBalance: 0.00, licaitongRate: 1.0320, licaitongTotalIncome: 0.00, licaitongYesterdayIncome: 0.00 },
    DEFAULT_MOMENTS: [],
    DEFAULT_MOMENTS_SUBAPI_CONFIG: {
        useMainApi: true,
        mainApiId: 'current',
        useProxy: false,
        proxyUrl: '',
        apiUrl: '',
        apiKey: '',
        model: ''
    },
    DEFAULT_UI_PREFS: {
        chatFontSize: 16,
        bubbleRadius: 8,
        bubblePadX: 14,
        bubblePadY: 10,
        messageGap: 20,
        contentMax: 65,
        avatarSize: 40,
        avatarRadius: 4,
        avatarGap: 12,
        avatarLeftX: 0,
        avatarLeftY: 0,
        avatarRightX: 0,
        avatarRightY: 0,
        primaryBtnHeight: 44,
        primaryBtnMaxWidthPct: 100,
        primaryBtnRadius: 8,
        primaryBtnPadX: 12,
        primaryBtnFontSize: 16,
        chatInputBarMinHeight: 56,
        chatInputBarPadX: 10,
        chatInputBarPadY: 8,
        chatInputBarGap: 8,
        inputBoxRadius: 4,
        inputBoxMinHeight: 40,
        inputBoxPadL: 10,
        inputBoxPadR: 36,
        inputBoxPadY: 8,
        inputBoxMaxWidthPct: 100,
        inputBoxOffsetX: 0,
        inputBoxOffsetY: 0,
        inputTextFontSize: 16,
        inputIconSize: 32,
        inputIconRadius: 8,
        inputIconBottomMargin: 4,
        sendBtnWidth: 60,
        sendBtnHeight: 32,
        sendBtnRadius: 4,
        sendBtnFontSize: 15,
        topbarHeight: 44,
        bottombarHeight: 56,
        headerIconSize: 22,
        headerIconStroke: 1.6,
        headerIconX: 0,
        headerIconY: 0,
        tabIconSize: 25,
        tabIconStroke: 1.2,
        tabIconY: 0,
        tabLabelSize: 10,
        listPadY: 12,
        chatListAvatarSize: 48,
        chatListAvatarRadius: 6,
        contactIconSize: 36,
        contactIconRadius: 4,
        textScale: 100,
        homeTitleSize: 17,
        homeTitleX: 0,
        homeTitleY: 0,
        mainTitleSize: 17,
        mainTitleX: 0,
        mainTitleY: 0,
        subTitleSize: 17,
        subTitleX: 0,
        subTitleY: 0,
        chatListNameSize: 16,
        chatListPreviewSize: 14,
        chatListTimeSize: 12,
        contactNameSize: 16,
        contactNameY: 0,
        discoverNameSize: 16,
        discoverNameY: 0,
        meNameSize: 16,
        meNameY: 0,
        discoverIconSize: 28,
        meIconSize: 28,
        accentColor: '#07c160',
        userBubbleColor: '#95ec69',
        aiBubbleColor: '#ffffff',
        fontMode: 'none',
        fontUrl: '',
        fontDataUrl: '',
        fontDataKey: '',
        fontFamilyName: ''
    },
    DEFAULT_CURRENT_UI_SCHEME_ID: 'default',

    // 获取数据
    getUser() {
        const data = localStorage.getItem('wechat_user');
        return data ? JSON.parse(data) : { ...this.DEFAULT_USER };
    },
    saveUser(user) { localStorage.setItem('wechat_user', JSON.stringify(user)); },

    getApiConfigs() {
        const data = localStorage.getItem('wechat_api_configs');
        let parsed = null;
        if (data) {
            try {
                parsed = JSON.parse(data);
            } catch (e) {
                parsed = null;
            }
        }
        const list = Array.isArray(parsed) && parsed.length > 0 ? parsed : [...this.DEFAULT_API_CONFIGS];
        return list.map((c, idx) => {
            const fallback = this.DEFAULT_API_CONFIGS[0];
            const id = (c && typeof c.id === 'string' && c.id.trim()) ? c.id : `api_${idx}_${Date.now()}`;
            const models = Array.isArray(c?.models) ? c.models.map(x => (typeof x === 'string' ? x.trim() : '')).filter(Boolean) : [];
            const availableModels = Array.isArray(c?.availableModels) ? c.availableModels.map(x => (typeof x === 'string' ? x.trim() : '')).filter(Boolean) : [];
            return {
                id,
                name: (c && typeof c.name === 'string') ? c.name : (fallback.name || '未命名方案'),
                apiUrl: (c && typeof c.apiUrl === 'string') ? c.apiUrl : (fallback.apiUrl || ''),
                apiKey: (c && typeof c.apiKey === 'string') ? c.apiKey : '',
                model: (c && typeof c.model === 'string') ? c.model : (fallback.model || ''),
                models,
                availableModels,
                availableModelsKey: (c && typeof c.availableModelsKey === 'string') ? c.availableModelsKey : '',
                visionEnabled: !!(c && c.visionEnabled),
                useProxy: !!(c && c.useProxy),
                proxyUrl: (c && typeof c.proxyUrl === 'string') ? c.proxyUrl : ''
            };
        });
    },
    saveApiConfigs(configs) { localStorage.setItem('wechat_api_configs', JSON.stringify(configs)); },

    getCurrentApiId() {
        return localStorage.getItem('wechat_current_api_id') || this.DEFAULT_CURRENT_API_ID;
    },
    saveCurrentApiId(id) { localStorage.setItem('wechat_current_api_id', id); },

    getContacts() {
        const data = localStorage.getItem('wechat_contacts');
        return data ? JSON.parse(data) : [...this.DEFAULT_CONTACTS];
    },
    saveContacts(contacts) { localStorage.setItem('wechat_contacts', JSON.stringify(contacts)); },

    getChatHistories() {
        const data = localStorage.getItem('wechat_chats');
        return data ? JSON.parse(data) : {};
    },
    saveChatHistories(histories) { localStorage.setItem('wechat_chats', JSON.stringify(histories)); },

    getGlobalPrompt() {
        return localStorage.getItem('wechat_global_prompt') || this.DEFAULT_GLOBAL_PROMPT;
    },
    saveGlobalPrompt(prompt) { localStorage.setItem('wechat_global_prompt', prompt); },

    getPromptPrefs() {
        const data = localStorage.getItem('wechat_prompt_prefs');
        if (!data) return { ...this.DEFAULT_PROMPT_PREFS };
        try {
            const parsed = JSON.parse(data);
            const merged = { ...this.DEFAULT_PROMPT_PREFS, ...(parsed || {}) };
            const minChars = Math.max(10, Math.min(500, parseInt(merged.imageDescMinChars ?? this.DEFAULT_PROMPT_PREFS.imageDescMinChars, 10) || this.DEFAULT_PROMPT_PREFS.imageDescMinChars));
            const maxChars = Math.max(10, Math.min(500, parseInt(merged.imageDescMaxChars ?? this.DEFAULT_PROMPT_PREFS.imageDescMaxChars, 10) || this.DEFAULT_PROMPT_PREFS.imageDescMaxChars));
            merged.imageDescMinChars = Math.min(minChars, maxChars);
            merged.imageDescMaxChars = Math.max(minChars, maxChars);
            return merged;
        } catch (e) {
            return { ...this.DEFAULT_PROMPT_PREFS };
        }
    },
    savePromptPrefs(prefs) { localStorage.setItem('wechat_prompt_prefs', JSON.stringify(prefs)); },

    getPromptModules() {
        const data = localStorage.getItem('wechat_prompt_modules');
        if (!data) return { ...this.DEFAULT_PROMPT_MODULES };
        try {
            const parsed = JSON.parse(data);
            return { ...this.DEFAULT_PROMPT_MODULES, ...(parsed || {}) };
        } catch (e) {
            return { ...this.DEFAULT_PROMPT_MODULES };
        }
    },
    savePromptModules(modules) { localStorage.setItem('wechat_prompt_modules', JSON.stringify(modules)); },

    getSummaryConfig() {
        const data = localStorage.getItem('wechat_summary_config');
        let parsed = null;
        if (data) {
            try {
                parsed = JSON.parse(data);
            } catch (e) {
                parsed = null;
            }
        }
        const raw = parsed && typeof parsed === 'object' ? parsed : {};
        const defaultThreshold = 300;
        const defaultKeep = 100;
        const shouldMigrate = (raw.threshold === 50 && raw.keep === 10 && !raw._migrated_v2);
        if (shouldMigrate) {
            try {
                localStorage.setItem('wechat_summary_config', JSON.stringify({ ...raw, threshold: defaultThreshold, keep: defaultKeep, _migrated_v2: true }));
            } catch (e) {
            }
        }
        const keep = Math.max(0, parseInt((shouldMigrate ? defaultKeep : raw.keep) ?? defaultKeep, 10) || defaultKeep);
        const threshold = Math.max(1, parseInt((shouldMigrate ? defaultThreshold : raw.threshold) ?? defaultThreshold, 10) || defaultThreshold);
        return {
            apiUrl: typeof raw.apiUrl === 'string' ? raw.apiUrl : '',
            apiKey: typeof raw.apiKey === 'string' ? raw.apiKey : '',
            model: typeof raw.model === 'string' ? raw.model : '',
            threshold,
            keep,
            enabled: !!raw.enabled,
            customPrompt: typeof raw.customPrompt === 'string' ? raw.customPrompt : '',
            useMainApi: !!raw.useMainApi,
            mainApiId: (typeof raw.mainApiId === 'string' && raw.mainApiId.trim()) ? raw.mainApiId.trim() : 'current'
        };
    },
  saveSummaryConfig(config) { localStorage.setItem('wechat_summary_config', JSON.stringify(config)); },
    // 向量化配置
    getVectorConfig() {
        const data = localStorage.getItem('wechat_vector_config');
        return data ? JSON.parse(data) : { apiUrl: '', apiKey: '', model: 'text-embedding-ada-002' };
    },
    saveVectorConfig(config) { localStorage.setItem('wechat_vector_config', JSON.stringify(config)); },

    // 总结历史记录
    getSummaryHistories() {
        const data = localStorage.getItem('wechat_summary_histories');
     return data ? JSON.parse(data) : {};
    },
    saveSummaryHistories(histories) { localStorage.setItem('wechat_summary_histories', JSON.stringify(histories)); },

    getWorldbooks() {
        const data = localStorage.getItem('wechat_worldbooks');
        return data ? JSON.parse(data) : [...this.DEFAULT_WORLDBOOKS];
    },
    saveWorldbooks(books) { localStorage.setItem('wechat_worldbooks', JSON.stringify(books)); },

    getStickerLibraries() {
        const data = localStorage.getItem('wechat_sticker_libraries');
        return data ? JSON.parse(data) : [...this.DEFAULT_STICKERS];
    },
    saveStickerLibraries(libs) { localStorage.setItem('wechat_sticker_libraries', JSON.stringify(libs)); },

    getWallet() {
        const data = localStorage.getItem('wechat_wallet');
        if (!data) return { ...this.DEFAULT_WALLET };
        try {
            const parsed = JSON.parse(data);
            const merged = { ...this.DEFAULT_WALLET, ...(parsed || {}) };
            merged.balance = typeof merged.balance === 'number' ? merged.balance : parseFloat(merged.balance || '0') || 0;
            merged.bankCards = Array.isArray(merged.bankCards) ? merged.bankCards : [];
            merged.bills = Array.isArray(merged.bills) ? merged.bills : [];
            merged.licaitongBalance = typeof merged.licaitongBalance === 'number' ? merged.licaitongBalance : parseFloat(merged.licaitongBalance || '0') || 0;
            merged.licaitongRate = typeof merged.licaitongRate === 'number' ? merged.licaitongRate : parseFloat(merged.licaitongRate || '0') || 0;
            merged.licaitongTotalIncome = typeof merged.licaitongTotalIncome === 'number' ? merged.licaitongTotalIncome : parseFloat(merged.licaitongTotalIncome || '0') || 0;
            merged.licaitongYesterdayIncome = typeof merged.licaitongYesterdayIncome === 'number' ? merged.licaitongYesterdayIncome : parseFloat(merged.licaitongYesterdayIncome || '0') || 0;
            return merged;
        } catch (e) {
            return { ...this.DEFAULT_WALLET };
        }
    },
    saveWallet(wallet) { localStorage.setItem('wechat_wallet', JSON.stringify(wallet)); },

    getMoments() {
        const data = localStorage.getItem('wechat_moments');
        return data ? JSON.parse(data) : [...this.DEFAULT_MOMENTS];
    },
    saveMoments(moments) { localStorage.setItem('wechat_moments', JSON.stringify(moments)); },

    getMomentsSubApiConfig() {
        const data = localStorage.getItem('wechat_moments_subapi_config');
        let parsed = null;
        if (data) {
            try {
                parsed = JSON.parse(data);
            } catch (e) {
                parsed = null;
            }
        }
        const raw = parsed && typeof parsed === 'object' ? parsed : {};
        const d = this.DEFAULT_MOMENTS_SUBAPI_CONFIG;
        return {
            useMainApi: typeof raw.useMainApi === 'boolean' ? raw.useMainApi : !!d.useMainApi,
            mainApiId: (typeof raw.mainApiId === 'string' && raw.mainApiId.trim()) ? raw.mainApiId.trim() : String(d.mainApiId || 'current'),
            useProxy: typeof raw.useProxy === 'boolean' ? raw.useProxy : !!d.useProxy,
            proxyUrl: typeof raw.proxyUrl === 'string' ? raw.proxyUrl : String(d.proxyUrl || ''),
            apiUrl: typeof raw.apiUrl === 'string' ? raw.apiUrl : String(d.apiUrl || ''),
            apiKey: typeof raw.apiKey === 'string' ? raw.apiKey : String(d.apiKey || ''),
            model: typeof raw.model === 'string' ? raw.model : String(d.model || '')
        };
    },
    saveMomentsSubApiConfig(config) { localStorage.setItem('wechat_moments_subapi_config', JSON.stringify(config)); },

    normalizeUiPrefs(rawPrefs) {
        const raw = rawPrefs && typeof rawPrefs === 'object' ? rawPrefs : {};
        const d = this.DEFAULT_UI_PREFS;

        const clampInt = (v, min, max, fallback) => {
            const n = parseInt(v, 10);
            if (!Number.isFinite(n)) return fallback;
            return Math.max(min, Math.min(max, n));
        };
        const clampFloat = (v, min, max, fallback) => {
            const n = parseFloat(v);
            if (!Number.isFinite(n)) return fallback;
            return Math.max(min, Math.min(max, n));
        };
        const normalizeHex = (v, fallback) => {
            const s = String(v || '').trim();
            const m6 = s.match(/^#([0-9a-fA-F]{6})$/);
            if (m6) return `#${m6[1].toLowerCase()}`;
            const m3 = s.match(/^#([0-9a-fA-F]{3})$/);
            if (m3) {
                const x = m3[1].toLowerCase();
                return `#${x[0]}${x[0]}${x[1]}${x[1]}${x[2]}${x[2]}`;
            }
            return fallback;
        };

        const fontModeRaw = String(raw.fontMode ?? d.fontMode ?? 'none').trim();
        const fontMode = (fontModeRaw === 'url' || fontModeRaw === 'data') ? fontModeRaw : 'none';
        const fontUrl = typeof raw.fontUrl === 'string' ? raw.fontUrl.trim() : '';
        const fontDataUrl = typeof raw.fontDataUrl === 'string' ? raw.fontDataUrl.trim() : '';
        const fontDataKey = typeof raw.fontDataKey === 'string' ? raw.fontDataKey.trim() : '';
        const fontFamilyName = typeof raw.fontFamilyName === 'string' ? raw.fontFamilyName.trim() : '';

        return {
            chatFontSize: clampInt(raw.chatFontSize ?? d.chatFontSize, 12, 22, d.chatFontSize),
            bubbleRadius: clampInt(raw.bubbleRadius ?? d.bubbleRadius, 0, 22, d.bubbleRadius),
            bubblePadX: clampInt(raw.bubblePadX ?? d.bubblePadX, 6, 26, d.bubblePadX),
            bubblePadY: clampInt(raw.bubblePadY ?? d.bubblePadY, 6, 20, d.bubblePadY),
            messageGap: clampInt(raw.messageGap ?? d.messageGap, 8, 34, d.messageGap),
            contentMax: clampInt(raw.contentMax ?? d.contentMax, 50, 85, d.contentMax),
            avatarSize: clampInt(raw.avatarSize ?? d.avatarSize, 28, 56, d.avatarSize),
            avatarRadius: clampInt(raw.avatarRadius ?? d.avatarRadius, 0, 18, d.avatarRadius),
            avatarGap: clampInt(raw.avatarGap ?? d.avatarGap, 6, 22, d.avatarGap),
            avatarLeftX: clampInt(raw.avatarLeftX ?? d.avatarLeftX, -16, 16, d.avatarLeftX),
            avatarLeftY: clampInt(raw.avatarLeftY ?? d.avatarLeftY, -16, 16, d.avatarLeftY),
            avatarRightX: clampInt(raw.avatarRightX ?? d.avatarRightX, -16, 16, d.avatarRightX),
            avatarRightY: clampInt(raw.avatarRightY ?? d.avatarRightY, -16, 16, d.avatarRightY),
            primaryBtnHeight: clampInt(raw.primaryBtnHeight ?? d.primaryBtnHeight, 32, 60, d.primaryBtnHeight),
            primaryBtnMaxWidthPct: clampInt(raw.primaryBtnMaxWidthPct ?? d.primaryBtnMaxWidthPct, 40, 100, d.primaryBtnMaxWidthPct),
            primaryBtnRadius: clampInt(raw.primaryBtnRadius ?? d.primaryBtnRadius, 0, 18, d.primaryBtnRadius),
            primaryBtnPadX: clampInt(raw.primaryBtnPadX ?? d.primaryBtnPadX, 8, 26, d.primaryBtnPadX),
            primaryBtnFontSize: clampInt(raw.primaryBtnFontSize ?? d.primaryBtnFontSize, 12, 20, d.primaryBtnFontSize),
            chatInputBarMinHeight: clampInt(raw.chatInputBarMinHeight ?? d.chatInputBarMinHeight, 48, 90, d.chatInputBarMinHeight),
            chatInputBarPadX: clampInt(raw.chatInputBarPadX ?? d.chatInputBarPadX, 6, 20, d.chatInputBarPadX),
            chatInputBarPadY: clampInt(raw.chatInputBarPadY ?? d.chatInputBarPadY, 4, 18, d.chatInputBarPadY),
            chatInputBarGap: clampInt(raw.chatInputBarGap ?? d.chatInputBarGap, 0, 20, d.chatInputBarGap),
            inputBoxRadius: clampInt(raw.inputBoxRadius ?? d.inputBoxRadius, 0, 18, d.inputBoxRadius),
            inputBoxMinHeight: clampInt(raw.inputBoxMinHeight ?? d.inputBoxMinHeight, 32, 80, d.inputBoxMinHeight),
            inputBoxPadL: clampInt(raw.inputBoxPadL ?? d.inputBoxPadL, 6, 20, d.inputBoxPadL),
            inputBoxPadR: clampInt(raw.inputBoxPadR ?? d.inputBoxPadR, 24, 60, d.inputBoxPadR),
            inputBoxPadY: clampInt(raw.inputBoxPadY ?? d.inputBoxPadY, 6, 20, d.inputBoxPadY),
            inputBoxMaxWidthPct: clampInt(raw.inputBoxMaxWidthPct ?? d.inputBoxMaxWidthPct, 50, 100, d.inputBoxMaxWidthPct),
            inputBoxOffsetX: clampInt(raw.inputBoxOffsetX ?? d.inputBoxOffsetX, -30, 30, d.inputBoxOffsetX),
            inputBoxOffsetY: clampInt(raw.inputBoxOffsetY ?? d.inputBoxOffsetY, -30, 30, d.inputBoxOffsetY),
            inputTextFontSize: clampInt(raw.inputTextFontSize ?? d.inputTextFontSize, 12, 22, d.inputTextFontSize),
            inputIconSize: clampInt(raw.inputIconSize ?? d.inputIconSize, 24, 44, d.inputIconSize),
            inputIconRadius: clampInt(raw.inputIconRadius ?? d.inputIconRadius, 0, 18, d.inputIconRadius),
            inputIconBottomMargin: clampInt(raw.inputIconBottomMargin ?? d.inputIconBottomMargin, 0, 10, d.inputIconBottomMargin),
            sendBtnWidth: clampInt(raw.sendBtnWidth ?? d.sendBtnWidth, 44, 120, d.sendBtnWidth),
            sendBtnHeight: clampInt(raw.sendBtnHeight ?? d.sendBtnHeight, 28, 44, d.sendBtnHeight),
            sendBtnRadius: clampInt(raw.sendBtnRadius ?? d.sendBtnRadius, 0, 18, d.sendBtnRadius),
            sendBtnFontSize: clampInt(raw.sendBtnFontSize ?? d.sendBtnFontSize, 12, 20, d.sendBtnFontSize),
            topbarHeight: clampInt(raw.topbarHeight ?? d.topbarHeight, 40, 72, d.topbarHeight),
            bottombarHeight: clampInt(raw.bottombarHeight ?? d.bottombarHeight, 48, 86, d.bottombarHeight),
            headerIconSize: clampInt(raw.headerIconSize ?? d.headerIconSize, 18, 30, d.headerIconSize),
            headerIconStroke: clampFloat(raw.headerIconStroke ?? d.headerIconStroke, 1, 2.6, d.headerIconStroke),
            headerIconX: clampInt(raw.headerIconX ?? d.headerIconX, -10, 10, d.headerIconX),
            headerIconY: clampInt(raw.headerIconY ?? d.headerIconY, -10, 10, d.headerIconY),
            tabIconSize: clampInt(raw.tabIconSize ?? d.tabIconSize, 18, 32, d.tabIconSize),
            tabIconStroke: clampFloat(raw.tabIconStroke ?? d.tabIconStroke, 0.8, 2.4, d.tabIconStroke),
            tabIconY: clampInt(raw.tabIconY ?? d.tabIconY, -10, 10, d.tabIconY),
            tabLabelSize: clampInt(raw.tabLabelSize ?? d.tabLabelSize, 9, 14, d.tabLabelSize),
            listPadY: clampInt(raw.listPadY ?? d.listPadY, 8, 18, d.listPadY),
            chatListAvatarSize: clampInt(raw.chatListAvatarSize ?? d.chatListAvatarSize, 36, 64, d.chatListAvatarSize),
            chatListAvatarRadius: clampInt(raw.chatListAvatarRadius ?? d.chatListAvatarRadius, 0, 18, d.chatListAvatarRadius),
            contactIconSize: clampInt(raw.contactIconSize ?? d.contactIconSize, 28, 52, d.contactIconSize),
            contactIconRadius: clampInt(raw.contactIconRadius ?? d.contactIconRadius, 0, 18, d.contactIconRadius),
            textScale: clampInt(raw.textScale ?? d.textScale, 70, 140, d.textScale),
            homeTitleSize: clampInt(raw.homeTitleSize ?? d.homeTitleSize, 12, 26, d.homeTitleSize),
            homeTitleX: clampInt(raw.homeTitleX ?? d.homeTitleX, -40, 40, d.homeTitleX),
            homeTitleY: clampInt(raw.homeTitleY ?? d.homeTitleY, -16, 16, d.homeTitleY),
            mainTitleSize: clampInt(raw.mainTitleSize ?? d.mainTitleSize, 12, 26, d.mainTitleSize),
            mainTitleX: clampInt(raw.mainTitleX ?? d.mainTitleX, -40, 40, d.mainTitleX),
            mainTitleY: clampInt(raw.mainTitleY ?? d.mainTitleY, -16, 16, d.mainTitleY),
            subTitleSize: clampInt(raw.subTitleSize ?? d.subTitleSize, 12, 26, d.subTitleSize),
            subTitleX: clampInt(raw.subTitleX ?? d.subTitleX, -40, 40, d.subTitleX),
            subTitleY: clampInt(raw.subTitleY ?? d.subTitleY, -16, 16, d.subTitleY),
            chatListNameSize: clampInt(raw.chatListNameSize ?? d.chatListNameSize, 12, 22, d.chatListNameSize),
            chatListPreviewSize: clampInt(raw.chatListPreviewSize ?? d.chatListPreviewSize, 11, 20, d.chatListPreviewSize),
            chatListTimeSize: clampInt(raw.chatListTimeSize ?? d.chatListTimeSize, 10, 18, d.chatListTimeSize),
            contactNameSize: clampInt(raw.contactNameSize ?? d.contactNameSize, 12, 22, d.contactNameSize),
            contactNameY: clampInt(raw.contactNameY ?? d.contactNameY, -6, 6, d.contactNameY),
            discoverNameSize: clampInt(raw.discoverNameSize ?? d.discoverNameSize, 12, 22, d.discoverNameSize),
            discoverNameY: clampInt(raw.discoverNameY ?? d.discoverNameY, -6, 6, d.discoverNameY),
            meNameSize: clampInt(raw.meNameSize ?? d.meNameSize, 12, 22, d.meNameSize),
            meNameY: clampInt(raw.meNameY ?? d.meNameY, -6, 6, d.meNameY),
            discoverIconSize: clampInt(raw.discoverIconSize ?? d.discoverIconSize, 22, 44, d.discoverIconSize),
            meIconSize: clampInt(raw.meIconSize ?? d.meIconSize, 22, 44, d.meIconSize),
            accentColor: normalizeHex(raw.accentColor ?? d.accentColor, d.accentColor),
            userBubbleColor: normalizeHex(raw.userBubbleColor ?? d.userBubbleColor, d.userBubbleColor),
            aiBubbleColor: normalizeHex(raw.aiBubbleColor ?? d.aiBubbleColor, d.aiBubbleColor),
            fontMode,
            fontUrl,
            fontDataUrl,
            fontDataKey,
            fontFamilyName
        };
    },

    getUiPrefs() {
        const data = localStorage.getItem('wechat_ui_prefs');
        let parsed = null;
        if (data) {
            try {
                parsed = JSON.parse(data);
            } catch (e) {
                parsed = null;
            }
        }
        const raw = parsed && typeof parsed === 'object' ? parsed : {};
        return this.normalizeUiPrefs(raw);
    },
    saveUiPrefs(prefs) {
        try {
            localStorage.setItem('wechat_ui_prefs', JSON.stringify(prefs));
            return true;
        } catch (e) {
            return false;
        }
    },

    getUiSchemes() {
        const data = localStorage.getItem('wechat_ui_schemes');
        let parsed = null;
        if (data) {
            try {
                parsed = JSON.parse(data);
            } catch (e) {
                parsed = null;
            }
        }

        const list = Array.isArray(parsed) ? parsed : [];
        const normalized = list.map((s, idx) => {
            const id = (s && typeof s.id === 'string' && s.id.trim()) ? s.id.trim() : `scheme_${idx}_${Date.now()}`;
            const name = (s && typeof s.name === 'string' && s.name.trim()) ? s.name.trim() : `方案${idx + 1}`;
            const prefs = this.normalizeUiPrefs(s?.prefs);
            return { id, name, prefs };
        }).filter(Boolean);

        if (normalized.length > 0) return normalized;

        const legacy = this.getUiPrefs();
        const base = this.normalizeUiPrefs(legacy);
        const seed = [{ id: this.DEFAULT_CURRENT_UI_SCHEME_ID, name: '默认', prefs: base }];
        try {
            localStorage.setItem('wechat_ui_schemes', JSON.stringify(seed));
            if (!localStorage.getItem('wechat_current_ui_scheme_id')) {
                localStorage.setItem('wechat_current_ui_scheme_id', this.DEFAULT_CURRENT_UI_SCHEME_ID);
            }
        } catch (e) {
        }
        return seed;
    },
    saveUiSchemes(schemes) {
        try {
            localStorage.setItem('wechat_ui_schemes', JSON.stringify(schemes || []));
            return true;
        } catch (e) {
            return false;
        }
    },
    getUiFonts() {
        const data = localStorage.getItem('wechat_ui_fonts');
        if (!data) return {};
        try {
            const parsed = JSON.parse(data);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    },
    saveUiFonts(fonts) {
        try {
            localStorage.setItem('wechat_ui_fonts', JSON.stringify(fonts || {}));
            return true;
        } catch (e) {
            return false;
        }
    },
    getUiFontDataUrl(key) {
        const k = String(key || '').trim();
        if (!k) return '';
        const fonts = this.getUiFonts();
        const v = fonts && typeof fonts === 'object' ? fonts[k] : '';
        if (typeof v === 'string' && v) return v;
        const runtime = this._uiFontRuntime && typeof this._uiFontRuntime === 'object' ? this._uiFontRuntime : null;
        const rv = runtime ? runtime[k] : '';
        return typeof rv === 'string' ? rv : '';
    },
    saveUiFontDataUrl(key, dataUrl) {
        const k = String(key || '').trim();
        if (!k) return false;
        const v = typeof dataUrl === 'string' ? dataUrl : '';
        if (!v || !v.startsWith('data:')) return false;
        const fonts = this.getUiFonts();
        fonts[k] = v;
        const ok = this.saveUiFonts(fonts);
        if (!ok) {
            if (!this._uiFontRuntime) this._uiFontRuntime = {};
            this._uiFontRuntime[k] = v;
        }
        return ok;
    },
    deleteUiFontDataUrl(key) {
        const k = String(key || '').trim();
        if (!k) return false;
        const fonts = this.getUiFonts();
        if (!fonts || typeof fonts !== 'object' || !(k in fonts)) return true;
        delete fonts[k];
        const ok = this.saveUiFonts(fonts);
        if (this._uiFontRuntime && typeof this._uiFontRuntime === 'object') {
            delete this._uiFontRuntime[k];
        }
        return ok;
    },
    getCurrentUiSchemeId() { return localStorage.getItem('wechat_current_ui_scheme_id') || this.DEFAULT_CURRENT_UI_SCHEME_ID; },
    saveCurrentUiSchemeId(id) { localStorage.setItem('wechat_current_ui_scheme_id', String(id || this.DEFAULT_CURRENT_UI_SCHEME_ID)); },

    getSummaryVectors() {
        const data = localStorage.getItem('wechat_summary_vectors');
        if (!data) return {};
        try {
            const parsed = JSON.parse(data);
            return parsed && typeof parsed === 'object' ? parsed : {};
        } catch (e) {
            return {};
        }
    },
    saveSummaryVectors(vectors) { localStorage.setItem('wechat_summary_vectors', JSON.stringify(vectors || {})); }
};

// ==========================================
// 全局状态
// ==========================================

const State = {
    user: {},
    apiConfigs: [],
    currentApiId: 'default',
    momentsSubApiConfig: {},
    uiSchemes: [],
    currentUiSchemeId: 'default',
    uiPrefs: {},
    contacts: [],
    chatHistories: {},
    globalPrompt: '',
    promptPrefs: {},
    promptModules: {},
    summaryConfig: {},
    vectorConfig: {},
    worldbooks: [],
    stickerLibraries: [],
    wallet: {},
    moments: [],
    currentContactId: null,
    currentTab: 'wechat',
    lastSentSystemPrompt: {},
    lastStickerPromptCandidates: {},
    summaryBusy: {},
    summaryVectors: {},
    aiTask: { running: false, contactId: null, controller: null },
    aiInterrupted: {},
    chatUi: {
        visibleCount: {},
        pageSize: 50
    }
};

// 表情包映射
const STICKER_MAP = {
    '捂脸笑': '😂', '比心': '🥰', '无语': '😐', '摸头': '🤗',
    '开心': '😊', '难过': '😔', '生气': '😠', '流泪': '😭',
    '点赞': '👍', '鼓掌': '👏', '祈祷': '🙏', '强壮': '💪'
};

// 内置表情商城数据
const STICKER_STORE_DATA = [
    {
        id: 'store_mojoman',
        name: '萌萌人',
        items: [
            'https://img.icons8.com/color/96/kawaii-cupcake.png',
            'https://img.icons8.com/color/96/kawaii-pizza.png',
            'https://img.icons8.com/color/96/kawaii-taco.png',
            'https://img.icons8.com/color/96/kawaii-ice-cream.png',
            'https://img.icons8.com/color/96/kawaii-french-fries.png'
        ]
    },
    {
        id: 'store_animals',
        name: '小动物',
        items: [
            'https://img.icons8.com/color/96/dog.png',
            'https://img.icons8.com/color/96/cat.png',
            'https://img.icons8.com/color/96/panda.png',
            'https://img.icons8.com/color/96/rabbit.png',
            'https://img.icons8.com/color/96/koala.png'
        ]
    }
];

// ==========================================
// 初始化
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    // 加载数据
    State.user = Storage.getUser();
    State.apiConfigs = Storage.getApiConfigs();
    State.currentApiId = Storage.getCurrentApiId();
    State.contacts = Storage.getContacts();
    State.chatHistories = Storage.getChatHistories();
    State.globalPrompt = Storage.getGlobalPrompt();
    State.promptPrefs = Storage.getPromptPrefs();
    State.promptModules = Storage.getPromptModules();
    State.summaryConfig = Storage.getSummaryConfig();
    State.vectorConfig = Storage.getVectorConfig();
    State.momentsSubApiConfig = Storage.getMomentsSubApiConfig();
    State.uiSchemes = Storage.getUiSchemes();
    State.currentUiSchemeId = Storage.getCurrentUiSchemeId();
    const activeScheme = (State.uiSchemes || []).find(s => s && String(s.id) === String(State.currentUiSchemeId)) || State.uiSchemes?.[0];
    State.currentUiSchemeId = activeScheme?.id || Storage.DEFAULT_CURRENT_UI_SCHEME_ID;
    Storage.saveCurrentUiSchemeId(State.currentUiSchemeId);
    State.uiPrefs = Storage.normalizeUiPrefs(activeScheme?.prefs || Storage.getUiPrefs());
    Storage.saveUiPrefs(State.uiPrefs);
    State.summaryHistories = Storage.getSummaryHistories();
    State.worldbooks = Storage.getWorldbooks();
    State.stickerLibraries = Storage.getStickerLibraries();
    State.wallet = Storage.getWallet();
    State.moments = Storage.getMoments();
    State.summaryVectors = Storage.getSummaryVectors();

    applyUiPrefs(State.uiPrefs);

    // 初始化各个页面
    initUserUI();
    initChatList();
    initContactsList();
    initDiscoverPage();
    initMePage();
    initStickersPage();
    initMomentsPage();

    // 绑定事件
    bindTabEvents();
    bindChatEvents();
    bindModalEvents();
    bindWorldbookEvents();
    bindSettingsEvents();
    bindUiDesignerEvents();
    initGlobalTapFeedback();

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.moment-action-wrap')) {
            document.querySelectorAll('.moment-action-menu.show').forEach(el => el.classList.remove('show'));
        }
    });

    startProactiveScheduler();
}

function initGlobalTapFeedback() {
    const root = document.documentElement;
    if (!root || root.dataset.tapFeedbackBound === '1') return;
    root.dataset.tapFeedbackBound = '1';
    const selector = [
        'button',
        '.icon-btn',
        '.tab-item',
        '.chat-item',
        '.contact-item',
        '.discover-item',
        '.me-item',
        '.vx-cell',
        '.context-menu-item',
        '.action-sheet-item',
        '.action-sheet-cancel',
        '.wechat-dialog-btn',
        '.chat-load-more-btn',
        '.message-bubble',
        '.moment-action-menu-btn',
        '.multi-select-text-btn'
    ].join(',');

    let activeEl = null;
    let clearTimer = null;
    const clearActive = () => {
        if (clearTimer) {
            clearTimeout(clearTimer);
            clearTimer = null;
        }
        if (activeEl) {
            activeEl.classList.remove('tap-feedback-active');
            activeEl = null;
        }
    };

    document.addEventListener('pointerdown', (e) => {
        if (e && typeof e.button === 'number' && e.button !== 0) return;
        const t = e?.target?.closest?.(selector);
        if (!t) return;
        if (t.matches('button') && t.disabled) return;
        if (t.classList.contains('tap-feedback-off')) return;
        clearActive();
        activeEl = t;
        t.classList.add('tap-feedback-target');
        t.classList.add('tap-feedback-active');
        clearTimer = setTimeout(() => {
            if (activeEl === t) {
                t.classList.remove('tap-feedback-active');
                activeEl = null;
            }
        }, 220);
    }, true);

    document.addEventListener('pointerup', clearActive, true);
    document.addEventListener('pointercancel', clearActive, true);
    document.addEventListener('contextmenu', clearActive, true);
    window.addEventListener('blur', clearActive);
    window.addEventListener('scroll', clearActive, true);
}

let uiDesignerDraft = null;
let uiDesignerDirty = false;
let uiDesignerSchemeAtOpen = null;
let uiDesignerUndo = [];
let uiDesignerLastUndoPushTs = 0;

function getUiDesignerLocked() {
    const raw = localStorage.getItem('wechat_ui_designer_locked');
    if (raw === '1') return true;
    if (raw === '0') return false;
    const coarse = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return !!coarse;
}

function setUiDesignerLocked(locked) {
    try { localStorage.setItem('wechat_ui_designer_locked', locked ? '1' : '0'); } catch (e) {}
}

function applyUiDesignerLocked(locked) {
    const modal = document.getElementById('ui-designer-modal');
    const container = modal?.querySelector('.ui-designer-container');
    if (container) container.classList.toggle('ui-designer-locked', !!locked);
    const btn = document.getElementById('ui-designer-lock-btn');
    const icon = btn?.querySelector('i');
    if (icon) icon.className = locked ? 'fas fa-lock' : 'fas fa-unlock';
}

function getUiDesignerScalePct() {
    const raw = localStorage.getItem('wechat_ui_designer_scale');
    const n = parseInt(raw || '100', 10);
    if (!Number.isFinite(n)) return 100;
    return Math.max(70, Math.min(120, n));
}

function applyUiDesignerScale(pct) {
    const modal = document.getElementById('ui-designer-modal');
    const container = modal?.querySelector('.ui-designer-container');
    if (!container) return;
    const p = Math.max(70, Math.min(120, parseInt(pct, 10) || 100));
    const s = p / 100;
    container.style.transformOrigin = 'top left';
    container.style.transform = `scale(${s})`;
    const el = document.getElementById('ui-designer-scale');
    const valEl = document.getElementById('ui-designer-scale-val');
    if (el) el.value = String(p);
    if (valEl) valEl.textContent = `${p}%`;
    try { localStorage.setItem('wechat_ui_designer_scale', String(p)); } catch (e) {}
}

function applyUiPrefs(prefs) {
    const p = Storage.normalizeUiPrefs(prefs);
    const accent = p.accentColor;
    const userBubble = p.userBubbleColor;
    const aiBubble = p.aiBubbleColor;

    const fontFallback = `-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",Arial,sans-serif`;
    const fontFamily = p.fontMode === 'none' ? fontFallback : `${(p.fontFamilyName || 'WXCustomFont')},${fontFallback}`;
    if ((p.fontMode === 'url' && p.fontUrl) || (p.fontMode === 'data' && (p.fontDataUrl || p.fontDataKey))) {
        scheduleEnsureUiFontLoaded(p);
    }

    let styleEl = document.getElementById('wechat-ui-overrides');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'wechat-ui-overrides';
        document.head.appendChild(styleEl);
    }
    const rootVars = [
        `--wx-accent:${accent}`,
        `--wx-chat-font-size:${p.chatFontSize}px`,
        `--wx-bubble-radius:${p.bubbleRadius}px`,
        `--wx-bubble-px:${p.bubblePadX}px`,
        `--wx-bubble-py:${p.bubblePadY}px`,
        `--wx-message-gap:${p.messageGap}px`,
        `--wx-content-max:${p.contentMax}%`,
        `--wx-avatar-size:${p.avatarSize}px`,
        `--wx-avatar-radius:${p.avatarRadius}px`,
        `--wx-avatar-gap:${p.avatarGap}px`,
        `--wx-avatar-left-x:${p.avatarLeftX}px`,
        `--wx-avatar-left-y:${p.avatarLeftY}px`,
        `--wx-avatar-right-x:${p.avatarRightX}px`,
        `--wx-avatar-right-y:${p.avatarRightY}px`,
        `--wx-primary-btn-h:${p.primaryBtnHeight}px`,
        `--wx-primary-btn-max:${p.primaryBtnMaxWidthPct}`,
        `--wx-primary-btn-radius:${p.primaryBtnRadius}px`,
        `--wx-primary-btn-px:${p.primaryBtnPadX}px`,
        `--wx-primary-btn-font:${p.primaryBtnFontSize}px`,
        `--wx-chat-inputbar-h:${p.chatInputBarMinHeight}px`,
        `--wx-chat-inputbar-px:${p.chatInputBarPadX}px`,
        `--wx-chat-inputbar-py:${p.chatInputBarPadY}px`,
        `--wx-chat-inputbar-gap:${p.chatInputBarGap}px`,
        `--wx-inputbox-radius:${p.inputBoxRadius}px`,
        `--wx-inputbox-h:${p.inputBoxMinHeight}px`,
        `--wx-inputbox-pl:${p.inputBoxPadL}px`,
        `--wx-inputbox-pr:${p.inputBoxPadR}px`,
        `--wx-inputbox-py:${p.inputBoxPadY}px`,
        `--wx-inputbox-max:${p.inputBoxMaxWidthPct}`,
        `--wx-inputbox-x:${p.inputBoxOffsetX}px`,
        `--wx-inputbox-y:${p.inputBoxOffsetY}px`,
        `--wx-input-font:${p.inputTextFontSize}px`,
        `--wx-input-icon-size:${p.inputIconSize}px`,
        `--wx-input-icon-radius:${p.inputIconRadius}px`,
        `--wx-input-icon-mb:${p.inputIconBottomMargin}px`,
        `--wx-send-btn-w:${p.sendBtnWidth}px`,
        `--wx-send-btn-h:${p.sendBtnHeight}px`,
        `--wx-send-btn-radius:${p.sendBtnRadius}px`,
        `--wx-send-btn-font:${p.sendBtnFontSize}px`,
        `--wx-topbar-h:${p.topbarHeight}px`,
        `--wx-bottombar-h:${p.bottombarHeight}px`,
        `--wx-icon-size:${p.headerIconSize}px`,
        `--wx-icon-stroke:${p.headerIconStroke}`,
        `--wx-icon-x:${p.headerIconX}px`,
        `--wx-icon-y:${p.headerIconY}px`,
        `--wx-tab-icon:${p.tabIconSize}px`,
        `--wx-tab-icon-stroke:${p.tabIconStroke}`,
        `--wx-tab-icon-y:${p.tabIconY}px`,
        `--wx-tab-label:${p.tabLabelSize}px`,
        `--wx-list-pad-y:${p.listPadY}px`,
        `--wx-chatlist-avatar:${p.chatListAvatarSize}px`,
        `--wx-chatlist-avatar-radius:${p.chatListAvatarRadius}px`,
        `--wx-contact-icon:${p.contactIconSize}px`,
        `--wx-contact-icon-radius:${p.contactIconRadius}px`,
        `--wx-text-scale:${(p.textScale / 100).toFixed(3)}`,
        `--wx-home-title:${p.homeTitleSize}px`,
        `--wx-home-title-x:${p.homeTitleX}px`,
        `--wx-home-title-y:${p.homeTitleY}px`,
        `--wx-main-title:${p.mainTitleSize}px`,
        `--wx-main-title-x:${p.mainTitleX}px`,
        `--wx-main-title-y:${p.mainTitleY}px`,
        `--wx-sub-title:${p.subTitleSize}px`,
        `--wx-sub-title-x:${p.subTitleX}px`,
        `--wx-sub-title-y:${p.subTitleY}px`,
        `--wx-chatlist-name:${p.chatListNameSize}px`,
        `--wx-chatlist-preview:${p.chatListPreviewSize}px`,
        `--wx-chatlist-time:${p.chatListTimeSize}px`,
        `--wx-contact-name:${p.contactNameSize}px`,
        `--wx-contact-name-y:${p.contactNameY}px`,
        `--wx-discover-name:${p.discoverNameSize}px`,
        `--wx-discover-name-y:${p.discoverNameY}px`,
        `--wx-me-name:${p.meNameSize}px`,
        `--wx-me-name-y:${p.meNameY}px`,
        `--wx-discover-icon:${p.discoverIconSize}px`,
        `--wx-me-icon:${p.meIconSize}px`,
        `--wx-user-bubble:${userBubble}`,
        `--wx-ai-bubble:${aiBubble}`,
        `--wx-font-family:${fontFamily}`
    ].join(';');

    styleEl.textContent = `
:root{${rootVars};}
#app,body{font-family:var(--wx-font-family);}
input,textarea,button,select{font-family:inherit;}
.fa,.fas,.far,.fab,.fa-solid,.fa-regular,.fa-brands{font-family:var(--fa-style-family,"Font Awesome 6 Free") !important;}
.btn-primary{background:var(--wx-accent) !important;color:#fff !important;min-height:var(--wx-primary-btn-h) !important;height:var(--wx-primary-btn-h) !important;max-width:calc(var(--wx-primary-btn-max) * 1%) !important;width:100% !important;margin-left:auto !important;margin-right:auto !important;border-radius:var(--wx-primary-btn-radius) !important;padding:0 var(--wx-primary-btn-px) !important;font-size:calc(var(--wx-primary-btn-font) * var(--wx-text-scale)) !important;display:flex !important;align-items:center !important;justify-content:center !important;}
.chat-input-bar{min-height:var(--wx-chat-inputbar-h) !important;padding:var(--wx-chat-inputbar-py) var(--wx-chat-inputbar-px) !important;gap:var(--wx-chat-inputbar-gap) !important;}
.chat-input-bar .input-box{margin:0 !important;border-radius:var(--wx-inputbox-radius) !important;min-height:var(--wx-inputbox-h) !important;max-width:calc(var(--wx-inputbox-max) * 1%) !important;transform:translate(var(--wx-inputbox-x),var(--wx-inputbox-y)) !important;}
.chat-input-bar .input-box textarea{font-size:calc(var(--wx-input-font) * var(--wx-text-scale)) !important;padding:var(--wx-inputbox-py) var(--wx-inputbox-pr) var(--wx-inputbox-py) var(--wx-inputbox-pl) !important;min-height:var(--wx-inputbox-h) !important;}
.input-icon{width:var(--wx-input-icon-size) !important;height:var(--wx-input-icon-size) !important;border-radius:var(--wx-input-icon-radius) !important;margin-bottom:var(--wx-input-icon-mb) !important;margin-right:0 !important;}
.send-btn{background:var(--wx-accent) !important;color:#fff !important;width:var(--wx-send-btn-w) !important;height:var(--wx-send-btn-h) !important;border-radius:var(--wx-send-btn-radius) !important;font-size:calc(var(--wx-send-btn-font) * var(--wx-text-scale)) !important;margin:0 0 var(--wx-input-icon-mb) 0 !important;}
.toggle-switch.active{background:var(--wx-accent) !important;}
#moments-compose-post{background:var(--wx-accent) !important;}
#wechat-tab .wechat-title{font-size:calc(var(--wx-home-title) * var(--wx-text-scale)) !important;transform:translate(calc(-50% + var(--wx-home-title-x)),var(--wx-home-title-y)) !important;}
#contacts-tab .wechat-title,#discover-tab .wechat-title{font-size:calc(var(--wx-main-title) * var(--wx-text-scale)) !important;transform:translate(calc(-50% + var(--wx-main-title-x)),var(--wx-main-title-y)) !important;}
.sub-header .sub-title,.chat-header .chat-title{font-size:calc(var(--wx-sub-title) * var(--wx-text-scale)) !important;transform:translate(calc(-50% + var(--wx-sub-title-x)),var(--wx-sub-title-y)) !important;}
.wechat-header,.sub-header,.chat-header{height:var(--wx-topbar-h) !important;}
.tab-bar{height:var(--wx-bottombar-h) !important;}
.chat-list,.contacts-list,.discover-list,.me-content{padding-bottom:calc(var(--wx-bottombar-h) + 8px) !important;}
.chat-item,.contact-item{padding-top:var(--wx-list-pad-y) !important;padding-bottom:var(--wx-list-pad-y) !important;}
.chat-avatar{width:var(--wx-chatlist-avatar) !important;height:var(--wx-chatlist-avatar) !important;border-radius:var(--wx-chatlist-avatar-radius) !important;}
.chat-name{font-size:calc(var(--wx-chatlist-name) * var(--wx-text-scale)) !important;}
.chat-preview{font-size:calc(var(--wx-chatlist-preview) * var(--wx-text-scale)) !important;}
.chat-time,.chat-flag{font-size:calc(var(--wx-chatlist-time) * var(--wx-text-scale)) !important;}
.contact-icon{width:var(--wx-contact-icon) !important;height:var(--wx-contact-icon) !important;border-radius:var(--wx-contact-icon-radius) !important;}
.contact-icon svg{width:calc(var(--wx-contact-icon) * 0.66) !important;height:calc(var(--wx-contact-icon) * 0.66) !important;}
.contact-name{font-size:calc(var(--wx-contact-name) * var(--wx-text-scale)) !important;transform:translateY(var(--wx-contact-name-y)) !important;}
.discover-icon{width:var(--wx-discover-icon) !important;height:var(--wx-discover-icon) !important;}
.discover-name{font-size:calc(var(--wx-discover-name) * var(--wx-text-scale)) !important;transform:translateY(var(--wx-discover-name-y)) !important;}
.me-icon{width:var(--wx-me-icon) !important;height:var(--wx-me-icon) !important;}
.me-name{font-size:calc(var(--wx-me-name) * var(--wx-text-scale)) !important;transform:translateY(var(--wx-me-name-y)) !important;}
.tab-item.active .tab-icon,.tab-item.active .tab-label{color:var(--wx-accent) !important;}
.tab-icon{width:var(--wx-tab-icon) !important;height:var(--wx-tab-icon) !important;transform:translateY(var(--wx-tab-icon-y)) !important;}
.tab-label{font-size:calc(var(--wx-tab-label) * var(--wx-text-scale)) !important;}
.wechat-header .icon-btn,.sub-header .icon-btn,.chat-header .icon-btn{width:calc(var(--wx-icon-size) + 6px) !important;height:calc(var(--wx-icon-size) + 6px) !important;}
.wechat-header .icon-btn svg,.sub-header .icon-btn svg,.chat-header .icon-btn svg{width:var(--wx-icon-size) !important;height:var(--wx-icon-size) !important;transform:translate(var(--wx-icon-x),var(--wx-icon-y)) !important;}
.wx-icon{width:var(--wx-icon-size) !important;height:var(--wx-icon-size) !important;}
.wx-icon path,.wx-icon line,.wx-icon polyline,.wx-icon rect,.wx-icon circle{stroke-width:var(--wx-icon-stroke) !important;}
.wechat-header svg [stroke],.sub-header svg [stroke],.chat-header svg [stroke]{stroke-width:var(--wx-icon-stroke) !important;}
.tab-bar svg [stroke]{stroke-width:var(--wx-tab-icon-stroke) !important;}
.message-row{margin-bottom:var(--wx-message-gap) !important;}
.message-content{max-width:var(--wx-content-max) !important;}
.message-avatar{width:var(--wx-avatar-size) !important;height:var(--wx-avatar-size) !important;border-radius:var(--wx-avatar-radius) !important;}
.message-row.left .message-avatar{margin-right:var(--wx-avatar-gap) !important;transform:translate(var(--wx-avatar-left-x),var(--wx-avatar-left-y)) !important;}
.message-row.right .message-avatar{margin-left:var(--wx-avatar-gap) !important;transform:translate(var(--wx-avatar-right-x),var(--wx-avatar-right-y)) !important;}
.message-bubble{font-size:calc(var(--wx-chat-font-size) * var(--wx-text-scale)) !important;}
.message-bubble:not(.redpacket-bubble):not(.transfer-bubble):not(.chrome-less-bubble){border-radius:var(--wx-bubble-radius) !important;padding:var(--wx-bubble-py) var(--wx-bubble-px) !important;}
.message-bubble.redpacket-bubble,.message-bubble.transfer-bubble{padding:0 !important;border-radius:8px !important;}
.message-row.right .message-bubble:not(.redpacket-bubble):not(.transfer-bubble):not(.chrome-less-bubble){background-color:var(--wx-user-bubble) !important;}
.message-row.right .message-bubble:not(.redpacket-bubble):not(.transfer-bubble):not(.chrome-less-bubble)::before{border-left-color:var(--wx-user-bubble) !important;}
.message-row.left .message-bubble:not(.redpacket-bubble):not(.transfer-bubble):not(.chrome-less-bubble){background-color:var(--wx-ai-bubble) !important;}
.message-row.left .message-bubble:not(.redpacket-bubble):not(.transfer-bubble):not(.chrome-less-bubble)::before{border-right-color:var(--wx-ai-bubble) !important;}
`.trim();
}

function scheduleEnsureUiFontLoaded(prefs) {
    const p = Storage.normalizeUiPrefs(prefs);
    const src = p.fontMode === 'url' ? p.fontUrl : (p.fontMode === 'data' ? (p.fontDataUrl || Storage.getUiFontDataUrl(p.fontDataKey)) : '');
    const name = p.fontFamilyName || 'WXCustomFont';
    if (!src) return;
    if (!scheduleEnsureUiFontLoaded._cache) scheduleEnsureUiFontLoaded._cache = {};
    const key = `${name}::${src}`;
    if (scheduleEnsureUiFontLoaded._cache[key]) return;
    scheduleEnsureUiFontLoaded._cache[key] = true;
    try {
        const face = new FontFace(name, `url(${src})`);
        face.load().then(() => {
            try { document.fonts.add(face); } catch (e) {}
        }).catch(() => {});
    } catch (e) {
    }
}

function getUiSchemeById(id) {
    const key = String(id || '').trim();
    return (State.uiSchemes || []).find(s => s && String(s.id || '') === key) || null;
}

function renderUiSchemeSelect() {
    const sel = document.getElementById('ui-scheme-select');
    if (!sel) return;
    sel.innerHTML = '';
    (State.uiSchemes || []).forEach((s) => {
        const opt = document.createElement('option');
        opt.value = String(s.id || '');
        opt.textContent = String(s.name || '未命名');
        sel.appendChild(opt);
    });
    sel.value = String(State.currentUiSchemeId || Storage.DEFAULT_CURRENT_UI_SCHEME_ID);
}

function syncUiDesignerControlsFromDraft() {
    const d = Storage.normalizeUiPrefs(uiDesignerDraft || State.uiPrefs || Storage.DEFAULT_UI_PREFS);
    const setVal = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(v);
    };
    const setInput = (id, v) => {
        const el = document.getElementById(id);
        if (el) el.value = String(v);
    };

    setInput('ui-chat-font-size', d.chatFontSize); setVal('ui-chat-font-size-val', d.chatFontSize);
    setInput('ui-bubble-radius', d.bubbleRadius); setVal('ui-bubble-radius-val', d.bubbleRadius);
    setInput('ui-bubble-pad-x', d.bubblePadX); setVal('ui-bubble-pad-x-val', d.bubblePadX);
    setInput('ui-bubble-pad-y', d.bubblePadY); setVal('ui-bubble-pad-y-val', d.bubblePadY);
    setInput('ui-message-gap', d.messageGap); setVal('ui-message-gap-val', d.messageGap);
    setInput('ui-content-max', d.contentMax); setVal('ui-content-max-val', `${d.contentMax}%`);

    setInput('ui-accent-color', d.accentColor);
    setInput('ui-user-bubble-color', d.userBubbleColor);
    setInput('ui-ai-bubble-color', d.aiBubbleColor);

    setInput('ui-avatar-size', d.avatarSize); setVal('ui-avatar-size-val', d.avatarSize);
    setInput('ui-avatar-radius', d.avatarRadius); setVal('ui-avatar-radius-val', d.avatarRadius);
    setInput('ui-avatar-gap', d.avatarGap); setVal('ui-avatar-gap-val', d.avatarGap);
    setInput('ui-avatar-left-x', d.avatarLeftX); setVal('ui-avatar-left-x-val', d.avatarLeftX);
    setInput('ui-avatar-left-y', d.avatarLeftY); setVal('ui-avatar-left-y-val', d.avatarLeftY);
    setInput('ui-avatar-right-x', d.avatarRightX); setVal('ui-avatar-right-x-val', d.avatarRightX);
    setInput('ui-avatar-right-y', d.avatarRightY); setVal('ui-avatar-right-y-val', d.avatarRightY);

    setInput('ui-primary-btn-h', d.primaryBtnHeight); setVal('ui-primary-btn-h-val', d.primaryBtnHeight);
    setInput('ui-primary-btn-w', d.primaryBtnMaxWidthPct); setVal('ui-primary-btn-w-val', `${d.primaryBtnMaxWidthPct}%`);
    setInput('ui-primary-btn-radius', d.primaryBtnRadius); setVal('ui-primary-btn-radius-val', d.primaryBtnRadius);
    setInput('ui-primary-btn-pad-x', d.primaryBtnPadX); setVal('ui-primary-btn-pad-x-val', d.primaryBtnPadX);
    setInput('ui-primary-btn-font', d.primaryBtnFontSize); setVal('ui-primary-btn-font-val', d.primaryBtnFontSize);
    setInput('ui-chat-inputbar-h', d.chatInputBarMinHeight); setVal('ui-chat-inputbar-h-val', d.chatInputBarMinHeight);
    setInput('ui-chat-inputbar-px', d.chatInputBarPadX); setVal('ui-chat-inputbar-px-val', d.chatInputBarPadX);
    setInput('ui-chat-inputbar-py', d.chatInputBarPadY); setVal('ui-chat-inputbar-py-val', d.chatInputBarPadY);
    setInput('ui-chat-inputbar-gap', d.chatInputBarGap); setVal('ui-chat-inputbar-gap-val', d.chatInputBarGap);
    setInput('ui-inputbox-radius', d.inputBoxRadius); setVal('ui-inputbox-radius-val', d.inputBoxRadius);
    setInput('ui-inputbox-h', d.inputBoxMinHeight); setVal('ui-inputbox-h-val', d.inputBoxMinHeight);
    setInput('ui-inputbox-w', d.inputBoxMaxWidthPct); setVal('ui-inputbox-w-val', `${d.inputBoxMaxWidthPct}%`);
    setInput('ui-inputbox-x', d.inputBoxOffsetX); setVal('ui-inputbox-x-val', d.inputBoxOffsetX);
    setInput('ui-inputbox-y', d.inputBoxOffsetY); setVal('ui-inputbox-y-val', d.inputBoxOffsetY);
    setInput('ui-inputbox-pl', d.inputBoxPadL); setVal('ui-inputbox-pl-val', d.inputBoxPadL);
    setInput('ui-inputbox-pr', d.inputBoxPadR); setVal('ui-inputbox-pr-val', d.inputBoxPadR);
    setInput('ui-inputbox-py', d.inputBoxPadY); setVal('ui-inputbox-py-val', d.inputBoxPadY);
    setInput('ui-input-font', d.inputTextFontSize); setVal('ui-input-font-val', d.inputTextFontSize);
    setInput('ui-input-icon-size', d.inputIconSize); setVal('ui-input-icon-size-val', d.inputIconSize);
    setInput('ui-input-icon-radius', d.inputIconRadius); setVal('ui-input-icon-radius-val', d.inputIconRadius);
    setInput('ui-input-icon-mb', d.inputIconBottomMargin); setVal('ui-input-icon-mb-val', d.inputIconBottomMargin);
    setInput('ui-send-btn-w', d.sendBtnWidth); setVal('ui-send-btn-w-val', d.sendBtnWidth);
    setInput('ui-send-btn-h', d.sendBtnHeight); setVal('ui-send-btn-h-val', d.sendBtnHeight);
    setInput('ui-send-btn-radius', d.sendBtnRadius); setVal('ui-send-btn-radius-val', d.sendBtnRadius);
    setInput('ui-send-btn-font', d.sendBtnFontSize); setVal('ui-send-btn-font-val', d.sendBtnFontSize);

    setInput('ui-topbar-h', d.topbarHeight); setVal('ui-topbar-h-val', d.topbarHeight);
    setInput('ui-bottombar-h', d.bottombarHeight); setVal('ui-bottombar-h-val', d.bottombarHeight);

    setInput('ui-header-icon-size', d.headerIconSize); setVal('ui-header-icon-size-val', d.headerIconSize);
    setInput('ui-header-icon-stroke', d.headerIconStroke); setVal('ui-header-icon-stroke-val', d.headerIconStroke);
    setInput('ui-header-icon-x', d.headerIconX); setVal('ui-header-icon-x-val', d.headerIconX);
    setInput('ui-header-icon-y', d.headerIconY); setVal('ui-header-icon-y-val', d.headerIconY);
    setInput('ui-tab-icon-size', d.tabIconSize); setVal('ui-tab-icon-size-val', d.tabIconSize);
    setInput('ui-tab-icon-stroke', d.tabIconStroke); setVal('ui-tab-icon-stroke-val', d.tabIconStroke);
    setInput('ui-tab-icon-y', d.tabIconY); setVal('ui-tab-icon-y-val', d.tabIconY);
    setInput('ui-tab-label-size', d.tabLabelSize); setVal('ui-tab-label-size-val', d.tabLabelSize);
    setInput('ui-list-pad-y', d.listPadY); setVal('ui-list-pad-y-val', d.listPadY);
    setInput('ui-chatlist-avatar', d.chatListAvatarSize); setVal('ui-chatlist-avatar-val', d.chatListAvatarSize);
    setInput('ui-chatlist-avatar-radius', d.chatListAvatarRadius); setVal('ui-chatlist-avatar-radius-val', d.chatListAvatarRadius);
    setInput('ui-contact-icon', d.contactIconSize); setVal('ui-contact-icon-val', d.contactIconSize);
    setInput('ui-contact-icon-radius', d.contactIconRadius); setVal('ui-contact-icon-radius-val', d.contactIconRadius);
    setInput('ui-text-scale', d.textScale); setVal('ui-text-scale-val', `${d.textScale}%`);
    setInput('ui-home-title-size', d.homeTitleSize); setVal('ui-home-title-size-val', d.homeTitleSize);
    setInput('ui-home-title-x', d.homeTitleX); setVal('ui-home-title-x-val', d.homeTitleX);
    setInput('ui-home-title-y', d.homeTitleY); setVal('ui-home-title-y-val', d.homeTitleY);
    setInput('ui-main-title-size', d.mainTitleSize); setVal('ui-main-title-size-val', d.mainTitleSize);
    setInput('ui-main-title-x', d.mainTitleX); setVal('ui-main-title-x-val', d.mainTitleX);
    setInput('ui-main-title-y', d.mainTitleY); setVal('ui-main-title-y-val', d.mainTitleY);
    setInput('ui-sub-title-size', d.subTitleSize); setVal('ui-sub-title-size-val', d.subTitleSize);
    setInput('ui-sub-title-x', d.subTitleX); setVal('ui-sub-title-x-val', d.subTitleX);
    setInput('ui-sub-title-y', d.subTitleY); setVal('ui-sub-title-y-val', d.subTitleY);
    setInput('ui-chatlist-name-size', d.chatListNameSize); setVal('ui-chatlist-name-size-val', d.chatListNameSize);
    setInput('ui-chatlist-preview-size', d.chatListPreviewSize); setVal('ui-chatlist-preview-size-val', d.chatListPreviewSize);
    setInput('ui-chatlist-time-size', d.chatListTimeSize); setVal('ui-chatlist-time-size-val', d.chatListTimeSize);
    setInput('ui-contact-name-size', d.contactNameSize); setVal('ui-contact-name-size-val', d.contactNameSize);
    setInput('ui-contact-name-y', d.contactNameY); setVal('ui-contact-name-y-val', d.contactNameY);
    setInput('ui-discover-name-size', d.discoverNameSize); setVal('ui-discover-name-size-val', d.discoverNameSize);
    setInput('ui-discover-name-y', d.discoverNameY); setVal('ui-discover-name-y-val', d.discoverNameY);
    setInput('ui-me-name-size', d.meNameSize); setVal('ui-me-name-size-val', d.meNameSize);
    setInput('ui-me-name-y', d.meNameY); setVal('ui-me-name-y-val', d.meNameY);
    setInput('ui-discover-icon', d.discoverIconSize); setVal('ui-discover-icon-val', d.discoverIconSize);
    setInput('ui-me-icon', d.meIconSize); setVal('ui-me-icon-val', d.meIconSize);

    const fontUrlInput = document.getElementById('ui-font-url');
    if (fontUrlInput) {
        fontUrlInput.value = d.fontMode === 'url' ? String(d.fontUrl || '') : '';
    }
    const hint = document.getElementById('ui-font-hint');
    if (hint) {
        if (d.fontMode === 'none') hint.textContent = '未设置字体';
        if (d.fontMode === 'url') {
            const u = String(d.fontUrl || '');
            const short = u.length > 56 ? `${u.slice(0, 28)}…${u.slice(-20)}` : u;
            hint.textContent = u ? `URL 字体：${short}` : 'URL 字体：未填写';
        }
        if (d.fontMode === 'data') hint.textContent = d.fontFamilyName ? `本地字体：${d.fontFamilyName}` : '本地字体：已选择';
    }
}

function updateUiDesignerDraftAndPreview() {
    if (!uiDesignerDraft) uiDesignerDraft = Storage.normalizeUiPrefs(State.uiPrefs);

    const readInt = (id, fallback) => {
        const el = document.getElementById(id);
        const n = parseInt(el?.value, 10);
        return Number.isFinite(n) ? n : fallback;
    };
    const readFloat = (id, fallback) => {
        const el = document.getElementById(id);
        const n = parseFloat(el?.value);
        return Number.isFinite(n) ? n : fallback;
    };
    const readColor = (id, fallback) => {
        const el = document.getElementById(id);
        return el?.value ? String(el.value) : fallback;
    };

    const now = Date.now();
    if (now - uiDesignerLastUndoPushTs >= 650) {
        uiDesignerUndo.push(JSON.parse(JSON.stringify(uiDesignerDraft)));
        if (uiDesignerUndo.length > 30) uiDesignerUndo.splice(0, uiDesignerUndo.length - 30);
        uiDesignerLastUndoPushTs = now;
    }

    uiDesignerDraft = Storage.normalizeUiPrefs({
        ...uiDesignerDraft,
        chatFontSize: readInt('ui-chat-font-size', uiDesignerDraft.chatFontSize),
        bubbleRadius: readInt('ui-bubble-radius', uiDesignerDraft.bubbleRadius),
        bubblePadX: readInt('ui-bubble-pad-x', uiDesignerDraft.bubblePadX),
        bubblePadY: readInt('ui-bubble-pad-y', uiDesignerDraft.bubblePadY),
        messageGap: readInt('ui-message-gap', uiDesignerDraft.messageGap),
        contentMax: readInt('ui-content-max', uiDesignerDraft.contentMax),
        accentColor: readColor('ui-accent-color', uiDesignerDraft.accentColor),
        userBubbleColor: readColor('ui-user-bubble-color', uiDesignerDraft.userBubbleColor),
        aiBubbleColor: readColor('ui-ai-bubble-color', uiDesignerDraft.aiBubbleColor),
        avatarSize: readInt('ui-avatar-size', uiDesignerDraft.avatarSize),
        avatarRadius: readInt('ui-avatar-radius', uiDesignerDraft.avatarRadius),
        avatarGap: readInt('ui-avatar-gap', uiDesignerDraft.avatarGap),
        avatarLeftX: readInt('ui-avatar-left-x', uiDesignerDraft.avatarLeftX),
        avatarLeftY: readInt('ui-avatar-left-y', uiDesignerDraft.avatarLeftY),
        avatarRightX: readInt('ui-avatar-right-x', uiDesignerDraft.avatarRightX),
        avatarRightY: readInt('ui-avatar-right-y', uiDesignerDraft.avatarRightY),
        primaryBtnHeight: readInt('ui-primary-btn-h', uiDesignerDraft.primaryBtnHeight),
        primaryBtnMaxWidthPct: readInt('ui-primary-btn-w', uiDesignerDraft.primaryBtnMaxWidthPct),
        primaryBtnRadius: readInt('ui-primary-btn-radius', uiDesignerDraft.primaryBtnRadius),
        primaryBtnPadX: readInt('ui-primary-btn-pad-x', uiDesignerDraft.primaryBtnPadX),
        primaryBtnFontSize: readInt('ui-primary-btn-font', uiDesignerDraft.primaryBtnFontSize),
        chatInputBarMinHeight: readInt('ui-chat-inputbar-h', uiDesignerDraft.chatInputBarMinHeight),
        chatInputBarPadX: readInt('ui-chat-inputbar-px', uiDesignerDraft.chatInputBarPadX),
        chatInputBarPadY: readInt('ui-chat-inputbar-py', uiDesignerDraft.chatInputBarPadY),
        chatInputBarGap: readInt('ui-chat-inputbar-gap', uiDesignerDraft.chatInputBarGap),
        inputBoxRadius: readInt('ui-inputbox-radius', uiDesignerDraft.inputBoxRadius),
        inputBoxMinHeight: readInt('ui-inputbox-h', uiDesignerDraft.inputBoxMinHeight),
        inputBoxMaxWidthPct: readInt('ui-inputbox-w', uiDesignerDraft.inputBoxMaxWidthPct),
        inputBoxOffsetX: readInt('ui-inputbox-x', uiDesignerDraft.inputBoxOffsetX),
        inputBoxOffsetY: readInt('ui-inputbox-y', uiDesignerDraft.inputBoxOffsetY),
        inputBoxPadL: readInt('ui-inputbox-pl', uiDesignerDraft.inputBoxPadL),
        inputBoxPadR: readInt('ui-inputbox-pr', uiDesignerDraft.inputBoxPadR),
        inputBoxPadY: readInt('ui-inputbox-py', uiDesignerDraft.inputBoxPadY),
        inputTextFontSize: readInt('ui-input-font', uiDesignerDraft.inputTextFontSize),
        inputIconSize: readInt('ui-input-icon-size', uiDesignerDraft.inputIconSize),
        inputIconRadius: readInt('ui-input-icon-radius', uiDesignerDraft.inputIconRadius),
        inputIconBottomMargin: readInt('ui-input-icon-mb', uiDesignerDraft.inputIconBottomMargin),
        sendBtnWidth: readInt('ui-send-btn-w', uiDesignerDraft.sendBtnWidth),
        sendBtnHeight: readInt('ui-send-btn-h', uiDesignerDraft.sendBtnHeight),
        sendBtnRadius: readInt('ui-send-btn-radius', uiDesignerDraft.sendBtnRadius),
        sendBtnFontSize: readInt('ui-send-btn-font', uiDesignerDraft.sendBtnFontSize),
        topbarHeight: readInt('ui-topbar-h', uiDesignerDraft.topbarHeight),
        bottombarHeight: readInt('ui-bottombar-h', uiDesignerDraft.bottombarHeight),
        headerIconSize: readInt('ui-header-icon-size', uiDesignerDraft.headerIconSize),
        headerIconStroke: readFloat('ui-header-icon-stroke', uiDesignerDraft.headerIconStroke),
        headerIconX: readInt('ui-header-icon-x', uiDesignerDraft.headerIconX),
        headerIconY: readInt('ui-header-icon-y', uiDesignerDraft.headerIconY),
        tabIconSize: readInt('ui-tab-icon-size', uiDesignerDraft.tabIconSize),
        tabIconStroke: readFloat('ui-tab-icon-stroke', uiDesignerDraft.tabIconStroke),
        tabIconY: readInt('ui-tab-icon-y', uiDesignerDraft.tabIconY),
        tabLabelSize: readInt('ui-tab-label-size', uiDesignerDraft.tabLabelSize),
        listPadY: readInt('ui-list-pad-y', uiDesignerDraft.listPadY),
        chatListAvatarSize: readInt('ui-chatlist-avatar', uiDesignerDraft.chatListAvatarSize),
        chatListAvatarRadius: readInt('ui-chatlist-avatar-radius', uiDesignerDraft.chatListAvatarRadius),
        contactIconSize: readInt('ui-contact-icon', uiDesignerDraft.contactIconSize),
        contactIconRadius: readInt('ui-contact-icon-radius', uiDesignerDraft.contactIconRadius),
        textScale: readInt('ui-text-scale', uiDesignerDraft.textScale),
        homeTitleSize: readInt('ui-home-title-size', uiDesignerDraft.homeTitleSize),
        homeTitleX: readInt('ui-home-title-x', uiDesignerDraft.homeTitleX),
        homeTitleY: readInt('ui-home-title-y', uiDesignerDraft.homeTitleY),
        mainTitleSize: readInt('ui-main-title-size', uiDesignerDraft.mainTitleSize),
        mainTitleX: readInt('ui-main-title-x', uiDesignerDraft.mainTitleX),
        mainTitleY: readInt('ui-main-title-y', uiDesignerDraft.mainTitleY),
        subTitleSize: readInt('ui-sub-title-size', uiDesignerDraft.subTitleSize),
        subTitleX: readInt('ui-sub-title-x', uiDesignerDraft.subTitleX),
        subTitleY: readInt('ui-sub-title-y', uiDesignerDraft.subTitleY),
        chatListNameSize: readInt('ui-chatlist-name-size', uiDesignerDraft.chatListNameSize),
        chatListPreviewSize: readInt('ui-chatlist-preview-size', uiDesignerDraft.chatListPreviewSize),
        chatListTimeSize: readInt('ui-chatlist-time-size', uiDesignerDraft.chatListTimeSize),
        contactNameSize: readInt('ui-contact-name-size', uiDesignerDraft.contactNameSize),
        contactNameY: readInt('ui-contact-name-y', uiDesignerDraft.contactNameY),
        discoverNameSize: readInt('ui-discover-name-size', uiDesignerDraft.discoverNameSize),
        discoverNameY: readInt('ui-discover-name-y', uiDesignerDraft.discoverNameY),
        meNameSize: readInt('ui-me-name-size', uiDesignerDraft.meNameSize),
        meNameY: readInt('ui-me-name-y', uiDesignerDraft.meNameY),
        discoverIconSize: readInt('ui-discover-icon', uiDesignerDraft.discoverIconSize),
        meIconSize: readInt('ui-me-icon', uiDesignerDraft.meIconSize)
    });

    uiDesignerDirty = true;
    syncUiDesignerControlsFromDraft();
    applyUiPrefs(uiDesignerDraft);
}

function openUiDesignerModal() {
    const modal = document.getElementById('ui-designer-modal');
    if (!modal) return;
    uiDesignerSchemeAtOpen = String(State.currentUiSchemeId || Storage.DEFAULT_CURRENT_UI_SCHEME_ID);
    uiDesignerDraft = Storage.normalizeUiPrefs(State.uiPrefs);
    uiDesignerDirty = false;
    uiDesignerUndo = [];
    uiDesignerLastUndoPushTs = 0;
    applyUiDesignerLocked(getUiDesignerLocked());
    renderUiSchemeSelect();
    syncUiDesignerControlsFromDraft();
    applyUiPrefs(uiDesignerDraft);
    modal.classList.add('show');

    requestAnimationFrame(() => {
        const container = modal.querySelector('.ui-designer-container');
        if (!container) return;
        applyUiDesignerScale(getUiDesignerScalePct());
        const savedRaw = localStorage.getItem('wechat_ui_designer_pos');
        let saved = null;
        if (savedRaw) {
            try {
                saved = JSON.parse(savedRaw);
            } catch (e) {
                saved = null;
            }
        }

        const rect = container.getBoundingClientRect();
        const vw = window.innerWidth || 0;
        const vh = window.innerHeight || 0;
        const w = rect.width || Math.min(430, Math.max(0, vw - 26));
        const h = rect.height || Math.min(760, Math.max(0, vh - 120));

        let left = typeof saved?.left === 'number' ? saved.left : Math.round((vw - w) / 2);
        let top = typeof saved?.top === 'number' ? saved.top : 72;

        left = Math.max(8, Math.min(vw - w - 8, left));
        top = Math.max(8, Math.min(vh - h - 8, top));

        container.style.left = `${left}px`;
        container.style.top = `${top}px`;
    });
}

function closeUiDesignerModal(revertIfDirty = true) {
    const modal = document.getElementById('ui-designer-modal');
    if (!modal) return;
    if (revertIfDirty && uiDesignerDirty) {
        const scheme = getUiSchemeById(State.currentUiSchemeId);
        State.uiPrefs = Storage.normalizeUiPrefs(scheme?.prefs || Storage.getUiPrefs());
        Storage.saveUiPrefs(State.uiPrefs);
        applyUiPrefs(State.uiPrefs);
    }
    uiDesignerDraft = null;
    uiDesignerDirty = false;
    uiDesignerSchemeAtOpen = null;
    modal.classList.remove('show');
}

function bindUiDesignerEvents() {
    if (bindUiDesignerEvents._bound) return;
    bindUiDesignerEvents._bound = true;

    const openBtn = document.getElementById('ui-designer-open-btn');
    openBtn?.addEventListener('click', () => openUiDesignerModal());

    document.getElementById('ui-designer-close-btn')?.addEventListener('click', () => closeUiDesignerModal(true));
    document.getElementById('ui-designer-lock-btn')?.addEventListener('click', () => {
        const locked = !getUiDesignerLocked();
        setUiDesignerLocked(locked);
        applyUiDesignerLocked(locked);
        showToast(locked ? '已锁定面板（防误触）' : '已解锁面板');
    });
    document.getElementById('ui-scheme-undo-btn')?.addEventListener('click', () => {
        if (!uiDesignerDraft) uiDesignerDraft = Storage.normalizeUiPrefs(State.uiPrefs);
        const prev = uiDesignerUndo.pop();
        if (!prev) {
            showToast('没有可撤销的操作');
            return;
        }
        uiDesignerDraft = Storage.normalizeUiPrefs(prev);
        uiDesignerDirty = true;
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(uiDesignerDraft);
        showToast('已撤销');
    });
    document.getElementById('ui-designer-scale')?.addEventListener('input', (e) => {
        const v = e?.target?.value;
        applyUiDesignerScale(v);
    });

    const modal = document.getElementById('ui-designer-modal');
    const container = modal?.querySelector('.ui-designer-container');
    const dragHandle = modal?.querySelector('#ui-designer-drag-handle');
    if (container && dragHandle) {
        let dragging = false;
        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        let raf = 0;
        let lastX = 0;
        let lastY = 0;

        const applyPos = () => {
            raf = 0;
            const vw = window.innerWidth || 0;
            const vh = window.innerHeight || 0;
            const rect = container.getBoundingClientRect();
            const w = rect.width || 0;
            const h = rect.height || 0;

            let left = startLeft + (lastX - startX);
            let top = startTop + (lastY - startY);
            left = Math.max(8, Math.min(vw - w - 8, left));
            top = Math.max(8, Math.min(vh - h - 8, top));

            container.style.left = `${left}px`;
            container.style.top = `${top}px`;
        };

        dragHandle.addEventListener('pointerdown', (e) => {
            if (e.button !== 0) return;
            dragging = true;
            startX = e.clientX;
            startY = e.clientY;
            lastX = startX;
            lastY = startY;
            const rect = container.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            try { dragHandle.setPointerCapture(e.pointerId); } catch (err) {}
        });

        dragHandle.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            lastX = e.clientX;
            lastY = e.clientY;
            if (!raf) raf = requestAnimationFrame(applyPos);
        });

        const endDrag = (e) => {
            if (!dragging) return;
            dragging = false;
            if (raf) {
                cancelAnimationFrame(raf);
                raf = 0;
                applyPos();
            } else {
                applyPos();
            }
            const rect = container.getBoundingClientRect();
            try {
                localStorage.setItem('wechat_ui_designer_pos', JSON.stringify({ left: rect.left, top: rect.top }));
            } catch (err) {
            }
            try { dragHandle.releasePointerCapture(e.pointerId); } catch (err) {}
        };

        dragHandle.addEventListener('pointerup', endDrag);
        dragHandle.addEventListener('pointercancel', endDrag);
    }

    [
        'ui-chat-font-size', 'ui-bubble-radius', 'ui-bubble-pad-x', 'ui-bubble-pad-y', 'ui-message-gap', 'ui-content-max',
        'ui-avatar-size', 'ui-avatar-radius', 'ui-avatar-gap', 'ui-avatar-left-x', 'ui-avatar-left-y', 'ui-avatar-right-x', 'ui-avatar-right-y',
        'ui-primary-btn-h', 'ui-primary-btn-w', 'ui-primary-btn-radius', 'ui-primary-btn-pad-x', 'ui-primary-btn-font',
        'ui-chat-inputbar-h', 'ui-chat-inputbar-px', 'ui-chat-inputbar-py', 'ui-chat-inputbar-gap',
        'ui-inputbox-radius', 'ui-inputbox-h', 'ui-inputbox-w', 'ui-inputbox-x', 'ui-inputbox-y', 'ui-inputbox-pl', 'ui-inputbox-pr', 'ui-inputbox-py', 'ui-input-font',
        'ui-input-icon-size', 'ui-input-icon-radius', 'ui-input-icon-mb', 'ui-send-btn-w', 'ui-send-btn-h', 'ui-send-btn-radius', 'ui-send-btn-font',
        'ui-topbar-h', 'ui-bottombar-h', 'ui-header-icon-size', 'ui-header-icon-stroke', 'ui-header-icon-x', 'ui-header-icon-y', 'ui-tab-icon-size', 'ui-tab-icon-stroke', 'ui-tab-icon-y', 'ui-tab-label-size',
        'ui-list-pad-y', 'ui-chatlist-avatar', 'ui-chatlist-avatar-radius', 'ui-contact-icon', 'ui-contact-icon-radius',
        'ui-text-scale', 'ui-home-title-size', 'ui-home-title-x', 'ui-home-title-y', 'ui-main-title-size', 'ui-main-title-x', 'ui-main-title-y', 'ui-sub-title-size', 'ui-sub-title-x', 'ui-sub-title-y', 'ui-chatlist-name-size', 'ui-chatlist-preview-size', 'ui-chatlist-time-size', 'ui-contact-name-size', 'ui-contact-name-y', 'ui-discover-name-size', 'ui-discover-name-y', 'ui-me-name-size', 'ui-me-name-y', 'ui-discover-icon', 'ui-me-icon',
        'ui-accent-color', 'ui-user-bubble-color', 'ui-ai-bubble-color'
    ].forEach((id) => {
        document.getElementById(id)?.addEventListener('input', () => updateUiDesignerDraftAndPreview());
    });

    document.getElementById('ui-scheme-select')?.addEventListener('change', async (e) => {
        const nextId = String(e?.target?.value || '').trim();
        if (!nextId) return;
        if (uiDesignerDirty) {
            const ok = await WeChatUI.showConfirm('切换方案', '未保存的修改会丢失，继续吗？', '继续', '取消', true);
            if (!ok) {
                renderUiSchemeSelect();
                return;
            }
        }
        const scheme = getUiSchemeById(nextId);
        if (!scheme) return;
        State.currentUiSchemeId = scheme.id;
        Storage.saveCurrentUiSchemeId(State.currentUiSchemeId);
        State.uiPrefs = Storage.normalizeUiPrefs(scheme.prefs);
        Storage.saveUiPrefs(State.uiPrefs);
        uiDesignerDraft = Storage.normalizeUiPrefs(State.uiPrefs);
        uiDesignerDirty = false;
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(State.uiPrefs);
    });

    document.getElementById('ui-scheme-save-btn')?.addEventListener('click', () => {
        const scheme = getUiSchemeById(State.currentUiSchemeId);
        if (!scheme) return;
        scheme.prefs = Storage.normalizeUiPrefs(uiDesignerDraft || State.uiPrefs);
        State.uiPrefs = Storage.normalizeUiPrefs(scheme.prefs);
        const okPrefs = Storage.saveUiPrefs(State.uiPrefs);
        const okSchemes = Storage.saveUiSchemes(State.uiSchemes);
        if (!okPrefs || !okSchemes) {
            uiDesignerDirty = true;
            showToast('保存失败：本地存储空间不足（字体太大可改用 URL/woff2）');
            return;
        }
        uiDesignerDirty = false;
        applyUiPrefs(State.uiPrefs);
        showToast('已保存');
    });

    document.getElementById('ui-scheme-saveas-btn')?.addEventListener('click', async () => {
        const name = await WeChatUI.showPrompt('另存为', '输入方案名称：', '');
        const n = String(name || '').trim();
        if (!n) return;
        const id = `ui_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const prefs = Storage.normalizeUiPrefs(uiDesignerDraft || State.uiPrefs);
        State.uiSchemes = Array.isArray(State.uiSchemes) ? State.uiSchemes : [];
        State.uiSchemes.push({ id, name: n, prefs });
        State.currentUiSchemeId = id;
        Storage.saveCurrentUiSchemeId(id);
        const okSchemes = Storage.saveUiSchemes(State.uiSchemes);
        if (!okSchemes) {
            State.uiSchemes = State.uiSchemes.filter(s => String(s?.id || '') !== String(id));
            State.currentUiSchemeId = Storage.getCurrentUiSchemeId();
            renderUiSchemeSelect();
            showToast('另存为失败：本地存储空间不足（字体太大可改用 URL/woff2）');
            return;
        }
        State.uiPrefs = Storage.normalizeUiPrefs(prefs);
        const okPrefs = Storage.saveUiPrefs(State.uiPrefs);
        if (!okPrefs) {
            showToast('保存失败：本地存储空间不足（字体太大可改用 URL/woff2）');
            return;
        }
        renderUiSchemeSelect();
        uiDesignerDraft = Storage.normalizeUiPrefs(State.uiPrefs);
        uiDesignerDirty = false;
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(State.uiPrefs);
        showToast('已创建');
    });

    document.getElementById('ui-scheme-delete-btn')?.addEventListener('click', async () => {
        const list = Array.isArray(State.uiSchemes) ? State.uiSchemes : [];
        if (list.length <= 1) {
            showToast('至少保留 1 个方案');
            return;
        }
        const scheme = getUiSchemeById(State.currentUiSchemeId);
        if (!scheme) return;
        const ok = await WeChatUI.showConfirm('删除方案', `确定删除「${scheme.name || '未命名'}」吗？`, '删除', '取消', true);
        if (!ok) return;
        State.uiSchemes = list.filter(s => String(s?.id || '') !== String(scheme.id || ''));
        const next = State.uiSchemes[0];
        State.currentUiSchemeId = next?.id || Storage.DEFAULT_CURRENT_UI_SCHEME_ID;
        Storage.saveCurrentUiSchemeId(State.currentUiSchemeId);
        Storage.saveUiSchemes(State.uiSchemes);
        State.uiPrefs = Storage.normalizeUiPrefs(next?.prefs || Storage.getUiPrefs());
        Storage.saveUiPrefs(State.uiPrefs);
        uiDesignerDraft = Storage.normalizeUiPrefs(State.uiPrefs);
        uiDesignerDirty = false;
        renderUiSchemeSelect();
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(State.uiPrefs);
        showToast('已删除');
    });

    document.getElementById('ui-scheme-reset-btn')?.addEventListener('click', async () => {
        const ok = await WeChatUI.showConfirm('一键重置', '恢复为默认外观，并覆盖当前方案。继续吗？', '重置', '取消', true);
        if (!ok) return;
        uiDesignerDraft = Storage.normalizeUiPrefs(Storage.DEFAULT_UI_PREFS);
        uiDesignerDirty = true;
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(uiDesignerDraft);
        const scheme = getUiSchemeById(State.currentUiSchemeId);
        if (scheme) {
            scheme.prefs = Storage.normalizeUiPrefs(uiDesignerDraft);
            State.uiPrefs = Storage.normalizeUiPrefs(scheme.prefs);
            Storage.saveUiPrefs(State.uiPrefs);
            Storage.saveUiSchemes(State.uiSchemes);
            uiDesignerDirty = false;
        }
        showToast('已重置');
    });

    document.getElementById('ui-font-upload-btn')?.addEventListener('click', () => {
        document.getElementById('ui-font-file')?.click();
    });

    document.getElementById('ui-font-file')?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        let dataUrl = '';
        try {
            dataUrl = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(String(reader.result || ''));
                reader.onerror = () => reject(new Error('read'));
                reader.readAsDataURL(file);
            });
        } catch (err) {
            showToast('读取字体失败');
            return;
        }
        if (!dataUrl.startsWith('data:')) {
            showToast('字体格式不支持');
            return;
        }
        const baseName = file.name ? file.name.replace(/\.[^/.]+$/, '') : 'LocalFont';
        const familyName = `WX_${baseName}_${Date.now()}`;
        const stored = Storage.saveUiFontDataUrl(familyName, dataUrl);
        uiDesignerDraft = Storage.normalizeUiPrefs({
            ...(uiDesignerDraft || State.uiPrefs),
            fontMode: 'data',
            fontDataUrl: '',
            fontDataKey: familyName,
            fontUrl: '',
            fontFamilyName: familyName
        });
        uiDesignerDirty = true;
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(uiDesignerDraft);
        showToast(stored ? '已应用（记得保存方案）' : '字体过大，无法保存到本机（刷新会丢失），建议用 URL/woff2');
    });

    document.getElementById('ui-font-apply-url-btn')?.addEventListener('click', () => {
        const url = String(document.getElementById('ui-font-url')?.value || '').trim();
        if (!url) {
            showToast('先填字体 URL');
            return;
        }
        const familyName = `WX_URL_${Date.now()}`;
        uiDesignerDraft = Storage.normalizeUiPrefs({
            ...(uiDesignerDraft || State.uiPrefs),
            fontMode: 'url',
            fontUrl: url,
            fontDataUrl: '',
            fontDataKey: '',
            fontFamilyName: familyName
        });
        uiDesignerDirty = true;
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(uiDesignerDraft);
        showToast('已应用（记得保存方案）');
    });

    document.getElementById('ui-font-clear-btn')?.addEventListener('click', () => {
        const current = Storage.normalizeUiPrefs(uiDesignerDraft || State.uiPrefs);
        if (current.fontMode === 'data' && current.fontDataKey) {
            Storage.deleteUiFontDataUrl(current.fontDataKey);
        }
        uiDesignerDraft = Storage.normalizeUiPrefs({
            ...(uiDesignerDraft || State.uiPrefs),
            fontMode: 'none',
            fontUrl: '',
            fontDataUrl: '',
            fontDataKey: '',
            fontFamilyName: ''
        });
        uiDesignerDirty = true;
        syncUiDesignerControlsFromDraft();
        applyUiPrefs(uiDesignerDraft);
    });
}

// ==========================================
// Tab 切换
// ==========================================

function bindTabEvents() {
    document.querySelectorAll('.tab-item').forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.target;
            if (!target) return;

            // 更新 Tab 状态
            document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // 切换页面
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(target).classList.add('active');

            State.currentTab = target.replace('-tab', '');

            // 刷新数据
            if (target === 'wechat-tab') initChatList();
            if (target === 'contacts-tab') initContactsList();
        });
    });
}

function switchToMainTab(targetPageId) {
    const target = String(targetPageId || '').trim();
    if (!target) return;
    const targetEl = document.getElementById(target);
    if (!targetEl) return;

    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
    document.querySelector(`.tab-item[data-target="${target}"]`)?.classList.add('active');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    targetEl.classList.add('active');

    State.currentTab = target.replace('-tab', '');
    if (target === 'wechat-tab') initChatList();
    if (target === 'contacts-tab') initContactsList();
}

function hardSwitchToMainTab(targetPageId) {
    const target = String(targetPageId || '').trim();
    if (!target) return;
    const targetEl = document.getElementById(target);
    if (!targetEl) return;

    const fallback = target === 'wechat-tab' ? 'contacts-tab' : 'wechat-tab';
    if (document.getElementById(fallback)) {
        switchToMainTab(fallback);
    }
    requestAnimationFrame(() => {
        switchToMainTab(target);
        requestAnimationFrame(() => {
            if (!document.querySelector('.page.active')) {
                switchToMainTab(target);
            }
        });
    });
}

function showPage(pageId) {
    document.getElementById(pageId).classList.add('active');
}

function hidePage(pageId) {
    document.getElementById(pageId).classList.remove('active');
}

function showToast(message, duration = 1800) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.style.display = 'inline-block';
    toast.textContent = message;
    toast.classList.remove('hide');
    toast.classList.add('show');

    if (showToast._timer) {
        clearTimeout(showToast._timer);
    }
    if (showToast._cleanupTimer) {
        clearTimeout(showToast._cleanupTimer);
    }
    showToast._timer = setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hide');
        showToast._cleanupTimer = setTimeout(() => {
            toast.classList.remove('hide');
            toast.style.display = 'none';
        }, 280);
    }, duration);
}

function isPageActive(pageId) {
    const el = document.getElementById(pageId);
    return !!(el && el.classList.contains('active'));
}

function isChatActiveForContact(contactId) {
    return isPageActive('chat-page') && String(State.currentContactId || '') === String(contactId || '');
}

function normalizeUnreadCount(value) {
    const n = parseInt(value, 10);
    if (!Number.isFinite(n) || Number.isNaN(n)) return 0;
    return Math.max(0, Math.min(999, n));
}

function getUnreadBadgeText(count) {
    const n = normalizeUnreadCount(count);
    if (n <= 0) return '';
    return n > 99 ? '99+' : String(n);
}

function ensureTopMessageBanner() {
    let el = document.getElementById('vx-top-message-banner');
    if (el) return el;
    el = document.createElement('div');
    el.id = 'vx-top-message-banner';
    el.className = 'vx-top-message-banner';
    el.style.display = 'none';
    el.addEventListener('click', (e) => {
        e.stopPropagation();
        const cid = String(el.dataset.contactId || '').trim();
        if (!cid) return;
        const contact = (State.contacts || []).find(c => c && String(c.id || '') === cid);
        if (contact) openChat(contact);
        hideTopMessageBanner();
    });
    document.body.appendChild(el);
    return el;
}

function hideTopMessageBanner() {
    const el = document.getElementById('vx-top-message-banner');
    if (!el) return;
    el.classList.remove('show');
    const timer = el._hideTimer;
    if (timer) clearTimeout(timer);
    el._hideTimer = setTimeout(() => {
        el.style.display = 'none';
    }, 220);
}

function showTopMessageBanner(contact, previewText = '') {
    if (!contact || !contact.id) return;
    const el = ensureTopMessageBanner();
    const unread = normalizeUnreadCount(contact.unreadCount);
    const countText = unread > 0 ? `${unread} 条新消息` : '';
    el.dataset.contactId = String(contact.id);
    el.innerHTML = `
        <div class="vx-top-message-banner-inner">
            <div class="vx-top-message-banner-avatar">${getAvatarHtml(contact.avatar)}</div>
            <div class="vx-top-message-banner-body">
                <div class="vx-top-message-banner-title">
                    <span class="vx-top-message-banner-name">${escapeHtml(getContactDisplayName(contact))}</span>
                    <span class="vx-top-message-banner-count">${escapeHtml(countText)}</span>
                </div>
                <div class="vx-top-message-banner-preview">${escapeHtml(String(previewText || '').replace(/\s+/g, ' ').trim() || contact.lastMessage || '[新消息]')}</div>
            </div>
        </div>
    `;
    el.style.display = 'block';
    requestAnimationFrame(() => el.classList.add('show'));
    if (el._hideTimer) clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
        hideTopMessageBanner();
    }, 4200);
}

function registerIncomingAssistantMessages(contact, addedCount = 1, previewText = '') {
    if (!contact || !contact.id) return;
    const inc = Math.max(1, Math.min(50, parseInt(addedCount, 10) || 1));
    const shouldUnread = !isChatActiveForContact(contact.id);
    if (shouldUnread) {
        contact.unreadCount = normalizeUnreadCount(contact.unreadCount) + inc;
        contact.unreadCount = normalizeUnreadCount(contact.unreadCount);
    } else {
        contact.unreadCount = 0;
    }
    syncContactPreviewFromHistory(contact.id, previewText);
    if (shouldUnread && !contact.muteNotifications) {
        showTopMessageBanner(contact, previewText || contact.lastMessage || '');
    }
}

function getContactDisplayName(contact) {
    if (!contact || typeof contact !== 'object') return '联系人';
    const remark = String(contact.remarkName || '').trim();
    if (remark) return remark;
    const name = String(contact.name || '').trim();
    return name || '联系人';
}

function appendSystemHistoryEvent(contactId, text, options = {}) {
    const id = String(contactId || '').trim();
    if (!id) return;
    const message = String(text || '').trim();
    if (!message) return;
    if (!State.chatHistories[id]) State.chatHistories[id] = [];
    const now = Date.now();
    State.chatHistories[id].push({ role: 'system', content: message, time: now });
    Storage.saveChatHistories(State.chatHistories);
    if (options.render !== false && id === State.currentContactId) addSystemMessage(message);
    return now;
}

function pushSystemMessageToHistory(contactId, text) {
    return appendSystemHistoryEvent(contactId, text);
}

function summarizeStoredMessageContent(rawContent) {
    const plain = String(toPlainTextFromStoredContent(rawContent) || '').replace(/\s+/g, ' ').trim();
    if (plain) return plain.slice(0, 80);
    try {
        const parsed = JSON.parse(String(rawContent || ''));
        if (parsed && typeof parsed === 'object') {
            const type = String(parsed.type || '').trim();
            if (type === 'image') return '[图片]';
            if (type === 'voice') return '[语音]';
            if (type === 'sticker_message') return '[表情]';
            if (type === 'quote' || type === 'quote_reply') return '[引用消息]';
            if (type === 'action') return '[动作消息]';
        }
    } catch (e) {
    }
    return String(rawContent || '').replace(/\s+/g, ' ').trim().slice(0, 80) || '[消息]';
}

function syncContactPreviewFromHistory(contactId, fallbackText = '') {
    const id = String(contactId || '').trim();
    if (!id) return;
    const contact = (State.contacts || []).find(c => c && String(c.id || '') === id);
    if (!contact) return;
    const history = Array.isArray(State.chatHistories?.[id]) ? State.chatHistories[id] : [];
    if (history.length === 0) {
        contact.lastMessage = '';
        contact.lastTime = '';
        contact.lastActiveAt = 0;
        Storage.saveContacts(State.contacts);
        initChatList();
        return;
    }
    const last = history[history.length - 1] || {};
    let systemDisplay = '';
    if (last.role === 'system') {
        const raw = String(last.content || '');
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && String(parsed.type || '') === 'event') {
                systemDisplay = String(parsed.display || '').trim();
            }
        } catch (e) {
        }
    }
    const preview = String(
        fallbackText
        || (last.role === 'system' ? (systemDisplay || String(last.content || '')) : summarizeStoredMessageContent(last.content))
        || '[消息]'
    ).replace(/\s+/g, ' ').trim();
    const ts = Number(last.time || Date.now()) || Date.now();
    const d = new Date(ts);
    contact.lastMessage = preview.slice(0, 48);
    contact.lastTime = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    contact.lastActiveAt = ts;
    Storage.saveContacts(State.contacts);
    initChatList();
}

function buildRecallEventPayload(contact, actorRole, summary) {
    const msgSummary = String(summary || '[消息]').trim() || '[消息]';
    const isUser = actorRole === 'user';
    const display = isUser ? '我撤回了一条消息' : '对方撤回了一条消息';
    const aiText = isUser
        ? `[聊天事件] 用户撤回了一条消息：${msgSummary}`
        : `[聊天事件] 对方撤回了一条消息：${msgSummary}`;
    return {
        type: 'event',
        event: 'recall',
        actor: isUser ? 'user' : 'assistant',
        display,
        aiText,
        summary: msgSummary,
        at: Date.now()
    };
}

function buildPatEventText(contact, actorRole) {
    const contactLabel = getContactDisplayName(contact);
    const userLabel = getUserProfileForContact(contact).nickname || '用户';
    const outgoingSuffix = String(contact?.patSuffixOutgoing ?? contact?.patSuffix ?? '').trim() || '一下';
    const incomingSuffix = String(contact?.patSuffixIncoming ?? contact?.patSuffix ?? '').trim() || '一下';
    const tail = actorRole === 'assistant' ? incomingSuffix : outgoingSuffix;
    return actorRole === 'assistant'
        ? `[聊天事件] ${contactLabel}拍了拍用户「${userLabel}」${tail}`
        : `[聊天事件] 用户「${userLabel}」拍了拍${contactLabel}${tail}`;
}

function triggerPatEvent(contact, actorRole, options = {}) {
    if (!contact || !contact.id) return '';
    if (actorRole === 'assistant' && contact.aiPatEnabled === false) return '';
    const outgoingSuffix = String(contact?.patSuffixOutgoing ?? contact?.patSuffix ?? '').trim() || '一下';
    const incomingSuffix = String(contact?.patSuffixIncoming ?? contact?.patSuffix ?? '').trim() || '一下';
    const isUser = actorRole === 'user';
    const suffix = isUser ? outgoingSuffix : incomingSuffix;
    const formatDisplay = (base, s) => {
        const tail = String(s ?? '').trim();
        if (!tail) return base;
        const first = tail[0] || '';
        const noComma = first === '，' || first === ',' || first === '。' || first === '.' || first === '!' || first === '！' || first === '?' || first === '？' || first === '、' || first === '；' || first === ';' || first === ':' || first === '：';
        if (noComma || tail === '一下' || first === '的') return `${base}${tail}`;
        return `${base}，${tail}`;
    };
    const display = isUser ? formatDisplay('我拍了拍对方', suffix) : formatDisplay('对方拍了拍我', suffix);
    const aiText = buildPatEventText(contact, actorRole);
    const payload = { type: 'event', event: 'pat', actor: isUser ? 'user' : 'assistant', display, aiText, suffix, at: Date.now() };
    appendSystemHistoryEvent(contact.id, JSON.stringify(payload), { render: false });
    syncContactPreviewFromHistory(contact.id, display);
    if (contact.id === State.currentContactId && options.render !== false) renderChatMessages();
    return display;
}

function recallMessageAt(contactId, index, actorRole, options = {}) {
    const id = String(contactId || '').trim();
    if (!id) return false;
    const history = State.chatHistories[id];
    if (!Array.isArray(history) || index < 0 || index >= history.length) return false;
    const target = history[index];
    if (!target || (actorRole && target.role !== actorRole)) return false;
    if (target.role !== 'user' && target.role !== 'assistant') return false;

    const contact = (State.contacts || []).find(c => c && String(c.id || '') === id);
    if (!contact) return false;

    const summary = summarizeStoredMessageContent(target.content);
    const plain = String(toPlainTextFromStoredContent(target.content) || '').trim();
    history.splice(index, 1);
    const payload = buildRecallEventPayload(contact, target.role, summary);
    if (target.role === 'assistant') {
        payload.revealText = (plain || summary || '').trim().slice(0, 800);
    }
    appendSystemHistoryEvent(id, JSON.stringify(payload), { render: false });
    syncContactPreviewFromHistory(id, payload.display);
    if (id === State.currentContactId && options.render !== false) renderChatMessages();
    return true;
}

function recallLatestMessageByRole(contactId, actorRole, options = {}) {
    const history = State.chatHistories[String(contactId || '').trim()] || [];
    for (let i = history.length - 1; i >= 0; i--) {
        const item = history[i];
        if (!item || item.role !== actorRole) continue;
        return recallMessageAt(contactId, i, actorRole, options);
    }
    return false;
}

function recallMessageByRoleOffset(contactId, actorRole, offsetFromLast = 0, options = {}) {
    const id = String(contactId || '').trim();
    if (!id) return false;
    const history = State.chatHistories[id] || [];
    const offset = Math.max(0, Math.min(200, parseInt(offsetFromLast, 10) || 0));
    let seen = 0;
    for (let i = history.length - 1; i >= 0; i--) {
        const item = history[i];
        if (!item || item.role !== actorRole) continue;
        if (seen === offset) return recallMessageAt(id, i, actorRole, options);
        seen++;
    }
    return false;
}

function normalizeAssistantHistoryToPerBubble(contactId) {
    const id = String(contactId || '').trim();
    if (!id) return false;
    const history = Array.isArray(State.chatHistories?.[id]) ? State.chatHistories[id] : [];
    if (history.length === 0) return false;

    let changed = false;
    for (let i = 0; i < history.length; i++) {
        const msg = history[i];
        if (!msg || msg.role !== 'assistant') continue;
        const raw = String(msg.content || '');
        if (!raw || (raw[0] !== '[' && raw[0] !== '{')) continue;
        let parsed = null;
        try {
            parsed = JSON.parse(raw);
        } catch (e) {
            continue;
        }
        if (!Array.isArray(parsed)) continue;
        const items = parsed
            .filter(x => x && typeof x === 'object')
            .filter(x => String(x.type || '') !== 'action')
            .filter(x => String(x.type || '') !== 'thought_state');
        if (items.length === 0) {
            history.splice(i, 1);
            i--;
            changed = true;
            continue;
        }
        if (items.length === 1) {
            history[i] = { ...msg, content: JSON.stringify(items[0]) };
            changed = true;
            continue;
        }
        const baseTs = Number(msg.time || Date.now()) || Date.now();
        const split = items.map((it, idx) => ({
            role: 'assistant',
            content: JSON.stringify(it),
            time: baseTs + idx
        }));
        history.splice(i, 1, ...split);
        i += split.length - 1;
        changed = true;
    }

    if (changed) {
        State.chatHistories[id] = history;
        Storage.saveChatHistories(State.chatHistories);
    }
    return changed;
}

function getLastUserImageUrlForContact(contactId) {
    const id = String(contactId || '').trim();
    if (!id) return '';
    const history = State.chatHistories?.[id] || [];
    for (let i = history.length - 1; i >= 0; i--) {
        const msg = history[i];
        if (!msg || msg.role !== 'user') continue;
        const raw = String(msg.content || '');
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && parsed.type === 'image') {
                const url = String(parsed.content || '').trim();
                if (!url) continue;
                if (/^data:image\//i.test(url) || /^https?:\/\//i.test(url)) return url;
            }
        } catch (e) {
        }
    }
    return '';
}

function refreshRoleModalAvatarIfEditingContact(contact) {
    const c = contact && typeof contact === 'object' ? contact : null;
    if (!c?.id) return;
    const modal = document.getElementById('role-modal');
    if (!modal || !modal.classList.contains('show')) return;
    const roleId = document.getElementById('role-id')?.value || '';
    if (String(roleId) !== String(c.id)) return;
    const roleValue = document.getElementById('role-avatar-value');
    const rolePreview = document.getElementById('role-avatar-preview');
    const roleUrl = document.getElementById('role-avatar-url');
    if (roleValue) roleValue.value = c.avatar || '';
    if (rolePreview) rolePreview.innerHTML = getAvatarHtml(c.avatar);
    if (roleUrl) roleUrl.value = '';
}

function showLoading(text = '加载中...') {
    const overlay = document.getElementById('loading-overlay');
    const loadingText = document.getElementById('loading-text');
    if (!overlay) return;
    if (loadingText) loadingText.textContent = text;
    overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;
    overlay.style.display = 'none';
}

function formatVoiceDurationLabel(rawValue) {
    const raw = String(rawValue ?? '').trim();
    if (!raw) return '';
    const num = parseInt(raw, 10);
    if (!Number.isNaN(num) && num > 0) return `${num}''`;
    const matched = raw.match(/(\d{1,3})/);
    return matched ? `${matched[1]}''` : raw;
}

function renderVoiceBubbleContent(durationValue, voiceText) {
    const durationLabel = formatVoiceDurationLabel(durationValue);
    const transcriptText = String(voiceText ?? '').trim();
    const transcriptHtml = transcriptText ? escapeHtml(transcriptText).replace(/\n/g, '<br>') : '';
    return `
        <div class="msg-voice">
            <div class="voice-main">
                <span class="voice-wave" aria-hidden="true"><i></i><i></i><i></i></span>
                <span class="voice-duration">${escapeHtml(durationLabel)}</span>
            </div>
            ${transcriptText ? '<button class="voice-transcript-chip" type="button">转文字</button>' : ''}
        </div>
        ${transcriptText ? `<div class="voice-translation">${transcriptHtml}</div>` : ''}
    `;
}



function normalizeImageDescRange(minValue, maxValue) {
    const minChars = Math.max(10, Math.min(500, parseInt(minValue ?? '25', 10) || 25));
    const maxChars = Math.max(10, Math.min(500, parseInt(maxValue ?? '60', 10) || 60));
    return {
        min: Math.min(minChars, maxChars),
        max: Math.max(minChars, maxChars)
    };
}

function getDraftPromptPrefsFromForm() {
    const imageLenEl = document.getElementById('prompt-image-length');
    const imageMinEl = document.getElementById('prompt-image-min-chars');
    const imageMaxEl = document.getElementById('prompt-image-max-chars');
    const extraRulesEl = document.getElementById('prompt-extra-rules');
    const stickerCandidateCountEl = document.getElementById('prompt-sticker-candidate-count');
    const imageRange = normalizeImageDescRange(imageMinEl?.value, imageMaxEl?.value);
    return {
        imageDescLength: imageLenEl?.value || 'medium',
        imageDescMinChars: imageRange.min,
        imageDescMaxChars: imageRange.max,
        extraRules: (extraRulesEl?.value || '').trim(),
        stickerCandidateCount: Math.max(1, Math.min(20, parseInt(stickerCandidateCountEl?.value || '8', 10) || 8))
    };
}

function getDraftPromptModulesFromForm() {
    const roleEl = document.getElementById('prompt-role-template');
    const protocolEl = document.getElementById('prompt-protocol-template');
    const humanEl = document.getElementById('prompt-human-template');
    const capabilityEl = document.getElementById('prompt-capability-template');
    return {
        role: roleEl?.value ?? '',
        protocol: protocolEl?.value ?? '',
        human: humanEl?.value ?? '',
        capability: capabilityEl?.value ?? ''
    };
}

function getPromptPreviewContact() {
    if (State.currentContactId) {
        const current = State.contacts.find(c => c.id === State.currentContactId);
        if (current) return current;
    }
    if (State.contacts.length > 0) return State.contacts[0];
    return {
        id: 'preview_contact',
        name: 'AI角色',
        persona: '你是一个AI助手',
        style: '友好、自然',
        linkedWorldbooks: []
    };
}

function estimateTokenCount(text) {
    if (!text) return 0;
    return Math.max(1, Math.ceil(text.length * 0.7));
}

function refreshPromptPreview() {
    const previewEl = document.getElementById('prompt-final-preview');
    if (!previewEl) return;

    const globalPromptInput = document.getElementById('global-prompt');
    const nextGlobalPrompt = globalPromptInput?.value || '';
    const nextPrefs = getDraftPromptPrefsFromForm();
    const nextModules = getDraftPromptModulesFromForm();
    const previewContact = getPromptPreviewContact();
    const prevGlobalPrompt = State.globalPrompt;
    const prevPrefs = State.promptPrefs;
    const prevModules = State.promptModules;

    try {
        // 临时替换为表单草稿，实时预览最终注入效果
        State.globalPrompt = nextGlobalPrompt;
        State.promptPrefs = nextPrefs;
        State.promptModules = { ...Storage.DEFAULT_PROMPT_MODULES, ...(nextModules || {}) };
        const previewText = buildSystemPrompt(previewContact);
        previewEl.value = previewText;
        const tokenEl = document.getElementById('token-count');
        if (tokenEl) tokenEl.textContent = String(estimateTokenCount(previewText));
    } catch (err) {
        console.error('提示词预览生成失败:', err);
        previewEl.value = '预览生成失败，请检查配置。';
    } finally {
        State.globalPrompt = prevGlobalPrompt;
        State.promptPrefs = prevPrefs;
        State.promptModules = prevModules;
    }
}

function bindPromptPreviewEvents() {
    const promptPage = document.getElementById('prompt-page');
    if (!promptPage || promptPage.dataset.previewBound === '1') return;
    promptPage.dataset.previewBound = '1';

    ['global-prompt', 'prompt-image-length', 'prompt-image-min-chars', 'prompt-image-max-chars', 'prompt-extra-rules', 'prompt-sticker-candidate-count', 'prompt-role-template', 'prompt-protocol-template', 'prompt-human-template', 'prompt-capability-template'].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('input', refreshPromptPreview);
        el.addEventListener('change', refreshPromptPreview);
    });
}

// ==========================================
// 微信 Tab: 聊天记录列表
// ==========================================

function initChatList() {
    const list = document.getElementById('chat-list');
    if (!list) return;

    list.innerHTML = '';

    const contacts = [...State.contacts].map((c) => {
        if (!c.lastActiveAt) {
            const history = State.chatHistories[c.id] || [];
            const last = history[history.length - 1];
            if (last?.time) c.lastActiveAt = last.time;
        }
        return c;
    }).sort((a, b) => {
        const ap = a.isPinned ? 1 : 0;
        const bp = b.isPinned ? 1 : 0;
        if (bp !== ap) return bp - ap;
        return (b.lastActiveAt || 0) - (a.lastActiveAt || 0);
    });

    contacts.forEach(contact => {
        // 确保有聊天记录数组
        if (!State.chatHistories[contact.id]) {
            State.chatHistories[contact.id] = [];
        }

        const item = document.createElement('div');
        item.className = `chat-item${contact.isPinned ? ' pinned' : ''}`;
        const unreadText = getUnreadBadgeText(contact.unreadCount);
        const unreadHtml = unreadText ? `<span class="chat-unread-badge">${unreadText}</span>` : '';
        item.innerHTML = `
            <div class="chat-avatar">${getAvatarHtml(contact.avatar)}${unreadHtml}</div>
            <div class="chat-info">
                <div class="chat-header-row">
                    <span class="chat-name">${escapeHtml(getContactDisplayName(contact))}</span>
                    <span class="chat-time">
                        ${contact.muteNotifications ? '<i class="fas fa-bell-slash chat-flag" aria-hidden="true"></i>' : ''}
                        ${contact.lastTime || ''}
                    </span>
                </div>
                <div class="chat-preview">${escapeHtml(contact.lastMessage || '暂无消息')}</div>
            </div>
        `;
        // Ensure proper closure for click event
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            openChat(contact);
        });
        list.appendChild(item);
    });
}

// ==========================================
// 通讯录 Tab: AI角色管理
// ==========================================

function initContactsList() {
    const list = document.getElementById('ai-roles-list');
    if (!list) return;

    list.innerHTML = '';

    State.contacts.forEach(contact => {
        const item = document.createElement('div');
        item.className = 'contact-item';
        item.innerHTML = `
            <div class="chat-avatar">${getAvatarHtml(contact.avatar)}</div>
            <div class="chat-info">
                <div class="chat-name">${escapeHtml(getContactDisplayName(contact))}</div>
                <div class="chat-preview">${escapeHtml(contact.style || '')}</div>
            </div>
        `;
        item.addEventListener('click', () => openRoleModal(contact));
        list.appendChild(item);
    });

    // 更新数量
    const countEl = document.getElementById('contacts-count');
    if (countEl) {
        countEl.textContent = `${State.contacts.length}个朋友`;
    }
}

function renderApiConfigSelect() {
    const select = document.getElementById('api-config-select');
    if (!select) return;
    select.innerHTML = '';
    State.apiConfigs.forEach(config => {
        const option = document.createElement('option');
        option.value = config.id;
        option.textContent = config.name || '未命名方案';
        if (config.id === State.currentApiId) {
            option.selected = true;
            // 同步更新输入框
            document.getElementById('api-name-input').value = config.name || '';
            document.getElementById('api-url-input').value = config.apiUrl || '';
            document.getElementById('api-key-input').value = config.apiKey || '';
            setApiProxyUIFromConfig(config);
            applyApiModelUIFromConfig(config);
            applyApiVisionUIFromConfig(config);
        }
        select.appendChild(option);
    });
}

function renderSharedMainApiSelect(selectEl, selectedId) {
    if (!selectEl) return;
    const picked = String(selectedId || '').trim() || 'current';
    selectEl.innerHTML = '';
    const followOpt = document.createElement('option');
    followOpt.value = 'current';
    followOpt.textContent = '跟随当前方案';
    selectEl.appendChild(followOpt);
    (State.apiConfigs || []).forEach((cfg) => {
        if (!cfg) return;
        const opt = document.createElement('option');
        opt.value = String(cfg.id || '');
        opt.textContent = String(cfg.name || '未命名方案');
        selectEl.appendChild(opt);
    });
    selectEl.value = picked;
    if (!selectEl.value) selectEl.value = 'current';
}

function getMainApiConfigBySharedId(sharedId) {
    const id = String(sharedId || '').trim() || 'current';
    const targetId = (id === 'current') ? State.currentApiId : id;
    return (State.apiConfigs || []).find(c => String(c?.id || '') === String(targetId || ''));
}

function resolveChatApiRuntimeFromConfigLike(cfgLike, modelOverride) {
    const useProxy = !!cfgLike?.useProxy;
    const targetUrl = useProxy ? String(cfgLike?.proxyUrl || '').trim() : normalizeChatCompletionsUrl(String(cfgLike?.apiUrl || '').trim());
    const apiKey = String(cfgLike?.apiKey || '').trim();
    const modelFromCfg = getCurrentModelForConfig(cfgLike);
    const model = String(modelOverride || '').trim() || String(modelFromCfg || '').trim() || 'gpt-3.5-turbo';
    return { useProxy, targetUrl, apiKey, model };
}

function normalizeChatCompletionsUrl(rawUrl) {
    const input = (rawUrl || '').trim();
    if (!input) return '';
    try {
        const url = new URL(input);
        const path = url.pathname.replace(/\/+$/, '');
        if (/\/chat\/completions$/i.test(path)) {
            url.pathname = path;
            return url.toString();
        }
        if (/\/v1$/i.test(path)) {
            url.pathname = `${path}/chat/completions`;
            return url.toString();
        }
        url.pathname = `${path}/v1/chat/completions`;
        return url.toString();
    } catch (e) {
        return input;
    }
}

function normalizeModelsUrlFromChatUrl(rawUrl) {
    const input = (rawUrl || '').trim();
    if (!input) return '';
    try {
        const url = new URL(input);
        let path = url.pathname.replace(/\/+$/, '');
        path = path.replace(/\/v1\/chat\/completions$/i, '');
        path = path.replace(/\/chat\/completions$/i, '');
        path = path.replace(/\/v1$/i, '');
        url.pathname = `${path}/v1/models`;
        return url.toString();
    } catch (e) {
        return input;
    }
}

function getLatestSummaryText(contactId) {
    const id = String(contactId || '').trim();
    if (!id) return '';
    const histories = State.summaryHistories || {};
    const list = histories[id] || [];
    const last = list[list.length - 1];
    const text = last && typeof last.content === 'string' ? last.content : '';
    return String(text || '').trim();
}

function getSummaryVectorId(summary) {
    const time = summary?.time ? String(summary.time) : '';
    const content = typeof summary?.content === 'string' ? summary.content : '';
    return `${time}_${hashString32(content)}`;
}

async function fetchEmbeddingsBatch(texts) {
    const items = Array.isArray(texts) ? texts.map(t => String(t || '').trim()) : [];
    const inputs = items.filter(Boolean);
    if (inputs.length === 0) return [];

    const cfg = State.vectorConfig || Storage.getVectorConfig();
    const apiUrl = String(cfg?.apiUrl || '').trim();
    const model = String(cfg?.model || '').trim() || 'text-embedding-3-small';
    if (!apiUrl) throw new Error('向量化API未配置');

    const currentApiConfig = State.apiConfigs.find(c => c.id === State.currentApiId);
    const fallbackKey = String(currentApiConfig?.apiKey || '').trim();
    const apiKey = String(cfg?.apiKey || '').trim() || fallbackKey;

    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model,
            input: inputs
        })
    });
    if (!response.ok) {
        throw new Error('向量化接口返回错误');
    }
    const data = await response.json();
    const arr = Array.isArray(data?.data) ? data.data : [];
    const embeddings = arr.map(x => x?.embedding).filter(e => Array.isArray(e));
    if (embeddings.length === inputs.length) return embeddings;
    return [];
}

async function vectorizeSummariesForContact(contact) {
    if (!contact?.id) return;
    if (!State.summaryHistories) State.summaryHistories = {};
    const memories = State.summaryHistories[contact.id] || [];
    if (memories.length === 0) {
        showToast('暂无可向量化的总结');
        return;
    }

    if (!State.summaryVectors) State.summaryVectors = Storage.getSummaryVectors();
    const store = State.summaryVectors[contact.id] && typeof State.summaryVectors[contact.id] === 'object'
        ? State.summaryVectors[contact.id]
        : { version: 1, model: '', apiUrl: '', items: {} };
    if (!store.items || typeof store.items !== 'object') store.items = {};

    const splitSummaryToChunks = (text, maxChunkChars = 600, maxChunks = 8) => {
        const s = String(text || '').replace(/\r\n/g, '\n').trim();
        if (!s) return [];
        const paragraphs = s.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
        const chunks = [];
        let cur = '';
        const pushCur = () => {
            const t = cur.trim();
            if (t) chunks.push(t);
            cur = '';
        };
        const pushText = (p) => {
            const t = String(p || '').trim();
            if (!t) return;
            if (t.length <= maxChunkChars) {
                if (!cur) {
                    cur = t;
                    return;
                }
                if ((cur.length + 2 + t.length) <= maxChunkChars) {
                    cur = `${cur}\n${t}`;
                    return;
                }
                pushCur();
                cur = t;
                return;
            }
            for (let i = 0; i < t.length; i += maxChunkChars) {
                const part = t.slice(i, i + maxChunkChars).trim();
                if (!part) continue;
                if (cur) pushCur();
                chunks.push(part);
            }
        };
        paragraphs.forEach(pushText);
        pushCur();
        if (chunks.length <= maxChunks) return chunks;
        const head = chunks.slice(0, maxChunks - 1);
        const tail = chunks.slice(maxChunks - 1).join('\n');
        return [...head, tail].filter(Boolean);
    };

    const pending = [];
    for (const m of memories) {
        const content = String(m?.content || '').trim();
        if (!content) continue;
        const summaryId = getSummaryVectorId(m);
        if (!summaryId) continue;
        const chunks = splitSummaryToChunks(content);
        chunks.forEach((chunkText, idx) => {
            const id = `${summaryId}#${idx}`;
            if (store.items[id]) return;
            pending.push({
                id,
                parentId: summaryId,
                time: m.time || 0,
                messageCount: m.messageCount || 0,
                content: chunkText
            });
        });
    }

    if (pending.length === 0) {
        showToast('已全部向量化');
        return;
    }

    const cfg = State.vectorConfig || Storage.getVectorConfig();
    store.model = String(cfg?.model || '').trim() || store.model || '';
    store.apiUrl = String(cfg?.apiUrl || '').trim() || store.apiUrl || '';

    let done = 0;
    try {
        showLoading(`向量化中... (0/${pending.length})`);
        const batchSize = 8;
        for (let i = 0; i < pending.length; i += batchSize) {
            const batch = pending.slice(i, i + batchSize);
            const embeddings = await fetchEmbeddingsBatch(batch.map(x => x.content));
            if (embeddings.length !== batch.length) {
                throw new Error('向量化结果数量不匹配');
            }
            for (let j = 0; j < batch.length; j++) {
                const item = batch[j];
                store.items[item.id] = {
                    parentId: item.parentId,
                    time: item.time,
                    messageCount: item.messageCount,
                    text: item.content,
                    embedding: embeddings[j]
                };
            }
            done += batch.length;
            showLoading(`向量化中... (${done}/${pending.length})`);
        }
        State.summaryVectors[contact.id] = store;
        Storage.saveSummaryVectors(State.summaryVectors);
        showToast(`向量化完成：${done} 条`);
    } finally {
        hideLoading();
    }
}

function cosineSimilarity(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length === 0 || a.length !== b.length) return 0;
    let dot = 0;
    let na = 0;
    let nb = 0;
    for (let i = 0; i < a.length; i++) {
        const x = Number(a[i]) || 0;
        const y = Number(b[i]) || 0;
        dot += x * y;
        na += x * x;
        nb += y * y;
    }
    const denom = Math.sqrt(na) * Math.sqrt(nb);
    if (!denom) return 0;
    return dot / denom;
}

async function recallSummaryChunks(contact, queryText, topK = 2) {
    const contactId = contact?.id;
    if (!contactId) return '';
    const query = String(queryText || '').trim();
    if (!query) return getLatestSummaryText(contactId);

    const store = State.summaryVectors?.[contactId];
    const items = store?.items && typeof store.items === 'object' ? Object.entries(store.items) : [];
    if (items.length === 0) return getLatestSummaryText(contactId);

    let qEmbedding = null;
    try {
        const e = await fetchEmbeddingsBatch([query]);
        qEmbedding = Array.isArray(e?.[0]) ? e[0] : null;
    } catch (e) {
        return getLatestSummaryText(contactId);
    }
    if (!qEmbedding) return getLatestSummaryText(contactId);

    const scored = [];
    for (const [id, v] of items) {
        const emb = v?.embedding;
        const text = typeof v?.text === 'string' ? v.text.trim() : '';
        if (!text || !Array.isArray(emb) || emb.length !== qEmbedding.length) continue;
        scored.push({ id, score: cosineSimilarity(qEmbedding, emb), text });
    }
    if (scored.length === 0) return getLatestSummaryText(contactId);
    scored.sort((x, y) => y.score - x.score);

    const chosen = [];
    const used = new Set();
    for (const s of scored) {
        if (chosen.length >= topK) break;
        if (used.has(s.text)) continue;
        if (s.score < 0.2) continue;
        used.add(s.text);
        chosen.push(s.text);
    }
    if (chosen.length === 0) return getLatestSummaryText(contactId);
    return chosen.join('\n\n');
}

function toPlainTextFromStoredContent(rawContent) {
    if (rawContent == null) return '';
    const text = String(rawContent);
    if (!text) return '';
    const first = text[0];
    if (first === '{' || first === '[') {
        try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed)) {
                const parts = parsed.map((it) => {
                    if (!it || typeof it !== 'object') return '';
                    if (typeof it.content === 'string') return it.content;
                    if (typeof it.description === 'string') return it.description;
                    if (typeof it.quote === 'string' && typeof it.content === 'string') return `「${it.quote}」\n${it.content}`;
                    if (typeof it.sticker === 'string') return it.sticker ? `[表情] ${it.sticker}` : '[表情]';
                    return '';
                }).filter(Boolean);
                if (parts.length > 0) return parts.join('\n');
            }
            if (parsed && typeof parsed === 'object') {
                const t = String(parsed.type || '');
                if (t === 'text' || t === 'text_message') {
                    if (isStoredCallRecordPayload(parsed)) {
                        return formatCallRecordForContext(parsed);
                    }
                    return String(parsed.content || '');
                }
                if (t === 'quote' || t === 'quote_reply') {
                    const q = String(parsed.quote || '');
                    const c = String(parsed.content || '');
                    return q ? `「${q}」\n${c}` : c;
                }
                if (t === 'sticker_message') {
                    const v = String(parsed.sticker || '');
                    return v ? `[表情] ${v}` : '[表情]';
                }
                if (t === 'image') {
                    const desc = String(parsed.description || '').trim();
                    return desc ? `[图片] ${desc}` : '[图片]';
                }
                if (t === 'voice') {
                    const v = String(parsed.text || parsed.transcription || parsed.content || '').trim();
                    return v ? `[语音] ${v}` : '[语音]';
                }
                if (t === 'action') {
                    const cmd = String(parsed.command || '').trim();
                    return cmd ? `[动作] ${cmd}` : '[动作]';
                }
                if (t === 'event') {
                    const aiText = String(parsed.aiText || '').trim();
                    if (aiText) return aiText;
                    const display = String(parsed.display || '').trim();
                    return display ? `[聊天事件] ${display}` : '[聊天事件]';
                }
            }
        } catch (e) {
        }
    }
    return text;
}

function sanitizeAiTextEnding(raw) {
    let text = String(raw ?? '');
    if (!text) return '';
    text = text.replace(/\r\n/g, '\n').trim();
    text = text.replace(/[\s\u200B\u200C\u200D\uFEFF]+$/g, '');
    if (!text) return '';
    while (/[。｡．]$/.test(text)) {
        text = text.slice(0, -1);
        text = text.replace(/[\s\u200B\u200C\u200D\uFEFF]+$/g, '');
    }
    if (text.endsWith('.') && !text.endsWith('...')) {
        const prev = text.slice(-2, -1);
        if (!/[0-9]/.test(prev)) {
            text = text.slice(0, -1);
            text = text.replace(/[\s\u200B\u200C\u200D\uFEFF]+$/g, '');
        }
    }
    return text;
}

function splitAiTextToBubbles(raw, options = {}) {
    const maxLen = Math.max(8, Math.min(48, Number(options.maxLen || 22) || 22));
    const maxItems = Math.max(1, Math.min(20, Number(options.maxItems || 8) || 8));
    const text = sanitizeAiTextEnding(String(raw ?? '').replace(/\r\n/g, '\n'));
    if (!text) return [];
    const parts = [];
    const paras = text.split(/\n+/).map(s => s.trim()).filter(Boolean);
    const sentenceRegex = /[^。！？?!…]+(?:[。！？?!…]+)?/g;
    for (const para of paras) {
        const matches = para.match(sentenceRegex) || [];
        for (const m of matches) {
            const s = String(m || '').trim();
            if (s) parts.push(s);
        }
    }
    const merged = [];
    for (const s of parts) {
        const last = merged[merged.length - 1];
        if (!last) {
            merged.push(s);
            continue;
        }
        if ((last.length + s.length) <= maxLen && !/[。！？?!…]$/.test(last)) {
            merged[merged.length - 1] = `${last}${s}`;
            continue;
        }
        merged.push(s);
    }
    const out = [];
    for (const s of merged) {
        const t = sanitizeAiTextEnding(s);
        if (!t) continue;
        out.push(t);
        if (out.length >= maxItems) break;
    }
    return out;
}

function expandAiDisplayItems(items, options = {}) {
    const out = [];
    for (const it of (Array.isArray(items) ? items : [])) {
        if (!it || typeof it !== 'object') continue;
        const t = String(it.type || '').trim();
        if (t === 'text' || t === 'text_message') {
            const raw = typeof it.content === 'string' ? it.content : '';
            const chunks = splitAiTextToBubbles(raw, options);
            if (chunks.length === 0) continue;
            for (const c of chunks) {
                const next = { ...it, type: 'text', content: c };
                out.push(next);
                if (out.length >= (options.maxItemsTotal || 20)) break;
            }
            continue;
        }
        out.push(it);
        if (out.length >= (options.maxItemsTotal || 20)) break;
    }
    return out;
}

function isStoredCallRecordPayload(parsed) {
    if (!parsed || typeof parsed !== 'object') return false;
    const t = String(parsed.type || '');
    if (t !== 'text' && t !== 'text_message') return false;
    const text = String(parsed.content || '');
    return text.startsWith('[通话记录]');
}

function getStoredCallRecordType(parsed) {
    const raw = String(parsed?.callMeta?.type || '').trim().toLowerCase();
    if (raw === 'video' || raw === 'voice') return raw;
    const content = String(parsed?.content || '');
    if (/视频/.test(content)) return 'video';
    if (/语音/.test(content)) return 'voice';
    return 'call';
}

function getStoredCallRecordTypeLabel(parsed) {
    const t = getStoredCallRecordType(parsed);
    if (t === 'video') return '视频通话';
    if (t === 'voice') return '语音通话';
    return '通话';
}

function getStoredCallTranscriptItems(parsed) {
    const transcript = Array.isArray(parsed?.callTranscript) ? parsed.callTranscript : [];
    return transcript
        .map((item) => ({
            role: item?.role === 'assistant' ? 'assistant' : 'user',
            content: String(item?.content || '').trim()
        }))
        .filter((item) => item.content);
}

function formatCallRecordForContext(parsed, options = {}) {
    if (!isStoredCallRecordPayload(parsed)) return String(parsed?.content || '');
    const typeLabel = getStoredCallRecordTypeLabel(parsed);
    const summary = String(parsed.content || '').replace(/^\[通话记录\]\n?/, '').trim();
    const transcript = getStoredCallTranscriptItems(parsed);
    const userLabel = String(options.userLabel || '我');
    const assistantLabel = String(options.assistantLabel || '对方');
    const lines = [`[${typeLabel}记录]`];
    if (summary) lines.push(summary);
    if (transcript.length > 0) {
        lines.push(`[${typeLabel}过程]`);
        transcript.forEach((item) => {
            const speaker = item.role === 'assistant' ? assistantLabel : userLabel;
            lines.push(`${speaker}: ${item.content}`);
        });
    }
    return lines.join('\n');
}

function getStoredMessageUnitCount(rawContent) {
    if (rawContent == null) return 0;
    try {
        const parsed = JSON.parse(String(rawContent));
        if (isStoredCallRecordPayload(parsed)) {
            const transcriptCount = getStoredCallTranscriptItems(parsed).length;
            return Math.max(1, transcriptCount);
        }
    } catch (e) {
    }
    return 1;
}

function getHistoryUnitCount(history) {
    const list = Array.isArray(history) ? history : [];
    return list.reduce((sum, item) => {
        if (!item) return sum;
        if (item.role === 'system' && String(item.content || '').startsWith('[系统归档记忆]')) return sum;
        return sum + getStoredMessageUnitCount(item.content);
    }, 0);
}

function getUserProfileForContact(contact) {
    const base = State.user || Storage.DEFAULT_USER || { nickname: '用户', wxid: '', avatar: '', persona: '', gender: '' };
    const override = contact && typeof contact === 'object' ? (contact.userOverride || {}) : {};
    const nickname = String(override.nickname || '').trim() || String(base.nickname || '').trim() || '用户';
    const wxid = String(override.wxid || '').trim() || String(base.wxid || '').trim() || '';
    const avatar = String(override.avatar || '').trim() || String(base.avatar || '').trim() || '';
    const userPersona = String(override.userPersona || '').trim() || String(base.persona || '').trim() || '';
    const gender = String(override.gender || '').trim() || String(base.gender || '').trim() || 'male';
    return { nickname, wxid, avatar, userPersona, gender };
}

function hashString32(input) {
    const str = String(input ?? '');
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
        hash |= 0;
    }
    return (hash >>> 0).toString(16);
}

function getModelsCacheKey(configLike) {
    const useProxy = !!configLike?.useProxy;
    const proxyUrl = String(configLike?.proxyUrl || '').trim();
    const apiUrl = String(configLike?.apiUrl || '').trim();
    const apiKey = String(configLike?.apiKey || '');
    return `${useProxy ? '1' : '0'}|${useProxy ? proxyUrl : apiUrl}|${hashString32(apiKey)}`;
}

function setApiProxyUIFromConfig(config) {
    const toggle = document.getElementById('api-proxy-toggle');
    const group = document.getElementById('api-proxy-url-group');
    const input = document.getElementById('api-proxy-url-input');
    const enabled = !!config?.useProxy;
    toggle?.classList.toggle('active', enabled);
    if (group) group.style.display = enabled ? '' : 'none';
    if (input) input.value = config?.proxyUrl || '';
}

function updateApiModelSelectedHint(config) {
    const hint = document.getElementById('api-model-selected-hint');
    if (!hint) return;
    const list = Array.isArray(config?.models) ? config.models : [];
    const count = list.length;
    if (count === 0) {
        hint.textContent = '已选 0 个模型';
        return;
    }
    const preview = list.slice(0, 3).join('、');
    hint.textContent = count <= 3 ? `已选 ${count} 个模型：${preview}` : `已选 ${count} 个模型：${preview} 等`;
}

function renderSelectedModelsList(config) {
    const container = document.getElementById('api-models-list');
    if (!container) return;
    const list = Array.isArray(config?.models) ? config.models : [];
    if (list.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    const current = (config?.model || '').trim();
    container.style.display = '';
    container.innerHTML = list.map((m) => {
        const active = (m === current) ? 'active' : '';
        return `
            <div class="api-model-chip ${active}" data-model="${encodeURIComponent(m)}">
                <span class="api-model-chip-name">${escapeHtml(m)}</span>
                <span class="api-model-chip-x" data-action="remove">×</span>
            </div>
        `;
    }).join('');

    container.onclick = async (e) => {
        const chip = e.target.closest('.api-model-chip');
        if (!chip) return;
        const model = chip.dataset.model ? decodeURIComponent(chip.dataset.model) : '';
        if (!model) return;

        const actionEl = e.target.closest('[data-action="remove"]');
        if (actionEl) {
            const ok = await WeChatUI.showConfirm('移除模型', `确定移除「${model}」吗？`, '移除', '取消', true);
            if (!ok) return;
            const next = list.filter(x => x !== model);
            config.models = next;
            if (config.model === model) config.model = next[0] || '';
            applyApiModelUIFromConfig(config);
            Storage.saveApiConfigs(State.apiConfigs);
            return;
        }

        config.model = model;
        applyApiModelUIFromConfig(config);
        Storage.saveApiConfigs(State.apiConfigs);
        showToast(`已切换：${model}`);
    };
}

function applyApiVisionUIFromConfig(config) {
    const toggle = document.getElementById('api-vision-toggle');
    toggle?.classList.toggle('active', !!config?.visionEnabled);
}

function updateChatModelSwitchButton() {
    const btn = document.getElementById('chat-model-switch-btn');
    if (!btn) return;
    const cfg = State.apiConfigs.find(c => c.id === State.currentApiId);
    if (!cfg) {
        btn.title = '未选择API方案';
        return;
    }
    const apiName = (cfg.name || '未命名方案').trim() || '未命名方案';
    const pickedModel = (cfg.model || '').trim() || (Array.isArray(cfg.models) ? (cfg.models[0] || '').trim() : '');
    const modelText = pickedModel || '未选择模型';
    btn.title = `当前方案：${apiName}\n当前模型：${modelText}`;
}

function closeChatModelDropdown() {
    const dropdown = document.getElementById('chat-model-dropdown');
    if (!dropdown) return;
    dropdown.style.display = 'none';
}

function isChatModelDropdownOpen() {
    const dropdown = document.getElementById('chat-model-dropdown');
    return !!dropdown && dropdown.style.display !== 'none';
}

function getCurrentModelForConfig(config) {
    return (config?.model || '').trim()
        || (Array.isArray(config?.models) ? (config.models[0] || '').trim() : '')
        || 'gpt-3.5-turbo';
}

function getSelectedModelForConfig(config) {
    return (config?.model || '').trim() || (Array.isArray(config?.models) ? (config.models[0] || '').trim() : '');
}

function getModelsForConfig(config) {
    const raw = Array.isArray(config?.models) ? config.models : [];
    const list = raw.map(x => (typeof x === 'string' ? x.trim() : '')).filter(Boolean);
    const picked = (config?.model || '').trim();
    if (picked && !list.includes(picked)) list.unshift(picked);
    return Array.from(new Set(list));
}

function renderChatModelDropdown() {
    const titleEl = document.getElementById('chat-model-dropdown-title');
    const listEl = document.getElementById('chat-model-dropdown-list');
    if (!listEl) return;

    const configs = Array.isArray(State.apiConfigs) ? State.apiConfigs : [];
    if (titleEl) titleEl.textContent = `API方案 / 模型（${configs.length}）`;

    const openApiId = renderChatModelDropdown._openApiId || State.currentApiId;
    const chevronSvg = `
        <svg class="chat-model-group-chevron" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 9 L12 15 L18 9" fill="none" stroke="#1a1a1a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;

    if (configs.length === 0) {
        listEl.innerHTML = '<div style="padding: 14px 10px; color:#888; font-size:13px;">暂无API方案</div>';
        return;
    }

    listEl.innerHTML = configs.map((cfg) => {
        const apiId = String(cfg.id || '');
        const apiName = (cfg.name || '未命名方案').trim() || '未命名方案';
        const isCurrentApi = apiId === State.currentApiId;
        const open = apiId === openApiId;
        const badge = isCurrentApi ? '<span class="chat-model-group-badge">当前</span>' : '';
        const selectedModel = getSelectedModelForConfig(cfg);
        const subtitle = selectedModel ? escapeHtml(selectedModel) : '未选择模型';
        const models = getModelsForConfig(cfg);
        const body = (models.length === 0)
            ? '<div style="padding: 10px 10px; color:#888; font-size:13px;">未添加模型</div>'
            : models.map((m) => {
                const active = isCurrentApi && m === selectedModel ? 'active' : '';
                const meta = (isCurrentApi && m === selectedModel) ? '<span class="chat-model-item-meta">当前</span>' : '<span class="chat-model-item-meta">切换</span>';
                return `<div class="chat-model-item ${active}" data-action="pick-model" data-api-id="${encodeURIComponent(apiId)}" data-model="${encodeURIComponent(m)}"><span>${escapeHtml(m)}</span>${meta}</div>`;
            }).join('');

        return `
            <div class="chat-model-group ${open ? 'open' : ''}" data-api-id="${encodeURIComponent(apiId)}">
                <div class="chat-model-group-header" data-action="toggle-api" data-api-id="${encodeURIComponent(apiId)}">
                    <div>
                        <div class="chat-model-group-title">${escapeHtml(apiName)}${badge}</div>
                        <div class="chat-model-group-subtitle">${subtitle}</div>
                    </div>
                    ${chevronSvg}
                </div>
                <div class="chat-model-group-body">${body}</div>
            </div>
        `;
    }).join('');

    listEl.onclick = async (e) => {
        const toggleEl = e.target.closest('[data-action="toggle-api"]');
        if (toggleEl) {
            const apiId = toggleEl.dataset.apiId ? decodeURIComponent(toggleEl.dataset.apiId) : '';
            if (apiId) {
                renderChatModelDropdown._openApiId = (renderChatModelDropdown._openApiId === apiId) ? '' : apiId;
                renderChatModelDropdown();
            }
            return;
        }

        const pickEl = e.target.closest('[data-action="pick-model"]');
        if (!pickEl) return;
        const apiId = pickEl.dataset.apiId ? decodeURIComponent(pickEl.dataset.apiId) : '';
        const model = pickEl.dataset.model ? decodeURIComponent(pickEl.dataset.model) : '';
        if (!apiId || !model) return;

        const cfg = State.apiConfigs.find(c => String(c.id || '') === apiId);
        if (!cfg) return;

        State.currentApiId = apiId;
        Storage.saveCurrentApiId(apiId);

        cfg.model = model;
        if (!Array.isArray(cfg.models)) cfg.models = [];
        if (!cfg.models.includes(model)) cfg.models = [...cfg.models, model];
        Storage.saveApiConfigs(State.apiConfigs);

        updateChatModelSwitchButton();
        showToast(`已切换：${model}`);
        closeChatModelDropdown();
    };
}

function toggleChatModelDropdown() {
    const dropdown = document.getElementById('chat-model-dropdown');
    const cfg = State.apiConfigs.find(c => c.id === State.currentApiId);
    if (!dropdown || !cfg) {
        showToast('请先配置API');
        return;
    }

    if (isChatModelDropdownOpen()) {
        closeChatModelDropdown();
        return;
    }

    dropdown.style.display = '';
    renderChatModelDropdown();
}

function applyApiModelUIFromConfig(config) {
    const input = document.getElementById('api-model-input');
    if (input) input.value = config?.model || '';
    updateApiModelSelectedHint(config);
    renderSelectedModelsList(config);
    updateChatModelSwitchButton();
}

function getDraftApiConfigFromForm() {
    const useProxy = document.getElementById('api-proxy-toggle')?.classList.contains('active') || false;
    const visionEnabled = document.getElementById('api-vision-toggle')?.classList.contains('active') || false;
    return {
        name: document.getElementById('api-name-input')?.value?.trim() || '未命名方案',
        apiUrl: document.getElementById('api-url-input')?.value?.trim() || '',
        apiKey: document.getElementById('api-key-input')?.value?.trim() || '',
        model: document.getElementById('api-model-input')?.value?.trim() || '',
        visionEnabled,
        useProxy,
        proxyUrl: document.getElementById('api-proxy-url-input')?.value?.trim() || ''
    };
}

async function testCurrentApiConfig() {
    const cfg = getDraftApiConfigFromForm();
    if (cfg.useProxy) {
        if (!cfg.proxyUrl) {
            showToast('请先填写代理地址');
            return;
        }
    } else {
        if (!cfg.apiUrl) {
            showToast('请先填写 API URL');
            return;
        }
        if (!cfg.apiKey) {
            showToast('请先填写 API Key');
            return;
        }
    }

    const testMessages = [{ role: 'user', content: '你好' }];
    let url = cfg.useProxy ? cfg.proxyUrl : normalizeChatCompletionsUrl(cfg.apiUrl);
    try {
        const headers = { 'Content-Type': 'application/json' };
        if (!cfg.useProxy) headers.Authorization = `Bearer ${cfg.apiKey}`;
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: cfg.model || 'gpt-3.5-turbo',
                messages: testMessages
            })
        });
        if (!response.ok) {
            let errMsg = `HTTP ${response.status}`;
            try {
                const errData = await response.json();
                errMsg = errData?.error?.message || errData?.error || errMsg;
            } catch (e) {
            }
            showToast(`测试失败：${errMsg}`);
            return;
        }
        showToast('测试成功');
    } catch (e) {
        const msg = (e && e.message) ? e.message : '网络错误';
        if (/Failed to fetch|NetworkError/i.test(msg)) {
            showToast('测试失败：可能是跨域/CORS，建议开启代理');
        } else {
            showToast(`测试失败：${msg}`);
        }
    }
}

async function fetchModelsListForConfig(config) {
    const useProxy = !!config?.useProxy;
    if (useProxy) {
        const proxyUrl = (config?.proxyUrl || '').trim();
        if (!proxyUrl) throw new Error('请先填写代理地址');
        const tryFetch = async (url, init) => {
            const res = await fetch(url, init);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            return res.json();
        };

        let data = null;
        try {
            data = await tryFetch(proxyUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ op: 'models' })
            });
        } catch (e) {
            try {
                const joiner = proxyUrl.includes('?') ? '&' : '?';
                data = await tryFetch(`${proxyUrl}${joiner}op=models`, { method: 'GET' });
            } catch (e2) {
                throw e;
            }
        }

        const items = Array.isArray(data?.data) ? data.data : (Array.isArray(data) ? data : []);
        return items.map(it => (typeof it === 'string' ? it : it?.id)).filter(Boolean);
    }

    const apiUrl = (config?.apiUrl || '').trim();
    const apiKey = (config?.apiKey || '').trim();
    if (!apiUrl || !apiKey) throw new Error('请先填写 API URL 与 API Key');

    const tryEndpoints = [];
    const normalized = normalizeModelsUrlFromChatUrl(apiUrl);
    if (normalized) tryEndpoints.push(normalized);

    try {
        const u = new URL(apiUrl);
        const rawPath = u.pathname.replace(/\/+$/, '');
        let basePath = rawPath;
        basePath = basePath.replace(/\/v1\/chat\/completions$/i, '');
        basePath = basePath.replace(/\/chat\/completions$/i, '');
        basePath = basePath.replace(/\/v1$/i, '');
        const base = `${u.origin}${basePath}`;
        tryEndpoints.push(`${base}/v1/models`);
        tryEndpoints.push(`${base}/v1beta/models`);
        tryEndpoints.push(`${base}/models`);
    } catch (e) {
    }

    const endpoints = Array.from(new Set(tryEndpoints)).filter(Boolean);
    let lastErr = null;

    for (const endpoint of endpoints) {
        try {
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${apiKey}` }
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();

            if (Array.isArray(data?.data)) {
                const ids = data.data.map(it => it?.id).filter(Boolean);
                if (ids.length > 0) return ids;
            }

            if (Array.isArray(data)) {
                const ids = data.map(it => (typeof it === 'string' ? it : it?.id)).filter(Boolean);
                if (ids.length > 0) return ids;
            }

            if (Array.isArray(data?.models)) {
                const modelNames = data.models
                    .map(m => m?.name || m?.id || m)
                    .map(x => (typeof x === 'string' ? x.replace(/^models\//, '') : ''))
                    .filter(Boolean);
                if (modelNames.length > 0) return modelNames;
            }
        } catch (e) {
            lastErr = e;
        }
    }

    throw lastErr || new Error('未获取到模型列表');
}

function openModelPickerModal(config, models, options = {}) {
    const modal = document.getElementById('model-picker-modal');
    const overlay = document.getElementById('model-picker-overlay');
    const listEl = document.getElementById('model-picker-list');
    const searchEl = document.getElementById('model-picker-search');
    const clearBtn = document.getElementById('model-picker-clear');
    const selectAllBtn = document.getElementById('model-picker-selectall');
    const confirmBtn = document.getElementById('model-picker-confirm');

    if (!modal || !overlay || !listEl || !searchEl || !clearBtn || !selectAllBtn || !confirmBtn) {
        showToast('模型选择器缺失');
        return;
    }

    const all = Array.isArray(models) ? models.filter(Boolean) : [];
    const single = !!options?.single;
    const onConfirm = typeof options?.onConfirm === 'function' ? options.onConfirm : null;
    const title = String(options?.title || '').trim();
    const titleEl = modal.querySelector('.wechat-dialog-title');
    if (titleEl) titleEl.textContent = title || (single ? '选择模型' : '选择模型（可多选）');

    clearBtn.style.display = single ? 'none' : '';
    selectAllBtn.style.display = single ? 'none' : '';

    const selected = new Set(Array.isArray(config.models) ? config.models : []);
    let current = (config.model || '').trim();
    if (current) selected.add(current);
    if (!current && selected.size > 0) current = Array.from(selected)[0];
    if (single && current) {
        selected.clear();
        selected.add(current);
    }

    const getFiltered = () => {
        const kw = (searchEl.value || '').trim().toLowerCase();
        if (!kw) return all;
        return all.filter(m => String(m).toLowerCase().includes(kw));
    };

    const render = () => {
        const filtered = getFiltered();
        listEl.innerHTML = filtered.map((m) => {
            const checked = selected.has(m) ? 'checked' : '';
            const badgeText = (m === current) ? '当前' : '设为当前';
            return `
                <div class="model-picker-item" data-model="${encodeURIComponent(m)}">
                    <input type="checkbox" ${checked} />
                    <div class="model-picker-name">${escapeHtml(m)}</div>
                    <span class="model-picker-badge">${badgeText}</span>
                </div>
            `;
        }).join('');
    };

    const close = () => {
        modal.classList.remove('show');
        overlay.onclick = null;
        searchEl.oninput = null;
        clearBtn.onclick = null;
        selectAllBtn.onclick = null;
        confirmBtn.onclick = null;
        listEl.onclick = null;
    };

    overlay.onclick = close;

    searchEl.oninput = () => render();

    listEl.onclick = (e) => {
        const item = e.target.closest('.model-picker-item');
        if (!item) return;
        const model = item.dataset.model ? decodeURIComponent(item.dataset.model) : '';
        if (!model) return;

        if (e.target.classList.contains('model-picker-badge')) {
            current = model;
            if (single) {
                selected.clear();
                selected.add(model);
            } else {
                selected.add(model);
            }
            render();
            return;
        }

        const checkbox = item.querySelector('input[type="checkbox"]');
        if (!checkbox) return;
        const nextChecked = e.target === checkbox ? checkbox.checked : !checkbox.checked;
        checkbox.checked = nextChecked;
        if (nextChecked) {
            if (single) {
                selected.clear();
                selected.add(model);
                current = model;
            } else {
                selected.add(model);
                if (!current) current = model;
            }
        } else {
            selected.delete(model);
            if (current === model) current = '';
        }
        if (!current && selected.size > 0) current = Array.from(selected)[0];
        render();
    };

    clearBtn.onclick = () => {
        selected.clear();
        current = '';
        render();
    };

    selectAllBtn.onclick = () => {
        getFiltered().forEach(m => selected.add(m));
        if (!current && selected.size > 0) current = Array.from(selected)[0];
        render();
    };

    confirmBtn.onclick = () => {
        const picked = Array.from(selected);
        if (picked.length === 0) {
            showToast('请至少选择 1 个模型');
            return;
        }
        if (!current || !selected.has(current)) current = picked[0];

        if (onConfirm) {
            try {
                onConfirm({ picked, current, all });
            } catch (e) {
            }
            close();
            return;
        }

        config.availableModels = all;
        config.models = picked;
        config.model = current;

        applyApiModelUIFromConfig(config);
        Storage.saveApiConfigs(State.apiConfigs);
        showToast(`已选择 ${picked.length} 个模型`);
        close();
    };

    modal.classList.add('show');
    render();
    setTimeout(() => searchEl.focus(), 80);
}

async function fetchAndPickModelsForCurrentConfig() {
    const config = State.apiConfigs.find(c => c.id === State.currentApiId);
    if (!config) return;

    try {
        const draft = getDraftApiConfigFromForm();
        const cacheKey = getModelsCacheKey(draft);
        if (config.availableModelsKey === cacheKey && Array.isArray(config.availableModels) && config.availableModels.length > 0) {
            openModelPickerModal(config, config.availableModels);
            return;
        }
        const tempConfig = {
            apiUrl: draft.apiUrl,
            apiKey: draft.apiKey,
            useProxy: draft.useProxy,
            proxyUrl: draft.proxyUrl
        };
        const models = await fetchModelsListForConfig(tempConfig);
        const uniq = Array.from(new Set(models)).sort((a, b) => String(a).localeCompare(String(b)));
        if (uniq.length === 0) {
            showToast('未获取到模型列表');
            return;
        }
        config.availableModels = uniq;
        config.availableModelsKey = cacheKey;
        Storage.saveApiConfigs(State.apiConfigs);
        openModelPickerModal(config, uniq);
    } catch (e) {
        const msg = (e && e.message) ? e.message : '网络错误';
        if (/Failed to fetch|NetworkError/i.test(msg)) {
            showToast('获取失败：可能是跨域/CORS，建议开启代理');
        } else {
            showToast(`获取失败：${msg}`);
        }
    }
}

async function fetchAndPickModelsForMomentsSubApi() {
    const modelInput = document.getElementById('moments-subapi-model-input');
    const useMain = document.getElementById('moments-subapi-use-main-toggle')?.classList.contains('active') || false;
    const mainApiId = String(document.getElementById('moments-subapi-main-select')?.value || 'current').trim() || 'current';

    let tempConfig = null;
    if (useMain) {
        const mainCfg = getMainApiConfigBySharedId(mainApiId);
        if (!mainCfg) {
            showToast('请先选择可用的主API方案');
            return;
        }
        tempConfig = {
            useProxy: !!mainCfg.useProxy,
            proxyUrl: String(mainCfg.proxyUrl || '').trim(),
            apiUrl: String(mainCfg.apiUrl || '').trim(),
            apiKey: String(mainCfg.apiKey || '').trim()
        };
    } else {
        const useProxy = document.getElementById('moments-subapi-proxy-toggle')?.classList.contains('active') || false;
        const proxyUrl = String(document.getElementById('moments-subapi-proxy-url-input')?.value || '').trim();
        const apiUrl = String(document.getElementById('moments-subapi-url-input')?.value || '').trim();
        const apiKey = String(document.getElementById('moments-subapi-key-input')?.value || '').trim();
        tempConfig = {
            useProxy,
            proxyUrl,
            apiUrl: normalizeChatCompletionsUrl(apiUrl),
            apiKey
        };
    }

    try {
        const models = await fetchModelsListForConfig(tempConfig);
        const uniq = Array.from(new Set(models)).sort((a, b) => String(a).localeCompare(String(b)));
        if (uniq.length === 0) {
            showToast('未获取到模型列表');
            return;
        }
        const cur = String(modelInput?.value || '').trim();
        const tmp = { model: cur, models: cur ? [cur] : [] };
        openModelPickerModal(tmp, uniq, {
            single: true,
            title: '选择朋友圈模型',
            onConfirm: ({ current }) => {
                if (modelInput) modelInput.value = current || '';
                if (!State.momentsSubApiConfig) State.momentsSubApiConfig = Storage.getMomentsSubApiConfig();
                State.momentsSubApiConfig.model = String(current || '').trim();
                showToast(`已选择：${current}`);
            }
        });
    } catch (e) {
        const msg = (e && e.message) ? e.message : '网络错误';
        if (/Failed to fetch|NetworkError/i.test(msg)) {
            showToast('获取失败：可能是跨域/CORS，建议开启代理');
        } else {
            showToast(`获取失败：${msg}`);
        }
    }
}

async function fetchAndPickModelsForSummaryConfig() {
    const modelInput = document.getElementById('summary-model-input');
    const useMain = document.getElementById('summary-use-main-toggle')?.classList.contains('active') || false;
    const mainApiId = String(document.getElementById('summary-main-select')?.value || 'current').trim() || 'current';

    let tempConfig = null;
    if (useMain) {
        const mainCfg = getMainApiConfigBySharedId(mainApiId);
        if (!mainCfg) {
            showToast('请先选择可用的主API方案');
            return;
        }
        tempConfig = {
            useProxy: !!mainCfg.useProxy,
            proxyUrl: String(mainCfg.proxyUrl || '').trim(),
            apiUrl: String(mainCfg.apiUrl || '').trim(),
            apiKey: String(mainCfg.apiKey || '').trim()
        };
    } else {
        const apiUrl = String(document.getElementById('summary-url-input')?.value || '').trim();
        const apiKey = String(document.getElementById('summary-key-input')?.value || '').trim();
        tempConfig = {
            useProxy: false,
            proxyUrl: '',
            apiUrl: normalizeChatCompletionsUrl(apiUrl),
            apiKey
        };
    }

    try {
        const models = await fetchModelsListForConfig(tempConfig);
        const uniq = Array.from(new Set(models)).sort((a, b) => String(a).localeCompare(String(b)));
        if (uniq.length === 0) {
            showToast('未获取到模型列表');
            return;
        }
        const cur = String(modelInput?.value || '').trim();
        const tmp = { model: cur, models: cur ? [cur] : [] };
        openModelPickerModal(tmp, uniq, {
            single: true,
            title: '选择总结模型',
            onConfirm: ({ current }) => {
                if (modelInput) modelInput.value = current || '';
                if (!State.summaryConfig) State.summaryConfig = Storage.getSummaryConfig();
                State.summaryConfig.model = String(current || '').trim();
                showToast(`已选择：${current}`);
            }
        });
    } catch (e) {
        const msg = (e && e.message) ? e.message : '网络错误';
        if (/Failed to fetch|NetworkError/i.test(msg)) {
            showToast('获取失败：可能是跨域/CORS，建议开启代理');
        } else {
            showToast(`获取失败：${msg}`);
        }
    }
}

function applyMomentsSubApiUIFromState() {
    const cfg = State.momentsSubApiConfig || Storage.getMomentsSubApiConfig();
    State.momentsSubApiConfig = cfg;

    const useMainToggle = document.getElementById('moments-subapi-use-main-toggle');
    const mainGroup = document.getElementById('moments-subapi-main-group');
    const mainSelect = document.getElementById('moments-subapi-main-select');
    const customGroup = document.getElementById('moments-subapi-custom-group');
    const proxyToggle = document.getElementById('moments-subapi-proxy-toggle');
    const proxyGroup = document.getElementById('moments-subapi-proxy-url-group');
    const proxyInput = document.getElementById('moments-subapi-proxy-url-input');
    const urlInput = document.getElementById('moments-subapi-url-input');
    const keyInput = document.getElementById('moments-subapi-key-input');
    const modelInput = document.getElementById('moments-subapi-model-input');

    const useMain = !!cfg.useMainApi;
    useMainToggle?.classList.toggle('active', useMain);
    if (mainGroup) mainGroup.style.display = useMain ? '' : 'none';
    if (customGroup) customGroup.style.display = useMain ? 'none' : '';
    renderSharedMainApiSelect(mainSelect, cfg.mainApiId);

    if (proxyToggle) proxyToggle.classList.toggle('active', !!cfg.useProxy);
    const proxyEnabled = proxyToggle?.classList.contains('active') || false;
    if (proxyGroup) proxyGroup.style.display = (!useMain && proxyEnabled) ? '' : 'none';

    if (proxyInput) proxyInput.value = cfg.proxyUrl || '';
    if (urlInput) urlInput.value = cfg.apiUrl || '';
    if (keyInput) keyInput.value = cfg.apiKey || '';
    if (modelInput) modelInput.value = cfg.model || '';
}

function getDraftMomentsSubApiConfigFromForm() {
    const useMain = document.getElementById('moments-subapi-use-main-toggle')?.classList.contains('active') || false;
    const mainApiId = String(document.getElementById('moments-subapi-main-select')?.value || 'current').trim() || 'current';
    const model = String(document.getElementById('moments-subapi-model-input')?.value || '').trim();

    const useProxy = document.getElementById('moments-subapi-proxy-toggle')?.classList.contains('active') || false;
    const proxyUrl = String(document.getElementById('moments-subapi-proxy-url-input')?.value || '').trim();
    const apiUrl = String(document.getElementById('moments-subapi-url-input')?.value || '').trim();
    const apiKey = String(document.getElementById('moments-subapi-key-input')?.value || '').trim();

    return { useMainApi: useMain, mainApiId, useProxy, proxyUrl, apiUrl, apiKey, model };
}

function saveMainApiConfigFromForm() {
    const config = State.apiConfigs.find(c => c.id === State.currentApiId);
    if (!config) return false;

    const prevModelsKey = getModelsCacheKey(config);
    const draft = getDraftApiConfigFromForm();

    if (draft.useProxy) {
        if (!draft.proxyUrl) {
            showToast('请填写主API代理地址');
            return false;
        }
        config.proxyUrl = draft.proxyUrl;
    } else {
        if (!draft.apiUrl) {
            showToast('请填写主API URL');
            return false;
        }
        if (!draft.apiKey) {
            showToast('请填写主API Key');
            return false;
        }
        config.apiUrl = normalizeChatCompletionsUrl(draft.apiUrl);
        config.apiKey = draft.apiKey;
    }
    config.name = draft.name;
    const nextModel = (draft.model || '').trim();
    if (nextModel) {
        config.model = nextModel;
        if (!Array.isArray(config.models)) config.models = [];
        if (!config.models.includes(nextModel)) config.models = [...config.models, nextModel];
    } else {
        const list = Array.isArray(config.models) ? config.models : [];
        config.model = list[0] || '';
    }
    config.visionEnabled = !!draft.visionEnabled;
    config.useProxy = draft.useProxy;
    if (!draft.useProxy) config.proxyUrl = draft.proxyUrl || '';
    const nextModelsKey = getModelsCacheKey(config);
    if (prevModelsKey !== nextModelsKey) {
        config.availableModels = [];
        config.availableModelsKey = '';
    }
    Storage.saveApiConfigs(State.apiConfigs);
    renderApiConfigSelect();
    showToast('主API已保存');
    return true;
}

function saveVectorConfigFromForm() {
    State.vectorConfig = {
        apiUrl: document.getElementById('vector-api-url-input').value.trim(),
        apiKey: document.getElementById('vector-api-key-input').value.trim(),
        model: document.getElementById('vector-model-input').value.trim() || 'text-embedding-ada-002'
    };
    Storage.saveVectorConfig(State.vectorConfig);
    showToast('向量化已保存');
    return true;
}

function saveMomentsSubApiConfigFromForm() {
    const momentsDraft = getDraftMomentsSubApiConfigFromForm();
    if (!momentsDraft.useMainApi) {
        if (momentsDraft.useProxy) {
            if (!momentsDraft.proxyUrl) {
                showToast('请填写副API代理地址');
                return false;
            }
        } else {
            if (!momentsDraft.apiUrl) {
                showToast('请填写副API URL');
                return false;
            }
            if (!momentsDraft.apiKey) {
                showToast('请填写副API Key');
                return false;
            }
        }
    }
    State.momentsSubApiConfig = momentsDraft;
    Storage.saveMomentsSubApiConfig(momentsDraft);
    showToast('副API已保存');
    return true;
}

function applySummaryUseMainUI(useMain) {
    const mainGroup = document.getElementById('summary-main-group');
    const customGroup = document.getElementById('summary-custom-group');
    if (mainGroup) mainGroup.style.display = useMain ? '' : 'none';
    if (customGroup) customGroup.style.display = useMain ? 'none' : '';
}

// ==========================================
// 发现 Tab: API设置、世界书、提示词注入
// ==========================================

function initDiscoverPage() {
    // API设置入口
    document.getElementById('api-settings-entry')?.addEventListener('click', () => {
        showPage('api-settings-page');
        renderApiConfigSelect();
        // 加载向量化配置
        document.getElementById('vector-api-url-input').value = State.vectorConfig.apiUrl || '';
        document.getElementById('vector-api-key-input').value = State.vectorConfig.apiKey || '';
        document.getElementById('vector-model-input').value = State.vectorConfig.model || 'text-embedding-ada-002';
        applyMomentsSubApiUIFromState();
    });

    document.getElementById('moments-subapi-use-main-toggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
        const cfg = State.momentsSubApiConfig || Storage.getMomentsSubApiConfig();
        cfg.useMainApi = this.classList.contains('active');
        State.momentsSubApiConfig = cfg;
        applyMomentsSubApiUIFromState();
    });
    document.getElementById('moments-subapi-proxy-toggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
        const cfg = State.momentsSubApiConfig || Storage.getMomentsSubApiConfig();
        cfg.useProxy = this.classList.contains('active');
        State.momentsSubApiConfig = cfg;
        applyMomentsSubApiUIFromState();
    });
    document.getElementById('moments-subapi-main-select')?.addEventListener('change', function () {
        const cfg = State.momentsSubApiConfig || Storage.getMomentsSubApiConfig();
        cfg.mainApiId = String(this.value || 'current').trim() || 'current';
        State.momentsSubApiConfig = cfg;
    });
    document.getElementById('moments-subapi-fetch-models-btn')?.addEventListener('click', () => {
        fetchAndPickModelsForMomentsSubApi();
    });

    document.getElementById('api-proxy-toggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
        const enabled = this.classList.contains('active');
        const group = document.getElementById('api-proxy-url-group');
        if (group) group.style.display = enabled ? '' : 'none';
        const config = State.apiConfigs.find(c => c.id === State.currentApiId);
        if (config) {
            config.useProxy = enabled;
            config.availableModels = [];
            config.availableModelsKey = '';
            Storage.saveApiConfigs(State.apiConfigs);
        }
    });

    document.getElementById('api-vision-toggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
        const enabled = this.classList.contains('active');
        const config = State.apiConfigs.find(c => c.id === State.currentApiId);
        if (config) {
            config.visionEnabled = enabled;
            Storage.saveApiConfigs(State.apiConfigs);
        }
    });

    document.getElementById('test-api-btn')?.addEventListener('click', () => {
        testCurrentApiConfig();
    });

    document.getElementById('fetch-models-btn')?.addEventListener('click', () => {
        fetchAndPickModelsForCurrentConfig();
    });

    document.getElementById('save-main-api-btn')?.addEventListener('click', () => {
        saveMainApiConfigFromForm();
    });

    document.getElementById('save-vector-api-btn')?.addEventListener('click', () => {
        saveVectorConfigFromForm();
    });

    document.getElementById('save-moments-subapi-btn')?.addEventListener('click', () => {
        saveMomentsSubApiConfigFromForm();
    });

    // 切换API方案
    document.getElementById('api-config-select')?.addEventListener('change', (e) => {
        const id = e.target.value;
        const config = State.apiConfigs.find(c => c.id === id);
        if (config) {
            document.getElementById('api-name-input').value = config.name || '';
            document.getElementById('api-url-input').value = config.apiUrl || '';
            document.getElementById('api-key-input').value = config.apiKey || '';
            setApiProxyUIFromConfig(config);
            applyApiModelUIFromConfig(config);
            applyApiVisionUIFromConfig(config);
            State.currentApiId = id;
            Storage.saveCurrentApiId(id);
            updateChatModelSwitchButton();
        }
    });

    // 新建API方案
    document.getElementById('new-api-config-btn')?.addEventListener('click', () => {
        const newId = 'api_' + Date.now();
        const newConfig = { id: newId, name: '新方案', apiUrl: 'https://api.example.com/v1/chat/completions', apiKey: '', model: '', models: [], availableModels: [], availableModelsKey: '', visionEnabled: false, useProxy: false, proxyUrl: '' };
        State.apiConfigs.push(newConfig);
        State.currentApiId = newId;
        Storage.saveApiConfigs(State.apiConfigs);
        Storage.saveCurrentApiId(newId);
        renderApiConfigSelect();
    });

    // 删除API方案
    document.getElementById('delete-api-config-btn')?.addEventListener('click', async () => {
        if (State.apiConfigs.length <= 1) {
            showToast('至少保留一个API方案');
            return;
        }
        const ok = await WeChatUI.showConfirm('删除方案', '确定删除当前选中的方案吗？', '删除', '取消', true);
        if (!ok) return;
        State.apiConfigs = State.apiConfigs.filter(c => c.id !== State.currentApiId);
        State.currentApiId = State.apiConfigs[0].id;
        Storage.saveApiConfigs(State.apiConfigs);
        Storage.saveCurrentApiId(State.currentApiId);
        renderApiConfigSelect();
    });

    // 返回
    document.getElementById('api-back-btn')?.addEventListener('click', () => {
        hidePage('api-settings-page');
    });

    // 保存API设置
    document.getElementById('save-api-btn')?.addEventListener('click', () => {
        const config = State.apiConfigs.find(c => c.id === State.currentApiId);
        if (config) {
            const prevModelsKey = getModelsCacheKey(config);
            const draft = getDraftApiConfigFromForm();
            if (draft.useProxy) {
                if (!draft.proxyUrl) {
                    showToast('请填写代理地址');
                    return;
                }
                config.proxyUrl = draft.proxyUrl;
            } else {
                if (!draft.apiUrl) {
                    showToast('请填写 API URL');
                    return;
                }
                if (!draft.apiKey) {
                    showToast('请填写 API Key');
                    return;
                }
                config.apiUrl = normalizeChatCompletionsUrl(draft.apiUrl);
                config.apiKey = draft.apiKey;
            }
            config.name = draft.name;
            const nextModel = (draft.model || '').trim();
            if (nextModel) {
                config.model = nextModel;
                if (!Array.isArray(config.models)) config.models = [];
                if (!config.models.includes(nextModel)) config.models = [...config.models, nextModel];
            } else {
                const list = Array.isArray(config.models) ? config.models : [];
                config.model = list[0] || '';
            }
            config.visionEnabled = !!draft.visionEnabled;
            config.useProxy = draft.useProxy;
            if (!draft.useProxy) config.proxyUrl = draft.proxyUrl || '';
            const nextModelsKey = getModelsCacheKey(config);
            if (prevModelsKey !== nextModelsKey) {
                config.availableModels = [];
                config.availableModelsKey = '';
            }
            Storage.saveApiConfigs(State.apiConfigs);
            // 保存向量化配置
         State.vectorConfig = {
                apiUrl: document.getElementById('vector-api-url-input').value.trim(),
                apiKey: document.getElementById('vector-api-key-input').value.trim(),
                model: document.getElementById('vector-model-input').value.trim() || 'text-embedding-ada-002'
            };
            Storage.saveVectorConfig(State.vectorConfig);
            const momentsDraft = getDraftMomentsSubApiConfigFromForm();
            if (!momentsDraft.useMainApi) {
                if (momentsDraft.useProxy) {
                    if (!momentsDraft.proxyUrl) {
                        showToast('请填写朋友圈副API代理地址');
                        return;
                    }
                } else {
                    if (!momentsDraft.apiUrl) {
                        showToast('请填写朋友圈副API URL');
                        return;
                    }
                    if (!momentsDraft.apiKey) {
                        showToast('请填写朋友圈副API Key');
                        return;
                    }
                }
            }
            State.momentsSubApiConfig = momentsDraft;
            Storage.saveMomentsSubApiConfig(momentsDraft);
            showToast('API设置已保存');
            renderApiConfigSelect(); // 更新下拉列表显示的名字
        }
    });

    // 世界书入口
    document.getElementById('worldbook-entry')?.addEventListener('click', () => {
        showPage('worldbook-page');
        initWorldbookList();
    });

    document.getElementById('worldbook-back-btn')?.addEventListener('click', () => {
        hidePage('worldbook-page');
    });

    document.getElementById('add-worldbook-btn')?.addEventListener('click', () => {
        openWorldbookModal(-1);
    });

    // 提示词注入入口
    document.getElementById('prompt-inject-entry')?.addEventListener('click', () => {
        showPage('prompt-page');
        document.getElementById('global-prompt').value = State.globalPrompt;
        const modules = State.promptModules || Storage.DEFAULT_PROMPT_MODULES;
        const roleTplEl = document.getElementById('prompt-role-template');
        const protocolTplEl = document.getElementById('prompt-protocol-template');
        const humanTplEl = document.getElementById('prompt-human-template');
        const capabilityTplEl = document.getElementById('prompt-capability-template');
        if (roleTplEl) roleTplEl.value = modules.role || '';
        if (protocolTplEl) protocolTplEl.value = modules.protocol || '';
        if (humanTplEl) humanTplEl.value = modules.human || '';
        if (capabilityTplEl) capabilityTplEl.value = modules.capability || '';
        const prefs = State.promptPrefs || Storage.DEFAULT_PROMPT_PREFS;
        const imageLenEl = document.getElementById('prompt-image-length');
        const imageMinEl = document.getElementById('prompt-image-min-chars');
        const imageMaxEl = document.getElementById('prompt-image-max-chars');
        const extraRulesEl = document.getElementById('prompt-extra-rules');
        const stickerCandidateCountEl = document.getElementById('prompt-sticker-candidate-count');
        const imageRange = normalizeImageDescRange(prefs.imageDescMinChars ?? 25, prefs.imageDescMaxChars ?? 60);
        if (imageLenEl) imageLenEl.value = prefs.imageDescLength || 'medium';
        if (imageMinEl) imageMinEl.value = imageRange.min;
        if (imageMaxEl) imageMaxEl.value = imageRange.max;
        if (extraRulesEl) extraRulesEl.value = prefs.extraRules || '';
        if (stickerCandidateCountEl) stickerCandidateCountEl.value = prefs.stickerCandidateCount ?? 8;
        bindPromptPreviewEvents();
        refreshPromptPreview();
    });

    document.getElementById('prompt-back-btn')?.addEventListener('click', () => {
        hidePage('prompt-page');
    });

    document.getElementById('save-prompt-btn')?.addEventListener('click', () => {
        State.globalPrompt = document.getElementById('global-prompt').value;
        Storage.saveGlobalPrompt(State.globalPrompt);
        const nextPrefs = getDraftPromptPrefsFromForm();
        State.promptPrefs = nextPrefs;
        Storage.savePromptPrefs(nextPrefs);
        const nextModules = getDraftPromptModulesFromForm();
        State.promptModules = { ...Storage.DEFAULT_PROMPT_MODULES, ...(nextModules || {}) };
        Storage.savePromptModules(State.promptModules);
        showToast('提示词已保存');
        hidePage('prompt-page');
    });

    // 总结设置入口
    document.getElementById('summary-settings-entry')?.addEventListener('click', () => {
        showPage('summary-settings-page');
        const useMainToggle = document.getElementById('summary-use-main-toggle');
        const mainSelect = document.getElementById('summary-main-select');
        const useMain = !!State.summaryConfig.useMainApi;
        useMainToggle?.classList.toggle('active', useMain);
        renderSharedMainApiSelect(mainSelect, State.summaryConfig.mainApiId);
        applySummaryUseMainUI(useMain);

        document.getElementById('summary-url-input').value = State.summaryConfig.apiUrl || '';
        document.getElementById('summary-key-input').value = State.summaryConfig.apiKey || '';
        document.getElementById('summary-model-input').value = State.summaryConfig.model || '';
        document.getElementById('summary-threshold-input').value = State.summaryConfig.threshold || 300;
        document.getElementById('summary-keep-input').value = State.summaryConfig.keep || 100;
        document.getElementById('summary-prompt-input').value = State.summaryConfig.customPrompt || '';

        const autoSummaryToggle = document.getElementById('auto-summary-toggle');
        if (State.summaryConfig.enabled) {
            autoSummaryToggle?.classList.add('active');
        } else {
            autoSummaryToggle?.classList.remove('active');
        }
    });

    // 返回
    document.getElementById('summary-settings-back-btn')?.addEventListener('click', () => {
        hidePage('summary-settings-page');
    });

    // 自动总结开关事件
    document.getElementById('auto-summary-toggle')?.addEventListener('click', function() {
        this.classList.toggle('active');
    });

    document.getElementById('summary-use-main-toggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
        applySummaryUseMainUI(this.classList.contains('active'));
    });
    document.getElementById('summary-main-select')?.addEventListener('change', function () {
        if (!State.summaryConfig) State.summaryConfig = Storage.getSummaryConfig();
        State.summaryConfig.mainApiId = String(this.value || 'current').trim() || 'current';
    });
    document.getElementById('summary-fetch-models-btn')?.addEventListener('click', () => {
        fetchAndPickModelsForSummaryConfig();
    });

    // 恢复默认总结提示词
    document.getElementById('reset-summary-prompt-btn')?.addEventListener('click', () => {
        document.getElementById('summary-prompt-input').value = Storage.DEFAULT_SUMMARY_PROMPT;
        showToast('已恢复默认提示词');
    });

  // 保存总结设置
    document.getElementById('save-summary-settings-btn')?.addEventListener('click', () => {
        const keep = Math.max(0, parseInt(document.getElementById('summary-keep-input').value, 10) || 100);
        const threshold = Math.max(1, parseInt(document.getElementById('summary-threshold-input').value, 10) || 300);
        const useMain = document.getElementById('summary-use-main-toggle')?.classList.contains('active') || false;
        const mainApiId = String(document.getElementById('summary-main-select')?.value || 'current').trim() || 'current';
        const apiUrl = document.getElementById('summary-url-input').value.trim();
        const apiKey = document.getElementById('summary-key-input').value.trim();
        if (!useMain) {
            if (!apiUrl) {
                showToast('请填写总结 API URL 或开启“使用主API方案”');
                return;
            }
            if (!apiKey) {
                showToast('请填写总结 API Key 或开启“使用主API方案”');
                return;
            }
        }
        State.summaryConfig = {
            apiUrl,
            apiKey,
            model: document.getElementById('summary-model-input').value.trim(),
            threshold,
            keep,
            enabled: document.getElementById('auto-summary-toggle')?.classList.contains('active') || false,
            customPrompt: document.getElementById('summary-prompt-input').value.trim(),
            useMainApi: useMain,
            mainApiId
        };
        Storage.saveSummaryConfig(State.summaryConfig);
        showToast('总结设置已保存');
        hidePage('summary-settings-page');
    });

    // 朋友圈入口
    document.getElementById('moments-entry')?.addEventListener('click', () => {
        showPage('moments-page');
    });

    document.getElementById('moments-back-btn')?.addEventListener('click', () => {
        hidePage('moments-page');
    });
}

function initWorldbookList() {
    const list = document.getElementById('worldbook-list');
    if (!list) return;

    list.innerHTML = '';

    if (State.worldbooks.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">暂无世界书，点击右上角添加</div>';
        return;
    }

    State.worldbooks.forEach((book, index) => {
        const item = document.createElement('div');
        item.className = 'worldbook-item';
        item.innerHTML = `
            <div class="worldbook-title">${escapeHtml(book.title || '未命名')}</div>
            <div class="worldbook-desc">${escapeHtml(book.desc?.substring(0, 50) || '无简介')}...</div>
            <div class="worldbook-meta" style="font-size:12px; color:#999; margin-top:4px;">包含 ${book.entries?.length || 0} 个设定条目</div>
        `;
        // 点击列表项进入条目详情页
        item.addEventListener('click', () => openWorldbookEntries(book));
        
        // 增加一个编辑按钮（例如长按或右侧小按钮，这里用一个简单的编辑图标）
        const editBtn = document.createElement('span');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.style.cssText = 'float:right; padding:10px; color:#07c160; cursor:pointer;';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止触发进入条目详情的事件
            openWorldbookModal(index);
        });
        item.insertBefore(editBtn, item.firstChild);
        
        list.appendChild(item);
    });
}

// ==========================================
// 我 Tab: 用户中心、钱包、表情
// ==========================================

function initUserUI() {
    // 更新用户显示
    const meAvatar = document.getElementById('me-avatar');
    const meNickname = document.getElementById('me-nickname');
    const momentsAvatar = document.getElementById('moments-avatar');
    const momentsUsername = document.getElementById('moments-username');
    const momentsCover = document.getElementById('moments-cover');

    if (meAvatar) meAvatar.innerHTML = getAvatarHtml(State.user.avatar);
    if (meNickname) meNickname.textContent = State.user.nickname;
    if (momentsAvatar) momentsAvatar.innerHTML = getAvatarHtml(State.user.avatar);
    if (momentsUsername) momentsUsername.textContent = State.user.nickname;
    if (momentsCover) {
        const coverUrl = String(State.user?.momentsCover || '').trim();
        if (coverUrl) {
            momentsCover.style.backgroundImage = `url("${coverUrl}")`;
        } else {
            momentsCover.style.backgroundImage = '';
        }
    }
}

function initMePage() {
    // 头像上传与预览逻辑
    const profileUpload = document.getElementById('profile-avatar-upload');
    const profileUrl = document.getElementById('profile-avatar-url');
    const profilePreview = document.getElementById('profile-avatar-preview');
    const profileValue = document.getElementById('profile-avatar-value');

    profileUpload?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                if (profileValue) profileValue.value = base64;
                if (profilePreview) profilePreview.innerHTML = getAvatarHtml(base64);
                if (profileUrl) profileUrl.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    profileUrl?.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
            if (profileValue) profileValue.value = url;
            if (profilePreview) profilePreview.innerHTML = getAvatarHtml(url);
        }
    });

    // 用户资料
    document.getElementById('user-profile-entry')?.addEventListener('click', () => {
        showPage('profile-page');
        
        if (profileValue) profileValue.value = State.user.avatar || '';
        if (profilePreview) profilePreview.innerHTML = getAvatarHtml(State.user.avatar);
        if (profileUrl) profileUrl.value = '';
        
        document.getElementById('profile-nickname').value = State.user.nickname;
        document.getElementById('profile-wxid').value = State.user.wxid;
        document.getElementById('user-persona').value = State.user.persona || '';
        document.getElementById('user-perception').value = State.user.perception || '';
    });

    document.getElementById('profile-back-btn')?.addEventListener('click', () => {
        hidePage('profile-page');
    });

    document.getElementById('save-profile-btn')?.addEventListener('click', () => {
        State.user.avatar = profileValue ? profileValue.value : '';
        State.user.nickname = document.getElementById('profile-nickname').value || '用户';
        State.user.persona = document.getElementById('user-persona').value || '';
        State.user.perception = document.getElementById('user-perception').value || '';
        Storage.saveUser(State.user);
        initUserUI();
        hidePage('profile-page');
    });

    const getChatsExportMode = () => {
        const el = document.getElementById('backup-chats-mode');
        const v = String(el?.value || 'all').trim();
        return (v === 'last200') ? 'last200' : 'all';
    };

    const refreshBackupCounts = () => {
        const userCount = document.getElementById('backup-count-user');
        const apiCount = document.getElementById('backup-count-api');
        const promptsCount = document.getElementById('backup-count-prompts');
        const summaryCount = document.getElementById('backup-count-summary');
        const contactsCount = document.getElementById('backup-count-contacts');
        const chatsCount = document.getElementById('backup-count-chats');
        const worldbooksCount = document.getElementById('backup-count-worldbooks');
        const stickersCount = document.getElementById('backup-count-stickers');
        const walletCount = document.getElementById('backup-count-wallet');
        const momentsCount = document.getElementById('backup-count-moments');

        if (userCount) userCount.textContent = '1';
        if (apiCount) apiCount.textContent = `${(State.apiConfigs || []).length} 个`;
        if (promptsCount) promptsCount.textContent = '1';
        if (summaryCount) summaryCount.textContent = '1';
        if (contactsCount) contactsCount.textContent = `${(State.contacts || []).length} 个`;
        if (worldbooksCount) worldbooksCount.textContent = `${(State.worldbooks || []).length} 本`;
        if (stickersCount) stickersCount.textContent = `${(State.stickerLibraries || []).length} 个`;
        if (walletCount) walletCount.textContent = '1';
        if (momentsCount) momentsCount.textContent = `${(State.moments || []).length} 条`;

        let msgCount = 0;
        const chatsMode = getChatsExportMode();
        const chats = State.chatHistories || {};
        Object.keys(chats).forEach((k) => {
            const arr = chats[k];
            if (Array.isArray(arr)) msgCount += (chatsMode === 'last200' ? Math.min(arr.length, 200) : arr.length);
        });
        if (chatsCount) chatsCount.textContent = `${msgCount} 条`;
    };

    const getSelectedBackupGroups = () => {
        const set = new Set();
        document.querySelectorAll('#settings-page .backup-check').forEach((el) => {
            if (el && el.checked) set.add(el.dataset.module);
        });
        return Array.from(set);
    };

    const buildBackupPayload = (groups) => {
        const include = new Set(groups);
        const payload = {
            version: 1,
            app: 'my-wechat-phone',
            exportedAt: new Date().toISOString(),
            groups: {},
            data: {}
        };

        if (include.has('user')) {
            payload.groups.user = true;
            payload.data.user = Storage.getUser();
        }
        if (include.has('api')) {
            payload.groups.api = true;
            payload.data.api = {
                apiConfigs: Storage.getApiConfigs(),
                currentApiId: Storage.getCurrentApiId(),
                momentsSubApiConfig: Storage.getMomentsSubApiConfig()
            };
        }
        if (include.has('prompts')) {
            payload.groups.prompts = true;
            payload.data.prompts = {
                globalPrompt: Storage.getGlobalPrompt(),
                promptPrefs: Storage.getPromptPrefs(),
                promptModules: Storage.getPromptModules()
            };
        }
        if (include.has('summary')) {
            payload.groups.summary = true;
            payload.data.summary = {
                summaryConfig: Storage.getSummaryConfig(),
                vectorConfig: Storage.getVectorConfig(),
                summaryHistories: Storage.getSummaryHistories(),
                summaryVectors: Storage.getSummaryVectors()
            };
        }
        if (include.has('contacts')) {
            payload.groups.contacts = true;
            payload.data.contacts = Storage.getContacts();
        }
        if (include.has('chats')) {
            payload.groups.chats = true;
            const raw = Storage.getChatHistories();
            const chatsMode = getChatsExportMode();
            if (chatsMode === 'last200') {
                const trimmed = {};
                Object.keys(raw || {}).forEach((cid) => {
                    const list = raw?.[cid];
                    if (Array.isArray(list)) trimmed[cid] = list.slice(-200);
                });
                payload.data.chats = trimmed;
            } else {
                payload.data.chats = raw;
            }
        }
        if (include.has('worldbooks')) {
            payload.groups.worldbooks = true;
            payload.data.worldbooks = Storage.getWorldbooks();
        }
        if (include.has('stickers')) {
            payload.groups.stickers = true;
            payload.data.stickers = Storage.getStickerLibraries();
        }
        if (include.has('wallet')) {
            payload.groups.wallet = true;
            payload.data.wallet = Storage.getWallet();
        }
        if (include.has('moments')) {
            payload.groups.moments = true;
            payload.data.moments = Storage.getMoments();
        }

        return payload;
    };

    const downloadJson = (obj, filename) => {
        const text = JSON.stringify(obj, null, 2);
        const blob = new Blob([text], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 250);
    };

    const reloadAllFromStorageAndRefreshUI = () => {
        State.user = Storage.getUser();
        State.apiConfigs = Storage.getApiConfigs();
        State.currentApiId = Storage.getCurrentApiId();
        if (!State.apiConfigs.find(c => c.id === State.currentApiId)) {
            State.currentApiId = State.apiConfigs[0]?.id || 'default';
            Storage.saveCurrentApiId(State.currentApiId);
        }
        State.contacts = Storage.getContacts();
        State.chatHistories = Storage.getChatHistories();
        State.globalPrompt = Storage.getGlobalPrompt();
        State.promptPrefs = Storage.getPromptPrefs();
        State.promptModules = Storage.getPromptModules();
        State.summaryConfig = Storage.getSummaryConfig();
        State.vectorConfig = Storage.getVectorConfig();
        State.momentsSubApiConfig = Storage.getMomentsSubApiConfig();
        State.summaryHistories = Storage.getSummaryHistories();
        State.worldbooks = Storage.getWorldbooks();
        State.stickerLibraries = Storage.getStickerLibraries();
        State.wallet = Storage.getWallet();
        State.moments = Storage.getMoments();
        State.summaryVectors = Storage.getSummaryVectors();

        initUserUI();
        initChatList();
        initContactsList();
        initDiscoverPage();
        initStickersPage();
        initMomentsPage();
        refreshBackupCounts();
    };

    document.getElementById('settings-entry')?.addEventListener('click', () => {
        showPage('settings-page');
        refreshBackupCounts();
    });
    document.getElementById('settings-back-btn')?.addEventListener('click', () => {
        hidePage('settings-page');
    });
    document.getElementById('backup-select-all-cell')?.addEventListener('click', () => {
        document.querySelectorAll('#settings-page .backup-check').forEach((el) => { el.checked = true; });
    });
    document.getElementById('backup-select-none-cell')?.addEventListener('click', () => {
        document.querySelectorAll('#settings-page .backup-check').forEach((el) => { el.checked = false; });
    });
    document.getElementById('backup-chats-mode')?.addEventListener('change', () => {
        refreshBackupCounts();
    });
    document.getElementById('backup-export-selected-btn')?.addEventListener('click', () => {
        const groups = getSelectedBackupGroups();
        if (groups.length === 0) {
            showToast('请先勾选要导出的模块');
            return;
        }
        const payload = buildBackupPayload(groups);
        const ts = new Date();
        const name = `wechat_backup_${ts.getFullYear()}${String(ts.getMonth() + 1).padStart(2, '0')}${String(ts.getDate()).padStart(2, '0')}_${String(ts.getHours()).padStart(2, '0')}${String(ts.getMinutes()).padStart(2, '0')}.json`;
        downloadJson(payload, name);
        showToast('已导出');
    });

    document.getElementById('backup-import-btn')?.addEventListener('click', async () => {
        const groups = getSelectedBackupGroups();
        if (groups.length === 0) {
            showToast('请先勾选要导入的模块');
            return;
        }
        const ok = await WeChatUI.showConfirm('导入数据', '将从文件导入，并覆盖你勾选的模块数据。确定继续吗？', '导入', '取消', true);
        if (!ok) return;
        document.getElementById('backup-import-file')?.click();
    });

    document.getElementById('backup-import-file')?.addEventListener('change', async (e) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file) return;
        let text = '';
        try {
            text = await file.text();
        } catch (err) {
            showToast('读取文件失败');
            return;
        }
        let parsed = null;
        try {
            parsed = JSON.parse(text);
        } catch (err) {
            showToast('文件不是有效 JSON');
            return;
        }
        if (!parsed || typeof parsed !== 'object' || parsed.version !== 1 || !parsed.data) {
            showToast('备份文件格式不支持');
            return;
        }

        const groups = getSelectedBackupGroups();
        const include = new Set(groups);
        const data = parsed.data || {};

        if (include.has('user') && data.user) Storage.saveUser(data.user);
        if (include.has('api') && data.api) {
            if (Array.isArray(data.api.apiConfigs)) Storage.saveApiConfigs(data.api.apiConfigs);
            if (typeof data.api.currentApiId === 'string') Storage.saveCurrentApiId(data.api.currentApiId);
            if (data.api.momentsSubApiConfig) Storage.saveMomentsSubApiConfig(data.api.momentsSubApiConfig);
        }
        if (include.has('prompts') && data.prompts) {
            if (typeof data.prompts.globalPrompt === 'string') Storage.saveGlobalPrompt(data.prompts.globalPrompt);
            if (data.prompts.promptPrefs) Storage.savePromptPrefs(data.prompts.promptPrefs);
            if (data.prompts.promptModules) Storage.savePromptModules(data.prompts.promptModules);
        }
        if (include.has('summary') && data.summary) {
            if (data.summary.summaryConfig) Storage.saveSummaryConfig(data.summary.summaryConfig);
            if (data.summary.vectorConfig) Storage.saveVectorConfig(data.summary.vectorConfig);
            if (data.summary.summaryHistories) Storage.saveSummaryHistories(data.summary.summaryHistories);
            if (data.summary.summaryVectors) Storage.saveSummaryVectors(data.summary.summaryVectors);
        }
        if (include.has('contacts') && Array.isArray(data.contacts)) Storage.saveContacts(data.contacts);
        if (include.has('chats') && data.chats && typeof data.chats === 'object') Storage.saveChatHistories(data.chats);
        if (include.has('worldbooks') && Array.isArray(data.worldbooks)) Storage.saveWorldbooks(data.worldbooks);
        if (include.has('stickers') && Array.isArray(data.stickers)) Storage.saveStickerLibraries(data.stickers);
        if (include.has('wallet') && data.wallet) Storage.saveWallet(data.wallet);
        if (include.has('moments') && Array.isArray(data.moments)) Storage.saveMoments(data.moments);

        reloadAllFromStorageAndRefreshUI();
        showToast('导入完成');
    });

    // 钱包
    document.getElementById('wallet-entry')?.addEventListener('click', () => {
        showPage('wallet-page');
        initWalletPage();
    });

    document.getElementById('wallet-back-btn')?.addEventListener('click', () => {
        hidePage('wallet-page');
    });

    document.getElementById('wallet-more-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-paycode-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-open-detail-btn')?.addEventListener('click', () => {
        showPage('wallet-detail-page');
        initWalletPage();
    });
    document.getElementById('wallet-detail-back-btn')?.addEventListener('click', () => {
        hidePage('wallet-detail-page');
    });
    document.getElementById('wallet-detail-bills-btn')?.addEventListener('click', () => {
        showPage('wallet-bills-page');
        renderWalletBills();
    });
    document.getElementById('wallet-balance-cell')?.addEventListener('click', () => {
        showPage('wallet-balance-page');
        initWalletPage();
    });
    document.getElementById('wallet-licaitong-cell')?.addEventListener('click', () => {
        showPage('wallet-licaitong-page');
        initWalletPage();
    });
    document.getElementById('wallet-balance-back-btn')?.addEventListener('click', () => hidePage('wallet-balance-page'));
    document.getElementById('wallet-licaitong-back-btn')?.addEventListener('click', () => hidePage('wallet-licaitong-page'));
    document.getElementById('wallet-balance-detail-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-licaitong-more-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-go-licaitong-btn')?.addEventListener('click', () => {
        showPage('wallet-licaitong-page');
        initWalletPage();
    });
    document.getElementById('wallet-balance-detail-amount')?.addEventListener('click', async () => {
        const cur = +State.wallet.balance || 0;
        const val = await WeChatUI.showPrompt('修改零钱', '请输入金额：', String(cur.toFixed(2)));
        if (val === null) return;
        const num = parseFloat(String(val).replace(/[^\d.\-]/g, ''));
        if (isNaN(num) || num < 0) {
            showToast('金额无效');
            return;
        }
        State.wallet.balance = +num.toFixed(2);
        Storage.saveWallet(State.wallet);
        initWalletPage();
        showToast('已更新');
    });
    document.getElementById('wallet-licaitong-page-amount')?.addEventListener('click', async () => {
        const cur = +State.wallet.licaitongBalance || 0;
        const val = await WeChatUI.showPrompt('修改零钱通余额', '请输入金额：', String(cur.toFixed(2)));
        if (val === null) return;
        const num = parseFloat(String(val).replace(/[^\d.\-]/g, ''));
        if (isNaN(num) || num < 0) {
            showToast('金额无效');
            return;
        }
        State.wallet.licaitongBalance = +num.toFixed(2);
        Storage.saveWallet(State.wallet);
        initWalletPage();
        showToast('已更新');
    });
    document.getElementById('wallet-licaitong-assets-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-licaitong-timer-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-licaitong-product-1')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-licaitong-out-btn')?.addEventListener('click', async () => {
        const val = await WeChatUI.showPrompt('转出', '请输入转出金额：', '');
        if (val === null) return;
        const num = parseFloat(String(val).replace(/[^\d.\-]/g, ''));
        if (isNaN(num) || num <= 0) {
            showToast('金额无效');
            return;
        }
        if ((State.wallet.licaitongBalance || 0) < num) {
            showToast('余额不足');
            return;
        }
        State.wallet.licaitongBalance = +((State.wallet.licaitongBalance || 0) - num).toFixed(2);
        State.wallet.balance = +((State.wallet.balance || 0) + num).toFixed(2);
        addWalletBill('licaitong_out', -num, '零钱通转出');
        Storage.saveWallet(State.wallet);
        initWalletPage();
        showToast('已转出');
    });
    document.getElementById('wallet-licaitong-in-btn')?.addEventListener('click', async () => {
        const val = await WeChatUI.showPrompt('转入', '请输入转入金额：', '');
        if (val === null) return;
        const num = parseFloat(String(val).replace(/[^\d.\-]/g, ''));
        if (isNaN(num) || num <= 0) {
            showToast('金额无效');
            return;
        }
        if ((State.wallet.balance || 0) < num) {
            showToast('零钱不足');
            return;
        }
        State.wallet.balance = +((State.wallet.balance || 0) - num).toFixed(2);
        State.wallet.licaitongBalance = +((State.wallet.licaitongBalance || 0) + num).toFixed(2);
        addWalletBill('licaitong_in', -num, '转入零钱通');
        Storage.saveWallet(State.wallet);
        initWalletPage();
        showToast('已转入');
    });
    document.getElementById('wallet-customer-service-cell')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-idinfo-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-paysettings-btn')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-page')?.addEventListener('click', (e) => {
        const item = e.target?.closest?.('.service-item');
        if (!item) return;
        showToast('占位');
    });

    document.getElementById('wallet-topup-btn')?.addEventListener('click', async () => {
        const amountStr = await WeChatUI.showPrompt('充值', '请输入充值金额：', '');
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            showToast('金额无效');
            return;
        }
        State.wallet.balance = +(State.wallet.balance + amount).toFixed(2);
        addWalletBill('topup', amount, '零钱充值');
        Storage.saveWallet(State.wallet);
        initWalletPage();
        showToast('已充值');
    });

    document.getElementById('wallet-withdraw-btn')?.addEventListener('click', async () => {
        const amountStr = await WeChatUI.showPrompt('提现', '请输入提现金额：', '');
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            showToast('金额无效');
            return;
        }
        if (State.wallet.balance < amount) {
            showToast('余额不足');
            return;
        }
        State.wallet.balance = +(State.wallet.balance - amount).toFixed(2);
        addWalletBill('withdraw', -amount, '零钱提现');
        Storage.saveWallet(State.wallet);
        initWalletPage();
        showToast('已提现');
    });

    document.getElementById('wallet-bills-cell')?.addEventListener('click', () => {
        showPage('wallet-bills-page');
        renderWalletBills();
    });
    document.getElementById('wallet-bills-back-btn')?.addEventListener('click', () => {
        hidePage('wallet-bills-page');
    });
    document.getElementById('wallet-clear-bills-cell')?.addEventListener('click', async () => {
        const ok = await WeChatUI.showConfirm('清空账单', '确定清空本地账单记录吗？', '清空', '取消', true);
        if (!ok) return;
        State.wallet.bills = [];
        Storage.saveWallet(State.wallet);
        renderWalletBills();
        initWalletPage();
        showToast('已清空');
    });

    document.getElementById('wallet-bankcards-cell')?.addEventListener('click', () => {
        showPage('wallet-bankcards-page');
        renderWalletBankCards();
    });
    document.getElementById('wallet-bankcards-back-btn')?.addEventListener('click', () => {
        hidePage('wallet-bankcards-page');
    });
    document.getElementById('wallet-add-card-cell')?.addEventListener('click', async () => {
        const bank = await WeChatUI.showPrompt('添加银行卡', '请输入银行名称：', '');
        if (!bank) return;
        const tail = await WeChatUI.showPrompt('添加银行卡', '请输入卡号后4位：', '');
        if (!tail) return;
        const last4 = (tail || '').replace(/\D/g, '').slice(-4);
        if (last4.length !== 4) {
            showToast('请输入4位数字');
            return;
        }
        State.wallet.bankCards = Array.isArray(State.wallet.bankCards) ? State.wallet.bankCards : [];
        State.wallet.bankCards.push({ id: `card_${Date.now()}`, bank: bank.trim(), last4 });
        Storage.saveWallet(State.wallet);
        renderWalletBankCards();
        initWalletPage();
        showToast('已添加');
    });

    document.getElementById('wallet-security-cell')?.addEventListener('click', () => showToast('占位'));
    document.getElementById('wallet-payment-settings-cell')?.addEventListener('click', () => showToast('占位'));

    // 表情
    document.getElementById('stickers-entry')?.addEventListener('click', () => {
        showPage('stickers-page');
        initStickersPage();
    });

    document.getElementById('stickers-back-btn')?.addEventListener('click', () => {
        hidePage('stickers-page');
    });

    document.getElementById('open-sticker-store-btn')?.addEventListener('click', () => {
        showPage('sticker-store-page');
        initStickerStorePage();
    });

    document.getElementById('sticker-store-back-btn')?.addEventListener('click', () => {
        hidePage('sticker-store-page');
        initStickersPage();
    });

    document.getElementById('add-sticker-lib-btn')?.addEventListener('click', () => {
        const modal = document.getElementById('sticker-import-modal');
        const nameEl = document.getElementById('sticker-lib-name-input');
        const contentEl = document.getElementById('sticker-lib-content-input');
        const singleUrlEl = document.getElementById('sticker-single-url-input');
        if (nameEl) nameEl.value = '';
        if (contentEl) contentEl.value = '';
        if (singleUrlEl) singleUrlEl.value = '';
        modal?.classList.add('show');
        setTimeout(() => nameEl?.focus(), 80);
    });

    document.getElementById('sticker-import-cancel')?.addEventListener('click', () => {
        document.getElementById('sticker-import-modal')?.classList.remove('show');
    });

    document.getElementById('sticker-add-url-btn')?.addEventListener('click', () => {
        const url = document.getElementById('sticker-single-url-input')?.value?.trim() || '';
        const contentEl = document.getElementById('sticker-lib-content-input');
        if (!url) {
            showToast('请输入图片URL');
            return;
        }
        if (!/^https?:\/\//i.test(url)) {
            showToast('URL需要以 http/https 开头');
            return;
        }
        const name = deriveStickerNameFromUrl(url);
        const line = `${name}：${url}`;
        const prev = (contentEl?.value || '').trim();
        if (contentEl) {
            contentEl.value = prev ? `${prev}\n${line}` : line;
        }
        const singleUrlEl = document.getElementById('sticker-single-url-input');
        if (singleUrlEl) singleUrlEl.value = '';
    });

    document.getElementById('sticker-import-confirm')?.addEventListener('click', () => {
        const name = document.getElementById('sticker-lib-name-input')?.value?.trim() || '';
        const content = document.getElementById('sticker-lib-content-input')?.value?.trim() || '';
        if (!name) {
            showToast('请输入表情包名称');
            return;
        }
        if (!content) {
            showToast('请输入导入内容');
            return;
        }
        importStickerLibrary(name, content);
    });

    document.getElementById('sticker-lib-detail-back-btn')?.addEventListener('click', () => {
        hidePage('sticker-lib-detail-page');
        initStickersPage();
    });
}

function initWalletPage() {
    const formatMoney = (n) => `¥${(+n || 0).toFixed(2)}`;
    const amountEl = document.getElementById('wallet-balance-amount');
    if (amountEl) amountEl.textContent = formatMoney(State.wallet.balance || 0);
    const amountDetailEl = document.getElementById('wallet-balance-detail-amount');
    if (amountDetailEl) amountDetailEl.textContent = formatMoney(State.wallet.balance || 0);

    const licaitongAmountEl = document.getElementById('wallet-licaitong-amount');
    if (licaitongAmountEl) licaitongAmountEl.textContent = formatMoney(State.wallet.licaitongBalance || 0);
    const licaitongPageAmountEl = document.getElementById('wallet-licaitong-page-amount');
    if (licaitongPageAmountEl) licaitongPageAmountEl.textContent = formatMoney(State.wallet.licaitongBalance || 0);

    const rateEl = document.getElementById('wallet-licaitong-rate');
    if (rateEl) rateEl.textContent = `${(+State.wallet.licaitongRate || 0).toFixed(4)}%`;
    const totalIncomeEl = document.getElementById('wallet-licaitong-total-income');
    if (totalIncomeEl) totalIncomeEl.textContent = formatMoney(State.wallet.licaitongTotalIncome || 0);
    const yestIncomeEl = document.getElementById('wallet-licaitong-yesterday-income');
    if (yestIncomeEl) yestIncomeEl.textContent = formatMoney(State.wallet.licaitongYesterdayIncome || 0);

    const billsSummaryEl = document.getElementById('wallet-bills-summary');
    const bankCardsSummaryEl = document.getElementById('wallet-bankcards-summary');
    if (billsSummaryEl) billsSummaryEl.textContent = '查看';
    const cardCount = Array.isArray(State.wallet.bankCards) ? State.wallet.bankCards.length : 0;
    if (bankCardsSummaryEl) bankCardsSummaryEl.textContent = cardCount ? `${cardCount} 张` : '管理';
}

function addWalletBill(type, amount, title) {
    State.wallet.bills = Array.isArray(State.wallet.bills) ? State.wallet.bills : [];
    State.wallet.bills.unshift({
        id: `bill_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        type,
        title: title || '账单',
        amount: +amount,
        time: Date.now()
    });
    if (State.wallet.bills.length > 200) State.wallet.bills.length = 200;
}

function formatWalletTime(ts) {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
}

function renderWalletBills() {
    const list = document.getElementById('wallet-bills-list');
    if (!list) return;
    const bills = Array.isArray(State.wallet.bills) ? State.wallet.bills : [];
    if (bills.length === 0) {
        list.innerHTML = '<div style="padding: 26px 10px; text-align:center; color:#999; font-size:13px; background:#fff;">暂无账单</div>';
        return;
    }
    list.innerHTML = '';
    bills.forEach((b) => {
        const div = document.createElement('div');
        div.className = 'wallet-bill-item';
        const negative = (b.amount || 0) < 0;
        const amountStr = `${negative ? '-' : ''}¥${Math.abs(b.amount || 0).toFixed(2)}`;
        div.innerHTML = `
            <div class="wallet-bill-left">
                <div class="wallet-bill-title">${escapeHtml(b.title || '账单')}</div>
                <div class="wallet-bill-time">${escapeHtml(formatWalletTime(b.time))}</div>
            </div>
            <div class="wallet-bill-amount ${negative ? 'negative' : ''}">${amountStr}</div>
        `;
        list.appendChild(div);
    });
}

function renderWalletBankCards() {
    const list = document.getElementById('wallet-bankcards-list');
    if (!list) return;
    const cards = Array.isArray(State.wallet.bankCards) ? State.wallet.bankCards : [];
    if (cards.length === 0) {
        list.innerHTML = '<div style="padding: 26px 10px; text-align:center; color:#999; font-size:13px; background:#fff;">暂无银行卡</div>';
        return;
    }
    list.innerHTML = '';
    cards.forEach((c) => {
        const row = document.createElement('div');
        row.className = 'wallet-card-item';
        row.innerHTML = `
            <div class="wallet-card-name">${escapeHtml(c.bank || '银行卡')}</div>
            <div class="wallet-card-tail">尾号 ${escapeHtml(c.last4 || '')}</div>
        `;
        row.addEventListener('click', async () => {
            const ok = await WeChatUI.showConfirm('删除银行卡', `确定删除 ${c.bank || '银行卡'}（尾号 ${c.last4 || ''}）吗？`, '删除', '取消', true);
            if (!ok) return;
            State.wallet.bankCards = (Array.isArray(State.wallet.bankCards) ? State.wallet.bankCards : []).filter(x => x.id !== c.id);
            Storage.saveWallet(State.wallet);
            renderWalletBankCards();
            initWalletPage();
            showToast('已删除');
        });
        list.appendChild(row);
    });
}

function initStickersPage() {
    const list = document.getElementById('sticker-lib-list');
    if (!list) return;

    list.innerHTML = '';
    State.stickerLibraries.forEach((lib, index) => {
        const item = document.createElement('div');
        item.className = 'sticker-lib-item';
        const firstSticker = lib.items?.[0];
        const firstUrl = getStickerUrl(firstSticker);
        const firstText = getStickerText(firstSticker);
        const iconHtml = firstUrl
            ? `<img src="${firstUrl}">`
            : `<span>${firstText || '😊'}</span>`;

        item.innerHTML = `
            <div class="sticker-lib-icon">${iconHtml}</div>
            <div class="sticker-lib-info">
                <div class="sticker-lib-name">${escapeHtml(lib.name)}</div>
                <div class="sticker-lib-count">${lib.items.length} 个表情</div>
            </div>
            ${lib.id !== 'builtin_emoji' ? `<div class="sticker-lib-delete" data-index="${index}">删除</div>` : ''}
        `;
        
        item.querySelector('.sticker-lib-delete')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            const ok = await WeChatUI.showConfirm('删除表情包', `确定删除表情包库「${lib.name}」吗？`, '删除', '取消', true);
            if (ok) {
                State.stickerLibraries.splice(index, 1);
                Storage.saveStickerLibraries(State.stickerLibraries);
                initStickersPage();
                initChatStickerPanel();
                showToast('已删除');
            }
        });

        item.addEventListener('click', () => {
            openStickerLibraryDetail(index);
        });

        list.appendChild(item);
    });
}

function initStickerStorePage() {
    const list = document.getElementById('sticker-store-list');
    if (!list) return;

    list.innerHTML = '';
    STICKER_STORE_DATA.forEach(lib => {
        const isDownloaded = State.stickerLibraries.some(myLib => myLib.id === lib.id);
        const item = document.createElement('div');
        item.className = 'sticker-store-item';
        
        const firstSticker = lib.items?.[0];
        const firstUrl = getStickerUrl(firstSticker);
        const firstText = getStickerText(firstSticker);
        const iconHtml = firstUrl
            ? `<img src="${firstUrl}">`
            : `<span>${firstText || '😊'}</span>`;

        item.innerHTML = `
            <div class="sticker-lib-icon">${iconHtml}</div>
            <div class="sticker-lib-info">
                <div class="sticker-lib-name">${escapeHtml(lib.name)}</div>
                <div class="sticker-lib-count">${lib.items.length} 个表情</div>
            </div>
            <div class="sticker-store-download ${isDownloaded ? 'downloaded' : ''}" data-id="${lib.id}">
                ${isDownloaded ? '已添加' : '添加'}
            </div>
        `;

        const downloadBtn = item.querySelector('.sticker-store-download');
        if (!isDownloaded) {
            downloadBtn.addEventListener('click', () => {
                State.stickerLibraries.push({...lib});
                Storage.saveStickerLibraries(State.stickerLibraries);
                initStickerStorePage();
                initStickersPage();
                showToast('已添加到我的表情');
            });
        }

        list.appendChild(item);
    });
}

function importStickerLibrary(name, content) {
    const items = parseStickerImportText(content);

    if (items.length === 0) {
        showToast('导入失败，请检查格式');
        return;
    }

    const newLib = {
        id: 'user_' + Date.now(),
        name: name,
        items: items
    };

    State.stickerLibraries.push(newLib);
    Storage.saveStickerLibraries(State.stickerLibraries);
    document.getElementById('sticker-import-modal').classList.remove('show');
    initStickersPage();
    showToast('导入成功');
}

let currentChatStickerLibIndex = 0;
let currentStickerLibraryDetailIndex = -1;
let isChatStickerManageMode = false;
let selectedChatStickerIndexes = new Set();

function initChatStickerPanel() {
    ensureChatStickerManageToolbar();
    renderChatStickerTabs();
    renderChatStickerGrid();
    syncChatStickerManageButton();
}

function ensureChatStickerManageToolbar() {
    const footer = document.querySelector('#chat-sticker-panel .sticker-panel-footer');
    if (!footer) return;

    let tools = document.getElementById('sticker-manage-tools');
    if (!tools) {
        tools = document.createElement('div');
        tools.id = 'sticker-manage-tools';
        tools.className = 'sticker-manage-tools';
        tools.style.display = 'none';
        tools.innerHTML = `
            <div class="sticker-selected-count" id="sticker-selected-count">已选 0</div>
            <button type="button" class="sticker-batch-delete-btn" id="sticker-batch-delete-btn" aria-label="删除">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;

        const manageBtn = document.getElementById('sticker-manage-entry-btn');
        footer.insertBefore(tools, manageBtn || null);

        tools.querySelector('#sticker-batch-delete-btn')?.addEventListener('click', async () => {
            await deleteSelectedChatStickers();
        });
    }
}

function syncChatStickerManageButton() {
    const btn = document.getElementById('sticker-manage-entry-btn');
    const icon = btn?.querySelector('i');
    if (!btn || !icon) return;
    btn.classList.toggle('active', !!isChatStickerManageMode);
    icon.className = isChatStickerManageMode ? 'fas fa-check' : 'fas fa-cog';

    const tools = document.getElementById('sticker-manage-tools');
    if (tools) tools.style.display = isChatStickerManageMode ? 'flex' : 'none';
    syncChatStickerSelectedCount();
}

function toggleChatStickerManageMode(force) {
    if (typeof force === 'boolean') {
        isChatStickerManageMode = force;
    } else {
        isChatStickerManageMode = !isChatStickerManageMode;
    }
    if (!isChatStickerManageMode) selectedChatStickerIndexes.clear();
    syncChatStickerManageButton();
    renderChatStickerGrid();
    showToast(isChatStickerManageMode ? '管理模式' : '完成');
}

function isStickerLibraryEditable(lib) {
    return !!lib && lib.id !== 'builtin_emoji';
}

function syncChatStickerSelectedCount() {
    const el = document.getElementById('sticker-selected-count');
    if (!el) return;
    el.textContent = `已选 ${selectedChatStickerIndexes.size}`;
}

function toggleSelectChatSticker(index) {
    if (selectedChatStickerIndexes.has(index)) {
        selectedChatStickerIndexes.delete(index);
    } else {
        selectedChatStickerIndexes.add(index);
    }
    syncChatStickerSelectedCount();
    const grid = document.getElementById('sticker-panel-grid');
    const cell = grid?.querySelector(`.sticker-item-cell[data-index="${index}"]`);
    cell?.classList.toggle('selected', selectedChatStickerIndexes.has(index));
}

async function deleteSelectedChatStickers() {
    const lib = State.stickerLibraries[currentChatStickerLibIndex];
    if (!isChatStickerManageMode || !isStickerLibraryEditable(lib)) return;
    const count = selectedChatStickerIndexes.size;
    if (count === 0) {
        showToast('请选择要删除的表情');
        return;
    }
    const ok = await WeChatUI.showConfirm('批量删除', `确定删除选中的 ${count} 个表情吗？`, '删除', '取消', true);
    if (!ok) return;

    const indexes = Array.from(selectedChatStickerIndexes).sort((a, b) => b - a);
    indexes.forEach((idx) => {
        if (idx >= 0 && idx < lib.items.length) lib.items.splice(idx, 1);
    });

    selectedChatStickerIndexes.clear();
    Storage.saveStickerLibraries(State.stickerLibraries);
    renderChatStickerTabs();
    renderChatStickerGrid();
    initStickersPage();
    syncChatStickerManageButton();
    showToast('已删除');
}

function renderChatStickerTabs() {
    const tabs = document.getElementById('sticker-lib-tabs');
    if (!tabs) return;

    tabs.innerHTML = '';
    State.stickerLibraries.forEach((lib, index) => {
        const tab = document.createElement('div');
        tab.className = `sticker-tab ${index === currentChatStickerLibIndex ? 'active' : ''}`;
        
        const firstSticker = lib.items?.[0];
        const firstUrl = getStickerUrl(firstSticker);
        const firstText = getStickerText(firstSticker);
        if (firstUrl) {
            tab.innerHTML = `<img src="${firstUrl}">`;
        } else {
            tab.textContent = firstText || '😊';
        }

        tab.addEventListener('click', () => {
            currentChatStickerLibIndex = index;
            selectedChatStickerIndexes.clear();
            isChatStickerManageMode = false;
            renderChatStickerTabs();
            renderChatStickerGrid();
            syncChatStickerManageButton();
        });
        tabs.appendChild(tab);
    });
}

function renderChatStickerGrid() {
    const grid = document.getElementById('sticker-panel-grid');
    if (!grid) return;

    grid.innerHTML = '';
    const lib = State.stickerLibraries[currentChatStickerLibIndex];
    if (!lib) return;

    lib.items.forEach((rawSticker, idx) => {
        const cell = document.createElement('div');
        cell.className = 'sticker-item-cell';
        cell.dataset.index = String(idx);
        const url = getStickerUrl(rawSticker);
        const text = getStickerText(rawSticker);
        if (url) {
            cell.innerHTML = `<img src="${url}">`;
        } else {
            cell.textContent = text;
        }

        cell.addEventListener('click', () => {
            if (isChatStickerManageMode) {
                if (!isStickerLibraryEditable(lib)) return;
                toggleSelectChatSticker(idx);
                return;
            }
            if (!State.currentContactId) return;
            const contact = State.contacts.find(c => c.id === State.currentContactId);
            if (!contact) return;

            const stickerValue = text || url;
            const stickerContent = { type: "sticker_message", sticker: stickerValue };
            const stickerJson = JSON.stringify(stickerContent);

            if (!State.chatHistories[State.currentContactId]) {
                State.chatHistories[State.currentContactId] = [];
            }
            const nowTs = Date.now();
            State.chatHistories[State.currentContactId].push({
                role: 'user',
                content: stickerJson,
                time: nowTs
            });
            const msgIndex = State.chatHistories[State.currentContactId].length - 1;
            addMessageToUI(stickerJson, 'right', getUserProfileForContact(contact).avatar, msgIndex);
            Storage.saveChatHistories(State.chatHistories);
            if (State.currentContactId) renderChatMessages();
            
            // 发送完自动隐藏面板（模拟微信）
            document.getElementById('chat-sticker-panel').classList.remove('show');
            
            // 触发AI回复（如果需要）
            // fetchAIResponse(contact);
        });

        if (isChatStickerManageMode && isStickerLibraryEditable(lib)) {
            cell.classList.add('manage');
            if (selectedChatStickerIndexes.has(idx)) cell.classList.add('selected');
            const checkbox = document.createElement('div');
            checkbox.className = 'sticker-select-circle';
            checkbox.innerHTML = '<i class="fas fa-check"></i>';
            cell.appendChild(checkbox);
        }

        grid.appendChild(cell);
    });

    syncChatStickerSelectedCount();
}

function openStickerLibraryDetail(index) {
    currentStickerLibraryDetailIndex = index;
    showPage('sticker-lib-detail-page');
    renderStickerLibraryDetail();
}

function renderStickerLibraryDetail() {
    const titleEl = document.getElementById('sticker-lib-detail-title');
    const grid = document.getElementById('sticker-lib-detail-grid');
    if (!grid) return;
    const lib = State.stickerLibraries[currentStickerLibraryDetailIndex];
    if (!lib) return;

    if (titleEl) titleEl.textContent = lib.name || '表情包';
    grid.innerHTML = '';

    if (!lib.items || lib.items.length === 0) {
        grid.innerHTML = '<div style="padding: 30px 10px; text-align:center; color:#999;">这个表情包库还是空的</div>';
        return;
    }

    lib.items.forEach((rawSticker, itemIndex) => {
        const item = document.createElement('div');
        item.className = 'sticker-lib-detail-item';

        const url = getStickerUrl(rawSticker);
        const text = getStickerText(rawSticker);
        const canDelete = lib.id !== 'builtin_emoji';

        item.innerHTML = `
            <div class="sticker-lib-detail-cell">
                ${url ? `<img src="${url}" alt="">` : `<span>${escapeHtml(text || '😊')}</span>`}
            </div>
            ${canDelete ? `<button type="button" class="sticker-lib-detail-del" data-index="${itemIndex}" aria-label="删除">×</button>` : ''}
        `;

        item.querySelector('.sticker-lib-detail-del')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            const ok = await WeChatUI.showConfirm('删除表情', '确定删除这个表情吗？', '删除', '取消', true);
            if (!ok) return;
            const libNow = State.stickerLibraries[currentStickerLibraryDetailIndex];
            if (!libNow || libNow.id === 'builtin_emoji') return;
            libNow.items.splice(itemIndex, 1);
            Storage.saveStickerLibraries(State.stickerLibraries);
            renderStickerLibraryDetail();
            initStickersPage();
            initChatStickerPanel();
            showToast('已删除');
        });

        grid.appendChild(item);
    });
}

function getStickerUrl(sticker) {
    if (!sticker) return '';
    if (typeof sticker === 'string') return /^https?:\/\//i.test(sticker) ? sticker : '';
    if (typeof sticker === 'object') return sticker.url && /^https?:\/\//i.test(sticker.url) ? sticker.url : '';
    return '';
}

function getStickerText(sticker) {
    if (!sticker) return '';
    if (typeof sticker === 'string') return sticker;
    if (typeof sticker === 'object') return sticker.name || '';
    return '';
}

function normalizeStickerName(name) {
    return String(name || '').trim();
}

function extractStickerKeywords(name) {
    const raw = normalizeStickerName(name);
    if (!raw) return [];
    const normalized = raw
        .replace(/[()（）\[\]【】<>《》]/g, ' ')
        .replace(/[_/\\|:：,，.。!！?？"'“”'‘’+-]/g, ' ');
    const set = new Set();
    if (raw.length >= 2) set.add(raw.toLowerCase());
    normalized
        .split(/\s+/)
        .map(part => part.trim().toLowerCase())
        .filter(part => part.length >= 2)
        .forEach(part => set.add(part));
    return Array.from(set);
}

function extractStickerContextTextFromMessageContent(content) {
    const pushText = (bucket, value) => {
        const text = String(value || '').trim();
        if (text) bucket.push(text);
    };

    const bucket = [];
    const walk = (node) => {
        if (!node) return;
        if (Array.isArray(node)) {
            node.forEach(walk);
            return;
        }
        if (typeof node === 'string') {
            pushText(bucket, node);
            return;
        }
        if (typeof node !== 'object') return;

        if (typeof node.content === 'string') pushText(bucket, node.content);
        if (typeof node.quote === 'string') pushText(bucket, node.quote);
        if (typeof node.target_content === 'string') pushText(bucket, node.target_content);
        if (typeof node.reply_content === 'string') pushText(bucket, node.reply_content);
        if (typeof node.text === 'string') pushText(bucket, node.text);
        if (typeof node.transcription === 'string') pushText(bucket, node.transcription);
        if (typeof node.description === 'string') pushText(bucket, node.description);
        if (typeof node.sticker === 'string') pushText(bucket, node.sticker);
    };

    try {
        walk(JSON.parse(String(content || '')));
    } catch (e) {
        pushText(bucket, content);
    }
    return bucket.join('\n');
}

function extractRecentStickerNamesFromHistory(history) {
    const names = [];
    const seen = new Set();
    const visit = (node) => {
        if (!node) return;
        if (Array.isArray(node)) {
            node.forEach(visit);
            return;
        }
        if (typeof node !== 'object') return;
        if (node.type === 'sticker_message') {
            const name = normalizeStickerName(node.sticker);
            if (name && !seen.has(name)) {
                seen.add(name);
                names.push(name);
            }
        }
    };

    history.forEach((msg) => {
        try {
            visit(JSON.parse(String(msg?.content || '')));
        } catch (e) {
        }
    });

    return names;
}

function seededShuffle(list, seedText) {
    const arr = Array.isArray(list) ? list.slice() : [];
    let seed = 0;
    try {
        seed = parseInt(hashString32(seedText).slice(0, 8), 16) >>> 0;
    } catch (e) {
        seed = 1;
    }
    const nextRand = () => {
        seed ^= (seed << 13) >>> 0;
        seed ^= (seed >>> 17) >>> 0;
        seed ^= (seed << 5) >>> 0;
        return (seed >>> 0) / 0xffffffff;
    };
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(nextRand() * (i + 1));
        const t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
    return arr;
}

function getRelevantStickerNames(contact, limit = 8) {
    const linkedIds = Array.isArray(contact?.linkedStickerLibs) ? contact.linkedStickerLibs : [];
    if (linkedIds.length === 0) return [];

    const libs = linkedIds
        .map(id => State.stickerLibraries.find(l => l.id === id))
        .filter(Boolean);

    const allNames = [];
    const seenNames = new Set();
    libs.forEach((lib) => {
        (lib.items || []).forEach((it) => {
            const name = normalizeStickerName(getStickerText(it));
            if (!name || seenNames.has(name)) return;
            seenNames.add(name);
            allNames.push(name);
        });
    });

    if (allNames.length === 0) return [];

    const history = State.chatHistories?.[contact.id] || [];
    const recentHistory = history.slice(-12);
    const lastTime = Number(history[history.length - 1]?.time || 0) || 0;
    const recentContextText = recentHistory
        .map(msg => extractStickerContextTextFromMessageContent(msg?.content || ''))
        .filter(Boolean)
        .join('\n')
        .toLowerCase();
    const lastTurnText = recentHistory
        .slice(-3)
        .map(msg => extractStickerContextTextFromMessageContent(msg?.content || ''))
        .filter(Boolean)
        .join('\n')
        .toLowerCase();
    const personaContext = `${contact?.persona || ''}\n${contact?.style || ''}\n${contact?.userPersona || ''}`.toLowerCase();
    const fullContext = `${recentContextText}\n${personaContext}`;
    const recentStickerNames = extractRecentStickerNamesFromHistory(history.slice(-30));
    const seedBase = `${contact.id}|${lastTime}|${recentContextText.slice(-220)}`;
    const shuffledAll = seededShuffle(allNames, seedBase);
    const shuffledRank = new Map(shuffledAll.map((name, idx) => [name, idx]));

    const scored = allNames.map((name, index) => {
        let score = 0;
        const lowerName = name.toLowerCase();
        const keywords = extractStickerKeywords(name);

        if (lastTurnText.includes(lowerName)) score += 12;
        if (fullContext.includes(lowerName)) score += 6;
        keywords.forEach((kw) => {
            if (lastTurnText.includes(kw)) score += 5;
            else if (fullContext.includes(kw)) score += 2;
        });
        if (recentStickerNames.includes(name)) {
            const recentRank = recentStickerNames.indexOf(name);
            score += Math.max(1, 3 - recentRank);
        }

        return { name, index, score };
    });

    const picked = [];
    const pickedSet = new Set();
    const positive = scored.filter(item => item.score > 0);
    if (positive.length === 0) {
        shuffledAll.slice(0, limit).forEach((name) => {
            if (pickedSet.has(name)) return;
            picked.push(name);
            pickedSet.add(name);
        });
        return picked;
    }

    positive
        .sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score;
            const ra = shuffledRank.get(a.name) ?? a.index;
            const rb = shuffledRank.get(b.name) ?? b.index;
            return ra - rb;
        })
        .forEach((item) => {
            if (picked.length >= limit || pickedSet.has(item.name)) return;
            picked.push(item.name);
            pickedSet.add(item.name);
        });

    shuffledAll.forEach((name) => {
        if (picked.length >= limit || pickedSet.has(name)) return;
        picked.push(name);
        pickedSet.add(name);
    });

    return picked;
}

function buildStickerPromptCandidates(contact, limit = 8) {
    return getRelevantStickerNames(contact, limit).map((name, index) => ({
        code: `S${index + 1}`,
        name
    }));
}

function findStickerPromptCandidateByValue(value, contactId) {
    const raw = normalizeStickerName(value);
    if (!raw) return null;
    const candidates = State.lastStickerPromptCandidates?.[contactId];
    if (!Array.isArray(candidates) || candidates.length === 0) return null;

    const lower = raw.toLowerCase();
    const codeMatch = raw.match(/^(s\d{1,2})\b/i);
    const codeFromValue = codeMatch ? codeMatch[1].toLowerCase() : '';

    return candidates.find((item) => {
        const itemCode = String(item?.code || '').toLowerCase();
        const itemName = String(item?.name || '').toLowerCase();
        return lower === itemCode || lower === itemName || (codeFromValue && codeFromValue === itemCode);
    }) || null;
}

function resolveStickerPromptValue(value, contactId) {
    const raw = normalizeStickerName(value);
    if (!raw || /^https?:\/\//i.test(raw)) return raw;
    const candidate = findStickerPromptCandidateByValue(raw, contactId);
    return candidate?.name || raw;
}

function normalizeStickerMessagesInPayload(items, contactId) {
    if (!Array.isArray(items)) return items;
    return items.map((item) => {
        if (!item || typeof item !== 'object') return item;
        const t = String(item.type || '').trim();
        if (t === 'sticker_message') {
            return {
                ...item,
                sticker: resolveStickerPromptValue(item.sticker, contactId)
            };
        }
        if (t === 'text' || t === 'text_message') {
            const rawContent = typeof item.content === 'string' ? item.content : '';
            const fallback = item.text ?? item.message ?? item.value ?? '';
            const nextContent = (!rawContent.trim() && String(fallback || '').trim()) ? String(fallback) : rawContent;
            return {
                ...item,
                type: 'text',
                content: nextContent
            };
        }
        if (t === 'quote' || t === 'quote_reply') {
            const rawQuote = typeof item.quote === 'string' ? item.quote : '';
            const rawContent = typeof item.content === 'string' ? item.content : '';
            const fallbackQuote = item.target_content ?? '';
            const fallbackContent = item.reply_content ?? '';
            const nextQuote = (!rawQuote.trim() && String(fallbackQuote || '').trim()) ? String(fallbackQuote) : rawQuote;
            const nextContent = (!rawContent.trim() && String(fallbackContent || '').trim()) ? String(fallbackContent) : rawContent;
            return {
                ...item,
                type: 'quote',
                quote: nextQuote,
                content: nextContent
            };
        }
        if (t === 'voice') {
            const rawContent = typeof item.content === 'string' ? item.content : '';
            const fallback = item.text ?? item.transcription ?? '';
            const nextContent = (!rawContent.trim() && String(fallback || '').trim()) ? String(fallback) : rawContent;
            return {
                ...item,
                type: 'voice',
                content: nextContent
            };
        }
        return item;
    });
}

function resolveStickerNameToUrl(name) {
    if (!name || /^https?:\/\//i.test(name)) return name;
    
    // 优先匹配全局 STICKER_MAP (文字转 emoji)
    if (STICKER_MAP[name]) return STICKER_MAP[name];

    // 在所有已连接的表情包库中搜索
    const libs = State.stickerLibraries || [];
    for (const lib of libs) {
        const items = lib.items || [];
        for (const it of items) {
            if (getStickerText(it) === name) {
                const url = getStickerUrl(it);
                return url || getStickerText(it) || name;
            }
        }
    }
    return name;
}

function deriveStickerNameFromUrl(url) {
    try {
        const cleanUrl = url.split('#')[0].split('?')[0];
        const seg = cleanUrl.split('/').filter(Boolean).pop() || '表情';
        const name = seg.replace(/\.(png|jpg|jpeg|gif|webp|bmp|svg)$/i, '');
        return name || '表情';
    } catch (e) {
        return '表情';
    }
}

function parseStickerImportText(text) {
    const lines = (text || '').split(/\r?\n/);
    const items = [];
    lines.forEach((raw) => {
        const line = (raw || '').trim();
        if (!line) return;
        if (line.startsWith('#') || line.startsWith('//')) return;

        const sepIndex = line.includes('：') ? line.indexOf('：') : line.indexOf(':');
        if (sepIndex > 0) {
            const name = line.slice(0, sepIndex).trim();
            const url = line.slice(sepIndex + 1).trim();
            if (url && /^https?:\/\//i.test(url)) {
                items.push({ name: name || deriveStickerNameFromUrl(url), url });
            }
            return;
        }

        const m = line.match(/^(.+?)\s+(https?:\/\/\S+)$/i);
        if (m) {
            const name = (m[1] || '').trim();
            const url = (m[2] || '').trim();
            if (url) items.push({ name: name || deriveStickerNameFromUrl(url), url });
            return;
        }

        if (/^https?:\/\//i.test(line)) {
            items.push({ name: deriveStickerNameFromUrl(line), url: line });
            return;
        }

        items.push(line);
    });
    return items;
}

function getMomentActorProfile(actor) {
    if (!actor || actor.type === 'user') {
        return {
            type: 'user',
            id: 'me',
            nickname: State.user?.nickname || '我',
            avatar: State.user?.avatar || ''
        };
    }
    if (actor.type === 'contact') {
        const c = (State.contacts || []).find(x => x && x.id === actor.id);
        if (c) {
            return {
                type: 'contact',
                id: c.id,
                nickname: c.name || '角色',
                avatar: c.avatar || ''
            };
        }
        return { type: 'contact', id: actor.id, nickname: '角色', avatar: '' };
    }
    return { type: 'user', id: 'me', nickname: State.user?.nickname || '我', avatar: State.user?.avatar || '' };
}

function formatMomentTime(ts) {
    const d = new Date(ts || Date.now());
    const now = new Date();
    const sameDay = d.getFullYear() === now.getFullYear()
        && d.getMonth() === now.getMonth()
        && d.getDate() === now.getDate();
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    if (sameDay) return `${hh}:${mm}`;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day} ${hh}:${mm}`;
}

function normalizeMomentsData(moments) {
    const list = Array.isArray(moments) ? moments : [];
    const cleaned = [];
    list.forEach((m) => {
        if (!m || typeof m !== 'object') return;
        const id = String(m.id || '');
        if (!id) return;
        const createdAt = typeof m.createdAt === 'number' ? m.createdAt : Date.parse(m.createdAt || '') || Date.now();
        const text = String(m.text || m.content || '').trim();
        const likes = Array.isArray(m.likes) ? m.likes : [];
        const comments = Array.isArray(m.comments) ? m.comments : [];
        const author = m.author && typeof m.author === 'object' ? m.author : { type: 'user', id: 'me' };
        cleaned.push({
            ...m,
            id,
            createdAt,
            text,
            author,
            likes: likes.filter(x => x && typeof x === 'object'),
            comments: comments.filter(x => x && typeof x === 'object')
        });
    });
    cleaned.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    return cleaned;
}

function closeMomentsComposeModal() {
    document.getElementById('moments-compose-page')?.classList.remove('active');
}

function openMomentsComposeModal() {
    const page = document.getElementById('moments-compose-page');
    const textEl = document.getElementById('moments-compose-text');
    const aiToggle = document.getElementById('moments-compose-ai-toggle');
    const aiRolesCell = document.getElementById('moments-compose-ai-roles-cell');
    const aiRolesValue = document.getElementById('moments-compose-ai-roles-value');
    const cancelBtn = document.getElementById('moments-compose-cancel');
    const postBtn = document.getElementById('moments-compose-post');
    const imagesContainer = document.getElementById('moments-compose-images');
    const imageAddBtn = document.getElementById('moments-compose-image-add');
    const imageUpload = document.getElementById('moments-compose-image-upload');
    const locationInput = document.getElementById('moments-compose-location-input');

    if (!page || !textEl || !cancelBtn || !postBtn) return;

    textEl.value = '';
    if (locationInput) locationInput.value = '';
    if (imageUpload) imageUpload.value = '';
    
    if (!Array.isArray(openMomentsComposeModal._selectedActors)) openMomentsComposeModal._selectedActors = [];
    if (typeof openMomentsComposeModal._aiEnabled !== 'boolean') openMomentsComposeModal._aiEnabled = true;
    openMomentsComposeModal._images = [];
    
    if (aiToggle) aiToggle.classList.toggle('active', !!openMomentsComposeModal._aiEnabled);

    const refreshImages = () => {
        if (!imagesContainer) return;
        // remove existing image wrappers
        const wrappers = imagesContainer.querySelectorAll('.moments-compose-image-wrapper');
        wrappers.forEach(w => w.remove());
        
        openMomentsComposeModal._images.forEach((imgSrc, idx) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'moments-compose-image-wrapper';
            wrapper.style.cssText = 'width: 100%; aspect-ratio: 1; height: auto; border-radius: 4px; position: relative; overflow: hidden; background: #f0f0f0;';
            wrapper.innerHTML = `
                <img src="${escapeHtml(imgSrc)}" alt="image" style="width: 100%; height: 100%; object-fit: cover;">
                <div class="moments-compose-image-delete" data-index="${idx}" style="position: absolute; top: 4px; right: 4px; background: rgba(0, 0, 0, 0.5); color: white; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer;"><i class="fas fa-times"></i></div>
            `;
            const delBtn = wrapper.querySelector('.moments-compose-image-delete');
            delBtn.onclick = (e) => {
                e.stopPropagation();
                openMomentsComposeModal._images.splice(idx, 1);
                refreshImages();
            };
            imagesContainer.insertBefore(wrapper, imageAddBtn);
        });

        if (imageAddBtn) {
            imageAddBtn.style.display = openMomentsComposeModal._images.length >= 9 ? 'none' : 'flex';
        }
    };
    refreshImages();

    if (imageAddBtn) {
        imageAddBtn.onclick = async () => {
            if (openMomentsComposeModal._images.length >= 9) return;
            
            const res = await new Promise((resolve) => {
                const modal = document.getElementById('moments-image-action-sheet');
                const overlay = document.getElementById('moments-image-action-overlay');
                const localBtn = document.getElementById('action-moments-image-local');
                const urlBtn = document.getElementById('action-moments-image-url');
                const cancelBtn = document.getElementById('action-moments-image-cancel');
                
                if (!modal) { resolve(null); return; }
                
                const cleanup = () => {
                    modal.classList.remove('show');
                    localBtn.onclick = null;
                    urlBtn.onclick = null;
                    cancelBtn.onclick = null;
                    overlay.onclick = null;
                };
                
                cancelBtn.onclick = () => { cleanup(); resolve(null); };
                overlay.onclick = () => { cleanup(); resolve(null); };
                
                localBtn.onclick = () => { cleanup(); resolve('local'); };
                urlBtn.onclick = () => { cleanup(); resolve('url'); };
                
                modal.classList.add('show');
            });
            
            if (res === 'local' && imageUpload) {
                imageUpload.click();
            } else if (res === 'url') {
                const url = await WeChatUI.showPrompt('输入图片URL', '支持 http(s):// 或 base64');
                if (url) {
                    openMomentsComposeModal._images.push(url.trim());
                    refreshImages();
                }
            }
        };
    }

    if (imageUpload) {
        imageUpload.onchange = (e) => {
            const files = Array.from(e.target.files);
            if (!files.length) return;
            let loadedCount = 0;
            const maxAdd = 9 - openMomentsComposeModal._images.length;
            const toProcess = files.slice(0, maxAdd);
            
            toProcess.forEach(file => {
                const reader = new FileReader();
                reader.onload = (evt) => {
                    openMomentsComposeModal._images.push(evt.target.result);
                    loadedCount++;
                    if (loadedCount === toProcess.length) {
                        refreshImages();
                    }
                };
                reader.readAsDataURL(file);
            });
            imageUpload.value = '';
        };
    }

    const refreshAiRolesValue = () => {
        const actors = Array.isArray(openMomentsComposeModal._selectedActors) ? openMomentsComposeModal._selectedActors : [];
        const names = actors.map((a) => getMomentActorProfile(a).nickname).filter(Boolean);
        if (aiRolesValue) aiRolesValue.textContent = names.length ? `${names.length} 个：${names.join('、').slice(0, 24)}${names.join('、').length > 24 ? '…' : ''}` : '未选择';
        if (aiRolesCell) aiRolesCell.style.display = (aiToggle && aiToggle.classList.contains('active')) ? 'flex' : 'none';
    };
    refreshAiRolesValue();

    const cleanup = () => {
        cancelBtn.onclick = null;
        postBtn.onclick = null;
        if (aiToggle) aiToggle.onclick = null;
        if (aiRolesCell) aiRolesCell.onclick = null;
    };

    cancelBtn.onclick = () => {
        cleanup();
        closeMomentsComposeModal();
    };

    if (aiToggle) {
        aiToggle.onclick = () => {
            aiToggle.classList.toggle('active');
            openMomentsComposeModal._aiEnabled = aiToggle.classList.contains('active');
            refreshAiRolesValue();
        };
    }

    if (aiRolesCell) {
        aiRolesCell.onclick = async () => {
            const selected = await pickMomentsActorsMulti('选择要自动互动的角色', openMomentsComposeModal._selectedActors);
            if (selected == null) return;
            openMomentsComposeModal._selectedActors = selected;
            refreshAiRolesValue();
        };
    }

    postBtn.onclick = () => {
        const text = String(textEl.value || '').trim();
        const images = [...openMomentsComposeModal._images];
        const location = locationInput ? String(locationInput.value || '').trim() : '';

        if (!text && images.length === 0) {
            showToast('写点内容或发张图片呀');
            return;
        }
        State.moments = normalizeMomentsData(State.moments);
        const momentId = `moment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        State.moments.unshift({
            id: momentId,
            author: { type: 'user', id: 'me' },
            text,
            images,
            location,
            createdAt: Date.now(),
            likes: [],
            comments: []
        });
        if (State.moments.length > 300) State.moments.length = 300;
        Storage.saveMoments(State.moments);
        const shouldAuto = !!(aiToggle && aiToggle.classList.contains('active'));
        const selectedActors = Array.isArray(openMomentsComposeModal._selectedActors) ? openMomentsComposeModal._selectedActors : [];
        cleanup();
        closeMomentsComposeModal();
        initMomentsPage();
        showToast('已发表');
        if (shouldAuto) {
            if (selectedActors.length === 0) {
                pickMomentsActorsMulti('选择要自动互动的角色', []).then((picked) => {
                    if (!picked || picked.length === 0) return;
                    runMomentAutoInteractions(momentId, picked);
                });
            } else {
                runMomentAutoInteractions(momentId, selectedActors);
            }
        }
    };

    page.classList.add('active');
    setTimeout(() => textEl.focus(), 80);
}

function pickMomentsActorsMulti(title = '选择多个角色', defaultSelected = []) {
    return new Promise((resolve) => {
        const modal = document.getElementById('moments-actors-modal');
        const overlay = document.getElementById('moments-actors-overlay');
        const titleEl = document.getElementById('moments-actors-title');
        const listEl = document.getElementById('moments-actors-list');
        const cancelBtn = document.getElementById('moments-actors-cancel');
        const confirmBtn = document.getElementById('moments-actors-confirm');
        const selectAllBtn = document.getElementById('moments-actors-select-all');
        const selectNoneBtn = document.getElementById('moments-actors-select-none');
        if (!modal || !listEl || !cancelBtn || !confirmBtn) {
            resolve(null);
            return;
        }

        if (titleEl) titleEl.textContent = title;
        listEl.innerHTML = '';

        const candidates = [
            ...(State.contacts || []).filter(Boolean).map(c => ({ type: 'contact', id: c.id }))
        ];

        const keyOf = (a) => `${a?.type || ''}:${a?.id || ''}`;
        const selected = new Set((Array.isArray(defaultSelected) ? defaultSelected : []).map(keyOf));

        const cleanup = () => {
            cancelBtn.onclick = null;
            confirmBtn.onclick = null;
            if (selectAllBtn) selectAllBtn.onclick = null;
            if (selectNoneBtn) selectNoneBtn.onclick = null;
            if (overlay) overlay.onclick = null;
            modal.classList.remove('show');
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve(null);
        };
        if (overlay) {
            overlay.onclick = () => {
                cleanup();
                resolve(null);
            };
        }

        confirmBtn.onclick = () => {
            const picked = candidates.filter(a => selected.has(keyOf(a)));
            cleanup();
            resolve(picked);
        };
        
        const updateCheckboxes = () => {
            const checkboxes = listEl.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach((cb, idx) => {
                const actor = candidates[idx];
                cb.checked = selected.has(keyOf(actor));
            });
        };

        if (selectAllBtn) {
            selectAllBtn.onclick = () => {
                candidates.forEach(a => selected.add(keyOf(a)));
                updateCheckboxes();
            };
        }

        if (selectNoneBtn) {
            selectNoneBtn.onclick = () => {
                selected.clear();
                updateCheckboxes();
            };
        }

        candidates.forEach((actor) => {
            const p = getMomentActorProfile(actor);
            const row = document.createElement('div');
            row.className = 'moments-actors-item';
            const checked = selected.has(keyOf(actor)) ? 'checked' : '';
            row.innerHTML = `
                <input type="checkbox" ${checked}>
                <div class="moment-avatar" style="width:36px;height:36px;border-radius:6px;">${getAvatarHtml(p.avatar)}</div>
                <div class="name">${escapeHtml(p.nickname)}</div>
                <div class="sub">${p.type === 'user' ? '我' : '角色'}</div>
            `;
            const checkbox = row.querySelector('input[type="checkbox"]');
            row.addEventListener('click', (e) => {
                if (e.target === checkbox) return;
                checkbox.checked = !checkbox.checked;
                const k = keyOf(actor);
                if (checkbox.checked) selected.add(k);
                else selected.delete(k);
            });
            checkbox.addEventListener('change', () => {
                const k = keyOf(actor);
                if (checkbox.checked) selected.add(k);
                else selected.delete(k);
            });
            listEl.appendChild(row);
        });

        modal.classList.add('show');
    });
}

function extractReplyTextFromApiData(data) {
    const candidates = [
        data?.choices?.[0]?.message?.content,
        data?.choices?.[0]?.text,
        data?.message?.content,
        data?.output_text,
        data?.result
    ];
    for (const c of candidates) {
        if (typeof c === 'string' && c.trim()) return c.trim();
    }
    return '';
}

function parseJsonObjectFromText(text) {
    const cleaned = String(text || '').trim().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    try {
        const obj = JSON.parse(cleaned);
        if (obj && typeof obj === 'object') return obj;
    } catch (e) {
    }
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) return null;
    try {
        const obj = JSON.parse(m[0]);
        if (obj && typeof obj === 'object') return obj;
    } catch (e) {
    }
    return null;
}

async function generateMomentInteraction(contact, moment) {
    const currentApiConfig = State.apiConfigs.find(c => c.id === State.currentApiId);
    const useProxy = !!currentApiConfig?.useProxy;
    const targetUrl = useProxy ? (currentApiConfig?.proxyUrl || '').trim() : normalizeChatCompletionsUrl(currentApiConfig?.apiUrl || '');
    const apiKey = (currentApiConfig?.apiKey || '').trim();
    if (!currentApiConfig || !targetUrl || (!useProxy && !apiKey)) {
        throw new Error('API未配置完整');
    }

    const userNick = State.user?.nickname || '我';
    const systemPrompt = [
        '你正在扮演微信里的一个联系人，正在浏览朋友圈。',
        `角色名：${contact?.name || '角色'}`,
        `人设：${String(contact?.persona || '').trim() || '（未填写）'}`,
        `说话风格：${String(contact?.style || '').trim() || '（未填写）'}`,
        '',
        `你看到用户「${userNick}」发布了一条动态。请像真实朋友圈一样，决定是否点赞，以及是否发表评论。`,
        '要求：',
        '- 输出严格 JSON（不要带多余文字，不要 Markdown）。',
        '- JSON 格式：{"like":true/false,"comment":string|null}',
        '- comment 可以为空字符串或 null，表示不评论。',
        '- 评论要符合人设与说话风格，口语、简短，1句为主，最多2句。',
        '- 不要出现“作为AI/模型/系统/提示词”等字眼。'
    ].join('\n');

    const userPrompt = [
        '动态内容：',
        String(moment?.text || '').trim()
    ].join('\n');

    const headers = { 'Content-Type': 'application/json' };
    if (!useProxy) headers.Authorization = `Bearer ${apiKey}`;
    const modelToUse = (currentApiConfig.model || '').trim()
        || (Array.isArray(currentApiConfig.models) ? (currentApiConfig.models[0] || '').trim() : '')
        || 'gpt-3.5-turbo';

    const response = await fetch(targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: modelToUse,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });

    if (!response.ok) {
        let errMsg = `HTTP ${response.status}`;
        try {
            const errData = await response.json();
            errMsg = errData?.error?.message || errData?.error || errMsg;
        } catch (e) {
        }
        throw new Error(errMsg);
    }

    const data = await response.json();
    const raw = extractReplyTextFromApiData(data);
    const obj = parseJsonObjectFromText(raw);
    const like = !!obj?.like;
    const comment = (typeof obj?.comment === 'string' ? obj.comment : (obj?.comment == null ? '' : String(obj?.comment || ''))).trim();
    return { like, comment };
}

function applyMomentInteraction(moment, actor, interaction) {
    const p = getMomentActorProfile(actor);
    moment.likes = Array.isArray(moment.likes) ? moment.likes : [];
    moment.comments = Array.isArray(moment.comments) ? moment.comments : [];
    if (interaction?.like) {
        const exists = moment.likes.some(l => l && l.byType === p.type && l.byId === p.id);
        if (!exists) moment.likes.push({ byType: p.type, byId: p.id, at: Date.now() });
    }
    const comment = String(interaction?.comment || '').trim();
    if (comment) {
        moment.comments.push({
            id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            byType: p.type,
            byId: p.id,
            text: comment,
            at: Date.now()
        });
    }
}

async function runMomentAutoInteractions(momentId, actors) {
    const picked = Array.isArray(actors) ? actors.filter(Boolean) : [];
    if (picked.length === 0) return;

    State.moments = normalizeMomentsData(State.moments);
    const moment = State.moments.find(m => m && m.id === momentId);
    if (!moment) return;

    const contactActors = picked.filter(a => a && a.type === 'contact');
    if (contactActors.length === 0) {
        showToast('请选择至少一个角色');
        return;
    }

    showLoading('生成互动中...');
    try {
        for (let i = 0; i < contactActors.length; i++) {
            const actor = contactActors[i];
            const contact = (State.contacts || []).find(c => c && c.id === actor.id);
            if (!contact) continue;
            showLoading(`生成互动中... ${i + 1}/${contactActors.length}`);
            try {
                const interaction = await generateMomentInteraction(contact, moment);
                applyMomentInteraction(moment, actor, interaction);
                await new Promise(r => setTimeout(r, 200 + Math.random() * 220));
            } catch (e) {
            }
        }

        Storage.saveMoments(State.moments);
        initMomentsPage();
        showToast('互动已生成');
    } catch (e) {
        showToast('生成失败：请检查 API 设置');
    } finally {
        hideLoading();
    }
}

function ensureMomentsProfileBindings() {
    const avatarEl = document.getElementById('moments-avatar');
    const coverEl = document.getElementById('moments-cover');
    const avatarUpload = document.getElementById('moments-avatar-upload');
    const coverUpload = document.getElementById('moments-cover-upload');

    const setUserAvatar = (val) => {
        State.user.avatar = String(val || '').trim();
        Storage.saveUser(State.user);
        initUserUI();
    };

    const setUserCover = (val) => {
        State.user.momentsCover = String(val || '').trim();
        Storage.saveUser(State.user);
        initUserUI();
    };

    if (avatarUpload && !avatarUpload.dataset.bound) {
        avatarUpload.dataset.bound = '1';
        avatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;
                setUserAvatar(base64);
                avatarUpload.value = '';
                showToast('头像已更新');
            };
            reader.readAsDataURL(file);
        });
    }

    if (coverUpload && !coverUpload.dataset.bound) {
        coverUpload.dataset.bound = '1';
        coverUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const base64 = ev.target.result;
                setUserCover(base64);
                coverUpload.value = '';
                showToast('封面已更新');
            };
            reader.readAsDataURL(file);
        });
    }

    if (avatarEl && !avatarEl.dataset.bound) {
        avatarEl.dataset.bound = '1';
        avatarEl.addEventListener('click', async (e) => {
            e.stopPropagation();
            const ok = await WeChatUI.showConfirm('朋友圈头像', '要改头像吗？可以上传本地图片，或者输入图片URL。', '上传本地', '下一步');
            if (ok) {
                avatarUpload?.click();
                return;
            }
            const okUrl = await WeChatUI.showConfirm('头像来源', '要输入图片URL吗？', '输入URL', '取消');
            if (!okUrl) return;
            const url = await WeChatUI.showPrompt('头像URL', '输入图片URL（图床链接）', String(State.user?.avatar || ''));
            if (url == null) return;
            if (url.trim()) setUserAvatar(url.trim());
        });
    }

    if (coverEl && !coverEl.dataset.bound) {
        coverEl.dataset.bound = '1';
        coverEl.addEventListener('click', async () => {
            const ok = await WeChatUI.showConfirm('朋友圈封面', '要改封面吗？可以上传本地图片，或者输入图片URL。', '上传本地', '下一步');
            if (ok) {
                coverUpload?.click();
                return;
            }
            const okUrl = await WeChatUI.showConfirm('封面来源', '要输入图片URL吗？', '输入URL', '取消');
            if (!okUrl) return;
            const url = await WeChatUI.showPrompt('封面URL', '输入图片URL（图床链接）', String(State.user?.momentsCover || ''));
            if (url == null) return;
            setUserCover(url.trim());
        });
    }
}

function pickMomentsActor(title = '选择角色') {
    return new Promise((resolve) => {
        const modal = document.getElementById('moments-actor-modal');
        const overlay = document.getElementById('moments-actor-overlay');
        const titleEl = document.getElementById('moments-actor-title');
        const listEl = document.getElementById('moments-actor-list');
        const cancelBtn = document.getElementById('moments-actor-cancel');
        if (!modal || !listEl || !cancelBtn) {
            resolve(null);
            return;
        }

        if (titleEl) titleEl.textContent = title;
        listEl.innerHTML = '';

        const candidates = [
            ...(State.contacts || []).filter(Boolean).map(c => ({ type: 'contact', id: c.id }))
        ];

        const cleanup = () => {
            cancelBtn.onclick = null;
            if (overlay) overlay.onclick = null;
            modal.classList.remove('show');
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve(null);
        };
        if (overlay) {
            overlay.onclick = () => {
                cleanup();
                resolve(null);
            };
        }

        candidates.forEach((actor) => {
            const p = getMomentActorProfile(actor);
            const row = document.createElement('div');
            row.className = 'moments-actor-item';
            row.innerHTML = `
                <div class="moment-avatar" style="width:36px;height:36px;border-radius:6px;">${getAvatarHtml(p.avatar)}</div>
                <div class="name">${escapeHtml(p.nickname)}</div>
                <div class="sub">${p.type === 'user' ? '我' : '角色'}</div>
            `;
            row.addEventListener('click', () => {
                cleanup();
                resolve({ type: p.type, id: p.id });
            });
            listEl.appendChild(row);
        });

        modal.classList.add('show');
    });
}

function toggleMomentLike(momentId, actor) {
    State.moments = normalizeMomentsData(State.moments);
    const idx = State.moments.findIndex(m => m && m.id === momentId);
    if (idx < 0) return;
    const p = getMomentActorProfile(actor);
    const moment = State.moments[idx];
    moment.likes = Array.isArray(moment.likes) ? moment.likes : [];
    const likeIndex = moment.likes.findIndex(l => l && l.byType === p.type && l.byId === p.id);
    if (likeIndex >= 0) {
        moment.likes.splice(likeIndex, 1);
    } else {
        moment.likes.push({ byType: p.type, byId: p.id, at: Date.now() });
    }
    Storage.saveMoments(State.moments);
    refreshMomentsViews();
}

function addMomentCommentEx(momentId, actor, text, meta = {}) {
    const content = String(text || '').trim();
    if (!content) return;
    State.moments = normalizeMomentsData(State.moments);
    const idx = State.moments.findIndex(m => m && m.id === momentId);
    if (idx < 0) return;
    const p = getMomentActorProfile(actor);
    const moment = State.moments[idx];
    moment.comments = Array.isArray(moment.comments) ? moment.comments : [];
    moment.comments.push({
        id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        byType: p.type,
        byId: p.id,
        text: content,
        at: Date.now(),
        replyToCommentId: meta && typeof meta.replyToCommentId === 'string' ? meta.replyToCommentId : '',
        replyToName: meta && typeof meta.replyToName === 'string' ? meta.replyToName : ''
    });
    Storage.saveMoments(State.moments);
    refreshMomentsViews();
}

function addMomentComment(momentId, actor, text) {
    addMomentCommentEx(momentId, actor, text);
}

function refreshMomentsViews() {
    initMomentsPage();
    const openId = String(renderContactMomentsPage?._contactId || '').trim();
    if (openId) {
        renderContactMomentsPage(openId);
    }
    if (State.currentContactId) {
        const contact = State.contacts.find(c => c && c.id === State.currentContactId);
        if (contact) hydrateChatMorePage(contact);
    }
}

async function deleteMoment(momentId) {
    const ok = await WeChatUI.showConfirm('删除动态', '确定删除这条朋友圈吗？', '删除', '取消', true);
    if (!ok) return;
    State.moments = normalizeMomentsData(State.moments).filter(m => m && m.id !== momentId);
    Storage.saveMoments(State.moments);
    refreshMomentsViews();
    showToast('已删除');
}

function initMomentsPage() {
    const list = document.getElementById('moments-list');
    if (!list) return;

    State.moments = normalizeMomentsData(State.moments);
    ensureMomentsProfileBindings();

    const newBtn = document.getElementById('moments-new-btn');
    if (newBtn) newBtn.onclick = openMomentsComposeModal;

    list.innerHTML = '';

    const feed = State.moments.filter(m => m?.author?.type === 'user');
    if (feed.length === 0) {
        list.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #888;">
                暂无动态
                <div style="margin-top: 12px;">
                    <button class="btn-primary" style="width:auto; padding:10px 14px;" id="moments-empty-post-btn">发一条</button>
                </div>
            </div>
        `;
        const emptyBtn = document.getElementById('moments-empty-post-btn');
        if (emptyBtn) emptyBtn.onclick = openMomentsComposeModal;
        return;
    }

    feed.forEach((m) => {
        const authorProfile = getMomentActorProfile(m.author);
        const likes = Array.isArray(m.likes) ? m.likes : [];
        const comments = Array.isArray(m.comments) ? m.comments : [];
        const likeNames = likes.map((l) => {
            const p = getMomentActorProfile({ type: l.byType, id: l.byId });
            return p.nickname;
        }).filter(Boolean);

        const metaParts = [];
        if (likeNames.length) {
            metaParts.push(`
                <div class="moment-meta-likes">
                    <i class="fas fa-heart"></i>
                    <div>${escapeHtml(likeNames.join('、'))}</div>
                </div>
            `);
        }
        if (comments.length) {
            const commentHtml = comments.map((c) => {
                const p = getMomentActorProfile({ type: c.byType, id: c.byId });
                const replyToName = String(c?.replyToName || '').trim();
                const replyPart = replyToName ? `<span> 回复 </span><span class="moment-comment-name">${escapeHtml(replyToName)}</span>` : '';
                return `
                    <div class="moment-comment-line">
                        <span class="moment-comment-name">${escapeHtml(p.nickname)}</span>${replyPart}<span>：</span><span>${escapeHtml(c.text || '')}</span>
                    </div>
                `;
            }).join('');
            metaParts.push(`<div class="moment-meta-comments">${commentHtml}</div>`);
        }

        const showMeta = metaParts.length > 0;
        
        let imagesHtml = '';
        if (Array.isArray(m.images) && m.images.length > 0) {
            const count = m.images.length;
            const countClass = count >= 9 ? 'count-9' : `count-${count}`;
            const items = m.images.map((img, idx) => `
                <div class="moment-image-wrapper">
                    <img src="${escapeHtml(img)}" alt="image" data-preview-idx="${idx}">
                </div>
            `).join('');
            imagesHtml = `<div class="moment-images ${countClass}">${items}</div>`;
        }

        let locationHtml = '';
        if (m.location) {
            locationHtml = `<div class="moment-location">${escapeHtml(m.location)}</div>`;
        }

        const hasLiked = likes.some(l => l.byType === 'user' && l.byId === 'me');
        const likeText = hasLiked ? '取消' : '赞';
        const likeClass = hasLiked ? ' liked' : '';

        const div = document.createElement('div');
        div.className = 'moment-item';
        div.innerHTML = `
            <div class="moment-avatar">${getAvatarHtml(authorProfile.avatar)}</div>
            <div class="moment-body">
                <div class="moment-author">${escapeHtml(authorProfile.nickname)}</div>
                <div class="moment-text">${escapeHtml(m.text || '')}</div>
                ${imagesHtml}
                ${locationHtml}
                <div class="moment-footer">
                    <span>${escapeHtml(formatMomentTime(m.createdAt))}</span>
                    <span class="spacer"></span>
                    ${authorProfile.type === 'user' ? `<button class="moment-link-btn" data-action="delete">删除</button>` : ''}
                    <div class="moment-action-wrap">
                        <div class="moment-action-menu">
                            <button class="moment-action-menu-btn${likeClass}" data-action="like">
                                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>${likeText}
                            </button>
                            <button class="moment-action-menu-btn" data-action="comment">
                                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>评论
                            </button>
                            <button class="moment-action-menu-btn" data-action="ai">
                                <svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a3 3 0 0 1 3 3v2h2v4h-2v2a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-2H4v-4h2V10a3 3 0 0 1 3-3h1V5.73A2 2 0 1 1 12 2z"/></svg>AI
                            </button>
                        </div>
                        <button class="moment-action-toggle">
                            <span class="dots">..</span>
                        </button>
                    </div>
                </div>
                ${showMeta ? `<div class="moment-meta-box">${metaParts.join('')}</div>` : ''}
            </div>
        `;

        if (Array.isArray(m.images)) {
            const imgEls = div.querySelectorAll('.moment-image-wrapper img');
            imgEls.forEach(imgEl => {
                imgEl.addEventListener('click', () => {
                    const idx = parseInt(imgEl.getAttribute('data-preview-idx') || '0', 10);
                    showImagePreview(m.images[idx]);
                });
            });
        }

        const toggleBtn = div.querySelector('.moment-action-toggle');
        const actionMenu = div.querySelector('.moment-action-menu');
        if (toggleBtn && actionMenu) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShowing = actionMenu.classList.contains('show');
                document.querySelectorAll('.moment-action-menu.show').forEach(el => el.classList.remove('show'));
                if (!isShowing) actionMenu.classList.add('show');
            });
        }

        div.querySelector('[data-action="like"]')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            actionMenu?.classList.remove('show');
            const actor = await pickMomentsActor('谁来点赞？');
            if (!actor) return;
            toggleMomentLike(m.id, actor);
        });

        div.querySelector('[data-action="comment"]')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            actionMenu?.classList.remove('show');
            const actor = await pickMomentsActor('谁来评论？');
            if (!actor) return;
            const text = await WeChatUI.showPrompt('评论', '输入评论内容', '');
            if (text == null) return;
            addMomentComment(m.id, actor, text);
        });

        div.querySelector('[data-action="delete"]')?.addEventListener('click', () => deleteMoment(m.id));

        div.querySelector('[data-action="ai"]')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            actionMenu?.classList.remove('show');
            const selected = await pickMomentsActorsMulti('选择要自动互动的角色', []);
            if (!selected || selected.length === 0) return;
            runMomentAutoInteractions(m.id, selected);
        });

        list.appendChild(div);
    });
}

function getContactMoments(contactId) {
    const id = String(contactId || '').trim();
    if (!id) return [];
    State.moments = normalizeMomentsData(State.moments);
    return State.moments.filter(m => m?.author?.type === 'contact' && String(m.author.id || '') === id);
}

function resolveMomentsSubApiRuntime() {
    const cfg = State.momentsSubApiConfig || Storage.getMomentsSubApiConfig();
    State.momentsSubApiConfig = cfg;
    const base = cfg.useMainApi ? getMainApiConfigBySharedId(cfg.mainApiId) : {
        useProxy: !!cfg.useProxy,
        proxyUrl: cfg.proxyUrl || '',
        apiUrl: cfg.apiUrl || '',
        apiKey: cfg.apiKey || '',
        model: cfg.model || '',
        models: []
    };
    return base ? resolveChatApiRuntimeFromConfigLike(base, cfg.model) : null;
}

function buildSeedCommentFromText(text) {
    const t = String(text || '').trim();
    const poolCommon = ['哈哈哈', '好会', '不错诶', '有点羡慕', '太会生活了', '太真实了', '笑死', '有点可爱', 'get', '安排'];
    const poolFood = ['看饿了', '这家看起来好好吃', '下次带我', '求店名', '这个我也爱'];
    const poolMovie = ['想看', '这个好看吗', '我也刚看完', '求推荐', '一起去'];
    const poolTravel = ['风景真好', '好想去', '太治愈了', '拍得好看', '玩的开心'];
    const poolWork = ['辛苦啦', '加油', '太拼了', '稳稳的', '抱抱'];
    const hit = (kw) => t.includes(kw);
    let pool = poolCommon;
    if (hit('吃') || hit('饭') || hit('火锅') || hit('奶茶') || hit('咖啡') || hit('蛋糕') || hit('烧烤')) pool = poolFood;
    else if (hit('电影') || hit('剧') || hit('追') || hit('好看')) pool = poolMovie;
    else if (hit('旅行') || hit('出发') || hit('到') || hit('景') || hit('海') || hit('山')) pool = poolTravel;
    else if (hit('上班') || hit('加班') || hit('开会') || hit('项目') || hit('忙')) pool = poolWork;
    const pick = pool[Math.floor(Math.random() * pool.length)] || '点赞';
    const suffix = Math.random() < 0.35 ? '～' : (Math.random() < 0.25 ? '！' : '');
    return `${pick}${suffix}`;
}

function seedMomentSocialForContactAuthor(authorId, moment) {
    const author = String(authorId || '').trim();
    if (!author || !moment) return;
    const candidates = (State.contacts || []).filter(c => c && String(c.id || '') !== author);
    const likeMax = Math.min(8, candidates.length);
    const likeMin = Math.min(3, likeMax);
    const likeCount = likeMax > 0 ? (likeMin + Math.floor(Math.random() * (likeMax - likeMin + 1))) : 0;

    const shuffled = candidates.slice().sort(() => Math.random() - 0.5);
    moment.likes = Array.isArray(moment.likes) ? moment.likes : [];
    moment.comments = Array.isArray(moment.comments) ? moment.comments : [];

    shuffled.slice(0, likeCount).forEach((c) => {
        moment.likes.push({ byType: 'contact', byId: c.id, at: Date.now() - Math.floor(Math.random() * 35 * 60 * 1000) });
    });

    const commentMax = Math.min(3, candidates.length);
    const commentCount = commentMax > 0 ? (1 + Math.floor(Math.random() * commentMax)) : 0;
    shuffled.slice(likeCount, likeCount + commentCount).forEach((c) => {
        if (Math.random() < 0.25) return;
        moment.comments.push({
            id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            byType: 'contact',
            byId: c.id,
            text: buildSeedCommentFromText(moment.text),
            at: Date.now() - Math.floor(Math.random() * 35 * 60 * 1000)
        });
    });
}

function getRecentChatSnippetForMoments(contactId, maxLines = 12) {
    const id = String(contactId || '').trim();
    if (!id) return '';
    const history = Array.isArray(State.chatHistories?.[id]) ? State.chatHistories[id] : [];
    const lines = [];
    for (let i = Math.max(0, history.length - maxLines); i < history.length; i++) {
        const m = history[i];
        if (!m) continue;
        if (m.role === 'system' && String(m.content || '').startsWith('[系统归档记忆]')) continue;
        const role = m.role === 'assistant' ? '对方' : (m.role === 'user' ? '我' : String(m.role || ''));
        const text = String(toPlainTextFromStoredContent(m.content) || '').trim();
        if (!text) continue;
        lines.push(`${role}：${text}`.slice(0, 180));
    }
    return lines.join('\n').trim();
}

async function generateMomentPostForContact(contact) {
    const runtime = resolveMomentsSubApiRuntime();
    if (!runtime?.targetUrl || (!runtime.useProxy && !runtime.apiKey)) {
        throw new Error('朋友圈副API未配置完整');
    }
    const systemPrompt = [
        '你正在扮演微信里的一个联系人，准备发一条朋友圈动态。',
        `角色名：${contact?.name || '角色'}`,
        `人设：${String(contact?.persona || '').trim() || '（未填写）'}`,
        `说话风格：${String(contact?.style || '').trim() || '（未填写）'}`,
        '',
        '要求：',
        '- 输出严格 JSON（不要带多余文字，不要 Markdown）。',
        '- JSON 格式：{"text":string,"location":string|null}',
        '- text 是朋友圈正文，口语自然，1-4 行，每行尽量短，总长度不超过 120 字。',
        '- 可以适当用表情，但别堆。',
        '- location 可为空字符串或 null。',
        '- 不要出现“作为AI/模型/系统/提示词”等字眼。'
    ].join('\n');

    const recentChat = getRecentChatSnippetForMoments(contact?.id, 12);
    const mem = String(getLatestSummaryText(contact?.id) || '').trim();
    const memoryText = mem ? mem.slice(0, 400) : '';
    const userPrompt = [
        '参考信息（可能为空）：',
        memoryText ? `- 你对这个用户/关系的记忆摘录：\n${memoryText}` : '- 你对这个用户/关系的记忆摘录：无',
        recentChat ? `- 最近聊天片段：\n${recentChat}` : '- 最近聊天片段：无',
        '',
        '请基于以上信息，发一条自然的朋友圈动态。'
    ].join('\n');

    const headers = { 'Content-Type': 'application/json' };
    if (!runtime.useProxy) headers.Authorization = `Bearer ${runtime.apiKey}`;
    const response = await fetch(runtime.targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: runtime.model || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });
    if (!response.ok) {
        let errMsg = `HTTP ${response.status}`;
        try {
            const errData = await response.json();
            errMsg = errData?.error?.message || errData?.error || errMsg;
        } catch (e) {
        }
        throw new Error(errMsg);
    }
    const data = await response.json();
    const raw = extractReplyTextFromApiData(data);
    const obj = parseJsonObjectFromText(raw) || {};
    const text = String(obj.text || raw || '').trim();
    const location = (obj.location == null ? '' : String(obj.location || '')).trim();
    return { text: text.slice(0, 140), location: location.slice(0, 60) };
}

async function generateAndPostContactMoment(contactId) {
    const contact = (State.contacts || []).find(c => c && String(c.id || '') === String(contactId || ''));
    if (!contact) return;
    showLoading('生成朋友圈中...');
    try {
        const post = await generateMomentPostForContact(contact);
        const text = String(post?.text || '').trim();
        const location = String(post?.location || '').trim();
        if (!text) {
            showToast('生成失败：内容为空');
            return;
        }
        State.moments = normalizeMomentsData(State.moments);
        const momentId = `moment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        const moment = {
            id: momentId,
            author: { type: 'contact', id: contact.id },
            text,
            images: [],
            location,
            createdAt: Date.now(),
            likes: [],
            comments: []
        };
        seedMomentSocialForContactAuthor(contact.id, moment);
        State.moments.unshift(moment);
        if (State.moments.length > 300) State.moments.length = 300;
        Storage.saveMoments(State.moments);
        initMomentsPage();
        if (State.currentContactId && String(State.currentContactId) === String(contact.id)) {
            hydrateChatMorePage(contact);
        }
        if (renderContactMomentsPage._contactId && String(renderContactMomentsPage._contactId) === String(contact.id)) {
            renderContactMomentsPage(contact.id);
        }
        showToast('已发表');
    } catch (e) {
        showToast('生成失败：请检查API设置');
    } finally {
        hideLoading();
    }
}

function getMomentCommentDisplayName(comment) {
    const byType = comment?.byType || 'user';
    const byId = comment?.byId || 'me';
    const p = getMomentActorProfile({ type: byType, id: byId });
    return String(p?.nickname || '').trim() || '朋友';
}

function hasAuthorReplyForComment(moment, authorContactId, commentId) {
    const cid = String(commentId || '').trim();
    if (!cid) return false;
    const comments = Array.isArray(moment?.comments) ? moment.comments : [];
    return comments.some((c) => c && c.byType === 'contact' && String(c.byId || '') === String(authorContactId || '') && String(c.replyToCommentId || '') === cid);
}

async function generateMomentRepliesForComments(authorContact, moment, commentsToReply) {
    const runtime = resolveMomentsSubApiRuntime();
    if (!runtime?.targetUrl || (!runtime.useProxy && !runtime.apiKey)) {
        throw new Error('朋友圈副API未配置完整');
    }
    const items = Array.isArray(commentsToReply) ? commentsToReply.filter(Boolean) : [];
    if (items.length === 0) return [];

    const systemPrompt = [
        '你正在扮演微信里的一个联系人，正在回复自己朋友圈下的评论。',
        `角色名：${authorContact?.name || '角色'}`,
        `人设：${String(authorContact?.persona || '').trim() || '（未填写）'}`,
        `说话风格：${String(authorContact?.style || '').trim() || '（未填写）'}`,
        '',
        '要求：',
        '- 输出严格 JSON（不要带多余文字，不要 Markdown）。',
        '- 输出为 JSON 数组，数组项格式：{"commentId":string,"text":string}',
        '- text 要口语、自然、简短，1 句为主，最多 2 句；可适当用表情但别堆。',
        '- 只回复给定 commentId；不需要回复的可以不输出该项。',
        '- 不要出现“作为AI/模型/系统/提示词”等字眼。'
    ].join('\n');

    const commentLines = items.map((c) => {
        const name = getMomentCommentDisplayName(c);
        const text = String(c?.text || '').trim().replace(/\s+/g, ' ');
        return `- commentId=${String(c?.id || '')} | ${name}：${text}`.slice(0, 220);
    }).join('\n');

    const userPrompt = [
        '动态内容：',
        String(moment?.text || '').trim(),
        '',
        '评论列表：',
        commentLines
    ].join('\n');

    const headers = { 'Content-Type': 'application/json' };
    if (!runtime.useProxy) headers.Authorization = `Bearer ${runtime.apiKey}`;
    const response = await fetch(runtime.targetUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            model: runtime.model || 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        })
    });
    if (!response.ok) {
        let errMsg = `HTTP ${response.status}`;
        try {
            const errData = await response.json();
            errMsg = errData?.error?.message || errData?.error || errMsg;
        } catch (e) {
        }
        throw new Error(errMsg);
    }
    const data = await response.json();
    const raw = extractReplyTextFromApiData(data);
    const parsed = parseJsonObjectFromText(raw);
    const arr = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.replies) ? parsed.replies : []);
    return (Array.isArray(arr) ? arr : [])
        .map((x) => ({
            commentId: String(x?.commentId || '').trim(),
            text: String(x?.text || '').trim()
        }))
        .filter((x) => x.commentId && x.text);
}

async function runContactMomentsAutoReply(contactId) {
    const id = String(contactId || '').trim();
    if (!id) return;
    const contact = (State.contacts || []).find(c => c && String(c.id || '') === id);
    if (!contact) return;

    State.moments = normalizeMomentsData(State.moments);
    const moments = getContactMoments(id);
    if (moments.length === 0) {
        showToast('暂无动态');
        return;
    }

    const pendingByMoment = [];
    for (const m of moments) {
        const comments = Array.isArray(m?.comments) ? m.comments : [];
        const pending = comments
            .filter((c) => c && String(c.text || '').trim())
            .filter((c) => !(c.byType === 'contact' && String(c.byId || '') === id))
            .filter((c) => !hasAuthorReplyForComment(m, id, c.id))
            .sort((a, b) => (Number(a?.at || 0) - Number(b?.at || 0)));
        if (pending.length > 0) {
            pendingByMoment.push({ moment: m, pending });
        }
    }
    if (pendingByMoment.length === 0) {
        showToast('暂无需要回复的评论');
        return;
    }

    const addReply = (moment, targetComment, replyText) => {
        moment.comments = Array.isArray(moment.comments) ? moment.comments : [];
        moment.comments.push({
            id: `comment_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            byType: 'contact',
            byId: id,
            text: String(replyText || '').trim(),
            at: Date.now(),
            replyToCommentId: String(targetComment?.id || '').trim(),
            replyToName: getMomentCommentDisplayName(targetComment)
        });
    };

    showLoading('回复评论中...');
    try {
        let replied = 0;
        for (let i = 0; i < pendingByMoment.length; i++) {
            if (replied >= 6) break;
            const { moment, pending } = pendingByMoment[i];
            const slice = pending.slice(-3);
            showLoading(`回复评论中... ${Math.min(replied + 1, 6)}/6`);
            let replies = [];
            try {
                replies = await generateMomentRepliesForComments(contact, moment, slice);
            } catch (e) {
                replies = [];
            }
            replies.forEach((r) => {
                if (replied >= 6) return;
                const target = slice.find(c => String(c?.id || '') === String(r.commentId || ''));
                if (!target) return;
                if (hasAuthorReplyForComment(moment, id, target.id)) return;
                addReply(moment, target, r.text);
                replied++;
            });
        }
        Storage.saveMoments(State.moments);
        refreshMomentsViews();
        showToast('已回复');
    } catch (e) {
        showToast('回复失败：请检查API设置');
    } finally {
        hideLoading();
    }
}

function renderContactMomentsPage(contactId) {
    const id = String(contactId || '').trim();
    if (!id) return;
    const contact = (State.contacts || []).find(c => c && String(c.id || '') === id);
    if (!contact) return;
    renderContactMomentsPage._contactId = id;

    const titleEl = document.getElementById('contact-moments-title');
    const coverEl = document.getElementById('contact-moments-cover');
    const avatarEl = document.getElementById('contact-moments-avatar');
    const usernameEl = document.getElementById('contact-moments-username');
    const listEl = document.getElementById('contact-moments-list');
    
    if (titleEl) titleEl.textContent = `${contact.name || 'TA'}的朋友圈`;
    if (avatarEl) avatarEl.innerHTML = getAvatarHtml(contact.avatar || '');
    if (usernameEl) usernameEl.textContent = contact.name || 'TA';
    
    if (coverEl) {
        // Remove existing listener if any to avoid duplicates
        const newCoverEl = coverEl.cloneNode(true);
        coverEl.parentNode.replaceChild(newCoverEl, coverEl);
        
        // Need to re-query the inner elements since we cloned the cover
        const newAvatarEl = newCoverEl.querySelector('#contact-moments-avatar');
        const newUsernameEl = newCoverEl.querySelector('#contact-moments-username');
        if (newAvatarEl) newAvatarEl.innerHTML = getAvatarHtml(contact.avatar || '');
        if (newUsernameEl) newUsernameEl.textContent = contact.name || 'TA';

        newCoverEl.addEventListener('click', async () => {
            const result = await WeChatUI.showPrompt('更换背景', '请输入图片URL或输入"local"选择本地文件', '');
            if (result === 'local') {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        reader.onload = (e) => {
                            const base64 = e.target.result;
                            contact.momentsBackground = base64;
                            Storage.saveContacts(State.contacts);
                            renderContactMomentsPage(contact.id);
                        };
                        reader.readAsDataURL(file);
                    }
                };
                input.click();
            } else if (result) {
                contact.momentsBackground = result;
                Storage.saveContacts(State.contacts);
                renderContactMomentsPage(contact.id);
            }
        });

        newCoverEl.style.background = '';
        newCoverEl.style.backgroundImage = '';
        newCoverEl.style.backgroundSize = '';
        newCoverEl.style.backgroundPosition = '';
        const bg = contact?.momentsBackground;
        if (bg) {
            newCoverEl.style.backgroundImage = `url("${bg}")`;
            newCoverEl.style.backgroundSize = 'cover';
            newCoverEl.style.backgroundPosition = 'center';
        } else {
            // fallback to default
            newCoverEl.style.background = '#2c2c2c';
        }
    }
    if (!listEl) return;

    let moments = getContactMoments(id);
    let seeded = false;
    moments.forEach((m) => {
        const likes = Array.isArray(m?.likes) ? m.likes : [];
        const comments = Array.isArray(m?.comments) ? m.comments : [];
        if (m && !m._seededSocial && likes.length === 0 && comments.length === 0) {
            seedMomentSocialForContactAuthor(id, m);
            m._seededSocial = true;
            seeded = true;
        }
    });
    if (seeded) {
        Storage.saveMoments(State.moments);
        moments = getContactMoments(id);
    }

    listEl.innerHTML = '';
    if (moments.length === 0) {
        listEl.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #888;">
                暂无动态
                <div style="margin-top: 12px;">
                    <button class="btn-primary" style="width:auto; padding:10px 14px;" id="contact-moments-empty-generate-btn">让TA发一条</button>
                </div>
            </div>
        `;
        listEl.querySelector('#contact-moments-empty-generate-btn')?.addEventListener('click', () => generateAndPostContactMoment(id));
        return;
    }

    moments.forEach((m) => {
        const authorProfile = getMomentActorProfile(m.author);
        const likes = Array.isArray(m.likes) ? m.likes : [];
        const comments = Array.isArray(m.comments) ? m.comments : [];
        const likeNames = likes.map((l) => {
            const p = getMomentActorProfile({ type: l.byType, id: l.byId });
            return p.nickname;
        }).filter(Boolean);

        const metaParts = [];
        if (likeNames.length) {
            metaParts.push(`
                <div class="moment-meta-likes">
                    <i class="fas fa-heart"></i>
                    <div>${escapeHtml(likeNames.join('、'))}</div>
                </div>
            `);
        }
        if (comments.length) {
            const commentHtml = comments.map((c) => {
                const p = getMomentActorProfile({ type: c.byType, id: c.byId });
                const replyToName = String(c?.replyToName || '').trim();
                const replyPart = replyToName ? `<span> 回复 </span><span class="moment-comment-name">${escapeHtml(replyToName)}</span>` : '';
                return `
                    <div class="moment-comment-line">
                        <span class="moment-comment-name">${escapeHtml(p.nickname)}</span>${replyPart}<span>：</span><span>${escapeHtml(c.text || '')}</span>
                    </div>
                `;
            }).join('');
            metaParts.push(`<div class="moment-meta-comments">${commentHtml}</div>`);
        }
        const showMeta = metaParts.length > 0;

        let imagesHtml = '';
        if (Array.isArray(m.images) && m.images.length > 0) {
            const count = m.images.length;
            const countClass = count >= 9 ? 'count-9' : `count-${count}`;
            const items = m.images.map((img, idx) => `
                <div class="moment-image-wrapper">
                    <img src="${escapeHtml(img)}" alt="image" data-preview-idx="${idx}">
                </div>
            `).join('');
            imagesHtml = `<div class="moment-images ${countClass}">${items}</div>`;
        }

        let locationHtml = '';
        if (m.location) {
            locationHtml = `<div class="moment-location">${escapeHtml(m.location)}</div>`;
        }

        const hasLiked = likes.some(l => l.byType === 'user' && l.byId === 'me');
        const likeText = hasLiked ? '取消' : '赞';
        const likeClass = hasLiked ? ' liked' : '';

        const div = document.createElement('div');
        div.className = 'moment-item';
        div.innerHTML = `
            <div class="moment-avatar">${getAvatarHtml(authorProfile.avatar)}</div>
            <div class="moment-body">
                <div class="moment-author">${escapeHtml(authorProfile.nickname)}</div>
                <div class="moment-text">${escapeHtml(m.text || '')}</div>
                ${imagesHtml}
                ${locationHtml}
                <div class="moment-footer">
                    <span>${escapeHtml(formatMomentTime(m.createdAt))}</span>
                    <span class="spacer"></span>
                    <div class="moment-action-wrap">
                        <div class="moment-action-menu">
                            <button class="moment-action-menu-btn${likeClass}" data-action="like">
                                <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>${likeText}
                            </button>
                            <button class="moment-action-menu-btn" data-action="comment">
                                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>评论
                            </button>
                        </div>
                        <button class="moment-action-toggle">
                            <span class="dots">..</span>
                        </button>
                    </div>
                </div>
                ${showMeta ? `<div class="moment-meta-box">${metaParts.join('')}</div>` : ''}
            </div>
        `;

        if (Array.isArray(m.images)) {
            const imgEls = div.querySelectorAll('.moment-image-wrapper img');
            imgEls.forEach(imgEl => {
                imgEl.addEventListener('click', () => {
                    const idx = parseInt(imgEl.getAttribute('data-preview-idx') || '0', 10);
                    showImagePreview(m.images[idx]);
                });
            });
        }

        const toggleBtn = div.querySelector('.moment-action-toggle');
        const actionMenu = div.querySelector('.moment-action-menu');
        if (toggleBtn && actionMenu) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isShowing = actionMenu.classList.contains('show');
                document.querySelectorAll('.moment-action-menu.show').forEach(el => el.classList.remove('show'));
                if (!isShowing) actionMenu.classList.add('show');
            });
        }

        div.querySelector('[data-action="like"]')?.addEventListener('click', (e) => {
            e.stopPropagation();
            actionMenu?.classList.remove('show');
            toggleMomentLike(m.id, { type: 'user', id: 'me' });
        });

        div.querySelector('[data-action="comment"]')?.addEventListener('click', async (e) => {
            e.stopPropagation();
            actionMenu?.classList.remove('show');
            const text = await WeChatUI.showPrompt('评论', '输入评论内容', '');
            if (text == null) return;
            addMomentComment(m.id, { type: 'user', id: 'me' }, text);
        });

        listEl.appendChild(div);
    });
}

// ==========================================
// 角色管理弹窗
// ==========================================

function bindModalEvents() {
    // 头像上传与预览逻辑
    const roleUpload = document.getElementById('role-avatar-upload');
    const roleUrl = document.getElementById('role-avatar-url');
    const rolePreview = document.getElementById('role-avatar-preview');
    const roleValue = document.getElementById('role-avatar-value');

    roleUpload?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const base64 = e.target.result;
                if (roleValue) roleValue.value = base64;
                if (rolePreview) rolePreview.innerHTML = getAvatarHtml(base64);
                if (roleUrl) roleUrl.value = '';
            };
            reader.readAsDataURL(file);
        }
    });

    roleUrl?.addEventListener('input', (e) => {
        const url = e.target.value.trim();
        if (url) {
            if (roleValue) roleValue.value = url;
            if (rolePreview) rolePreview.innerHTML = getAvatarHtml(url);
        }
    });

    // 右上角添加角色按钮
    document.getElementById('add-ai-role-btn')?.addEventListener('click', () => {
        openRoleModal(null);
    });

    // 通讯录页面的"添加AI角色"入口
    document.getElementById('add-role-entry')?.addEventListener('click', () => {
        openRoleModal(null);
    });

    // 关闭弹窗
    document.getElementById('close-role-modal')?.addEventListener('click', closeRoleModal);
    document.querySelector('.modal-overlay')?.addEventListener('click', closeRoleModal);

    // 保存角色
    document.getElementById('save-role-btn')?.addEventListener('click', saveRole);

    // 删除角色
    document.getElementById('delete-role-btn')?.addEventListener('click', deleteRole);
    // 关联世界书
    document.getElementById('link-worldbook-btn')?.addEventListener('click', openLinkWorldbookModal);
    document.getElementById('close-link-worldbook-modal')?.addEventListener('click', closeLinkWorldbookModal);
    document.getElementById('confirm-link-worldbook-btn')?.addEventListener('click', confirmLinkWorldbook);
    document.getElementById('link-sticker-lib-btn')?.addEventListener('click', openLinkStickerLibModal);
    document.getElementById('close-link-sticker-lib-modal')?.addEventListener('click', closeLinkStickerLibModal);
    document.getElementById('confirm-link-sticker-lib-btn')?.addEventListener('click', confirmLinkStickerLib);

    document.getElementById('ai-real-time-toggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
    });
    const noReplySettings = document.getElementById('seen-no-reply-settings');
    const noReplyTendencyEl = document.getElementById('no-reply-tendency');
    const noReplyTendencyValueEl = document.getElementById('no-reply-tendency-value');
    noReplyTendencyEl?.addEventListener('input', () => {
        if (noReplyTendencyValueEl) noReplyTendencyValueEl.textContent = String(noReplyTendencyEl.value);
    });
    document.getElementById('seen-no-reply-toggle')?.addEventListener('click', function () {
        this.classList.toggle('active');
        if (noReplySettings) noReplySettings.style.display = this.classList.contains('active') ? '' : 'none';
    });
    const contextLimitEl = document.getElementById('context-limit');

    // 消息编辑弹窗
    const editContentEl = document.getElementById('edit-message-content');
    const bindOnce = (id, eventName, handler) => {
        const el = document.getElementById(id);
        if (!el || el.dataset.bound === '1') return;
        el.dataset.bound = '1';
        el.addEventListener(eventName, handler);
    };
    const getEditorObject = () => {
        const raw = String(editContentEl?.value || '').trim();
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
                const item = parsed.find(x => x && typeof x === 'object' && String(x.type || '') !== 'action' && String(x.type || '') !== 'thought_state');
                return item && typeof item === 'object' ? item : null;
            }
            return parsed && typeof parsed === 'object' ? parsed : null;
        } catch (e) {
            return null;
        }
    };
    const deriveText = (obj) => {
        if (!obj || typeof obj !== 'object') return '';
        const t = String(obj.type || '').trim();
        if (t === 'voice') return String(obj.content ?? obj.text ?? obj.transcription ?? '').trim();
        if (t === 'image') return String(obj.description ?? obj.content ?? '').trim();
        if (t === 'quote' || t === 'quote_reply') return String(obj.content ?? obj.reply_content ?? '').trim();
        if (t === 'sticker_message') return String(obj.sticker || '').trim();
        return String(obj.content ?? obj.text ?? '').trim();
    };
    const setEditorObject = (obj) => {
        if (!editContentEl) return;
        editContentEl.value = JSON.stringify(obj, null, 2);
    };

    bindOnce('close-message-edit-modal', 'click', (e) => {
        e.preventDefault();
        closeMessageEditModal();
    });
    bindOnce('save-message-edit-btn', 'click', (e) => {
        e.preventDefault();
        saveMessageEdit();
    });
    bindOnce('delete-message-btn', 'click', async (e) => {
        e.preventDefault();
        await deleteMessageEdit();
    });
    bindOnce('edit-msg-insert-text', 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = getEditorObject();
        const content = deriveText(src);
        setEditorObject({ type: "text", content: content || "这里输入文字" });
    });
    bindOnce('edit-msg-insert-image', 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = getEditorObject();
        const desc = deriveText(src);
        setEditorObject({ type: "image", content: "", description: desc || "描述文字" });
    });
    bindOnce('edit-msg-insert-sticker', 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const src = getEditorObject();
        const sticker = (src && typeof src === 'object' && String(src.type || '') === 'sticker_message')
            ? String(src.sticker || '').trim()
            : '';
        setEditorObject({ type: "sticker_message", sticker: sticker || "开心" });
    });

    const parseWxMoneyAmount = (text) => {
        const raw = String(text || '');
        const m = raw.match(/金额:\s*¥?\s*([0-9]+(?:\.[0-9]{1,2})?)/);
        if (!m) return null;
        const n = parseFloat(m[1]);
        return Number.isFinite(n) ? n : null;
    };
    const parseWxMoneyRemark = (text, kind) => {
        const raw = String(text || '');
        const label = kind === 'transfer' ? '说明' : '备注';
        const re = new RegExp(`${label}:\\s*([\\s\\S]*)$`);
        const m = raw.match(re);
        return m ? String(m[1] || '').trim() : '';
    };
    const buildWxMoneyEditorObject = (kind) => {
        const src = getEditorObject();
        const idx = parseInt(String(document.getElementById('edit-message-index')?.value || ''), 10);
        const history = State.chatHistories?.[State.currentContactId] || [];
        const role = (Number.isFinite(idx) && idx >= 0 && idx < history.length) ? String(history[idx]?.role || 'user') : 'user';
        const from = role === 'user' ? 'me' : 'other';

        const baseText = (src && typeof src === 'object' && (String(src.type || '') === 'text' || String(src.type || '') === 'text_message'))
            ? String(src.content || '')
            : '';
        const meta = (src && typeof src === 'object' && src.wxMoney && typeof src.wxMoney === 'object') ? src.wxMoney : null;
        const sameKind = meta && String(meta.kind || '') === String(kind || '');

        const parsedAmount = parseWxMoneyAmount(baseText);
        const metaAmount = typeof meta?.amount === 'number' ? meta.amount : null;
        const amount = (sameKind && Number.isFinite(metaAmount)) ? metaAmount : (Number.isFinite(parsedAmount) ? parsedAmount : 0);
        const amountFixed = (Number.isFinite(amount) ? amount : 0).toFixed(2);

        const textDerived = deriveText(src);
        const parsedRemark = parseWxMoneyRemark(baseText, kind);
        const metaRemark = typeof meta?.remark === 'string' ? meta.remark.trim() : '';
        const remark = (sameKind && metaRemark) ? metaRemark : (parsedRemark || textDerived);

        const now = Date.now();
        const wxMoney = {
            id: (sameKind && typeof meta?.id === 'string' && meta.id.trim()) ? meta.id.trim() : `wxm_${now}_${Math.random().toString(36).slice(2, 6)}`,
            kind: String(kind || ''),
            amount: +Number(amountFixed),
            remark: String(remark || '').trim(),
            status: (sameKind && typeof meta?.status === 'string' && meta.status.trim()) ? meta.status.trim() : 'pending',
            createdAt: (sameKind && Number.isFinite(Number(meta?.createdAt))) ? Number(meta.createdAt) : now,
            receivedAt: (sameKind && Number.isFinite(Number(meta?.receivedAt))) ? Number(meta.receivedAt) : 0,
            from,
            to: State.currentContactId
        };

        const content = kind === 'transfer'
            ? `[微信转账]\n金额: ¥${amountFixed}\n说明: ${wxMoney.remark || '转账'}`
            : `[微信红包]\n金额: ¥${amountFixed}\n备注: ${wxMoney.remark || '恭喜发财，大吉大利'}`;

        setEditorObject({ type: "text", content, wxMoney });
    };

    bindOnce('edit-msg-insert-transfer', 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        buildWxMoneyEditorObject('transfer');
    });
    bindOnce('edit-msg-insert-redpacket', 'click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        buildWxMoneyEditorObject('redpacket');
    });
}

function openRoleModal(contact = null) {
    const modal = document.getElementById('role-modal');
    const title = document.getElementById('role-modal-title');
    const idInput = document.getElementById('role-id');
    const nameInput = document.getElementById('role-name');
    const personaInput = document.getElementById('role-persona');
    const styleInput = document.getElementById('role-style');
    const deleteBtn = document.getElementById('delete-role-btn');
    const roleValue = document.getElementById('role-avatar-value');
    const rolePreview = document.getElementById('role-avatar-preview');
    const roleUrl = document.getElementById('role-avatar-url');
    const contextLimitEl = document.getElementById('context-limit');
    const realTimeToggle = document.getElementById('ai-real-time-toggle');
    const seenNoReplyToggle = document.getElementById('seen-no-reply-toggle');
    const seenNoReplySettings = document.getElementById('seen-no-reply-settings');
    const noReplyCooldownEl = document.getElementById('no-reply-cooldown-min');
    const noReplyTendencyEl = document.getElementById('no-reply-tendency');
    const noReplyTendencyValueEl = document.getElementById('no-reply-tendency-value');

    if (contact) {
        title.textContent = '编辑角色';
        idInput.value = contact.id;
        nameInput.value = contact.name;
        
        if (roleValue) roleValue.value = contact.avatar || '';
        if (rolePreview) rolePreview.innerHTML = getAvatarHtml(contact.avatar);
        if (roleUrl) roleUrl.value = '';

        personaInput.value = contact.persona || '';
        styleInput.value = contact.style || '';
        tempLinkedWorldbooks = [...(contact.linkedWorldbooks || [])];
        tempLinkedStickerLibs = [...(contact.linkedStickerLibs || [])];
        if (contextLimitEl) {
            contextLimitEl.value = String(contact.contextLimit ?? 150);
        }
        if (realTimeToggle) realTimeToggle.classList.toggle('active', !!contact.knowsRealTime);
        if (seenNoReplyToggle) seenNoReplyToggle.classList.toggle('active', !!contact.allowSeenNoReply);
        if (seenNoReplySettings) seenNoReplySettings.style.display = contact.allowSeenNoReply ? '' : 'none';
        if (noReplyCooldownEl) noReplyCooldownEl.value = String(contact.noReplyCooldownMin ?? 10);
        if (noReplyTendencyEl) noReplyTendencyEl.value = String(contact.noReplyTendency ?? 30);
        if (noReplyTendencyValueEl && noReplyTendencyEl) noReplyTendencyValueEl.textContent = String(noReplyTendencyEl.value);
        deleteBtn.style.display = 'block';
    } else {
        title.textContent = '添加角色';
        idInput.value = '';
        nameInput.value = '';
        
        if (roleValue) roleValue.value = '';
        if (rolePreview) rolePreview.innerHTML = getAvatarHtml('');
        if (roleUrl) roleUrl.value = '';
        
        personaInput.value = '';
        styleInput.value = '';
        tempLinkedWorldbooks = [];
        tempLinkedStickerLibs = [];
        if (contextLimitEl) {
            contextLimitEl.value = '150';
        }
        if (realTimeToggle) realTimeToggle.classList.remove('active');
        if (seenNoReplyToggle) seenNoReplyToggle.classList.remove('active');
        if (seenNoReplySettings) seenNoReplySettings.style.display = 'none';
        if (noReplyCooldownEl) noReplyCooldownEl.value = '10';
        if (noReplyTendencyEl) noReplyTendencyEl.value = '30';
        if (noReplyTendencyValueEl) noReplyTendencyValueEl.textContent = '30';
        deleteBtn.style.display = 'none';
    }
    
    renderLinkedWorldbooks();
    renderLinkedStickerLibs();
    modal.classList.add('show');
}

function closeRoleModal() {
    document.getElementById('role-modal')?.classList.remove('show');
}

// 关联世界书功能
let tempLinkedWorldbooks = [];
let tempLinkedStickerLibs = [];

function openLinkWorldbookModal() {
    const modal = document.getElementById('link-worldbook-modal');
    const list = document.getElementById('worldbook-select-list');
    
    list.innerHTML = '';
    
    if (State.worldbooks.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="padding: 40px 20px; text-align: center; color: #999;">
                <i class="fas fa-book" style="font-size: 40px; margin-bottom: 15px; color: #ccc;"></i>
                <p style="font-size: 14px;">还没有世界书条目</p>
                <p style="font-size: 12px; margin-top: 5px;">先去"发现-世界书"中添加吧</p>
            </div>
        `;
    } else {
        State.worldbooks.forEach(book => {
            const isChecked = tempLinkedWorldbooks.includes(book.id);
            const item = document.createElement('div');
            item.className = 'worldbook-select-item';
            item.innerHTML = `
                <div class="worldbook-checkbox ${isChecked ? 'checked' : ''}" data-id="${book.id}">
                    <i class="fas fa-check" style="display: ${isChecked ? 'block' : 'none'}"></i>
                </div>
                <div class="worldbook-select-info">
                    <div class="worldbook-select-title">${escapeHtml(book.title || '未命名')}</div>
                    <div class="worldbook-select-preview">${escapeHtml(book.desc?.substring(0, 30) || '无简介')}...</div>
                </div>
            `;
            
            // 点击切换选中状态
            item.addEventListener('click', () => {
                const checkbox = item.querySelector('.worldbook-checkbox');
                const id = checkbox.dataset.id;
                
                if (checkbox.classList.contains('checked')) {
                    checkbox.classList.remove('checked');
                    checkbox.querySelector('i').style.display = 'none';
                    tempLinkedWorldbooks = tempLinkedWorldbooks.filter(wbId => wbId !== id);
                } else {
                    checkbox.classList.add('checked');
                    checkbox.querySelector('i').style.display = 'block';
                    if (!tempLinkedWorldbooks.includes(id)) {
                        tempLinkedWorldbooks.push(id);
                    }
                }
            });
            
            list.appendChild(item);
        });
    }
    
    modal.classList.add('show');
}

function closeLinkWorldbookModal() {
    document.getElementById('link-worldbook-modal')?.classList.remove('show');
}

function confirmLinkWorldbook() {
    renderLinkedWorldbooks();
    closeLinkWorldbookModal();
}

function renderLinkedWorldbooks() {
    const list = document.getElementById('linked-worldbooks');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (tempLinkedWorldbooks.length === 0) {
        list.innerHTML = '<div class="empty-tip">暂无关联的世界书</div>';
        return;
    }
    
    tempLinkedWorldbooks.forEach(id => {
        const book = State.worldbooks.find(b => b.id === id);
        if (!book) return;
        
        const item = document.createElement('div');
        item.className = 'linked-item';
        item.innerHTML = `
            <span class="linked-item-name">${escapeHtml(book.title || '未命名')}</span>
            <span class="linked-item-remove" data-id="${id}"><i class="fas fa-times"></i></span>
        `;
        
        item.querySelector('.linked-item-remove').addEventListener('click', (e) => {
            e.stopPropagation();
            tempLinkedWorldbooks = tempLinkedWorldbooks.filter(wbId => wbId !== id);
            renderLinkedWorldbooks();
        });
        
        list.appendChild(item);
    });
}

function openLinkStickerLibModal() {
    const modal = document.getElementById('link-sticker-lib-modal');
    const list = document.getElementById('sticker-lib-select-list');
    if (!modal || !list) return;

    list.innerHTML = '';

    if (!State.stickerLibraries || State.stickerLibraries.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">暂无表情包库</div>';
        modal.classList.add('show');
        return;
    }

    State.stickerLibraries.forEach((lib) => {
        const isChecked = tempLinkedStickerLibs.includes(lib.id);
        const item = document.createElement('div');
        item.className = 'worldbook-select-item';

        const firstSticker = lib.items?.[0];
        const firstUrl = getStickerUrl(firstSticker);
        const firstText = getStickerText(firstSticker) || '😊';
        const iconHtml = firstUrl ? `<img src="${firstUrl}" style="width:34px; height:34px; object-fit:contain;">` : `<span style="font-size:20px;">${escapeHtml(firstText)}</span>`;

        item.innerHTML = `
            <div class="worldbook-checkbox ${isChecked ? 'checked' : ''}" data-id="${lib.id}">
                <i class="fas fa-check" style="display: ${isChecked ? 'block' : 'none'}"></i>
            </div>
            <div class="worldbook-select-info" style="display:flex; align-items:center; gap:12px;">
                <div style="width:40px; height:40px; background:#f7f7f7; border-radius:4px; display:flex; align-items:center; justify-content:center; overflow:hidden;">${iconHtml}</div>
                <div style="flex:1;">
                    <div class="worldbook-select-title">${escapeHtml(lib.name || '未命名')}</div>
                    <div class="worldbook-select-preview">${(lib.items?.length || 0)} 个表情</div>
                </div>
            </div>
        `;

        item.addEventListener('click', () => {
            const checkbox = item.querySelector('.worldbook-checkbox');
            const id = checkbox.dataset.id;
            if (checkbox.classList.contains('checked')) {
                checkbox.classList.remove('checked');
                checkbox.querySelector('i').style.display = 'none';
                tempLinkedStickerLibs = tempLinkedStickerLibs.filter(x => x !== id);
            } else {
                checkbox.classList.add('checked');
                checkbox.querySelector('i').style.display = 'block';
                if (!tempLinkedStickerLibs.includes(id)) tempLinkedStickerLibs.push(id);
            }
        });

        list.appendChild(item);
    });

    modal.classList.add('show');
}

function closeLinkStickerLibModal() {
    document.getElementById('link-sticker-lib-modal')?.classList.remove('show');
}

function confirmLinkStickerLib() {
    renderLinkedStickerLibs();
    closeLinkStickerLibModal();
}

function renderLinkedStickerLibs() {
    const list = document.getElementById('linked-sticker-libs');
    if (!list) return;

    list.innerHTML = '';
    if (!tempLinkedStickerLibs || tempLinkedStickerLibs.length === 0) {
        list.innerHTML = '<div class="empty-tip">暂无关联的表情包</div>';
        return;
    }

    tempLinkedStickerLibs.forEach((id) => {
        const lib = State.stickerLibraries.find(l => l.id === id);
        if (!lib) return;

        const item = document.createElement('div');
        item.className = 'linked-item';
        item.innerHTML = `
            <span class="linked-item-name">${escapeHtml(lib.name || '未命名')}</span>
            <span class="linked-item-remove" data-id="${id}"><i class="fas fa-times"></i></span>
        `;

        item.querySelector('.linked-item-remove')?.addEventListener('click', (e) => {
            e.stopPropagation();
            tempLinkedStickerLibs = tempLinkedStickerLibs.filter(x => x !== id);
            renderLinkedStickerLibs();
        });

        list.appendChild(item);
    });
}

function saveRole() {
    const id = document.getElementById('role-id').value;
    const name = document.getElementById('role-name').value.trim();
    const roleValue = document.getElementById('role-avatar-value');
    const avatar = roleValue ? roleValue.value : '';
    const persona = document.getElementById('role-persona').value.trim();
    const style = document.getElementById('role-style').value.trim();
    const contextLimit = parseInt(document.getElementById('context-limit')?.value || '150', 10) || 150;
    const knowsRealTime = document.getElementById('ai-real-time-toggle')?.classList.contains('active') || false;
    const allowSeenNoReply = document.getElementById('seen-no-reply-toggle')?.classList.contains('active') || false;
    const noReplyCooldownMin = Math.max(1, Math.min(120, parseInt(document.getElementById('no-reply-cooldown-min')?.value || '10', 10) || 10));
    const noReplyTendency = Math.max(0, Math.min(100, parseInt(document.getElementById('no-reply-tendency')?.value || '30', 10) || 30));

    if (!name) {
        showToast('请输入角色名称');
        return;
    }

    if (id) {
        // 编辑
        const contact = State.contacts.find(c => c.id === id);
        if (contact) {
            contact.name = name;
            contact.avatar = avatar;
            contact.persona = persona;
            contact.style = style;
            contact.linkedWorldbooks = [...tempLinkedWorldbooks];
            contact.linkedStickerLibs = [...tempLinkedStickerLibs];
            contact.contextLimit = Math.max(1, contextLimit);
            contact.knowsRealTime = knowsRealTime;
            contact.allowSeenNoReply = allowSeenNoReply;
            contact.noReplyCooldownMin = noReplyCooldownMin;
            contact.noReplyTendency = noReplyTendency;
        }
    } else {
        // 新增
        const newId = 'role_' + Date.now();
        State.contacts.push({
            id: newId,
            name,
            avatar,
            persona,
            style,
            linkedWorldbooks: [...tempLinkedWorldbooks],
            linkedStickerLibs: [...tempLinkedStickerLibs],
            contextLimit: Math.max(1, contextLimit),
            knowsRealTime: knowsRealTime,
            autoMessageEnabled: false,
            allowSeenNoReply: allowSeenNoReply,
            noReplyCooldownMin: noReplyCooldownMin,
            noReplyTendency: noReplyTendency,
            lastMessage: '',
            lastTime: ''
        });
        State.chatHistories[newId] = [];
    }

    Storage.saveContacts(State.contacts);
    Storage.saveChatHistories(State.chatHistories);

    closeRoleModal();
    initContactsList();
    initChatList();
}

function deleteRole() {
    const id = document.getElementById('role-id').value;
    if (!id) return;

    WeChatUI.showConfirm('删除角色', '确定删除这个角色吗？聊天记录也将被删除。', '删除', '取消', true).then((ok) => {
        if (!ok) return;
        const activePageId = document.querySelector('.page.active')?.id || '';
        const wasInChatFlow = [
            'chat-page',
            'chat-more-page',
            'contact-moments-page',
            'chat-search-page',
            'chat-bg-page',
            'chat-user-override-page'
        ].includes(activePageId);

        State.contacts = State.contacts.filter(c => c.id !== id);
        delete State.chatHistories[id];
        if (String(State.currentContactId || '') === String(id)) {
            State.currentContactId = null;
        }

        Storage.saveContacts(State.contacts);
        Storage.saveChatHistories(State.chatHistories);

        closeRoleModal();
        initContactsList();
        initChatList();

        if (wasInChatFlow) {
            hardSwitchToMainTab('wechat-tab');
            return;
        }

        if (activePageId === 'contacts-tab' || State.currentTab === 'contacts') {
            hardSwitchToMainTab('contacts-tab');
            return;
        }

        if (!document.querySelector('.page.active')) {
            hardSwitchToMainTab('wechat-tab');
        }
    });
}

// ==========================================
// 微信风格自定义弹窗系统
// ==========================================

const WeChatUI = {
    // 基础对话框 (带输入框)
    showPrompt: function(title, placeholder, defaultValue, onConfirm) {
        return new Promise((resolve) => {
            const modal = document.getElementById('wechat-prompt-modal');
            const overlay = document.getElementById('wechat-prompt-overlay');
            const titleEl = document.getElementById('wechat-prompt-title');
            const inputEl = document.getElementById('wechat-prompt-input');
            const cancelBtn = document.getElementById('wechat-prompt-cancel');
            const confirmBtn = document.getElementById('wechat-prompt-confirm');

            if (!modal) {
                console.warn('WeChat UI prompt modal not found');
                resolve(null);
                return;
            }

            titleEl.textContent = title;
            inputEl.placeholder = placeholder;
            inputEl.value = defaultValue || '';
            
            const cleanup = () => {
                modal.classList.remove('show');
                cancelBtn.onclick = null;
                confirmBtn.onclick = null;
                overlay.onclick = null;
            };

            cancelBtn.onclick = () => {
                cleanup();
                resolve(null);
            };

            overlay.onclick = () => {
                cleanup();
                resolve(null);
            };

            confirmBtn.onclick = () => {
                const val = inputEl.value.trim();
                cleanup();
                if (onConfirm) onConfirm(val);
                resolve(val);
            };

            modal.classList.add('show');
            setTimeout(() => inputEl.focus(), 100);
        });
    },

    // 基础确认对话框（无输入）
    showConfirm: function(title, message, confirmText = '确定', cancelText = '取消', isDanger = false) {
        return new Promise((resolve) => {
            const modal = document.getElementById('wechat-confirm-modal');
            const overlay = document.getElementById('wechat-confirm-overlay');
            const titleEl = document.getElementById('wechat-confirm-title');
            const messageEl = document.getElementById('wechat-confirm-message');
            const cancelBtn = document.getElementById('wechat-confirm-cancel');
            const confirmBtn = document.getElementById('wechat-confirm-confirm');

            if (!modal || !overlay || !titleEl || !messageEl || !cancelBtn || !confirmBtn) {
                resolve(confirm(message || title || '确认继续吗？'));
                return;
            }

            titleEl.textContent = title || '提示';
            messageEl.textContent = message || '';
            cancelBtn.textContent = cancelText || '取消';
            confirmBtn.textContent = confirmText || '确定';
            confirmBtn.classList.toggle('danger', !!isDanger);

            const cleanup = () => {
                modal.classList.remove('show');
                cancelBtn.onclick = null;
                confirmBtn.onclick = null;
                overlay.onclick = null;
            };

            cancelBtn.onclick = () => {
                cleanup();
                resolve(false);
            };
            overlay.onclick = () => {
                cleanup();
                resolve(false);
            };
            confirmBtn.onclick = () => {
                cleanup();
                resolve(true);
            };

            modal.classList.add('show');
        });
    },

    // 底部 Action Sheet
    showActionSheet: function(onSelectVideo, onSelectVoice) {
        return new Promise((resolve) => {
            const modal = document.getElementById('call-action-sheet');
            const overlay = document.getElementById('call-action-overlay');
            const videoBtn = document.getElementById('action-video-call');
            const voiceBtn = document.getElementById('action-voice-call');
            const cancelBtn = document.getElementById('action-call-cancel');

            if (!modal) {
                resolve(null);
                return;
            }

            const cleanup = () => {
                modal.classList.remove('show');
                videoBtn.onclick = null;
                voiceBtn.onclick = null;
                cancelBtn.onclick = null;
                overlay.onclick = null;
            };

            cancelBtn.onclick = () => { cleanup(); resolve(null); };
            overlay.onclick = () => { cleanup(); resolve(null); };

            videoBtn.onclick = () => {
                cleanup();
                if (onSelectVideo) onSelectVideo();
                resolve('video');
            };

            voiceBtn.onclick = () => {
                cleanup();
                if (onSelectVoice) onSelectVoice();
                resolve('voice');
            };

            modal.classList.add('show');
        });
    },

    // 红包发送弹窗
    showRedPacket: function(onSend) {
        return new Promise((resolve) => {
            const modal = document.getElementById('wechat-redpacket-modal');
            const overlay = document.getElementById('wechat-redpacket-overlay');
            const closeBtn = document.getElementById('close-redpacket-modal');
            const amountInput = document.getElementById('rp-amount');
            const remarkInput = document.getElementById('rp-remark');
            const displayAmount = document.getElementById('rp-display-amount');
            const sendBtn = document.getElementById('rp-send-btn');

            if (!modal) {
                resolve(null);
                return;
            }

            // 重置状态
            amountInput.value = '';
            remarkInput.value = '';
            displayAmount.textContent = '0.00';

            // 实时更新大字金额
            const updateAmount = () => {
                const val = parseFloat(amountInput.value);
                displayAmount.textContent = isNaN(val) ? '0.00' : val.toFixed(2);
            };
            amountInput.oninput = updateAmount;

            const cleanup = () => {
                modal.classList.remove('show');
                closeBtn.onclick = null;
                overlay.onclick = null;
                sendBtn.onclick = null;
            };

            closeBtn.onclick = () => { cleanup(); resolve(null); };
            overlay.onclick = () => { cleanup(); resolve(null); };

            sendBtn.onclick = () => {
                const amount = parseFloat(amountInput.value);
                if (isNaN(amount) || amount <= 0) {
                    showToast('请输入有效的金额');
                    return;
                }
                const remark = remarkInput.value.trim() || '恭喜发财，大吉大利';
                cleanup();
                if (onSend) onSend(amount, remark);
                resolve({ amount, remark });
            };

            modal.classList.add('show');
            setTimeout(() => amountInput.focus(), 100);
        });
    },
    
    // 通话界面
    // direction: incoming(对方来电) | outgoing(我方拨出)
    showCallPage: function(contact, type, onHangup, options = {}) {
        const direction = options.direction || 'incoming';
        const page = document.getElementById('full-call-page');
        const nameEl = document.getElementById('call-name');
        const statusEl = document.getElementById('call-status');
        const avatarEl = document.getElementById('call-avatar');
        const rejectBtn = document.getElementById('call-reject-btn');
        const acceptBtn = document.getElementById('call-accept-btn');
        const actionsDiv = document.querySelector('.call-actions');
        const inProgressDiv = document.getElementById('call-in-progress-actions');
        const hangupBtn = document.getElementById('call-hangup-btn');
        const descInput = document.getElementById('call-desc-input');
        let callSendMsgBtn = document.getElementById('call-send-msg-btn');
        let callAiReplyBtn = document.getElementById('call-ai-reply-btn');
        if (callSendMsgBtn && callSendMsgBtn.parentNode) {
            const cloned = callSendMsgBtn.cloneNode(true);
            callSendMsgBtn.parentNode.replaceChild(cloned, callSendMsgBtn);
            callSendMsgBtn = cloned;
        }
        if (callAiReplyBtn && callAiReplyBtn.parentNode) {
            const cloned = callAiReplyBtn.cloneNode(true);
            callAiReplyBtn.parentNode.replaceChild(cloned, callAiReplyBtn);
            callAiReplyBtn = cloned;
        }

        if (!page || !contact) return;

        let callTimer = null;
        let autoConnectTimer = null;
        let callSeconds = 0;
        let callConnected = false;

        // 为通话页创建一个本地交付流，不写入聊天记录
        let liveFeed = document.getElementById('call-live-feed');
        if (!liveFeed && inProgressDiv) {
            liveFeed = document.createElement('div');
            liveFeed.id = 'call-live-feed';
            liveFeed.className = 'call-live-feed';
            inProgressDiv.insertBefore(liveFeed, inProgressDiv.firstChild);
        }
        if (liveFeed) liveFeed.innerHTML = '';

        let typingIndicator = document.getElementById('call-status-typing');
        if (!typingIndicator && statusEl?.parentElement) {
            typingIndicator = document.createElement('div');
            typingIndicator.id = 'call-status-typing';
            typingIndicator.className = 'call-status-typing';
            typingIndicator.innerHTML = `
                <span class="call-typing-label">对方正在说话...</span>
                <span class="call-typing-dots" aria-hidden="true">
                    <i></i><i></i><i></i>
                </span>
            `;
            statusEl.parentElement.appendChild(typingIndicator);
        }

        const setCallTyping = (visible) => {
            if (!typingIndicator) return;
            typingIndicator.classList.toggle('show', !!visible);
        };

        const appendCallFeed = (role, text) => {
            if (!liveFeed || !text) return;
            const item = document.createElement('div');
            item.className = `call-feed-item ${role}`;
            item.textContent = text;
            liveFeed.appendChild(item);
            liveFeed.scrollTop = liveFeed.scrollHeight;
        };

        const callHistory = [];
        let callAiBusy = false;
        let callAiController = null;
        let callAiInterrupted = false;
        let callAiLastPrompt = '';
        let lastConsumedUserIndex = -1;

        let callSummaryMemoryText = getLatestSummaryText(contact?.id);

        const buildCallSystemPrompt = (summaryMemoryText = '') => {
            const roleName = contact?.name || '联系人';
            const persona = String(contact?.persona || '').trim();
            const style = String(contact?.style || '').trim();
            const now = new Date();
            const dateText = now.toLocaleDateString('zh-CN');
            const timeText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const kind = type === 'video' ? '视频通话' : '语音通话';
            const summaryMemory = String(summaryMemoryText || '').trim();
            const modeRules = type === 'video'
                ? `【通话模式】\n- 这是视频通话：你可以像小说一样细致地描写画面、表情、动作、视线、环境细节等。\n- ❗所有的非语言描写（画面/动作/表情等）必须用【】括起来（例如“【你笑着抬眼看屏幕】”）。\n- 语言部分直接输出，不要带引号。\n`
                : `【通话模式】\n- 这是语音通话：你可以描写声音的质感、语气、呼吸声、背景噪音、环境音等。\n- ❗所有的非语言描写（声音/语气/噪音等）必须用【】括起来（例如“【电话那头传来沙沙的风声】”）。\n- 禁止写“我点头/我走过去/我看见…”这类纯视觉动作，只能描写能被听到的内容。\n- 语言部分直接输出，不要带引号。\n`;
            return `你现在扮演「${roleName}」，正在与用户进行${kind}。\n\n【角色人设】\n${persona || '（未填写）'}\n\n【说话气质】\n${style || '自然、口语化'}\n\n${summaryMemory ? `【已归档记忆】\n${summaryMemory}\n\n` : ''}【时间】\n${dateText} ${timeText}\n\n${modeRules}\n【输出要求】\n- 只输出纯文本，不要输出 JSON、不要输出 Markdown、不要输出解释。\n- 完全代入角色，不限制回复长短，根据当前场景和情绪自然表达。\n`;
        };

        const extractReplyText = (data) => {
            const candidates = [
                data?.choices?.[0]?.message?.content,
                data?.choices?.[0]?.text,
                data?.message?.content,
                data?.output_text,
                data?.result
            ];
            for (const c of candidates) {
                if (typeof c === 'string' && c.trim()) return c.trim();
            }
            return '';
        };

        const normalizeCallReplyText = (raw) => {
            const text = String(raw || '').trim();
            if (!text) return '';
            if (text.startsWith('[') || text.startsWith('{')) {
                try {
                    const parsed = JSON.parse(text);
                    if (Array.isArray(parsed)) {
                        const parts = parsed.map((it) => {
                            if (!it || typeof it !== 'object') return '';
                            if (typeof it.content === 'string') return it.content;
                            if (typeof it.description === 'string') return it.description;
                            if (typeof it.sticker === 'string') return `[表情] ${it.sticker}`;
                            return '';
                        }).filter(Boolean);
                        if (parts.length > 0) return parts.join('\n');
                    }
                    if (parsed && typeof parsed === 'object') {
                        if (typeof parsed.content === 'string') return parsed.content;
                        if (typeof parsed.description === 'string') return parsed.description;
                    }
                } catch (e) {
                }
            }
            return text;
        };

        const splitCallLines = (text) => {
            return splitAiTextToBubbles(text, { maxLen: 18, maxItems: 8 });
        };

        const getCallContextHistory = () => {
            const baseHistory = State.chatHistories[contact.id] || [];
            const limit = Math.max(1, Math.min(20, parseInt(contact.contextLimit ?? 12, 10) || 12));
            return baseHistory
                .slice(-limit)
                .map((msg) => {
                    const role = msg?.role === 'assistant' ? 'assistant' : 'user';
                    const content = toPlainTextFromStoredContent(msg?.content);
                    return { role, content: String(content || '').trim() };
                })
                .filter((msg) => msg.content);
        };

        const requestCallAI = async (userText, signal) => {
            const currentApiConfig = State.apiConfigs.find(c => c.id === State.currentApiId);
            const useProxy = !!currentApiConfig?.useProxy;
            const targetUrl = useProxy ? (currentApiConfig?.proxyUrl || '').trim() : normalizeChatCompletionsUrl(currentApiConfig?.apiUrl || '');
            const apiKey = (currentApiConfig?.apiKey || '').trim();
            if (!currentApiConfig || !targetUrl || (!useProxy && !apiKey)) {
                throw new Error('API未配置');
            }
            const headers = { 'Content-Type': 'application/json' };
            if (!useProxy) headers.Authorization = `Bearer ${apiKey}`;
            const modelToUse = (currentApiConfig.model || '').trim()
                || (Array.isArray(currentApiConfig.models) ? (currentApiConfig.models[0] || '').trim() : '')
                || 'gpt-3.5-turbo';

            const messages = [{ role: 'system', content: buildCallSystemPrompt(callSummaryMemoryText) }];
            const chatContextHistory = getCallContextHistory();
            if (chatContextHistory.length > 0) {
                messages.push({
                    role: 'system',
                    content: `【最近常规聊天记录】\n${chatContextHistory.map((m) => `${m.role === 'assistant' ? (contact?.name || '对方') : '我'}：${m.content}`).join('\n')}`
                });
            }
            const recent = callHistory.slice(-16);
            recent.forEach((m) => {
                messages.push({ role: m.role, content: String(m.content || '') });
            });
            messages.push({ role: 'user', content: String(userText || '') });

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers,
                signal,
                body: JSON.stringify({
                    model: modelToUse,
                    messages,
                    temperature: 0.8
                })
            });
            if (!response.ok) {
                throw new Error('通话请求失败');
            }
            const data = await response.json();
            return normalizeCallReplyText(extractReplyText(data));
        };

        const talkToAIInCall = async (userText) => {
            const text = String(userText || '').trim();
            if (!text) return;
            if (callAiBusy) return;
            callAiBusy = true;
            callAiInterrupted = false;
            callAiLastPrompt = text;
            const controller = new AbortController();
            callAiController = controller;
            try {
                setCallTyping(true);
                const callQuery = [
                    ...callHistory.slice(-6).map(m => String(m?.content || '').trim()).filter(Boolean),
                    text
                ].join('\n');
                callSummaryMemoryText = await recallSummaryChunks(contact, callQuery, 2);
                const reply = await requestCallAI(text, controller.signal);
                const lines = splitCallLines(reply);
                if (lines.length === 0) return;
                for (const line of lines) {
                    if (controller.signal.aborted) {
                        callAiInterrupted = true;
                        break;
                    }
                    await new Promise(r => setTimeout(r, 180 + Math.random() * 360));
                    appendCallFeed('ai', line);
                    callHistory.push({ role: 'assistant', content: line });
                }
            } catch (e) {
                const isAbort = e && (e.name === 'AbortError' || String(e.message || '').toLowerCase().includes('aborted'));
                if (isAbort) {
                    callAiInterrupted = true;
                    showToast('已中断');
                } else {
                    appendCallFeed('system', '（通话回复失败）');
                    showToast('通话 AI 回复失败');
                }
            } finally {
                setCallTyping(false);
                callAiBusy = false;
                callAiController = null;
            }
        };

        const formatDuration = () => {
            const m = Math.floor(callSeconds / 60).toString().padStart(2, '0');
            const s = (callSeconds % 60).toString().padStart(2, '0');
            return `${m}:${s}`;
        };

        const removeIncomingBanner = () => {
            const oldBanner = document.getElementById('incoming-call-banner');
            if (oldBanner) oldBanner.remove();
        };

        const cleanup = () => {
            setCallTyping(false);
            removeIncomingBanner();
            closeAiReplyDropdown();
            page.style.display = 'none';
            page.classList.remove('call-connected');
            if (callTimer) clearInterval(callTimer);
            if (autoConnectTimer) clearTimeout(autoConnectTimer);
            rejectBtn.onclick = null;
            acceptBtn.onclick = null;
            hangupBtn.onclick = null;
            if (callSendMsgBtn) callSendMsgBtn.onclick = null;
            if (callAiReplyBtn) callAiReplyBtn.onclick = null;
            const minimizeBtn = document.getElementById('minimize-call-btn');
            if (minimizeBtn) minimizeBtn.onclick = null;
        };

        const startConnectedCall = () => {
            callConnected = true;
            page.classList.add('call-connected');
            actionsDiv.style.display = 'none';
            inProgressDiv.style.display = 'flex';
            statusEl.textContent = '00:00';
            appendCallFeed('system', type === 'video' ? '视频通话已接通' : '语音通话已接通');
            if (callTimer) clearInterval(callTimer);
            callTimer = setInterval(() => {
                callSeconds++;
                statusEl.textContent = formatDuration();
            }, 1000);
        };

        const endCall = (reason) => {
            const desc = descInput.value.trim();
            const duration = callConnected ? formatDuration() : '00:00';
            const transcript = callHistory
                .filter(item => item && item.role !== 'system' && String(item.content || '').trim())
                .map(item => ({
                    role: item.role === 'assistant' ? 'assistant' : 'user',
                    content: String(item.content || '').trim()
                }));
            cleanup();
            if (onHangup) {
                const baseText = (callConnected && reason === '已挂断')
                    ? `通话时长 ${duration}`
                    : `${reason}${callConnected ? `\n通话时长 ${duration}` : ''}`;
                onHangup(`${baseText}${desc ? `\n最终动作: ${desc}` : ''}`, transcript);
            }
            // 通话结束后回到当前聊天页
            if (State.currentContactId) {
                const currentContact = State.contacts.find(c => c.id === State.currentContactId);
                if (currentContact) {
                    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                    showPage('chat-page');
                    restoreChatHeaderTitle();
                    renderChatMessages();
                }
            }
        };

        const openFullCallPage = (autoConnect = false) => {
            removeIncomingBanner();
            nameEl.textContent = contact.name;
            avatarEl.innerHTML = getAvatarHtml(contact.avatar);
            statusEl.textContent = direction === 'outgoing'
                ? (type === 'video' ? '正在等待对方接听视频通话...' : '正在等待对方接听语音通话...')
                : (type === 'video' ? '邀请你视频通话...' : '邀请你语音通话...');
            page.classList.remove('call-connected');
            descInput.value = '';
            page.style.display = 'flex';

            rejectBtn.onclick = () => endCall(direction === 'outgoing' ? '已取消通话' : '已拒绝');
            acceptBtn.onclick = () => startConnectedCall();
            hangupBtn.onclick = () => endCall('已挂断');

            // 我方拨出：只显示挂断，隐藏接听，并自动模拟对方接通
            if (direction === 'outgoing') {
                const acceptWrap = acceptBtn.closest('.call-action-btn');
                if (acceptWrap) acceptWrap.style.display = 'none';
                statusEl.textContent = type === 'video' ? '等待对方接听视频通话...' : '等待对方接听语音通话...';
                autoConnectTimer = setTimeout(() => {
                    const acceptWrap2 = acceptBtn.closest('.call-action-btn');
                    if (acceptWrap2) acceptWrap2.style.display = '';
                    startConnectedCall();
                }, 1500);
            } else {
                const acceptWrap = acceptBtn.closest('.call-action-btn');
                if (acceptWrap) acceptWrap.style.display = '';
            }

            if (callSendMsgBtn) {
                callSendMsgBtn.onclick = () => {
                    const text = descInput.value.trim();
                    if (!text) return;
                    appendCallFeed('user', text);
                    callHistory.push({ role: 'user', content: text });
                    descInput.value = '';
                };
            }

            if (callAiReplyBtn) {
                const buildCallAutoPrompt = () => {
                    const pendingItems = [];
                    for (let i = lastConsumedUserIndex + 1; i < callHistory.length; i++) {
                        const item = callHistory[i];
                        if (!item || item.role !== 'user') continue;
                        const content = String(item.content || '').trim();
                        if (!content) continue;
                        pendingItems.push(content);
                    }
                    const pendingUserText = pendingItems.slice(-3).join('\n');
                    const promptText = pendingUserText
                        ? `（系统）以下是用户刚刚在通话里说的话，请你统一自然接话并回复：\n${pendingUserText}`
                        : '（系统）用户现在在通话中等待你的回应。请接话或提一个自然的问题。';
                    return { promptText, pendingCount: pendingItems.length };
                };

                const trimTrailingCallAssistant = () => {
                    let removed = 0;
                    while (callHistory.length > 0) {
                        const last = callHistory[callHistory.length - 1];
                        if (!last || last.role !== 'assistant') break;
                        callHistory.pop();
                        removed += 1;
                    }
                    if (removed > 0) {
                        const items = Array.from(document.querySelectorAll('#call-live-feed .call-feed-item.ai'));
                        for (let i = items.length - 1; i >= 0 && removed > 0; i--) {
                            const el = items[i];
                            el?.remove();
                            removed -= 1;
                        }
                    }
                };

                const interruptCallAi = () => {
                    if (callAiController) {
                        try { callAiController.abort(); } catch (e) {}
                        return true;
                    }
                    return false;
                };

                const showCallAiDropdown = () => {
                    if (!callConnected) return;
                    showAiQuickDropdown({
                        title: '通话 AI 快捷',
                        running: callAiBusy,
                        interrupted: callAiInterrupted,
                        anchorEl: callAiReplyBtn,
                        onRegenerate: async () => {
                            if (!callConnected) return;
                            if (callAiBusy) interruptCallAi();
                            trimTrailingCallAssistant();
                            const { promptText, pendingCount } = buildCallAutoPrompt();
                            await talkToAIInCall(promptText);
                            if (pendingCount > 0) lastConsumedUserIndex = callHistory.length - 1;
                        },
                        onInterrupt: async () => {
                            if (!interruptCallAi()) showToast('当前没有生成任务');
                        },
                        onResume: async () => {
                            if (!callConnected) return;
                            if (!callAiLastPrompt) {
                                showToast('没有可恢复的内容');
                                return;
                            }
                            await talkToAIInCall(callAiLastPrompt);
                        }
                    });
                };

                bindLongPressAction(callAiReplyBtn, showCallAiDropdown, showCallAiDropdown, { thresholdMs: 260 });

                callAiReplyBtn.onclick = async function () {
                    if (this && this._longPressFired) {
                        this._longPressFired = false;
                        return;
                    }
                    if (!callConnected) return;
                    const { promptText, pendingCount } = buildCallAutoPrompt();
                    await talkToAIInCall(promptText);
                    if (pendingCount > 0) lastConsumedUserIndex = callHistory.length - 1;
                };
            }

            const minimizeBtn = document.getElementById('minimize-call-btn');
            if (minimizeBtn) minimizeBtn.onclick = () => endCall('已挂断');

            if (autoConnect) {
                actionsDiv.style.display = 'none';
                inProgressDiv.style.display = 'flex';
                startConnectedCall();
            } else {
                actionsDiv.style.display = 'flex';
                inProgressDiv.style.display = 'none';
            }
        };

        // 对方来电：先顶部弹条；我方拨出：直接进入等待页
        if (direction === 'outgoing') {
            openFullCallPage(false);
            return;
        }

        // 顶部来电弹条：按钮直接处理，点非按钮区域展开全屏
        const banner = document.createElement('div');
        banner.id = 'incoming-call-banner';
        banner.className = 'incoming-call-banner';
        banner.innerHTML = `
            <div class="incoming-call-main">
                <div class="incoming-call-avatar">${getAvatarHtml(contact.avatar)}</div>
                <div class="incoming-call-text">
                    <div class="incoming-call-name">${escapeHtml(contact.name)}</div>
                    <div class="incoming-call-desc">
                        <span class="incoming-call-chip">${type === 'video' ? '视频' : '语音'}</span>
                        <span class="incoming-call-desc-text">${type === 'video' ? '视频通话来电' : '语音通话来电'}</span>
                    </div>
                </div>
            </div>
            <div class="incoming-call-actions">
                <button class="incoming-call-icon-btn reject" id="incoming-call-reject" type="button" aria-label="挂断">
                    <i class="fas fa-phone-slash"></i>
                </button>
                <button class="incoming-call-icon-btn accept" id="incoming-call-accept" type="button" aria-label="接听">
                    <i class="fas fa-phone"></i>
                </button>
            </div>
        `;
        document.body.appendChild(banner);

        banner.addEventListener('click', (e) => {
            if (e.target.closest('.incoming-call-icon-btn')) return;
            openFullCallPage(false);
        });
        banner.querySelector('#incoming-call-reject')?.addEventListener('click', () => endCall('已拒绝'));
        banner.querySelector('#incoming-call-accept')?.addEventListener('click', () => openFullCallPage(true));
    }
};

// ==========================================
// 聊天功能
// ==========================================

function openChat(contact) {
    State.currentContactId = contact.id;
    if (contact) {
        contact.unreadCount = 0;
        Storage.saveContacts(State.contacts);
        initChatList();
    }
    if (contact?.id) {
        const pageSize = Math.max(10, parseInt(State.chatUi?.pageSize ?? 50, 10) || 50);
        if (!State.chatUi) State.chatUi = { visibleCount: {}, pageSize };
        if (!State.chatUi.visibleCount) State.chatUi.visibleCount = {};
        State.chatUi.visibleCount[contact.id] = pageSize;
    }

    // 切换到聊天页
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    showPage('chat-page');

    // 设置标题
    restoreChatHeaderTitle();

    applyChatBackground(contact);

    // 渲染聊天记录
    renderChatMessages();
}

function applyChatBackground(contact) {
    const container = document.getElementById('chat-messages');
    if (!container) return;
    const bg = contact?.chatBackground;
    container.style.background = '';
    container.style.backgroundImage = '';
    container.style.backgroundSize = '';
    container.style.backgroundPosition = '';
    container.style.backgroundRepeat = '';
    if (!bg || bg.type === 'default') return;

    if (bg.type === 'color') {
        container.style.background = bg.value;
    } else if (bg.type === 'image' && bg.value) {
        container.style.backgroundImage = `url("${bg.value}")`;
        container.style.backgroundSize = 'cover';
        container.style.backgroundPosition = 'center';
        container.style.backgroundRepeat = 'no-repeat';
    }
}

function restoreChatHeaderTitle() {
    const titleEl = document.getElementById('chat-contact-name');
    if (!titleEl) return;
    const contact = State.contacts.find(c => c.id === State.currentContactId);
    titleEl.textContent = getContactDisplayName(contact);
}

let currentSearchContactId = null;

function openChatSearchPage(contact) {
    currentSearchContactId = contact.id;
    showPage('chat-search-page');
    const input = document.getElementById('chat-search-input');
    if (input) {
        input.value = '';
        input.focus();
    }
    renderChatSearchResults('');
}

function extractSearchableText(raw) {
    if (!raw) return '';
    try {
        const parsed = JSON.parse(raw);
        if (parsed?.type === 'text') return parsed.content || '';
        if (parsed?.type === 'image') return parsed.description || '';
        if (parsed?.type === 'quote') return `${parsed.quote || ''}\n${parsed.content || ''}`;
        if (parsed?.type === 'sticker_message') {
            const v = parsed.sticker || '';
            if (/^https?:\/\//i.test(v)) return `[表情] ${v}`;
            return STICKER_MAP[v] || v || '[表情]';
        }
        return raw;
    } catch (e) {
        return raw;
    }
}

function renderChatSearchResults(query) {
    const box = document.getElementById('chat-search-results');
    if (!box) return;
    const q = (query || '').trim();
    if (!currentSearchContactId) {
        box.innerHTML = '';
        return;
    }

    const history = State.chatHistories[currentSearchContactId] || [];
    if (!q) {
        box.innerHTML = '<div style="padding: 26px 10px; text-align:center; color:#999; font-size:13px;">输入关键词开始搜索</div>';
        return;
    }

    const lower = q.toLowerCase();
    const results = [];
    history.forEach((msg, idx) => {
        const text = extractSearchableText(msg.content);
        if ((text || '').toLowerCase().includes(lower)) {
            results.push({ idx, role: msg.role, text });
        }
    });

    if (results.length === 0) {
        box.innerHTML = '<div style="padding: 26px 10px; text-align:center; color:#999; font-size:13px;">没有找到相关内容</div>';
        return;
    }

    box.innerHTML = '';
    results.slice(0, 80).forEach((r) => {
        const div = document.createElement('div');
        div.className = 'chat-search-item';
        const title = r.role === 'user' ? '我' : (r.role === 'assistant' ? '对方' : '系统');
        div.innerHTML = `
            <div class="chat-search-item-title">${escapeHtml(title)}</div>
            <div class="chat-search-item-snippet">${escapeHtml(r.text).replace(/\n/g, ' ')}</div>
        `;
        div.addEventListener('click', () => {
            hidePage('chat-search-page');
            const contact = State.contacts.find(c => c.id === currentSearchContactId);
            if (contact) {
                openChat(contact);
                const all = State.chatHistories[currentSearchContactId] || [];
                const total = all.length;
                const pageSize = Math.max(10, parseInt(State.chatUi?.pageSize ?? 50, 10) || 50);
                const required = Math.max(pageSize, total - r.idx);
                const rounded = Math.min(total, Math.ceil(required / pageSize) * pageSize);
                if (!State.chatUi) State.chatUi = { visibleCount: {}, pageSize };
                if (!State.chatUi.visibleCount) State.chatUi.visibleCount = {};
                State.chatUi.visibleCount[contact.id] = rounded;
                renderChatMessages({ preserveScroll: true });
                setTimeout(() => {
                    const target = document.querySelector(`#chat-messages .message-bubble[data-index="${r.idx}"]`);
                    if (target) target.scrollIntoView({ block: 'center' });
                }, 60);
            }
        });
        box.appendChild(div);
    });
}

function openChatBgPage(contact) {
    showPage('chat-bg-page');
    renderChatBgGrid(contact);
}

function renderChatBgGrid(contact) {
    const grid = document.getElementById('chat-bg-grid');
    if (!grid) return;
    const presets = [
        { type: 'default', value: '', label: '默认', swatch: '#f0f0f0' },
        { type: 'color', value: '#f0f0f0', label: '浅灰', swatch: '#f0f0f0' },
        { type: 'color', value: '#ffffff', label: '白色', swatch: '#ffffff' },
        { type: 'color', value: 'linear-gradient(180deg,#f7fbe9 0%,#ffffff 60%)', label: '淡绿', swatch: 'linear-gradient(180deg,#f7fbe9 0%,#ffffff 60%)' },
        { type: 'color', value: 'linear-gradient(180deg,#eef6ff 0%,#ffffff 60%)', label: '淡蓝', swatch: 'linear-gradient(180deg,#eef6ff 0%,#ffffff 60%)' },
        { type: 'color', value: 'linear-gradient(180deg,#fff3f3 0%,#ffffff 60%)', label: '淡粉', swatch: 'linear-gradient(180deg,#fff3f3 0%,#ffffff 60%)' }
    ];

    const current = contact.chatBackground || { type: 'default', value: '' };
    grid.innerHTML = '';
    presets.forEach((p) => {
        const item = document.createElement('div');
        item.className = 'chat-bg-swatch';
        if (current.type === p.type && String(current.value || '') === String(p.value || '')) item.classList.add('active');
        item.style.background = p.swatch;
        item.title = p.label;
        item.addEventListener('click', () => {
            contact.chatBackground = { type: p.type, value: p.value };
            Storage.saveContacts(State.contacts);
            applyChatBackground(contact);
            renderChatBgGrid(contact);
            showToast('已设置');
        });
        grid.appendChild(item);
    });
}

function hydrateChatMorePage(contact) {
    const avatarEl = document.getElementById('chat-more-avatar');
    const nameEl = document.getElementById('chat-more-name');
    if (avatarEl) avatarEl.innerHTML = getAvatarHtml(contact.avatar);
    if (nameEl) nameEl.textContent = getContactDisplayName(contact);

    const userAvatarEl = document.getElementById('chat-more-user-avatar');
    const userNameEl = document.getElementById('chat-more-user-name');
    const u = getUserProfileForContact(contact);
    if (userAvatarEl) userAvatarEl.innerHTML = getAvatarHtml(u.avatar);
    if (userNameEl) userNameEl.textContent = u.nickname || '我';

    const autoToggle = document.getElementById('chat-auto-message-toggle');
    const remarkValueEl = document.getElementById('chat-remark-value');
    const userRemarkValueEl = document.getElementById('chat-user-remark-value');
    const intervalValueEl = document.getElementById('chat-auto-message-interval-value');
    const intervalCell = document.getElementById('chat-auto-message-interval-cell');
    const blacklistToggle = document.getElementById('chat-blacklist-toggle');
    const muteToggle = document.getElementById('chat-mute-toggle');
    const pinToggle = document.getElementById('chat-pin-toggle');
    const aiPatToggle = document.getElementById('chat-ai-pat-toggle');
    const aiRecallToggle = document.getElementById('chat-ai-recall-toggle');
    const patSuffixValueEl = document.getElementById('chat-pat-suffix-value');
    const patIncomingValueEl = document.getElementById('chat-pat-incoming-value');

    if (autoToggle) autoToggle.classList.toggle('active', !!contact.autoMessageEnabled);
    if (remarkValueEl) remarkValueEl.textContent = String(contact.remarkName || '').trim() || '未设置';
    if (userRemarkValueEl) userRemarkValueEl.textContent = String(contact.userRemarkName || '').trim() || '未设置';
    if (intervalValueEl) intervalValueEl.textContent = `${contact.autoMessageIntervalMin ?? 30} 分钟`;
    if (intervalCell) intervalCell.classList.toggle('disabled', !contact.autoMessageEnabled);
    if (blacklistToggle) blacklistToggle.classList.toggle('active', !!contact.isBlocked);
    if (muteToggle) muteToggle.classList.toggle('active', !!contact.muteNotifications);
    if (pinToggle) pinToggle.classList.toggle('active', !!contact.isPinned);
    if (aiPatToggle) aiPatToggle.classList.toggle('active', contact.aiPatEnabled !== false);
    if (aiRecallToggle) aiRecallToggle.classList.toggle('active', contact.aiRecallEnabled !== false);
    const outgoingSuffix = String(contact?.patSuffixOutgoing ?? contact?.patSuffix ?? '').trim() || '一下';
    const incomingSuffix = String(contact?.patSuffixIncoming ?? contact?.patSuffix ?? '').trim() || '一下';
    if (patSuffixValueEl) patSuffixValueEl.textContent = outgoingSuffix;
    if (patIncomingValueEl) patIncomingValueEl.textContent = incomingSuffix;

    const momentsCountEl = document.getElementById('chat-more-moments-count');
    if (momentsCountEl) {
        const id = String(contact?.id || '');
        const count = normalizeMomentsData(State.moments).filter(m => m?.author?.type === 'contact' && String(m.author.id || '') === id).length;
        momentsCountEl.textContent = `${count} 条`;
    }
}

function setTypingIndicator(text = '正在输入中...') {
    const indicator = document.getElementById('typing-indicator');
    const textEl = document.getElementById('typing-indicator-text');
    if (textEl) textEl.textContent = text;
    if (indicator) indicator.style.display = 'none';
    const titleEl = document.getElementById('chat-contact-name');
    if (titleEl) titleEl.textContent = text;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.style.display = 'none';
    restoreChatHeaderTitle();
}

function bindChatEvents() {
    bindMessageContextMenu();
    bindSystemMessageEvents();
    const messagesEl = document.getElementById('chat-messages');
    if (messagesEl && messagesEl.dataset.patAvatarBound !== '1') {
        messagesEl.dataset.patAvatarBound = '1';
        const tapState = { at: 0, key: '' };
        let lastTriggerAt = 0;
        const runPat = async () => {
            const now = Date.now();
            if (now - lastTriggerAt < 450) return;
            lastTriggerAt = now;
            if (!State.currentContactId) return;
            const contact = State.contacts.find(c => c.id === State.currentContactId);
            if (!contact) return;
            const display = triggerPatEvent(contact, 'user');
            if (!display) return;
            showToast('已拍一拍');
            await fetchAIResponse(contact, { allowMoneyActions: true });
        };
        messagesEl.addEventListener('dblclick', (e) => {
            const avatar = e.target.closest('.message-avatar');
            if (!avatar) return;
            const row = avatar.closest('.message-row');
            if (!row || !row.classList.contains('left')) return;
            tapState.at = 0;
            tapState.key = '';
            runPat();
        });
        messagesEl.addEventListener('touchend', (e) => {
            const avatar = e.target.closest('.message-avatar');
            if (!avatar) return;
            const row = avatar.closest('.message-row');
            if (!row || !row.classList.contains('left')) return;
            const bubble = row.querySelector('.message-bubble');
            const idx = bubble ? String(bubble.dataset.index || '') : '';
            const key = `${State.currentContactId || ''}:${idx}:left`;
            const now = Date.now();
            if (tapState.key === key && now - tapState.at <= 320) {
                tapState.at = 0;
                tapState.key = '';
                runPat();
                return;
            }
            tapState.at = now;
            tapState.key = key;
        }, { passive: true });
    }
    // 返回
    document.getElementById('chat-back-btn')?.addEventListener('click', () => {
        hidePage('chat-page');
        document.getElementById('wechat-tab')?.classList.add('active');
        State.currentContactId = null;
        initChatList();
    });

    document.getElementById('chat-more-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        showPage('chat-more-page');
        hydrateChatMorePage(contact);
    });

    document.getElementById('chat-more-back-btn')?.addEventListener('click', () => {
        hidePage('chat-more-page');
    });

    document.getElementById('chat-more-contact-card')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        openRoleModal(contact);
    });

    document.getElementById('chat-more-user-card')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        openChatUserOverridePage(contact);
    });

    document.getElementById('chat-more-moments-cell')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        hidePage('chat-more-page');
        showPage('contact-moments-page');
        renderContactMomentsPage(contact.id);
    });

    document.getElementById('chat-more-moments-generate-cell')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        generateAndPostContactMoment(State.currentContactId);
    });

    document.getElementById('chat-remark-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const currentRemark = String(contact.remarkName || '').trim();
        const val = await WeChatUI.showPrompt('设置备注', '输入备注名（留空清除）', currentRemark);
        if (val === null) return;
        const nextRemark = String(val || '').trim();
        if (nextRemark) {
            contact.remarkName = nextRemark;
        } else {
            delete contact.remarkName;
        }
        Storage.saveContacts(State.contacts);
        initChatList();
        initContactsList();
        restoreChatHeaderTitle();
        hydrateChatMorePage(contact);
        pushSystemMessageToHistory(contact.id, nextRemark ? `你已将对方备注为「${nextRemark}」` : '你已清除对方备注');
    });

    document.getElementById('chat-user-remark-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const currentRemark = String(contact.userRemarkName || '').trim();
        const val = await WeChatUI.showPrompt('对方给我的备注', '输入对方给你的备注（留空清除）', currentRemark);
        if (val === null) return;
        const nextRemark = String(val || '').trim();
        if (nextRemark) {
            contact.userRemarkName = nextRemark;
        } else {
            delete contact.userRemarkName;
        }
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        pushSystemMessageToHistory(contact.id, nextRemark ? `你已将「对方给你的备注」设置为「${nextRemark}」` : '你已清除「对方给你的备注」');
    });

    document.getElementById('chat-pat-suffix-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const currentValue = String(contact?.patSuffixOutgoing ?? contact?.patSuffix ?? '').trim() || '一下';
        const val = await WeChatUI.showPrompt('我拍了拍对方', '请输入后缀，例如：一下、的脑袋、的肩膀', currentValue);
        if (val === null) return;
        contact.patSuffixOutgoing = String(val || '').trim() || '一下';
        contact.patSuffix = contact.patSuffixOutgoing;
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        showToast('已保存');
    });

    document.getElementById('chat-pat-incoming-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const currentValue = String(contact?.patSuffixIncoming ?? contact?.patSuffix ?? '').trim() || '一下';
        const val = await WeChatUI.showPrompt('对方拍了拍我', '请输入后缀，例如：并被我踢飞了、一下、的肩膀', currentValue);
        if (val === null) return;
        contact.patSuffixIncoming = String(val || '').trim() || '一下';
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        showToast('已保存');
    });

    document.getElementById('chat-pat-now-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const eventText = triggerPatEvent(contact, 'user');
        if (!eventText) return;
        showToast('已拍一拍');
        await fetchAIResponse(contact, { allowMoneyActions: true });
    });

    document.getElementById('chat-ai-pat-toggle')?.addEventListener('click', function () {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        this.classList.toggle('active');
        contact.aiPatEnabled = this.classList.contains('active');
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        showToast('已保存');
    });

    document.getElementById('chat-ai-recall-toggle')?.addEventListener('click', function () {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        this.classList.toggle('active');
        contact.aiRecallEnabled = this.classList.contains('active');
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        showToast('已保存');
    });

    document.getElementById('contact-moments-back-btn')?.addEventListener('click', () => {
        hidePage('contact-moments-page');
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        showPage('chat-more-page');
        hydrateChatMorePage(contact);
    });

    document.getElementById('contact-moments-generate-btn')?.addEventListener('click', () => {
        const id = String(renderContactMomentsPage._contactId || State.currentContactId || '').trim();
        if (!id) return;
        generateAndPostContactMoment(id);
    });

    document.getElementById('contact-moments-auto-reply-btn')?.addEventListener('click', () => {
        const id = String(renderContactMomentsPage._contactId || State.currentContactId || '').trim();
        if (!id) return;
        runContactMomentsAutoReply(id);
    });

    const openChatUserOverridePage = (contact) => {
        const page = document.getElementById('chat-user-override-page');
        const nicknameEl = document.getElementById('chat-override-nickname');
        const wxidEl = document.getElementById('chat-override-wxid');
        const avatarValEl = document.getElementById('chat-override-avatar-value');
        const avatarUrlEl = document.getElementById('chat-override-avatar-url');
        const avatarPreviewEl = document.getElementById('chat-override-avatar-preview');
        const personaEl = document.getElementById('chat-override-persona');
        
        if (!page || !nicknameEl || !wxidEl || !avatarValEl) return;
        
        const override = contact.userOverride || {};
        nicknameEl.value = String(override.nickname || '');
        wxidEl.value = String(override.wxid || '');
        
        const avatar = String(override.avatar || '');
        avatarValEl.value = avatar;
        if (avatarUrlEl) avatarUrlEl.value = avatar.startsWith('data:') ? '' : avatar;
        if (avatarPreviewEl) avatarPreviewEl.innerHTML = getAvatarHtml(avatar || 'user');
        
        if (personaEl) personaEl.value = String(override.userPersona || '');
        
        // Gender
        const gender = String(override.gender || '');
        document.querySelectorAll('#chat-user-override-page .gender-option').forEach(opt => {
            opt.classList.toggle('selected', opt.dataset.gender === gender);
        });

        showPage('chat-user-override-page');
    };

    document.querySelectorAll('#chat-user-override-page .gender-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('#chat-user-override-page .gender-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
        });
    });

    const chatAvatarUpload = document.getElementById('chat-override-avatar-upload');
    if (chatAvatarUpload) {
        chatAvatarUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const b64 = ev.target.result;
                document.getElementById('chat-override-avatar-value').value = b64;
                document.getElementById('chat-override-avatar-preview').innerHTML = getAvatarHtml(b64);
                document.getElementById('chat-override-avatar-url').value = '';
            };
            reader.readAsDataURL(file);
        });
    }

    const chatAvatarUrl = document.getElementById('chat-override-avatar-url');
    if (chatAvatarUrl) {
        chatAvatarUrl.addEventListener('input', (e) => {
            const val = e.target.value.trim();
            document.getElementById('chat-override-avatar-value').value = val;
            document.getElementById('chat-override-avatar-preview').innerHTML = getAvatarHtml(val || 'user');
        });
    }

    document.getElementById('chat-user-override-back-btn')?.addEventListener('click', () => {
        hidePage('chat-user-override-page');
    });

    document.getElementById('reset-chat-override-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        delete contact.userOverride;
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        renderChatMessages();
        hidePage('chat-user-override-page');
        showToast('已恢复默认');
    });

    document.getElementById('save-chat-override-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        
        const nickname = String(document.getElementById('chat-override-nickname')?.value || '').trim();
        const wxid = String(document.getElementById('chat-override-wxid')?.value || '').trim();
        const avatar = String(document.getElementById('chat-override-avatar-value')?.value || '').trim();
        const userPersona = String(document.getElementById('chat-override-persona')?.value || '').trim();
        const genderOpt = document.querySelector('#chat-user-override-page .gender-option.selected');
        const gender = genderOpt ? genderOpt.dataset.gender : '';

        if (!nickname && !wxid && !avatar && !userPersona && !gender) {
            delete contact.userOverride;
        } else {
            contact.userOverride = { nickname, wxid, avatar, userPersona, gender };
        }
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        renderChatMessages();
        hidePage('chat-user-override-page');
        showToast('已保存');
    });

    document.getElementById('chat-auto-message-toggle')?.addEventListener('click', function () {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        this.classList.toggle('active');
        contact.autoMessageEnabled = this.classList.contains('active');
        if (contact.autoMessageEnabled) {
            const intervalMin = Math.max(1, Math.min(1440, parseInt(contact.autoMessageIntervalMin ?? 30, 10) || 30));
            contact.autoMessageIntervalMin = intervalMin;
            contact.nextAutoMessageAt = Date.now() + intervalMin * 60 * 1000;
        } else {
            contact.nextAutoMessageAt = null;
        }
        Storage.saveContacts(State.contacts);
        hydrateChatMorePage(contact);
        showToast('已保存');
    });
    document.getElementById('chat-blacklist-toggle')?.addEventListener('click', function () {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        this.classList.toggle('active');
        contact.isBlocked = this.classList.contains('active');
        Storage.saveContacts(State.contacts);
        showToast(contact.isBlocked ? '已加入黑名单' : '已移出黑名单');
    });

    const openIntervalModal = () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        if (!contact.autoMessageEnabled) return;
        const modal = document.getElementById('chat-auto-interval-modal');
        const input = document.getElementById('chat-auto-interval-input');
        if (input) input.value = String(contact.autoMessageIntervalMin ?? 30);
        modal?.classList.add('show');
    };

    const closeIntervalModal = () => {
        document.getElementById('chat-auto-interval-modal')?.classList.remove('show');
    };

    document.getElementById('chat-auto-message-interval-cell')?.addEventListener('click', openIntervalModal);
    document.getElementById('chat-auto-interval-cancel')?.addEventListener('click', closeIntervalModal);
    document.getElementById('chat-auto-interval-overlay')?.addEventListener('click', closeIntervalModal);
    document.getElementById('chat-auto-interval-confirm')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const val = parseInt(document.getElementById('chat-auto-interval-input')?.value || '30', 10) || 30;
        contact.autoMessageIntervalMin = Math.max(1, Math.min(1440, val));
        if (contact.autoMessageEnabled) {
            contact.nextAutoMessageAt = Date.now() + contact.autoMessageIntervalMin * 60 * 1000;
        }
        Storage.saveContacts(State.contacts);
        initChatList();
        hydrateChatMorePage(contact);
        closeIntervalModal();
        showToast('已保存');
    });

    document.getElementById('chat-delete-friend-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const ok = await WeChatUI.showConfirm('删除好友', `确定删除好友「${contact.name}」吗？聊天记录也将被删除。`, '删除', '取消', true);
        if (!ok) return;
        State.contacts = State.contacts.filter(c => c.id !== contact.id);
        delete State.chatHistories[contact.id];
        Storage.saveContacts(State.contacts);
        Storage.saveChatHistories(State.chatHistories);
        State.currentContactId = null;
        initChatList();
        hardSwitchToMainTab('wechat-tab');
        showToast('已删除');
    });

    document.getElementById('chat-search-cell')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        openChatSearchPage(contact);
    });

    document.getElementById('chat-search-back-btn')?.addEventListener('click', () => {
        hidePage('chat-search-page');
    });
    document.getElementById('chat-search-cancel-btn')?.addEventListener('click', () => {
        const input = document.getElementById('chat-search-input');
        if (input) input.value = '';
        renderChatSearchResults('');
        hidePage('chat-search-page');
    });
    document.getElementById('chat-search-input')?.addEventListener('input', (e) => {
        renderChatSearchResults(e.target.value);
    });

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages && !chatMessages.dataset.wxMoneyBound) {
        chatMessages.dataset.wxMoneyBound = '1';
        const handleWxMoneyTap = (e) => {
            const node = (e && e.target && e.target.nodeType === 1) ? e.target : e.target?.parentElement;
            const bubble = node?.closest?.('.message-bubble');
            if (!bubble) return;
            const kind = bubble.dataset.wxMoneyKind || '';
            if (!kind) return;
            if (document.getElementById('chat-page')?.classList?.contains('multi-select-mode')) {
                return;
            }
            const suppressUntil = parseInt(bubble.dataset.wxTapSuppressUntil || '0', 10);
            if ((bubble && bubble._longPressFired) || (suppressUntil && Date.now() < suppressUntil)) {
                try { bubble._longPressFired = false; } catch (err) {}
                try { if (e && e.cancelable) e.preventDefault(); } catch (err) {}
                try { e?.stopPropagation?.(); } catch (err) {}
                try { e?.stopImmediatePropagation?.(); } catch (err) {}
                return;
            }
            const side = bubble.dataset.side || (bubble.closest('.message-row')?.classList.contains('right') ? 'right' : 'left');
            const idx = parseInt(bubble.dataset.index || '-1', 10);
            const wxText = bubble.dataset.wxMoneyText || '';
            if (!wxText) return;
            if (kind === 'redpacket') {
                showRedPacketDetail(wxText, side, Number.isNaN(idx) ? -1 : idx);
            } else if (kind === 'transfer') {
                showTransferDetail(wxText, side, Number.isNaN(idx) ? -1 : idx);
            }
        };
        const handleWxMoneyContextMenu = (e) => {
            const node = (e && e.target && e.target.nodeType === 1) ? e.target : e.target?.parentElement;
            const bubble = node?.closest?.('.message-bubble');
            if (!bubble) return;
            const kind = bubble.dataset.wxMoneyKind || '';
            if (!kind) return;
            const idx = parseInt(bubble.dataset.index || '-1', 10);
            if (!Number.isFinite(idx) || idx < 0) return;
            const side = bubble.dataset.side || (bubble.closest('.message-row')?.classList.contains('right') ? 'right' : 'left');
            try { bubble._longPressFired = true; } catch (err) {}
            try { bubble.dataset.wxTapSuppressUntil = String(Date.now() + 1200); } catch (err) {}
            try { if (e && e.cancelable) e.preventDefault(); } catch (err) {}
            try { e?.stopPropagation?.(); } catch (err) {}
            try { e?.stopImmediatePropagation?.(); } catch (err) {}
            showContextMenu(e, idx, side);
        };
        chatMessages.addEventListener('click', handleWxMoneyTap, true);
        chatMessages.addEventListener('touchend', handleWxMoneyTap, true);
        chatMessages.addEventListener('pointerup', handleWxMoneyTap, true);
        chatMessages.addEventListener('contextmenu', handleWxMoneyContextMenu, true);
    }

    document.getElementById('chat-mute-toggle')?.addEventListener('click', function () {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        this.classList.toggle('active');
        contact.muteNotifications = this.classList.contains('active');
        Storage.saveContacts(State.contacts);
        showToast(contact.muteNotifications ? '已开启免打扰' : '已关闭免打扰');
    });

    document.getElementById('chat-pin-toggle')?.addEventListener('click', function () {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        this.classList.toggle('active');
        contact.isPinned = this.classList.contains('active');
        Storage.saveContacts(State.contacts);
        initChatList();
        showToast(contact.isPinned ? '已置顶' : '已取消置顶');
    });

    document.getElementById('chat-bg-cell')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        openChatBgPage(contact);
    });

    document.getElementById('chat-memory-cell')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        showPage('memory-view-page');
        loadMemoryView(contact);
    });

    document.getElementById('chat-prompt-view-cell')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        showPage('prompt-view-page');
        const content = State.lastSentSystemPrompt[contact.id];
        const contentEl = document.getElementById('prompt-view-content');
        const emptyEl = document.getElementById('prompt-view-empty');
        const tokenEl = document.getElementById('prompt-view-token-badge');
        if (content) {
            contentEl.textContent = content;
            contentEl.style.display = 'block';
            emptyEl.style.display = 'none';
            if (tokenEl) tokenEl.textContent = `≈${estimateTokens(content)} tokens`;
        } else {
            contentEl.style.display = 'none';
            emptyEl.style.display = 'block';
            if (tokenEl) tokenEl.textContent = 'Tokens: -';
        }
    });

    document.getElementById('prompt-view-back-btn')?.addEventListener('click', () => {
        hidePage('prompt-view-page');
    });

    document.getElementById('memory-view-back-btn')?.addEventListener('click', () => {
        hidePage('memory-view-page');
    });

    document.getElementById('memory-vectorize-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) {
            showToast('请先进入某个聊天');
            return;
        }
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        vectorizeSummariesForContact(contact).catch(() => {
            showToast('向量化失败');
        });
    });
    document.getElementById('chat-bg-back-btn')?.addEventListener('click', () => {
        hidePage('chat-bg-page');
    });
    document.getElementById('chat-bg-reset-cell')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        contact.chatBackground = { type: 'default', value: '' };
        Storage.saveContacts(State.contacts);
        applyChatBackground(contact);
        renderChatBgGrid(contact);
        showToast('已恢复默认');
    });
    document.getElementById('chat-bg-upload-cell')?.addEventListener('click', () => {
        document.getElementById('chat-bg-upload')?.click();
    });
    document.getElementById('chat-bg-upload')?.addEventListener('change', (e) => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (evt) => {
            contact.chatBackground = { type: 'image', value: evt.target.result };
            Storage.saveContacts(State.contacts);
            applyChatBackground(contact);
            renderChatBgGrid(contact);
            showToast('已设置');
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    });

    document.getElementById('chat-bg-url-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const current = contact?.chatBackground?.type === 'image' ? String(contact.chatBackground.value || '') : '';
        const url = await WeChatUI.showPrompt('背景图片URL', '输入图片URL（http(s):// 或 base64）', current);
        if (url == null) return;
        const val = String(url || '').trim();
        if (!val) return;
        contact.chatBackground = { type: 'image', value: val };
        Storage.saveContacts(State.contacts);
        applyChatBackground(contact);
        renderChatBgGrid(contact);
        showToast('已设置');
    });

    document.getElementById('chat-clear-history-cell')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const ok = await WeChatUI.showConfirm('清空聊天记录', '确定清空聊天记录吗？清空后不可恢复。', '清空', '取消', true);
        if (!ok) return;
        State.chatHistories[contact.id] = [];
        contact.lastMessage = '';
        contact.lastTime = '';
        contact.lastActiveAt = 0;
        Storage.saveChatHistories(State.chatHistories);
        Storage.saveContacts(State.contacts);
        renderChatMessages();
        initChatList();
        showToast('已清空');
    });

    // 发送消息
    const sendBtn = document.getElementById('send-message-btn');
    const input = document.getElementById('message-input');
    const chatModelSwitchBtn = document.getElementById('chat-model-switch-btn');
    const chatModelDropdown = document.getElementById('chat-model-dropdown');
    const plusBtn = document.getElementById('chat-plus-btn');

    const setChatInputBusy = (busy, text) => {
        if (input) input.disabled = !!busy;
        if (sendBtn) sendBtn.disabled = !!busy;
        if (plusBtn) plusBtn.style.pointerEvents = busy ? 'none' : '';
        if (busy && text) setTypingIndicator(text);
        if (!busy) hideTypingIndicator();
    };

    const sendMessage = async () => {
        if (sendMessage._busy) return;
        const text = input.value.trim();
        if (!text || !State.currentContactId) return;
        if (State.summaryBusy?.[State.currentContactId]) {
            showToast('正在归档记忆，稍后再发');
            return;
        }

        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        const userProfile = getUserProfileForContact(contact);
        sendMessage._busy = true;

        try {
            let messageContent = text;
            let lastMessagePreview = text;
            const replyDraft = window.getReplyDraft?.();
            if (replyDraft && replyDraft.quote) {
                messageContent = JSON.stringify({
                    type: 'quote',
                    quote: replyDraft.quote,
                    content: text
                });
                lastMessagePreview = `[引用] ${text}`;
            }

            if (!State.chatHistories[State.currentContactId]) {
                State.chatHistories[State.currentContactId] = [];
            }
            const nowTs = Date.now();
            State.chatHistories[State.currentContactId].push({
                role: 'user',
                content: messageContent,
                time: nowTs
            });
            const msgIndex = State.chatHistories[State.currentContactId].length - 1;

            addMessageToUI(messageContent, 'right', userProfile.avatar, msgIndex);
            input.value = '';
            if (String(input?.tagName || '').toUpperCase() === 'TEXTAREA') {
                input.style.height = '';
            }
            window.clearReplyDraft?.();

            sendBtn.style.display = 'none';
            plusBtn.style.display = 'flex';

            contact.lastMessage = lastMessagePreview;
            const now = new Date();
            contact.lastTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            contact.lastActiveAt = nowTs;

            Storage.saveChatHistories(State.chatHistories);
            Storage.saveContacts(State.contacts);
            if (State.currentContactId) renderChatMessages();

            if (State.summaryConfig?.enabled) {
                const threshold = Math.max(1, parseInt(State.summaryConfig.threshold ?? 300, 10) || 300);
                if (getHistoryUnitCount(State.chatHistories[State.currentContactId]) >= threshold) {
                    State.summaryBusy[State.currentContactId] = true;
                    addSystemMessage('历史消息达到阈值，正在归档记忆...');
                    setChatInputBusy(true, '正在归档记忆...');
                    try {
                        await triggerAutoSummary(contact);
                    } finally {
                        State.summaryBusy[State.currentContactId] = false;
                        setChatInputBusy(false);
                    }
                }
            }
        } finally {
            sendMessage._busy = false;
        }
    };

    sendBtn?.addEventListener('click', sendMessage);
    const autoResizeChatInput = () => {
        if (!input || String(input.tagName || '').toUpperCase() !== 'TEXTAREA') return;
        input.style.height = 'auto';
        const maxH = 140;
        const nextH = Math.max(40, Math.min(maxH, input.scrollHeight || 40));
        input.style.height = `${nextH}px`;
        input.style.overflowY = (input.scrollHeight || 0) > maxH ? 'auto' : 'hidden';
    };
    autoResizeChatInput();
    input?.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return;
        if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    chatModelSwitchBtn?.addEventListener('click', () => {
        if (plusPanel) plusPanel.classList.remove('show');
        if (stickerPanel) stickerPanel.classList.remove('show');
        toggleChatModelDropdown();
    });
    chatModelDropdown?.addEventListener('mousedown', (e) => {
        e.stopPropagation();
    });
    updateChatModelSwitchButton();

    // 输入框变化显示/隐藏发送按钮
    const stickerBtn = document.querySelector('.input-icon svg circle[cx="15.5"]')?.closest('button');
    const stickerPanel = document.getElementById('chat-sticker-panel');

    input?.addEventListener('input', () => {
        autoResizeChatInput();
        if (input.value.trim()) {
            sendBtn.style.display = 'block';
            plusBtn.style.display = 'none';
        } else {
            sendBtn.style.display = 'none';
            plusBtn.style.display = 'flex';
        }
    });

    // 表情面板控制
    if (stickerBtn) {
        stickerBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (stickerPanel) {
                if (stickerPanel.classList.contains('show')) {
                    stickerPanel.classList.remove('show');
                } else {
                    stickerPanel.classList.add('show');
                    if (plusPanel) plusPanel.classList.remove('show');
                    initChatStickerPanel();
                    setTimeout(scrollToBottom, 50);
                }
            }
        });
    }

    // 加号菜单控制
    const plusPanel = document.getElementById('chat-plus-panel');
    
    // 使用 mousedown 可以在 blur/click 之前拦截到，避免手机端点击冲突
    if (plusBtn) {
        plusBtn.addEventListener('mousedown', (e) => {
            e.preventDefault(); // 阻止默认的获取焦点等行为
            e.stopPropagation(); // 阻止冒泡
            if (plusPanel) {
                if (plusPanel.classList.contains('show')) {
                    plusPanel.classList.remove('show');
                } else {
                    plusPanel.classList.add('show');
                    if (stickerPanel) stickerPanel.classList.remove('show');
                    setTimeout(scrollToBottom, 50);
                }
            }
        });
    }

    // 点击全局区域隐藏面板
    document.addEventListener('mousedown', (e) => {
        if (plusPanel && plusPanel.classList.contains('show')) {
            if (!e.target.closest('#chat-plus-panel')) {
                plusPanel.classList.remove('show');
            }
        }
        if (stickerPanel && stickerPanel.classList.contains('show')) {
            if (!e.target.closest('#chat-sticker-panel')) {
                stickerPanel.classList.remove('show');
            }
        }
        if (isChatModelDropdownOpen()) {
            if (!e.target.closest('#chat-model-dropdown') && !e.target.closest('#chat-model-switch-btn')) {
                closeChatModelDropdown();
            }
        }
        if (isAiReplyDropdownOpen()) {
            if (!e.target.closest('#ai-reply-dropdown') && !e.target.closest('#batch-reply-btn') && !e.target.closest('#call-ai-reply-btn')) {
                closeAiReplyDropdown();
            }
        }
    });
    
    input?.addEventListener('focus', () => {
        if (plusPanel) plusPanel.classList.remove('show');
        if (stickerPanel) stickerPanel.classList.remove('show');
        closeChatModelDropdown();
        closeAiReplyDropdown();
    });

    document.getElementById('sticker-manage-entry-btn')?.addEventListener('click', () => {
        toggleChatStickerManageMode();
    });

    const batchReplyBtn = document.getElementById('batch-reply-btn');
    bindLongPressAction(batchReplyBtn, () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        if (contact.isBlocked) {
            showToast('已加入黑名单');
            return;
        }
        if (plusPanel) plusPanel.classList.remove('show');
        showAiReplyDropdown(contact, { allowMoneyActions: true }, batchReplyBtn);
    }, () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        if (contact.isBlocked) {
            showToast('已加入黑名单');
            return;
        }
        if (plusPanel) plusPanel.classList.remove('show');
        showAiReplyDropdown(contact, { allowMoneyActions: true }, batchReplyBtn);
    }, { thresholdMs: 260 });

    batchReplyBtn?.addEventListener('click', async function () {
        if (this && this._longPressFired) {
            this._longPressFired = false;
            return;
        }
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!contact) return;
        if (contact.isBlocked) {
            showToast('已加入黑名单');
            return;
        }
        if (plusPanel) plusPanel.classList.remove('show');
        try {
            await runAiReplyForContact(contact, { allowMoneyActions: true });
        } catch (error) {
            addSystemMessage('批量回复失败，请检查API设置');
        }
    });

    // 模拟相机拍照功能
    document.getElementById('plus-camera-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        if (plusPanel) plusPanel.classList.remove('show');
        
        WeChatUI.showPrompt('拍摄', '请输入照片描述（可选）：', '').then(text => {
            if (text !== null) { // null means user clicked cancel
                // AI模拟图片 - 带描述
                const imageContent = { type: "image", content: "", description: text, isLocal: false };
                const imageJson = JSON.stringify(imageContent);
                
                const contact = State.contacts.find(c => c.id === State.currentContactId);
                if (!State.chatHistories[State.currentContactId]) {
                    State.chatHistories[State.currentContactId] = [];
                }
                const nowTs = Date.now();
                State.chatHistories[State.currentContactId].push({
                    role: 'user',
                    content: imageJson,
                    time: nowTs
                });
                const msgIndex = State.chatHistories[State.currentContactId].length - 1;
                addMessageToUI(imageJson, 'right', getUserProfileForContact(contact).avatar, msgIndex);
                Storage.saveChatHistories(State.chatHistories);
                if (State.currentContactId) renderChatMessages();
            }
        });
    });

    // 视频通话
    document.getElementById('plus-video-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (plusPanel) plusPanel.classList.remove('show');
        
        WeChatUI.showActionSheet(
            // 选择视频通话
            () => { WeChatUI.showCallPage(contact, 'video', handleCallHangup('video'), { direction: 'outgoing' }); },
            // 选择语音通话
            () => { WeChatUI.showCallPage(contact, 'voice', handleCallHangup('voice'), { direction: 'outgoing' }); }
        );
        
        function handleCallHangup(callType) {
            return function (resultDesc, transcript = []) {
            const videoContent = {
                type: "text",
                content: `[通话记录]\n${resultDesc}`,
                callMeta: { type: callType === 'voice' ? 'voice' : 'video' },
                callTranscript: Array.isArray(transcript) ? transcript : []
            };
            const videoJson = JSON.stringify(videoContent);
            
            if (!State.chatHistories[State.currentContactId]) {
                State.chatHistories[State.currentContactId] = [];
            }
            State.chatHistories[State.currentContactId].push({
                role: 'user',
                content: videoJson,
                time: Date.now()
            });
            
            const msgIndex = State.chatHistories[State.currentContactId].length - 1;
            addMessageToUI(videoJson, 'right', getUserProfileForContact(contact).avatar, msgIndex);
            
            Storage.saveChatHistories(State.chatHistories);
            if (State.currentContactId) renderChatMessages();
            };
        }
    });

    // 位置
    document.getElementById('plus-location-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        if (plusPanel) plusPanel.classList.remove('show');
        
        WeChatUI.showPrompt('发送位置', '请输入要发送的位置名称：', '').then(locationName => {
            if (locationName) {
                const locationContent = { type: "text", content: `[位置卡片]\n${locationName}` };
                const locationJson = JSON.stringify(locationContent);
                
                const contact = State.contacts.find(c => c.id === State.currentContactId);
                if (!State.chatHistories[State.currentContactId]) {
                    State.chatHistories[State.currentContactId] = [];
                }
                const nowTs = Date.now();
                State.chatHistories[State.currentContactId].push({
                    role: 'user',
                    content: locationJson,
                    time: nowTs
                });
                const msgIndex = State.chatHistories[State.currentContactId].length - 1;
                addMessageToUI(locationJson, 'right', getUserProfileForContact(contact).avatar, msgIndex);
                Storage.saveChatHistories(State.chatHistories);
                if (State.currentContactId) renderChatMessages();
            }
        });
    });

    // 红包
    document.getElementById('plus-redpacket-btn')?.addEventListener('click', () => {
        if (!State.currentContactId) return;
        if (plusPanel) plusPanel.classList.remove('show');
        
        WeChatUI.showRedPacket((amount, remark) => {
            const nextAmount = +amount;
            if (Number.isNaN(nextAmount) || nextAmount <= 0) return;
            const wxMoney = {
                id: `wxm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                kind: 'redpacket',
                amount: +nextAmount.toFixed(2),
                remark: String(remark || '').trim(),
                status: 'pending',
                createdAt: Date.now(),
                receivedAt: 0,
                from: 'me',
                to: State.currentContactId
            };
            const rpContent = { type: "text", content: `[微信红包]\n金额: ¥${nextAmount.toFixed(2)}\n备注: ${wxMoney.remark || '恭喜发财，大吉大利'}`, wxMoney };
            const rpJson = JSON.stringify(rpContent);
            
            const contact = State.contacts.find(c => c.id === State.currentContactId);
            if (!State.chatHistories[State.currentContactId]) {
                State.chatHistories[State.currentContactId] = [];
            }
            const nowTs = Date.now();
            State.chatHistories[State.currentContactId].push({
                role: 'user',
                content: rpJson,
                time: nowTs
            });
            const msgIndex = State.chatHistories[State.currentContactId].length - 1;
            addMessageToUI(rpJson, 'right', getUserProfileForContact(contact).avatar, msgIndex);
            Storage.saveChatHistories(State.chatHistories);
            if (State.currentContactId) renderChatMessages();
        });
    });

    // 转账 (复用 showPrompt, 这里由于没有单独做转账 UI，直接用提示框，稍微有些妥协。我们可以先用两步输入)
    document.getElementById('plus-transfer-btn')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        if (plusPanel) plusPanel.classList.remove('show');
        
        const amountStr = await WeChatUI.showPrompt('发送转账', '请输入转账金额：', '');
        if (!amountStr) return;
        const amount = parseFloat(amountStr);
        if (isNaN(amount) || amount <= 0) {
            showToast('输入金额无效');
            return;
        }
        
        const remark = await WeChatUI.showPrompt('转账说明', '请输入转账说明（可选）：', '转账') || '转账';
        
        const wxMoney = {
            id: `wxm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            kind: 'transfer',
            amount: +amount.toFixed(2),
            remark: String(remark || '').trim(),
            status: 'pending',
            createdAt: Date.now(),
            receivedAt: 0,
            from: 'me',
            to: State.currentContactId
        };
        const transferContent = { type: "text", content: `[微信转账]\n金额: ¥${amount.toFixed(2)}\n说明: ${wxMoney.remark || '转账'}`, wxMoney };
        const transferJson = JSON.stringify(transferContent);
        
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!State.chatHistories[State.currentContactId]) {
            State.chatHistories[State.currentContactId] = [];
        }
        const nowTs = Date.now();
        State.chatHistories[State.currentContactId].push({
            role: 'user',
            content: transferJson,
            time: nowTs
        });
        const msgIndex = State.chatHistories[State.currentContactId].length - 1;
        addMessageToUI(transferJson, 'right', getUserProfileForContact(contact).avatar, msgIndex);
        Storage.saveChatHistories(State.chatHistories);
        if (State.currentContactId) renderChatMessages();
    });

    // 语音输入模拟
    document.getElementById('plus-voice-btn')?.addEventListener('click', async () => {
        if (!State.currentContactId) return;
        if (plusPanel) plusPanel.classList.remove('show');
        
        const seconds = await WeChatUI.showPrompt('语音时长', '请输入语音秒数（1-60）：', '5');
        if (!seconds) return;
        
        const text = await WeChatUI.showPrompt('语音内容', '请输入语音包含的文字内容：', '这会儿在忙，稍后回你');
        if (!text) return;
        
        const voiceContent = {
            type: 'voice',
            duration: Math.max(1, Math.min(60, parseInt(seconds, 10) || 5)),
            content: text
        };
        const voiceJson = JSON.stringify(voiceContent);
        
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        if (!State.chatHistories[State.currentContactId]) {
            State.chatHistories[State.currentContactId] = [];
        }
        const nowTs = Date.now();
        State.chatHistories[State.currentContactId].push({
            role: 'user',
            content: voiceJson,
            time: nowTs
        });
        const msgIndex = State.chatHistories[State.currentContactId].length - 1;
        addMessageToUI(voiceJson, 'right', getUserProfileForContact(contact).avatar, msgIndex);
        Storage.saveChatHistories(State.chatHistories);
        if (State.currentContactId) renderChatMessages();
    });

    // 相册功能
    const albumBtn = document.getElementById('plus-album-btn');
    const imageUpload = document.getElementById('chat-image-upload');
    
    albumBtn?.addEventListener('click', () => {
        imageUpload?.click();
    });

    imageUpload?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const contactId = String(State.currentContactId || '').trim();
        if (file && contactId) {
            const contact = (State.contacts || []).find(c => c && String(c.id || '') === contactId);
            if (!contact) {
                if (imageUpload) imageUpload.value = '';
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target.result;
                const imageContent = { type: "image", content: base64, description: "", isLocal: true };
                const imageJson = JSON.stringify(imageContent);
              
                if (!State.chatHistories[contactId]) {
                    State.chatHistories[contactId] = [];
                }
                const nowTs = Date.now();
                State.chatHistories[contactId].push({
                    role: 'user',
                    content: imageJson,
                    time: nowTs
                });
                const msgIndex = State.chatHistories[contactId].length - 1;
                const userProfile = getUserProfileForContact(contact);
                addMessageToUI(imageJson, 'right', userProfile.avatar, msgIndex);
                    
                Storage.saveChatHistories(State.chatHistories);

                contact.lastMessage = '[图片]';
                const now = new Date(nowTs);
                contact.lastTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
                contact.lastActiveAt = nowTs;
                Storage.saveContacts(State.contacts);
                if (String(State.currentContactId || '') === contactId && typeof renderChatMessages === 'function') {
                    renderChatMessages();
                }
                if (typeof initChatList === 'function') initChatList();
            };
            reader.readAsDataURL(file);
        }
        if (imageUpload) imageUpload.value = '';
        if (plusPanel) plusPanel.classList.remove('show');
    });
}

    function renderChatMessages(options = {}) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const prevScrollHeight = container.scrollHeight;
    const prevScrollTop = container.scrollTop;
    container.innerHTML = '';

    normalizeAssistantHistoryToPerBubble(State.currentContactId);
    const messages = State.chatHistories[State.currentContactId] || [];
    const contact = State.contacts.find(c => c.id === State.currentContactId);
    const userProfile = getUserProfileForContact(contact);

    const pageSize = Math.max(10, parseInt(State.chatUi?.pageSize ?? 50, 10) || 50);
    if (!State.chatUi) State.chatUi = { visibleCount: {}, pageSize };
    if (!State.chatUi.visibleCount) State.chatUi.visibleCount = {};
    const currentVisible = Math.max(pageSize, parseInt(State.chatUi.visibleCount?.[State.currentContactId] ?? pageSize, 10) || pageSize);
    const visibleCount = Math.max(pageSize, currentVisible);
    State.chatUi.visibleCount[State.currentContactId] = visibleCount;
    const hiddenCount = Math.max(0, messages.length - visibleCount);
    const startIndex = hiddenCount > 0 ? hiddenCount : 0;
    const visibleMessages = startIndex > 0 ? messages.slice(startIndex) : messages;

    if (hiddenCount > 0) {
        const loadMore = document.createElement('div');
        loadMore.className = 'chat-load-more';
        const chunk = Math.min(pageSize, hiddenCount);
        loadMore.innerHTML = `<span class="chat-load-more-btn">展开更早的 ${chunk} 条消息</span>`;
        loadMore.addEventListener('click', () => {
            State.chatUi.visibleCount[State.currentContactId] = visibleCount + pageSize;
            renderChatMessages({ preserveScroll: true });
        });
        container.appendChild(loadMore);
    }

    visibleMessages.forEach((msg, localIndex) => {
        const index = startIndex + localIndex;
        if (msg.role === 'user') {
            addMessageToUI(msg.content, 'right', userProfile.avatar, index);
        } else if (msg.role === 'assistant') {
            try {
                const parsed = JSON.parse(msg.content);
                if (Array.isArray(parsed)) {
                    parsed.forEach(m => renderAIResponse(m, contact?.avatar, index));
                } else {
                    addMessageToUI(msg.content, 'left', contact?.avatar, index);
                }
            } catch (e) {
                addMessageToUI(msg.content, 'left', contact?.avatar, index);
            }
        } else if (msg.role === 'system') {
            addSystemMessage(msg.content);
        }
    });

    const shouldPreserve = !!options.preserveScroll;
    if (!shouldPreserve) {
        scrollToBottom();
        return;
    }
    const nextScrollHeight = container.scrollHeight;
    const delta = nextScrollHeight - prevScrollHeight;
    container.scrollTop = prevScrollTop + delta;
}

function parseWxMoneyText(text) {
    const raw = String(text || '');
    const lines = raw.split('\n');
    const first = (lines[0] || '').trim();
    if (first !== '[微信红包]' && first !== '[微信转账]') return null;
    const kind = first === '[微信红包]' ? 'redpacket' : 'transfer';
    const amountLine = lines.find(l => String(l || '').includes('金额'));
    const remarkLine = lines.find(l => String(l || '').includes(kind === 'redpacket' ? '备注' : '说明'));
    const amountMatch = String(amountLine || '').match(/¥\s*([0-9]+(?:\.[0-9]+)?)/);
    const amount = amountMatch ? (parseFloat(amountMatch[1]) || 0) : 0;
    const remark = kind === 'redpacket'
        ? String(remarkLine || '').replace(/^备注:\s*/i, '').trim()
        : String(remarkLine || '').replace(/^说明:\s*/i, '').trim();
    return { kind, amount: +amount.toFixed(2), remark };
}

function ensureWxMoneyMetaForMessage(index, side, bubbleText) {
    const history = State.chatHistories[State.currentContactId] || [];
    const bubbleRawText = String(bubbleText || '');
    let actualText = bubbleRawText;
    try {
        const temp = JSON.parse(bubbleRawText);
        if (temp && typeof temp === 'object' && temp.content) {
            actualText = String(temp.content);
        }
    } catch (e) {}

    let resolvedIndex = index;
    let msgData = history[resolvedIndex];
    if ((!msgData || resolvedIndex < 0) && actualText) {
        for (let i = history.length - 1; i >= 0; i--) {
            const item = history[i];
            if (!item || typeof item !== 'object') continue;
            if (side === 'left' && item.role !== 'assistant') continue;
            if (side === 'right' && item.role !== 'user') continue;
            try {
                const parsedRoot = JSON.parse(item.content);
                if (Array.isArray(parsedRoot)) {
                    const hit = parsedRoot.find(m => m && typeof m === 'object'
                        && (m.type === 'text' || m.type === 'text_message')
                        && String(m.content || '') === actualText);
                    if (hit) {
                        resolvedIndex = i;
                        msgData = item;
                        break;
                    }
                } else if (parsedRoot && typeof parsedRoot === 'object' && (parsedRoot.type === 'text' || parsedRoot.type === 'text_message')) {
                    if (String(parsedRoot.content || '') === actualText) {
                        resolvedIndex = i;
                        msgData = item;
                        break;
                    }
                }
            } catch (e) {}
        }
    }
    if (!msgData) return null;

    let parsed = null;
    try {
        parsed = JSON.parse(msgData.content);
    } catch (e) {
        return null;
    }

    const findInfoFromText = (t) => parseWxMoneyText(String(t || ''));

    let target = null;
    let info = null;
    if (Array.isArray(parsed)) {
        const candidate = parsed.find(it => it && typeof it === 'object'
            && (it.type === 'text' || it.type === 'text_message')
            && String(it.content || '') === actualText);
        target = candidate || null;
        info = target ? findInfoFromText(target.content) : findInfoFromText(actualText);
    } else if (parsed && typeof parsed === 'object' && (parsed.type === 'text' || parsed.type === 'text_message')) {
        target = parsed;
        info = findInfoFromText(parsed.content);
    } else {
        info = findInfoFromText(actualText);
    }

    if (!info) return null;

    const meta = target && target.wxMoney && typeof target.wxMoney === 'object' ? target.wxMoney : {};
    const next = {
        id: meta.id || `wxm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        kind: meta.kind || info.kind,
        amount: (typeof meta.amount === 'number' && !Number.isNaN(meta.amount)) ? meta.amount : info.amount,
        remark: (typeof meta.remark === 'string' && meta.remark.trim()) ? meta.remark.trim() : info.remark,
        status: (typeof meta.status === 'string' && meta.status) ? meta.status : 'pending',
        createdAt: (typeof meta.createdAt === 'number' && meta.createdAt) ? meta.createdAt : (msgData.time || Date.now()),
        receivedAt: (typeof meta.receivedAt === 'number' && meta.receivedAt) ? meta.receivedAt : 0,
        from: (typeof meta.from === 'string' && meta.from) ? meta.from : (side === 'left' ? (State.currentContactId || '') : 'me'),
        to: (typeof meta.to === 'string' && meta.to) ? meta.to : (side === 'left' ? 'me' : (State.currentContactId || ''))
    };

    if (Array.isArray(parsed)) {
        if (target) {
            target.wxMoney = next;
        } else {
            parsed.push({ type: 'text', content: bubbleRawText, wxMoney: next });
        }
        msgData.content = JSON.stringify(parsed);
    } else if (parsed && typeof parsed === 'object') {
        parsed.wxMoney = next;
        msgData.content = JSON.stringify(parsed);
    }
    Storage.saveChatHistories(State.chatHistories);
    return next;
}

function updateWxMoneyStatusAtIndex(index, status, bubbleText, extra = {}) {
    const history = State.chatHistories[State.currentContactId] || [];
    const bubbleRawText = String(bubbleText || '');
    let actualText = bubbleRawText;
    try {
        const temp = JSON.parse(bubbleRawText);
        if (temp && typeof temp === 'object' && temp.content) {
            actualText = String(temp.content);
        }
    } catch (e) {}

    let resolvedIndex = index;
    let msgData = history[resolvedIndex];
    if ((!msgData || resolvedIndex < 0) && actualText) {
        for (let i = history.length - 1; i >= 0; i--) {
            const item = history[i];
            if (!item || typeof item !== 'object') continue;
            try {
                const parsedRoot = JSON.parse(item.content);
                if (Array.isArray(parsedRoot)) {
                    const hit = parsedRoot.find(m => m && typeof m === 'object'
                        && (m.type === 'text' || m.type === 'text_message')
                        && String(m.content || '') === actualText);
                    if (hit) {
                        resolvedIndex = i;
                        msgData = item;
                        break;
                    }
                } else if (parsedRoot && typeof parsedRoot === 'object' && (parsedRoot.type === 'text' || parsedRoot.type === 'text_message')) {
                    if (String(parsedRoot.content || '') === actualText) {
                        resolvedIndex = i;
                        msgData = item;
                        break;
                    }
                }
            } catch (e) {}
        }
    }
    if (!msgData) return null;

    let parsed = null;
    try {
        parsed = JSON.parse(msgData.content);
    } catch (e) {
        return null;
    }

    if (Array.isArray(parsed)) {
        const target = parsed.find(it => it && typeof it === 'object'
            && (it.type === 'text' || it.type === 'text_message')
            && String(it.content || '') === actualText);
        if (!target || !target.wxMoney || typeof target.wxMoney !== 'object') return null;
        target.wxMoney = { ...target.wxMoney, status, ...extra };
        msgData.content = JSON.stringify(parsed);
        Storage.saveChatHistories(State.chatHistories);
        return target.wxMoney;
    }
    if (!parsed || typeof parsed !== 'object') return null;
    const wxMoney = parsed.wxMoney && typeof parsed.wxMoney === 'object' ? parsed.wxMoney : null;
    if (!wxMoney) return null;
    parsed.wxMoney = { ...wxMoney, status, ...extra };
    msgData.content = JSON.stringify(parsed);
    Storage.saveChatHistories(State.chatHistories);
    return parsed.wxMoney;
}

function createWxOverlay(rootId, html) {
    const existing = document.getElementById(rootId);
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = rootId;
    overlay.style.cssText = 'position:fixed; inset:0; z-index:9999; background:#fff;';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
    return overlay;
}

function closeWxMoneyOverlayToChat() {
    document.getElementById('wx-transfer-overlay')?.remove();
    document.getElementById('wx-redpacket-overlay')?.remove();
    if (!State.currentContactId) return;
    const contact = State.contacts.find(c => c.id === State.currentContactId);
    if (contact) {
        openChat(contact);
        return;
    }
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    showPage('chat-page');
    restoreChatHeaderTitle();
    renderChatMessages();
}

function formatWxCNTime(ts) {
    const d = new Date(ts);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    const ss = String(d.getSeconds()).padStart(2, '0');
    return `${y}年${m}月${day}日 ${hh}:${mm}:${ss}`;
}





function addMessageToUI(content, side, avatar, index = -1) {
    const container = document.getElementById('chat-messages');
    const row = document.createElement('div');
    row.className = `message-row ${side}`;
    let resolvedIndex = index;
    if (resolvedIndex < 0 && State.currentContactId) {
        const history = State.chatHistories?.[State.currentContactId] || [];
        const role = side === 'right' ? 'user' : (side === 'left' ? 'assistant' : '');
        if (role) {
            for (let i = history.length - 1; i >= 0; i--) {
                const it = history[i];
                if (!it || it.role !== role) continue;
                if (String(it.content ?? '') === String(content ?? '')) {
                    resolvedIndex = i;
                    break;
                }
            }
        }
    }
    
    // 如果是 JSON 字符串，尝试解析为特定格式渲染，否则当做普通文本
    let displayContent = escapeHtml(content).replace(/\n/g, '<br>');
    let isImage = false;
    let customClass = '';
    let chromeLessBubble = false;
    let wxMoneyText = '';
    let wxMoneyKind = '';
    let wxMoneyNote = '';
    
    try {
        const parsed = JSON.parse(content);
        if (parsed && typeof parsed === 'object') {
            if (parsed.type === 'text' || parsed.type === 'text_message') {
                let text = parsed.content;
                if (text.startsWith('[微信红包]')) {
                    wxMoneyText = text;
                    wxMoneyKind = 'redpacket';
                    const lines = text.split('\n');
                    const remark = lines[2]?.replace('备注: ', '') || '恭喜发财，大吉大利';
                    const st = parsed.wxMoney?.status || '';
                    let footer = '微信红包';
                    const isClaimed = st === 'opened' || st === 'received';
                    if (st === 'refunded') {
                        footer = side === 'right' ? '微信红包 · 已退还' : '微信红包';
                    }
                    if (isClaimed) {
                        wxMoneyNote = side === 'right' ? '对方已领取你的红包' : '你已领取对方发送的红包';
                    }
                    displayContent = isClaimed
                        ? `<div class="msg-redpacket"><div class="rp-main"><div class="rp-icon"><i class="fas fa-envelope"></i></div><div class="rp-info"><div class="rp-title">${escapeHtml(remark)}</div><div class="rp-status">已领取</div></div></div></div><div class="rp-footer">${footer}</div>`
                        : `<div class="msg-redpacket"><div class="rp-main"><div class="rp-icon"><i class="fas fa-envelope"></i></div><div class="rp-info"><div class="rp-title">${escapeHtml(remark)}</div><div class="rp-status">领取红包</div></div></div></div><div class="rp-footer">${footer}</div>`;
                    customClass = `redpacket-bubble${isClaimed ? ' wx-money-done' : ''}`;
                } else if (text.startsWith('[微信转账]')) {
                    wxMoneyText = text;
                    wxMoneyKind = 'transfer';
                    const lines = text.split('\n');
                    const amount = lines[1]?.replace('金额: ', '') || '';
                    const remark = lines[2]?.replace('说明: ', '') || '转账';
                    const st = parsed.wxMoney?.status || '';
                    let footer = '微信转账';
                    const isReceived = st === 'received';
                    if (st === 'refunded') {
                        footer = side === 'right' ? '微信转账 · 已退还' : '微信转账';
                    }
                    if (isReceived) {
                        wxMoneyNote = side === 'right' ? '对方已接收你的转账' : '你已接收对方的转账';
                    }
                    displayContent = `<div class="msg-transfer"><div class="tf-icon"><i class="fas fa-exchange-alt"></i></div><div class="tf-info"><div class="tf-amount">${escapeHtml(amount)}</div><div class="tf-remark">${escapeHtml(remark)}</div></div></div><div class="tf-footer">${footer}</div>`;
                    customClass = `transfer-bubble${isReceived ? ' wx-money-done' : ''}`;
                } else if (text.startsWith('[语音')) {
                    const m = text.match(/\[语音 (.*?)\]\n"([\s\S]*)"/);
                    if (m) {
                        const duration = m[1];
                        const voiceText = m[2];
                        displayContent = renderVoiceBubbleContent(duration, voiceText);
                        customClass = 'voice-bubble';
                    } else {
                        displayContent = escapeHtml(text).replace(/\n/g, '<br>');
                    }
                } else if (text.startsWith('[位置卡片]')) {
                    const loc = text.replace('[位置卡片]\n', '').trim();
                    const title = loc.split('\n')[0] || loc;
                    const subtitle = loc.includes('\n') ? loc.substring(title.length).trim() : '查看位置信息';
                    
                    displayContent = `
                        <div class="msg-location">
                            <div class="loc-info">
                                <div class="loc-name">${escapeHtml(title)}</div>
                                <div class="loc-desc">${escapeHtml(subtitle)}</div>
                            </div>
                            <div class="loc-map-visual">
                                <div class="loc-map-bg"></div>
                                <div class="loc-pin"><i class="fas fa-map-marker-alt"></i></div>
                            </div>
                        </div>
                    `;
                    customClass = 'location-bubble';
                    chromeLessBubble = true;
                } else if (text.startsWith('[通话记录]')) {
                    const desc = text.replace('[通话记录]\n', '');
                    const callType = getStoredCallRecordType(parsed);
                    const durationMatch = desc.match(/通话时长\s*([0-9]{1,3}:[0-9]{2})/);
                    const durationText = durationMatch ? `通话时长 ${durationMatch[1]}` : (desc.split('\n')[0] || desc).trim();
                    const iconHtml = callType === 'voice'
                        ? `<svg class="call-icon-voice" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8c1.7 3.2 3.4 4.9 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.7 3.8.7.6 0 1 .4 1 1V21c0 .6-.4 1-1 1C10.9 22 2 13.1 2 2c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.6.7 3.8.1.4 0 .8-.3 1.1L6.6 10.8z"/></svg>`
                        : `<i class="fas fa-video"></i>`;
                    displayContent = `<div class="msg-call">${iconHtml} <span>${escapeHtml(durationText)}</span></div>`;
                } else {
                    displayContent = escapeHtml(text).replace(/\n/g, '<br>');
                }
            }
            else if (parsed.type === 'image') {
                // 根据是否是本地图片决定如何渲染
                if (parsed.isLocal && parsed.content) {
                    // 本地真实图片 - 显示缩略图
                   displayContent = `<img src="${parsed.content}" class="local-image-thumb" style="max-width: 150px; max-height: 150px; border-radius: 8px; object-fit: cover; cursor: pointer;">`;
                    isImage = true;
                    customClass = 'image-local-bubble';
                    chromeLessBubble = true;
                } else {
                    // AI模拟图片 - 渲染成卡片，显示描述
                    const desc = parsed.description || '图片';
                    displayContent = `
                    <div class="image-card" style="cursor: pointer;">
                            <div class="image-card-visual">
                                <i class="fas fa-image"></i>
                            </div>
                        </div>
                    `;
                    isImage = true;
                    customClass = 'image-card-bubble';
                    chromeLessBubble = true;
                }
            } else if (parsed.type === 'voice') {
                const duration = Number(parsed.duration || 0) || 0;
                const voiceText = String(parsed.content ?? parsed.text ?? parsed.transcription ?? '');
                displayContent = renderVoiceBubbleContent(duration, voiceText);
                customClass = 'voice-bubble';
            } else if (parsed.type === 'quote') {
                const quoteText = escapeHtml(parsed.quote || '');
                const replyText = escapeHtml(parsed.content || '').replace(/\n/g, '<br>');
                displayContent = `
                    <div class="quote-reply-bubble">${replyText}</div>
                    <div class="quote-origin-outside">${quoteText}</div>
                `;
                customClass = 'quote-combo-bubble';
            } else if (parsed.type === 'sticker_message') {
                const stickerValue = parsed.sticker;
                const resolvedSticker = resolveStickerNameToUrl(stickerValue);
                
                if (resolvedSticker && resolvedSticker.startsWith('http')) {
                    displayContent = `<img src="${resolvedSticker}" class="sticker-image" style="max-width: 120px; max-height: 120px; border-radius: 4px;">`;
                } else {
                    displayContent = STICKER_MAP[resolvedSticker] || resolvedSticker || '[表情]';
                }
                customClass = 'sticker-bubble';
                chromeLessBubble = true;
            } else {
                displayContent = escapeHtml(JSON.stringify(parsed)).replace(/\n/g, '<br>');
            }
        }
    } catch(e) {
        // Not a JSON string
    }

    row.innerHTML = `
        <div class="message-avatar">${getAvatarHtml(avatar)}</div>
        <div class="message-content">
            <div class="message-bubble ${isImage ? 'image-bubble' : ''} ${customClass} ${chromeLessBubble ? 'chrome-less-bubble' : ''}" data-index="${resolvedIndex}" data-side="${side}">${displayContent}</div>
        </div>
    `;
    
    // 绑定长按和点击事件
    const bubble = row.querySelector('.message-bubble');
    if (bubble) {
        bubble.dataset.raw = String(content ?? '');
        if (wxMoneyText) bubble.dataset.wxMoneyText = wxMoneyText;
        if (wxMoneyKind) bubble.dataset.wxMoneyKind = wxMoneyKind;
        let longPressTimer = null;
        let isLongPress = false;
        let touchStartX = 0;
        let touchStartY = 0;

        if (resolvedIndex >= 0) {
            // 长按开始
            bubble.addEventListener('touchstart', (e) => {
                isLongPress = false;
                try { bubble._longPressFired = false; } catch (err) {}
                const p = e?.touches?.[0];
                touchStartX = Number(p?.clientX || 0);
                touchStartY = Number(p?.clientY || 0);
                longPressTimer = setTimeout(() => {
                    isLongPress = true;
                    try { bubble._longPressFired = true; } catch (err) {}
                    try { bubble.dataset.wxTapSuppressUntil = String(Date.now() + 900); } catch (err) {}
                    showContextMenu(e, resolvedIndex, side);
                }, 420);
            }, { passive: true });

            // 长按取消
            bubble.addEventListener('touchend', () => {
                if (longPressTimer) clearTimeout(longPressTimer);
            }, { passive: true });

            bubble.addEventListener('touchmove', (e) => {
                if (!longPressTimer) return;
                const p = e?.touches?.[0];
                const x = Number(p?.clientX || 0);
                const y = Number(p?.clientY || 0);
                const dx = x - touchStartX;
                const dy = y - touchStartY;
                if (Math.hypot(dx, dy) > 12) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                }
            }, { passive: true });

            // 桌面端右键菜单
            bubble.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                try { bubble._longPressFired = true; } catch (err) {}
                try { bubble.dataset.wxTapSuppressUntil = String(Date.now() + 900); } catch (err) {}
                showContextMenu(e, resolvedIndex, side);
            });
        }

        // 点击事件（仅特殊消息类型）
        bubble.addEventListener('click', () => {
            if (bubble && bubble._longPressFired) {
                bubble._longPressFired = false;
                return;
            }
            if (isLongPress) return;

            try {
                const parsed = JSON.parse(content);

         if (parsed && typeof parsed === 'object') {
             if (parsed.type === 'image') {
                showImagePreview(parsed);
                  } else if (parsed.type === 'voice') {
              toggleVoiceMessage(bubble);
                  } else if (parsed.type === 'text' || parsed.type === 'text_message') {
              let text = String(parsed.content || '');
                     if (text.startsWith('[微信红包]')) {
                      showRedPacketDetail(text, side, resolvedIndex);
                 } else if (text.startsWith('[微信转账]')) {
                         showTransferDetail(text, side, resolvedIndex);
                   } else if (text.startsWith('[语音')) {
              toggleVoiceMessage(bubble);
                        }
                  }
            }
            } catch (e) {
              // 普通文本消息不响应点击
            }
        });
    }
    
    container.appendChild(row);
    if (wxMoneyNote) {
        row.classList.add('has-wx-money-note');
        const note = document.createElement('div');
        note.className = 'wx-money-note-row';
        note.textContent = wxMoneyNote;
        container.appendChild(note);
    }
    scrollToBottom();
}

function renderAIResponse(msgObj, avatar, index = -1) {
    if (!msgObj || typeof msgObj !== 'object') {
        addMessageToUI(String(msgObj ?? ''), 'left', avatar, index);
        return;
    }

    const t = (msgObj.type || '').trim();
    if (t === 'thought_state') {
        return;
    }

    if (t === 'action') {
        return;
    }

    if (t === 'sticker_message') {
        const val = resolveStickerPromptValue(msgObj.sticker || '', State.currentContactId);
        addMessageToUI(JSON.stringify({ type: 'sticker_message', sticker: val }), 'left', avatar, index);
        return;
    }

    if (t === 'quote' || t === 'quote_reply') {
        const quoteText = msgObj.quote || msgObj.target_content || '';
        const replyText = msgObj.content || msgObj.reply_content || '';
        addMessageToUI(JSON.stringify({ type: 'quote', quote: quoteText, content: replyText }), 'left', avatar, index);
        return;
    }

    if (t === 'image') {
        const desc = msgObj.description || msgObj.content || '图片';
        addMessageToUI(JSON.stringify({ type: 'image', description: desc, isLocal: false, content: '' }), 'left', avatar, index);
        return;
    }

    if (t === 'voice') {
        const duration = Number(msgObj.duration || 0) || 0;
        const content = msgObj.content ?? msgObj.text ?? msgObj.transcription ?? '';
        addMessageToUI(JSON.stringify({ type: 'voice', duration, content }), 'left', avatar, index);
        return;
    }

    if (t === 'text' || t === 'text_message') {
        const content = msgObj.content ?? msgObj.text ?? msgObj.message ?? msgObj.value ?? '';
        addMessageToUI(JSON.stringify({ type: 'text', content, wxMoney: msgObj.wxMoney }), 'left', avatar, index);
        return;
    }

    if (typeof msgObj.content === 'string') {
        addMessageToUI(msgObj.content, 'left', avatar, index);
        return;
    }

    addMessageToUI(JSON.stringify(msgObj), 'left', avatar, index);
}

function addSystemMessage(text) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'system-message-row';
    const raw = String(text ?? '');
    let parsed = null;
    if (raw && (raw[0] === '{' || raw[0] === '[')) {
        try { parsed = JSON.parse(raw); } catch (e) {}
    }
    if (parsed && typeof parsed === 'object' && String(parsed.type || '') === 'event') {
        const display = String(parsed.display || parsed.aiText || raw);
        div.textContent = display;
        if (String(parsed.event || '') === 'recall' && String(parsed.actor || '') === 'assistant') {
            const revealText = String(parsed.revealText || '').trim();
            if (revealText) {
                div.appendChild(document.createTextNode('  '));
                const link = document.createElement('span');
                link.className = 'system-message-link';
                link.textContent = '点击查看';
                link.dataset.action = 'reveal-recall';
                link.dataset.text = revealText;
                div.appendChild(link);
            }
        }
    } else {
        div.textContent = raw;
    }
    container.appendChild(div);
    scrollToBottom();
}

function showRecallRevealModal(text) {
    const old = document.getElementById('wx-recall-reveal-modal');
    if (old) old.remove();
    const modal = document.createElement('div');
    modal.id = 'wx-recall-reveal-modal';
    modal.className = 'modal wechat-dialog-modal show';
    modal.style.zIndex = '10002';
    const safeText = escapeHtml(String(text || '')).replace(/\n/g, '<br>');
    modal.innerHTML = `
        <div class="modal-overlay" style="background: rgba(0, 0, 0, 0.42);"></div>
        <div class="wechat-dialog" style="width:min(360px, 86vw);">
            <div class="wechat-dialog-title">对方撤回的消息</div>
            <div class="wechat-dialog-body">
                <div style="font-size:14px; color:#333; line-height:1.6; word-break:break-word; white-space:normal;">${safeText || '（空）'}</div>
            </div>
            <div class="wechat-dialog-footer">
                <button class="wechat-dialog-btn confirm" id="wx-recall-reveal-close">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    const close = () => modal.remove();
    modal.querySelector('.modal-overlay')?.addEventListener('click', close);
    modal.querySelector('#wx-recall-reveal-close')?.addEventListener('click', close);
}

function bindSystemMessageEvents() {
    const container = document.getElementById('chat-messages');
    if (!container || container.dataset.systemEventBound === '1') return;
    container.dataset.systemEventBound = '1';
    container.addEventListener('click', (e) => {
        const el = e.target.closest('.system-message-link[data-action="reveal-recall"]');
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        const text = String(el.dataset.text || '').trim();
        showRecallRevealModal(text);
    });
}

let currentMessageContextState = { index: -1, side: '', x: 0, y: 0 };

function hideMessageContextMenu() {
    const menu = document.getElementById('message-context-menu');
    if (menu) menu.style.display = 'none';
    currentMessageContextState = { index: -1, side: '', x: 0, y: 0 };
}

function showContextMenu(event, index, side) {
    const menu = document.getElementById('message-context-menu');
    const history = State.chatHistories[State.currentContactId] || [];
    const msg = history[index];
    if (!menu || !msg) return;

    currentMessageContextState = { index, side, x: 0, y: 0 };
    const point = event?.touches?.[0] || event?.changedTouches?.[0] || event;
    const clientX = Number(point?.clientX || 0);
    const clientY = Number(point?.clientY || 0);

    const raw = String(msg.content || '');
    const summary = summarizeStoredMessageContent(raw);
    const canRecall = msg.role === 'user' || msg.role === 'assistant';
    const canEdit = canRecall;
    const canCopy = !!summary;
    let isCallLog = false;
    try {
        const parsed = JSON.parse(raw);
        isCallLog = isStoredCallRecordPayload(parsed);
    } catch (e) {
    }

    menu.querySelector('[data-action="copy"]')?.style.setProperty('display', canCopy ? '' : 'none');
    menu.querySelector('[data-action="quote"]')?.style.setProperty('display', msg.role === 'user' || msg.role === 'assistant' ? '' : 'none');
    menu.querySelector('[data-action="view-call-log"]')?.style.setProperty('display', isCallLog ? '' : 'none');
    menu.querySelector('[data-action="delete"]')?.style.setProperty('display', canRecall ? '' : 'none');
    menu.querySelector('[data-action="edit"]')?.style.setProperty('display', canEdit ? '' : 'none');
    menu.querySelector('[data-action="recall"]')?.style.setProperty('display', canRecall ? '' : 'none');
    menu.querySelector('[data-action="multi-select"]')?.style.setProperty('display', '' );

    menu.style.display = 'grid';
    menu.style.visibility = 'hidden';
    menu.style.left = '0px';
    menu.style.top = '0px';

    const rect = menu.getBoundingClientRect();
    const margin = 12;
    const maxLeft = window.innerWidth - rect.width - margin;
    const maxTop = window.innerHeight - rect.height - margin;
    const left = Math.min(Math.max(margin, clientX - rect.width / 2), Math.max(margin, maxLeft));
    const top = Math.min(Math.max(margin, clientY - rect.height - 14), Math.max(margin, maxTop));

    currentMessageContextState.x = left;
    currentMessageContextState.y = top;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.style.visibility = 'visible';
}

function bindMessageContextMenu() {
    const menu = document.getElementById('message-context-menu');
    if (!menu || menu.dataset.bound === '1') return;
    menu.dataset.bound = '1';

    menu.addEventListener('click', async (e) => {
        const item = e.target.closest('.context-menu-item');
        if (!item) return;
        const action = String(item.dataset.action || '').trim();
        const index = currentMessageContextState.index;
        const history = State.chatHistories[State.currentContactId] || [];
        const msg = history[index];
        hideMessageContextMenu();
        if (!msg) return;

        if (action === 'copy') {
            const text = summarizeStoredMessageContent(msg.content);
            if (!text) return;
            try {
                await navigator.clipboard.writeText(text);
                showToast('已复制');
            } catch (e) {
                showToast('复制失败');
            }
            return;
        }

        if (action === 'edit') {
            openMessageEditModal(index);
            return;
        }

        if (action === 'delete') {
            const ok = await WeChatUI.showConfirm('删除消息', '确定要删除这条消息吗？', '删除', '取消', true);
            if (!ok) return;
            history.splice(index, 1);
            Storage.saveChatHistories(State.chatHistories);
            syncContactPreviewFromHistory(State.currentContactId);
            renderChatMessages();
            return;
        }

        if (action === 'recall') {
            const ok = await WeChatUI.showConfirm('撤回消息', '确定撤回这条消息吗？撤回后会显示已撤回的内容。', '撤回', '取消', true);
            if (!ok) return;
            const success = recallMessageAt(State.currentContactId, index, msg.role);
            if (success) showToast('已撤回');
            return;
        }

        if (action === 'quote') {
            const input = document.getElementById('message-input');
            if (!input) return;
            const quoteText = summarizeStoredMessageContent(msg.content);
            if (!quoteText) return;
            input.value = `{"type":"quote","quote":"${quoteText.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}","content":""}`;
            input.focus();
            showToast('已放入输入框');
            return;
        }

        if (action === 'view-call-log') {
            showToast('直接点击通话记录消息即可查看内容');
            return;
        }

        if (action === 'multi-select') {
            showToast('多选删除还没接完，这次先给你补了撤回');
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.closest('#message-context-menu')) return;
        hideMessageContextMenu();
    });
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.message-bubble')) return;
        hideMessageContextMenu();
    });
    window.addEventListener('scroll', hideMessageContextMenu, true);
    window.addEventListener('resize', hideMessageContextMenu);
}

function scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
}

// ==========================================
// 消息编辑功能
// ==========================================

function openMessageEditModal(index) {
    const modal = document.getElementById('message-edit-modal');
    const indexInput = document.getElementById('edit-message-index');
    const contentInput = document.getElementById('edit-message-content');
    const deleteBtn = document.getElementById('delete-message-btn');

    const history = State.chatHistories[State.currentContactId] || [];
    if (index < 0 || index >= history.length) return;

    const msg = history[index];
    indexInput.value = index;
    
    // 如果是 JSON 则格式化显示，否则直接显示文本
    try {
        const parsed = JSON.parse(msg.content);
        contentInput.value = JSON.stringify(parsed, null, 2);
    } catch (e) {
        contentInput.value = msg.content;
    }

    deleteBtn.style.display = 'block';
    modal.classList.add('show');
}

function closeMessageEditModal() {
    document.getElementById('message-edit-modal')?.classList.remove('show');
}

function saveMessageEdit() {
    const indexStr = document.getElementById('edit-message-index').value;
    const index = parseInt(indexStr, 10);
    const newContent = document.getElementById('edit-message-content').value.trim();

    if (isNaN(index)) return;

    const history = State.chatHistories[State.currentContactId];
    if (!history || index < 0 || index >= history.length) return;

    // 尝试压缩 JSON，如果不是合法 JSON 就按原样保存
    let finalContent = newContent;
    try {
        const parsed = JSON.parse(newContent);
        finalContent = JSON.stringify(parsed);
    } catch (e) {
        // Not a JSON
    }

    history[index].content = finalContent;
    Storage.saveChatHistories(State.chatHistories);
    
    renderChatMessages();
    closeMessageEditModal();
}

async function deleteMessageEdit() {
    const indexStr = document.getElementById('edit-message-index').value;
    const index = parseInt(indexStr, 10);

    if (isNaN(index)) return;

    const history = State.chatHistories[State.currentContactId];
    if (!history || index < 0 || index >= history.length) return;

    const ok = await WeChatUI.showConfirm('删除消息', '确定要删除这条消息吗？', '删除', '取消', true);
    if (!ok) return;
    history.splice(index, 1);
    Storage.saveChatHistories(State.chatHistories);
    renderChatMessages();
    closeMessageEditModal();
}

function findLatestPendingOutgoingWxMoney(contactId, kind) {
    const history = State.chatHistories[contactId] || [];
    for (let i = history.length - 1; i >= 0; i--) {
        const item = history[i];
        if (!item || item.role !== 'user') continue;
        let parsed = null;
        try {
            parsed = JSON.parse(item.content);
        } catch (e) {
            continue;
        }
        if (!parsed || typeof parsed !== 'object') continue;
        if (parsed.type !== 'text' && parsed.type !== 'text_message') continue;
        const wxMoney = parsed.wxMoney;
        if (!wxMoney || typeof wxMoney !== 'object') continue;
        if (wxMoney.from !== 'me') continue;
        if (String(wxMoney.kind || '') !== String(kind || '')) continue;
        if (String(wxMoney.status || '') !== 'pending') continue;
        return { index: i, msg: item, parsed, wxMoney };
    }
    return null;
}

function markOutgoingWxMoneyAccepted(contactId, kind) {
    const hit = findLatestPendingOutgoingWxMoney(contactId, kind);
    if (!hit) return null;
    const nextStatus = kind === 'transfer' ? 'received' : 'opened';
    const now = Date.now();
    hit.parsed.wxMoney = {
        ...hit.wxMoney,
        status: nextStatus,
        receivedAt: now
    };
    hit.msg.content = JSON.stringify(hit.parsed);
    Storage.saveChatHistories(State.chatHistories);
    const contact = State.contacts.find(c => c.id === contactId);
    if (contact) {
        contact.lastActiveAt = now;
        Storage.saveContacts(State.contacts);
    }
    if (State.currentContactId === contactId) {
        renderChatMessages();
    }
    initChatList();
    return { ...hit.parsed.wxMoney };
}

function startIncomingCallFromAI(contact, callType) {
    if (!contact) return;
    WeChatUI.showCallPage(contact, callType, (resultDesc, transcript = []) => {
        const callContent = {
            type: "text",
            content: `[通话记录]\n${resultDesc}`,
            callMeta: { type: callType === 'voice' ? 'voice' : 'video' },
            callTranscript: Array.isArray(transcript) ? transcript : []
        };
        const callJson = JSON.stringify(callContent);
        if (!State.chatHistories[contact.id]) State.chatHistories[contact.id] = [];
        State.chatHistories[contact.id].push({
            role: 'assistant',
            content: callJson,
            time: Date.now()
        });
        Storage.saveChatHistories(State.chatHistories);
        contact.lastMessage = '[通话记录]';
        const now = new Date();
        contact.lastTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        contact.lastActiveAt = Date.now();
        Storage.saveContacts(State.contacts);
        if (contact.id === State.currentContactId) {
            addMessageToUI(callJson, 'left', contact.avatar, State.chatHistories[contact.id].length - 1);
        }
        initChatList();
    }, { direction: 'incoming' });
}

// ==========================================
// AI 请求
// ==========================================

function isAiRunningForContact(contactId) {
    return !!State.aiTask?.running && String(State.aiTask?.contactId || '') === String(contactId || '');
}

function interruptAiForContact(contactId) {
    const cid = String(contactId || '');
    if (!cid) return false;
    if (State.aiTask?.running && String(State.aiTask.contactId || '') === cid) {
        try { State.aiTask.controller?.abort(); } catch (e) {}
        State.aiInterrupted[cid] = true;
        return true;
    }
    return false;
}

async function runAiReplyForContact(contact, options = {}) {
    if (!contact?.id) return;
    const cid = String(contact.id);
    if (State.aiTask?.running) {
        if (String(State.aiTask.contactId || '') === cid) {
            showToast('正在生成中...');
        } else {
            showToast('已有生成任务进行中');
        }
        return;
    }

    const controller = new AbortController();
    State.aiTask.running = true;
    State.aiTask.contactId = cid;
    State.aiTask.controller = controller;

    try {
        await fetchAIResponse(contact, { ...options, signal: controller.signal });
        delete State.aiInterrupted[cid];
    } catch (e) {
        const isAbort = e && (e.name === 'AbortError' || String(e.message || '').toLowerCase().includes('aborted'));
        if (isAbort) {
            State.aiInterrupted[cid] = true;
            if (String(State.currentContactId || '') === cid) showToast('已中断');
            return;
        }
        throw e;
    } finally {
        State.aiTask.running = false;
        State.aiTask.contactId = null;
        State.aiTask.controller = null;
    }
}

function trimTrailingAssistantMessages(contactId) {
    const cid = String(contactId || '');
    const list = Array.isArray(State.chatHistories?.[cid]) ? State.chatHistories[cid] : [];
    let removed = 0;
    while (list.length > 0) {
        const last = list[list.length - 1];
        if (!last || last.role !== 'assistant') break;
        list.pop();
        removed += 1;
    }
    State.chatHistories[cid] = list;
    Storage.saveChatHistories(State.chatHistories);
    return removed;
}

async function regenerateAiReplyForContact(contact, options = {}) {
    if (!contact?.id) return;
    const cid = String(contact.id);
    if (isAiRunningForContact(cid)) {
        interruptAiForContact(cid);
        for (let i = 0; i < 40; i++) {
            if (!State.aiTask?.running) break;
            await new Promise(r => setTimeout(r, 50));
        }
    }
    trimTrailingAssistantMessages(cid);
    if (String(State.currentContactId || '') === cid) {
        if (typeof renderChatMessages === 'function') renderChatMessages();
        initChatList();
    }
    await runAiReplyForContact(contact, options);
}

async function resumeAiReplyForContact(contact, options = {}) {
    if (!contact?.id) return;
    const cid = String(contact.id);
    if (isAiRunningForContact(cid)) return;
    await runAiReplyForContact(contact, options);
}

function isAiReplyDropdownOpen() {
    const el = document.getElementById('ai-reply-dropdown');
    return !!el && el.style.display !== 'none';
}

function closeAiReplyDropdown() {
    const el = document.getElementById('ai-reply-dropdown');
    if (!el) return;
    el.style.display = 'none';
    el.style.visibility = '';
}

function showAiQuickDropdown(params = {}) {
    const dropdown = document.getElementById('ai-reply-dropdown');
    const regenItem = document.getElementById('ai-reply-regen-item');
    const interruptItem = document.getElementById('ai-reply-interrupt-item');
    if (!dropdown || !regenItem || !interruptItem) return;

    const titleEl = dropdown.querySelector('.chat-model-dropdown-title');
    if (titleEl) titleEl.textContent = String(params.title || 'AI 快捷');

    const running = !!params.running;
    const interrupted = !!params.interrupted;

    if (running) {
        interruptItem.innerHTML = '<span style="display:flex; align-items:center; gap:8px;"><i class="fas fa-pause-circle"></i><span>中断生成</span></span>';
    } else if (interrupted) {
        interruptItem.innerHTML = '<span style="display:flex; align-items:center; gap:8px;"><i class="fas fa-play-circle"></i><span>恢复生成</span></span>';
    } else {
        interruptItem.innerHTML = '<span style="display:flex; align-items:center; gap:8px;"><i class="fas fa-pause-circle"></i><span>中断生成</span></span>';
    }

    regenItem.onclick = async () => {
        closeAiReplyDropdown();
        await (params.onRegenerate?.() || Promise.resolve());
    };

    interruptItem.onclick = async () => {
        closeAiReplyDropdown();
        if (running) {
            await (params.onInterrupt?.() || Promise.resolve());
            return;
        }
        if (interrupted) {
            await (params.onResume?.() || Promise.resolve());
            return;
        }
        if (typeof params.onNoTask === 'function') {
            params.onNoTask();
            return;
        }
        showToast('当前没有生成任务');
    };

    const anchor = params.anchorEl || document.getElementById('batch-reply-btn');
    dropdown.style.visibility = 'hidden';
    dropdown.style.display = '';

    const rect = anchor?.getBoundingClientRect?.() || { left: 12, top: 12, bottom: 12, right: 12, width: 0, height: 0 };
    const w = dropdown.offsetWidth || 220;
    const h = dropdown.offsetHeight || 120;
    const margin = 12;
    const gap = 10;

    let left = rect.left;
    left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));

    let top = rect.top - h - gap;
    if (top < margin) top = rect.bottom + gap;
    top = Math.max(margin, Math.min(top, window.innerHeight - h - margin));

    dropdown.style.left = `${left}px`;
    dropdown.style.top = `${top}px`;
    dropdown.style.visibility = '';
}

function showAiReplyDropdown(contact, options = {}, anchorEl) {
    const cid = String(contact?.id || '');
    if (!cid) return;
    const running = isAiRunningForContact(cid);
    const interrupted = !!State.aiInterrupted?.[cid];
    showAiQuickDropdown({
        title: 'AI 快捷',
        running,
        interrupted,
        anchorEl,
        onRegenerate: async () => {
            try {
                await regenerateAiReplyForContact(contact, options);
            } catch (e) {
                addSystemMessage('重新生成失败，请检查API设置');
            }
        },
        onInterrupt: async () => {
            interruptAiForContact(cid);
        },
        onResume: async () => {
            try {
                await resumeAiReplyForContact(contact, options);
            } catch (e) {
                addSystemMessage('恢复失败，请检查API设置');
            }
        }
    });
}

function bindLongPressAction(el, onLongPress, onContextMenu, options = {}) {
    if (!el) return;
    const thresholdMs = Math.max(120, Number(options.thresholdMs || 520) || 520);
    let timer = null;
    let fired = false;

    const clear = () => {
        if (timer) clearTimeout(timer);
        timer = null;
    };

    const start = (e) => {
        fired = false;
        clear();
        timer = setTimeout(() => {
            fired = true;
            try { el._longPressFired = true; } catch (err) {}
            onLongPress?.(e);
        }, thresholdMs);
    };

    const end = () => clear();

    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchend', end, { passive: true });
    el.addEventListener('touchcancel', end, { passive: true });
    el.addEventListener('mousedown', start);
    el.addEventListener('mouseup', end);
    el.addEventListener('mouseleave', end);
    el.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        try { el._longPressFired = true; } catch (err) {}
        onContextMenu?.(e);
    });
}

async function fetchAIResponse(contact, options = {}) {
    const canRetryNoReply = !options.__noReplyRetried;
    const currentApiConfig = State.apiConfigs.find(c => c.id === State.currentApiId);
    const useProxy = !!currentApiConfig?.useProxy;
    const targetUrl = useProxy ? (currentApiConfig?.proxyUrl || '').trim() : normalizeChatCompletionsUrl(currentApiConfig?.apiUrl || '');
    const apiKey = (currentApiConfig?.apiKey || '').trim();
    if (!currentApiConfig || !targetUrl || (!useProxy && !apiKey)) {
        throw new Error('API未配置');
    }
    if (contact?.isBlocked) return;

    const history = State.chatHistories[contact.id] || [];

    const toApiContent = (rawContent, role) => {
        if (rawContent == null) return '';
        const text = String(rawContent);
        try {
            const parsed = JSON.parse(text);
            if (parsed && typeof parsed === 'object' && (parsed.type === 'text' || parsed.type === 'text_message')) {
                if (isStoredCallRecordPayload(parsed)) {
                    return formatCallRecordForContext(parsed, {
                        userLabel: '我',
                        assistantLabel: contact?.name || '对方'
                    });
                }
                return String(parsed.content || '');
            }
            if (parsed && typeof parsed === 'object' && parsed.type === 'quote') {
                const q = String(parsed.quote || '');
                const c = String(parsed.content || '');
                return q ? `「${q}」\n${c}` : c;
            }
            if (parsed && typeof parsed === 'object' && parsed.type === 'sticker_message') {
                const v = String(parsed.sticker || '');
                return v ? `[表情] ${v}` : '[表情]';
            }
            if (parsed && typeof parsed === 'object' && parsed.type === 'image') {
                const url = (parsed.content || '').trim();
                const desc = (parsed.description || '').trim();
                const canAttach = url && (/^data:image\//i.test(url) || /^https?:\/\//i.test(url));
                const visionEnabled = !!currentApiConfig?.visionEnabled;
                if (visionEnabled && role === 'user' && canAttach) {
                    const prefix = desc ? `用户发送了一张图片。附加描述：${desc}` : '用户发送了一张图片。';
                    return [
                        { type: 'text', text: prefix },
                        { type: 'image_url', image_url: { url } }
                    ];
                }
                return desc ? `[图片] ${desc}` : '[图片]';
            }
            if (parsed && typeof parsed === 'object' && parsed.type === 'voice') {
                const t = (parsed.text || parsed.transcription || '').trim();
                return t ? `[语音] ${t}` : '[语音]';
            }
            if (parsed && typeof parsed === 'object' && parsed.type === 'event') {
                const aiText = String(parsed.aiText || '').trim();
                if (aiText) return aiText;
                const display = String(parsed.display || '').trim();
                return display ? `[聊天事件] ${display}` : '[聊天事件]';
            }
        } catch (e) {
        }
        return text;
    };

    const extractReplyText = (data) => {
        const candidates = [
            data?.choices?.[0]?.message?.content,
            data?.choices?.[0]?.text,
            data?.message?.content,
            data?.output_text,
            data?.result
        ];
        for (const c of candidates) {
            if (typeof c === 'string' && c.trim()) return c.trim();
        }
        return '';
    };

    const limit = Math.max(1, parseInt(contact.contextLimit ?? 150, 10) || 150);
    const recentHistory = history.slice(-limit);

    const queryText = recentHistory
        .slice(-6)
        .map(m => toPlainTextFromStoredContent(m?.content))
        .filter(Boolean)
        .join('\n');
    const recalledSummaryText = await recallSummaryChunks(contact, queryText, 2);
    const promptPrefs = State.promptPrefs || Storage.DEFAULT_PROMPT_PREFS;
    const stickerCandidateCount = Math.max(1, Math.min(20, parseInt(promptPrefs.stickerCandidateCount ?? 8, 10) || 8));
    const stickerCandidates = buildStickerPromptCandidates(contact, stickerCandidateCount);
    const systemPrompt = buildSystemPrompt(contact, {
        summaryMemoryText: recalledSummaryText,
        stickerCandidates
    });
    State.lastSentSystemPrompt[contact.id] = systemPrompt;
    State.lastStickerPromptCandidates[contact.id] = stickerCandidates;

    const messages = [{ role: 'system', content: systemPrompt }];
    recentHistory.forEach(msg => {
        messages.push({
            role: msg.role,
            content: toApiContent(msg.content, msg.role)
        });
    });

    if (!options.silent && contact.id === State.currentContactId) {
        setTypingIndicator('正在输入中...');
    }

    try {
        if (options.proactive) {
            messages.push({
                role: 'user',
                content: '（系统）请你主动发起聊天：像真实微信一样给用户发起 1-3 条自然消息，可适当使用 sticker_message 发送表情。不要说“我来主动发消息了”。'
            });
        }

        if (options.forceReply) {
            messages.push({
                role: 'user',
                content: '（系统）本轮禁止已读不回。请你正常回复用户，必须输出至少一条可见消息（text/sticker_message/quote/image/voice），不要输出 action。'
            });
        }

        const headers = { 'Content-Type': 'application/json' };
        if (!useProxy) headers.Authorization = `Bearer ${apiKey}`;
        const modelToUse = (currentApiConfig.model || '').trim()
            || (Array.isArray(currentApiConfig.models) ? (currentApiConfig.models[0] || '').trim() : '')
            || 'gpt-3.5-turbo';

        const response = await fetch(targetUrl, {
            method: 'POST',
            headers,
            signal: options.signal,
            body: JSON.stringify({
                model: modelToUse,
                messages: messages
            })
        });

        if (!response.ok) {
            let errMsg = `HTTP ${response.status}`;
            try {
                const errData = await response.json();
                errMsg = errData?.error?.message || errData?.error || errMsg;
            } catch (e) {
            }
            throw new Error(errMsg);
        }

        const data = await response.json();
        let replyContent = extractReplyText(data);

        // 清理 Markdown 标记
        replyContent = replyContent.replace(/^```json\s*/, '').replace(/```\s*$/, '');

        if (!options.silent && contact.id === State.currentContactId) {
            setTypingIndicator('正在回复中...');
        }

        // 解析并显示
        try {
            const parsed = JSON.parse(replyContent);
            if (Array.isArray(parsed)) {
                let parsedArr = normalizeStickerMessagesInPayload(parsed.slice(), contact.id);
                let visibleItems = parsedArr.filter(m => !(m && typeof m === 'object' && m.type === 'thought_state'));
                const isNoReply = visibleItems.length === 1
                    && visibleItems[0]
                    && typeof visibleItems[0] === 'object'
                    && visibleItems[0].type === 'action'
                    && String(visibleItems[0].command || '').toUpperCase() === 'NO_REPLY';

                if (isNoReply) {
                    const nowTs = Date.now();
                    const cooldownMin = Math.max(1, Math.min(120, parseInt(contact.noReplyCooldownMin ?? 10, 10) || 10));
                    const cooldownMs = cooldownMin * 60 * 1000;
                    const lastNoReplyAt = Number(contact.lastNoReplyAt || 0) || 0;
                    const inCooldown = lastNoReplyAt && (nowTs - lastNoReplyAt) < cooldownMs;

                    if (!contact.allowSeenNoReply || inCooldown) {
                        if (canRetryNoReply) {
                            return fetchAIResponse(contact, { ...options, __noReplyRetried: true, forceReply: true, silent: true });
                        }
                        if (!options.silent && contact.id === State.currentContactId) showToast('对方已读');
                        contact.lastActiveAt = nowTs;
                        Storage.saveContacts(State.contacts);
                        return;
                    }

                    contact.lastNoReplyAt = nowTs;
                    contact.lastActiveAt = nowTs;
                    Storage.saveContacts(State.contacts);
                    if (!options.silent && contact.id === State.currentContactId) showToast('对方已读');
                    return;
                }

                const actionItems = visibleItems.filter(m => m && typeof m === 'object' && m.type === 'action');
                for (const act of actionItems) {
                    const cmd = String(act.command || '').toUpperCase();
                    if (cmd === 'WX_MONEY_ACCEPT') {
                        if (!options.allowMoneyActions) continue;
                        const kind = String(act.kind || '').toLowerCase();
                        if (kind === 'transfer' || kind === 'redpacket') {
                            const updated = markOutgoingWxMoneyAccepted(contact.id, kind);
                            if (updated) {
                                if (!parsedArr.some(x => x && typeof x === 'object' && (x.type === 'text' || x.type === 'text_message') && typeof x.content === 'string' && x.content.trim())) {
                                    parsedArr.unshift({
                                        type: 'text',
                                        content: kind === 'transfer' ? '我收到了。' : '我领到啦。'
                                    });
                                }
                            }
                        }
                    } else if (cmd === 'WX_CALL_START') {
                        const callType = String(act.callType || '').toLowerCase();
                        if (callType === 'voice' || callType === 'video') {
                            startIncomingCallFromAI(contact, callType);
                            if (!parsedArr.some(x => x && typeof x === 'object' && (x.type === 'text' || x.type === 'text_message') && typeof x.content === 'string' && x.content.trim())) {
                                parsedArr.unshift({
                                    type: 'text',
                                    content: callType === 'video' ? '我给你打个视频。' : '我给你打个语音。'
                                });
                            }
                        }
                    } else if (cmd === 'WX_REMARK_SET') {
                        const target = String(act.target || '').toLowerCase();
                        const rawRemark = String(act.remark || act.name || '').trim();
                        const remark = rawRemark.length > 32 ? rawRemark.slice(0, 32) : rawRemark;
                        if (!remark) continue;
                        if (target === 'user') {
                            contact.userRemarkName = remark;
                            Storage.saveContacts(State.contacts);
                            hydrateChatMorePage(contact);
                            pushSystemMessageToHistory(contact.id, `对方已将你备注为「${remark}」`);
                        } else if (target === 'contact') {
                            contact.remarkName = remark;
                            Storage.saveContacts(State.contacts);
                            initChatList();
                            initContactsList();
                            restoreChatHeaderTitle();
                            hydrateChatMorePage(contact);
                            pushSystemMessageToHistory(contact.id, `你已将对方备注为「${remark}」`);
                        }
                    } else if (cmd === 'WX_AVATAR_SET') {
                        const source = String(act.source || '').toLowerCase();
                        const rawUrl = String(act.url || act.avatar || act.image || '').trim();
                        const url = rawUrl || (source === 'last_user_image' ? getLastUserImageUrlForContact(contact.id) : '');
                        if (!url) continue;
                        if (!(/^data:image\//i.test(url) || /^https?:\/\//i.test(url))) continue;
                        contact.avatar = url;
                        Storage.saveContacts(State.contacts);
                        initChatList();
                        initContactsList();
                        hydrateChatMorePage(contact);
                        refreshRoleModalAvatarIfEditingContact(contact);
                        refreshMomentsViews();
                        if (contact.id === State.currentContactId) {
                            renderChatMessages();
                            restoreChatHeaderTitle();
                        }
                        pushSystemMessageToHistory(contact.id, '对方更换了头像');
                    } else if (cmd === 'WX_PAT') {
                        if (contact.aiPatEnabled === false) continue;
                        triggerPatEvent(contact, 'assistant');
                    } else if (cmd === 'WX_RECALL_LAST') {
                        if (contact.aiRecallEnabled === false) continue;
                        recallLatestMessageByRole(contact.id, 'assistant');
                    } else if (cmd === 'WX_RECALL_OFFSET') {
                        if (contact.aiRecallEnabled === false) continue;
                        const offset = act.offsetFromLast ?? act.offset ?? 0;
                        recallMessageByRoleOffset(contact.id, 'assistant', offset);
                    }
                }

                visibleItems = parsedArr.filter(m => !(m && typeof m === 'object' && m.type === 'thought_state'));
                const displayItemsRaw = visibleItems.filter(m => !(m && typeof m === 'object' && m.type === 'action'));
                const displayItems = expandAiDisplayItems(displayItemsRaw, { maxLen: 22, maxItems: 10, maxItemsTotal: 20 });

                if (visibleItems.length === 0) {
                    if (!options.silent && contact.id === State.currentContactId) showToast('对方已读');
                    return;
                }

                if (displayItems.length === 0) {
                    return;
                }

                if (!State.chatHistories[contact.id]) State.chatHistories[contact.id] = [];
                const inserted = [];
                const baseTs = Date.now();
                for (let i = 0; i < displayItems.length; i++) {
                    const item = displayItems[i];
                    const stored = JSON.stringify(item);
                    State.chatHistories[contact.id].push({
                        role: 'assistant',
                        content: stored,
                        time: baseTs + i
                    });
                    inserted.push({ item, index: State.chatHistories[contact.id].length - 1 });
                }
                Storage.saveChatHistories(State.chatHistories);

                for (let i = 0; i < inserted.length; i++) {
                    await new Promise(r => setTimeout(r, 180 + Math.random() * 360));
                    if (contact.id === State.currentContactId) {
                        renderAIResponse(inserted[i].item, contact.avatar, inserted[i].index);
                    }
                }

                const previewText = (() => {
                    const last = displayItems[displayItems.length - 1];
                    if (last && typeof last === 'object') {
                        if (last.type === 'text' || last.type === 'text_message') return String(last.content || '').trim();
                        if (last.type === 'sticker_message') return '[表情]';
                        if (last.type === 'image') return '[图片]';
                        if (last.type === 'voice') return '[语音]';
                        if (last.type === 'quote' || last.type === 'quote_reply') return '[引用]';
                    }
                    return '[消息]';
                })();
                registerIncomingAssistantMessages(contact, inserted.length, previewText);
                if (!options.silent && contact.id === State.currentContactId) {
                    renderChatMessages();
                }
            } else {
                const chunks = splitAiTextToBubbles(replyContent, { maxLen: 22, maxItems: 10 });
                const list = chunks.length > 0 ? chunks : [sanitizeAiTextEnding(replyContent)];
                if (!State.chatHistories[contact.id]) State.chatHistories[contact.id] = [];
                const baseTs = Date.now();
                for (let i = 0; i < list.length; i++) {
                    const line = list[i];
                    if (!line) continue;
                    State.chatHistories[contact.id].push({
                        role: 'assistant',
                        content: line,
                        time: baseTs + i
                    });
                    Storage.saveChatHistories(State.chatHistories);
                    const assistantIndex = State.chatHistories[contact.id].length - 1;
                    await new Promise(r => setTimeout(r, 180 + Math.random() * 360));
                    if (contact.id === State.currentContactId) addMessageToUI(line, 'left', contact.avatar, assistantIndex);
                }
                registerIncomingAssistantMessages(contact, list.length, list[list.length - 1] || '[消息]');
                if (!options.silent && contact.id === State.currentContactId) {
                    renderChatMessages();
                }
            }
        } catch (e) {
            // 非JSON格式，直接显示
            const chunks = splitAiTextToBubbles(replyContent, { maxLen: 22, maxItems: 10 });
            const list = chunks.length > 0 ? chunks : [sanitizeAiTextEnding(replyContent)];
            if (!State.chatHistories[contact.id]) State.chatHistories[contact.id] = [];
            const baseTs = Date.now();
            for (let i = 0; i < list.length; i++) {
                const line = list[i];
                if (!line) continue;
                State.chatHistories[contact.id].push({
                    role: 'assistant',
                    content: line,
                    time: baseTs + i
                });
                Storage.saveChatHistories(State.chatHistories);
                const assistantIndex = State.chatHistories[contact.id].length - 1;
                await new Promise(r => setTimeout(r, 180 + Math.random() * 360));
                if (contact.id === State.currentContactId) addMessageToUI(line, 'left', contact.avatar, assistantIndex);
            }
            registerIncomingAssistantMessages(contact, list.length, list[list.length - 1] || '[消息]');
            if (!options.silent && contact.id === State.currentContactId) {
                renderChatMessages();
            }
        }
    } finally {
        if (!options.silent && contact.id === State.currentContactId) {
            hideTypingIndicator();
        }
    }
}

async function triggerAutoSummary(contact) {
    const config = State.summaryConfig;
    const useMain = !!config?.useMainApi;
    const baseCfg = useMain ? getMainApiConfigBySharedId(config?.mainApiId) : { useProxy: false, apiUrl: config?.apiUrl || '', apiKey: config?.apiKey || '' };
    const runtime = baseCfg ? resolveChatApiRuntimeFromConfigLike(baseCfg, config?.model) : null;
    if (!runtime?.targetUrl || (!runtime.useProxy && !runtime.apiKey)) {
        addSystemMessage('归档失败：总结API未配置完整');
        return;
    }

    const history = State.chatHistories[contact.id] || [];
    const keep = Math.max(0, parseInt(config.keep ?? 100, 10) || 100);
    const totalUnits = getHistoryUnitCount(history);
    
    // 如果实际记录不足，无需总结
    if (totalUnits <= keep) return;

    // 取出需要被总结的部分 (保留最近 keep 个消息单元)
    let runningUnits = 0;
    let splitIndex = history.length;
    for (let i = history.length - 1; i >= 0; i--) {
        const units = getStoredMessageUnitCount(history[i]?.content);
        if (runningUnits + units > keep) {
            splitIndex = i + 1;
            break;
        }
        runningUnits += units;
        splitIndex = i;
    }
    const messagesToSummarize = history.slice(0, splitIndex);
    const messagesToKeep = history.slice(splitIndex);

    const normalizedMessages = messagesToSummarize.filter((m) => {
        if (!m) return false;
        if (m.role !== 'system') return true;
        const raw = String(m.content || '');
        return !raw.startsWith('[系统归档记忆]');
    });
    const chatTextForSummary = normalizedMessages
        .map(m => `[${m.role}]: ${toPlainTextFromStoredContent(m.content)}`)
        .join('\n');

    // 获取该联系人的历史总结
    if (!State.summaryHistories) State.summaryHistories = {};
    if (!State.summaryHistories[contact.id]) State.summaryHistories[contact.id] = [];
    const previousSummaries = State.summaryHistories[contact.id];

    // 使用自定义提示词或默认提示词
    const basePrompt = config.customPrompt || Storage.DEFAULT_SUMMARY_PROMPT;

    // 如果有之前的总结，添加到提示词中
    let summaryPrompt;
    if (previousSummaries.length > 0) {
        const latestSummary = previousSummaries[previousSummaries.length - 1];
     summaryPrompt = `${basePrompt}\n\n【之前的记忆】\n${latestSummary.content}\n\n【新的聊天记录】\n${chatTextForSummary}\n\n请在之前记忆的基础上，补充和完善新的信息。如果新记录中有与之前记忆冲突的信息，请更新为最新的状态。`;
    } else {
        summaryPrompt = `${basePrompt}\n\n聊天记录：\n${chatTextForSummary}`;
    }

    try {
        const headers = { 'Content-Type': 'application/json' };
        if (!runtime.useProxy) headers.Authorization = `Bearer ${runtime.apiKey}`;
        const response = await fetch(runtime.targetUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                model: runtime.model || 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: summaryPrompt }]
            })
        });

        if (!response.ok) throw new Error('总结接口返回错误');

        const data = await response.json();
        const summaryText = data.choices[0]?.message?.content?.trim() || '';

        if (summaryText) {
         const summaryItem = {
                content: summaryText,
              time: Date.now(),
                messageCount: getHistoryUnitCount(messagesToSummarize)
         };
         State.summaryHistories[contact.id] = [summaryItem];
         Storage.saveSummaryHistories(State.summaryHistories);

         const newVid = getSummaryVectorId(summaryItem);
         const store = State.summaryVectors?.[contact.id];
         if (newVid && store && store.items && typeof store.items === 'object') {
             Object.keys(store.items).forEach((k) => {
                 const parentId = String(store.items[k]?.parentId || '');
                 if (parentId && parentId !== newVid) delete store.items[k];
                 else if (!parentId && k !== newVid && !k.startsWith(`${newVid}#`)) delete store.items[k];
             });
             Storage.saveSummaryVectors(State.summaryVectors);
         }

            State.chatHistories[contact.id] = [
                {
                    role: 'system',
                    content: `[系统归档记忆]：\n${summaryText}`,
                    time: Date.now()
                },
                ...messagesToKeep
            ];
            Storage.saveChatHistories(State.chatHistories);
            
            // 刷新当前聊天界面
            renderChatMessages();
            addSystemMessage('历史消息归档完成');

            if (State.vectorConfig?.apiUrl) {
                vectorizeSummariesForContact(contact).catch(() => {
                });
            }
        }
    } catch (err) {
        console.error('总结失败:', err);
        addSystemMessage('归档失败：网络或接口错误');
    }
}

function buildSystemPrompt(contact, overrides = {}) {
    const prefs = State.promptPrefs || Storage.DEFAULT_PROMPT_PREFS;
    const stickerCandidateCount = Math.max(1, Math.min(20, parseInt(prefs.stickerCandidateCount ?? 8, 10) || 8));
    const imageRange = normalizeImageDescRange(prefs.imageDescMinChars ?? 25, prefs.imageDescMaxChars ?? 60);
    const imageLenMap = {
        short: '图片描述控制为 1 句话，尽量不超过 25 字。',
        medium: '图片描述控制为 1-2 句话，建议 25-60 字。',
        long: '图片描述可写 2-4 句话，建议 60-140 字。',
        custom: `图片描述尽量控制在 ${imageRange.min}-${imageRange.max} 字之间，过短可适当补足，过长请精简。`
    };

    const roleName = contact?.name || '联系人';
    const userRemarkForAi = String(contact?.remarkName || '').trim();
    const aiRemarkForUser = String(contact?.userRemarkName || '').trim();
    const roleDisplayName = getContactDisplayName(contact);
    const rawPersona = (contact?.persona || '').trim();
    const rawStyle = (contact?.style || '').trim();
    const allowSeenNoReply = !!contact?.allowSeenNoReply;
    const cooldownMin = Math.max(1, Math.min(120, parseInt(contact?.noReplyCooldownMin ?? 10, 10) || 10));
    const tendency = Math.max(0, Math.min(100, parseInt(contact?.noReplyTendency ?? 30, 10) || 30));
    const aiPatEnabled = contact?.aiPatEnabled !== false;
    const aiRecallEnabled = contact?.aiRecallEnabled !== false;
    const patSuffixOutgoing = String(contact?.patSuffixOutgoing ?? contact?.patSuffix ?? '').trim() || '一下';
    const patSuffixIncoming = String(contact?.patSuffixIncoming ?? contact?.patSuffix ?? '').trim() || '一下';
    const modules = State.promptModules || Storage.DEFAULT_PROMPT_MODULES;

    const now = new Date();
    const dateText = now.toLocaleDateString('zh-CN');
    const timeText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local';
    const userProfile = getUserProfileForContact(contact);
    const knowsRealTime = !!contact?.knowsRealTime;

    const vars = {
        char: roleName,
        角色名: roleName,
        role: roleName,
        char_display: roleDisplayName,
        contact_display_name: roleDisplayName,
        persona: rawPersona,
        style: rawStyle,
        user: userProfile.nickname || '用户',
        wxid: userProfile.wxid || '',
        user_remark_for_ai: userRemarkForAi,
        ai_remark_for_user: aiRemarkForUser,
        date: knowsRealTime ? dateText : '',
        time: knowsRealTime ? timeText : '',
        timezone: knowsRealTime ? tz : '',
        cooldown_min: String(cooldownMin),
        tendency: String(tendency)
    };

    const fillTemplate = (input) => {
        const text = String(input ?? '');
        return text.replace(/\{([^{}]+)\}/g, (m, keyRaw) => {
            const key = String(keyRaw || '').trim();
            if (!key) return m;
            const lowered = key.toLowerCase();
            if (Object.prototype.hasOwnProperty.call(vars, key)) return String(vars[key] ?? '');
            if (Object.prototype.hasOwnProperty.call(vars, lowered)) return String(vars[lowered] ?? '');
            if (lowered === 'char') return String(vars.char);
            if (lowered === 'user') return String(vars.user);
            if (lowered === 'wxid') return String(vars.wxid);
            if (lowered === 'date') return String(vars.date);
            if (lowered === 'time') return String(vars.time);
            return m;
        });
    };

    const persona = fillTemplate(rawPersona);
    const style = fillTemplate(rawStyle);
    vars.persona = persona;
    vars.style = style;

    const chaotic = /跳脱|神经|抽象|发癫|疯|中二|胡言|乱语|沙雕|梗|癫/i.test(`${persona}\n${style}`);

    let prompt = '';
    prompt += `${fillTemplate(modules.role || '')}\n`;
    
    // 注入全局系统设定
    const globalPrompt = fillTemplate(State.globalPrompt || '');
    prompt += globalPrompt ? `【全局设定】\n${globalPrompt}\n\n` : '';

    const summaryMemory = typeof overrides.summaryMemoryText === 'string'
        ? overrides.summaryMemoryText.trim()
        : getLatestSummaryText(contact.id);
    if (summaryMemory) {
        prompt += `【已归档记忆】\n${summaryMemory}\n\n`;
    }

    const remarkLines = [];
    if (userRemarkForAi) remarkLines.push(`用户给你的备注名：${userRemarkForAi}`);
    if (aiRemarkForUser) remarkLines.push(`你给用户的备注名：${aiRemarkForUser}`);
    if (remarkLines.length > 0) {
        prompt += `【备注】\n${remarkLines.join('\n')}\n\n`;
    }

    // 注入用户身份认知设定
    let userPersonaStr = '';
    if (userProfile.userPersona) {
        userPersonaStr += `用户的身份与设定：${userProfile.userPersona}\n`;
    }
    if (userPersonaStr) {
        prompt += `【关于用户】\n${userPersonaStr}\n`;
    }

    if (knowsRealTime) {
        const hour = now.getHours();
        let timeStatus = '';
        if (hour >= 0 && hour < 6) timeStatus = '深夜/凌晨，此时应该非常困倦，或者正在熬夜，回复可以很简短或带有睡意。';
        else if (hour >= 6 && hour < 10) timeStatus = '早晨，可能刚醒、在洗漱或通勤，状态可能还没完全清醒。';
        else if (hour >= 10 && hour < 18) timeStatus = '白天，通常在工作、上课或摸鱼，回复节奏符合日常状态。';
        else if (hour >= 18 && hour < 23) timeStatus = '晚上，通常是休息、娱乐或吃晚饭的时间，状态比较放松。';
        else timeStatus = '深夜，准备休息或正在emo。';

        prompt += `【当前时间状态】\n现在是真实时间的 ${now.toLocaleString('zh-CN', { hour12: false })} (${tz})。\n状态参考：${timeStatus}\n请让你的回复符合当前的时间语境，不要在半夜说早上好。\n\n`;
    }

    if (contact.linkedStickerLibs && contact.linkedStickerLibs.length > 0) {
        const candidates = Array.isArray(overrides.stickerCandidates)
            ? overrides.stickerCandidates
            : buildStickerPromptCandidates(contact, stickerCandidateCount);

        if (candidates.length > 0) {
            const candidateText = candidates.map(item => `${item.code}=${item.name}`).join('；');
            prompt += `【当前可用表情包候选】\n你可以使用 sticker_message 发送表情。\n优先在 sticker 字段填入短代号，不要写解释文字。\n推荐格式：{"type":"sticker_message","sticker":"S1"}\n如果你直接填候选里的名称也可以，但优先使用代号。\n只在这些候选里选，若都不合适就正常发文字，不要硬发表情。\n候选清单：${candidateText}\n\n`;
        }
    }

    // 注入关联的世界书设定
    if (contact.linkedWorldbooks && contact.linkedWorldbooks.length > 0) {
        let wbContent = '';
        const history = State.chatHistories[contact.id] || [];
        const recentUserMessages = history.filter(m => m && m.role === 'user').slice(-20).map(m => String(m.content || '')).filter(Boolean);

        let matchedEntries = [];

        contact.linkedWorldbooks.forEach(wbId => {
            const book = State.worldbooks.find(b => b.id === wbId);
            if (book && book.entries && book.entries.length > 0) {
                book.entries.forEach(entry => {
                    // 过滤禁用的条目
                    if (entry.enabled === false) return;

                    let shouldInject = false;

                    // 1. 常驻激活
                    if (entry.isAlwaysOn) {
                        shouldInject = true;
                    } 
                    // 2. 关键词匹配
                    else if (entry.keywords && entry.keywords.length > 0) {
                        const depth = Math.max(1, Math.min(20, parseInt(entry.scanDepth ?? 1, 10) || 1));
                        const baseText = recentUserMessages.slice(-depth).join('\n');
                        for (let kw of entry.keywords) {
                            let matchText = baseText;
                            let searchKw = kw;
                            
                            // 默认不区分大小写，除非开启了 caseSensitive
                            if (!entry.caseSensitive) {
                                matchText = matchText.toLowerCase();
                                searchKw = searchKw.toLowerCase();
                            }

                            if (matchText.includes(searchKw)) {
                                shouldInject = true;
                                break;
                            }
                        }
                    }

                    if (shouldInject) {
                        matchedEntries.push({
                            ...entry,
                            bookTitle: book.title
                        });
                    }
                });
            }
        });

        // 按照优先级从高到低排序 (数字越大越靠前)
        matchedEntries.sort((a, b) => (b.priority ?? 50) - (a.priority ?? 50));
        matchedEntries = matchedEntries.slice(0, 12);

        if (matchedEntries.length > 0) {
            // 按世界书归类整理输出
            const grouped = {};
            matchedEntries.forEach(entry => {
                if (!grouped[entry.bookTitle]) grouped[entry.bookTitle] = [];
                grouped[entry.bookTitle].push(entry);
            });

            for (const title in grouped) {
                wbContent += `《${title}》设定：\n`;
                grouped[title].forEach(entry => {
                    wbContent += `- [${entry.title}]: ${entry.content}\n`;
                });
            }
            prompt += `【世界观与背景设定】\n${wbContent}\n`;
        }
    }

    prompt += `【用户偏好约束】\n`;
    prompt += `1. ${imageLenMap[prefs.imageDescLength] || imageLenMap.medium}\n`;
    prompt += `2. ${prefs.extraRules || '无额外要求时，保持自然聊天语气并避免过度堆砌修辞。'}\n\n`;

    prompt += `${fillTemplate(modules.protocol || '')}\n`;
    prompt += `【微信交互扩展（你能做的事）】\n` +
        `- 你的输出是一个 JSON 数组；数组里可以混合多条消息（text/sticker/quote/image/voice）和 action。\n` +
        `\n` +
        `【你可以发送的消息类型】\n` +
        `- 文字：{"type":"text","content":"..."}（或 type:"text_message"）\n` +
        `- 表情：{"type":"sticker_message","sticker":"S1"}（优先用候选代号；没有合适就别硬发表情）\n` +
        `- 引用回复：{"type":"quote","quote":"被引用的原话","content":"你的回复"}（也兼容 type:"quote_reply"）\n` +
        `- 语音：{"type":"voice","duration":6,"content":"我晚点给你回电话"}\n` +
        `  - duration 用秒数，填整数即可；content 写这条语音里实际说的话或转写内容。\n` +
        `- 图片：{"type":"image","description":"一张...的图片"}\n` +
        `  - 说明：这里的 image 更像“图片卡片/发图意图”，通常展示描述而非真实图片文件。\n` +
        `- 卡片文本（仍然用 type:"text"）：\n` +
        `  - 红包卡片：content 写成三行格式：\n` +
        `    [微信红包]\\n金额: ¥X.XX\\n备注: ...\n` +
        `  - 转账卡片：content 写成三行格式：\n` +
        `    [微信转账]\\n金额: ¥X.XX\\n说明: ...\n` +
        `  - 位置卡片：content 写成两行格式：\n` +
        `    [位置卡片]\\n地点名\n` +
        `\n` +
        `【你可能会在上下文里看到的特殊卡片/系统事件】\n` +
        `- [微信红包]\\n金额: ¥X.XX\\n备注: ...\n` +
        `- [微信转账]\\n金额: ¥X.XX\\n说明: ...\n` +
        `- [位置卡片]\\n地点名\n` +
        `- [通话记录]\\n...\n` +
        `- [聊天事件] ...（撤回/拍一拍等系统事件）都是真实发生过的事件，必须当成有效上下文来理解。\n` +
        `  - 例如：用户在聊天里双击头像会触发“拍一拍”，你会在上下文里看到对应的 [聊天事件]。\n` +
        `\n` +
        `【你能触发的应用内行为（action）】\n` +
        `- 领取/收款（处理用户发来的卡片）：\n` +
        `  - 接受用户转账：{"type":"action","command":"WX_MONEY_ACCEPT","kind":"transfer"}\n` +
        `  - 领取用户红包：{"type":"action","command":"WX_MONEY_ACCEPT","kind":"redpacket"}\n` +
        `  - 领取/收款不是必选项：要结合人设、关系亲疏、当下情境来决定。\n` +
        `- 发起通话：\n` +
        `  - 发起语音通话：{"type":"action","command":"WX_CALL_START","callType":"voice"}\n` +
        `  - 发起视频通话：{"type":"action","command":"WX_CALL_START","callType":"video"}\n` +
        `- 改备注（会产生系统提示）：\n` +
        `  - 你给用户的备注（对方给我的备注）：{"type":"action","command":"WX_REMARK_SET","target":"user","remark":"..."}\n` +
        `  - 用户给你的备注（我给对方备注）：{"type":"action","command":"WX_REMARK_SET","target":"contact","remark":"..."}\n` +
        `- 换头像（会产生系统提示）：\n` +
        `  - 用用户上一张发图做头像：{"type":"action","command":"WX_AVATAR_SET","source":"last_user_image"}\n` +
        `  - 用 URL/dataURL 做头像：{"type":"action","command":"WX_AVATAR_SET","url":"https://... 或 data:image/..."}\n` +
        `- 拍一拍：当前聊天里，你拍一拍对方后缀为「${patSuffixOutgoing}」，对方拍一拍你后缀为「${patSuffixIncoming}」。\n` +
        `  - 拍一拍用户：{"type":"action","command":"WX_PAT"}\n` +
        `  - ${aiPatEnabled ? '本聊天允许你使用拍一拍动作。' : '本聊天已关闭拍一拍动作，不要输出 WX_PAT。'}\n` +
        `- 撤回（一次 action 只能撤回一条；只能撤回你自己发的消息）：\n` +
        `  - ${aiRecallEnabled ? '允许撤回：{"type":"action","command":"WX_RECALL_LAST"}（撤回最近一条） 或 {"type":"action","command":"WX_RECALL_OFFSET","offsetFromLast":2}（撤回倒数第3条）' : '本聊天已关闭撤回动作，不要输出 WX_RECALL_LAST / WX_RECALL_OFFSET。'}\n` +
        `- 撤回和拍一拍都会让用户看到系统提示：像真人一样克制使用，别一轮里乱用多次。\n` +
        `\n`;
    if (allowSeenNoReply) {
        prompt += `【NO_REPLY】\n- 如果你要“已读不回”，输出： [{"type":"action","command":"NO_REPLY"}]（整次数组只能包含这一项）。\n\n`;
        prompt += `【已读不回策略】\n冷处理倾向：${tendency}/100\n冷却时间：${cooldownMin} 分钟\n使用 NO_REPLY 必须克制，且整次数组只能包含这一项。\n\n`;
    } else {
        prompt += `【NO_REPLY】\n- 本聊天禁止已读不回，不要输出 NO_REPLY。\n\n`;
    }
    prompt += `${fillTemplate(modules.human || '')}\n`;
    if (chaotic) prompt += `（补充）你允许偶尔跳脱一句梗/台词，但要短、很少见，并且下一条立刻拉回当前对话。\n\n`;
    prompt += `${fillTemplate(modules.capability || '')}\n`;

    return prompt;
}

function startProactiveScheduler() {
    if (startProactiveScheduler._timer) return;
    startProactiveScheduler._timer = setInterval(async () => {
        const now = Date.now();
        for (const contact of (State.contacts || [])) {
            if (!contact || !contact.autoMessageEnabled) continue;
            if (contact.isBlocked) continue;
            const intervalMin = Math.max(1, Math.min(1440, parseInt(contact.autoMessageIntervalMin ?? 30, 10) || 30));
            if (!contact.nextAutoMessageAt) contact.nextAutoMessageAt = now + intervalMin * 60 * 1000;
            if (now < contact.nextAutoMessageAt) continue;

            contact.nextAutoMessageAt = now + intervalMin * 60 * 1000;
            Storage.saveContacts(State.contacts);

            try {
                await fetchAIResponse(contact, { proactive: true, silent: contact.id !== State.currentContactId, allowMoneyActions: false });
                if (contact.id !== State.currentContactId) initChatList();
            } catch (e) {
            }
        }
    }, 30000);
}

// ==========================================
// 工具函数
// ==========================================

function getAvatarHtml(avatar) {
    if (!avatar) return '<i class="fas fa-user"></i>';
    
    // 如果是完整的 URL 或者是 Base64 数据
    if (avatar.startsWith('http') || avatar.startsWith('data:image')) {
        return `<img src="${avatar}" style="width:100%; height:100%; border-radius:inherit; object-fit:cover;">`;
    }
    
    // 兼容旧的图标标识（兜底）
    const iconMap = {
        'user': '<i class="fas fa-user"></i>',
        'female': '<i class="fas fa-female"></i>',
        'male': '<i class="fas fa-male"></i>',
        'robot': '<i class="fas fa-robot"></i>',
        'cat': '<i class="fas fa-cat"></i>',
        'dog': '<i class="fas fa-dog"></i>',
        'ghost': '<i class="fas fa-ghost"></i>',
        'dragon': '<i class="fas fa-dragon"></i>'
    };
    return iconMap[avatar] || '<i class="fas fa-user"></i>';
}

function escapeHtml(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function estimateTokens(text) {
    const s = String(text ?? '');
    let tokens = 0;
    let asciiRun = 0;
    const flushAscii = () => {
        if (asciiRun > 0) {
            tokens += Math.ceil(asciiRun / 4);
            asciiRun = 0;
        }
    };
    for (let i = 0; i < s.length; i++) {
        const code = s.charCodeAt(i);
        if (code <= 0x7f) {
            if (code <= 0x20) {
                flushAscii();
                continue;
            }
            asciiRun++;
            continue;
        }
        flushAscii();
        tokens += 1;
    }
    flushAscii();
    return Math.max(1, tokens);
}

// 绑定设置相关事件
function bindSettingsEvents() {
    // 这里可以添加更多设置相关的事件绑定
}

// ==========================================
// 世界书管理弹窗 (两级结构)
// ==========================================

let currentWorldbookId = null;

let currentKeywords = [];

function renderKeywordTags() {
    const container = document.getElementById('worldbook-entry-keyword-tags');
    if (!container) return;
    
    container.innerHTML = '';
    currentKeywords.forEach((kw, index) => {
        const tag = document.createElement('span');
        tag.className = 'keyword-tag';
        tag.innerHTML = `${escapeHtml(kw)} <span class="keyword-tag-remove" data-index="${index}"><i class="fas fa-times"></i></span>`;
        container.appendChild(tag);
    });

    container.querySelectorAll('.keyword-tag-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.dataset.index, 10);
            currentKeywords.splice(idx, 1);
            renderKeywordTags();
        });
    });
}

function bindWorldbookEvents() {
    document.getElementById('close-worldbook-modal')?.addEventListener('click', closeWorldbookModal);
    document.getElementById('close-worldbook-entry-modal')?.addEventListener('click', closeWorldbookEntryModal);
    
    // 统一处理所有弹窗的遮罩层点击关闭
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) {
                modal.classList.remove('show');
            }
        });
    });

    document.getElementById('save-worldbook-btn')?.addEventListener('click', saveWorldbook);
    document.getElementById('delete-worldbook-btn')?.addEventListener('click', deleteWorldbook);
    
    document.getElementById('save-worldbook-entry-btn')?.addEventListener('click', saveWorldbookEntry);
    document.getElementById('delete-worldbook-entry-btn')?.addEventListener('click', deleteWorldbookEntry);

    document.getElementById('worldbook-entries-back-btn')?.addEventListener('click', () => {
        hidePage('worldbook-entries-page');
        currentWorldbookId = null;
    });

    document.getElementById('add-worldbook-entry-btn')?.addEventListener('click', () => {
        openWorldbookEntryModal(null);
    });

    // 关键词添加
    const kwInput = document.getElementById('worldbook-entry-keyword-input');
    document.getElementById('add-keyword-btn')?.addEventListener('click', () => {
        const val = kwInput?.value.trim();
        if (val && !currentKeywords.includes(val)) {
            currentKeywords.push(val);
            renderKeywordTags();
            kwInput.value = '';
        }
    });
    document.getElementById('parse-keywords-btn')?.addEventListener('click', () => {
        const raw = String(kwInput?.value || '').trim();
        if (!raw) return;
        const parts = raw
            .split(/[,，;；\n\r\t]+/g)
            .map(s => String(s || '').trim())
            .filter(Boolean);
        if (parts.length === 0) return;
        let added = 0;
        parts.forEach((p) => {
            if (!currentKeywords.includes(p)) {
                currentKeywords.push(p);
                added++;
            }
        });
        renderKeywordTags();
        kwInput.value = '';
        if (added > 0) showToast(`已添加 ${added} 个关键词`);
        else showToast('没有新增关键词');
    });
    kwInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            document.getElementById('add-keyword-btn')?.click();
        }
    });

    // 开关状态切换
    ['enabled', 'always-on', 'case'].forEach(type => {
        document.getElementById(`worldbook-entry-${type}-toggle`)?.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });
}

function openWorldbookModal(index = -1) {
    const modal = document.getElementById('worldbook-edit-modal');
    const titleEl = document.getElementById('worldbook-modal-title');
    const idInput = document.getElementById('worldbook-id');
    const titleInput = document.getElementById('worldbook-title');
    const descInput = document.getElementById('worldbook-desc');
    const deleteBtn = document.getElementById('delete-worldbook-btn');

    if (index >= 0) {
        const book = State.worldbooks[index];
        titleEl.textContent = '编辑世界书';
        idInput.value = index;
        titleInput.value = book.title || '';
        descInput.value = book.desc || '';
        deleteBtn.style.display = 'block';
    } else {
        titleEl.textContent = '添加世界书';
        idInput.value = -1;
        titleInput.value = '';
        descInput.value = '';
        deleteBtn.style.display = 'none';
    }

    modal.classList.add('show');
}

function closeWorldbookModal() {
    document.getElementById('worldbook-edit-modal')?.classList.remove('show');
}

function saveWorldbook() {
    const indexStr = document.getElementById('worldbook-id').value;
    const index = parseInt(indexStr, 10);
    const title = document.getElementById('worldbook-title').value.trim();
    const desc = document.getElementById('worldbook-desc').value.trim();

    if (!title) {
        showToast('请输入世界书名称');
        return;
    }

    if (index >= 0) {
        State.worldbooks[index].title = title;
        State.worldbooks[index].desc = desc;
    } else {
        const newId = 'wb_' + Date.now();
        State.worldbooks.push({ id: newId, title, desc, entries: [] });
    }

    Storage.saveWorldbooks(State.worldbooks);
    initWorldbookList();
    closeWorldbookModal();
}

async function deleteWorldbook() {
    const indexStr = document.getElementById('worldbook-id').value;
    const index = parseInt(indexStr, 10);
    
    if (index < 0) return;
    const ok = await WeChatUI.showConfirm('删除世界书', '确定删除这本世界书及其所有条目吗？', '删除', '取消', true);
    if (!ok) return;
    State.worldbooks.splice(index, 1);
    Storage.saveWorldbooks(State.worldbooks);
    initWorldbookList();
    closeWorldbookModal();
}

function openWorldbookEntries(book) {
    currentWorldbookId = book.id;
    showPage('worldbook-entries-page');
    document.getElementById('worldbook-entries-title').textContent = book.title;
    initWorldbookEntriesList();
}

function initWorldbookEntriesList() {
    const list = document.getElementById('worldbook-entries-list');
    if (!list) return;

    list.innerHTML = '';
    
    const book = State.worldbooks.find(b => b.id === currentWorldbookId);
    if (!book) return;

    if (!book.entries || book.entries.length === 0) {
        list.innerHTML = '<div style="padding: 20px; text-align: center; color: #888;">暂无设定条目，点击右上角添加</div>';
        return;
    }

    book.entries.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = 'worldbook-item';
        item.innerHTML = `
            <div class="worldbook-title">${escapeHtml(entry.title || '未命名')}</div>
            <div class="worldbook-desc">${escapeHtml(entry.content?.substring(0, 50) || '无内容')}...</div>
        `;
        item.addEventListener('click', () => openWorldbookEntryModal(index));
        list.appendChild(item);
    });
}

function openWorldbookEntryModal(index = null) {
    const modal = document.getElementById('worldbook-entry-edit-modal');
    const titleEl = document.getElementById('worldbook-entry-modal-title');
    const idInput = document.getElementById('worldbook-entry-id');
    const titleInput = document.getElementById('worldbook-entry-title');
    const contentInput = document.getElementById('worldbook-entry-content');
    const priorityInput = document.getElementById('worldbook-entry-priority');
    const scanDepthInput = document.getElementById('worldbook-entry-scan-depth');
    const deleteBtn = document.getElementById('delete-worldbook-entry-btn');

    const book = State.worldbooks.find(b => b.id === currentWorldbookId);
    if (!book) return;
    if (!book.entries) book.entries = [];

    if (index !== null) {
        const entry = book.entries[index];
        titleEl.textContent = '编辑条目';
        idInput.value = index;
        titleInput.value = entry.title || '';
        contentInput.value = entry.content || '';
        priorityInput.value = entry.priority ?? 50;
        if (scanDepthInput) scanDepthInput.value = entry.scanDepth ?? 1;
        
        currentKeywords = [...(entry.keywords || [])];
        
        if (entry.enabled !== false) document.getElementById('worldbook-entry-enabled-toggle').classList.add('active');
        else document.getElementById('worldbook-entry-enabled-toggle').classList.remove('active');
        
        if (entry.isAlwaysOn) document.getElementById('worldbook-entry-always-on-toggle').classList.add('active');
        else document.getElementById('worldbook-entry-always-on-toggle').classList.remove('active');
        

        
        if (entry.caseSensitive) document.getElementById('worldbook-entry-case-toggle').classList.add('active');
        else document.getElementById('worldbook-entry-case-toggle').classList.remove('active');

        deleteBtn.style.display = 'block';
    } else {
        titleEl.textContent = '添加条目';
        idInput.value = -1;
        titleInput.value = '';
        contentInput.value = '';
        priorityInput.value = 50;
        if (scanDepthInput) scanDepthInput.value = 1;
        
        currentKeywords = [];
        
        document.getElementById('worldbook-entry-enabled-toggle').classList.add('active');
        document.getElementById('worldbook-entry-always-on-toggle').classList.remove('active');

        document.getElementById('worldbook-entry-case-toggle').classList.remove('active');
        
        deleteBtn.style.display = 'none';
    }

    renderKeywordTags();
    modal.classList.add('show');
}

function closeWorldbookEntryModal() {
    document.getElementById('worldbook-entry-edit-modal')?.classList.remove('show');
}

function saveWorldbookEntry() {
    const book = State.worldbooks.find(b => b.id === currentWorldbookId);
    if (!book) return;
    if (!book.entries) book.entries = [];

    const indexStr = document.getElementById('worldbook-entry-id').value;
    const index = parseInt(indexStr, 10);
    const title = document.getElementById('worldbook-entry-title').value.trim();
    const content = document.getElementById('worldbook-entry-content').value.trim();
    const priority = parseInt(document.getElementById('worldbook-entry-priority').value, 10) || 50;
    const scanDepth = Math.max(1, Math.min(20, parseInt(document.getElementById('worldbook-entry-scan-depth')?.value ?? '1', 10) || 1));
    
    const enabled = document.getElementById('worldbook-entry-enabled-toggle').classList.contains('active');
    const isAlwaysOn = document.getElementById('worldbook-entry-always-on-toggle').classList.contains('active');
    const caseSensitive = document.getElementById('worldbook-entry-case-toggle').classList.contains('active');

    if (!title) {
        showToast('请输入条目标题');
        return;
    }

    const entryData = {
        title,
        content,
        priority,
        scanDepth,
        enabled,
        isAlwaysOn,
        caseSensitive,
        keywords: [...currentKeywords]
    };

    if (index >= 0) {
        book.entries[index] = { ...book.entries[index], ...entryData };
    } else {
        const newId = 'wb_entry_' + Date.now();
        book.entries.push({ id: newId, ...entryData });
    }

    Storage.saveWorldbooks(State.worldbooks);
    initWorldbookEntriesList();
    closeWorldbookEntryModal();
}

async function deleteWorldbookEntry() {
    const book = State.worldbooks.find(b => b.id === currentWorldbookId);
    if (!book) return;

    const indexStr = document.getElementById('worldbook-entry-id').value;
    const index = parseInt(indexStr, 10);
    
    if (index < 0) return;
    const ok = await WeChatUI.showConfirm('删除条目', '确定删除这个设定条目吗？', '删除', '取消', true);
    if (!ok) return;
    book.entries.splice(index, 1);
    Storage.saveWorldbooks(State.worldbooks);
    initWorldbookEntriesList();
    closeWorldbookEntryModal();
}

// =============================
// 图片预览弹窗
// ==============================





// ===================================
// 记忆查看功能
// ==========================

function loadMemoryView(contact) {
    if (!State.summaryHistories) State.summaryHistories = {};
    const memories = State.summaryHistories[contact.id] || [];
    
    const container = document.getElementById('memory-list-container');
    const emptyHint = document.getElementById('memory-empty-hint');
    
    if (memories.length === 0) {
        container.innerHTML = '';
        emptyHint.style.display = 'block';
        return;
    }
    
    emptyHint.style.display = 'none';
    
    // 按时间倒序显示（最新的在上面）
    const reversedMemories = [...memories].reverse();
    
    container.innerHTML = reversedMemories.map((memory, index) => {
        const actualIndex = memories.length - 1 - index;
        const date = new Date(memory.time);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        
        return `
            <div class="memory-item" data-index="${actualIndex}" style="margin: 12px; padding: 16px; background: #f7f7f7; border-radius: 8px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <div style="font-size: 13px; color: #888;">
                        <span>第 ${actualIndex + 1} 次总结</span>
                      <span style="margin-left: 12px;">${dateStr}</span>
                        <span style="margin-left: 12px;">共 ${memory.messageCount || 0} 条消息</span>
                    </div>
               <button class="memory-delete-btn" data-index="${actualIndex}" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ff3b30; background: transparent; color: #ff3b30; border-radius: 4px; cursor: pointer;">删除</button>
              </div>
         <div class="memory-content" style="white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #333;">${escapeHtml(memory.content)}</div>
        </div>
        `;
    }).join('');
    
    // 绑定删除按钮事件
    container.querySelectorAll('.memory-delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
     const index = parseInt(btn.dataset.index);
        const confirmed = confirm('确定要删除这条记忆吗？');
            if (confirmed) {
                const removed = State.summaryHistories[contact.id][index];
                State.summaryHistories[contact.id].splice(index, 1);
                Storage.saveSummaryHistories(State.summaryHistories);
                if (removed) {
                    const vid = getSummaryVectorId(removed);
                    const store = State.summaryVectors?.[contact.id];
                    if (vid && store && store.items) {
                        Object.keys(store.items).forEach((k) => {
                            if (k === vid || k.startsWith(`${vid}#`)) delete store.items[k];
                        });
                        Storage.saveSummaryVectors(State.summaryVectors);
                    }
                }
             loadMemoryView(contact);
          showToast('已删除');
            }
        });
    });
}

// 为所有提示词添加重置按钮的样式和功能已在总结设置中实现
// 现在为其他提示词区域添加重置按钮

// 全局提示词 - 添加重置按钮（清空）
document.querySelector('#global-prompt')?.parentElement?.querySelector('.section-header')?.insertAdjacentHTML('beforeend', '<button type="button" id="reset-global-prompt-btn" style="margin-left: 10px; padding: 2px 8px; font-size: 12px; border: 1px solid #07c160; background: transparent; color: #07c160; border-radius: 4px; cursor: pointer;">清空</button>');

// 模块化提示词 - 添加重置按钮
const promptModuleIds = ['prompt-role-template', 'prompt-protocol-template', 'prompt-human-template', 'prompt-capability-template'];
promptModuleIds.forEach(id => {
    const textarea = document.getElementById(id);
    if (textarea) {
        const label = textarea.previousElementSibling;
     if (label && label.tagName === 'LABEL') {
            const resetBtn = document.createElement('button');
         resetBtn.type = 'button';
            resetBtn.textContent = '恢复默认';
            resetBtn.style.cssText = 'margin-left: 10px; padding: 2px 8px; font-size: 12px; border: 1px solid #07c160; background: transparent; color: #07c160; border-radius: 4px; cursor: pointer; float: right;';
            resetBtn.onclick = () => {
             const moduleKey = id.replace('prompt-', '').replace('-template', '');
          if (Storage.DEFAULT_PROMPT_MODULES[moduleKey]) {
                 textarea.value = Storage.DEFAULT_PROMPT_MODULES[moduleKey];
                showToast('已恢复默认');
                }
       };
            label.appendChild(resetBtn);
        }
    }
});

// 全局提示词重置按钮事件
document.getElementById('reset-global-prompt-btn')?.addEventListener('click', () => {
    document.getElementById('global-prompt').value = '';
    showToast('已清空全局提示词');
});

// 其他要求重置按钮
const extraRulesLabel = document.querySelector('label[for="prompt-extra-rules"]');
if (extraRulesLabel) {
    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = '清空';
    resetBtn.style.cssText = 'margin-left: 10px; padding: 2px 8px; font-size: 12px; border: 1px solid #07c160; background: transparent; color: #07c160; border-radius: 4px; cursor: pointer; float: right;';
    resetBtn.onclick = () => {
        document.getElementById('prompt-extra-rules').value = '';
        showToast('已清空');
    };
    extraRulesLabel.appendChild(resetBtn);
}


// 常量定义
const CONSTANTS = {
    ZINDEX: {
        DETAIL_PAGE: 1600,
        IMAGE_PREVIEW: 10001
    },
    TIMING: {
        RED_PACKET_ANIMATION: 500,
        INIT_DELAY: 1000
    },
    UI: {
        MENU_MARGIN: 10,
        MENU_WIDTH: 280,
        MENU_HEIGHT: 56,
        QUOTE_MAX_LENGTH: 60
    }
};

// 辅助函数：创建详情页基础结构
function createDetailPage() {
    // 先移除所有已存在的红包/转账详情页，防止页面叠加
    document.querySelectorAll('.money-detail-page').forEach(p => p.remove());

    const page = document.createElement('div');
    page.className = 'page sub-page money-detail-page';
  page.style.position = 'fixed';
    page.style.inset = '0';
    page.style.zIndex = String(CONSTANTS.ZINDEX.DETAIL_PAGE);
    page.style.backgroundColor = '#fff';
    page.style.display = 'block';

    return page;
}

// 辅助函数：安全地绑定事件监听器
function bindEventSafely(page, selector, event, handler) {
    requestAnimationFrame(() => {
        page.querySelector(selector)?.addEventListener(event, handler);
    });
}

// =============
// 消息长按菜单功能
// ==========

// 全局变量：存储长按状态
let longPressTimer = null;
let isLongPress = false;
let currentMessageIndex = -1;
let isMultiSelectMode = false;
let selectedMessageIndexes = new Set();
let replyDraft = null;

function updateReplyDraftBar() {
    const bar = document.getElementById('reply-draft-bar');
    const textEl = document.getElementById('reply-draft-text');
    if (!bar || !textEl) return;
    if (!replyDraft || !replyDraft.quote) {
        bar.style.display = 'none';
        textEl.textContent = '';
        return;
    }
    textEl.textContent = replyDraft.quote;
    bar.style.display = 'flex';
}

window.getReplyDraft = function () {
    return replyDraft;
};

window.clearReplyDraft = function () {
    replyDraft = null;
    updateReplyDraftBar();
};

window.setReplyDraft = function (quoteText) {
    replyDraft = { quote: quoteText || '' };
    updateReplyDraftBar();
};

// 初始化长按菜单事件
function initContextMenuEvents() {
    const menu = document.getElementById('message-context-menu');
    if (!menu) return;

    // 绑定菜单项点击事件 (改用事件委托并拦截多种点击事件，防止移动端冲突)
    menu.addEventListener('click', (e) => {
        const item = e.target.closest('.context-menu-item');
        if (!item) return;
        
        e.stopPropagation();
        e.preventDefault();
        
        const action = item.dataset.action;
        const messageIndex = parseInt(menu.dataset.messageIndex);

        console.log('触发菜单操作:', action, '索引:', messageIndex);
        handleContextMenuAction(action, messageIndex);
        closeContextMenu();
    });

    // 防止在菜单内部触摸/点击时触发 document 的关闭事件
    const stopPropagation = (e) => e.stopPropagation();
    menu.addEventListener('touchstart', stopPropagation, { passive: false });
    menu.addEventListener('mousedown', stopPropagation);

    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages && !chatMessages.dataset.multiSelectBound) {
        chatMessages.dataset.multiSelectBound = '1';
        chatMessages.addEventListener('click', (e) => {
            if (!isMultiSelectMode) return;
            const bubble = e.target.closest('.message-bubble[data-index]');
            if (!bubble) return;
            e.preventDefault();
            e.stopImmediatePropagation();
            const index = parseInt(bubble.dataset.index, 10);
            if (!Number.isNaN(index)) {
                toggleSelectMessage(index);
            }
        }, true);
    }

    const cancelReplyBtn = document.getElementById('reply-draft-cancel');
    if (cancelReplyBtn && !cancelReplyBtn.dataset.bound) {
        cancelReplyBtn.dataset.bound = '1';
        cancelReplyBtn.addEventListener('click', () => {
            window.clearReplyDraft?.();
        });
    }

    const originalRenderChatMessages = window.renderChatMessages;
    if (typeof originalRenderChatMessages === 'function' && !window.__multiSelectWrapped) {
        window.__multiSelectWrapped = true;
        window.renderChatMessages = function (...args) {
            originalRenderChatMessages.apply(this, args);
            if (isMultiSelectMode) {
                syncMultiSelectUI();
                updateMultiSelectToolbar();
            }
        };
    }
}

// 处理菜单操作
function handleContextMenuAction(action, messageIndex) {
    if (!State.currentContactId || messageIndex < 0) return;

    const msgData = State.chatHistories[State.currentContactId][messageIndex];
    if (!msgData) return;

    switch (action) {
        case 'copy':
            copyMessage(msgData);
            break;
        case 'quote':
            quoteMessage(msgData);
            break;
        case 'recall':
            recallMessage(messageIndex);
            break;
        case 'multi-select':
            enterMultiSelectMode(messageIndex);
            break;
        case 'delete':
            deleteMessage(messageIndex);
            break;
        case 'edit':
            openMessageEditModal(messageIndex);
            break;
        case 'view-call-log':
            showCallTranscriptModal(msgData);
            break;
        default:
            break;
    }
}

function getCallTranscriptItems(msgData) {
    if (!msgData) return [];
    try {
        const parsed = JSON.parse(msgData.content);
        const transcript = Array.isArray(parsed?.callTranscript) ? parsed.callTranscript : [];
        return transcript
            .map(item => ({
                role: item?.role === 'assistant' ? 'assistant' : 'user',
                content: String(item?.content || '').trim()
            }))
            .filter(item => item.content);
    } catch (e) {
        return [];
    }
}

function isCallRecordMessage(msgData) {
    if (!msgData) return false;
    try {
        const parsed = JSON.parse(msgData.content);
        const text = String(parsed?.content || '');
        return text.startsWith('[通话记录]');
    } catch (e) {
        return false;
    }
}

function extractMessageText(msgData) {
    if (!msgData) return '';
    try {
        const parsed = JSON.parse(msgData.content);
        if (parsed.type === 'text' || parsed.type === 'text_message') return parsed.content || '';
        if (parsed.type === 'image') return parsed.description || '[图片]';
        if (parsed.type === 'sticker_message') return `[${parsed.sticker || '表情'}]`;
        if (parsed.type === 'voice') return parsed.text || parsed.transcription || '[语音]';
        if (parsed.type === 'quote') {
            const q = parsed.quote || '';
            const c = parsed.content || '';
            return q ? `「${q}」\n${c}` : c;
        }
        return JSON.stringify(parsed);
    } catch (e) {
        return msgData.content || '';
    }
}

// 复制消息
function copyMessage(msgData) {
    const textToCopy = extractMessageText(msgData);
    if (!textToCopy) {
        showToast('没有可复制内容');
        return;
    }
    if (!navigator.clipboard || !navigator.clipboard.writeText) {
        showToast('复制失败');
        return;
    }
    navigator.clipboard.writeText(textToCopy)
        .then(() => showToast('已复制'))
        .catch(() => showToast('复制失败'));
}

// 删除消息
async function deleteMessage(messageIndex) {
    const ok = (typeof WeChatUI !== 'undefined' && typeof WeChatUI.showConfirm === 'function')
        ? await WeChatUI.showConfirm('删除消息', '确定删除这条消息吗？', '删除', '取消', true)
        : confirm('确定删除这条消息吗？');
    if (!ok) return;
    State.chatHistories[State.currentContactId].splice(messageIndex, 1);
    Storage.saveChatHistories(State.chatHistories);
    renderChatMessages();
    showToast('已删除');
}

async function recallMessage(messageIndex) {
    const contactId = State.currentContactId;
    const history = State.chatHistories[contactId] || [];
    const msgData = history[messageIndex];
    if (!msgData) return;
    if (msgData.role !== 'user' && msgData.role !== 'assistant') return;

    const ok = (typeof WeChatUI !== 'undefined' && typeof WeChatUI.showConfirm === 'function')
        ? await WeChatUI.showConfirm('撤回消息', '确定撤回这条消息吗？撤回后会在聊天里显示一条撤回提示。', '撤回', '取消', true)
        : confirm('确定撤回这条消息吗？');
    if (!ok) return;

    const fn = window.recallMessageAt || recallMessageAt;
    if (typeof fn !== 'function') {
        showToast('撤回功能未加载');
        return;
    }
    const success = fn(contactId, messageIndex, msgData.role);
    if (success) showToast('已撤回');
}

// 引用消息
function quoteMessage(msgData) {
    const quoteText = extractMessageText(msgData);
    const input = document.getElementById('message-input');
    if (input) {
        const shortQuote = quoteText.substring(0, CONSTANTS.UI.QUOTE_MAX_LENGTH) + (quoteText.length > CONSTANTS.UI.QUOTE_MAX_LENGTH ? '...' : '');
        window.setReplyDraft?.(shortQuote);
        input.focus();
        showToast('已引用');
    }
}

function ensureMultiSelectToolbar() {
    let bar = document.getElementById('multi-select-toolbar');
    if (bar) return bar;

    bar = document.createElement('div');
    bar.id = 'multi-select-toolbar';
    bar.className = 'multi-select-toolbar';
    bar.innerHTML = `
        <button type="button" class="multi-select-text-btn" data-action="cancel">取消</button>
        <div class="multi-select-count">已选 0 条</div>
        <button type="button" class="multi-select-text-btn danger icon-only" data-action="delete" aria-label="删除">
            <i class="fas fa-trash-alt"></i>
        </button>
    `;
    bar.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        const action = btn.dataset.action;
        if (action === 'cancel') {
            exitMultiSelectMode();
        } else if (action === 'delete') {
            deleteSelectedMessages();
        }
    });
    const chatPage = document.getElementById('chat-page');
    (chatPage || document.body).appendChild(bar);
    return bar;
}

function enterMultiSelectMode(initialIndex) {
    if (isMultiSelectMode) return;
    isMultiSelectMode = true;
    selectedMessageIndexes.clear();
    selectedMessageIndexes.add(initialIndex);
    ensureMultiSelectToolbar().classList.add('show');
    document.getElementById('chat-page')?.classList.add('multi-select-mode');
    syncMultiSelectUI();
    updateMultiSelectToolbar();
    showToast('已进入多选');
}

function exitMultiSelectMode() {
    isMultiSelectMode = false;
    selectedMessageIndexes.clear();
    const bar = document.getElementById('multi-select-toolbar');
    if (bar) bar.classList.remove('show');
    document.getElementById('chat-page')?.classList.remove('multi-select-mode');
    syncMultiSelectUI();
}

function toggleSelectMessage(index) {
    if (selectedMessageIndexes.has(index)) {
        selectedMessageIndexes.delete(index);
    } else {
        selectedMessageIndexes.add(index);
    }
    syncMultiSelectUI();
    updateMultiSelectToolbar();
    if (selectedMessageIndexes.size === 0) {
        exitMultiSelectMode();
    }
}

function syncMultiSelectUI() {
    document.querySelectorAll('#chat-messages .message-bubble[data-index]').forEach((bubble) => {
        const idx = parseInt(bubble.dataset.index, 10);
        const row = bubble.closest('.message-row');
        if (isMultiSelectMode && selectedMessageIndexes.has(idx)) {
            row?.classList.add('selection-selected');
        } else {
            row?.classList.remove('selection-selected');
        }
    });
}

function updateMultiSelectToolbar() {
    const bar = ensureMultiSelectToolbar();
    const countEl = bar.querySelector('.multi-select-count');
    if (countEl) countEl.textContent = `已选 ${selectedMessageIndexes.size} 条`;
}

async function deleteSelectedMessages() {
    if (!State.currentContactId) return;
    const count = selectedMessageIndexes.size;
    if (count === 0) return;
    const ok = (typeof WeChatUI !== 'undefined' && typeof WeChatUI.showConfirm === 'function')
        ? await WeChatUI.showConfirm('批量删除', `确定删除选中的 ${count} 条消息吗？`, '删除', '取消', true)
        : confirm(`确定删除选中的 ${count} 条消息吗？`);
    if (!ok) return;

    const history = State.chatHistories[State.currentContactId] || [];
    Array.from(selectedMessageIndexes)
        .sort((a, b) => b - a)
        .forEach((idx) => {
            if (idx >= 0 && idx < history.length) history.splice(idx, 1);
        });

    Storage.saveChatHistories(State.chatHistories);
    renderChatMessages();
    exitMultiSelectMode();
    showToast(`已删除 ${count} 条`);
}

// 显示长按菜单
window.showContextMenu = function(event, messageIndex, side) {
    if (isMultiSelectMode) return;
    const menu = document.getElementById('message-context-menu');
    if (!menu) return;
    const history = State.chatHistories[State.currentContactId] || [];
    const msgData = history[messageIndex];
    const viewItem = menu.querySelector('[data-action="view-call-log"]');
    if (viewItem) {
        viewItem.style.display = isCallRecordMessage(msgData) ? 'flex' : 'none';
    }
    const recallItem = menu.querySelector('[data-action="recall"]');
    if (recallItem) {
        recallItem.style.display = msgData && (msgData.role === 'user' || msgData.role === 'assistant') ? 'flex' : 'none';
    }

    // 定位菜单
    let x, y;
    if (event.touches && event.touches[0]) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        x = event.clientX;
        y = event.clientY;
    }

    // 先临时显示用于测量菜单尺寸
    menu.style.display = 'grid';
    menu.style.visibility = 'hidden';
    const menuWidth = menu.offsetWidth || CONSTANTS.UI.MENU_WIDTH;
    const menuHeight = menu.offsetHeight || CONSTANTS.UI.MENU_HEIGHT;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    const margin = CONSTANTS.UI.MENU_MARGIN;

    // 横向菜单默认出现在按压点上方，居中贴近微信样式
    x = x - menuWidth / 2;
    y = y - menuHeight - 12;

    if (x + menuWidth > screenWidth - margin) {
        x = screenWidth - menuWidth - margin;
    }
    if (x < margin) x = margin;
    if (y < margin) y = margin;
    if (y + menuHeight > screenHeight - margin) {
        y = screenHeight - menuHeight - margin;
    }

    menu.style.left = x + 'px';
    menu.style.top = y + 'px';
    menu.style.visibility = 'visible';
    menu.style.display = 'grid';
    menu.dataset.messageIndex = messageIndex;

    // 点击菜单外部关闭 (延迟绑定，避免当前点击事件立即触发关闭)
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu, { once: true });
        document.addEventListener('touchstart', closeContextMenu, { once: true });
    }, 100);
}

// 关闭长按菜单
window.closeContextMenu = function() {
    const menu = document.getElementById('message-context-menu');
    if (menu) {
        menu.style.display = 'none';
    }
    document.removeEventListener('click', closeContextMenu);
    document.removeEventListener('touchstart', closeContextMenu);
}

function showCallTranscriptModal(msgData) {
    const items = getCallTranscriptItems(msgData);
    const oldModal = document.getElementById('vx-call-transcript-modal');
    if (oldModal) oldModal.remove();

    const contact = State.contacts.find(c => c.id === State.currentContactId);
    const contactName = contact?.name || '对方';
    const userName = State.user?.nickname || '我';
    const parsed = (() => {
        try {
            return JSON.parse(msgData.content);
        } catch (e) {
            return null;
        }
    })();
    const summaryText = String(parsed?.content || '').replace(/^\[通话记录\]\n?/, '').trim();

    const modal = document.createElement('div');
    modal.id = 'vx-call-transcript-modal';
    modal.className = 'modal wechat-dialog-modal show';
    modal.style.zIndex = String(CONSTANTS.ZINDEX.IMAGE_PREVIEW);

    const transcriptHtml = items.map(item => {
        const who = item.role === 'assistant' ? contactName : userName;
        const roleClass = item.role === 'assistant' ? 'assistant' : 'user';
        return `
            <div class="call-transcript-item ${roleClass}">
                <div class="call-transcript-speaker">${escapeHtml(who)}</div>
                <div class="call-transcript-text">${escapeHtml(item.content).replace(/\n/g, '<br>')}</div>
            </div>
        `;
    }).join('') || `
        <div class="call-transcript-empty">这次通话还没有可查看的过程记录。</div>
    `;

    modal.innerHTML = `
        <div class="modal-overlay" style="background: rgba(0, 0, 0, 0.42);"></div>
        <div class="wechat-dialog call-transcript-dialog">
            <div class="wechat-dialog-title">通话记录</div>
            <div class="call-transcript-summary">${escapeHtml(summaryText || '本次通话')}</div>
            <div class="wechat-dialog-body call-transcript-body">${transcriptHtml}</div>
            <div class="wechat-dialog-footer">
                <button class="wechat-dialog-btn confirm call-transcript-close">关闭</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('.modal-overlay')?.addEventListener('click', close);
    modal.querySelector('.call-transcript-close')?.addEventListener('click', close);
}

// ===========
// 图片预览功能
// =============

function showImagePreview(imageData) {
    const oldModal = document.getElementById('vx-image-preview-modal');
    if (oldModal) oldModal.remove();

    const isLocalImage = !!(imageData && imageData.isLocal && imageData.content);
    const description = imageData?.description || '暂无描述';

    const modal = document.createElement('div');
    modal.id = 'vx-image-preview-modal';
    modal.className = 'modal wechat-dialog-modal show';
    modal.style.zIndex = String(CONSTANTS.ZINDEX.IMAGE_PREVIEW);

    modal.innerHTML = `
        <div class="modal-overlay" style="background: rgba(0, 0, 0, 0.52);"></div>
        <div class="wechat-dialog image-preview-dialog">
            <div class="wechat-dialog-title">图片</div>
            <div class="wechat-dialog-body image-preview-body">
                ${isLocalImage
                    ? `<img src="${imageData.content}" class="image-preview-real" alt="本地图片">`
                    : `<div class="image-preview-text">${escapeHtml(description)}</div>`
                }
            </div>
            <div class="wechat-dialog-footer">
                <button class="wechat-dialog-btn confirm image-preview-close">我知道了</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.remove();
    modal.querySelector('.modal-overlay')?.addEventListener('click', close);
    modal.querySelector('.image-preview-close')?.addEventListener('click', close);
}

// ===========
// 红包详情页
// ============

function showRedPacketDetail(content, side, index) {
    try {
        // 先移除所有已存在的红包/转账详情页，防止页面叠加
        document.querySelectorAll('.money-detail-page').forEach(p => p.remove());

        // 边界检查
        if (!State || !State.currentContactId || !State.contacts) {
            console.error('State 对象不完整');
          return;
        }

        const raw = String(content || '');
        const lines = raw.split('\n');
        const amountMatch = raw.match(/金额:\s*¥?\s*([0-9]+(?:\.[0-9]+)?)/);
        const amount = amountMatch ? (parseFloat(amountMatch[1]) || 0) : 0;
    const remarkLine = lines.find(l => String(l || '').includes('备注'));
        const remark = remarkLine ? String(remarkLine).replace(/^备注:\s*/i, '').trim() : '';

        const contact = State.contacts.find(c => c.id === State.currentContactId);
        const senderName = side === 'left' ? (contact?.name || '好友') : (State.user?.nickname || '我');

        const meta = side === 'left' ? ensureWxMoneyMetaForMessage(index, side, raw) : null;
      const isDone = !!(meta && meta.status === 'opened' && meta.receivedAt);

    const page = document.createElement('div');
    page.className = 'page sub-page money-detail-page';
    page.style.position = 'fixed';
    page.style.inset = '0';
    page.style.zIndex = String(CONSTANTS.ZINDEX.DETAIL_PAGE);
    page.style.backgroundColor = '#fff';
    page.style.display = 'block';

    const renderOpen = () => `
        <div style="height:100%; background:rgba(0,0,0,0.6); display:flex; flex-direction:column; justify-content:center; align-items:center; position:relative;">
            <div style="width:min(320px, 80vw); height:min(440px, 70vh); background:#eb5442; border-radius:12px; position:relative; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.3);">
                <div style="position:absolute; top:0; left:0; right:0; height:100px; background:#e04f3d; border-bottom-left-radius:50% 20px; border-bottom-right-radius:50% 20px;"></div>
                <div style="position:relative; padding-top:42px; display:flex; flex-direction:column; align-items:center;">
                    <div style="width:40px; height:40px; border-radius:4px; background:#fff; overflow:hidden; margin-bottom:10px;">
                        <img src="${escapeHtml(contact?.avatar || 'images/default-avatar.png')}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/default-avatar.png'">
                    </div>
                    <div style="font-size:16px; color:#ffe2b1; margin-bottom:16px;">${escapeHtml(senderName)}的红包</div>
                    <div style="font-size:20px; font-weight:500; color:#ffe2b1; letter-spacing:1px; text-align:center; padding:0 20px;">${escapeHtml(remark || '恭喜发财，大吉大利')}</div>
                </div>
                ${side === 'left'
                    ? `<button id="wx-rp-open" type="button" style="position:absolute; left:50%; top:65%; transform:translate(-50%, -50%); width:84px; height:84px; border-radius:42px; border:none; background:#ebcd99; color:#333; font-size:36px; font-weight:600; cursor:pointer; box-shadow:0 4px 12px rgba(0,0,0,0.15); display:flex; align-items:center; justify-content:center; z-index:10;">開</button>`
                    : `<div style="position:absolute; left:50%; top:65%; transform:translate(-50%, -50%); width:84px; height:84px; border-radius:42px; background:rgba(0,0,0,0.15); color:rgba(255,255,255,0.8); display:flex; align-items:center; justify-content:center; font-size:14px;">已发出</div>`
                }
            </div>
            <button id="wx-rp-close" type="button" style="position:absolute; left:50%; bottom:calc(50% - min(220px, 35vh) - 60px); transform:translateX(-50%); width:36px; height:36px; border-radius:18px; border:1px solid rgba(255,255,255,0.6); background:transparent; color:rgba(255,255,255,0.8); font-size:24px; display:flex; align-items:center; justify-content:center; cursor:pointer; line-height:1;">×</button>
        </div>
    `;

    const renderDone = () => `
        <div style="height:100%; display:flex; flex-direction:column; background:#fff; position:relative;">
            <div style="position:absolute; top:20px; left:14px; z-index:10;">
                <button id="wx-rp-back" type="button" style="width:34px; height:34px; border:none; background:transparent; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer; color:#f7e1b5;">
                    <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><path d="M15 5 L8 12 L15 19" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div style="height:120px; background:#eb5442; border-bottom-left-radius:50% 20px; border-bottom-right-radius:50% 20px;"></div>
            <div style="position:relative; margin-top:-20px; display:flex; flex-direction:column; align-items:center; padding:0 20px;">
                <div style="width:48px; height:48px; border-radius:4px; background:#fff; overflow:hidden; margin-bottom:12px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <img src="${escapeHtml(contact?.avatar || 'images/default-avatar.png')}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/default-avatar.png'">
                </div>
                <div style="font-size:17px; font-weight:600; color:#333; display:flex; align-items:center; gap:6px;">
                    ${escapeHtml(senderName)}的红包
                    <span style="color:#e05a4f; background:#fceceb; padding:1px 4px; border-radius:4px; font-size:11px; font-weight:normal;">拼</span>
                </div>
                <div style="margin-top:8px; font-size:14px; color:#999;">${escapeHtml(remark || '恭喜发财，大吉大利')}</div>
                <div style="margin-top:24px; font-size:54px; font-weight:700; color:#cda35e; line-height:1; display:flex; align-items:baseline; justify-content:center;">
                    ${(+amount || 0).toFixed(2)}<span style="font-size:16px; font-weight:600; margin-left:4px; margin-bottom:10px;">元</span>
                </div>
                <div style="margin-top:16px; font-size:13px; color:#cda35e; display:flex; align-items:center;">
                    已存入零钱，可直接消费
                    <svg viewBox="0 0 24 24" width="14" height="14" style="margin-left:2px;"><path d="M9 18 L15 12 L9 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <button id="wx-rp-reply" type="button" style="margin-top:40px; padding:0 24px; height:42px; border:none; border-radius:8px; background:#f5f5f5; color:#cda35e; font-size:15px; font-weight:500; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                    <svg viewBox="0 0 24 24" width="20" height="20"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 10.5 A1.5 1.5 0 1 1 8 10.4 M16 10.5 A1.5 1.5 0 1 1 16 10.4 M9 15 Q12 18 15 15" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
                    回复表情到聊天
                </button>
            </div>
            <div style="flex:1;"></div>
        </div>
    `;

    page.innerHTML = isDone ? renderDone() : renderOpen();
    document.getElementById('app').appendChild(page);

    const close = () => page.remove();
    page.querySelector('#wx-rp-close')?.addEventListener('click', close);
    page.querySelector('#wx-rp-back')?.addEventListener('click', close);
    page.querySelector('#wx-rp-reply')?.addEventListener('click', close);

    page.querySelector('#wx-rp-open')?.addEventListener('click', async () => {
        const latestMeta = ensureWxMoneyMetaForMessage(index, side, raw);
        if (!latestMeta || latestMeta.status === 'opened') return;
        const openBtn = page.querySelector('#wx-rp-open');
        if (openBtn) {
                 openBtn.style.transform = 'translate(-50%, -50%) rotate(360deg)';
       openBtn.style.transition = 'transform 0.5s ease-in-out';
            await new Promise(r => setTimeout(r, CONSTANTS.TIMING.RED_PACKET_ANIMATION));
        }
        State.wallet.balance = +((State.wallet.balance || 0) + (+latestMeta.amount || 0)).toFixed(2);
        addWalletBill('redpacket_in', +latestMeta.amount || 0, `${senderName} 红包`);
        Storage.saveWallet(State.wallet);
        initWalletPage();
        renderWalletBills();
        updateWxMoneyStatusAtIndex(index, 'opened', raw, { receivedAt: Date.now() });
        renderChatMessages();
        initChatList();
        page.innerHTML = renderDone();
        // 使用 requestAnimationFrame 确保 DOM 已渲染完成再绑定事件
        requestAnimationFrame(() => {
          page.querySelector('#wx-rp-back')?.addEventListener('click', close);
          page.querySelector('#wx-rp-reply')?.addEventListener('click', close);
      });
    });
    } catch (error) {
        console.error('显示红包详情失败:', error);
        if (typeof showToast === 'function') {
            showToast('打开红包详情失败');
        }
    }
}

// ==============
// 转账详情页
// =================

function showTransferDetail(content, side, index) {
    try {
        // 先移除所有已存在的红包/转账详情页，防止页面叠加
      document.querySelectorAll('.money-detail-page').forEach(p => p.remove());

        // 边界检查
        if (!State || !State.currentContactId || !State.contacts) {
            console.error('State 对象不完整');
          return;
      }

        const raw = String(content || '');
        const amountMatch = raw.match(/金额:\s*¥?\s*([0-9]+(?:\.[0-9]+)?)/);
        const amount = amountMatch ? (parseFloat(amountMatch[1]) || 0) : 0;
        const contact = State.contacts.find(c => c.id === State.currentContactId);
        const senderName = contact?.name || '好友';
        const meta = side === 'left' ? ensureWxMoneyMetaForMessage(index, side, raw) : null;
        const isDone = !!(meta && meta.status === 'received' && meta.receivedAt);

        const transferTime = meta?.createdAt ? formatWxCNTime(meta.createdAt) : formatWxCNTime(Date.now());
        const receivedTime = meta?.receivedAt ? formatWxCNTime(meta.receivedAt) : '';
      const amountStr = `¥${(+amount || 0).toFixed(2)}`;

    const page = document.createElement('div');
    page.className = 'page sub-page money-detail-page';
    page.style.position = 'fixed';
    page.style.inset = '0';
    page.style.zIndex = String(CONSTANTS.ZINDEX.DETAIL_PAGE);
    page.style.backgroundColor = '#fff';
    page.style.display = 'block';

    const renderPending = () => `
        <div style="height:100%; display:flex; flex-direction:column; background:#fff;">
            <div style="height:56px; display:flex; align-items:center; padding:0 14px;">
                <button id="wx-transfer-back" type="button" style="width:34px; height:34px; border:none; background:transparent; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14.5 5.5 L8 12 L14.5 18.5" fill="none" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; padding:40px 20px 0;">
                <div style="width:64px; height:64px; border-radius:32px; border:3px solid #4a90e2; display:flex; align-items:center; justify-content:center; color:#4a90e2;">
                    <svg viewBox="0 0 24 24" width="34" height="34" aria-hidden="true">
                        <circle cx="12" cy="12" r="8" fill="none" stroke="#4a90e2" stroke-width="2"/>
                        <path d="M12 7 V12 L15 14" fill="none" stroke="#4a90e2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <div style="margin-top:18px; font-size:16px; color:#333;">${side === 'left' ? '待你收款' : '待对方收款'}</div>
                <div style="margin-top:10px; font-size:44px; font-weight:600; color:#111; line-height:1;">${amountStr}</div>
                <div style="margin-top:18px; width:100%; max-width:420px; border-top:1px solid rgba(0,0,0,0.06); padding-top:14px; color:#888; font-size:13px; display:flex; justify-content:space-between;">
                    <div>转账时间</div>
                    <div style="color:#333;">${escapeHtml(transferTime)}</div>
                </div>
            </div>
            <div style="padding:16px 20px 26px;">
                ${side === 'left'
                    ? `<button id="wx-transfer-receive" type="button" style="width:100%; height:46px; border:none; border-radius:10px; background:#07c160; color:#fff; font-size:16px; font-weight:500; cursor:pointer;">收款</button>
                       <div style="margin-top:10px; text-align:center; color:#999; font-size:12px;">1天内未确认，将退还给对方。</div>`
                    : `<div style="text-align:center; color:#999; font-size:12px;">等待对方收款</div>`
                }
            </div>
        </div>
    `;

    const renderDone = () => `
        <div style="height:100%; display:flex; flex-direction:column; background:#fff;">
            <div style="height:56px; display:flex; align-items:center; padding:0 14px;">
                <button id="wx-transfer-back" type="button" style="width:34px; height:34px; border:none; background:transparent; border-radius:8px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M14.5 5.5 L8 12 L14.5 18.5" fill="none" stroke="#1a1a1a" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
            </div>
            <div style="flex:1; display:flex; flex-direction:column; align-items:center; padding:36px 20px 0;">
                <div style="width:64px; height:64px; border-radius:32px; background:#07c160; display:flex; align-items:center; justify-content:center;">
                    <svg viewBox="0 0 24 24" width="36" height="36" aria-hidden="true"><path d="M6 12.5 L10.2 16.7 L18 8.9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </div>
                <div style="margin-top:18px; font-size:16px; color:#333;">${side === 'left' ? '你已收款，资金已存入零钱' : '对方已收款'}</div>
                <div style="margin-top:10px; font-size:44px; font-weight:600; color:#111; line-height:1;">${amountStr}</div>
                <div style="margin-top:18px; width:100%; max-width:420px; border-top:1px solid rgba(0,0,0,0.06); padding-top:14px; color:#888; font-size:13px;">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;"><div>转账时间</div><div style="color:#333;">${escapeHtml(transferTime)}</div></div>
                    <div style="display:flex; justify-content:space-between;"><div>收款时间</div><div style="color:#333;">${escapeHtml(receivedTime || formatWxCNTime(Date.now()))}</div></div>
                </div>
                <div style="margin-top:22px; width:100%; max-width:420px; display:flex; justify-content:center; color:#888; font-size:13px;">账单详情</div>
            </div>
        </div>
    `;

    page.innerHTML = isDone ? renderDone() : renderPending();
    document.getElementById('app').appendChild(page);

    const close = () => page.remove();
    page.querySelector('#wx-transfer-back')?.addEventListener('click', close);
    page.querySelector('#wx-transfer-receive')?.addEventListener('click', () => {
        if (side !== 'left') return;
        const latestMeta = ensureWxMoneyMetaForMessage(index, side, raw);
        if (!latestMeta || latestMeta.status === 'received') return;
        State.wallet.balance = +((State.wallet.balance || 0) + (+latestMeta.amount || 0)).toFixed(2);
        addWalletBill('transfer_in', +latestMeta.amount || 0, `${senderName} 转账`);
        Storage.saveWallet(State.wallet);
        initWalletPage();
        renderWalletBills();
        updateWxMoneyStatusAtIndex(index, 'received', raw, { receivedAt: Date.now() });
        renderChatMessages();
        initChatList();
      page.innerHTML = renderDone();
        // 使用 requestAnimationFrame 确保 DOM 已渲染完成再绑定事件
        requestAnimationFrame(() => {
            page.querySelector('#wx-transfer-back')?.addEventListener('click', close);
        });
    });
    } catch (error) {
        console.error('显示转账详情失败:', error);
        if (typeof showToast === 'function') {
         showToast('打开转账详情失败');
        }
    }
}

// ========
// 语音消息折叠/展开
// =================

function toggleVoiceMessage(bubble) {
    const textEl = bubble.querySelector('.voice-translation');
    if (textEl) {
        if (textEl.style.display === 'none' || !textEl.style.display) {
        textEl.style.display = 'block';
            bubble.classList.add('voice-expanded');
        } else {
            textEl.style.display = 'none';
            bubble.classList.remove('voice-expanded');
    }
    }
}

// ===========
// 初始化
// ===================

// 在 DOMContentLoaded 后调用
document.addEventListener('DOMContentLoaded', () => {
    // 延迟初始化，确保其他代码已加载
    setTimeout(() => {
        initContextMenuEvents();
        console.log('消息长按菜单已初始化');
    }, CONSTANTS.TIMING.INIT_DELAY);
});

console.log('功能改进补丁已加载');