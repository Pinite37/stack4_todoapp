from flask import Flask, jsonify, request
from flask_pymongo import PyMongo
from bson.objectid import ObjectId
from flask_cors import CORS

app = Flask(__name__)
app.config['MONGO_URI'] = "mongodb+srv://pinite:renaissance2003@cluster0.xiqtf5b.mongodb.net/yourdbname"
mongo = PyMongo(app)
CORS(app)

@app.route('/api/todos', methods=['GET'])
def get_todos():
    todos = list(mongo.db.todos.find())
    for todo in todos:
        todo['_id'] = str(todo['_id'])
        if 'completed' not in todo:
            todo['completed'] = False
    return jsonify(todos)

@app.route('/api/todo', methods=['POST'])
def create_todo():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    if title:
        result = mongo.db.todos.insert_one({'title': title, 'description': description, 'completed': False})
        todo_id = str(result.inserted_id)
        return jsonify({'_id': todo_id, 'title': title, 'description': description, 'completed': False}), 201
    return jsonify({'error': 'Le Titre est requis'}), 400

@app.route('/api/todo/<string:todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    completed = data.get('completed')

    if title is None and description is None and completed is None:
        return jsonify({'error': 'Aucune mise à jour fournie'}), 400

    update = {'$set': {}}
    if title:
        update['$set']['title'] = title
    if description:
        update['$set']['description'] = description
    if completed is not None:
        update['$set']['completed'] = completed

    result = mongo.db.todos.update_one({'_id': ObjectId(todo_id)}, update)
    if result.matched_count:
        todo = mongo.db.todos.find_one({'_id': ObjectId(todo_id)})
        todo['_id'] = str(todo['_id'])
        if 'completed' not in todo:
            todo['completed'] = False
        return jsonify(todo)
    return jsonify({'error': 'Tâche non trouvée'}), 404

@app.route('/api/todo/<string:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    result = mongo.db.todos.delete_one({'_id': ObjectId(todo_id)})
    if result.deleted_count:
        return jsonify({'message': 'Tâche supprimée'})
    return jsonify({'error': 'Tâche non trouvée'}), 404

if __name__ == '__main__':
    app.run(debug=True)