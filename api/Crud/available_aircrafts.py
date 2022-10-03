from database import engine
import pandas as pd
import os
import aiofiles
import shutil

def indexContainingSubstring(the_list, substring):
    for i, s in enumerate(the_list):
        if substring in s:
              return i
    return -1

#mypath = "C:/Users/victorvb2/Documents/Projetos/Cygnus/html"
mypath = "/home/html"

def getAvailableAircraftById(id):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from available_aircraft where id = {id}", dbConnection)
    dbConnection.close()
    if len(df) > 0:
        records = df.to_dict("records")[0]
        records["files"] = os.listdir(mypath + df["photos_path"][0])
        
        return records
    return False

def getAvailableAircrafts(company_id):
    dbConnection = engine.connect()
    where = ""
    if int(company_id) > 0:
        where = f"where company_id = {company_id}"
    df = pd.read_sql(f"select a.*, c.name as company_name from available_aircraft a join company c on a.company_id = c.id {where}", dbConnection)
    dbConnection.close()
    df["files"] = df.apply(lambda x: os.listdir(mypath + x["photos_path"]), axis=1)
    return df.to_dict("records")

async def createAvailableAircraft(req, photos):
    try:
        insert = f"insert into available_aircraft(model, year, company_id, available, interior_description, \
            exterior_description, additional_equipment, airframe, engines, propeller, maintenance_inspection, \
            avionics) \
	    values('{req['model']}', '{req['year']}', '{req['company_id']}', '{req['available']}', '{req['interior_description']}', \
            '{req['exterior_description']}', '{req['additional_equipment']}', '{req['airframe']}', '{req['engines']}', \
            '{req['propeller']}', '{req['maintenance_inspection']}', '{req['avionics']}')"
        dbConnection = engine.connect()
        dbConnection.execute(insert)
        dbConnection.close()
        
        dbConnection = engine.connect()
        [req["id"]] = dbConnection.execute("SELECT MAX(id) from available_aircraft").fetchone()
        dbConnection.close()
        
        req["photos_path"] = await saveImagesA(req, photos)
        update = f"update available_aircraft \
            set \
            photos_path = '{req['photos_path']}' \
            where id = {req['id']}"
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()
        return True
    except:
        raise

def updateAvailableAircraft(req):
    try:
        update = f"update available_aircraft \
            set \
            model = '{req['model']}', \
            year = '{req['year']}', \
            company_id = '{req['company_id']}', \
            engines = '{req['engines']}', \
            available = {req['available']}, \
            interior_description = '{req['interior_description']}', \
            exterior_description = '{req['exterior_description']}', \
            additional_equipment = '{req['additional_equipment']}', \
            airframe = '{req['airframe']}', \
            engines = '{req['engines']}', \
            propeller = '{req['propeller']}', \
            maintenance_inspection = '{req['maintenance_inspection']}', \
            avionics = '{req['avionics']}' \
            where id = {req['id']}"
        
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()

        return True
    except:
        raise

def deleteAvailableAircraft(id):
    try:
        delete = f"delete from available_aircraft where id = {id}"
        dbConnection = engine.connect()
        dbConnection.execute(delete)
        dbConnection.close()
        return True
    except:
        raise

async def saveImagesA(req, photos):
    #Fotos internas
    strpath = f"{mypath}/images/{req['company_name']}/available/{req['id']}"
    if os.path.exists(strpath):
        shutil.rmtree(strpath, ignore_errors=True)
    os.makedirs(strpath)
    
    count = 1
    for i in photos:
        try:
            filename, file_extension = os.path.splitext(i.filename)
            filename = f"file_{count}{file_extension}"
        
            
            async with aiofiles.open(f"{strpath}/{filename}", 'wb') as out_file:
                content = await i.read()  # async read
                await out_file.write(content)  # async write
            
            count+=1
        finally:
            i.file.close()
            
    return f"/images/{req['company_name']}/available/{req['id']}"