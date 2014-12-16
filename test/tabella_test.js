var expect = chai.expect;
var tabella = document.getElementById("tabella");

describe("Tabella", function() {
  describe("constructor", function() {
  	it("should return a TabellaException when no element is passed to the constructor", function() {

  		var test = new Tabella();
    	expect(test).to.be.an.instanceof(TabellaException);
    });
    it("should return a TabellaException when options are empty", function() {

  		var test = new Tabella(tabella);
    	expect(test).to.be.an.instanceof(TabellaException);
    });
    it("should return a TabellaException when rows or periods are null", function() {

  		var test = new Tabella(tabella,{});
    	expect(test).to.be.an.instanceof(TabellaException);
    });
    it("should return a TabellaException when no rows are passed into the options", function() {

  		var test = new Tabella(tabella,{ periods : [

  											['x','y']

  										]});
    	expect(test).to.be.an.instanceof(TabellaException);
    });
    it("should return a TabellaException when no periods are passed into the options", function() {

  		var test = new Tabella(tabella,{ rows : [

  											['x','y']

  										]});
    	expect(test).to.be.an.instanceof(TabellaException);
    });
  });

});