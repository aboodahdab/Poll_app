# Poll website
### This is a poll website that allows users to make polls, and vote for them.
## Tech stack:
### Backend:Python
### Frontend:HTML,CSS,JS
### DB:MongoDB
### Framework:Flask
## How to run:
## How to setup tailwind ClI:
### First go to frontend using ```cd frontend```
### Next install and activate Tailwindcss's CLI using ```npx @tailwindcss/cli -i ./css/style.css -o ./css/output.css --watch```
## How to run backend:
### First go to the project's folder using ```cd voting-app``` in the cmd
### Then go to the backend folder using ```cd backend``` in the cmd
### After that make a virtual environment using ```python3 -m venv venv```
### Next activate it using ```source venv/bin/activate```
### Then download required libraries using ```pip install -r requirements.txt```
### After that run the main.py file with ```python3 main.py```
### Finally open your browser to http://localhost:3000/
## Checklist:
- [x] Implement votings and new_vote page
- [x] Implement results and results page
- [x] Implement notifications in new pages (new_vote and results)
- [x] Implement the error page (page not found)
- [x] Implement time in polls
- [x] Write a readable README
- [ ] Implement unit tests
- [ ] Make notifications swipe
- [ ] Make the design responsive
