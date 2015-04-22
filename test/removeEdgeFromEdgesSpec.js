var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default removeEdgeFromEdges', function(){

    var instance, checker 
    beforeEach(function(){
        instance = treemapGraphD3({})
        checker = instance.removeEdgeFromEdges()
    })
    describe('when given edges and an edge to remove', function(){

        var mockEdges, mockRemoving, result
        beforeEach(function(){

            mockEdges = {
                '$obsv': {},
                'filter': function(filter){
                    this.$obsv.filter = filter
                    return 'filterResponse'
                }
            }

            mockRemoving = {
                'source': 1,
                'target': 1
            }

            result = checker(mockEdges, mockRemoving)

        })
        it('should return filter response', function(){
            expect(result).toBe('filterResponse')
        })
        describe('edge filter', function(){

            var filter, response
            beforeEach(function(){
                filter = mockEdges.$obsv.filter
            })
            describe('when given edge that matches',function(){

                var mockEdge, result
                beforeEach(function(){
                    mockEdge = {
                        'source': 1,
                        'target': 1
                    }
                    result = filter(mockEdge)
                })

                it('should return false', function(){

                    expect(result).toBe(false)
                }) 

            })
            describe("when given edge that doesn't match",function(){

                var mockEdge, result
                beforeEach(function(){
                    mockEdge = {
                        'source': 1,
                        'target': 0
                    }
                    result = filter(mockEdge)
                })

                it('should return true', function(){

                    expect(result).toBe(true)
                }) 

            })
        }) 
    })
})
