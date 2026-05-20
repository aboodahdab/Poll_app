import string
import secrets
import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = client["poll-app"]
mycol = mydb["polls-and-votes"]


def generate_unique_id(length):
    whole_string = string.ascii_letters+string.digits
    return "".join(secrets.choice(whole_string) for _ in range(length))


def check_if_unique_id_is_valid(unqiue_id):
    voting_id = mycol.find_one({"voting_id": unqiue_id})
    return voting_id


def set_voting(unique_id, vote_name, options, date, length):
    print("ops options", options)
    votes_query = {}
    for i in options:
        UUID = generate_unique_id(length)
        votes_query[UUID] = {"title": i, "count": 0}
    query = {"voting_id": unique_id, "voting_name": vote_name,
             "voting_options": options, "votes": votes_query, "date": date}
    mycol.insert_one(query)


def add_vote(unique_id, vote):
    print("whyyyyy cats")

    find_one = check_if_unique_id_is_valid(unique_id)
    votes = find_one.get("votes", {})

    print(vote in votes, votes)

    if vote in votes:
        print("well")
        option = votes[vote]
        count = option["count"]
        count += 1
        print(votes[vote], count)

    mycol.update_one({"voting_id": unique_id}, {
                     "$set": {f"votes.{vote}.count": count}})


def get_poll_results(voting_id):
    poll = mycol.find_one({"voting_id": voting_id})
    votes = poll["votes"]
    print(poll, votes)
    return votes
