// typings install jasmine --ambient

///<reference path="../typings/main/ambient/jasmine/jasmine.d.ts" />
///<reference path="xdom2jso.ts"/>

import convert = xdom2jso.convert;

var jso:any;
var url:string;

var xmlHttpRequest = new XMLHttpRequest();

describe('XML DOM object to JavaScript object conversion unit tests', () => {
    describe('Nested element XML conversion', () => {
        beforeAll(() => {
            url = "base/tst/nested.xml";
            jso = null;

            xmlHttpRequest.onreadystatechange = () => {
                if (4 == xmlHttpRequest.readyState) {
                    jso = convert(xmlHttpRequest.responseXML.documentElement);
                    console.log(JSON.stringify(jso));
                }
            };
            xmlHttpRequest.open("GET", url, false); // must be synchonous
            xmlHttpRequest.send(null);
        });

        it('should have returned a JavaScript object (jso)', () => {
            expect(jso).not.toBe(null);
        });

        it('should have a an "a" object at the "root" of the jso', () => {
            expect(jso.a).not.toBe(null);
            expect(jso.a).not.toBe(undefined);
            expect(jso.a.constructor).toEqual(Object);
        });

        it('should have a variety of short and long paths through the jso', () => {
            expect(jso.a.ac).not.toBe(null);
            expect(jso.a.ac).not.toBe(undefined);
            expect(jso.a.ac.constructor).toEqual(Object);

            expect(jso.a.ab.abc).not.toBe(null);
            expect(jso.a.ab.abc).not.toBe(undefined);
            expect(jso.a.ab.abc.constructor).toEqual(Object);

            expect(jso.a.aa.aac.aacc).not.toBe(null);
            expect(jso.a.aa.aac.aacc).not.toBe(undefined);
            expect(jso.a.aa.aac.aacc.constructor).toEqual(Object);

            expect(jso.a.ab.abc.abca).not.toBe(null);
            expect(jso.a.ab.abc.abca).not.toBe(undefined);
            expect(jso.a.ab.abc.abca.constructor).toEqual(Object);
        })
    });

    describe('XML document conversion with namespaces', () => {
        beforeAll(() => {
            url = "base/tst/LoginResponse.xml";
            jso = null;

            xmlHttpRequest.onreadystatechange = () => {
                if (4 == xmlHttpRequest.readyState) {
                    jso = convert(xmlHttpRequest.responseXML.documentElement);
                    console.log(JSON.stringify(jso));
                }
            };
            xmlHttpRequest.open("GET", url, false); // must be synchonous
            xmlHttpRequest.send(null);
        });

        it('should have returned a JavaScript object (jso)', () => {
            expect(jso).not.toBe(null);

            var visited:{}[] = [];
            var stack:{}[] = [{obj: jso, stack: ''}];

            while (0 < stack.length) {
                var item:any = stack.pop();
                var obj:{} = item.obj;

                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        if ("object" === typeof obj[property]) {
                            var alreadyFound:boolean = false;
                            for (var i:number = 0; i < visited.length; i++) {
                                if (visited[i] === obj[property]) {
                                    alreadyFound = true;
                                    break;
                                }
                            }
                            if (!alreadyFound) {
                                if ("_" != property) {
                                    expect(property.indexOf(':')).not.toEqual(-1); // tests for the presence of a namespace on the element name
                                }

                                visited.push(obj[property]);
                                stack.push({obj: obj[property], stack: item.stack + '.' + property});
                            }
                        }
                    }
                }
            }
        });
    });

    describe('XML document conversion without namespaces', () => {
        beforeAll(() => {
            url = "base/tst/LoginResponse.xml";
            jso = null;

            xmlHttpRequest.onreadystatechange = () => {
                if (4 == xmlHttpRequest.readyState) {
                    jso = convert(xmlHttpRequest.responseXML.documentElement, true);
                    console.log(JSON.stringify(jso));
                }
            };
            xmlHttpRequest.open("GET", url, false); // must be synchonous
            xmlHttpRequest.send(null);
        });

        it('should have returned a JavaScript object (jso)', () => {
            expect(jso).not.toBe(null);
            var visited:{}[] = [];
            var stack:{}[] = [{obj: jso, stack: ''}];

            while (0 < stack.length) {
                var item:any = stack.pop();
                var obj:{} = item.obj;

                for (var property in obj) {
                    if (obj.hasOwnProperty(property)) {
                        if ("object" === typeof obj[property]) {
                            var alreadyFound:boolean = false;
                            for (var i:number = 0; i < visited.length; i++) {
                                if (visited[i] === obj[property]) {
                                    alreadyFound = true;
                                    break;
                                }
                            }
                            if (!alreadyFound) {
                                if ("_" != property) {
                                    expect(property.indexOf(':')).toEqual(-1); // tests for the lack of a namespace on the element name
                                }

                                visited.push(obj[property]);
                                stack.push({obj: obj[property], stack: item.stack + '.' + property});
                            }
                        }
                    }
                }
            }
        });
    });

    describe('Multiplicity element XML conversion', () => {
        beforeAll(() => {
            url = "base/tst/multiple.xml";
            jso = null;

            xmlHttpRequest.onreadystatechange = () => {
                if (4 == xmlHttpRequest.readyState) {
                    jso = convert(xmlHttpRequest.responseXML.documentElement);
                    console.log(JSON.stringify(jso));
                }
            };
            xmlHttpRequest.open("GET", url, false); // must be synchonous
            xmlHttpRequest.send(null);
        });

        it('should have returned a JavaScript object (jso)', () => {
            expect(jso).not.toBe(null);
        });

        it('should have a an "a" object at the "root" of the jso', () => {
            expect(jso.a).not.toBe(null);
            expect(jso.a).not.toBe(undefined);
            expect(typeof jso.a).toEqual("object");
        });

        it('should have an "aa" object array of length 3 as the only child of the "a" object of the jso', () => {
            expect(jso.a.constructor).toBe(Object);
            expect(jso.a.aa).not.toBe(null);
            expect(jso.a.aa).not.toBe(undefined);
            expect(jso.a.aa.constructor).toEqual(Array);
            expect(jso.a.aa.length).toEqual(3);
        });

        it('should have an "a.aa[x].aaa" object array of length 3 as the only child of the "a.aa[x]" object of the jso', () => {
            for (var x:number = 0; 3 > x; ++x) {
                expect(jso.a.aa[x].aaa).not.toBe(null);
                expect(jso.a.aa[x].aaa).not.toBe(undefined);
                expect(jso.a.aa[x].aaa.constructor).toEqual(Array);
                expect(jso.a.aa[x].aaa.length).toEqual(3);
            }
        });

        it('should have an "a.aa[x].aaa[y].aaaa" object array of length 3 as the only child of the "a.aa[x].aaa[y]" object of the jso', () => {
            for (var x:number = 0; 3 > x; ++x) {
                for (var y:number = 0; 3 > y; ++y) {
                    expect(jso.a.aa[x].aaa[y].aaaa).not.toBe(null);
                    expect(jso.a.aa[x].aaa[y].aaaa).not.toBe(undefined);
                    expect(jso.a.aa[x].aaa[y].aaaa.constructor).toEqual(Array);
                    expect(jso.a.aa[x].aaa[y].aaaa.length).toEqual(3);
                }
            }
        });

        it('should have an "a.aa[x].aaa[y].aaaa[z]" object as the a child of the "a.aa[x].aaa[y]" object of the jso', () => {
            for (var x:number = 0; 3 > x; ++x) {
                for (var y:number = 0; 3 > y; ++y) {
                    for (var z:number = 0; 3 > z; ++z) {
                        expect(jso.a.aa[x].aaa[y].aaaa[z]).not.toBe(null);
                        expect(jso.a.aa[x].aaa[y].aaaa[z]).not.toBe(undefined);
                        expect(jso.a.aa[x].aaa[y].aaaa[z].constructor).toEqual(Object);
                    }
                }
            }
        });
    });

    describe('Complex XML conversion', () => {
        beforeAll(() => {
            url = "base/tst/complex.xml";
            jso = null;

            xmlHttpRequest.onreadystatechange = () => {
                if (4 == xmlHttpRequest.readyState) {
                    jso = convert(xmlHttpRequest.responseXML.documentElement);
                    console.log(JSON.stringify(jso));
                }
            };
            xmlHttpRequest.open("GET", url, false); // must be synchonous
            xmlHttpRequest.send(null);
        });

        it('should have returned a JavaScript object (jso)', () => {
            expect(jso).not.toBe(null);
        });

        it('should pass negative tests', () => {
            expect(jso.x).toBe(undefined);
            expect(jso.envelope.xml.blah).toBe(undefined);
        });

        it('should have an "envelope" object at the "root" of the jso', () => {
            expect(jso.envelope).not.toBe(null);
            expect(jso.envelope).not.toBe(undefined);
            expect(typeof jso.envelope).toEqual("object");
        });

        it('should have an array of 3 "jso.envelope.xml.messageList.message" objects', () => {
            expect(jso.envelope.xml.messageList.message.constructor).toBe(Array);
            expect(jso.envelope.xml.messageList.message.length).toBe(3);
        });

        it('should have arrays of "jso.envelope.xml.messageList.message[x].billing.taxRouting.jurisdiction" objects', () => {
            for (var x:number = 0; 3 > x; ++x) {
                expect(jso.envelope.xml.messageList.message[x].billing.taxRouting.jurisdiction.constructor).toBe(Array);
                expect(jso.envelope.xml.messageList.message[x].billing.taxRouting.jurisdiction.length).toBeGreaterThan(0);
            }
        });

        it('should have a text value for "jso.envelope.xml.messageList', () => {
            expect(jso.envelope.xml.messageList.$).not.toBe(undefined);
            expect(jso.envelope.xml.messageList.$).not.toBe(null);
            expect(jso.envelope.xml.messageList.$.length).toBeGreaterThan(0);

        });

        it('should have a text value for all "jso.envelope.xml.messageList.message[x].id" objects', () => {
            for (var x:number = 0; 3 > x; ++x) {
                expect(+jso.envelope.xml.messageList.message[x].id.$).toEqual(x + 1); // note: the string is coerced to a number
            }
        });

        it('should have attributes on the "jso.envelope.xml.messageList.message[x]" objects', () => {
            for (var x:number = 0; 3 > x; ++x) {
                expect(jso.envelope.xml.messageList.message[x]._).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x]._).not.toBe(null);
                expect(jso.envelope.xml.messageList.message[x]._.viewed).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x]._.viewed).not.toBe(null);
                expect(jso.envelope.xml.messageList.message[x]._.urgent).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x]._.urgent).not.toBe(null);
                expect(jso.envelope.xml.messageList.message[x]._.content).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x]._.content).not.toBe(null);
            }
        });

        it('should have attributes on the "jso.envelope.xml.messageList.message[x].billing.metrics" objects', () => {
            for (var x:number = 0; 3 > x; ++x) {
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._).not.toBe(null);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.characterCount).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.characterCount).not.toBe(null);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.byteCount).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.byteCount).not.toBe(null);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.networkHops).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.networkHops).not.toBe(null);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.rebroadcastCount).not.toBe(undefined);
                expect(jso.envelope.xml.messageList.message[x].billing.metrics._.rebroadcastCount).not.toBe(null);
            }
        });
    });
});

// https://github.com/Microsoft/TypeScript-Handbook