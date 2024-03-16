## Prerequisites

```bash
Node
python3
Docker
```

## Get Started

```
mkdir react-flask-tutorial
cd react-flask-tutorial
```

Create React Project

```bash
npx create-react-app client
cd client
npm start
```

Create Flask project

```bash
mkdir server
cd server
python3 -m venv .venv
. .venv/Scripts/activate
pip install Flask
touch hello.py
```

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

```bash
flask --app hello run
```

```
http://localhost:5000/
```

## Link both app

```bash
pip install flask-cors
```

```python
from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
    
@app.route("/hello", methods=["POST"])
def hello():
    data = request.get_json()
    return {"hello": data["name"]}

```

```javascript
import './App.css';
import {useState} from "react";

function App() {

    const [name, setName] = useState("World");

    return (
        <div className="App">
            <header className="App-header">
                <form onSubmit={(event) => {

                    event.preventDefault();

                    const data = new FormData(event.target);

                    fetch("http://localhost:5000/hello", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: data.get('name')
                        })
                    }).then(response => response.json())
                        .then(data => {
                            setName(data.name);
                        })

                }}>
                    <input name="name" type={"text"}/>
                    <button type={"submit"}>Submit</button>
                </form>
                <p>
                    Hello {name}
                </p>
            </header>
        </div>
    );
}

export default App;
```

Add CRUD and MongoDB

```bash
docker run --env=HOME=/data/db --volume=~/workspace/tailed/workshop/react-flask-tutorial/db:/data/db --volume=/data/configdb --volume=/data/db -p 27017:27017 -d mongo:latest
```

```bash
pip install pymongo
pip install bson
pip install pymongo
```

```python
import datetime
import json

from bson import ObjectId
from flask import Flask
from flask import request
from flask.json.provider import JSONProvider
from flask_cors import CORS
from pymongo import MongoClient


class JSONEncoder(json.JSONEncoder):
    ''' extend json-encoder class'''

    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        if isinstance(o, datetime.datetime):
            return str(o)
        return json.JSONEncoder.default(self, o)


class CustomJSONProvider(JSONProvider):
    def dumps(self, obj, **kwargs):
        return json.dumps(obj, **kwargs, cls=JSONEncoder)

    def loads(self, s: str | bytes, **kwargs):
        return json.loads(s, **kwargs)


app = Flask(__name__)
CORS(app)

app.json = CustomJSONProvider(app)


def get_database():
    # Provide the mongodb atlas url to connect python to mongodb using pymongo
    CONNECTION_STRING = "mongodb://localhost:27017/"

    # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
    client = MongoClient(CONNECTION_STRING)

    # Create the database for our example (we will use the same database throughout the tutorial)
    return client['demo']


dbname = get_database()

collection_name = dbname["users"]


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/hello", methods=["POST"])
def hello():
    data = request.get_json()
    return {"hello": data["name"]}


@app.route("/users", methods=["GET"])
def get_users():
    users = list(collection_name.find())
    return users


@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    user = collection_name.insert_one(data)
    data["_id"] = user.inserted_id
    return data


@app.route("/users/<id>", methods=["DELETE"])
def delete_user(id):
    collection_name.delete_one({"_id": ObjectId(id)})
    return {"message": "User deleted"}


@app.route("/users/<id>", methods=["PUT"])
def update_user(id):
    data = request.get_json()
    collection_name.update_one({"_id": ObjectId(id)}, {"$set": data})
    data["_id"] = id
    return data
```

