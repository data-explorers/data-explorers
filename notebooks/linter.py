import subprocess
from pathlib import Path

base_path = Path(__file__).resolve().parent


def lint():
    print(base_path)
    _exec(f"black {Path(base_path)}")
    _exec(f"flake8 {Path(base_path)}")


def _exec(command):
    process = subprocess.Popen(command.split())
    output, error = process.communicate()


if __name__ == "__main__":
    lint()
