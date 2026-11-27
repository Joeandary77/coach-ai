from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any
from pymongo import MongoClient
from pymongo.errors import PyMongoError


class ReportStore:
    """Uses MongoDB when available and falls back to a local JSON file."""

    def __init__(
        self,
        mongodb_uri: str | None,
        db_name: str = "coachai",
        fallback_file: Path | None = None,
    ) -> None:
        self._fallback_file = (
            fallback_file or (Path(__file__).resolve().parent / "reports_store.json")
        )
        self._collection = None

        if mongodb_uri:
            try:
                client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=2000)
                client.admin.command("ping")
                self._collection = client[db_name]["session_reports"]
            except PyMongoError:
                self._collection = None

        if not self._fallback_file.exists():
            self._write_file([])

    @property
    def is_mongodb_connected(self) -> bool:
        return self._collection is not None

    def _read_file(self) -> list[dict[str, Any]]:
        try:
            data = json.loads(self._fallback_file.read_text(encoding="utf-8"))
            return data if isinstance(data, list) else []
        except (OSError, json.JSONDecodeError):
            return []

    def _write_file(self, items: list[dict[str, Any]]) -> None:
        self._fallback_file.write_text(json.dumps(items, indent=2), encoding="utf-8")

    def list_reports(self, limit: int = 50) -> list[dict[str, Any]]:
        if self._collection is not None:
            docs = list(self._collection.find({}, {"_id": 0}).limit(limit))
            if docs:
                return docs
        items = self._read_file()
        return list(reversed(items[-limit:]))

    def create_report(self, payload: dict[str, Any]) -> tuple[dict[str, Any], str]:
        record = {
            "id": f"rpt_{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            **payload,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        if self._collection is not None:
            try:
                self._collection.insert_one(dict(record))
                return {**record, "storage": "mongodb"}, "mongodb"
            except PyMongoError:
                self._collection = None

        file_record = {**record, "storage": "file"}
        items = self._read_file()
        items.append(file_record)
        self._write_file(items)
        return file_record, "file"


    def delete_report(self, report_id: str) -> bool:
        deleted = False

        if self._collection is not None:
            try:
                result = self._collection.delete_one({"id": report_id})
                deleted = result.deleted_count > 0
            except PyMongoError:
                self._collection = None

        items = self._read_file()
        remaining = [item for item in items if item.get("id") != report_id]
        if len(remaining) != len(items):
            self._write_file(remaining)
            deleted = True

        return deleted