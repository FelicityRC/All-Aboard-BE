const request = require("supertest");
const app = require("../app");
const db = require("../database/connection");
const data = require("../database/data/test-data");
const seed = require("../database/seeds/seed");

afterAll(() => {
  if (db.end) db.end();
});

beforeEach(() => {
  return seed(data);
});

describe("GET", () => {
  describe("/api/users", () => {
    describe("Functionality", () => {
      it("status: 200, responds with an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(2);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  username: expect.any(String),
                  name: expect.any(String),
                  email: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/users/:user_id", () => {
    describe("Functionality", () => {
      it("status: 200, responds with the specified user object", () => {
        return request(app)
          .get("/api/users/1")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toBeInstanceOf(Object);
            expect(user).toEqual({
              user_id: 1,
              username: "BigJ",
              name: "Joe",
              email: "joefuller042@gmail.com",
              friends: null,
              fav_games: null,
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/words")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/-10")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/12.5")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/users/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Not Found");
          });
      });
    });
  });
  describe("/api/games", () => {
    describe("Functionality", () => {
      it("status: 200, responds with an array of games", () => {
        return request(app)
          .get("/api/games")
          .expect(200)
          .then(({ body: { games } }) => {
            expect(games).toBeInstanceOf(Array);
            games.forEach((game) => {
              expect(game).toEqual(
                expect.objectContaining({
                  name: expect.any(String),
                  description: expect.any(String),
                  image_url: expect.any(String),
                  min_players: expect.any(Number),
                  max_players: expect.any(Number),
                  // some rules_urls are null
                  //   rules_url: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
});

describe("Error Handling", () => {
  it("status: 404, Not Found", () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});
