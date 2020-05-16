from queue import Queue as Queue
from .Node import Node
from collections import deque as Queue
from .Search import Search
import time
class BFS(Search):

    pathCost = 0
    numProcessedNodes = 0
    maxStoredNodes = 0
    timeTaken = 0
    searchCanceled = False
    def __init__(self,max_stored = 0):
        self.max_stored = max_stored
  

    def BFS(self,initial_state):   
        start_node = Node(initial_state, None, None, 0)
        Node.num_processed=0
        start = time.time()         ##
        if start_node.goal_test().all():
            return start_node.find_solution()

        frontier = Queue() ## List Stack
        frontier.append(start_node)
        explored = set() 
        while not ( len(frontier) == 0 ):
            if BFS.searchCanceled : 
                print("canceled!")
                return
            self.max_stored = max(self.max_stored ,len(frontier) + len(explored)) ##
            node = frontier.popleft()
            if node.goal_test().all():
                print("***************GOAL STATE FOUND*******************")
                print("\n")
                print(node.display())
                BFS.pathCost=node.depth                   ##
                BFS.maxStoredNodes=self.max_stored        ##
                BFS.numProcessedNodes=node.num_processed  ##
                BFS.timeTaken = time.time() - start       ##
                return node.find_solution()
         
            explored.add(tuple(node.state))
            children = node.generate_child()
            for child in children:
                if BFS.searchCanceled :
                    print("canceled!")
                    return
                if tuple(child.state) not in explored:
                        frontier.append(child)
                        explored.add(tuple(child.state))

                        

        return
