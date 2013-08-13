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
const Signals = imports.signals;

const FocusCaretTracker = new Lang.Class({
    Name: 'FocusCaretTracker',

    _init: function() {
        Atspi.init();
        this._atspiListener = Atspi.EventListener.new(
                                                Lang.bind(this, this._changed));
        this._trackingFocus = false;
        this._trackingCaret = false;
        this._registerFocus = false;
        this._registerSelect = false;
    },

    _registerFocusEvents: function() {

        if (this._trackingFocus) 
            return true;

        this._registerFocus = this._atspiListener.register(
                                            'object:state-changed:focused');
        this._registerSelect = this._atspiListener.register(
                                            'object:state-changed:selected');

        return this._trackingFocus = this._registerFocus || 
                                                        this._registerSelect;
    },

    _deregisterFocusEvents: function() {

        if (!this._trackingFocus)
            return true;

        this._registerFocus = this._atspiListener.register(
                                            'object:state-changed:focused');
        this._registerSelect = this._atspiListener.register(
                                           'object:state-changed:selected');
        return this._trackingFocus = !(this._registerFocus && 
                                                    this._registerSelect);
    },

    _registerCaretEvents: function() {

        if (this._trackingCaret)
            return true;

        this._trackingCaret = this._atspiListener.register(
                                                    'object:text-caret-moved');
        return this._trackingCaret;
    },

    _deregisterCaretEvents: function() {

        if (!this._trackingCaret)
            return true;

        this._trackingCaret = !this._atspiListener.deregister(
                                                        'object:text-caret-moved');
        return this._trackingCaret;
    },

    _changed: function(event) {

        if (event.type.indexOf('object:state-changed') == 0) {
            this.emit('focus-changed', event);
        }
        else if (event.type == 'object:text-caret-moved') {
            this.emit('caret-changed', event);
        }
    }
});
Signals.addSignalMethods(FocusCaretTracker.prototype);
//TODO Move to magnifier
function onFocus(caller, event) {
    let acc = event.source;
    if(!acc)
        return;

    if (event.type.indexOf('object:state-changed') == 0 && event.detail1 == 1) {
        let name = acc.get_name();
        let roleName = acc.get_role_name();
        let comp = acc.get_component_iface();

        if(!comp || acc == 'Terminal' || roleName == 'terminal')
            return;

        log('<accessible> : ' + name);
        log('<caller> ' + caller);
        log('<event> ' + event.type + ',' + event.detail1);
        log('<contructor>' + acc.constructor);
        log('<role name> ' + roleName);
        let extents = comp.get_extents(Atspi.CoordType.SCREEN);

        if (extents)
            log('<extents> [' + extents.x + ' ' + extents.y + ' ' + 
                                        extents.width + ' ' + extents.height +
                                    ']\nGjs-Message: JS LOG: END ');
    }
    else {
        log('no accessible \nGjs-Message: JS LOG: END ');
    }
}
//TODO move to magnifier
function onCaret(caller, event) {
    let acc = event.source;

    if (acc && event.type.indexOf('object:text-caret-moved') == 0) {
        let name = acc.get_name();
        let roleName = acc.get_role_name();
        let text = acc.get_text_iface();

        if (name == 'Terminal' || roleName == 'terminal')
            return;

        log('<accessible> : ' + name);
        log('<caller> ' + caller);
        log('<event> ' + event.type + ',' + event.detail1);
        log('<contructor>' + acc.constructor);
        log('<role name> ' + roleName);

        if (text && text.get_caret_offset() >= 0) {

            let offset = text.get_caret_offset();
            text_extents = text.get_character_extents(offset, 0);

            if (text_extents) 
                log('<text_extents> ' + text_extents.x + ' ' +
                                        text_extents.y + ' ' +
                                        text_extents.width + ' ' +
                                        text_extents.height +
                                        '\nGjs-Message: JS LOG: END ');
        }
        else {
            log('no text \nGjs-Message: JS LOG: END ');
        }
    }
    else {
        log('no accessible \nGjs-Message: JS LOG: END ');
    }
}
