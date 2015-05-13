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
        mockRandomId, mockMergeNodes, mockAddNode, mockDeleteNode
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

            mockAddNode = function(){
                return 'mockAddNodeResponse'
            }
            mockDeleteNode = function(){
                return 'mockDeleteNodeResponse'
            }
        })

        describe('if nodeIndex is empty', function(){

            var mockNodeIndex, mockEdgesList, result, mockIsEmpty,
            mockIsMinimal
            beforeEach(function(){

                mockIsEmpty = function(){ return true }

                mockNodeIndex = {}

                mockEdgesList = []

                result = reducer(mockNodeIndex, mockEdgesList, mockEdgeLinkSelector,
                    mockEdgeComparator, mockMergeSimilarEdges, mockRemoveSelfArcs, 
                    mockNormalizeEdges, mockLinkageStrategy, mockRandomId, mockMergeNodes,
                    mockAddNode, mockDeleteNode, mockIsMinimal, mockIsEmpty)
            })
            it('should return null', function(){
                expect(result).toBeNull()
            })
        })

        describe('if nodeIndex is minimal', function(){
            var mockNodeIndex, mockEdgesList, result, 
            mockIsMinimal, mockIsEmpty
            beforeEach(function(){

                mockIsEmpty = function(){ return false }
                mockIsMinimal = function(){ return true }
                mockNodeIndex = {'foo': 'bar'}
                mockEdgesList = []
                result = reducer(mockNodeIndex, mockEdgesList, mockEdgeLinkSelector,
                    mockEdgeComparator, mockMergeSimilarEdges, mockRemoveSelfArcs, 
                    mockNormalizeEdges, mockLinkageStrategy, mockRandomId, mockMergeNodes,
                    mockAddNode, mockDeleteNode, mockIsMinimal, mockIsEmpty)
            })
            it('should return null', function(){
                expect(result.foo).toBe('bar')
            })
        })

    })
})
