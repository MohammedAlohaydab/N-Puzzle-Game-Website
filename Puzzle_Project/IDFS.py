from queue import LifoQueue as Stack
from .Node import Node
from .DLFS import DLFS
from .Search import Search
import time
class IDFS(Search):

    pathCost = 0            ##
    numProcessedNodes = 0   ##
    maxStoredNodes = 0      ##
    timeTaken = 0           ##
    searchCanceled = False

    def __init__(self , max_stored=0):
        self.max_stored = max_stored

    def IDFS (self,initial_state):
        search = DLFS()
        d=1
        sol=None
        start = time.time()
        while sol == None and not IDFS.searchCanceled:
            sol = search.DLFS(initial_state,d)
            d= d + 1
        IDFS.timeTaken = time.time() - start
        IDFS.numProcessedNodes=search.numProcessedNodes
        IDFS.maxStoredNodes=search.maxStoredNodes
        IDFS.pathCost = search.pathCost
        return sol
        


        


    