```javascript

import './App.css';

import {useEffect, useState} from "react";

function App() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/users")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUsers(data);
            })
    }, []);

    return (
        <div className="App">
            <header className="App-header">
                <form onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.target);
                    fetch("http://localhost:5000/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: data.get('name')
                        })
                    }).then(response => response.json())
                        .then(data => {
                            console.log("create", users, data);
                            setUsers([...users, data]);
                        })
                }}>
                    <input name="name" type={"text"}/>
                    <button type={"submit"}>Create User</button>
                </form>
                <ul>
                    {users.map((user, index) => {
                        return <li key={index}>
                            {user.name}
                            <button onClick={() => {
                                console.log("delete", user._id);
                                fetch(`http://localhost:5000/users/${user._id}`, {
                                    method: "DELETE"
                                }).then(() => {
                                    setUsers(users.filter(u => u._id !== user._id));
                                })
                            }}>Delete</button>
                            <form onSubmit={(event) => {
                                event.preventDefault();
                                const data = new FormData(event.target);
                                console.log("update", user);
                                fetch(`http://localhost:5000/users/${user._id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        name: data.get('name')
                                    })
                                }).then(response => response.json())
                                    .then(data => {
                                        console.log("update", users, data);
                                        setUsers(users.map(u => {
                                            if (u._id === user._id) {
                                                return data;
                                            }
                                            return u;
                                        }));
                                    })
                            }}>
                                <input name="name" type={"text"}/>
                                <button type={"submit"}>Update</button>
                            </form>
                        </li>
                    })}
                </ul>
            </header>
        </div>
    );
}

export default App;
```

Install Tailwind

```bash
npm install -D tailwindcss
npx tailwindcss init
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```


```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```jsx
// container    className={"bg-zinc-800 min-h-[100vh] flex flex-col items-center justify-center gap-5 text-white"}
// button green className={"bg-green-700 hover:bg-green-800 rounded p-2"}
// button red   className={"bg-red-500 hover:bg-red-600 rounded p-2"}
// button blue  className={"bg-blue-500 hover:bg-blue-600 rounded p-2"}
// li           className={"flex flex-col gap-2 border rounded p-5 ml-3"}
// input        className={"rounded bg-zinc-600 p-2"}
```

```javascript

import './App.css';

import {useEffect, useState} from "react";

function App() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/users")
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setUsers(data);
            })
    }, []);

    return (
        <div className="App">
            <header className={"bg-zinc-800 min-h-[100vh] flex flex-col items-center justify-center gap-5 text-white"}>
                <form className={"flex gap-2"} onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.target);
                    fetch("http://localhost:5000/users", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            name: data.get('name')
                        })
                    }).then(response => response.json())
                        .then(data => {
                            console.log("create", users, data);
                            setUsers([...users, data]);
                        })
                }}>
                    <input name="name" type={"text"} className={"bg-zinc-600 rounded p-2"}/>
                    <button type={"submit"} className={"bg-green-700 hover:bg-green-800 rounded p-2"}>Create User</button>
                </form>
                <ul>
                    {users.map((user, index) => {
                        return <li key={index} className={"flex flex-col gap-2 border rounded p-5 ml-3"}>
                            <div className={"flex items-center gap-2"}>
                                <p className={"text-2xl"}>{user.name}</p>
                                <button className={"bg-red-500 hover:bg-red-600 rounded p-2"} onClick={() => {
                                    console.log("delete", user._id);
                                    fetch(`http://localhost:5000/users/${user._id}`, {
                                        method: "DELETE"
                                    }).then(() => {
                                        setUsers(users.filter(u => u._id !== user._id));
                                    })
                                }}>Delete
                                </button>
                            </div>
                            <form className={"flex gap-2"} onSubmit={(event) => {
                                event.preventDefault();
                                const data = new FormData(event.target);
                                console.log("update", user);
                                fetch(`http://localhost:5000/users/${user._id}`, {
                                    method: "PUT",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({
                                        name: data.get('name')
                                    })
                                }).then(response => response.json())
                                    .then(data => {
                                        console.log("update", users, data);
                                        setUsers(users.map(u => {
                                            if (u._id === user._id) {
                                                return data;
                                            }
                                            return u;
                                        }));
                                    })
                            }}>
                                <input name="name" type={"text"} className={"rounded bg-zinc-600 p-2"}/>
                                <button type={"submit"} className={"bg-blue-500 hover:bg-blue-600 rounded p-2"}>Update</button>
                            </form>
                        </li>
                    })}
                </ul>
            </header>
        </div>
    );
}

export default App;
```