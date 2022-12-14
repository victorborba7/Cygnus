from database import engine
import pandas as pd
import os
import aiofiles
import shutil
import logging

def indexContainingSubstring(the_list, substring):
    for i, s in enumerate(the_list):
        if substring in s:
              return i
    return -1

def treatQuotes(s):
    return s.replace("'", "\\'").replace('"', '\\"')

#mypath = "C:/Users/victorvb2/Documents/Projetos/Cygnus/html"
mypath = "/Cygnus/lp"

def getAircraftById(id):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from aircraft where id = {id}", dbConnection)
    dbConnection.close()
    if len(df) > 0:
        records = df.to_dict("records")[0]
        try:
            records["outside_files"] = os.listdir(mypath + df["photos_path"][0] + "/externo")
            records["inside_files"] = os.listdir(mypath + df["photos_path"][0] + "/interno")
            files = os.listdir(mypath + df["photos_path"][0])
            index_mapa_assentos = indexContainingSubstring(files, "mapa_assentos")
            if index_mapa_assentos >= 0:
                records["mapa_assentos"] = files[index_mapa_assentos]
            else:
                records["mapa_assentos"] = ""
        except:
            pass
        
        return records
    return False

def getAircrafts(company_id):
    dbConnection = engine.connect()
    where = "where first_seen > -1"
    if int(company_id) > 0:
        where = f"{where} and company_id = {company_id}"
    df = pd.read_sql(f"select a.*, c.name as company_name from aircraft a join company c on a.company_id = c.id {where} order by c.name, a.first_seen asc", dbConnection)
    dbConnection.close()
    return df.to_dict("records")

async def createAircraft(req, internos, externos, mapa_assentos = None):
    try:
        select = f"select * from aircraft \
            where company_id = {int(treatQuotes(req['company_id']))} and first_seen >= {int(req['first_seen'])}"
        dbConnection = engine.connect()
        df = pd.read_sql(select, dbConnection)
        dbConnection.close()
        if len(df[df["first_seen"] == int(req['first_seen'])]) > 0:
            for index, row in df.iterrows():
                update = f"update aircraft \
                    set \
                    first_seen = {int(row['first_seen']) + 1} \
                    where id = {row['id']}"
                dbConnection = engine.connect()
                dbConnection.execute(update)
                dbConnection.close()
                
        insert = f"insert into aircraft(model, series, company_id, engine, max_takeoff_weight, \
            first_year_production, tbo, max_capacity, max_cruise_speed, max_range, max_operating_altitude, \
            wingspan, length, max_tail_height, min_takeoff_distance, description, description_en, first_seen) \
            values('{treatQuotes(req['model'])}', '{treatQuotes(req['series'])}', {treatQuotes(req['company_id'])}, '{treatQuotes(req['engine'])}', '{treatQuotes(req['max_takeoff_weight'])}', \
            '{treatQuotes(req['first_year_production'])}', '{treatQuotes(req['tbo'])}', '{treatQuotes(req['max_capacity'])}', '{treatQuotes(req['max_cruise_speed'])}', \
            '{treatQuotes(req['max_range'])}', '{treatQuotes(req['max_operating_altitude'])}', '{treatQuotes(req['wingspan'])}', '{treatQuotes(req['length'])}', '{treatQuotes(req['max_tail_height'])}', '{treatQuotes(req['min_takeoff_distance'])}', \
            '{treatQuotes(req['description'])}', '{treatQuotes(req['description_en'])}', {int(req['first_seen'])})"
        dbConnection = engine.connect()
        dbConnection.execute(insert)
        dbConnection.close()
        
        dbConnection = engine.connect()
        [req["id"]] = dbConnection.execute("SELECT MAX(id) from aircraft").fetchone()
        dbConnection.close()
        
        req["photos_path"] = await saveImages(req, internos, externos, mapa_assentos)
        update = f"update aircraft \
            set \
            photos_path = '{treatQuotes(req['photos_path'])}' \
            where id = {req['id']}"
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()
        return True
    except Exception as e:
        logging.error(str(e))
        return False

def updateAircraft(req):
    try:
        select = f"select * from aircraft \
            where company_id = {int(treatQuotes(req['company_id']))} and first_seen >= {int(req['first_seen'])}"
        dbConnection = engine.connect()
        df = pd.read_sql(select, dbConnection)
        dbConnection.close()
        
        if len(df[df["first_seen"] == int(req['first_seen'])]) > 0:
            for index, row in df.iterrows():
                update = f"update aircraft \
                    set \
                    first_seen = {int(row['first_seen']) + 1} \
                    where id = {row['id']}"
                dbConnection = engine.connect()
                dbConnection.execute(update)
                dbConnection.close()
        
        update = f"update aircraft \
            set \
            model = '{treatQuotes(req['model'])}', \
            series = '{treatQuotes(req['series'])}', \
            company_id = {int(treatQuotes(req['company_id']))}, \
            engine = '{treatQuotes(req['engine'])}', \
            max_takeoff_weight = '{treatQuotes(req['max_takeoff_weight'])}', \
            first_year_production = '{treatQuotes(req['first_year_production'])}', \
            tbo = '{treatQuotes(req['tbo'])}', \
            max_capacity = '{treatQuotes(req['max_capacity'])}', \
            max_cruise_speed = '{treatQuotes(req['max_cruise_speed'])}', \
            max_range = '{treatQuotes(req['max_range'])}', \
            max_operating_altitude = '{treatQuotes(req['max_operating_altitude'])}', \
            wingspan = '{treatQuotes(req['wingspan'])}', \
            length = '{treatQuotes(req['length'])}', \
            max_tail_height = '{treatQuotes(req['max_tail_height'])}', \
            min_takeoff_distance = '{treatQuotes(req['min_takeoff_distance'])}', \
            description = '{treatQuotes(req['description'])}', \
            description_en = '{treatQuotes(req['description_en'])}', \
            first_seen = {int(req['first_seen'])} \
            where id = {req['id']}"
        
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()

        return True
    except Exception as e:
        logging.error(str(e))
        return False

def deleteAircraft(id):
    try:
        delete = f"delete from aircraft where id = {id}"
        dbConnection = engine.connect()
        dbConnection.execute(delete)
        dbConnection.close()
        return True
    except Exception as e:
        logging.error(str(e))
        return False

async def saveImages(req, internos, externos, mapa_assentos = None):
    #Mapa assentos
    if mapa_assentos != None:
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