var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default Normalize Edges', function(){
    var instance, comparator
    beforeEach(function(){
        instance = treemapGraphD3({})
        remover = instance.removeSelfArcs()
    })

    var mockEdges, result 
    beforeEach(function(){

        mockEdges = {
            '$obsv': {},
            'filter': function(filter){
                this.$obsv.filter = filter 
                return 'mapResponse'
            }
        }
        result = remover(mockEdges)

    })
    it('should return the result of edge mapper', function(){
        expect(result).toBe('mapResponse')
    })
    describe('edge filterer', function(){

        var filter
        beforeEach(function(){
            filter = mockEdges.$obsv.filter
        })

        describe('when given an edge', function(){

            describe('where edge source matches target', function(){

                var mockEdge, result
                beforeEach(function(){
                    mockEdge = { 'source': 1, 'target':1}
                    result = filter(mockEdge)
                })
                it('should return false', function(){
                    expect(result).toBe(false)
                })
            })
            describe('where edge source does not match target', function(){
                var mockEdge, result
                beforeEach(function(){
                    mockEdge = { 'source': 0, 'target':1}
                    result = filter(mockEdge)
                })
                it('should return true', function(){
                    expect(result).toBe(true)
                })
            })

        })

    })
    
})
