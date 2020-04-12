from abc import ABC, abstractmethod 

class Search(ABC):

    @property
    @abstractmethod
    def pathCost(self):
        pass
    
    @property
    @abstractmethod
    def numProcessedNodes(self):
        pass

    @property
    @abstractmethod
    def maxStoredNodes(self):
        pass

    @property
    @abstractmethod
    def timeTaken(self):
        pass