const server = require("./server");
const request = require("supertest");
let idToDelete;
const cohortToCreate = {
  cohortSlug: `testcaseft-ux-berlin-2024-06-20`,
  cohortName: "FT UX BERLIN 2024 06 ",
  program: "UX/UI",
  format: "Full Time",
  campus: "Paris",
  startDate: "2023-06-20T00:00:00.000Z",
  endDate: "2024-10-01T00:00:00.000Z",
  inProgress: true,
  programManager: "Mat",
  leadTeacher: "Josh",
  totalHours: 32,
};

describe("Test Api Cohorts", function () {
  before(async function () {
    const chai = await import("chai");
    expect = chai.expect;
  });

  it("Should return an array of objects if not empty", function (done) {
    request("http://localhost:5005")
      .get("/api/cohorts")
      .end(function (err, res) {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an("array");
        if (res.body.length >= 1) {
          for (i = 0; i < res.body.length; i += 1) {
            expect(res.body[i]).to.be.an("object");
          }
        }
        done();
      });
  });

  it("Should return the created cohort", function (done) {
    request("http://localhost:5005")
      .post("/api/cohorts")
      .send(cohortToCreate)
      .end(function (err, res) {
        expect(res.status).to.equal(201);
        expect(res.body).to.be.an("object");
        expect(res.body).to.include(cohortToCreate);
        idToDelete = res.body._id;
        done();
      });
  });

  it("Should delete the created cohort and return 204", function (done) {
    request("http://localhost:5005")
      .delete(`/api/cohorts/${idToDelete}`)
      .end(function (err, res) {
        expect(res.status).to.equal(204);
        done();
      });
  });
});
