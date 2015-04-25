var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default edgesAttached', function(){

    var instance, edgesAttached, edgeAttachedToNode
    beforeEach(function(){
        instance = treemapGraphD3({})
        edgesAttached = instance.edgesAttached()
        edgeAttachedToNode = 
            function(){ return 'edgeAttachedToNodeResult'}
    })
    describe('when given edges and ids', function(){

        var mockEdges, mockIds, result
        beforeEach(function(){
            mockIds = {
                '$obsv': {},
                'map': function(mapper){
                    var self = this
                    this.$obsv.mapper = mapper
                    return {
                        'reduce': function(reducer){
                            self.$obsv.reducer = reducer 
                            return 'reduceResponse'
                        }
                    }
                }
            }
            mockEdges = {
                '$obsv': {},
                'filter': function(filterer){
                    this.$obsv.filter = filterer
                    return 'filterResponse'
                }
            }
            result = edgesAttached(mockEdges, mockIds, edgeAttachedToNode)
        })
        it('should return the result of edge filter', function(){
            expect(result).toBe('filterResponse')
        })

        describe('edge filter', function(){

            var filter, mockEdge, result
            beforeEach(function(){
                mockEdge = 'mockEdge'
                filter = mockEdges.$obsv.filter
                result = filter(mockEdge)
            })

            it('should return result of ids reduce function', function(){
                expect(result).toBe('reduceResponse')
            })

            describe('ids mapper', function(){

                var result, mapper, mockId
                beforeEach(function(){
                    mockId = 'mockId'
                    mapper = mockIds.$obsv.mapper
                })

                it('should return the result of edgeAttachedToNode', function(){
                    result = mapper(mockId)
                    expect(result).toBe('edgeAttachedToNodeResult')
                })
                describe('reduce on the result of map', function(){
                    var reducer 
                    beforeEach(function(){
                        reducer = mockIds.$obsv.reducer
                    })

                    describe('logic behavior', function(){

                        it('should match logical or', function(){
                            expect(reducer(true, false)).toBe(true)
                            expect(reducer(false, true)).toBe(true)
                            expect(reducer(false, false)).toBe(false)
                            expect(reducer(true, true)).toBe(true)
                        })

                    })

                })
            })
        
        })
    })
})
