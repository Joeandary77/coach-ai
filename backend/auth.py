import base64
from datetime import datetime, timedelta, timezone
import hashlib
import hmac
import json
import os
from pathlib import Path
import secrets
from typing import Any
from pymongo import MongoClient
from pymongo.errors import PyMongoError


def hash_password(password: str) -> str:
    salt = secrets.token_hex(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000
    ).hex()
    return f"{salt}${digest}"


def verify_password(password: str, stored_hash: str) -> bool:
    try:
        salt, expected_digest = stored_hash.split("$", 1)
    except ValueError:
        return False
    candidate = hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt.encode("utf-8"), 120_000
    ).hex()
    return hmac.compare_digest(candidate, expected_digest)


def create_access_token(
    coach_id: str, email: str, secret_key: str, expires_hours: int = 168
) -> str:
    payload = {
        "sub": coach_id,
        "email": email,
        "exp": int(
            (datetime.now(timezone.utc) + timedelta(hours=expires_hours)).timestamp()
        ),
    }
    raw = json.dumps(payload, separators=(",", ":")).encode("utf-8")
    b64 = base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")
    sig = hmac.new(
        secret_key.encode("utf-8"), b64.encode("ascii"), hashlib.sha256
    ).hexdigest()
    return f"{b64}.{sig}"


def decode_access_token(token: str, secret_key: str) -> dict[str, Any] | None:
    try:
        b64, sig = token.split(".", 1)
    except ValueError:
        return None
    expected_sig = hmac.new(
        secret_key.encode("utf-8"), b64.encode("ascii"), hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(sig, expected_sig):
        return None
    padded = b64 + "=" * (-len(b64) % 4)
    try:
        payload = json.loads(base64.urlsafe_b64decode(padded).decode("utf-8"))
    except (ValueError, json.JSONDecodeError):
        return None
    if int(payload.get("exp", 0)) < int(datetime.now(timezone.utc).timestamp()):
        return None
    return payload


class CoachStore:
    """Stores coach profiles in MongoDB with a local JSON fallback."""

    def __init__(
        self,
        mongodb_uri: str | None,
        db_name: str = "coachai",
        fallback_file: Path | None = None,
    ) -> None:
        self._fallback_file = fallback_file or (
            Path(__file__).resolve().parent / "coaches_store.json"
        )
        self._collection = None

        if mongodb_uri:
            try:
                client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=2000)
                client.admin.command("ping")
                self._collection = client[db_name]["coaches"]
                self._collection.create_index("email", unique=True)
            except PyMongoError:
                self._collection = None

        if not self._fallback_file.exists():
            self._write_file([])

    def _read_file(self) -> list[dict[str, Any]]:
        try:
            data = json.loads(self._fallback_file.read_text(encoding="utf-8"))
            return data if isinstance(data, list) else []
        except (OSError, json.JSONDecodeError):
            return []

    def _write_file(self, items: list[dict[str, Any]]) -> None:
        self._fallback_file.write_text(json.dumps(items, indent=2), encoding="utf-8")

    @staticmethod
    def _public_coach(doc: dict[str, Any]) -> dict[str, Any]:
        return {
            "id": doc["id"],
            "full_name": doc["full_name"],
            "email": doc["email"],
            "role": doc.get("role", "Assistant Coach"),
            "assigned_age_groups": doc.get("assigned_age_groups", []),
            "specialty": doc.get("specialty", "Basketball Fundamentals"),
            "created_at": doc["created_at"],
        }

    def get_by_email(self, email: str) -> dict[str, Any] | None:
        normalized = email.strip().lower()
        if self._collection is not None:
            try:
                doc = self._collection.find_one({"email": normalized}, {"_id": 0})
                if doc:
                    return doc
            except PyMongoError:
                self._collection = None

        for item in self._read_file():
            if item.get("email", "").strip().lower() == normalized:
                return item
        return None

    def get_by_id(self, coach_id: str) -> dict[str, Any] | None:
        if self._collection is not None:
            try:
                doc = self._collection.find_one({"id": coach_id}, {"_id": 0})
                if doc:
                    return self._public_coach(doc)
            except PyMongoError:
                self._collection = None

        for item in self._read_file():
            if item.get("id") == coach_id:
                return self._public_coach(item)
        return None

    def create_coach(
        self,
        full_name: str,
        email: str,
        password: str,
        role: str,
        assigned_age_groups: list[str],
        specialty: str,
    ) -> dict[str, Any]:
        normalized_email = email.strip().lower()
        if self.get_by_email(normalized_email) is not None:
            raise ValueError("An account with this email already exists.")

        record = {
            "id": f"coach_{int(datetime.now(timezone.utc).timestamp() * 1000)}",
            "full_name": full_name.strip(),
            "email": normalized_email,
            "password_hash": hash_password(password),
            "role": role,
            "assigned_age_groups": assigned_age_groups,
            "specialty": specialty.strip(),
            "created_at": datetime.now(timezone.utc).isoformat(),
        }

        if self._collection is not None:
            try:
                self._collection.insert_one(dict(record))
                return self._public_coach(record)
            except PyMongoError:
                self._collection = None

        items = self._read_file()
        items.append(record)
        self._write_file(items)
        return self._public_coach(record)

    def authenticate(self, email: str, password: str) -> dict[str, Any] | None:
        doc = self.get_by_email(email)
        if not doc:
            return None
        if not verify_password(password, doc.get("password_hash", "")):
            return None
        return self._public_coach(doc)

    def update_coach(
        self, coach_id: str, updates: dict[str, Any]
    ) -> dict[str, Any] | None:
        clean = {k: v for k, v in updates.items() if v is not None}
        if not clean:
            return self.get_by_id(coach_id)

        if self._collection is not None:
            try:
                self._collection.update_one({"id": coach_id}, {"$set": clean})
            except PyMongoError:
                self._collection = None

        items = self._read_file()
        for item in items:
            if item.get("id") == coach_id:
                item.update(clean)
        self._write_file(items)
        return self.get_by_id(coach_id)

    def delete_coach(self, coach_id: str) -> bool:
        deleted = False

        if self._collection is not None:
            try:
                result = self._collection.delete_one({"id": coach_id})
                deleted = result.deleted_count > 0
            except PyMongoError:
                self._collection = None

        items = self._read_file()
        remaining = [item for item in items if item.get("id") != coach_id]
        if len(remaining) != len(items):
            self._write_file(remaining)
            deleted = True

        return deleted


def get_auth_secret() -> str:
    return os.getenv("AUTH_SECRET_KEY", "coachai-dev-secret-change-me").strip()