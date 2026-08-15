"""Small, production-oriented FastAPI surface used by the standalone backend.

The Replit preview uses the contract-first Express service. This router keeps the
same core auth and tenant-aware CRM operations available for Docker deployments.
"""
from datetime import datetime
from typing import Any

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.deps import get_current_user, get_db
from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.models import Company, Contact, Conversation, Message, Organization, User

api_router = APIRouter()


class LoginInput(BaseModel):
    email: str
    password: str


class RegisterInput(LoginInput):
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    organization_name: str = Field(min_length=1, max_length=255)


class ContactInput(BaseModel):
    model_config = ConfigDict(extra="ignore")
    first_name: str
    last_name: str
    email: str | None = None
    phone: str | None = None
    company_id: int | None = None
    avatar_url: str | None = None


class CompanyInput(BaseModel):
    name: str
    domain: str | None = None
    industry: str | None = None
    size: str | None = None


class ConversationInput(BaseModel):
    channel_type: str = "web"
    contact_id: int | None = None
    channel_id: int | None = None
    subject: str | None = None


class MessageInput(BaseModel):
    content: str = Field(min_length=1)
    message_type: str = "text"
    is_private: bool = False


def _public_user(user: User) -> dict[str, Any]:
    return {
        "id": user.id,
        "email": user.email,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "role": user.role,
        "avatarUrl": user.avatar_url,
        "organizationId": user.organization_id,
        "createdAt": user.created_at,
    }


@api_router.post("/auth/register", status_code=status.HTTP_201_CREATED)
async def register(payload: RegisterInput, db: AsyncSession = Depends(get_db)):
    existing = await db.scalar(select(User).where(User.email == payload.email.lower()))
    if existing:
        raise HTTPException(status_code=409, detail="Email already in use")
    slug = "".join(c.lower() if c.isalnum() else "-" for c in payload.organization_name).strip("-")
    organization = Organization(name=payload.organization_name, slug=f"{slug}-{datetime.utcnow().timestamp():.0f}")
    db.add(organization)
    await db.flush()
    user = User(
        organization_id=organization.id,
        email=payload.email.lower(),
        hashed_password=hash_password(payload.password),
        first_name=payload.first_name,
        last_name=payload.last_name,
        role="owner",
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return {
        "accessToken": create_access_token({"user_id": user.id, "organization_id": organization.id}),
        "refreshToken": create_refresh_token(user.id),
        "user": _public_user(user),
    }


@api_router.post("/auth/login")
async def login(payload: LoginInput, db: AsyncSession = Depends(get_db)):
    user = await db.scalar(select(User).where(User.email == payload.email.lower()))
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {
        "accessToken": create_access_token({"user_id": user.id, "organization_id": user.organization_id}),
        "refreshToken": create_refresh_token(user.id),
        "user": _public_user(user),
    }


@api_router.get("/auth/me")
async def me(user: User = Depends(get_current_user)):
    return _public_user(user)


@api_router.get("/users")
async def list_users(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    rows = (await db.scalars(select(User).where(User.organization_id == user.organization_id, User.is_active.is_(True)))).all()
    return [_public_user(row) for row in rows]


@api_router.get("/contacts")
async def list_contacts(
    search: str | None = Query(default=None),
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    query = select(Contact).where(Contact.organization_id == user.organization_id)
    if search:
        term = f"%{search}%"
        query = query.where(or_(Contact.first_name.ilike(term), Contact.last_name.ilike(term), Contact.email.ilike(term)))
    rows = (await db.scalars(query.order_by(Contact.created_at.desc()))).all()
    return rows


@api_router.post("/contacts", status_code=status.HTTP_201_CREATED)
async def create_contact(payload: ContactInput, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    contact = Contact(organization_id=user.organization_id, **payload.model_dump())
    db.add(contact)
    await db.commit()
    await db.refresh(contact)
    return contact


@api_router.get("/companies")
async def list_companies(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return (await db.scalars(select(Company).where(Company.organization_id == user.organization_id).order_by(Company.created_at.desc()))).all()


@api_router.post("/companies", status_code=status.HTTP_201_CREATED)
async def create_company(payload: CompanyInput, user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    company = Company(organization_id=user.organization_id, **payload.model_dump())
    db.add(company)
    await db.commit()
    await db.refresh(company)
    return company


@api_router.get("/conversations")
async def list_conversations(user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return (await db.scalars(select(Conversation).where(Conversation.organization_id == user.organization_id).order_by(Conversation.updated_at.desc()))).all()


@api_router.post("/conversations/{conversation_id}/messages", status_code=status.HTTP_201_CREATED)
async def send_message(
    conversation_id: int,
    payload: MessageInput,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    conversation = await db.scalar(select(Conversation).where(Conversation.id == conversation_id, Conversation.organization_id == user.organization_id))
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    message = Message(conversation_id=conversation.id, sender_type="agent", sender_id=user.id, sender_name=f"{user.first_name} {user.last_name}", **payload.model_dump())
    conversation.last_message = payload.content[:1000]
    conversation.last_message_at = datetime.utcnow()
    db.add(message)
    await db.commit()
    await db.refresh(message)
    return message
