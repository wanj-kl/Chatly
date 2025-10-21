# MeTTa-Project
# ai_guardian.py
# The AI Guardian Agent: Protects young users from harmful AI-generated content and enforces parental controls.

# --- Constants for Content Evaluation and Restriction ---
FLAGGED_CATEGORIES = [
    "violence",
    "explicit_language",
    "hate_speech",
    "bias",
    "politics", # A category parents might want to block
    "adult_topics" # A general blocking category
]

# Simulated Content Evaluation Results (AI Models + MeTTa Logic)
SIMULATED_CONTENT_EVALUATION = {
    "normal_story": {"flags": [], "severity": 0},
    "story_with_mild_violence": {"flags": ["violence"], "severity": 3},
    "political_news_report": {"flags": ["politics", "bias"], "severity": 5},
    "explicit_chat_response": {"flags": ["explicit_language", "adult_topics"], "severity": 10},
}

# Age that triggers automatic restriction and simplification (Goal 2)
RESTRICTION_AGE = 16


# --- User and Control Classes ---

class UserProfile:
    """Stores information about the young user."""
    def __init__(self, user_id: str, age: int, parent_id: str):
        self.user_id = user_id
        self.age = age
        self.parent_id = parent_id

    def is_under_restriction_age(self):
        """Checks if the user is under the set restriction age (16)."""
        return self.age < RESTRICTION_AGE


class ParentalControl:
    """
    Stores the preferences, permissions, and monetization settings 
    set by the parent/guardian (Goal 3).
    """
    def __init__(self, parent_id: str):
        self.parent_id = parent_id
        # Categories the parent has chosen to block
        self.blocked_categories = {"politics", "adult_topics"}
        # Data permissions: 'allowed', 'monetize', 'blocked'
        self.data_permission = "monetize" # Families can monetize or control data
        self.daily_time_limit_minutes = 120

    def should_block(self, content_flags: list) -> bool:
        """Checks if any content flag matches a blocked category."""
        return any(flag in self.blocked_categories for flag in content_flags)

    def get_data_permission(self):
        """Returns the data usage policy set by the parent."""
        return self.data_permission

# --- Simulated Database ---
# Replace these with actual database calls in a production system.
USER_PROFILES_DB = {
    "child_lily": UserProfile("child_lily", 12, "parent_david"),
    "teen_max": UserProfile("teen_max", 17, "parent_david"),
}

PARENT_CONTROLS_DB = {
    "parent_david": ParentalControl("parent_david"),
}


# --- The Core Guardian Agent ---

