import pywencai

queries = [
    # 1. 普涨断板，接近均线 (Normal stock, near MA)
    # 4天前涨停意味着T-3断板，所以近3天(T-2, T-1, T)未涨停。接近5日线(上下2%以内)。剔除ST和新股。
    "4天前涨停，近3天未涨停，今日收盘价/5日均线介于0.98和1.02之间，非ST，非停牌，上市天数大于60天",
    
    # 2. 普涨断板，远离均线 (Normal stock, far from MA)
    # 强势横盘，依然高悬在均线之上(比如大于5%)
    "4天前涨停，近3天未涨停，今日收盘价/5日均线大于1.05，非ST，非停牌，上市天数大于60天",
    
    # 3. 龙头断板，接近均线 (Leader stock, near MA)
    # 龙头定义：此前至少3连板（意味着4天前是3连板及以上）
    "4天前连板数大于等于3，近3天未涨停，今日收盘价/5日均线介于0.98和1.05之间，非ST，非停牌",
    
    # 4. 龙头断板，远离均线 (Leader stock, far from MA)
    # 龙头高位强势横盘
    "4天前连板数大于等于3，近3天未涨停，今日收盘价/5日均线大于1.08，非ST，非停牌"
]

for i, q in enumerate(queries, 1):
    print(f"\n--- 测试查询 {i} ---")
    print(f"Query: {q}")
    try:
        df = pywencai.get(query=q, loop=True)
        if df is not None and not df.empty:
            print(f"找到 {len(df)} 只股票:")
            # Print just the standard symbol and name columns. Wencai columns are dynamic.
            cols = [c for c in df.columns if '股票代码' in c or '股票简称' in c]
            if not cols:
                print(df.head())
            else:
                print(df[cols].head())
        else:
            print("未找到符合条件的股票。")
    except Exception as e:
        print(f"查询出错: {e}")
