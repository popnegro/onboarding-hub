import importlib.util
import unittest
from pathlib import Path
from uuid import uuid4

MODULE_PATH = Path(__file__).parents[1] / "scripts" / "validate_demo_payload.py"
SPEC = importlib.util.spec_from_file_location("validate_demo_payload", MODULE_PATH)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)


class DemoPayloadTests(unittest.TestCase):
    def setUp(self):
        self.payload = {
            "event": "onboarding.client_created",
            "event_id": str(uuid4()),
            "client_id": str(uuid4()),
            "environment": "demo",
            "occurred_at": "2026-11-01T12:00:00Z",
            "schema_version": 1,
        }

    def test_valid_event(self):
        self.assertEqual(MODULE.validate_payload(self.payload), [])

    def test_rejects_wrong_environment(self):
        self.payload["environment"] = "production"
        self.assertIn("environment must be demo", MODULE.validate_payload(self.payload))

    def test_rejects_invalid_uuid(self):
        self.payload["client_id"] = "not-a-uuid"
        self.assertTrue(any("client_id" in error for error in MODULE.validate_payload(self.payload)))

    def test_rejects_secrets_and_personal_fields(self):
        self.payload["service_role"] = "never-include"
        self.assertTrue(any("forbidden" in error for error in MODULE.validate_payload(self.payload)))

    def test_requires_exact_twenty_steps(self):
        steps = [{"step_number": number} for number in range(1, 21)]
        self.assertEqual(MODULE.validate_steps(steps), [])
        self.assertTrue(MODULE.validate_steps(steps[:-1]))

    def test_rejects_duplicate_step_numbers(self):
        steps = [{"step_number": number} for number in range(1, 21)]
        steps[-1]["step_number"] = 19
        self.assertTrue(MODULE.validate_steps(steps))


if __name__ == "__main__":
    unittest.main()
