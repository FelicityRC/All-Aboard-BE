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
  describe("/api/games/:game_id", () => {
    describe("Functionality", () => {
      it("status: 200, responds with the specified game object", () => {
        return request(app)
          .get("/api/games/1")
          .expect(200)
          .then(({ body: { game } }) => {
            expect(game).toBeInstanceOf(Object);
            expect(game).toEqual({
              game_id: 1,
              name: "root",
              description:
                " Find adventure in this marvelous asymmetric game. Root provides limitless replay value as you and your friends explore the unique factions all wanting to rule a fantastic forest kingdom. Play as the Marquise de Cat and dominate the woods, extracting its riches and policing its inhabitants, as the Woodland Alliance, gathering supporters and coordinate revolts against the ruling regime, the Eyrie Dynasties, regaining control of the woods while keeping your squabbling court at bay, or as the Vagabond, seeking fame and fortune as you forge alliances and rivalries with the other players. Each faction has its own play style and paths to victory, providing an immersive game experience you will want to play again and again. ",
              image_url:
                "https://s3-us-west-1.amazonaws.com/5cc.images/games/uploaded/1540147295104",
              min_players: 2,
              max_players: 4,
              rules_url:
                "https://drive.google.com/drive/folders/1i9-iCUDzfGMs7HjFHhahwMS6efvvfX5w",
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/games/words")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("game_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/games/-10")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("game_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/games/12.5")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("game_id must be a positive integer");
          });
      });
      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/games/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Game Not Found");
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
