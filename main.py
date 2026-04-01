"""
交易日志存档工具（可选）
用法：直接跟 AI 对话即可，本脚本仅用于手动创建/查看日志文件。

  python main.py today   # 打印今日日志路径
  python main.py list    # 列出所有日志
"""
import sys
from datetime import datetime
from pathlib import Path

JOURNALS_DIR = Path(__file__).parent / "journals"


def today_path() -> Path:
    return JOURNALS_DIR / f"{datetime.now().strftime('%Y-%m-%d')}-复盘.md"


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else "today"
    if cmd == "today":
        print(today_path())
    elif cmd == "list":
        JOURNALS_DIR.mkdir(exist_ok=True)
        for f in sorted(JOURNALS_DIR.glob("*.md")):
            print(f.name)


if __name__ == "__main__":
    main()
