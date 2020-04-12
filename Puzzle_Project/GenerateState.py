import random,math

class GenerateState(object):

    def __init__(self):
        pass

    def generate(self,size):
        state = random.sample(range(size*size),size*size)
        while not (self.isSolvable(state)):
            state =  random.sample(range(size*size),size*size)

        return state

    def isSolvable(self,state):
        inversion = 0
        gridWidth = int(math.sqrt(len(state)))
        row = 0    
        blankRow = 0 # the row with the blank tile
        for i in range(len(state)):
            if (i % gridWidth == 0):  
                row+=1
            if (state[i] == 0): 
                blankRow = row  
                continue
            for j in range(i+1,len(state)):
                if (state[i] > state[j] and state[j] != 0):
                    inversion+=1

        blankRow = gridWidth-blankRow+1 ## blank row , counting from the bottom
        if (gridWidth % 2 == 0):  
            if (blankRow % 2 == 0):  
                return inversion % 2 != 0
            else :                 
                return inversion % 2 == 0
        
        else: 
            return inversion % 2 == 0




        