'use strict';

// Testing Dependencies
const server = require('../../lib/server');
const Gallery = require('../../model/gallery');
const superagent = require('superagent');
const mocks = require('../lib/mocks');
const faker = require('faker');
require('jest');

// Test Variables
let port = process.env.PORT;
let api = `:${port}/api/v1/gallery`;

describe('Server module', () => {
  beforeAll(() => server.start(port, () => console.log(`listening on ${port}`)));
  beforeAll(() => mocks.auth.createOne().then(mock => this.mockUser = mock));
  afterAll(() => server.stop());
  afterAll(() => {
    mocks.gallery.removeAll();
    mocks.auth.removeAll();
  });

  describe.only('POST /api/v1/gallery', () => {
    it('Should return a valid gallery', () => {
      return mocks.gallery.createOne()
        .then(mock => {
          return superagent.post(`${api}`)
            .set('Authorization', `Bearer ${mock.token}`)
            .send({
              name: faker.lorem.word(),
              description: faker.lorem.words(20),
            });
        })
        .then(res => {
          console.log(res);
          
          expect(res.status).toBe(201);
            
          expect(res.body).toBeInstanceOf(Gallery);
        });
    });
        
    // describe('Invalid Routes/Data', () => {
    //   it('Should respond with an authorization failure if missing a password, username, or email', () => {
    //     return superagent.post(`${api}`)
    //       .send()
    //       .catch(err => {
    //         this.error = err;
    //         expect(err.response.text).toMatch(/Authorization/);
    //       });
    //   });
    //   it('Should respond a 401 for missing required information', () => {
    //     expect(this.error.status).toBe(401);
    //   });
    // });
  });
  // describe('GET /api/v1/gallery', () => {
  //   beforeAll(() => {
  //     return superagent.get(`${api}`)
  //       .authBearer(this.mockGallery.token)
  //       .then(res => this.response = res);
  //   });
  //   describe('Valid Routes/Data', () => {
  //     it('Should respond with a status 200', () => {
  //       expect(this.response.status).toBe(200);
  //     });
  //     it('Should respond with a valid token', () => {
  //       expect(Array.isArray(this.response.body)).toBeTruthy();
  //     });
  //   });

  //   describe('Invalid Routes/Data', () => {
  //     it('Should respond a not found or path error when given an incorrect path', () => {
  //       return superagent.get(`${api}`)
  //         .catch(err => {
  //           this.error = err;
  //           expect(err.response.text).toMatch(/Authorization/);
  //         });
  //     });
  //     it('Should respond a 401 bad path when given an incorrect path', () => {
  //       expect(this.error.status).toBe(401);
  //     });
  //   });
  // });
  // describe('GET /api/v1/gallery/:id?', () => {
  //   beforeAll(() => {
  //     return superagent.get(`${api}${this.mockGallery.gallery._id}`)
  //       .authBearer(this.mockGallery.token)
  //       .then(res => this.response = res);
  //   });
  //   describe('Valid Routes/Data', () => {
  //     it('Should respond with a status 200', () => {
  //       expect(this.response.status).toBe(200);
  //     });
  //     it('Should respond with a valid token', () => {
  //       expect(this.response.body).toBeInstanceOf(Gallery);
  //     });
  //   });

  //   describe('Invalid Routes/Data', () => {
  //     it('Should respond a not found or path error when given an incorrect path', () => {
  //       return superagent.get(`${api}${this.mockGallery.gallery._id}`)
  //         .catch(err => {
  //           this.error = err;
  //           expect(err.response.text).toMatch(/Authorization/);
  //         });
  //     });
  //     it('Should respond a 401 bad path when given an incorrect path', () => {
  //       expect(this.error.status).toBe(401);
  //     });
  //   });
  // });
});