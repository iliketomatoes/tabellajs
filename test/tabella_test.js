var expect = chai.expect;
var tabella = document.getElementById("tabella");

describe("Tabella", function() {
  describe("constructor", function() {
  	it("should throw a TabellaException when no element is passed to the constructor", function() {

    	expect(function(){ new Tabella(); }).to.throw(TabellaException);
    });
    it("should throw a TabellaException when options are empty", function() {

    	expect(function(){ new Tabella(tabella); }).to.throw(TabellaException);
    });
    it("should throw a TabellaException when rows or periods are null", function() {

    	expect(function(){ new Tabella(tabella,{}); }).to.throw(TabellaException);
    });
    it("should throw a TabellaException when no rows are passed into the options", function() {

    	expect(function(){ new Tabella(tabella,{ periods : [

                        ['x','y']

                      ]}); }).to.throw(TabellaException);
    });
    it("should throw a TabellaException when no periods are passed into the options", function() {

    	expect(function(){ new Tabella(tabella,{ rows : [

                        ['x','y']

                      ]}); }).to.throw(TabellaException);
    });
  });

});