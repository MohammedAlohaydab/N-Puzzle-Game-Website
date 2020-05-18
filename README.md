# N-Puzzle Game

The N-puzzle problem consists of a puzzle composed by (n x n) - 1 tiles, numbered from 1 to n^2– 1. The last position that would define the squared form of the puzzle is an empty space.

In this game you can solve the puzzle and when you get in stuck, ask our agent to solve it since this project was intentionally programmed to solve the N-puzzle problem with artificial inelegance algorithms,  four uninformed searches (Breadth-First Search, Depth-First Search, Iterative Deepening Search and Depth Limited Search ) and two informed searches (Greedy Search and A* Search) were developed


 Checkout the [website](http://npuzzle.pythonanywhere.com/)

<img src="/Puzzle_Project/static/media/website.png" alt="webiste screenshot" style="text-align: center;" width="650" >


## Running the Project Locally

First, clone the repository to your local machine:

```bash
git clone https://github.com/mohammedib/NPuzzle-Game-Website.git
```

Install the requirements:

```bash
pip install -r requirements.txt
```

Finally, run the development server:

```bash
python manage.py runserver
```

The project will be available at **127.0.0.1:8000**.
