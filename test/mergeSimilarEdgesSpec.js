var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default mergeSimilarEdges', function(){
    var instance, comparator
    beforeEach(function(){
        instance = treemapGraphD3({})
        merger = instance.mergeSimilarEdges()
    })

    describe('when given edges and a linkage strategy', function(){

        var mockEdges, result, linkageStrategy
        beforeEach(function(){

            mockEdges = {
                '$obsv':{},
                reduce: function(reducer){
                    this.$obsv.reducer = reducer
                    return 'reduceResponse'
                }
            }

            linkageStrategy = function(j, k){
                return 'linkageStrategyResponse'   
            }

            result = merger(mockEdges, linkageStrategy) 

        })

        it('should return reducer response', function(){
            expect(result).toBe('reduceResponse')
        })

        describe('edge reducer', function(){
            describe('when given a checked edges list and an edge', function(){

                var checkedEdges, mockEdge, pushedEdge, result
                beforeEach(function(){

                    checkedEdges = {
                        '$obsv': {'reducer': undefined},
                        'reduce': function(reducer){
                            this.$obsv.reducer = reducer
                            return {
                                'dontMatch': {
                                    'push': function(addedEdge){ 
                                        pushedEdge = addedEdge
                                    },
                                    'value': 'mockEdges'
                                }, 
                                'match': [{ 'source': 1, 'target': 2, value: 0 }], 
                                
                            }
                        }
                    }

                    mockNextEdge = {'source':0, 'target': 1, 'value': 2}

                    result = mockEdges.$obsv.reducer(checkedEdges, mockNextEdge)
                    
                })

                it('should return result of checked edges that dont match', function(){
                    expect(result.value).toBe('mockEdges')
                })

                describe('if edges that match is greater than 0', function(){

                    it('should append a new edge merged using the linkage strategy', function(){
                        expect(pushedEdge.value).toBe('linkageStrategyResponse')
                    })

                })
               
                describe("reduce filter for edges that match and don't match", function(){

                    var reducer, mockCheckedEdges
                    beforeEach(function(){
                        reducer = checkedEdges.$obsv.reducer

                        mockCheckedEdges = {'dontMatch': [], 'match':[]}
                    })

                    describe('when given an aggregate and previously checked edge', function(){

                        describe('if checked edge matches currently merging edge', function(){

                            var result, mockCurrentlyChecking
                            beforeEach(function(){

                                mockCurrentlyChecking = {'source':0, 'target': 1, 'value': 2}

                                result = reducer(mockCheckedEdges, mockCurrentlyChecking)

                            })
                            
                            it('should push edge into matched array', function(){
                                expect(result.match.length > 0).toBe(true)
                            })
                        })
                        describe('if checked edge does not match currently merging edge', function(){
                            var result, mockCurrentlyChecking
                            beforeEach(function(){

                                mockCurrentlyChecking = {'source': 1, 'target': 1, 'value': 2}

                                result = reducer(mockCheckedEdges, mockCurrentlyChecking)

                            })
                            
                            it('should push edge into matched array', function(){
                                expect(result.dontMatch.length > 0).toBe(true)
                            })
                        })

                    })

                })

            })
        })
    })
})
