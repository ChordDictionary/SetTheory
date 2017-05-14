/*jslint */
/*global define*/
define(['../set'], function (set) {
    'use strict';
    var self = {
        memberNames: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'],
        pitchClasses: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        noteNames: ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'],
        cirlceOfFifths: [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5],
        siblingNames: 'abcdefghijkl',
        intervals: {
            "Minor 2": 1,
            "Major 2": 2,
            "Minor 3": 3,
            "Major 3": 4,
            "Perfect 4": 5,
            "Augmented 4 / Diminished 5": 6,
            "Perfect 5": 7,
            "Minor 6": 8,
            "Major 6": 9,
            "Minor 7": 10,
            "Major 7": 11
        },
        tunings: {
            guitarStandard: [4, 11, 7, 2, 9, 4],
            dropD: [4, 11, 7, 2, 9, 2],
            openD: [2, 9, 6, 2, 9, 2],
            doubleDropD: [2, 11, 7, 2, 9, 2],
            dropDandG: [4, 11, 7, 2, 7, 2],
            "standard(Eb)": [3, 10, 6, 1, 8, 3],
            "standard(D)": [2, 9, 5, 0, 7, 2],
            "standard(C#)": [1, 8, 4, 11, 6, 1],
            "standard(C)": [0, 7, 3, 10, 5, 0],
            "standard(B)": [11, 6, 2, 9, 4, 11],
            "standard(Bb)": [10, 5, 1, 8, 3, 10],
            "baritoneGuitar(A)": [9, 2, 7, 0, 4, 9],
            dropC: [2, 9, 5, 0, 7, 0],
            "dropC#": [3, 10, 6, 1, 8, 1],
            openG: [2, 11, 7, 2, 7, 2],
            openE: [4, 11, 8, 4, 11, 4],
            openC: [4, 0, 7, 0, 7, 4],
            DADGAD: [2, 9, 7, 2, 9, 2],
            frippNewStandard: [7, 4, 9, 2, 7, 0],
            sevenStringGuitar: [4, 11, 7, 2, 9, 4, 11],
            bass: [7, 2, 9, 4],
            fiveStringBass: [7, 2, 9, 4, 11],
            sixStringBass: [0, 7, 2, 9, 4, 11],
            mandolin: [4, 9, 2, 7],
            mandola: [9, 2, 7, 0],
            fiveStringMandolin: [4, 9, 2, 7, 0],
            ukeleleStandard: [9, 4, 0, 7],
            sopranoUkelele: [11, 6, 2, 9],
            baritoneUkelele: [4, 11, 7, 2],
            fiveStringBanjo: [2, 11, 7, 2, 7],
            balalaikaPrima: [9, 4, 4],
            balalaikaSecunda: [2, 9, 9],
            balalaikaBass: [2, 9, 4],
            cubanTres: [4, 0, 7],
            bouzouki: [2, 9, 5, 0],
            threeCourseBouzouki: [0, 9, 0],
            irishBouzouki: [0, 9, 0, 7],
            oud: [0, 7, 2, 9, 7, 2],
            rabab: [2, 9, 4]
        }
    };
    self.isSubsetOf = function (searchFor, searchIn) {
        var isSubset = true, x;
        for (x = 0; x < searchFor.length; x += 1) {
            if (searchIn.indexOf(searchFor[x]) === -1) {
                return false;
            }
        }
        return isSubset;
    };
    self.normalizeChord = function (c) {
        var x, chord = c.slice();
        while (chord[0] % 12 !== 0) {
            for (x = 0; x < chord.length; x += 1) {
                chord[x] += 1;
            }
        }
        return chord.map(function (i) {
            return i % 12;
        });
    };
    self.isDiatonic = function (family) {
        var nonDiatonic = false,
            nonDiatonicTriads = [];
        Object.keys(family).forEach(function (memberName) {
            if (self.memberNames.indexOf(memberName) === -1) { return; }
            var chord = self.normalizeChord(family[memberName].set);
            Object.keys(set.list.triads).forEach(function (triad) {
                if (!set.list.triads[triad].diatonic) {
                    nonDiatonicTriads.push(set.list.triads[triad]);
                }
            });
            nonDiatonicTriads.forEach(function (nonDiatonicTriad) {
                Object.keys(nonDiatonicTriad).forEach(function (memberName) {
                    if (self.memberNames.indexOf(memberName) === -1) { return; }
                    var x, triad = nonDiatonicTriad[memberName].set;
                    for (x = 0; x < chord.length; x += 1) {
                        if (!nonDiatonic) {
                            nonDiatonic = self.isSubsetOf(triad, chord);
                        }
                    }
                });
            });
        });
        return !nonDiatonic;
    };
    self.romanize = function (num) {
        var digits = String(+num).split(""),
            key = ["", "C", "CC", "CCC", "CD", "D", "DC", "DCC", "DCCC", "CM",
                   "", "X", "XX", "XXX", "XL", "L", "LX", "LXX", "LXXX", "XC",
                   "", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"],
            roman = "",
            i = 3;
        while (i--) {
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        }
        return Array(+digits.join("") + 1).join("M") + roman;
    };
    self.membersRomanMap = {};
    Object.keys(set.list).forEach(function (member, index) {
        self.membersRomanMap[member] = self.romanize(index);
    });
    return self;
});
