function treemapGraphD3(d3){

    var exports = function(graph, selection){

        var self = this

        return hierarchicalCluster(graph, mergeSimilarEdges, 
        linkageStrategy, edgeLinkSelector, edgeComparator, normalizeEdges, 
        randomId, removeSelfArcs, mergeNodes)
    }

    var hierarchicalCluster = function(graph, mergeSimilarEdges, 
        linkageStrategy, edgeLinkSelector, edgeComparator, normalizeEdges, 
        randomId, removeSelfArcs, mergeNodes){

        //Generate associative array for nodes
        var nodeRoot = graph.nodes.reduce(function(nodeRoot, node){
            nodeRoot[node.id.toString()] = node;
            return nodeRoot
        }, {})

        var edgesList = graph.edges
       
        while (Object.keys(nodeRoot).length > 1){
        
            var mergingNodeIds = edgeLinkSelector(edgesList, edgeComparator);

            var newNodeId = randomId()

            edgesList 
                = mergeSimilarEdges(
                    removeSelfArcs(
                        normalizeEdges(
                            edgesList, mergingNodeIds, newNodeId))
                , linkageStrategy)

            nodeRoot = mergeNodes(mergingNodeIds, nodeRoot, newNodeId)

         } // End loop

        //Return nodeRoot
        return nodeRoot[Object.keys(nodeRoot)[0]]
        
        
    }; // End function

    var mergeNodes = function(Ids, nodeRoot, newId){
        //Returns nodeRoot with given node ids merged into a node with id
        //specified by newId
        // Ids, NodeRoot, Id -> NodeRoot

        nodeRoot[newId] = {
            id: newId, 
            children: Ids.map(function(id){
                return nodeRoot[id]
            })
        }

        return Ids.reduce(function(nodeRoot, id){
            delete nodeRoot[id]
            return nodeRoot
        }, nodeRoot)
    }

    var removeEdgesLinkedToNode = function(Edges, Id){
        //Returns Edges that are not connected to node specified by Id
        // :: Edges, Id -> Edges
            return Edges.filter(function(edge){
                if (edge.source == Id 
                    || edge.target == Id){
                        return false 
                }
                return true
            })
    }

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
        //  :: Edges -> Edges

        return Edges.reduce(function(checked, next){

            if (checked.length == 0){
                return [next]
            }

            var edgesThat = checked.reduce(function(edgesThat, edge){

                if (!(edge.source == next.source && 
                    edge.target == next.target)){
                    edgesThat.dontMatch.push(edge)
                } else {
                    edgesThat.match.push(edge)
                } 
                return edgesThat
            }, {'match':[], 'dontMatch':[]})

            var noDuplicateEdges = edgesThat.dontMatch

            if (edgesThat.match.length > 0){

                noDuplicateEdges.push({
                    'source': edgesThat.match[0].source, 
                    'target': edgesThat.match[0].target, 
                    'value': linkageStrategy(edgesThat.match[0].value, next.value)
                }) 
            } else {
                noDuplicateEdges.push(next)
            }

            return noDuplicateEdges 
        }, [])

    }

    var randomId = function(){
        // Returns random string
        // :: () -> String
        return Math.random().toString()
    }

    var linkageStrategy = function(val1, val2){
        //Returns number
        // :: Number, Number -> Number
        return Math.max(val1, val2)
    }

    exports.removeEdgesLinkedToNode = function(){
        if (arguments.length > 0){
            removeEdgesLinkedToNode = arguments[0]
            return exports
        }
        return removeEdgesLinkedToNode 
    }

    exports.mergeNodes = function(){
        if (arguments.length > 0){
            mergeNodes = arguments[0]
            return exports
        }
        return mergeNodes 
    }

    exports.linkageStrategy = function(){
        if (arguments.length > 0){
            linkageStrategy = arguments[0]
            return exports
        }
        return linkageStrategy 
    }

    exports.randomId = function(){
        if (arguments.length > 0){
            randomId = arguments[0]
            return exports
        }
        return randomId 
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
