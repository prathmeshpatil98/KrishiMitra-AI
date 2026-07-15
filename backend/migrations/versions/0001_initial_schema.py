"""
KrishiMitra AI — Initial Database Schema Migration
===================================================
Revision ID: 0001
Revises    : None
Create Date: 2026-07-14 13:30:00.000000
"""

from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.sql import func

# Revision identifiers, used by Alembic
revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ── 1. users ──
    op.create_table(
        "users",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True, index=True),
        sa.Column("phone", sa.String(50), nullable=True, unique=True, index=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", sa.String(50), nullable=False, server_default="farmer"),
        sa.Column("preferred_language", sa.String(10), nullable=False, server_default="en"),
        sa.Column("last_login", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_verified", sa.Boolean(), nullable=False, server_default="false"),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 2. farmer_profiles ──
    op.create_table(
        "farmer_profiles",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True),
        sa.Column("full_name", sa.String(255), nullable=False),
        sa.Column("state", sa.String(100), nullable=False),
        sa.Column("district", sa.String(100), nullable=False),
        sa.Column("village", sa.String(100), nullable=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("farm_size", sa.Float(), nullable=True),
        sa.Column("soil_type", sa.String(100), nullable=True),
        sa.Column("primary_crop", sa.String(100), nullable=True),
        sa.Column("secondary_crop", sa.String(100), nullable=True),
        sa.Column("preferred_market", sa.String(255), nullable=True),
        sa.Column("preferred_language", sa.String(10), nullable=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 3. farms ──
    op.create_table(
        "farms",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("farmer_id", sa.String(36), sa.ForeignKey("farmer_profiles.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("farm_name", sa.String(255), nullable=False),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("total_area", sa.Float(), nullable=True),
        sa.Column("irrigation_type", sa.String(100), nullable=True),
        sa.Column("ownership_type", sa.String(100), nullable=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 4. crops ──
    op.create_table(
        "crops",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("farm_id", sa.String(36), sa.ForeignKey("farms.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("crop_name", sa.String(100), nullable=False, index=True),
        sa.Column("quantity", sa.Float(), nullable=True),
        sa.Column("expected_harvest", sa.DateTime(timezone=True), nullable=True),
        sa.Column("quality_grade", sa.String(50), nullable=True),
        sa.Column("estimated_cost", sa.Float(), nullable=True),
        sa.Column("status", sa.String(50), nullable=False, server_default="PLANTED"),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 5. markets ──
    op.create_table(
        "markets",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("market_name", sa.String(255), nullable=False, index=True),
        sa.Column("district", sa.String(100), nullable=False, index=True),
        sa.Column("state", sa.String(100), nullable=False, index=True),
        sa.Column("latitude", sa.Float(), nullable=True),
        sa.Column("longitude", sa.Float(), nullable=True),
        sa.Column("address", sa.String(255), nullable=True),
        sa.Column("market_type", sa.String(100), nullable=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
        # Unique constraints
        sa.UniqueConstraint("market_name", "state", name="uq_market_name_state"),
    )

    # ── 6. market_prices ──
    op.create_table(
        "market_prices",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("market_id", sa.String(36), sa.ForeignKey("markets.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("crop_name", sa.String(100), nullable=False, index=True),
        sa.Column("price", sa.Float(), nullable=False),
        sa.Column("min_price", sa.Float(), nullable=True),
        sa.Column("max_price", sa.Float(), nullable=True),
        sa.Column("arrival_quantity", sa.Float(), nullable=True),
        sa.Column("unit", sa.String(50), nullable=True, server_default="Quintal"),
        sa.Column("price_date", sa.DateTime(timezone=True), nullable=False, index=True),
        sa.Column("source", sa.String(100), nullable=True, server_default="AGMARKNET"),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 7. weather_cache ──
    op.create_table(
        "weather_cache",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("latitude", sa.Float(), nullable=False, index=True),
        sa.Column("longitude", sa.Float(), nullable=False, index=True),
        sa.Column("temperature", sa.Float(), nullable=False),
        sa.Column("humidity", sa.Float(), nullable=False),
        sa.Column("wind_speed", sa.Float(), nullable=False),
        sa.Column("rain_probability", sa.Float(), nullable=False),
        sa.Column("forecast_json", sa.JSON(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False, index=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 8. transport_routes ──
    op.create_table(
        "transport_routes",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("origin_lat", sa.Float(), nullable=False, index=True),
        sa.Column("origin_lng", sa.Float(), nullable=False, index=True),
        sa.Column("destination_lat", sa.Float(), nullable=False, index=True),
        sa.Column("destination_lng", sa.Float(), nullable=False, index=True),
        sa.Column("distance_km", sa.Float(), nullable=False),
        sa.Column("travel_time", sa.Float(), nullable=False),
        sa.Column("fuel_cost", sa.Float(), nullable=True),
        sa.Column("toll_cost", sa.Float(), nullable=True),
        sa.Column("route_provider", sa.String(100), nullable=True, server_default="Google Maps"),
        sa.Column("cached_until", sa.DateTime(timezone=True), nullable=False, index=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 9. recommendations ──
    op.create_table(
        "recommendations",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("farmer_id", sa.String(36), sa.ForeignKey("farmer_profiles.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("crop_id", sa.String(36), sa.ForeignKey("crops.id", ondelete="SET NULL"), nullable=True, index=True),
        sa.Column("recommended_market", sa.String(255), nullable=True),
        sa.Column("expected_profit", sa.Float(), nullable=True),
        sa.Column("transport_cost", sa.Float(), nullable=True),
        sa.Column("weather_risk", sa.String(255), nullable=True),
        sa.Column("confidence", sa.Float(), nullable=True),
        sa.Column("recommendation_json", sa.JSON(), nullable=True),
        sa.Column("generated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now(), index=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 10. conversations ──
    op.create_table(
        "conversations",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("title", sa.String(255), nullable=False, server_default="New Conversation"),
        sa.Column("language", sa.String(10), nullable=False, server_default="en"),
        sa.Column("started_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now(), index=True),
        sa.Column("last_message_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now(), index=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 11. messages ──
    op.create_table(
        "messages",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("conversation_id", sa.String(36), sa.ForeignKey("conversations.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("role", sa.String(50), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("token_usage", sa.Integer(), nullable=True),
        sa.Column("agent_name", sa.String(100), nullable=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 12. langgraph_checkpoints ──
    op.create_table(
        "langgraph_checkpoints",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("thread_id", sa.String(255), nullable=False, index=True),
        sa.Column("checkpoint_id", sa.String(255), nullable=False, index=True),
        sa.Column("state_json", sa.JSON(), nullable=False),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 13. government_schemes ──
    op.create_table(
        "government_schemes",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("scheme_name", sa.String(255), nullable=False, index=True),
        sa.Column("government", sa.String(100), nullable=False),
        sa.Column("category", sa.String(100), nullable=False),
        sa.Column("eligibility", sa.Text(), nullable=True),
        sa.Column("benefits", sa.Text(), nullable=True),
        sa.Column("documents", sa.Text(), nullable=True),
        sa.Column("deadline", sa.DateTime(timezone=True), nullable=True),
        sa.Column("website", sa.String(255), nullable=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 14. notifications ──
    op.create_table(
        "notifications",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True),
        sa.Column("title", sa.String(255), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("notification_type", sa.String(100), nullable=False),
        sa.Column("is_read", sa.Boolean(), nullable=False, server_default="false"),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 15. api_logs ──
    op.create_table(
        "api_logs",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("endpoint", sa.String(255), nullable=False),
        sa.Column("method", sa.String(10), nullable=False),
        sa.Column("status_code", sa.Integer(), nullable=False),
        sa.Column("execution_time", sa.Float(), nullable=False),
        sa.Column("user_id", sa.String(36), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True),
        sa.Column("request_id", sa.String(36), nullable=True, index=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 16. agent_logs ──
    op.create_table(
        "agent_logs",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("conversation_id", sa.String(36), sa.ForeignKey("conversations.id", ondelete="CASCADE"), nullable=True, index=True),
        sa.Column("agent_name", sa.String(100), nullable=False),
        sa.Column("execution_time", sa.Float(), nullable=False),
        sa.Column("input_tokens", sa.Integer(), nullable=True),
        sa.Column("output_tokens", sa.Integer(), nullable=True),
        sa.Column("status", sa.String(50), nullable=False),
        sa.Column("error_message", sa.Text(), nullable=True),
        sa.Column("tool_calls", sa.JSON(), nullable=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 17. external_api_cache ──
    op.create_table(
        "external_api_cache",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("provider", sa.String(100), nullable=False),
        sa.Column("cache_key", sa.String(255), nullable=False, unique=True, index=True),
        sa.Column("response_json", sa.JSON(), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False, index=True),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )

    # ── 18. audit_logs ──
    op.create_table(
        "audit_logs",
        sa.Column("id", sa.String(36), primary_key=True, index=True),
        sa.Column("entity", sa.String(100), nullable=False),
        sa.Column("entity_id", sa.String(36), nullable=False),
        sa.Column("action", sa.String(50), nullable=False),
        sa.Column("old_value", sa.JSON(), nullable=True),
        sa.Column("new_value", sa.JSON(), nullable=True),
        sa.Column("performed_by", sa.String(36), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True),
        sa.Column("performed_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        # Audit Columns
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=func.now()),
        sa.Column("created_by", sa.String(36), nullable=True),
        sa.Column("updated_by", sa.String(36), nullable=True),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("version", sa.Integer(), nullable=False, server_default="1"),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("external_api_cache")
    op.drop_table("agent_logs")
    op.drop_table("api_logs")
    op.drop_table("notifications")
    op.drop_table("government_schemes")
    op.drop_table("langgraph_checkpoints")
    op.drop_table("messages")
    op.drop_table("conversations")
    op.drop_table("recommendations")
    op.drop_table("transport_routes")
    op.drop_table("weather_cache")
    op.drop_table("market_prices")
    op.drop_table("markets")
    op.drop_table("crops")
    op.drop_table("farms")
    op.drop_table("farmer_profiles")
    op.drop_table("users")
