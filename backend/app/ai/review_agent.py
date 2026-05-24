from app.ai.llm_client import generate_ai_review


def review_pull_request(files):
    combined_code = ""

    for file in files:
        combined_code += f"\nFile: {file['filename']}\n"
        combined_code += file["patch"]

    prompt = f"""
You are a senior software engineer.

Review this pull request diff.

Focus on:
- bugs
- security vulnerabilities
- performance issues
- maintainability

Provide actionable feedback.

Code Diff:
{combined_code}
"""

    review = generate_ai_review(prompt)

    return review