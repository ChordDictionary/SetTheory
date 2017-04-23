/*jslint browser: true*/
/*globals define: false */
define([
    '../set',
    'canvas-datagrid'
], function (set, canvasDatagrid) {
    'use strict';
    var container = document.createElement('div'),
        grid;
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
        var membership = [];
        Object.keys(set.list).forEach(function (mName) {
            membership.push({
                'Membership': mName
            });
        });
        grid.addEventListener('expandtree', function expandTree(fGrid, data, rowIndex) {
            var famlies = [];
            Object.keys(set.list[data.Membership]).forEach(function (fName) {
                famlies.push({
                    'Family': fName
                });
            });
            fGrid.attributes.tree = true;
            fGrid.addEventListener('expandtree', function expandTree(mGrid, mData, rowIndex) {
                var members = [];
                Object.keys(set.list[data.Membership][mData.Family]).forEach(function (mName) {
                    var member = set.list[data.Membership][mData.Family][mName];
                    members.push({
                        'Member Name': mName,
                        'Name': member.name,
                        'Simple': member.simple,
                        'Chord Symbol': member.chordSymbol,
                        'Scale Formula': member.scaleFormula.join(),
                        'Set': member.set.join()
                    });
                });
                mGrid.data = members;
            });
            fGrid.data = famlies;

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