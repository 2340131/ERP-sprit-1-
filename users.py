"""
User Pydantic models for the ERP backend.
Follows the three-model pattern common in FastAPI + MongoDB projects:
  - UserBase    : shared fields used for both input and output
  - UserCreate  : fields required when registering a new user (includes password)
  - UserInDB    : the document as it is stored in MongoDB (hashed password + id)
  - UserResponse: the public-safe shape returned by API responses (no password)
"""
from __future__ import annotations
from datetime import datetime
from enum import Enum
from typing import Optional
from bson import ObjectId
from pydantic import BaseModel, EmailStr, Field, field_validator
# ─── Helpers ──────────────────────────────────────────────────────────────────
class PyObjectId(str):
    """
    Custom type that coerces a MongoDB ObjectId to/from a plain string so that
    Pydantic v2 can serialise it without needing extra JSON encoders.
    """
    @classmethod
    def __get_validators__(cls):
        yield cls.validate
    @classmethod
    def validate(cls, value: object) -> str:
        if isinstance(value, ObjectId):
            return str(value)
        if isinstance(value, str) and ObjectId.is_valid(value):
            return value
        raise ValueError(f"Invalid ObjectId: {value!r}")
# ─── Enums ────────────────────────────────────────────────────────────────────
class UserRole(str, Enum):
    """Roles available within the ERP system."""
    ADMIN        = "admin"
    PROJECT_LEAD = "project_lead"
    MEMBER       = "member"
    INTERN       = "intern"
    VIEWER       = "viewer"
# ─── Base model ───────────────────────────────────────────────────────────────
class UserBase(BaseModel):
    """Fields shared across all user schemas."""
    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        examples=["Jane Doe"],
        description="User's full display name.",
    )
    email: EmailStr = Field(
        ...,
        examples=["jane.doe@company.com"],
        description="Unique email address used for login.",
    )
    role: UserRole = Field(
        default=UserRole.INTERN,
        description="Permission role assigned to this user.",
    )
    is_active: bool = Field(
        default=True,
        description="Soft-delete / deactivation flag.",
    )
    avatar_url: Optional[str] = Field(
        default=None,
        description="URL to the user's profile picture (optional).",
    )
    @field_validator("email", mode="before")
    @classmethod
    def normalise_email(cls, v: str) -> str:
        """Store emails in lowercase to prevent duplicate registrations."""
        return v.strip().lower()
# ─── Create schema (request body for registration) ────────────────────────────
class UserCreate(UserBase):
    """
    Schema used when a client sends a POST /users or POST /auth/register request.
    The plain-text password is accepted here and must be hashed before storage.
    """
    password: str = Field(
        ...,
        min_length=8,
        description="Plain-text password (will be hashed, never stored raw).",
    )
    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        """Enforce a basic strength policy on the plain-text password."""
        if not any(c.isdigit() for c in v):
            raise ValueError("Password must contain at least one digit.")
        if not any(c.isupper() for c in v):
            raise ValueError("Password must contain at least one uppercase letter.")
        return v
# ─── Update schema (request body for PATCH /users/{id}) ───────────────────────
class UserUpdate(BaseModel):
    """
    All fields are optional so callers can perform partial updates (PATCH semantics).
    Only the fields present in the request body will be applied.
    """
    full_name:  Optional[str]      = Field(default=None, min_length=2, max_length=100)
    email:      Optional[EmailStr] = Field(default=None)
    role:       Optional[UserRole] = Field(default=None)
    is_active:  Optional[bool]     = Field(default=None)
    avatar_url: Optional[str]      = Field(default=None)
# ─── DB schema (the document stored in MongoDB) ───────────────────────────────
class UserInDB(UserBase):
    """
    Represents the user document exactly as stored in the 'users' collection.
    Never expose this model directly via the API — use UserResponse instead.
    """
    id: Optional[PyObjectId] = Field(
        default=None,
        alias="_id",
        description="MongoDB document ObjectId (serialised as string).",
    )
    hashed_password: str = Field(
        ...,
        description="bcrypt-hashed password. Never returned to clients.",
    )
    created_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="UTC timestamp of when the user document was created.",
    )
    updated_at: datetime = Field(
        default_factory=datetime.utcnow,
        description="UTC timestamp of the last update to this document.",
    )
    model_config = {
        # Allow population by field name OR alias (_id)
        "populate_by_name": True,
        # Accept arbitrary types like ObjectId
        "arbitrary_types_allowed": True,
    }
# ─── Response schema (safe public shape returned by the API) ──────────────────
class UserResponse(BaseModel):
    """
    The user object returned to API clients.
    Excludes sensitive fields (hashed_password) and renames _id → id.
    """
    id:         str       = Field(..., description="User's unique identifier.")
    full_name:  str
    email:      EmailStr
    role:       UserRole
    is_active:  bool
    avatar_url: Optional[str]
    created_at: datetime
    updated_at: datetime
    model_config = {
        # Allow building from ORM-like objects / dicts with alias keys
        "from_attributes": True,
    }
