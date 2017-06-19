const request = require('supertest-as-promised');
const expect = require('expect');
const assert = require('assert');

const config = require('./../config.js');

describe('GET /applications', () => {

    it('should check the response code and content type', (done) => {
        request(config.applicationsURI)
            .get('/')
            .expect(200)
            .expect((res) => {
                expect('content-type\': \'hal+json; charset=utf-8')
            })
            .end(done)
    });

    it('should assert the names in applications', (done) => {
        request(config.applicationsURI)
            .get('/')
            .expect((res) => {
                const data = JSON.parse(res.text)._embedded
                expect(data.applications[0].name).toBe('oneABC');
                expect(data.applications[1].name).toBe('appTwo');
            }).end(done);
    });

    it('should validate the number of objects is equal to count', (done) => {
        request(config.applicationsURI)
            .get('/')
            .expect((res) => {
                const data = JSON.parse(res.text)._embedded;
                expect(JSON.parse(res.text).count).toEqual(2);

                expect((JSON.parse(res.text)._embedded.applications).length).toEqual(JSON.parse(res.text).count);
            }).end(done);
    });

    it('should validate the _embedded object structure', (done) => {
        request(config.applicationsURI)
            .get('/')
            .expect((res) => {
                const data = JSON.parse(res.text)._embedded;
                expect(data.applications[0]._links.self.href)
                expect(data.applications[0]._links['terminus:just_in'].href);
                expect(data.applications[0]._links['terminus:topics'].href);
                expect(data.applications[0].name);

                expect(data.applications[1]._links.self.href);
                expect(data.applications[1].name);
            }).end(done);
    });

    it('should validate the _links object structure', (done) => {
        request(config.applicationsURI)
            .get('/')
            .expect((res) => {
                const data = JSON.parse(res.text);
                expect(data._links.curies);
                expect(data._links.curies.href);
                expect(data._links.curies.name);
                expect(data._links.curies.templated);

                expect(data._links.self);
                expect(data._links.self.href);
            }).end(done);
    });

    it('should navigate to applications self url', () => {
        return request(config.applicationsURI)
            .get('/')
            .expect(200)
            .then((res) => {
                var selfHrefOneAbc = JSON.parse(res.text)._embedded.applications[0]._links.self.href;
                request(config.applicationsURI + selfHrefOneAbc)
                    .get('/')
                    .expect(200)

                return res;
            }).then((res) => {
                var selfHrefAppTwo = JSON.parse(res.text)._embedded.applications[1]._links.self.href;
                return request(config.applicationsURI + selfHrefAppTwo)
                    .get('/')
                    .expect(200)
            })
    });

    it('should navigate to applications junt-in and topics url', () => {
        return request(config.applicationsURI)
            .get('/')
            .expect(200)
            .then((res) => {
                var just_in = JSON.parse(res.text)
                    ._embedded.applications[0]
                    ._links['terminus:just_in'].href
                    .substr(27, 8);

                request(config.apiURI)
                    .get('/just_in')
                    .expect(200)

                return res;
            })
            .then((res) => {
                var topics = JSON.parse(res.text)
                    ._embedded.applications[0]
                    ._links['terminus:topics'].href
                    .substr(27, 7);

                return request(config.apiURI)
                    .get('/topics')
                    .expect(200)
            })
    })

    // it.only('should navigate to applications junt-in and topics url', () => {
    //     return request(config.applicationsURI)
    //         .get('/')
    //         .expect(200)
    //         .then((res) => {

    //             var just_in = JSON.parse(res.text)
    //                 ._embedded.applications[0]
    //                 ._links['terminus:just_in'].href
    //                 .substr(27, 8);

    //             console.log('Hello');
    //             return request(config.apiURI)
    //                 .get('/just_in')
    //                 .expect(404)



    //         })
    //         .then((res) => {
    //             console.log("sucess")
    //         })


    // })
});