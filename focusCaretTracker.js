// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
/**
 * Copyright 2012-2013 Inclusive Design Research Centre, OCAD University.
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library. If not, see <http://www.gnu.org/licenses/>.
 *
 * Author:
 *   Joseph Scheuhammer <clown@alum.mit.edu>
 * Contributor:
 *   Magdalen Berns <thismagpie@live.com>
 */

const Atspi = imports.gi.Atspi;
const Lang = imports.lang;

const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init: function() {
        Atspi.init(); //TODO put somewhere better later
        this._atspiListener = Atspi.EventListener.new(Lang.bind(this, this._changed));
    },

    // Note that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected.
    registerFocusListener : function() {

        if (this._atspiListener.register('object:state-changed:focused')) {
            return true;
        }
        else if (this._atspiListener.register('object:state-changed:selected')) {
            return true;
        }
        else {
            return false;
        }
    },

    // Note that select events have been included in the logic for focus events
    // only because objects will lose focus the moment they are selected.
    deregisterFocusListener: function() {

        if (!this._atspiListener.register('object:state-changed:focused')) {
            return true;
        }
        else if (!this._atspiListener.register('object:state-changed:selected')) {
            return true;
        }
        else {
            return false;
        }
    },

    registerCaretListener: function() {

        if (this._atspiListener.register('object:text-caret-moved')) {
            return true;
        }
        else {
            return false;
        }
    },

    deregisterCaretListener: function() {

        if(!this._atspiListener.deregister('object:text-caret-moved')){
            return true;
        }
        else{
            return false;
        }
    },

    //// Private method ////
    _changed: function(event) {

        if (event.type.indexOf('object:state-changed') == 0) {
            this.emit('focus-changed', event);
        }
        else if (event.type == 'object:text-caret-moved') {
            this.emit('caret-changed', event);
        }
    }
});
