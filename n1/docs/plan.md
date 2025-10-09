# Challenge Solution

- [ ] Clean up code and post on github
- [ ] research killer crypto use cases and how you can contribute the N1 team.
- [ ]
---

Level Exploration:
- Levels: 1 - 249
	- No Walls
	- Size Range: 5 - **45**
- Levels: 250 - 1000
	- Has Walls
	- Size Range: 5 - 45

---
## Approach 1

- [x] Write a script to get all the levels and put them in a levels.json.
- [x] Write a script to solve all the levels and put all the solutions in a JSON File.
- Write a bot to input all the solutions
	- Load all solutions into memory
	- for each puzzle load the right answer
---
# Notes
## **Approximate Max Solutions File Size**
Max Amount of solutions is a little more than 2 MB, so it's feasible to load all of them into memory.
Max solution size is 2025 character (if utf-8 encoding and only using WASD, each character is 1 byte)
2025 bytes * 1000 puzzles
2025000 bytes = 2.025 MB

## **Prompt for levels.json building script**
write a script to query a webapi to build a file called levels.json.

### The Script
The script should be written 3 times, once in each of the following languages: Python, Rust, and Deno.
When writing the Python version use type annotations.
When writing the Deno version use Typescript, and types.

### The API
The API's url is "https://jobbo-api.n1.xyz/api/game/766ebb4d-289f-4038-9fa9-59db2c66693d/board?level={n}".
The {n} is a placeholder for the level number, which is between 1 and 1000 inclusive.
Each call returns a single json object with the formate like the following
{"board":[[".",".",".",".","."],[".",".","P",".","."],[".","A",".",".","."],[".",".",".",".","."],[".",".",".",".","."]],"level":1,"boardSize":5,"playerPosition":{"x":2,"y":1},"applePosition":{"x":1,"y":2},"walls":[],"moves":0,"totalMoves":0,"timeLeft":60,"gameStarted":false,"gameComplete":false,"sessionExpired":false}

### The File
levels.json's path relative to the scripts project folder is ../doc/levels.json
levels.json format will be:
```JSON
{
"{level number}": {/unformatted json object returned form api/},
"1": {"board":[[".",".",".",".","."],".",".","P",".","."],".","A",".",".","."],".",".",".",".","."],".",".",".",".","."]],"level":1,"boardSize":5,"playerPosition":{"x":2,"y":1},"applePosition":{"x":1,"y":2},"walls":,"moves":0,"totalMoves":0,"timeLeft":60,"gameStarted":false,"gameComplete":false,"sessionExpired":false}
}
```

The final version of the script can be seen the `n1-level-scraper` repo

## **Solving The Mazes**
### Prompt For Algorithm Selection
We're going to write a rust program ment solve mazes and store the solutions in a json file. The first step we'll take is selecting a maze solving algorithm based on the conditions of the problem.

An example of the levels is in the `sample_levels.json` file uploaded. The program will load levels in from a json file similar to it.
The original problem statement is in the `prompt.md` file uploaded.

The Following my added context:
Your (the player's) starting position, position of the apple, position of all walls, and maze in it's starting state.

The maze is a 2 dimensional array of single characters. "." represent free space, "P" represents the player, "W" represents the walls. An example maze is given below.

```JSON
[
  ["W","W","W","W","W"],
  ["W","W","P","W","W"],
  ["W","A",".",".","W"],
  ["W","W","W","W","W"],
  ["W","W","W","W","W"]
]
```

Solutions are string composed of only WASD characters. Each character presents a single step in a direction taken by the player. "W" - up, "A" - left, "S" - down, "D" - right. An example solution is shown below.

```JSON
"DW"
```


The algorithm should prioritize creating the shortest route possible between the player and the apple.

What algorithms make sense for this problem?


each solution is a string of WASD characters, representing the single steps needed to be taken to


Simple solution calculate the line between the player and the apple, then move in that direction until you reach the apple. If there are walls in the way, you will need to find a path around them.


I would have never known how to solve this without cheating

### Strategy
Start with BFS, on the largest mazes then use A* if you need a different
