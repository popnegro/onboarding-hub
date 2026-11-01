#!/usr/bin/env python3
"""Validate a fictional PXSOL onboarding event payload without external dependencies."""
from __future__ import annotations

import argparse
import json
import sys
import uuid
from pathlib import Path
from typing import Any


def validate_payload(payload: Any) -> list[str]:
    errors: list[str] = []
    if not isinstance(payload, dict):
        return ["payload must be a JSON object"]

    required = ("event", "event_id", "client_id", "environment", "occurred_at", "schema_version")
    for field in required:
        if not payload.get(field):
            errors.append(f"{field} is required")

    if payload.get("event") != "onboarding.client_created":
        errors.append("event must be onboarding.client_created")
    if payload.get("environment") != "demo":
        errors.append("environment must be demo")
    if payload.get("schema_version") != 1:
        errors.append("schema_version must be 1")

    for field in ("event_id", "client_id"):
        value = payload.get(field)
        if value:
            try:
                uuid.UUID(str(value))
            except (ValueError, TypeError, AttributeError):
                errors.append(f"{field} must be a valid UUID")

    forbidden = {"email", "password", "token", "access_token", "service_role"}
    if forbidden.intersection(payload):
        errors.append("payload contains a forbidden personal or secret field")
    return errors


def validate_steps(steps: Any) -> list[str]:
    if not isinstance(steps, list):
        return ["steps must be a JSON array"]
    numbers = [item.get("step_number") for item in steps if isinstance(item, dict)]
    if len(steps) != 20 or sorted(numbers) != list(range(1, 21)):
        return ["steps must contain exactly one item for each step_number from 1 to 20"]
    return []


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("file", nargs="?", help="JSON file; reads stdin when omitted")
    parser.add_argument("--check-steps", action="store_true", help="also validate a top-level steps array")
    args = parser.parse_args()

    try:
        raw = Path(args.file).read_text(encoding="utf-8") if args.file else sys.stdin.read()
        payload = json.loads(raw)
    except (OSError, json.JSONDecodeError) as exc:
        print(json.dumps({"valid": False, "errors": [str(exc)]}))
        return 2

    errors = validate_payload(payload)
    if args.check_steps:
        errors.extend(validate_steps(payload.get("steps") if isinstance(payload, dict) else None))
    print(json.dumps({"valid": not errors, "errors": errors}, ensure_ascii=False))
    return 0 if not errors else 1


if __name__ == "__main__":
    raise SystemExit(main())
