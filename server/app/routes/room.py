from flask import Blueprint, request, jsonify
from ..models import Room

room_bp = Blueprint("room", __name__)

@room_bp.route('/room/add', methods=['POST'])
def add_rooms():
    data = request.get_json()

    if "Room" not in data:
        return jsonify({"error": "Missing 'Room' key"}), 400

    rooms = data["Room"]
    added = []
    failed = []

    for r in rooms:
        try:
            room = Room(
                room_id=r[0],
                capacity=int(r[1])  # convert string to int
            )
            room.save()
            added.append(r[0])
        except Exception as e:
            failed.append({"id": r[0], "error": str(e)})

    return jsonify({
        "added": added,
        "failed": failed
    }), 201
