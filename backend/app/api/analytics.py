from fastapi import APIRouter
import json
import os
from collections import Counter

router = APIRouter()


@router.get("/analytics")
def analytics():
    BASE_DIR = os.path.dirname(os.path.dirname(__file__))

    reviews_file = os.path.join(
        BASE_DIR,
        "storage",
        "reviews.json"
    )

    if not os.path.exists(reviews_file):
        return {
            "total_reviews": 0,
            "critical_issues": 0,
            "high_issues": 0,
            "medium_issues": 0,
            "low_issues": 0,
            "severity_breakdown": [],
            "recent_repos": []
        }

    try:
        with open(reviews_file) as file:
            reviews = json.load(file)
    except:
        reviews = []

    total_reviews = len(reviews)
    severity_counts = Counter(r.get("severity", "LOW") for r in reviews)

    recent_repos = list({r["repo"] for r in reviews[-10:]})[:5]

    return {
        "total_reviews": total_reviews,
        "critical_issues": severity_counts.get("CRITICAL", 0),
        "high_issues": severity_counts.get("HIGH", 0),
        "medium_issues": severity_counts.get("MEDIUM", 0),
        "low_issues": severity_counts.get("LOW", 0),
        "severity_breakdown": [
            {"severity": k, "count": v}
            for k, v in severity_counts.items()
        ],
        "recent_repos": recent_repos
    }
