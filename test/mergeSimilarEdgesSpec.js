var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default mergeSimilarEdges', function(){
    var instance, comparator
    beforeEach(function(){
        instance = treemapGraphD3({})
        merger = instance.mergeSimilarEdges()
        instance.linkageStrategy = function(j, k){
            return 'linkageStrategyResponse'   
        }
    })

    describe('when given edges', function(){

        var mockEdges, result, linkageStrategy
        beforeEach(function(){

            mockEdges = {
                '$obsv':{},
                reduce: function(reducer){
                    this.$obsv.reducer = reducer
                    return 'reduceResponse'
                }
            }
            mockLinkageStrategy = function(){
                return "linkageStrategyResponse"
            }
            result = merger(mockEdges, mockLinkageStrategy)

        })

        it('should return reducer response', function(){
            expect(result).toBe('reduceResponse')
        })
        describe('edge reducer', function(){

            var reducer
            beforeEach(function(){
                reducer = mockEdges.$obsv.reducer
            })
            describe('when given a checked edges list and an edge', function(){

                var result, checked, mockNext, concatArgument 
                beforeEach(function(){
                    checked = {
                        'values': [
                            [{
                                'value': undefined, 
                            }],
                            {
                                'concat':function(edges){
                                    concatArgument = edges 
                                    return 'concatResponse'
                                }
                            }
                        ],
                        '$obsv': {'filterer': []},
                        'filter': function(filterer){
                            this.$obsv.filterer.push(filterer)
                            return this.values.pop()
                        }
                    }
                    mockNext = { 
                        'source':'mockSource', 
                        'target':'mockTarget' 
                    }
                    result = reducer(checked, mockNext) 
                })
                it('should return result of nonMatching concat', function(){
                    expect(result).toBe('concatResponse')
                })

                describe('nonMatching filter', function(){
                    var filter
                    beforeEach(function(){
                        filter = checked.$obsv.filterer[0]
                    })
                    describe('when given edge that matches next', function(){
                        var mockEdge, result
                        beforeEach(function(){
                            mockEdge = {
                                'source': 'mockSource', 
                                'target': 'mockTarget'
                            }
                            result = filter(mockEdge)
                        })
                        it('should return false', function(){
                            expect(result).toBe(false)
                        })
                    })
                })

                describe('matching filter', function(){
                    var filter
                    beforeEach(function(){
                        filter = checked.$obsv.filterer[1]
                    })
                    describe('when given edge that matches next', function(){
                        var mockEdge, result
                        beforeEach(function(){
                            mockEdge = {
                                'source': 'mockSource', 
                                'target': 'mockTarget'
                            }
                            result = filter(mockEdge)
                        })
                        it('should return true', function(){
                            expect(result).toBe(true)
                        })
                    })
                })

                describe('matching edge value', function(){
                    it('should be the result of linkageStrategy', function(){
                        expect(concatArgument[0].value)
                            .toBe('linkageStrategyResponse')
                    })
                })

            })
        })
    })
})
