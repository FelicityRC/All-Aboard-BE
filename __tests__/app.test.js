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
  describe("/api", () => {
    describe("Functionality", () => {
      it("status: 200, returns JSON describing all endpoints of the api", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body: { api } }) => {
            expect(api).toBeInstanceOf(Object);
          });
      });
    });
  });
  describe("/api/users", () => {
    describe("Functionality", () => {
      it("status: 200, responds with an array of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeInstanceOf(Array);
            expect(users).toHaveLength(3);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  uid: expect.any(String),
                  username: expect.any(String),
                  location: expect.any(String),
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
              uid: expect.any(String),
              username: "BigJ",
              location: "Liverpool",
              games: expect.any(Array),
              groups: expect.any(Array),
              events: expect.any(Array),
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
  describe("/api/users/:user_id/games", () => {
    describe("Functionality", () => {
      it("status: 200, responds with the specified users fav_games objects", () => {
        return request(app)
          .get("/api/users/1/games")
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
    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/words/games")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/-10/games")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/12.5/games")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/users/999/games")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Not Found");
          });
      });
    });
  });
  describe("/api/users/:user_id/events", () => {
    describe("Functionality", () => {
      it("status: 200, responds with all events the specified user is attending", () => {
        return request(app)
          .get("/api/users/1/events")
          .expect(200)
          .then(({ body: { events } }) => {
            expect(events).toBeInstanceOf(Array);
            events.forEach((event) => {
              expect(event).toEqual(
                expect.objectContaining({
                  event_id: expect.any(Number),
                  title: expect.any(String),
                  description: expect.any(String),
                  latitude: expect.any(String),
                  longitude: expect.any(String),
                  area: expect.any(String),
                  date: expect.any(String),
                  start_time: expect.any(String),
                  duration: expect.any(Number),
                  visibility: expect.any(Boolean),
                  willing_to_teach: expect.any(Boolean),
                  max_players: expect.any(Number),
                })
              );
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/words/events")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/-10/events")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/users/12.5/events")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });
    });
  });
  describe("/api/users/uidLookup/:uid", () => {
    describe("Functionality", () => {
      it("status: 200, responds with a user_id", () => {
        return request(app)
          .get("/api/users/uidLookup/1")
          .expect(200)
          .then(({ body: { user_id } }) => {
            expect(user_id).toBe(1);
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/users/uidLookup/fakeuid")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("UID Not Found");
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
  describe("/api/events", () => {
    describe("Functionality", () => {
      it("status: 200, responds with an array of events", () => {
        return request(app)
          .get("/api/events")
          .expect(200)
          .then(({ body: { events } }) => {
            expect(events).toBeInstanceOf(Array);
            expect(events).toHaveLength(3);
            events.forEach((event) => {
              expect(event).toEqual(
                expect.objectContaining({
                  event_id: expect.any(Number),
                  title: expect.any(String),
                  description: expect.any(String),
                  latitude: expect.any(String),
                  longitude: expect.any(String),
                  area: expect.any(String),
                  date: expect.any(String),
                  start_time: expect.any(String),
                  duration: expect.any(Number),
                  visibility: expect.any(Boolean),
                  willing_to_teach: expect.any(Boolean),
                  max_players: expect.any(Number),
                  games: expect.any(Array),
                  guests: expect.any(Number),
                  organiser: expect.any(String),
                })
              );
            });
          });
      });
    });
  });
  describe("/api/events/:event_id", () => {
    describe("Functionality", () => {
      it("status: 200, responds with the specified event object", () => {
        return request(app)
          .get("/api/events/2")
          .expect(200)
          .then(({ body: { event } }) => {
            expect(event).toBeInstanceOf(Object);
            expect(event).toEqual({
              event_id: 2,
              title: "Liverpool MeetUp",
              description: "The actual, real, real boardgamemeetup",
              latitude: "53.400002",
              longitude: "-2.983333",
              area: "Liverpool",
              date: expect.any(String),
              start_time: "14:30:00",
              duration: 120,
              visibility: true,
              willing_to_teach: false,
              games: ["azul", "gloomhaven", "terraforming-mars"],
              guests: expect.any(Array),
              max_players: 5,
              organiser: "Little J",
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/hello")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/-50")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/10.5")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/events/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Event Not Found");
          });
      });
    });
  });
  describe("/api/events/:event_id/users", () => {
    describe("Functionality", () => {
      it("status: 200, responds with an array of users attending the specified event", () => {
        return request(app)
          .get("/api/events/2/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toBeInstanceOf(Array);
            users.forEach((user) => {
              expect(user).toEqual(
                expect.objectContaining({
                  user_id: expect.any(Number),
                  uid: expect.any(String),
                  username: expect.any(String),
                  location: expect.any(String),
                })
              );
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/hello/users")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/-50/users")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/10.5/users")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/events/999/users")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Event Not Found");
          });
      });
    });
  });
  describe("/api/events/:event_id/games", () => {
    describe("Functionality", () => {
      it("status: 200, responds with an array of games which will be provided at the specified event", () => {
        return request(app)
          .get("/api/events/2/games")
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
                  // rules_url: expect.any(String).OR.expect.any(null),
                })
              );
            });
          });
      });
    });

    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/howdy/games")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });

      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/-200/games")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });

      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/events/6.5/games")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });

      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/events/4321/games")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Event Not Found");
          });
      });
    });
  });
  describe("/api/groups", () => {
    describe("Functionality", () => {
      it("status: 200, responds with an array of groups", () => {
        return request(app)
          .get("/api/groups")
          .expect(200)
          .then(({ body: { groups } }) => {
            expect(groups).toBeInstanceOf(Array);
            expect(groups).toHaveLength(2);
            groups.forEach((group) => {
              expect(group).toEqual(
                expect.objectContaining({
                  group_id: expect.any(Number),
                  name: expect.any(String),
                  users: expect.any(Array),
                })
              );
            });
          });
      });
    });
  });

  describe("/api/groups/:group_id", () => {
    describe("Functionality", () => {
      it("status: 200, responds with the specified group object", () => {
        return request(app)
          .get("/api/groups/1")
          .expect(200)
          .then(({ body: { group } }) => {
            expect(group).toBeInstanceOf(Object);
            expect(group).toEqual({
              group_id: 1,
              name: "catbus",
              users: expect.any(Array),
            });
          });
      });
    });
    describe("Error Handling", () => {
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/groups/hello")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("group_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/groups/-50")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("group_id must be a positive integer");
          });
      });
      it("status: 400, Bad Request", () => {
        return request(app)
          .get("/api/groups/10.5")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("group_id must be a positive integer");
          });
      });
      it("status: 404, Not Found", () => {
        return request(app)
          .get("/api/groups/999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Group Not Found");
          });
      });
    });
  });
});

