from fastapi import APIRouter, Request
from app.github.pr_fetcher import fetch_pr_files
from app.ai.review_agent import review_pull_request
from app.github.comment_poster import post_review_comment

import json
import os

router = APIRouter()


def classify_severity(review):

    review_lower = review.lower()

    if "sql injection" in review_lower:
        return "CRITICAL"

    if "eval" in review_lower:
        return "HIGH"

    if "performance" in review_lower:
        return "MEDIUM"

    return "LOW"


@router.post("/webhook/github")
async def github_webhook(request: Request):

    payload = await request.json()

    print("\n==============================")
    print("WEBHOOK RECEIVED")
    print("==============================")

    action = payload.get("action")
    print("ACTION:", action)

    if action not in ["opened", "synchronize"]:
        print("IGNORED EVENT")
        return {"message": "Ignored"}

    repo_name = payload["repository"]["full_name"]
    pr_number = payload["pull_request"]["number"]

    print("REPO:", repo_name)
    print("PR:", pr_number)

    # FETCH FILES
    files = fetch_pr_files(repo_name, pr_number)

    print("\nFILES FETCHED:")
    print(files)

    # GENERATE AI REVIEW
    review = review_pull_request(files)

    print("\nAI REVIEW GENERATED")

    # POST COMMENT TO GITHUB
    post_review_comment(repo_name, pr_number, review)

    print("COMMENT POSTED TO GITHUB")

    # CLASSIFY SEVERITY
    severity = classify_severity(review)

    review_data = {
        "repo": repo_name,
        "pr_number": pr_number,
        "severity": severity,
        "review": review,
        "files": files
    }

    try:

        # ABSOLUTE PATH
        BASE_DIR = os.path.dirname(os.path.dirname(__file__))

        reviews_file = os.path.join(
            BASE_DIR,
            "storage",
            "reviews.json"
        )

        print("\nREVIEWS FILE PATH:")
        print(reviews_file)

        # CREATE FILE IF NOT EXISTS
        if not os.path.exists(reviews_file):

            print("reviews.json NOT FOUND")
            print("CREATING NEW FILE")

            with open(reviews_file, "w") as file:
                json.dump([], file)

        # LOAD EXISTING REVIEWS
        try:

            with open(reviews_file, "r") as file:
                reviews = json.load(file)

            print("CURRENT REVIEWS COUNT:", len(reviews))

        except Exception as e:

            print("JSON LOAD ERROR:")
            print(str(e))

            reviews = []

        # APPEND NEW REVIEW
        reviews.append(review_data)

        print("NEW REVIEW ADDED")

        # SAVE UPDATED REVIEWS
        with open(reviews_file, "w") as file:
            json.dump(reviews, file, indent=2)

        print("REVIEW SAVED SUCCESSFULLY")

    except Exception as e:

        print("\nSAVE ERROR:")
        print(str(e))

    print("==============================\n")

    return {"message": "Review Completed"}