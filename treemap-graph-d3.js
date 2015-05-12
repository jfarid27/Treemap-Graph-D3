function treemapGraphD3(d3){


    var exports = function(graph, selection){

        var self = this

        var vis = selection.append('g').classed('d3-treemap-graph', true)

        var cluster = hierarchicalCluster(graph, mergeSimilarEdges, 
        linkageStrategy, edgeLinkSelector, edgeComparator, normalizeEdges, 
        randomId, removeSelfArcs, mergeNodes, indexNodes, nodeIndexReduce)

        var treemap = d3.layout.treemap()
            .size([settings.x.width, settings.y.width])
            .mode( (settings.mode) ? settings.mode: 'squarify')
            .sticky(false)
            .value(function(d) { 
                return (settings.style.node.radius)? 
                    settings.style.node.radius : d.size 
            })

        var nodes = treemap.nodes(cluster).filter(function(element){
            return !(element.children)
        })

        vis.selectAll('rect').data(nodes).enter()
            .append('rect')
            .call(positionRectangle)
            .style('fill', function(){
                return settings.style.treemap.rect.fill        
            })
            .attr('class', 'd3-treemap-node')

        var treemapCircles = nodes.map(function(node){
           
            return {
                'id': node.id,
                'x': node.x + (node.dx/2) + noise(node.dx, .25),
                'y': node.y + (node.dy/2) + noise(node.dy, .25),
                'group':node.group
            }
            
        })

        var treemapNodePositions = treemapCircles.reduce(function(agg, node){
            agg[node.id] = node 
            return agg
        }, {})
        
        
        vis.selectAll('circle').data(treemapCircles).enter()
        .append('circle')
        .attr({
            'cx':function(d){return d.x},
            'cy':function(d){return d.y},
            'r':settings.style.node.radius
        })
        
        vis.selectAll('path').data(graph.edges).enter()
        .append('path')
        .attr({
            'd': edgePath(treemapNodePositions),
            'stroke': edgeColor(treemapNodePositions)
        })

    }

    function edgePath(treemapNodePositions){
        //Utility function for graphing algorithm

        return function(edge){
            //lookup source and target node positions
            var source = treemapNodePositions[edge.source],
            target = treemapNodePositions[edge.target]
            
            return "M " + source.x + " " + source.y +
            " L " + target.x + " " + target.y
        }
    }

    
    function edgeColor(treemapNodePositions){
        //Utility function for graphing algorithm

        return function(edge){
            
            if(!settings.colorEdgeByGroup){
                return settings.style.edge.color   
            }

            if (typeof treemapNodePositions[edge.source].group == 'undefined' ||
                typeof treemapNodePositions[edge.target].group == 'undefined' ){

                return settings.style.edge.color;

            }
            
            if (treemapNodePositions[edge.source].group == 
                treemapNodePositions[edge.target].group){

                return groupColorings()(Math.floor(treemapNodePositions[edge.source].group) % 20)

            } else { 

                return (settings.offGroupEdgeColor) ? 
                    settings.offGroupEdgeColor 
                        : settings.style.edge.color    
            }
        }
    }

    function positionRectangle() {
        //Utility function for graphing algorithm

        this.attr("x", function(d) { return (!d.children) ? d.x + "px" : 0; })
        .attr("y", function(d) { return (!d.children) ? d.y + "px" : 0; })
        .attr("width", function(d) { return (!d.children) ? Math.max(0, d.dx - 1) + "px" : 0 ; })
        .attr("height", function(d) { return (!d.children) ? Math.max(0, d.dy - 1) + "px" : 0; });
    }


    var settings = {
        mode: 'squarify',
        colorEdgeByGroup: true,
        offGroupEdgeColor: 'white',
        x: {
            'margin': 10,
            'width': 600
        },
        y: {
            'margin': 10,
            'width': 300
        },
        style:{
            'treemap': {
                'rect': {
                    'fill': '#eee'
                }
            },
            'node': {
                'radius': 4,
                'fill': '#000'
            },
            'edge': {
                'color': '#000'
            }
        }
    }


    var hierarchicalCluster = function(graph, mergeSimilarEdges, 
        linkageStrategy, edgeLinkSelector, edgeComparator, normalizeEdges, 
        randomId, removeSelfArcs, mergeNodes, indexNodes, nodeIndexReduce){
        //Clustering algorithm to generate hierarchical tree for treemap
        // :: Graph, MergeSimilarEdges, ... -> Tree

        var nodeIndex = indexNodes(graph.nodes)
        var edgesList = graph.edges.slice()

        var finalIndex = nodeIndexReduce(nodeIndex, edgesList, 
            edgeLinkSelector, edgeComparator, mergeSimilarEdges, removeSelfArcs,
            normalizeEdges, linkageStrategy, randomId, mergeNodes)

        return finalIndex[Object.keys(finalIndex)[0]]
        
    }; 

    var indexNodes = function(nodes){
        //Returns nodeIndex from given nodes
        // :: Nodes -> NodeIndex
        return nodes.reduce(function(nodeIndex, node){
            nodeIndex[node.id.toString()] = node;
            return nodeIndex
        }, {})
    }


    var nodeIndexReduce = function(nodeIndex, edgesList,
            edgeLinkSelector, edgeComparator, mergeSimilarEdges, removeSelfArcs,
            normalizeEdges, linkageStrategy, randomId, mergeNodes){
        //Recursive reducer for given node index and edgesList
        // :: NodeIndex, Edges -> NodeRoot

        if (Object.keys(nodeIndex).length < 1){
            return null
        }

        if (Object.keys(nodeIndex).length == 1){
            return nodeIndex
        }


        var mergingNodeIds = edgeLinkSelector(edgesList, edgeComparator);

        var newNodeId = randomId()

        var newEdgesList 
            = mergeSimilarEdges(
                removeSelfArcs(
                    normalizeEdges(
                        edgesList, mergingNodeIds, newNodeId))
            , linkageStrategy)

        var newNodeIndex = mergeNodes(mergingNodeIds, nodeIndex, newNodeId)

        return nodeIndexReduce(newNodeIndex, newEdgesList,
            edgeLinkSelector, edgeComparator, mergeSimilarEdges, removeSelfArcs,
            normalizeEdges, linkageStrategy, randomId, mergeNodes)

    }

    var mergeNodes = function(Ids, nodeIndex, newId){
        //Returns nodeIndex with given node ids merged into a node with id
        //specified by newId
        // Ids, NodeIndex, Id -> NodeIndex

        nodeIndex[newId] = {
            id: newId, 
            children: Ids.map(function(id){
                return nodeIndex[id]
            })
        }

        return Ids.reduce(function(nodeIndex, id){
            delete nodeIndex[id]
            return nodeIndex
        }, nodeIndex)
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

    var groupColorings = function(){
        //Returns D3 category scale for edge coloring
        // :: () -> ColorScale
        return d3.scale.category20()
            .domain(d3.range(20))
    }

    var edgeComparator = function(edge1, edge2){
        //Returns true if edge1 is greater than edge2
        // :: Edge | Null, Edge | Null -> Boolean | Null
        if (!edge1 || !edge2){
            return edge1 ? true :  
                    edge2 ? false : null 
        }
        return edge1.value < edge2.value
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
        //Default strategy to merge edges attached to newly created nodes 
        // :: Number, Number -> Number
        return Math.min(val1, val2)
    }

    var noise = function(range, strength){
        //Returns some noise for the points to help alleviate 
        //overlapping edges problem
        // :: Number, Number -> Number
        var neg = (Math.random() > .5) ? 1 : -1
        return strength * (range) * Math.random() * (neg)
    }

    exports.hierarchicalClusterer = function(){
        if (arguments.length > 0){
            hierarchicalClusterer = arguments[0]
            return exports
        }
        return hierarchicalClusterer 
    }

    exports.indexNodes = function(){
        if (arguments.length > 0){
            indexNodes = arguments[0]
            return exports
        }
        return indexNodes 
    }

    exports.nodeIndexReduce = function(){
        if (arguments.length > 0){
            nodeIndexReduce = arguments[0]
            return exports
        }
        return nodeIndexReduce 
    }

    exports.noise = function(){
        if (arguments.length > 0){
            noise = arguments[0]
            return exports
        }
        return noise 
    }

    exports.settings = function(){
        if (arguments.length > 0){
            settings = arguments[0]
            return exports
        }
        return settings 
    }

    exports.groupColorings = function(){
        if (arguments.length > 0){
            groupColorings = arguments[0]
            return exports
        }
        return groupColorings 
    }

    exports.settings.colorEdgeByGroup = function(){
        if (arguments.length > 0){
            settings.colorEdgeByGroup = arguments[0]
            return exports
        }
        return settings.colorEdgeByGroup 
    }

    exports.settings.mode = function(){
        if (arguments.length > 0){
            settings.mode = arguments[0]
            return exports
        }
        return settings.mode 
    }


    exports.settings.style = function(){
        if (arguments.length > 0){
            settings.style = arguments[0]
            return exports
        }
        return settings.style 
    }

    exports.settings.style.edge = function(){
        if (arguments.length > 0){
            settings.style.edge = arguments[0]
            return exports
        }
        return settings.style.edge 
    }

    exports.settings.style.node = function(){
        if (arguments.length > 0){
            settings.style.node = arguments[0]
            return exports
        }
        return settings.style.node 
    }

    exports.settings.style.treemap = function(){
        if (arguments.length > 0){
            settings.style.treemap = arguments[0]
            return exports
        }
        return settings.style.treemap 
    }

    exports.settings.y = function(){
        if (arguments.length > 0){
            settings.y = arguments[0]
            return exports
        }
        return settings.y 
    }

    exports.settings.x = function(){
        if (arguments.length > 0){
            settings.x = arguments[0]
            return exports
        }
        return settings.x 
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

    exports.hierarchicalCluster = function(){
        if (arguments.length > 0){
            hierarchicalCluster = arguments[0]
            return exports
        }
        return hierarchicalCluster
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

if (module){
    module.exports = treemapGraphD3
}
