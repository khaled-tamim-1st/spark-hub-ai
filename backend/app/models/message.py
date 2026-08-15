"""Message model — individual messages within a Conversation."""
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Message(Base):
    __tablename__ = "messages"

    id: Mapped[int] = mapped_column(primary_key=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversations.id", ondelete="CASCADE"), index=True)
    # sender_type: contact | agent | ai | system
    sender_type: Mapped[str] = mapped_column(String(20), nullable=False)
    sender_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"))
    sender_name: Mapped[str | None] = mapped_column(String(200))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    message_type: Mapped[str] = mapped_column(String(20), default="text")  # text|image|file|audio|video
    status: Mapped[str] = mapped_column(String(20), default="sent")        # sent|delivered|read|failed
    is_private: Mapped[bool] = mapped_column(Boolean, default=False)       # internal note
    external_id: Mapped[str | None] = mapped_column(String(255))           # provider message ID
    metadata_json: Mapped[str | None] = mapped_column(Text)                # JSON attachments/media
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    conversation: Mapped["Conversation"] = relationship("Conversation", back_populates="messages")
    sender_user: Mapped["User | None"] = relationship("User", back_populates="messages")
