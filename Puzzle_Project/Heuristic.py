import numpy as np
import math


def LinearConflict(start, goal):
    size  = int(math.sqrt(len(start))) 
    
    start = np.reshape(np.array(start), (size, size))
    goal  = np.reshape(np.array(goal),  (size, size))
    temp  = 0

    for i in range(0, size):
        for j in range(0, size):
            if start[i][j] != 0 and start[i][j] != goal[i][j] and (start[i][j] in goal[i:] or start[i][j] in goal[:j]):
                temp += 1
    return temp

def ManhattanDistance(start, goal):

    size  = int(math.sqrt(len(start)))
    start = np.reshape(np.array(start), (size, size))
    goal  = np.reshape(np.array(goal),  (size, size))
    temp  = 0

    for i in range(0, size):
        for j in range(0, size):
            if start[i][j] != goal[i][j] and start[i][j] != 0:
                temp += 1
    return temp

# Calculates the heuristic cost from the current state to the goal state.
def h(start, goal):
    return ManhattanDistance(start, goal) + LinearConflict(start, goal)
    

# Calculates the actual accumulative cost from the start to the current state.
def g(state):
    return state.depth

# Calculates the actual accumulative cost from the start to the current state
# Plus the heuristic cost from the current state to the goal state.
def f(node):
    return h(node.state, node.goal_state()) + g(node)


