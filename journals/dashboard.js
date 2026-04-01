const disciplineData = [
    { text: "N盛龙竞价高开+10%封板入场", status: "pass", type: "博弈概率" },
    { text: "破昨收 27.68 不参与", status: "pass", type: "博弈概率" },
    { text: "硬科技回调至支撑区再进", status: "fail", type: "幻想预期" },
    { text: "大盘放量突破4000再加仓", status: "fail", type: "幻想预期" }
];

const trades = [
    {
        name: "蓝焰控股",
        code: "000968",
        price: "10.1",
        position: "20%",
        stopLoss: "9.67",
        slRatio: "4.2%",
        status: "持有",
        evaluation: "博弈概率",
        logic: "涨停断板3天回踩20天线",
        color: "#ffcd00"
    }
];

function initDashboard() {
    // 1. Populate Discipline List
    const disciplineList = document.getElementById('discipline-list');
    disciplineList.innerHTML = '';
    disciplineData.forEach(item => {
        const div = document.createElement('div');
        div.className = `discipline-item ${item.status}`;
        div.innerHTML = `
            <span class="status-icon ${item.status}">${item.status === 'pass' ? '✔' : '⚠'}</span>
            <div style="font-size: 0.85rem">
                <div>${item.text}</div>
                <div style="font-size: 0.7rem; color: rgba(255,255,255,0.4)">${item.type}</div>
            </div>
        `;
        disciplineList.appendChild(div);
    });

    // 2. Populate Trade Cards
    const tradeMatrix = document.getElementById('trade-matrix');
    tradeMatrix.innerHTML = '';
    trades.forEach(trade => {
        const card = document.createElement('div');
        card.className = 'glass-card trade-card fade-in';
        card.style.borderLeftColor = trade.color;
        
        card.innerHTML = `
            <div class="trade-header">
                <div>
                    <div class="trade-name">${trade.name}</div>
                    <div style="font-size: 0.7rem; color: rgba(255,255,255,0.4)">${trade.code}</div>
                </div>
                <div class="trade-badge" style="color: ${trade.color}">${trade.evaluation}</div>
            </div>
            
            <div class="trade-stats">
                <div class="stat-item">
                    <span class="stat-label">成本/现价</span>
                    <span class="stat-value">${trade.price}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">仓位</span>
                    <span class="stat-value">${trade.position}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">止损位</span>
                    <span class="stat-value gold">${trade.stopLoss}</span>
                </div>
            </div>

            <div style="font-size: 0.8rem; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
                <div style="color: rgba(255,255,255,0.5); font-size: 0.7rem; margin-bottom: 5px;">核心逻辑</div>
                <div>${trade.logic}</div>
            </div>

            <div style="margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.7rem; color: var(--primary-cyan)">${trade.status}</span>
                <span style="font-size: 0.7rem; color: var(--danger-red)">止损比: ${trade.slRatio}</span>
            </div>
        `;
        tradeMatrix.appendChild(card);
    });

    // 3. Set Sentiment Gauge
    const gauge = document.getElementById('sentiment-gauge');
    const offset = 440 - (440 * 0.25);
    gauge.style.strokeDashoffset = offset;

    // 4. Chat Listeners
    document.getElementById('send-btn').addEventListener('click', sendMessage);
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    document.getElementById('archive-btn').addEventListener('click', archiveSession);

    // 5. Toggle Chat Listeners
    document.getElementById('close-chat').addEventListener('click', toggleChat);
    document.getElementById('chat-toggle').addEventListener('click', toggleChat);
}

function toggleChat() {
    console.log("TOGGLE_CHAT_TRIGGERED");
    const container = document.getElementById('chat-container');
    const toggleBtn = document.getElementById('chat-toggle');
    
    if (!container || !toggleBtn) {
        console.error("TOGGLE_CHAT_ERROR: Elements missing", { container, toggleBtn });
        return;
    }
    
    const isHidden = container.classList.toggle('hidden');
    toggleBtn.classList.toggle('hidden', !isHidden);
    console.log("TOGGLE_CHAT_STATE:", { isHidden });
}

function sendMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user-msg');
    input.value = '';
    
    setTimeout(() => {
        const reply = getBotReply(text);
        addMessage(reply, 'bot-msg');
    }, 600);
}

