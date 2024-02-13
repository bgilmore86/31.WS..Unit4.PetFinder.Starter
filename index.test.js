const request = require("supertest");

const app = require("./index");

describe("GET /api/v1/pets", () => {
  test("test to return all pets", async () => {
    const response = await request(app).get("/api/v1/pets");
    expect(Array.isArray(response.body)).toBeTruthy();
  });
});

describe("GET /api/v1/pets/:name", () => {
  test("test should return pet by name", async () => {
    const name = "Rover";
    const response = await request(app).get(`/api/v1/pets/${name}`);
    expect(response.body.name).toBe(name);
  });

  test("test should return pet by name case-insensitively", async () => {
    const name = "Rover";
    const response = await request(app).get(`/api/v1/pets/${name}`);

    //regular expression with the i flag to match the name
    expect(response.body.name).toMatch(new RegExp(name, "i"));
  });
});

describe("GET /api/v1/pets/owner/:ownername", () => {
  test("test should return pets by owner name", async () => {
    const ownerName = "John";
    const response = await request(app).get(`/api/v1/pets/owner/${ownerName}`);

    //looking for an array of info to display at endpoint
    expect(Array.isArray(response.body)).toBeTruthy();
    response.body.forEach((pet) => {
      expect(pet.ownername).toBe(ownerName);
    });
  });

  test("should ignore case sensitivity when matching owner name", async () => {
    const owner = "John";
    const response = await request(app).get(
      "/api/v1/pets/owner?owner=" + owner.toLowerCase()
    );
    expect(response.body.owner).toBe(owner);
  });
});

describe("GET /", () => {
  test("test will return homepage", async () => {
    const response = await request(app).get("/");
    expect(response.text).toContain("Welcome to my pet app!");
  });
});

describe("GET /api/v1/pets/:name", () => {
  test("should return error if no pet found with name", async () => {
    const name = "Nobody";
    const response = await request(app).get("/api/v1/pets/" + name);
    expect(response.statusCode).toBe(201);
  });

  test("should ignore case sensitivity when matching pet name", async () => {
    const name = "Rover";
    const response = await request(app).get(
      "/api/v1/pets/" + name.toLowerCase()
    );
    expect(response.body.name).toBe(name);
  });
});
