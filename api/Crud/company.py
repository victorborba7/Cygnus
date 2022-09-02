from database import engine
import pandas as pd
import os
import aiofiles

def indexContainingSubstring(the_list, substring):
    for i, s in enumerate(the_list):
        if substring in s:
              return i
    return -1

#mypath = "C:/Users/victorvb2/Documents/Projetos/Cygnus/html"
mypath = "/home/html"


def getCompanyById(id):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from company where id = {id}", dbConnection)
    dbConnection.close()
    records = df.to_dict("records")[0]
    if len(df) > 0:
        return records
    return False

def getCompanyByName(name):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from company where name = '{name}'", dbConnection)
    dbConnection.close()
    if len(df) > 0:
        return df.to_dict("records")[0]
    return False

def getCompanies():
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from company", dbConnection)
    dbConnection.close()
    return df.to_dict("records")

def createCompany(company):
    try:
        insert = f"insert into company(name, photo_path) \
            values('{company['name']}', '{company['photo_path']}')"
        dbConnection = engine.connect()
        dbConnection.execute(insert)
        dbConnection.close()
        return True
    except:
        raise

def updateCompany(req):
    try:
        update = f"update company \
            set \
            name = '{req['name']}', \
            photo_path = '{req['photo_path']}' \
            where id = {req['id']}"
        
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()

        return True
    except:
        raise

def deleteCompany(id):
    try:
        delete = f"delete from company where id = {id}"
        dbConnection = engine.connect()
        dbConnection.execute(delete)
        dbConnection.close()
        return True
    except:
        raise

async def saveLogo(req, file):
    try:
        filename, file_extension = os.path.splitext(file.filename)
        strpath = f"{mypath}/images/{req['name']}"
        filename = f"logo{file_extension}"
        
        if not os.path.exists(strpath):
            os.makedirs(strpath)
        
        async with aiofiles.open(f"{strpath}/{filename}", 'wb') as out_file:
            content = await file.read()  # async read
            await out_file.write(content)  # async write
    except:
        raise
    return f"images/{req['name']}/{filename}"

async def deleteLogo(req):
    try:
        strpath = f"{mypath}/images/{req['name']}"
        
        if not os.path.exists(strpath):
            os.rmdir(strpath)
    except:
        return False
    finally:
        return True