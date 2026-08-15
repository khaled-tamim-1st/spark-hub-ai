"""Organization model — top-level tenant."""
from datetime import datetime
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Organization(Base):
    __tablename__ = "organizations"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    logo_url: Mapped[str | None] = mapped_column(String(500))
    website: Mapped[str | None] = mapped_column(String(500))
    plan: Mapped[str] = mapped_column(String(50), default="free")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    users: Mapped[list["User"]] = relationship("User", back_populates="organization")
    channels: Mapped[list["Channel"]] = relationship("Channel", back_populates="organization")
    contacts: Mapped[list["Contact"]] = relationship("Contact", back_populates="organization")
    companies: Mapped[list["Company"]] = relationship("Company", back_populates="organization")
    pipelines: Mapped[list["Pipeline"]] = relationship("Pipeline", back_populates="organization")
    tags: Mapped[list["Tag"]] = relationship("Tag", back_populates="organization")
    knowledge_docs: Mapped[list["KnowledgeDoc"]] = relationship("KnowledgeDoc", back_populates="organization")
    ai_settings: Mapped["AiSettings | None"] = relationship("AiSettings", back_populates="organization", uselist=False)
