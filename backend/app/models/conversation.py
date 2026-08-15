"""Conversation model — universal across all channels."""
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Integer, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Conversation(Base):
    __tablename__ = "conversations"

    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    channel_id: Mapped[int | None] = mapped_column(ForeignKey("channels.id", ondelete="SET NULL"))
    contact_id: Mapped[int | None] = mapped_column(ForeignKey("contacts.id", ondelete="SET NULL"))
    assignee_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)  # open|resolved|pending|snoozed
    channel_type: Mapped[str] = mapped_column(String(50), nullable=False)
    subject: Mapped[str | None] = mapped_column(String(500))
    last_message_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    last_message: Mapped[str | None] = mapped_column(String(1000))
    unread_count: Mapped[int] = mapped_column(Integer, default=0)
    ai_handled: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    organization: Mapped["Organization"] = relationship("Organization")
    channel: Mapped["Channel | None"] = relationship("Channel", back_populates="conversations")
    contact: Mapped["Contact | None"] = relationship("Contact", back_populates="conversations")
    assignee: Mapped["User | None"] = relationship("User", back_populates="assigned_conversations", foreign_keys=[assignee_id])
    messages: Mapped[list["Message"]] = relationship("Message", back_populates="conversation", order_by="Message.created_at")
    notes: Mapped[list["Note"]] = relationship("Note", back_populates="conversation")
