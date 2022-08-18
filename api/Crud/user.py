from database import engine
import pandas as pd
import bcrypt

def getUserById(id):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from user where id = {id}", dbConnection)
    dbConnection.close()
    if len(df) > 0:
        return df.to_dict("records")[0]
    return False

def getUserByEmail(email):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from user where email = '{email}'", dbConnection)
    dbConnection.close()
    if len(df) > 0:
        return df.to_dict("records")[0]
    return False

def getUserByUsername(username):
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from user where username = '{username}'", dbConnection)
    dbConnection.close()
    if len(df) > 0:
        return df.to_dict("records")[0]
    return False

def getUsers():
    dbConnection = engine.connect()
    df = pd.read_sql(f"select * from user", dbConnection)
    dbConnection.close()
    return df.to_dict("records")

def createUser(user):
    try:
        password = bcrypt.hashpw(user["password"].encode('utf-8'), bcrypt.gensalt()).decode("utf-8")
        insert = f"insert into user(email, username, name, password) \
            values('{user['email']}', '{user['username']}', '{user['name']}', '{password}')"
        dbConnection = engine.connect()
        dbConnection.execute(insert)
        dbConnection.close()
        return True
    except:
        raise

def updateUser(req):
    try:
        password = bcrypt.hashpw(req["password"].encode('utf-8'), bcrypt.gensalt()).decode("utf-8")

        update = f"update user \
            set \
            email = '{req['email']}', \
            name = '{req['name']}', \
            username = '{req['username']}', \
            password = '{password}' \
            where id = {req['id']}"
        
        dbConnection = engine.connect()
        dbConnection.execute(update)
        dbConnection.close()

        return True
    except:
        raise

def deleteUser(id):
    try:
        delete = f"delete from user where id = {id}"
        dbConnection = engine.connect()
        dbConnection.execute(delete)
        dbConnection.close()
        return True
    except:
        raise

def checkUsernamePassword(user):
    dbUser = getUserByUsername(user["username"])
    return bcrypt.checkpw(user["password"].encode('utf-8'), dbUser["password"].encode('utf-8'))