from flask import redirect, Flask, render_template, request, jsonify
from functions import generate_unique_id, set_voting, check_if_unique_id_is_valid, add_vote, get_poll_results
from datetime import timedelta, datetime
import time

app = Flask(__name__, static_folder="../frontend",
            template_folder="../frontend/temps")

UNIQUE_ID_LENGTH = 11


@app.route("/")
def homepage():
    return render_template("homepage.html", js_file="index.js")


@app.route("/create", methods=["POST"],)
def create_new_voting():
    try:

        if request.is_json:

            ms = int(time.time() * 1000)

            print(ms, type(ms))
            print("it's json")
            data = request.get_json()
            question = data["question"]
            options = data["options"]
            print("yay ops", options)
            if isinstance(options, list) and options != [] and isinstance(question, str) and question != "":

                unique_id = generate_unique_id(UNIQUE_ID_LENGTH)
                set_voting(unique_id, question, options,
                           ms, UNIQUE_ID_LENGTH)
                return jsonify({"status": "success", "message": "created new poll successfly!", "unique_id": unique_id}), 200
            return jsonify({"status": "fail", "message": "Invalid sent data"}), 400

        return jsonify({"status": "fail", "message": "Expected JSON"}), 415
    except Exception as e:
        print("error new voting ", e)
        return jsonify({"status": "fail", "message": "server internal error"}), 500


@app.route("/new_vote", methods=["POST"])
def add_a_new_vote():
    try:
        if request.is_json:
            data = request.get_json()

            unique_id = data["unique_id"]
            vote = data["vote"]
            voting = check_if_unique_id_is_valid(unique_id)
            if not voting:
                return jsonify({"status": "fail", "message": "invalid poll"}), 404
            add_vote(unique_id, vote)
            # MUST NOT be inside an (if statment) or else.... it will cause a Typeerror.
        return jsonify({"status": "success", "message": "added a new vote"}), 200

    except Exception as e:
        print("adding new vote error", e)
        return jsonify({"status": "fail", "message": "server internal error"}), 500


@app.route("/get_info", methods=["POST"])
def get_info():
    try:
        if not request.is_json:
            return jsonify({"status": "fail", "message": "Expected JSON"}), 415
        data = request.get_json()
        unique_id = data["unique_id"]
        info = check_if_unique_id_is_valid(unique_id)
        del info["_id"]

        return jsonify({"status": "success", "message": "got info and intel successfly", "intel_info": info}), 200

    except Exception as e:
        print("gathering info and intel error", e)
        return jsonify({"status": "fail", "message": "server internal error"}), 500

# this will catch everything for unique ids


@app.route("/poll/<unique_id>/new_vote",)
def catch_everything_votes(unique_id):
    try:
        checking = check_if_unique_id_is_valid(unique_id)

        if not checking:
            print("bad")
            return render_template("error.html", error_reason="page not found".capitalize()), 404

        return render_template("votingform.html", unique_id=unique_id, js_file="votingform.js")
    except Exception as e:
        print("catching everything", e)
        return render_template("error.html", error_reason="something went wrong".capitalize(), js_file="error.js"), 500


@app.route("/poll/<unique_id>/results",)
def catch_everything_results(unique_id):
    try:
        checking = check_if_unique_id_is_valid(unique_id)
        print("is checking", checking)
        if not checking:

            return render_template("error.html", error_reason="page not found".capitalize()), 404

        return render_template("results.html", unique_id=unique_id, js_file="results.js")
    except Exception as e:
        print("catching everything", e)
        return render_template("error.html", error_reason="something went wrong".capitalize(), js_file="error.js"), 500


@app.route("/poll_results", methods=["POST"])
def getting_results():
    try:
        if not request.is_json:
            return jsonify({"status": "fail", "message": "Expected JSON"}), 415
        data = request.get_json()
        unique_id = data["unique_id"]
        info = check_if_unique_id_is_valid(unique_id)

        if not info:
            return jsonify({"status": "fail", "message": "No poll found with this id"}), 404
        results = get_poll_results(unique_id)

        return jsonify({"status": "success", "message": "got poll results successfly", "results": results}), 200
    except Exception as e:
        print("error in results", e)
        return jsonify({"status": "fail", "message": "server internal error".title()}), 500


@app.errorhandler(404)
def page_not_found(e):
    return render_template('error.html', error_reason="page not found".capitalize()), 404


if __name__ == "__main__":
    app.run(port=3000, debug=True)
# I am planning on adding unit tests to this thing
