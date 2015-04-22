function treemapGraphD3(d3){

    var exports = function(){
        return
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

    exports.edgeComparator = function(){ 
        if (arguments.length > 0){
            edgeComparator = arguments[0]
            return exports
        }
        return edgeComparator
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
