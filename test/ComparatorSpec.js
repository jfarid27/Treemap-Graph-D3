var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default Comparator', function(){

    var instance, comparator
    beforeEach(function(){
        instance = treemapGraphD3({})
        comparator = instance.edgeComparator()
    })

    describe('when given Edges ', function(){


        describe('where edge1 is greater than edge2', function(){
            var mockEdge1, mockEdge2, result
            beforeEach(function(){
                mockEdge1 = {'value': 2}
                mockEdge2 = {'value': 1}
                result = comparator(mockEdge1, mockEdge2)
            })
            it('should return false', function(){
                expect(result).toBe(false)
            })
        })
        describe('where edge2 is greater than edge1', function(){
            var mockEdge1, mockEdge2, result
            beforeEach(function(){
                mockEdge1 = {'value': 1}
                mockEdge2 = {'value': 2}
                result = comparator(mockEdge1, mockEdge2)
            })
            it('should return true', function(){
                expect(result).toBe(true)
            })
        })

        describe('when the first edge is null', function(){
            var mockEdge1, mockEdge2, result
            beforeEach(function(){
                mockEdge1 = null
                mockEdge2 = {'value': 1}
                result = comparator(mockEdge1, mockEdge2)
            })
            it('should return false', function(){
                expect(result).toBe(false)
            })
        })
        describe('when the second edge is null', function(){
            var mockEdge1, mockEdge2, result
            beforeEach(function(){
                mockEdge1 = {'value': 1}
                mockEdge2 = null
                result = comparator(mockEdge1, mockEdge2)
            })
            it('should return true', function(){
                expect(result).toBe(true)
            })
        })
        describe('when both edges are null', function(){
            var mockEdge1, mockEdge2, result
            beforeEach(function(){
                mockEdge1 = null
                mockEdge2 = null 
                result = comparator(mockEdge2, mockEdge1)
            })
            it('should return false', function(){
                expect(result).toBe(null)
            })
        })
        
    })
})
