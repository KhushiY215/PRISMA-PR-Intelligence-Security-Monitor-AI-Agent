import requests
import os
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

headers = {
    "Authorization": f"Bearer {GITHUB_TOKEN}",
    "Accept": "application/vnd.github+json"
}


def post_review_comment(repo_name, pr_number, review):
    url = f"https://api.github.com/repos/{repo_name}/issues/{pr_number}/comments"

    data = {
        "body": f"🤖 AI Review Assistant\n\n{review}"
    }

    response = requests.post(url, headers=headers, json=data)

    print(response.status_code)