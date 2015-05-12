var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default nodeIndexReduce', function(){

    var instance, reducer 
    beforeEach(function(){
        instance = treemapGraphD3({})
        reducer = instance.nodeIndexReduce()
    })
    describe('when given nodeIndex and edgesList', function(){

        var mockEdgeLinkSelector, mockEdgeComparator, mockMergeSimilarEdges,
        mockRemoveSelfArcs, mockNormalizeEdges, mockLinkageStrategy,
        mockRandomId, mockMergeNodes
        beforeEach(function(){

            mockLinkageStrategy = 'mockLinkageStrategy'

            mockRemoveSelfArcs = function(){
                return 'removeSelfArcsResponse'
            }

            mockNornalizeEdges = function(){
                return 'normalizeEdgesResponse'
            }

            mockMergeSimilarEdges = function(){
                return 'mergeSimilarEdgesResponse'
            }

            mockEdgeLinkSelector = function(){
                return 'edgeLinkSelectorResponse'
            }
        })

        describe('if nodeIndex is minimal', function(){

            var mockNodeIndex, mockEdgesList, result
            beforeEach(function(){

                mockNodeIndex = {}
                mockEdgesList = []
                result = reducer(mockNodeIndex, mockEdgesList, mockEdgeLinkSelector,
                    mockEdgeComparator, mockMergeSimilarEdges, mockRemoveSelfArcs, 
                    mockNormalizeEdges, mockLinkageStrategy, mockRandomId, mockMergeNodes)
            })
            it('should return null', function(){
                expect(result).toBeNull()
            })
        })

        describe('if nodeIndex is minimal', function(){
            var mockNodeIndex, mockEdgesList, result
            beforeEach(function(){

                mockNodeIndex = {'foo': 'bar'}
                mockEdgesList = []
                result = reducer(mockNodeIndex, mockEdgesList, mockEdgeLinkSelector,
                    mockEdgeComparator, mockMergeSimilarEdges, mockRemoveSelfArcs, 
                    mockNormalizeEdges, mockLinkageStrategy, mockRandomId, mockMergeNodes)
            })
            it('should return null', function(){
                expect(result.foo).toBe('bar')
            })
        })

    })
})
