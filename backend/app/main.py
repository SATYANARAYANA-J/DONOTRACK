from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, campaigns, donations, updates, wallet, admin, ngo, donor, notifications, disputes, stats, profile
from fastapi.staticfiles import StaticFiles
import os
from .websockets import manager

app = FastAPI(title="DoNoTrack Backend")

os.makedirs("uploads/kyc", exist_ok=True)
os.makedirs("uploads/profiles", exist_ok=True)
os.makedirs("uploads/proofs", exist_ok=True)

from fastapi import Depends, HTTPException
from fastapi.responses import FileResponse
from . import dependencies, models

@app.get("/static/kyc/{filename}")
async def get_secure_kyc_file(
    filename: str,
    current_user: models.User = Depends(dependencies.get_current_user)
):
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.NGO]:
        raise HTTPException(status_code=403, detail="Unauthorized access to sensitive KYC documents")
    
    safe_filename = os.path.basename(filename)
    base_dir = os.path.abspath("uploads/kyc")
    file_path = os.path.abspath(os.path.join(base_dir, safe_filename))
    
    if not file_path.startswith(base_dir) or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@app.get("/static/profiles/{filename}")
async def get_profile_file(
    filename: str,
    current_user: models.User = Depends(dependencies.get_current_user)
):
    safe_filename = os.path.basename(filename)
    base_dir = os.path.abspath("uploads/profiles")
    file_path = os.path.abspath(os.path.join(base_dir, safe_filename))
    
    if not file_path.startswith(base_dir) or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@app.get("/static/proofs/{filename}")
async def get_proof_file(filename: str):
    safe_filename = os.path.basename(filename)
    base_dir = os.path.abspath("uploads/proofs")
    file_path = os.path.abspath(os.path.join(base_dir, safe_filename))
    
    if not file_path.startswith(base_dir) or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)



# CORS Configuration
origins = [
    "http://localhost:5173", # Vite default
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    print(f"Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": exc.body},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    import traceback
    error_details = traceback.format_exc()
    print(f"[INTERNAL SERVER ERROR]: {error_details}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Please try again later."},
    )


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

app.include_router(auth.router)
app.include_router(campaigns.router)
app.include_router(donations.router)
app.include_router(updates.router)
app.include_router(wallet.router)
app.include_router(admin.router)
app.include_router(ngo.router)
app.include_router(donor.router)
app.include_router(notifications.router)
app.include_router(disputes.router)
app.include_router(stats.router)
app.include_router(profile.router)

@app.get("/")
async def root():
    return {"message": "Welcome to DoNoTrack API"}
