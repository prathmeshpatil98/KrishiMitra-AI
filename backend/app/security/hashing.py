"""
KrishiMitra AI — Password Hashing
====================================
Purpose     : Secure password hashing and verification using bcrypt.
Respons.    : Hash passwords before persistence and verify plain-text against stored hashes.
Dependencies: passlib[bcrypt]
Usage       : from app.security.hashing import PasswordHasher; PasswordHasher.hash("secret")

Never store plain-text passwords anywhere.
Never log passwords at any log level.
"""

from __future__ import annotations

from passlib.context import CryptContext

_pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)


class PasswordHasher:
    """
    Stateless utility class for bcrypt password operations.

    All methods are class-level to avoid unnecessary instantiation.
    The bcrypt work factor (rounds=12) is intentionally expensive to resist brute-force attacks.
    """

    @classmethod
    def hash(cls, plain_password: str) -> str:
        """
        Hash a plain-text password with bcrypt.

        Args:
            plain_password: The raw password string from the user.

        Returns:
            A bcrypt hash string safe to store in the database.

        Raises:
            ValueError: If the plain_password is empty.
        """
        if not plain_password:
            raise ValueError("Password must not be empty.")
        return _pwd_context.hash(plain_password)

    @classmethod
    def hash_password(cls, plain_password: str) -> str:
        """Alias for hash() to preserve calling code compatibility."""
        return cls.hash(plain_password)

    @classmethod
    def verify(cls, plain_password: str, hashed_password: str) -> bool:
        """
        Verify a plain-text password against a stored bcrypt hash.

        Args:
            plain_password  : The raw password string provided by the user.
            hashed_password : The bcrypt hash stored in the database.

        Returns:
            True if the password matches the hash, False otherwise.
            Uses constant-time comparison to prevent timing attacks.
        """
        if not plain_password or not hashed_password:
            return False
        return _pwd_context.verify(plain_password, hashed_password)

    @classmethod
    def verify_password(cls, plain_password: str, hashed_password: str) -> bool:
        """Alias for verify() to preserve calling code compatibility."""
        return cls.verify(plain_password, hashed_password)

    @classmethod
    def needs_rehash(cls, hashed_password: str) -> bool:
        """
        Check if a hash was produced with outdated settings and should be rehashed.

        Args:
            hashed_password: The stored bcrypt hash.

        Returns:
            True if the hash should be regenerated (e.g., rounds changed).
        """
        return _pwd_context.needs_update(hashed_password)
