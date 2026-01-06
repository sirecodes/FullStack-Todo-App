"""Authentication endpoints - Return token in JSON, let frontend set cookie"""
from fastapi import APIRouter, Depends, status, HTTPException, Response
from sqlalchemy.orm import Session

from src.api.dependencies import get_db, get_current_user_id
from src.schemas.auth import SignupRequest, LoginRequest, AuthResponse, LogoutResponse
from src.schemas.user import UserResponse
from src.services.auth_service import (
    AuthService,
    DuplicateEmailError,
    InvalidCredentialsError,
    InvalidInputError,
    BetterAuthClientError
)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/signup", status_code=status.HTTP_201_CREATED, response_model=AuthResponse)
async def signup(
    signup_request: SignupRequest,
    db: Session = Depends(get_db)
):
    """
    Create new user account and return JWT token in response body.
    
    Frontend will set the cookie with correct domain.

    Request Body:
        - email: Valid email address (will be normalized to lowercase)
        - password: Minimum 8 characters

    Response:
        - 201 Created: Account created successfully, JWT token in response body
        - 400 Bad Request: Invalid email format or password too short
        - 409 Conflict: Email already registered
        - 500 Internal Server Error: BetterAuth service error

    Example:
        POST /api/v1/auth/signup
        {
            "email": "user@example.com",
            "password": "securePassword123"
        }

        Response:
        {
            "message": "Account created successfully",
            "user": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "created_at": "2025-12-15T12:00:00Z"
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    """
    try:
        # Call auth service to create user
        user, jwt_token = await AuthService.signup(
            db=db,
            email=signup_request.email,
            password=signup_request.password
        )

        # ✅ Return token in response body - frontend will set cookie
        return AuthResponse(
            message="Account created successfully",
            user={
                "id": user.id,
                "email": user.email,
                "created_at": user.created_at.isoformat()
            },
            token=jwt_token  # Frontend will use this to set cookie
        )

    except InvalidInputError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

    except DuplicateEmailError as e:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(e)
        )

    except BetterAuthClientError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication service error: {str(e)}"
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/login", status_code=status.HTTP_200_OK, response_model=AuthResponse)
async def login(
    login_request: LoginRequest,
    db: Session = Depends(get_db)
):
    """
    Authenticate user with email and password.
    
    Returns JWT token in response body - frontend will set cookie.

    Request Body:
        - email: Registered email address
        - password: User password

    Response:
        - 200 OK: Login successful, JWT token in response body
        - 401 Unauthorized: Invalid email or password

    Example:
        POST /api/v1/auth/login
        {
            "email": "user@example.com",
            "password": "securePassword123"
        }

        Response:
        {
            "message": "Welcome back!",
            "user": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "email": "user@example.com",
                "created_at": "2025-12-15T12:00:00Z"
            },
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
    """
    try:
        # Call auth service to authenticate user
        user, jwt_token = await AuthService.login(
            db=db,
            email=login_request.email,
            password=login_request.password
        )

        # ✅ Return token in response body - frontend will set cookie
        return AuthResponse(
            message="Welcome back!",
            user={
                "id": user.id,
                "email": user.email,
                "created_at": user.created_at.isoformat()
            },
            token=jwt_token  # Frontend will use this to set cookie
        )

    except InvalidCredentialsError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {str(e)}"
        )


@router.post("/logout", status_code=status.HTTP_200_OK, response_model=LogoutResponse)
async def logout(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    Logout current user by destroying session.

    Requires valid JWT authentication.
    Destroys session in database - frontend will clear cookie.

    Response:
        - 200 OK: Logout successful, session destroyed
        - 401 Unauthorized: Invalid or missing auth token

    Example:
        POST /api/v1/auth/logout
        Authorization: Bearer <jwt-token>

        Response:
        {
            "message": "You have been logged out successfully"
        }
    """
    # Destroy session in database
    AuthService.logout(db, user_id)

    # ✅ Just return success - frontend will clear cookie
    return LogoutResponse(
        message="You have been logged out successfully"
    )


@router.get("/me", status_code=status.HTTP_200_OK, response_model=UserResponse)
async def get_current_user(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """
    Get current authenticated user information.

    Requires valid JWT authentication.
    Returns user profile data for the authenticated user.

    Response:
        - 200 OK: Current user information
        - 401 Unauthorized: Not authenticated or invalid token
        - 404 Not Found: User not found in database

    Example:
        GET /api/v1/auth/me
        Authorization: Bearer <jwt-token>

        Response:
        {
            "id": "550e8400-e29b-41d4-a716-446655440000",
            "email": "user@example.com",
            "created_at": "2025-12-15T12:00:00Z"
        }
    """
    from src.models.user import User

    # Query user from database
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # Return user information
    return UserResponse(
        id=user.id,
        email=user.email,
        created_at=user.created_at.isoformat()
    )