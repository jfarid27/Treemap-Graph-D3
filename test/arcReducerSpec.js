var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default Normalize Edges', function(){
    var instance, comparator
    beforeEach(function(){
        instance = treemapGraphD3({})
        normalizer = instance.normalizeEdges()
    })

    describe('when given edges, ids, and a new id', function(){

        var mockEdges, mockIds, mockNewId, result
        beforeEach(function(){

            mockEdges = {
                '$obsv': {},
                'map': function(mapper){
                    this.$obsv.mapper = mapper
                    return 'mapResponse'
                }
            }

            mockIds = ['foo', 'foo']
            mockNewId = 'zed'
            result = normalizer(mockEdges, mockIds, mockNewId)

        })
        it('should return the result of edge mapper', function(){
            expect(result).toBe('mapResponse')
        })
    })
})
