from flask import Blueprint, jsonify
from ..controllers.scheduler1 import SchedulerController  # Adjust if file path differs

schedule_bp = Blueprint("schedule", __name__)

@schedule_bp.route('/schedule/generate', methods=['GET'])
def generate_schedule():
    controller = SchedulerController()
    success = controller.generate_schedule()

    if not success:
        return jsonify({"error": "Failed to generate schedule"}), 500

    # Send the room-wise JSON format
    schedule_json = controller.get_schedule_json_by_room()
    return jsonify(schedule_json), 200
