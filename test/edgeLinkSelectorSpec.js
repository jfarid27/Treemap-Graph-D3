var treemapGraphD3 = require('./../treemap-graph-d3.js')

describe('Default edgeLinkSelector', function(){

    var instance, selector
    beforeEach(function(){
        instance = treemapGraphD3({})
        selector = instance.edgeLinkSelector()
    })

    describe('when given no Edges or Comparator', function(){
        it('should return null', function(){
            pending('TODO')
        })
    })

    describe('when given edges list and a Comparator', function(){

        var mockEdgesList, mockComparator
        beforeEach(function(){
            mockEdgesList = {
                '$observed': {},
                'reduce': function(reducer){
                    this.$observed.reducer = reducer
                    return 'reduceResponse'
                }
            } 
            mockComparator = jasmine.createSpy() 
            results = selector(mockEdgesList, mockComparator)
        })

        describe('response', function(){

            it('should be results of Edges reduce function', function(){

                expect(results).toBe('reduceResponse')

            })

        })

        describe('set reducer', function(){
            describe('when given leader and current nodes', function(){
    
                var leader, next
                beforeEach(function(){
                    leader = 'leadNode'
                    next = 'nextNode'
                })

                describe('when comparator returns true', function(){

                    var result
                    beforeEach(function(){
                        mockComparator.and.returnValue(true)
                        result = mockEdgesList.$observed.reducer(leader, next)
                    })

                    it('should return leader', function(){
                        expect(result).toBe(leader)                     
                    })

                })

                describe('when comparator returns false', function(){

                    var result
                    beforeEach(function(){
                        mockComparator.and.returnValue(false)
                        result = mockEdgesList.$observed.reducer(leader, next)
                    })

                    it('should return current', function(){
                        expect(result).toBe(next)                     
                    })
                })

            })
        })

    })

})
