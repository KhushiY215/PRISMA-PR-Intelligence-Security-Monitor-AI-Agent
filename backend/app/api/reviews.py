from fastapi import APIRouter, Query
import json
import os

router = APIRouter()


@router.get("/reviews")
def get_reviews(
    severity: str = Query(None),
    repo: str = Query(None),
    limit: int = Query(50)
):

    try:

        # ABSOLUTE BASE DIRECTORY
        BASE_DIR = os.path.dirname(os.path.dirname(__file__))

        # FULL FILE PATH
        reviews_file = os.path.join(
            BASE_DIR,
            "storage",
            "reviews.json"
        )

        print("\nREVIEWS API FILE PATH:")
        print(reviews_file)

        # CREATE STORAGE DIRECTORY IF MISSING
        os.makedirs(
            os.path.dirname(reviews_file),
            exist_ok=True
        )

        # CREATE FILE IF MISSING
        if not os.path.exists(reviews_file):

            print("reviews.json NOT FOUND")
            print("CREATING NEW reviews.json")

            with open(reviews_file, "w") as file:

                json.dump([], file)

                file.flush()

                os.fsync(file.fileno())

        # LOAD REVIEWS
        try:

            with open(reviews_file, "r") as file:
                reviews = json.load(file)

            print("REVIEWS LOADED:")
            print(len(reviews))

        except Exception as e:

            print("JSON LOAD ERROR:")
            print(str(e))

            reviews = []

        # FILTER BY SEVERITY
        if severity:

            reviews = [
                r for r in reviews
                if r.get("severity") == severity.upper()
            ]

        # FILTER BY REPO
        if repo:

            reviews = [
                r for r in reviews
                if repo.lower() in r.get("repo", "").lower()
            ]

        # MOST RECENT FIRST
        reviews = list(reversed(reviews))

        # APPLY LIMIT
        reviews = reviews[:limit]

        print("RETURNING REVIEWS:")
        print(len(reviews))

        return reviews

    except Exception as e:

        print("\nREVIEWS API ERROR:")
        print(str(e))

        return []