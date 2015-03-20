tabellajs
=========


This is a pure javascript pricing table, responsive, AMD ready, touch enabled.

##INSTALL

Besides cloning this repo or downloading it, you can either get it through Bower.

```
bower install tabellajs

```

##USAGE

Include the css into your page:
<pre lang="html">
&lt;link rel="stylesheet" href="path/to/tabella.css"&gt;
</pre>

Include the script into your page:
<pre lang="html">
&lt;script src="path/to/tabella.js"&gt;&lt;/script&gt;
</pre>

Add the markup for your div meant to hold the table:
<pre lang="html">
&lt;div id="example" class="tabella-ctr"&gt;&lt;/div&gt;        
</pre> 


Then activate the plugin: 
<pre lang="javascript">
    !(function(){

        var myTabella = new Tabella(
            document.getElementById('example'),
            {   
                periods: [
                    ['2014-12-14', '2014-12-20']
                    ,['2014-12-21', '2015-1-10']
                    ,['2015-2-1', '2015-3-7']
                    ,['2015-3-8', '2015-3-21']
                    ,['2015-3-22', '2015-4-7']
                ],
                rows : [
                    {
                        desc: '<h2 class="table-h"><a href="#">Single bed room</a></h2>',
                        prices: [[190 , 210, 210, 204, 180],[190 , 210, 210, 204, 180]],
                        pricesDesc : ['1 persona', '2 persone']
                    },
                    {
                        desc: '<h2 class="table-h"><a href="#">Double bed room</a></h2>',
                        prices: [[190 , 210, 210, 204, 180]],
                        pricesDesc : ['1 persona']
                    },
                    {
                        desc: '<h2 class="table-h"><a href="#">Suite</a></h2>',
                        prices: [[190 , 210, 210, 204, 180]],
                        pricesDesc : ['1 persona']
                    } 
                        
                ]
            });
    })();
</pre>

You **have to** pass to the constructor the HTML element which holds the table as first argument, then an object which imperatively define the content of the table as second argument.

####IMPORTANT:
It's compulsory to define the *periods* property, which is an array containing arrays(nested array) with the syntax shown above.
Then it's compulsory to define the rows of the table. The *rows* property is an array of objects. Each object must contain the *prices* field, which is an array of array. The length of each array hold by "prices" must be equal to the number of the periods.

####Everything else is optional  
i.e. *desc* and *pricesDesc* are optional properties for the row.

* * * 

###AMD USAGE
Since it doesn't have dependencies,if you are using Requirejs just write something like this:
<pre lang="javascript">
require(['tabella'], function(tabella){
    //Put here the same thing as shown above
})      
</pre> 

##OPTIONS

Available options:

| Property         | Description                                                      | Type        | DEFAULT |
| ---------------- |----------------------------------------------------------------  | ----------- | ------- |
| cellBreakpoints | Here we declare the row breakpoints (referred to the table container's width). It is a literal object which contains an arbitrary number of properties. Each property must hold a 2 element-long array; the first element is the table container *min-width* expressed in px, the second element stands for the number of cells to be shown in each row | Object  |  { default : [0,1], small : [360,2], medium : [640,3], large : [820,4], xlarge : [1080,5]}  |
| descBreakpoints | Here we declare the description-cell breakpoints (the cells on the left of the table which contains the row description). It is a literal object which contains an arbitrary number of properties. Each property must hold a 2 element-long array; the first element is the table container *min-width* expressed in px, the **second element is the description cell width expressed in px**. | Object  | { default : [0,0], medium : [460, 160], large: [900, 200] } |    
| from  | Content shown in the period start row. |  String  |   'from' |
| to  | Content shown in the period end row. |  String  |   'to' |  
| currency  | The currency shown in each cell. |  String | '&euro;' |
| duration | The duration of the sliding animation. Expressed in milliseconds.  | Number | 600  |
| easing | The easing of the animation. You can pick among 24 pre-set easings. | String | 'easeInOutSine' |
| reboundSpeed | The speed of the animation once "touch end" event is fired, after you stopped swiping a table row. Expressed in px/seconds. | Number | 300 |
| edgeThreshold | The amount of pixels you can swipe over the boundaries of the row. | Number | 150 |
| swipeThreshold | The amount of pixels needed to fire the swipe event. | Number | 60 |
| swipeSingleTick | Whether to swipe by a single-cell-length per time or not. If set to false, it'll swipe by a number of cells equal to the result given by this function: Math.abs(Math.floor(delta / swipeThreshold)) | Boolean | true |
| onRefreshSize | A callback to invoke when the browser window has been resized. | Function | false |
| headerRowDevider | When you have a two-storey table header, here you can put any HTML entity you want | String | '-' |


    

###List of predefined easings
1. easeInSine
2. easeOutSine
3. easeInOutSine
4. easeInQuad
5. easeOutQuad
6. easeInOutQuad
7. easeInCubic
8. easeOutCubic
9. easeInOutCubic
10. easeInQuart
11. easeOutQuart
12. easeInOutQuart
13. easeInQuint
14. easeOutQuint
15. easeInOutQuint
16. easeInExpo
17. easeOutExpo
18. easeInOutExpo
19. easeInCirc
20. easeOutCirc
21. easeInOutCirc
22. easeInBack
23. easeOutBack
24. easeInOutBack

##API
<pre lang="javascript">
    var table = new Tabella( document.getElementById('your-tabella'), 
                { 
                    //Whatever options 
                });

    /**
    * Goes to the next cell.
    * @param {String}
    */          
    table.move('right');

    /**
    * Goes to the previous cell.
    * @param {String}
    */          
    table.move('left');

    /**
    * Move all the rows by the passed parameter amount.
    * @param {Number}
    */          
    table.move(x);

    /**
    * Reflow the table size.
    */          
    table.refreshSize();

    /**
    * @return {Number} The current width of each cell
    */          
    table.getCellWidth();

    /**
    * @return {Object} The current breakpoint. The first element of this object
    * is the array picked from the options.cellBreakpoints which fits into the 
    * current media query. The second element is another array picked among the 
    * options.descBreakpoints, which is fit for the current media query as well.
    */          
    table.getCurrentBreakPoint();

    /**
    * Set single tick.
    * @param {Boolean} Set table.options.swipeSingleTick to true or false. See the options * documentation.
    */          
    table.setSingleTick(trueOrFalse);    

</pre>  

##BROWSER SUPPORT

Not tested yet, but working on all modern browser, IE9+.

##ROADMAP
+ Better API
+ Better Tests

##LICENSE
Apache License