function addMessage(text, type) {
    const container = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `msg ${type}`;
    div.innerText = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function getBotReply(text) {
    if (text.includes('蓝焰控股')) {
        return "【裁判长点评】你提到的蓝焰控股（000968）回踩20天线逻辑符合「博弈概率」中的龙回头范畴。但你自己提到了「概念不好+油价回跌」的缺点，这说明逻辑中由于宏观环境变化存在风险。警告：明知概念走弱依然入场，必须严格执行止损（30天线9.67），一旦跌破说明右侧支撑彻底失效，不可留恋。";
    }
    if (text.includes('买') || text.includes('入场')) {
        return "收到交易动态。请明确：1. 核心触发条件是什么？ 2. 初始止损位设在何处？若无明确量化指标，本次操作将被标记为「幻想预期」。";
    }
    if (text.includes('止损') || text.includes('卖')) {
        return "正在核对盘前计划... 若属于计划内止损，纪律分保持；若属于非计划内调仓，请说明是否属于右侧逻辑修正。";
    }
    if (text.includes('归档') || text.includes('同步')) {
        return "归档指令已就绪。点击右上角「归档至 Notion」按钮，我会将本轮对话摘要记录到你的复盘笔记中。";
    }
    return "理解。已记录本次思考。请保持客观，不要被瞬时的波动带偏。记住：我们只做概率，不做预期。";
}

function archiveSession() {
    const btn = document.getElementById('archive-btn');
    btn.innerText = '⏳ 正在请求归档...';
    btn.style.borderColor = 'var(--primary-cyan)';
    btn.style.color = 'var(--primary-cyan)';
    
    // Simulate notification to agent
    console.log("NOTION_ARCHIVE_REQUEST: Session capture initiated.");
    
    setTimeout(() => {
        btn.innerText = '✅ 已通知 Agent 归档';
        setTimeout(() => {
            btn.innerText = '归档至 Notion';
            btn.style.borderColor = 'var(--secondary-gold)';
            btn.style.color = 'var(--secondary-gold)';
        }, 3000);
    }, 1500);
}

// 涨停断板三天回踩监控室逻辑
const scanQueries = {
    'normal-near': '非st，非停牌，4天前涨停，近3天未涨停，今日最低价附近10日均线',
    'normal-far': '非st，非停牌，4天前涨停，近3天未涨停，今日最低价/10日均线大于1.05',
    'leader-near': '5天内异动过概念人气龙头股;;非ST',
    'leader-far': '5天内异动过概念人气龙头股;;非ST'
};

async function runScan(type, distance) {
    const key = `${type}-${distance}`;
    const query = scanQueries[key];
    const resultsContainer = document.getElementById('scanner-results');
    const statusEl = document.getElementById('scan-status');
    
    if (!query) return;

    statusEl.innerText = '扫描中...';
    statusEl.style.color = '#ffa600';
    resultsContainer.innerHTML = '<div class="empty-state">正在呼叫同花顺 i问财，拉取实时数据...</div>';

    try {
        const response = await fetch('http://localhost:5000/strategy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            if (data.data === '今日无匹配标的' || data.count === 0 || !Array.isArray(data.data) || data.data.length === 0) {
                resultsContainer.innerHTML = '<div class="empty-state">未找到符合条件的标的，市场无此模式机会。</div>';
            } else {
                let html = '<table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">';
                html += '<tr style="border-bottom: 1px solid rgba(255,255,255,0.1);"><th style="padding: 8px;">股票代码</th><th style="padding: 8px;">股票简称</th><th style="padding: 8px;">最新价</th></tr>';
                data.data.forEach(item => {
                    html += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer;" onmouseover="this.style.background='rgba(255,255,255,0.05)'" onmouseout="this.style.background='transparent'">
                                <td style="padding: 8px; color: var(--primary-cyan);">${item['股票代码'] || '-'}</td>
                                <td style="padding: 8px;">${item['股票简称'] || '-'}</td>
                                <td style="padding: 8px; color: #ff4d4f; font-weight: bold;">${item['最新价'] || '-'}</td>
                             </tr>`;
                });
                html += '</table>';
                resultsContainer.innerHTML = html;
            }
            statusEl.innerText = `完成 (找到 ${data.count || 0} 只)`;
            statusEl.style.color = 'var(--primary-cyan)';
        } else {
            resultsContainer.innerHTML = `<div class="empty-state" style="color: #ff4d4f;">扫描失败: ${data.message || '未知错误'}</div>`;
            statusEl.innerText = '拉取失败';
            statusEl.style.color = '#ff4d4f';
        }
    } catch (error) {
        console.error("Scan Error:", error);
        resultsContainer.innerHTML = `<div class="empty-state" style="color: #ff4d4f;">无法连接到本地分析服务: ${error.name} - ${error.message}</div>`;
        statusEl.innerText = '服务断开';
        statusEl.style.color = '#ff4d4f';
    }
}

document.addEventListener('DOMContentLoaded', initDashboard);
