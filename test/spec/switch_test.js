describe("switch", function(){
    describe("switch.my_method()", function(){
        it("should return 1", function(done){
            _use('switch@latest', function(exports) {
                expect('my_method' in exports);
                done();
            });
        });
    });
});