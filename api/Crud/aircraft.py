from database import engine
import pandas as pd
import os
import aiofiles
import shutil
from PIL import Image

def indexContainingSubstring(the_list, substring):
    for i, s in enumerate(the_list):
        if substring in s:
              return i
    return -1

#mypath = "C:/Users/victorvb2/Documents/Projetos/Cygnus/html"
mypath = "/home/html"

def getAircraftById(id):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from aircraft where id = {id}", dbConnection)
    dbConnection.close()
    if len(df) > 0:
        records = df.to_dict("records")[0]
        records["outside_files"] = os.listdir(mypath + df["photos_path"][0] + "/externo")
        records["inside_files"] = os.listdir(mypath + df["photos_path"][0] + "/interno")
        files = os.listdir(mypath + df["photos_path"][0])
        records["mapa_assentos"] = files[indexContainingSubstring(files, "mapa_assentos")]
        
        return records
    return False

def getAircrafts(company_id):
    dbConnection = engine.connect()
    where = "where first_seen > 0"
    if int(company_id) > 0:
        where = f"{where} and company_id = {company_id}"
    df = pd.read_sql(f"select a.*, c.name as company_name from aircraft a join company c on a.company_id = c.id {where} order by first_seen asc", dbConnection)
    dbConnection.close()
    return df.to_dict("records")

async def createAircraft(req, internos, externos, mapa_assentos):
    try:
        insert = f"insert into aircraft(model, series, company_id, engine, max_takeoff_weight, \
            first_year_production, tbo, max_capacity, max_cruise_speed, max_range, max_operating_altitude, \
            wingspan, length, max_tail_height, min_takeoff_distance, description, description_en, first_seen) \
            values('{req['model']}', '{req['series']}', '{req['company_id']}', '{req['engine']}', '{req['max_takeoff_weight']}', \
            '{req['first_year_production']}', '{req['tbo']}', '{req['max_capacity']}', '{req['max_cruise_speed']}', \
            '{req['max_range']}', '{req['max_operating_altitude']}', '{req['wingspan']}', '{req['length']}', '{req['max_tail_height']}', '{req['min_takeoff_distance']}', \
            '{req['description']}', '{req['description_en']}', '{int(req['first_seen'])}')"
        dbConnection = engine.connect()
        dbConnection.execute(insert)
        dbConnection.close()
        
        dbConnection = engine.connect()
        [req["id"]] = dbConnection.execute("SELECT MAX(id) from aircraft").fetchone()
        dbConnection.close()
        
        req["photos_path"] = await saveImages(req, internos, externos, mapa_assentos)
        update = f"update aircraft \
            set \
            photos_path = '{req['photos_path']}' \
            where id = {req['id']}"
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()
        return True
    except:
        raise

def updateAircraft(req):
    try:
        update = f"update aircraft \
            set \
            model = '{req['model']}', \
            series = '{req['series']}', \
            company_id = '{req['company_id']}', \
            engine = '{req['engine']}', \
            max_takeoff_weight = '{req['max_takeoff_weight']}', \
            first_year_production = '{req['first_year_production']}', \
            tbo = '{req['tbo']}', \
            max_capacity = '{req['max_capacity']}', \
            max_cruise_speed = '{req['max_cruise_speed']}', \
            max_range = '{req['max_range']}', \
            max_operating_altitude = '{req['max_operating_altitude']}', \
            wingspan = '{req['wingspan']}', \
            length = '{req['length']}', \
            max_tail_height = '{req['max_tail_height']}', \
            min_takeoff_distance = '{req['min_takeoff_distance']}', \
            description = '{req['description']}', \
            description_en = '{req['description_en']}', \
            first_seen = {int(req['first_seen'])} \
            where id = {req['id']}"
        
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()

        return True
    except:
        raise

def deleteAircraft(id):
    try:
        delete = f"delete from aircraft where id = {id}"
        dbConnection = engine.connect()
        dbConnection.execute(delete)
        dbConnection.close()
        return True
    except:
        raise

async def saveImages(req, internos, externos, mapa_assentos):
    #Mapa assentos
    strpath = f"{mypath}/images/{req['company_name']}/{req['id']}"
    if os.path.exists(strpath):
        shutil.rmtree(strpath, ignore_errors=True)
    os.makedirs(strpath)
    
    count = 1
    try:
        filename, file_extension = os.path.splitext(mapa_assentos.filename)
        filename = f"mapa_assentos{file_extension}"
    
        
        async with aiofiles.open(f"{strpath}/{filename}", 'wb') as out_file:
            content = await mapa_assentos.read()  # async read
            await out_file.write(content)  # async write
        
        count+=1
    finally:
        mapa_assentos.file.close()

    #Fotos Internas,
    strpath = f"{mypath}/images/{req['company_name']}/{req['id']}/interno"
    if os.path.exists(strpath):
        shutil.rmtree(strpath, ignore_errors=True)
    os.makedirs(strpath)
    
    count = 1
    for i in internos:
        try:
            filename, file_extension = os.path.splitext(i.filename)
            
            filename = f"interno_{count}{file_extension}"
        
            
            async with aiofiles.open(f"{strpath}/{filename}", 'wb') as out_file:
                content = await i.read()  # async read
                await out_file.write(content)  # async write
            
            count+=1
        finally:
            i.file.close()
            
    #Fotos internas
    strpath = f"{mypath}/images/{req['company_name']}/{req['id']}/externo"
    if os.path.exists(strpath):
        shutil.rmtree(strpath, ignore_errors=True)
    os.makedirs(strpath)
    
    count = 1
    for i in externos:
        try:
            filename, file_extension = os.path.splitext(i.filename)
            filename = f"externo_{count}{file_extension}"
        
            
            async with aiofiles.open(f"{strpath}/{filename}", 'wb') as out_file:
                content = await i.read()  # async read
                await out_file.write(content)  # async write
            
            count+=1
        finally:
            i.file.close()
            
    return f"/images/{req['company_name']}/{req['id']}"