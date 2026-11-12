import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Text, Numeric, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Agency(Base):
    __tablename__ = "agencies"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    tagline = Column(String(500), nullable=True)
    email = Column(String(255), nullable=False)
    phone = Column(String(50), nullable=False)
    address = Column(Text, nullable=False)
    default_currency = Column(String(10), default="PKR", nullable=False)
    timezone = Column(String(50), default="Asia/Karachi", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    users = relationship("User", back_populates="agency", cascade="all, delete-orphan")
    properties = relationship("Property", back_populates="agency", cascade="all, delete-orphan")


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agency_id = Column(String(36), ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="agent", nullable=False)  # 'agency_admin' or 'agent'
    phone = Column(String(50), nullable=False)
    avatar_url = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    agency = relationship("Agency", back_populates="users")
    assigned_properties = relationship("Property", back_populates="assigned_agent")


class Property(Base):
    __tablename__ = "properties"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    agency_id = Column(String(36), ForeignKey("agencies.id", ondelete="CASCADE"), nullable=False)
    reference_code = Column(String(50), nullable=False)
    title = Column(String(300), nullable=False)
    slug = Column(String(350), nullable=False)
    description = Column(Text, nullable=True)
    purpose = Column(String(20), nullable=False)  # 'sale', 'rent', 'lease'
    category = Column(String(50), default="residential", nullable=False)
    property_type = Column(String(50), nullable=False)
    price = Column(Numeric(15, 2), nullable=False)
    currency = Column(String(10), default="PKR", nullable=False)
    area_value = Column(Numeric(10, 2), nullable=False)
    area_unit = Column(String(20), default="sqft", nullable=False)
    bedrooms = Column(Integer, default=0, nullable=False)
    bathrooms = Column(Integer, default=0, nullable=False)
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=False)
    locality = Column(String(150), nullable=True)
    assigned_agent_id = Column(String(36), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    status = Column(String(50), default="available", nullable=False)
    is_published = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    agency = relationship("Agency", back_populates="properties")
    assigned_agent = relationship("User", back_populates="assigned_properties")

