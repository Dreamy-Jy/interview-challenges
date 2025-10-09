from typing import Dict, Any
import requests
import json
from pathlib import Path

API_URL = "https://jobbo-api.n1.xyz/api/game/766ebb4d-289f-4038-9fa9-59db2c66693d/board?level={}"
OUT_PATH = "../data/levels.json"

def full_output_file_exists(file: Path) -> bool:
    return file.exists() and file.stat().st_size > 0

def fetch_level(n: int) -> Dict[str, Any]:
    resp = requests.get(API_URL.format(n))
    resp.raise_for_status()
    return resp.json()

def main() -> None:
    if full_output_file_exists((p := Path(OUT_PATH))):
        print(f"Full levels file already exists at {p}, exiting script")
        return
    print("Levels file does not exist, fetching levels...")

    levels: Dict[str, Any] = {}
    for n in range(1, 1001):
        if n % 100 == 0:
            print(f"Fetched {n} levels so far...")
        levels[str(n)] = fetch_level(n)
    print("Level fetching complete")

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(levels, f, ensure_ascii=False)
    print(f"Wrote to levels file: {OUT_PATH}")

if __name__ == "__main__":
    main()
