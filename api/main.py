from fastapi import FastAPI, HTTPException, Request, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import json

from Crud.user import *
from Crud.company import *
from Crud.aircraft import *
# http://localhost:3000/user/delete?username=VBorba
#import uvicorn

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/user/add")
async def addUser(request: str = Form(...)):
    req = json.loads(request)
    try:
        dbUser = getUserByEmail(req["email"])
        if dbUser:
            raise HTTPException(status_code=400, detail="E-mail já registrado")
        return {"success": createUser(req)}
    except:
        raise HTTPException(status_code=400, detail="Erro ao cadastrar usuário")

@app.post("/user/update")
async def changeUser(request: str = Form(...)):
    req = json.loads(request)
    try:
        return {"success": updateUser(req)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/user/list")
def readUsers():
    return getUsers()

@app.get("/user/get/id")
def readUserById(id):
    dbUser = getUserById(id)
    if dbUser is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return dbUser

@app.get("/user/get/email")
def readUserByEmail(email):
    dbUser = getUserByEmail(email)
    if dbUser is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return dbUser

@app.get("/user/get/username")
def readUserByUsername(username):
    dbUser = getUserByUsername(username)
    if dbUser is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return dbUser

@app.post("/user/delete")
async def removeUser(request: str = Form(...)):
    req = json.loads(request)
    return {"success": deleteUser(req["id"])}

@app.post("/authenticate")
async def authenticateUser(request: Request):
    user = await request.json()
    dbUser = getUserByUsername(user["username"])
    if dbUser is None:
        raise HTTPException(status_code=404, detail="Nome de usuário não encontrado")
    else:
        is_password_correct = checkUsernamePassword(user)
        if is_password_correct is False:
            raise HTTPException(status_code=400, detail="Senha incorreta")
        else:
            return {"success": True, "user": dbUser}


@app.post("/company/add")
async def addCompany(request: str = Form(...), file: UploadFile = File(...)):
    req = json.loads(request)
    req["photo_path"] = await saveLogo(req, file)
    return {"success": createCompany(req)}

@app.post("/company/update")
async def changeCompany(request: str = Form(...), file: UploadFile = File(...)):
    req = json.loads(request)
    await deleteLogo(req)
    req["photo_path"] = await saveLogo(req, file)
    return {"success": updateCompany(req)}

@app.get("/company/list")
def readCompanies():
    companies = getCompanies()
    return companies

@app.get("/company/get/id")
def readCompanyById(id):
    dbCompany = getCompanyById(id)
    if dbCompany is None:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    return dbCompany

@app.get("/company/get/name")
def readCompanyByName(name):
    dbCompany = getCompanyByName(name)
    if dbCompany is None:
        raise HTTPException(status_code=404, detail="Marca não encontrada")
    return dbCompany

@app.post("/company/delete")
async def removeCompany(request: str = Form(...)):
    req = json.loads(request)
    return {"success": deleteCompany(req["id"])}


@app.post("/aircraft/add")
async def addAircraft(request: str = Form(...), internos: List[UploadFile] = File(...), externos: List[UploadFile] = File(...), mapa_assentos: UploadFile = File(...)):
    req = json.loads(request)
    req["photos_path"] = await saveImages(req, externos, internos, mapa_assentos)
    return {"success": createAircraft(req)}

@app.post("/aircraft/update")
async def changeAircraft(request: str = Form(...), internos: List[UploadFile] = File(...), externos: List[UploadFile] = File(...), mapa_assentos: UploadFile = File(...)):
    req = json.loads(request)
    req["photos_path"] = await saveImages(req, externos, internos, mapa_assentos)
    return {"success": updateAircraft(req)}

@app.get("/aircraft/list")
def readAircrafts(company_id):
    aircrafts = getAircrafts(company_id)
    return aircrafts

@app.get("/aircraft/available/list")
def readAircrafts(company_id):
    aircrafts = getAvailableAircrafts(company_id)
    return aircrafts

@app.get("/aircraft/get")
def readAircraftById(id):
    db_aircraft = getAircraftById(id)
    if db_aircraft is None:
        raise HTTPException(status_code=404, detail="aircraft not found")
    return db_aircraft

@app.post("/aircraft/delete")
async def removeAircraft(request: str = Form(...)):
    req = json.loads(request)
    return {"success": deleteAircraft(req["id"])}

#uvicorn.run(app, host="0.0.0.0", port=8000)