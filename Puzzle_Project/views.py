from django.shortcuts import render,reverse,HttpResponse
from .AStarAlgo import AStarAlgo
from .BFS import BFS
from .DFS import DFS
from .GreadySearch import GreadySearch
from .IDFS import IDFS
from .DLFS import DLFS
from .GenerateState import GenerateState
from django.contrib import messages
from django.http import JsonResponse
from .Node import Node
from .Search import Search
import json




def Home_Page(request):
   
    return render(request,"indexP.html",{"solution":None})

def game_random(request,size,algorithm):

    
    return render(request,"custom.html",{"size":size,"algorithm":algorithm})

def isSolvable(request):
    flag= False
    if request.method == 'POST':
        state = list(json.loads(request.POST["state"]))
        obj = GenerateState()
        flag = obj.isSolvable(state)
    
    response_data = {}
    response_data['flag'] = flag
   
    return JsonResponse(response_data)

def setNodeZero(request):
    if request.method == 'POST':
        obj = Node(None,None,None,None)
        obj.setProcessedZero()
    response_data = {}
    response_data['flag'] = True
   
    return JsonResponse(response_data)

def check_goal_test(request):
    if request.method== 'POST':
        state = list(json.loads(request.POST["state"]))
        obj = Node(state,None,None,None)
        flag = obj.goal_test().all()
    response_data = {}
    if(flag):
        response_data['flag'] = True
    else:
         response_data['flag'] = False

   
    return JsonResponse(response_data)


def generate_random_state(request):
    if request.method== 'POST':
        size = request.POST['size']
        obj = GenerateState()
        state = obj.generate(int(size))
       
    response_data = {}
    response_data['state'] = state
    return JsonResponse(response_data)


def solution(request):
    if request.method == 'POST':
        response_data = {}
        canceled = int(request.POST["cancelSearch"])
     
        if not canceled:
            setCanceledSearch(False)
            state = list(json.loads(request.POST["state"]))
            algorithm = request.POST["algorithm"]
            depth = int(request.POST["depth"])  
        
            if algorithm == "AStar":
                obj = AStarAlgo()
                sol=obj.a_star_algorithm(state)
            elif algorithm == "BFS":
                obj = BFS()
                sol=obj.BFS(state)
            elif algorithm == "DFS":
                obj = DFS()
                sol=obj.DFS(state)
            elif algorithm == "GS":
                obj = GreadySearch()
                sol=obj.gready_search_algorithm(state)
            elif algorithm == "IDFS":
                obj = IDFS()
                sol=obj.IDFS(state)
            elif algorithm == "DLFS":
                obj = DLFS()
                sol=obj.DLFS(state,depth)
            
            response_data['solution'] = sol
            response_data['path_cost'] = obj.pathCost
            response_data['processed_nodes'] =obj.numProcessedNodes
            response_data['max_stored'] = obj.maxStoredNodes
            response_data['time_taken'] = obj.timeTaken

        else: # cancel search
            setCanceledSearch(True)
            response_data['canceled']= 1
             
    return JsonResponse(response_data)



                
def setCanceledSearch(flag):
    AStarAlgo.searchCanceled = flag
    BFS.searchCanceled = flag
    DFS.searchCanceled = flag
    GreadySearch.searchCanceled = flag 
    IDFS.searchCanceled = flag  
    DLFS.searchCanceled = flag 
    
    

    
   

   