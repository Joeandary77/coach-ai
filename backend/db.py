from datetime import datetime, timezone
from typing import Any
from pymongo import MongoClient
from pymongo.errors import PyMongoError


class ReportStore:
    """Stores session reports in MongoDB when available, or in memory as fallback."""

    def __init__(self, mongodb_uri: str | None, db_name: str = "coachai") -> None:
        self._memory_reports: list[dict[str, Any]] = []
        self._collection = None

        if mongodb_uri:
            try:
                client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=2000)
                client.admin.command("ping")
                self._collection = client[db_name]["session_reports"]
            except PyMongoError:
                self._collection = None

    @property
    def is_mongodb_connected(self) -> bool:
        return self._collection is not None

    def list_reports(self, limit: int = 50) -> list[dict[str, Any]]:
        if self._collection is not None:
            docs = list(self._collection.find({}, {"_id": 0}).limit(limit))
            return docs
        return list(reversed(self._memory_reports[-limit:]))

    def create_report(self, payload: dict[str, Any]) -> tuple[dict[str, Any], str]:
        record = {
            "id": f"rpt_{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            **payload,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
        if self._collection is not None:
            self._collection.insert_one(dict(record))
            return record, "mongodb"

        self._memory_reports.append(record)
        return record, "memory"
