var expect = chai.expect;
var tabella = document.getElementById("tabella");

describe("Tabella", function() {

  describe("constructor", function() {

  	it("should not mount the table when no element is passed to the constructor", function() {

    	expect(new Tabella().slidingRows).to.not.exist;

    });

    it("should not mount the table when no options are passed to the constructor", function() {

    	expect(new Tabella(tabella).slidingRows).to.not.exist;
    });

    it("should not mount the table when rows are undefined", function() {

      var data = {};

      data.periods = [
          ['2014-12-14', '2014-12-20']
          ,['2014-12-21', '2015-1-10']
          ,['2015-2-1', '2015-3-7']
          ,['2015-3-8', '2015-3-21']
          ,['2015-3-22', '2015-4-7']
          ,['2015-4-7', '2015-4-23']
          ];   

      var test = new Tabella(tabella, data);    

    	expect(test.slidingRows).to.not.exist;
    });

    it("should not mount the table when both rows and periods are undefined", function() {

      expect(new Tabella(tabella,{}).slidingRows).to.not.exist;
    });

    it("should not mount the table when periods are undefined", function() {

       var data = {};

      data.rows = [
        {
            desc: '<h2 class="table-h"><a href="#">Single bed room</a></h2>',
            prices: [[190 , 210, 210, 204, 180, 160]],
            pricesDesc : ['1 person B&B']
        },
        {
            desc: '<h2 class="table-h"><a href="#">Double bed room</a></h2>',
            prices: [[190 , 210, 210, 204, 180, 160],[190 , 210, 210, 204, 180, 140]],
            pricesDesc : ['1 person half board', '2 people half board']
        },
        {
            desc: '<h2 class="table-h"><a href="#">Suite</a></h2>',
            prices: [[250 , 280, 280, 260, 230, 210]],
            pricesDesc : ['2 people all inclusive']
        }]; 

      var test = new Tabella(tabella, data);    

      expect(test.slidingRows).to.not.exist;
    });

    it("should mount the table when pricesDesc are undefined", function() {

       var data = {};

        data.periods = [
          ['2014-12-14', '2014-12-20']
          ,['2014-12-21', '2015-1-10']
          ,['2015-2-1', '2015-3-7']
          ,['2015-3-8', '2015-3-21']
          ,['2015-3-22', '2015-4-7']
          ,['2015-4-7', '2015-4-23']
          ]; 

      data.rows = [
        {
            desc: '<h2 class="table-h"><a href="#">Single bed room</a></h2>',
            prices: [[190 , 210, 210, 204, 180, 160]]
        },
        {
            desc: '<h2 class="table-h"><a href="#">Double bed room</a></h2>',
            prices: [[190 , 210, 210, 204, 180, 160],[190 , 210, 210, 204, 180, 140]],
            pricesDesc : ['', '2 people half board']
        },
        {
            desc: '<h2 class="table-h"><a href="#">Suite</a></h2>',
            prices: [[250 , 280, 280, 260, 230, 210]]
        }]; 

      var test = new Tabella(tabella, data);

      test.refreshSize();

      console.log(test.slidingRows);   

      expect(test.slidingRows).to.exist;
    });

  });

});