class GuardianAgent:
    """
    The AI Guardian Agent: Detects, filters, and enforces parental rules.
    (Simulates the logic that uses AI Models + Reasoning Rules (MeTTa))
    """

    def _get_user_data(self, user_id: str) -> tuple:
        """Helper to fetch user profile and parental controls."""
        user_profile = USER_PROFILES_DB.get(user_id)
        if not user_profile:
            raise ValueError(f"User ID '{user_id}' not found.")

        parental_controls = PARENT_CONTROLS_DB.get(user_profile.parent_id)
        if not parental_controls:
            # Fallback: Default to a highly restrictive profile if parent not configured
            parental_controls = ParentalControl(user_profile.parent_id)
            parental_controls.blocked_categories = set(FLAGGED_CATEGORIES)
            parental_controls.data_permission = "blocked"

        return user_profile, parental_controls

    def evaluate_and_filter(self, user_id: str, content_key: str):
        """
        Main function to evaluate content against user age and parental settings.
        (Implements Goals 1 & 2)
        """
        try:
            user, parent_rules = self._get_user_data(user_id)
        except ValueError as e:
            print(f"[AGENT: ERROR] {e}")
            return "ERROR"
            
        evaluation = SIMULATED_CONTENT_EVALUATION.get(content_key)
        
        if not evaluation:
            print(f"[AGENT: {user.user_id}] Content key '{content_key}' not recognized. ACCESS GRANTED by default.")
            return "ACCESS_GRANTED"

        content_flags = evaluation["flags"]
        content_severity = evaluation["severity"]
        
        print(f"--- Attempting Access for {user.user_id} (Age {user.age}) to '{content_key}' (Severity: {content_severity}) ---")

        # 1. Detect and filter harmful content (Goal 1: High Severity Block)
        if content_severity > 7:
            # Content is highly severe (e.g., explicit_chat_response)
            return self._handle_block(user, content_key, content_flags, "HIGH_SEVERITY_FLAG")

        # 2. Check Parental Blocks (Goal 3: Parent Preference)
        if parent_rules.should_block(content_flags):
            return self._handle_block(user, content_key, content_flags, "PARENTAL_BLOCK")

        # 3. Restrict access for young users (Goal 2: Age Restriction)
        if user.is_under_restriction_age() and content_severity > 0:
            return self._handle_restriction(user, content_key, content_flags)
        
        # 4. Content is safe and user/parent rules allow
        print(f"[AGENT: {user.user_id}] ✅ Access Granted to '{content_key}'.")
        print(f"   -> Data Usage Policy: {parent_rules.get_data_permission()}")
        return "ACCESS_GRANTED"


    def _handle_block(self, user, content_key, flags, reason):
        """Handles content blocking and parent notification."""
        print(f"[AGENT: {user.user_id}] 🛑 *** ACCESS BLOCKED *** for '{content_key}'.")
        print(f"   -> Reason: {reason}. Flags: {', '.join(flags)}")
        self._notify_parent(user.parent_id, "BLOCK", content_key, flags)
        return "ACCESS_BLOCKED"

    def _handle_restriction(self, user, content_key, flags):
        """Handles content restriction/simplification for young users."""
        print(f"[AGENT: {user.user_id}] ⚠️ !!! CONTENT RESTRICTED/SIMPLIFIED !!! for '{content_key}'.")
        print(f"   -> User is under {RESTRICTION_AGE}. Flags: {', '.join(flags)}")
        self._notify_parent(user.parent_id, "ACCESS_RESTRICTED", content_key, flags)
        # In a real app, logic would return a 'simplified_version' of the content
        return "CONTENT_RESTRICTED"

    def _notify_parent(self, parent_id, event_type, content_key, flags):
        """Simulates sending a notification/summary to the parent."""
        print(f"   [NOTIFICATION: {parent_id}] Event: {event_type} on content '{content_key}'. Flags: {', '.join(flags)}")
        
    def get_parent_dashboard_summary(self, parent_id: str):
        """Simulates the Parental Dashboard view (Goal 3)."""
        parent_rules = PARENT_CONTROLS_DB.get(parent_id)
        if not parent_rules:
            print(f"Parent ID '{parent_id}' not found.")
            return

        print("\n--- 👨‍👩‍👧 PARENTAL DASHBOARD SUMMARY ---")
        print(f"Parent/Guardian: {parent_id}")
        print("---")
        
        # Display preferences
        print(f"Blocked Categories: {parent_rules.blocked_categories}")
        print(f"Data Usage Policy: **{parent_rules.get_data_permission().upper()}** (Families can monetize or control data)")
        print(f"Daily Time Limit: {parent_rules.daily_time_limit_minutes} minutes")
        print("\n*Note: A real dashboard would show access history and notifications here.*")


# --- Implementation and Testing ---

if __name__ == "__main__":
    agent = GuardianAgent()
    
    print("\n" + "=" * 50)
    print("SCENARIO 1: Lily (Age 12) - Testing Restrictions & Blocks")
    print("=" * 50)
    
    # 1. Lily accesses safe content -> ALLOWED
    agent.evaluate_and_filter("child_lily", "normal_story")
    print("-" * 30)

    # 2. Lily accesses a political report (Parental Block) -> BLOCKED
    agent.evaluate_and_filter("child_lily", "political_news_report")
    print("-" * 30)

    # 3. Lily accesses a mild violence story (Age Restriction) -> RESTRICTED
    agent.evaluate_and_filter("child_lily", "story_with_mild_violence")
    print("-" * 30)

    print("\n" + "=" * 50)
    print("SCENARIO 2: Max (Age 17) - Testing Higher Severity Blocks")
    print("=" * 50)
    
    # 4. Max accesses a mild violence story (Over age 16) -> ALLOWED
    agent.evaluate_and_filter("teen_max", "story_with_mild_violence")
    print("-" * 30)

    # 5. Max accesses an explicit chat (High Severity Block) -> BLOCKED
    agent.evaluate_and_filter("teen_max", "explicit_chat_response")
    print("-" * 30)

    print("\n" + "=" * 50)
    print("SCENARIO 3: Parental Dashboard & Data Monetization Control")
    print("=" * 50)
    
    # 6. Display parent's settings
    agent.get_parent_dashboard_summary("parent_david")
    print("-" * 30)
