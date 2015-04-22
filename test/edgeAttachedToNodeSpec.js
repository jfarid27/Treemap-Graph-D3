var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default edgeAttachedToNode', function(){

    var instance, checker 
    beforeEach(function(){
        instance = treemapGraphD3({})
        checker = instance.edgeAttachedToNode()
    })
    describe('when given an Edge and Id', function(){
        var edge 
        beforeEach(function(){
            edge = {source: 'foo', target: 'bar'}
        })

        describe("if Id matches Edge's source", function(){

            var id, result
            beforeEach(function(){
                id = 'foo'
                result = checker(id, edge)
            })
            it('should return true', function(){
                expect(result).toBe(true)
            })
        })
        describe("if Id matches Edge's target", function(){
            var id, result
            beforeEach(function(){
                id = 'bar'
                result = checker(id, edge)
            })
            it('should return true', function(){
                expect(result).toBe(true)
            })
        })
        describe("if Id doesn't match anything", function(){
            var id, result
            beforeEach(function(){
                id = 'zed'
                result = checker(id, edge)
            })
            it('should return false', function(){
                expect(result).toBe(false)
            })
        })

    })
})
