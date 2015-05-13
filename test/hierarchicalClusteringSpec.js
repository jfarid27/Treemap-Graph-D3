var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default hierarchicalClusterer', function(){
    var instance, clusterer 
    beforeEach(function(){
        instance = treemapGraphD3({})
        clusterer = instance.hierarchicalCluster()
    })

    describe('when given graph', function(){

        it('should convert nodes to nodeIndex')
        it('should reduce nodeIndexes and edgesList')
        it('should return the Tree from final nodeIndex')

    })
})
