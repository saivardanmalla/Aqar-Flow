"""Initial AqarFlow schema migration

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-11-08

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # Agencies table
    op.create_table(
        'agencies',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('slug', sa.String(length=255), nullable=False, unique=True),
        sa.Column('tagline', sa.String(length=500), nullable=True),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('address', sa.Text(), nullable=False),
        sa.Column('default_currency', sa.String(length=10), server_default='PKR', nullable=False),
        sa.Column('timezone', sa.String(length=50), server_default='Asia/Karachi', nullable=False),
        sa.Column('logo_url', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # Users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('agency_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('agencies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=50), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('avatar_url', sa.Text(), nullable=True),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # Properties table
    op.create_table(
        'properties',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('agency_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('agencies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('reference_code', sa.String(length=50), nullable=False),
        sa.Column('title', sa.String(length=300), nullable=False),
        sa.Column('slug', sa.String(length=350), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('purpose', sa.String(length=20), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        sa.Column('property_type', sa.String(length=50), nullable=False),
        sa.Column('price', sa.Numeric(15, 2), nullable=False),
        sa.Column('currency', sa.String(length=10), server_default='PKR', nullable=False),
        sa.Column('area_value', sa.Numeric(10, 2), nullable=False),
        sa.Column('area_unit', sa.String(length=20), nullable=False),
        sa.Column('bedrooms', sa.Integer(), server_default='0', nullable=False),
        sa.Column('bathrooms', sa.Integer(), server_default='0', nullable=False),
        sa.Column('address', sa.Text(), nullable=True),
        sa.Column('city', sa.String(length=100), nullable=False),
        sa.Column('locality', sa.String(length=150), nullable=True),
        sa.Column('amenities', postgresql.JSONB(), server_default='[]', nullable=True),
        sa.Column('furnishing_status', sa.String(length=50), server_default='unfurnished', nullable=False),
        sa.Column('construction_status', sa.String(length=50), server_default='ready', nullable=False),
        sa.Column('possession_status', sa.String(length=50), server_default='immediate', nullable=False),
        sa.Column('assigned_agent_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('status', sa.String(length=50), server_default='draft', nullable=False),
        sa.Column('is_published', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('views_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('inquiries_count', sa.Integer(), server_default='0', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.UniqueConstraint('agency_id', 'reference_code', name='uq_agency_reference_code'),
    )

    # Leads table
    op.create_table(
        'leads',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('agency_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('agencies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('customer_name', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=50), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=True),
        sa.Column('preferred_contact_method', sa.String(length=20), server_default='phone', nullable=False),
        sa.Column('inquiry_purpose', sa.String(length=20), server_default='buy', nullable=False),
        sa.Column('budget', sa.Numeric(15, 2), nullable=True),
        sa.Column('preferred_location', sa.String(length=255), nullable=True),
        sa.Column('property_type', sa.String(length=50), nullable=True),
        sa.Column('lead_source', sa.String(length=50), server_default='website_inquiry', nullable=False),
        sa.Column('stage', sa.String(length=50), server_default='new', nullable=False),
        sa.Column('related_property_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('properties.id', ondelete='SET NULL'), nullable=True),
        sa.Column('assigned_agent_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('next_follow_up_date', sa.DateTime(timezone=True), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # Visits table
    op.create_table(
        'visits',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('agency_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('agencies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('property_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False),
        sa.Column('lead_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('leads.id', ondelete='CASCADE'), nullable=False),
        sa.Column('assigned_agent_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('visit_date', sa.Date(), nullable=False),
        sa.Column('start_time', sa.Time(), nullable=False),
        sa.Column('duration_minutes', sa.Integer(), server_default='45', nullable=False),
        sa.Column('meeting_location', sa.Text(), nullable=False),
        sa.Column('visitor_count', sa.Integer(), server_default='1', nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('status', sa.String(length=30), server_default='confirmed', nullable=False),
        sa.Column('outcome_notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

    # Deals table
    op.create_table(
        'deals',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('agency_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('agencies.id', ondelete='CASCADE'), nullable=False),
        sa.Column('property_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('properties.id', ondelete='CASCADE'), nullable=False),
        sa.Column('lead_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('leads.id', ondelete='CASCADE'), nullable=False),
        sa.Column('assigned_agent_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('seller_contact_name', sa.String(length=255), nullable=True),
        sa.Column('offer_amount', sa.Numeric(15, 2), nullable=False),
        sa.Column('agreed_amount', sa.Numeric(15, 2), nullable=True),
        sa.Column('expected_closing_date', sa.Date(), nullable=True),
        sa.Column('stage', sa.String(length=50), server_default='offer', nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=False),
    )

def downgrade() -> None:
    op.drop_table('deals')
    op.drop_table('visits')
    op.drop_table('leads')
    op.drop_table('properties')
    op.drop_table('users')
    op.drop_table('agencies')
