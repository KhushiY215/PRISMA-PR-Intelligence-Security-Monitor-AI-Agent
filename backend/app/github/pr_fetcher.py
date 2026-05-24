from app.github.github_client import github_get


def fetch_pr_files(repo_name, pr_number):
    url = f"https://api.github.com/repos/{repo_name}/pulls/{pr_number}/files"

    files = github_get(url)

    extracted_files = []

    for file in files:
        extracted_files.append({
            "filename": file["filename"],
            "patch": file.get("patch", "")
        })

    return extracted_files