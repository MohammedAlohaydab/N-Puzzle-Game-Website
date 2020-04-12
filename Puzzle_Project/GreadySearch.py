from .Node import Node as Node
import heapq as heapq
from Puzzle_Project import Heuristic
import time
from .Search import Search
class GreadySearch(Search):

    pathCost = 0
    numProcessedNodes = 0
    maxStoredNodes = 0
    timeTaken = 0

    def __init__(self, max_stored=0):
        self.max_stored = max_stored

    def gready_search_algorithm(self, initial_state):
        start_node = Node(initial_state, None, None, 0)
        number_nodes = 0
        start = time.time()
        if start_node.goal_test().all():
            return start_node.find_solution()

        frontier = []
        # heapq.heappush(frontier,(Heuristic.f(start_node),number_nodes,start_node))
        # frontier.push(start_node, frontier.h(start_node.state, start_node.goal_state()))
        heapq.heappush(frontier, (Heuristic.h(start_node.state, start_node.goal_state()), number_nodes, start_node))

        number_nodes += 1
        explored=set()
        star="**********************************"
        print("\nInitial State ---------- Depth: {0}".format(start_node.depth))
        while frontier:
            self.max_stored=max(self.max_stored, len(frontier)+len(explored))
            v=heapq.heappop(frontier)
            node=v[-1]
            print("--------------------------------------------------")
            if node.goal_test().all():
                print("***************GOAL STATE FOUND*******************")
                print("\n")
                print(node.display())
                GreadySearch.pathCost=node.depth
                GreadySearch.maxStoredNodes=self.max_stored
                GreadySearch.numProcessedNodes=node.num_processed
                GreadySearch.timeTaken=time.time() - start
                return node.find_solution()

            # print("Depth = {0} \n".format(node.depth))
            # print("{0}".format(node.display()))
            # print(star)
            explored.add(tuple(node.state))
            children=node.generate_child()
            for child in children:
                if tuple(child.state) not in explored:
                    heapq.heappush(frontier, (Heuristic.h(
                        child.state, child.goal_state()), number_nodes, child))
                    number_nodes += 1
        return

