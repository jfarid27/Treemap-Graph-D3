function treemapGraphD3(d3){

    var exports = function(){
        return
    }

    var hierarchicalCluster = function(graph, edgeLinkSelector, 
        edgeComparator, edgesAttached, normalizeEdges){
      
        var nodeRoot = {};
        
        graph.nodes.map(function(node){
            nodeRoot[node.id.toString()] = node;
        });
        
        var edgesList = Object.create(graph.edges);
        
        while (Object.keys(nodeRoot).length > 1){
        
            var mergingNodes = edgeLinkSelector(edgesList, edgeComparator);
        
            var edgesLinkedToMerging = edgesAttached(edgesList, mergingNodes)
                .filter(function(edge){
                    return !( 
                        (edge.source == mergingNodes[0] && edge.target == mergingNodes[1]) ||
                        (edge.source == mergingNodes[1] && edge.target == mergingNodes[0]) )
                })
        
            //build new edge table using tournament
            var newNodeId = exports.randomId()
            newEdges = normalizeEdges(edgesLinkedToMerging, mergingEdges, newNodeId)
                .filter(function(edge){
                    return !(edge.source == edge.target)
                })

            //make new node

            var newNode = {
                id:randomId(), 
                children: mergingNodes.map(function(index){
                    return Object.create(nodeRoot[index])
                })
            };

            //delete old nodes
             mergingNodes.map(function(index){
                 delete nodeRoot[index]
             });

            //add new node to nodeRoot
            nodeRoot[newNode.id] = newNode;

            //delete edges that link to old node
            edgesList = edgesList.filter(function(edge){
                
                //if edge is collapsing edge remove
                if (mergingNodes.indexOf(edge.source.toString()) >= 0 && 
                    mergingNodes.indexOf(edge.target.toString()) >= 0 ) {
                    return false
                }
                //if edge is linked to a merging edge, remove
                if (mergingNodes.indexOf(edge.source.toString()) >= 0 || 
                    mergingNodes.indexOf(edge.target.toString()) >= 0 ) {
                    return false
                }
                
                //else keep
                return true
            }).concat(newEdges)           
         }; // End loop

        //Return nodeRoot
        return nodeRoot[Object.keys(nodeRoot)[0]]
        
        
    }; // End function

    var removeEdgeFromEdges = function(Edges, Edge){
        //Returns Edges that do not match Edge
        // :: Edges, Edge -> Edges
            return Edges.filter(function(edge){
                if (edge.source == Edge.source 
                    && edge.target == Edge.target){
                        return false 
                }
                return true
            })
    }

    var edgesAttached = function(Edges, Ids, edgeAttachedToNode){
        //Returns edges that are attached to specified nodes through Ids
        // :: Edges, Ids, edgeAttachedToNode -> Edges
        return Edges.filter(function(edge){

            return Ids.map(function(id){
                return edgeAttachedToNode(id, edge)
            })
            .reduce(function(statement, bool){
                return statement || bool
            }, false)

        })

    }

    var edgeComparator = function(edge1, edge2){
        //Returns true if edge1 is greater than edge2
        // :: Edge | Null, Edge | Null -> Boolean | Null
        if (!edge1 || !edge2){
            return edge1 ? true :  
                    edge2 ? false : null 
        }
        return edge1.value > edge2.value
    }

    var edgeAttachedToNode = function(Id, Edge){
        //Returns true if edge is linked to node with specified Id
        // :: Id, Edge -> Boolean

        if (Edge.source == Id || Edge.target == Id){
            return true
        }
        return false

    }

    var edgeLinkSelector = function(Edges, Comparator){
        //Returns list of Ids to merge after given Edges and Comparator
        // :: Edges, Comparator -> [Id, Id]
        var winner = Edges.reduce(function(leader, next){
            if (Comparator(leader, next)){
                return leader
            }
            return next
        }, null)
        return [winner.source, winner.target]
    }

    var normalizeEdges = function(Edges, Ids, newId){
        //Returns list of edges with newId replacing Ids
        // :: Edges, Ids, Id -> Edges

        return Edges.map(function(edge){
            return {
                'source': (Ids.indexOf(edge.source) > -1) ? newId : edge.source,
                'target': (Ids.indexOf(edge.target) > -1) ? newId : edge.target,
                'value': edge.value
            }
        })
    }

    var removeSelfArcs = function(Edges){
        //Returns Edges with all self arcs removed
        // :: Edges -> Edges
        
        return Edges.filter(function(edge){
            return !(edge.source == edge.target)
        })

    }

    var mergeSimilarEdges = function(Edges, linkageStrategy){
        //Returns Edges with all similar edges condensed with values specified
        //  by linkageStrategy
        //  :: Edges, linkageStrategy -> Edges

        return Edges.reduce(function(checked, next){

            var nonMatching = checked.filter(function(edge){
                return !(edge.source == next.source && 
                    edge.target == next.target)
            })

            var matching = checked.filter(function(edge){
                return (edge.source == next.source && 
                    edge.target == next.target)
            })

            if (matching){
                matching[0]
                    .value = linkageStrategy(matching.value, next.value)
            } 

            return nonMatching.concat(matching)
            
        }, [])

    }

    exports.mergeSimilarEdges = function(){
        if (arguments.length > 0){
            mergeSimilarEdges = arguments[0]
            return exports
        }
        return mergeSimilarEdges 
    }

    exports.removeSelfArcs = function(){
        if (arguments.length > 0){
            removeSelfArcs = arguments[0]
            return exports
        }
        return removeSelfArcs 
    }

    exports.normalizeEdges = function(){
        if (arguments.length > 0){
            normalizeEdges = arguments[0]
            return exports
        }
        return normalizeEdges
    }

    exports.edgesAttached = function(){
        if (arguments.length > 0){
            edgesAttached = arguments[0]
            return exports
        }
        return edgesAttached
    }

    exports.edgeAttachedToNode = function(){
        if (arguments.length > 0){
            edgeAttachedToNode = arguments[0]
            return exports
        }
        return edgeAttachedToNode
    }

    exports.edgeComparator = function(){ 
        if (arguments.length > 0){
            edgeComparator = arguments[0]
            return exports
        }
        return edgeComparator
    }

    exports.removeEdgeFromEdges = function(){
        if (arguments.length > 0){
            removeEdgeFromEdges = arguments[0]
            return exports
        }
        return removeEdgeFromEdges
    }

    exports.edgeLinkSelector = function(){
        if (arguments.length > 0){
            edgeLinkSelector = arguments[0]
            return exports
        }
        return edgeLinkSelector
    }

    return exports

}

if (exports){
    module.exports = treemapGraphD3
}
