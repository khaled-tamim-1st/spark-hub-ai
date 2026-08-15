"""Channel model — a configured messaging channel (WhatsApp, Messenger, etc.)."""
from datetime import datetime
from sqlalchemy import String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Channel(Base):
    __tablename__ = "channels"

    id: Mapped[int] = mapped_column(primary_key=True)
    organization_id: Mapped[int] = mapped_column(ForeignKey("organizations.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    channel_type: Mapped[str] = mapped_column(String(50), nullable=False)  # whatsapp|messenger|instagram|telegram|tiktok|web
    provider: Mapped[str] = mapped_column(String(50), nullable=False)      # whatsapp_cloud|whatsapp_web|meta_graph|...
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    # Provider-specific fields stored as nullable strings
    phone_number: Mapped[str | None] = mapped_column(String(50))
    page_id: Mapped[str | None] = mapped_column(String(100))
    access_token: Mapped[str | None] = mapped_column(String(1000))
    webhook_verify_token: Mapped[str | None] = mapped_column(String(255))
    config_json: Mapped[str | None] = mapped_column(String(5000))  # JSON blob for extra config
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    organization: Mapped["Organization"] = relationship("Organization", back_populates="channels")
    conversations: Mapped[list["Conversation"]] = relationship("Conversation", back_populates="channel")
