# 不完全跑路感言

## 一、作者的一些废话

**感谢您关注此项目！**

我是一名普通的 AI Coding 爱好者，这个音乐应用项目也是我目前参与的最复杂的前端练手项目。主要使用 OpenAI Codex 和 Google Antigravity 进行开发：前端基于 Gemini 3 Pro，后端基于 GPT-5.1-Codex，各种小修小补则依靠 Claude Sonnet/Opus 4.5，可以说是集百家之长。

去年12月初，我在 [LINUX DO](https://linux.do/) 上刷到了后端作者的帖子，原版后端使用起来门槛很低，而且 API 的设计规范给人一种“秦始皇统一度量衡”的感觉。

做这个项目纯属心血来潮，我想验证一下自媒体天天鼓吹的“前端已死”便着手开展这个项目。没想到，即使是 ALL in AI 也花了几天空闲时间，反复打磨才初见成效。

后来，我自信满满地公开了这个项目并发帖推广，大概收获了几百个访问量，项目的 Star 和 Fork 也达到了**两位数**。

现在我准备跑路了，顺便回答**一些朋友关心的几个问题**：

 1. **为什么不提供下载功能？加个按钮不是很方便吗？**
   当然很方便，但是项目设计之初就是基于“在线”和“自用”两个出发点，即：能在线听就不需要下载。

 2. **为什么不做注册登录和云同步？**
   首先是版权问题，引入用户系统很可能导致商用，进而引发一系列麻烦。至于同步问题，个人喜欢在官方平台建立歌单，然后导入本项目收听和统一管理。这样做可以完全不依赖后端和数据库，把部署条件压到最低，安全性也有保障，而使用体验受影响微乎其微。

 3. **为什么要跑路？**
   答案很简单，这样一个**依赖单一且非官方的上游、大规模使用 AI 编码**的项目不可能长久：前者可能随时修改规则甚至停止服务，而后者使得维护成本变得很高，我没有动力继续维护和适应。

## 二、推荐的替代方案

### 1. 接入新版后端

作为开发者，您可以访问 [TuneHub 新版官网](https://tunehub.sayqz.com/docs)，按要求注册登录和购买积分并创建你的 API，然后研究怎么接入吧。

注意，原作者大规模修改了接口，因此简单地传入 API Key 是无法继续使用本项目的。

如果你有兴趣，可以考虑根据我写的 [API 文档](./api.md) 重新封装和部署一个兼容后端，然后改成你自己的接口 URL。这实在是太麻烦了，但做出来就能完美复活！

### 2. 使用成品软件

TuneHub 生态比较发达，作为普通用户，更推荐您试用这些成品软件，它们一般是免费、跨平台、支持下载和云同步的。

| 名称 | 性质 | 访问方式
| --- | --- | ---
| TuneFreeNext | 后端作者官方维护，多平台，维护及时 | 项目迭代中，可以看看他的 [主页](https://sayqz.com/) 或加入 QQ 群（这里不提供）
| MobiMusic | 生态产品，仅 Android，支持洛雪音源，实测很好用 | [官网](https://mobi.likegamex.top/)，推荐加群，更新最及时
| CyreneMusic | 生态产品，多平台，支持洛雪等多个音源 | [项目地址](https://github.com/moraxs/CyreneMusic)

### 3. 兼容洛雪音源

花了几分钟让 AI 生成的，实测可用。

首先，访问 [洛雪音乐官网](https://lxmusic.toside.cn/) 获取客户端。

然后，访问 [TuneHub 新版官网](https://tunehub.sayqz.com/docs) 获取 API Key。

最后，导入下面的自定义音源，在此之前你需要填入 API Key 并保存为一份JS文件，例如`tune.js`。

```JavaScript
/**
 * @name TuneHub
 * @description 基于 TuneHub V3 接口的洛雪音乐自定义音源
 * @version 1.2.0
 * @author whstu
 */

const { EVENT_NAMES, request, on, send, env, version } = globalThis.lx;

/**
 * === 配置区域 ===
 * 如果没有 API Key，请访问 https://tunehub.sayqz.com/ 获取
 */
const API_KEY = 'th_xxxxxxxxxxxxxx'; // 请替换为你的 TuneHub API Key
const BASE_URL = 'https://tunehub.sayqz.com/api/v1';

// === 平台映射配置 ===
const PLATFORM_MAP = {
    wy: 'netease',
    tx: 'qq',
    kw: 'kuwo',
};

// === 音质映射表 ===
const QUALITY_MAP = {
    '128k': '128k',
    '320k': '320k',
    'flac': 'flac',
    'flac24bit': 'flac24bit',
};

// 音质降级顺序
const QUALITY_FALLBACK = {
    'flac24bit': ['flac24bit', 'flac', '320k', '128k'],
    'flac': ['flac', '320k', '128k'],
    '320k': ['320k', '128k'],
    '128k': ['128k'],
};

// === 音源定义 ===
const sources = {
    wy: {
        name: '网易音乐',
        type: 'music',
        actions: ['musicUrl'],
        qualitys: ['128k', '320k', 'flac', 'flac24bit'],
    },
    tx: {
        name: 'QQ音乐',
        type: 'music',
        actions: ['musicUrl'],
        qualitys: ['128k', '320k', 'flac', 'flac24bit'],
    },
    kw: {
        name: '酷我音乐',
        type: 'music',
        actions: ['musicUrl'],
        qualitys: ['128k', '320k', 'flac'],
    },
};

/**
 * HTTP POST 请求工具
 */
const httpPost = (url, data) => new Promise((resolve, reject) => {
    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY,
        'User-Agent': env ? `lx-music-${env}/${version}` : `lx-music-request/${version}`,
    };

    request(url, {
        method: 'POST',
        headers,
        body: data,
    }, (err, resp) => {
        if (err) {
            console.error('[TuneHub] 网络请求错误:', err.message);
            return reject(new Error('网络请求失败: ' + err.message));
        }

        // HTTP 状态码检查
        if (resp.statusCode !== 200) {
            console.error(`[TuneHub] HTTP 状态码异常: ${resp.statusCode}`);
            return reject(new Error(`接口返回异常状态码: ${resp.statusCode}`));
        }

        resolve(resp.body);
    });
});

/**
 * 获取音乐播放链接（核心逻辑）
 */
const getMusicUrl = async (source, musicInfo, quality) => {
    const platform = PLATFORM_MAP[source];
    if (!platform) {
        throw new Error('不支持的音源平台');
    }

    // API Key 检查
    if (!API_KEY || API_KEY === 'th_xxxxxx') {
        throw new Error('请先在脚本开头配置有效的 API_KEY');
    }

    // 处理不同平台的 ID 字段（强制转字符串防止服务端错误）
    const rawId = musicInfo.songmid || musicInfo.musicId || musicInfo.hash || musicInfo.id;
    const songId = String(rawId);
    const targetQuality = QUALITY_MAP[quality] || '128k';

    // 日志输出（桌面端分组显示，移动端单行显示）
    if (env !== 'mobile') {
        console.group('[TuneHub] 获取音乐链接');
        console.log('平台:', sources[source].name);
        console.log('歌曲:', `${musicInfo.name} - ${musicInfo.singer}`);
        console.log('音质:', targetQuality);
        console.log('ID:', songId);
        console.groupEnd();
    } else {
        console.log(`[TuneHub] ${sources[source].name} - ${musicInfo.name} - ${targetQuality}`);
    }

    try {
        const result = await httpPost(`${BASE_URL}/parse`, {
            platform,
            ids: songId,
            quality: targetQuality,
        });

        // TuneHub 成功状态码为 0
        if (result.code !== 0) {
            // 错误码分类处理
            let errorMsg = result.msg || result.message || `解析失败 (Code: ${result.code})`;

            switch (result.code) {
                case -2:
                    errorMsg = '账户积分不足';
                    break;
                case 401:
                    errorMsg = 'API Key 无效或未授权';
                    break;
                case 403:
                    errorMsg = '账户被封禁或 Key 已禁用';
                    break;
                case 404:
                    errorMsg = '资源不存在或已下架';
                    break;
            }

            console.error(`[TuneHub] 解析失败: ${errorMsg}`, result);
            throw new Error(errorMsg);
        }

        // 提取播放地址（适配深度嵌套结构 result.data.data[0].url）
        let url = null;

        if (result.data && Array.isArray(result.data.data) && result.data.data.length > 0) {
            // 优先匹配 ID，找不到则取首项
            const item = result.data.data.find(i => String(i.id) === songId) || result.data.data[0];
            url = item.url;
        } else if (result.url) {
            // 兼容扁平结构
            url = result.url;
        }

        if (!url) {
            console.warn('[TuneHub] 接口响应成功但未找到播放地址', JSON.stringify(result));
            throw new Error('接口未返回有效的播放地址');
        }

        console.log(`[TuneHub] ✓ 解析成功: ${url.substring(0, 80)}...`);
        return url;

    } catch (error) {
        console.error('[TuneHub] 异常:', error.message);
        throw error;
    }
};

/**
 * 监听洛雪事件
 */
on(EVENT_NAMES.request, ({ source, action, info }) => {
    switch (action) {
        case 'musicUrl':
            return getMusicUrl(source, info.musicInfo, info.type)
                .catch(err => Promise.reject(err.message));

        default:
            return Promise.reject(new Error('未实现的操作: ' + action));
    }
});

/**
 * 初始化并告知洛雪音源已加载
 */
send(EVENT_NAMES.inited, {
    status: true,
    openDevTools: false, // 可选：开启调试工具
    sources,
});

console.log('[TuneHub] 音源脚本已加载');
```
