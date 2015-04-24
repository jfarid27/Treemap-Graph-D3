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
        describe('mapper', function(){

            var mapper 
            beforeEach(function(){
                mapper = mockEdges.$obsv.mapper
            })
            describe('when given an edge', function(){

                describe('where source matches a merging edge', function(){
                    
                    var mockEdge, result
                    beforeEach(function(){
                        mockEdge = {
                            'source': 'foo',
                            'target': 'bar' 
                        }
                        result = mapper(mockEdge)
                    })
                    it('should return an edge where source is replaced', function(){
                        expect(result.source).toBe('zed')
                        expect(result.target).toBe('bar')
                    })
                })
                describe('where target matches a merging edge', function(){
                    var mockEdge, result
                    beforeEach(function(){
                        mockEdge = {
                            'source': 'bar' ,
                            'target': 'foo' 
                        }
                        result = mapper(mockEdge)
                    })
                    it('should return an edge where target is replaced', function(){
                        expect(result.source).toBe('bar')
                        expect(result.target).toBe('zed')
                    })
                })
            })
        })
    })

})
