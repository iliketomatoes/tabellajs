/*
 *  Copyright (C) 2014-2016  Interpromotion <info@interpromotion.com>
 *  Copyright (C) 2014-2016  Giancarlo Soverini <giancarlosoverini@gmail.com>
 *
 *  This file is part of Tabellajs.
 *
 *  Tabellajs is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  Tabellajs is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>
 */

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

//http://stackoverflow.com/questions/7212102/detect-with-javascript-or-jquery-if-css-transform-2d-is-available
function getSupportedTransform() {
    var prefixes = 'transform WebkitTransform MozTransform OTransform msTransform'.split(' ');
    for (var i = 0; i < prefixes.length; i++) {
        if (document.createElement('div').style[prefixes[i]] !== undefined) {
            return prefixes[i];
        }
    }
    return false;
}

function createHTMLEl(htmlEl, className, parent, htmlContent) {
    var el = document.createElement(htmlEl);
    el.className = className;
    if (!!htmlContent) el.innerHTML = htmlContent;
    parent.appendChild(el);
    return el;
}

function getArray(nodeList) {
    return Array.prototype.slice.call(nodeList, 0);
}

function setListener(elm, events, callback) {
    var eventsArray = events.split(' '),
        i = eventsArray.length;

    while (i--) {
        elm.addEventListener(eventsArray[i], callback, false);
    }
}

function invokeCallback(cb, cbContext) {
    var context = cbContext || null,
        params = Array.prototype.slice.call(arguments, 2);
    return cb.apply(context, params);
}

function getReboundTime(space, speed) {
    return Math.round((Math.abs(space) / speed) * 1000);
}

/**
 * Determine if an element is partially in the viewport
 *
 * @param {HTMLElement} el
 */
function isElementPartiallyInViewport(el, bottomThreshold) {

    var rect = el.getBoundingClientRect(),
        threshold = bottomThreshold || 0;

    return (rect.top <= 0 && rect.bottom >= threshold);
}

/**
 * Determine if an element is completely in the viewport
 *
 * @param {HTMLElement} el
 */
function isElementCompletelyInViewport(el) {

    var rect = el.getBoundingClientRect();

    return (rect.top >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.bottom >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight));
}
