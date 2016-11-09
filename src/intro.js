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

(function(tabella, window, document) {

		'use strict';

    if (typeof define === 'function' && define.amd) {
        // Register Tabella as an AMD module
        define(tabella);
    } else {
        // Register Tabella on window
        window.Tabella = tabella();
    }

})(function() {

        'use strict';
