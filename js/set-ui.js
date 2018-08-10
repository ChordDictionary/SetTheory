/*jslint browser: true*/
/*globals define: false */
define([
    '../set',
    '12tone'
], function (set, tt) {
    'use strict';
    var container = document.createElement('div'),
        grid;
    function createSchema(args) {
        return Object.keys(args.data[0]).map(function (name) {
            return {
                name: name,
                title: name,
                hidden: args.hidden.indexOf(name) !== -1
            };
        });
    }
    function appendDom() {
        document.body.appendChild(container);
        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.style.overflow = 'hidden';
        container.style.padding = 0;
        container.style.margin = 0;
        function resize() {
            container.style.width = window.innerWidth + 'px';
            container.style.height = window.innerHeight + 'px';
        }
        resize();
        window.addEventListener('resize', resize);
        grid = canvasDatagrid({
            name: 'setTheory',
            parentNode: container,
            tree: true
        });
        grid.style.width = '100%';
        var membership = [];
        Object.keys(set.list).forEach(function (mName) {
            if (mName === 'nullSet') { return; }
            membership.push({
                'Membership': mName
            });
        });
        grid.addEventListener('rendertext', function (e) {
            if (e.cell.style === 'rowHeaderCell') {
                e.cell.formattedValue = tt.membersRomanMap[this.data[e.cell.rowIndex].Membership];
            }
        });
        grid.addEventListener('expandtree', function expandTree(e) {
            var famlies = [], fGrid = e.treeGrid, fData = e.data;
            Object.keys(set.list[e.data.Membership]).forEach(function (fName) {
                var isDiatonic = tt.isDiatonic(set.list[e.data.Membership][fName]),
                    headingRegex = /\((\d+)\) +\((\S+-\S+)\) (.+)/,
                    headingMatch;
                set.list[e.data.Membership][fName].isDiatonic = isDiatonic;
                headingMatch = headingRegex.exec(fName);
                if (!headingMatch) {
                    throw new Error('Eric fucked up again. ☞ ' + fName);
                }
                famlies.push({
                    fName:  fName,
                    'Family':  headingMatch[3],
                    'Diatonic': isDiatonic ? 'Diatonic' : 'Non-Diatonic',
                    'index': headingMatch[1],
                    'Yamaguchi Number': headingMatch[2]
                });
            });
            fGrid.attributes.tree = true;
            fGrid.addEventListener('rendertext', function (e) {
                if (e.cell.style === 'rowHeaderCell') {
                    e.cell.formattedValue = this.data[e.cell.rowIndex].index;
                    return;
                }
            });
            fGrid.addEventListener('expandtree', function expandTree(ev) {
                var mGrid = ev.treeGrid, mData = ev.data;
                var members = [],
                    family = set.list[e.data.Membership][mData.fName];
                if (typeof family !== 'object') {
                    throw new Error('Family should be an object');
                }
                Object.keys(family).forEach(function (memberName) {
                    if (tt.memberNames.indexOf(memberName) === -1) { return; }
                    var member = family[memberName];
                    members.push({
                        memberName: memberName,
                        'Name': member.name,
                        'Diatonic': family.isDiatonic ? 'Diatonic' : 'Non-Diatonic',
                        'Chord Symbol': member.chordSymbol,
                        'Scale Formula': member.scaleFormula.join(', '),
                        'Set': member.set.join(', ')
                    });
                });
                mGrid.addEventListener('rendertext', function (e) {
                    if (e.cell.style === 'rowHeaderCell') {
                        e.cell.formattedValue = tt.romanize(tt.memberNames.indexOf(this.data[e.cell.rowIndex].memberName) + 1);
                    }
                });
                mGrid.data = members;
                mGrid.schema = createSchema({
                    data: members,
                    hidden: ['memberName', 'index', '_canvasDataGridUniqueId']
                });
            });
            fGrid.data = famlies;
            fGrid.schema = createSchema({
                data: famlies,
                hidden: ['fName', 'index', '_canvasDataGridUniqueId']
            });
        });
        grid.data = membership;
    }
    if (document.readyState === 'complete') {
        appendDom();
    } else {
        document.addEventListener('DOMContentLoaded', appendDom);
    }
    return;
});