describe("POST", () => {
  describe("/api/users", () => {
    describe("Functionality", () => {
      it("status: 201, adds a new user and returns it", () => {
        return request(app)
          .post("/api/users")
          .send({
            uid: "4",
            username: "Facility",
            location: "Manchester",
          })
          .expect(201)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              uid: "4",
              user_id: 4,
              username: "Facility",
              location: "Manchester",
            });
          });
      });
    });

    describe("Error Handling", () => {
      it("status: 400, missing required fields on body", () => {
        return request(app)
          .post("/api/users")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Missing Required Fields");
          });
      });
    });
  });

  describe("/api/users/:user_id/games", () => {
    describe("Functionality", () => {
      it("inserts a new game into userGames", () => {
        return request(app)
          .post("/api/users/1/games")
          .send({ game_id: 5 })
          .expect(201)
          .then(({ body: { userGame } }) => {
            expect(userGame).toEqual({
              user_id: 1,
              game_id: 5,
              usergames_id: 7,
            });
          });
      });
    });

    describe("Error Handling", () => {
      it("returns error 400 when game Id entered in incorrect type", () => {
        return request(app)
          .post("/api/users/1/games")
          .send({ game_id: "Hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("game_id must be a positive integer");
          });
      });
      it("status: 404, game Id does not exist", () => {
        return request(app)
          .post("/api/users/1/games")
          .send({ game_id: 99999 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Game Not Found");
          });
      });
      it("returns error 400 when user Id entered in incorrect type", () => {
        return request(app)
          .post("/api/users/hello/games")
          .send({ game_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 404, user Id does not exist", () => {
        return request(app)
          .post("/api/users/9999/games")
          .send({ game_id: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Not Found");
          });
      });
      it("status: 400, game already exists in user", () => {
        return request(app)
          .post("/api/users/1/games")
          .send({game_id: 1})
          .expect(400)
          .then(({body: {msg}}) => {
            expect(msg).toBe("Game is already included")
          })
      })
    });
  });
  describe("/api/events", () => {
    describe("Functionality", () => {
      it("status: 201, adds a new event and returns it", () => {
        return request(app)
          .post("/api/events")
          .send({
            user_id: 1,
            title: "Be There or Be Square",
            longitude: "-2.983333",
            latitude: "53.400002",
            area: "Didsbury",
            date: "2021-01-18T00:00:00.000Z",
            start_time: "12:00:00",
            max_players: 5,
          })
          .expect(201)
          .then(({ body: { event } }) => {
            expect(event).toEqual({
              event_id: 4,
              title: "Be There or Be Square",
              description: null,
              latitude: "53.400002",
              longitude: "-2.983333",
              area: "Didsbury",
              date: "2021-01-18T00:00:00.000Z",
              start_time: "12:00:00",
              duration: null,
              visibility: true,
              willing_to_teach: false,
              max_players: 5,
            });
          });
      });
    });

    describe("Error Handling", () => {
      it("status: 400, missing required fields on body", () => {
        return request(app)
          .post("/api/events")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Missing Required Fields");
          });
      });
    });
  });
  describe("/api/events/:event_id/users", () => {
    describe("Functionality", () => {
      it("inserts a new user into userEvents", () => {
        return request(app)
          .post("/api/events/3/users")
          .send({ user_id: 1 })
          .expect(201)
          .then(({ body: { userEvent } }) => {
            expect(userEvent).toEqual({
              event_id: 3,
              organiser: false,
              user_id: 1,
              userevents_id: 6,
            });
          });
      });
    });

    describe("Error Handling", () => {
      it("returns error 400 when user Id entered in incorrect type", () => {
        return request(app)
          .post("/api/events/1/users")
          .send({ user_id: "Hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 404, user Id does not exist", () => {
        return request(app)
          .post("/api/events/1/users")
          .send({ user_id: 9999 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Not Found");
          });
      });
      it("returns error 400 when event Id entered in incorrect type", () => {
        return request(app)
          .post("/api/events/hello/users")
          .send({ user_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 404, event Id does not exist", () => {
        return request(app)
          .post("/api/events/9999/users")
          .send({ user_id: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Event Not Found");
          });
      });
      it("status: 400, user already exists in event", () => {
        return request(app)
          .post("/api/events/1/users")
          .send({user_id: 1})
          .expect(400)
          .then(({body: {msg}}) => {
            expect(msg).toBe("User is already included")
          })
      })
    });
  });
  describe("/api/events/:event_id/games", () => {
    describe("Functionality", () => {
      it("inserts a new game into eventGames", () => {
        return request(app)
          .post("/api/events/1/games")
          .send({ game_id: 5 })
          .expect(201)
          .then(({ body: { eventGame } }) => {
            expect(eventGame).toEqual({
              event_id: 1,
              game_id: 5,
              eventgames_id: 7,
            });
          });
      });
    });

    describe("Error Handling", () => {
      it("returns error 400 when game Id entered in incorrect type", () => {
        return request(app)
          .post("/api/events/1/games")
          .send({ game_id: "Hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("game_id must be a positive integer");
          });
      });
      it("status: 404, game Id does not exist", () => {
        return request(app)
          .post("/api/events/1/games")
          .send({ game_id: 99999 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Game Not Found");
          });
      });
      it("returns error 400 when event Id entered in incorrect type", () => {
        return request(app)
          .post("/api/events/hello/games")
          .send({ game_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("event_id must be a positive integer");
          });
      });
      it("status: 404, event Id does not exist", () => {
        return request(app)
          .post("/api/events/9999/games")
          .send({ game_id: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Event Not Found");
          });
      });
      it("status: 400, game already exists in event", () => {
        return request(app)
          .post("/api/events/1/games")
          .send({game_id: 1})
          .expect(400)
          .then(({body: {msg}}) => {
            expect(msg).toBe("Game is already included")
          })
      })
    });
  });
  describe("/api/groups/:group_id/users", () => {
    describe("Functionality", () => {
      it("inserts a new user into userGroups", () => {
        return request(app)
          .post("/api/groups/1/users")
          .send({ user_id: 3 })
          .expect(201)
          .then(({ body: { userGroup } }) => {
            expect(userGroup).toEqual({
              group_id: 1,
              organiser: false,
              user_id: 3,
              usergroups_id: 5,
            });
          });
      });
    });

    describe("Error Handling", () => {
      it("returns error 400 when user Id entered in incorrect type", () => {
        return request(app)
          .post("/api/groups/1/users")
          .send({ user_id: "Hello" })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("user_id must be a positive integer");
          });
      });
      it("status: 404, user Id does not exist", () => {
        return request(app)
          .post("/api/groups/1/users")
          .send({ user_id: 9999 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Not Found");
          });
      });
      it("returns error 400 when group Id entered in incorrect type", () => {
        return request(app)
          .post("/api/groups/hello/users")
          .send({ user_id: 1 })
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe("group_id must be a positive integer");
          });
      });
      it("status: 404, group Id does not exist", () => {
        return request(app)
          .post("/api/groups/9999/users")
          .send({ user_id: 1 })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Group Not Found");
          });
      });
      it("status: 400, user already exists in group", () => {
        return request(app)
          .post("/api/groups/1/users")
          .send({user_id: 1})
          .expect(400)
          .then(({body: {msg}}) => {
            expect(msg).toBe("User is already included")
          })
      })
    });
  });
});

