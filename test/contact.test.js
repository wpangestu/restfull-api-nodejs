import {createTestUser, removeAllTestContact, removeTestUser} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";

describe("POST /api/contact", function (){

    beforeEach(async ()=>{
        await createTestUser();
    });

    afterEach(async ()=>{
       await removeAllTestContact();
       await removeTestUser();
    });

    it("it should can create contact", async ()=>{
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization","test")
            .send({
                first_name:"test",
                last_name:"test",
                email:"test@testmail.com",
                phone:"084123123123"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe("test");
        expect(result.body.data.last_name).toBe("test");
        expect(result.body.data.email).toBe("test@testmail.com");
        expect(result.body.data.phone).toBe("084123123123");

    });

    it("it should rejected create contact", async ()=>{
        const result = await supertest(web)
            .post("/api/contacts")
            .set("Authorization","test")
            .send({
                first_name:"",
                last_name:"test",
                email:"test@testmail.com",
                phone:"0841231231233123131231312312312312312312312312313123123"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });


})