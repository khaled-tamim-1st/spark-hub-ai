"""Contact model — a customer or lead."""
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, func, Table, Column, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base

# Many-to-many: contacts ↔ tags
contact_tags = Table(
    "contact_tags",
    Base.metadata,
    Column("contact_id", Integer, ForeignKey("contacts.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Contact(Base):
    __tablename__ = "contacts"

    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    company_id: Mapped[int | None] = mapped_column(ForeignKey("companies.id", ondelete="SET NULL"))
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str | None] = mapped_column(String(255), index=True)
    phone: Mapped[str | None] = mapped_column(String(50))
    avatar_url: Mapped[str | None] = mapped_column(String(500))
    last_activity_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    organization: Mapped["Organization"] = relationship("Organization", back_populates="contacts")
    company: Mapped["Company | None"] = relationship("Company", back_populates="contacts")
    tags: Mapped[list["Tag"]] = relationship("Tag", secondary=contact_tags, back_populates="contacts")
    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="contact")
    notes: Mapped[list["Note"]] = relationship("Note", back_populates="contact")
    deals: Mapped[list["Deal"]] = relationship("Deal", back_populates="contact")