describe("PATCH", () => {
  describe("/api/users/:user_id", () => {
    describe("Functionality", () => {
      it("status: 200, updates the values of a specified user and returns updated user", () => {
        return request(app)
          .patch("/api/users/1")
          .send({ username: "BIGj" })
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              user_id: 1,
              uid: "1",
              username: "BIGj",
              location: "Liverpool",
            });
          });
      });
      it("status: 200, ignores extra keys on body", () => {
        return request(app)
          .patch("/api/users/1")
          .send({ location: "Somewhere else", something_else: "aaaahhh" })
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              user_id: 1,
              uid: "1",
              username: "BigJ",
              location: "Somewhere else",
            });
          });
      });
      // it("status: 200, allows inc_games and inc_friends properties", () => {
      //   return request(app)
      //     .patch("/api/users/1")
      //     .send({ inc_games: [4], inc_friends: [1, 2] })
      //     .expect(200)
      //     .then(({ body: { user } }) => {
      //       expect(user).toEqual({
      //         user_id: 1,
      //         username: "BigJ",
      //         location: "Liverpool",
      //       });
      //     });
      // });

      // it("status: 200, allows out_games and out_friends properties", () => {
      //   return request(app)
      //     .patch("/api/users/1")
      //     .send({ out_games: [2, 1], out_friends: [5] })
      //     .expect(200)
      //     .then(({ body: { user } }) => {
      //       expect(user).toEqual({
      //         user_id: 1,
      //         username: "BigJ",
      //         name: "Joe",
      //         email: "joefuller042@gmail.com",
      //         location: "Liverpool",
      //         fav_games: [3],
      //         friends: [],
      //       });
      //     });
      // });
    });

    describe("Error Handling", () => {
      it("status: 400, Bad Request when no body", () => {
        return request(app)
          .patch("/api/users/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });

      it("status: 400, invalid user_id", () => {
        return request(app)
          .patch("/api/users/cat")
          .send({ username: "newName" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("user_id must be a positive integer");
          });
      });

      it("status: 404, user_id not found", () => {
        return request(app)
          .patch("/api/users/99999")
          .send({ username: "testName" })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("User Not Found");
          });
      });
    });
  });

  describe("/api/events/:event_id", () => {
    describe("Functionality", () => {
      it("status: 200, updates values of a specific event and returns the updated event ", () => {
        return request(app)
          .patch("/api/events/2")
          .send({ start_time: "16:15:00" })
          .expect(200)
          .then(({ body: { event } }) => {
            expect(event).toEqual({
              event_id: 2,
              title: "Liverpool MeetUp",
              description: "The actual, real, real boardgamemeetup",
              latitude: "53.400002",
              longitude: "-2.983333",
              area: "Liverpool",
              date: "2021-01-18T00:00:00.000Z",
              start_time: "16:15:00",
              duration: 120,
              visibility: true,
              willing_to_teach: false,
              max_players: 5,
            });
          });
      });

      it("status: 200, ignores extra keys on body and returns updated event ", () => {
        return request(app)
          .patch("/api/events/2")
          .send({ visibility: false, bannedUsers: "Bob Smith" })
          .expect(200)
          .then(({ body: { event } }) => {
            expect(event).toEqual({
              event_id: 2,
              title: "Liverpool MeetUp",
              description: "The actual, real, real boardgamemeetup",
              latitude: "53.400002",
              longitude: "-2.983333",
              area: "Liverpool",
              date: "2021-01-18T00:00:00.000Z",
              start_time: "14:30:00",
              duration: 120,
              visibility: false,
              willing_to_teach: false,
              max_players: 5,
            });
          });
      });
      // it("status: 200, allows inc_games and inc_guests properties", () => {
      //   return request(app)
      //     .patch("/api/events/2")
      //     .send({ inc_games: [4], inc_guests: [10, 20] })
      //     .expect(200)
      //     .then(({ body: { event } }) => {
      //       expect(event).toEqual({
      //         event_id: 2,
      //         title: "Liverpool MeetUp",
      //         description: "The actual, real, real boardgamemeetup",
      //         latitude: "53.400002",
      //         longitude: "-2.983333",
      //         area: "Liverpool",
      //         date: "2021-01-18T00:00:00.000Z",
      //         start_time: "14:30:00",
      //         duration: 120,
      //         visibility: true,
      //         willing_to_teach: false,
      //         max_players: 5
      //       });
      //     });
      // });

      // it("status: 200, allows out_games and out_guests properties", () => {
      //   return request(app)
      //     .patch("/api/events/2")
      //     .send({ out_games: [27], out_guests: [1, 2] })
      //     .expect(200)
      //     .then(({ body: { event } }) => {
      //       expect(event).toEqual({
      //         event_id: 2,
      //         title: "Liverpool MeetUp",
      //         description: "The actual, real, real boardgamemeetup",
      //         latitude: "53.400002",
      //         longitude: "-2.983333",
      //         area: "Liverpool",
      //         date: "2021-01-18T00:00:00.000Z",
      //         start_time: "14:30:00",
      //         duration: 120,
      //         visibility: true,
      //         willing_to_teach: false,
      //       });
      //     });
      // });
    });

    describe("Error Handling", () => {
      it("status: 400, Bad Request when no body", () => {
        return request(app)
          .patch("/api/events/1")
          .send({})
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Bad Request");
          });
      });

      it("status: 400, invalid event_id", () => {
        return request(app)
          .patch("/api/events/badger")
          .send({ start_time: "15:30:00" })
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });

      it("status: 404, event_id not found", () => {
        return request(app)
          .patch("/api/events/1111")
          .send({ start_time: "15:30:00" })
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Event Not Found");
          });
      });
    });
  });
});

describe("DELETE", () => {
  describe("/api/events/:event_id", () => {
    describe("Functionality", () => {
      it("status: 204, event deleted", () => {
        return request(app).delete("/api/events/1").expect(204);
      });
    });
    describe("Error Handling", () => {
      it("status: 404, event_id not found", () => {
        return request(app)
          .delete("/api/events/565656")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Event Not Found");
          });
      });
      it("status: 400, invalid event_id", () => {
        return request(app)
          .delete("/api/events/sillySausages")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("event_id must be a positive integer");
          });
      });
    });
  });
});

describe("Initial Endpoint Error Handling", () => {
  it("status: 404, Not Found", () => {
    return request(app)
      .get("/api/bananas")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});
